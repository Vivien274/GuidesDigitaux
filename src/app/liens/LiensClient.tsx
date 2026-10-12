'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { 
  Sparkles, 
  Calendar, 
  GraduationCap, 
  ShoppingBag, 
  BookOpen, 
  ArrowRight, 
  CheckCircle2, 
  Share2, 
  Copy, 
  Check, 
  ExternalLink,
  MessageCircle,
  HelpCircle,
  Globe,
  Mail,
  MapPin,
  Flame,
  Award,
  Layers,
  Calculator
} from 'lucide-react';

interface LinkItem {
  id: string;
  title: string;
  description: string;
  url: string;
  category: 'highlight' | 'free' | 'formation' | 'boutique' | 'social';
  badge?: string;
  badgeColor?: 'teal' | 'coral' | 'amber' | 'emerald';
  isExternal?: boolean;
  icon: React.ReactNode;
}

export default function LiensClient() {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'all' | 'free' | 'formation' | 'boutique'>('all');

  const handleShare = async () => {
    const shareUrl = typeof window !== 'undefined' ? window.location.href : 'https://www.guides-digitaux.com/liens';
    const shareData = {
      title: 'Guides Digitaux — Tous nos liens utiles',
      text: 'Ressources, formations, coaching et quiz pour artisans et créateurs par Guides Digitaux.',
      url: shareUrl,
    };

    if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
      try {
        await navigator.share(shareData);
        return;
      } catch (err) {
        // Fallback to clipboard
      }
    }

    if (navigator.clipboard) {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const links: LinkItem[] = [
    {
      id: 'quiz',
      title: '🎯 Quiz Express : Mon site web est-il fait pour moi ?',
      description: 'Réponds à 6 questions en 2 minutes pour tester ton projet et savoir par où commencer en toute sérénité.',
      url: '/quiz',
      category: 'highlight',
      badge: '100% GRATUIT • 2 MIN',
      badgeColor: 'coral',
      icon: <Sparkles className="w-5 h-5 text-[#e05a47]" />
    },
    {
      id: 'rdv-offert',
      title: '📅 Réserver un échange découverte offert (30 min)',
      description: 'Faisons le point en visio en tête-à-tête sur ton activité d’artisan et levons tes blocages digitaux.',
      url: 'https://calendar.app.google/A4SMq4zBbZYnnCr18',
      category: 'highlight',
      badge: 'CRÉNEAUX OFFERTS',
      badgeColor: 'emerald',
      isExternal: true,
      icon: <Calendar className="w-5 h-5 text-emerald-600" />
    },
    {
      id: 'coaching',
      title: '🤝 Coaching Individuel & Déblocage Visio (2 x 45 min)',
      description: 'Deux sessions en direct avec partage d’écran pour corriger tes bugs et valider ton site ou ta fiche.',
      url: '/produit/coaching-site',
      category: 'formation',
      badge: 'SUR-MESURE • 97 €',
      badgeColor: 'teal',
      icon: <Award className="w-5 h-5 text-[#18757d]" />
    },
    {
      id: 'formation-wordpress',
      title: '💻 Formation Vidéo : Créer sa vitrine avec WordPress',
      description: 'Le programme pas-à-pas pour bâtir un site pro, élégant et visible localement sans aucune ligne de code.',
      url: '/tunnel/formation-wordpress',
      category: 'formation',
      badge: 'PAGE DE VENTE • FORMATION',
      badgeColor: 'teal',
      icon: <GraduationCap className="w-5 h-5 text-[#18757d]" />
    },
    {
      id: 'formation-woocommerce',
      title: '🛒 Formation Vidéo : Boutique en ligne WooCommerce',
      description: 'Transforme ton site en boutique e-commerce rentable avec paiements Stripe sécurisés et 0% de commission.',
      url: '/produit/formation-ajouter-une-boutique-en-ligne-avec-woocommerce',
      category: 'formation',
      badge: 'E-COMMERCE',
      badgeColor: 'teal',
      icon: <ShoppingBag className="w-5 h-5 text-[#18757d]" />
    },
    {
      id: 'formation-google',
      title: '📍 Cap Visibilité Google : Attirer les clients locaux',
      description: 'Le GPS pas-à-pas pour positionner ton atelier ou cabinet en tête des recherches Google Maps de ta ville.',
      url: '/tunnel/formation-fiche-google',
      category: 'formation',
      badge: 'PAGE DE VENTE • SEO LOCAL',
      badgeColor: 'teal',
      icon: <MapPin className="w-5 h-5 text-[#18757d]" />
    },
    {
      id: 'calculateur',
      title: '📊 Calculateur de Score Visibilité Google Maps',
      description: 'Évalue en direct l’impact potentiel de ta fiche d’établissement sur tes demandes de devis et visites.',
      url: '/outils/calculateur-fiche-google',
      category: 'free',
      badge: 'TEST IMMÉDIAT',
      badgeColor: 'emerald',
      icon: <Calculator className="w-5 h-5 text-emerald-600" />
    },
    {
      id: 'boutique',
      title: '🛍️ La Boutique : Tous nos Ebooks & Checklists (dès 5 €)',
      description: 'Mini-guides PDF, checklists de lancement et guides pratiques adaptés aux artisans débutants.',
      url: '/boutique',
      category: 'boutique',
      badge: 'RESSOURCES PRO',
      badgeColor: 'amber',
      icon: <BookOpen className="w-5 h-5 text-amber-700" />
    },
    {
      id: 'blog',
      title: '✍️ Le Blog : Astuces & Conseils pour Artisans',
      description: 'Articles concrets, tutoriels et comparatifs simples sans jargon pour comprendre le web à ton rythme.',
      url: '/blog',
      category: 'free',
      badge: 'LECTURE LIBRE',
      badgeColor: 'teal',
      icon: <Layers className="w-5 h-5 text-[#18757d]" />
    },
    {
      id: 'contact',
      title: '💬 Poser une question à Stéphanie (Contact)',
      description: 'Un doute ou une question sur une formation ? Écris-moi directement, je te réponds avec plaisir.',
      url: '/contact',
      category: 'social',
      badge: 'RÉPONSE RAPIDE',
      badgeColor: 'teal',
      icon: <MessageCircle className="w-5 h-5 text-[#18757d]" />
    }
  ];

  const filteredLinks = links.filter((item) => {
    if (activeTab === 'all') return true;
    if (activeTab === 'free') return item.category === 'free' || item.category === 'highlight';
    if (activeTab === 'formation') return item.category === 'formation';
    if (activeTab === 'boutique') return item.category === 'boutique';
    return true;
  });

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#332420] py-6 sm:py-10 px-4 flex flex-col justify-between selection:bg-[#18757d] selection:text-white">
      
      {/* CONTENEUR PRINCIPAL STYLE LINKTREE */}
      <main className="w-full max-w-xl mx-auto space-y-6">
        
        {/* BARRE DU HAUT : RETOUR SITE & BOUTON PARTAGER */}
        <header className="flex items-center justify-between px-2 pt-1">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-xs font-bold text-[#5e4d46] hover:text-[#18757d] transition-colors py-1.5 px-3 rounded-full hover:bg-white/60"
            title="Revenir sur l'accueil de Guides Digitaux"
          >
            <Globe className="w-4 h-4 text-[#18757d]" />
            <span>guides-digitaux.com</span>
          </Link>

          <button
            onClick={handleShare}
            className="inline-flex items-center gap-1.5 text-xs font-bold text-[#18757d] bg-white border border-[#ebdcc8] hover:border-[#18757d] px-3.5 py-1.5 rounded-full shadow-2xs hover:shadow-xs transition-all active:scale-95"
            aria-label="Partager cette page"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-600" />
                <span className="text-emerald-700">Lien copié !</span>
              </>
            ) : (
              <>
                <Share2 className="w-3.5 h-3.5" />
                <span>Partager</span>
              </>
            )}
          </button>
        </header>

        {/* PROFIL & IDENTITÉ DE MARQUE */}
        <section className="text-center space-y-4 pt-2">
          {/* Avatar avec cercle élégant */}
          <div className="relative inline-block">
            <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-full overflow-hidden border-4 border-white shadow-md mx-auto relative bg-[#f4ede0]">
              <Image
                src="/images/stephanie.webp"
                alt="Stéphanie Rocq - Fondatrice de Guides Digitaux"
                fill
                priority
                className="object-cover"
                sizes="(max-width: 640px) 96px, 112px"
              />
            </div>
            {/* Badge certifié Guides Digitaux */}
            <div 
              className="absolute bottom-0 right-1 bg-[#18757d] text-white p-1 rounded-full border-2 border-white shadow-xs"
              title="Compte certifié Guides Digitaux"
            >
              <CheckCircle2 className="w-4 h-4 fill-[#18757d] text-white" />
            </div>
          </div>

          {/* Titre & Bio */}
          <div className="space-y-1.5 px-4">
            <h1 className="text-xl sm:text-2xl font-black text-[#332420] tracking-tight m-0">
              Stéphanie Rocq • Guides Digitaux
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-[#5e4d46] max-w-md mx-auto leading-relaxed m-0">
              Le digital sans jargon pour les artisans, créateurs & indépendants 🚀
            </p>
            <p className="text-[11px] font-bold text-[#18757d] uppercase tracking-wider flex items-center justify-center gap-1 pt-0.5">
              <MapPin className="w-3 h-3" />
              <span>Nord (Lille • Comines) & En ligne</span>
            </p>
          </div>

          {/* RANGÉE DE BOUTONS RÉSEAUX SOCIAUX */}
          <nav aria-label="Réseaux sociaux officiels" className="flex items-center justify-center gap-2.5 pt-1">
            {/* Instagram */}
            <a
              href="https://www.instagram.com/stratec_digital"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Rejoindre sur Instagram"
              className="w-10 h-10 rounded-2xl bg-white border border-[#ebdcc8] text-[#e05a47] flex items-center justify-center shadow-2xs hover:shadow-sm hover:border-[#e05a47] hover:scale-105 transition-all"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
              </svg>
            </a>

            {/* Facebook */}
            <a
              href="https://www.facebook.com/stratec-digital"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Rejoindre sur Facebook"
              className="w-10 h-10 rounded-2xl bg-white border border-[#ebdcc8] text-[#1877f2] flex items-center justify-center shadow-2xs hover:shadow-sm hover:border-[#1877f2] hover:scale-105 transition-all"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
              </svg>
            </a>


            {/* Google Calendar (Prendre RDV) */}
            <a
              href="https://calendar.app.google/A4SMq4zBbZYnnCr18"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Prendre un rendez-vous visio"
              className="w-10 h-10 rounded-2xl bg-white border border-[#ebdcc8] text-emerald-600 flex items-center justify-center shadow-2xs hover:shadow-sm hover:border-emerald-600 hover:scale-105 transition-all"
            >
              <Calendar className="w-4 h-4" />
            </a>

            {/* Contact direct */}
            <Link
              href="/contact"
              aria-label="Contacter Stéphanie par e-mail"
              className="w-10 h-10 rounded-2xl bg-white border border-[#ebdcc8] text-[#18757d] flex items-center justify-center shadow-2xs hover:shadow-sm hover:border-[#18757d] hover:scale-105 transition-all"
            >
              <Mail className="w-4 h-4" />
            </Link>
          </nav>
        </section>

        {/* ONGLETS DE FILTRE RAPIDE */}
        <div className="flex items-center justify-center gap-2 overflow-x-auto py-1 scrollbar-none">
          <button
            onClick={() => setActiveTab('all')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${
              activeTab === 'all'
                ? 'bg-[#18757d] text-white shadow-xs'
                : 'bg-white border border-[#ebdcc8] text-[#5e4d46] hover:bg-[#f4ede0]'
            }`}
          >
            Tous les liens ({links.length})
          </button>
          <button
            onClick={() => setActiveTab('free')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${
              activeTab === 'free'
                ? 'bg-[#18757d] text-white shadow-xs'
                : 'bg-white border border-[#ebdcc8] text-[#5e4d46] hover:bg-[#f4ede0]'
            }`}
          >
            🎯 Gratuit
          </button>
          <button
            onClick={() => setActiveTab('formation')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${
              activeTab === 'formation'
                ? 'bg-[#18757d] text-white shadow-xs'
                : 'bg-white border border-[#ebdcc8] text-[#5e4d46] hover:bg-[#f4ede0]'
            }`}
          >
            🎓 Formations & Coaching
          </button>
          <button
            onClick={() => setActiveTab('boutique')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all shrink-0 ${
              activeTab === 'boutique'
                ? 'bg-[#18757d] text-white shadow-xs'
                : 'bg-white border border-[#ebdcc8] text-[#5e4d46] hover:bg-[#f4ede0]'
            }`}
          >
            🛍️ Boutique
          </button>
        </div>

        {/* LISTE DES CARTES DE LIENS (STYLE LINKTREE MODERNE) */}
        <section aria-label="Liens utiles" className="space-y-3.5">
          {filteredLinks.map((item) => {
            const isHighlight = item.category === 'highlight';
            const badgeClasses = {
              coral: 'bg-[#fbeae7] text-[#e05a47] border-[#fad5ce]',
              emerald: 'bg-[#e8f7f0] text-emerald-700 border-[#c6ebd7]',
              amber: 'bg-[#fef4e6] text-amber-800 border-[#fce3c3]',
              teal: 'bg-[#e6f4f3] text-[#18757d] border-[#c2e4e1]'
            }[item.badgeColor || 'teal'];

            const CardContent = (
              <div
                className={`relative group p-4 sm:p-5 rounded-3xl border transition-all duration-200 flex items-center justify-between gap-4 shadow-2xs hover:shadow-md hover:scale-[1.015] ${
                  isHighlight
                    ? 'bg-gradient-to-r from-white via-white to-[#fdf9f4] border-[#18757d]/40 ring-2 ring-[#18757d]/10'
                    : 'bg-white border-[#ebdcc8] hover:border-[#18757d]'
                }`}
              >
                {/* Icône à gauche */}
                <div 
                  className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-105 ${
                    isHighlight ? 'bg-[#f4ede0]' : 'bg-[#faf8f5]'
                  }`}
                >
                  {item.icon}
                </div>

                {/* Contenu central */}
                <div className="flex-1 min-w-0 space-y-1">
                  <div className="flex items-center gap-2 flex-wrap">
                    <h2 className="text-sm sm:text-base font-extrabold text-[#332420] group-hover:text-[#18757d] transition-colors leading-snug m-0">
                      {item.title}
                    </h2>
                    {item.badge && (
                      <span className={`inline-block px-2 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider border ${badgeClasses}`}>
                        {item.badge}
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-[#5e4d46] leading-relaxed line-clamp-2 m-0">
                    {item.description}
                  </p>
                </div>

                {/* Flèche d'action */}
                <div className="w-8 h-8 rounded-full bg-[#faf8f5] group-hover:bg-[#18757d] group-hover:text-white text-[#5e4d46] flex items-center justify-center shrink-0 transition-all">
                  {item.isExternal ? (
                    <ExternalLink className="w-3.5 h-3.5" />
                  ) : (
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-0.5" />
                  )}
                </div>
              </div>
            );

            if (item.isExternal) {
              return (
                <a
                  key={item.id}
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="block no-underline"
                >
                  {CardContent}
                </a>
              );
            }

            return (
              <Link key={item.id} href={item.url} className="block no-underline">
                {CardContent}
              </Link>
            );
          })}
        </section>

        {/* ENCADRÉ SPÉCIAL : DÉLÉGATION & CRÉATION SUR-MESURE PAR STRATEC DIGITAL */}
        <section className="p-6 bg-[#f4ede0] rounded-3xl border border-[#ebdcc8] space-y-3 shadow-2xs">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#18757d] text-white flex items-center justify-center shrink-0">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-wider text-[#18757d] block">
                Besoin d’un site clé en main ?
              </span>
              <h3 className="text-sm sm:text-base font-black text-[#332420] m-0">
                Tu préfères déléguer la création de ton site ?
              </h3>
            </div>
          </div>
          <p className="text-xs text-[#5e4d46] leading-relaxed m-0">
            Découvre notre agence web <strong>Stratec Digital</strong> à Comines (Métropole lilloise). Nous créons ton site vitrine ou ta boutique e-commerce sur-mesure de A à Z.
          </p>
          <div className="pt-1">
            <a
              href="https://stratec-digital.com"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-xs font-black text-[#18757d] hover:text-[#12595f] underline underline-offset-4"
            >
              <span>Découvrir les prestations Stratec Digital</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </section>

      </main>

      {/* PIED DE PAGE DISCRET STYLE BIO */}
      <footer className="w-full max-w-xl mx-auto pt-8 pb-4 text-center space-y-3">
        <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-xs font-bold text-[#5e4d46]">
          <Link href="/" className="hover:text-[#18757d] transition-colors">Accueil</Link>
          <span>•</span>
          <Link href="/boutique" className="hover:text-[#18757d] transition-colors">Boutique</Link>
          <span>•</span>
          <Link href="/contact" className="hover:text-[#18757d] transition-colors">Contact</Link>
          <span>•</span>
          <Link href="/mentions-legales" className="hover:text-[#18757d] transition-colors">Mentions Légales</Link>
          <span>•</span>
          <Link href="/cgv" className="hover:text-[#18757d] transition-colors">CGV</Link>
        </div>

        <p className="text-[11px] font-semibold text-[#8b7971] m-0">
          © {new Date().getFullYear()} <strong>Guides Digitaux</strong> — Une marque de Stratec Digital.
        </p>
      </footer>

    </div>
  );
}
