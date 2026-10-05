import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { DEFAULT_PRODUCTS } from '@/data/defaultProducts';
import { getAdminSession } from '@/lib/routeAuth';
import { supabaseAdmin as supabaseServer } from '@/lib/supabase/admin';

export async function GET() {
  const adminSession = await getAdminSession();
  if (!adminSession) {
    return NextResponse.json({ error: 'Accès administrateur requis.' }, { status: 403 });
  }

  try {
    const accountsMap = new Map<string, {
      id: string;
      name: string;
      email: string;
      role: 'superadmin' | 'formateur' | 'eleve';
      purchasesCount: number;
      totalSpent: number;
      purchasesDetails: any[];
      utm?: any;
    }>();

    // 1. Fetch profiles safely (non-blocking if RLS recursion occurs)
    try {
      const { data: profiles } = await supabaseServer.from('profiles').select('*');
      if (profiles && Array.isArray(profiles)) {
        profiles.forEach((p: any) => {
          const em = p.email?.toLowerCase().trim();
          if (em) {
            const existing = accountsMap.get(em);
            if (existing) {
              existing.name = p.full_name || existing.name;
              existing.role = p.role || existing.role;
            } else {
              accountsMap.set(em, {
                id: p.id || `p_${Date.now()}`,
                name: p.full_name || em.split('@')[0],
                email: em,
                role: (p.role as 'superadmin' | 'formateur' | 'eleve') || 'eleve',
                purchasesCount: 0,
                totalSpent: 0,
                purchasesDetails: []
              });
            }
          }
        });
      }
    } catch (e) {
      console.warn('[Dashboard Stats] Profiles fetch notice:', e);
    }

    let totalRevenue = 0;
    let totalOrdersCount = 0;
    const allOrdersList: any[] = [];

    // Helper to resolve product info
    const resolveProductInfo = (productId?: string, fallbackPrice?: number) => {
      let price = fallbackPrice && fallbackPrice > 0 ? fallbackPrice : 0;
      let title = productId || 'Produit Digital';
      let type = 'ebook';
      let downloadPdf: string | undefined = undefined;

      if (productId) {
        const prod = DEFAULT_PRODUCTS.find(p => p.id === productId || p.slug === productId);
        if (prod) {
          title = prod.title;
          if (!price || price === 0) price = prod.price;
          type = prod.category || 'ebook';
          downloadPdf = prod.downloadPdf;
        }
      }
      return { title, price, type, downloadPdf };
    };

    const normalizeProductKey = (slugOrId?: string, title?: string) => {
      const s = (slugOrId || '').toLowerCase();
      const t = (title || '').toLowerCase();
      if (s.includes('fiche-google') || s.includes('precommande') || s.startsWith('po-') || t.includes('fiche google') || t.includes('visibilité google')) {
        return 'formation-fiche-google';
      }
      if (s.includes('kit-serenite') || t.includes('kit sérénité') || t.includes('kit serenite')) {
        return 'kit-serenite';
      }
      if (s.includes('wordpress') || t.includes('wordpress')) {
        return 'formation-wordpress';
      }
      return s || t || 'autre';
    };

    // 1.5. Synchronisation de réconciliation avec Stripe Checkout Sessions (rattrapage automatique)
    const sessionMetadataMap = new Map<string, any>();
    try {
      const secretKey = (process.env.STRIPE_SECRET_KEY && !process.env.STRIPE_SECRET_KEY.includes('...'))
        ? process.env.STRIPE_SECRET_KEY 
        : null;

      if (secretKey) {
        const stripe = new Stripe(secretKey);
        const stripeSessions = await stripe.checkout.sessions.list({ limit: 100 });

        for (const session of stripeSessions.data) {
          const meta = session.metadata || {};
          const utmData = {
            utm_source: meta.utm_source || (meta.fbclid ? 'facebook' : undefined),
            utm_medium: meta.utm_medium || (meta.fbclid ? 'cpc' : undefined),
            utm_campaign: meta.utm_campaign || undefined,
            utm_content: meta.utm_content || undefined,
            utm_term: meta.utm_term || undefined,
            fbclid: meta.fbclid || undefined,
            gclid: meta.gclid || undefined,
          };
          sessionMetadataMap.set(session.id, utmData);

          if (session.payment_status === 'paid') {
            const customerEmail = (session.customer_details?.email || session.customer_email || '').toLowerCase().trim();
            const productId = session.metadata?.productId || session.metadata?.courseId || 'formation-fiche-google';
            const amountEur = (session.amount_total ?? 0) / 100;
            const sessionDateIso = new Date(session.created * 1000).toISOString();

            const isPreorder =
              session.metadata?.isPreorder === 'true' ||
              productId.includes('precommande') ||
              productId.startsWith('po-') ||
              (session.metadata?.courseId || '').includes('precommande') ||
              (session.metadata?.courseId || '').startsWith('po-');

            if (customerEmail && productId) {
              if (isPreorder) {
                // Pour les précommandes : s'assurer qu'elles sont dans preorder_buyers et PAS en doublon dans orders
                const { data: existingPb } = await supabaseServer
                  .from('preorder_buyers')
                  .select('id')
                  .eq('customer_email', customerEmail)
                  .limit(1)
                  .maybeSingle();

                if (!existingPb) {
                  await supabaseServer.from('preorder_buyers').insert({
                    campaign_id: productId || 'precommande-fiche-google',
                    customer_email: customerEmail,
                    customer_name: session.customer_details?.name || customerEmail.split('@')[0],
                    price: amountEur,
                    created_at: sessionDateIso
                  });
                }

                // Supprimer tout doublon accidentel dans orders avec la date du jour
                await supabaseServer
                  .from('orders')
                  .delete()
                  .or(`stripe_session_id.eq.${session.id},stripe_session_id.like.${session.id}%`);
              } else {
                // Commandes standards
                const { data: existingOrd } = await supabaseServer
                  .from('orders')
                  .select('id, created_at')
                  .or(`stripe_session_id.eq.${session.id},stripe_session_id.like.${session.id}%`)
                  .limit(1)
                  .maybeSingle();

                if (!existingOrd) {
                  let rawCartItems: any[] = [];
                  if (session.metadata?.cartItemsJson) {
                    try {
                      rawCartItems = JSON.parse(session.metadata.cartItemsJson);
                    } catch (e) {}
                  }

                  const hasOrderBump = session.metadata?.hasOrderBump === 'true' || session.metadata?.orderbump === '1';
                  if ((!rawCartItems || rawCartItems.length === 0) && hasOrderBump) {
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
                      const cartSessId = `${session.id}_${pId}`;
                      sessionMetadataMap.set(cartSessId, utmData);
                      const { error: insCartErr } = await supabaseServer.from('orders').insert({
                        customer_email: customerEmail,
                        product_id: pId,
                        stripe_session_id: cartSessId,
                        amount: itemPrice,
                        currency: session.currency || 'eur',
                        status: 'paid',
                        created_at: sessionDateIso
                      });
                      if (insCartErr) {
                        console.error('[Dashboard Stats] Erreur insertion order cart:', insCartErr);
                      }
                    }
                  } else {
                    const { error: insSingleErr } = await supabaseServer.from('orders').insert({
                      customer_email: customerEmail,
                      product_id: productId,
                      stripe_session_id: session.id,
                      amount: amountEur,
                      currency: session.currency || 'eur',
                      status: 'paid',
                      created_at: sessionDateIso
                    });
                    if (insSingleErr) {
                      console.error('[Dashboard Stats] Erreur insertion order single:', insSingleErr);
                    }
                  }
                  console.log(`[Dashboard Stats] Synchronisation réussie de la commande Stripe ${session.id} pour ${customerEmail} (Date: ${sessionDateIso})`);
                } else {
                  // Mettre à jour la date réelle de création depuis Stripe si elle avait été enregistrée à la date du jour
                  await supabaseServer
                    .from('orders')
                    .update({ created_at: sessionDateIso })
                    .or(`stripe_session_id.eq.${session.id},stripe_session_id.like.${session.id}%`);
                }
              }

              // Update full_name in profile if missing or incomplete
              const customerName = session.customer_details?.name || null;
              if (customerName) {
                await supabaseServer.from('profiles').update({
                  full_name: customerName
                }).eq('email', customerEmail);
              }

              // Ensure course enrollment in LMS
              const isGoogle = productId.includes('fiche-google') || productId.includes('google');
              if (isGoogle) {
                const targetCourseId = '17873181-7987-4000-a000-000000000000';
                const { data: existingEnr } = await supabaseServer
                  .from('enrollments')
                  .select('id')
                  .eq('user_email', customerEmail)
                  .eq('course_id', targetCourseId)
                  .maybeSingle();

                if (!existingEnr) {
                  const { data: userProf } = await supabaseServer
                    .from('profiles')
                    .select('id')
                    .eq('email', customerEmail)
                    .maybeSingle();

                  await supabaseServer.from('enrollments').insert({
                    user_id: userProf?.id || null,
                    user_email: customerEmail,
                    course_id: targetCourseId,
                    item_title: 'Cap Visibilité Google : Le GPS pas-à-pas pour guider vos clients locaux jusqu\'à votre atelier',
                    item_type: 'formation',
                    price: 29
                  });
                }
              }
            }
          }
        }
      }
    } catch (stripeSyncErr) {
      console.warn('[Dashboard Stats] Stripe sync notice:', stripeSyncErr);
    }

    // Helper to resolve UTM attribution by session or user email
    const resolveUserUtm = (em: string, stripeSessionId?: string) => {
      const baseSessionId = (stripeSessionId || '').split('_')[0];
      const sessionUtm = sessionMetadataMap.get(stripeSessionId || '') || sessionMetadataMap.get(baseSessionId);
      if (sessionUtm && (sessionUtm.utm_source || sessionUtm.fbclid || sessionUtm.gclid)) {
        return sessionUtm;
      }

      return undefined;
    };

    // 2. Fetch orders
    const { data: orders } = await supabaseServer.from('orders').select('*').order('created_at', { ascending: false });
    if (orders && Array.isArray(orders)) {
      orders.forEach((ord: any) => {
        const em = (ord.customer_email || ord.user_email || '').toLowerCase().trim();
        const rawPrice = ord.amount ? Number(ord.amount) : (ord.total_amount_cents ? ord.total_amount_cents / 100 : 0);
        const prodInfo = resolveProductInfo(ord.product_id, rawPrice);
        const utmData = resolveUserUtm(em, ord.stripe_session_id);

        const purchaseDetail = {
          id: ord.id || `ord_${Date.now()}`,
          title: prodInfo.title,
          price: prodInfo.price,
          date: ord.created_at || new Date().toISOString(),
          type: prodInfo.type,
          slug: ord.product_id,
          downloadPdf: prodInfo.downloadPdf,
          utm: utmData
        };

        const isDuplicateOrder = allOrdersList.some(o => 
          (ord.stripe_session_id && o.stripeSessionId === ord.stripe_session_id) ||
          (o.id === ord.id)
        );

        if (!isDuplicateOrder) {
          totalOrdersCount += 1;
          totalRevenue += prodInfo.price;

          allOrdersList.push({
            id: ord.id,
            customerEmail: em,
            productId: ord.product_id,
            productTitle: prodInfo.title,
            amount: prodInfo.price,
            currency: ord.currency || 'eur',
            status: ord.status || 'paid',
            stripeSessionId: ord.stripe_session_id,
            createdAt: ord.created_at,
            utm: utmData
          });
        }

        if (em) {
          const existing = accountsMap.get(em);
          if (existing) {
            const alreadyHasDetail = existing.purchasesDetails.some(d => 
              d.id === purchaseDetail.id || 
              (purchaseDetail.slug && d.slug && d.slug === purchaseDetail.slug) ||
              (normalizeProductKey(d.slug, d.title) === normalizeProductKey(purchaseDetail.slug, purchaseDetail.title))
            );
            if (!alreadyHasDetail) {
              existing.purchasesCount += 1;
              existing.totalSpent += prodInfo.price;
              existing.purchasesDetails.push(purchaseDetail);
            }
            if (!existing.utm && utmData) existing.utm = utmData;
          } else {
            accountsMap.set(em, {
              id: ord.id || `o_${Date.now()}`,
              name: em.split('@')[0],
              email: em,
              role: 'eleve',
              purchasesCount: 1,
              totalSpent: prodInfo.price,
              purchasesDetails: [purchaseDetail],
              utm: utmData
            });
          }
        }
      });
    }

    // 3. Fetch enrollments
    const { data: enrollments } = await supabaseServer.from('enrollments').select('*');
    if (enrollments && Array.isArray(enrollments)) {
      enrollments.forEach((enr: any) => {
        const em = (enr.user_email || enr.email || enr.customer_email || '').toLowerCase().trim();
        const rawPrice = enr.price ? Number(enr.price) : 0;
        const prodInfo = resolveProductInfo(enr.product_id || enr.course_id, rawPrice);
        const utmData = resolveUserUtm(em, enr.stripe_session_id);

        if (em) {
          const existing = accountsMap.get(em);
          const detailItem = {
            id: enr.id || `enr_${Date.now()}`,
            title: enr.item_title || prodInfo.title,
            price: prodInfo.price,
            date: enr.enrolled_at || enr.created_at || new Date().toISOString(),
            type: enr.item_type || prodInfo.type,
            slug: enr.course_id || enr.product_id,
            downloadPdf: prodInfo.downloadPdf,
            utm: utmData
          };

          if (existing) {
            const alreadyEnrolled = existing.purchasesDetails.some(d => 
              d.id === detailItem.id ||
              normalizeProductKey(d.slug, d.title) === normalizeProductKey(detailItem.slug, detailItem.title)
            );
            if (!alreadyEnrolled) {
              existing.purchasesCount += 1;
              existing.totalSpent += prodInfo.price;
              existing.purchasesDetails.push(detailItem);
              if (!existing.utm && utmData) existing.utm = utmData;
              totalOrdersCount += 1;
              totalRevenue += prodInfo.price;
            }
          } else {
            accountsMap.set(em, {
              id: enr.id || `e_${Date.now()}`,
              name: em.split('@')[0],
              email: em,
              role: 'eleve',
              purchasesCount: 1,
              totalSpent: prodInfo.price,
              purchasesDetails: [detailItem],
              utm: utmData
            });
            totalOrdersCount += 1;
            totalRevenue += prodInfo.price;
          }
        }
      });
    }

    // 4. Fetch preorder_buyers table
    const { data: preorderBuyers } = await supabaseServer.from('preorder_buyers').select('*');
    if (preorderBuyers && Array.isArray(preorderBuyers)) {
      preorderBuyers.forEach((pb: any) => {
        const em = (pb.customer_email || pb.email || '').toLowerCase().trim();
        const price = pb.price ? Number(pb.price) : 29;
        const campaignId = pb.campaign_id || 'precommande-fiche-google';
        const prodInfo = resolveProductInfo(campaignId, price);
        const title = pb.course_title || prodInfo.title || 'Précommande Fiche Google';

        const detailItem = {
          id: pb.id || `pb_${Date.now()}`,
          title: title.includes('Précommande') ? title : `Précommande : ${title}`,
          price: price,
          date: pb.created_at || new Date().toISOString(),
          type: 'Précommande',
          slug: campaignId
        };

        const isAlreadyInAllOrders = allOrdersList.some(o => 
          (o.customerEmail || '').toLowerCase().trim() === em &&
          normalizeProductKey(o.productId, o.productTitle) === normalizeProductKey(campaignId, detailItem.title)
        );

        if (!isAlreadyInAllOrders) {
          totalOrdersCount += 1;
          totalRevenue += price;

          allOrdersList.push({
            id: pb.id,
            customerEmail: em,
            productId: campaignId,
            productTitle: detailItem.title,
            amount: price,
            currency: 'eur',
            status: 'paid',
            stripeSessionId: `pb_sess_${pb.id}`,
            createdAt: pb.created_at || new Date().toISOString()
          });
        }

        if (em) {
          const existing = accountsMap.get(em);
          if (existing) {
            const alreadyInPurchases = existing.purchasesDetails.some(d => 
              d.id === detailItem.id ||
              normalizeProductKey(d.slug, d.title) === normalizeProductKey(detailItem.slug, detailItem.title)
            );
            if (!alreadyInPurchases) {
              existing.purchasesCount += 1;
              existing.totalSpent += price;
              existing.purchasesDetails.push(detailItem);
            }
          } else {
            accountsMap.set(em, {
              id: pb.id || `pb_${Date.now()}`,
              name: pb.customer_name || em.split('@')[0],
              email: em,
              role: 'eleve',
              purchasesCount: 1,
              totalSpent: price,
              purchasesDetails: [detailItem]
            });
          }
        }
      });
    }

    const userList = Array.from(accountsMap.values());

    return NextResponse.json({
      usersList: userList,
      ordersList: allOrdersList,
      stats: {
        totalRevenue,
        totalMembers: userList.length,
        totalOrders: totalOrdersCount
      }
    });
  } catch (err: unknown) {
    const msg = err instanceof Error ? err.message : 'Unknown error';
    console.error('Error fetching admin dashboard stats:', msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
