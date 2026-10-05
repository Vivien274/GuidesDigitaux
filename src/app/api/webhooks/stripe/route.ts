import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { stripe } from '@/lib/stripe/client';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { subscribeOrUpdateMailchimpMember } from '@/lib/mailchimp';
import { sendServerPurchaseEvent } from '@/lib/metaCapi';
import { processOrderEmails } from '@/lib/orderEmailService';
import { DEFAULT_PRODUCTS } from '@/data/defaultProducts';

const COURSE_IDS_BY_PRODUCT: Record<string, string[]> = {
  'formation-fiche-google': [
    '17873181-7987-4000-a000-000000000000',
    '33333333-3333-4333-a333-333333333333',
  ],
  'precommande-fiche-google': [
    '17873181-7987-4000-a000-000000000000',
    '33333333-3333-4333-a333-333333333333',
  ],
  'formation-wordpress': ['11111111-1111-4111-a111-111111111111'],
  'creer-sa-vitrine-wordpress': ['11111111-1111-4111-a111-111111111111'],
  'formation-ajouter-une-boutique-en-ligne-avec-woocommerce': ['22222222-2222-4222-a222-222222222222'],
  'formation-woocommerce': ['22222222-2222-4222-a222-222222222222'],
};

async function grantCourseEnrollment(
  userId: string | null,
  customerEmail: string,
  productId: string,
  price: number,
): Promise<void> {
  if (!userId) return;

  const candidateCourseIds = COURSE_IDS_BY_PRODUCT[productId] || [];
  if (candidateCourseIds.length === 0) return;

  const { data: courses, error: courseError } = await supabaseAdmin
    .from('courses')
    .select('id')
    .in('id', candidateCourseIds)
    .limit(1);
  if (courseError) throw courseError;

  const courseId = courses?.[0]?.id;
  if (!courseId) return;

  const { data: existingEnrollment, error: lookupError } = await supabaseAdmin
    .from('enrollments')
    .select('id')
    .eq('user_id', userId)
    .eq('course_id', courseId)
    .maybeSingle();
  if (lookupError) throw lookupError;
  if (existingEnrollment) return;

  const product = DEFAULT_PRODUCTS.find(item => item.id === productId || item.slug === productId);
  const { error: enrollmentError } = await supabaseAdmin.from('enrollments').insert({
    user_id: userId,
    user_email: customerEmail,
    course_id: courseId,
    item_title: product?.title || productId,
    item_type: 'formation',
    download_pdf: product?.downloadPdf || null,
    price,
  });
  if (enrollmentError) throw enrollmentError;
}

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
    const customerEmail = (session.customer_details?.email || session.customer_email)?.toLowerCase().trim();
    const productId = session.metadata?.productId || session.metadata?.courseId;

    if (!customerEmail || !productId) {
      return NextResponse.json({ error: 'Metadata produit ou email manquants' }, { status: 400 });
    }

    try {
      // 1. Récupération ou création du compte utilisateur Supabase Auth (sécurisé)
      let userId = session.metadata?.userId;

      if (!userId) {
        try {
          const { data: usersData } = await supabaseAdmin.auth.admin.listUsers();
          const existingUser = usersData?.users?.find(u => u.email?.toLowerCase().trim() === customerEmail);

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

      const isValidUuid = (val?: string | null): boolean => 
        !!val && /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(val);
      const safeUserId: string | null = isValidUuid(userId) ? userId! : null;

      // 2. Assurer la présence de l'entrée profile si un UUID valide existe
      if (safeUserId) {
        try {
          await supabaseAdmin.from('profiles').upsert({
            id: safeUserId,
            email: customerEmail,
            full_name: session.customer_details?.name ?? null,
          });
        } catch (profileErr) {
          console.warn('[Stripe Webhook] Profile upsert notice:', profileErr);
        }
      }

      // 3. Enregistrement de la commande dans la table `orders`
      const amountEur = (session.amount_total ?? 0) / 100;
      let rawCartItems: any[] = [];
      if (session.metadata?.cartItemsJson) {
        try {
          rawCartItems = JSON.parse(session.metadata.cartItemsJson);
        } catch (e) {}
      }

      if ((!rawCartItems || rawCartItems.length === 0) && (session.metadata?.hasOrderBump === 'true' || session.metadata?.orderbump === '1')) {
        rawCartItems = [
          {
            id: 'formation-fiche-google',
            title: 'Cap Visibilité Google : Le GPS pour Artisans & Créateurs',
            price: 29
          },
          {
            id: 'kit-serenite',
            title: 'Le Kit Sérénité : 52 Idées de Posts Google & Prompts IA (Order Bump)',
            price: 9,
            downloadPdf: '/downloads/kit-serenite-52-posts-google-prompts-ia.pdf'
          }
        ];
      }

      if (Array.isArray(rawCartItems) && rawCartItems.length > 0) {
        for (const cartIt of rawCartItems) {
          const itemPrice = Number(cartIt.price) || 0;
          const pId = cartIt.id;
          const cartSessionId = `${session.id}_${pId}`;

          const { data: existingCartOrder } = await supabaseAdmin
            .from('orders')
            .select('id')
            .eq('stripe_session_id', cartSessionId)
            .maybeSingle();

          if (!existingCartOrder) {
            const { error: insErr } = await supabaseAdmin.from('orders').insert({
              user_id: safeUserId,
              customer_email: customerEmail,
              product_id: pId,
              stripe_session_id: cartSessionId,
              amount: itemPrice,
              currency: session.currency || 'eur',
              status: 'paid'
            });
            if (insErr) {
              console.error('[Stripe Webhook] Erreur insertion orders cart item:', insErr);
            }
          }

          // Expand bundles like pack-guides
          const matchedProd = DEFAULT_PRODUCTS.find(p => p.id === pId || p.slug === pId);
          const subItemsToGrant = matchedProd?.bundleProductIds && matchedProd.bundleProductIds.length > 0
            ? Array.from(new Set([pId, ...matchedProd.bundleProductIds]))
            : [pId];

          for (const subId of subItemsToGrant) {
            try {
              await grantCourseEnrollment(safeUserId, customerEmail, subId, itemPrice);
            } catch (enrollmentError) {
              console.error('[Stripe Webhook] Erreur attribution formation panier:', enrollmentError);
            }
          }
        }
      } else {
        const { data: existingOrder } = await supabaseAdmin
          .from('orders')
          .select('id')
          .eq('stripe_session_id', session.id)
          .maybeSingle();

        if (!existingOrder) {
          const { data: order, error: insErr } = await supabaseAdmin
            .from('orders')
            .insert({
              user_id: safeUserId,
              customer_email: customerEmail,
              product_id: productId,
              stripe_session_id: session.id,
              amount: amountEur,
              currency: session.currency || 'eur',
              status: 'paid'
            })
            .select('id')
            .single();

          if (insErr) {
            console.error('[Stripe Webhook] Erreur insertion order:', insErr);
          }
        } else {
          console.log(`[Stripe Webhook] Order with session ${session.id} already exists in DB. Skipping duplicate insert.`);
        }

        const targetProduct = DEFAULT_PRODUCTS.find(p => p.id === productId || p.slug === productId);
        const productsToGrant = targetProduct?.bundleProductIds && targetProduct.bundleProductIds.length > 0
          ? Array.from(new Set([productId, ...targetProduct.bundleProductIds]))
          : (productId.includes('bundle') 
              ? [productId, 'formation-wordpress', 'formation-ajouter-une-boutique-en-ligne-avec-woocommerce']
              : [productId]);

        for (const pId of productsToGrant) {
          try {
            await grantCourseEnrollment(safeUserId, customerEmail, pId, amountEur);
          } catch (enrollmentError) {
            console.error('[Stripe Webhook] Erreur attribution formation:', enrollmentError);
          }
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

      // 9. Synchronisation Mailchimp avec la liste des 13 Tags exacts existants
      try {
        const { PRODUCT_MAILCHIMP_TAGS, subscribeOrUpdateMailchimpMember } = await import('@/lib/mailchimp');
        const collectedTags = new Set<string>();

        // Tag client exact existant dans Mailchimp
        collectedTags.add('client');

        if (Array.isArray(rawCartItems) && rawCartItems.length > 0) {
          rawCartItems.forEach((it: any) => {
            const pId = it.id || it.productId || it.slug;
            const mapped = pId ? PRODUCT_MAILCHIMP_TAGS[pId] : null;
            if (mapped) {
              mapped.forEach(t => collectedTags.add(t));
            }
          });
        } else if (productId) {
          const mapped = PRODUCT_MAILCHIMP_TAGS[productId];
          if (mapped) {
            mapped.forEach(t => collectedTags.add(t));
          }
        }

        // Tag newsletter exact existant dans Mailchimp
        if (session.metadata?.newsletterOptIn === 'true') {
          collectedTags.add('newsletter');
        }

        // Tag kit-serenite si order bump ou produit kit-serenite acheté
        const hasKitSerenite = 
          session.metadata?.hasOrderBump === 'true' || 
          session.metadata?.orderbump === '1' || 
          session.metadata?.orderBumpType === 'kit-serenite' ||
          productId === 'kit-serenite' ||
          productId?.includes('serenite') ||
          rawCartItems?.some((it: any) => it.id === 'kit-serenite' || it.id?.includes('serenite'));

        if (hasKitSerenite) {
          collectedTags.add('kit-serenite');
        }

        // Tag calculateur-gmb uniquement si le calculateur de score a été acheté
        if (productId?.includes('calculateur') || rawCartItems?.some((it: any) => it.id?.includes('calculateur'))) {
          collectedTags.add('calculateur-gmb');
        }

        await subscribeOrUpdateMailchimpMember({
          email: customerEmail,
          fullName: session.customer_details?.name,
          tags: Array.from(collectedTags)
        });
      } catch (mcErr) {
        console.error('[Stripe Webhook] Notice synchronisation Mailchimp:', mcErr);
      }
    } catch (err: unknown) {
      console.error('Erreur traitement Webhook:', err);
      return NextResponse.json({ error: 'Erreur interne Webhook' }, { status: 500 });
    }
  }

  return NextResponse.json({ received: true });
}
