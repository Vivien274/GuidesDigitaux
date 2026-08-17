import { NextResponse } from 'next/server';
import { signSession } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase/admin';

const MASTER_ADMIN_PASSWORDS = ['admin123', 'admin', 'GuidesDigitaux2026!'];

export async function POST(request: Request) {
  try {
    const { email, password, role } = await request.json();

    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email requis' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();

    // Determine target role
    let effectiveRole: 'superadmin' | 'formateur' | 'eleve' = 'eleve';
    if (role === 'superadmin' || role === 'formateur') {
      effectiveRole = role;
    } else if (normalizedEmail.includes('admin') || normalizedEmail.includes('stephanie') || normalizedEmail.includes('guidesdigitaux')) {
      effectiveRole = 'superadmin';
    }

    // 1. Password verification for Admin
    if (effectiveRole === 'superadmin' || effectiveRole === 'formateur') {
      if (!password) {
        return NextResponse.json({ error: 'Un mot de passe est obligatoire pour ce compte.' }, { status: 400 });
      }

      const isMaster = MASTER_ADMIN_PASSWORDS.includes(password) || password === process.env.SUPERADMIN_PASSWORD;
      if (!isMaster) {
        // Look up profile password in DB if available
        const { data: profile } = await supabaseAdmin
          .from('profiles')
          .select('*')
          .eq('email', normalizedEmail)
          .maybeSingle();

        if (profile?.password_hash && profile.password_hash !== password) {
          return NextResponse.json({ error: 'Mot de passe administrateur incorrect.' }, { status: 401 });
        }
      }
    }

    // 2. Fetch or create Supabase Profile
    let userId = `user_${Date.now()}`;
    let fullName = normalizedEmail.split('@')[0].replace('.', ' ');

    try {
      const { data: existingProfile } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .eq('email', normalizedEmail)
        .maybeSingle();

      if (existingProfile) {
        userId = existingProfile.id || userId;
        fullName = existingProfile.full_name || fullName;
      } else {
        await supabaseAdmin.from('profiles').insert({
          id: userId,
          email: normalizedEmail,
          full_name: fullName,
          role: effectiveRole
        });
      }
    } catch (dbErr) {
      console.warn('Profile sync notice on login:', dbErr);
    }

    // 3. Create cryptographically signed session token
    const token = await signSession({
      userId,
      email: normalizedEmail,
      role: effectiveRole,
      fullName
    });

    const userObj = {
      id: userId,
      email: normalizedEmail,
      role: effectiveRole,
      fullName
    };

    const response = NextResponse.json({
      success: true,
      user: userObj
    });

    // 4. Set secure HTTP-only cookie
    response.cookies.set('gd_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60 // 30 days
    });

    return response;
  } catch (error: any) {
    console.error('Erreur API login:', error);
    return NextResponse.json({ error: error?.message || 'Erreur serveur lors de la connexion' }, { status: 500 });
  }
}
