import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { DEFAULT_PRODUCTS } from '@/data/defaultProducts';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const items = body.items;
    const courseId = body.courseId || body.productId || 'formation-wordpress';
    const matchedProduct = DEFAULT_PRODUCTS.find(p => p.id === courseId || p.slug === courseId || p.id === body.productId);
    const paymentOption = body.paymentOption || '1x';
    const is3x = paymentOption === '3x';
    const price = is3x ? 225 : (body.price || matchedProduct?.price || 199);
    const courseTitle = is3x 
      ? 'Formation Vidéo : Vitrine WordPress (Option 3x avec Klarna)' 
      : (body.courseTitle || body.title || matchedProduct?.title || 'Formation Vidéo : Créer sa vitrine en ligne avec WordPress');
    const isPreorder = body.isPreorder || false;
    const releaseDate = body.releaseDate || '15 septembre 2026';
    const customerEmail = body.customerEmail;

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
              description: is3x ? 'Paiement en 3 fois sans frais via Klarna (3 x 75 €)' : (isPreorder ? `🚀 Précommande exclusive - Sortie le ${releaseDate}` : 'Formation Vidéo Guides Digitaux'),
            },
            unit_amount: priceCents,
          },
          quantity: 1,
        },
      ];
    }

    const emailParam = customerEmail ? `&email=${encodeURIComponent(customerEmail.toLowerCase().trim())}` : '';

    // Dynamic resolution of Return / Cancel URL (prioritize HTTP Referer or custom cancelUrl over hardcoded defaults)
    const customCancelUrl = body.cancelUrl || body.cancel_url || body.returnUrl;
    const refererHeader = request.headers.get('referer');

    let resolvedCancelUrl: string;
    if (customCancelUrl && typeof customCancelUrl === 'string' && customCancelUrl.trim() !== '') {
      resolvedCancelUrl = customCancelUrl.startsWith('http') 
        ? customCancelUrl 
        : `${siteUrl}${customCancelUrl.startsWith('/') ? '' : '/'}${customCancelUrl}`;
    } else if (refererHeader && refererHeader.startsWith('http')) {
      resolvedCancelUrl = refererHeader;
    } else if (isPreorder && courseId) {
      resolvedCancelUrl = `${siteUrl}/tunnel/${courseId}`;
    } else if (courseId && courseId !== 'precommande-fiche-google') {
      resolvedCancelUrl = `${siteUrl}/produit/${courseId}?canceled=true`;
    } else {
      resolvedCancelUrl = `${siteUrl}/boutique?canceled=true`;
    }

    const customSuccessUrl = body.successUrl || body.success_url;
    let resolvedSuccessUrl: string;
    if (customSuccessUrl && typeof customSuccessUrl === 'string' && customSuccessUrl.trim() !== '') {
      resolvedSuccessUrl = customSuccessUrl.startsWith('http')
        ? customSuccessUrl
        : `${siteUrl}${customSuccessUrl.startsWith('/') ? '' : '/'}${customSuccessUrl}`;
    } else if (Array.isArray(items) && items.length > 0) {
      resolvedSuccessUrl = `${siteUrl}/tunnel/confirmation?session_id={CHECKOUT_SESSION_ID}&cart_checkout=true&price=${totalPriceSum}${emailParam}`;
    } else {
      resolvedSuccessUrl = `${siteUrl}/tunnel/confirmation?id=${courseId || 'precommande-fiche-google'}&session_id={CHECKOUT_SESSION_ID}&price=${price}${emailParam}`;
    }

    // 1. If real Stripe test key is configured in env, create real Stripe Checkout Session
    if (hasRealStripeKey) {
      const stripe = new Stripe(secretKey);
      const session = await stripe.checkout.sessions.create({
        payment_method_types: ['card', 'klarna'],
        customer_email: customerEmail ? customerEmail.toLowerCase().trim() : undefined,
        line_items: lineItems,
        mode: 'payment',
        success_url: resolvedSuccessUrl,
        cancel_url: resolvedCancelUrl,
        metadata: {
          courseId: Array.isArray(items) && items.length > 0 ? 'cart_items' : (courseId || ''),
          productId: Array.isArray(items) && items.length > 0 ? 'cart_items' : (courseId || ''),
          isPreorder: isPreorder ? 'true' : 'false',
          releaseDate: releaseDate || '',
          cartItemsJson: Array.isArray(items) && items.length > 0
            ? JSON.stringify(items.map((it: any) => ({
                id: it.id,
                title: it.title,
                price: Number(it.price || it.originalPrice || 0),
                quantity: it.quantity || 1
              })))
            : ''
        },
      });

      return NextResponse.json({ url: session.url, sessionId: session.id, mode: 'live_stripe' });
    }

    // 2. Fallback for test environment without key: simulated instant Stripe checkout test flow
    const testSessionId = `test_cs_${Date.now()}`;
    const simulatedUrl = Array.isArray(items) && items.length > 0
      ? `${siteUrl}/tunnel/confirmation?session_id=${testSessionId}&cart_checkout=true&price=${totalPriceSum}${emailParam}&test_mode=true`
      : `${siteUrl}/tunnel/confirmation?id=${courseId}&session_id=${testSessionId}&price=${price}${emailParam}&test_mode=true`;

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
