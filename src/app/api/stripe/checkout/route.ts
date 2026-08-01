import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { 
      items,
      courseId = 'precommande-fiche-google',
      courseTitle = 'Fais décoller ton activité locale grâce à une Fiche Google parfaite',
      price = 29,
      isPreorder = false,
      releaseDate = '15 septembre 2026',
      customerEmail
    } = body;

    const secretKey = (process.env.STRIPE_SECRET_KEY && !process.env.STRIPE_SECRET_KEY.includes('...'))
      ? process.env.STRIPE_SECRET_KEY 
      : 'sk_test_51TAqk4D882WcsUbmbsySyL6DrZMMa6PPMsFdk2DJ9xa7iakf5XKBp9baIF69AsOxZE1ZWpfok6cZQxPbQQOYW6y500qA4E6NRT';

    const hasRealStripeKey = (secretKey.startsWith('sk_test_') || secretKey.startsWith('sk_live_')) && secretKey.length > 20;
    const requestOrigin = request.headers.get('origin') || request.headers.get('referer');
    let originUrl: string | null = null;
    if (requestOrigin) {
      try {
        originUrl = new URL(requestOrigin).origin;
      } catch (e) {}
    }
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || originUrl || 'https://www.guides-digitaux.com';

    let lineItems: any[] = [];
    let totalPriceSum = 0;

    if (Array.isArray(items) && items.length > 0) {
      lineItems = items.map((it: any) => {
        const itemPrice = Number(it.price || it.originalPrice || 29);
        totalPriceSum += itemPrice * (it.quantity || 1);
        return {
          price_data: {
            currency: 'eur',
            product_data: {
              name: it.title || 'Produit Guides Digitaux',
              description: it.type ? `Produit Digital (${it.type})` : 'Formation Vidéo / E-book Guides Digitaux',
            },
            unit_amount: Math.round(itemPrice * 100),
          },
          quantity: it.quantity || 1,
        };
      });
    } else {
      const priceCents = Math.round(Number(price) * 100);
      totalPriceSum = Number(price);
      lineItems = [
        {
          price_data: {
            currency: 'eur',
            product_data: {
              name: courseTitle,
              description: isPreorder ? `🚀 Précommande exclusive - Sortie le ${releaseDate}` : 'Formation Vidéo Guides Digitaux',
            },
            unit_amount: priceCents,
          },
          quantity: 1,
        },
      ];
    }

    // 1. If real Stripe test key is configured in env, create real Stripe Checkout Session
    if (hasRealStripeKey) {
      const stripe = new Stripe(secretKey);
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card'],
        line_items: lineItems,
        mode: 'payment',
        success_url: Array.isArray(items) && items.length > 0
          ? `${siteUrl}/tunnel/confirmation?session_id={CHECKOUT_SESSION_ID}&cart_checkout=true&price=${totalPriceSum}`
          : `${siteUrl}/tunnel/confirmation?id=${courseId}&session_id={CHECKOUT_SESSION_ID}&price=${price}`,
        cancel_url: (isPreorder || courseId)
          ? `${siteUrl}/tunnel/${courseId}`
          : `${siteUrl}/boutique?canceled=true`,
        metadata: {
          courseId: Array.isArray(items) && items.length > 0 ? 'cart_items' : courseId,
          isPreorder: isPreorder ? 'true' : 'false',
          releaseDate
        },
      });

      return NextResponse.json({ url: session.url, sessionId: session.id, mode: 'live_stripe' });
    }

    // 2. Fallback for test environment without key: simulated instant Stripe checkout test flow
    const testSessionId = `test_cs_${Date.now()}`;
    const simulatedUrl = Array.isArray(items) && items.length > 0
      ? `${siteUrl}/tunnel/confirmation?session_id=${testSessionId}&cart_checkout=true&price=${totalPriceSum}&test_mode=true`
      : `${siteUrl}/tunnel/confirmation?id=${courseId}&session_id=${testSessionId}&price=${price}&test_mode=true`;

    return NextResponse.json({ 
      url: simulatedUrl, 
      sessionId: testSessionId, 
      mode: 'simulated_test',
      message: 'Mode Test Stripe : Redirection automatique vers la confirmation' 
    });

  } catch (err: any) {
    console.error('Erreur API Stripe Checkout:', err);
    return NextResponse.json({ error: err.message || 'Erreur lors de la création de la session Stripe' }, { status: 500 });
  }
}
