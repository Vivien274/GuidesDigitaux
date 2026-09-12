'use client';

import { DEFAULT_PRODUCTS } from '@/data/defaultProducts';
import { saveUserPurchaseToDb, fetchUserPurchasesFromDb, saveOrderToDb } from './supabaseLms';

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

export function isSuperAdminEmail(email?: string | null): boolean {
  if (!email) return false;
  const normalized = email.toLowerCase().trim();
  return (
    normalized === 'contact@guides-digitaux.com' ||
    normalized === 'stephanie@stratec-digital.com' ||
    normalized === 'stephanie@guides-digitaux.com' ||
    normalized === 'vivien274@gmail.com' ||
    normalized.includes('stratec-digital.com') ||
    normalized.includes('guides-digitaux.com') ||
    normalized.includes('admin') ||
    normalized.includes('stephanie')
  );
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

  // 1. Accès Super-Admin : Accès complet à l'ensemble du catalogue
  if (isSuperAdminEmail(normalized)) {
    return getAllCatalogProductsAsPurchases();
  }

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

  // 1. Accès Super-Admin : Accès complet à l'ensemble du catalogue
  if (isSuperAdminEmail(normalized)) {
    const fullCatalog = getAllCatalogProductsAsPurchases();
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(getUserPurchasesKey(normalized), JSON.stringify(fullCatalog));
      } catch (e) {}
    }
    return fullCatalog;
  }

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
    saveOrderToDb(normalized, item.id || item.slug || 'product', 'paid', item.price || 0);
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
