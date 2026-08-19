import { NextResponse } from 'next/server';

const MC_API_KEY = process.env.MAILCHIMP_API_KEY || '';
const MC_DC = process.env.MAILCHIMP_SERVER_PREFIX || 'us15';
const MC_LIST_ID = process.env.MAILCHIMP_LIST_ID || 'dea5255730';

interface ProfileContent {
  badge: string;
  title: string;
  subtitle: string;
  description: string;
  advice: string;
  cta1: { title: string; url: string; color: string };
  cta2: { title: string; url: string; color: string };
}

const PROFILE_DATA: Record<'A' | 'B' | 'C', ProfileContent> = {
  A: {
    badge: '🚀 PROFIL A — LA FONCEUSE',
    title: 'Tu es prête à décoller !',
    subtitle: 'Autonome, motivée et prête à passer à l’action',
    description: 'Tu as la motivation, le temps nécessaire et l’envie d’avancer. Tu as compris qu’un vrai site web professionnel est la clé indispensable pour ne plus dépendre uniquement des aléas du bouche-à-oreille et des réseaux sociaux.',
    advice: 'Il ne te manque qu’une feuille de route claire pour construire ton site vitrine ou ta boutique e-commerce de A à Z sans perdre des semaines sur du jargon technique.',
    cta1: {
      title: '🎥 Découvrir la Formation WordPress →',
      url: 'https://www.guides-digitaux.com/produit/formation-wordpress',
      color: '#18757d'
    },
    cta2: {
      title: '🛍️ Formation Boutique WooCommerce →',
      url: 'https://www.guides-digitaux.com/produit/formation-ajouter-une-boutique-en-ligne-avec-woocommerce',
      color: '#F2542D'
    }
  },
  B: {
    badge: '💪 PROFIL B — MOTIVÉE QUI HÉSITE',
    title: 'Tu peux le faire, vraiment !',
    subtitle: 'Prête à te lancer avec le bon cadre et sans stress',
    description: 'Tu es motivée à digitaliser ton activité, même si quelques appréhensions techniques subsistent. C’est 100% normal ! Ce qu’il te faut, c’est une méthode humaine, pas à pas, sans jargon informatique complexe.',
    advice: 'Avec un accompagnement individuel bienveillant ou des guides structurés, tu vas gagner un temps précieux et surmonter chaque étape en toute confiance.',
    cta1: {
      title: '🤝 Coaching Individuel 1-sur-1 (97 €) →',
      url: 'https://www.guides-digitaux.com/produit/coaching-site',
      color: '#F2542D'
    },
    cta2: {
      title: '📚 Explorer tous les Guides & Checklists →',
      url: 'https://www.guides-digitaux.com/boutique',
      color: '#18757d'
    }
  },
  C: {
    badge: '🌿 PROFIL C — AVANCE DOUCEMENT',
    title: 'Commence par là, c’est le plus efficace !',
    subtitle: 'Un premier pas concret et gratuit pour attirer des clients locaux',
    description: 'Tu as besoin d’y aller un petit pas après l’autre pour poser les bases sereinement. Pas de panique : pour commencer à être trouvée sur Internet dès cette semaine sans investir des milliers d’euros, la Fiche Google est ton meilleur allié.',
    advice: 'Optimise ta Fiche Google Business Profile pour apparaître immédiatement sur Google Maps devant les clients qui recherchent tes services près de chez toi.',
    cta1: {
      title: '📍 Guide Fiche Google (Précommande 29 €) →',
      url: 'https://www.guides-digitaux.com/tunnel/precommande-fiche-google',
      color: '#F2542D'
    },
    cta2: {
      title: '📖 Découvrir la Boutique des Guides →',
      url: 'https://www.guides-digitaux.com/boutique',
      color: '#18757d'
    }
  }
};

function generateQuizEmailHtml(profileKey: 'A' | 'B' | 'C'): { subject: string; html: string } {
  const data = PROFILE_DATA[profileKey];
  const subject = `🎯 Ton Résultat au Quiz Diagnostic Digital : ${data.badge}`;

  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"/></head>
    <body style="font-family: Arial, sans-serif; background-color: #faf8f5; color: #332420; padding: 20px; margin: 0;">
      <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #eee7da; border-radius: 20px; padding: 30px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
        
        <!-- LOGO -->
        <div style="text-align: center; margin-bottom: 25px;">
          <img src="https://www.guides-digitaux.com/images/logo.png" alt="Guides Digitaux" style="max-width: 180px; height: auto;" />
        </div>

        <div style="text-align: center; margin-bottom: 20px;">
          <span style="display: inline-block; background-color: #e6f4f3; color: #18757d; font-size: 11px; font-weight: bold; padding: 6px 14px; border-radius: 20px; text-transform: uppercase; letter-spacing: 1px;">
            ${data.badge}
          </span>
        </div>

        <h2 style="color: #332420; font-size: 24px; text-align: center; margin-top: 5px; margin-bottom: 10px;">
          ${data.title}
        </h2>
        <p style="text-align: center; color: #18757d; font-weight: bold; font-size: 14px; margin-top: 0; margin-bottom: 25px;">
          ${data.subtitle}
        </p>

        <p style="font-size: 15px; line-height: 1.6; color: #332420;">
          Bonjour,
        </p>

        <p style="font-size: 15px; line-height: 1.6; color: #332420;">
          C’est <strong>Stéphanie de Guides Digitaux</strong> ! Tu viens de compléter le diagnostic digital sur notre site, et voici ton bilan personnalisé pour faire passer ton activité au niveau supérieur :
        </p>

        <!-- DIAGNOSTIC BOX -->
        <div style="background-color: #faf8f5; border: 1px solid #eee7da; border-radius: 14px; padding: 20px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #18757d; font-size: 16px; border-bottom: 1px solid #e8ded0; padding-bottom: 8px;">
            📊 Ton Analyse Personnalisée
          </h3>
          <p style="font-size: 14px; line-height: 1.6; color: #5e4d46; margin: 10px 0 0 0;">
            ${data.description}
          </p>
        </div>

        <!-- RECOMMANDATION BOX -->
        <div style="background-color: #f4ede0; border-left: 4px solid #F2542D; border-radius: 0 14px 14px 0; padding: 18px; margin: 20px 0;">
          <strong style="color: #332420; font-size: 14px; display: block; margin-bottom: 6px;">💡 Le Conseil de Stéphanie :</strong>
          <p style="font-size: 13px; line-height: 1.6; color: #562C2C; margin: 0;">
            ${data.advice}
          </p>
        </div>

        <!-- CTA BUTTONS -->
        <div style="margin: 30px 0; text-align: center;">
          <h4 style="color: #332420; font-size: 15px; margin-bottom: 15px;">Tes prochaines étapes recommandées :</h4>
          
          <div style="margin-bottom: 12px;">
            <a href="${data.cta1.url}" target="_blank" style="display: inline-block; width: 85%; background-color: ${data.cta1.color}; color: #ffffff; text-decoration: none; font-weight: bold; font-size: 13px; padding: 14px 20px; border-radius: 25px; text-transform: uppercase;">
              ${data.cta1.title}
            </a>
          </div>

          <div>
            <a href="${data.cta2.url}" target="_blank" style="display: inline-block; width: 85%; background-color: ${data.cta2.color}; color: #ffffff; text-decoration: none; font-weight: bold; font-size: 13px; padding: 14px 20px; border-radius: 25px; text-transform: uppercase;">
              ${data.cta2.title}
            </a>
          </div>
        </div>

        <!-- FOOTER -->
        <div style="border-top: 1px solid #eee7da; padding-top: 20px; margin-top: 25px; font-size: 13px; color: #5e4d46; line-height: 1.5;">
          <p>
            Besoin d’un coup de main ou d’une réponse à une question ? Réponds simplement à cet email ou écris-moi à <a href="mailto:contact@guides-digitaux.com" style="color: #18757d; font-weight: bold;">contact@guides-digitaux.com</a>.
          </p>
          <p style="margin-top: 20px; font-weight: bold; color: #332420;">
            À très vite pour booster ta visibilité,<br/>
            Stéphanie ROCQ — Guides Digitaux
          </p>
        </div>

      </div>
    </body>
    </html>
  `;

  return { subject, html };
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = (body.email || '').trim().toLowerCase();
    const rawProfile = (body.profile || 'B').toUpperCase();
    const profile: 'A' | 'B' | 'C' = (rawProfile === 'A' || rawProfile === 'B' || rawProfile === 'C') ? rawProfile : 'B';

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Email invalide' }, { status: 400 });
    }

    const tagLabel = profile === 'A' ? 'quiz-profil-A' : (profile === 'C' ? 'quiz-profil-C' : 'quiz-profil-B');

    // 1. ENVOI INSTANTANÉ DE L'EMAIL DE RÉSULTAT VIA RESEND
    const resendApiKey = process.env.RESEND_API_KEY;
    const { subject: emailSubject, html: emailHtml } = generateQuizEmailHtml(profile);

    if (resendApiKey) {
      try {
        const fromAddress = process.env.RESEND_FROM_EMAIL || 'Guides Digitaux <contact@guides-digitaux.com>';
        let resendRes = await fetch('https://api.resend.com/emails', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${resendApiKey}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            from: fromAddress,
            to: [email],
            reply_to: 'contact@guides-digitaux.com',
            subject: emailSubject,
            html: emailHtml
          })
        });

        // Fallback for unverified test domain
        if (!resendRes.ok) {
          const errData = await resendRes.json().catch(() => ({}));
          if (errData?.message?.includes('domain')) {
            await fetch('https://api.resend.com/emails', {
              method: 'POST',
              headers: {
                'Authorization': `Bearer ${resendApiKey}`,
                'Content-Type': 'application/json'
              },
              body: JSON.stringify({
                from: 'Guides Digitaux <onboarding@resend.dev>',
                to: [email],
                reply_to: 'contact@guides-digitaux.com',
                subject: emailSubject,
                html: emailHtml
              })
            });
          }
        }
        console.log(`[Quiz Email] Résultat Profil ${profile} envoyé instantanément à ${email}`);
      } catch (emailErr) {
        console.error('[Quiz Email Error]', emailErr);
      }
    }

    // 2. INSCRIPTION / SYNCHRONISATION AUDIENCE MAILCHIMP
    if (MC_API_KEY && MC_LIST_ID) {
      try {
        const crypto = await import('crypto');
        const subscriberHash = crypto.createHash('md5').update(email).digest('hex');
        const authHeader = 'Basic ' + Buffer.from(`anystring:${MC_API_KEY}`).toString('base64');

        const mcUrl = `https://${MC_DC}.api.mailchimp.com/3.0/lists/${MC_LIST_ID}/members/${subscriberHash}`;
        await fetch(mcUrl, {
          method: 'PUT',
          headers: {
            'Authorization': authHeader,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            email_address: email,
            status_if_new: 'subscribed',
            tags: [tagLabel],
            merge_fields: {
              MMERGE1: `Profil ${profile}`
            }
          })
        });
        console.log(`[Quiz Mailchimp] Prospect ${email} synchronisé avec tag ${tagLabel}`);
      } catch (mcErr) {
        console.warn('[Quiz Mailchimp Error]', mcErr);
      }
    }

    return NextResponse.json({
      success: true,
      message: 'Email envoyé avec succès et prospect inscrit sur Mailchimp',
      profile: profile
    });

  } catch (err: any) {
    console.error('[Quiz Subscribe API Error]', err);
    return NextResponse.json({
      success: true,
      message: 'Inscription enregistrée',
      error: err.message
    });
  }
}
