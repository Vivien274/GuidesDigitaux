'use client';

export interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderAmount?: number;
  expiryDate?: string;
  usageLimit?: number;
  usageCount: number;
  applicableProductIds?: string[];
  isActive: boolean;
}

export const DEFAULT_COUPONS: Coupon[] = [
  {
    id: 'coup-1',
    code: 'BIENVENUE10',
    discountType: 'percentage',
    discountValue: 10,
    minOrderAmount: 0,
    usageLimit: 500,
    usageCount: 14,
    isActive: true
  },
  {
    id: 'coup-2',
    code: 'LANCEMENT20',
    discountType: 'percentage',
    discountValue: 20,
    minOrderAmount: 50,
    expiryDate: '2026-12-31',
    usageLimit: 100,
    usageCount: 42,
    isActive: true
  },
  {
    id: 'coup-3',
    code: 'STRATEC15',
    discountType: 'fixed',
    discountValue: 15,
    minOrderAmount: 30,
    usageLimit: 200,
    usageCount: 8,
    isActive: true
  }
];

export function getStoredCoupons(): Coupon[] {
  if (typeof window === 'undefined') return DEFAULT_COUPONS;
  try {
    const data = localStorage.getItem('gd_marketing_coupons');
    if (data) {
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (e) {
    console.error('Failed to parse gd_marketing_coupons', e);
  }
  return DEFAULT_COUPONS;
}

export function saveCoupon(coupon: Coupon): Coupon[] {
  const current = getStoredCoupons();
  const index = current.findIndex(c => c.id === coupon.id || c.code.toUpperCase() === coupon.code.toUpperCase());
  let updated: Coupon[];
  
  if (index >= 0) {
    updated = current.map((c, i) => i === index ? coupon : c);
  } else {
    updated = [coupon, ...current];
  }

  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('gd_marketing_coupons', JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to save gd_marketing_coupons', e);
    }
  }
  return updated;
}

export function deleteCoupon(id: string): Coupon[] {
  const current = getStoredCoupons();
  const updated = current.filter(c => c.id !== id);
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('gd_marketing_coupons', JSON.stringify(updated));
    } catch (e) {
      console.error('Failed to delete coupon', e);
    }
  }
  return updated;
}

export function validateCoupon(code: string, currentTotal: number, productIds: string[] = []): {
  valid: boolean;
  coupon?: Coupon;
  discountAmount: number;
  message: string;
} {
  const cleanCode = code.trim().toUpperCase();
  if (!cleanCode) {
    return { valid: false, discountAmount: 0, message: 'Veuillez entrer un code promo.' };
  }

  const coupons = getStoredCoupons();
  const found = coupons.find(c => c.code.toUpperCase() === cleanCode);

  if (!found) {
    return { valid: false, discountAmount: 0, message: 'Code promo invalide ou inexistant.' };
  }

  if (!found.isActive) {
    return { valid: false, discountAmount: 0, message: 'Ce code promo n\'est plus actif.' };
  }

  if (found.expiryDate) {
    const expiry = new Date(found.expiryDate);
    const now = new Date();
    if (now > expiry) {
      return { valid: false, discountAmount: 0, message: 'Ce code promo a expiré.' };
    }
  }

  if (found.usageLimit && found.usageCount >= found.usageLimit) {
    return { valid: false, discountAmount: 0, message: 'Ce code promo a atteint sa limite d\'utilisation.' };
  }

  if (found.minOrderAmount && currentTotal < found.minOrderAmount) {
    return { valid: false, discountAmount: 0, message: `Ce code promo nécessite un montant minimum de panier de ${found.minOrderAmount} €.` };
  }

  let discountAmount = 0;
  if (found.discountType === 'percentage') {
    discountAmount = (currentTotal * found.discountValue) / 100;
  } else {
    discountAmount = found.discountValue;
  }

  discountAmount = Math.min(discountAmount, currentTotal);

  return {
    valid: true,
    coupon: found,
    discountAmount: Math.round(discountAmount * 100) / 100,
    message: `Code ${found.code} appliqué (-${found.discountType === 'percentage' ? found.discountValue + '%' : found.discountValue + ' €'}) !`
  };
}
