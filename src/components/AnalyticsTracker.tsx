'use client';

import { useEffect, useRef } from 'react';
import { usePathname, useSearchParams } from 'next/navigation';
import { useCart } from '@/context/CartContext';

function getSessionId(): string {
  if (typeof window === 'undefined') return '';
  let id = sessionStorage.getItem('gd_analytics_session');
  if (!id) {
    id = `sess-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
    sessionStorage.setItem('gd_analytics_session', id);
  }
  return id;
}

function getDeviceType(): 'mobile' | 'desktop' | 'tablet' {
  if (typeof window === 'undefined') return 'desktop';
  const width = window.innerWidth;
  const ua = navigator.userAgent.toLowerCase();
  if (/ipad|tablet|(android(?!.*mobile))/i.test(ua) || (width >= 768 && width <= 1024)) {
    return 'tablet';
  }
  if (/mobile|iphone|ipod|android|blackberry|opera mini/i.test(ua) || width < 768) {
    return 'mobile';
  }
  return 'desktop';
}

function getReferrerCategory(ref: string): string {
  if (!ref) return 'Accès Direct';
  try {
    const url = new URL(ref);
    const host = url.hostname.toLowerCase();

    if (host.includes('google.')) return 'Google Search';
    if (host.includes('bing.')) return 'Bing';
    if (host.includes('duckduckgo.')) return 'DuckDuckGo';
    if (host.includes('instagram.')) return 'Instagram';
    if (host.includes('facebook.')) return 'Facebook';
    if (host.includes('linkedin.')) return 'LinkedIn';
    if (host.includes('t.co') || host.includes('twitter.') || host.includes('x.com')) return 'X (Twitter)';
    if (host.includes('pinterest.')) return 'Pinterest';
    if (host.includes('tiktok.')) return 'TikTok';
    if (host.includes(window.location.hostname)) return 'Interne';

    return host.replace(/^www\./, '');
  } catch (e) {
    return 'Autre';
  }
}

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const { cart } = useCart();
  const lastTrackedPath = useRef<string>('');

  // 1. Track Page Views
  useEffect(() => {
    if (!pathname) return;
    const fullPath = pathname + (searchParams?.toString() ? `?${searchParams.toString()}` : '');

    // Skip admin pages from user analytics
    if (pathname.startsWith('/dashboard/admin')) return;

    if (lastTrackedPath.current === fullPath) return;
    lastTrackedPath.current = fullPath;

    const sessionId = getSessionId();
    const deviceType = getDeviceType();
    const rawReferrer = typeof document !== 'undefined' ? document.referrer : '';
    const referrerCat = getReferrerCategory(rawReferrer);

    fetch('/api/analytics/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        event_type: 'page_view',
        session_id: sessionId,
        page_path: pathname,
        page_title: typeof document !== 'undefined' ? document.title : pathname,
        referrer: rawReferrer,
        referrer_category: referrerCat,
        device_type: deviceType,
        user_agent: typeof navigator !== 'undefined' ? navigator.userAgent : ''
      })
    }).catch(err => console.warn('Analytics tracking error:', err));
  }, [pathname, searchParams]);

  // 2. Track Cart Abandonments
  useEffect(() => {
    if (!cart || cart.length === 0) return;
    const sessionId = getSessionId();

    const timer = setTimeout(() => {
      fetch('/api/analytics/track', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          event_type: 'cart_update',
          session_id: sessionId,
          page_path: pathname || '/',
          device_type: getDeviceType(),
          metadata: {
            items: cart.map(i => ({ id: i.id, title: i.title, price: i.price })),
            total: cart.reduce((sum, item) => sum + item.price, 0),
            itemCount: cart.length
          }
        })
      }).catch(() => {});
    }, 1500);

    return () => clearTimeout(timer);
  }, [cart, pathname]);

  return null;
}
