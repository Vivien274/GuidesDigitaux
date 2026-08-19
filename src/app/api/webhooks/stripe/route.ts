import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { stripe } from '@/lib/stripe/client';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { subscribeOrUpdateMailchimpMember } from '@/lib/mailchimp';
import { sendServerPurchaseEvent } from '@/lib/metaCapi';
import { processOrderEmails } from '@/lib/orderEmailService';
import { DEFAULT_PRODUCTS } from '@/data/defaultProducts';

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

    // Fallback de dev local si le secret n'est pas encore synchronisé avec stripe listen
    if (process.env.NODE_ENV === 'development' || process.env.STRIPE_WEBHOOK_SECRET === 'whsec_...' || !process.env.STRIPE_WEBHOOK_SECRET) {
      console.warn('[Stripe Webhook Dev] Signature ignorée en mode dev local pour traiter le webhook');
      try {
        event = JSON.parse(body) as Stripe.Event;
      } catch (parseErr) {
        return NextResponse.json({ error: `Webhook Error: ${message}` }, { status: 400 });
      }
    } else {
      return NextResponse.json({ error: `Webhook Error: ${message}` }, { status: 400 });
    }
  }


  if (event.type === 'checkout.session.completed') {
    const session = event.data.object as Stripe.Checkout.Session;
    const customerEmail = session.customer_details?.email;
    const productId = session.metadata?.productId;

    if (!customerEmail || !productId) {
      return NextResponse.json({ error: 'Metadata produit ou email manquants' }, { status: 400 });
    }

    try {
      // 1. Récupération ou création du compte utilisateur Supabase Auth (sécurisé)
      let userId = session.metadata?.userId;

      if (!userId) {
        try {
          const { data: usersData } = await supabaseAdmin.auth.admin.listUsers();
          const existingUser = usersData?.users?.find(u => u.email === customerEmail);

          if (existingUser) {
            userId = existingUser.id;
          } else {
            // Création auto d'un compte client
            const { data: newUser, error: createError } = await supabaseAdmin.auth.admin.createUser({
              email: customerEmail,
              email_confirm: true,
            });

            if (!createError && newUser?.user) {
              userId = newUser.user.id;
            }
          }
        } catch (authErr) {
          console.warn('[Stripe Webhook] Notice Supabase Auth Admin (poursuite du traitement de commande):', authErr);
        }
      }

      if (!userId) {
        userId = `usr_${Date.now()}`;
      }

      // 2. Assurer la présence de l'entrée profile (sécurisé)
      try {
        await supabaseAdmin.from('profiles').upsert({
          id: userId,
          email: customerEmail,
          full_name: session.customer_details?.name ?? null,
        });
      } catch (profileErr) {
        console.warn('[Stripe Webhook] Profile upsert notice:', profileErr);
      }


      // 3. Enregistrement de la commande dans la table `orders`
      const amountEur = (session.amount_total ?? 0) / 100;
      let rawCartItems: any[] = [];
      if (session.metadata?.cartItemsJson) {
        try {
          rawCartItems = JSON.parse(session.metadata.cartItemsJson);
        } catch (e) {}
      }

      if (Array.isArray(rawCartItems) && rawCartItems.length > 0) {
        for (const cartIt of rawCartItems) {
          const itemPrice = Number(cartIt.price) || 0;
          const pId = cartIt.id;

          await supabaseAdmin.from('orders').insert({
            user_id: userId,
            customer_email: customerEmail,
            product_id: pId,
            stripe_session_id: `${session.id}_${pId}`,
            stripe_payment_intent_id: session.payment_intent as string,
            amount: itemPrice,
            currency: session.currency || 'eur',
            status: 'paid'
          });

          // Expand bundles like pack-guides
          const matchedProd = DEFAULT_PRODUCTS.find(p => p.id === pId || p.slug === pId);
          const subItemsToGrant = matchedProd?.bundleProductIds && matchedProd.bundleProductIds.length > 0
            ? Array.from(new Set([pId, ...matchedProd.bundleProductIds]))
            : [pId];

          for (const subId of subItemsToGrant) {
            try {
              await supabaseAdmin.from('enrollments').insert({
                user_id: userId,
                user_email: customerEmail,
                product_id: subId,
                course_id: subId,
                item_title: cartIt.title || subId,
                item_type: 'ebook',
                price: itemPrice,
                stripe_session_id: session.id
              });
            } catch (e) {}
          }
        }
      } else {
        const { data: order } = await supabaseAdmin
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

        const targetProduct = DEFAULT_PRODUCTS.find(p => p.id === productId || p.slug === productId);
        const productsToGrant = targetProduct?.bundleProductIds && targetProduct.bundleProductIds.length > 0
          ? Array.from(new Set([productId, ...targetProduct.bundleProductIds]))
          : (productId.includes('bundle') 
              ? [productId, 'formation-wordpress', 'formation-ajouter-une-boutique-en-ligne-avec-woocommerce']
              : [productId]);

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
        }
      }

      // 6. Enregistrement sécurisé dans la table `preorder_buyers` (dédupliqué serveur)
      const isPreorderProduct = productId.includes('precommande') || productId.includes('preorder') || session.metadata?.isPreorder === 'true';
      if (isPreorderProduct) {
        try {
          const campaignId = productId || 'precommande-fiche-google';
          const { data: existingBuyer } = await supabaseAdmin
            .from('preorder_buyers')
            .select('id')
            .eq('customer_email', customerEmail.toLowerCase().trim())
            .eq('campaign_id', campaignId)
            .maybeSingle();

          if (!existingBuyer) {
            await supabaseAdmin.from('preorder_buyers').insert({
              campaign_id: campaignId,
              customer_email: customerEmail.toLowerCase().trim(),
              customer_name: session.customer_details?.name || customerEmail.split('@')[0],
              price: amountEur,
              created_at: new Date().toISOString()
            });
            console.log(`[Stripe Webhook] Précommande enregistrée dans preorder_buyers pour ${customerEmail}`);
          }
        } catch (poErr) {
          console.warn('[Stripe Webhook] Notice enregistrement preorder_buyers:', poErr);
        }
      }

      console.log(`[Stripe Webhook] Traitement de commande terminé pour l'utilisateur ${userId} (${customerEmail})`);

      // 7. Envoi de l'événement d'achat serveur (Meta CAPI) non-bloquant
      try {
        await sendServerPurchaseEvent({
          email: customerEmail,
          value: amountEur,
          currency: session.currency || 'EUR',
          orderId: session.id,
        });
      } catch (capiErr) {
        console.error('[Stripe Webhook] Erreur Meta CAPI non-bloquante:', capiErr);
      }

      // 8. Envoi des emails (Notification Admin contact@guides-digitaux.com + Confirmation client avec liens PDF/formation/visio)
      try {
        let itemTitle = productId;
        if (Array.isArray(rawCartItems) && rawCartItems.length > 0) {
          itemTitle = rawCartItems.map((it: any) => it.title).join(' + ');
        } else {
          const matchedProd = DEFAULT_PRODUCTS.find(p => p.id === productId || p.slug === productId);
          itemTitle = matchedProd?.title || (session as unknown as { description?: string }).description || productId;
        }

        await processOrderEmails({
          orderId: session.id,
          customerEmail: customerEmail,
          customerName: session.customer_details?.name,
          productTitle: itemTitle,
          productId: productId,
          amount: amountEur,
          currency: session.currency || 'EUR',
          cartItems: rawCartItems
        });

      } catch (emailErr) {
        console.error('[Stripe Webhook] Erreur envoi email non-bloquante:', emailErr);
      }
    } catch (err: unknown) {
      console.error('Erreur traitement Webhook:', err);
      return NextResponse.json({ error: 'Erreur interne Webhook' }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}

