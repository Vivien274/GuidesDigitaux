import { NextRequest, NextResponse } from 'next/server';
import { verifySession } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { DEFAULT_PRODUCTS } from '@/data/defaultProducts';
import { getAllCatalogProductsAsPurchases, type EnrolledCourseItem } from '@/lib/userPurchasesStore';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const token = request.cookies.get('gd_session')?.value;
    if (!token) {
      return NextResponse.json({ success: false, error: 'Non authentifié', purchases: [] }, { status: 401 });
    }

    const session = await verifySession(token);
    if (!session || !session.email) {
      return NextResponse.json({ success: false, error: 'Session invalide ou expirée', purchases: [] }, { status: 401 });
    }

    const normalizedEmail = session.email.toLowerCase().trim();

    // 1. Super-Admin : Accès complet au catalogue
    if (session.role === 'superadmin') {
      const allPurchases = getAllCatalogProductsAsPurchases();
      return NextResponse.json({ success: true, purchases: allPurchases });
    }

    const purchasesMap = new Map<string, EnrolledCourseItem>();

    const addProductItem = (productId: string, price?: number, purchaseDate?: string, isPreorderProduct: boolean = false) => {
      if (!productId) return;
      const cleanId = productId.trim();

      // Check if product is in default catalog
      const matchedProd = DEFAULT_PRODUCTS.find(p => p.id === cleanId || p.slug === cleanId);

      // Expand bundles
      if (matchedProd?.bundleProductIds && matchedProd.bundleProductIds.length > 0) {
        for (const subId of matchedProd.bundleProductIds) {
          addProductItem(subId, 0, purchaseDate, false);
        }
      }

      const isGoogle = cleanId.includes('fiche-google') || cleanId.includes('google') || cleanId === '17873181-7987-4000-a000-000000000000' || cleanId === '33333333-3333-4333-a333-333333333333';
      const isCoaching = cleanId.includes('coaching') || matchedProd?.category === 'coaching';
      const isTool = cleanId.includes('calculateur') || cleanId.includes('orderbump');
      const isPdf = !isGoogle && !isCoaching && !isTool && (matchedProd?.category === 'ebook' || matchedProd?.category === 'checklist' || !!matchedProd?.downloadPdf || cleanId.includes('guide'));

      const targetTitle = matchedProd?.title || (isGoogle ? "Cap Visibilité Google : Le GPS pas-à-pas pour guider vos clients locaux jusqu'à votre atelier" : cleanId);
      const targetSlug = isGoogle ? 'formation-fiche-google' : (matchedProd?.slug || cleanId);
      const targetId = matchedProd?.id || cleanId;

      const key = targetSlug.toLowerCase();
      if (!purchasesMap.has(key)) {
        purchasesMap.set(key, {
          id: targetId,
          title: targetTitle,
          slug: targetSlug,
          type: isCoaching ? 'coaching' : (isTool ? 'tool' : (isPdf ? 'ebook' : 'formation')),
          typeLabel: isCoaching ? '🗓️ Coaching & Accompagnement' : (isTool ? '⚡ Outil d\'Audit & Calculateur' : (isPdf ? '📄 E-Book / Guide PDF' : 'Formation Vidéo')),
          thumbnail: matchedProd?.image || 'https://www.guides-digitaux.com/wp-content/uploads/2026/02/un-artisan-createur-devant-son-PC-en-train-dajouter-ses-produits-dnas-saboutique-en-ligne.-accoude-a-son-etabli-dans-son-atelier.-lumiere-naturelle.webp',
          progress: 0,
          completedLessons: 0,
          totalLessons: isPdf || isCoaching || isTool ? 0 : 7,
          duration: isPdf ? 'PDF' : (isCoaching ? '2 x 45 min' : (isTool ? 'En direct' : '2h15')),
          instructor: 'Stéphanie ROCQ',
          price: price !== undefined ? price : (matchedProd?.price ?? 0),
          purchaseDate: purchaseDate || new Date().toLocaleDateString('fr-FR'),
          downloadPdf: matchedProd?.downloadPdf,
          bookingUrl: matchedProd?.bookingUrl || 'https://calendar.app.google/A4SMq4zBbZYnnCr18',
          bundleProductIds: matchedProd?.bundleProductIds,
          productType: matchedProd?.productType,
          isPreorder: isPreorderProduct && !isGoogle
        });
      }
    };

    // 2. Fetch from orders table (Stripe paid checkout orders)
    try {
      const { data: ordersData, error: ordersErr } = await supabaseAdmin
        .from('orders')
        .select('*')
        .eq('customer_email', normalizedEmail);

      if (!ordersErr && Array.isArray(ordersData)) {
        for (const order of ordersData) {
          const isPaid = order.status === 'paid' || order.status === 'completed';
          if (isPaid && order.product_id) {
            const dateStr = order.created_at ? new Date(order.created_at).toLocaleDateString('fr-FR') : undefined;
            addProductItem(order.product_id, Number(order.amount) || 0, dateStr, false);
          }
        }
      }
    } catch (e) {
      console.warn('[User Purchases API] Notice querying orders:', e);
    }

    // 3. Fetch from enrollments table (Attributed courses)
    try {
      const hasValidUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(session.userId);
      const queries = [
        supabaseAdmin.from('enrollments').select('*').eq('user_email', normalizedEmail)
      ];
      if (hasValidUuid) {
        queries.push(supabaseAdmin.from('enrollments').select('*').eq('user_id', session.userId));
      }

      const results = await Promise.all(queries);
      for (const res of results) {
        if (!res.error && Array.isArray(res.data)) {
          for (const enroll of res.data) {
            const pId = enroll.course_id || enroll.product_id;
            if (pId) {
              const dateStr = enroll.enrolled_at || enroll.created_at ? new Date(enroll.enrolled_at || enroll.created_at).toLocaleDateString('fr-FR') : undefined;
              addProductItem(pId, Number(enroll.price) || 0, dateStr, false);
            }
          }
        }
      }
    } catch (e) {
      console.warn('[User Purchases API] Notice querying enrollments:', e);
    }

    // 4. Fetch from preorder_buyers table (Pre-orders)
    try {
      const { data: preordersData, error: poErr } = await supabaseAdmin
        .from('preorder_buyers')
        .select('*')
        .eq('customer_email', normalizedEmail);

      if (!poErr && Array.isArray(preordersData)) {
        for (const po of preordersData) {
          const campaignId = po.campaign_id || 'precommande-fiche-google';
          const dateStr = po.created_at ? new Date(po.created_at).toLocaleDateString('fr-FR') : undefined;
          addProductItem(campaignId, Number(po.price) || 29, dateStr, true);
        }
      }
    } catch (e) {
      console.warn('[User Purchases API] Notice querying preorder_buyers:', e);
    }

    const purchases = Array.from(purchasesMap.values());
    return NextResponse.json({ success: true, purchases });

  } catch (error: unknown) {
    console.error('[User Purchases API] Erreur serveur:', error);
    return NextResponse.json({ success: false, error: 'Erreur lors de la récupération des achats', purchases: [] }, { status: 500 });
  }
}
