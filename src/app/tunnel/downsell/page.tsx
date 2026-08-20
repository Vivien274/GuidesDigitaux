'use client';

import React, { useState, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import {
  Sparkles,
  CheckCircle2,
  ArrowRight,
  FileText,
  Gift
} from 'lucide-react';

function DownsellContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id') || '';
  const [isLoading, setIsLoading] = useState(false);

  const handleAcceptDownsell = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId: 'pack-guides',
          courseTitle: 'Offre Spéciale : Pack Guides Utiles (7 Fichiers PDF)',
          productId: 'pack-guides',
          title: 'Offre Spéciale : Pack Guides Utiles (7 Fichiers PDF)',
          price: 17,
          cancelUrl: 'https://www.guides-digitaux.com/tunnel/confirmation',
          successUrl: 'https://www.guides-digitaux.com/tunnel/confirmation?session_id={CHECKOUT_SESSION_ID}&downsell=true'
        })
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Erreur lors du traitement du pack.');
        setIsLoading(false);
      }
    } catch (e) {
      console.error(e);
      setIsLoading(false);
    }
  };

  const handleDeclineDownsell = () => {
    router.push(`/tunnel/confirmation?session_id=${sessionId}`);
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#332420] font-sans selection:bg-[#18757d] selection:text-white">
      <Header />

      {/* TOP PROGRESS STEPS BAR */}
      <div className="bg-[#18757d] text-white py-2.5 px-4 text-center text-xs font-black uppercase tracking-wider">
        <div className="max-w-4xl mx-auto flex items-center justify-center gap-4">
          <span>1. Formation Validée ✓</span>
          <span>→</span>
          <span className="underline decoration-2 decoration-amber-400">2. Offre Ultime (Pack 7 Guides)</span>
          <span>→</span>
          <span className="opacity-60">3. Confirmation Espace Élève</span>
        </div>
      </div>

      <main className="py-12 lg:py-16">
        <div className="max-w-3xl mx-auto px-4 space-y-8">
          
          {/* DOWNSELL OFFER CARD */}
          <div className="bg-white rounded-3xl p-8 sm:p-10 border-2 border-amber-400 shadow-2xl space-y-8 relative overflow-hidden text-center">
            
            <div className="space-y-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-amber-100 text-amber-900 border border-amber-300 uppercase tracking-wider">
                <Gift className="w-4 h-4 text-amber-600" /> Offre de Secours Ultime (Seulement 17 €)
              </span>
              <h1 className="text-2xl sm:text-4xl font-black text-[#332420]">
                Emportez le Coffret Intégral des 7 Guides & Checklists PDF
              </h1>
              <p className="text-xs sm:text-sm text-[#5e4d46] font-medium leading-relaxed max-w-xl mx-auto">
                Obtenez les fiches récapitulatives imprimables de toute la méthodologie pour vous accompagner à côté de vos vidéos.
              </p>
            </div>

            {/* Media & Details Box */}
            <div className="bg-[#faf8f5] p-6 rounded-2xl border border-[#eee7da] grid grid-cols-1 sm:grid-cols-12 gap-6 items-center text-left">
              <div className="sm:col-span-4 relative h-36 rounded-xl overflow-hidden shadow-md">
                <Image
                  src="/images/products/pack-guides-mockup-2.webp"
                  alt="Pack Guides Utiles 7 PDF"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="sm:col-span-8 space-y-2 text-xs text-[#5e4d46]">
                <h3 className="text-base font-extrabold text-[#332420]">Le Pack Intégral 7 PDF (Valeur : 41 €)</h3>
                <div className="space-y-1 font-semibold">
                  <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Mini-Guide Rédaction Web Artisan</div>
                  <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Mini-Guide SEO Local & Google Maps</div>
                  <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Mini-Guide Optimisation Photos Vitesse</div>
                  <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Mini-Guide Comprendre ses Stats</div>
                  <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" /> Les 3 Checklists de Contrôle (Sécurité, UX, Lancement)</div>
                </div>
              </div>
            </div>

            {/* Pricing Offer */}
            <div className="space-y-1">
              <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block">Tarif Spécial Pack</span>
              <div className="flex items-baseline justify-center gap-3">
                <span className="text-4xl font-black text-[#18757d]">17 €</span>
                <span className="text-sm text-slate-400 font-semibold line-through">41 €</span>
              </div>
            </div>

            {/* ACTION BUTTONS */}
            <div className="space-y-4">
              <button
                onClick={handleAcceptDownsell}
                disabled={isLoading}
                className="w-full py-5 text-sm sm:text-base font-black text-white bg-[#18757d] hover:bg-[#12595f] rounded-2xl shadow-xl uppercase tracking-wider transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-3 cursor-pointer"
              >
                {isLoading ? (
                  <span>Ajout en cours...</span>
                ) : (
                  <>
                    <span>OUI ! AJOUTER LE PACK 7 GUIDES À MA COMMANDE (17 €)</span>
                    <ArrowRight className="w-5 h-5 text-amber-300" />
                  </>
                )}
              </button>

              <button
                onClick={handleDeclineDownsell}
                className="w-full py-3 text-xs font-bold text-slate-500 hover:text-[#332420] underline transition-colors cursor-pointer"
              >
                Non merci, accéder directement à mes contenus vidéo →
              </button>
            </div>

          </div>

        </div>
      </main>

      <footer className="py-8 bg-[#332420] text-teal-100/70 text-xs text-center border-t border-[#4a3630]">
        <div className="max-w-4xl mx-auto px-4 space-y-2">
          <p>© {new Date().getFullYear()} Guides Digitaux — Tous droits réservés.</p>
          <div className="flex items-center justify-center gap-4 text-[11px]">
            <Link href="/mentions-legales" className="hover:text-white transition-colors">Mentions Légales</Link>
            <span>•</span>
            <Link href="/cgv" className="hover:text-white transition-colors">CGV</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default function DownsellPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#faf8f5] flex items-center justify-center text-sm font-bold text-[#18757d]">Chargement...</div>}>
      <DownsellContent />
    </Suspense>
  );
}
