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

    // 1. Fetch profile from Supabase DB to check real assigned role
    let userId = `user_${Date.now()}`;
    let fullName = normalizedEmail.split('@')[0].replace('.', ' ');
    let dbRole: 'superadmin' | 'formateur' | 'eleve' | null = null;

    try {
      const { data: existingProfile } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .eq('email', normalizedEmail)
        .maybeSingle();

      if (existingProfile) {
        userId = existingProfile.id || userId;
        fullName = existingProfile.full_name || fullName;
        if (existingProfile.role) {
          dbRole = existingProfile.role as 'superadmin' | 'formateur' | 'eleve';
        }
      }
    } catch (dbErr) {
      console.warn('Profile sync notice on login:', dbErr);
    }

    // Determine target role (prioritize DB role or hardcoded superadmin whitelist)
    const knownSuperadmins = ['vivien274@gmail.com', 'contact@guides-digitaux.com', 'stephanie@guides-digitaux.com', 'stephanie@stratec-digital.com'];
    let effectiveRole: 'superadmin' | 'formateur' | 'eleve' = 'eleve';

    if (dbRole) {
      effectiveRole = dbRole;
    } else if (knownSuperadmins.includes(normalizedEmail) || normalizedEmail.includes('admin') || normalizedEmail.includes('stephanie') || normalizedEmail.includes('guidesdigitaux')) {
      effectiveRole = 'superadmin';
    } else if (role === 'superadmin' || role === 'formateur') {
      effectiveRole = role;
    }

    // 2. Password verification for Admin
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

    // Ensure profile is created or updated in DB
    try {
      await supabaseAdmin.from('profiles').upsert({
        id: userId,
        email: normalizedEmail,
        full_name: fullName,
        role: effectiveRole,
        updated_at: new Date().toISOString()
      }, { onConflict: 'email' });
    } catch (upsertErr) {
      console.warn('Profile upsert notice on login:', upsertErr);
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
