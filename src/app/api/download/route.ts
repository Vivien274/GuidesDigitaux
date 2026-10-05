import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs';
import type Stripe from 'stripe';
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

const COURSE_EQUIVALENCE_GROUPS = [
  new Set([
    'formation-fiche-google',
    'precommande-fiche-google',
    '17873181-7987-4000-a000-000000000000',
    '33333333-3333-4333-a333-333333333333',
  ]),
  new Set([
    'formation-wordpress',
    'creer-sa-vitrine-wordpress',
    '11111111-1111-4111-a111-111111111111',
  ]),
  new Set([
    'formation-woocommerce',
    'formation-ajouter-une-boutique-en-ligne-avec-woocommerce',
    '22222222-2222-4222-a222-222222222222',
  ]),
];

function equivalentProductIds(left: string, right: string): boolean {
  if (left === right) return true;
  return COURSE_EQUIVALENCE_GROUPS.some(group => group.has(left) && group.has(right));
}

function matchesPurchasedProduct(purchasedId: string | null | undefined, requestedId: string): boolean {
  if (!purchasedId) return false;
  if (equivalentProductIds(purchasedId, requestedId)) return true;

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

function resourceBasename(resourceUrl: string): string {
  try {
    return path.basename(new URL(resourceUrl, 'https://www.guides-digitaux.com').pathname);
  } catch {
    return path.basename(resourceUrl.split('?')[0]);
  }
}

async function resolveDownloadRequest(productId: string | null, filename: string | null): Promise<{
  productId: string;
  filePath: string;
} | null> {
  const knownProductId = resolveProductId(productId, filename);
  if (knownProductId) {
    const knownFilePath = resolveFilePath(knownProductId);
    if (knownFilePath) return { productId: knownProductId, filePath: knownFilePath };
  }

  if (!filename) return null;
  const safeFilename = path.basename(filename);

  const { data: courses } = await supabaseAdmin
    .from('courses')
    .select('id, bonus_doc_url')
    .not('bonus_doc_url', 'is', null);
  const matchingCourse = (courses ?? []).find(course =>
    course.bonus_doc_url && resourceBasename(course.bonus_doc_url) === safeFilename
  );
  if (matchingCourse?.bonus_doc_url) {
    return { productId: matchingCourse.id, filePath: matchingCourse.bonus_doc_url };
  }

  const { data: lessons } = await supabaseAdmin
    .from('lessons')
    .select('module_id, pdf_url')
    .not('pdf_url', 'is', null);
  const matchingLesson = (lessons ?? []).find(lesson =>
    lesson.pdf_url && resourceBasename(lesson.pdf_url) === safeFilename
  );
  if (!matchingLesson?.module_id || !matchingLesson.pdf_url) return null;

  const { data: module } = await supabaseAdmin
    .from('modules')
    .select('course_id')
    .eq('id', matchingLesson.module_id)
    .maybeSingle();
  if (!module?.course_id) return null;

  return { productId: module.course_id, filePath: matchingLesson.pdf_url };
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

  const hasValidUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(session.userId);

  const [{ data: enrollmentsByUser }, { data: enrollmentsByEmail }] = await Promise.all([
    hasValidUuid
      ? supabaseAdmin.from('enrollments').select('course_id, product_id').eq('user_id', session.userId)
      : Promise.resolve({ data: [] }),
    supabaseAdmin.from('enrollments').select('course_id, product_id').eq('user_email', session.email),
  ]);
  const enrollments = [...(enrollmentsByUser ?? []), ...(enrollmentsByEmail ?? [])];

  return (enrollments ?? []).some(enrollment =>
    matchesPurchasedProduct(enrollment.course_id, entitlementId) ||
    matchesPurchasedProduct((enrollment as any).product_id, entitlementId)
  );
}

function checkoutSessionGrants(checkoutSession: Stripe.Checkout.Session, productId: string): boolean {
  if (checkoutSession.payment_status !== 'paid') return false;

  const entitlementId = BONUS_FILES[productId] ? BONUS_PARENT_PRODUCT : productId;
  const purchasedIds = new Set<string>();
  const primaryId = checkoutSession.metadata?.productId || checkoutSession.metadata?.courseId;
  if (primaryId) purchasedIds.add(primaryId);

  if (checkoutSession.metadata?.hasOrderBump === 'true' || checkoutSession.metadata?.orderbump === '1') {
    purchasedIds.add('kit-serenite');
    if (checkoutSession.metadata?.orderBumpType) {
      purchasedIds.add(checkoutSession.metadata.orderBumpType);
    }
  }

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

async function hasCheckoutAccess(checkoutSessionId: string, productId: string): Promise<boolean> {
  if (!checkoutSessionId.startsWith('cs_')) return false;

  const checkoutSession = await stripe.checkout.sessions.retrieve(checkoutSessionId);
  return checkoutSessionGrants(checkoutSession, productId);
}

async function hasRecentStripeAccess(session: SessionData, productId: string): Promise<boolean> {
  const checkoutSessions = await stripe.checkout.sessions.list({ limit: 100 });

  return checkoutSessions.data.some(checkoutSession => {
    const checkoutEmail = (checkoutSession.customer_details?.email || checkoutSession.customer_email || '')
      .toLowerCase()
      .trim();
    return checkoutEmail === session.email && checkoutSessionGrants(checkoutSession, productId);
  });
}

export async function GET(request: NextRequest) {
  try {
    const resolvedDownload = await resolveDownloadRequest(
      request.nextUrl.searchParams.get('productId'),
      request.nextUrl.searchParams.get('file')
    );
    if (!resolvedDownload) {
      return NextResponse.json({ error: 'Produit introuvable.' }, { status: 404 });
    }
    const { productId, filePath: targetFilePath } = resolvedDownload;

    const token = request.cookies.get('gd_session')?.value;
    const session = token ? await verifySession(token) : null;
    const checkoutSessionId = request.nextUrl.searchParams.get('session_id');

    const authorized = (
      (checkoutSessionId ? await hasCheckoutAccess(checkoutSessionId, productId) : false) ||
      (session ? ((await hasDatabaseAccess(session, productId)) || (await hasRecentStripeAccess(session, productId))) : false)
    );

    if (!authorized) {
      return NextResponse.json({ error: 'Vous ne possédez pas ce produit.' }, { status: (session || checkoutSessionId) ? 403 : 401 });
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
