import { NextResponse } from 'next/server';
import Stripe from 'stripe';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get('session_id');

  if (!sessionId) {
    return NextResponse.json({ error: 'Missing session_id' }, { status: 400 });
  }

  const secretKey = (process.env.STRIPE_SECRET_KEY && !process.env.STRIPE_SECRET_KEY.includes('...'))
    ? process.env.STRIPE_SECRET_KEY 
    : 'sk_test_51TAqk4D882WcsUbmbsySyL6DrZMMa6PPMsFdk2DJ9xa7iakf5XKBp9baIF69AsOxZE1ZWpfok6cZQxPbQQOYW6y500qA4E6NRT';

  try {
    const stripe = new Stripe(secretKey);
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    const email = session.customer_details?.email || session.customer_email || null;
    const courseId = session.metadata?.courseId || 'precommande-fiche-google';

    return NextResponse.json({
      sessionId: session.id,
      customerEmail: email,
      courseId,
      amountTotal: session.amount_total ? session.amount_total / 100 : 29,
      paymentStatus: session.payment_status
    });
  } catch (e: any) {
    return NextResponse.json({ error: e?.message || 'Error fetching Stripe session' }, { status: 500 });
  }
}
