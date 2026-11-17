import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Formation Création de Site WordPress & WooCommerce | Guides Digitaux',
  description:
    'Crée ton site internet professionnel avec WordPress (et ta boutique WooCommerce) en toute autonomie, sans dépendre d’une agence.',
  alternates: {
    canonical: '/tunnel/formation-wordpress',
  },
};

export default function TunnelFormationWordPressLayout({ children }: { children: React.ReactNode }) {
  return children;
}

