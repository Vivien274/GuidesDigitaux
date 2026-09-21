import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';
import Stripe from 'stripe';
import { DEFAULT_PRODUCTS } from '@/data/defaultProducts';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://kvnvfsahoblmcpurnmtn.supabase.co';
const supabaseKey = (process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.SUPABASE_SERVICE_ROLE_KEY.trim()) 
  ? process.env.SUPABASE_SERVICE_ROLE_KEY 
  : (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_KeSeRmMGA6zii9el1d_uBQ_piquLdfi');

const supabaseServer = createClient(supabaseUrl, supabaseKey);

export async function GET() {
  try {
    const accountsMap = new Map<string, {
      id: string;
      name: string;
      email: string;
      role: 'superadmin' | 'formateur' | 'eleve';
      purchasesCount: number;
      totalSpent: number;
      purchasesDetails: any[];
    }>();

    // Default known profiles fallback
    const defaultKnownEmails = [
      { email: 'vivien274@gmail.com', name: 'Vivien', role: 'superadmin' as const },
      { email: 'contact@guides-digitaux.com', name: 'Guides Digitaux Contact', role: 'superadmin' as const },
      { email: 'stephanie@guides-digitaux.com', name: 'Stéphanie ROCQ', role: 'superadmin' as const },
      { email: 'contact@spoolio.fr', name: 'Formateur Spoolio', role: 'formateur' as const }
    ];

    defaultKnownEmails.forEach(k => {
      accountsMap.set(k.email, {
        id: `known_${k.email}`,
        name: k.name,
        email: k.email,
        role: k.role,
        purchasesCount: 0,
        totalSpent: 0,
        purchasesDetails: []
      });
    });

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

    // 1.5. Synchronisation de réconciliation avec Stripe Checkout Sessions (rattrapage automatique)
    try {
      const secretKey = (process.env.STRIPE_SECRET_KEY && !process.env.STRIPE_SECRET_KEY.includes('...'))
        ? process.env.STRIPE_SECRET_KEY 
        : null;

      if (secretKey) {
        const stripe = new Stripe(secretKey);
        const stripeSessions = await stripe.checkout.sessions.list({ limit: 40 });

        for (const session of stripeSessions.data) {
          if (session.payment_status === 'paid') {
            const customerEmail = (session.customer_details?.email || session.customer_email || '').toLowerCase().trim();
            const productId = session.metadata?.productId || session.metadata?.courseId || 'formation-fiche-google';
            const amountEur = (session.amount_total ?? 0) / 100;

            if (customerEmail && productId) {
              const { data: existingOrd } = await supabaseServer
                .from('orders')
                .select('id')
                .eq('stripe_session_id', session.id)
                .maybeSingle();

              if (!existingOrd) {
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
                    await supabaseServer.from('orders').insert({
                      customer_email: customerEmail,
                      product_id: pId,
                      stripe_session_id: `${session.id}_${pId}`,
                      stripe_payment_intent_id: typeof session.payment_intent === 'string' ? session.payment_intent : null,
                      amount: itemPrice,
                      currency: session.currency || 'eur',
                      status: 'paid'
                    });
                  }
                } else {
                  await supabaseServer.from('orders').insert({
                    customer_email: customerEmail,
                    product_id: productId,
                    stripe_session_id: session.id,
                    stripe_payment_intent_id: typeof session.payment_intent === 'string' ? session.payment_intent : null,
                    amount: amountEur,
                    currency: session.currency || 'eur',
                    status: 'paid'
                  });
                }
                console.log(`[Dashboard Stats] Synchronisation réussie de la commande Stripe ${session.id} pour ${customerEmail}`);
              }
            }
          }
        }
      }
    } catch (stripeSyncErr) {
      console.warn('[Dashboard Stats] Stripe sync notice:', stripeSyncErr);
    }

    // 2. Fetch orders
    const { data: orders } = await supabaseServer.from('orders').select('*').order('created_at', { ascending: false });
    if (orders && Array.isArray(orders)) {
      orders.forEach((ord: any) => {
        const em = (ord.customer_email || ord.user_email || '').toLowerCase().trim();
        const rawPrice = ord.amount ? Number(ord.amount) : (ord.total_amount_cents ? ord.total_amount_cents / 100 : 0);
        const prodInfo = resolveProductInfo(ord.product_id, rawPrice);

        totalOrdersCount += 1;
        totalRevenue += prodInfo.price;

        const purchaseDetail = {
          id: ord.id || `ord_${Date.now()}`,
          title: prodInfo.title,
          price: prodInfo.price,
          date: ord.created_at || new Date().toISOString(),
          type: prodInfo.type,
          slug: ord.product_id,
          downloadPdf: prodInfo.downloadPdf
        };

        allOrdersList.push({
          id: ord.id,
          customerEmail: em,
          productId: ord.product_id,
          productTitle: prodInfo.title,
          amount: prodInfo.price,
          currency: ord.currency || 'eur',
          status: ord.status || 'paid',
          stripeSessionId: ord.stripe_session_id,
          createdAt: ord.created_at
        });

        if (em) {
          const existing = accountsMap.get(em);
          if (existing) {
            existing.purchasesCount += 1;
            existing.totalSpent += prodInfo.price;
            existing.purchasesDetails.push(purchaseDetail);
          } else {
            accountsMap.set(em, {
              id: ord.id || `o_${Date.now()}`,
              name: em.split('@')[0],
              email: em,
              role: 'eleve',
              purchasesCount: 1,
              totalSpent: prodInfo.price,
              purchasesDetails: [purchaseDetail]
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

        if (em) {
          const existing = accountsMap.get(em);
          const detailItem = {
            id: enr.id || `enr_${Date.now()}`,
            title: enr.item_title || prodInfo.title,
            price: prodInfo.price,
            date: enr.enrolled_at || enr.created_at || new Date().toISOString(),
            type: enr.item_type || prodInfo.type,
            slug: enr.course_id || enr.product_id,
            downloadPdf: prodInfo.downloadPdf
          };

          if (existing) {
            if (!existing.purchasesDetails.some(d => d.title === detailItem.title || d.id === detailItem.id)) {
              existing.purchasesCount += 1;
              existing.totalSpent += prodInfo.price;
              existing.purchasesDetails.push(detailItem);
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
              purchasesDetails: [detailItem]
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

        if (em) {
          const existing = accountsMap.get(em);
          if (existing) {
            if (!existing.purchasesDetails.some(d => d.title === detailItem.title || d.id === detailItem.id)) {
              existing.purchasesCount += 1;
              existing.totalSpent += price;
              existing.purchasesDetails.push(detailItem);
              totalOrdersCount += 1;
              totalRevenue += price;
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
            totalOrdersCount += 1;
            totalRevenue += price;
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
