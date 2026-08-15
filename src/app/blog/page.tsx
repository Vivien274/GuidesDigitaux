'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { ArrowRight, Calendar, Clock, Sparkles, BookOpen } from 'lucide-react';
import { BLOG_ARTICLES } from '@/data/blogArticles';

export default function BlogPage() {
  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#332420] font-sans selection:bg-[#18757d] selection:text-white">
      <Header />

      {/* HERO SECTION */}
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-[#f4ede0]/60 via-[#faf8f5] to-[#faf8f5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-black bg-[#e6f4f3] text-[#18757d] uppercase tracking-wider shadow-2xs">
            Conseils & Astuces Web
          </span>

          <h1 className="text-3xl sm:text-5xl font-black text-[#332420] tracking-tight">
            Le Blog <span className="text-[#18757d]">Guides Digitaux</span>
          </h1>

          <p className="text-sm sm:text-base text-[#5e4d46] max-w-2xl mx-auto leading-relaxed">
            Conseils pratiques pour booster ta visibilité en ligne : réseaux sociaux, SEO local, Google Business Profile… Des articles pensés pour les artisans et créateurs.
          </p>
        </div>
      </section>

      {/* ARTICLES GRID */}
      <section className="py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {BLOG_ARTICLES.map((article) => (
              <article key={article.id} className="bg-white rounded-3xl overflow-hidden border border-[#e8ded0] shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between">
                <div>
                  <div className="relative h-64 w-full bg-[#faf8f5]">
                    <Image
                      src={article.image}
                      alt={article.imageAlt || article.title}
                      fill
                      className="object-cover"
                    />
                    <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-xs text-[#18757d] text-xs font-black px-3.5 py-1.5 rounded-full border border-[#eee7da] uppercase tracking-wider">
                      {article.category}
                    </span>
                  </div>

                  <div className="p-8 space-y-4">
                    <div className="flex items-center gap-4 text-xs text-slate-500 font-bold">
                      <span className="flex items-center gap-1.5">
                        <Calendar className="w-4 h-4 text-[#18757d]" />
                        {article.date}
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Clock className="w-4 h-4 text-[#18757d]" />
                        {article.readTime}
                      </span>
                    </div>

                    <h2 className="text-xl font-black text-[#332420] leading-snug hover:text-[#18757d] transition-colors cursor-pointer">
                      <Link href={`/blog/${article.slug}`}>
                        {article.title}
                      </Link>
                    </h2>

                    <p className="text-xs sm:text-sm text-[#5e4d46] leading-relaxed">
                      {article.excerpt}
                    </p>
                  </div>
                </div>

                <div className="p-8 pt-0">
                  <Link
                    href={`/blog/${article.slug}`}
                    className="inline-flex items-center gap-2 text-xs font-black text-[#18757d] hover:underline uppercase tracking-wider"
                  >
                    <span>LIRE L'ARTICLE COMPLET</span>
                    <ArrowRight className="w-4 h-4" />
                  </Link>
                </div>
              </article>
            ))}
          </div>

          {/* NEWSLETTER BANNER */}
          <div className="mt-16 bg-[#18757d] text-white rounded-3xl p-8 sm:p-14 text-center space-y-6 shadow-xl relative overflow-hidden">
            <div className="max-w-2xl mx-auto space-y-3">
              <span className="inline-block px-4 py-1.5 rounded-full text-xs font-black bg-white/20 text-white uppercase tracking-wider">
                Infobulle Hebdo
              </span>
              <h3 className="text-2xl sm:text-4xl font-black">
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
                className="flex-1 bg-white text-[#332420] placeholder-slate-400 px-5 py-3.5 rounded-2xl text-xs focus:outline-none font-bold"
              />
              <button
                type="submit"
                className="px-6 py-3.5 bg-[#e05a47] hover:bg-[#c94b39] text-white font-black text-xs uppercase tracking-wider rounded-2xl transition-colors shrink-0 shadow-md"
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
