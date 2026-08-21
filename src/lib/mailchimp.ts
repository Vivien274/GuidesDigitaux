import crypto from 'crypto';

export interface MailchimpSubscribeOptions {
  email: string;
  fullName?: string | null;
  tag?: string;
  tags?: string[];
}

export interface MailchimpResponse {
  success: boolean;
  message?: string;
}

/**
 * Mapping STRICT d'après la liste exacte des 13 tags existants dans votre compte Mailchimp :
 * 1. formation-wordpress
 * 2. formation-woocommerce
 * 3. prevente-gmb
 * 4. promo GMB
 * 5. pack-guides
 * 6. coaching
 * 7. client
 * 8. newsletter
 * 9. freebie-premiers-pas
 * 10. quiz-profil-A
 * 11. quiz-profil-B
 * 12. quiz-profil-C
 * 13. quiz-site-web
 */
export const PRODUCT_MAILCHIMP_TAGS: Record<string, string[]> = {
  // Formation Vitrine WordPress
  'formation-wordpress': ['formation-wordpress', 'client'],
  'creer-sa-vitrine-wordpress': ['formation-wordpress', 'client'],

  // Formation Boutique WooCommerce
  'formation-ajouter-une-boutique-en-ligne-avec-woocommerce': ['formation-woocommerce', 'client'],
  'formation-woocommerce': ['formation-woocommerce', 'client'],

  // Formation & Précommande Google Business Profile
  '17873181-7987-4000-a000-000000000000': ['prevente-gmb', 'client'],
  'creation-gmb': ['prevente-gmb', 'client'],
  'precommande-fiche-google': ['prevente-gmb', 'client'],

  // Pack Guides & Combo
  'pack-guides': ['pack-guides', 'client'],
  'bundle-vitrine-boutique-wordpress-le-combo-pour-vendre-en-ligne': ['formation-wordpress', 'formation-woocommerce', 'client'],

  // Coaching & Accompagnement
  'coaching-site': ['coaching', 'client'],

  // Upsells et Downsells
  'upsell-woocommerce': ['formation-woocommerce', 'client'],
  'upsell-coaching': ['coaching', 'client'],
  'downsell-audit': ['client'],
  'downsell-guide': ['client']
};

/**
 * Hash MD5 de l'adresse email (requis par l'API v3 de Mailchimp)
 */
function getSubscriberHash(email: string): string {
  return crypto.createHash('md5').update(email.trim().toLowerCase()).digest('hex');
}

/**
 * Extraction du datacenter (ex: "us15") depuis la clé API Mailchimp
 */
function getDatacenter(apiKey: string): string {
  const parts = apiKey.split('-');
  return parts.length === 2 ? parts[1] : (process.env.MAILCHIMP_SERVER_PREFIX || 'us15');
}

/**
 * Inscription ou mise à jour d'un membre dans Mailchimp Audience "Guides Digitaux" (List ID: dea5255730)
 * avec les 13 tags stricts réels de votre compte Mailchimp.
 */
export async function subscribeOrUpdateMailchimpMember({
  email,
  fullName,
  tag,
  tags = [],
}: MailchimpSubscribeOptions): Promise<MailchimpResponse> {
  const apiKey = process.env.MAILCHIMP_API_KEY;
  const listId = process.env.MAILCHIMP_AUDIENCE_ID || process.env.MAILCHIMP_LIST_ID || 'dea5255730';
  const defaultTag = 'client';

  const allTags = new Set<string>();
  if (tag) allTags.add(tag);
  if (tags && Array.isArray(tags)) {
    tags.forEach(t => t && allTags.add(t));
  }
  if (allTags.size === 0) {
    allTags.add(defaultTag);
  }

  if (!apiKey) {
    console.warn('[Mailchimp Notice] MAILCHIMP_API_KEY non configurée. Tags enregistrés en mode local:', Array.from(allTags));
    return {
      success: true,
      message: 'Inscription enregistrée (mode déconnecté)',
    };
  }

  const dc = getDatacenter(apiKey);
  const subscriberHash = getSubscriberHash(email);
  const baseUrl = `https://${dc}.api.mailchimp.com/3.0/lists/${listId}/members/${subscriberHash}`;
  const authHeader = `Basic ${Buffer.from(`anystring:${apiKey}`).toString('base64')}`;

  let firstName = '';
  let lastName = '';
  if (fullName) {
    const parts = fullName.trim().split(' ');
    firstName = parts[0] || '';
    lastName = parts.slice(1).join(' ') || '';
  }

  try {
    // 1. Synchronisation Membre via PUT (Upsert)
    const memberRes = await fetch(baseUrl, {
      method: 'PUT',
      headers: {
        Authorization: authHeader,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email_address: email.trim().toLowerCase(),
        status_if_new: 'subscribed',
        merge_fields: {
          FNAME: firstName,
          LNAME: lastName,
        },
      }),
    });

    if (!memberRes.ok) {
      const errorData = await memberRes.json().catch(() => ({}));
      console.error('[Mailchimp] Erreur mise à jour membre:', errorData);
    } else {
      console.log(`[Mailchimp] Client ${email} inscrit/mis à jour dans l'audience Guides Digitaux (${listId}).`);
    }

    // 2. Application des Tags exacts dans Mailchimp
    if (allTags.size > 0) {
      const tagUrl = `${baseUrl}/tags`;
      const tagsPayload = Array.from(allTags).map(tName => ({
        name: tName,
        status: 'active'
      }));

      const tagRes = await fetch(tagUrl, {
        method: 'POST',
        headers: {
          Authorization: authHeader,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tags: tagsPayload
        }),
      });

      if (!tagRes.ok) {
        const tagError = await tagRes.json().catch(() => ({}));
        console.error(`[Mailchimp] Erreur application des tags pour ${email}:`, tagError);
      } else {
        console.log(`[Mailchimp] Tags Mailchimp [${Array.from(allTags).join(', ')}] appliqués avec succès à ${email}.`);
      }
    }

    return { success: true };
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : 'Erreur inconnue Mailchimp';
    console.error('[Mailchimp] Erreur d\'exécution:', errorMessage);
    return {
      success: false,
      message: errorMessage,
    };
  }
}
