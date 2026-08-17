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
