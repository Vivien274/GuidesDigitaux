import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('session_id');

  if (!sessionId) {
    return NextResponse.json({ error: 'Missing session_id' }, { status: 400 });
  }

  const secretKey = process.env.STRIPE_SECRET_KEY?.trim();
  if (!secretKey || !secretKey.startsWith('sk_')) {
    return NextResponse.json({ error: 'Service de paiement indisponible.' }, { status: 503 });
  }

  try {
    const stripe = new Stripe(secretKey);
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    const email = session.customer_details?.email || session.customer_email || null;
    const courseId = session.metadata?.courseId || 'precommande-fiche-google';

    let cartItems: any[] = [];
    if (session.metadata?.cartItemsJson) {
      try {
        cartItems = JSON.parse(session.metadata.cartItemsJson);
      } catch (e) {}
    }

    const hasOrderBump = session.metadata?.hasOrderBump === 'true' || session.metadata?.orderbump === '1';
    if ((!cartItems || cartItems.length === 0) && hasOrderBump) {
      cartItems = [
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

    return NextResponse.json({
      sessionId: session.id,
      customerEmail: email,
      customerName: session.customer_details?.name || null,
      courseId,
      productId: session.metadata?.productId || courseId,
      cartItems,
      hasOrderBump,
      amountTotal: (session.amount_total !== null && session.amount_total !== undefined) ? session.amount_total / 100 : 0,
      paymentStatus: session.payment_status,
      utm: {
        utm_source: session.metadata?.utm_source || null,
        utm_medium: session.metadata?.utm_medium || null,
        utm_campaign: session.metadata?.utm_campaign || null,
        utm_content: session.metadata?.utm_content || null,
        utm_term: session.metadata?.utm_term || null,
        fbclid: session.metadata?.fbclid || null,
        gclid: session.metadata?.gclid || null,
      }
    });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Error fetching Stripe session' }, { status: 500 });
  }
}
