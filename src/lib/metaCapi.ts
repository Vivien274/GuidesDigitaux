import crypto from 'crypto';
import { FB_PIXEL_IDS } from './metaPixel';

const FB_ACCESS_TOKEN = process.env.META_CAPI_ACCESS_TOKEN || '';

/**
 * Hash SHA256 requis par Meta CAPI pour anonymiser l'email (norme Meta)
 */
function hashSha256(value?: string | null): string | undefined {
  if (!value) return undefined;
  const normalized = value.trim().toLowerCase();
  return crypto.createHash('sha256').update(normalized).digest('hex');
}

export interface CapiPurchaseParams {
  email: string;
  value: number;
  currency?: string;
  orderId?: string;
  clientIp?: string;
  userAgent?: string;
  eventSourceUrl?: string;
}

/**
 * Envoie un évènement 'Purchase' depuis le serveur vers Meta Conversions API (CAPI).
 * S'exécute côté Node.js (Webhooks / API routes) pour l'ensemble des pixels/jeux de données configurés.
 */
export async function sendServerPurchaseEvent({
  email,
  value,
  currency = 'EUR',
  orderId,
  clientIp,
  userAgent,
  eventSourceUrl,
}: CapiPurchaseParams) {
  if (!FB_ACCESS_TOKEN) {
    return { success: false, reason: 'META_CAPI_ACCESS_TOKEN non configuré' };
  }

  const targetPixelIds = FB_PIXEL_IDS.length > 0 ? FB_PIXEL_IDS : ['1531523095044984', '9330486780351572'];

  try {
    const hashedEmail = hashSha256(email);
    const eventTime = Math.floor(Date.now() / 1000);

    const payload = {
      data: [
        {
          event_name: 'Purchase',
          event_time: eventTime,
          event_id: orderId || `order_${Date.now()}`,
          event_source_url: eventSourceUrl || 'https://www.guides-digitaux.com/tunnel/confirmation',
          action_source: 'website',
          user_data: {
            em: hashedEmail ? [hashedEmail] : undefined,
            client_ip_address: clientIp || undefined,
            client_user_agent: userAgent || undefined,
          },
          custom_data: {
            currency: currency.toUpperCase(),
            value: Number(value) || 0,
          },
        },
      ],
    };

    const requests = targetPixelIds.map(async (pixelId) => {
      const response = await fetch(
        `https://graph.facebook.com/v19.0/${pixelId}/events?access_token=${FB_ACCESS_TOKEN}`,
        {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );
      const result = await response.json();
      if (!response.ok) {
        console.warn(`⚠️ Meta CAPI Warning [Pixel ${pixelId}]:`, result);
        return { pixelId, success: false, error: result };
      }
      console.log(`✅ Meta CAPI Purchase envoyé avec succès [Pixel ${pixelId}]:`, result);
      return { pixelId, success: true, result };
    });

    const results = await Promise.allSettled(requests);
    return { success: true, results };
  } catch (error) {
    console.error('❌ Erreur envoi Meta CAPI:', error);
    return { success: false, error };
  }
}
