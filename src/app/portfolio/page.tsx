import React from "react";
import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PortfolioGridClient from "@/components/PortfolioGridClient";
import { PROJECTS_DATA } from "@/data/projectsData";
import { Sparkles, ArrowRight, CheckCircle2 } from "lucide-react";

export const metadata = {
  title: "Portfolio & Réalisations • Guides Digitaux | Stéphanie ROCQ",
  description:
    "Découvrez les projets concrets de sites vitrine, boutiques en ligne et refontes réalisés pour des artisans, créateurs et indépendants.",
  alternates: {
    canonical: "/portfolio",
  },
};

export default function PortfolioPage() {
  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#332420] font-sans flex flex-col justify-between">
      <Header />

      <main className="space-y-16 pb-24 pt-8">
        
        {/* PAGE HEADER */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white p-8 sm:p-12 rounded-3xl border border-[#e8ded0] shadow-sm space-y-6 text-center max-w-4xl mx-auto">
            <span className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#f4ede0] text-[#18757d] border border-[#18757d]/20 text-xs font-bold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-[#18757d]" />
              <span>Réalisations &bull; Études de Cas</span>
            </span>
            
            <h1 className="text-3xl sm:text-5xl font-black text-[#332420] tracking-tight leading-tight">
              Les projets réalisés pour nos artisans &amp; créateurs
            </h1>
            
            <p className="text-[#4a3b35] text-base sm:text-lg leading-relaxed max-w-3xl mx-auto font-medium">
              Ces réalisations sont le fruit d’un travail d’équipe avec chaque artisan et indépendant accompagné. Des solutions digitales simples, élégantes, efficaces et pensées pour leur métier, sans jargon technique.
            </p>
          </div>
        </section>

        {/* INTERACTIVE CLIENT PROJECTS GRID & MODAL */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <PortfolioGridClient projects={PROJECTS_DATA} />
        </section>

        {/* CTA BANNER */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-gradient-to-br from-[#18757d] to-[#12595f] text-white rounded-3xl p-10 sm:p-12 text-center space-y-5 shadow-xl relative overflow-hidden">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/20 text-white text-xs font-extrabold uppercase tracking-wider">
              <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
              <span>Passez à l'action</span>
            </div>

            <h2 className="text-2xl sm:text-4xl font-black text-white">
              Vous avez un projet similaire pour votre activité ?
            </h2>
            
            <p className="text-sm sm:text-base text-teal-100 max-w-xl mx-auto leading-relaxed font-medium">
              Discutons ensemble de vos envies et créons la solution digitale qui correspond exactement à votre savoir-faire.
            </p>

            <div className="pt-2 flex flex-wrap justify-center gap-4">
              <Link
                href="/contact"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl font-black text-sm text-[#18757d] bg-[#f4ede0] hover:bg-white transition-all shadow-md hover:scale-105 uppercase tracking-wider"
              >
                <span>Me présenter mon projet</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              
              <Link
                href="/boutique"
                className="inline-flex items-center gap-2 px-7 py-3.5 rounded-2xl font-black text-sm text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-all uppercase tracking-wider"
              >
                <span>Découvrir nos formations</span>
              </Link>
            </div>
          </div>
        </section>

      </main>

      <Footer />
    </div>
  );
}

