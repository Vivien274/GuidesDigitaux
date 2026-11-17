import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Boutique : Ebooks, Mini-Guides & Formations | Guides Digitaux',
  description:
    'Découvre tous nos ebooks, checklists pratiques et formations en ligne pour artisans, créateurs et indépendants. Des outils concrets à ton rythme.',
  alternates: {
    canonical: '/boutique',
  },
};

export default function BoutiqueLayout({ children }: { children: React.ReactNode }) {
  return children;
}

