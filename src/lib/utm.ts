export interface UtmParams {
  utm_source?: string;
  utm_medium?: string;
  utm_campaign?: string;
  utm_content?: string;
  utm_term?: string;
  fbclid?: string;
  gclid?: string;
  source?: string;
  medium?: string;
  campaign?: string;
  content?: string;
  term?: string;
  captured_at?: string;
}

const STORAGE_KEY = 'gd_tracking_utm';

/**
 * Capture and store UTM parameters from current window URL into sessionStorage and localStorage.
 */
export function captureAndStoreUtm(): UtmParams {
  if (typeof window === 'undefined') return {};

  try {
    const searchParams = new URLSearchParams(window.location.search);
    const utmSource = searchParams.get('utm_source');
    const utmMedium = searchParams.get('utm_medium');
    const utmCampaign = searchParams.get('utm_campaign');
    const utmContent = searchParams.get('utm_content');
    const utmTerm = searchParams.get('utm_term');
    const fbclid = searchParams.get('fbclid');
    const gclid = searchParams.get('gclid');

    // Only update if at least one tracking parameter is present
    if (utmSource || utmMedium || utmCampaign || utmContent || utmTerm || fbclid || gclid) {
      const currentUtm: UtmParams = {
        utm_source: utmSource || (fbclid ? 'facebook' : (gclid ? 'google' : undefined)),
        utm_medium: utmMedium || (fbclid ? 'cpc' : (gclid ? 'cpc' : undefined)),
        utm_campaign: utmCampaign || undefined,
        utm_content: utmContent || undefined,
        utm_term: utmTerm || undefined,
        fbclid: fbclid || undefined,
        gclid: gclid || undefined,
        captured_at: new Date().toISOString(),
      };

      sessionStorage.setItem(STORAGE_KEY, JSON.stringify(currentUtm));
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentUtm));
      return currentUtm;
    }

    // Fallback to already stored UTMs
    return getStoredUtm();
  } catch (e) {
    return {};
  }
}

/**
 * Retrieve stored UTM parameters from sessionStorage (or localStorage fallback).
 */
export function getStoredUtm(): UtmParams {
  if (typeof window === 'undefined') return {};

  try {
    const sessionData = sessionStorage.getItem(STORAGE_KEY);
    if (sessionData) return JSON.parse(sessionData);

    const localData = localStorage.getItem(STORAGE_KEY);
    if (localData) return JSON.parse(localData);
  } catch (e) {}

  return {};
}

/**
 * Format UTM params into a clean, human-readable origin label for the Admin Dashboard.
 */
export function formatUtmLabel(utm?: UtmParams | Record<string, any>): { label: string; source: string; badgeColor: string } {
  if (!utm) return { label: 'Direct / Organique', source: 'direct', badgeColor: 'bg-slate-100 text-slate-700' };

  const source = (utm.utm_source || utm.source || '').toLowerCase();
  const campaign = utm.utm_campaign || utm.campaign || '';
  const content = utm.utm_content || utm.content || '';
  const medium = (utm.utm_medium || utm.medium || '').toLowerCase();

  if (source.includes('facebook') || source.includes('instagram') || source.includes('meta') || utm.fbclid) {
    if (content.toLowerCase().includes('reel') || medium.includes('reel') || campaign.toLowerCase().includes('reel')) {
      return { label: 'Meta Ads • Reel Vidéo', source: 'meta', badgeColor: 'bg-pink-100 text-pink-900 border border-pink-200' };
    }
    if (content.toLowerCase().includes('carrousel') || content.toLowerCase().includes('carousel')) {
      return { label: 'Meta Ads • Carrousel', source: 'meta', badgeColor: 'bg-purple-100 text-purple-900 border border-purple-200' };
    }
    if (content.toLowerCase().includes('postit')) {
      return { label: 'Meta Ads • Photo Post-it', source: 'meta', badgeColor: 'bg-amber-100 text-amber-900 border border-amber-200' };
    }
    if (content.toLowerCase().includes('photo') || campaign.toLowerCase().includes('photo')) {
      return { label: 'Meta Ads • Photo (Visage)', source: 'meta', badgeColor: 'bg-emerald-100 text-emerald-900 border border-emerald-200' };
    }
    return { label: content ? `Meta Ads • ${content}` : (campaign ? `Meta Ads • ${campaign}` : 'Meta Ads (Facebook/Insta)'), source: 'meta', badgeColor: 'bg-blue-100 text-blue-900 border border-blue-200' };
  }

  if (source.includes('google') || utm.gclid) {
    return { label: `Google Ads • ${campaign || 'Search'}`, source: 'google', badgeColor: 'bg-amber-100 text-amber-900 border border-amber-200' };
  }

  if (source.includes('mailchimp') || source.includes('email') || source.includes('newsletter')) {
    return { label: `Email • ${campaign || 'Séquence'}`, source: 'email', badgeColor: 'bg-yellow-100 text-yellow-900 border border-yellow-200' };
  }

  if (content || campaign) {
    return { label: `${source || 'Campagne'} • ${content || campaign}`, source: source || 'custom', badgeColor: 'bg-teal-100 text-teal-900 border border-teal-200' };
  }

  return { label: 'Direct / Organique', source: 'direct', badgeColor: 'bg-slate-100 text-slate-700' };
}
