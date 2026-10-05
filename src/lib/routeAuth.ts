import { cookies } from 'next/headers';
import { verifySession, type SessionData } from '@/lib/auth';

export async function getRequestSession(): Promise<SessionData | null> {
  const cookieStore = await cookies();
  return verifySession(cookieStore.get('gd_session')?.value);
}

export async function getAdminSession(): Promise<SessionData | null> {
  const session = await getRequestSession();

  if (!session || !['superadmin', 'formateur'].includes(session.role)) {
    return null;
  }

  return session;
}
