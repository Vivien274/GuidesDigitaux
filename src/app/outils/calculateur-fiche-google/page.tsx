'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { getUserPurchasesAsync, isSuperAdminEmail } from '@/lib/userPurchasesStore';
import {
  Sparkles,
  Gauge,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  TrendingUp,
  MapPin,
  Star,
  Zap,
  RotateCcw,
  Printer,
  ShieldCheck,
  ChevronRight,
  HelpCircle,
  Lightbulb,
  Award,
  Lock,
  Key,
  Mail,
  Check,
  Link as LinkIcon,
  Search,
  Sliders
} from 'lucide-react';

interface AuditResult {
  score: number;
  grade: string;
  statusColor: string;
  summary: string;
  isLiveApi?: boolean;
  placeName?: string;
  placeAddress?: string;
  googleMapsUri?: string;
  pillars: {
    title: string;
    score: number;
    max: number;
    status: 'good' | 'warning' | 'bad';
    feedback: string;
  }[];
  quickWins: {
    id: number;
    icon: string;
    title: string;
    impact: 'Élevé' | 'Très élevé' | 'Critique';
    time: string;
    action: string;
    moduleLink: string;
  }[];
}

function CalculateurFicheGoogleContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { user, isLoggedIn } = useAuth();

  // Contrôle d'accès membre
  const [isUnlocked, setIsUnlocked] = useState<boolean>(false);
  const [isCheckingAccess, setIsCheckingAccess] = useState<boolean>(true);
  const [unlockEmailInput, setUnlockEmailInput] = useState<string>('');
  const [unlockError, setUnlockError] = useState<string>('');
  const [unlockSuccess, setUnlockSuccess] = useState<boolean>(false);

  // Onglet de saisie actif : 'url' | 'search' | 'manual'
  const [searchMode, setSearchMode] = useState<'url' | 'search' | 'manual'>('url');

  // Champs de saisie
  const [urlInput, setUrlInput] = useState('');
  const [businessName, setBusinessName] = useState('');
  const [city, setCity] = useState('');
  const [category, setCategory] = useState('artisanat');
  const [reviewCount, setReviewCount] = useState<number | ''>('');
  const [rating, setRating] = useState<number | ''>('');
  const [photoCount, setPhotoCount] = useState<number | ''>('');
  const [hasDescription, setHasDescription] = useState<boolean>(true);
  const [hasRecentPost, setHasRecentPost] = useState<boolean>(true);
  const [hasWebsite, setHasWebsite] = useState<boolean>(true);

  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisStep, setAnalysisStep] = useState(0);
  const [result, setResult] = useState<AuditResult | null>(null);

  // 1. Vérification automatique de l'accès acheteur / superadmin
  useEffect(() => {
    async function verifyAccess() {
      setIsCheckingAccess(true);

      const token = searchParams.get('token');
      const sessionId = searchParams.get('session_id') || searchParams.get('sessionId');
      const authParam = searchParams.get('auth');
      const purchasedParam = searchParams.get('purchased');

      if (token || sessionId || authParam === 'granted' || purchasedParam === 'true') {
        setIsUnlocked(true);
        if (typeof window !== 'undefined') {
          localStorage.setItem('gd_unlocked_tool_google_calc', 'true');
        }
        setIsCheckingAccess(false);
        return;
      }

      if (typeof window !== 'undefined') {
        const storedUnlock = localStorage.getItem('gd_unlocked_tool_google_calc');
        if (storedUnlock === 'true') {
          setIsUnlocked(true);
          setIsCheckingAccess(false);
          return;
        }
      }

      const currentEmail = user?.email || (typeof window !== 'undefined' ? JSON.parse(localStorage.getItem('gd_auth_user') || '{}')?.email : null);

      if (currentEmail) {
        const cleanEmail = currentEmail.toLowerCase().trim();
        if (isSuperAdminEmail(cleanEmail) || user?.role === 'superadmin') {
          setIsUnlocked(true);
          if (typeof window !== 'undefined') {
            localStorage.setItem('gd_unlocked_tool_google_calc', 'true');
          }
          setIsCheckingAccess(false);
          return;
        }

        try {
          const purchases = await getUserPurchasesAsync(cleanEmail);
          const hasGoogleProduct = purchases?.some((p: any) => 
            p.id?.includes('google') || 
            p.slug?.includes('google') || 
            p.title?.toLowerCase().includes('google') ||
            p.id?.includes('calculateur') ||
            p.id?.includes('orderbump')
          );

          if (hasGoogleProduct) {
            setIsUnlocked(true);
            if (typeof window !== 'undefined') {
              localStorage.setItem('gd_unlocked_tool_google_calc', 'true');
            }
            setIsCheckingAccess(false);
            return;
          }
        } catch (e) {
          console.warn('Erreur vérification:', e);
        }
      }

      setIsUnlocked(false);
      setIsCheckingAccess(false);
    }

    verifyAccess();
  }, [user?.email, user?.role, searchParams]);

  // Déblocage manuel par e-mail
  const handleManualUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setUnlockError('');
    const emailToTest = unlockEmailInput.trim().toLowerCase();

    if (!emailToTest || !emailToTest.includes('@')) {
      setUnlockError('Veuillez saisir une adresse e-mail valide.');
      return;
    }

    try {
      if (isSuperAdminEmail(emailToTest)) {
        setUnlockSuccess(true);
        setIsUnlocked(true);
        if (typeof window !== 'undefined') {
          localStorage.setItem('gd_unlocked_tool_google_calc', 'true');
        }
        return;
      }

      const purchases = await getUserPurchasesAsync(emailToTest);
      const hasPurchased = purchases?.some((p: any) => 
        p.id?.includes('google') || 
        p.slug?.includes('google') || 
        p.title?.toLowerCase().includes('google') ||
        p.id?.includes('calculateur') ||
        p.id?.includes('orderbump')
      );

      if (hasPurchased) {
        setUnlockSuccess(true);
        setIsUnlocked(true);
        if (typeof window !== 'undefined') {
          localStorage.setItem('gd_unlocked_tool_google_calc', 'true');
        }
      } else {
        setUnlockError('Aucune commande de formation ou d\'outil Google trouvée avec cet e-mail.');
      }
    } catch (err) {
      setUnlockError('Erreur lors de la vérification.');
    }
  };

  // Exécution de l'audit
  const handleRunAudit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validation selon le mode choisi
    if (searchMode === 'url' && !urlInput.trim()) {
      alert('Veuillez coller le lien de votre fiche Google Maps.');
      return;
    }

    if (searchMode === 'search' && !businessName.trim()) {
      alert('Veuillez renseigner le nom de votre établissement.');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisStep(1);

    const step2Timer = setTimeout(() => setAnalysisStep(2), 600);
    const step3Timer = setTimeout(() => setAnalysisStep(3), 1200);

    try {
      let liveData = null;

      // En mode URL ou Recherche Nom, on appelle l'API Google Places en direct
      if (searchMode === 'url' || searchMode === 'search') {
        const query = searchMode === 'url' ? urlInput.trim() : `${businessName} ${city}`.trim();
        
        const response = await fetch('/api/google-places/audit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            query,
            url: urlInput.trim(),
            businessName: businessName.trim(),
            city: city.trim(),
            manualRating: rating,
            manualReviewCount: reviewCount,
            clientToken: 'authorized-buyer-token',
            userEmail: user?.email || unlockEmailInput || 'buyer'
          })
        });

        const resJson = await response.json();
        if (resJson.found && resJson.data) {
          liveData = resJson.data;
        }
      }

      await new Promise(resolve => setTimeout(resolve, 1600));

      if (liveData) {
        setReviewCount(liveData.ratingCount ?? '');
        setRating(liveData.rating ?? '');
        setPhotoCount(liveData.photoCount ?? 15);
        if (liveData.name) setBusinessName(liveData.name);
        if (liveData.address) setCity(liveData.address);

        setResult({
          score: liveData.score,
          grade: liveData.grade,
          statusColor: liveData.statusColor,
          summary: liveData.summary,
          isLiveApi: true,
          placeName: liveData.name,
          placeAddress: liveData.address,
          googleMapsUri: liveData.googleMapsUri,
          pillars: liveData.pillars,
          quickWins: liveData.quickWins
        });
      } else {
        // CALCUL ALGORTIHMQIUE EXACT POUR LE MODE MANUEL / SIMULATION
        const reviews = Number(reviewCount) || 0;
        const rate = Number(rating) || 5.0;
        const photos = Number(photoCount) || 15;

        // 1. Pilier Fondations & Complétude (sur 25)
        let pillar1Score = hasWebsite ? 25 : 18;

        // 2. Pilier Preuve Sociale & Avis Clients (sur 25)
        let pillar2Score = 0;
        if (reviews >= 20) pillar2Score = 20;
        else if (reviews >= 10) pillar2Score = 16;
        else if (reviews >= 5) pillar2Score = 12;
        else if (reviews >= 1) pillar2Score = 8;
        else pillar2Score = 0;

        if (reviews > 0) {
          if (rate >= 4.8) pillar2Score += 5;
          else if (rate >= 4.4) pillar2Score += 3;
          else if (rate >= 4.0) pillar2Score += 1;
        }
        pillar2Score = Math.min(25, pillar2Score);

        // 3. Pilier Visuels & Photos (sur 25)
        let pillar3Score = 8;
        if (photos >= 15) pillar3Score = 25;
        else if (photos >= 8) pillar3Score = 18;
        else if (photos >= 3) pillar3Score = 12;

        // 4. Pilier Description & Sémantique (sur 25)
        let pillar4Score = hasDescription ? (hasRecentPost ? 25 : 21) : 10;

        const finalScore = Math.min(Math.max(pillar1Score + pillar2Score + pillar3Score + pillar4Score, 20), 99);

        let grade = 'Critique (Risque élevé d\'invisibilité)';
        let statusColor = '#ef4444'; // rouge

        if (finalScore >= 85) {
          grade = 'Excellent (Top 3 Google Maps)';
          statusColor = '#10b981'; // vert
        } else if (finalScore >= 70) {
          grade = 'Bon potentiel (Optimisation recommandée)';
          statusColor = '#18757d'; // teal
        } else if (finalScore >= 50) {
          grade = 'Moyen (Perte importante de clients locaux)';
          statusColor = '#f59e0b'; // orange
        }

        const quickWinsList = [];

        if (reviews < 15 || rate < 4.8) {
          quickWinsList.push({
            id: 1,
            icon: '⭐',
            title: `Activer la récolte d'avis WhatsApp (${reviews} avis enregistrés)`,
            impact: 'Très élevé' as const,
            time: '3 minutes',
            action: `Votre fiche totalise ${reviews} avis (${rate}★). Envoyez notre modèle WhatsApp post-prestation à vos 5 derniers clients pour franchir le palier algorithmique supérieur.`,
            moduleLink: 'Module 6 : La Machine à Avis 5 Étoiles'
          });
        } else {
          quickWinsList.push({
            id: 1,
            icon: '💬',
            title: 'Répondre aux avis avec les mots-clés SEO de votre métier',
            impact: 'Élevé' as const,
            time: '3 minutes',
            action: `Excellente réputation avec ${reviews} avis (${rate}★) ! Intégrez vos mots-clés d'activité et votre ville dans chaque réponse aux avis pour doper votre indexation Google Maps.`,
            moduleLink: 'Module 6 : Réponses Stratégiques & SEO Avis'
          });
        }

        if (!hasDescription || finalScore < 85) {
          quickWinsList.push({
            id: 2,
            icon: '✍️',
            title: 'Injecter les prompts IA dans la description (750 caractères)',
            impact: 'Critique' as const,
            time: '2 minutes',
            action: `Régénérez votre bio en insérant vos mots-clés de savoir-faire couplés à "${city || 'votre zone géographique'}" pour remonter dans le Pack Local.`,
            moduleLink: 'Module 3 : Description & Bibliothèque de Prompts IA'
          });
        }

        if (photos < 15) {
          quickWinsList.push({
            id: 3,
            icon: '📸',
            title: 'Ajouter 5 photos géolocalisées de vos ateliers et créations',
            impact: 'Élevé' as const,
            time: '5 minutes',
            action: 'Google Vision AI privilégie les fiches avec photos réelles d\'ateliers, de réalisations récentes et de l\'artisane en action.',
            moduleLink: 'Module 4 : Photos Vendeuses & Google Vision AI'
          });
        }

        if (quickWinsList.length < 3 || !hasRecentPost) {
          quickWinsList.push({
            id: 4,
            icon: '📢',
            title: 'Publier 1 Post Google avec bouton d\'appel direct',
            impact: 'Élevé' as const,
            time: '2 minutes',
            action: 'Les fiches qui publient une actualité tous les 15 jours reçoivent un signal de fraîcheur algorithmique prioritaire.',
            moduleLink: 'Module 7 : Routine 5 min & Posts Google'
          });
        }

        setResult({
          score: finalScore,
          grade,
          statusColor,
          summary: `Score global calculé : ${finalScore}/100 pour ${businessName || 'votre établissement'} à ${city || 'votre commune'} (${reviews} avis enregistrés, note de ${rate}★). En appliquant les 3 actions ci-dessous, vous maximisez votre visibilité locale.`,
          isLiveApi: false,
          placeName: businessName || 'Votre Établissement',
          placeAddress: city || 'Localisation',
          pillars: [
            {
              title: 'Fondations & Coordonnées',
              score: pillar1Score,
              max: 25,
              status: pillar1Score >= 20 ? 'good' : 'warning',
              feedback: hasWebsite ? 'Site web et coordonnées correctement paramétrés.' : 'Ajoutez un site ou formulaire direct pour convertir vos visiteurs.'
            },
            {
              title: 'Preuve Sociale & Avis Clients',
              score: pillar2Score,
              max: 25,
              status: pillar2Score >= 20 ? 'good' : pillar2Score >= 12 ? 'warning' : 'bad',
              feedback: `${reviews} avis enregistrés avec une note de ${rate}★. ${reviews >= 20 ? 'Excellente réputation et réassurance client solide.' : 'Volume d\'avis encore perfectible pour distancer vos concurrents.'}`
            },
            {
              title: 'Visuels & Couverture Photo',
              score: pillar3Score,
              max: 25,
              status: pillar3Score >= 20 ? 'good' : pillar3Score >= 12 ? 'warning' : 'bad',
              feedback: `${photos} photos estimées. ${photos >= 15 ? 'Très bonne présence photo.' : 'Ajoutez régulièrement des clichés de vos ateliers et créations.'}`
            },
            {
              title: 'Sémantique & Fraîcheur des signaux',
              score: pillar4Score,
              max: 25,
              status: pillar4Score >= 20 ? 'good' : 'warning',
              feedback: hasDescription ? 'Description complète et signaux de fraîcheur actifs.' : 'Description incomplète : vous perdez des requêtes de recherche locale.'
            }
          ],
          quickWins: quickWinsList.slice(0, 3)
        });
      }
    } catch (err) {
      console.error('Erreur calcul audit:', err);
    } finally {
      clearTimeout(step2Timer);
      clearTimeout(step3Timer);
      setIsAnalyzing(false);
    }
  };

  const handleQuickRecalculate = () => {
    const reviews = Number(reviewCount) || 0;
    const rate = Number(rating) || 5.0;
    const photos = Number(photoCount) || 15;

    let pillar1Score = hasWebsite ? 25 : 18;

    let pillar2Score = 0;
    if (reviews >= 20) pillar2Score = 20;
    else if (reviews >= 10) pillar2Score = 16;
    else if (reviews >= 5) pillar2Score = 12;
    else if (reviews >= 1) pillar2Score = 8;
    else pillar2Score = 0;

    if (reviews > 0) {
      if (rate >= 4.8) pillar2Score += 5;
      else if (rate >= 4.4) pillar2Score += 3;
      else if (rate >= 4.0) pillar2Score += 1;
    }
    pillar2Score = Math.min(25, pillar2Score);

    let pillar3Score = 8;
    if (photos >= 15) pillar3Score = 25;
    else if (photos >= 8) pillar3Score = 18;
    else if (photos >= 3) pillar3Score = 12;

    let pillar4Score = hasDescription ? (hasRecentPost ? 25 : 21) : 10;

    const finalScore = Math.min(Math.max(pillar1Score + pillar2Score + pillar3Score + pillar4Score, 20), 99);

    let grade = 'Critique (Risque élevé d\'invisibilité)';
    let statusColor = '#ef4444';

    if (finalScore >= 85) {
      grade = 'Excellent (Top 3 Google Maps)';
      statusColor = '#10b981';
    } else if (finalScore >= 70) {
      grade = 'Bon potentiel (Optimisation recommandée)';
      statusColor = '#18757d';
    } else if (finalScore >= 50) {
      grade = 'Moyen (Perte importante de clients locaux)';
      statusColor = '#f59e0b';
    }

    const quickWinsList: AuditResult['quickWins'] = [];
    if (reviews < 15 || rate < 4.8) {
      quickWinsList.push({
        id: 1,
        icon: '⭐',
        title: `Activer la récolte d'avis WhatsApp (${reviews} avis enregistrés)`,
        impact: 'Très élevé' as const,
        time: '3 minutes',
        action: `Votre fiche totalise ${reviews} avis (${rate}★). Envoyez notre modèle WhatsApp post-prestation à vos 5 derniers clients pour franchir le palier algorithmique supérieur.`,
        moduleLink: 'Module 6 : La Machine à Avis 5 Étoiles'
      });
    } else {
      quickWinsList.push({
        id: 1,
        icon: '💬',
        title: 'Répondre aux avis avec les mots-clés SEO de votre métier',
        impact: 'Élevé' as const,
        time: '3 minutes',
        action: `Excellente réputation avec ${reviews} avis (${rate}★) ! Intégrez vos mots-clés d'activité et votre ville dans chaque réponse aux avis pour doper votre indexation Google Maps.`,
        moduleLink: 'Module 6 : Réponses Stratégiques & SEO Avis'
      });
    }

    if (!hasDescription || finalScore < 85) {
      quickWinsList.push({
        id: 2,
        icon: '✍️',
        title: 'Injecter les prompts IA dans la description (750 caractères)',
        impact: 'Critique' as const,
        time: '2 minutes',
        action: `Régénérez votre bio en insérant vos mots-clés de savoir-faire couplés à "${city || 'votre zone géographique'}" pour remonter dans le Pack Local.`,
        moduleLink: 'Module 3 : Description & Bibliothèque de Prompts IA'
      });
    }

    if (photos < 15) {
      quickWinsList.push({
        id: 3,
        icon: '📸',
        title: 'Ajouter 5 photos géolocalisées de vos ateliers et créations',
        impact: 'Élevé' as const,
        time: '5 minutes',
        action: 'Google Vision AI privilégie les fiches avec photos réelles d\'ateliers, de réalisations récentes et de l\'artisane en action.',
        moduleLink: 'Module 4 : Photos Vendeuses & Google Vision AI'
      });
    }

    if (quickWinsList.length < 3 || !hasRecentPost) {
      quickWinsList.push({
        id: 4,
        icon: '📢',
        title: 'Publier 1 Post Google avec bouton d\'appel direct',
        impact: 'Élevé' as const,
        time: '2 minutes',
        action: 'Les fiches qui publient une actualité tous les 15 jours reçoivent un signal de fraîcheur algorithmique prioritaire.',
        moduleLink: 'Module 7 : Routine 5 min & Posts Google'
      });
    }

    setResult(prev => ({
      ...prev!,
      score: finalScore,
      grade,
      statusColor,
      summary: `Score global actualisé : ${finalScore}/100 pour ${result?.placeName || businessName || 'votre établissement'} (${reviews} avis pris en compte, note de ${rate}★).`,
      pillars: [
        {
          title: 'Fondations & Coordonnées',
          score: pillar1Score,
          max: 25,
          status: pillar1Score >= 20 ? 'good' : 'warning',
          feedback: hasWebsite ? 'Site web et coordonnées correctement paramétrés.' : 'Ajoutez un site ou formulaire direct pour convertir vos visiteurs.'
        },
        {
          title: 'Preuve Sociale & Avis Clients',
          score: pillar2Score,
          max: 25,
          status: pillar2Score >= 20 ? 'good' : pillar2Score >= 12 ? 'warning' : 'bad',
          feedback: `${reviews} avis enregistrés avec une note de ${rate}★. ${reviews >= 20 ? 'Excellente réputation et réassurance client solide.' : 'Volume d\'avis encore perfectible pour distancer vos concurrents.'}`
        },
        {
          title: 'Visuels & Couverture Photo',
          score: pillar3Score,
          max: 25,
          status: pillar3Score >= 20 ? 'good' : pillar3Score >= 12 ? 'warning' : 'bad',
          feedback: `${photos} photos estimées. ${photos >= 15 ? 'Très bonne présence photo.' : 'Ajoutez régulièrement des clichés de vos ateliers et créations.'}`
        },
        {
          title: 'Sémantique & Fraîcheur des signaux',
          score: pillar4Score,
          max: 25,
          status: pillar4Score >= 20 ? 'good' : 'warning',
          feedback: hasDescription ? 'Description complète et signaux de fraîcheur actifs.' : 'Description incomplète : vous perdez des requêtes de recherche locale.'
        }
      ],
      quickWins: quickWinsList.slice(0, 3)
    }));
  };

  const handleReset = () => {
    setResult(null);
    setUrlInput('');
    setBusinessName('');
    setCity('');
    setReviewCount('');
    setRating('');
    setPhotoCount('');
  };

  if (isCheckingAccess) {
    return (
      <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center p-6">
        <div className="text-center space-y-4">
          <div className="w-12 h-12 border-4 border-[#18757d] border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs font-bold text-[#5e4d46] uppercase tracking-wider">
            Vérification de vos accès sécurisés en cours...
          </p>
        </div>
      </div>
    );
  }

  // ÉCRAN VERROUILLÉ POUR NON-ACHETEURS
  if (!isUnlocked) {
    return (
      <div className="min-h-screen bg-[#faf8f5] text-[#332420] font-sans flex flex-col justify-between">
        <header className="bg-white border-b border-[#eee7da] py-4 px-4 sm:px-8">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <Link href="/" className="relative h-9 w-40 block">
              <Image src="/images/logo.png" alt="Guides Digitaux" fill className="object-contain object-left" priority />
            </Link>
            <Link href="/mon-compte" className="text-xs font-bold text-slate-600 hover:text-[#18757d] flex items-center gap-1.5">
              <Lock className="w-3.5 h-3.5" />
              <span>Espace Membre</span>
            </Link>
          </div>
        </header>

        <main className="max-w-3xl mx-auto px-4 py-12 sm:py-16 text-center space-y-8 my-auto">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-amber-100 text-amber-900 text-xs font-black uppercase tracking-wider border border-amber-200">
            <Lock className="w-4 h-4 text-amber-700" />
            <span>Outil Exclusif Réservé aux Membres</span>
          </div>

          <div className="space-y-4">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#332420] tracking-tight leading-tight">
              Calculateur & Auditeur de Score <br />
              <span className="text-[#18757d]">Google Business Profile</span>
            </h1>
            <p className="text-sm sm:text-base text-[#5e4d46] max-w-xl mx-auto leading-relaxed">
              Cet outil d’audit connecté en temps réel à l’API Google Places est réservé aux acheteurs de la <strong>Formation Fiche Google</strong>.
            </p>
          </div>

          <div className="bg-white rounded-3xl border-2 border-[#18757d]/20 p-6 sm:p-8 shadow-xl text-left space-y-4">
            <h3 className="text-sm font-black text-[#332420] uppercase tracking-wider text-center sm:text-left">
              Ce que cet outil analyse pour vous en direct :
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#faf8f5] border border-[#eee7da]">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-xs text-[#332420] font-bold">Connexion API directe avec les serveurs Google Maps</span>
              </div>
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#faf8f5] border border-[#eee7da]">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-xs text-[#332420] font-bold">Calcul précis de l’indice de visibilité sur 100 points</span>
              </div>
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#faf8f5] border border-[#eee7da]">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-xs text-[#332420] font-bold">Génération immédiate de 3 Quick Wins stratégiques</span>
              </div>
              <div className="flex items-start gap-2.5 p-3 rounded-xl bg-[#faf8f5] border border-[#eee7da]">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <span className="text-xs text-[#332420] font-bold">Rapport d'audit imprimable pour suivre votre progression</span>
              </div>
            </div>

            <div className="pt-4 space-y-3">
              <Link
                href="/tunnel/formation-fiche-google#commander"
                className="w-full bg-[#18757d] hover:bg-[#135d64] text-white py-4 px-6 rounded-2xl font-black text-sm uppercase tracking-wider transition-all shadow-lg hover:scale-102 flex items-center justify-center gap-2"
              >
                <Zap className="w-4 h-4 text-amber-300" />
                <span>Débloquer l'accès avec la Formation (29 €)</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
              <p className="text-[11px] text-center text-slate-400 font-medium">
                Accès immédiat à vie • 7 Modules vidéo • Checklist 25 points • Prompts IA inclus
              </p>
            </div>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 text-left space-y-3 max-w-md mx-auto">
            <div className="flex items-center gap-2 text-xs font-black text-slate-700">
              <Key className="w-4 h-4 text-[#18757d]" />
              <span>Vous avez déjà commandé cette formation ?</span>
            </div>
            <form onSubmit={handleManualUnlock} className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="email"
                  value={unlockEmailInput}
                  onChange={(e) => setUnlockEmailInput(e.target.value)}
                  placeholder="Votre e-mail d'achat..."
                  className="w-full text-xs px-3.5 py-2.5 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#18757d] bg-white"
                />
                <button type="submit" className="bg-slate-800 hover:bg-slate-900 text-white text-xs font-bold px-4 py-2.5 rounded-xl shrink-0 cursor-pointer">
                  Débloquer
                </button>
              </div>
              {unlockError && <p className="text-[11px] text-red-600 font-medium">{unlockError}</p>}
            </form>
          </div>
        </main>

        <footer className="bg-white border-t border-[#eee7da] py-6 text-center text-xs text-slate-500">
          <p>© 2026 Guides Digitaux • Outil d'Audit Sécurisé • Réservé aux Membres</p>
        </footer>
      </div>
    );
  }

  // ÉCRAN DÉBLOQUÉ
  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#332420] font-sans">
      
      {/* HEADER DE L'OUTIL DÉBLOQUÉ */}
      <header className="bg-white border-b border-[#eee7da] py-4 px-4 sm:px-8">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <Link href="/" className="relative h-9 w-40 block">
            <Image src="/images/logo.png" alt="Guides Digitaux" fill className="object-contain object-left" priority />
          </Link>
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 text-xs font-black text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full border border-emerald-300">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              Accès Membre Actif
            </span>
            <Link href="/dashboard/eleve" className="text-xs font-black text-[#18757d] hover:underline hidden sm:inline">
              Mon Espace Élève →
            </Link>
          </div>
        </div>
      </header>

      {/* BANNIÈRE HERO */}
      <section className="py-10 sm:py-14 bg-gradient-to-b from-[#eef7f6] to-[#faf8f5] border-b border-[#eee7da]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-black uppercase tracking-wider border border-amber-200">
            <Sparkles className="w-3.5 h-3.5 text-amber-700" />
            <span>Audit Algorithmique Connecté à Google Places</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#332420] tracking-tight">
            Calculateur & Auditeur de <span className="text-[#18757d]">Score Google Maps</span>
          </h1>

          <p className="text-base sm:text-lg text-[#5e4d46] max-w-2xl mx-auto font-medium leading-relaxed">
            Scannez en direct les signaux de votre fiche Google Maps pour obtenir votre score sur 100 et vos <strong>3 Quick Wins prioritaires</strong>.
          </p>
        </div>
      </section>

      {/* MAIN CONTAINER */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 py-10 space-y-10">

        {/* FORMULAIRE DE CALCUL & SCAN */}
        {!result && !isAnalyzing && (
          <div className="bg-white rounded-3xl border-2 border-[#18757d]/20 p-6 sm:p-10 shadow-xl space-y-8">
            
            {/* SÉLECTEUR D'ONGLETS POUR LE MODE DE SAISIE */}
            <div className="flex flex-wrap bg-[#faf8f5] p-1.5 rounded-2xl border border-[#eee7da] gap-1">
              <button
                type="button"
                onClick={() => setSearchMode('url')}
                className={`flex-1 min-w-[140px] py-3 px-4 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  searchMode === 'url'
                    ? 'bg-[#18757d] text-white shadow-sm'
                    : 'text-slate-600 hover:text-[#18757d] hover:bg-white/60'
                }`}
              >
                <LinkIcon className="w-4 h-4" />
                <span>1. Lien Google Maps (Recommandé)</span>
              </button>

              <button
                type="button"
                onClick={() => setSearchMode('search')}
                className={`flex-1 min-w-[140px] py-3 px-4 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  searchMode === 'search'
                    ? 'bg-[#18757d] text-white shadow-sm'
                    : 'text-slate-600 hover:text-[#18757d] hover:bg-white/60'
                }`}
              >
                <Search className="w-4 h-4" />
                <span>2. Nom & Ville</span>
              </button>

              <button
                type="button"
                onClick={() => setSearchMode('manual')}
                className={`flex-1 min-w-[140px] py-3 px-4 rounded-xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 cursor-pointer ${
                  searchMode === 'manual'
                    ? 'bg-[#18757d] text-white shadow-sm'
                    : 'text-slate-600 hover:text-[#18757d] hover:bg-white/60'
                }`}
              >
                <Sliders className="w-4 h-4" />
                <span>3. Simulation Manuelle</span>
              </button>
            </div>

            <form onSubmit={handleRunAudit} className="space-y-6">
              
              {/* ONGLET 1 : LIEN GOOGLE MAPS DIRECT */}
              {searchMode === 'url' && (
                <div className="space-y-3 bg-[#f7faf9] p-6 rounded-2xl border border-[#bce3e0]">
                  <div className="space-y-1">
                    <label className="text-xs font-black uppercase tracking-wider text-[#18757d] flex items-center gap-1.5">
                      <Sparkles className="w-4 h-4 text-emerald-600" />
                      Lien direct de votre fiche Google Maps
                    </label>
                    <p className="text-xs text-slate-500">
                      Collez le lien de votre fiche (ex: <code>https://maps.app.goo.gl/...</code> ou <code>https://google.com/maps/place/...</code>).
                    </p>
                  </div>
                  <input
                    type="text"
                    value={urlInput}
                    onChange={(e) => setUrlInput(e.target.value)}
                    placeholder="https://maps.app.goo.gl/..."
                    className="w-full text-sm px-4 py-3.5 rounded-2xl border border-[#bce3e0] focus:outline-none focus:ring-2 focus:ring-[#18757d] bg-white font-medium"
                  />
                  <p className="text-[11px] text-slate-500">
                    💡 Astuce : Sur Google Maps, cliquez sur <strong>Partager</strong> &gt; <strong>Copier le lien</strong> puis collez-le ici.
                  </p>
                </div>
              )}

              {/* ONGLET 2 : RECHERCHE PAR NOM ET VILLE */}
              {searchMode === 'search' && (
                <div className="space-y-4 bg-[#faf8f5] p-6 rounded-2xl border border-[#eee7da]">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-black uppercase tracking-wider text-slate-700">
                        Nom commercial de l'établissement *
                      </label>
                      <input
                        type="text"
                        value={businessName}
                        onChange={(e) => setBusinessName(e.target.value)}
                        placeholder="Ex: Savonnerie Cyaness"
                        className="w-full text-sm px-4 py-3 rounded-2xl border border-[#eee7da] focus:outline-none focus:ring-2 focus:ring-[#18757d] bg-white font-medium"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-black uppercase tracking-wider text-slate-700">
                        Ville / Commune (ou Code Postal) *
                      </label>
                      <input
                        type="text"
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="Ex: Comines, Lille, Roubaix..."
                        className="w-full text-sm px-4 py-3 rounded-2xl border border-[#eee7da] focus:outline-none focus:ring-2 focus:ring-[#18757d] bg-white font-medium"
                      />
                    </div>
                  </div>

                  {/* Détails réels de la fiche pour les artisans / ateliers */}
                  <div className="space-y-3 pt-3 border-t border-[#eee7da]">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-black uppercase tracking-wider text-[#18757d] flex items-center gap-1.5">
                        <Star className="w-3.5 h-3.5 text-amber-500 fill-amber-400" />
                        Données visibles sur votre fiche Google :
                      </label>
                      <span className="text-[11px] text-slate-400 font-medium">Recommandé pour un calcul au point près</span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-600">
                          Nombre d'avis Google
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={reviewCount}
                          onChange={(e) => setReviewCount(e.target.value === '' ? '' : Number(e.target.value))}
                          placeholder="Ex: 26"
                          className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-[#eee7da] bg-white font-medium focus:ring-2 focus:ring-[#18757d]"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-600">
                          Note moyenne (/5)
                        </label>
                        <input
                          type="number"
                          step="0.1"
                          min="1"
                          max="5"
                          value={rating}
                          onChange={(e) => setRating(e.target.value === '' ? '' : Number(e.target.value))}
                          placeholder="Ex: 4.9"
                          className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-[#eee7da] bg-white font-medium focus:ring-2 focus:ring-[#18757d]"
                        />
                      </div>

                      <div className="space-y-1">
                        <label className="text-xs font-bold text-slate-600">
                          Photos publiées
                        </label>
                        <input
                          type="number"
                          min="0"
                          value={photoCount}
                          onChange={(e) => setPhotoCount(e.target.value === '' ? '' : Number(e.target.value))}
                          placeholder="Ex: 15"
                          className="w-full text-sm px-3.5 py-2.5 rounded-xl border border-[#eee7da] bg-white font-medium focus:ring-2 focus:ring-[#18757d]"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* ONGLET 3 : SIMULATION MANUELLE / AJUSTEMENTS */}
              {searchMode === 'manual' && (
                <div className="space-y-4 bg-[#faf8f5] p-6 rounded-2xl border border-[#eee7da]">
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-black uppercase tracking-wider text-slate-700">
                        Nombre d'avis Google
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={reviewCount}
                        onChange={(e) => setReviewCount(e.target.value === '' ? '' : Number(e.target.value))}
                        placeholder="Ex: 26"
                        className="w-full text-sm px-4 py-2.5 rounded-xl border border-[#eee7da] bg-white font-medium"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-black uppercase tracking-wider text-slate-700">
                        Note moyenne (/5)
                      </label>
                      <input
                        type="number"
                        step="0.1"
                        min="1"
                        max="5"
                        value={rating}
                        onChange={(e) => setRating(e.target.value === '' ? '' : Number(e.target.value))}
                        placeholder="Ex: 4.9"
                        className="w-full text-sm px-4 py-2.5 rounded-xl border border-[#eee7da] bg-white font-medium"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-black uppercase tracking-wider text-slate-700">
                        Nombre de photos
                      </label>
                      <input
                        type="number"
                        min="0"
                        value={photoCount}
                        onChange={(e) => setPhotoCount(e.target.value === '' ? '' : Number(e.target.value))}
                        placeholder="Ex: 15"
                        className="w-full text-sm px-4 py-2.5 rounded-xl border border-[#eee7da] bg-white font-medium"
                      />
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#eee7da] space-y-2">
                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={hasDescription}
                        onChange={(e) => setHasDescription(e.target.checked)}
                        className="w-4 h-4 rounded text-[#18757d] focus:ring-[#18757d]"
                      />
                      <span className="text-xs font-bold text-[#332420]">
                        Description détaillée rédigée sur la fiche
                      </span>
                    </label>

                    <label className="flex items-center gap-3 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={hasWebsite}
                        onChange={(e) => setHasWebsite(e.target.checked)}
                        className="w-4 h-4 rounded text-[#18757d] focus:ring-[#18757d]"
                      />
                      <span className="text-xs font-bold text-[#332420]">
                        Site web ou lien direct de commande renseigné
                      </span>
                    </label>
                  </div>
                </div>
              )}

              {/* BOUTON D'ACTION PRINCIPAL */}
              <button
                type="submit"
                className="w-full bg-[#18757d] hover:bg-[#135d64] text-white py-4 px-6 rounded-2xl font-black text-base uppercase tracking-wider transition-all shadow-lg hover:scale-102 flex items-center justify-center gap-2 cursor-pointer"
              >
                <Zap className="w-5 h-5 text-amber-300" />
                <span>
                  {searchMode === 'url' ? 'Scanner ma fiche Google Maps en direct' : 'Calculer mon score & afficher mes 3 Quick Wins'}
                </span>
                <ArrowRight className="w-5 h-5" />
              </button>

            </form>

          </div>
        )}

        {/* ÉCRAN DE CHARGEMENT ANIMÉ */}
        {isAnalyzing && (
          <div className="bg-white rounded-3xl border border-[#eee7da] p-12 text-center space-y-6 shadow-xl max-w-lg mx-auto">
            <div className="w-16 h-16 border-4 border-[#18757d] border-t-transparent rounded-full animate-spin mx-auto" />
            <div className="space-y-2">
              <h3 className="text-xl font-black text-[#332420]">Analyse de ta visibilité locale en cours...</h3>
              <p className="text-xs text-slate-500 font-semibold">
                {analysisStep === 1 && "Résolution du lien et interrogation de l'API Google Places..."}
                {analysisStep === 2 && "Calcul algorithmique des avis, photos et signaux de pertinence..."}
                {analysisStep === 3 && "Génération de tes 3 Quick Wins stratégiques personnalisés..."}
              </p>
            </div>
          </div>
        )}

        {/* ÉCRAN DES RÉSULTATS D'AUDIT */}
        {result && (
          <div className="space-y-8 animate-fadeIn">
            
            {/* SCORE HERO CARD */}
            <div className="bg-white rounded-3xl border-2 border-[#18757d]/30 p-6 sm:p-10 shadow-2xl space-y-8">
              
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-[#eee7da] pb-6">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-xs font-black uppercase tracking-wider bg-[#e6f4f3] text-[#18757d] px-3 py-1 rounded-full">
                      Rapport d'Audit Google Maps
                    </span>
                    {result.isLiveApi && (
                      <span className="text-xs font-bold bg-emerald-100 text-emerald-800 border border-emerald-300 px-2.5 py-0.5 rounded-full flex items-center gap-1">
                        <Sparkles className="w-3 h-3 text-emerald-600" />
                        Données vérifiées en direct (Google Places API)
                      </span>
                    )}
                  </div>
                  <h2 className="text-2xl sm:text-3xl font-black text-[#332420] mt-2">
                    {result.placeName || businessName || 'Votre Établissement'}
                  </h2>
                  <p className="text-xs text-slate-500 font-medium flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3.5 h-3.5 text-[#18757d]" />
                    {result.placeAddress || city || 'Localisation'}
                  </p>
                </div>
                <div className="flex items-center gap-2">
                  {result.googleMapsUri && (
                    <a
                      href={result.googleMapsUri}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="p-2.5 rounded-xl border border-[#18757d]/30 text-[#18757d] hover:bg-[#e6f4f3] text-xs font-bold flex items-center gap-1.5"
                    >
                      <MapPin className="w-4 h-4" />
                      <span className="hidden sm:inline">Voir sur Maps</span>
                    </a>
                  )}
                  <button
                    onClick={() => window.print()}
                    className="p-2.5 rounded-xl border border-slate-200 text-slate-600 hover:bg-slate-50 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <Printer className="w-4 h-4" />
                    <span>Imprimer</span>
                  </button>
                  <button
                    onClick={handleReset}
                    className="p-2.5 rounded-xl bg-slate-100 text-slate-700 hover:bg-slate-200 text-xs font-bold flex items-center gap-1.5 cursor-pointer"
                  >
                    <RotateCcw className="w-4 h-4" />
                    <span>Nouveau test</span>
                  </button>
                </div>
              </div>

              {/* JAUGE DE SCORE */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center">
                
                <div className="text-center p-6 bg-[#faf8f5] rounded-3xl border border-[#eee7da] space-y-2">
                  <span className="text-xs font-black text-slate-500 uppercase tracking-wider">Score d'Optimisation</span>
                  <div className="text-5xl sm:text-6xl font-black" style={{ color: result.statusColor }}>
                    {result.score}
                    <span className="text-2xl text-slate-400 font-normal">/100</span>
                  </div>
                  <div className="text-xs font-extrabold px-3 py-1 rounded-full inline-block" style={{ backgroundColor: `${result.statusColor}20`, color: result.statusColor }}>
                    {result.grade}
                  </div>
                </div>

                <div className="md:col-span-2 space-y-4">
                  <h3 className="text-lg font-black text-[#332420]">Diagnostic Global :</h3>
                  <p className="text-xs sm:text-sm text-[#5e4d46] leading-relaxed">
                    {result.summary}
                  </p>
                  
                  {/* BARRE DE PROGRESSION VISUELLE */}
                  <div className="space-y-1.5">
                    <div className="flex justify-between text-xs font-bold text-slate-500">
                      <span>Niveau de visibilité locale</span>
                      <span>{result.score}%</span>
                    </div>
                    <div className="w-full h-3.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
                      <div
                        className="h-full rounded-full transition-all duration-1000"
                        style={{
                          width: `${result.score}%`,
                          backgroundColor: result.statusColor
                        }}
                      />
                    </div>
                  </div>
                </div>

              </div>

              {/* SECTION AJUSTEMENT RAPIDE DES DONNÉES EN DIRECT */}
              <div className="bg-[#faf8f5] p-5 rounded-2xl border border-[#eee7da] space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="text-xs font-black uppercase tracking-wider text-[#18757d] flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5" />
                    Ajuster vos chiffres (Avis, Note, Photos) & recalculer en direct :
                  </span>
                </div>
                
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <label className="text-[11px] font-bold text-slate-600">Avis Google</label>
                    <input
                      type="number"
                      min="0"
                      value={reviewCount}
                      onChange={(e) => setReviewCount(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="Ex: 26"
                      className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 bg-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600">Note (/5)</label>
                    <input
                      type="number"
                      step="0.1"
                      min="1"
                      max="5"
                      value={rating}
                      onChange={(e) => setRating(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="Ex: 4.9"
                      className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 bg-white font-bold"
                    />
                  </div>
                  <div>
                    <label className="text-[11px] font-bold text-slate-600">Photos</label>
                    <input
                      type="number"
                      min="0"
                      value={photoCount}
                      onChange={(e) => setPhotoCount(e.target.value === '' ? '' : Number(e.target.value))}
                      placeholder="Ex: 15"
                      className="w-full text-xs px-3 py-2 rounded-xl border border-slate-300 bg-white font-bold"
                    />
                  </div>
                  <div className="flex items-end">
                    <button
                      type="button"
                      onClick={handleQuickRecalculate}
                      className="w-full bg-[#18757d] hover:bg-[#135d64] text-white py-2 px-3 rounded-xl font-black text-xs uppercase tracking-wider transition-all shadow-sm cursor-pointer"
                    >
                      ⚡ Recalculer
                    </button>
                  </div>
                </div>
              </div>

              {/* LES 4 PILIERS DE CONTRÔLE */}
              <div className="space-y-4 pt-4 border-t border-[#eee7da]">
                <h3 className="text-base font-black text-[#332420] uppercase tracking-wider">
                  Détail par Pilier Stratégique :
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {result.pillars.map((pillar, pIdx) => (
                    <div key={pIdx} className="p-4 rounded-2xl border border-[#eee7da] bg-[#faf8f5] space-y-2">
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-black text-[#332420]">{pillar.title}</span>
                        <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-white border border-slate-200 text-[#18757d]">
                          {pillar.score} / {pillar.max}
                        </span>
                      </div>
                      <p className="text-xs text-[#5e4d46] leading-relaxed">
                        {pillar.feedback}
                      </p>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* SECTION 3 QUICK WINS SUR-MESURE */}
            <div className="bg-gradient-to-br from-[#18757d] to-[#135d64] text-white rounded-3xl p-6 sm:p-10 shadow-2xl space-y-6">
              
              <div className="space-y-2">
                <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider bg-amber-400 text-[#332420] px-3 py-1 rounded-full">
                  <Zap className="w-3.5 h-3.5" />
                  Plan d'Action Immédiat
                </span>
                <h3 className="text-2xl sm:text-3xl font-black text-white">
                  Tes 3 Quick Wins Prioritaires
                </h3>
                <p className="text-xs sm:text-sm text-emerald-100">
                  Voici les 3 actions correctives les plus rentables pour faire monter ton score et doubler tes contacts :
                </p>
              </div>

              <div className="space-y-4">
                {result.quickWins.map((qw, qIdx) => (
                  <div key={qIdx} className="bg-white/10 border border-white/20 rounded-2xl p-5 space-y-3 backdrop-blur-xs">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="text-lg">{qw.icon}</span>
                        <h4 className="text-sm sm:text-base font-black text-white">
                          Action #{qIdx + 1} : {qw.title}
                        </h4>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-extrabold bg-amber-400 text-[#332420] px-2.5 py-0.5 rounded-md uppercase">
                          Impact {qw.impact}
                        </span>
                        <span className="text-[11px] font-bold text-emerald-200 bg-black/20 px-2 py-0.5 rounded-md">
                          ⏱️ {qw.time}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-emerald-100 leading-relaxed font-medium">
                      {qw.action}
                    </p>

                    <div className="pt-2 flex items-center justify-between text-xs text-amber-300 font-bold border-t border-white/10">
                      <span>Tutoriel pas-à-pas disponible dans :</span>
                      <span className="underline decoration-amber-400">{qw.moduleLink}</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* CALL TO ACTION POUR APPLIQUER VIA LA FORMATION */}
              <div className="p-6 bg-white text-[#332420] rounded-2xl text-center space-y-4 shadow-lg">
                <h4 className="text-base sm:text-lg font-black text-[#332420]">
                  Tu veux corriger ces points et atteindre 95+/100 dès cette semaine ?
                </h4>
                <p className="text-xs sm:text-sm text-[#5e4d46] max-w-xl mx-auto">
                  La formation complète t'accompagne écran partagé avec les modèles de réponses, la checklist en 25 points et tous les prompts IA prêts à copier-coller.
                </p>
                <Link
                  href="/tunnel/formation-fiche-google#commander"
                  className="inline-flex items-center gap-2 bg-[#18757d] hover:bg-[#135d64] text-white px-8 py-3.5 rounded-xl font-black text-sm uppercase tracking-wider transition-all shadow-md hover:scale-102"
                >
                  <span>Appliquer les corrections avec la formation (29 €)</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

            </div>

          </div>
        )}

      </main>

      {/* FOOTER */}
      <footer className="bg-white border-t border-[#eee7da] py-6 text-center text-xs text-slate-500">
        <p>© 2026 Guides Digitaux • Outil d'Audit & Calculateur Fiche Google Business</p>
      </footer>

    </div>
  );
}

export default function CalculateurFicheGooglePage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center p-6">
        <div className="w-12 h-12 border-4 border-[#18757d] border-t-transparent rounded-full animate-spin" />
      </div>
    }>
      <CalculateurFicheGoogleContent />
    </Suspense>
  );
}
