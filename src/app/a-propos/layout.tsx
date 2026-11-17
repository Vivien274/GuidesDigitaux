import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'À Propos de Stéphanie Rocq | Guides Digitaux',
  description:
    'Découvre le parcours et la mission de Stéphanie Rocq : rendre le digital clair, accessible et rentable pour les artisans et créateurs.',
  alternates: {
    canonical: '/a-propos',
  },
};

export default function AProposLayout({ children }: { children: React.ReactNode }) {
  return children;
}

