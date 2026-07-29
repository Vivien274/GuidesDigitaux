'use client';

export interface PreorderCampaign {
  id: string;
  courseId?: string;
  courseTitle: string;
  price: number;
  originalPrice?: number;
  targetEnrollments: number; // e.g. 25
  currentEnrollments: number; // e.g. 18
  endDate: string; // e.g. "2026-11-30"
  releaseDate: string; // e.g. "2026-12-15"
  description: string;
  bonus: string;
  image?: string;
  status: 'En cours' | 'Objectif atteint' | 'Terminée' | 'Annulé & Remboursé';
}

export function formatFrenchDate(dateStr: string): string {
  if (!dateStr) return '';
  if (dateStr.includes('-')) {
    const parts = dateStr.split('-');
    if (parts.length === 3) {
      const [year, month, day] = parts;
      const months = [
        'janvier', 'février', 'mars', 'avril', 'mai', 'juin',
        'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'
      ];
      const mIdx = parseInt(month, 10) - 1;
      if (mIdx >= 0 && mIdx < 12) {
        return `${parseInt(day, 10)} ${months[mIdx]} ${year}`;
      }
    }
  }
  return dateStr;
}

export function getPreorderStatusDetails(campaign: PreorderCampaign) {
  const now = new Date();
  
  // Parse YYYY-MM-DD
  const [endYear, endMonth, endDay] = (campaign.endDate || '2026-08-20').split('-').map(Number);
  const [relYear, relMonth, relDay] = (campaign.releaseDate || '2026-09-15').split('-').map(Number);
  
  const endDateObj = new Date(endYear, (endMonth || 8) - 1, endDay || 20, 23, 59, 59);
  const releaseDateObj = new Date(relYear, (relMonth || 9) - 1, relDay || 15, 23, 59, 59);

  const formattedEndDate = formatFrenchDate(campaign.endDate || '2026-08-20');
  const formattedReleaseDate = formatFrenchDate(campaign.releaseDate || '2026-09-15');

  const isGoalReached = campaign.currentEnrollments >= campaign.targetEnrollments;
  const isPastEndDate = now > endDateObj;
  const isPastReleaseDate = now > releaseDateObj;

  if (isPastEndDate && !isGoalReached) {
    return {
      code: 'CANCELLED_REFUNDED' as const,
      label: 'Campagne Annulée & Remboursée',
      badgeBg: 'bg-red-100 text-red-800 border-red-300',
      canOrder: false,
      effectivePrice: campaign.price,
      bannerMsg: `❌ Objectif de ${campaign.targetEnrollments} précommandes non atteint à la date limite du ${formattedEndDate}. La campagne est annulée et l'intégralité des inscrits a été 100% remboursée.`,
      priceLabel: `Annulé`
    };
  }

  if (isPastReleaseDate) {
    return {
      code: 'RELEASED_FULL_PRICE' as const,
      label: 'Formation Officiellement Sortie',
      badgeBg: 'bg-[#18757d] text-white border-[#18757d]',
      canOrder: true,
      effectivePrice: campaign.originalPrice || campaign.price,
      bannerMsg: `🚀 La formation est officiellement disponible depuis le ${formattedReleaseDate} ! Le tarif classique est désormais en vigueur.`,
      priceLabel: `${(campaign.originalPrice || campaign.price).toFixed(2).replace('.', ',')} € (Tarif Classique)`
    };
  }

  if (isGoalReached) {
    return {
      code: 'GOAL_REACHED_CONFIRMED' as const,
      label: `Lancement Confirmé au ${formattedReleaseDate} !`,
      badgeBg: 'bg-emerald-100 text-emerald-800 border-emerald-300',
      canOrder: true,
      effectivePrice: campaign.price,
      bannerMsg: `🎉 Objectif de ${campaign.targetEnrollments} précommandes atteint ! Le lancement est officiellement validé pour le ${formattedReleaseDate}. Le tarif réduit (${campaign.price.toFixed(2).replace('.', ',')} €) reste valable jusqu'au ${formattedReleaseDate} !`,
      priceLabel: `${campaign.price.toFixed(2).replace('.', ',')} € (Tarif Réduit Précommande)`
    };
  }

  return {
    code: 'ONGOING' as const,
    label: `Campagne en cours (Objectif ${campaign.targetEnrollments})`,
    badgeBg: 'bg-amber-100 text-amber-900 border-amber-300',
    canOrder: true,
    effectivePrice: campaign.price,
    bannerMsg: `Campagne en cours jusqu'au ${formattedEndDate}. Lancement validé le ${formattedReleaseDate} si l'objectif de ${campaign.targetEnrollments} précommandes est atteint au ${formattedEndDate} !`,
    priceLabel: `${campaign.price.toFixed(2).replace('.', ',')} € (Tarif Réduit Précommande)`
  };
}

const DEFAULT_PREORDERS: PreorderCampaign[] = [];

export function getStoredPreorders(): PreorderCampaign[] {
  if (typeof window === 'undefined') return DEFAULT_PREORDERS;
  try {
    const data = localStorage.getItem('gd_custom_preorders');
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to parse gd_custom_preorders', e);
  }
  return DEFAULT_PREORDERS;
}

export function purgeAllPreorders(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('gd_custom_preorders');
    localStorage.removeItem('gd_processed_sessions');
  }
}

export function savePreorder(campaign: PreorderCampaign): PreorderCampaign[] {
  const current = getStoredPreorders();
  const index = current.findIndex(p => p.id === campaign.id);
  let updated: PreorderCampaign[];
  if (index >= 0) {
    updated = current.map(p => p.id === campaign.id ? campaign : p);
  } else {
    updated = [campaign, ...current];
  }
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('gd_custom_preorders', JSON.stringify(updated));
    } catch (quotaError) {
      console.warn('localStorage quota exceeded for gd_custom_preorders', quotaError);
      const sanitized = updated.map(p => ({
        ...p,
        image: p.image && p.image.length > 50000 ? '' : p.image
      }));
      try {
        localStorage.setItem('gd_custom_preorders', JSON.stringify(sanitized));
      } catch (e) {
        console.error('Could not save sanitized preorders', e);
      }
    }
  }
  return updated;
}

export function incrementPreorderEnrollment(campaignId: string): PreorderCampaign[] {
  const current = getStoredPreorders();
  const targetId = campaignId || 'precommande-fiche-google';
  
  const updated = current.map(p => {
    if (p.id === targetId || p.courseId === targetId || (targetId.includes('google') && p.id.includes('google'))) {
      const nextCount = p.currentEnrollments + 1;
      const isGoalReached = nextCount >= p.targetEnrollments;
      return {
        ...p,
        currentEnrollments: nextCount,
        status: isGoalReached ? ('Objectif atteint' as const) : ('En cours' as const)
      };
    }
    return p;
  });

  if (typeof window !== 'undefined') {
    localStorage.setItem('gd_custom_preorders', JSON.stringify(updated));
  }
  return updated;
}
