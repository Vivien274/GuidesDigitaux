import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Formation Fiche Google Business Profile | Guides Digitaux',
  description:
    'Apprends étape par étape à créer, optimiser et faire décoller ta fiche Google pour attirer des clients locaux sans jargon technique.',
  alternates: {
    canonical: '/tunnel/formation-fiche-google',
  },
};

export default function TunnelFormationFicheGoogleLayout({ children }: { children: React.ReactNode }) {
  return children;
}

