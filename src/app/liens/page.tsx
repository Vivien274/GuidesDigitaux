import type { Metadata } from 'next';
import LiensClient from './LiensClient';

export const metadata: Metadata = {
  title: 'Guides Digitaux | Tous nos liens utiles, formations & réseaux',
  description: 'Retrouve en un clic toutes les ressources, formations, quiz gratuit, coaching et réseaux sociaux de Guides Digitaux par Stéphanie Rocq.',
  openGraph: {
    title: 'Guides Digitaux | Tous nos liens utiles & réseaux (Link-in-bio)',
    description: 'Guides, formations, coaching et ressources digitales pour artisans, créateurs et indépendants.',
    url: 'https://www.guides-digitaux.com/liens',
    siteName: 'Guides Digitaux',
    locale: 'fr_FR',
    type: 'website',
    images: [
      {
        url: '/images/stephanie.webp',
        width: 800,
        height: 800,
        alt: 'Stéphanie Rocq - Guides Digitaux',
      },
    ],
  },
  twitter: {
    card: 'summary',
    title: 'Guides Digitaux | Tous nos liens utiles',
    description: 'Guides, formations, coaching et quiz gratuit pour artisans et créateurs.',
    images: ['/images/stephanie.webp'],
  },
};

export default function LiensPage() {
  return <LiensClient />;
}
