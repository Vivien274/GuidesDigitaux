import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Contact & Rendez-vous | Guides Digitaux',
  description:
    'Une question sur nos formations, ebooks ou un besoin d’accompagnement digital ? Contacte Stéphanie Rocq facilement.',
  alternates: {
    canonical: '/contact',
  },
};

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return children;
}

