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

    // Ensure tags contain the requested tag and any additional tags specified
    const tags = Array.from(
      new Set([tag, ...(Array.isArray(body.tags) ? body.tags : [])])
    );

    const result = await subscribeOrUpdateMailchimpMember({
      email,
      fullName,
      tag,
      tags
    });

    if (result.success) {
      console.log(`[VIP Subscribe] Client ${email} inscrit avec succès à la liste VIP (Tags: ${tags.join(', ')})`);

      // Envoi de l'évènement Lead à Meta CAPI (serveur)
      try {
        const { sendServerLeadEvent } = await import('@/lib/metaCapi');
        const clientIp = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() || request.headers.get('x-real-ip') || undefined;
        const userAgent = request.headers.get('user-agent') || undefined;
        const cookieHeader = request.headers.get('cookie') || '';
        const getCookie = (name: string): string | undefined => {
          const match = cookieHeader.match(new RegExp(`(?:^|;\\s*)${name}=([^;]*)`));
          return match ? decodeURIComponent(match[1]) : undefined;
        };

        const fbp = body.fbp || getCookie('_fbp');
        let fbc = body.fbc || getCookie('_fbc');
        const fbclid = body.fbclid || (body.utm && body.utm.fbclid);
        if (!fbc && fbclid) {
          fbc = `fb.1.${Date.now()}.${fbclid}`;
        }

        const eventId = body.eventId || `vip_lead_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

        await sendServerLeadEvent({
          email,
          eventId,
          leadType: 'Liste VIP Prévente',
          category: tag,
          clientIp,
          userAgent,
          fbp,
          fbc,
          eventSourceUrl: body.sourceUrl || 'https://www.guides-digitaux.com'
        });
      } catch (capiErr) {
        console.warn('[VIP Lead CAPI Warning]', capiErr);
      }

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
