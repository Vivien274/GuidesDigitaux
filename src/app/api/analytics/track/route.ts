import { NextResponse } from 'next/server';
import { recordAnalyticsEvent } from '@/lib/analyticsStore';

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await recordAnalyticsEvent(body);
    return NextResponse.json({ success: true });
  } catch (error) {
    return NextResponse.json({ success: false, error: 'Invalid payload' }, { status: 400 });
  }
}
