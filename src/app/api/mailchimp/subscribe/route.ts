import { NextResponse } from 'next/server';
import { subscribeOrUpdateMailchimpMember } from '@/lib/mailchimp';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const email = (body.email || '').trim().toLowerCase();
    const fullName = body.fullName || body.name || '';
    const tag = body.tag || 'prevente-gmb';
    const honeypot = body.honeypot || body.website;

    // Anti-Spam Honeypot Check
    if (honeypot && honeypot.trim() !== '') {
      console.warn(`[Anti-Spam VIP] Honeypot triggered for email: ${email}`);
      return NextResponse.json({
        success: true,
        message: 'Votre inscription à la Liste VIP a été enregistrée avec succès !'
      });
    }

    if (!email || !email.includes('@')) {
      return NextResponse.json(
        { error: 'Veuillez saisir une adresse email valide.' },
        { status: 400 }
      );
    }

    // Ensure tags contain both prevente-gmb and any custom tags specified
    const tags = Array.from(
      new Set([tag, 'prevente-gmb', 'prévente-GMB', ...(Array.isArray(body.tags) ? body.tags : [])])
    );

    const result = await subscribeOrUpdateMailchimpMember({
      email,
      fullName,
      tag,
      tags
    });

    if (result.success) {
      console.log(`[VIP Subscribe] Client ${email} inscrit avec succès à la liste VIP (Tags: ${tags.join(', ')})`);
      return NextResponse.json({
        success: true,
        message: 'Félicitations ! Tu es désormais inscrite sur la liste VIP Prévente GMB.'
      });
    } else {
      console.warn(`[VIP Subscribe Warning] Notice for ${email}:`, result.message);
      return NextResponse.json({
        success: true,
        message: 'Ton inscription VIP a bien été prise en compte !'
      });
    }
  } catch (error: any) {
    console.error('[API VIP Subscribe Error]', error);
    return NextResponse.json(
      { error: error.message || 'Erreur lors de l’inscription à la liste VIP' },
      { status: 500 }
    );
  }
}
