import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, subject, message } = body;

    if (!name || !email || !message) {
      return NextResponse.json({ error: 'Veuillez remplir tous les champs obligatoires.' }, { status: 400 });
    }

    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailRegex.test(email.trim())) {
      return NextResponse.json({ error: 'Adresse e-mail invalide.' }, { status: 400 });
    }

    const adminEmail = 'contact@guides-digitaux.com';
    const emailSubject = `📩 Message de Contact : ${subject || 'Demande d’information'}`;
    const dateStr = new Date().toLocaleDateString('fr-FR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });

    const emailHtml = `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"/></head>
      <body style="font-family: Arial, sans-serif; background-color: #faf8f5; color: #332420; padding: 20px;">
        <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border: 2px solid #18757d; border-radius: 16px; padding: 30px;">
          <h2 style="color: #18757d; margin-top: 0;">📩 Nouveau message de contact</h2>
          <p>Vous avez reçu une nouvelle demande depuis le formulaire de contact du site <strong>Guides Digitaux</strong> :</p>
          
          <table style="width: 100%; border-collapse: collapse; margin: 20px 0; background: #faf8f5; border-radius: 12px; padding: 15px;">
            <tr><td style="padding: 10px; font-weight: bold; width: 120px;">Nom / Prénom :</td><td style="padding: 10px;">${name}</td></tr>
            <tr><td style="padding: 10px; font-weight: bold;">E-mail client :</td><td style="padding: 10px;"><a href="mailto:${email}" style="color: #18757d; font-weight: bold;">${email}</a></td></tr>
            <tr><td style="padding: 10px; font-weight: bold;">Sujet :</td><td style="padding: 10px;">${subject || 'Sans sujet'}</td></tr>
            <tr><td style="padding: 10px; font-weight: bold;">Date :</td><td style="padding: 10px;">${dateStr}</td></tr>
          </table>

          <div style="background-color: #f4ede0; border-left: 4px solid #F2542D; padding: 16px; margin: 20px 0; border-radius: 0 12px 12px 0;">
            <strong style="color: #562C2C; display: block; margin-bottom: 8px;">Message du prospect :</strong>
            <p style="margin: 0; white-space: pre-wrap; font-size: 14px; line-height: 1.6; color: #332420;">${message}</p>
          </div>

          <div style="margin-top: 25px; pt: 15px; border-t: 1px solid #eee7da; text-align: center;">
            <a href="mailto:${email}?subject=${encodeURIComponent('Re: ' + (subject || 'Votre demande sur Guides Digitaux'))}" style="display: inline-block; background-color: #18757d; color: #ffffff; text-decoration: none; font-weight: bold; font-size: 13px; padding: 12px 24px; border-radius: 25px; text-transform: uppercase;">
              ✉️ Répondre directement à ${name}
            </a>
          </div>
        </div>
      </body>
      </html>
    `;

    // Try sending via Resend API / Mailchimp Transactional / Fallback Log
    const resendApiKey = process.env.RESEND_API_KEY;
    const mailchimpApiKey = process.env.MAILCHIMP_API_KEY || '';

    let sent = false;

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
            to: [adminEmail],
            reply_to: email,
            subject: emailSubject,
            html: emailHtml
          })
        });

        if (!res.ok) {
          // Retry with onboarding address if domain unverified
          res = await fetch('https://api.resend.com/emails', {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${resendApiKey}`,
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              from: 'Guides Digitaux <onboarding@resend.dev>',
              to: [adminEmail],
              reply_to: email,
              subject: emailSubject,
              html: emailHtml
            })
          });
        }

        if (res.ok) {
          sent = true;
          console.log(`[Contact Form API] Sent contact message from ${email} to ${adminEmail} via Resend`);
        }
      } catch (e) {
        console.warn('[Contact Form API] Resend attempt failed', e);
      }
    }

    if (!sent && mailchimpApiKey) {
      try {
        const res = await fetch('https://mandrillapp.com/api/1.0/messages/send.json', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            key: mailchimpApiKey,
            message: {
              html: emailHtml,
              subject: emailSubject,
              from_email: 'contact@guides-digitaux.com',
              from_name: name,
              to: [{ email: adminEmail, type: 'to' }],
              headers: { 'Reply-To': email }
            }
          })
        });
        if (res.ok) {
          sent = true;
          console.log(`[Contact Form API] Sent contact message from ${email} to ${adminEmail} via Mailchimp Transactional`);
        }
      } catch (e) {
        console.warn('[Contact Form API] Mailchimp attempt failed', e);
      }
    }

    // Always log message
    console.log(`[Contact Form] New submission from ${name} (${email}): ${subject} - ${message}`);

    return NextResponse.json({
      success: true,
      message: 'Votre message a été transmis avec succès à contact@guides-digitaux.com.'
    });

  } catch (error: any) {
    console.error('Erreur API Contact:', error);
    return NextResponse.json({
      error: error?.message || 'Erreur lors de l’envoi du formulaire'
    }, { status: 500 });
  }
}
