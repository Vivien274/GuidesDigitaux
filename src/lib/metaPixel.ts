export const FB_PIXEL_ID_1 = process.env.NEXT_PUBLIC_META_PIXEL_ID || '9330486780351572';
export const FB_PIXEL_ID_2 = process.env.NEXT_PUBLIC_META_PIXEL_ID_2 || '52580458670170';

export const FB_PIXEL_ID = FB_PIXEL_ID_1;
export const FB_PIXEL_IDS = [FB_PIXEL_ID_1, FB_PIXEL_ID_2].filter(Boolean);

declare global {
  interface Window {
    fbq?: any;
    _fbq?: any;
  }
}

/**
 * Envoie un évènement PageView au Meta Pixel (s'applique à tous les pixels initialisés)
 */
export const pageview = () => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'PageView');
  }
};

/**
 * Envoie un évènement personnalisé ou standard au Meta Pixel
 */
export const event = (name: string, options: Record<string, any> = {}) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', name, options);
  }
};

/**
 * Envoie un évènement Purchase au Meta Pixel pour suivre les commandes
 */
export const trackPurchase = (
  value: number,
  currency: string = 'EUR',
  extra: Record<string, any> = {}
) => {
  if (typeof window !== 'undefined' && window.fbq) {
    window.fbq('track', 'Purchase', {
      value: Number(value) || 0,
      currency: currency || 'EUR',
      ...extra,
    });
  }
};
