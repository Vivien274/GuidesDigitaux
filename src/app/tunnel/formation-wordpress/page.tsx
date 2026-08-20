'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import {
  CheckCircle2,
  Star,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  PlayCircle,
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
  Check,
  Globe,
  ThumbsUp,
  Quote
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
          courseId: 'formation-wordpress',
          courseTitle: 'Formation Vidéo : Créer sa vitrine en ligne avec WordPress',
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
      title: "Module 1 : Nom de domaine et hébergement web",
      lessons: [
        "Réserver votre nom de domaine professionnel (.fr / .com) et éviter les erreurs d'usurpation",
        "Choisir un hébergement web rapide et performant au meilleur tarif",
        "Installer WordPress en 1 clic et activer le certificat de sécurité SSL/HTTPS"
      ]
    },
    {
      title: "Module 2 : Prise en main et configuration de WordPress",
      lessons: [
        "Découvrir le tableau de bord WordPress et le paramétrer sereinement sans stress",
        "Configurer les permaliens SEO pour plaire immédiatement aux moteurs de recherche",
        "Choisir, installer et personnaliser votre thème graphique professionnel"
      ]
    },
    {
      title: "Module 3 : Conception de pages avec Elementor",
      lessons: [
        "Maîtriser le constructeur de page visuel Elementor en glisser-déposer (zéro ligne de code)",
        "Créer une Page d'Accueil captivante qui donne envie de travailler avec vous",
        "Construire la page 'Prestations / Services', la page 'À propos' authentique et la page 'Contact'"
      ]
    },
    {
      title: "Module 4 : Optimisation mobile (Responsive)",
      lessons: [
        "Adapter précisément votre mise en page sur smartphones iOS, Android et tablettes",
        "Positionner des boutons d'action cliquables au pouce pour maximiser les appels et devis",
        "Appliquer les règles d'ergonomie mobile et alléger l'affichage"
      ]
    },
    {
      title: "Module 5 : Référencement naturel (SEO local) & Sécurité",
      lessons: [
        "Rédiger et optimiser vos balises Meta Title & Description pour votre ville et région",
        "Securiser votre site avec un plugin anti-piratage et bloquer 99,9 % des spambots",
        "Lier votre site à Google Maps / Google Search Console et publier officiellement"
      ]
    }
  ];

  const bonuses = [
    {
      title: "Vidéo Bonus 1 : Créer son adresse e-mail pro gratuite",
      value: "Offert",
      desc: "Le tutoriel pas-à-pas pour configurer votre adresse professionnelle (ex: contact@votreentreprise.fr) sans abonnement mensuel."
    },
    {
      title: "Vidéo Bonus 2 : Optimiser ses photos & vidéos pour son site",
      value: "Offert",
      desc: "La méthode concrète pour diviser le poids de vos visuels par 10 sans aucune perte de qualité et accélérer votre site sur mobile."
    }
  ];

  const realReviews = [
    {
      author: "Julien M.",
      role: "Artisan Ébéniste (Métropole Lilloise)",
      source: "Avis Google 5★",
      date: "Février 2026",
      text: "« Un accompagnement au top ! Stéphanie rend le digital ultra-simple. Grâce aux vidéos pas-à-pas, j'ai pu créer le site vitrine de mon atelier sans toucher au moindre code. Les clients me trouvent enfin sur Google Maps ! »"
    },
    {
      author: "Camille D.",
      role: "Créatrice Céramiste & Déco",
      source: "Avis Facebook 5★",
      date: "Janvier 2026",
      text: "« J'avais très peur de m'y perdre ou de tout bloquer sur WordPress. Le ton de Stéphanie est bienveillant, clair et sans blabla. On suit la vidéo, on clique au même endroit, et le site est en ligne. Merci Stratec Digital ! »"
    },
    {
      author: "Marc L.",
      role: "Prestataire Indépendant & Consultant",
      source: "Avis Google 5★",
      date: "Mars 2026",
      text: "« Rien à voir avec les formations théoriques indigestes qu'on trouve sur le net. Ici chaque vidéo répond à un besoin précis. Pouvoir visionner les cours indépendamment selon son avancement est un vrai plus ! »"
    }
  ];

  const faqs = [
    {
      q: "Est-ce que je dois savoir coder ou m'y connaître en informatique ?",
      a: "Absolument pas ! Cette formation est 100% conçue pour les débutants complets. Tout se fait en glisser-déposer sur votre écran avec Elementor et WordPress, sans toucher à la moindre ligne de code."
    },
    {
      q: "Est-ce que les vidéos doivent être suivies dans l'ordre ?",
      a: "Toutes les vidéos ont été spécialement conçues pour pouvoir être visionnées de manière 100% indépendante les unes des autres, selon vos besoins du moment, tout en suivant une trame pédagogique logique et fluide."
    },
    {
      q: "Combien de temps ai-je accès à la formation ?",
      a: "Votre accès est illimité 24h/24 et 7j/7 à vie ! Vous pouvez suivre les modules à votre propre rythme, y revenir dès que vous souhaitez faire une mise à jour et profiter gratuitement des futurs contenus."
    },
    {
      q: "Quel est le budget à prévoir à côté de la formation ?",
      a: "Uniquement votre nom de domaine et votre hébergement web (environ 5 € à 7 € par mois chez un hébergeur comme O2Switch ou OVH). Tout le reste (WordPress, Elementor) est gratuit !"
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
          <span>⚡ Formation Vidéo WordPress Complète — 2 Vidéos Bonus Incluses Gratuitement !</span>
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
                La méthode pas-à-pas enregistrée en vidéo HD pour construire votre propre site internet sur-mesure, attirer des clients dans votre région et devenir 100% autonome.
              </p>

              {/* Highlight Note */}
              <div className="p-3.5 bg-[#e6f4f3]/70 rounded-2xl border border-[#18757d]/20 text-xs text-[#18757d] font-bold flex items-center gap-2.5">
                <Zap className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Format modulable : visionnez chaque vidéo indépendamment selon vos besoins, tout en suivant une trame claire.</span>
              </div>

              {/* Bullet Highlights */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1 text-left max-w-xl mx-auto lg:mx-0">
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
                    🎓 Cours Vidéo HD Pas-à-Pas
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
                    <span className="text-xs font-black text-[#18757d]">Avis Google & Facebook 5.0 / 5</span>
                  </div>
                  <p className="text-xs text-[#5e4d46] italic leading-relaxed">
                    « Stéphanie explique chaque clic avec une clarté remarquable. J'ai pu lancer le site de mon atelier d'ébénisterie en toute autonomie ! »
                  </p>
                  <span className="text-[11px] font-extrabold text-[#332420] block">— Julien M., Artisan ébéniste</span>
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
                Vous avez peur de faire une mauvaise manipulation, de tout casser ou de vous perdre dans des tutoriels incomplets et compliqués.
              </p>
            </div>

            <div className="bg-[#faf8f5] p-6 rounded-2xl border border-[#eee7da] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-black">
                3
              </div>
              <h3 className="text-base font-extrabold text-[#332420]">La dépendance envers un tiers</h3>
              <p className="text-xs text-[#5e4d46] leading-relaxed">
                Devoir payer à chaque fois que vous souhaitez ajouter une réalisation ou modifier un texte vous empêche de garder la main sur votre image.
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
              Programme Pédagogique Officiel
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#332420]">
              Le cursus complet pour bâtir votre site vitrine
            </h2>
            <p className="text-sm text-[#5e4d46] max-w-2xl mx-auto leading-relaxed">
              Toutes les vidéos ont été conçues pour que vous puissiez les visionner de manière <strong>100% indépendante</strong> les unes des autres, selon vos besoins du moment, tout en suivant une trame claire pour construire votre site de A à Z.
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
                        <span className="text-xs text-[#18757d] font-bold">Vidéos accessibles indépendamment • Trame progressive</span>
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

      {/* REAL REVIEWS & SOCIAL PROOF SECTION */}
      <section className="py-16 bg-white border-y border-[#eee7da]">
        <div className="max-w-5xl mx-auto px-4 space-y-10 text-center">
          
          <div className="space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-900 border border-amber-300 uppercase tracking-wider">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" /> Vos avis vérifiés Google & Facebook
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#332420]">
              Ce que disent les artisans et créateurs qui nous font confiance
            </h2>
            <p className="text-xs sm:text-sm text-[#5e4d46] max-w-xl mx-auto">
              Découvrez les retours d'expérience réels de nos membres accompagnés par Stéphanie Rocq (Stratec Digital & Guides Digitaux).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {realReviews.map((rev, idx) => (
              <div key={idx} className="bg-[#faf8f5] p-6 rounded-2xl border border-[#eee7da] shadow-sm flex flex-col justify-between space-y-4">
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="text-[10px] font-extrabold bg-[#e6f4f3] text-[#18757d] px-2.5 py-0.5 rounded-full">
                      {rev.source}
                    </span>
                  </div>
                  <p className="text-xs text-[#5e4d46] leading-relaxed italic">
                    {rev.text}
                  </p>
                </div>
                <div className="border-t border-[#eee7da] pt-3">
                  <span className="text-xs font-extrabold text-[#332420] block">{rev.author}</span>
                  <span className="text-[11px] text-slate-500 block">{rev.role}</span>
                </div>
              </div>
            ))}
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

      {/* AUTHENTIC STORYTELLING BIO */}
      <section className="py-16 bg-white border-b border-[#eee7da]">
        <div className="max-w-4xl mx-auto px-4">
          <div className="bg-[#faf8f5] p-8 sm:p-12 rounded-3xl border border-[#eee7da] space-y-6">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="relative w-40 h-40 rounded-full overflow-hidden shrink-0 shadow-xl border-4 border-[#18757d]">
                <Image
                  src="/images/stephanie_v2.png"
                  alt="Stéphanie ROCQ - Fondatrice Stratec Digital & Guides Digitaux"
                  fill
                  className="object-cover object-[center_65%]"
                />
              </div>
              <div className="space-y-3 text-center md:text-left">
                <div className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-[#e6f4f3] text-[#18757d]">
                  Fondatrice & Consultante Digitalisation
                </div>
                <h3 className="text-2xl font-black text-[#332420]">Stéphanie ROCQ</h3>
                <p className="text-xs font-extrabold text-[#18757d]">
                  Fondatrice de <a href="https://stratec-digital.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-[#12595f]">Stratec Digital</a> & Guides-Digitaux.com
                </p>
                <div className="flex items-center justify-center md:justify-start gap-3 pt-1">
                  <a href="https://stratec-digital.com" target="_blank" rel="noopener noreferrer" className="text-xs text-[#18757d] font-bold flex items-center gap-1 hover:underline">
                    <Globe className="w-3.5 h-3.5" /> stratec-digital.com
                  </a>
                  <span className="text-slate-300">•</span>
                  <a href="https://www.instagram.com/guidesdigitaux/" target="_blank" rel="noopener noreferrer" className="text-xs text-[#18757d] font-bold flex items-center gap-1 hover:underline">
                    <span>📸 @guidesdigitaux</span>
                  </a>
                </div>
              </div>
            </div>

            <div className="text-xs sm:text-sm text-[#5e4d46] leading-relaxed space-y-3 border-t border-[#eee7da] pt-6">
              <p>
                « À travers mon entreprise <strong>Stratec Digital</strong> et la plateforme <strong>Guides Digitaux</strong>, j’accompagne les artisans, créateurs et indépendants qui veulent mieux comprendre le digital pour en tirer un vrai bénéfice — pas juste “faire comme tout le monde”.
              </p>
              <p>
                Mon approche est simple : <strong>aucun jargon technique incompréhensible, un ton bienveillant, très concret et un brin décalé 😊</strong>. Chaque vidéo a été tournée pour vous transmettre l'autonomie totale sur votre site, sans vous prendre la tête ! »
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
                Formation Vidéo : Créer sa vitrine en ligne avec WordPress
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-[#332420]">
                Accès Illimité à Vie
              </h2>
              <p className="text-xs text-[#5e4d46]">
                Formez-vous à votre rythme avec les 5 modules vidéo officiels et les 2 vidéos bonus offertes.
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
                <span>Accès immédiat aux 5 modules vidéo officiels</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs font-bold text-[#332420]">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Les 2 vidéos bonus offertes (Email pro & Optimisation médias)</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs font-bold text-[#332420]">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Format visionnage 100% indépendant selon vos besoins</span>
              </div>
              <div className="flex items-center gap-2.5 text-xs font-bold text-[#332420]">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Accès illimité 24h/24 et 7j/7 à vie avec mises à jour offertes</span>
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
          className="w-full py-3.5 px-4 text-xs font-black text-white bg-[#18757d] hover:bg-[#12595f] rounded-xl shadow-md uppercase tracking-wider flex items-center justify-between cursor-pointer"
        >
          <span>ACCÉDER À LA FORMATION (199 €)</span>
          <ArrowRight className="w-4 h-4 text-amber-300" />
        </button>
      </div>

      {/* MINIMAL TUNNEL FOOTER */}
      <footer className="py-8 bg-[#332420] text-teal-100/70 text-xs text-center border-t border-[#4a3630]">
        <div className="max-w-4xl mx-auto px-4 space-y-2">
          <p>© {new Date().getFullYear()} Guides Digitaux — Tous droits réservés.</p>
          <div className="flex items-center justify-center gap-4 text-[11px]">
            <Link href="/mentions-legales" className="hover:text-white transition-colors">Mentions Légales</Link>
            <span>•</span>
            <Link href="/cgv" className="hover:text-white transition-colors">CGV</Link>
            <span>•</span>
            <Link href="/contact" className="hover:text-white transition-colors">Contact</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
