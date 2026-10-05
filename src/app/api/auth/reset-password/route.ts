import { NextRequest, NextResponse } from 'next/server';
import type { User } from '@supabase/supabase-js';
import { verifySession, signSession } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

async function findAuthUser(email: string): Promise<User | null> {
  const { data, error } = await supabaseAdmin.auth.admin.listUsers({ page: 1, perPage: 1000 });
  if (error) throw error;
  return data.users.find(user => user.email?.toLowerCase().trim() === email) ?? null;
}

async function ensureAuthUser(email: string, password: string): Promise<User> {
  const existingUser = await findAuthUser(email);
  if (existingUser) {
    const { data, error } = await supabaseAdmin.auth.admin.updateUserById(existingUser.id, { password });
    if (error || !data.user) throw error || new Error('Compte Auth introuvable.');
    return data.user;
  }

  const { data, error } = await supabaseAdmin.auth.admin.createUser({
    email,
    password,
    email_confirm: true,
  });
  if (error || !data.user) throw error || new Error('Création du compte Auth impossible.');
  return data.user;
}

export async function POST(request: NextRequest) {
  try {
    const { token, password } = await request.json();
    if (!token || typeof token !== 'string') {
      return NextResponse.json({ error: 'Jeton de réinitialisation requis.' }, { status: 400 });
    }
    if (!password || typeof password !== 'string' || password.length < 8) {
      return NextResponse.json({ error: 'Le mot de passe doit comporter au moins 8 caractères.' }, { status: 400 });
    }

    const session = await verifySession(token);
    if (!session || !session.email) {
      return NextResponse.json({ error: 'Le lien de réinitialisation est invalide ou a expiré. Veuillez refaire une demande.' }, { status: 400 });
    }

    const normalizedEmail = session.email.toLowerCase().trim();

    // Update password in Supabase Auth
    const authUser = await ensureAuthUser(normalizedEmail, password);

    // Sign a fresh full 30-day session token
    const newSessionToken = await signSession({
      userId: authUser.id,
      email: normalizedEmail,
      role: session.role || 'eleve',
      fullName: session.fullName || normalizedEmail.split('@')[0],
    });

    const response = NextResponse.json({
      success: true,
      message: 'Mot de passe mis à jour avec succès.',
      user: {
        id: authUser.id,
        email: normalizedEmail,
        role: session.role || 'eleve',
        fullName: session.fullName || normalizedEmail.split('@')[0],
      }
    });

    response.cookies.set('gd_session', newSessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60,
    });

    return response;

  } catch (error: unknown) {
    console.error('[Reset Password API] Erreur:', error);
    return NextResponse.json({ error: 'Erreur serveur lors de la mise à jour du mot de passe.' }, { status: 500 });
  }
}
