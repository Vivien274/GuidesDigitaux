'use client';

import React, { useState, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import {
  Sparkles,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
  Zap,
  ShoppingBag,
  Clock,
  Lock
} from 'lucide-react';

function UpsellContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const sessionId = searchParams.get('session_id') || '';
  const [isLoading, setIsLoading] = useState(false);

  const handleAcceptUpsell = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId: 'formation-ajouter-une-boutique-en-ligne-avec-woocommerce',
          courseTitle: 'Upgrade Combo E-Commerce : Formation WooCommerce',
          productId: 'formation-ajouter-une-boutique-en-ligne-avec-woocommerce',
          title: 'Upgrade Combo E-Commerce : Formation WooCommerce',
          price: 51,
          cancelUrl: 'https://www.guides-digitaux.com/tunnel/downsell',
          successUrl: 'https://www.guides-digitaux.com/tunnel/confirmation?session_id={CHECKOUT_SESSION_ID}&upsell=true'
        })
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Erreur lors du traitement de l\'offre.');
        setIsLoading(false);
      }
    } catch (e) {
      console.error(e);
      setIsLoading(false);
    }
  };

  const handleDeclineUpsell = () => {
    router.push(`/tunnel/downsell?session_id=${sessionId}`);
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#332420] font-sans selection:bg-[#18757d] selection:text-white">
      <Header />

      {/* TOP PROGRESS STEPS BAR */}
      <div className="bg-amber-400 text-[#332420] py-2.5 px-4 text-center text-xs font-black uppercase tracking-wider">
        <div className="max-w-4xl mx-auto flex items-center justify-center gap-4">
          <span>1. Formation Vitrine Validée ✓</span>
          <span>→</span>
          <span className="underline decoration-2 font-black">2. Offre Upgrade E-Commerce (En cours)</span>
          <span>→</span>
          <span className="opacity-60">3. Confirmation Finale</span>
        </div>
      </div>

      <main className="py-12 lg:py-16">
        <div className="max-w-3xl mx-auto px-4 space-y-8">
          
          {/* CONFIRMATION ALERT */}
          <div className="bg-emerald-50 border-2 border-emerald-500 rounded-3xl p-6 text-center space-y-2 shadow-sm">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-600 text-white rounded-full text-xs font-black uppercase">
              <CheckCircle2 className="w-4 h-4" /> Commande Confirmée !
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-emerald-950">
              Votre inscription à la Formation Vitrine WordPress est enregistrée avec succès.
            </h1>
            <p className="text-xs text-emerald-800 font-semibold">
              Attendez un instant ! Avant d'accéder à votre espace élève, voici une opportunité d'upgrade unique.
            </p>
          </div>

          {/* UPSELL OFFER CARD */}
          <div className="bg-white rounded-3xl p-8 sm:p-10 border-2 border-[#18757d] shadow-2xl space-y-8 relative overflow-hidden">
            
            <div className="space-y-3 text-center">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-[#e6f4f3] text-[#18757d] uppercase tracking-wider">
                <Sparkles className="w-4 h-4 text-amber-500" /> Upgrade Privilège Réservé Nouveaux Élèves
              </span>
              <h2 className="text-2xl sm:text-4xl font-black text-[#332420]">
                Ajoutez la Brique E-Commerce WooCommerce pour Vendre vos Créations 24h/24 !
              </h2>
              <p className="text-xs sm:text-sm text-[#5e4d46] font-medium leading-relaxed max-w-xl mx-auto">
                Transformez votre site vitrine en véritable boutique en ligne. Profitez de l'offre Combo à seulement **+51 €** (au lieu de 99 € prix public).
              </p>
            </div>

            {/* Media & Details Box */}
            <div className="bg-[#faf8f5] p-6 rounded-2xl border border-[#eee7da] grid grid-cols-1 sm:grid-cols-12 gap-6 items-center">
              <div className="sm:col-span-4 relative h-40 rounded-xl overflow-hidden shadow-md">
                <Image
                  src="/images/products/formation-woocommerce.jpg"
                  alt="Formation WooCommerce E-commerce"
                  fill
                  className="object-cover"
                />
              </div>
              <div className="sm:col-span-8 space-y-2.5 text-left">
                <h3 className="text-base font-extrabold text-[#332420]">Formation Vidéo : Ajouter une Boutique WooCommerce</h3>
                <div className="space-y-1.5 text-xs text-[#5e4d46]">
                  <div className="flex items-center gap-2 font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Créer des fiches produits simples & à déclinaisons (tailles, couleurs)</span>
                  </div>
                  <div className="flex items-center gap-2 font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Encaisser les cartes bancaires en sécurité avec Stripe / Apple Pay / PayPal</span>
                  </div>
                  <div className="flex items-center gap-2 font-semibold">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span>Configurer les livraisons (Click & Collect, Colissimo, Mondial Relay)</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Pricing Offer */}
            <div className="text-center space-y-1">
              <span className="text-xs text-slate-500 font-bold uppercase tracking-wider block">Complément Combo Privilège</span>
              <div className="flex items-baseline justify-center gap-3">
                <span className="text-4xl font-black text-[#18757d]">+ 51 €</span>
                <span className="text-sm text-slate-400 font-semibold line-through">99 €</span>
              </div>
              <span className="text-[11px] font-extrabold text-emerald-700 block">
                Passez au Combo Vitrine + Boutique à 250 € au lieu de 298 € !
              </span>
            </div>

            {/* ACTION BUTTONS */}
            <div className="space-y-4">
              <button
                onClick={handleAcceptUpsell}
                disabled={isLoading}
                className="w-full py-5 text-sm sm:text-base font-black text-white bg-[#18757d] hover:bg-[#12595f] rounded-2xl shadow-xl uppercase tracking-wider transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-3 cursor-pointer"
              >
                {isLoading ? (
                  <span>Ajout en cours...</span>
                ) : (
                  <>
                    <span>OUI ! AJOUTER LA FORMATION E-COMMERCE (+51 €)</span>
                    <ArrowRight className="w-5 h-5 text-amber-300" />
                  </>
                )}
              </button>

              <button
                onClick={handleDeclineUpsell}
                className="w-full py-3 text-xs font-bold text-slate-500 hover:text-[#332420] underline transition-colors cursor-pointer"
              >
                Non merci, je refuse cette offre spéciale et je passe à l'étape suivante →
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

export default function UpsellPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#faf8f5] flex items-center justify-center text-sm font-bold text-[#18757d]">Chargement...</div>}>
      <UpsellContent />
    </Suspense>
  );
}
