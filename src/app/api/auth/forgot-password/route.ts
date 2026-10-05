import { NextRequest, NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { signSession } from '@/lib/auth';

export const dynamic = 'force-dynamic';

async function sendResetEmail(to: string, resetUrl: string): Promise<boolean> {
  const resendApiKey = process.env.RESEND_API_KEY;
  if (!resendApiKey) {
    console.warn('[Forgot Password] RESEND_API_KEY non configurée.');
    return false;
  }

  const html = `
    <!DOCTYPE html>
    <html>
    <head><meta charset="utf-8"/></head>
    <body style="font-family: Arial, sans-serif; background-color: #faf8f5; color: #332420; padding: 20px;">
      <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border: 1px solid #eee7da; border-radius: 20px; padding: 30px; box-shadow: 0 4px 12px rgba(0,0,0,0.05);">
        <div style="text-align: center; margin-bottom: 25px;">
          <img src="https://www.guides-digitaux.com/images/logo.png" alt="Guides Digitaux" style="max-width: 180px; height: auto;" />
        </div>

        <h2 style="color: #18757d; font-size: 22px; margin-top: 0; text-align: center;">
          🔑 Accès à ton Espace Membre
        </h2>

        <p style="font-size: 15px; line-height: 1.6;">Bonjour,</p>

        <p style="font-size: 15px; line-height: 1.6;">
          Tu as demandé à définir ou réinitialiser le mot de passe de ton compte sur <strong>Guides Digitaux</strong>.
        </p>

        <div style="text-align: center; margin: 30px 0;">
          <a href="${resetUrl}" target="_blank" style="display: inline-block; background-color: #18757d; color: #ffffff; text-decoration: none; font-weight: bold; font-size: 14px; padding: 14px 30px; border-radius: 30px; text-transform: uppercase;">
            👉 Définir mon mot de passe →
          </a>
        </div>

        <p style="font-size: 13px; color: #777; line-height: 1.5;">
          Ce lien sécurisé est valable pendant <strong>2 heures</strong>.<br/>
          Si tu n'es pas à l'origine de cette demande, tu peux simplement ignorer cet e-mail en toute sécurité.
        </p>

        <div style="border-top: 1px solid #eee7da; margin-top: 25px; padding-top: 20px; font-size: 12px; color: #999;">
          Guides Digitaux • Formations et guides pratiques pour artisans et créateurs.<br/>
          Besoin d'aide ? Écris-nous à <a href="mailto:contact@guides-digitaux.com" style="color: #18757d;">contact@guides-digitaux.com</a>
        </div>
      </div>
    </body>
    </html>
  `;

  const fromCandidates = [
    process.env.RESEND_FROM_EMAIL || 'Guides Digitaux <contact@guides-digitaux.com>',
    'Guides Digitaux <contact@send.guides-digitaux.com>',
    'Guides Digitaux <stephanie@guides-digitaux.com>',
    'Guides Digitaux <onboarding@resend.dev>'
  ];

  for (const fromEmail of fromCandidates) {
    try {
      const res = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${resendApiKey}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          from: fromEmail,
          to: [to],
          subject: '🔑 Réinitialisation de ton mot de passe — Guides Digitaux',
          html
        })
      });

      if (res.ok) {
        return true;
      }
    } catch (e) {
      console.warn(`[Forgot Password] Échec avec '${fromEmail}':`, e);
    }
  }

  return false;
}

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ error: 'Adresse e-mail invalide.' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Check if user exists in profiles, orders, enrollments, or preorder_buyers
    const [{ data: profile }, { data: order }, { data: enrollment }, { data: preorder }] = await Promise.all([
      supabaseAdmin.from('profiles').select('id, email, full_name, role').eq('email', normalizedEmail).maybeSingle(),
      supabaseAdmin.from('orders').select('id, customer_email').eq('customer_email', normalizedEmail).limit(1).maybeSingle(),
      supabaseAdmin.from('enrollments').select('id, user_email').eq('user_email', normalizedEmail).limit(1).maybeSingle(),
      supabaseAdmin.from('preorder_buyers').select('id, customer_email').eq('customer_email', normalizedEmail).limit(1).maybeSingle(),
    ]);

    const userExists = !!(profile || order || enrollment || preorder);

    // If user exists, generate signed token and send reset email
    if (userExists) {
      const userId = profile?.id || `user_${Date.now()}`;
      const fullName = profile?.full_name || normalizedEmail.split('@')[0];
      const role = profile?.role === 'superadmin' ? 'superadmin' : (profile?.role === 'formateur' ? 'formateur' : 'eleve');

      // Valid for 2 hours (0.083 days)
      const token = await signSession(
        { userId, email: normalizedEmail, role, fullName },
        undefined,
        0.083
      );

      const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://www.guides-digitaux.com';
      const resetUrl = `${baseUrl}/mon-compte/reinitialisation?token=${encodeURIComponent(token)}`;

      await sendResetEmail(normalizedEmail, resetUrl);
    }

    // Always return success message to protect privacy / prevent email harvesting
    return NextResponse.json({
      success: true,
      message: 'Si cette adresse correspond à un compte, un lien de réinitialisation sécurisé vous a été envoyé par e-mail.'
    });

  } catch (error: unknown) {
    console.error('[Forgot Password API] Erreur:', error);
    return NextResponse.json({ error: 'Erreur lors de la demande de réinitialisation.' }, { status: 500 });
  }
}
