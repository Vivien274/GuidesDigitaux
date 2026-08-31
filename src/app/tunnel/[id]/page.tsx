'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { fetchPreordersFromDb, incrementPreorderEnrollmentInDb } from '@/lib/supabaseLms';
import { getEncryptedDownloadUrl } from '@/lib/downloadSecurity';
import { event } from '@/lib/metaPixel';
import VipSubscribeModal from '@/components/VipSubscribeModal';
import { 
  CheckCircle2, 
  Sparkles, 
  Rocket, 
  Lock, 
  RefreshCw, 
  Zap,
  Star,
  ShieldCheck,
  ChevronLeft,
  ChevronRight,
  Clock,
  Gift,
  FileText,
  MessageSquare,
  Award,
  ArrowRight,
  HelpCircle
} from 'lucide-react';

const REAL_STRATEC_REVIEWS = [
  {
    id: 1,
    author: 'Camille',
    avatarInitials: 'CM',
    role: 'Artisane Pâtissière • Studio Macarons (Lille)',
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
    quote: "« Un accompagnement bienveillant et extrêmement efficace. Stéphanie sait rendre accessibles des notions complexes. Notre présence en ligne a fait un bond en avant grâce à sa méthode sans aucun jargon. »"
  }
];

export default function SalesFunnelPage() {
  const params = useParams();
  const router = useRouter();
  const rawId = (params?.id as string) || '';

  const [campaign, setCampaign] = useState<any>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isVipModalOpen, setIsVipModalOpen] = useState(false);
  const [currentReviewIndex, setCurrentReviewIndex] = useState(0);

  // Dynamic Countdown Timer to August 20th at 23:59:59
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const targetDate = new Date('2026-09-15T23:59:59').getTime();

    const updateTimer = () => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    };

    updateTimer();
    const interval = setInterval(updateTimer, 1000);
    return () => clearInterval(interval);
  }, []);

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

      event('ViewContent', {
        content_name: 'Fais décoller ton activité locale grâce à une Fiche Google parfaite',
        content_ids: ['precommande-fiche-google'],
        content_type: 'product',
        value: 29,
        currency: 'EUR',
      });
    });
  }, [rawId]);

  // DIRECT STRIPE CHECKOUT HANDLER
  const handleDirectStripeCheckout = async () => {
    setIsProcessing(true);

    const targetCampaignId = campaign?.id || 'precommande-fiche-google';
    incrementPreorderEnrollmentInDb(targetCampaignId);

    const titleToSend = 'Fais décoller ton activité locale grâce à une Fiche Google parfaite';
    const priceToSend = 29;

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
          id: targetCampaignId,
          title: titleToSend,
          slug: 'precommande-fiche-google',
          type: 'formation',
          typeLabel: '🚀 PRÉVENTE PRIVILÈGE (Bonus immédiats inclus)',
          progress: 0,
          completedLessons: 0,
          totalLessons: 4,
          duration: '2h00',
          instructor: 'Stéphanie ROCQ',
          isPreorder: true,
          releaseDate: '2026-08-25',
          price: priceToSend,
          purchaseDate: new Date().toLocaleDateString('fr-FR')
        };

        if (!existing.some((e: any) => e.id === newEnrolled.id)) {
          localStorage.setItem('gd_enrolled_courses', JSON.stringify([newEnrolled, ...existing]));
        }
      }

      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId: targetCampaignId,
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
    <div className="min-h-screen bg-[#faf8f5] text-[#332420] font-sans selection:bg-[#F2542D] selection:text-white">
      
      {/* 0. TOP URGENCY BANNER */}
      <div className="bg-[#562C2C] text-white py-2.5 px-4 text-center text-xs font-bold flex flex-wrap items-center justify-center gap-2 border-b border-[#F2542D]/30">
        <span className="inline-flex items-center gap-1 text-amber-300 font-extrabold">
          <Clock className="w-4 h-4 animate-spin" />
          FIN DE L'OFFRE PIONNIÈRE :
        </span>
        <span className="font-mono bg-[#F2542D] px-2 py-0.5 rounded text-white font-extrabold tracking-wider">
          {timeLeft.days}j {String(timeLeft.hours).padStart(2, '0')}h {String(timeLeft.minutes).padStart(2, '0')}m {String(timeLeft.seconds).padStart(2, '0')}s
        </span>
        <span className="text-amber-100 hidden sm:inline">• Plus que 4 places disponibles à 29€ au lieu de 69€ !</span>
      </div>

      {/* 1. HEADER (Official logo, minimal conversion layout) */}
      <header className="bg-white border-b border-[#eee7da] py-4 shadow-2xs sticky top-0 z-40">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <div className="relative h-11 w-44 sm:w-52 block">
            <Image
              src="/images/logo.png"
              alt="Guides Digitaux - Stéphanie Rocq"
              fill
              className="object-contain object-left"
              priority
            />
          </div>

          <span className="px-3.5 py-1 rounded-full text-xs font-extrabold bg-amber-100 text-[#562C2C] border border-amber-300 flex items-center gap-1.5 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
            Prévente Privilège jusqu'au 15 septembre
          </span>
        </div>
      </header>

      {/* 2. HERO SECTION */}
      <section className="bg-gradient-to-b from-[#127475] to-[#0e5c5d] text-white py-12 md:py-18 text-center px-4 relative overflow-hidden">
        <div className="max-w-4xl mx-auto space-y-6 relative z-10">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#F5DFBB] text-[#562C2C] text-xs font-black uppercase tracking-wider shadow-md">
            <Sparkles className="w-4 h-4 text-[#F2542D]" />
            <span>Spécial Artisanes, Créatrices & Commerçantes Locales</span>
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black leading-tight tracking-tight max-w-3xl mx-auto text-white">
            Transforme ta Fiche Google en un <span className="text-amber-300 underline decoration-[#F2542D] decoration-4 underline-offset-4">aimant à clients locaux</span> (sans payer 1€ de pub)
          </h1>

          <p className="text-base sm:text-lg text-teal-100 font-medium max-w-2xl mx-auto leading-relaxed">
            La méthode pas-à-pas simple, bienveillante et sans aucun jargon technique pour remonter en haut des recherches Google dans ta ville et recevoir des demandes de devis chaque semaine.
          </p>

          {/* Immediate Bonus Box Callout */}
          <div className="bg-white/10 backdrop-blur-md border border-white/20 p-4 rounded-2xl max-w-xl mx-auto text-left flex items-center gap-3.5 text-xs text-white">
            <div className="w-10 h-10 rounded-xl bg-amber-400 text-[#332420] flex items-center justify-center shrink-0 font-extrabold text-lg shadow-md">
              🎁
            </div>
            <div>
              <strong className="block font-black text-amber-300 text-sm">ACCÈS IMMÉDIAT AUJOURD'HUI :</strong>
              <span>Réserve ta place maintenant et télécharge tout de suite ta <strong>Checklist PDF d'Audit Fiche Google</strong> + les 2 Kits Bonus offerts !</span>
            </div>
          </div>

          {/* Main Hero CTA */}
          <div className="pt-2 space-y-3">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={handleDirectStripeCheckout}
                disabled={isProcessing}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-5 text-base sm:text-lg font-black text-white bg-[#F2542D] hover:bg-[#d8441f] rounded-full shadow-2xl uppercase tracking-wider transition-all transform hover:-translate-y-1 cursor-pointer border-2 border-white/20"
              >
                <Rocket className="w-6 h-6 text-white" />
                {isProcessing ? 'Connexion Stripe sécurisée...' : '👉 Je réserve ma place à 29€ (au lieu de 69€)'}
              </button>

              <button
                onClick={() => setIsVipModalOpen(true)}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-5 text-base font-extrabold text-[#562C2C] bg-[#F5DFBB] hover:bg-amber-300 rounded-full shadow-xl uppercase tracking-wider transition-all transform hover:-translate-y-1 cursor-pointer border-2 border-amber-400"
              >
                <Sparkles className="w-5 h-5 text-[#F2542D]" />
                ⭐ M'inscrire sur la Liste VIP
              </button>
            </div>

            <p className="text-xs text-teal-200 font-bold flex items-center justify-center gap-2">
              <ShieldCheck className="w-4 h-4 text-amber-300" />
              Paiement 100% Sécurisé via Stripe • Accès Immédiat aux Bonus PDF
            </p>
          </div>

        </div>
      </section>

      {/* 3. SECTION PROBLEME & RENCONTRE AVEC STÉPHANIE */}
      <section className="py-14 md:py-18">
        <div className="max-w-4xl mx-auto px-4">
          
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#eee7da] shadow-lg grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            {/* Left Column: Story & Empathy */}
            <div className="md:col-span-7 space-y-5">
              <span className="text-xs font-black text-[#18757d] uppercase tracking-wider bg-[#e6f4f3] px-3 py-1 rounded-full">
                Le constat sur le terrain
              </span>

              <h2 className="text-2xl sm:text-3xl font-extrabold text-[#332420] leading-snug">
                Pourquoi ce sont toujours tes concurrents qu'on trouve en premier sur Google ?
              </h2>

              <p className="text-sm font-medium text-slate-700 leading-relaxed">
                Tu as un savoir-faire précieux, tu mets tout ton cœur dans ton activité. Et pourtant, quand des clients cherchent ton métier dans ta ville sur leur smartphone... ton entreprise est invisible.
              </p>

              <p className="text-xs text-slate-600 leading-relaxed">
                Pendant ce temps, des concurrents qui font un travail parfois moins soigné récoltent des dizaines d'appels et de demandes de devis chaque mois. Pourquoi ? Simplement parce que leur **Fiche Google Business Profile** est correctement configurée et active.
              </p>

              <div className="p-5 bg-amber-50 border-l-4 border-amber-400 rounded-r-2xl space-y-2 text-xs">
                <p className="font-extrabold text-[#332420] text-sm flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4 text-[#18757d]" />
                  La bonne nouvelle ?
                </p>
                <p className="text-slate-700 leading-relaxed font-medium">
                  Nul besoin d'être un génie de l'informatique ni de payer une agence 1 500€. Avec la bonne méthode pas-à-pas, tu peux passer devant eux en quelques réglages simples.
                </p>
              </div>
            </div>

            {/* Right Column: Founder Presentation */}
            <div className="md:col-span-5 bg-[#faf8f5] p-6 rounded-3xl border border-[#eee7da] text-center space-y-4 shadow-xs">
              <div className="relative w-28 h-28 mx-auto rounded-full overflow-hidden border-4 border-white shadow-md">
                <Image
                  src="/images/stephanie_v2.png"
                  alt="Stéphanie Rocq - Guides Digitaux"
                  fill
                  className="object-cover object-[center_65%]"
                />
              </div>

              <div>
                <h3 className="text-base font-extrabold text-[#332420]">Stéphanie Rocq</h3>
                <span className="text-xs text-[#18757d] font-bold block mt-0.5">Consultante & Fondatrice de Guides Digitaux</span>
              </div>

              <p className="p-4 bg-white rounded-2xl border border-[#eee7da] text-xs font-semibold text-slate-700 italic shadow-2xs leading-relaxed">
                "Je connais vos journées bien remplies d'entrepreneures. Ma mission : vous donner une visibilité locale maximale en un minimum de temps, sans jargon !"
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 4. SECTION PROGRAMME DE LA FORMATION */}
      <section className="py-14 bg-gradient-to-b from-[#faf8f5] to-amber-50/50 border-y border-[#eee7da]">
        <div className="max-w-4xl mx-auto px-4 space-y-8">
          
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="px-4 py-1.5 rounded-full text-xs font-extrabold bg-[#18757d] text-white uppercase tracking-wider shadow-xs inline-block">
              PROGRAMME CONCRET PAS-À-PAS
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#332420] leading-tight">
              Tout ce que tu vas accomplir dans cette mini-formation
            </h2>
            <p className="text-xs sm:text-sm text-slate-600">
              Des vidéos courtes, directes et ultra-pratiques. Tu regardes mon écran, tu mets pause et tu reproduis chez toi.
            </p>
          </div>

          {/* Grid 4 Étapes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
            
            <div className="p-6 bg-white rounded-3xl border-l-4 border-[#18757d] border-y border-r border-[#eee7da] shadow-sm space-y-2">
              <div className="w-8 h-8 rounded-xl bg-[#e6f4f3] text-[#18757d] font-black text-xs flex items-center justify-center">
                01
              </div>
              <h4 className="text-sm font-black text-[#332420]">Étape 1 : Les Fondations Propres</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Création ou revendication propre de ta fiche sans risquer le moindre blocage ou doublon Google.
              </p>
            </div>

            <div className="p-6 bg-white rounded-3xl border-l-4 border-[#18757d] border-y border-r border-[#eee7da] shadow-sm space-y-2">
              <div className="w-8 h-8 rounded-xl bg-[#e6f4f3] text-[#18757d] font-black text-xs flex items-center justify-center">
                02
              </div>
              <h4 className="text-sm font-black text-[#332420]">Étape 2 : L'Optimisation Cachée</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Les réglages stratégiques de catégories, mots-clés locaux et descriptions pour faire remonter ta fiche.
              </p>
            </div>

            <div className="p-6 bg-white rounded-3xl border-l-4 border-[#18757d] border-y border-r border-[#eee7da] shadow-sm space-y-2">
              <div className="w-8 h-8 rounded-xl bg-[#e6f4f3] text-[#18757d] font-black text-xs flex items-center justify-center">
                03
              </div>
              <h4 className="text-sm font-black text-[#332420]">Étape 3 : La Machine à Avis 5 Étoiles</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                La méthode douce et naturelle pour récolter des avis élogieux réguliers sans harceler tes clients.
              </p>
            </div>

            <div className="p-6 bg-white rounded-3xl border-l-4 border-[#18757d] border-y border-r border-[#eee7da] shadow-sm space-y-2">
              <div className="w-8 h-8 rounded-xl bg-[#e6f4f3] text-[#18757d] font-black text-xs flex items-center justify-center">
                04
              </div>
              <h4 className="text-sm font-black text-[#332420]">Étape 4 : La Routine 5 Min par Semaine</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Comment poster des actus et faire vivre ta fiche en 5 minutes chrono sans y passer tes soirées.
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 5. VALUE STACK & BONUS GRATUITS EN ACCÈS IMMÉDIAT */}
      <section className="py-16 md:py-20 bg-white border-b border-[#eee7da]">
        <div className="max-w-4xl mx-auto px-4 space-y-10">
          
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="px-4 py-1.5 rounded-full text-xs font-black bg-amber-400 text-[#332420] uppercase tracking-wider shadow-xs inline-block">
              🎁 INCLUS DANS VOTRE COMMANDE AUJOURD'HUI
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#332420] leading-tight">
              Le Pack Complet Fiche Google + 3 Bonus Offerts
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 font-medium">
              Téléchargez immédiatement vos 3 bonus PDF dès la validation de votre réservation !
            </p>
          </div>

          {/* 3 Bonus Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Bonus 1 */}
            <div className="bg-[#faf8f5] p-6 rounded-3xl border border-[#eee7da] shadow-sm flex flex-col justify-between space-y-4 relative">
              <div className="space-y-3">
                <span className="px-3 py-1 bg-[#18757d] text-white text-[10px] font-black uppercase rounded-full inline-block">
                  BONUS #1 • ACCÈS IMMÉDIAT
                </span>
                <h3 className="text-sm font-extrabold text-[#332420]">
                  Checklist PDF d'Audit Rapide Fiche Google
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  25 points d'audit simples à cocher pour repérer et corriger instantanément les erreurs de ta fiche.
                </p>
              </div>
              <div className="pt-3 border-t border-[#eee7da] flex items-center justify-between text-xs font-bold">
                <span className="text-slate-400 line-through">Valeur 19 €</span>
                <span className="text-emerald-700 font-black">OFFERT 🎁</span>
              </div>
            </div>

            {/* Bonus 2 */}
            <div className="bg-[#faf8f5] p-6 rounded-3xl border border-[#eee7da] shadow-sm flex flex-col justify-between space-y-4 relative">
              <div className="space-y-3">
                <span className="px-3 py-1 bg-[#18757d] text-white text-[10px] font-black uppercase rounded-full inline-block">
                  BONUS #2 • ACCÈS IMMÉDIAT
                </span>
                <h3 className="text-sm font-extrabold text-[#332420]">
                  Kit 10 Modèles de Réponses aux Avis
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Des réponses professionnelles pré-rédigées pour valoriser chaque avis 5 étoiles et désamorcer les retours délicats.
                </p>
              </div>
              <div className="pt-3 border-t border-[#eee7da] flex items-center justify-between text-xs font-bold">
                <span className="text-slate-400 line-through">Valeur 27 €</span>
                <span className="text-emerald-700 font-black">OFFERT 🎁</span>
              </div>
            </div>

            {/* Bonus 3 */}
            <div className="bg-[#faf8f5] p-6 rounded-3xl border border-[#eee7da] shadow-sm flex flex-col justify-between space-y-4 relative">
              <div className="space-y-3">
                <span className="px-3 py-1 bg-[#18757d] text-white text-[10px] font-black uppercase rounded-full inline-block">
                  BONUS #3 • ACCÈS IMMÉDIAT
                </span>
                <h3 className="text-sm font-extrabold text-[#332420]">
                  Script WhatsApp & Email "Avis 5 Étoiles"
                </h3>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Le message parfait à copier-coller à tes clients satisfaits pour multiplier tes avis sans insister.
                </p>
              </div>
              <div className="pt-3 border-t border-[#eee7da] flex items-center justify-between text-xs font-bold">
                <span className="text-slate-400 line-through">Valeur 15 €</span>
                <span className="text-emerald-700 font-black">OFFERT 🎁</span>
              </div>
            </div>

          </div>

          {/* Pricing Stack Box */}
          <div className="bg-[#faf8f5] p-8 sm:p-10 rounded-3xl border-2 border-[#F2542D] shadow-xl text-center space-y-6 max-w-2xl mx-auto">
            <span className="px-4 py-1 rounded-full text-xs font-extrabold bg-[#F2542D] text-white uppercase tracking-wider">
              OFFRE PRIVILÈGE PIONNIÈRE
            </span>

            <div className="space-y-1">
              <span className="text-sm text-slate-400 font-extrabold line-through block">Valeur Totale du Pack : 130 €</span>
              <span className="text-4xl sm:text-5xl font-black text-[#F2542D] block">
                29 € seulement
              </span>
              <p className="text-xs text-slate-500 font-semibold italic">
                (Accès complet aux cours + 3 Bonus PDF téléchargeables immédiatement)
              </p>
            </div>

            <div className="pt-2 space-y-3">
              <button
                onClick={handleDirectStripeCheckout}
                disabled={isProcessing}
                className="w-full sm:w-auto px-8 py-5 text-sm sm:text-base font-extrabold text-white bg-[#F2542D] hover:bg-[#d8441f] rounded-full shadow-xl uppercase tracking-wider transition-all transform hover:-translate-y-0.5 inline-flex items-center justify-center gap-2 cursor-pointer border-2 border-white/20"
              >
                <Rocket className="w-5 h-5 text-white" />
                {isProcessing ? 'Connexion Stripe sécurisée...' : '👉 Je réserve mon accès complet à 29€'}
              </button>

              <div className="pt-2">
                <button
                  onClick={() => setIsVipModalOpen(true)}
                  className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#e6f4f3] hover:bg-[#d4ecea] text-[#18757d] font-black text-xs rounded-full uppercase tracking-wider transition-colors cursor-pointer border border-[#18757d]/30"
                >
                  <Sparkles className="w-4 h-4 text-amber-500" />
                  ⭐ Rejoindre la Liste VIP (Gratuit)
                </button>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-4 text-xs text-slate-600 font-semibold">
              <span className="flex items-center gap-1.5">
                <Lock className="w-4 h-4 text-[#18757d]" />
                Paiement 100% sécurisé via Stripe
              </span>
              <span>•</span>
              <span className="flex items-center gap-1.5">
                <RefreshCw className="w-4 h-4 text-[#18757d]" />
                Garantie Satisfait ou Remboursé 30j
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* 6. AVIS CLIENTS & TÉMOIGNAGES REELS */}
      <section className="py-16 bg-[#faf8f5] border-b border-[#eee7da]">
        <div className="max-w-4xl mx-auto px-4 space-y-8">
          
          <div className="text-center space-y-3">
            <span className="px-4 py-1.5 rounded-full bg-amber-100 text-[#332420] text-xs font-black uppercase tracking-wider border border-amber-300">
              💬 TÉMOIGNAGES CERTIFIÉS
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#332420]">
              Elles font équipe avec Stéphanie Rocq
            </h2>
          </div>

          <div className="relative max-w-3xl mx-auto px-4">
            <button
              onClick={handlePrevReview}
              className="absolute left-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white border border-slate-200 text-[#332420] hover:text-[#F2542D] shadow-md flex items-center justify-center transition-all cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <button
              onClick={handleNextReview}
              className="absolute right-0 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white border border-slate-200 text-[#332420] hover:text-[#F2542D] shadow-md flex items-center justify-center transition-all cursor-pointer"
            >
              <ChevronRight className="w-5 h-5" />
            </button>

            {(() => {
              const review = REAL_STRATEC_REVIEWS[currentReviewIndex];
              return (
                <div className="bg-white rounded-3xl p-6 sm:p-8 shadow-md border border-[#eee7da] space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex text-amber-400">
                      {[...Array(review.rating)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="text-xs font-bold text-[#18757d] bg-[#e6f4f3] px-3 py-1 rounded-full">
                      {review.source}
                    </span>
                  </div>

                  <p className="text-sm sm:text-base text-slate-700 font-semibold italic leading-relaxed">
                    {review.quote}
                  </p>

                  <div className="pt-4 border-t border-slate-100 flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-[#18757d] text-white font-extrabold text-xs flex items-center justify-center shrink-0">
                      {review.avatarInitials}
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-[#332420]">{review.author}</h4>
                      <p className="text-[11px] font-bold text-[#18757d]">{review.role}</p>
                    </div>
                  </div>
                </div>
              );
            })()}
          </div>

        </div>
      </section>

      {/* 7. FAQ ACCORDEON */}
      <section className="py-14 bg-white border-t border-[#eee7da]">
        <div className="max-w-3xl mx-auto px-4 space-y-8">
          
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#332420] text-center">
            Vos questions fréquentes
          </h2>

          <div className="space-y-3">
            <details className="bg-[#faf8f5] border border-[#eee7da] rounded-2xl p-5 group cursor-pointer">
              <summary className="font-extrabold text-sm text-[#332420] flex items-center justify-between list-none">
                <span>👉 Est-ce adapté si je suis débutante en informatique ?</span>
                <span className="text-[#18757d] group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-xs text-slate-600 leading-relaxed mt-3 pt-3 border-t border-[#eee7da]">
                Absolument ! La formation a été conçue spécialement pour les novices. Je montre mon écran, vous mettez pause et vous reproduisez les clics chez vous.
              </p>
            </details>

            <details className="bg-[#faf8f5] border border-[#eee7da] rounded-2xl p-5 group cursor-pointer">
              <summary className="font-extrabold text-sm text-[#332420] flex items-center justify-between list-none">
                <span>👉 Quand puis-je accéder aux Bonus PDF et aux vidéos ?</span>
                <span className="text-[#18757d] group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-xs text-slate-600 leading-relaxed mt-3 pt-3 border-t border-[#eee7da]">
                Vos 3 Bonus PDF sont téléchargeables immédiatement dès la validation de votre commande aujourd'hui. L'accès complet à l'espace vidéo de formation ouvre le 15 septembre !
              </p>
            </details>

            <details className="bg-[#faf8f5] border border-[#eee7da] rounded-2xl p-5 group cursor-pointer">
              <summary className="font-extrabold text-sm text-[#332420] flex items-center justify-between list-none">
                <span>👉 J'ai déjà une fiche Google existante, est-ce utile ?</span>
                <span className="text-[#18757d] group-open:rotate-180 transition-transform">▼</span>
              </summary>
              <p className="text-xs text-slate-600 leading-relaxed mt-3 pt-3 border-t border-[#eee7da]">
                Oui, à 100% ! Nous passons en revue l'optimisation poussée et la méthode pour faire vivre votre fiche chaque semaine et passer devant vos concurrents locaux.
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
              {isProcessing ? 'Connexion Stripe sécurisée...' : '👉 Je sécurise ma place à 29€ au lieu de 69€'}
            </button>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-[#562C2C] py-10 text-center text-xs text-amber-100/80">
        <div className="max-w-4xl mx-auto px-4 space-y-4">
          <div className="relative h-10 w-44 mx-auto mb-1 brightness-0 invert">
            <Image
              src="/images/logo.png"
              alt="Guides Digitaux - Stéphanie Rocq"
              fill
              className="object-contain object-center"
            />
          </div>

          <p>© 2026 Guides Digitaux. Tous droits réservés.</p>

          <div className="flex justify-center gap-4 text-[11px] text-amber-100 font-bold">
            <Link href="/mentions-legales" className="hover:underline">Mentions légales & Confidentialité</Link>
            <span>•</span>
            <Link href="/cgv" className="hover:underline">CGV</Link>
          </div>
        </div>
      </footer>

      <VipSubscribeModal
        isOpen={isVipModalOpen}
        onClose={() => setIsVipModalOpen(false)}
        defaultTag="prevente-gmb"
        courseTitle="Formation Fiche Google Business Profile"
      />
    </div>
  );
}
