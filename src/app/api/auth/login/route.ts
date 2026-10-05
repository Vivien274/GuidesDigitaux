import { NextResponse } from 'next/server';
import crypto from 'crypto';
import type { User } from '@supabase/supabase-js';
import { signSession, type SessionData } from '@/lib/auth';
import { supabaseAdmin } from '@/lib/supabase/admin';
import { stripe } from '@/lib/stripe/client';

interface ProfileRow {
  id: string;
  email: string;
  full_name: string | null;
  role: string | null;
  auth_user_id?: string | null;
}

function secretsMatch(provided: string, expected: string): boolean {
  const providedBuffer = Buffer.from(provided);
  const expectedBuffer = Buffer.from(expected);
  return providedBuffer.length === expectedBuffer.length && crypto.timingSafeEqual(providedBuffer, expectedBuffer);
}

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

export async function POST(request: Request) {
  try {
    const { email, password, checkoutSessionId } = await request.json();
    if (!email || typeof email !== 'string') {
      return NextResponse.json({ error: 'Email requis.' }, { status: 400 });
    }
    if (!password || typeof password !== 'string' || password.length < 8) {
      return NextResponse.json({ error: 'Le mot de passe doit contenir au moins 8 caractères.' }, { status: 400 });
    }

    const normalizedEmail = email.toLowerCase().trim();
    const { data: rawProfile, error: profileError } = await supabaseAdmin
      .from('profiles')
      .select('*')
      .eq('email', normalizedEmail)
      .maybeSingle();
    if (profileError) throw profileError;

    const existingProfile = rawProfile as ProfileRow | null;
    const storedRole = existingProfile?.role;
    const effectiveRole: SessionData['role'] =
      storedRole === 'superadmin' || storedRole === 'formateur' ? storedRole : 'eleve';

    let authUser: User | null = null;

    if (effectiveRole === 'superadmin' || effectiveRole === 'formateur') {
      const adminPassword = process.env.SUPERADMIN_PASSWORD;
      if (!adminPassword || adminPassword.length < 12 || !secretsMatch(password, adminPassword)) {
        return NextResponse.json({ error: 'Identifiants incorrects.' }, { status: 401 });
      }
      authUser = await ensureAuthUser(normalizedEmail, password);
    }

    let { data: authData, error: signInError } = await supabaseAdmin.auth.signInWithPassword({
      email: normalizedEmail,
      password,
    });

    if (
      signInError &&
      effectiveRole === 'eleve' &&
      typeof checkoutSessionId === 'string' &&
      checkoutSessionId.startsWith('cs_')
    ) {
      const checkoutSession = await stripe.checkout.sessions.retrieve(checkoutSessionId);
      const paidEmail = (checkoutSession.customer_details?.email || checkoutSession.customer_email || '')
        .toLowerCase()
        .trim();

      if (checkoutSession.payment_status === 'paid' && paidEmail === normalizedEmail) {
        authUser = await ensureAuthUser(normalizedEmail, password);
        ({ data: authData, error: signInError } = await supabaseAdmin.auth.signInWithPassword({
          email: normalizedEmail,
          password,
        }));
      }
    }

    if (signInError || !authData.user || !authData.session) {
      // Check if customer exists in orders, enrollments or preorders to provide helpful first-login guidance
      const [{ data: order }, { data: enrollment }, { data: preorder }] = await Promise.all([
        supabaseAdmin.from('orders').select('id').eq('customer_email', normalizedEmail).limit(1).maybeSingle(),
        supabaseAdmin.from('enrollments').select('id').eq('user_email', normalizedEmail).limit(1).maybeSingle(),
        supabaseAdmin.from('preorder_buyers').select('id').eq('customer_email', normalizedEmail).limit(1).maybeSingle(),
      ]);

      if (order || enrollment || preorder) {
        return NextResponse.json({
          error: 'Identifiants incorrects. Si vous n\'avez pas encore défini votre mot de passe après commande, cliquez sur « Mot de passe oublié ? » ci-dessous pour l\'activer.'
        }, { status: 401 });
      }

      return NextResponse.json({ error: 'Identifiants incorrects.' }, { status: 401 });
    }

    authUser = authUser || authData.user;
    const fullName = existingProfile?.full_name || normalizedEmail.split('@')[0].replace('.', ' ');

    if (existingProfile) {
      const { error: linkError } = await supabaseAdmin
        .from('profiles')
        .update({ auth_user_id: authUser.id })
        .eq('id', existingProfile.id);
      if (linkError) throw linkError;
    } else {
      const { error: createProfileError } = await supabaseAdmin.from('profiles').insert({
        id: authUser.id,
        auth_user_id: authUser.id,
        email: normalizedEmail,
        full_name: fullName,
        role: 'eleve',
      });
      if (createProfileError) throw createProfileError;
    }

    const token = await signSession({
      userId: authUser.id,
      email: normalizedEmail,
      role: effectiveRole,
      fullName,
    });

    const response = NextResponse.json({
      success: true,
      user: {
        id: authUser.id,
        email: normalizedEmail,
        role: effectiveRole,
        fullName,
      },
      supabaseSession: {
        access_token: authData.session.access_token,
        refresh_token: authData.session.refresh_token,
      },
    });

    response.cookies.set('gd_session', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 30 * 24 * 60 * 60,
    });

    return response;
  } catch (error: unknown) {
    console.error('Erreur API login:', error);
    return NextResponse.json({ error: 'Erreur serveur lors de la connexion.' }, { status: 500 });
  }
}
