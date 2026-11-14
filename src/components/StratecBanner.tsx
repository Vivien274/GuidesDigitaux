'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function StratecBanner() {
  const deskImageUrl = '/images/stratec-banner-desk.jpg';

  return (
    <div className="my-12 space-y-6">
      <h2 className="text-3xl sm:text-4xl font-extrabold text-[#18757d] m-0">
        Pour aller plus loin ...
      </h2>
      <p className="text-base sm:text-lg text-[#332420] font-medium m-0 leading-relaxed max-w-3xl">
        Et si tu as besoin de plus d’informations ou d’un accompagnement, tu peux contacter directement{' '}
        <Link
          href="/contact"
          className="text-[#18757d] font-bold underline hover:text-[#12595f] transition-colors"
        >
          Stéphanie de Guides Digitaux
        </Link>{' '}
        et réserver ton <strong>rendez-vous découverte gratuit</strong> pour voir ensemble ce qu’on peut faire.
      </p>

      <div
        className="rounded-3xl p-8 sm:p-12 min-h-[320px] flex flex-col justify-center shadow-xl relative overflow-hidden"
        style={{
          backgroundImage: `linear-gradient(to right, rgba(0, 0, 0, 0.75), rgba(24, 117, 125, 0.5)), url('${deskImageUrl}')`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
        }}
      >
        <div className="space-y-6 max-w-lg z-10">
          <h3 className="text-2xl sm:text-3xl md:text-4xl font-black text-white leading-tight drop-shadow-md m-0">
            <Link
              href="/contact"
              className="text-white hover:underline no-underline"
            >
              Guides Digitaux
            </Link><br />
            Un Accompagnement<br />
            Humain &amp; Sur-Mesure<br />
            Avec Stéphanie
          </h3>

          <div>
            <a
              href="https://calendar.app.google/RPcakXLpWzCXB4TMA"
              target="_blank"
              rel="noopener noreferrer"
              className="no-underline inline-flex items-center gap-3 px-8 py-4 bg-white hover:bg-slate-100 font-extrabold text-sm uppercase tracking-wider rounded-2xl shadow-lg transition-transform hover:scale-105"
              style={{ backgroundColor: '#ffffff', color: '#18757d', textDecoration: 'none' }}
            >
              <span style={{ color: '#18757d', fontWeight: 800 }}>PRENDRE RDV AVEC STÉPHANIE</span>
              <ArrowRight className="w-5 h-5 text-[#18757d]" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
