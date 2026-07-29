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
  if (typeof window === 'undefined') return [];
  const normalized = (email || '').toLowerCase().trim();
  const key = getUserPurchasesKey(normalized);
  let result: EnrolledCourseItem[] = [];

  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) result = parsed;
    }
  } catch (e) {}

  // Auto-recover unclaimed purchases if user purchases list is empty
  if (result.length === 0 && normalized) {
    try {
      const unclaimed = localStorage.getItem('gd_recent_unclaimed_purchases') || localStorage.getItem('gd_user_purchases_anonymous');
      if (unclaimed) {
        const parsed = JSON.parse(unclaimed);
        if (Array.isArray(parsed) && parsed.length > 0) {
          result = parsed;
          localStorage.setItem(key, JSON.stringify(result));
          localStorage.removeItem('gd_recent_unclaimed_purchases');
        }
      }
    } catch (e) {}
  }

  return result;
}

export async function getUserPurchasesAsync(email?: string | null): Promise<EnrolledCourseItem[]> {
  const localList = getUserPurchases(email);
  if (!email) return localList;

  const dbList = await fetchUserPurchasesFromDb(email);

  // Merge unique items from local and DB
  const mergedMap = new Map<string, EnrolledCourseItem>();
  localList.forEach(item => {
    const uniqueKey = item.id || item.title;
    mergedMap.set(uniqueKey, item);
  });

  dbList.forEach((item: any) => {
    const uniqueKey = item.id || item.title;
    if (!mergedMap.has(uniqueKey)) {
      mergedMap.set(uniqueKey, item);
    }
  });

  const finalMerged = Array.from(mergedMap.values());

  if (typeof window !== 'undefined' && email) {
    try {
      localStorage.setItem(getUserPurchasesKey(email), JSON.stringify(finalMerged));
    } catch (e) {}
  }

  return finalMerged;
}

export function addPurchaseToUser(email: string | null | undefined, item: EnrolledCourseItem): EnrolledCourseItem[] {
  const normalized = (email || '').toLowerCase().trim();
  const current = getUserPurchases(normalized);
  const updated = current.some(c => c.id === item.id || c.title === item.title)
    ? current
    : [item, ...current];

  if (typeof window !== 'undefined') {
    if (normalized) {
      localStorage.setItem(getUserPurchasesKey(normalized), JSON.stringify(updated));
    } else {
      localStorage.setItem('gd_recent_unclaimed_purchases', JSON.stringify(updated));
    }
  }

  if (normalized) {
    saveUserPurchaseToDb(normalized, item);
    saveOrderToDb(normalized, item.id || item.slug || 'product', 'paid');
  }

  return updated;
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
