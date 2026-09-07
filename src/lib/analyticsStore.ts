import { createClient } from '@supabase/supabase-js';

export interface AnalyticsEvent {
  id: string;
  timestamp: number;
  event_type: 'page_view' | 'cart_update';
  session_id: string;
  page_path: string;
  page_title?: string;
  referrer?: string;
  referrer_category?: string;
  device_type?: 'desktop' | 'mobile' | 'tablet';
  user_agent?: string;
  cart_items?: Array<{ id: string; title: string; price: number }>;
}

interface AnalyticsStore {
  events: AnalyticsEvent[];
}

declare global {
  var gdAnalyticsStore: AnalyticsStore | undefined;
}

if (!globalThis.gdAnalyticsStore) {
  globalThis.gdAnalyticsStore = {
    events: []
  };
}

const store = globalThis.gdAnalyticsStore;

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://kvnvfsahoblmcpurnmtn.supabase.co';
const supabaseKey = (process.env.SUPABASE_SERVICE_ROLE_KEY && process.env.SUPABASE_SERVICE_ROLE_KEY.trim())
  ? process.env.SUPABASE_SERVICE_ROLE_KEY
  : (process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'sb_publishable_KeSeRmMGA6zii9el1d_uBQ_piquLdfi');

const supabase = createClient(supabaseUrl, supabaseKey);

export async function recordAnalyticsEvent(eventData: Partial<AnalyticsEvent>) {
  const event: AnalyticsEvent = {
    id: `evt-${Date.now()}-${Math.random().toString(36).substring(2, 7)}`,
    timestamp: Date.now(),
    event_type: eventData.event_type || 'page_view',
    session_id: eventData.session_id || 'anon',
    page_path: eventData.page_path || '/',
    page_title: eventData.page_title,
    referrer: eventData.referrer,
    referrer_category: eventData.referrer_category || 'Accès Direct',
    device_type: eventData.device_type || 'desktop',
    user_agent: eventData.user_agent,
    cart_items: eventData.cart_items || []
  };

  store.events.push(event);

  // Limit memory store to last 10,000 events
  if (store.events.length > 10000) {
    store.events = store.events.slice(-10000);
  }

  // Optionally try to record to Supabase analytics_events table (fail silently if table not created yet)
  try {
    await supabase.from('analytics_events').insert({
      event_type: event.event_type,
      session_id: event.session_id,
      page_path: event.page_path,
      page_title: event.page_title,
      referrer: event.referrer,
      referrer_category: event.referrer_category,
      device_type: event.device_type,
      cart_items: event.cart_items,
      created_at: new Date(event.timestamp).toISOString()
    });
  } catch (err) {
    // Silent catch if table does not exist
  }
}

export async function getAnalyticsStats(period: string = '7d') {
  const now = Date.now();
  let cutoff = 0;

  if (period === '24h') {
    cutoff = now - 24 * 60 * 60 * 1000;
  } else if (period === '7d') {
    cutoff = now - 7 * 24 * 60 * 60 * 1000;
  } else if (period === '30d') {
    cutoff = now - 30 * 24 * 60 * 60 * 1000;
  } else {
    cutoff = 0; // All time
  }

  // Try fetching from Supabase first
  let dbEvents: AnalyticsEvent[] = [];
  try {
    const { data } = await supabase
      .from('analytics_events')
      .select('*')
      .gte('created_at', new Date(cutoff).toISOString())
      .order('created_at', { ascending: false });

    if (data && data.length > 0) {
      dbEvents = data.map((d: any) => ({
        id: d.id || `db-${d.created_at}`,
        timestamp: new Date(d.created_at).getTime(),
        event_type: d.event_type || 'page_view',
        session_id: d.session_id,
        page_path: d.page_path,
        page_title: d.page_title,
        referrer: d.referrer,
        referrer_category: d.referrer_category || 'Accès Direct',
        device_type: d.device_type || 'desktop',
        cart_items: d.cart_items || []
      }));
    }
  } catch (e) {}

  // Combine DB events with in-memory store events (de-duplicating by id)
  const combinedMap = new Map<string, AnalyticsEvent>();
  store.events.forEach(e => {
    if (e.timestamp >= cutoff) combinedMap.set(e.id, e);
  });
  dbEvents.forEach(e => {
    if (e.timestamp >= cutoff) combinedMap.set(e.id, e);
  });

  const filteredEvents = Array.from(combinedMap.values());

  const pageViewEvents = filteredEvents.filter(e => e.event_type === 'page_view');
  const totalPageViews = pageViewEvents.length;

  const sessionsSet = new Set(pageViewEvents.map(e => e.session_id));
  const totalVisitors = sessionsSet.size;

  const pagesPerSession = totalVisitors > 0 ? (totalPageViews / totalVisitors).toFixed(1) : '0';

  // Device Breakdown
  const deviceCounts = { desktop: 0, mobile: 0, tablet: 0 };
  pageViewEvents.forEach(e => {
    const dev = e.device_type || 'desktop';
    if (dev in deviceCounts) {
      deviceCounts[dev as keyof typeof deviceCounts] += 1;
    } else {
      deviceCounts.desktop += 1;
    }
  });

  // Top Pages
  const pageMap = new Map<string, { title: string; views: number }>();
  pageViewEvents.forEach(e => {
    const path = e.page_path || '/';
    const title = e.page_title || path;
    const existing = pageMap.get(path);
    if (existing) {
      existing.views += 1;
    } else {
      pageMap.set(path, { title, views: 1 });
    }
  });

  const topPages = Array.from(pageMap.entries())
    .map(([path, info]) => ({
      path,
      title: info.title,
      views: info.views,
      percentage: totalPageViews > 0 ? Math.round((info.views / totalPageViews) * 100) : 0
    }))
    .sort((a, b) => b.views - a.views)
    .slice(0, 10);

  // Traffic Sources
  const sourceMap = new Map<string, number>();
  pageViewEvents.forEach(e => {
    const cat = e.referrer_category || 'Accès Direct';
    sourceMap.set(cat, (sourceMap.get(cat) || 0) + 1);
  });

  const trafficSources = Array.from(sourceMap.entries())
    .map(([category, count]) => ({
      category,
      count,
      percentage: totalPageViews > 0 ? Math.round((count / totalPageViews) * 100) : 0
    }))
    .sort((a, b) => b.count - a.count);

  // Cart Abandonments
  const cartEvents = filteredEvents.filter(e => e.event_type === 'cart_update');
  const abandonedCartsMap = new Map<string, AnalyticsEvent>();
  cartEvents.forEach(e => {
    if (e.cart_items && e.cart_items.length > 0) {
      abandonedCartsMap.set(e.session_id, e);
    }
  });

  const abandonedCartsList = Array.from(abandonedCartsMap.values()).map(e => {
    const total = (e.cart_items || []).reduce((acc, item) => acc + (item.price || 0), 0);
    return {
      sessionId: e.session_id,
      lastSeen: new Date(e.timestamp).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }),
      pagePath: e.page_path,
      deviceType: e.device_type || 'desktop',
      items: e.cart_items || [],
      total,
      itemCount: (e.cart_items || []).length
    };
  });

  const abandonedCartsCount = abandonedCartsList.length;
  const abandonedTotalValue = abandonedCartsList.reduce((acc, c) => acc + c.total, 0);

  // Fetch actual completed orders to compute conversion rate
  let completedOrdersCount = 0;
  try {
    const { count } = await supabase.from('orders').select('*', { count: 'exact', head: true });
    completedOrdersCount = count || 0;
  } catch (e) {}

  const conversionRate = totalVisitors > 0 ? ((completedOrdersCount / totalVisitors) * 100).toFixed(1) : '0';

  return {
    success: true,
    summary: {
      totalVisitors,
      totalPageViews,
      pagesPerSession,
      abandonedCartsCount,
      abandonedTotalValue,
      conversionRate
    },
    topPages,
    trafficSources,
    deviceCounts,
    abandonedCarts: abandonedCartsList
  };
}
