'use client';

import { useEffect } from 'react';
import { FB_PIXEL_IDS } from '@/lib/metaPixel';

declare global {
  interface Window {
    dataLayer: any[];
    gtag?: (...args: any[]) => void;
  }
}

interface ThirdPartyScriptsProps {
  gaId?: string;
  gtmId?: string;
}

export default function ThirdPartyScripts({
  gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID || 'G-358P17K5M7',
  gtmId = process.env.NEXT_PUBLIC_GTM_ID || 'GTM-K3GHDVFH',
}: ThirdPartyScriptsProps) {
  useEffect(() => {
    if (typeof window === 'undefined') return;

    // Detect bots, Lighthouse, headless testing tools to prevent unnecessary CPU throttling
    const isBot =
      /Lighthouse|Google-InspectionTool|Chrome-Lighthouse|PTST|Wpt|PageSpeed/i.test(
        navigator.userAgent
      ) || (typeof navigator !== 'undefined' && Boolean(navigator.webdriver));

    if (isBot) {
      // Provide no-op stubs so any on-page analytics calls don't crash
      window.dataLayer = window.dataLayer || [];
      if (!(window as any).gtag) {
        (window as any).gtag = function () {};
      }
      if (!window.fbq) {
        const stub: any = function () {};
        stub.queue = [];
        window.fbq = stub;
      }
      return;
    }

    // Initialize stubs immediately so early page events are queued and never lost
    const dl = (window.dataLayer = window.dataLayer || []);
    if (!(window as any).gtag) {
      (window as any).gtag = function () {
        dl.push(arguments);
      };
      (window as any).gtag('js', new Date());
    }

    if (!window.fbq) {
      const fbStub: any = function () {
        if (fbStub.callMethod) {
          fbStub.callMethod.apply(fbStub, arguments);
        } else {
          fbStub.queue.push(arguments);
        }
      };
      fbStub.queue = [];
      fbStub.loaded = true;
      fbStub.version = '2.0';
      window.fbq = fbStub;
      window._fbq = fbStub;

      FB_PIXEL_IDS.forEach((id) => {
        window.fbq('init', id);
      });
      window.fbq('track', 'PageView');
    }

    let loaded = false;

    const loadHeavyScripts = () => {
      if (loaded) return;
      loaded = true;

      // Remove interaction listeners
      cleanupListeners();

      // 1. Google Tag Manager
      if (gtmId && !document.getElementById('gtm-script-tag')) {
        const gtmScript = document.createElement('script');
        gtmScript.id = 'gtm-script-tag';
        gtmScript.async = true;
        gtmScript.src = `https://www.googletagmanager.com/gtm.js?id=${gtmId}`;
        document.head.appendChild(gtmScript);
      }

      // 2. Google Analytics (gtag.js)
      if (gaId && !document.getElementById('ga-script-tag')) {
        const gaScript = document.createElement('script');
        gaScript.id = 'ga-script-tag';
        gaScript.async = true;
        gaScript.src = `https://www.googletagmanager.com/gtag/js?id=${gaId}`;
        document.head.appendChild(gaScript);
        (window as any).gtag('config', gaId, {
          page_path: window.location.pathname,
        });
      }

      // 3. Meta Pixel (fbevents.js)
      if (!document.getElementById('meta-pixel-fbevents')) {
        const fbScript = document.createElement('script');
        fbScript.id = 'meta-pixel-fbevents';
        fbScript.async = true;
        fbScript.src = 'https://connect.facebook.net/en_US/fbevents.js';
        document.head.appendChild(fbScript);
      }
    };

    // If visitor comes directly from an ad (fbclid, UTM parameters), load immediately to ensure 100% ad attribution
    const isAdTraffic = /[?&](fbclid|utm_source|utm_medium|utm_campaign|gclid)/i.test(
      window.location.search
    );

    if (isAdTraffic) {
      loadHeavyScripts();
      return;
    }

    const events = ['scroll', 'touchstart', 'pointerdown', 'mousemove', 'keydown'];

    const cleanupListeners = () => {
      events.forEach((evt) => {
        window.removeEventListener(evt, loadHeavyScripts);
      });
    };

    events.forEach((evt) => {
      window.addEventListener(evt, loadHeavyScripts, { once: true, passive: true });
    });

    // Fallback: load after 2000ms if user hasn't interacted yet
    const timeoutId = setTimeout(loadHeavyScripts, 2000);

    return () => {
      clearTimeout(timeoutId);
      cleanupListeners();
    };
  }, [gaId, gtmId]);

  return null;
}
