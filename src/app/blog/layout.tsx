import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Le Blog Guides Digitaux | Conseils SEO, Réseaux Sociaux & Web pour Artisans',
  description:
    'Conseils pratiques et sans jargon pour booster ta visibilité en ligne : réseaux sociaux, SEO local, Google Business Profile et site web pour artisans et créateurs.',
  alternates: {
    canonical: '/blog',
  },
  openGraph: {
    title: 'Le Blog Guides Digitaux | Conseils Web pour Artisans et Créateurs',
    description:
      'Stratégies concrètes de visibilité locale, WordPress et réseaux sociaux pour artisans, créateurs et indépendants.',
    type: 'website',
    locale: 'fr_FR',
  },
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}

