import { NextResponse } from 'next/server';
import { stripe } from '@/lib/stripe/client';
import { createClient } from '@/lib/supabase/server';

export async function POST(request: Request) {
  try {
    const { productId } = await request.json();

    if (!productId) {
      return NextResponse.json({ error: 'ID du produit manquant' }, { status: 400 });
    }

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    // 1. Récupérer le produit en base de données
    const { data: product, error: productError } = await supabase
      .from('products')
      .select('*')
      .eq('id', productId)
      .eq('is_published', true)
      .single();

    if (productError || !product) {
      return NextResponse.json({ error: 'Produit introuvable ou non disponible' }, { status: 404 });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

    // 2. Création de la session Stripe Checkout
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      customer_email: user?.email ?? undefined,
      line_items: [
        {
          price_data: {
            currency: product.currency,
            product_data: {
              name: product.title,
              description: product.description ?? undefined,
            },
            unit_amount: product.price_cents,
          },
          quantity: 1,
        },
      ],
      mode: 'payment',
      invoice_creation: { enabled: true },
      success_url: `${siteUrl}/mes-achats?success=true`,
      cancel_url: `${siteUrl}/guides/${product.slug}?canceled=true`,
      metadata: {
        productId: product.id,
        userId: user?.id ?? '',
        isPreorder: product.is_preorder ? 'true' : 'false',
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error('Erreur Checkout Stripe:', err);
    return NextResponse.json({ error: err.message || 'Erreur serveur' }, { status: 500 });
  }
}
