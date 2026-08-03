import crypto from 'crypto';

interface MailchimpSubscribeOptions {
  email: string;
  fullName?: string | null;
  tag?: string;
}

interface MailchimpResponse {
  success: boolean;
  message?: string;
}

/**
 * Calculates the MD5 hash of a lowercased email address for Mailchimp API.
 */
function getSubscriberHash(email: string): string {
  return crypto.createHash('md5').update(email.trim().toLowerCase()).digest('hex');
}

/**
 * Extracts the datacenter prefix (e.g. "us21") from the Mailchimp API key.
 */
function getDatacenter(apiKey: string): string | null {
  const parts = apiKey.split('-');
  return parts.length === 2 ? parts[1] : null;
}

/**
 * Subscribes or updates a member in Mailchimp and optionally adds a tag.
 * Zero hardcoded keys: uses process.env.MAILCHIMP_API_KEY & process.env.MAILCHIMP_AUDIENCE_ID.
 */
export async function subscribeOrUpdateMailchimpMember({
  email,
  fullName,
  tag,
}: MailchimpSubscribeOptions): Promise<MailchimpResponse> {
  const apiKey = process.env.MAILCHIMP_API_KEY;
  const listId = process.env.MAILCHIMP_AUDIENCE_ID;
  const defaultTag = process.env.MAILCHIMP_PREORDER_TAG;

  const targetTag = tag || defaultTag;

  if (!apiKey || !listId) {
    console.warn('[Mailchimp] API key ou Audience ID manquant dans les variables d\'environnement.');
    return {
      success: false,
      message: 'Configuration Mailchimp manquante (MAILCHIMP_API_KEY ou MAILCHIMP_AUDIENCE_ID)',
    };
  }

  const dc = getDatacenter(apiKey);
  if (!dc) {
    console.error('[Mailchimp] Format de clé API invalide. Attendu : xxxxxxxxx-usX');
    return {
      success: false,
      message: 'Format de clé API Mailchimp invalide',
    };
  }

  const subscriberHash = getSubscriberHash(email);
  const baseUrl = `https://${dc}.api.mailchimp.com/3.0/lists/${listId}/members/${subscriberHash}`;
  const authHeader = `Basic ${Buffer.from(`anystring:${apiKey}`).toString('base64')}`;

  // Separe le nom complet en Prénom / Nom si présent
  let firstName = '';
  let lastName = '';
  if (fullName) {
    const parts = fullName.trim().split(' ');
    firstName = parts[0] || '';
    lastName = parts.slice(1).join(' ') || '';
  }

  try {
    // 1. Inscription / Mise à jour de l'abonné (UPSERT via PUT)
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
      console.error('[Mailchimp] Erreur lors de l\'inscription de l\'abonné:', errorData);
      return {
        success: false,
        message: errorData.detail || 'Erreur lors de la mise à jour de l\'abonné',
      };
    }

    console.log(`[Mailchimp] Email ${email} inscrit/mis à jour avec succès.`);

    // 2. Ajout du tag si présent
    if (targetTag) {
      const tagUrl = `${baseUrl}/tags`;
      const tagRes = await fetch(tagUrl, {
        method: 'POST',
        headers: {
          Authorization: authHeader,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          tags: [
            {
              name: targetTag,
              status: 'active',
            },
          ],
        }),
      });

      if (!tagRes.ok) {
        const tagError = await tagRes.json().catch(() => ({}));
        console.error(`[Mailchimp] Erreur lors de l'application du tag "${targetTag}":`, tagError);
      } else {
        console.log(`[Mailchimp] Tag "${targetTag}" appliqué avec succès à ${email}.`);
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
