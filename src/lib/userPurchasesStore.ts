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

export function getUserPurchases(email?: string | null): EnrolledCourseItem[] {
  if (typeof window === 'undefined') return [];
  const key = getUserPurchasesKey(email);
  try {
    const raw = localStorage.getItem(key);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (e) {
    console.error('Failed to parse user purchases for key:', key, e);
  }
  return [];
}

export function addPurchaseToUser(email: string | null | undefined, item: EnrolledCourseItem): EnrolledCourseItem[] {
  const current = getUserPurchases(email);
  if (!current.some(c => c.id === item.id || c.title === item.title)) {
    const updated = [item, ...current];
    if (typeof window !== 'undefined') {
      localStorage.setItem(getUserPurchasesKey(email), JSON.stringify(updated));
    }
    return updated;
  }
  return current;
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
