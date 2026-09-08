import { NextResponse } from 'next/server';
import { generateInvoiceHtml, InvoiceData } from '@/lib/invoiceGenerator';
import { DEFAULT_PRODUCTS } from '@/data/defaultProducts';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const email = searchParams.get('email') || 'marinedegreef.pro@gmail.com';
  const name = searchParams.get('name') || email.split('@')[0];
  const productId = searchParams.get('product') || 'precommande-fiche-google';
  const rawPrice = searchParams.get('price');
  
  let invoiceNum = searchParams.get('num') || '2026-0819';
  if (invoiceNum.startsWith('GD-') || invoiceNum.includes('MANUAL-') || invoiceNum.includes('ADMIN-')) {
    invoiceNum = `2026-${invoiceNum.replace(/[^0-9]/g, '').slice(-4) || '0819'}`;
  }

  const dateStr = searchParams.get('date') || '19 août 2026';

  let title = 'Formation Vidéo : Optimiser sa Fiche Google Business Profile';
  if (productId !== 'precommande-fiche-google') {
    const productMatch = DEFAULT_PRODUCTS.find(p => p.id === productId || p.slug === productId);
    if (productMatch) title = productMatch.title;
  }
  
  const price = rawPrice ? parseFloat(rawPrice) : 29;

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
