'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter, notFound } from 'next/navigation';
import { getStoredPreorders, incrementPreorderEnrollment, PreorderCampaign } from '@/lib/preordersStore';
import { fetchPreordersFromDb, incrementPreorderEnrollmentInDb } from '@/lib/supabaseLms';
import { event } from '@/lib/metaPixel';
import { 
  CheckCircle2, 
  Sparkles, 
  Rocket, 
  AlertTriangle, 
  Lock, 
  RefreshCw, 
  Zap,
  Star,
  ShieldCheck,
  ThumbsUp,
  MessageSquare,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

function GoogleIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" {...props}>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
      />
    </svg>
  );
}

function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" width="18" height="18" fill="#1877F2" {...props}>
      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
    </svg>
  );
}

const REAL_STRATEC_REVIEWS = [
  {
    id: 1,
    author: 'Camille',
    avatarInitials: 'CM',
    role: 'Artisane Pâtissière • Studio Macarons',
    source: 'Avis vérifié Google',
    sourceType: 'google',
    rating: 5,
    quote: "« Grâce à Stéphanie, mes ateliers de pâtisserie se réservent et se paient directement en ligne sans aucun stress de gestion ! Elle a su lever toutes mes appréhensions techniques avec une vraie pédagogie et toujours la bonne humeur. »"
  },
  {
    id: 2,
    author: 'Cyntia',
    avatarInitials: 'C',
    role: 'Créatrice • Cyaness Savonnerie Artisanale',
    source: 'Avis vérifié Google',
    sourceType: 'google',
    rating: 5,
    quote: "« Stéphanie a pris le temps de comprendre les spécificités de mon activité artisanale. La refonte de ma boutique e-commerce et le travail sur mon référencement local m'ont permis de gagner en sérénité et en clarté. »"
  },
  {
    id: 3,
    author: 'Edwige',
    avatarInitials: 'E',
    role: 'Responsable • Association 1m2 : ma santé !',
    source: 'Avis vérifié Facebook',
    sourceType: 'facebook',
    rating: 5,
    quote: "« Un accompagnement bienveillant et extrêmement efficace. Stéphanie sait rendre accessibles des notions complexes. Notre présence en ligne a fait un bond en avant grâce à sa méthode sans jargon. »"
  }
];

export default function SalesFunnelPage() {
  const params = useParams();
  const router = useRouter();
  const rawId = (params?.id as string) || '';

  const [campaign, setCampaign] = useState<PreorderCampaign | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);

  const handlePrevReview = () => {
    setCurrentReviewIndex(prev => (prev === 0 ? REAL_STRATEC_REVIEWS.length - 1 : prev - 1));
  };

  const handleNextReview = () => {
    setCurrentReviewIndex(prev => (prev === REAL_STRATEC_REVIEWS.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    fetchPreordersFromDb().then(list => {
      let match = list.find(p => p.id === rawId || p.courseId === rawId);
      if (!match) {
        match = list.find(p => p.id.includes('google') || p.courseId?.includes('google'));
      }
      if (match) {
        setCampaign(match);
      }
      setIsLoading(false);

      event('ViewContent', {
        content_name: match ? match.courseTitle : 'Fais décoller ton activité locale grâce à une Fiche Google parfaite',
        content_ids: [match ? match.id : 'precommande-fiche-google'],
        content_type: 'product',
        value: match ? (match.price > 50 ? 29 : match.price) : 29,
        currency: 'EUR',
      });
    });
  }, [rawId]);

  // DIRECT STRIPE CHECKOUT HANDLER (Direct single click, no drawer, no cart)
  const handleDirectStripeCheckout = async () => {
    setIsProcessing(true);

    const targetCampaignId = campaign?.id || 'precommande-fiche-google';
    
    // Immediately increment the single-source-of-truth preorder counter in Supabase DB
    incrementPreorderEnrollmentInDb(targetCampaignId);

    const titleToSend = (campaign?.id === 'precommande-fiche-google' || !campaign || campaign.courseTitle.includes('photo'))
      ? 'Fais décoller ton activité locale grâce à une Fiche Google parfaite'
      : campaign.courseTitle;

    const priceToSend = (campaign?.id === 'precommande-fiche-google' || !campaign || campaign.price > 50)
      ? 29
      : campaign.price;

    event('InitiateCheckout', {
      content_name: titleToSend,
      content_ids: [targetCampaignId],
      content_type: 'product',
      value: priceToSend,
      currency: 'EUR',
    });

    try {
      if (typeof window !== 'undefined') {
        const existing = JSON.parse(localStorage.getItem('gd_enrolled_courses') || '[]');
        const newEnrolled = {
          id: campaign?.id || 'precommande-fiche-google',
          title: titleToSend,
          slug: 'precommande-fiche-google',
          type: 'formation',
          typeLabel: '🚀 PRÉCOMMANDE (Sortie le 15 septembre)',
          progress: 0,
          completedLessons: 0,
          totalLessons: 4,
          duration: '2h00',
          instructor: 'Stéphanie ROCQ',
          isPreorder: true,
          releaseDate: '2026-09-15',
          price: priceToSend,
          purchaseDate: new Date().toLocaleDateString('fr-FR')
        };

        if (!existing.some((e: any) => e.id === newEnrolled.id)) {
          localStorage.setItem('gd_enrolled_courses', JSON.stringify([newEnrolled, ...existing]));
        }
      }

      // Call Stripe Direct Checkout API
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId: campaign?.id || 'precommande-fiche-google',
          courseTitle: titleToSend,
          price: priceToSend,
          isPreorder: true,
          releaseDate: '15 septembre 2026'
        })
      });

      const data = await res.json();
      if (data?.url) {
        window.location.href = data.url;
        return;
      }
      
      if (data?.error) {
        alert(`Erreur Stripe : ${data.error}`);
        return;
      }
    } catch (e: any) {
      console.error('Error initiating Stripe checkout', e);
      alert(`Erreur de connexion Stripe : ${e?.message || 'Impossible d’ouvrir Stripe Checkout'}`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#332420] font-sans">
      
      {/* 1. HEADER (Official logo, no main navigation links) */}
      <header className="bg-white border-b border-[#F5DFBB] py-3.5">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <div className="relative h-12 w-48 sm:w-52 block">
            <Image
              src="/images/logo.png"
              alt="Guides Digitaux"
              fill
              className="object-contain object-left"
              priority
            />
          </div>

          <span className="px-3.5 py-1 rounded-full text-xs font-extrabold bg-[#F5DFBB] text-[#562C2C] uppercase tracking-wider border border-[#F2542D]/30 flex items-center gap-1.5 shadow-xs">
            <span className="w-2 h-2 rounded-full bg-[#F2542D] animate-pulse"></span>
            Prévente exclusive Pionnier
          </span>
        </div>
      </header>

      {/* 2. HERO BANNER SECTION (Teal background #127475 with text & Orange CTA #F2542D) */}
      <section className="bg-[#127475] text-white py-14 md:py-20 text-center px-4">
        <div className="max-w-4xl mx-auto space-y-6">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-extrabold bg-[#F5DFBB] text-[#562C2C] uppercase tracking-wider shadow-xs">
            Réservé aux artisans, créateurs et indépendants locaux
          </span>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight max-w-3xl mx-auto text-white">
            Fais de ta Fiche Google un aimant à clients <span className="text-[#F5DFBB]">(sans y passer tes nuits, ni dépenser 1€ en pub)</span>.
          </h1>

          <p className="text-base sm:text-lg text-teal-100 font-medium max-w-2xl mx-auto leading-relaxed">
            La méthode pas-à-pas pour créer, optimiser et faire vivre ton profil Google, même si l'informatique te donne envie d'envoyer valser ton ordinateur.
          </p>

          <div className="pt-4">
            <button
              onClick={handleDirectStripeCheckout}
              disabled={isProcessing}
              className="inline-flex items-center justify-center gap-2 px-8 py-5 text-sm sm:text-base font-extrabold text-white bg-[#F2542D] hover:bg-[#d8441f] rounded-full shadow-xl uppercase tracking-wider transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <Rocket className="w-5 h-5 text-white" />
              {isProcessing ? 'Connexion Stripe sécurisée...' : '👉 Je réserve ma place à 29€ (au lieu de 69€)'}
            </button>
          </div>
        </div>
      </section>

      {/* 3. SECTION 1: LE CONSTAT */}
      <section className="py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4">
          
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-[#F5DFBB] shadow-md grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Problem & Callout */}
            <div className="md:col-span-7 space-y-5">
              <h2 className="text-2xl font-extrabold text-[#562C2C] leading-snug">
                Nom d'une pipe, pourquoi ce sont toujours tes concurrents qu'on voit en premier ?
              </h2>

              <p className="text-sm font-semibold text-[#562C2C] leading-relaxed">
                Tu as un savoir-faire en or. Tu bosses dur. Mais quand on cherche ton métier sur Google dans ta ville... c'est le désert. On ne voit que tes concurrents (qui font parfois un boulot bien moins qualitatif que le tien, misère de misère...).
              </p>

              <p className="text-xs text-[#562C2C]/80 leading-relaxed">
                Peut-être que tu as bricolé une fiche à la va-vite il y a des mois, et depuis... plus rien. Zéro appel, zéro visite. Une vitrine de magasin dans une rue abandonnée, ça ne vaut pas tripette, on est d'accord ?
              </p>

              {/* Problem Highlight Box (#F5DFBB / #F2542D) */}
              <div className="p-5 bg-[#F5DFBB]/30 border-l-4 border-[#F2542D] rounded-r-2xl space-y-2 text-xs">
                <p className="font-extrabold text-[#562C2C] text-sm">
                  Le problème ?
                </p>
                <p className="text-[#562C2C] leading-relaxed font-medium">
                  L'interface de Google change tout le temps, c'est la croix et la bannière pour s'y retrouver, et le jargon technique des "experts" te donne des sueurs froides.
                </p>
              </div>
            </div>

            {/* Right Column: Founder Card with Official Photo */}
            <div className="md:col-span-5 bg-[#FAF8F5] p-6 rounded-2xl border border-[#F5DFBB] text-center space-y-4 shadow-xs">
              <div className="relative w-24 h-24 mx-auto rounded-full overflow-hidden border-2 border-[#0E9594] shadow-sm">
                <Image
                  src="/images/stephanie_v2.png"
                  alt="Stéphanie - Créatrice de Guides Digitaux"
                  fill
                  className="object-cover object-[center_65%]"
                />
              </div>

              <div>
                <h3 className="text-sm font-extrabold text-[#562C2C]">Stéphanie</h3>
                <span className="text-[11px] text-[#562C2C]/70 font-semibold block mt-0.5">Créatrice de Guides Digitaux</span>
              </div>

              <div className="p-4 bg-white rounded-xl border border-[#F5DFBB] text-xs font-semibold text-[#562C2C] italic shadow-xs">
                "Je connais la galère. Et si on reprenait le contrôle de ta visibilité locale ?"
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 4. SECTION 2: LA SOLUTION & PROGRAMME */}
      <section className="py-12 bg-gradient-to-b from-[#faf8f5] to-[#F5DFBB]/30 border-y border-[#F5DFBB]">
        <div className="max-w-4xl mx-auto px-4 space-y-8">
          
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="px-4 py-1 rounded-full text-[11px] font-extrabold bg-[#F5DFBB] text-[#562C2C] uppercase tracking-wider shadow-xs inline-block">
              LA SOLUTION
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#562C2C] leading-tight">
              Saperlipopette, respire ! J'ai la solution de derrière les fagots.
            </h2>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-[#F5DFBB] shadow-md space-y-6">
            <p className="text-sm text-[#562C2C] font-semibold leading-relaxed">
              Oublie les tutos incompréhensibles de 3 heures. J'ai créé une mini-formation vidéo, <strong>100% pensée pour les novices</strong>. On va s'installer tous les deux (virtuellement), et je vais te montrer sur mon écran, clic par clic, comment faire de ta fiche Google ton meilleur commercial.
            </p>

            <p className="text-xs text-[#562C2C]/80 leading-relaxed">
              Et attention, on ne va pas juste la "créer". Une fiche fantôme, ça ne sert à rien. On va l'optimiser aux petits oignons et <strong>apprendre à la faire vivre</strong> pour que Google te propulse tout en haut !
            </p>

            {/* Grid Programme 4 Étapes avec bordure Teal #0E9594 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
              <div className="p-5 bg-white rounded-2xl border-l-4 border-[#0E9594] border-y border-r border-[#F5DFBB] shadow-xs space-y-1.5">
                <strong className="text-xs font-extrabold text-[#562C2C] flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#0E9594]" />
                  Étape 1 : Les fondations
                </strong>
                <p className="text-xs text-[#562C2C]/80 leading-relaxed">
                  On crée ou on revendique ta fiche proprement, sans faire d'erreurs qui bloquent le profil.
                </p>
              </div>

              <div className="p-5 bg-white rounded-2xl border-l-4 border-[#0E9594] border-y border-r border-[#F5DFBB] shadow-xs space-y-1.5">
                <strong className="text-xs font-extrabold text-[#562C2C] flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#0E9594]" />
                  Étape 2 : L'optimisation cachée
                </strong>
                <p className="text-xs text-[#562C2C]/80 leading-relaxed">
                  Les petits réglages secrets que tes concurrents ne connaissent pas pour remonter.
                </p>
              </div>

              <div className="p-5 bg-white rounded-2xl border-l-4 border-[#0E9594] border-y border-r border-[#F5DFBB] shadow-xs space-y-1.5">
                <strong className="text-xs font-extrabold text-[#562C2C] flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#0E9594]" />
                  Étape 3 : La machine à étoiles
                </strong>
                <p className="text-xs text-[#562C2C]/80 leading-relaxed">
                  Ma méthode douce pour récolter des avis 5 étoiles réguliers sans harceler tes clients.
                </p>
              </div>

              <div className="p-5 bg-white rounded-2xl border-l-4 border-[#0E9594] border-y border-r border-[#F5DFBB] shadow-xs space-y-1.5">
                <strong className="text-xs font-extrabold text-[#562C2C] flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#0E9594]" />
                  Étape 4 : La routine 5 min
                </strong>
                <p className="text-xs text-[#562C2C]/80 leading-relaxed">
                  Comment poster des actus et faire vivre ta fiche en 5 minutes chrono par semaine.
                </p>
              </div>
            </div>

            <div className="pt-4 text-center">
              <button
                onClick={handleDirectStripeCheckout}
                disabled={isProcessing}
                className="inline-flex items-center justify-center gap-2 px-8 py-4 text-xs sm:text-sm font-extrabold text-white bg-[#0E9594] hover:bg-[#0c7c7c] rounded-full shadow-md uppercase tracking-wider transition-all cursor-pointer"
              >
                <Rocket className="w-4 h-4 text-[#F5DFBB]" />
                👉 Je profite du programme complet
              </button>
            </div>

          </div>

        </div>
      </section>

      {/* 4.5. SECTION RÉASSURANCE & AVIS CLIENTS CERTIFIÉS (STRATEC DIGITAL CAROUSEL) */}
      <section className="py-16 md:py-24 bg-[#FAF4F2] border-y border-[#562C2C]/10">
        <div className="max-w-5xl mx-auto px-4 space-y-10">
          
          {/* Header du bloc d'Avis */}
          <div className="text-center space-y-4 max-w-3xl mx-auto">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F5DFBB]/60 text-[#562C2C] text-xs font-extrabold uppercase tracking-wider border border-[#562C2C]/10 shadow-2xs">
              <span>💬 TÉMOIGNAGES & AVIS CLIENTS</span>
            </div>
            
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#562C2C] leading-tight tracking-tight">
              Ce que disent les artisans et créateurs qui font équipe avec moi
            </h2>
            
            <p className="text-sm sm:text-base text-slate-600 font-medium max-w-2xl mx-auto">
              Retrouvez de vrais avis certifiés issus de ma fiche Google Business Profile et de ma page Facebook.
            </p>
          </div>

          {/* Interactive Carousel Box (Matching Screenshot Pixel-by-Pixel) */}
          <div className="relative max-w-4xl mx-auto px-2 sm:px-12">
            
            {/* Left Arrow Button */}
            <button
              onClick={handlePrevReview}
              aria-label="Avis précédent"
              className="absolute left-0 sm:-left-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white border border-slate-200 text-[#562C2C] hover:text-[#F2542D] shadow-md flex items-center justify-center transition-all transform hover:scale-105 cursor-pointer"
            >
              <ChevronLeft className="w-6 h-6" />
            </button>

            {/* Right Arrow Button */}
            <button
              onClick={handleNextReview}
              aria-label="Avis suivant"
              className="absolute right-0 sm:-right-4 top-1/2 -translate-y-1/2 z-20 w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-white border border-slate-200 text-[#562C2C] hover:text-[#F2542D] shadow-md flex items-center justify-center transition-all transform hover:scale-105 cursor-pointer"
            >
              <ChevronRight className="w-6 h-6" />
            </button>

            {/* Main Carousel Card */}
            {(() => {
              const currentReview = REAL_STRATEC_REVIEWS[currentReviewIndex];
              return (
                <div className="bg-white rounded-3xl p-6 sm:p-10 md:p-12 shadow-xl border border-[#562C2C]/10 relative space-y-6">
                  
                  {/* Top Row: Stars + Source Badge + Large Quote Mark */}
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex text-[#F2542D]">
                      {[...Array(currentReview.rating)].map((_, i) => (
                        <Star key={i} className="w-5 h-5 fill-[#F2542D] text-[#F2542D]" />
                      ))}
                    </div>

                    <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-emerald-50 text-[#0E9594] border border-[#0E9594]/20 text-xs font-bold">
                      <CheckCircle2 className="w-3.5 h-3.5 text-[#0E9594]" />
                      <span>{currentReview.source}</span>
                    </div>

                    <span className="text-6xl sm:text-7xl font-serif text-[#F5DFBB] leading-none absolute right-8 top-4 opacity-50 select-none pointer-events-none">
                      ”
                    </span>
                  </div>

                  {/* Review Text */}
                  <p className="text-sm sm:text-base md:text-lg text-[#562C2C] font-semibold italic leading-relaxed pt-1">
                    {currentReview.quote}
                  </p>

                  {/* Bottom Author Section */}
                  <div className="pt-6 border-t border-slate-100 flex items-center gap-4">
                    <div className="w-12 h-12 rounded-full bg-[#0E9594] text-white font-extrabold text-sm flex items-center justify-center shrink-0 shadow-xs">
                      {currentReview.avatarInitials}
                    </div>
                    <div>
                      <h4 className="text-sm sm:text-base font-extrabold text-[#562C2C]">
                        {currentReview.author}
                      </h4>
                      <p className="text-xs font-bold text-[#127475]">
                        {currentReview.role}
                      </p>
                    </div>
                  </div>

                </div>
              );
            })()}

            {/* Pagination Dots */}
            <div className="flex items-center justify-center gap-2 pt-6">
              {REAL_STRATEC_REVIEWS.map((r, idx) => (
                <button
                  key={r.id}
                  onClick={() => setCurrentReviewIndex(idx)}
                  aria-label={`Aller à l'avis ${idx + 1}`}
                  className={`h-3 rounded-full transition-all cursor-pointer ${
                    currentReviewIndex === idx
                      ? 'w-8 bg-[#F2542D]'
                      : 'w-3 bg-slate-300 hover:bg-slate-400'
                  }`}
                />
              ))}
            </div>

          </div>

          {/* 4 Pillars Reassurance Banner */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border-2 border-[#0E9594]/30 shadow-md grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-4xl mx-auto mt-8">
            
            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#e6f4f3] text-[#127475] flex items-center justify-center shrink-0">
                <Lock className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-extrabold text-[#562C2C]">Paiement Sécurisé</h4>
                <p className="text-[11px] text-[#562C2C]/80 leading-snug">Chiffrement SSL 256 bits & plateforme Stripe validée.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                <RefreshCw className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-extrabold text-[#562C2C]">Zéro Risque 100%</h4>
                <p className="text-[11px] text-[#562C2C]/80 leading-snug">Remboursement automatique si l'objectif de 15 précommandes n'est pas atteint.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-[#e6f4f3] text-[#127475] flex items-center justify-center shrink-0">
                <Sparkles className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-extrabold text-[#562C2C]">Sans Jargon Technique</h4>
                <p className="text-[11px] text-[#562C2C]/80 leading-snug">Pensé 100% pour les novices et artisans débordés.</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-700 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-xs font-extrabold text-[#562C2C]">Accès à Vie</h4>
                <p className="text-[11px] text-[#562C2C]/80 leading-snug">Consulte les vidéos à ton rythme 24h/24 et 7j/7.</p>
              </div>
            </div>

          </div>

          {/* Embedded CTA */}
          <div className="text-center pt-2">
            <button
              onClick={handleDirectStripeCheckout}
              disabled={isProcessing}
              className="inline-flex items-center justify-center gap-2 px-8 py-5 text-sm sm:text-base font-extrabold text-white bg-[#F2542D] hover:bg-[#d8441f] rounded-full shadow-xl uppercase tracking-wider transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <Rocket className="w-5 h-5 text-white" />
              {isProcessing ? 'Connexion Stripe sécurisée...' : '👉 Je réserve ma place au tarif Pionnier (29€)'}
            </button>
          </div>

        </div>
      </section>

      {/* 5. SECTION 3: OFFRE EXCLUSIVE DE LANCEMENT (#F5DFBB & Orange #F2542D) */}
      <section className="py-14 md:py-20">
        <div className="max-w-3xl mx-auto px-4">
          
          <div className="bg-[#FAF8F5] p-8 sm:p-10 rounded-3xl border-2 border-[#F2542D]/40 shadow-xl space-y-6 text-center">
            
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#F2542D]">
              ⚠️ Attention : Offre exclusive de Lancement !
            </h2>

            <p className="text-xs sm:text-sm text-[#562C2C]/80 leading-relaxed">
              La formation est en cours d'enregistrement et sortira officiellement le 15 septembre au tarif de <span className="line-through text-slate-400 font-bold">69 €</span>.
            </p>

            <p className="text-xs sm:text-sm text-[#562C2C] font-bold leading-relaxed">
              Mais parce que tu me fais confiance avant tout le monde, j'ai décidé de lancer une <strong>Prévente "Pionnier"</strong>.
            </p>

            <p className="text-xs text-[#562C2C]/70">
              Si tu réserves ton accès aujourd'hui, la formation est à :
            </p>

            {/* Big Price Tag en Orange #F2542D */}
            <div className="py-2">
              <span className="text-4xl sm:text-5xl font-black text-[#F2542D] block">
                29 € seulement
              </span>
              <p className="text-xs text-[#562C2C]/70 italic mt-1">
                (Soit même pas le prix d'un bon resto, pour une compétence qui va te ramener des clients pendant des années).
              </p>
            </div>

            {/* CTA BUTTON (#F2542D) */}
            <div className="space-y-3 pt-2">
              <button
                onClick={handleDirectStripeCheckout}
                disabled={isProcessing}
                className="w-full sm:w-auto px-8 py-5 text-sm sm:text-base font-extrabold text-white bg-[#F2542D] hover:bg-[#d8441f] rounded-full shadow-xl uppercase tracking-wider transition-all transform hover:-translate-y-0.5 inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                <Rocket className="w-5 h-5 text-white" />
                {isProcessing ? 'Connexion Stripe sécurisée...' : '👉 Je profite du tarif Pionnier à 29€ !'}
              </button>

              <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] font-bold text-[#562C2C]/70 pt-1">
                <span className="flex items-center gap-1.5">
                  <Lock className="w-3.5 h-3.5 text-[#0E9594]" />
                  Paiement 100% sécurisé via Stripe
                </span>
                <span>•</span>
                <span className="flex items-center gap-1.5">
                  <RefreshCw className="w-3.5 h-3.5 text-[#0E9594]" />
                  Garantie satisfait ou remboursé
                </span>
              </div>
            </div>

            {/* Mon engagement 100% Transparence (Teal #0E9594 / Warm Cream #F5DFBB) */}
            <div className="p-6 bg-[#0E9594]/10 rounded-2xl border border-[#0E9594]/30 text-left flex flex-col sm:flex-row items-start gap-4">
              <div className="text-3xl shrink-0">🛡️</div>
              <div className="space-y-2 text-xs">
                <h3 className="text-sm font-extrabold text-[#562C2C]">
                  Mon engagement 100% Transparence (Zéro Risque)
                </h3>
                <p className="text-[#562C2C]/80 leading-relaxed">
                  Je suis cash avec toi : je lancerai les enregistrements uniquement si nous atteignons un minimum de <strong>15 précommandes</strong> d'ici le 20 août.
                </p>
                <p className="text-[#127475] font-extrabold leading-relaxed">
                  Si l'objectif n'est pas atteint ? Je te rembourse tes 29€ intégralement, dans l'heure, directement sur ton compte bancaire. Sans blabla, sans condition. Tu ne prends absolument aucun risque financier !
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 6. SECTION 4: FAQ (ACCORDÉON) */}
      <section className="py-12 bg-white border-t border-[#F5DFBB]">
        <div className="max-w-3xl mx-auto px-4 space-y-8">
          
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#562C2C] text-center">
            Des questions ? J'y réponds sans filtre :
          </h2>

          <div className="space-y-3">
            <details className="bg-[#FAF8F5] border border-[#F5DFBB] rounded-2xl p-5 group cursor-pointer">
              <summary className="font-extrabold text-sm text-[#562C2C] flex items-center justify-between list-none">
                <span>👉 Je suis vraiment nul(le) en informatique, c'est pour moi ?</span>
                <span className="text-[#0E9594] group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-xs text-[#562C2C]/80 leading-relaxed mt-3 pt-3 border-t border-[#F5DFBB]">
                C'est exactement pour toi ! Fichtre, je déteste le jargon. Je te montre mon écran, tu mets pause, tu fais pareil sur le tien. C'est simple comme bonjour.
              </p>
            </details>

            <details className="bg-[#FAF8F5] border border-[#F5DFBB] rounded-2xl p-5 group cursor-pointer">
              <summary className="font-extrabold text-sm text-[#562C2C] flex items-center justify-between list-none">
                <span>👉 J'ai déjà une fiche Google, ça m'est utile ?</span>
                <span className="text-[#0E9594] group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-xs text-[#562C2C]/80 leading-relaxed mt-3 pt-3 border-t border-[#F5DFBB]">
                Oui, à 200% ! On va passer en revue l'optimisation avancée, et surtout, on va voir comment la faire vivre chaque semaine pour qu'elle remonte devant tes concurrents.
              </p>
            </details>

            <details className="bg-[#FAF8F5] border border-[#F5DFBB] rounded-2xl p-5 group cursor-pointer">
              <summary className="font-extrabold text-sm text-[#562C2C] flex items-center justify-between list-none">
                <span>👉 Comment j'accède à la formation ensuite ?</span>
                <span className="text-[#0E9594] group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-xs text-[#562C2C]/80 leading-relaxed mt-3 pt-3 border-t border-[#F5DFBB]">
                Le 15 septembre, tu recevras un email avec tes accès à ton espace membre privé sur Guides-Digitaux.com. Tu pourras regarder les vidéos à ton rythme, à vie !
              </p>
            </details>
          </div>

          <div className="pt-6 text-center">
            <button
              onClick={handleDirectStripeCheckout}
              disabled={isProcessing}
              className="inline-flex items-center justify-center gap-2 px-8 py-5 text-sm sm:text-base font-extrabold text-white bg-[#F2542D] hover:bg-[#d8441f] rounded-full shadow-xl uppercase tracking-wider transition-all transform hover:-translate-y-0.5 cursor-pointer"
            >
              <Rocket className="w-5 h-5 text-white" />
              {isProcessing ? 'Connexion Stripe sécurisée...' : '👉 Je sécurise ma place à 29€ au lieu de 69€ !'}
            </button>
          </div>

        </div>
      </section>

      {/* 7. FOOTER SECTION (#562C2C & #F5DFBB) */}
      <footer className="bg-[#562C2C] py-10 text-center text-xs text-[#F5DFBB]/80">
        <div className="max-w-4xl mx-auto px-4 space-y-4">
          <div className="relative h-10 w-44 mx-auto mb-1 brightness-0 invert">
            <Image
              src="/images/logo.png"
              alt="Guides Digitaux"
              fill
              className="object-contain object-center"
            />
          </div>

          <p>© 2026 Guides Digitaux. Tous droits réservés.</p>

          <div className="flex justify-center gap-4 text-[11px] text-[#F5DFBB] font-bold">
            <Link href="/mentions-legales" className="hover:underline">Mentions légales & Confidentialité</Link>
            <span>•</span>
            <Link href="/cgv" className="hover:underline">CGV</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
