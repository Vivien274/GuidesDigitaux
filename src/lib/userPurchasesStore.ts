'use client';

import { DEFAULT_PRODUCTS } from '@/data/defaultProducts';
import { saveUserPurchaseToDb, fetchUserPurchasesFromDb } from './supabaseLms';

export interface EnrolledCourseItem {
  id: string;
  title: string;
  slug: string;
  type?: string;
  typeLabel?: string;
  thumbnail?: string;
  progress?: number;
  completedLessons?: number;
  totalLessons?: number;
  duration?: string;
  instructor?: string;
  isPreorder?: boolean;
  releaseDate?: string;
  price?: number;
  purchaseDate?: string;
  downloadPdf?: string;
  bookingUrl?: string;
  bundleProductIds?: string[];
  productType?: 'simple' | 'bundle';
}

export function getAllCatalogProductsAsPurchases(): EnrolledCourseItem[] {
  return DEFAULT_PRODUCTS.map((prod) => {
    const isPdf = prod.category === 'ebook' || prod.category === 'checklist' || !!prod.downloadPdf;
    const isCoaching = prod.category === 'coaching' || prod.id.includes('coaching') || prod.slug.includes('coaching');
    const isTool = prod.id.includes('calculateur') || prod.id.includes('orderbump');
    
    let type = 'formation';
    let typeLabel = 'Formation Vidéo';

    if (isCoaching) {
      type = 'coaching';
      typeLabel = '🗓️ Coaching & Accompagnement';
    } else if (isTool) {
      type = 'tool';
      typeLabel = '⚡ Outil d\'Audit & Calculateur';
    } else if (isPdf) {
      type = prod.category === 'checklist' ? 'checklist' : 'ebook';
      typeLabel = prod.category === 'checklist' ? '📋 Checklist Pratique' : '📄 E-Book / Guide PDF';
    }

    return {
      id: prod.id,
      title: prod.title,
      slug: prod.slug,
      type,
      typeLabel,
      thumbnail: prod.image,
      progress: 0,
      completedLessons: 0,
      totalLessons: isPdf || isCoaching || isTool ? 0 : 7,
      duration: isPdf ? 'PDF' : isCoaching ? '2 x 45 min' : '2h15',
      instructor: 'Stéphanie ROCQ',
      price: prod.price,
      purchaseDate: 'Accès Super-Admin',
      downloadPdf: prod.downloadPdf,
      bookingUrl: prod.bookingUrl || 'https://calendar.app.google/A4SMq4zBbZYnnCr18',
      bundleProductIds: prod.bundleProductIds,
      productType: prod.productType
    };
  });
}

export function getUserPurchasesKey(email?: string | null): string {
  const normalized = (email || '').toLowerCase().trim();
  if (!normalized) return 'gd_user_purchases_anonymous';
  return `gd_user_purchases_${normalized}`;
}

export function getUserPurchases(email?: string | null): EnrolledCourseItem[] {
  const normalized = (email || '').toLowerCase().trim();
  if (!normalized || typeof window === 'undefined') return [];

  try {
    const raw = localStorage.getItem(getUserPurchasesKey(normalized));
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {}
  return [];
}

export async function getUserPurchasesAsync(email?: string | null): Promise<EnrolledCourseItem[]> {
  if (!email) return [];
  const normalized = email.toLowerCase().trim();

  let dbList: EnrolledCourseItem[] = [];
  try {
    dbList = await fetchUserPurchasesFromDb(normalized);
  } catch (e) {
    console.warn('Error fetching DB purchases', e);
  }

  // If DB returns purchases, it is the absolute source of truth
  if (Array.isArray(dbList) && dbList.length > 0) {
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(getUserPurchasesKey(normalized), JSON.stringify(dbList));
      } catch (e) {}
    }
    return dbList;
  }

  return getUserPurchases(normalized);
}

export function addPurchaseToUser(email: string | null | undefined, item: EnrolledCourseItem): EnrolledCourseItem[] {
  const normalized = (email || '').toLowerCase().trim();
  if (normalized) {
    const existing = getUserPurchases(normalized);
    const updated = [item, ...existing.filter(i => i.id !== item.id && i.slug !== item.slug)];
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(getUserPurchasesKey(normalized), JSON.stringify(updated));
      } catch (e) {}
    }
    saveUserPurchaseToDb(normalized, item);
    return updated;
  }
  return [item];
}

export function purgeAllUserPurchases(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('gd_enrolled_courses');
    localStorage.removeItem('gd_processed_sessions');
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('gd_user_purchases_') || key.startsWith('gd_completed_lessons_')) {
        localStorage.removeItem(key);
      }
    });
  }
}

/**
 * Vérifie si un utilisateur a légitimement acheté et a accès à une formation spécifique.
 */
export async function hasUserCourseAccess(
  email?: string | null,
  courseSlugOrId?: string | null,
  role?: string | null
): Promise<boolean> {
  if (!email || !courseSlugOrId) return false;
  const normalizedEmail = email.toLowerCase().trim();
  const cleanTarget = decodeURIComponent(courseSlugOrId).toLowerCase().trim();

  // 1. SuperAdmin / Formateur : accès illimité garanti
  if (role === 'superadmin' || role === 'formateur') {
    return true;
  }

  // 2. Récupérer les achats réels de l'utilisateur (depuis Supabase DB avec fallback local)
  let purchases: EnrolledCourseItem[] = [];
  try {
    purchases = await getUserPurchasesAsync(normalizedEmail);
  } catch (e) {
    purchases = getUserPurchases(normalizedEmail);
  }

  if (!purchases || purchases.length === 0) {
    return false;
  }

  // 3. Formation Fiche Google / GMB
  if (cleanTarget.includes('google') || cleanTarget.includes('gmb') || cleanTarget === 'formation-fiche-google' || cleanTarget === 'precommande-fiche-google') {
    return purchases.some(p => {
      const pId = (p.id || '').toLowerCase();
      const pSlug = (p.slug || '').toLowerCase();
      const pTitle = (p.title || '').toLowerCase();
      return (
        pId === 'formation-fiche-google' ||
        pSlug === 'formation-fiche-google' ||
        pId === 'precommande-fiche-google' ||
        pSlug === 'precommande-fiche-google' ||
        pId === '17873181-7987-4000-a000-000000000000' ||
        pId === '33333333-3333-4333-a333-333333333333' ||
        pSlug.includes('fiche-google') ||
        pId.includes('fiche-google') ||
        pTitle.includes('google')
      );
    });
  }

  // 4. Formation WooCommerce / Boutique
  if (cleanTarget.includes('woocommerce') || cleanTarget.includes('boutique')) {
    return purchases.some(p => {
      const pId = (p.id || '').toLowerCase();
      const pSlug = (p.slug || '').toLowerCase();
      const pTitle = (p.title || '').toLowerCase();
      return (
        pId === '22222222-2222-4222-a222-222222222222' ||
        pSlug.includes('woocommerce') ||
        pId.includes('woocommerce') ||
        pTitle.includes('woocommerce') ||
        pSlug.includes('bundle') ||
        pId.includes('bundle')
      );
    });
  }

  // 5. Formation WordPress / Vitrine
  if (cleanTarget.includes('wordpress') || cleanTarget.includes('vitrine')) {
    return purchases.some(p => {
      const pId = (p.id || '').toLowerCase();
      const pSlug = (p.slug || '').toLowerCase();
      const pTitle = (p.title || '').toLowerCase();
      return (
        pId === '11111111-1111-4111-a111-111111111111' ||
        pSlug.includes('wordpress') ||
        pId.includes('wordpress') ||
        pSlug.includes('vitrine') ||
        pTitle.includes('wordpress') ||
        pSlug.includes('bundle') ||
        pId.includes('bundle')
      );
    });
  }

  // 6. Bundle Combo
  if (cleanTarget.includes('bundle') || cleanTarget.includes('combo')) {
    return purchases.some(p => {
      const pSlug = (p.slug || '').toLowerCase();
      const pId = (p.id || '').toLowerCase();
      return pSlug.includes('bundle') || pId.includes('bundle') || pId === 'bundle-combo-vitrine-boutique';
    });
  }

  // 7. Match direct ID ou slug
  return purchases.some(p => {
    const pId = (p.id || '').toLowerCase();
    const pSlug = (p.slug || '').toLowerCase();
    return pId === cleanTarget || pSlug === cleanTarget;
  });
}
