'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ArrowRight, Calendar, Clock, Sparkles } from 'lucide-react';

const ARTICLES = [
  {
    id: 1,
    title: "5 erreurs à éviter sur Instagram quand on est artisan",
    category: "Réseaux Sociaux",
    date: "28 Juillet 2026",
    readTime: "5 min de lecture",
    excerpt: "Découvre les pièges classiques du marketing sur Instagram et comment valoriser ton savoir-faire artisanal sans y passer tes journées.",
    image: "https://www.guides-digitaux.com/wp-content/uploads/2026/03/Gemini_Generated_Image_np3zehnp3zehnp3z-scaled.webp"
  },
  {
    id: 2,
    title: "Comment bien référencer sa boutique en ligne sur Google (SEO)",
    category: "Référencement SEO",
    date: "15 Juillet 2026",
    readTime: "8 min de lecture",
    excerpt: "Des conseils simples et applicables immédiatement pour positionner tes fiches produits au sommet des résultats de recherche locaux.",
    image: "https://www.guides-digitaux.com/wp-content/uploads/2026/03/Capture-decran-2026-03-26-a-12.04.58.webp"
  },
  {
    id: 3,
    title: "Comprendre ses statistiques sans être un expert en données",
    category: "Organisation & Stats",
    date: "02 Juillet 2026",
    readTime: "6 min de lecture",
    excerpt: "Les 4 seuls indicateurs que tu dois suivre chaque mois pour ajuster ta stratégie et faire grandir tes ventes sans stress.",
    image: "https://www.guides-digitaux.com/wp-content/uploads/2026/03/Capture-decran-2026-03-26-a-11.58.28.webp"
  }
];

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#332420] font-sans">
      <Header />

      {/* HERO SECTION */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-[#eef4fb] to-[#faf8f5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="inline-block px-3.5 py-1 rounded-full text-xs font-extrabold bg-[#e6f4f3] text-[#18757d] uppercase tracking-wider">
            Conseils & Tutoriels
          </span>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#332420] tracking-tight">
            Le Blog <span className="text-[#18757d]">Guides Digitaux</span>
          </h1>

          <p className="text-sm sm:text-base text-[#5e4d46] max-w-2xl mx-auto leading-relaxed">
            Astuces concrètes, stratégies de vente et guides pratiques spécialement écrits pour les artisans, créateurs et indépendants.
          </p>
        </div>
      </section>

      {/* ARTICLES GRID */}
      <section className="py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {ARTICLES.map((article) => (
              <article key={article.id} className="bg-white rounded-3xl overflow-hidden border border-[#eee7da] shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between">
                <div>
                  <div className="relative h-52 w-full bg-[#faf8f5]">
                    <Image src={article.image} alt={article.title} fill className="object-cover" />
                    <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-xs text-[#18757d] text-xs font-extrabold px-3 py-1 rounded-full border border-[#eee7da]">
                      {article.category}
                    </span>
                  </div>

                  <div className="p-6 space-y-3">
                    <div className="flex items-center gap-4 text-xs text-slate-500 font-medium">
                      <span className="flex items-center gap-1">
                        <Calendar className="w-3.5 h-3.5" />
                        {article.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {article.readTime}
                      </span>
                    </div>

                    <h2 className="text-lg font-extrabold text-[#332420] leading-snug hover:text-[#18757d] transition-colors cursor-pointer">
                      {article.title}
                    </h2>

                    <p className="text-xs text-[#5e4d46] leading-relaxed">
                      {article.excerpt}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <button className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#18757d] hover:underline">
                    LIRE L'ARTICLE COMPLET
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </article>
            ))}
          </div>

          {/* NEWSLETTER BANNER */}
          <div className="mt-16 bg-[#18757d] text-white rounded-3xl p-8 sm:p-12 text-center space-y-6 shadow-xl relative overflow-hidden">
            <div className="max-w-2xl mx-auto space-y-3">
              <span className="inline-block px-3 py-1 rounded-full text-xs font-extrabold bg-white/20 text-white uppercase tracking-wider">
                Infobulle Hebdo
              </span>
              <h3 className="text-2xl sm:text-3xl font-extrabold">
                Reçois nos meilleurs conseils directement par mail
              </h3>
              <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed">
                Pas de spam, uniquement des conseils 100% pratiques pour faire évoluer ton activité à ton rythme.
              </p>
            </div>

            <form onSubmit={(e) => { e.preventDefault(); alert('Merci pour ton inscription !'); }} className="max-w-md mx-auto flex flex-col sm:flex-row gap-3">
              <input
                type="email"
                placeholder="Ton adresse email professionnelle..."
                required
                className="flex-1 bg-white text-[#332420] placeholder-slate-400 px-5 py-3.5 rounded-2xl text-xs focus:outline-none font-medium"
              />
              <button
                type="submit"
                className="px-6 py-3.5 bg-[#e05a47] hover:bg-[#c94b39] text-white font-extrabold text-xs uppercase tracking-wider rounded-2xl transition-colors shrink-0 shadow-md"
              >
                M'INSCRIRE
              </button>
            </form>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
}
