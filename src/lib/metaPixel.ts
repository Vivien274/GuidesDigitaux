export const FB_PIXEL_ID_1 = process.env.NEXT_PUBLIC_META_PIXEL_ID || '1531523095044984';
export const FB_PIXEL_ID_2 = process.env.NEXT_PUBLIC_META_PIXEL_ID_2 || '9330486780351572';
export const FB_PIXEL_ID_3 = '52580458670170';
export const FB_PIXEL_ID_4 = '1807595270425119'; // pixel GD tunnel

export const FB_PIXEL_IDS = Array.from(new Set([FB_PIXEL_ID_1, FB_PIXEL_ID_2, FB_PIXEL_ID_3, FB_PIXEL_ID_4].filter(Boolean)));

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
 * Envoie un évènement personnalisé ou standard au Meta Pixel.
 * Supporte le paramètre de déduplication eventID (4ème argument fbq requis par Meta pour dédupliquer avec CAPI).
 */
export const event = (
  name: string,
  options: Record<string, any> = {},
  extraParams?: { eventID?: string }
) => {
  if (typeof window !== 'undefined' && window.fbq) {
    const eventId = extraParams?.eventID || options?.eventID || options?.event_id;
    if (eventId) {
      window.fbq('track', name, options, { eventID: String(eventId) });
    } else {
      window.fbq('track', name, options);
    }
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
    const eventId = extra.order_id || extra.event_id || extra.eventId || extra.eventID;
    window.fbq(
      'track',
      'Purchase',
      {
        value: Number(value) || 0,
        currency: currency || 'EUR',
        ...extra,
      },
      eventId ? { eventID: String(eventId) } : undefined
    );
  }
};
