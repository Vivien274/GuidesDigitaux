'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';
import { getStoredPreorders, PreorderCampaign, getPreorderStatusDetails, formatFrenchDate } from '@/lib/preordersStore';
import { 
  Rocket, 
  Target, 
  Calendar, 
  Gift, 
  CheckCircle2, 
  Star, 
  Clock, 
  ShoppingBag, 
  ArrowLeft,
  ShieldCheck,
  Award,
  Sparkles,
  Users,
  Lock
} from 'lucide-react';

export default function PreorderProductPage() {
  const params = useParams();
  const router = useRouter();
  const id = (params?.id as string) || '';
  const { addToCart } = useCart();

  const [campaign, setCampaign] = useState<PreorderCampaign | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const list = getStoredPreorders();
    const match = list.find(p => p.id === id || p.courseId === id);
    if (match) {
      setCampaign(match);
    } else if (list.length > 0) {
      setCampaign(list[0]);
    }
  }, [id]);

  if (!campaign) {
    return (
      <div className="min-h-screen bg-[#faf8f5] text-[#332420] font-sans">
        <Header />
        <div className="max-w-4xl mx-auto py-24 text-center space-y-4">
          <h1 className="text-2xl font-extrabold text-[#332420]">Campagne de précommande introuvable</h1>
          <Link href="/boutique" className="inline-block px-6 py-3 bg-[#18757d] text-white rounded-xl font-bold text-xs">
            ← Retour à la boutique
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  const statusDetails = getPreorderStatusDetails(campaign);
  const percent = Math.min(100, Math.round((campaign.currentEnrollments / campaign.targetEnrollments) * 100));
  const remaining = Math.max(0, campaign.targetEnrollments - campaign.currentEnrollments);

  const handlePreorderCheckout = () => {
    if (!statusDetails.canOrder) return;

    setIsProcessing(true);
    // Add preorder item to cart
    addToCart({
      id: campaign.id,
      title: `[PRÉCOMMANDE] ${campaign.courseTitle}`,
      price: statusDetails.effectivePrice,
      image: campaign.image || 'https://www.guides-digitaux.com/wp-content/uploads/2026/02/un-artisan-createur-devant-son-PC-en-train-dajouter-ses-produits-dnas-saboutique-en-ligne.-accoude-a-son-etabli-dans-son-atelier.-lumiere-naturelle.webp',
      categoryLabel: 'Précommande Formation'
    });

    // Save preordered item in student's enrolled courses in localStorage
    try {
      const existing = JSON.parse(localStorage.getItem('gd_enrolled_courses') || '[]');
      const newEnrolled = {
        id: campaign.id,
        title: campaign.courseTitle,
        slug: 'formation-woocommerce',
        type: 'formation',
        typeLabel: `🚀 PRÉCOMMANDE (Sortie le ${campaign.releaseDate})`,
        progress: 0,
        completedLessons: 0,
        totalLessons: 4,
        duration: '2h15',
        instructor: 'Stéphanie ROCQ',
        isPreorder: true,
        releaseDate: campaign.releaseDate
      };
      if (!existing.some((e: any) => e.id === campaign.id)) {
        localStorage.setItem('gd_enrolled_courses', JSON.stringify([newEnrolled, ...existing]));
      }
    } catch (e) {}

    setIsProcessing(false);
    router.push('/dashboard/eleve?purchased=true');
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#332420] font-sans">
      <Header />

      {/* TOP NAVIGATION BREADCRUMB */}
      <div className="bg-[#f5f1e8] py-3.5 border-b border-[#e8ded0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link href="/boutique" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#18757d] hover:underline">
            <ArrowLeft className="w-4 h-4" />
            Retour à la Boutique
          </Link>
          <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-extrabold uppercase border ${statusDetails.badgeBg}`}>
            <Rocket className="w-3.5 h-3.5" />
            {statusDetails.label}
          </span>
        </div>
      </div>

      {/* HERO PREORDER SECTION */}
      <section className="py-12 md:py-16 bg-gradient-to-b from-[#eef4fb] to-[#faf8f5] border-b border-[#eee7da]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Column: Offer details */}
            <div className="lg:col-span-7 space-y-6">
              
              <div className="flex flex-wrap items-center gap-3">
                <span className="px-4 py-1 rounded-full text-xs font-extrabold bg-amber-400 text-[#332420] uppercase tracking-wider shadow-sm flex items-center gap-1.5">
                  <Sparkles className="w-4 h-4 text-[#332420]" />
                  Offre de Lancement en Précommande
                </span>

                <span className="px-4 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800 uppercase tracking-wider flex items-center gap-1.5">
                  <Calendar className="w-3.5 h-3.5" />
                  Sortie Officielle le {formatFrenchDate(campaign.releaseDate)}
                </span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#332420] leading-tight">
                {campaign.courseTitle}
              </h1>

              <p className="text-base text-[#5e4d46] leading-relaxed">
                {campaign.description}
              </p>

              {/* STATUT BANNER & JAUGE EN DIRECT */}
              <div className="p-6 bg-white rounded-3xl border-2 border-amber-300 shadow-md space-y-4">
                
                {/* Banner alert message */}
                <div className={`p-4 rounded-2xl text-xs font-bold ${statusDetails.badgeBg} flex items-center gap-3`}>
                  <Sparkles className="w-5 h-5 shrink-0" />
                  <span>{statusDetails.bannerMsg}</span>
                </div>

                <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs font-extrabold text-[#332420] gap-2 pt-2">
                  <span className="flex items-center gap-2 text-[#18757d]">
                    <Target className="w-5 h-5 text-amber-500 shrink-0" />
                    Jauge de précommandes requises : {campaign.currentEnrollments} / {campaign.targetEnrollments} ({percent}%)
                  </span>

                  <span className="text-amber-900 bg-amber-100 px-3.5 py-1 rounded-full border border-amber-300">
                    {remaining === 0 ? "🎉 Objectif atteint !" : `Plus que ${remaining} précommande(s) au tarif réduit !`}
                  </span>
                </div>

                <div className="w-full bg-[#faf8f5] rounded-full h-4 border border-[#eee7da] overflow-hidden p-0.5">
                  <div
                    className="bg-gradient-to-r from-amber-400 to-[#18757d] h-full rounded-full transition-all duration-500"
                    style={{ width: `${percent}%` }}
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-[11px] font-semibold text-slate-600 pt-1">
                  <div>
                    📅 Date limite de précommande : <strong className="text-[#332420]">{formatFrenchDate(campaign.endDate)}</strong>
                  </div>
                  <div>
                    🚀 Date de sortie officielle : <strong className="text-[#18757d]">{formatFrenchDate(campaign.releaseDate)}</strong>
                  </div>
                </div>
              </div>

              {/* Preorder Bonus Box */}
              {campaign.bonus && (
                <div className="p-5 bg-gradient-to-r from-amber-50 to-emerald-50 rounded-2xl border border-amber-200 flex items-center gap-4">
                  <Gift className="w-8 h-8 text-amber-500 shrink-0" />
                  <div>
                    <h4 className="text-xs font-extrabold text-[#332420] uppercase tracking-wider">Bonus réservé aux précommandeurs :</h4>
                    <p className="text-xs text-slate-700 font-bold mt-0.5">{campaign.bonus}</p>
                  </div>
                </div>
              )}

            </div>

            {/* Right Column: Checkout Card */}
            <div className="lg:col-span-5 bg-white p-8 rounded-3xl border border-[#eee7da] shadow-xl space-y-6">
              
              <div className="relative h-56 w-full rounded-2xl overflow-hidden bg-[#faf8f5] border border-[#eee7da]">
                <Image
                  src={campaign.image || "https://www.guides-digitaux.com/wp-content/uploads/2026/02/un-artisan-createur-devant-son-PC-en-train-dajouter-ses-produits-dnas-saboutique-en-ligne.-accoude-a-son-etabli-dans-son-atelier.-lumiere-naturelle.webp"}
                  alt={campaign.courseTitle}
                  fill
                  className="object-cover"
                />
                <span className="absolute top-3 left-3 bg-amber-400 text-[#332420] text-xs font-extrabold px-3 py-1 rounded-full uppercase shadow-sm">
                  Tarif Réduit Précommande
                </span>
              </div>

              <div className="space-y-3">
                <div className="flex items-baseline justify-between">
                  <span className="text-3xl font-extrabold text-[#18757d]">
                    {statusDetails.effectivePrice.toFixed(2).replace('.', ',')} €
                  </span>
                  {campaign.originalPrice && statusDetails.code !== 'RELEASED_FULL_PRICE' && (
                    <span className="text-base text-slate-400 line-through font-bold">
                      {campaign.originalPrice.toFixed(2).replace('.', ',')} €
                    </span>
                  )}
                </div>

                <p className="text-xs text-emerald-700 font-extrabold flex items-center gap-1">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                  {statusDetails.code === 'RELEASED_FULL_PRICE'
                    ? 'Formation immédiatement disponible en ligne'
                    : `Économise ${(campaign.originalPrice! - campaign.price).toFixed(2)} € avant le ${formatFrenchDate(campaign.releaseDate)} !`}
                </p>
              </div>

              <div className="space-y-3 pt-2">
                <button
                  onClick={handlePreorderCheckout}
                  disabled={isProcessing || !statusDetails.canOrder}
                  className={`w-full py-4 text-xs font-extrabold rounded-2xl shadow-lg uppercase tracking-wider transition-colors flex items-center justify-center gap-2 ${
                    statusDetails.canOrder
                      ? 'bg-amber-400 hover:bg-amber-300 text-[#332420]'
                      : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <Rocket className="w-5 h-5" />
                  {statusDetails.canOrder
                    ? `PRÉCOMMANDER CE COURS (${statusDetails.effectivePrice.toFixed(2)} €)`
                    : `CAMPAGNE NON VALIDÉE & REMBOURSÉE`}
                </button>

                <div className="flex items-center justify-center gap-2 text-[11px] font-semibold text-slate-500">
                  <ShieldCheck className="w-4 h-4 text-[#18757d]" />
                  Paiement sécurisé SSL • Garantie d'accès dès la sortie
                </div>
              </div>

              <div className="pt-4 border-t border-[#eee7da] space-y-2">
                <div className="flex items-center gap-2 text-xs font-bold text-[#332420]">
                  <CheckCircle2 className="w-4 h-4 text-[#18757d]" />
                  Accès garanti dans votre Espace Élève
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-[#332420]">
                  <CheckCircle2 className="w-4 h-4 text-[#18757d]" />
                  Mises à jour gratuites incluses
                </div>
                <div className="flex items-center gap-2 text-xs font-bold text-[#332420]">
                  <CheckCircle2 className="w-4 h-4 text-[#18757d]" />
                  Support personnalisé par Stéphanie ROCQ
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
}
