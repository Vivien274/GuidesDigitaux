'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import { getStoredPreorders, incrementPreorderEnrollment, PreorderCampaign } from '@/lib/preordersStore';
import { fetchPreordersFromDb, incrementPreorderEnrollmentInDb } from '@/lib/supabaseLms';
import { 
  CheckCircle2, 
  Sparkles, 
  Rocket, 
  AlertTriangle, 
  Lock, 
  RefreshCw, 
  Zap
} from 'lucide-react';

export default function SalesFunnelPage() {
  const params = useParams();
  const router = useRouter();
  const rawId = (params?.id as string) || '';

  const [campaign, setCampaign] = useState<PreorderCampaign | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchPreordersFromDb().then(list => {
      let match = list.find(p => p.id === rawId || p.courseId === rawId);
      if (!match || rawId === 'precommande-fiche-google' || rawId.includes('google') || !rawId) {
        match = {
          id: 'precommande-fiche-google',
          courseId: 'c-google',
          courseTitle: 'Fais décoller ton activité locale grâce à une Fiche Google parfaite',
          price: 29,
          originalPrice: 69,
          targetEnrollments: 15,
          currentEnrollments: 12,
          endDate: '2026-08-20',
          releaseDate: '2026-09-15',
          description: 'En moins de 2 heures de vidéos courtes (hébergées directement ici, sur ton espace sécurisé), on va faire ça ensemble, pas à pas.',
          bonus: 'Accès immédiat à la liste des 15 catégories Google My Business les plus rentables + Fiche méthode avis 5 étoiles',
          image: 'https://www.guides-digitaux.com/wp-content/uploads/2026/02/un-artisan-createur-devant-son-PC-en-train-dajouter-ses-produits-dnas-saboutique-en-ligne.-accoude-a-son-etabli-dans-son-atelier.-lumiere-naturelle.webp',
          status: 'En cours'
        };
      }
      setCampaign(match || null);
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
      <header className="bg-white border-b border-[#eee7da] py-3.5">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 flex items-center justify-between">
          <Link href="/" className="relative h-12 w-48 sm:w-52 block">
            <Image
              src="/images/logo.png"
              alt="Guides Digitaux"
              fill
              className="object-contain object-left"
              priority
            />
          </Link>

          <span className="px-3.5 py-1 rounded-full text-xs font-extrabold bg-[#e6f4f3] text-[#18757d] uppercase tracking-wider border border-[#18757d]/30 flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-[#18757d] animate-pulse"></span>
            Prévente exclusive
          </span>
        </div>
      </header>

      {/* 2. HERO BANNER SECTION (Teal background) */}
      <section className="bg-[#18757d] text-white py-14 md:py-20 text-center px-4">
        <div className="max-w-4xl mx-auto space-y-4">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-tight tracking-tight">
            Fais décoller ton activité locale grâce à une Fiche Google parfaite
          </h1>
          <p className="text-base sm:text-lg text-teal-100 font-medium">
            (sans y passer tes nuits ni dépenser 1 € en pub)
          </p>
        </div>
      </section>

      {/* 3. SECTION 1: LE CONSTAT CASH */}
      <section className="py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4">
          
          <div className="bg-white rounded-3xl p-8 sm:p-10 border border-[#eee7da] shadow-md grid grid-cols-1 md:grid-cols-12 gap-8 items-start">
            
            {/* Left Column: Problem & Callout */}
            <div className="md:col-span-7 space-y-5">
              <h2 className="text-2xl font-extrabold text-[#332420]">Le constat cash</h2>

              <p className="text-sm font-extrabold text-[#332420] leading-relaxed">
                Tu es artisan ou créateur, tu as un savoir-faire en or, mais sur Google, on ne voit que tes concurrents ?
              </p>

              <p className="text-xs text-[#5e4d46] leading-relaxed">
                Pire, tu as créé ta fiche à la va-vite et tu te demandes si elle ne fait pas fuir tes clients ?
              </p>

              {/* Green Callout Box */}
              <div className="p-5 bg-emerald-50/80 border-l-4 border-emerald-600 rounded-r-2xl space-y-2 text-xs">
                <p className="font-extrabold text-emerald-950 text-sm">
                  Saperlipopette... Pour un artisan, la fiche Google, c'est le moyen gratuit le plus puissant pour remplir son carnet de commande.
                </p>
                <p className="text-emerald-900 leading-relaxed italic">
                  Le problème ? L'interface change tout le temps, c'est la croix et la bannière pour s'y retrouver, et le jargon technique donne juste envie d'envoyer valser l'ordinateur par la fenêtre.
                </p>
              </div>
            </div>

            {/* Right Column: Founder Card with Official Photo */}
            <div className="md:col-span-5 bg-[#faf8f5] p-6 rounded-2xl border border-[#eee7da] text-center space-y-4 shadow-xs">
              <div className="relative w-24 h-24 mx-auto rounded-full overflow-hidden border-2 border-[#18757d] shadow-sm">
                <Image
                  src="/images/stephanie_v2.png"
                  alt="Stéphanie - Créatrice de Guides Digitaux"
                  fill
                  className="object-cover object-[center_65%]"
                />
              </div>

              <div>
                <h3 className="text-sm font-extrabold text-[#332420]">Stéphanie</h3>
                <span className="text-[11px] text-slate-500 font-semibold block mt-0.5">Créatrice de Guides Digitaux</span>
              </div>

              <div className="p-4 bg-white rounded-xl border border-[#eee7da] text-xs font-semibold text-[#5e4d46] italic shadow-xs">
                "Je connais la galère. Et si on reprenait le contrôle de ta visibilité locale ?"
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 4. SECTION 2: LA SOLUTION */}
      <section className="py-12 bg-gradient-to-b from-[#faf8f5] to-[#f5f1e8] border-y border-[#eee7da]">
        <div className="max-w-4xl mx-auto px-4 space-y-8">
          
          <div className="text-center space-y-3 max-w-2xl mx-auto">
            <span className="px-4 py-1 rounded-full text-[11px] font-extrabold bg-[#f5e6d3] text-[#332420] uppercase tracking-wider shadow-xs inline-block">
              LA SOLUTION
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-[#332420] leading-tight">
              J'ai décidé de créer une mini-formation pas à pas, 100 % pensée pour les novices.
            </h2>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-[#eee7da] shadow-md grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
            
            {/* Left: Course Cover Image */}
            <div className="md:col-span-5 relative h-64 w-full rounded-2xl overflow-hidden border border-[#eee7da] bg-[#faf8f5] shadow-sm">
              <Image
                src="https://www.guides-digitaux.com/wp-content/uploads/2026/02/un-artisan-createur-devant-son-PC-en-train-dajouter-ses-produits-dnas-saboutique-en-ligne.-accoude-a-son-etabli-dans-son-atelier.-lumiere-naturelle.webp"
                alt="Formation Fiche Google Business Profile"
                fill
                className="object-cover"
              />
            </div>

            {/* Right: Detailed Bullets */}
            <div className="md:col-span-7 space-y-4">
              <h3 className="text-sm font-extrabold text-[#332420] leading-relaxed">
                En moins de 2 heures de vidéos courtes (hébergées directement ici, sur ton espace sécurisé), on va faire ça ensemble, pas à pas :
              </h3>

              <div className="space-y-3 pt-1">
                <div className="flex items-start gap-3 text-xs text-[#332420]">
                  <CheckCircle2 className="w-5 h-5 text-[#18757d] shrink-0 mt-0.5" />
                  <span>
                    <strong>L'optimisation cachée de ton profil</strong> pour passer devant les autres (parce que les profils à moitié vides, ça ne vaut pas tripeux).
                  </span>
                </div>

                <div className="flex items-start gap-3 text-xs text-[#332420]">
                  <CheckCircle2 className="w-5 h-5 text-[#18757d] shrink-0 mt-0.5" />
                  <span>
                    <strong>La méthode simple pour récolter des avis 5 étoiles</strong> (sans harceler tes clients ni pleurer pour qu'ils te laissent un mot).
                  </span>
                </div>

                <div className="flex items-start gap-3 text-xs text-[#332420]">
                  <CheckCircle2 className="w-5 h-5 text-[#18757d] shrink-0 mt-0.5" />
                  <span>
                    <strong>Comment poster des actus en 5 minutes par semaine</strong> pour plaire à l'algorithme Google.
                  </span>
                </div>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 5. SECTION 3: CONVERSION BOX (PREORDER OFFER) */}
      <section className="py-14 md:py-20">
        <div className="max-w-3xl mx-auto px-4">
          
          <div className="bg-[#fffcf7] p-8 sm:p-10 rounded-3xl border-2 border-amber-200 shadow-xl space-y-6">
            
            {/* Warning Alert Banner */}
            <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 flex items-start gap-3 text-xs text-amber-950 font-semibold">
              <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="font-extrabold block mb-0.5">Attention, offre exclusive en précommande</strong>
                La formation est actuellement en cours de finalisation sur la plateforme. Elle sortira officiellement le <strong>15 septembre</strong> au tarif de <strong>69 €</strong>.
              </div>
            </div>

            {/* Pricing Box */}
            <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#eee7da] text-center space-y-4 shadow-sm">
              <span className="text-[11px] font-extrabold text-[#18757d] uppercase tracking-wider block">
                TARIF PIONNIER
              </span>

              <div className="flex items-baseline justify-center gap-3">
                <span className="text-2xl text-slate-400 line-through font-extrabold">69€</span>
                <span className="text-5xl font-black text-[#18757d]">29€</span>
              </div>

              <p className="text-xs font-extrabold text-emerald-700">
                Soit + de 50% de réduction immédiate avant le lancement officiel
              </p>

              {/* CTA BUTTON FOR DIRECT STRIPE CHECKOUT */}
              <div className="space-y-3 pt-2">
                <button
                  onClick={handleDirectStripeCheckout}
                  disabled={isProcessing}
                  className="w-full py-5 text-sm sm:text-base font-extrabold text-[#332420] bg-amber-400 hover:bg-amber-300 rounded-2xl shadow-lg uppercase tracking-wider transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Rocket className="w-5 h-5 text-[#332420]" />
                  {isProcessing ? 'Connexion Stripe sécurisée...' : '👉 Je profite du tarif précommande à 29 €'}
                </button>

                <div className="flex flex-wrap items-center justify-center gap-4 text-[11px] font-bold text-slate-500 pt-1">
                  <span className="flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-[#18757d]" />
                    Paiement 100% sécurisé via Stripe
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1.5">
                    <RefreshCw className="w-3.5 h-3.5 text-[#18757d]" />
                    Remboursement garanti
                  </span>
                </div>
              </div>
            </div>

            {/* Mon engagement transparence */}
            <div className="p-6 bg-[#f0f8f8] rounded-2xl border border-[#18757d]/20 space-y-3 text-xs">
              <div className="flex items-center gap-2 text-[#18757d] font-extrabold">
                <Zap className="w-4 h-4 text-[#18757d] shrink-0" />
                <span className="uppercase tracking-wider">Mon engagement transparence</span>
              </div>

              <p className="text-slate-700 leading-relaxed">
                Je ne veux pas travailler pour rien. Je lancerai les enregistrements uniquement si nous atteignons un minimum de <strong>15 précommandes</strong> avant le <strong>20 août</strong>.
              </p>

              <p className="text-[#18757d] font-extrabold leading-relaxed">
                Si l'objectif n'est pas atteint ? Tu es intégralement remboursé(e) sur ton compte bancaire dans l'heure, sans poser de question. Tu ne prends absolument aucun risque !
              </p>
            </div>

          </div>

        </div>
      </section>

      {/* 6. FOOTER SECTION */}
      <footer className="bg-[#f4ede0] py-8 border-t border-[#e8ded0] text-center text-xs text-slate-600">
        <div className="max-w-4xl mx-auto px-4 space-y-3">
          <div className="relative h-10 w-44 mx-auto mb-1">
            <Image
              src="/images/logo.png"
              alt="Guides Digitaux"
              fill
              className="object-contain object-center"
            />
          </div>

          <p>© 2026 Guides Digitaux. Tous droits réservés.</p>

          <div className="flex justify-center gap-4 text-[11px] text-[#18757d] font-bold">
            <Link href="/mentions-legales" className="hover:underline">Mentions légales & Confidentialité</Link>
            <span>•</span>
            <Link href="/cgv" className="hover:underline">CGV</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
