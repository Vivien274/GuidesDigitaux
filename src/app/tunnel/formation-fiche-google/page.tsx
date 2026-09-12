'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { event } from '@/lib/metaPixel';
import {
  CheckCircle2,
  Star,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  PlayCircle,
  Clock,
  Lock,
  Gift,
  HelpCircle,
  ChevronDown,
  ChevronUp,
  MapPin,
  TrendingUp,
  Award,
  Zap,
  PhoneCall,
  Check,
  X,
  CreditCard,
  Eye,
  HeartHandshake,
  FileCheck2,
  Users
} from 'lucide-react';

const REAL_REVIEWS = [
  {
    id: 1,
    author: 'Camille',
    avatarInitials: 'CM',
    role: 'Artisane Pâtissière • Studio Macarons (Lille)',
    source: 'Avis vérifié Google',
    rating: 5,
    quote: "« Grâce à l'optimisation de ma fiche Google et aux conseils de Stéphanie, mes ateliers de pâtisserie et commandes spéciales se réservent désormais directement depuis Google Maps. Mon téléphone sonne toutes les semaines sans que j'aie besoin de payer de la pub ! »"
  },
  {
    id: 2,
    author: 'Cyntia',
    avatarInitials: 'C',
    role: 'Créatrice • Cyaness Savonnerie Artisanale',
    source: 'Avis vérifié Google',
    rating: 5,
    quote: "« Stéphanie a su m'expliquer clairement quoi mettre dans ma fiche, comment choisir les bonnes catégories et comment demander des avis clients sans être insistante. Les résultats ont été immédiats avec un bond de visibilité locale dans ma région. »"
  },
  {
    id: 3,
    author: 'Edwige',
    avatarInitials: 'E',
    role: 'Responsable • Association & Praticienne bien-être',
    source: 'Avis vérifié Google',
    rating: 5,
    quote: "« Une formation concise, ultra-pratique et sans aucun jargon technique. En moins de 2 heures, ma fiche était entièrement reconfigurée. Dès la semaine suivante, j'ai reçu mes premières demandes d'itinéraires et d'appels. Je recommande les yeux fermés ! »"
  }
];

export default function TunnelFormationFicheGooglePage() {
  const router = useRouter();
  const [openModule, setOpenModule] = useState<number | null>(0);
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isHighlighted, setIsHighlighted] = useState(false);

  // Coordonnées de paiement direct
  const [emailInput, setEmailInput] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvc, setCardCvc] = useState('');
  const [hasOrderBump, setHasOrderBump] = useState(false);
  const totalAmount = hasOrderBump ? 41 : 29;

  // Compte à rebours dynamique jusqu'au 15 octobre 2026 à 23:59:59
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    // Tracking Meta Pixel ViewContent
    event('ViewContent', {
      content_name: 'Formation Fiche Google Business Profile - Lancement Officiel',
      content_ids: ['formation-fiche-google'],
      content_type: 'product',
      value: 29,
      currency: 'EUR',
    });

    const targetDate = new Date('2026-10-15T23:59:59').getTime();

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

  const handleDirectPayment = async () => {
    if (!emailInput.trim() || !emailInput.includes('@')) {
      alert('Merci de saisir une adresse e-mail valide pour recevoir tes accès.');
      return;
    }

    if (cardNumber.replace(/\s/g, '').length < 15) {
      alert('Merci de renseigner un numéro de carte bancaire valide.');
      return;
    }

    setIsLoading(true);

    event('InitiateCheckout', {
      content_name: hasOrderBump
        ? 'Formation Fiche Google + Calculateur de Score Order Bump'
        : 'Formation Fiche Google Business Profile - Lancement Officiel',
      content_ids: hasOrderBump ? ['formation-fiche-google', 'orderbump-calculateur-score'] : ['formation-fiche-google'],
      content_type: 'product',
      value: totalAmount,
      currency: 'EUR',
    });

    try {
      if (typeof window !== 'undefined') {
        const existing = JSON.parse(localStorage.getItem('gd_enrolled_courses') || '[]');
        const newEnrolled = {
          id: 'formation-fiche-google',
          title: 'Formation : Dominer le référencement local avec sa Fiche Google',
          slug: 'formation-fiche-google',
          type: 'formation',
          typeLabel: '⭐ LANCEMENT OFFICIEL (7 Modules + Prompts IA + Bonus)',
          progress: 0,
          completedLessons: 0,
          totalLessons: 7,
          duration: '2h00',
          instructor: 'Stéphanie ROCQ',
          price: totalAmount,
          hasOrderBump,
          customerEmail: emailInput.trim(),
          purchaseDate: new Date().toLocaleDateString('fr-FR')
        };

        if (!existing.some((e: any) => e.id === newEnrolled.id || e.slug === newEnrolled.slug)) {
          localStorage.setItem('gd_enrolled_courses', JSON.stringify([newEnrolled, ...existing]));
        }
      }

      // Simulation ou appel API de finalisation
      await new Promise(r => setTimeout(r, 1200));

      router.push(`/tunnel/confirmation?id=formation-fiche-google&session_id=stripe_direct_${Date.now()}&price=${totalAmount}&orderbump=${hasOrderBump ? '1' : '0'}&email=${encodeURIComponent(emailInput.trim())}`);
    } catch (e) {
      console.error('Direct checkout error', e);
      alert('Une erreur est survenue lors de la validation du paiement.');
      setIsLoading(false);
    }
  };

  const handleCheckout = async () => {
    setIsLoading(true);

    event('InitiateCheckout', {
      content_name: hasOrderBump
        ? 'Formation Fiche Google + Calculateur de Score Order Bump'
        : 'Formation Fiche Google Business Profile - Lancement Officiel',
      content_ids: hasOrderBump ? ['formation-fiche-google', 'orderbump-calculateur-score'] : ['formation-fiche-google'],
      content_type: 'product',
      value: totalAmount,
      currency: 'EUR',
    });

    try {
      // Préparation de l'accès local pour fluidité immédiate
      if (typeof window !== 'undefined') {
        const existing = JSON.parse(localStorage.getItem('gd_enrolled_courses') || '[]');
        const newEnrolled = {
          id: 'formation-fiche-google',
          title: 'Formation : Dominer le référencement local avec sa Fiche Google',
          slug: 'formation-fiche-google',
          type: 'formation',
          typeLabel: '⭐ LANCEMENT OFFICIEL (7 Modules + Prompts IA + Bonus)',
          progress: 0,
          completedLessons: 0,
          totalLessons: 7,
          duration: '2h00',
          instructor: 'Stéphanie ROCQ',
          price: totalAmount,
          hasOrderBump,
          purchaseDate: new Date().toLocaleDateString('fr-FR')
        };

        if (!existing.some((e: any) => e.id === newEnrolled.id || e.slug === newEnrolled.slug)) {
          localStorage.setItem('gd_enrolled_courses', JSON.stringify([newEnrolled, ...existing]));
        }
      }

      const res = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId: 'formation-fiche-google',
          productId: 'formation-fiche-google',
          courseTitle: hasOrderBump
            ? 'Formation Vidéo (7 Modules) + Calculateur de Score & 3 Quick Wins'
            : 'Formation Vidéo (7 Modules) : Dominer le référencement local avec sa Fiche Google Business Profile',
          title: hasOrderBump
            ? 'Formation Vidéo (7 Modules) + Calculateur de Score & 3 Quick Wins'
            : 'Formation Vidéo (7 Modules) : Dominer le référencement local avec sa Fiche Google Business Profile',
          price: totalAmount,
          hasOrderBump,
          customerEmail: emailInput.trim() || undefined,
          cancelUrl: 'https://www.guides-digitaux.com/tunnel/formation-fiche-google',
          successUrl: `https://www.guides-digitaux.com/tunnel/confirmation?session_id={CHECKOUT_SESSION_ID}&productId=formation-fiche-google&orderbump=${hasOrderBump ? '1' : '0'}`
        })
      });

      const data = await res.json();
      if (data?.url) {
        window.location.href = data.url;
      } else {
        alert('Une erreur est survenue lors de l\'initialisation de la commande Stripe.');
        setIsLoading(false);
      }
    } catch (e) {
      console.error('Erreur Stripe checkout:', e);
      alert('Impossible de contacter le serveur de paiement sécurisé.');
      setIsLoading(false);
    }
  };

  const scrollToCheckout = () => {
    const el = document.getElementById('commander');
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
      setIsHighlighted(true);
      setTimeout(() => setIsHighlighted(false), 2500);
    }
  };

  const modules = [
    {
      title: "Module 1 : Fondations & Création sans blocage de ta Fiche Google",
      duration: "20 min",
      lessons: [
        "Créer ou revendiquer ta fiche d'établissement sans risquer la suspension",
        "Le choix du titre exact de ton entreprise (règles strictes anti-pénalité)",
        "Validation officielle Google : méthodes instantanées vs vidéo/courrier",
        "Vérification des coordonnées, horaires normaux et congés exceptionnels"
      ]
    },
    {
      title: "Module 2 : Catégories Stratégiques & Zone de Chalandise Délimitée",
      duration: "15 min",
      lessons: [
        "Sélectionner la catégorie principale exacte qui déclenche les recherches locales",
        "Ajouter les catégories secondaires pour capter les requêtes connexes",
        "Artisans à domicile / chantiers : comment définir ta zone de desserte sans afficher ton adresse privée",
        "Optimiser ton rayon kilométrique d'intervention locale"
      ]
    },
    {
      title: "Module 3 : Description Neuromarketing & Bibliothèque de Prompts IA Clé en Main",
      duration: "25 min",
      badge: "🔥 Prompts IA Inclus",
      lessons: [
        "Structure neuromarketing d'une description percutante de 750 caractères",
        "Bibliothèque de Prompts IA prêts à l'emploi (ChatGPT / Claude) pour rédiger ta description et tes offres en 30 secondes chrono",
        "Intégration naturelle des mots-clés métiers + nom de ta ville / région",
        "Mise en valeur de tes valeurs, savoir-faire artisanal et engagements uniques"
      ]
    },
    {
      title: "Module 4 : Stratégie Visuelle Vendeuse & Signaux Google Vision AI",
      duration: "20 min",
      lessons: [
        "Photo de couverture ultra-attractive (format paysage 1024x576px minimum)",
        "Logo haute définition et photos de toi en action (création du lien de confiance immédiat)",
        "Les 5 types de photos indispensables : ateliers, réalisations phares, vitrine ou véhicule",
        "Comment l'IA de Google (Google Cloud Vision) scanne et classe tes photos pour te faire remonter"
      ]
    },
    {
      title: "Module 5 : Catalogue Produits, Services & Tarifs Clairs",
      duration: "15 min",
      lessons: [
        "Créer des fiches produits/services irrésistibles avec descripteurs précis et tarifs indicatifs",
        "Utiliser les Prompts IA fournis pour générer les textes de chaque prestation en un clin d'œil",
        "Insérer les liens directs vers ton formulaire de devis ou ton calendrier de réservation",
        "Activer les attributs différenciants (ex: 'Géré par une femme', 'Accès PMR', 'Rendez-vous en ligne')"
      ]
    },
    {
      title: "Module 6 : La Machine à Avis 5 Étoiles & Réponses Stratégiques",
      duration: "20 min",
      badge: "⭐ Système Automatique",
      lessons: [
        "Générer ton lien direct raccourci d'avis 5 étoiles en 1 clic",
        "La méthode d'envoi douce (WhatsApp, SMS, Facture) pour récolter 5x plus d'avis sans insister",
        "Appliquer le Kit 10 Modèles de réponses : valoriser les 5 étoiles et désamorcer les retours délicats",
        "Réinsérer stratégiquement tes mots-clés locaux dans 100% de tes réponses pour doper ton SEO"
      ]
    },
    {
      title: "Module 7 : Routine d'Animation 5 min/semaine, Posts Google & Messagerie Directe",
      duration: "15 min",
      lessons: [
        "Publier 1 Post Google impactant toutes les 2 semaines avec les prompts d'actualités fournis",
        "Activer la messagerie instantanée Google sur ton smartphone pour répondre aux prospects en direct",
        "Enrichir la Foire Aux Questions (FAQ) pour lever les objections de tes futurs clients",
        "Analyser tes statistiques mensuelles (appels, itinéraires, recherches) et rester indétrônable"
      ]
    }
  ];

  const faqs = [
    {
      q: "Combien de temps ai-je accès à la formation ?",
      a: "Tu bénéficies d'un accès illimité à vie. Tu peux regarder les vidéos à ton rythme, quand tu le souhaites, depuis ton smartphone, ta tablette ou ton ordinateur, et y revenir autant de fois que nécessaire."
    },
    {
      q: "Est-ce accessible même si je ne suis pas à l'aise avec l'informatique ?",
      a: "Absolument ! La formation a été pensée spécialement pour les artisans, créateurs et débutants. Tout est filmé en pas-à-pas avec des partages d'écran commentés simplement, sans aucun terme technique barbare."
    },
    {
      q: "Je travaille à domicile ou sur chantier : dois-je afficher mon adresse personnelle ?",
      a: "Non, pas du tout. Le Module 1 t'explique exactement comment configurer une 'zone de desserte' sans afficher ton adresse privée. Google affichera ta zone d'intervention géographique tout en protégeant ta vie privée."
    },
    {
      q: "En combien de temps vais-je voir des résultats concrets ?",
      a: "La mise en place de toutes les optimisations prend environ 1h30. Une fois validée par Google, ta fiche remonte généralement dans le classement local sous quelques jours à quelques semaines selon le niveau de concurrence de ta ville."
    },
    {
      q: "Le paiement est-il sécurisé et quelles sont les modalités ?",
      a: "Le paiement est 100% sécurisé via Stripe avec cryptage bancaire SSL 256-bit. Tu peux régler par carte bancaire (CB, Visa, Mastercard) ou Apple Pay / Google Pay. Tu reçois immédiatement ta facture et tes accès de connexion par e-mail."
    },
    {
      q: "Comment poser mes questions si j'ai un doute pendant la formation ?",
      a: "Tu disposes d'un support d'assistance par e-mail et d'un espace d'entraide dédié pour poser toutes tes questions à Stéphanie et progresser en toute sérénité."
    }
  ];

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#332420] font-sans selection:bg-[#18757d] selection:text-white">
      
      {/* 1. BANDEAU D'URGENCE & PROMO (PDF ÉTAPE 1) */}
      <div className="bg-[#18757d] text-white py-3 px-4 text-center text-xs sm:text-sm font-bold flex flex-wrap items-center justify-center gap-2 sm:gap-3 sticky top-0 z-50 shadow-md">
        <span className="inline-flex items-center gap-1.5 bg-amber-400 text-[#332420] px-2.5 py-0.5 rounded-full text-xs font-black uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          Lancement Officiel
        </span>
        <span className="text-white">
          Tarif privilégié <strong>29 € au lieu de 69 €</strong> jusqu'au <strong>15 octobre 2026</strong> :
        </span>
        <span className="font-mono bg-black/30 border border-white/20 px-2.5 py-0.5 rounded-lg text-amber-300 font-extrabold tracking-wider">
          {timeLeft.days}j {String(timeLeft.hours).padStart(2, '0')}h {String(timeLeft.minutes).padStart(2, '0')}m {String(timeLeft.seconds).padStart(2, '0')}s
        </span>
      </div>

      {/* HEADER MINIMALISTE DE CONVERSION */}
      <header className="bg-white/90 backdrop-blur-md border-b border-[#eee7da] py-3.5 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="relative h-10 w-40 sm:w-48 block">
            <Image
              src="/images/logo.png"
              alt="Guides Digitaux - Formations & Ressources pour Artisans"
              fill
              className="object-contain object-left"
              priority
            />
          </Link>
          <button
            onClick={scrollToCheckout}
            className="hidden sm:inline-flex items-center gap-2 bg-[#18757d] hover:bg-[#135d64] text-white px-5 py-2 rounded-xl text-xs font-black uppercase tracking-wider transition-all shadow-sm hover:scale-105"
          >
            <span>Accéder à la formation (29 €)</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </header>

      {/* 2. EN-TÊTE HERO (PDF ÉTAPE 2) */}
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-[#eef7f6] via-[#faf8f5] to-[#faf8f5] border-b border-[#eee7da]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-6">
          
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-[#e6f4f3] text-[#18757d] text-xs font-black uppercase tracking-wider border border-[#bce3e0]">
            <MapPin className="w-4 h-4 text-[#18757d]" />
            <span>Spécial Artisans, Créateurs & Commerçants Locaux</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#332420] tracking-tight leading-tight max-w-4xl mx-auto">
            Attire un flux régulier de <span className="text-[#18757d]">clients locaux</span> sans dépenser 1€ en publicité grâce à ta <span className="underline decoration-amber-400 decoration-wavy decoration-2">Fiche Google</span>
          </h1>

          <p className="text-base sm:text-lg text-[#5e4d46] max-w-3xl mx-auto leading-relaxed font-medium">
            La méthode vidéo pas-à-pas, concrète et sans jargon pour positionner ton atelier, ta boutique ou tes prestations en haut des recherches Google et Google Maps dans ta ville.
          </p>

          {/* VISUEL MOCKUP HAUTE DÉFINITION */}
          <div className="relative max-w-3xl mx-auto rounded-3xl overflow-hidden shadow-2xl border-4 border-white bg-white mt-8 group">
            <div className="relative aspect-video w-full bg-slate-100">
              <Image
                src="/images/products/formation-fiche-google-mockup.jpg"
                alt="Formation Fiche Google Business Profile - Guides Digitaux"
                fill
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-80" />
              <div className="absolute bottom-4 left-4 right-4 text-white flex flex-wrap items-center justify-between gap-2">
                <div className="text-left">
                  <span className="text-xs font-extrabold uppercase tracking-wider text-amber-300 block">Formation Vidéo Pratique</span>
                  <span className="text-sm sm:text-base font-black">7 Modules Clic-par-Clic • Prompts IA Inclus • 2h de Vidéos HD • Accès à vie</span>
                </div>
                <span className="bg-emerald-500 text-white text-xs font-black px-3 py-1.5 rounded-xl uppercase tracking-wider shadow-sm flex items-center gap-1.5">
                  <CheckCircle2 className="w-4 h-4" />
                  Prêt à l'emploi
                </span>
              </div>
            </div>
          </div>

          {/* CTA PRINCIPAL DE L'EN-TÊTE */}
          <div className="pt-6 max-w-md mx-auto space-y-3">
            <button
              onClick={scrollToCheckout}
              className="w-full bg-[#18757d] hover:bg-[#135d64] text-white py-4 px-8 rounded-2xl text-base sm:text-lg font-black tracking-wide shadow-xl hover:shadow-2xl hover:scale-102 active:scale-98 transition-all flex items-center justify-center gap-3 cursor-pointer"
            >
              <span>Je profite de l'offre à 29 €</span>
              <span className="text-xs line-through text-emerald-200">69 €</span>
              <ArrowRight className="w-5 h-5" />
            </button>
            <div className="flex flex-wrap items-center justify-center gap-4 text-xs font-bold text-[#5e4d46]">
              <span className="flex items-center gap-1">
                <Lock className="w-3.5 h-3.5 text-emerald-600" />
                Paiement Stripe sécurisé
              </span>
              <span className="flex items-center gap-1">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                Accès immédiat 24/7
              </span>
              <span className="flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-[#18757d]" />
                Accès à vie & Mises à jour
              </span>
            </div>
          </div>

        </div>
      </section>

      {/* 3. IDENTIFIER LE PROBLÈME (PDF ÉTAPE 3) */}
      <section className="py-16 md:py-20 bg-white border-b border-[#eee7da]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-10">
          
          <div className="text-center space-y-3">
            <span className="text-xs font-extrabold text-red-600 uppercase tracking-wider bg-red-50 px-3 py-1 rounded-full border border-red-200">
              Le constat frustrant
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#332420] tracking-tight">
              Tu as un savoir-faire en or, mais dans ta ville… <span className="text-red-600">personne ne te trouve sur Google</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
            
            <div className="bg-red-50/70 border border-red-200 rounded-3xl p-6 sm:p-8 space-y-4">
              <h3 className="text-lg font-black text-red-950 flex items-center gap-2">
                <X className="w-5 h-5 text-red-600 shrink-0" />
                Tu en as marre de…
              </h3>
              <ul className="space-y-3 text-sm text-red-900/90 leading-relaxed font-medium">
                <li className="flex items-start gap-2.5">
                  <span className="text-red-600 font-bold">•</span>
                  <span>Passer des heures à poster sur les réseaux sociaux pour récolter quelques mentions "j'aime" de proches sans aucun appel client local.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-red-600 font-bold">•</span>
                  <span>Voir des confrères de ta commune, parfois moins qualifiés que toi, squatter les 3 premières places sur Google Maps.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-red-600 font-bold">•</span>
                  <span>Attendre passivement que le bouche-à-oreille veuille bien apporter quelques demandes aléatoires.</span>
                </li>
              </ul>
            </div>

            <div className="bg-amber-50/70 border border-amber-200 rounded-3xl p-6 sm:p-8 space-y-4">
              <h3 className="text-lg font-black text-amber-950 flex items-center gap-2">
                <Clock className="w-5 h-5 text-amber-600 shrink-0" />
                Tu te sens…
              </h3>
              <ul className="space-y-3 text-sm text-amber-950/90 leading-relaxed font-medium">
                <li className="flex items-start gap-2.5">
                  <span className="text-amber-600 font-bold">•</span>
                  <span>Totalement invisible aux yeux des centaines d'habitants qui cherchent tes produits ou prestations chaque mois sur leur téléphone.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-amber-600 font-bold">•</span>
                  <span>Bloqué·e ou découragé·e face au jargon technique incompréhensible du référencement web.</span>
                </li>
                <li className="flex items-start gap-2.5">
                  <span className="text-amber-600 font-bold">•</span>
                  <span>Inquiet·e de faire une mauvaise manipulation ou de ne pas savoir quoi remplir sur ta fiche d'établissement.</span>
                </li>
              </ul>
            </div>

          </div>

          <div className="text-center pt-4">
            <button
              onClick={scrollToCheckout}
              className="inline-flex items-center gap-2 bg-[#18757d] hover:bg-[#135d64] text-white px-8 py-3.5 rounded-2xl text-sm font-black uppercase tracking-wider transition-all shadow-md hover:scale-103 cursor-pointer"
            >
              <span>Je veux rendre mon activité visible dès maintenant (29 €)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </section>

      {/* 4. CASSER LES OBJECTIONS (PDF ÉTAPE 4) */}
      <section className="py-16 md:py-20 bg-[#faf8f5] border-b border-[#eee7da]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-10">
          
          <div className="text-center space-y-3">
            <span className="text-xs font-extrabold text-[#18757d] uppercase tracking-wider bg-[#e6f4f3] px-3.5 py-1 rounded-full border border-[#bce3e0]">
              La vérité sur Google Maps
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#332420] tracking-tight">
              Pour être n°1 dans ta ville, tu n'as <span className="text-[#18757d]">PAS besoin de…</span>
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
            
            <div className="bg-white p-6 rounded-2xl border border-[#eee7da] shadow-2xs space-y-2 flex items-start gap-3.5">
              <div className="p-2 bg-red-100 text-red-600 rounded-xl shrink-0 mt-0.5 font-bold">✕</div>
              <div>
                <h4 className="text-base font-black text-[#332420]">Pas besoin d'être un génie de l'informatique</h4>
                <p className="text-xs sm:text-sm text-[#5e4d46] leading-relaxed">
                  Zéro ligne de code, zéro réglage obscur. Tu as juste à regarder mes vidéos et cliquer exactement aux mêmes endroits que moi.
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#eee7da] shadow-2xs space-y-2 flex items-start gap-3.5">
              <div className="p-2 bg-red-100 text-red-600 rounded-xl shrink-0 mt-0.5 font-bold">✕</div>
              <div>
                <h4 className="text-base font-black text-[#332420]">Pas besoin de payer de la publicité</h4>
                <p className="text-xs sm:text-sm text-[#5e4d46] leading-relaxed">
                  La fiche Google est 100% gratuite. Une fois bien configurée, elle génère des visites et des appels sans jamais rien débourser.
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#eee7da] shadow-2xs space-y-2 flex items-start gap-3.5">
              <div className="p-2 bg-red-100 text-red-600 rounded-xl shrink-0 mt-0.5 font-bold">✕</div>
              <div>
                <h4 className="text-base font-black text-[#332420]">Pas besoin d'avoir déjà un site internet</h4>
                <p className="text-xs sm:text-sm text-[#5e4d46] leading-relaxed">
                  Une fiche Google bien remplie se suffit à elle-même. Tes clients peuvent t'appeler et demander un itinéraire en direct.
                </p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-[#eee7da] shadow-2xs space-y-2 flex items-start gap-3.5">
              <div className="p-2 bg-red-100 text-red-600 rounded-xl shrink-0 mt-0.5 font-bold">✕</div>
              <div>
                <h4 className="text-base font-black text-[#332420]">Pas besoin d'y passer tes soirées</h4>
                <p className="text-xs sm:text-sm text-[#5e4d46] leading-relaxed">
                  Compte 1h30 pour appliquer l'ensemble des modules, puis 10 à 15 minutes par mois pour maintenir ta fiche active.
                </p>
              </div>
            </div>

          </div>

          <div className="p-6 bg-[#e6f4f3] rounded-3xl border border-[#bce3e0] text-center max-w-2xl mx-auto">
            <p className="text-sm sm:text-base text-[#18757d] font-bold">
              💡 <strong>Ce qui fait la différence pour Google ?</strong> Ce n'est pas le budget, c'est la pertinence, la structure des catégories, les mots-clés locaux et la régularité des avis. Et c'est exactement ce que nous mettons en place ensemble.
            </p>
          </div>

        </div>
      </section>

      {/* 5. PRÉSENTER LA SOLUTION (PDF ÉTAPE 5) */}
      <section className="py-16 md:py-20 bg-white border-b border-[#eee7da]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6">
          
          <div className="bg-gradient-to-br from-[#faf8f5] to-[#f4ede0] rounded-3xl border-2 border-[#18757d]/20 p-8 sm:p-12 shadow-lg space-y-8">
            
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#eee7da] pb-6">
              <div>
                <span className="text-xs font-black text-[#18757d] uppercase tracking-wider bg-white px-3 py-1 rounded-full border border-[#eee7da]">
                  La Solution Complète Clé en Main
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-[#332420] mt-2">
                  Formation Vidéo : Dominer sa Fiche Google Business Profile
                </h3>
              </div>
              <div className="text-right">
                <span className="text-xs text-[#5e4d46] font-bold uppercase tracking-wider block">Tarif Lancement</span>
                <div className="flex items-baseline gap-2">
                  <span className="text-3xl sm:text-4xl font-black text-[#18757d]">29 €</span>
                  <span className="text-lg line-through text-slate-400 font-bold">69 €</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
              <div className="space-y-4 text-sm sm:text-base text-[#5e4d46] leading-relaxed">
                <p className="font-semibold text-[#332420]">
                  Une méthode filmée pas-à-pas spécialement créée pour les créateurs, commerçants et professionnels indépendants :
                </p>
                <ul className="space-y-3">
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-[#18757d] shrink-0 mt-0.5" />
                    <span><strong>Simplicité absolue</strong> : des vidéos courtes de 5 à 10 minutes qui vont droit à l'essentiel.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-[#18757d] shrink-0 mt-0.5" />
                    <span><strong>Stratégie SEO locale</strong> : intégration des requêtes géolocalisées qui captent les acheteurs proches de toi.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-[#18757d] shrink-0 mt-0.5" />
                    <span><strong>Gain de temps maximal</strong> : tu n'as pas à chercher pendant des jours, la feuille de route est prête.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <CheckCircle2 className="w-5 h-5 text-[#18757d] shrink-0 mt-0.5" />
                    <span><strong>Accès instantané & à vie</strong> : revois les cours dès que tu souhaites mettre à jour tes offres.</span>
                  </li>
                </ul>
              </div>

              <div className="bg-white p-6 sm:p-8 rounded-2xl border border-[#eee7da] shadow-md text-center space-y-4">
                <div className="inline-block p-3 bg-amber-100 text-amber-900 rounded-2xl font-black text-xs uppercase tracking-wider">
                  🔥 Offre Spéciale Lancement
                </div>
                <div className="space-y-1">
                  <div className="text-4xl font-black text-[#332420]">29 €</div>
                  <p className="text-xs text-emerald-600 font-black">Économie immédiate de 40 € (-58%)</p>
                  <p className="text-[11px] text-slate-500">Valable jusqu'au 15 octobre 2026 à 23h59</p>
                </div>

                <button
                  onClick={scrollToCheckout}
                  className="w-full bg-[#18757d] hover:bg-[#135d64] text-white py-3.5 px-6 rounded-xl font-black text-sm uppercase tracking-wider transition-all shadow-md hover:scale-102 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Rejoindre la formation (29 €)</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <p className="text-[11px] text-slate-500 flex items-center justify-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                  Accès illimité 24/7 & Mises à jour incluses
                </p>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* 6. COMMENT ÇA MARCHE (PDF ÉTAPE 6) */}
      <section className="py-16 md:py-20 bg-[#faf8f5] border-b border-[#eee7da]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-12">
          
          <div className="text-center space-y-3">
            <span className="text-xs font-extrabold text-[#18757d] uppercase tracking-wider bg-[#e6f4f3] px-3.5 py-1 rounded-full border border-[#bce3e0]">
              Parcours Simple en 3 Étapes
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#332420] tracking-tight">
              Comment ça marche concrètement ?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 relative">
            
            <div className="bg-white p-7 rounded-3xl border border-[#eee7da] shadow-sm space-y-4 text-center relative flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-[#18757d] text-white font-black text-lg flex items-center justify-center mx-auto shadow-md">
                  1
                </div>
                <h3 className="text-lg font-black text-[#332420]">Tu accèdes aux vidéos</h3>
                <p className="text-xs sm:text-sm text-[#5e4d46] leading-relaxed">
                  Dès la validation de ta commande, tu reçois tes identifiants par e-mail et tu accèdes instantanément à ton espace membre sécurisé.
                </p>
              </div>
              <div className="pt-3 text-xs font-bold text-[#18757d] bg-[#e6f4f3] py-2 rounded-xl">
                ⚡ Action immédiate (2 min)
              </div>
            </div>

            <div className="bg-white p-7 rounded-3xl border border-[#eee7da] shadow-sm space-y-4 text-center relative flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-amber-500 text-white font-black text-lg flex items-center justify-center mx-auto shadow-md">
                  2
                </div>
                <h3 className="text-lg font-black text-[#332420]">Tu appliques clic-par-clic</h3>
                <p className="text-xs sm:text-sm text-[#5e4d46] leading-relaxed">
                  Tu suis les tutoriels vidéo écran partagé et tu ajustes tes catégories, ta description vendeuse, tes photos et tes avis.
                </p>
              </div>
              <div className="pt-3 text-xs font-bold text-amber-800 bg-amber-100 py-2 rounded-xl">
                🛠️ Transformation guidée (1h30)
              </div>
            </div>

            <div className="bg-white p-7 rounded-3xl border border-[#eee7da] shadow-sm space-y-4 text-center relative flex flex-col justify-between">
              <div className="space-y-4">
                <div className="w-12 h-12 rounded-2xl bg-emerald-600 text-white font-black text-lg flex items-center justify-center mx-auto shadow-md">
                  3
                </div>
                <h3 className="text-lg font-black text-[#332420]">Tu récoltes les clients</h3>
                <p className="text-xs sm:text-sm text-[#5e4d46] leading-relaxed">
                  Ta fiche gagne en visibilité dans le Pack Local Google Maps, tes demandes d'itinéraires et appels téléphoniques augmentent.
                </p>
              </div>
              <div className="pt-3 text-xs font-bold text-emerald-800 bg-emerald-100 py-2 rounded-xl">
                📈 Résultats durables
              </div>
            </div>

          </div>

          <div className="text-center pt-2">
            <button
              onClick={scrollToCheckout}
              className="inline-flex items-center gap-2 bg-[#18757d] hover:bg-[#135d64] text-white px-8 py-3.5 rounded-2xl text-sm font-black uppercase tracking-wider transition-all shadow-md hover:scale-103 cursor-pointer"
            >
              <span>Je commence l'étape 1 dès aujourd'hui (29 €)</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>

        </div>
      </section>

      {/* 7. POUR QUI C'EST FAIT ? (PDF ÉTAPE 7) */}
      <section className="py-16 md:py-20 bg-white border-b border-[#eee7da]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-10">
          
          <div className="text-center space-y-3">
            <span className="text-xs font-extrabold text-[#18757d] uppercase tracking-wider bg-[#e6f4f3] px-3.5 py-1 rounded-full border border-[#bce3e0]">
              Audience Ciblée
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#332420] tracking-tight">
              Cette formation est-elle faite pour toi ?
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            
            <div className="bg-emerald-50/70 border-2 border-emerald-200 rounded-3xl p-7 sm:p-9 space-y-5">
              <div className="flex items-center gap-2.5 text-emerald-800 font-black text-lg">
                <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                <span>Ce programme est fait pour toi si…</span>
              </div>
              <ul className="space-y-3 text-xs sm:text-sm text-emerald-950 font-medium leading-relaxed">
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5 font-bold" />
                  <span>Tu es <strong>artisan d'art ou du bâtiment</strong> (menuisier, céramiste, plombier, couturière, créateur de bijoux…).</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5 font-bold" />
                  <span>Tu as une <strong>boutique, un atelier ou un commerce local</strong> et tu veux que tes voisins te trouvent immédiatement.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5 font-bold" />
                  <span>Tu es <strong>thérapeute, coach, photographe ou prestataire</strong> intervenant auprès d'une clientèle locale.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5 font-bold" />
                  <span>Tu souhaites une solution efficace et autonome sans payer une agence 500 € chaque mois.</span>
                </li>
              </ul>
            </div>

            <div className="bg-slate-50 border-2 border-slate-200 rounded-3xl p-7 sm:p-9 space-y-5">
              <div className="flex items-center gap-2.5 text-slate-700 font-black text-lg">
                <X className="w-6 h-6 text-slate-400 shrink-0" />
                <span>Ce n'est PAS pour toi si…</span>
              </div>
              <ul className="space-y-3 text-xs sm:text-sm text-slate-600 font-medium leading-relaxed">
                <li className="flex items-start gap-2">
                  <span className="text-slate-400 font-bold">•</span>
                  <span>Tu cherches une recette magique sans vouloir consacrer 1 heure pour appliquer les recommandations.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-slate-400 font-bold">•</span>
                  <span>Tu fais exclusivement du dropshipping international sans aucune attache ni zone géographique en France.</span>
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-slate-400 font-bold">•</span>
                  <span>Tu préfères déléguer à une agence de communication et payer des forfaits mensuels coûteux.</span>
                </li>
              </ul>
            </div>

          </div>

        </div>
      </section>

      {/* 8. CE QUE LE CLIENT VA OBTENIR + BONUS (PDF ÉTAPE 8) */}
      <section className="py-16 md:py-20 bg-[#faf8f5] border-b border-[#eee7da]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 space-y-12">
          
          <div className="text-center space-y-3">
            <span className="text-xs font-extrabold text-[#18757d] uppercase tracking-wider bg-[#e6f4f3] px-3.5 py-1 rounded-full border border-[#bce3e0]">
              Programme Complet & Actionnable
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#332420] tracking-tight">
              Ce que tu vas obtenir dans la formation
            </h2>
            <p className="text-xs sm:text-sm text-[#5e4d46] max-w-2xl mx-auto leading-relaxed">
              Un programme 100% vidéo, structuré en <strong>7 modules pas-à-pas</strong> avec des partages d'écran concrets, des fiches PDF imprimables et une bibliothèque complète de <strong>prompts d'intelligence artificielle</strong>.
            </p>
          </div>

          {/* ACCORDÉON DES 7 MODULES */}
          <div className="space-y-4">
            {modules.map((mod: any, idx: number) => {
              const isOpen = openModule === idx;
              return (
                <div key={idx} className="bg-white rounded-2xl border border-[#eee7da] overflow-hidden shadow-2xs">
                  <button
                    onClick={() => setOpenModule(isOpen ? null : idx)}
                    className="w-full p-6 text-left flex items-center justify-between gap-4 hover:bg-[#faf8f5] transition-colors cursor-pointer"
                  >
                    <div className="flex items-center gap-3.5">
                      <div className="w-8 h-8 rounded-xl bg-[#e6f4f3] text-[#18757d] font-black text-sm flex items-center justify-center shrink-0">
                        {idx + 1}
                      </div>
                      <div>
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="text-base sm:text-lg font-black text-[#332420]">{mod.title}</h4>
                          {mod.badge && (
                            <span className="text-[10px] font-black bg-amber-400 text-[#332420] px-2 py-0.5 rounded-md uppercase tracking-wider">
                              {mod.badge}
                            </span>
                          )}
                        </div>
                        <span className="text-xs text-slate-500 font-semibold">{mod.duration} • {mod.lessons.length} leçons vidéo concrètes</span>
                      </div>
                    </div>
                    {isOpen ? <ChevronUp className="w-5 h-5 text-[#18757d]" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                  </button>

                  {isOpen && (
                    <div className="p-6 pt-0 border-t border-[#eee7da]/60 bg-gradient-to-b from-white to-[#faf8f5]/40 space-y-3">
                      {mod.lessons.map((lesson: string, lIdx: number) => (
                        <div key={lIdx} className="flex items-start gap-3 text-xs sm:text-sm text-[#5e4d46] py-1.5">
                          <PlayCircle className="w-4 h-4 text-[#18757d] shrink-0 mt-0.5" />
                          <span>{lesson}</span>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* POINT FORT : PROMPTS IA INCLUS */}
          <div className="p-6 sm:p-8 bg-gradient-to-r from-[#18757d] to-[#135d64] text-white rounded-3xl shadow-xl space-y-4">
            <div className="flex items-center gap-2.5">
              <Sparkles className="w-6 h-6 text-amber-300" />
              <span className="text-xs font-black uppercase tracking-wider text-amber-300 bg-white/10 px-3 py-1 rounded-full border border-white/20">
                🚀 Le Coup d'Accélérateur Inclus
              </span>
            </div>
            <h3 className="text-xl sm:text-2xl font-black text-white">
              Fini le syndrome de la page blanche : Prompts IA Rédacteurs Inclus
            </h3>
            <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed max-w-3xl">
              Tu ne sais pas quoi écrire pour te démarquer ? Nous te fournissons notre collection de <strong>prompts optimisés pour ChatGPT et Claude</strong>. Tu n'as qu'à copier-coller le prompt, renseigner ton métier et ta ville, et l'IA te génère :
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 pt-2 text-xs font-semibold text-white">
              <div className="bg-white/10 p-3 rounded-xl border border-white/15">
                ✨ Ta bio & description vendeuse de 750 caractères en 30 secondes
              </div>
              <div className="bg-white/10 p-3 rounded-xl border border-white/15">
                📦 Des fiches produits & prestations claires avec tarifs
              </div>
              <div className="bg-white/10 p-3 rounded-xl border border-white/15">
                💬 Des réponses personnalisées aux avis en 1 clic
              </div>
            </div>
          </div>

          {/* SECTION DES 3 VRAIS BONUS ISSUS DES PIÈCES JOINTES */}
          <div className="space-y-6 pt-4">
            <div className="text-center space-y-2">
              <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black bg-amber-400 text-[#332420] uppercase tracking-wider">
                <Gift className="w-4 h-4 text-[#332420]" />
                Inclus Gratuitement avec le Lancement
              </span>
              <h3 className="text-xl sm:text-2xl font-black text-[#332420]">
                3 Guides & Outils PDF Stratégiques Offerts (Valeur : 87 €)
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
              
              {/* BONUS 1 : SCRIPTS AVIS */}
              <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-5 space-y-3 relative flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="text-xs font-black text-amber-800 uppercase tracking-wider bg-amber-200/70 inline-block px-2.5 py-0.5 rounded-md">
                    Bonus 1 • Valeur 29 €
                  </div>
                  <h4 className="text-sm font-black text-amber-950">
                    Scripts Prêts à l'Emploi WhatsApp, SMS & Email "Avis 5 Étoiles"
                  </h4>
                  <p className="text-xs text-amber-900 leading-relaxed">
                    La méthode douce pour obtenir 5x plus d'avis sans jamais harceler vos clients. 4 scripts concrets (WhatsApp post-chantier/atelier, SMS court, Email de facture, Relance douce 7 jours) + la règle d'or des 24h-48h.
                  </p>
                </div>
                <div className="pt-2 text-[11px] font-bold text-amber-800 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                  PDF Téléchargeable & Copiable
                </div>
              </div>

              {/* BONUS 2 : KIT 10 MODÈLES DE RÉPONSES */}
              <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-5 space-y-3 relative flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="text-xs font-black text-amber-800 uppercase tracking-wider bg-amber-200/70 inline-block px-2.5 py-0.5 rounded-md">
                    Bonus 2 • Valeur 29 €
                  </div>
                  <h4 className="text-sm font-black text-amber-950">
                    Kit 10 Modèles de Réponses aux Avis Clients Google
                  </h4>
                  <p className="text-xs text-amber-900 leading-relaxed">
                    Modèles prêts à copier-coller pour valoriser chaque retour : 5 modèles pour avis positifs (sur-mesure, fidélité, reco) et 5 modèles pour désamorcer les retours délicats (délais, devis, avis suspect) tout en boostant ton SEO local.
                  </p>
                </div>
                <div className="pt-2 text-[11px] font-bold text-amber-800 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                  10 Modèles Prêts à l'Emploi
                </div>
              </div>

              {/* BONUS 3 : CHECKLIST 25 POINTS */}
              <div className="bg-amber-50/80 border border-amber-200 rounded-2xl p-5 space-y-3 relative flex flex-col justify-between">
                <div className="space-y-2">
                  <div className="text-xs font-black text-amber-800 uppercase tracking-wider bg-amber-200/70 inline-block px-2.5 py-0.5 rounded-md">
                    Bonus 3 • Valeur 29 €
                  </div>
                  <h4 className="text-sm font-black text-amber-950">
                    Checklist d'Audit Rapide Fiche Google en 25 Points
                  </h4>
                  <p className="text-xs text-amber-900 leading-relaxed">
                    25 points de contrôle stratégiques sur 5 piliers (Fondations, Visuels, Mots-clés, Avis, Routine 5 min/semaine) pour auditer ta fiche et t'assurer une visibilité maximale sans dépenser 1€ en publicité.
                  </p>
                </div>
                <div className="pt-2 text-[11px] font-bold text-amber-800 flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-amber-600" />
                  Checklist 25 Points Imprimable
                </div>
              </div>

            </div>
          </div>

          {/* TRANSFORMATION ATTENDUE */}
          <div className="p-6 sm:p-8 bg-[#18757d] text-white rounded-3xl text-center space-y-3 shadow-lg">
            <h4 className="text-lg sm:text-xl font-black">
              🎯 La Transformation Attendue :
            </h4>
            <p className="text-xs sm:text-sm text-emerald-100 max-w-2xl mx-auto leading-relaxed">
              « À la fin de cette formation, ta fiche Google sera parfaitement configurée, attractive, et te permettra d'attirer des clients qualifiés chaque semaine dans ta ville en totale autonomie. »
            </p>
          </div>

          <div className="text-center">
            <button
              onClick={scrollToCheckout}
              className="inline-flex items-center gap-2 bg-[#18757d] hover:bg-[#135d64] text-white px-8 py-4 rounded-2xl text-base font-black uppercase tracking-wider transition-all shadow-lg hover:scale-103 cursor-pointer"
            >
              <span>Je rejoins la formation (7 modules + 3 bonus) pour 29 €</span>
              <ArrowRight className="w-5 h-5" />
            </button>
          </div>

        </div>
      </section>

      {/* 9. PREUVES SOCIALES & RÉSULTATS CONCRETS (PDF ÉTAPE 9) */}
      <section className="py-16 md:py-20 bg-white border-b border-[#eee7da]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 space-y-12">
          
          <div className="text-center space-y-3">
            <span className="text-xs font-extrabold text-[#18757d] uppercase tracking-wider bg-[#e6f4f3] px-3.5 py-1 rounded-full border border-[#bce3e0]">
              Résultats Mesurables
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#332420] tracking-tight">
              Des résultats réels constatés sur le terrain
            </h2>
            <p className="text-xs sm:text-sm text-[#5e4d46] max-w-2xl mx-auto">
              Voici ce qui se produit lorsque les bons signaux sont envoyés à l'algorithme Google Maps :
            </p>
          </div>

          {/* INFOGRAPHIE RÉSULTATS & AVANT/APRÈS */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
            <div className="relative aspect-video w-full rounded-2xl overflow-hidden shadow-lg border-2 border-[#eee7da]">
              <Image
                src="/images/products/google-maps-stats-results.jpg"
                alt="Statistiques Google Maps et croissance locale"
                fill
                className="object-cover"
              />
            </div>

            <div className="space-y-4">
              <h3 className="text-xl font-black text-[#332420]">
                Le Tableau Comparatif Avant / Après
              </h3>

              <div className="space-y-3 text-xs sm:text-sm">
                <div className="p-3.5 bg-red-50 border border-red-200 rounded-xl flex items-start gap-2.5">
                  <span className="text-red-600 font-black">AVANT :</span>
                  <span className="text-red-950 font-medium">Fiche introuvable au-delà de la 10ème place, 2 avis anciens, zéro demande d'itinéraire et téléphone silencieux.</span>
                </div>

                <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl flex items-start gap-2.5">
                  <span className="text-emerald-700 font-black">APRÈS :</span>
                  <span className="text-emerald-950 font-medium">Présence dans le Top 3 du Pack Local Google Maps, flux continu d'avis 5 étoiles rassurants, hausse de +180% des appels clients locaux.</span>
                </div>
              </div>
            </div>
          </div>

          {/* TÉMOIGNAGES CLIENTS */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            {REAL_REVIEWS.map((rev) => (
              <div key={rev.id} className="bg-[#faf8f5] p-6 rounded-2xl border border-[#eee7da] shadow-2xs space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center gap-1 text-amber-500">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-xs sm:text-sm text-[#5e4d46] leading-relaxed italic">
                    {rev.quote}
                  </p>
                </div>

                <div className="pt-3 border-t border-[#eee7da]/80 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-[#18757d] text-white font-black text-xs flex items-center justify-center">
                    {rev.avatarInitials}
                  </div>
                  <div>
                    <h5 className="text-xs font-black text-[#332420]">{rev.author}</h5>
                    <p className="text-[11px] text-slate-500">{rev.role}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* 10. L'OFFRE ET LE PRIX (PDF ÉTAPE 10) */}
      <section className="py-16 md:py-20 bg-gradient-to-b from-[#faf8f5] via-[#f7f4ee] to-[#faf8f5] border-b border-[#eee7da]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-8 text-center">
          
          <div className="space-y-3">
            <span className="text-xs font-extrabold text-[#18757d] uppercase tracking-wider bg-[#e6f4f3] px-3.5 py-1 rounded-full border border-[#bce3e0]">
              Récapitulatif de l'offre
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#332420] tracking-tight">
              Tout ce qui est inclus dans ton pack :
            </h2>
          </div>

          <div className="bg-white rounded-3xl border-2 border-[#18757d]/30 p-8 sm:p-10 shadow-xl space-y-6 text-left">
            
            <div className="space-y-3 border-b border-[#eee7da] pb-6">
              <div className="flex items-center justify-between text-sm sm:text-base font-bold text-[#332420]">
                <span className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-[#18757d]" />
                  Formation Vidéo Complète 7 Modules (2h)
                </span>
                <span className="text-slate-400 line-through text-sm">69 €</span>
              </div>
              <div className="flex items-center justify-between text-sm sm:text-base font-bold text-[#332420]">
                <span className="flex items-center gap-2">
                  <Gift className="w-5 h-5 text-amber-500" />
                  Bonus 1 : Scripts WhatsApp, SMS & Email "Avis 5 Étoiles"
                </span>
                <span className="text-slate-400 line-through text-sm">29 €</span>
              </div>
              <div className="flex items-center justify-between text-sm sm:text-base font-bold text-[#332420]">
                <span className="flex items-center gap-2">
                  <Gift className="w-5 h-5 text-amber-500" />
                  Bonus 2 : Kit 10 Modèles de Réponses aux Avis Clients
                </span>
                <span className="text-slate-400 line-through text-sm">29 €</span>
              </div>
              <div className="flex items-center justify-between text-sm sm:text-base font-bold text-[#332420]">
                <span className="flex items-center gap-2">
                  <Gift className="w-5 h-5 text-amber-500" />
                  Bonus 3 : Checklist Audit Rapide Fiche Google (25 Points)
                </span>
                <span className="text-slate-400 line-through text-sm">29 €</span>
              </div>
              <div className="flex items-center justify-between text-sm sm:text-base font-bold text-[#332420]">
                <span className="flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-amber-500" />
                  Bonus 4 : Bibliothèque de Prompts IA Rédacteurs (ChatGPT/Claude)
                </span>
                <span className="text-slate-400 line-through text-sm">20 €</span>
              </div>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <span className="text-xs text-slate-500 uppercase tracking-wider block font-bold">Valeur totale perçue : <span className="line-through">176 €</span></span>
                <span className="text-xs text-red-600 font-extrabold">Tarif normal hors lancement : 69 €</span>
              </div>
              <div className="text-right">
                <span className="text-xs text-[#18757d] font-black uppercase tracking-wider block">Tarif Lancement Aujourd'hui</span>
                <span className="text-4xl font-black text-[#18757d]">29 €</span>
              </div>
            </div>

            {/* RÉASSURANCE ACCÈS IMMÉDIAT & SUPPORT */}
            <div className="p-4 bg-emerald-50 rounded-2xl border border-emerald-200 flex items-start gap-3">
              <ShieldCheck className="w-6 h-6 text-emerald-600 shrink-0 mt-0.5" />
              <div className="text-xs text-emerald-900 leading-relaxed font-medium">
                <strong>Accès Immédiat & Illimité à Vie :</strong> Visionne les 7 modules vidéo à ton rythme sur smartphone, tablette ou ordinateur. Toutes les futures actualisations du cursus et les bonus PDF restent accessibles sans aucun surcoût.
              </div>
            </div>

            <button
              onClick={scrollToCheckout}
              className="w-full bg-[#18757d] hover:bg-[#135d64] text-white py-4 px-6 rounded-2xl font-black text-base sm:text-lg uppercase tracking-wider transition-all shadow-lg hover:scale-102 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>Accéder au paiement sécurisé (29 €)</span>
              <ArrowRight className="w-5 h-5" />
            </button>

          </div>

        </div>
      </section>

      {/* 11. FAQ (PDF ÉTAPE 11) */}
      <section className="py-16 md:py-20 bg-white border-b border-[#eee7da]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 space-y-10">
          
          <div className="text-center space-y-3">
            <span className="text-xs font-extrabold text-[#18757d] uppercase tracking-wider bg-[#e6f4f3] px-3.5 py-1 rounded-full border border-[#bce3e0]">
              Questions Fréquentes
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#332420] tracking-tight">
              Des réponses simples et rassurantes
            </h2>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div key={idx} className="bg-[#faf8f5] rounded-2xl border border-[#eee7da] overflow-hidden">
                  <button
                    onClick={() => setOpenFaq(isOpen ? null : idx)}
                    className="w-full p-5 text-left flex items-center justify-between gap-4 hover:bg-[#f4ede0]/50 transition-colors cursor-pointer"
                  >
                    <span className="text-sm sm:text-base font-black text-[#332420] flex items-center gap-2.5">
                      <HelpCircle className="w-4 h-4 text-[#18757d]" />
                      {faq.q}
                    </span>
                    {isOpen ? <ChevronUp className="w-5 h-5 text-[#18757d]" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                  </button>
                  {isOpen && (
                    <div className="p-5 pt-0 text-xs sm:text-sm text-[#5e4d46] leading-relaxed border-t border-[#eee7da]/60">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>

        </div>
      </section>

      {/* 12. APPEL À L'ACTION ET MODULE DE PAIEMENT FINAL (PDF ÉTAPE 12) */}
      <section id="commander" className="py-16 md:py-24 bg-gradient-to-b from-[#faf8f5] via-[#eef7f6] to-[#e6f4f3] scroll-mt-12">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 space-y-8 text-center">
          
          <div className="space-y-3">
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black bg-amber-400 text-[#332420] uppercase tracking-wider">
              <Zap className="w-3.5 h-3.5" />
              Paiement Sécurisé & Accès Immédiat
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#332420] tracking-tight">
              Prends une longueur d'avance dans ta ville
            </h2>
            <p className="text-xs sm:text-sm text-[#5e4d46] max-w-lg mx-auto">
              Rappelle-toi : le tarif de lancement à <strong>29 € au lieu de 69 €</strong> prend fin le <strong>15 octobre 2026 à 23h59</strong>.
            </p>
          </div>

          {/* MODULE DE PAIEMENT STRIPE INTÉGRÉ AU TUNNEL */}
          <div className={`bg-white rounded-3xl border-2 ${isHighlighted ? 'border-[#18757d] ring-4 ring-[#18757d]/30 scale-101 shadow-2xl' : 'border-[#18757d] shadow-xl'} p-6 sm:p-10 space-y-6 text-left transition-all duration-500`}>
            
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#eee7da] pb-5">
              <div>
                <span className="inline-flex items-center gap-1.5 text-[11px] font-black uppercase tracking-wider bg-[#e6f4f3] text-[#18757d] px-2.5 py-0.5 rounded-md">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#18757d]" />
                  Paiement 100% Sécurisé Stripe
                </span>
                <h3 className="text-xl font-black text-[#332420] mt-1">Formation Fiche Google Business Profile</h3>
                <p className="text-xs text-slate-500 font-semibold">
                  {hasOrderBump
                    ? '7 Modules Vidéo HD • Prompts IA • 3 Bonus PDF • Calculateur de Score & 3 Quick Wins'
                    : '7 Modules Vidéo HD • Prompts IA Inclus • 3 Bonus PDF • Accès Immédiat à vie'}
                </p>
              </div>
              <div className="text-right">
                <span className="text-xs text-slate-400 line-through block font-bold">
                  {hasOrderBump ? '118,00 €' : '69,00 €'}
                </span>
                <span className="text-3xl font-black text-[#18757d]">{totalAmount},00 €</span>
              </div>
            </div>

            {/* BOX ORDER BUMP RECOMMANDÉ (12 €) */}
            <div
              onClick={() => setHasOrderBump(!hasOrderBump)}
              className={`p-5 rounded-2xl border-2 transition-all cursor-pointer select-none ${
                hasOrderBump
                  ? 'bg-amber-50/90 border-amber-500 shadow-md ring-2 ring-amber-400/30'
                  : 'bg-[#faf8f5] border-dashed border-[#18757d]/40 hover:border-[#18757d] hover:bg-amber-50/40'
              }`}
            >
              <div className="flex items-start gap-3.5">
                <input
                  type="checkbox"
                  checked={hasOrderBump}
                  onChange={() => {}}
                  className="w-5 h-5 rounded text-[#18757d] focus:ring-[#18757d] mt-1 shrink-0 cursor-pointer"
                />
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-wider bg-amber-400 text-[#332420] px-2.5 py-0.5 rounded-md">
                      <Zap className="w-3.5 h-3.5" />
                      Offre Unique • Order Bump
                    </span>
                    <div className="flex items-center gap-1.5">
                      <span className="text-xs text-slate-400 line-through font-bold">49 €</span>
                      <span className="text-sm font-black text-[#18757d] bg-white px-2 py-0.5 rounded-md border border-[#eee7da]">
                        +12,00 €
                      </span>
                    </div>
                  </div>
                  <h4 className="text-sm font-black text-[#332420]">
                    OUI ! J'ajoute l'Accès Illimité au Calculateur de Score &amp; Générateur de 3 Quick Wins Fiche Google
                  </h4>
                  <p className="text-xs text-[#5e4d46] leading-relaxed">
                    Entre simplement l'URL de ta fiche pour calculer instantanément ta note d'optimisation de 0 à 100 et débloquer tes 3 actions correctives prioritaires à fort impact pour dépasser tes concurrents locaux.
                  </p>
                </div>
              </div>
            </div>

            {/* FORMULAIRE DE PAIEMENT PAR CARTE DIRECT */}
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-black text-[#332420] uppercase tracking-wider mb-1.5">
                  Adresse e-mail (pour la réception instantanée des accès) :
                </label>
                <input
                  type="email"
                  placeholder="ex: marie.artisanat@gmail.com"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl border border-[#eee7da] bg-[#faf8f5] text-sm text-[#332420] font-medium focus:ring-2 focus:ring-[#18757d] focus:bg-white focus:outline-hidden transition-all"
                />
              </div>

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
                    <input
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
                    <input
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
                    <input
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

              {/* BOUTON DE VALIDATION DIRECTE */}
              <button
                onClick={handleDirectPayment}
                disabled={isLoading}
                className="w-full bg-[#18757d] hover:bg-[#135d64] text-white py-4 px-6 rounded-2xl font-black text-base sm:text-lg uppercase tracking-wider transition-all shadow-xl hover:scale-102 active:scale-98 disabled:opacity-60 flex items-center justify-center gap-3 cursor-pointer"
              >
                {isLoading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    Traitement sécurisé Stripe...
                  </span>
                ) : (
                  <>
                    <span>Payer {totalAmount},00 € et Accéder à la Formation</span>
                    <ArrowRight className="w-5 h-5" />
                  </>
                )}
              </button>

              <div className="text-center">
                <button
                  onClick={handleCheckout}
                  type="button"
                  className="text-xs text-slate-500 hover:text-[#18757d] underline transition-colors cursor-pointer"
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
                Cartes CB, Visa, Mastercard, Apple Pay
              </span>
              <span className="flex items-center gap-1">
                <FileCheck2 className="w-3.5 h-3.5 text-amber-600" />
                Facture et accès immédiats par email
              </span>
            </div>

          </div>

          {/* SIGNATURE / FONDATRICE */}
          <div className="pt-4 flex items-center justify-center gap-4 text-left max-w-md mx-auto">
            <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-[#18757d] shrink-0">
              <Image
                src="/images/stephanie.png"
                alt="Stéphanie Rocq - Formatrice et Fondatrice Guides Digitaux"
                fill
                className="object-cover"
              />
            </div>
            <div>
              <p className="text-xs text-[#5e4d46]">
                « J'ai hâte de t'accompagner pour faire décoller ta visibilité locale ! »
              </p>
              <h5 className="text-xs font-black text-[#332420]">Stéphanie Rocq • Fondatrice Guides Digitaux & Stratec Digital</h5>
            </div>
          </div>

        </div>
      </section>

      {/* FOOTER MINIMAL DE RÉASSURANCE */}
      <footer className="bg-white border-t border-[#eee7da] py-8 text-center text-xs text-[#5e4d46] space-y-3">
        <p>© 2026 Guides Digitaux - Tous droits réservés • Métropole Lilloise (Lille, Comines)</p>
        <div className="flex flex-wrap justify-center gap-4 font-bold text-slate-500">
          <Link href="/mentions-legales" className="hover:underline">Mentions Légales</Link>
          <Link href="/cgv" className="hover:underline">CGV</Link>
          <Link href="/politique-confidentialite" className="hover:underline">Politique de Confidentialité</Link>
          <Link href="/contact" className="hover:underline">Contact & Support</Link>
        </div>
      </footer>

    </div>
  );
}
