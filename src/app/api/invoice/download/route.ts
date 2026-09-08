import { NextResponse } from 'next/server';
import { generateInvoiceHtml, InvoiceData } from '@/lib/invoiceGenerator';
import { DEFAULT_PRODUCTS } from '@/data/defaultProducts';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email') || 'client@example.com';
  const name = searchParams.get('name') || email.split('@')[0];
  const productId = searchParams.get('product') || 'precommande-fiche-google';
  const rawPrice = searchParams.get('price');
  const invoiceNum = searchParams.get('num') || `GD-${Date.now().toString().substring(5)}`;
  const dateStr = searchParams.get('date') || new Date().toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });

  const productMatch = DEFAULT_PRODUCTS.find(p => p.id === productId || p.slug === productId);
  const title = productMatch ? productMatch.title : 'Formation Vidéo / E-book Guides Digitaux';
  const price = rawPrice ? parseFloat(rawPrice) : (productMatch ? productMatch.price : 29);

  const invoiceData: InvoiceData = {
    invoiceNumber: invoiceNum,
    invoiceDate: dateStr,
    customerName: name,
    customerEmail: email,
    items: [
      {
        description: title,
        quantity: 1,
        unitPrice: price,
        total: price
      }
    ],
    subtotal: price,
    totalAmount: price,
    paymentMethod: 'Carte Bancaire via Stripe',
    isPaid: true,
    notes: 'TVA non applicable, art. 293 B du CGI'
  };

  const html = generateInvoiceHtml(invoiceData);

  return new NextResponse(html, {
    headers: {
      'Content-Type': 'text/html; charset=utf-8',
    },
  });
}
