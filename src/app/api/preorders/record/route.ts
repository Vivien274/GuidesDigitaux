import { NextResponse } from 'next/server';
import { supabaseAdmin } from '@/lib/supabase/admin';

export async function POST(request: Request) {
  try {
    const { campaignId = 'precommande-fiche-google', customerEmail, customerName, price = 29, orderId } = await request.json();

    if (!customerEmail || !customerEmail.includes('@')) {
      return NextResponse.json({ error: 'Email client valide requis' }, { status: 400 });
    }

    const normalizedEmail = customerEmail.toLowerCase().trim();
    const targetCampaign = campaignId || 'precommande-fiche-google';
    const finalPrice = Number(price) || 29;

    // 1. Déduplication serveur avec droits Admin (bypassing RLS)
    const { data: existing, error: selectErr } = await supabaseAdmin
      .from('preorder_buyers')
      .select('id')
      .eq('customer_email', normalizedEmail)
      .eq('campaign_id', targetCampaign)
      .maybeSingle();

    if (existing) {
      return NextResponse.json({ 
        success: true, 
        alreadyRecorded: true, 
        message: 'Précommande déjà enregistrée pour cet email.' 
      });
    }

    // 2. Insertion dans preorder_buyers
    const { data: insertedBuyer, error: insertErr } = await supabaseAdmin
      .from('preorder_buyers')
      .insert({
        campaign_id: targetCampaign,
        customer_email: normalizedEmail,
        customer_name: customerName || normalizedEmail.split('@')[0],
        price: finalPrice,
        created_at: new Date().toISOString()
      })
      .select()
      .single();

    if (insertErr) {
      console.error('[API Preorders Record] Erreur insertion preorder_buyers:', insertErr);
      return NextResponse.json({ error: insertErr.message }, { status: 500 });
    }

    // 3. Mise à jour ou insertion dans la table orders si absente
    try {
      const { data: existingOrder } = await supabaseAdmin
        .from('orders')
        .select('id')
        .eq('customer_email', normalizedEmail)
        .eq('product_id', targetCampaign)
        .maybeSingle();

      if (!existingOrder) {
        await supabaseAdmin.from('orders').insert({
          customer_email: normalizedEmail,
          product_id: targetCampaign,
          amount: finalPrice,
          currency: 'eur',
          status: 'paid',
          stripe_session_id: orderId || `sess_po_${Date.now()}`,
          created_at: new Date().toISOString()
        });
      }
    } catch (ordErr) {
      console.warn('[API Preorders Record] Notice insert order:', ordErr);
    }

    return NextResponse.json({ 
      success: true, 
      inserted: true, 
      buyerId: insertedBuyer?.id 
    });

  } catch (err: any) {
    console.error('Erreur API /api/preorders/record:', err);
    return NextResponse.json({ error: err?.message || 'Erreur interne' }, { status: 500 });
  }
}
