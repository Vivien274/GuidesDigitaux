'use client';

import React from 'react';
import { ArrowRight } from 'lucide-react';

export default function StratecBanner() {
  const deskImageUrl = '/images/stratec-banner-desk.jpg';

  return (
    <div className="my-12 space-y-6">
      <h2 className="text-3xl sm:text-4xl font-extrabold text-[#18757d] m-0">
        Pour aller plus loin ...
      </h2>
      <p className="text-base sm:text-lg text-[#332420] font-medium m-0 leading-relaxed max-w-3xl">
        Et si tu veux un diagnostic personnalisé, réserve ton <strong>rendez-vous gratuit</strong> avec{' '}
        <a
          href="https://stratec-digital.com"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#18757d] font-bold underline hover:text-[#12595f] transition-colors"
        >
          Stratec Digital
        </a>{' '}
        pour faire le point sur ta situation et repartir avec un plan d’action clair.
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
            <a
              href="https://stratec-digital.com"
              target="_blank"
              rel="noopener noreferrer"
              className="text-white hover:underline no-underline"
            >
              Stratec Digital
            </a><br />
            Comme Solution<br />
            De Digitalisation<br />
            Sur-Mesure
          </h3>

          <div>
            <a
              href="https://calendar.app.google/A4SMq4zBbZYnnCr18"
              target="_blank"
              rel="noopener noreferrer"
              className="no-underline inline-flex items-center gap-3 px-8 py-4 bg-white hover:bg-slate-100 font-extrabold text-sm uppercase tracking-wider rounded-2xl shadow-lg transition-transform hover:scale-105"
              style={{ backgroundColor: '#ffffff', color: '#18757d', textDecoration: 'none' }}
            >
              <span style={{ color: '#18757d', fontWeight: 800 }}>PREND TON RDV</span>
              <ArrowRight className="w-5 h-5 text-[#18757d]" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
