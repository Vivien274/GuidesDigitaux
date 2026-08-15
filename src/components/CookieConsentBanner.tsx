'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { Cookie, ShieldCheck, Check, X, Settings } from 'lucide-react';

export default function CookieConsentBanner() {
  const [isVisible, setIsVisible] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [analyticsConsent, setAnalyticsConsent] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const consent = localStorage.getItem('gd_cookie_consent');
      if (!consent) {
        // Show banner smoothly after 600ms
        const timer = setTimeout(() => setIsVisible(true), 600);
        return () => clearTimeout(timer);
      }
    }
  }, []);

  const handleAcceptAll = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('gd_cookie_consent', JSON.stringify({
        essential: true,
        analytics: true,
        timestamp: new Date().toISOString()
      }));
    }
    setIsVisible(false);
  };

  const handleRefuseAll = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('gd_cookie_consent', JSON.stringify({
        essential: true,
        analytics: false,
        timestamp: new Date().toISOString()
      }));
    }
    setIsVisible(false);
  };

  const handleSavePreferences = () => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('gd_cookie_consent', JSON.stringify({
        essential: true,
        analytics: analyticsConsent,
        timestamp: new Date().toISOString()
      }));
    }
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-6 md:right-auto md:max-w-xl z-50 animate-in slide-in-from-bottom duration-500">
      <div className="bg-white/95 backdrop-blur-md p-5 sm:p-6 rounded-3xl border-2 border-[#18757d]/30 shadow-2xl space-y-4 text-[#332420]">
        
        {/* HEADER */}
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#e6f4f3] text-[#18757d] flex items-center justify-center shrink-0 shadow-2xs">
              <Cookie className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-[#18757d] bg-[#e6f4f3] px-2 py-0.5 rounded-full">
                Conformité RGPD & Cookies
              </span>
              <h3 className="text-sm sm:text-base font-extrabold text-[#332420] mt-0.5">
                Respect de votre vie privée
              </h3>
            </div>
          </div>

          <button
            onClick={handleRefuseAll}
            className="text-slate-400 hover:text-slate-600 p-1 rounded-lg transition-colors cursor-pointer"
            title="Fermer et refuser les cookies non essentiels"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* TEXT BODY */}
        {!showSettings ? (
          <p className="text-xs text-[#5e4d46] leading-relaxed">
            Nous utilisons des cookies essentiels pour assurer le bon fonctionnement du site (session et panier) et, avec votre accord, pour mesurer l'audience et personnaliser votre expérience. Vous pouvez consulter notre{' '}
            <Link href="/politique-confidentialite" className="text-[#18757d] font-bold underline hover:text-[#12595f]">
              Politique de Confidentialité
            </Link>.
          </p>
        ) : (
          <div className="space-y-3 pt-1 border-t border-[#eee7da]">
            <div className="flex items-center justify-between p-2.5 bg-[#faf8f5] rounded-xl border border-[#eee7da]">
              <div>
                <h4 className="text-xs font-extrabold text-[#332420]">Cookies Essentiels (Obligatoires)</h4>
                <p className="text-[10px] text-slate-500">Nécessaires pour la connexion, le panier et la sécurité.</p>
              </div>
              <span className="text-[10px] font-bold px-2 py-1 bg-emerald-100 text-emerald-800 rounded-lg">Toujours Actif</span>
            </div>

            <div className="flex items-center justify-between p-2.5 bg-[#faf8f5] rounded-xl border border-[#eee7da]">
              <div>
                <h4 className="text-xs font-extrabold text-[#332420]">Mesure d'Audience & Meta Pixel</h4>
                <p className="text-[10px] text-slate-500">Permet d'analyser la fréquentation du site.</p>
              </div>
              <input
                type="checkbox"
                checked={analyticsConsent}
                onChange={(e) => setAnalyticsConsent(e.target.checked)}
                className="w-4 h-4 text-[#18757d] rounded accent-[#18757d] cursor-pointer"
              />
            </div>
          </div>
        )}

        {/* ACTIONS */}
        <div className="flex flex-col sm:flex-row items-center gap-2 pt-1">
          {!showSettings ? (
            <>
              <button
                onClick={handleAcceptAll}
                className="w-full sm:w-auto flex-1 px-4 py-2.5 bg-[#18757d] hover:bg-[#12595f] text-white text-xs font-extrabold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 uppercase tracking-wider cursor-pointer"
              >
                <Check className="w-4 h-4" />
                Tout Accepter
              </button>

              <button
                onClick={handleRefuseAll}
                className="w-full sm:w-auto px-4 py-2.5 bg-white border border-[#eee7da] text-[#5e4d46] hover:bg-[#faf8f5] text-xs font-bold rounded-xl transition-colors text-center cursor-pointer"
              >
                Refuser
              </button>

              <button
                onClick={() => setShowSettings(true)}
                className="w-full sm:w-auto p-2.5 text-slate-500 hover:text-[#18757d] text-xs font-bold flex items-center justify-center gap-1 cursor-pointer"
                title="Personnaliser mes choix"
              >
                <Settings className="w-4 h-4" />
                <span className="sm:hidden">Personnaliser</span>
              </button>
            </>
          ) : (
            <button
              onClick={handleSavePreferences}
              className="w-full px-4 py-2.5 bg-[#18757d] hover:bg-[#12595f] text-white text-xs font-extrabold rounded-xl shadow-xs transition-colors text-center uppercase tracking-wider cursor-pointer"
            >
              Enregistrer mes préférences
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
