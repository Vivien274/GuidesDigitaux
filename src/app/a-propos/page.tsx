'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { 
  ArrowRight, 
  CheckCircle2, 
  Clock, 
  Star, 
  RefreshCw, 
  TrendingUp, 
  BookOpen, 
  FileText, 
  GraduationCap, 
  Lightbulb, 
  Mail, 
  Share2, 
  Globe, 
  Sparkles 
} from 'lucide-react';

export default function AProposPage() {
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail) {
      setSubmitted(true);
      setTimeout(() => setSubmitted(false), 4000);
      setNewsletterEmail('');
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#332420] font-sans">
      <Header />

      {/* TOP HEADER BANNER */}
      <section className="bg-[#faf8f5] py-8 text-center px-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl sm:text-4xl font-extrabold text-[#18757d] leading-snug">
            Le digital sans stress et sans jargon{' '}
            <span className="text-[#332420]">
              pour les artisans et créateurs qui veulent enfin passer le cap.
            </span>
          </h1>
        </div>
      </section>

      {/* BLOCK 1: BIENVENUE SUR GUIDES-DIGITAUX */}
      <section className="py-16 md:py-24 bg-[#faf8f5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column Text */}
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-block px-4 py-1.5 rounded-full text-xs font-bold bg-[#f4ede0] text-[#332420]">
                À propos de Guides Digitaux
              </div>

              <h2 className="text-3xl sm:text-5xl font-extrabold text-[#332420] tracking-tight leading-tight">
                Bienvenue sur{' '}
                <span className="text-[#18757d] relative inline-block">
                  Guides-Digitaux
                  <svg className="absolute -bottom-2 left-0 w-full h-3" viewBox="0 0 140 14" fill="none">
                    <path d="M4 10C35 4 105 3 136 10" stroke="#e05a47" strokeWidth="4" strokeLinecap="round" />
                  </svg>
                </span>
              </h2>

              <p className="text-sm font-bold text-[#18757d]">
                La plateforme d'accompagnement gourmande, concrète et accessible.
              </p>

              <p className="text-sm sm:text-base text-[#5e4d46] leading-relaxed">
                Tu es artisan, créateur ou indépendant ? Tu souhaites développer ton activité sur internet sans te perdre dans le jargon technique ni passer des heures devant un écran ? Tu es au bon endroit ! Notre mission : te rendre autonome, à ton rythme et sans prise de tête.
              </p>

              <div className="pt-2">
                <Link
                  href="/boutique"
                  className="inline-flex items-center gap-2 px-7 py-4 text-xs font-extrabold text-white bg-[#18757d] hover:bg-[#12595f] rounded-2xl shadow-md uppercase tracking-wider transition-colors"
                >
                  VOIR NOS GUIDES
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

            {/* Right Column Photos Collage */}
            <div className="lg:col-span-6 grid grid-cols-2 gap-4">
              <div className="space-y-4">
                <div className="relative h-64 rounded-3xl overflow-hidden shadow-md">
                  <Image
                    src="/images/hero_artisan.png"
                    alt="Artisane au travail"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
              <div className="space-y-4 pt-6">
                <div className="relative h-44 rounded-3xl overflow-hidden shadow-md">
                  <Image
                    src="/images/attirer.png"
                    alt="Créateurs en atelier"
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="relative h-44 rounded-3xl overflow-hidden shadow-md">
                  <Image
                    src="/images/apprendre.png"
                    alt="Apprentissage du digital"
                    fill
                    className="object-cover"
                  />
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* BLOCK 2: NOTRE CONSTAT */}
      <section className="py-16 md:py-24 bg-[#f5f1e8] border-t border-[#e8ded0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#e8ded0] shadow-sm grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
            
            <div className="lg:col-span-4 relative h-64 sm:h-80 rounded-2xl overflow-hidden">
              <Image
                src="/images/transformer.png"
                alt="Travail sur ordinateur portable"
                fill
                className="object-cover"
              />
            </div>

            <div className="lg:col-span-8 space-y-5 text-center lg:text-left">
              <div className="inline-block px-3.5 py-1 rounded-full text-xs font-bold bg-[#f4ede0] text-[#332420]">
                Notre constat
              </div>

              <h2 className="text-2xl sm:text-4xl font-extrabold text-[#332420] leading-snug">
                Parce que{' '}
                <span className="text-[#18757d] font-extrabold">beaucoup d'artisans</span>{' '}
                savent qu'ils doivent "se digitaliser"... mais ne savent pas comment.
              </h2>

              <p className="text-sm sm:text-base text-[#5e4d46] leading-relaxed">
                Créer un site, publier sur les réseaux sociaux, gérer un fichier client... La digitalisation peut vite devenir écrasante. C'est pourquoi nous avons créé des guides et formations simples, sans blabla, pensés spécifiquement pour le quotidien des artisans et créateurs.
              </p>
            </div>

          </div>

          {/* 4 VALUE PILLARS BAR */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mt-16 text-center">
            
            <div className="bg-white p-6 rounded-2xl border border-[#e8ded0] shadow-2xs flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-[#e6f4f3] text-[#18757d] flex items-center justify-center mb-3">
                <Clock className="w-6 h-6" />
              </div>
              <h3 className="text-base font-extrabold text-[#332420]">Gagner du temps</h3>
              <p className="text-xs text-[#5e4d46] mt-1">en allant à l'essentiel</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#e8ded0] shadow-2xs flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-[#e6f4f3] text-[#18757d] flex items-center justify-center mb-3">
                <Star className="w-6 h-6 fill-[#18757d]" />
              </div>
              <h3 className="text-base font-extrabold text-[#332420]">Attirer plus de clients</h3>
              <p className="text-xs text-[#5e4d46] mt-1">grâce à une meilleure visibilité en ligne</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#e8ded0] shadow-2xs flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-[#e6f4f3] text-[#18757d] flex items-center justify-center mb-3">
                <RefreshCw className="w-6 h-6" />
              </div>
              <h3 className="text-base font-extrabold text-[#332420]">Automatiser</h3>
              <p className="text-xs text-[#5e4d46] mt-1">tes tâches répétitives</p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#e8ded0] shadow-2xs flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-[#e6f4f3] text-[#18757d] flex items-center justify-center mb-3">
                <TrendingUp className="w-6 h-6" />
              </div>
              <h3 className="text-base font-extrabold text-[#332420]">Faire grandir ton activité</h3>
              <p className="text-xs text-[#5e4d46] mt-1">sans y passer tes journées</p>
            </div>

          </div>

        </div>
      </section>

      {/* BLOCK 3: QUI EST DERRIÈRE GUIDES-DIGITAUX.COM ? */}
      <section className="py-16 md:py-24 bg-[#faf8f5] border-t border-[#eee7da]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          <div className="inline-block px-4 py-1.5 rounded-full text-xs font-bold bg-[#f4ede0] text-[#332420] mb-4">
            Les coulisses de l'aventure
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#332420] mb-12">
            Qui est derrière Guides-Digitaux.com ?
          </h2>

          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#eee7da] shadow-md relative overflow-hidden">
            
            {/* Real Founder Photo */}
            <div className="w-36 h-36 sm:w-40 sm:h-40 rounded-full overflow-hidden mx-auto border-4 border-[#18757d] shadow-lg mb-6 relative">
              <Image
                src="/images/stephanie_v2.png"
                alt="Stéphanie ROCQ"
                fill
                className="object-cover object-[center_65%]"
              />
            </div>

            <h3 className="text-2xl font-extrabold text-[#332420]">Stéphanie ROCQ</h3>
            <p className="text-sm font-bold text-[#18757d] mt-1 mb-6">
              Consultante en digitalisation des artisans et TPE
            </p>

            <p className="text-sm text-[#5e4d46] leading-relaxed max-w-2xl mx-auto mb-8">
              À travers mon entreprise{' '}
              <a
                href="https://stratec-digital.com"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#18757d] font-bold underline hover:text-[#12595f] transition-colors"
              >
                Stratec Digital
              </a>
              , j’accompagne ceux qui veulent mieux comprendre le digital pour en tirer un vrai bénéfice — pas juste “faire comme tout le monde”. Avec Guides Digitaux, j’ai voulu créer une bibliothèque de ressources pratiques, que tu peux utiliser en autonomie, selon tes besoins : un e-book pour comprendre les bases, une checklist pour structurer tes actions, une formation pour passer à l’étape suivante. Tout est conçu avec un ton bienveillant, simple et un brin décalé, parce qu’on apprend mieux quand on sourit 😊
            </p>

            {/* Social Links */}
            <div className="flex items-center justify-center gap-4 mb-8">
              <a href="#" className="w-10 h-10 rounded-full bg-[#f4ede0] text-[#e05a47] flex items-center justify-center hover:bg-[#e05a47] hover:text-white transition-colors" title="Site web">
                <Globe className="w-5 h-5" />
              </a>
              <a href="mailto:contact@guides-digitaux.com" className="w-10 h-10 rounded-full bg-[#f4ede0] text-[#e05a47] flex items-center justify-center hover:bg-[#e05a47] hover:text-white transition-colors" title="Email">
                <Mail className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-[#f4ede0] text-[#e05a47] flex items-center justify-center hover:bg-[#e05a47] hover:text-white transition-colors" title="Partager">
                <Share2 className="w-5 h-5" />
              </a>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Link
                href="/contact"
                className="w-full sm:w-auto px-7 py-3.5 text-xs font-extrabold text-white bg-[#18757d] hover:bg-[#12595f] rounded-xl shadow-md uppercase tracking-wider transition-colors"
              >
                ME CONTACTER
              </Link>
              <Link
                href="/boutique"
                className="w-full sm:w-auto px-7 py-3.5 text-xs font-extrabold text-[#18757d] bg-[#e6f4f3] hover:bg-[#d4edea] rounded-xl border border-[#18757d]/30 uppercase tracking-wider transition-colors"
              >
                DÉCOUVRIR LES GUIDES
              </Link>
            </div>

          </div>

        </div>
      </section>

      {/* BLOCK 4: NOTRE MISSION */}
      <section className="py-16 md:py-24 bg-[#f5f1e8] border-t border-[#e8ded0]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-12">
            <div className="inline-block px-4 py-1.5 rounded-full text-xs font-bold bg-[#f4ede0] text-[#332420] mb-4">
              Notre mission
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#332420]">
              Te rendre <span className="text-[#18757d]">autonome</span> dans ta communication digitale
            </h2>

            <p className="mt-4 text-sm text-[#5e4d46]">
              Nous pensons que le digital ne doit pas être une corvée, mais un levier de liberté.
            </p>
          </div>

          <div className="space-y-4 max-w-2xl mx-auto">
            <div className="bg-white p-5 rounded-2xl border border-[#e8ded0] flex items-center gap-4">
              <CheckCircle2 className="w-6 h-6 text-[#18757d] shrink-0" />
              <span className="text-sm font-extrabold text-[#332420]">Comprendre ce que tu fais et pourquoi tu le fais.</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#e8ded0] flex items-center gap-4">
              <CheckCircle2 className="w-6 h-6 text-[#18757d] shrink-0" />
              <span className="text-sm font-extrabold text-[#332420]">Choisir les bons outils adaptés à ton activité.</span>
            </div>

            <div className="bg-white p-5 rounded-2xl border border-[#e8ded0] flex items-center gap-4">
              <CheckCircle2 className="w-6 h-6 text-[#18757d] shrink-0" />
              <span className="text-sm font-extrabold text-[#332420]">Obtenir des résultats sans y passer tes nuits.</span>
            </div>
          </div>

          <p className="text-center text-xs text-[#5e4d46] mt-8 italic">
            Quel que soit ton niveau, tu trouveras ici des outils et des méthodes pour progresser sereinement, sans jargon.
          </p>

        </div>
      </section>

      {/* BLOCK 5: CE QUE TU TROUVERAS SUR GUIDES DIGITAUX */}
      <section className="py-16 md:py-24 bg-[#faf8f5] border-t border-[#eee7da]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#18757d] mb-12">
            Ce que tu trouveras sur Guides Digitaux
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            
            <div className="bg-white rounded-3xl p-6 border border-[#eee7da] shadow-2xs hover:shadow-md transition-shadow flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-[#e6f4f3] text-[#18757d] flex items-center justify-center mb-4">
                <BookOpen className="w-8 h-8" />
              </div>
              <h3 className="text-base font-extrabold text-[#332420] mb-1">📚 Des e-books pédagogiques</h3>
              <p className="text-xs text-[#5e4d46]">pour comprendre le digital simplement</p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-[#eee7da] shadow-2xs hover:shadow-md transition-shadow flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-[#e6f4f3] text-[#18757d] flex items-center justify-center mb-4">
                <FileText className="w-8 h-8" />
              </div>
              <h3 className="text-base font-extrabold text-[#332420] mb-1">✅ Des checklists prêtes à l'emploi</h3>
              <p className="text-xs text-[#5e4d46]">pour passer à l'action étape par étape</p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-[#eee7da] shadow-2xs hover:shadow-md transition-shadow flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-[#e6f4f3] text-[#18757d] flex items-center justify-center mb-4">
                <GraduationCap className="w-8 h-8" />
              </div>
              <h3 className="text-base font-extrabold text-[#332420] mb-1">🎓 Des formations en ligne</h3>
              <p className="text-xs text-[#5e4d46]">apprendre pas-à-pas avec des vidéos concrètes</p>
            </div>

            <div className="bg-white rounded-3xl p-6 border border-[#eee7da] shadow-2xs hover:shadow-md transition-shadow flex flex-col items-center">
              <div className="w-16 h-16 rounded-2xl bg-[#e6f4f3] text-[#18757d] flex items-center justify-center mb-4">
                <Lightbulb className="w-8 h-8" />
              </div>
              <h3 className="text-base font-extrabold text-[#332420] mb-1">💡 Des conseils et astuces</h3>
              <p className="text-xs text-[#5e4d46]">sur le blog pour avancer sans se tromper</p>
            </div>

          </div>

        </div>
      </section>

      {/* BLOCK 6: PHILOSOPHIE & NEWSLETTER */}
      <section className="py-16 md:py-24 bg-[#f5f1e8] border-t border-[#e8ded0]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          <div className="inline-block px-4 py-1.5 rounded-full text-xs font-bold bg-[#f4ede0] text-[#332420] mb-4">
            Notre philosophie
          </div>

          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#332420] mb-4">
            Le digital, <span className="text-[#18757d]">OUI</span> mais à ton rythme
          </h2>

          <p className="text-sm sm:text-base text-[#5e4d46] leading-relaxed max-w-2xl mx-auto mb-12">
            Pas besoin de suivre toutes les tendances ni d'être présent partout. L'important est de mettre en place les bonnes bases, étape par étape, selon tes besoins et tes envies.
          </p>

          {/* Newsletter Box */}
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-[#e8ded0] shadow-sm max-w-xl mx-auto">
            <h3 className="text-xl font-extrabold text-[#332420] mb-4 flex items-center justify-center gap-2">
              Envie de te lancer ? 🚀
            </h3>

            <form onSubmit={handleSubscribe} className="flex flex-col sm:flex-row items-center gap-3">
              <input
                type="email"
                placeholder="Votre adresse e-mail"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="w-full bg-[#faf8f5] border border-[#eee7da] rounded-full px-6 py-3.5 text-sm text-[#332420] focus:outline-none focus:border-[#18757d]"
              />

              <button
                type="submit"
                className="w-full sm:w-auto px-7 py-3.5 text-xs font-extrabold text-white bg-[#18757d] hover:bg-[#12595f] rounded-full uppercase tracking-wider transition-colors shrink-0 shadow-md"
              >
                REJOINS-NOUS
              </button>
            </form>

            {submitted && (
              <p className="text-xs font-bold text-emerald-600 bg-emerald-50 py-2 rounded-full mt-4">
                ✓ Inscription validée ! Bienvenue dans l'aventure.
              </p>
            )}
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
}
