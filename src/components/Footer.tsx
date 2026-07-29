'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function Footer() {
  return (
    <footer className="bg-[#faf8f5] border-t border-[#eee7da] py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-6">
        
        {/* Official Logo */}
        <Link href="/" className="flex items-center gap-3">
          <div className="relative h-10 w-44">
            <Image
              src="/images/logo.png"
              alt="Guides Digitaux"
              fill
              className="object-contain object-left"
            />
          </div>
        </Link>

        <p className="text-xs text-[#5e4d46] text-center md:text-left font-medium">
          © 2026 Guides Digitaux. Tous droits réservés. Plateforme sécurisée Supabase & Stripe.
        </p>

        <div className="flex items-center gap-6 text-xs text-[#332420] font-semibold">
          <Link href="/mentions-legales" className="hover:text-[#18757d] transition-colors">Mentions Légales</Link>
          <Link href="/cgv" className="hover:text-[#18757d] transition-colors">CGV / CGU</Link>
          <Link href="/contact" className="hover:text-[#18757d] transition-colors">Contact</Link>
        </div>
      </div>
    </footer>
  );
}
