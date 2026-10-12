'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
  Sparkles,
  Download,
  CheckCircle2,
  AlertTriangle,
  Send,
  ShieldCheck,
  FileText,
  Calendar,
  ExternalLink,
  ArrowRight,
  Loader2,
  Check,
  Gift,
  BookOpen
} from 'lucide-react';

interface FreebieState {
  email: string;
  agreed: boolean;
  status: 'idle' | 'loading' | 'success' | 'error';
  errorMessage?: string;
  downloadUrl?: string;
}

export default function RessourcesGratuitesPage() {
  // State for Resource 1: Tuto Retractation
  const [retractationState, setRetractationState] = useState<FreebieState>({
    email: '',
    agreed: false,
    status: 'idle',
    downloadUrl: '/freebies/tuto-bouton-retractation.pdf'
  });

  // State for Resource 2: Plan d'action Rentree
  const [rentreeState, setRentreeState] = useState<FreebieState>({
    email: '',
    agreed: false,
    status: 'idle',
    downloadUrl: '/freebies/plan-action-rentree.pdf'
  });

  const handleSubscribe = async (
    e: React.FormEvent,
    tag: string,
    state: FreebieState,
    setState: React.Dispatch<React.SetStateAction<FreebieState>>,
    fallbackDownload: string
  ) => {
    e.preventDefault();
    if (!state.email || !state.email.includes('@')) {
      setState(prev => ({ ...prev, status: 'error', errorMessage: 'Merci de renseigner une adresse email valide.' }));
      return;
    }
    if (!state.agreed) {
      setState(prev => ({ ...prev, status: 'error', errorMessage: 'Merci de valider la case de consentement RGPD.' }));
      return;
    }

    setState(prev => ({ ...prev, status: 'loading', errorMessage: undefined }));

    try {
      const res = await fetch('/api/mailchimp/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: state.email,
          tag,
          tags: [tag, 'freebie-premiers-pas', 'newsletter']
        })
      });

      const data = await res.json().catch(() => ({}));

      if (res.ok && data.success !== false) {
        setState(prev => ({
          ...prev,
          status: 'success',
          downloadUrl: fallbackDownload
        }));
        // Auto trigger download
        if (typeof window !== 'undefined') {
          const a = document.createElement('a');
          a.href = fallbackDownload;
          a.download = fallbackDownload.split('/').pop() || 'ressource.pdf';
          a.target = '_blank';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
        }
      } else {
        setState(prev => ({
          ...prev,
          status: 'error',
          errorMessage: data.error || 'Une erreur est survenue lors de l\'enregistrement.'
        }));
      }
    } catch (err) {
      // In case of network glitch, grant access gracefully
      setState(prev => ({
        ...prev,
        status: 'success',
        downloadUrl: fallbackDownload
      }));
    }
  };

  const otherFreeResources = [
    {
      id: 'checklist-gmb',
      title: 'Checklist Fiche Google My Business & Maps',
      category: 'Checklist SEO Local',
      description: '25 points de contrôle stratégiques pour hisser ton atelier ou ton commerce en tête des recherches locales.',
      downloadUrl: '/freebies/checklist-fiche-google.pdf',
      badge: 'Audit Express'
    },
    {
      id: 'checklist-site',
      title: 'Checklist de Lancement de Site Internet',
      category: 'Checklist Web',
      description: 'Tout ce qu’il faut vérifier avant la mise en ligne : mentions légales, conformité mobile et formulaires de contact.',
      downloadUrl: '/freebies/checklist-site-web.pdf',
      badge: 'Contrôle Qualité'
    },
    {
      id: 'guide-redaction',
      title: 'Mini-Guide : Écrire pour le Web sans jargon',
      category: 'Guide Pratique',
      description: 'Trouver les mots justes pour valoriser son savoir-faire d’artisan et captiver l’attention de ses clients locaux.',
      downloadUrl: '/freebies/mini-guide-ecrire-web-artisan.pdf',
      badge: 'Rédaction'
    },
    {
      id: 'guide-photos',
      title: 'Mini-Guide : Optimiser ses Photos sans perdre en qualité',
      category: 'Guide Technique',
      description: 'La méthode pour diviser le poids de tes photos par 10 et accélérer ton site sans rogner sur les détails.',
      downloadUrl: '/freebies/mini-guide-optimiser-photos.pdf',
      badge: 'Performance'
    }
  ];

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#332420] font-sans selection:bg-[#18757d] selection:text-white flex flex-col justify-between">
      <div>
        <Header />

        {/* HERO SECTION */}
        <section className="py-12 sm:py-16 md:py-20 px-4 sm:px-6 lg:px-8 border-b border-[#eee7da] bg-gradient-to-b from-[#faf8f5] via-white to-[#faf8f5]">
          <div className="max-w-4xl mx-auto text-center space-y-6">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#f5dfbb] text-[#332420] text-xs font-black uppercase tracking-wider border border-[#332420]/10 shadow-2xs">
              <Sparkles className="w-4 h-4 text-[#f2542d]" />
              <span>Accès Libre & 100% Gratuit</span>
            </div>

            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black text-[#332420] tracking-tight leading-tight">
              Ressources & Guides{' '}
              <span className="text-[#18757d] underline decoration-[#f2542d] decoration-4 underline-offset-8">
                Gratuits
              </span>
            </h1>

            <p className="text-base sm:text-lg text-[#5e4d46] max-w-2xl mx-auto leading-relaxed">
              Retrouve ici nos tutoriels réglementaires, plans d’action et fiches pratiques à télécharger immédiatement pour développer ton activité en ligne sans stress, sans jargon et en toute autonomie.
            </p>
          </div>
        </section>

        {/* MAIN FEATURED FREEBIES */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 space-y-12">
          
          {/* RESOURCE 1: TUTO BOUTON RETRACTATION */}
          <section className="bg-white rounded-3xl p-6 sm:p-10 border-2 border-[#18757d]/20 shadow-lg hover:shadow-xl transition-all relative overflow-hidden">
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <span className="px-3.5 py-1 rounded-full bg-[#f2542d] text-white text-xs font-black uppercase tracking-wider shadow-2xs">
                Loi Européenne • Obligatoire
              </span>
              <span className="text-xs font-extrabold text-[#18757d] bg-[#e6f4f3] px-3 py-1 rounded-full border border-[#18757d]/20">
                Tuto Gratuit 🎁
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              
              {/* Image & Mockup */}
              <div className="lg:col-span-5 relative">
                <div className="relative rounded-2xl overflow-hidden shadow-md border border-[#eee7da] bg-slate-50 group aspect-4/3">
                  <Image
                    src="/images/ressources/tuto-retractation.png"
                    alt="Tuto gratuit bouton de rétractation e-commerce"
                    fill
                    className="object-cover group-hover:scale-102 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60"></div>
                  <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-md border border-[#eee7da] flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    <span className="text-xs font-black text-[#332420]">Conforme Loi Juin 2026</span>
                  </div>
                </div>
              </div>

              {/* Text & Form */}
              <div className="lg:col-span-7 space-y-5">
                <h2 className="text-2xl sm:text-3xl font-black text-[#332420] leading-tight">
                  🎁 Ton tuto gratuit pour être en règle dès aujourd'hui (Bouton de rétractation)
                </h2>

                <p className="text-sm sm:text-base font-bold text-[#332420] leading-relaxed">
                  Depuis le 19 juin 2026, une nouvelle loi européenne impose à tous les sites e-commerce de proposer un bouton de rétractation visible et accessible.
                </p>

                <div className="bg-amber-50 border-l-4 border-[#f2542d] p-4 rounded-r-xl flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 text-[#f2542d] shrink-0 mt-0.5" />
                  <p className="text-xs sm:text-sm font-black text-[#332420]">
                    Sanction si tu t’en fiches : jusqu’à 75 000 € d’amende.
                  </p>
                </div>

                <p className="text-[#5e4d46] text-xs sm:text-sm leading-relaxed">
                  Nom d’une pipe, autant régler ça maintenant — et c’est exactement pour ça que j’ai créé ce tuto pas-à-pas simple et illustré. 😄
                </p>

                {retractationState.status === 'success' ? (
                  <div className="p-5 bg-emerald-50 border-2 border-emerald-300 rounded-2xl text-left space-y-3">
                    <div className="flex items-center gap-2 text-emerald-900 font-black text-sm">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <span>C’est tout bon ! Ton guide PDF est prêt.</span>
                    </div>
                    <p className="text-xs text-emerald-950">
                      Le téléchargement a démarré automatiquement. Si rien ne s’affiche, clique sur le bouton ci-dessous :
                    </p>
                    <a
                      href={retractationState.downloadUrl}
                      download="tuto-bouton-retractation.pdf"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#18757d] hover:bg-[#12595f] text-white font-extrabold text-xs rounded-xl shadow-xs uppercase tracking-wider transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Télécharger le Tuto PDF
                    </a>
                  </div>
                ) : (
                  <form
                    onSubmit={e => handleSubscribe(e, 'tuto-retractation', retractationState, setRetractationState, '/downloads/tuto-bouton-retractation.pdf')}
                    className="space-y-3 pt-1"
                  >
                    <p className="text-xs font-bold text-[#18757d]">
                      👇 Entre ton email, je te l’envoie immédiatement et gratuitement :
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <input
                        type="email"
                        required
                        placeholder="Entre ton adresse email ici"
                        value={retractationState.email}
                        onChange={e => setRetractationState(prev => ({ ...prev, email: e.target.value }))}
                        className="flex-grow px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#18757d] text-xs sm:text-sm bg-white shadow-2xs"
                      />
                      <button
                        type="submit"
                        disabled={retractationState.status === 'loading'}
                        className="px-6 py-3.5 rounded-xl font-black text-xs uppercase tracking-wider bg-[#18757d] hover:bg-[#12595f] text-white shadow-md transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer disabled:opacity-50"
                      >
                        {retractationState.status === 'loading' ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Envoi...</span>
                          </>
                        ) : (
                          <>
                            <span>Recevoir mon tuto gratuit</span>
                            <Send className="w-4 h-4 text-amber-300" />
                          </>
                        )}
                      </button>
                    </div>

                    <div className="flex items-start gap-2 pt-1 text-left">
                      <input
                        type="checkbox"
                        id="gdprRetractation"
                        required
                        checked={retractationState.agreed}
                        onChange={e => setRetractationState(prev => ({ ...prev, agreed: e.target.checked }))}
                        className="mt-0.5 w-4 h-4 rounded border-slate-300 text-[#18757d] focus:ring-[#18757d] shrink-0 cursor-pointer"
                      />
                      <label htmlFor="gdprRetractation" className="text-[11px] text-slate-500 leading-snug cursor-pointer">
                        En cliquant, j’atteste avoir compris que mes données ne seront pas partagées ni revendues, conformément à la politique de confidentialité RGPD.
                      </label>
                    </div>

                    {retractationState.errorMessage && (
                      <p className="text-xs text-rose-600 font-bold">{retractationState.errorMessage}</p>
                    )}
                  </form>
                )}
              </div>

            </div>
          </section>

          {/* RESOURCE 2: PLAN D'ACTION RENTRÉE */}
          <section className="bg-white rounded-3xl p-6 sm:p-10 border-2 border-amber-300 shadow-lg hover:shadow-xl transition-all relative overflow-hidden">
            <div className="flex flex-wrap items-center gap-2 mb-6">
              <span className="px-3.5 py-1 rounded-full bg-[#18757d] text-white text-xs font-black uppercase tracking-wider shadow-2xs">
                Organisation • Stratégie
              </span>
              <span className="text-xs font-extrabold text-[#332420] bg-amber-100 px-3 py-1 rounded-full border border-amber-300">
                Plan d'action offert 🎁
              </span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              
              {/* Text & Form */}
              <div className="lg:col-span-7 space-y-5 order-2 lg:order-1">
                <h2 className="text-2xl sm:text-3xl font-black text-[#332420] leading-tight">
                  🎁 Ton plan d'action gratuit pour préparer ta rentrée
                </h2>

                <p className="text-sm sm:text-base font-bold text-[#332420] leading-relaxed">
                  L'été ou les périodes calmes pour ton activité ? C’est une chance unique.
                </p>

                <p className="text-xs sm:text-sm text-[#5e4d46] leading-relaxed">
                  Pendant que tes concurrents coupent tout, profite du calme pour poser sereinement les bases de ta présence en ligne, sans stress et sans jargon.
                </p>

                <div className="bg-[#faf8f5] border-l-4 border-[#18757d] p-4 rounded-r-xl space-y-1">
                  <p className="text-xs sm:text-sm font-bold text-[#332420]">
                    <strong>Le risque si tu ne fais rien :</strong> Arriver en septembre sous l’eau, sans visibilité, et passer à côté des clients qui cherchent tes créations ou ton savoir-faire sur Google.
                  </p>
                </div>

                <p className="text-[#5e4d46] text-xs sm:text-sm leading-relaxed">
                  Nom d’une pipe, autant utiliser ce temps calme maintenant — et c’est exactement pour ça que j’ai créé ce plan d’action en 4 étapes faciles. 😁
                </p>

                {rentreeState.status === 'success' ? (
                  <div className="p-5 bg-emerald-50 border-2 border-emerald-300 rounded-2xl text-left space-y-3">
                    <div className="flex items-center gap-2 text-emerald-900 font-black text-sm">
                      <CheckCircle2 className="w-5 h-5 text-emerald-600" />
                      <span>C’est parfait ! Ton plan d'action PDF est prêt.</span>
                    </div>
                    <p className="text-xs text-emerald-950">
                      Le téléchargement a démarré. Si rien ne se passe, clique ci-dessous :
                    </p>
                    <a
                      href={rentreeState.downloadUrl}
                      download="plan-action-rentree.pdf"
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#18757d] hover:bg-[#12595f] text-white font-extrabold text-xs rounded-xl shadow-xs uppercase tracking-wider transition-colors"
                    >
                      <Download className="w-4 h-4" />
                      Télécharger le Plan d'Action PDF
                    </a>
                  </div>
                ) : (
                  <form
                    onSubmit={e => handleSubscribe(e, 'plan-rentree', rentreeState, setRentreeState, '/downloads/plan-action-rentree.pdf')}
                    className="space-y-3 pt-1"
                  >
                    <p className="text-xs font-bold text-[#18757d]">
                      👇 Entre ton email, je te l’envoie immédiatement et gratuitement :
                    </p>

                    <div className="flex flex-col sm:flex-row gap-3">
                      <input
                        type="email"
                        required
                        placeholder="Entre ton adresse email ici"
                        value={rentreeState.email}
                        onChange={e => setRentreeState(prev => ({ ...prev, email: e.target.value }))}
                        className="flex-grow px-4 py-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#18757d] text-xs sm:text-sm bg-white shadow-2xs"
                      />
                      <button
                        type="submit"
                        disabled={rentreeState.status === 'loading'}
                        className="px-6 py-3.5 rounded-xl font-black text-xs uppercase tracking-wider bg-[#332420] hover:bg-[#18757d] text-white shadow-md transition-all flex items-center justify-center gap-2 shrink-0 cursor-pointer disabled:opacity-50"
                      >
                        {rentreeState.status === 'loading' ? (
                          <>
                            <Loader2 className="w-4 h-4 animate-spin" />
                            <span>Envoi...</span>
                          </>
                        ) : (
                          <>
                            <span>Recevoir mon plan d'action</span>
                            <Send className="w-4 h-4 text-amber-300" />
                          </>
                        )}
                      </button>
                    </div>

                    <div className="flex items-start gap-2 pt-1 text-left">
                      <input
                        type="checkbox"
                        id="gdprRentree"
                        required
                        checked={rentreeState.agreed}
                        onChange={e => setRentreeState(prev => ({ ...prev, agreed: e.target.checked }))}
                        className="mt-0.5 w-4 h-4 rounded border-slate-300 text-[#18757d] focus:ring-[#18757d] shrink-0 cursor-pointer"
                      />
                      <label htmlFor="gdprRentree" className="text-[11px] text-slate-500 leading-snug cursor-pointer">
                        En cliquant, j’atteste avoir compris que mes données ne seront pas partagées ni revendues, conformément à la politique de confidentialité RGPD.
                      </label>
                    </div>

                    {rentreeState.errorMessage && (
                      <p className="text-xs text-rose-600 font-bold">{rentreeState.errorMessage}</p>
                    )}
                  </form>
                )}
              </div>

              {/* Image & Mockup */}
              <div className="lg:col-span-5 relative order-1 lg:order-2">
                <div className="relative rounded-2xl overflow-hidden shadow-md border border-[#eee7da] bg-slate-50 group aspect-4/3">
                  <Image
                    src="/images/ressources/plan-action-rentree.webp"
                    alt="Plan d'action rentrée ressources gratuites"
                    fill
                    className="object-cover group-hover:scale-102 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-60"></div>
                  <div className="absolute top-3 right-3 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl shadow-md border border-amber-200 flex items-center gap-2">
                    <Sparkles className="w-4 h-4 text-[#18757d]" />
                    <span className="text-xs font-black text-[#332420]">Méthode 4 Étapes</span>
                  </div>
                </div>
              </div>

            </div>
          </section>

          {/* OTHER FREE GUIDES & CHECKLISTS GRID */}
          <section className="space-y-8 pt-6">
            <div className="text-center space-y-2">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#18757d] block">
                Boîte à Outils Complète
              </span>
              <h2 className="text-2xl sm:text-3xl font-black text-[#332420]">
                Autres Checklists & Mini-Guides en Accès Libre
              </h2>
              <p className="text-xs sm:text-sm text-[#5e4d46] max-w-xl mx-auto">
                Des fiches pratiques et résumés stratégiques prêts à l'emploi à télécharger en un clic.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {otherFreeResources.map(res => (
                <div
                  key={res.id}
                  className="bg-white p-6 sm:p-7 rounded-3xl border border-[#eee7da] shadow-sm hover:shadow-md transition-all flex flex-col justify-between gap-5 text-left"
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[10px] font-black uppercase tracking-wider bg-[#e6f4f3] text-[#18757d] px-2.5 py-0.5 rounded-full border border-[#18757d]/20">
                        {res.category}
                      </span>
                      <span className="text-[10px] font-extrabold text-amber-800 bg-amber-50 px-2.5 py-0.5 rounded-full border border-amber-200">
                        {res.badge}
                      </span>
                    </div>

                    <h3 className="text-base sm:text-lg font-black text-[#332420] leading-snug">
                      {res.title}
                    </h3>

                    <p className="text-xs text-[#5e4d46] leading-relaxed">
                      {res.description}
                    </p>
                  </div>

                  <a
                    href={res.downloadUrl}
                    download
                    target="_blank"
                    rel="noreferrer"
                    className="w-full py-3 bg-[#faf8f5] hover:bg-[#18757d] text-[#18757d] hover:text-white border border-[#eee7da] font-extrabold text-xs rounded-xl shadow-2xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Télécharger le PDF</span>
                  </a>
                </div>
              ))}
            </div>
          </section>

          {/* CALL TO ACTION: BOUTIQUE & FORMATIONS COMPLÈTES */}
          <section className="bg-gradient-to-r from-amber-100/70 via-white to-emerald-50/70 border-2 border-[#18757d]/20 p-8 sm:p-12 rounded-3xl shadow-md flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-3 text-center md:text-left">
              <span className="inline-block px-3.5 py-1 bg-[#18757d] text-white text-xs font-black uppercase tracking-wider rounded-full shadow-2xs">
                💡 Quand y'en a plus, y'en a encore !
              </span>
              <h3 className="text-2xl sm:text-3xl font-black text-[#332420]">
                Découvre les Formations & Checklists Guides Digitaux
              </h3>
              <p className="text-[#5e4d46] text-xs sm:text-sm max-w-2xl leading-relaxed">
                Envie d'aller encore plus loin ? Retrouve nos formations vidéo complètes (Cap Visibilité Google, Créer sa vitrine WordPress, Boutique WooCommerce) et nos packs pratiques pour rendre le digital simple et rentable.
              </p>
            </div>
            <Link
              href="/boutique"
              className="px-6 py-4 rounded-xl font-black text-xs uppercase tracking-wider bg-[#18757d] hover:bg-[#12595f] text-white transition-all shadow-md shrink-0 inline-flex items-center gap-2 cursor-pointer"
            >
              <span>Voir la boutique complète</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </section>

          {/* CALL TO ACTION: ACCOMPAGNEMENT SUR-MESURE */}
          <section className="bg-[#332420] text-white rounded-3xl p-8 sm:p-12 flex flex-col md:flex-row items-center justify-between gap-8 shadow-xl">
            <div className="space-y-2 text-center md:text-left">
              <span className="text-xs font-extrabold text-amber-400 uppercase tracking-wider block">
                Besoin d'aide personnalisée ?
              </span>
              <h3 className="text-2xl font-black text-white">
                Tu préfères un accompagnement sur-mesure ?
              </h3>
              <p className="text-slate-300 text-xs sm:text-sm max-w-xl">
                Discutons 30 minutes de ton projet et de tes besoins lors d'un entretien découverte totalement offert avec Stéphanie Rocq.
              </p>
            </div>
            <a
              href="https://calendar.app.google/A4SMq4zBbZYnnCr18"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3.5 rounded-xl font-black text-xs uppercase tracking-wider bg-[#f2542d] hover:bg-[#d8431f] text-white transition-all shrink-0 inline-flex items-center gap-2 shadow-md"
            >
              <span>Réserver un échange gratuit</span>
              <Calendar className="w-4 h-4" />
            </a>
          </section>

        </div>
      </div>

      <Footer />
    </div>
  );
}
