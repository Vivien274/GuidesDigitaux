import { NextResponse } from 'next/server';
import { processOrderEmails } from '@/lib/orderEmailService';
import { DEFAULT_PRODUCTS } from '@/data/defaultProducts';

export async function POST(request: Request) {
  try {
    const { orderId, customerEmail, customerName, productId, amount, cartItems } = await request.json();

    if (!customerEmail) {
      return NextResponse.json({ error: 'Email client manquant' }, { status: 400 });
    }

    let productTitle = productId || 'Produit Guides Digitaux';
    if (Array.isArray(cartItems) && cartItems.length > 0) {
      productTitle = cartItems.map((it: any) => it.title).join(' + ');
    } else if (productId) {
      const match = DEFAULT_PRODUCTS.find(p => p.id === productId || p.slug === productId);
      if (match) productTitle = match.title;
    }

    await processOrderEmails({
      orderId: orderId || `ord_${Date.now()}`,
      customerEmail: customerEmail.toLowerCase().trim(),
      customerName: customerName || null,
      productTitle,
      productId: productId || (cartItems?.[0]?.id || 'guide'),
      amount: Number(amount) || 0,
      currency: 'EUR',
      cartItems
    });

    // Synchronisation Mailchimp avec tags stricts
    try {
      const { getMailchimpTagsForProduct, subscribeOrUpdateMailchimpMember } = await import('@/lib/mailchimp');
      const collectedTags = new Set<string>(['client']);

      if (Array.isArray(cartItems) && cartItems.length > 0) {
        cartItems.forEach((it: any) => {
          const pId = it.id || it.productId || it.slug;
          if (pId) {
            getMailchimpTagsForProduct(pId).forEach(t => collectedTags.add(t));
          }
        });
      } else if (productId) {
        getMailchimpTagsForProduct(productId).forEach(t => collectedTags.add(t));
      }

      await subscribeOrUpdateMailchimpMember({
        email: customerEmail.toLowerCase().trim(),
        fullName: customerName || undefined,
        tags: Array.from(collectedTags)
      });
    } catch (mcErr) {
      console.warn('[send-email API] Notice Mailchimp sync:', mcErr);
    }

    return NextResponse.json({ success: true });
  } catch (error: any) {
    console.error('Erreur API send-order-email:', error);
    return NextResponse.json({ error: error?.message || 'Erreur lors de l\'envoi de l\'email' }, { status: 500 });
  }
}
