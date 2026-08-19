'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  Sparkles, 
  ArrowRight, 
  ArrowLeft, 
  CheckCircle2, 
  Mail, 
  Rocket, 
  HelpCircle, 
  RotateCcw,
  BookOpen,
  GraduationCap,
  Lock,
  ChevronRight
} from 'lucide-react';

export interface QuizQuestion {
  id: number;
  title: string;
  options: { key: string; text: string }[];
}

export const QUIZ_QUESTIONS: QuizQuestion[] = [
  {
    id: 1,
    title: "Aujourd'hui, comment tes clients te trouvent ?",
    options: [
      { key: 'A', text: "Principalement le bouche-à-oreille" },
      { key: 'B', text: "J'ai une page Facebook ou Instagram" },
      { key: 'C', text: "J'ai une fiche Google mais pas de site" },
      { key: 'D', text: "J'ai déjà un site mais il est vieillot" }
    ]
  },
  {
    id: 2,
    title: "Qu'est-ce qui te manque le plus en ce moment ?",
    options: [
      { key: 'A', text: "Des clients qui me contactent spontanément" },
      { key: 'B', text: "Une image pro qui inspire confiance" },
      { key: 'C', text: "Être trouvé(e) sur Google" },
      { key: 'D', text: "Un endroit pour présenter mes tarifs et services" }
    ]
  },
  {
    id: 3,
    title: "Face à la technologie, tu es plutôt...",
    options: [
      { key: 'A', text: "J'évite, ça me stresse" },
      { key: 'B', text: "Je me débrouille mais sans plus" },
      { key: 'C', text: "Je suis curieux/se et j'apprends vite" },
      { key: 'D', text: "À l'aise, j'aime bidouiller" }
    ]
  },
  {
    id: 4,
    title: "Tu peux consacrer combien de temps par semaine à créer ton site ?",
    options: [
      { key: 'A', text: "Moins d'1 heure" },
      { key: 'B', text: "1 à 3 heures" },
      { key: 'C', text: "3 à 5 heures" },
      { key: 'D', text: "Plus de 5 heures" }
    ]
  },
  {
    id: 5,
    title: "Ce qui t'a empêché(e) de créer ton site jusqu'ici ?",
    options: [
      { key: 'A', text: "Je ne sais pas par où commencer" },
      { key: 'B', text: "J'ai peur de faire des erreurs" },
      { key: 'C', text: "Je pensais que c'était trop cher" },
      { key: 'D', text: "Je manque de temps" }
    ]
  },
  {
    id: 6,
    title: "Dans 3 mois, ton site idéal ressemble à quoi ?",
    options: [
      { key: 'A', text: "Un site simple qui présente mon activité" },
      { key: 'B', text: "Un site avec mes tarifs et un formulaire de contact" },
      { key: 'C', text: "Un site pro avec blog et référencement Google" },
      { key: 'D', text: "Une vraie boutique en ligne" }
    ]
  }
];

const isValidEmail = (emailStr: string): boolean => {
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  return emailRegex.test(emailStr.trim());
};

export default function DigitalizationQuiz() {
  const [currentStep, setCurrentStep] = useState<number>(0); // 0: intro, 1-6: Q1-Q6, 7: email, 8: result
  const [answers, setAnswers] = useState<Record<number, string>>({});
  const [email, setEmail] = useState('');
  const [emailError, setEmailError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [profileResult, setProfileResult] = useState<'A' | 'B' | 'C' | null>(null);

  const handleSelectOption = (questionId: number, optionKey: string) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionKey }));
    setTimeout(() => {
      if (questionId < 6) {
        setCurrentStep(questionId + 1);
      } else {
        setCurrentStep(7); // Go to email capture step
      }
    }, 300);
  };

  const computeProfile = (): 'A' | 'B' | 'C' => {
    const q3 = answers[3];
    const q4 = answers[4];
    if ((q3 === 'C' || q3 === 'D') && (q4 === 'C' || q4 === 'D')) return 'A';
    if (q3 === 'A' && q4 === 'A') return 'C';
    return 'B';
  };

  const handleSubmitEmail = async (e: React.FormEvent) => {
    e.preventDefault();
    const cleanEmail = email.trim();

    if (!cleanEmail) {
      setEmailError('Veuillez renseigner votre adresse e-mail.');
      return;
    }

    if (!isValidEmail(cleanEmail)) {
      setEmailError('Veuillez saisir une adresse e-mail valide (ex: contact@exemple.fr).');
      return;
    }

    setEmailError(null);
    setIsSubmitting(true);
    const computed = computeProfile();
    setProfileResult(computed);

    // Save in localStorage
    if (typeof window !== 'undefined') {
      try {
        const stored = JSON.parse(localStorage.getItem('gd_quiz_participants') || '[]');
        stored.push({
          id: Date.now(),
          date: new Date().toLocaleDateString('fr-FR'),
          email: cleanEmail,
          profile: computed,
          answers
        });
        localStorage.setItem('gd_quiz_participants', JSON.stringify(stored));
      } catch (err) {
        console.error(err);
      }
    }

    // Call API route
    try {
      await fetch('/api/quiz/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: cleanEmail, profile: computed })
      });
    } catch (err) {
      console.error('Quiz subscribe error', err);
    } finally {
      setIsSubmitting(false);
      setCurrentStep(8); // Go to result screen
    }
  };

  const handleReset = () => {
    setCurrentStep(0);
    setAnswers({});
    setEmail('');
    setEmailError(null);
    setProfileResult(null);
  };

  const progressPercent = currentStep === 0 ? 0 : Math.min(100, Math.round((currentStep / 7) * 100));

  return (
    <div className="w-full bg-[#FAF8F5] text-[#332420] rounded-3xl border-2 border-[#eee7da] shadow-xl overflow-hidden my-6">
      
      {/* TOP PROGRESS BAR */}
      <div className="w-full h-2 bg-[#eee7da]">
        <div 
          className="h-full bg-[#F2542D] transition-all duration-500 ease-out"
          style={{ width: `${progressPercent}%` }}
        />
      </div>

      <div className="p-6 sm:p-10 md:p-12 max-w-3xl mx-auto">
        
        {/* STEP HEADER INDICATOR */}
        {currentStep >= 1 && currentStep <= 6 && (
          <div className="flex items-center justify-between text-xs font-extrabold text-[#18757d] uppercase tracking-wider mb-6">
            <span className="flex items-center gap-1.5 bg-[#e6f4f3] px-3 py-1 rounded-full">
              Question {currentStep} sur 6
            </span>
            {currentStep > 1 && (
              <button 
                onClick={() => setCurrentStep(prev => prev - 1)}
                className="text-[#5e4d46] hover:text-[#18757d] flex items-center gap-1 transition-colors cursor-pointer font-bold"
              >
                <ArrowLeft className="w-4 h-4" />
                Question précédente
              </button>
            )}
          </div>
        )}

        {/* STEP 0 : INTRO */}
        {currentStep === 0 && (
          <div className="text-center space-y-6 py-4">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-extrabold bg-[#e6f4f3] text-[#18757d] uppercase tracking-wider border border-[#18757d]/20 shadow-2xs">
              <Sparkles className="w-4 h-4 text-[#F2542D]" />
              Quiz gratuit — Diagnostic Digital
            </span>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-[#332420] tracking-tight leading-tight">
              Mon site web, <span className="text-[#18757d]">c'est pour moi ?</span>
            </h2>

            <p className="text-sm sm:text-base text-[#5e4d46] font-semibold max-w-xl mx-auto leading-relaxed">
              Découvre en <strong>2 minutes chrono</strong> si tu es prêt(e) à te lancer — et obtiens la feuille de route idéale adaptée à ta situation et ton rythme.
            </p>

            <div className="pt-4">
              <button
                onClick={() => setCurrentStep(1)}
                className="px-8 py-5 text-sm sm:text-base font-extrabold text-white bg-[#F2542D] hover:bg-[#d8441f] rounded-full shadow-xl uppercase tracking-wider transition-all transform hover:scale-105 inline-flex items-center gap-2 cursor-pointer"
              >
                <span>COMMENCER LE QUIZ GRATUIT</span>
                <ArrowRight className="w-5 h-5" />
              </button>
            </div>

            <div className="pt-2 flex flex-wrap items-center justify-center gap-4 text-xs text-[#5e4d46] font-bold">
              <span>🎯 6 questions simples</span>
              <span>•</span>
              <span>⚡️ 2 minutes chrono</span>
              <span>•</span>
              <span>🔒 100% Gratuit & Confidentiel</span>
            </div>
          </div>
        )}

        {/* STEPS 1 to 6 : QUESTIONS */}
        {currentStep >= 1 && currentStep <= 6 && (
          <div className="space-y-6 py-2">
            <h3 className="text-xl sm:text-2xl font-extrabold text-[#332420] leading-snug">
              {QUIZ_QUESTIONS[currentStep - 1].title}
            </h3>

            <div className="grid grid-cols-1 gap-3">
              {QUIZ_QUESTIONS[currentStep - 1].options.map(opt => {
                const isSelected = answers[currentStep] === opt.key;
                return (
                  <button
                    key={opt.key}
                    onClick={() => handleSelectOption(currentStep, opt.key)}
                    className={`w-full p-4 sm:p-5 rounded-2xl border-2 text-left font-semibold text-xs sm:text-sm transition-all flex items-center gap-4 cursor-pointer ${
                      isSelected
                        ? 'border-[#F2542D] bg-[#FDE8E3] text-[#332420] shadow-md'
                        : 'border-[#eee7da] bg-white hover:border-[#18757d] hover:bg-[#e6f4f3]/50 text-[#332420]'
                    }`}
                  >
                    <span className={`w-8 h-8 rounded-xl font-extrabold text-xs flex items-center justify-center shrink-0 transition-colors ${
                      isSelected 
                        ? 'bg-[#F2542D] text-white' 
                        : 'bg-[#faf8f5] text-[#18757d] border border-[#eee7da]'
                    }`}>
                      {opt.key}
                    </span>
                    <span className="flex-1">{opt.text}</span>
                    <ChevronRight className={`w-4 h-4 transition-transform ${isSelected ? 'text-[#F2542D] translate-x-1' : 'text-slate-300'}`} />
                  </button>
                );
              })}
            </div>
          </div>
        )}

        {/* STEP 7 : EMAIL CAPTURE */}
        {currentStep === 7 && (
          <div className="text-center space-y-6 py-4">
            <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-extrabold bg-amber-100 text-amber-900 uppercase tracking-wider border border-amber-200">
              🎯 Tu y es presque !
            </span>

            <h3 className="text-2xl sm:text-3xl font-extrabold text-[#332420] leading-snug">
              Où envoyer <span className="text-[#18757d]">ton résultat ?</span>
            </h3>

            <p className="text-xs sm:text-sm text-[#5e4d46] font-semibold max-w-md mx-auto leading-relaxed">
              Entre ton adresse email ci-dessous pour débloquer immédiatement ton profil personnalisé et recevoir tes recommandations pas à pas.
            </p>

            <form onSubmit={handleSubmitEmail} className="max-w-md mx-auto space-y-4 pt-2">
              <div className="space-y-2">
                <div className="relative">
                  <Mail className={`w-5 h-5 absolute left-4 top-1/2 -translate-y-1/2 transition-colors ${emailError ? 'text-rose-500' : 'text-slate-400'}`} />
                  <input
                    type="email"
                    required
                    pattern="[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$"
                    value={email}
                    onChange={e => {
                      setEmail(e.target.value);
                      if (emailError) setEmailError(null);
                    }}
                    placeholder="ton@email.com"
                    className={`w-full pl-12 pr-4 py-4 bg-white border-2 text-[#332420] placeholder:text-slate-400 font-semibold text-sm rounded-2xl focus:outline-none shadow-inner transition-colors ${
                      emailError 
                        ? 'border-rose-500 focus:border-rose-600 bg-rose-50/30' 
                        : 'border-[#eee7da] focus:border-[#18757d]'
                    }`}
                  />
                </div>

                {emailError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-xs text-rose-700 font-bold text-left flex items-center gap-2 animate-in fade-in duration-200">
                    <span className="shrink-0 text-rose-500">⚠️</span>
                    <span>{emailError}</span>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 text-sm font-extrabold text-white bg-[#F2542D] hover:bg-[#d8441f] rounded-2xl shadow-lg uppercase tracking-wider transition-transform hover:scale-[1.02] flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? 'Calcul en cours...' : 'DÉBLOQUER MON RÉSULTAT →'}
              </button>

              <p className="text-[11px] text-slate-500 font-medium">
                🔒 Données confidentielles. Format e-mail vérifié. Désinscription en 1 clic.
              </p>
            </form>
          </div>
        )}

        {/* STEP 8 : TAILORED RESULT SCREEN */}
        {currentStep === 8 && profileResult && (
          <div className="space-y-6 text-center py-2">
            
            {profileResult === 'A' && (
              <div className="space-y-6">
                <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto text-3xl shadow-sm">
                  🚀
                </div>
                <div className="space-y-2">
                  <span className="px-3.5 py-1 bg-emerald-100 text-emerald-800 rounded-full text-xs font-black uppercase tracking-wider">
                    Profil A — Prête à décoller !
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-[#332420]">
                    Tu as le profil de la fonceuse !
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5e4d46] font-semibold max-w-lg mx-auto leading-relaxed">
                    Tu as la motivation, le temps nécessaire et l'envie d'avancer. Tu as compris qu'un vrai site web est la clé pour ne plus dépendre uniquement du bouche-à-oreille.
                  </p>
                </div>

                <div className="p-6 bg-white rounded-3xl border-2 border-[#18757d]/30 text-left space-y-4 shadow-md max-w-lg mx-auto">
                  <h4 className="text-sm font-extrabold text-[#18757d] flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Ta Recommandation Sur-Mesure :
                  </h4>
                  <p className="text-xs text-[#5e4d46] leading-relaxed font-semibold">
                    Il ne te manque qu'une feuille de route claire pour construire ton site vitrine ou ta boutique e-commerce sans perdre des semaines sur du jargon.
                  </p>
                  <div className="pt-2 flex flex-col sm:flex-row gap-3">
                    <Link
                      href="/produit/formation-wordpress"
                      className="flex-1 py-3 px-4 bg-[#18757d] hover:bg-[#12595f] text-white text-xs font-extrabold rounded-xl text-center transition-colors shadow-xs"
                    >
                      Formation Site WordPress →
                    </Link>
                    <Link
                      href="/produit/formation-ajouter-une-boutique-en-ligne-avec-woocommerce"
                      className="flex-1 py-3 px-4 bg-[#F2542D] hover:bg-[#d8441f] text-white text-xs font-extrabold rounded-xl text-center transition-colors shadow-xs"
                    >
                      Boutique WooCommerce →
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {profileResult === 'B' && (
              <div className="space-y-6">
                <div className="w-16 h-16 rounded-full bg-sky-100 text-sky-700 flex items-center justify-center mx-auto text-3xl shadow-sm">
                  💪
                </div>
                <div className="space-y-2">
                  <span className="px-3.5 py-1 bg-sky-100 text-sky-800 rounded-full text-xs font-black uppercase tracking-wider">
                    Profil B — Motivée qui hésite
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-[#332420]">
                    Tu peux le faire, vraiment !
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5e4d46] font-semibold max-w-lg mx-auto leading-relaxed">
                    Tu es prête à te lancer, même si quelques doutes persistent. C'est 100% normal ! Ce qu'il te faut, c'est simplement une méthode douce pas à pas sans jargon.
                  </p>
                </div>

                <div className="p-6 bg-white rounded-3xl border-2 border-sky-300 text-left space-y-4 shadow-md max-w-lg mx-auto">
                  <h4 className="text-sm font-extrabold text-[#18757d] flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-sky-600" />
                    Ta Recommandation Sur-Mesure :
                  </h4>
                  <p className="text-xs text-[#5e4d46] leading-relaxed font-semibold">
                    Découvre notre accompagnement individuel ou notre guide pas-à-pas pour être guidée sans aucun stress de gestion.
                  </p>
                  <div className="pt-2 flex flex-col sm:flex-row gap-3">
                    <Link
                      href="/produit/coaching-site"
                      className="flex-1 py-3 px-4 bg-[#F2542D] hover:bg-[#d8441f] text-white text-xs font-extrabold rounded-xl text-center transition-colors shadow-xs"
                    >
                      Coaching 1-sur-1 (97 €) →
                    </Link>
                    <Link
                      href="/boutique"
                      className="flex-1 py-3 px-4 bg-[#18757d] hover:bg-[#12595f] text-white text-xs font-extrabold rounded-xl text-center transition-colors shadow-xs"
                    >
                      Découvrir la Boutique →
                    </Link>
                  </div>
                </div>
              </div>
            )}

            {profileResult === 'C' && (
              <div className="space-y-6">
                <div className="w-16 h-16 rounded-full bg-amber-100 text-amber-700 flex items-center justify-center mx-auto text-3xl shadow-sm">
                  🌿
                </div>
                <div className="space-y-2">
                  <span className="px-3.5 py-1 bg-amber-100 text-amber-800 rounded-full text-xs font-black uppercase tracking-wider">
                    Profil C — Avance doucement
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-[#332420]">
                    Commence par là, c'est plus simple !
                  </h3>
                  <p className="text-xs sm:text-sm text-[#5e4d46] font-semibold max-w-lg mx-auto leading-relaxed">
                    Tu as besoin d'y aller un petit pas après l'autre. Pas de panique : pour commencer à être trouvée sur internet sans stress, mise sur ta Fiche Google My Business !
                  </p>
                </div>

                <div className="p-6 bg-white rounded-3xl border-2 border-amber-300 text-left space-y-4 shadow-md max-w-lg mx-auto">
                  <h4 className="text-sm font-extrabold text-[#18757d] flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-amber-600" />
                    Ta Recommandation Sur-Mesure :
                  </h4>
                  <p className="text-xs text-[#5e4d46] leading-relaxed font-semibold">
                    Maîtrise ta fiche Google pour apparaître gratuitement sur Google Maps devant tes clients locaux.
                  </p>
                  <div className="pt-2 flex flex-col sm:flex-row gap-3">
                    <Link
                      href="/tunnel/precommande-fiche-google"
                      className="flex-1 py-3 px-4 bg-[#F2542D] hover:bg-[#d8441f] text-white text-xs font-extrabold rounded-xl text-center transition-colors shadow-xs text-center"
                    >
                      Guide Fiche Google (29 €) →
                    </Link>
                    <Link
                      href="/boutique"
                      className="flex-1 py-3 px-4 bg-[#18757d] hover:bg-[#12595f] text-white text-xs font-extrabold rounded-xl text-center transition-colors shadow-xs text-center"
                    >
                      Voir les Mini-Guides →
                    </Link>
                  </div>
                </div>
              </div>
            )}

            <div className="pt-4">
              <button
                onClick={handleReset}
                className="text-xs font-extrabold text-[#5e4d46] hover:text-[#F2542D] inline-flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                Refaire le quiz
              </button>
            </div>

          </div>
        )}

      </div>
    </div>
  );
}
