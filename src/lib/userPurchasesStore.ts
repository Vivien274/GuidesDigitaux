'use client';

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
}

export function getUserPurchasesKey(email?: string | null): string {
  const normalized = (email || '').toLowerCase().trim();
  if (!normalized) return 'gd_user_purchases_anonymous';
  return `gd_user_purchases_${normalized}`;
}

import { saveUserPurchaseToDb, fetchUserPurchasesFromDb, saveOrderToDb } from './supabaseLms';

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
  const dbList = await fetchUserPurchasesFromDb(normalized);
  
  if (typeof window !== 'undefined' && dbList && dbList.length > 0) {
    try {
      localStorage.setItem(getUserPurchasesKey(normalized), JSON.stringify(dbList));
    } catch (e) {}
  }
  
  return dbList || getUserPurchases(normalized);
}

export function addPurchaseToUser(email: string | null | undefined, item: EnrolledCourseItem): EnrolledCourseItem[] {
  const normalized = (email || '').toLowerCase().trim();
  if (normalized) {
    const existing = getUserPurchases(normalized);
    let itemsToAdd: EnrolledCourseItem[] = [item];

    if (item.id.includes('bundle') || item.slug.includes('bundle')) {
      itemsToAdd = [
        item,
        {
          id: 'formation-wordpress',
          title: 'Formation : créer sa vitrine en ligne avec WordPress',
          slug: 'formation-wordpress',
          price: 199,
          type: 'formation',
          typeLabel: 'Formation Vidéo',
          thumbnail: '/images/products/formation-wordpress.webp'
        },
        {
          id: 'formation-ajouter-une-boutique-en-ligne-avec-woocommerce',
          title: 'Formation ajouter une boutique en ligne avec WooCommerce',
          slug: 'formation-ajouter-une-boutique-en-ligne-avec-woocommerce',
          price: 99,
          type: 'formation',
          typeLabel: 'Formation Vidéo',
          thumbnail: '/images/products/formation-woocommerce.jpg'
        }
      ];
    }

    const updated = [...itemsToAdd, ...existing.filter(i => !itemsToAdd.some(ta => ta.id === i.id || ta.slug === i.slug))];
    if (typeof window !== 'undefined') {
      try {
        localStorage.setItem(getUserPurchasesKey(normalized), JSON.stringify(updated));
      } catch (e) {}
    }
    itemsToAdd.forEach(it => {
      saveUserPurchaseToDb(normalized, it);
      saveOrderToDb(normalized, it.id || it.slug || 'product', 'paid');
    });
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
