import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { verifySession } from '@/lib/auth';

export async function GET(request: NextRequest) {
  const token = request.cookies.get('gd_session')?.value;
  if (!token) {
    return NextResponse.json({ authenticated: false, user: null });
  }

  const session = await verifySession(token);
  if (!session) {
    const response = NextResponse.json({ authenticated: false, user: null });
    response.cookies.delete('gd_session');
    return response;
  }

  return NextResponse.json({
    authenticated: true,
    user: {
      id: session.userId,
      email: session.email,
      fullName: session.fullName,
      role: session.role
    }
  });
}
