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
  return [];
}

export async function getUserPurchasesAsync(email?: string | null): Promise<EnrolledCourseItem[]> {
  if (!email) return [];
  const dbList = await fetchUserPurchasesFromDb(email);
  return dbList || [];
}

export function addPurchaseToUser(email: string | null | undefined, item: EnrolledCourseItem): EnrolledCourseItem[] {
  const normalized = (email || '').toLowerCase().trim();
  if (normalized) {
    saveUserPurchaseToDb(normalized, item);
    saveOrderToDb(normalized, item.id || item.slug || 'product', 'paid');
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
