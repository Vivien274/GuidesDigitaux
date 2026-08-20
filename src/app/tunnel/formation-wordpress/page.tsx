'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import {
  CheckCircle2,
  Star,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  PlayCircle,
  Clock,
  BookOpen,
  ChevronDown,
  ChevronUp,
  Award,
  Zap,
  Lock,
  MessageCircle,
  Gift,
  HelpCircle,
  UserCheck,
  Check
} from 'lucide-react';

export default function TunnelFormationWordpressPage() {
  const router = useRouter();
  const [openModule, setOpenModule] = useState<number | null>(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleCheckout = async () => {
    setIsLoading(true);
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: 'formation-wordpress',
          title: 'Formation Vidéo : Créer sa vitrine en ligne avec WordPress',
          price: 199,
          cancelUrl: 'https://www.guides-digitaux.com/tunnel/formation-wordpress',
          successUrl: 'https://www.guides-digitaux.com/tunnel/upsell?session_id={CHECKOUT_SESSION_ID}&productId=formation-wordpress'
        })
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Une erreur est survenue lors de l\'initialisation de la commande.');
        setIsLoading(false);
      }
    } catch (e) {
      console.error('Checkout error', e);
      alert('Impossible de contacter le serveur de paiement.');
      setIsLoading(false);
    }
  };

  const modules = [
    {
      title: "Module 1 : Réservation du Nom de Domaine & Hébergement Web",
      duration: "30 min",
      lessons: [
        "Choisir le bon nom de domaine (.fr / .com) et éviter les pièges d'usurpation",
        "Commander son hébergement web performant chez O2Switch / OVH au meilleur tarif",
        "Installer WordPress en 1 clic et configurer votre certificat de sécurité SSL/HTTPS"
      ]
    },
    {
      title: "Module 2 : Prise en Main & Réglages Fondamentaux de WordPress",
      duration: "45 min",
      lessons: [
        "Comprendre le Tableau de Bord WordPress sans stress",
        "Configurer les permaliens pour plaire immédiatement à Google (SEO)",
        "Installer et paramétrer le thème graphique professionnel ultra-rapide"
      ]
    },
    {
      title: "Module 3 : Conception de vos Pages avec le Constructeur Visuel Elementor",
      duration: "1h30",
      lessons: [
        "Maîtriser le glisser-déposer d'Elementor sans toucher à une ligne de code",
        "Créer une Page d'Accueil captivante qui transforme vos visiteurs en prospects",
        "Concevoir les pages 'À propos', 'Prestations', 'Réalisations' et 'Contact'"
      ]
    },
    {
      title: "Module 4 : Optimisation Mobile (Responsive) & Expérience Utilisateur",
      duration: "40 min",
      lessons: [
        "Adapter parfaitement votre design sur smartphones iOS, Android et tablettes",
        "Placer des boutons d'action (CTA) cliquables au pouce pour maximiser les appels",
        "Alléger la vitesse d'affichage selon les normes Google Core Web Vitals"
      ]
    },
    {
      title: "Module 5 : Référencement Naturel (SEO Local), Sécurité & Mise en Ligne",
      duration: "50 min",
      lessons: [
        "Optimiser vos balises Meta Title & Description pour les recherches locales (votre ville)",
        "Installer la protection anti-spam et anti-piratage sur vos formulaires",
        "Connecter votre site à Google Maps / Google Search Console et lancer votre site"
      ]
    }
  ];

  const bonuses = [
    {
      title: "Vidéo Bonus 1 : Créer son Adresse E-mail Pro Gratuite",
      value: "Valeur : 29 € (Offert)",
      desc: "Le tutoriel pas-à-pas pour configurer votre adresse professionnelle (ex: contact@votreentreprise.fr) sans payer d'abonnement mensuel."
    },
    {
      title: "Vidéo Bonus 2 : Optimiser ses Photos & Vidéos Web",
      value: "Valeur : 29 € (Offert)",
      desc: "La méthode exacte pour diviser le poids de vos visuels par 10 sans aucune perte de qualité et garantir un site ultrarapide sur mobile."
    }
  ];

  const faqs = [
    {
      q: "Est-ce que je dois savoir coder ou m'y connaître en informatique ?",
      a: "Absolument pas ! Cette formation est 100% conçue pour les débutants complets. Tout se fait en glisser-déposer sur votre écran, sans toucher à la moindre ligne de code."
    },
    {
      q: "Combien de temps ai-je accès à la formation ?",
      a: "Votre accès est illimité 24h/24 et 7j/7 à vie ! Vous pouvez suivre les modules à votre propre rythme, les revoir autant de fois que vous le souhaitez et bénéficier de toutes les futures mises à jour gratuites."
    },
    {
      q: "Quel est le budget à prévoir à côté de la formation ?",
      a: "Uniquement votre nom de domaine et votre hébergement web, qui coûtent environ 5 à 7 € par mois (soit environ 60 €/an). Tous les outils utilisés dans la formation (WordPress, Elementor) sont gratuits !"
    },
    {
      q: "Que se passe-t-il après mon achat ?",
      a: "Vous recevez immédiatement vos accès par email et votre espace élève est débloqué à l'instant. Vous pouvez commencer votre premier module dans 2 minutes !"
    }
  ];

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#332420] font-sans selection:bg-[#18757d] selection:text-white pb-24 lg:pb-0">
      <Header />

      {/* TOP ANNOUNCEMENT BANNER */}
      <div className="bg-gradient-to-r from-[#18757d] to-[#12595f] text-white py-3 px-4 text-center text-xs font-bold shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 flex-wrap">
          <span className="bg-amber-400 text-[#332420] text-[10px] uppercase tracking-wider font-extrabold px-2.5 py-0.5 rounded-full">
            ACCÈS IMMÉDIAT
          </span>
          <span>⚡ Formation Vidéo WordPress Complète — 4 Bonus Exclusifs Inclus Aujourd'hui !</span>
        </div>
      </div>

      {/* HERO SECTION */}
      <section className="relative pt-12 pb-16 lg:pt-16 lg:pb-24 overflow-hidden bg-gradient-to-b from-[#eef4fb]/60 via-[#faf8f5] to-[#faf8f5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 space-y-6 text-center lg:text-left">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#e6f4f3] border border-[#18757d]/20 text-[#18757d] text-xs font-extrabold tracking-wide uppercase">
                <Sparkles className="w-4 h-4 text-amber-500" />
                Spécial Artisans, Créateurs & Indépendants
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-black text-[#332420] leading-[1.15] tracking-tight">
                Crée Ton Site Vitrine Pro Avec <span className="text-[#18757d] underline decoration-amber-400 decoration-wavy underline-offset-8">WordPress</span> Sans Y Passer Des Mois Ni Déposer 3 000 € En Agence
              </h1>

              <p className="text-base sm:text-lg text-[#5e4d46] font-medium leading-relaxed max-w-2xl mx-auto lg:mx-0">
                La méthode pas-à-pas en vidéo enregistrée en HD pour construire votre propre site internet sur-mesure, attirer des clients dans votre région et devenir 100% autonome.
              </p>

              {/* Bullet Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2 text-left max-w-xl mx-auto lg:mx-0">
                <div className="flex items-center gap-2.5 text-xs font-extrabold text-[#332420] bg-white p-3 rounded-2xl border border-[#eee7da] shadow-2xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  Zéro connaissance en code nécessaire
                </div>
                <div className="flex items-center gap-2.5 text-xs font-extrabold text-[#332420] bg-white p-3 rounded-2xl border border-[#eee7da] shadow-2xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  Accès illimité à vie 24h/24 & 7j/7
                </div>
                <div className="flex items-center gap-2.5 text-xs font-extrabold text-[#332420] bg-white p-3 rounded-2xl border border-[#eee7da] shadow-2xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  Design mobile & SEO local inclus
                </div>
                <div className="flex items-center gap-2.5 text-xs font-extrabold text-[#332420] bg-white p-3 rounded-2xl border border-[#eee7da] shadow-2xs">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  2 Vidéos Bonus Exclusives Offertes
                </div>
              </div>

              {/* HERO CTA BUTTON */}
              <div className="pt-4 space-y-3">
                <button
                  onClick={handleCheckout}
                  disabled={isLoading}
                  className="w-full sm:w-auto px-9 py-5 text-sm sm:text-base font-black text-white bg-[#18757d] hover:bg-[#12595f] rounded-2xl shadow-xl hover:shadow-2xl uppercase tracking-wider transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-3 mx-auto lg:mx-0 cursor-pointer"
                >
                  {isLoading ? (
                    <span>Redirection sécurisée vers Stripe...</span>
                  ) : (
                    <>
                      <span>REJOINDRE LA FORMATION MAINTENANT (199 €)</span>
                      <ArrowRight className="w-5 h-5 text-amber-300" />
                    </>
                  )}
                </button>

                <div className="flex items-center justify-center lg:justify-start gap-4 text-xs font-semibold text-[#5e4d46]">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" /> Paiement Sécurisé SSL
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Zap className="w-4 h-4 text-amber-500" /> Accès Immédiat
                  </span>
                </div>
              </div>

            </div>

            {/* Right Media Card */}
            <div className="lg:col-span-5">
              <div className="bg-white p-4 sm:p-6 rounded-3xl border border-[#eee7da] shadow-2xl space-y-5 relative">
                <div className="relative h-64 sm:h-72 w-full rounded-2xl overflow-hidden shadow-inner group">
                  <Image
                    src="/images/products/formation-wordpress.webp"
                    alt="Formation Vidéo Vitrine WordPress"
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-center justify-center">
                    <div className="w-16 h-16 rounded-full bg-amber-400 text-[#332420] flex items-center justify-center shadow-2xl transform group-hover:scale-110 transition-transform">
                      <PlayCircle className="w-9 h-9 fill-[#332420] text-amber-400" />
                    </div>
                  </div>
                  <span className="absolute bottom-3 left-3 bg-black/80 backdrop-blur-md text-white text-[11px] font-bold px-3 py-1 rounded-full flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-amber-400" /> 3h45 de Vidéos HD Pas-à-Pas
                  </span>
                </div>

                {/* Social Proof Widget */}
                <div className="p-4 bg-[#faf8f5] rounded-2xl border border-[#eee7da] space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="text-xs font-black text-[#18757d]">Note 5.0 / 5</span>
                  </div>
                  <p className="text-xs text-[#5e4d46] italic leading-relaxed">
                    « Stéphanie explique chaque clic avec une clarté remarquable. J'ai pu lancer le site de mon atelier d'ébénisterie en un week-end ! »
                  </p>
                  <span className="text-[11px] font-extrabold text-[#332420] block">— Thomas D., Artisan dans le Nord</span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* PAIN POINTS SECTION */}
      <section className="py-16 bg-white border-y border-[#eee7da]">
        <div className="max-w-4xl mx-auto px-4 text-center space-y-10">
          <div className="space-y-3">
            <span className="text-xs font-black text-[#e05a47] uppercase tracking-wider bg-rose-50 px-3 py-1 rounded-full border border-rose-200">
              Est-ce que vous vous reconnaissez dans cette situation ?
            </span>
            <h2 className="text-2xl sm:text-3xl font-black text-[#332420]">
              Créer un site internet ne devrait pas être un parcours du combattant.
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            <div className="bg-[#faf8f5] p-6 rounded-2xl border border-[#eee7da] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-black">
                1
              </div>
              <h3 className="text-base font-extrabold text-[#332420]">Les devis d'agences hors de prix</h3>
              <p className="text-xs text-[#5e4d46] leading-relaxed">
                Payer entre 2 000 € et 5 000 € pour un site vitrine basique est souvent impossible quand on démarre son activité d'artisan ou d'indépendant.
              </p>
            </div>

            <div className="bg-[#faf8f5] p-6 rounded-2xl border border-[#eee7da] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-black">
                2
              </div>
              <h3 className="text-base font-extrabold text-[#332420]">La peur de la technique & des bugs</h3>
              <p className="text-xs text-[#5e4d46] leading-relaxed">
                Vous avez peur de faire une mauvaise manipulation, de tout casser ou de vous perdre dans des tutoriels YouTube incomplets et périmés.
              </p>
            </div>

            <div className="bg-[#faf8f5] p-6 rounded-2xl border border-[#eee7da] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-black">
                3
              </div>
              <h3 className="text-base font-extrabold text-[#332420]">La dépendance totale envers un tiers</h3>
              <p className="text-xs text-[#5e4d46] leading-relaxed">
                Devoir repayer 80 € à chaque fois que vous souhaitez ajouter une photo ou modifier un texte de prestation vous exaspère.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CURRICULUM SECTION */}
      <section className="py-16 lg:py-24 bg-[#faf8f5]">
        <div className="max-w-4xl mx-auto px-4 space-y-12">
          
          <div className="text-center space-y-3">
            <span className="text-xs font-black text-[#18757d] uppercase tracking-wider bg-[#e6f4f3] px-3 py-1 rounded-full border border-[#18757d]/20">
              Programme Pédagogique Complet
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#332420]">
              Ce que vous allez accomplir, module par module
            </h2>
            <p className="text-sm text-[#5e4d46] max-w-xl mx-auto">
              Une formation structurée et progressive : vous regardez l'écran, vous reproduisez la même étape sur votre site.
            </p>
          </div>

          <div className="space-y-4">
            {modules.map((m, idx) => {
              const isOpen = openModule === idx;
              return (
                <div key={idx} className="bg-white rounded-2xl border border-[#eee7da] shadow-xs overflow-hidden transition-all">
                  <button
                    onClick={() => setOpenModule(isOpen ? null : idx)}
                    className="w-full p-5 sm:p-6 text-left flex items-center justify-between gap-4 cursor-pointer hover:bg-[#faf8f5] transition-colors"
                  >
                    <div className="flex items-center gap-4">
                      <span className="w-8 h-8 rounded-xl bg-[#18757d] text-white flex items-center justify-center font-extrabold text-xs shrink-0">
                        {idx + 1}
                      </span>
                      <div>
                        <h3 className="text-base font-extrabold text-[#332420]">{m.title}</h3>
                        <span className="text-xs text-slate-500 font-medium">{m.duration} • {m.lessons.length} cours vidéo</span>
                      </div>
                    </div>
                    {isOpen ? <ChevronUp className="w-5 h-5 text-[#18757d]" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                  </button>

                  {isOpen && (
                    <div className="px-6 pb-6 pt-2 border-t border-[#eee7da] bg-[#faf8f5]/50 space-y-2.5">
                      {m.lessons.map((lesson, lIdx) => (
                        <div key={lIdx} className="flex items-start gap-2.5 text-xs text-[#5e4d46] font-medium">
                          <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                          <span>{lesson}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* BONUS STACK SECTION */}
      <section className="py-16 bg-gradient-to-r from-[#18757d] to-[#11555b] text-white">
        <div className="max-w-5xl mx-auto px-4 space-y-10 text-center">
          <div className="space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-400 text-[#332420] uppercase tracking-wider">
              <Gift className="w-4 h-4" /> 2 Vidéos Bonus Incluses Gratuitement Aujourd'hui
            </span>
            <h2 className="text-2xl sm:text-4xl font-black">
              Tout ce dont vous avez besoin pour un lancement parfait
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-left">
            {bonuses.map((b, idx) => (
              <div key={idx} className="bg-white/10 backdrop-blur-md p-6 rounded-2xl border border-white/20 space-y-2">
                <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-400 text-[#332420] uppercase">
                  {b.value}
                </span>
                <h3 className="text-base font-extrabold text-white">{b.title}</h3>
                <p className="text-xs text-teal-100 leading-relaxed">{b.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* INSTRUCTOR BIO */}
      <section className="py-16 bg-white border-b border-[#eee7da]">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-[#faf8f5] p-8 sm:p-10 rounded-3xl border border-[#eee7da] flex flex-col md:flex-row items-center gap-8">
            <div className="relative w-36 h-36 rounded-2xl overflow-hidden shrink-0 shadow-lg border-2 border-[#18757d]">
              <Image
                src="/images/products/stephanie-coaching.webp"
                alt="Stéphanie Rocq - Fondatrice Guides Digitaux"
                fill
                className="object-cover"
              />
            </div>
            <div className="space-y-3 text-center md:text-left">
              <span className="text-xs font-black text-[#18757d] uppercase tracking-wider bg-[#e6f4f3] px-3 py-1 rounded-full border border-[#18757d]/20">
                Votre Formatrice
              </span>
              <h3 className="text-xl font-extrabold text-[#332420]">Stéphanie Rocq — Fondatrice de Stratec Digital & Guides Digitaux</h3>
              <p className="text-xs text-[#5e4d46] leading-relaxed">
                « Depuis plusieurs années, j'accompagne les artisans, créateurs et indépendants du Nord et de toute la France pour leur apprendre à maîtriser leur présence sur le web sans jargon complexe. Ma mission est de vous transmettre l'autonomie totale sur votre outil de travail digital. »
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* PRICING & OFFER BOX */}
      <section className="py-16 lg:py-24 bg-[#faf8f5]">
        <div className="max-w-3xl mx-auto px-4">
          <div className="bg-white rounded-3xl p-8 sm:p-12 border-2 border-[#18757d] shadow-2xl space-y-8 text-center relative overflow-hidden">
            
            <div className="absolute top-0 right-0 bg-amber-400 text-[#332420] text-xs font-black px-6 py-2 rounded-bl-2xl uppercase tracking-wider">
              Offre d'Accès Immédiat
            </div>

            <div className="space-y-3 pt-2">
              <span className="text-xs font-extrabold text-[#18757d] uppercase tracking-wider">
                Formation Vidéo Vitrine WordPress
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#332420]">
                Accès Illimité à Vie
              </h2>
              <p className="text-xs text-[#5e4d46]">
                Formez-vous à votre rythme avec les 5 modules vidéo HD et les 4 bonus inclus.
              </p>
            </div>

            <div className="py-4 bg-[#faf8f5] rounded-2xl border border-[#eee7da] inline-block px-8 mx-auto">
              <div className="flex items-baseline justify-center gap-3">
                <span className="text-4xl sm:text-5xl font-black text-[#18757d]">199 €</span>
                <span className="text-sm text-slate-400 font-semibold line-through">298 €</span>
              </div>
              <span className="text-[11px] font-extrabold text-emerald-700 block mt-1">
                Paiement unique — Aucun abonnement ni frais cachés
              </span>
            </div>

            {/* What's included checklist */}
            <div className="text-left space-y-3 max-w-md mx-auto pt-2">
              <div className="flex items-center gap-2.5 text-xs font-bold text-[#332420]">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Accès immédiat aux 5 modules vidéo HD pas-à-pas</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs font-bold text-[#332420]">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Les 4 bonus PDF & Templates offerts</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs font-bold text-[#332420]">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Accès illimité 24h/24 et 7j/7 à vie sur PC/Mobile</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs font-bold text-[#332420]">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Toutes les futures mises à jour des vidéos gratuites</span>
              </div>
            </div>

            <button
              onClick={handleCheckout}
              disabled={isLoading}
              className="w-full py-5 text-base font-black text-white bg-[#18757d] hover:bg-[#12595f] rounded-2xl shadow-xl uppercase tracking-wider transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-3 cursor-pointer"
            >
              {isLoading ? (
                <span>Redirection vers Stripe...</span>
              ) : (
                <>
                  <span>VALIDER MA COMMANDE & ACCÉDER AUX VIDÉOS (199 €)</span>
                  <ArrowRight className="w-5 h-5 text-amber-300" />
                </>
              )}
            </button>

            <div className="flex items-center justify-center gap-6 text-xs text-slate-500 font-semibold pt-2">
              <span className="flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-emerald-600" /> Cryptage Stripe 256-bit
              </span>
              <span className="flex items-center gap-1">
                <Award className="w-3.5 h-3.5 text-amber-500" /> Certificat Inclus
              </span>
            </div>

          </div>
        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-16 bg-white border-t border-[#eee7da]">
        <div className="max-w-3xl mx-auto px-4 space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-black text-[#332420]">Foire Aux Questions (FAQ)</h2>
            <p className="text-xs text-slate-500">Toutes les réponses à vos questions avant de rejoindre la formation.</p>
          </div>

          <div className="space-y-3">
            {faqs.map((f, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className="bg-[#faf8f5] rounded-2xl border border-[#eee7da] overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-4 sm:p-5 text-left flex items-center justify-between gap-4 font-extrabold text-sm text-[#332420] cursor-pointer"
                  >
                    <span>{f.q}</span>
                    {isOpen ? <ChevronUp className="w-4 h-4 text-[#18757d]" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                  </button>
                  {isOpen && (
                    <div className="px-5 pb-5 pt-1 text-xs text-[#5e4d46] leading-relaxed border-t border-[#eee7da]">
                      {f.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* STICKY MOBILE CTA */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#eee7da] p-3 shadow-2xl z-50">
        <button
          onClick={handleCheckout}
          disabled={isLoading}
          className="w-full py-3.5 px-4 text-xs font-black text-white bg-[#18757d] hover:bg-[#12595f] rounded-xl shadow-md uppercase tracking-wider flex items-center justify-between"
        >
          <span>ACCÉDER À LA FORMATION (199 €)</span>
          <ArrowRight className="w-4 h-4 text-amber-300" />
        </button>
      </div>

      <Footer />
    </div>
  );
}
