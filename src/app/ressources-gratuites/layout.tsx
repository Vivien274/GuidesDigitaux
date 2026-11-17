import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Ressources Gratuites, Checklists & Guides | Guides Digitaux',
  description:
    'Télécharge gratuitement nos guides pratiques et checklists pour artisans et créateurs : fiches produits Noël, plan d’action et conformité.',
  alternates: {
    canonical: '/ressources-gratuites',
  },
};

export default function RessourcesGratuitesLayout({ children }: { children: React.ReactNode }) {
  return children;
}

