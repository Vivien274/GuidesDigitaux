'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import VipSubscribeModal from '@/components/VipSubscribeModal';
import { getStoredPreorders, PreorderCampaign, getPreorderDestinationUrl } from '@/lib/preordersStore';
import { fetchPreordersFromDb } from '@/lib/supabaseLms';
import { 
  Rocket, 
  Clock, 
  Users, 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  ShieldCheck, 
  Gift 
} from 'lucide-react';

export default function PrecommandesPage() {
  const [preorders, setPreorders] = useState<PreorderCampaign[]>([]);
  const [isVipModalOpen, setIsVipModalOpen] = useState(false);
  const [selectedVipCourse, setSelectedVipCourse] = useState('Formation Fiche Google Business Profile');

  useEffect(() => {
    fetchPreordersFromDb().then(setPreorders);
  }, []);

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#332420] font-sans">
      <Header />

      {/* HERO BANNER */}
      <section className="py-14 md:py-20 bg-gradient-to-b from-[#eef4fb] via-[#f7f4ee] to-[#faf8f5] border-b border-[#eee7da] text-center">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-5">
          <span className="inline-flex items-center gap-1.5 px-4 py-1 rounded-full text-xs font-extrabold bg-amber-400 text-[#332420] uppercase tracking-wider shadow-2xs">
            <Rocket className="w-4 h-4 text-[#332420]" />
            Tarif Pionnier Privilégié - Sortie 15 septembre 2026
          </span>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#332420] tracking-tight leading-tight">
            Formations en <span className="text-[#18757d]">Précommande</span>
          </h1>

          <p className="text-sm sm:text-base text-[#5e4d46] max-w-2xl mx-auto leading-relaxed">
            Soutiens les projets de formation en avant-première et bénéficie jusqu'à <strong>-60% de réduction</strong> par rapport au tarif officiel de sortie !
          </p>

          <div className="pt-3 flex flex-wrap items-center justify-center gap-6 text-xs font-bold text-[#5e4d46]">
            <span className="flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 text-[#18757d]" />
              Tarif bloqué garanti à vie
            </span>
            <span className="flex items-center gap-1.5">
              <Gift className="w-4 h-4 text-amber-600" />
              Bonus exclusifs précommandeurs inclus
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-4 h-4 text-emerald-600" />
              Accès illimité dès le 15 septembre
            </span>
          </div>
        </div>
      </section>

      {/* PREORDERS LISTING GRID */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          <div className="flex items-center justify-between border-b border-[#eee7da] pb-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#332420]">
                Campagnes de précommande ouvertes ({preorders.length})
              </h2>
              <p className="text-xs text-slate-500">
                Chaque projet est validé dès que l'objectif de précommandes est atteint.
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {preorders.map((po) => {
              const percent = Math.min(100, Math.round((po.currentEnrollments / po.targetEnrollments) * 100));

              return (
                <div key={po.id} className="bg-white rounded-3xl overflow-hidden border-2 border-[#eee7da] shadow-md hover:shadow-lg transition-all flex flex-col justify-between">
                  
                  <div className="space-y-6">
                    {/* Image Header */}
                    <div className="relative h-60 w-full bg-slate-100">
                      <Image
                        src={po.image || 'https://www.guides-digitaux.com/wp-content/uploads/2026/02/un-artisan-createur-devant-son-PC-en-train-dajouter-ses-produits-dnas-saboutique-en-ligne.-accoude-a-son-etabli-dans-son-atelier.-lumiere-naturelle.webp'}
                        alt={po.courseTitle}
                        fill
                        className="object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                      
                      <div className="absolute top-4 left-4 flex flex-wrap gap-2">
                        <span className="bg-amber-400 text-[#332420] text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-xs">
                          🚀 PRÉCOMMANDE
                        </span>
                        <span className="bg-white/90 backdrop-blur-xs text-[#18757d] text-xs font-extrabold px-3 py-1 rounded-full border border-[#eee7da]">
                          Sortie : 15 Septembre
                        </span>
                      </div>

                      <div className="absolute bottom-4 left-4 right-4 text-white flex items-end justify-between">
                        <div>
                          <span className="text-[11px] font-bold text-amber-200 uppercase tracking-wider block">Tarif Réduit Précommande</span>
                          <div className="flex items-baseline gap-2">
                            <span className="text-3xl font-extrabold text-white">{po.price} €</span>
                            <span className="text-sm line-through text-slate-300">{po.originalPrice} €</span>
                          </div>
                        </div>
                        <span className="bg-emerald-500 text-white text-[11px] font-extrabold px-2.5 py-1 rounded-lg uppercase">
                          -{po.originalPrice ? Math.round(((po.originalPrice - po.price) / po.originalPrice) * 100) : 50}%
                        </span>
                      </div>
                    </div>

                    {/* Content Details */}
                    <div className="p-6 sm:p-8 space-y-5">
                      <h3 className="text-xl font-extrabold text-[#332420] leading-snug">
                        {po.courseTitle}
                      </h3>

                      <p className="text-xs sm:text-sm text-slate-600 leading-relaxed">
                        {po.description}
                      </p>

                      {/* Bonus */}
                      {po.bonus && (
                        <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-2xl text-xs text-amber-950 font-medium flex items-start gap-2.5">
                          <Gift className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                          <span><strong>Bonus Précommande :</strong> {po.bonus}</span>
                        </div>
                      )}

                      {/* Objective Progress Bar */}
                      <div className="space-y-2 pt-2">
                        <div className="flex items-center justify-between text-xs font-bold">
                          <span className="text-slate-600 flex items-center gap-1.5">
                            <Users className="w-4 h-4 text-[#18757d]" />
                            Objectif : {po.currentEnrollments} / {po.targetEnrollments} précommandes
                          </span>
                          <span className="text-[#18757d] font-extrabold">{percent}%</span>
                        </div>
                        <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden p-0.5 border border-[#eee7da]">
                          <div className="bg-[#18757d] h-full rounded-full transition-all duration-500" style={{ width: `${percent}%` }} />
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
                          <span>Sortie officielle : {po.releaseDate}</span>
                          <span className="text-emerald-700 font-bold">✓ Lancement garanti</span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* CTA Footer */}
                  <div className="p-6 sm:p-8 pt-0 space-y-2">
                    <Link
                      href={getPreorderDestinationUrl(po)}
                      target={getPreorderDestinationUrl(po).startsWith('http') ? '_blank' : '_self'}
                      className="w-full py-4 bg-[#18757d] hover:bg-[#12595f] text-white font-extrabold text-xs rounded-2xl shadow-md uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Rocket className="w-4 h-4 text-amber-300" />
                      PRÉCOMMANDER À {po.price} €
                      <ArrowRight className="w-4 h-4" />
                    </Link>

                    <button
                      onClick={() => {
                        setSelectedVipCourse(po.courseTitle);
                        setIsVipModalOpen(true);
                      }}
                      className="w-full py-3 bg-[#f5dfbb] hover:bg-amber-300 text-[#562C2C] font-extrabold text-xs rounded-2xl shadow-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer border border-amber-400"
                    >
                      <Sparkles className="w-4 h-4 text-[#F2542D]" />
                      ⭐ LISTE VIP (INFOS EN AVANT-PREMIÈRE)
                    </button>
                  </div>

                </div>
              );
            })}
          </div>

        </div>
      </section>

      <Footer />

      <VipSubscribeModal
        isOpen={isVipModalOpen}
        onClose={() => setIsVipModalOpen(false)}
        defaultTag="prevente-gmb"
        courseTitle={selectedVipCourse}
      />
    </div>
  );
}
