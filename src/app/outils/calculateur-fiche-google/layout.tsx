import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Calculateur Fiche Google (Audit Gratuit) | Guides Digitaux',
  description:
    'Évalue gratuitement l’optimisation de ta fiche Google Business Profile et découvre les points prioritaires pour attirer plus de clients locaux.',
  alternates: {
    canonical: '/outils/calculateur-fiche-google',
  },
};

export default function CalculateurFicheGoogleLayout({ children }: { children: React.ReactNode }) {
  return children;
}

