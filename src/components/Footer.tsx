'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { 
  Mail, 
  Send, 
  ShieldCheck, 
  Sparkles, 
  Lock, 
  CreditCard, 
  CheckCircle2,
  ExternalLink,
  BookOpen,
  GraduationCap,
  ArrowRight,
  Headphones,
  Calendar
} from 'lucide-react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-[#18757d] text-white border-t border-[#12595f] pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
        
        {/* TOP NEWSLETTER BANNER */}
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-3xl p-8 sm:p-10 flex flex-col lg:flex-row items-center justify-between gap-8 shadow-xl">
          <div className="space-y-2 text-center lg:text-left max-w-xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/20 rounded-full text-xs font-extrabold uppercase tracking-wider text-emerald-200">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Newsletter Conseils Digitaux</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-black text-white m-0">
              Reçois nos astuces pratiques régulièrement
            </h3>
            <p className="text-sm text-teal-100/90 m-0 font-medium">
              Des conseils sans jargon pour développer ta visibilité, gagner du temps et attirer plus de clients.
            </p>
          </div>

          <form onSubmit={handleSubscribe} className="w-full lg:w-auto flex flex-col sm:flex-row gap-3 min-w-[320px] sm:min-w-[420px]">
            {subscribed ? (
              <div className="w-full py-3.5 px-6 bg-emerald-500 text-white font-extrabold text-sm rounded-2xl flex items-center justify-center gap-2 shadow-lg">
                <CheckCircle2 className="w-5 h-5" />
                <span>Merci ! Inscription validée avec succès.</span>
              </div>
            ) : (
              <>
                <div className="relative flex-1">
                  <Mail className="w-5 h-5 text-teal-700 absolute left-4 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Ton adresse email pro..."
                    className="w-full pl-12 pr-4 py-3.5 bg-white text-[#332420] placeholder:text-slate-400 font-medium text-sm rounded-2xl border-0 focus:outline-none focus:ring-2 focus:ring-emerald-400 shadow-inner"
                  />
                </div>
                <button
                  type="submit"
                  className="py-3.5 px-7 bg-[#f4ede0] hover:bg-white text-[#18757d] font-black text-sm uppercase tracking-wider rounded-2xl transition-all shadow-md flex items-center justify-center gap-2 shrink-0 hover:scale-105"
                >
                  <span>S'abonner</span>
                  <Send className="w-4 h-4" />
                </button>
              </>
            )}
          </form>
        </div>

        {/* MAIN FOOTER GRID */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 pt-4">
          
          {/* BRAND COLUMN (2 Cols wide on desktop) */}
          <div className="lg:col-span-2 space-y-6">
            <Link 
              href="/" 
              className="inline-flex items-center bg-white p-2.5 px-4 rounded-2xl shadow-md border border-white/60 hover:shadow-lg transition-all duration-300 group"
            >
              <Image
                src="/images/logo.png"
                alt="Guides Digitaux"
                width={240}
                height={105}
                className="h-12 sm:h-14 w-auto object-contain transition-transform group-hover:scale-[1.02]"
              />
            </Link>

            <p className="text-sm text-teal-100 leading-relaxed font-medium max-w-md">
              La plateforme de guides pratiques, checklists et formations concrètes 100% conçue pour aider les artisans, créateurs et indépendants à se digitaliser en toute simplicité.
            </p>

            {/* SECURITY TRUST BADGES */}
            <div className="space-y-3 pt-2">
              <div className="flex flex-wrap items-center gap-4 text-xs font-bold text-teal-100">
                <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
                  <ShieldCheck className="w-4 h-4 text-emerald-300" />
                  <span>Plateforme Sécurisée</span>
                </span>
                <span className="flex items-center gap-1.5 bg-white/10 px-3 py-1.5 rounded-xl border border-white/10">
                  <Lock className="w-4 h-4 text-emerald-300" />
                  <span>Cryptage SSL 256-bit</span>
                </span>
              </div>
              <p className="text-xs text-teal-200/80 font-medium">
                Paiements gérés en toute sécurité par <strong>Stripe</strong>. Téléchargements instantanés.
              </p>
            </div>
          </div>

          {/* COLUMN 2: FORMATIONS & COACHING */}
          <div className="space-y-4">
            <h4 className="text-base font-black text-white uppercase tracking-wider flex items-center gap-2 border-b border-white/20 pb-2">
              <GraduationCap className="w-4 h-4 text-emerald-300" />
              <span>Formations Vidéo</span>
            </h4>
            <ul className="space-y-2.5 text-sm font-medium">
              <li>
                <Link href="/produit/formation-wordpress" className="text-teal-100 hover:text-white transition-colors flex items-center gap-1.5 group">
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span>Formation Site Vitrine WordPress</span>
                </Link>
              </li>
              <li>
                <Link href="/produit/formation-ajouter-une-boutique-en-ligne-avec-woocommerce" className="text-teal-100 hover:text-white transition-colors flex items-center gap-1.5 group">
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span>Formation Boutique WooCommerce</span>
                </Link>
              </li>
              <li>
                <Link href="/produit/coaching-site" className="text-teal-100 hover:text-white transition-colors flex items-center gap-1.5 group">
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span>Coaching Individuel WordPress</span>
                </Link>
              </li>
              <li>
                <Link href="/boutique" className="text-teal-100 hover:text-white transition-colors flex items-center gap-1.5 group pt-1 border-t border-white/10 font-bold">
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span>Voir tous nos Guides & Formations</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* COLUMN 3: ARTICLES BLOG & INFOS */}
          <div className="space-y-4">
            <h4 className="text-base font-black text-white uppercase tracking-wider flex items-center gap-2 border-b border-white/20 pb-2">
              <Sparkles className="w-4 h-4 text-emerald-300" />
              <span>Ressources</span>
            </h4>
            <ul className="space-y-2.5 text-sm font-medium">
              <li>
                <Link href="/blog" className="text-teal-100 hover:text-white transition-colors flex items-center gap-1.5 group">
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span>Le Blog Guides Digitaux</span>
                </Link>
              </li>
              <li>
                <Link href="/blog/comment-savoir-entreprise-digitalisation" className="text-teal-100 hover:text-white transition-colors flex items-center gap-1.5 group">
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span>Test Express : Prêt à se digitaliser ?</span>
                </Link>
              </li>
              <li>
                <Link href="/quiz" className="text-teal-100 hover:text-white transition-colors flex items-center gap-1.5 group">
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span>🎯 Quiz : Mon site web c'est pour moi ?</span>
                </Link>
              </li>
              <li>
                <Link href="/a-propos" className="text-teal-100 hover:text-white transition-colors flex items-center gap-1.5 group">
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span>À Propos de Nous</span>
                </Link>
              </li>
            </ul>
          </div>

          {/* COLUMN 4: STRATEC DIGITAL & SERVICE CLIENT */}
          <div className="space-y-4">
            <h4 className="text-base font-black text-white uppercase tracking-wider flex items-center gap-2 border-b border-white/20 pb-2">
              <Headphones className="w-4 h-4 text-emerald-300" />
              <span>Accompagnement</span>
            </h4>
            <ul className="space-y-2.5 text-sm font-medium">
              <li>
                <a
                  href="https://calendar.app.google/A4SMq4zBbZYnnCr18"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-200 hover:text-white transition-colors flex items-center gap-1.5 group font-bold"
                >
                  <Calendar className="w-4 h-4 text-emerald-300" />
                  <span>Prendre un RDV Offert</span>
                  <ExternalLink className="w-3 h-3 opacity-70" />
                </a>
              </li>
              <li>
                <Link href="/contact" className="text-teal-100 hover:text-white transition-colors flex items-center gap-1.5 group">
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span>Contact & Support</span>
                </Link>
              </li>
              <li>
                <Link href="/cgv" className="text-teal-100 hover:text-white transition-colors flex items-center gap-1.5 group">
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span>Conditions Générales de Vente (CGV)</span>
                </Link>
              </li>
              <li>
                <Link href="/cgu" className="text-teal-100 hover:text-white transition-colors flex items-center gap-1.5 group">
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span>Conditions d'Utilisation (CGU)</span>
                </Link>
              </li>
              <li>
                <Link href="/politique-confidentialite" className="text-teal-100 hover:text-white transition-colors flex items-center gap-1.5 group">
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span>Politique de Confidentialité</span>
                </Link>
              </li>
              <li>
                <Link href="/mentions-legales" className="text-teal-100 hover:text-white transition-colors flex items-center gap-1.5 group">
                  <ArrowRight className="w-3.5 h-3.5 text-emerald-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <span>Mentions Légales</span>
                </Link>
              </li>
            </ul>
          </div>

        </div>

        {/* BOTTOM COPYRIGHT & LEGAL BAR */}
        <div className="pt-8 border-t border-white/20 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs font-semibold text-teal-100">
          <p className="m-0 text-center sm:text-left">
            © {new Date().getFullYear()} <strong>Guides Digitaux</strong> — Une marque et solution par{' '}
            <a
              href="https://stratec-digital.com"
              target="_blank"
              rel="noopener noreferrer"
              className="underline hover:text-white transition-colors"
            >
              Stratec Digital
            </a>
            . Tous droits réservés.
          </p>

          <div className="flex flex-wrap items-center gap-4 sm:gap-6">
            <Link href="/mentions-legales" className="hover:text-white transition-colors">Mentions Légales</Link>
            <Link href="/cgv" className="hover:text-white transition-colors">CGV</Link>
            <Link href="/cgu" className="hover:text-white transition-colors">CGU</Link>
            <Link href="/politique-confidentialite" className="hover:text-white transition-colors">Confidentialité</Link>
            <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
          </div>
        </div>

      </div>
    </footer>
  );
}
