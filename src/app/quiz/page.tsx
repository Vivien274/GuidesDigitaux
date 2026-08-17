'use client';

import React from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DigitalizationQuiz from '@/components/DigitalizationQuiz';
import { Sparkles, HelpCircle, ShieldCheck, CheckCircle2 } from 'lucide-react';

export default function QuizPage() {
  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#332420] font-sans">
      <Header />

      {/* TOP HERO BANNER */}
      <section className="py-12 md:py-16 bg-gradient-to-b from-[#eef4fb] via-[#f7f4ee] to-[#faf8f5] border-b border-[#eee7da]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
          <span className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full text-xs font-extrabold bg-[#e6f4f3] text-[#18757d] uppercase tracking-wider shadow-2xs">
            <Sparkles className="w-4 h-4 text-[#F2542D]" />
            Diagnostic Digital 100% Gratuit
          </span>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#332420] tracking-tight leading-tight">
            Mon site web, <span className="text-[#18757d]">c'est pour moi ?</span>
          </h1>

          <p className="text-sm sm:text-base text-[#5e4d46] max-w-2xl mx-auto leading-relaxed font-semibold">
            Réponds à 6 questions simples pour évaluer tes besoins, lever tes appréhensions et recevoir ton plan d'action personnalisé en 2 minutes chrono.
          </p>
        </div>
      </section>

      {/* QUIZ CONTAINER */}
      <section className="py-10 md:py-14">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <DigitalizationQuiz />
        </div>
      </section>

      <Footer />
    </div>
  );
}
