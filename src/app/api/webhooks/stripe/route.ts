import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { stripe } from '@/lib/stripe/client';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { subscribeOrUpdateMailchimpMember } from '@/lib/mailchimp';
import { sendServerPurchaseEvent } from '@/lib/metaCapi';

export async function POST(request: Request) {
  const body = await request.text();
  const signature = request.headers.get('stripe-signature');

  if (!signature) {
    return NextResponse.json({ error: 'Signature Stripe manquante' }, { status: 400 });
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : 'Erreur inconnue';
    console.error('Erreur signature Webhook Stripe:', message);
    return NextResponse.json({ error: `Webhook Error: ${message}` }, { status: 400 });
  }

  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const customerEmail = session.customer_details?.email;
    const productId = session.metadata?.productId;

    if (!customerEmail || !productId) {
      return NextResponse.json({ error: 'Metadata produit ou email manquants' }, { status: 400 });
    }

    try {
      // 1. Récupération ou création du compte utilisateur Supabase Auth
      let userId = session.metadata?.userId;

      if (!userId) {
        const { data: usersData } = await supabaseAdmin.auth.admin.listUsers();
        const existingUser = usersData.users.find(u => u.email === customerEmail);

        if (existingUser) {
          userId = existingUser.id;
        } else {
          // Création auto d'un compte client
          const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
            email: customerEmail,
            email_confirm: true,
          });

          if (createError) {
            console.error('Erreur création utilisateur Supabase:', createError);
            throw createError;
          }
          userId = newUser.user.id;
        }
      }

      // 2. Assurer la présence de l'entrée profile
      await supabaseAdmin.from('profiles').upsert({
        id: userId,
        email: customerEmail,
        full_name: session.customer_details?.name ?? null,
      });

      // 3. Enregistrement de la commande dans la table `orders`
      const amountEur = (session.amount_total ?? 0) / 100;
      const { data: order, error: orderError } = await supabaseAdmin
        .from('orders')
        .insert({
          user_id: userId,
          customer_email: customerEmail,
          product_id: productId,
          stripe_session_id: session.id,
          stripe_payment_intent_id: session.payment_intent as string,
          amount: amountEur,
          currency: session.currency || 'eur',
          status: 'paid'
        })
        .select('id')
        .single();

      if (orderError) {
        console.error('Erreur insertion commande:', orderError);
      }

      // 3.b Enregistrement dans `enrollments`
      try {
        await supabaseAdmin.from('enrollments').insert({
          user_id: userId,
          user_email: customerEmail,
          product_id: productId,
          course_id: productId,
          item_title: (session as unknown as { description?: string }).description || 'Produit Digital',
          item_type: 'ebook',
          price: amountEur,
          stripe_session_id: session.id
        });
      } catch (e) {
        console.warn('Webhook enrollments insert fallback', e);
      }

      // 4. Récupérer le produit pour vérifier s'il s'agit d'une précommande (V2)
      const { data: product } = await supabaseAdmin
        .from('products')
        .select('is_preorder, release_date')
        .eq('id', productId)
        .single();

      const availableFrom = (product?.is_preorder && product?.release_date)
        ? product.release_date
        : new Date().toISOString();

      // 5. Attribution des droits d'accès dans `user_access` et `enrollments`
      const productsToGrant = productId.includes('bundle') 
        ? [productId, 'formation-wordpress', 'formation-ajouter-une-boutique-en-ligne-avec-woocommerce']
        : [productId];

      for (const pId of productsToGrant) {
        try {
          await supabaseAdmin.from('enrollments').insert({
            user_id: userId,
            user_email: customerEmail,
            product_id: pId,
            course_id: pId,
            item_title: pId,
            item_type: 'formation',
            price: amountEur,
            stripe_session_id: session.id
          });
        } catch (e) {}

        const { error: accessError } = await supabaseAdmin
          .from('user_access')
          .upsert({
            user_id: userId,
            product_id: pId,
            order_id: order?.id,
            available_from: availableFrom,
          });

        if (accessError) {
          console.error(`Erreur attribution accès pour ${pId}:`, accessError);
        }
      }

      console.log(`[Stripe Webhook] Accès attribués à l'utilisateur ${userId} pour les produits: ${productsToGrant.join(', ')}`);

        // 7. Envoi de l'événement d'achat serveur (Meta CAPI) non-bloquant
        try {
          await sendServerPurchaseEvent({
            email: customerEmail,
            value: amountEur,
            currency: session.currency || 'EUR',
            orderId: order?.id || session.id,
          });
        } catch (capiErr) {
          console.error('[Stripe Webhook] Erreur Meta CAPI non-bloquante:', capiErr);
        }
      } catch (err: unknown) {
      console.error('Erreur traitement Webhook:', err);
      return NextResponse.json({ error: 'Erreur interne Webhook' }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}

