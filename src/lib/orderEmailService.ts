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
  cartItems?: { id: string; title?: string; price?: number; downloadPdf?: string }[];
}

// Product download mapping helper for PDF items
const PDF_DOWNLOAD_LINKS: Record<string, { title: string; fileUrl: string }> = {
  'mini-guide-ecrire-web-artisan': {
    title: "Mini-guide : Écrire pour le web quand on est artisan",
    fileUrl: "/downloads/mini-guide-ecrire-web-artisan.pdf"
  },
  'mini-guide-comprendre-ses-stats-sans-etre-data-scientist': {
    title: "Mini-guide : Comprendre ses statistiques",
    fileUrl: "/downloads/1786958633139-mini-guide-comprendre-ses-stats-sans-etre-data-scientist.pdf"
  },
  'mini-guide-optimiser-ses-photos': {
    title: "Mini-guide : Optimiser ses photos sans perdre en qualité",
    fileUrl: "/downloads/1786958659305-mini-guide-optimiser-ses-photos-sans-perdre-en-qualite.pdf"
  },
  'mini-guide-seo-local': {
    title: "Mini-guide : SEO Local pour artisans",
    fileUrl: "/downloads/mini-guide-seo-local.pdf"
  },
  'ebook-visibilite-ligne-artisan': {
    title: "Ebook : Bien Démarrer sa Visibilité en Ligne Quand on est Artisan",
    fileUrl: "/downloads/ebook-visibilite-ligne-artisan.pdf"
  },
  'checklist-securite-anti-spam-wordpress': {
    title: "Checklist : Sécurité & Anti-Spam WordPress",
    fileUrl: "/downloads/1786958808414-checklist-securite-et-anti-spam-wordpress.pdf"
  },
  'checklist-les-principes-ux': {
    title: "Checklist : Les Principes Clés de l'UX (Expérience Utilisateur)",
    fileUrl: "/downloads/1786959220933-checklist-obligatoire-pour-ton-site-les-principes-cles-de-l-ux.pdf"
  },
  'checklist-profil-reseaux-sociaux': {
    title: "Checklist : Profil Réseaux Sociaux Pro",
    fileUrl: "/downloads/1786959425575-checklist-profil-pro-rs.pdf"
  },
  'checklist-verification-lancement-site': {
    title: "Checklist : À Vérifier avant le Lancement du Site",
    fileUrl: "/downloads/1786961163702-checklist-a-verifier-avant-le-lancement-du-site.pdf"
  },
  'checklist-google-business-profile': {
    title: "Checklist : Optimisation Google Business Profile",
    fileUrl: "/downloads/1786961735239-checklist-fiche-google.pdf"
  }
};

/**
 * Returns a deduplicated list of downloadable PDF files for a given product, bundle or cart items.
 */
export function getDeduplicatedDownloadLinksForProduct(
  productId: string, 
  payloadDownloadPdf?: string,
  cartItems?: { id: string; title?: string; downloadPdf?: string }[]
): { title: string; url: string }[] {
  const linksMap = new Map<string, { title: string; url: string }>();

  const addLink = (title: string, rawUrl?: string, targetId: string = productId) => {
    if (!rawUrl || !rawUrl.trim()) return;
    let url = rawUrl.trim();
    
    // Encrypt raw PDF path into secure URL (valid for 30 days in emails)
    let secureUrl = getEncryptedDownloadUrl(url, targetId, 720);
    if (secureUrl.startsWith('/')) {
      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || process.env.NEXT_PUBLIC_APP_URL || 'https://www.guides-digitaux.com';
      secureUrl = `${baseUrl}${secureUrl}`;
    }

    // Normalize URL key to remove duplicates (e.g. /downloads/file.pdf vs full http url)
    const filenameKey = url.split('/').pop()?.toLowerCase().split('?')[0] || url.toLowerCase();
    if (!linksMap.has(filenameKey)) {
      linksMap.set(filenameKey, { title, url: secureUrl });
    }
  };

  // If cartItems array provided, extract download links for each cart item
  if (Array.isArray(cartItems) && cartItems.length > 0) {
    for (const item of cartItems) {
      const itemProd = DEFAULT_PRODUCTS.find(p => p.id === item.id || p.slug === item.id);
      if (item.downloadPdf) {
        addLink(item.title || itemProd?.title || 'Fichier PDF', item.downloadPdf, item.id);
      }
      if (itemProd?.downloadPdf) {
        addLink(itemProd.title, itemProd.downloadPdf, item.id);
      }
      if (PDF_DOWNLOAD_LINKS[item.id]) {
        addLink(PDF_DOWNLOAD_LINKS[item.id].title, PDF_DOWNLOAD_LINKS[item.id].fileUrl, item.id);
      }
      if (item.id.includes('precommande') || item.id.includes('preorder') || item.id === 'precommande-fiche-google') {
        addLink('Bonus 1 : Checklist Audit Rapide Fiche Google', '/downloads/bonus-1-checklist-audit-fiche-google.pdf', item.id);
        addLink('Bonus 2 : Kit 10 Modèles Avis Google', '/downloads/bonus-2-kit-modeles-reponses-avis-google.pdf', item.id);
        addLink('Bonus 3 : Scripts WhatsApp & SMS Avis 5★', '/downloads/bonus-3-script-whatsapp-demander-avis-5-etoiles.pdf', item.id);
      }
    }
    if (linksMap.size > 0) {
      return Array.from(linksMap.values());
    }
  }

  const targetProd = DEFAULT_PRODUCTS.find(p => p.id === productId || p.slug === productId);

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

  // 3. Preorder bonus PDFs (e.g. Fiche Google Business Profile)
  if (productId.includes('precommande') || productId.includes('preorder') || productId === 'precommande-fiche-google') {
    addLink('Bonus 1 : Checklist Audit Rapide Fiche Google', '/downloads/bonus-1-checklist-audit-fiche-google.pdf');
    addLink('Bonus 2 : Kit 10 Modèles Avis Google', '/downloads/bonus-2-kit-modeles-reponses-avis-google.pdf');
    addLink('Bonus 3 : Scripts WhatsApp & SMS Avis 5★', '/downloads/bonus-3-script-whatsapp-demander-avis-5-etoiles.pdf');
  }

  // 4. Bundled custom items
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
  const isPreorder = productId.includes('precommande') || productId.includes('preorder') || productTitle.toLowerCase().includes('précommande') || productTitle.toLowerCase().includes('fiche google');
  const isFormation = (productId.includes('formation') || productId.includes('bundle') || productTitle.toLowerCase().includes('formation')) && !productId.includes('pack-guides') && !isPreorder;
  const isPdf = !isCoaching && !isFormation && !isPreorder;

  const deduplicatedLinks = getDeduplicatedDownloadLinksForProduct(productId, payload.downloadPdf, payload.cartItems);
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
          C'est <strong>Stéphanie de Guides Digitaux</strong> ! Ta précommande pour <strong>« ${productTitle} »</strong> est bien enregistrée.
        </p>

        <!-- RECAP TABLE -->
        <div style="background-color: #faf8f5; border: 1px solid #eee7da; border-radius: 14px; padding: 20px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #332420; font-size: 16px; border-bottom: 1px solid #e8ded0; padding-bottom: 8px;">
            📄 Récapitulatif de ta précommande
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
            <a href="${bookingUrl}" target="_blank" style="display: inline-block; background-color: #F2542D; color: #ffffff; text-decoration: none; font-weight: bold; font-size: 14px; padding: 14px 28px; border-radius: 30px; text-transform: uppercase;">
              🗓️ RÉSERVER MA SESSION EN VISIO →
            </a>
          </div>
        ` : isPreorder ? `
          <div style="background-color: #fff7ed; border-left: 4px solid #F2542D; border-radius: 0 14px 14px 0; padding: 16px 20px; margin: 20px 0;">
            <strong style="color: #562C2C; font-size: 14px;">🚀 Date de sortie officielle :</strong>
            <span style="font-size: 14px; color: #562C2C;">Le 15 septembre 2026. Tu recevras automatiquement par email ton guide complet dès sa parution.</span>
          </div>

          <div style="background-color: #e6f4f3; border: 2px solid #18757d; border-radius: 16px; padding: 20px; margin: 25px 0;">
            <h3 style="color: #18757d; margin-top: 0; text-align: center; font-size: 17px;">
              🎁 Tes 3 Bonus Exclusifs (Disponibles Immédiatement)
            </h3>
            <p style="font-size: 14px; color: #332420; text-align: center; margin-bottom: 18px;">
              En remerciement de ta précommande, voici tes 3 guides bonus prêts à être téléchargés :
            </p>
            ${deduplicatedLinks.map(link => `
              <div style="margin-bottom: 12px; text-align: center;">
                <a href="${link.url}" target="_blank" style="display: inline-block; width: 90%; max-width: 440px; background-color: #18757d; color: #ffffff; text-decoration: none; font-weight: bold; font-size: 13px; padding: 13px 20px; border-radius: 25px; text-transform: uppercase;">
                  📄 ${link.title} →
                </a>
              </div>
            `).join('')}
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

  const [adminRes, customerRes] = await Promise.all([
    sendSingleEmail(adminEmail, adminSubject, adminHtml),
    sendSingleEmail(customerEmail, customerSubject, customerHtml)
  ]);

  console.log(`[Order Email Service] Order ${orderId} emails processed. Admin: ${adminRes.ok ? 'OK' : adminRes.error}, Customer: ${customerRes.ok ? 'OK' : customerRes.error}`);

  return {
    success: customerRes.ok || adminRes.ok,
    adminStatus: adminRes,
    customerStatus: customerRes
  };
}

/**
 * Send a single email using Resend API / Mailchimp / Fallback
 */
async function sendSingleEmail(to: string, subject: string, html: string): Promise<{ ok: boolean; provider?: string; error?: string }> {
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
        return { ok: true, provider: 'resend' };
      } else {
        const errorMsg = resData?.message || `Resend error status ${res.status}`;
        console.error(`[Email Service] Resend API Error for ${to}:`, errorMsg);
        // Continue fallback
      }
    } catch (e: any) {
      console.warn(`[Email Service] Resend attempt failed for ${to}:`, e?.message || e);
    }
  }

  // 2. Try Mailchimp Mandrill Transactional API (if valid Mandrill key)
  if (mailchimpApiKey && mailchimpApiKey.startsWith('md-')) {
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
        return { ok: true, provider: 'mailchimp' };
      }
    } catch (e: any) {
      console.warn(`[Email Service] Mailchimp Transactional attempt failed for ${to}`, e);
    }
  }

  console.log(`[Email Service Log] Simulation mode or provider unverified for: ${to}`);
  return { ok: false, provider: 'none', error: 'Domaine Resend non vérifié ou clé d\'envoi absente dans .env' };
}
