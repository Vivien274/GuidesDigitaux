import { NextResponse } from 'next/server';
import { processOrderEmails } from '@/lib/orderEmailService';
import { DEFAULT_PRODUCTS } from '@/data/defaultProducts';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { customerEmail, customerName, productId, productTitle, amount, orderId } = body;

    if (!customerEmail || !customerEmail.includes('@')) {
      return NextResponse.json({ error: 'Adresse e-mail invalide' }, { status: 400 });
    }

    const targetId = productId || 'precommande-fiche-google';
    const foundProduct = DEFAULT_PRODUCTS.find(p => p.id === targetId || p.slug === targetId);

    const titleToSend = productTitle || foundProduct?.title || 'Produit Digital Guides Digitaux';
    const amountToSend = amount !== undefined ? Number(amount) : (foundProduct?.price || 29);
    const refOrderId = orderId || `ADMIN-RESEND-${Date.now()}`;

    await processOrderEmails({
      orderId: refOrderId,
      customerEmail: customerEmail.toLowerCase().trim(),
      customerName: customerName || customerEmail.split('@')[0],
      productId: targetId,
      productTitle: titleToSend,
      amount: amountToSend,
      currency: 'EUR'
    });

    return NextResponse.json({
      success: true,
      message: `E-mail de confirmation avec liens de téléchargement renvoyé avec succès à ${customerEmail}`
    });
  } catch (error: any) {
    console.error('Error sending manual admin email:', error);
    return NextResponse.json({
      error: error?.message || 'Erreur lors de l’envoi manuel de l’e-mail'
    }, { status: 500 });
  }
}
