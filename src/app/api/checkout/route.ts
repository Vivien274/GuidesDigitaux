import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/client';
import { createClient } from '@/lib/supabase/server';
import { DEFAULT_PRODUCTS } from '@/data/defaultProducts';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const productId = body.productId || body.id || body.courseId;

    if (!productId) {
      return NextResponse.json({ error: 'ID du produit manquant' }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // 1. Récupérer le produit en base de données ou fallback static
    let targetProduct: any = null;
    const { data: product } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .single();

    if (product) {
      targetProduct = {
        id: product.id,
        title: product.title,
        slug: product.slug,
        description: product.description,
        price_cents: product.price_cents || Math.round((product.price || 199) * 100),
        currency: product.currency || 'eur'
      };
    } else {
      const fallback = DEFAULT_PRODUCTS.find(p => p.id === productId || p.slug === productId);
      if (fallback) {
        targetProduct = {
          id: fallback.id,
          title: fallback.title,
          slug: fallback.slug,
          description: fallback.description,
          price_cents: Math.round(fallback.price * 100),
          currency: 'eur'
        };
      }
    }

    if (!targetProduct) {
      return NextResponse.json({ error: 'Produit introuvable' }, { status: 404 });
    }

    const requestOrigin = request.headers.get('origin') || request.headers.get('referer');
    let originUrl: string | null = null;
    if (requestOrigin) {
      try {
        originUrl = new URL(requestOrigin).origin;
      } catch (e) {}
    }
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || originUrl || 'https://www.guides-digitaux.com';

    const refererHeader = request.headers.get('referer');
    const resolvedCancelUrl = (refererHeader && refererHeader.startsWith('http'))
      ? refererHeader
      : `${siteUrl}/produit/${targetProduct.slug}?canceled=true`;

    // 2. Création de la session Stripe Checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: user?.email ?? undefined,
      line_items: [
        {
          price_data: {
            currency: targetProduct.currency || 'eur',
            product_data: {
              name: targetProduct.title,
              description: targetProduct.description || undefined,
            },
            unit_amount: targetProduct.price_cents,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      invoice_creation: { enabled: true },
      success_url: `${siteUrl}/tunnel/confirmation?id=${targetProduct.id}&session_id={CHECKOUT_SESSION_ID}&price=${Math.round(targetProduct.price_cents / 100)}`,
      cancel_url: resolvedCancelUrl,
      metadata: {
        productId: targetProduct.id,
        courseId: targetProduct.id,
        userId: user?.id ?? '',
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error('Erreur Checkout Stripe:', err);
    return NextResponse.json({ error: err.message || 'Erreur serveur' }, { status: 500 });
  }
}
