import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import { stripe } from '@/lib/stripe/client';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { verifySession, type SessionData } from '@/lib/auth';
import { DEFAULT_PRODUCTS } from '@/data/defaultProducts';

interface CheckoutCartItem {
  id?: string;
}

const BONUS_FILES: Record<string, string> = {
  'bonus-1': '/downloads/bonus-1-checklist-audit-fiche-google.pdf',
  'bonus-2': '/downloads/bonus-2-kit-modeles-reponses-avis-google.pdf',
  'bonus-3': '/downloads/bonus-3-script-whatsapp-demander-avis-5-etoiles.pdf',
};

const BONUS_PARENT_PRODUCT = 'formation-fiche-google';

function matchesPurchasedProduct(purchasedId: string | null | undefined, requestedId: string): boolean {
  if (!purchasedId) return false;
  if (purchasedId === requestedId) return true;

  const purchasedProduct = DEFAULT_PRODUCTS.find(
    product => product.id === purchasedId || product.slug === purchasedId
  );
  return purchasedProduct?.bundleProductIds?.includes(requestedId) ?? false;
}

function resolveProductId(productId: string | null, filename: string | null): string | null {
  if (productId) return productId;
  if (!filename) return null;

  const safeFilename = path.basename(filename);
  const bonusEntry = Object.entries(BONUS_FILES).find(([, filePath]) => path.basename(filePath) === safeFilename);
  if (bonusEntry) return bonusEntry[0];

  const product = DEFAULT_PRODUCTS.find(item => item.downloadPdf && path.basename(item.downloadPdf) === safeFilename);
  return product?.id ?? null;
}

function resolveFilePath(productId: string): string | null {
  if (BONUS_FILES[productId]) return BONUS_FILES[productId];
  const product = DEFAULT_PRODUCTS.find(item => item.id === productId || item.slug === productId);
  return product?.downloadPdf ?? null;
}

async function hasDatabaseAccess(session: SessionData, productId: string): Promise<boolean> {
  if (session.role === 'superadmin' || session.role === 'formateur') return true;

  const entitlementId = BONUS_FILES[productId] ? BONUS_PARENT_PRODUCT : productId;
  const { data: orders } = await supabaseAdmin
    .from('orders')
    .select('product_id, status')
    .eq('customer_email', session.email);

  const paidOrder = (orders ?? []).some(order => {
    const paid = ['paid', 'completed'].includes(String(order.status));
    return paid && matchesPurchasedProduct(order.product_id, entitlementId);
  });
  if (paidOrder) return true;

  if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(session.userId)) {
    return false;
  }

  const { data: enrollments } = await supabaseAdmin
    .from('enrollments')
    .select('product_id, course_id')
    .eq('user_id', session.userId);

  return (enrollments ?? []).some(enrollment =>
    matchesPurchasedProduct(enrollment.product_id, entitlementId) ||
    matchesPurchasedProduct(enrollment.course_id, entitlementId)
  );
}

async function hasCheckoutAccess(checkoutSessionId: string, productId: string): Promise<boolean> {
  if (!checkoutSessionId.startsWith('cs_')) return false;

  const checkoutSession = await stripe.checkout.sessions.retrieve(checkoutSessionId);
  if (checkoutSession.payment_status !== 'paid') return false;

  const entitlementId = BONUS_FILES[productId] ? BONUS_PARENT_PRODUCT : productId;
  const purchasedIds = new Set<string>();
  const primaryId = checkoutSession.metadata?.productId || checkoutSession.metadata?.courseId;
  if (primaryId) purchasedIds.add(primaryId);

  if (checkoutSession.metadata?.cartItemsJson) {
    try {
      const cartItems = JSON.parse(checkoutSession.metadata.cartItemsJson) as CheckoutCartItem[];
      cartItems.forEach(item => {
        if (item.id) purchasedIds.add(item.id);
      });
    } catch {
      return false;
    }
  }

  return [...purchasedIds].some(purchasedId => matchesPurchasedProduct(purchasedId, entitlementId));
}

export async function GET(request: NextRequest) {
  try {
    const productId = resolveProductId(
      request.nextUrl.searchParams.get('productId'),
      request.nextUrl.searchParams.get('file')
    );
    if (!productId) {
      return NextResponse.json({ error: 'Produit introuvable.' }, { status: 404 });
    }

    const token = request.cookies.get('gd_session')?.value;
    const session = token ? await verifySession(token) : null;
    const checkoutSessionId = request.nextUrl.searchParams.get('session_id');

    const authorized = session
      ? await hasDatabaseAccess(session, productId)
      : checkoutSessionId
        ? await hasCheckoutAccess(checkoutSessionId, productId)
        : false;

    if (!authorized) {
      return NextResponse.json({ error: 'Vous ne possédez pas ce produit.' }, { status: session ? 403 : 401 });
    }

    const targetFilePath = resolveFilePath(productId);
    if (!targetFilePath) {
      return NextResponse.json({ error: 'Fichier produit introuvable.' }, { status: 404 });
    }

    if (/^https?:\/\//i.test(targetFilePath)) {
      const targetUrl = new URL(targetFilePath);
      const supabaseHostname = process.env.NEXT_PUBLIC_SUPABASE_URL
        ? new URL(process.env.NEXT_PUBLIC_SUPABASE_URL).hostname
        : null;
      const allowedHosts = new Set([
        supabaseHostname,
        'drive.google.com',
        'docs.google.com',
        'commondatastorage.googleapis.com',
      ].filter((host): host is string => Boolean(host)));

      if (targetUrl.protocol !== 'https:' || !allowedHosts.has(targetUrl.hostname)) {
        return NextResponse.json({ error: 'Hôte de téléchargement non autorisé.' }, { status: 403 });
      }

      const externalResponse = await fetch(targetUrl, { redirect: 'error' });
      if (!externalResponse.ok) {
        return NextResponse.json({ error: 'Fichier introuvable.' }, { status: 404 });
      }

      return new NextResponse(await externalResponse.arrayBuffer(), {
        headers: downloadHeaders(path.basename(targetUrl.pathname) || `${productId}.pdf`),
      });
    }

    const downloadsDirectory = path.resolve(process.cwd(), 'public', 'downloads');
    const localFilePath = path.resolve(process.cwd(), 'public', targetFilePath.replace(/^\/+/, ''));
    if (!localFilePath.startsWith(`${downloadsDirectory}${path.sep}`) || !fs.existsSync(localFilePath)) {
      return NextResponse.json({ error: 'Fichier introuvable.' }, { status: 404 });
    }

    return new NextResponse(fs.readFileSync(localFilePath), {
      headers: downloadHeaders(path.basename(localFilePath)),
    });
  } catch (error: unknown) {
    console.error('Erreur de téléchargement sécurisé:', error);
    return NextResponse.json({ error: 'Erreur serveur lors du téléchargement.' }, { status: 500 });
  }
}

function downloadHeaders(filename: string): HeadersInit {
  return {
    'Content-Type': 'application/pdf',
    'Content-Disposition': `attachment; filename="${encodeURIComponent(filename)}"`,
    'X-Robots-Tag': 'noindex, nofollow, noarchive, nosnippet',
    'Cache-Control': 'private, no-cache, no-store, must-revalidate',
    Pragma: 'no-cache',
    Expires: '0',
  };
}
