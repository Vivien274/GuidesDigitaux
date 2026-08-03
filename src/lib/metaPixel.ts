export const FB_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || '9330486780351572';

declare global {
  interface Window {
    fbq?: any;
    _fbq?: any;
  }
}

/**
 * Envoie un évènement PageView au Meta Pixel
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
