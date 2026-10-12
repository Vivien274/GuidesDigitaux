'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import NewsletterOptIn from '@/components/NewsletterOptIn';
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
  Gift,
  HelpCircle,
  Check,
  Globe,
  ThumbsUp,
  GraduationCap,
  RefreshCw,
  HeartHandshake,
  FileCheck2,
  FileText,
  HelpCircle as QuizIcon,
  CreditCard,
  CalendarCheck,
  MessageSquare,
  Loader2
} from 'lucide-react';

function ApplePayLogo({ className = "h-[26px] w-auto" }: { className?: string }) {
  return (
    <img
      src="/images/apple-pay.svg"
      alt="Apple Pay"
      className={`${className} object-contain pointer-events-none select-none`}
      style={{ height: '26px', width: 'auto', maxHeight: '26px' }}
    />
  );
}

function GooglePayLogo({ className = "h-[26px] w-auto" }: { className?: string }) {
  return (
    <img
      src="/images/google-pay.svg"
      alt="Google Pay"
      className={`${className} object-contain pointer-events-none select-none`}
      style={{ height: '26px', width: 'auto', maxHeight: '26px' }}
    />
  );
}

export default function TunnelFormationWordpressPage() {
  const router = useRouter();
  const [openModule, setOpenModule] = useState<number | null>(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isHighlighted, setIsHighlighted] = useState(false);
  const [loadingAction, setLoadingAction] = useState<string | null>(null);
  const [paymentOption, setPaymentOption] = useState<'1x' | '3x'>('1x');
  const [newsletterOptIn, setNewsletterOptIn] = useState(true);
  
  // Coordonnées de paiement direct
  const [emailInput, setEmailInput] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [expressProvider, setExpressProvider] = useState<'apple_pay' | 'google_pay' | null>(null);

  const scrollToCommande = (forcedOption?: '1x' | '3x') => {
    if (forcedOption) {
      setPaymentOption(forcedOption);
    } else {
      setPaymentOption('1x');
    }
    const el = document.getElementById('commande');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setIsHighlighted(true);
      setTimeout(() => setIsHighlighted(false), 2500);
    }
  };

  const handleDirectPayment = async () => {
    if (!emailInput.trim() || !emailInput.includes('@')) {
      alert('Renseigne une adresse e-mail valide pour recevoir tes accès à la formation.');
      document.getElementById('checkout-email')?.focus();
      return;
    }

    setIsLoading(true);
    const effectivePrice = paymentOption === '3x' ? 75 : 199;

    try {
      // Inscription Mailchimp si renseigné
      try {
        const directTags = ['formation-wordpress', 'client'];
        if (newsletterOptIn) directTags.push('newsletter');
        if (paymentOption === '3x') directTags.push('paiement-3x');
        fetch('/api/mailchimp/subscribe', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: emailInput.trim(),
            tag: 'formation-wordpress',
            tags: directTags
          })
        }).catch(err => console.warn('Notice Mailchimp:', err));
      } catch (e) {}

      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId: 'formation-wordpress',
          productId: 'formation-wordpress',
          courseTitle: paymentOption === '3x'
            ? 'Formation Vidéo : Vitrine WordPress (Option 3x sans frais)'
            : 'Formation Vidéo : Créer sa vitrine en ligne avec WordPress',
          title: paymentOption === '3x'
            ? 'Formation Vidéo : Vitrine WordPress (Option 3x sans frais)'
            : 'Formation Vidéo : Créer sa vitrine en ligne avec WordPress',
          price: effectivePrice,
          paymentOption,
          newsletterOptIn,
          customerEmail: emailInput.trim(),
          cancelUrl: '/tunnel/formation-wordpress',
          successUrl: `/tunnel/upsell?session_id={CHECKOUT_SESSION_ID}&productId=formation-wordpress&email=${encodeURIComponent(emailInput.trim())}&price=${effectivePrice}&option=${paymentOption}`
        })
      });

      const data = await res.json();
      if (data?.url) {
        window.location.href = data.url;
      } else {
        alert('Une erreur est survenue lors de l\'initialisation du paiement Stripe.');
        setIsLoading(false);
      }
    } catch (e) {
      console.error('Direct checkout error', e);
      alert('Une erreur est survenue lors de la validation du paiement.');
      setIsLoading(false);
    }
  };

  const handleExpressPayment = async (provider: 'apple_pay' | 'google_pay') => {
    setExpressProvider(provider);
    setIsLoading(true);
    const effectivePrice = paymentOption === '3x' ? 75 : 199;
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId: 'formation-wordpress',
          productId: 'formation-wordpress',
          courseTitle: paymentOption === '3x'
            ? 'Formation Vidéo : Vitrine WordPress (Option 3x sans frais)'
            : 'Formation Vidéo : Créer sa vitrine en ligne avec WordPress',
          title: paymentOption === '3x'
            ? 'Formation Vidéo : Vitrine WordPress (Option 3x sans frais)'
            : 'Formation Vidéo : Créer sa vitrine en ligne avec WordPress',
          price: effectivePrice,
          paymentOption,
          newsletterOptIn,
          customerEmail: emailInput.trim() || undefined,
          cancelUrl: '/tunnel/formation-wordpress',
          successUrl: `/tunnel/upsell?session_id={CHECKOUT_SESSION_ID}&productId=formation-wordpress&price=${effectivePrice}&option=${paymentOption}${emailInput.trim() ? `&email=${encodeURIComponent(emailInput.trim())}` : ''}`
        })
      });

      const data = await res.json();
      if (data?.url) {
        window.location.href = data.url;
      } else {
        alert('Une erreur est survenue lors de l\'initialisation du paiement express.');
        setIsLoading(false);
        setExpressProvider(null);
      }
    } catch (e) {
      console.error('Erreur Stripe express checkout:', e);
      alert('Impossible de contacter le serveur de paiement sécurisé.');
      setIsLoading(false);
      setExpressProvider(null);
    }
  };

  const handleCheckout = async (forcedOption?: '1x' | '3x', actionId: string = 'order') => {
    const opt = forcedOption || paymentOption;
    setIsLoading(true);
    setLoadingAction(actionId);
    const effectivePrice = opt === '3x' ? 75 : 199;
    try {
      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId: 'formation-wordpress',
          courseTitle: opt === '3x' ? 'Formation Vidéo : Vitrine WordPress (Option 3x sans frais)' : 'Formation Vidéo : Créer sa vitrine en ligne avec WordPress',
          productId: 'formation-wordpress',
          title: opt === '3x' ? 'Formation Vidéo : Vitrine WordPress (Option 3x sans frais)' : 'Formation Vidéo : Créer sa vitrine en ligne avec WordPress',
          price: effectivePrice,
          paymentOption: opt,
          newsletterOptIn,
          customerEmail: emailInput.trim() || undefined,
          cancelUrl: '/tunnel/formation-wordpress',
          successUrl: `/tunnel/upsell?session_id={CHECKOUT_SESSION_ID}&productId=formation-wordpress&price=${effectivePrice}&option=${opt}${emailInput.trim() ? `&email=${encodeURIComponent(emailInput.trim())}` : ''}`
        })
      });

      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert('Une erreur est survenue lors de l\'initialisation de la commande.');
        setIsLoading(false);
        setLoadingAction(null);
      }
    } catch (e) {
      console.error('Checkout error', e);
      alert('Impossible de contacter le serveur de paiement.');
      setIsLoading(false);
      setLoadingAction(null);
    }
  };

  const modules = [
    {
      title: "Module 1 : Préparer son projet",
      lessons: [
        "Bienvenue dans l’aventure ! (Présentation rapide de ce qu’on va faire ensemble)",
        "Trouver le bon nom pour son site (Comment choisir un nom de domaine efficace : idées, extensions, erreurs à éviter)",
        "Acheter son nom de domaine et son hébergement (Démonstration concrète chez OVH, O2Switch, Ionos…)",
        "Créer une adresse email pro"
      ]
    },
    {
      title: "Module 2 : Installation de WordPress",
      lessons: [
        "Installer WordPress en 5 minutes (Auto-installateur et installation manuelle expliquée simplement)",
        "Première connexion et réglages essentiels (Découverte du tableau de bord + titre du site, slogan, langue, fuseau horaire)"
      ]
    },
    {
      title: "Module 3 : Sécuriser et mettre en place la base",
      lessons: [
        "Sécuriser son site dès le départ (Mot de passe, suppression contenus par défaut, premier plugin de sécurité)",
        "Installer un thème adapté à son projet (Où trouver un thème, comment l’installer, première personnalisation)",
        "Les plugins indispensables (Sécurité, sauvegardes, SEO, formulaire de contact, optimisation)"
      ]
    },
    {
      title: "Module 4 : Créer et organiser son contenu",
      lessons: [
        "Créer ses premières pages (Accueil, À propos, Services/Produits, Contact)",
        "Créer son premier article de blog (Différence page/article + mise en page de base)",
        "Construire son menu de navigation (Ajouter ses pages, créer des sous-menus)",
        "Configurer la page d’accueil (Page statique vs derniers articles + réglages simples)"
      ]
    },
    {
      title: "Module 5 : Réglages avancés",
      lessons: [
        "Améliorer l’expérience utilisateur (Personnaliser couleurs, polices, logo, favicon)",
        "Paramétrer les URL et le HTTPS (Permaliens propres + activation du certificat SSL)",
        "Sauvegardes automatiques et anti-spam (Mettre son site en mode « tranquille mais efficace »)"
      ]
    },
    {
      title: "Module 6 : Mise en ligne et suivi",
      lessons: [
        "Tester son site avant le grand lancement (Mobile, tablette, formulaires)",
        "Se faire remarquer par Google (Google Search Console, Analytics, bases du SEO)",
        "Félicitations : ton site est en ligne ! 🎉 (Checklist finale + bonnes pratiques pour la suite)"
      ]
    }
  ];

  const bonuses = [
    {
      title: "Vidéo Bonus 1 : Créer son adresse e-mail pro gratuite",
      value: "Offert",
      desc: "Le tutoriel pas-à-pas pour configurer ton adresse professionnelle (ex: contact@tonatelier.fr) sans abonnement mensuel."
    },
    {
      title: "Vidéo Bonus 2 : Optimiser ses photos & vidéos pour son site",
      value: "Offert",
      desc: "La méthode concrète pour diviser le poids de tes visuels par 10 sans aucune perte de qualité et accélérer ton site sur mobile."
    }
  ];

  const realReviews = [
    {
      author: "Cyntia",
      role: "Fondatrice • Cyaness Savonnerie Artisanale",
      source: "Avis vérifié Google 5★",
      text: "« Le nouveau site cyaness.com met enfin en valeur mes savons artisanaux avec une élégance et une clarté incroyables. La boutique est fluide, le parcours client est parfait et mes clients adorent ! Stéphanie a su rendre tout le processus simple, humain et rassurant. »"
    },
    {
      author: "Camille",
      role: "Artisane Pâtissière • Studio Macarons",
      source: "Avis vérifié Google 5★",
      text: "« Grâce à Stéphanie, mes ateliers de pâtisserie se réservent et se paient directement en ligne sans aucun stress de gestion ! Elle a su lever toutes mes appréhensions techniques avec une vraie pédagogie et toujours la bonne humeur. »"
    },
    {
      author: "Edwige",
      role: "Présidente d'association • 1m2 : ma santé !",
      source: "Recommandation Facebook 5★",
      text: "« Le site 1m2-masante.fr reflète exactement l'esprit et la chaleur de notre association. Stéphanie m'a formée pas à pas et je gère mon site en toute sérénité sans jamais me sentir bloquée. Un vrai GPS du web ! »"
    }
  ];

  const engagements = [
    {
      title: "Pédagogie 100% Concrète & Pas-à-Pas",
      desc: "Chaque étape est filmée directement sur écran. Pas de théorie abstraite : tu regardes la vidéo et tu reproduis exactement la même action sur ton site."
    },
    {
      title: "Accès Illimité à Vie & Évolutif",
      desc: "Ton accès reste valable sans limite de temps. Tu peux revenir visionner n'importe quel cours quand tu en as besoin et profiter de toutes les futures mises à jour."
    },
    {
      title: "Accompagnement Adapté aux Artisans",
      desc: "Un langage clair, sans blabla ni jargon technique complexe, conçu pour préserver ton temps et garantir ton autonomie absolue."
    }
  ];

  const faqs = [
    {
      q: "Est-ce que je dois savoir coder ou m'y connaître en informatique ?",
      a: "Absolument pas ! Cette formation est 100% conçue pour les débutants complets. Tout se fait en glisser-déposer sur ton écran avec Elementor et WordPress, sans toucher à la moindre ligne de code."
    },
    {
      q: "Comment fonctionne le paiement en 3x sans frais Klarna ?",
      a: "En choisissant le paiement 3x Klarna (3x 75 € = 225 € au total), tu règles 75 € aujourd'hui via Stripe/Klarna, puis les 2 mensualités suivantes de 75 € sont prélevées automatiquement à 30 et 60 jours sans aucun frais caché."
    },
    {
      q: "Est-ce que les vidéos doivent être suivies dans l'ordre ?",
      a: "Toutes les vidéos ont été spécialement conçues pour pouvoir être visionnées de manière 100% indépendante les unes des autres, selon tes besoins du moment, tout en suivant une trame pédagogique logique et fluide."
    },
    {
      q: "Combien de temps ai-je accès à la formation ?",
      a: "Ton accès est illimité 24h/24 et 7j/7 à vie ! Tu peux suivre les modules à ton propre rythme, y revenir dès que tu souhaites faire une mise à jour et profiter gratuitement des futurs contenus."
    },
    {
      q: "Quel est le budget à prévoir à côté de la formation ?",
      a: "Uniquement ton nom de domaine et ton hébergement web (environ 5 € à 7 € par mois chez un hébergeur comme O2Switch ou OVH). Tout le reste (WordPress, Elementor) est gratuit !"
    }
  ];

  const ctaPriceLabel = paymentOption === '1x' ? '199 €' : '3X 75 € (225 €)';

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#332420] font-sans selection:bg-[#18757d] selection:text-white pb-24 lg:pb-0">
      <Header />

      {/* TOP ANNOUNCEMENT BANNER */}
      <div className="bg-gradient-to-r from-[#18757d] to-[#12595f] text-white py-3 px-4 text-center text-xs font-bold shadow-sm">
        <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 flex-wrap">
          <span className="bg-amber-400 text-[#332420] text-[10px] uppercase tracking-wider font-extrabold px-2.5 py-0.5 rounded-full">
            ACCÈS IMMÉDIAT
          </span>
          <span>⚡ Formation Vidéo WordPress Complète — Paiement 1x (199 €) ou 3x (3x 75 € Klarna) Disponible !</span>
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
                La méthode pas-à-pas enregistrée en vidéo HD pour construire ton propre site internet sur-mesure, attirer des clients dans ta région et devenir 100% autonome.
              </p>

              {/* Highlight Note */}
              <div className="p-3.5 bg-[#e6f4f3]/70 rounded-2xl border border-[#18757d]/20 text-xs text-[#18757d] font-bold flex items-center gap-2.5">
                <Zap className="w-4 h-4 text-amber-500 shrink-0" />
                <span>Format modulable (6 Modules) : visionne chaque vidéo indépendamment selon tes besoins, avec checklists, workbooks & quizz inclus.</span>
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
                  <FileCheck2 className="w-4 h-4 text-[#18757d] shrink-0" />
                  Checklists & Workbooks téléchargeables
                </div>
                <div className="flex items-center gap-2.5 text-xs font-extrabold text-[#332420] bg-white p-3 rounded-2xl border border-[#eee7da] shadow-2xs">
                  <QuizIcon className="w-4 h-4 text-amber-500 shrink-0" />
                  Paiement 1x (199 €) ou 3x (3x 75 € Klarna)
                </div>
              </div>

              {/* HERO CTA BUTTONS */}
              <div className="pt-4 space-y-3">
                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <button
                    onClick={() => scrollToCommande('1x')}
                    className="w-full sm:w-auto px-7 py-4 text-sm font-black text-white bg-[#18757d] hover:bg-[#12595f] rounded-2xl shadow-xl hover:shadow-2xl uppercase tracking-wider transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>REJOINDRE EN 1X (199 €)</span>
                    <ArrowRight className="w-4 h-4 text-amber-300" />
                  </button>

                  <button
                    onClick={() => scrollToCommande('3x')}
                    className="w-full sm:w-auto px-7 py-4 text-sm font-black text-[#332420] bg-amber-400 hover:bg-amber-300 rounded-2xl shadow-xl hover:shadow-2xl uppercase tracking-wider transition-all transform hover:-translate-y-0.5 flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <span>PAYER EN 3X (3X 75 €)</span>
                    <ArrowRight className="w-4 h-4 text-[#332420]" />
                  </button>
                </div>

                <div className="flex items-center justify-center lg:justify-start gap-4 text-xs font-semibold text-[#5e4d46]">
                  <span className="flex items-center gap-1">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" /> Paiement 100% Sécurisé
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
                    🎓 6 Modules + Workbooks & Quizz
                  </span>
                </div>

                {/* Real Review Hero Widget */}
                <div className="p-4 bg-[#faf8f5] rounded-2xl border border-[#eee7da] space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-1 text-amber-500">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                    <span className="text-[10px] font-extrabold bg-[#e6f4f3] text-[#18757d] px-2.5 py-0.5 rounded-full">
                      Avis vérifié Google 5.0 / 5
                    </span>
                  </div>
                  <p className="text-xs text-[#5e4d46] italic leading-relaxed font-medium">
                    « Stéphanie a su rendre tout le processus simple, humain et rassurant. La boutique est fluide et mes clients adorent ! »
                  </p>
                  <span className="text-[11px] font-extrabold text-[#332420] block">— Cyntia, Cyaness Savonnerie Artisanale</span>
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
              Est-ce que tu te reconnais dans cette situation ?
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
                Tu as peur de faire une mauvaise manipulation, de tout casser ou de te perdre dans des tutoriels incomplets et compliqués.
              </p>
            </div>

            <div className="bg-[#faf8f5] p-6 rounded-2xl border border-[#eee7da] space-y-3">
              <div className="w-10 h-10 rounded-xl bg-rose-100 text-rose-700 flex items-center justify-center font-black">
                3
              </div>
              <h3 className="text-base font-extrabold text-[#332420]">La dépendance envers un tiers</h3>
              <p className="text-xs text-[#5e4d46] leading-relaxed">
                Devoir payer à chaque fois que tu souhaites ajouter une réalisation ou modifier un texte t'empêche de garder la main sur ton image.
              </p>
            </div>
          </div>

          {/* CTA BUTTON 2 */}
          <div className="pt-4">
            <button
              onClick={() => scrollToCommande()}
              className="px-8 py-4 text-xs sm:text-sm font-black text-white bg-[#18757d] hover:bg-[#12595f] rounded-2xl shadow-lg uppercase tracking-wider transition-all transform hover:-translate-y-0.5 inline-flex items-center gap-3 cursor-pointer"
            >
              <span>JE VEUX CRÉER MON SITE SANS STRESS ({ctaPriceLabel})</span>
              <ArrowRight className="w-4 h-4 text-amber-300" />
            </button>
          </div>

        </div>
      </section>

      {/* CURRICULUM SECTION */}
      <section className="py-16 lg:py-24 bg-[#faf8f5]">
        <div className="max-w-4xl mx-auto px-4 space-y-12">
          
          <div className="text-center space-y-3">
            <span className="text-xs font-black text-[#18757d] uppercase tracking-wider bg-[#e6f4f3] px-3 py-1 rounded-full border border-[#18757d]/20">
              Programme Pédagogique Officiel (6 Modules)
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#332420]">
              Le cursus complet pour bâtir ton site vitrine
            </h2>
            <p className="text-sm text-[#5e4d46] max-w-2xl mx-auto leading-relaxed">
              Toutes les vidéos ont été conçues pour que tu puisses les visionner de manière <strong>100% indépendante</strong> les unes des autres, avec des <strong>checklists, workbooks pratiques et quizz</strong> à chaque étape.
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
                        <span className="text-xs text-[#18757d] font-bold">Vidéos indépendantes • Workbooks, Checklists & Quizz inclus</span>
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

          {/* CTA BUTTON 3 */}
          <div className="text-center pt-4">
            <button
              onClick={() => scrollToCommande()}
              className="px-8 py-4 text-xs sm:text-sm font-black text-white bg-[#18757d] hover:bg-[#12595f] rounded-2xl shadow-lg uppercase tracking-wider transition-all transform hover:-translate-y-0.5 inline-flex items-center gap-3 cursor-pointer"
            >
              <span>ACCÉDER AUX 6 MODULES VIDÉO ({ctaPriceLabel})</span>
              <ArrowRight className="w-4 h-4 text-amber-300" />
            </button>
          </div>

        </div>
      </section>

      {/* ENGAGEMENTS & PILLARS SECTION */}
      <section className="py-16 bg-white border-y border-[#eee7da]">
        <div className="max-w-5xl mx-auto px-4 space-y-10 text-center">
          
          <div className="space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-[#e6f4f3] text-[#18757d] uppercase tracking-wider">
              <Award className="w-4 h-4" /> Les 3 Engagements Qualité Guides Digitaux
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#332420]">
              Une méthode éprouvée pour la réussite de ton projet
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {engagements.map((eng, idx) => (
              <div key={idx} className="bg-[#faf8f5] p-6 rounded-2xl border border-[#eee7da] shadow-xs space-y-3">
                <div className="w-10 h-10 rounded-xl bg-[#18757d] text-white flex items-center justify-center font-extrabold text-sm">
                  {idx + 1}
                </div>
                <h3 className="text-base font-extrabold text-[#332420]">{eng.title}</h3>
                <p className="text-xs text-[#5e4d46] leading-relaxed">{eng.desc}</p>
              </div>
            ))}
          </div>

          {/* CTA BUTTON 4 */}
          <div className="pt-4">
            <button
              onClick={() => scrollToCommande()}
              className="px-8 py-4 text-xs sm:text-sm font-black text-white bg-[#18757d] hover:bg-[#12595f] rounded-2xl shadow-lg uppercase tracking-wider transition-all transform hover:-translate-y-0.5 inline-flex items-center gap-3 cursor-pointer"
            >
              <span>REJOINDRE LA FORMATION ÉVOLUTIVE ({ctaPriceLabel})</span>
              <ArrowRight className="w-4 h-4 text-amber-300" />
            </button>
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
              Tout ce dont tu as besoin pour un lancement parfait
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

          {/* CTA BUTTON 5 */}
          <div className="pt-4">
            <button
              onClick={() => scrollToCommande()}
              className="px-9 py-5 text-sm sm:text-base font-black text-[#332420] bg-amber-400 hover:bg-amber-300 rounded-2xl shadow-xl uppercase tracking-wider transition-all transform hover:-translate-y-0.5 inline-flex items-center gap-3 cursor-pointer"
            >
              <span>OBTENIR LA FORMATION + LES 2 VIDÉOS BONUS ({ctaPriceLabel})</span>
              <ArrowRight className="w-5 h-5 text-[#332420]" />
            </button>
          </div>
        </div>
      </section>

      {/* REAL REVIEWS & SOCIAL PROOF SECTION */}
      <section className="py-16 bg-white border-y border-[#eee7da]">
        <div className="max-w-5xl mx-auto px-4 space-y-10 text-center">
          
          <div className="space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-100 text-amber-900 border border-amber-300 uppercase tracking-wider">
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" /> Les Avis Clients Vérifiés
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#332420]">
              Ce que disent les artisans et créateurs qui nous font confiance
            </h2>
            <p className="text-xs sm:text-sm text-[#5e4d46] max-w-xl mx-auto">
              Découvrez les retours d'expérience réels de nos membres accompagnés par Stéphanie ROCQ (Guides Digitaux).
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
            {realReviews.slice(0, 3).map((rev, idx) => (
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
                  <p className="text-xs text-[#5e4d46] leading-relaxed italic font-medium">
                    {rev.text}
                  </p>
                </div>
                <div className="border-t border-[#eee7da] pt-3">
                  <span className="text-xs font-extrabold text-[#332420] block">{rev.author}</span>
                  <span className="text-[11px] text-[#18757d] font-bold block">{rev.role}</span>
                </div>
              </div>
            ))}
          </div>

          {/* REVIEWS CTA BUTTON */}
          <div className="pt-2">
            <button
              onClick={() => scrollToCommande()}
              className="px-8 py-4 text-xs sm:text-sm font-black text-white bg-[#18757d] hover:bg-[#12595f] rounded-2xl shadow-lg uppercase tracking-wider transition-all transform hover:-translate-y-0.5 inline-flex items-center gap-3 cursor-pointer"
            >
              <span>REJOINDRE LES ARTISANS ACCOMPAGNÉS ({ctaPriceLabel})</span>
              <ArrowRight className="w-4 h-4 text-amber-300" />
            </button>
          </div>

        </div>
      </section>

      {/* AUTHENTIC STORYTELLING BIO (GUIDES DIGITAUX) */}
      <section className="py-16 bg-[#faf8f5] border-b border-[#eee7da]">
        <div className="max-w-4xl mx-auto px-4 space-y-8">
          <div className="bg-white p-8 sm:p-12 rounded-3xl border border-[#eee7da] shadow-sm space-y-6">
            <div className="flex flex-col md:flex-row items-center gap-8">
              <div className="relative w-40 h-40 rounded-full overflow-hidden shrink-0 shadow-xl border-4 border-[#18757d]">
                <Image
                  src="/images/stephanie_v2.png"
                  alt="Stéphanie ROCQ - Fondatrice de Guides Digitaux"
                  fill
                  className="object-cover object-[center_65%]"
                />
              </div>
              <div className="space-y-3 text-center md:text-left">
                <div className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-[#e6f4f3] text-[#18757d]">
                  Fondatrice & Formatrice Digitalisation
                </div>
                <h3 className="text-2xl font-black text-[#332420]">Stéphanie ROCQ</h3>
                <p className="text-xs font-extrabold text-[#18757d]">
                  Fondatrice de <Link href="/" className="underline hover:text-[#12595f]">Guides Digitaux</Link>
                </p>
                <div className="flex items-center justify-center md:justify-start gap-4 pt-1 flex-wrap">
                  <Link href="/" className="text-xs text-[#18757d] font-bold flex items-center gap-1.5 hover:underline">
                    <Globe className="w-4 h-4 text-[#18757d]" /> guides-digitaux.com
                  </Link>
                  <span className="text-slate-300">•</span>
                  <Link href="/" className="text-xs text-[#18757d] font-bold flex items-center gap-1.5 hover:underline">
                    <span>🎓 Guides Digitaux</span>
                  </Link>
                </div>
              </div>
            </div>

            <div className="text-xs sm:text-sm text-[#5e4d46] leading-relaxed space-y-3 border-t border-[#eee7da] pt-6">
              <p>
                « À travers <strong>Guides Digitaux</strong>, j’accompagne les artisans, créateurs et indépendants qui veulent créer leur propre site web et comprendre enfin le digital pour en tirer un vrai bénéfice — sans passer par des prestataires hors de prix.
              </p>
              <p>
                Mon approche est simple : <strong>aucun jargon technique incompréhensible, un ton bienveillant, très concret et un brin décalé 😊</strong>. Chaque vidéo a été tournée pour te transmettre l'autonomie totale sur ton site, sans te prendre la tête ! »
              </p>
            </div>
          </div>

          {/* BIO CTA BUTTONS */}
          <div className="text-center space-y-3">
            <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
              <button
                onClick={() => scrollToCommande('1x')}
                className="w-full sm:w-auto px-7 py-4 text-xs sm:text-sm font-black text-white bg-[#18757d] hover:bg-[#12595f] rounded-2xl shadow-lg uppercase tracking-wider transition-all transform hover:-translate-y-0.5 inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>REJOINDRE EN 1X (199 €)</span>
                <ArrowRight className="w-4 h-4 text-amber-300" />
              </button>

              <button
                onClick={() => scrollToCommande('3x')}
                className="w-full sm:w-auto px-7 py-4 text-xs sm:text-sm font-black text-[#332420] bg-amber-400 hover:bg-amber-300 rounded-2xl shadow-lg uppercase tracking-wider transition-all transform hover:-translate-y-0.5 inline-flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>PAYER EN 3X (3X 75 €)</span>
                <ArrowRight className="w-4 h-4 text-[#332420]" />
              </button>
            </div>
          </div>

        </div>
      </section>

      {/* 12. APPEL À L'ACTION ET MODULE DE PAIEMENT STRIPE INTÉGRÉ AU TUNNEL */}
      <section id="commande" className="py-16 md:py-24 bg-gradient-to-b from-[#faf8f5] via-[#eef7f6] to-[#e6f4f3] scroll-mt-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 space-y-8 text-center">
          
          <div className="space-y-3">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-black bg-amber-400 text-[#332420] uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5 fill-current" />
              Offre d'Accès Immédiat • Paiement Sécurisé
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#332420] tracking-tight">
              Passe à l'action et crée ton site WordPress
            </h2>
            <p className="text-xs sm:text-sm text-[#5e4d46] max-w-lg mx-auto">
              Choisis ta formule de règlement ci-dessous pour accéder instantanément aux 6 modules vidéo et bonus à vie.
            </p>
          </div>

          {/* MODULE DE PAIEMENT STRIPE INTÉGRÉ AU TUNNEL */}
          <div className={`bg-white rounded-3xl border-2 ${isHighlighted ? 'border-[#18757d] ring-4 ring-[#18757d]/30 scale-101 shadow-2xl' : 'border-[#18757d] shadow-xl'} p-6 sm:p-10 space-y-6 text-left transition-all duration-500`}>
            
            {/* EN-TÊTE RÉCAPITULATIF */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#eee7da] pb-5">
              <div>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider bg-[#e6f4f3] text-[#18757d] px-2.5 py-0.5 rounded-md">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#18757d]" />
                  Paiement 100% Sécurisé Stripe
                </span>
                <h3 className="text-xl font-black text-[#332420] mt-1">Formation Vidéo : Créer sa vitrine en ligne avec WordPress</h3>
                <p className="text-xs text-slate-500 font-semibold">
                  6 Modules Vidéo • Checklists, Workbooks & Quizz • 2 Vidéos Bonus Offertes • Accès à vie
                </p>
              </div>
              <div className="text-right">
                {paymentOption === '1x' ? (
                  <>
                    <span className="text-xs text-slate-600 line-through block font-bold">298,00 €</span>
                    <span className="text-3xl font-black text-[#18757d]">199,00 €</span>
                    <span className="text-[10px] font-bold text-emerald-700 block mt-0.5">Paiement unique</span>
                  </>
                ) : (
                  <>
                    <span className="text-xs text-slate-500 font-bold block">Paiement 3x sans frais</span>
                    <span className="text-3xl font-black text-[#18757d]">3 x 75,00 €</span>
                    <span className="text-[10px] font-bold text-[#18757d] block mt-0.5">75,00 € aujourd'hui (Total : 225 €)</span>
                  </>
                )}
              </div>
            </div>

            {/* SÉLECTEUR 2 OPTIONS (1X vs 3X SANS FRAIS) */}
            <div>
              <label className="block text-xs font-black text-[#332420] uppercase tracking-wider mb-2">
                Choisis ta modalité de règlement :
              </label>
              <div className="p-1.5 bg-[#faf8f5] rounded-2xl border border-[#eee7da] grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPaymentOption('1x')}
                  className={`py-3 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    paymentOption === '1x'
                      ? 'bg-[#18757d] text-white shadow-md'
                      : 'text-[#5e4d46] hover:text-[#332420] hover:bg-white/60'
                  }`}
                >
                  <CreditCard className="w-4 h-4" />
                  <span>Paiement 1x (199 €)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setPaymentOption('3x')}
                  className={`py-3 px-4 rounded-xl text-xs font-black transition-all flex items-center justify-center gap-2 cursor-pointer ${
                    paymentOption === '3x'
                      ? 'bg-[#18757d] text-white shadow-md'
                      : 'text-[#5e4d46] hover:text-[#332420] hover:bg-white/60'
                  }`}
                >
                  <CalendarCheck className="w-4 h-4" />
                  <span>Facilité 3x (3x 75 €)</span>
                </button>
              </div>
            </div>

            {/* ÉTAPE 1 : ADRESSE EMAIL */}
            <div>
              <label htmlFor="checkout-email" className="block text-xs font-black text-[#332420] uppercase tracking-wider mb-1.5">
                Adresse e-mail (pour la réception instantanée des accès) :
              </label>
              <input
                id="checkout-email"
                name="email"
                autoComplete="email"
                aria-label="Adresse e-mail pour la réception des accès"
                type="email"
                placeholder="ex: contact@mon-atelier.fr ou marie.artisan@gmail.com"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-[#eee7da] bg-[#faf8f5] text-sm text-[#332420] font-medium focus:ring-2 focus:ring-[#18757d] focus:bg-white focus:outline-hidden transition-all"
              />
            </div>

            {/* ÉTAPE 2 : PAIEMENT EXPRESS EN 1 CLIC (APPLE PAY & GOOGLE PAY) */}
            <div className="space-y-3 pt-1">
              <div className="flex items-center justify-between">
                <span className="text-xs font-black text-[#332420] uppercase tracking-wider flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                  Paiement Express en 1 clic
                </span>
                <div className="flex items-center gap-2">
                  <span className="text-xs font-black text-[#18757d] bg-[#e6f4f3] px-2.5 py-0.5 rounded-full border border-[#18757d]/20">
                    {paymentOption === '3x' ? '75,00 € aujourd’hui' : '199,00 €'}
                  </span>
                  <span className="inline-flex items-center gap-1 text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    <ShieldCheck className="w-3 h-3 text-emerald-600" />
                    Sécurisé SSL
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {/* BOUTON APPLE PAY */}
                <button
                  type="button"
                  onClick={() => handleExpressPayment('apple_pay')}
                  disabled={isLoading}
                  aria-label="Payer en 1 clic avec Apple Pay"
                  title="Payer en 1 clic avec Apple Pay"
                  className="w-full h-12 bg-black hover:bg-neutral-900 text-white rounded-xl transition-all shadow-sm hover:shadow-md hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 flex items-center justify-center cursor-pointer border border-neutral-800 px-4 overflow-hidden"
                >
                  {isLoading && expressProvider === 'apple_pay' ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span className="text-xs font-medium">Connexion Apple Pay...</span>
                    </span>
                  ) : (
                    <ApplePayLogo className="h-[26px] w-auto" />
                  )}
                </button>

                {/* BOUTON GOOGLE PAY */}
                <button
                  type="button"
                  onClick={() => handleExpressPayment('google_pay')}
                  disabled={isLoading}
                  aria-label="Payer en 1 clic avec Google Pay"
                  title="Payer en 1 clic avec Google Pay"
                  className="w-full h-12 bg-black hover:bg-neutral-900 text-white rounded-xl transition-all shadow-sm hover:shadow-md hover:scale-[1.01] active:scale-[0.99] disabled:opacity-60 flex items-center justify-center cursor-pointer border border-neutral-800 px-4 overflow-hidden"
                >
                  {isLoading && expressProvider === 'google_pay' ? (
                    <span className="flex items-center gap-2">
                      <Loader2 className="w-4 h-4 animate-spin text-white" />
                      <span className="text-xs font-medium">Connexion Google Pay...</span>
                    </span>
                  ) : (
                    <GooglePayLogo className="h-[26px] w-auto" />
                  )}
                </button>
              </div>

              <p className="text-center text-[11px] text-slate-400 font-medium flex items-center justify-center gap-1.5 pt-0.5">
                <Lock className="w-3 h-3 text-emerald-600" />
                Paiement express biométrique sécurisé (Face ID / Touch ID)
              </p>

              {/* SÉPARATEUR */}
              <div className="relative flex items-center justify-center pt-2 pb-1">
                <div className="grow border-t border-[#eee7da]"></div>
                <span className="shrink mx-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
                  ou par carte bancaire
                </span>
                <div className="grow border-t border-[#eee7da]"></div>
              </div>
            </div>

            {/* ÉTAPE 3 : FORMULAIRE DE PAIEMENT PAR CARTE DIRECT */}
            <div className="space-y-4">
              <div className="p-4 bg-[#faf8f5] rounded-2xl border border-[#eee7da] space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-black text-[#332420] uppercase tracking-wider flex items-center gap-1.5">
                    <CreditCard className="w-4 h-4 text-[#18757d]" />
                    Coordonnées Bancaires
                  </span>
                  <div className="flex items-center gap-1.5 text-xs text-slate-500">
                    <span className="px-1.5 py-0.5 rounded bg-white border border-slate-200 text-[10px] font-bold text-slate-700">CB</span>
                    <span className="px-1.5 py-0.5 rounded bg-white border border-slate-200 text-[10px] font-bold text-blue-700">VISA</span>
                    <span className="px-1.5 py-0.5 rounded bg-white border border-slate-200 text-[10px] font-bold text-red-600">MC</span>
                    <span className="px-1.5 py-0.5 rounded bg-white border border-slate-200 text-[10px] font-bold text-slate-800">Apple Pay</span>
                  </div>
                </div>

                <div className="space-y-2.5">
                  <div>
                    <label htmlFor="checkout-card-number" className="sr-only">Numéro de carte bancaire</label>
                    <input
                      id="checkout-card-number"
                      name="cardNumber"
                      autoComplete="cc-number"
                      aria-label="Numéro de carte bancaire (16 chiffres)"
                      type="text"
                      placeholder="Numéro de carte bancaire (16 chiffres)"
                      maxLength={19}
                      value={cardNumber}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim();
                        setCardNumber(val);
                      }}
                      className="w-full px-4 py-2.5 rounded-xl border border-[#eee7da] bg-white text-sm text-[#332420] font-mono tracking-wider focus:ring-2 focus:ring-[#18757d] focus:outline-hidden"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <div>
                      <label htmlFor="checkout-card-expiry" className="sr-only">Date d'expiration</label>
                      <input
                        id="checkout-card-expiry"
                        name="cardExpiry"
                        autoComplete="cc-exp"
                        aria-label="Date d'expiration (MM / AA)"
                        type="text"
                        placeholder="MM / AA"
                        maxLength={5}
                        value={cardExpiry}
                        onChange={(e) => {
                          let val = e.target.value.replace(/\D/g, '');
                          if (val.length >= 2) val = `${val.slice(0, 2)}/${val.slice(2, 4)}`;
                          setCardExpiry(val);
                        }}
                        className="w-full px-4 py-2.5 rounded-xl border border-[#eee7da] bg-white text-sm text-[#332420] font-mono text-center focus:ring-2 focus:ring-[#18757d] focus:outline-hidden"
                      />
                    </div>
                    <div>
                      <label htmlFor="checkout-card-cvc" className="sr-only">Code CVC</label>
                      <input
                        id="checkout-card-cvc"
                        name="cardCvc"
                        autoComplete="cc-csc"
                        aria-label="Code de sécurité CVC ou CVV (3 ou 4 chiffres)"
                        type="password"
                        placeholder="CVC / CVV"
                        maxLength={4}
                        value={cardCvc}
                        onChange={(e) => setCardCvc(e.target.value.replace(/\D/g, ''))}
                        className="w-full px-4 py-2.5 rounded-xl border border-[#eee7da] bg-white text-sm text-[#332420] font-mono text-center focus:ring-2 focus:ring-[#18757d] focus:outline-hidden"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* CASE À COCHER OPTIONNELLE NEWSLETTER */}
              <div className="p-4 rounded-2xl border bg-[#faf8f5] border-[#eee7da] transition-all">
                <label className="flex items-start gap-3 cursor-pointer select-none">
                  <input
                    id="checkout-newsletter-optin"
                    name="newsletterOptIn"
                    aria-label="J'accepte de recevoir les e-mails pédagogiques et la newsletter de Guides Digitaux"
                    type="checkbox"
                    checked={newsletterOptIn}
                    onChange={(e) => setNewsletterOptIn(e.target.checked)}
                    className="w-4 h-4 rounded text-[#18757d] focus:ring-[#18757d] mt-0.5 shrink-0 cursor-pointer"
                  />
                  <span className="text-xs text-[#5e4d46] leading-relaxed">
                    <strong className="text-[#332420]">J'accepte</strong> de recevoir les e-mails pédagogiques, les conseils d'optimisation et la newsletter de Guides Digitaux. <span className="text-slate-600 font-medium text-[11px]">(Optionnel)</span>
                  </span>
                </label>
              </div>

              {/* BOUTON DE VALIDATION DIRECTE */}
              <button
                onClick={handleDirectPayment}
                disabled={isLoading}
                aria-label={paymentOption === '3x' ? 'Régler la 1ʳᵉ mensualité de 75 € et accéder à la formation' : 'Payer 199 € et accéder à la formation'}
                className="w-full bg-[#18757d] hover:bg-[#12595f] text-white py-4 px-6 rounded-2xl font-black text-base sm:text-lg uppercase tracking-wider transition-all shadow-xl hover:scale-101 active:scale-99 disabled:opacity-60 flex items-center justify-center gap-3 cursor-pointer min-h-[52px]"
              >
                {isLoading && !expressProvider ? (
                  <span className="flex items-center gap-2">
                    <Loader2 className="w-5 h-5 animate-spin text-white" />
                    <span>Traitement sécurisé Stripe...</span>
                  </span>
                ) : (
                  <>
                    <span>
                      {paymentOption === '3x'
                        ? 'Régler la 1ʳᵉ Mensualité de 75,00 € (3x sans frais)'
                        : 'Payer 199,00 € et Accéder à la Formation'}
                    </span>
                    <ArrowRight className="w-5 h-5 text-amber-300" />
                  </>
                )}
              </button>

              <div className="text-center">
                <button
                  onClick={() => handleCheckout()}
                  type="button"
                  aria-label="Ouvrir le paiement hébergé Stripe Checkout classique"
                  className="text-xs text-slate-500 hover:text-[#18757d] underline transition-colors cursor-pointer min-h-[32px] py-1"
                >
                  Ou ouvrir sur la page de paiement hébergée Stripe
                </button>
              </div>
            </div>

            <div className="pt-3 border-t border-[#eee7da] flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-slate-500">
              <span className="flex items-center gap-1 text-emerald-700">
                <Lock className="w-3.5 h-3.5 text-emerald-600" />
                Cryptage SSL 256 bits
              </span>
              <span className="flex items-center gap-1">
                <CreditCard className="w-3.5 h-3.5 text-[#18757d]" />
                Cartes CB, Visa, Mastercard, Apple Pay, Google Pay, Klarna
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
            <p className="text-xs text-slate-500">Toutes les réponses à tes questions avant de rejoindre la formation.</p>
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

          {/* FAQ CTA BUTTON */}
          <div className="text-center pt-6">
            <button
              onClick={() => scrollToCommande()}
              className="px-8 py-4 text-xs sm:text-sm font-black text-white bg-[#18757d] hover:bg-[#12595f] rounded-2xl shadow-lg uppercase tracking-wider transition-all transform hover:-translate-y-0.5 inline-flex items-center gap-3 cursor-pointer"
            >
              <span>REJOINDRE LA FORMATION VITRINE ({ctaPriceLabel})</span>
              <ArrowRight className="w-4 h-4 text-amber-300" />
            </button>
          </div>

        </div>
      </section>

      {/* STICKY MOBILE CTA 9 */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-[#eee7da] p-3 shadow-2xl z-50">
        <button
          onClick={() => scrollToCommande()}
          className="w-full py-3.5 px-4 text-xs font-black text-white bg-[#18757d] hover:bg-[#12595f] rounded-xl shadow-md uppercase tracking-wider flex items-center justify-between cursor-pointer"
        >
          <span>ACCÉDER À LA FORMATION ({ctaPriceLabel})</span>
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
