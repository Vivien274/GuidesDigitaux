import crypto from 'crypto';

const FB_PIXEL_ID = process.env.NEXT_PUBLIC_META_PIXEL_ID || '9330486780351572';
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
 * S'exécute côté Node.js (Webhooks / API routes).
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
    // Si la variable META_CAPI_ACCESS_TOKEN n'est pas définie, on n'envoie pas de requête et le site fonctionne normalement
    return { success: false, reason: 'META_CAPI_ACCESS_TOKEN non configuré' };
  }

  try {
    const hashedEmail = hashSha256(email);
    const eventTime = Math.floor(Date.now() / 1000);

    const payload = {
      data: [
        {
          event_name: 'Purchase',
          event_time: eventTime,
          event_id: orderId || `order_${Date.now()}`,
          event_source_url: eventSourceUrl || 'https://guidesdigitaux.fr/tunnel/confirmation',
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

    const response = await fetch(
      `https://graph.facebook.com/v19.0/${FB_PIXEL_ID}/events?access_token=${FB_ACCESS_TOKEN}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }
    );

    const result = await response.json();
    if (!response.ok) {
      console.warn('⚠️ Meta CAPI Warning:', result);
      return { success: false, error: result };
    }

    console.log('✅ Meta CAPI Purchase event envoyé avec succès:', result);
    return { success: true, result };
  } catch (error) {
    console.error('❌ Erreur envoi Meta CAPI:', error);
    return { success: false, error };
  }
}
