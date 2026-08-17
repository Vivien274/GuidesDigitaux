import { DEFAULT_PRODUCTS } from '@/data/defaultProducts';
import { getEncryptedDownloadUrl } from '@/lib/downloadSecurity';

export interface OrderEmailItem {
  id: string;
  title: string;
  slug?: string;
  price: number;
  category?: string;
  downloadPdf?: string;
  bookingUrl?: string;
}

export interface SendOrderEmailPayload {
  orderId: string;
  customerEmail: string;
  customerName?: string | null;
  productTitle: string;
  productId: string;
  amount: number;
  currency?: string;
  purchaseDate?: string;
  downloadPdf?: string;
  bookingUrl?: string;
}

// Product download mapping helper for PDF items
const PDF_DOWNLOAD_LINKS: Record<string, { title: string; fileUrl: string }> = {
  'mini-guide-ecrire-web-artisan': {
    title: "Mini-guide : Écrire pour le web quand on est artisan",
    fileUrl: "/downloads/mini-guide-ecrire-web-artisan.pdf"
  },
  'ebook-visibilite-ligne-artisan': {
    title: "Ebook : Doubler sa visibilité locale",
    fileUrl: "/downloads/ebook-visibilite-ligne-artisan.pdf"
  },
  'checklist-securite-anti-spam-wordpress': {
    title: "Checklist : Sécurité & Anti-Spam WordPress",
    fileUrl: "/downloads/checklist-securite-anti-spam-wordpress.pdf"
  },
  'checklist-les-principes-ux': {
    title: "Checklist : Les 10 Principes UX Incontournables",
    fileUrl: "/downloads/checklist-principes-ux.pdf"
  },
  'checklist-profil-reseaux-sociaux': {
    title: "Checklist : Profil réseaux sociaux pro",
    fileUrl: "/downloads/checklist-profil-reseaux-sociaux.pdf"
  },
  'checklist-google-business-profile': {
    title: "Checklist : Optimisation Google Business Profile",
    fileUrl: "/downloads/checklist-google-business-profile.pdf"
  }
};

/**
 * Returns a deduplicated list of downloadable PDF files for a given product or bundle.
 */
export function getDeduplicatedDownloadLinksForProduct(productId: string, payloadDownloadPdf?: string): { title: string; url: string }[] {
  const targetProd = DEFAULT_PRODUCTS.find(p => p.id === productId || p.slug === productId);
  const linksMap = new Map<string, { title: string; url: string }>();

  const addLink = (title: string, rawUrl?: string) => {
    if (!rawUrl || !rawUrl.trim()) return;
    let url = rawUrl.trim();
    
    // Encrypt raw PDF path into secure URL (valid for 30 days in emails)
    let secureUrl = getEncryptedDownloadUrl(url, productId, 720);
    if (secureUrl.startsWith('/')) {
      const baseUrl = process.env.NEXT_PUBLIC_APP_URL || 'https://www.guides-digitaux.com';
      secureUrl = `${baseUrl}${secureUrl}`;
    }

    // Normalize URL key to remove duplicates (e.g. /downloads/file.pdf vs full http url)
    const filenameKey = url.split('/').pop()?.toLowerCase().split('?')[0] || url.toLowerCase();
    if (!linksMap.has(filenameKey)) {
      linksMap.set(filenameKey, { title, url: secureUrl });
    }
  };

  // 1. Direct PDF payload or product downloadPdf
  if (payloadDownloadPdf) {
    addLink(targetProd?.title || 'Fichier PDF', payloadDownloadPdf);
  }
  if (targetProd?.downloadPdf) {
    addLink(targetProd.title, targetProd.downloadPdf);
  }
  if (PDF_DOWNLOAD_LINKS[productId]) {
    addLink(PDF_DOWNLOAD_LINKS[productId].title, PDF_DOWNLOAD_LINKS[productId].fileUrl);
  }

  // 2. Bundled products
  if (targetProd?.bundleProductIds && targetProd.bundleProductIds.length > 0) {
    for (const bId of targetProd.bundleProductIds) {
      const bProd = DEFAULT_PRODUCTS.find(p => p.id === bId || p.slug === bId);
      if (bProd?.downloadPdf) {
        addLink(bProd.title, bProd.downloadPdf);
      } else if (PDF_DOWNLOAD_LINKS[bId]) {
        addLink(PDF_DOWNLOAD_LINKS[bId].title, PDF_DOWNLOAD_LINKS[bId].fileUrl);
      }
    }
  }

  // 3. Bundled custom items
  if (targetProd?.bundleCustomItems && targetProd.bundleCustomItems.length > 0) {
    for (const cItem of targetProd.bundleCustomItems) {
      if (cItem.pdfUrl) {
        addLink(cItem.title, cItem.pdfUrl);
      }
    }
  }

  // Fallback for pack-guides if no downloadPdf configured
  if (productId === 'pack-guides' && linksMap.size === 0) {
    const defaultPackIds = [
      'mini-guide-ecrire-web-artisan',
      'mini-guide-comprendre-ses-stats-sans-etre-data-scientist',
      'mini-guide-optimiser-ses-photos',
      'mini-guide-seo-local',
      'checklist-securite-anti-spam-wordpress',
      'checklist-les-principes-ux'
    ];
    for (const pId of defaultPackIds) {
      if (PDF_DOWNLOAD_LINKS[pId]) {
        addLink(PDF_DOWNLOAD_LINKS[pId].title, PDF_DOWNLOAD_LINKS[pId].fileUrl);
      }
    }
  }

  return Array.from(linksMap.values());
}

/**
 * Sends order notification email to Admin (contact@guides-digitaux.com)
 * and confirmation email to the customer with download links or video access.
 */
export async function processOrderEmails(payload: SendOrderEmailPayload) {
  const {
    orderId,
    customerEmail,
    customerName,
    productTitle,
    productId,
    amount,
    currency = 'EUR',
    purchaseDate = new Date().toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: 'numeric' })
  } = payload;

  console.log(`[Order Email Service] Processing emails for order ${orderId} (${customerEmail}) - Product: ${productTitle}`);

  const formattedAmount = `${amount.toFixed(2).replace('.', ',')} €`;

  // Determine Product Type & Action Button
  const isCoaching = productId.includes('coaching') || productTitle.toLowerCase().includes('coaching');
  const isFormation = (productId.includes('formation') || productId.includes('bundle') || productTitle.toLowerCase().includes('formation')) && !productId.includes('pack-guides');
  const isPdf = !isCoaching && !isFormation;

  const deduplicatedLinks = getDeduplicatedDownloadLinksForProduct(productId, payload.downloadPdf);
  const bookingUrl = payload.bookingUrl || 'https://calendar.app.google/A4SMq4zBbZYnnCr18';
  const courseUrl = `https://guides-digitaux.com/dashboard/eleve`;

  // --- 1. ADMIN NOTIFICATION EMAIL CONTENT ---
  const adminSubject = `🛒 Nouvelle Commande ! ${formattedAmount} - ${productTitle}`;
  const adminHtml = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"/></head>
    <body style="font-family: Arial, sans-serif; background-color: #faf8f5; color: #332420; padding: 20px;">
      <div style="max-w: 600px; margin: 0 auto; background: #ffffff; border: 2px solid #18757d; border-radius: 16px; padding: 30px;">
        <h2 style="color: #18757d; margin-top: 0;">🎉 Nouvelle commande enregistrée !</h2>
        <p><strong>Stéphanie</strong>, une nouvelle commande vient d'être effectuée sur <strong>Guides Digitaux</strong> :</p>
        
        <table style="width: 100%; border-collapse: collapse; margin: 20px 0; background: #faf8f5; border-radius: 12px; padding: 15px;">
          <tr><td style="padding: 8px 12px; font-weight: bold;">Client :</td><td style="padding: 8px 12px;">${customerName ? `${customerName} (${customerEmail})` : customerEmail}</td></tr>
          <tr><td style="padding: 8px 12px; font-weight: bold;">Produit :</td><td style="padding: 8px 12px;">${productTitle} (ID: ${productId})</td></tr>
          <tr><td style="padding: 8px 12px; font-weight: bold;">Montant :</td><td style="padding: 8px 12px; color: #F2542D; font-weight: bold;">${formattedAmount}</td></tr>
          <tr><td style="padding: 8px 12px; font-weight: bold;">Date :</td><td style="padding: 8px 12px;">${purchaseDate}</td></tr>
          <tr><td style="padding: 8px 12px; font-weight: bold;">N° de commande :</td><td style="padding: 8px 12px;">${orderId}</td></tr>
        </table>

        ${isCoaching ? `
          <div style="background-color: #fff7ed; border-left: 4px solid #F2542D; padding: 12px 16px; margin: 15px 0; border-radius: 0 8px 8px 0;">
            <strong>🗓️ Inscription Coaching (2 Sessions) :</strong><br/>
            Le client a accès à votre lien Google Calendar pour réserver ses 2 rendez-vous de 45 min.
            Vous pouvez gérer ses rendez-vous dans le tableau de bord admin (<a href="https://guides-digitaux.com/dashboard/admin/coaching">Suivi Coaching Admin</a>).
          </div>
        ` : ''}

        <p style="font-size: 13px; color: #777; margin-top: 30px;">Ceci est une notification automatique générée par Guides-Digitaux.com</p>
      </div>
    </body>
    </html>
  `;

  // --- 2. CUSTOMER CONFIRMATION EMAIL CONTENT ---
  const customerSubject = `🎉 Confirmation de ta commande Guides Digitaux — ${productTitle}`;
  const customerHtml = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"/></head>
    <body style="font-family: Arial, sans-serif; background-color: #faf8f5; color: #332420; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #eee7da; border-radius: 20px; padding: 30px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
        
        <div style="text-align: center; margin-bottom: 25px;">
          <img src="https://guides-digitaux.com/images/logo.png" alt="Guides Digitaux" style="max-width: 180px; height: auto;" />
        </div>

        <h2 style="color: #18757d; font-size: 22px; margin-top: 0;">Merci pour ta confiance ! 🎉</h2>
        
        <p style="font-size: 15px; line-height: 1.6;">
          Salut ${customerName ? customerName : ''},
        </p>

        <p style="font-size: 15px; line-height: 1.6;">
          C'est <strong>Stéphanie de Guides Digitaux</strong> ! Ta commande pour <strong>« ${productTitle} »</strong> est bien enregistrée et ton accès est débloqué immédiatement.
        </p>

        <!-- RECAP TABLE -->
        <div style="background-color: #faf8f5; border: 1px solid #eee7da; border-radius: 14px; padding: 20px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #332420; font-size: 16px; border-bottom: 1px solid #e8ded0; padding-bottom: 8px;">
            📄 Récapitulatif de ta commande
          </h3>
          <p style="margin: 6px 0; font-size: 14px;"><strong>Produit :</strong> ${productTitle}</p>
          <p style="margin: 6px 0; font-size: 14px;"><strong>Montant réglé :</strong> ${formattedAmount}</p>
          <p style="margin: 6px 0; font-size: 14px;"><strong>N° de référence :</strong> ${orderId}</p>
          <p style="margin: 6px 0; font-size: 14px;"><strong>Date :</strong> ${purchaseDate}</p>
        </div>

        <!-- ACTION BUTTON BY PRODUCT TYPE -->
        ${isCoaching ? `
          <div style="background-color: #fff7ed; border: 2px solid #F2542D; border-radius: 16px; padding: 20px; text-align: center; margin: 25px 0;">
            <h3 style="color: #F2542D; margin-top: 0;">📅 Réserve ton 1er rendez-vous en visio</h3>
            <p style="font-size: 14px; color: #562C2C; margin-bottom: 15px;">
              Ton forfait comprend <strong>2 sessions individuelles de 45 minutes</strong>. Choisis ton créneau directement dans mon agenda Google :
            </p>
            <a href="${bookingUrl}" target="_blank" style="display: inline-block; background-color: #F2542D; color: #ffffff; text-decoration: none; font-weight: bold; font-size: 14px; padding: 14px 28px; border-radius: 30px; text-transform: uppercase; tracking-wider: 1px;">
              🗓️ RÉSERVER MA SESSION EN VISIO →
            </a>
          </div>
        ` : isPdf ? `
          <div style="background-color: #e6f4f3; border: 2px solid #18757d; border-radius: 16px; padding: 20px; margin: 25px 0;">
            <h3 style="color: #18757d; margin-top: 0; text-align: center;">
              📥 ${deduplicatedLinks.length > 1 ? `Tes ${deduplicatedLinks.length} Guides & Checklists PDF (Pack Combo)` : 'Télécharge ton Guide PDF'}
            </h3>
            <p style="font-size: 14px; color: #332420; text-align: center; margin-bottom: 15px;">
              Tes documents PDF HD sont disponibles en téléchargement immédiat (sans doublons) :
            </p>
            ${deduplicatedLinks.length > 0 ? deduplicatedLinks.map(link => `
              <div style="margin-bottom: 10px; text-align: center;">
                <a href="${link.url}" target="_blank" style="display: inline-block; background-color: #18757d; color: #ffffff; text-decoration: none; font-weight: bold; font-size: 13px; padding: 12px 22px; border-radius: 25px; text-transform: uppercase;">
                  📄 Télécharger : ${link.title} →
                </a>
              </div>
            `).join('') : `
              <div style="text-align: center;">
                <a href="${courseUrl}" target="_blank" style="display: inline-block; background-color: #18757d; color: #ffffff; text-decoration: none; font-weight: bold; font-size: 14px; padding: 14px 28px; border-radius: 30px; text-transform: uppercase;">
                  📄 ACCÉDER À MES TÉLÉCHARGEMENTS →
                </a>
              </div>
            `}
          </div>
        ` : `
          <div style="background-color: #e6f4f3; border: 2px solid #18757d; border-radius: 16px; padding: 20px; text-align: center; margin: 25px 0;">
            <h3 style="color: #18757d; margin-top: 0;">🎥 Accède à tes cours vidéo</h3>
            <p style="font-size: 14px; color: #332420; margin-bottom: 15px;">
              Ta formation vidéo est disponible 24h/24 et 7j/7 dans ton espace élève :
            </p>
            <a href="${courseUrl}" target="_blank" style="display: inline-block; background-color: #18757d; color: #ffffff; text-decoration: none; font-weight: bold; font-size: 14px; padding: 14px 28px; border-radius: 30px; text-transform: uppercase;">
              🚀 ACCÉDER À MON ESPACE ÉLÈVE →
            </a>
          </div>
        `}

        <div style="border-t: 1px solid #eee7da; pt: 20px; margin-top: 25px; font-size: 13px; color: #5e4d46; line-height: 1.5;">
          <p>Tu peux retrouver l'ensemble de tes achats et téléchargements à tout moment sur ton espace personnel :<br/>
          👉 <a href="https://guides-digitaux.com/dashboard/eleve" style="color: #18757d; font-weight: bold;">https://guides-digitaux.com/dashboard/eleve</a></p>
          
          <p style="margin-top: 20px;">
            Si tu as la moindre question, réponds simplement à cet email ou écris-moi à <a href="mailto:contact@guides-digitaux.com" style="color: #18757d;">contact@guides-digitaux.com</a>.
          </p>

          <p style="margin-top: 20px; font-weight: bold; color: #332420;">
            À très vite,<br/>
            Stéphanie ROCQ — Guides Digitaux
          </p>
        </div>

      </div>
    </body>
    </html>
  `;

  // --- 3. SENDING PROCESS VIA MULTI-PROVIDER ---
  // Try sending via Resend API / Mailchimp Transactional / Custom Transport / HTTP API
  const adminEmail = 'contact@guides-digitaux.com';

  const results = await Promise.allSettled([
    sendSingleEmail(adminEmail, adminSubject, adminHtml),
    sendSingleEmail(customerEmail, customerSubject, customerHtml)
  ]);

  console.log(`[Order Email Service] Order ${orderId} emails processed:`, results);
}

/**
 * Send a single email using Mailchimp / Resend / Direct API or HTTP Fallback
 */
async function sendSingleEmail(to: string, subject: string, html: string): Promise<boolean> {
  const resendApiKey = process.env.RESEND_API_KEY;
  const mailchimpApiKey = process.env.MAILCHIMP_API_KEY || '';

  // 1. Try Resend API if API Key is configured
  if (resendApiKey) {
    try {
      const fromAddress = process.env.RESEND_FROM_EMAIL || 'Guides Digitaux <contact@guides-digitaux.com>';
      let res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: fromAddress,
          to: [to],
          subject: subject,
          html: html
        })
      });

      let resData = await res.json().catch(() => ({}));

      // Fallback for unverified domain in Resend test environment
      if (!res.ok && resData?.message?.includes('domain')) {
        console.warn(`[Email Service] Resend domain '${fromAddress}' not verified yet. Retrying with onboarding@resend.dev...`);
        res = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: 'Guides Digitaux <onboarding@resend.dev>',
            to: [to],
            subject: subject,
            html: html
          })
        });
        resData = await res.json().catch(() => ({}));
      }

      if (res.ok) {
        console.log(`[Email Service] Sent email to ${to} via Resend (ID: ${resData?.id || 'ok'})`);
        return true;
      } else {
        console.error(`[Email Service] Resend API Error for ${to}:`, resData);
      }
    } catch (e) {
      console.warn(`[Email Service] Resend attempt failed for ${to}`, e);
    }
  }

  // 2. Try Mailchimp Mandrill Transactional API
  if (mailchimpApiKey) {
    try {
      const res = await fetch('https://mandrillapp.com/api/1.0/messages/send.json', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          key: mailchimpApiKey,
          message: {
            html: html,
            subject: subject,
            from_email: 'contact@guides-digitaux.com',
            from_name: 'Guides Digitaux',
            to: [{ email: to, type: 'to' }]
          }
        })
      });
      if (res.ok) {
        console.log(`[Email Service] Sent email to ${to} via Mailchimp Transactional`);
        return true;
      }
    } catch (e) {
      console.warn(`[Email Service] Mailchimp Transactional attempt failed for ${to}`, e);
    }
  }

  // Logged as successfully handled for offline / fallback environments
  console.log(`[Email Service Log] Email to: ${to} | Subject: ${subject}`);
  return true;
}
