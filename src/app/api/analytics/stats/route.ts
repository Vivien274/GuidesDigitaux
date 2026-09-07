import { NextResponse } from 'next/server';
import { getAnalyticsStats } from '@/lib/analyticsStore';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const period = searchParams.get('period') || '7d';
    const stats = await getAnalyticsStats(period);
    return NextResponse.json(stats);
  } catch (error) {
    return NextResponse.json({
      success: false,
      summary: {
        totalVisitors: 0,
        totalPageViews: 0,
        pagesPerSession: '0',
        abandonedCartsCount: 0,
        abandonedTotalValue: 0,
        conversionRate: '0%'
      },
      topPages: [],
      trafficSources: [],
      deviceCounts: { desktop: 0, mobile: 0, tablet: 0 },
      abandonedCarts: []
    }, { status: 500 });
  }
}
