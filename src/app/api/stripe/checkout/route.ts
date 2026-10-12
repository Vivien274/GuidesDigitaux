import { NextResponse } from 'next/server';
import Stripe from 'stripe';
import { DEFAULT_PRODUCTS } from '@/data/defaultProducts';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    let items = body.items;
    const courseId = body.courseId || body.productId || 'formation-wordpress';
    const matchedProduct = DEFAULT_PRODUCTS.find(p => p.id === courseId || p.slug === courseId || p.id === body.productId);
    const paymentOption = body.paymentOption || (body.price === 87 || body.price === 75 || body.price === 225 || body.price === 261 ? '3x' : '1x');
    const is3x = paymentOption === '3x' || Number(body.price) === 87 || Number(body.price) === 75 || Number(body.price) === 225;
    const rawPrice = body.price ? Number(body.price) : (is3x ? 75 : (matchedProduct?.price || 199));
    const finalPrice = (body.discountedPrice && Number(body.discountedPrice) > 0) ? Number(body.discountedPrice) : Number(rawPrice);
    
    // For 3x option, ensure the amount charged immediately is the 1st installment (e.g. 75 € instead of total 225 €)
    const effectivePrice = is3x
      ? (finalPrice === 225 || finalPrice === 75 ? 75 : (finalPrice === 261 || finalPrice === 87 ? 87 : (finalPrice > 100 ? Math.round(finalPrice / 3) : finalPrice)))
      : finalPrice;
    const price = effectivePrice;
    
    let baseTitle = body.courseTitle || body.title || matchedProduct?.title || 'Formation Vidéo : Créer sa vitrine en ligne avec WordPress';
    baseTitle = baseTitle.replace(/\s*\(Option 3x[^)]*\)/gi, '').replace(/\s*\(Paiement 3x[^)]*\)/gi, '').trim();

    const courseTitle = is3x 
      ? `${baseTitle} (Option 3x : 1ʳᵉ mensualité de ${price} €)`
      : baseTitle;
    const isPreorder = body.isPreorder || false;
    const releaseDate = body.releaseDate || '15 septembre 2026';
    const customerEmail = body.customerEmail;

    const secretKey = process.env.STRIPE_SECRET_KEY?.trim() || '';

    const hasRealStripeKey = (secretKey.startsWith('sk_test_') || secretKey.startsWith('sk_live_')) && secretKey.length > 20;
    const requestOrigin = request.headers.get('origin') || request.headers.get('referer');
    let originUrl: string | null = null;
    if (requestOrigin) {
      try {
        originUrl = new URL(requestOrigin).origin;
      } catch (e) {}
    }
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || originUrl || 'https://www.guides-digitaux.com';

    const hasOrderBump = body.hasOrderBump === true || body.hasOrderBump === 'true';
    if ((!items || items.length === 0) && hasOrderBump && (courseId === 'formation-fiche-google' || courseId.includes('fiche-google'))) {
      items = [
        {
          id: 'formation-fiche-google',
          title: 'Cap Visibilité Google : Le GPS pour Artisans & Créateurs',
          price: 29,
          quantity: 1,
          type: 'formation'
        },
        {
          id: 'kit-serenite',
          title: 'Le Kit Sérénité : 52 Idées de Posts Google & Prompts IA (Order Bump)',
          price: 9,
          quantity: 1,
          type: 'ebook',
          downloadPdf: '/downloads/kit-serenite-52-posts-google-prompts-ia.pdf'
        }
      ];
    }

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
              description: is3x ? `1ʳᵉ mensualité de ${price} € réglée aujourd'hui (Paiement en 3 fois sans frais : 3 × ${price} € = ${price * 3} €)` : (isPreorder ? `🚀 Précommande exclusive - Sortie le ${releaseDate}` : 'Formation Vidéo Guides Digitaux'),
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

      const utmObj = body.utm || {};
      const sessionMetadata: Record<string, string> = {
        courseId: Array.isArray(items) && items.length > 0 ? 'cart_items' : (courseId || ''),
        productId: Array.isArray(items) && items.length > 0 ? 'cart_items' : (courseId || ''),
        isPreorder: isPreorder ? 'true' : 'false',
        releaseDate: releaseDate || '',
        hasOrderBump: hasOrderBump ? 'true' : 'false',
        orderbump: hasOrderBump ? '1' : '0',
        orderBumpType: hasOrderBump ? 'kit-serenite' : '',
        newsletterOptIn: body.newsletterOptIn ? 'true' : 'false',
        utm_source: String(body.utm_source || utmObj.utm_source || '').substring(0, 100),
        utm_medium: String(body.utm_medium || utmObj.utm_medium || '').substring(0, 100),
        utm_campaign: String(body.utm_campaign || utmObj.utm_campaign || '').substring(0, 100),
        utm_content: String(body.utm_content || utmObj.utm_content || '').substring(0, 100),
        utm_term: String(body.utm_term || utmObj.utm_term || '').substring(0, 100),
        fbclid: String(body.fbclid || utmObj.fbclid || '').substring(0, 150),
        gclid: String(body.gclid || utmObj.gclid || '').substring(0, 150),
        cartItemsJson: Array.isArray(items) && items.length > 0
          ? JSON.stringify(items.map((it: any) => ({
              id: it.id,
              title: it.title,
              price: Number(it.price || it.originalPrice || 0),
              quantity: it.quantity || 1,
              downloadPdf: it.downloadPdf || undefined
            })))
          : ''
      };

      if (body.embedded) {
        const session = await stripe.checkout.sessions.create({
          ui_mode: 'embedded' as any,
          payment_method_types: is3x ? ['card', 'klarna'] : ['card'],
          customer_email: customerEmail ? customerEmail.toLowerCase().trim() : undefined,
          line_items: lineItems,
          mode: 'payment',
          allow_promotion_codes: true,
          return_url: resolvedSuccessUrl.includes('{CHECKOUT_SESSION_ID}') ? resolvedSuccessUrl : `${siteUrl}/tunnel/confirmation?session_id={CHECKOUT_SESSION_ID}&productId=${courseId || 'formation-fiche-google'}`,
          metadata: sessionMetadata,
        });

        return NextResponse.json({ 
          clientSecret: session.client_secret, 
          sessionId: session.id,
          url: session.url,
          mode: 'live_stripe_embedded' 
        });
      }

      const session = await stripe.checkout.sessions.create({
        payment_method_types: is3x ? ['card', 'klarna'] : ['card'],
        customer_email: customerEmail ? customerEmail.toLowerCase().trim() : undefined,
        line_items: lineItems,
        mode: 'payment',
        allow_promotion_codes: true,
        success_url: resolvedSuccessUrl,
        cancel_url: resolvedCancelUrl,
        metadata: sessionMetadata,
      });

      return NextResponse.json({ url: session.url, sessionId: session.id, mode: 'live_stripe' });
    }

    if (process.env.NODE_ENV === 'production') {
      return NextResponse.json({ error: 'Service de paiement indisponible.' }, { status: 503 });
    }

    // 2. Development-only fallback without a Stripe key.
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
