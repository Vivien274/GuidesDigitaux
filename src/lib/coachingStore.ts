'use client';

export interface CoachingRecord {
  id: string;
  userEmail: string;
  userName?: string;
  productTitle: string;
  purchaseDate: string;
  completedSessions: number; // 0, 1, or 2
  maxSessions: number; // 2
  notes?: string;
  updatedAt?: string;
}

const STORAGE_KEY = 'gd_coaching_records';

export const DEFAULT_COACHING_RECORDS: CoachingRecord[] = [
  {
    id: 'coaching-contact-guides-digitaux-com',
    userEmail: 'contact@guides-digitaux.com',
    userName: 'Stéphanie Rocq',
    productTitle: 'Coaching Individuel & Accompagnement Sur-Mesure',
    purchaseDate: '2026-08-10',
    completedSessions: 0,
    maxSessions: 2,
    notes: 'Inscrit par défaut'
  }
];

export function getStoredCoachingRecords(): CoachingRecord[] {
  if (typeof window === 'undefined') return DEFAULT_COACHING_RECORDS;
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to parse gd_coaching_records', e);
  }
  return DEFAULT_COACHING_RECORDS;
}

export function saveCoachingRecord(record: CoachingRecord): CoachingRecord[] {
  const current = getStoredCoachingRecords();
  const normalizedEmail = record.userEmail.toLowerCase().trim();
  const index = current.findIndex(r => r.userEmail.toLowerCase().trim() === normalizedEmail);
  
  let updated: CoachingRecord[];
  const newRecord: CoachingRecord = {
    ...record,
    userEmail: normalizedEmail,
    updatedAt: new Date().toISOString()
  };

  if (index >= 0) {
    updated = current.map((r, i) => i === index ? newRecord : r);
  } else {
    updated = [newRecord, ...current];
  }

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save coaching record', e);
    }
  }
  return updated;
}

export function getCoachingStatusForUser(userEmail: string): CoachingRecord | null {
  if (!userEmail) return null;
  const current = getStoredCoachingRecords();
  const normalized = userEmail.toLowerCase().trim();
  const found = current.find(r => r.userEmail.toLowerCase().trim() === normalized);
  if (found) return found;

  // Default record for new coaching buyer if not explicitly set yet
  return {
    id: `coaching-${normalized}`,
    userEmail: normalized,
    productTitle: 'Coaching Individuel & Accompagnement Sur-Mesure',
    purchaseDate: new Date().toISOString().split('T')[0],
    completedSessions: 0,
    maxSessions: 2
  };
}

export function setCompletedSessions(userEmail: string, completedCount: number): CoachingRecord {
  const existing = getCoachingStatusForUser(userEmail) || {
    id: `coaching-${userEmail.toLowerCase().trim()}`,
    userEmail: userEmail.toLowerCase().trim(),
    productTitle: 'Coaching Individuel & Accompagnement Sur-Mesure',
    purchaseDate: new Date().toISOString().split('T')[0],
    completedSessions: 0,
    maxSessions: 2
  };

  const updatedRecord: CoachingRecord = {
    ...existing,
    completedSessions: Math.max(0, Math.min(existing.maxSessions, completedCount))
  };

  saveCoachingRecord(updatedRecord);
  return updatedRecord;
}

export function resetCoachingForRepurchase(userEmail: string): CoachingRecord {
  const existing = getCoachingStatusForUser(userEmail);
  const updatedRecord: CoachingRecord = {
    id: `coaching-${userEmail.toLowerCase().trim()}-${Date.now()}`,
    userEmail: userEmail.toLowerCase().trim(),
    userName: existing?.userName,
    productTitle: 'Coaching Individuel & Accompagnement Sur-Mesure',
    purchaseDate: new Date().toISOString().split('T')[0],
    completedSessions: 0,
    maxSessions: 2,
    notes: 'Requisité / Racheté'
  };
  saveCoachingRecord(updatedRecord);
  return updatedRecord;
}
