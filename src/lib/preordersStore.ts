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
  status: 'En cours' | 'Objectif atteint' | 'Terminée';
}

const DEFAULT_PREORDERS: PreorderCampaign[] = [
  {
    id: 'po-1',
    courseId: 'c3',
    courseTitle: 'Masterclass Vidéo : Intelligence Artificielle pour les Artisans & TPE',
    price: 79,
    originalPrice: 149,
    targetEnrollments: 25,
    currentEnrollments: 18,
    endDate: '2026-11-30',
    releaseDate: '2026-12-15',
    description: 'Automatise ta gestion client, tes devis et ta création de contenu grâce aux IA génératives.',
    bonus: 'Accès exclusif à la communauté privée + 50 Prompts prêts à l’emploi',
    image: 'https://www.guides-digitaux.com/wp-content/uploads/2026/02/un-artisan-createur-devant-son-PC-en-train-dajouter-ses-produits-dnas-saboutique-en-ligne.-accoude-a-son-etabli-dans-son-atelier.-lumiere-naturelle.webp',
    status: 'En cours'
  }
];

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
    localStorage.setItem('gd_custom_preorders', JSON.stringify(updated));
  }
  return updated;
}
