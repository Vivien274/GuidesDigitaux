'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import VideoPlayer from '@/components/VideoPlayer';
import { getStoredCourses, Course } from '@/lib/coursesStore';
import { 
  Play, 
  CheckCircle2, 
  Circle, 
  ChevronRight, 
  Download, 
  ArrowLeft, 
  ArrowRight,
  FileText, 
  Sparkles, 
  Clock,
  Lock,
  MessageSquare,
  Award,
  Link as LinkIcon,
  HelpCircle,
  CheckSquare,
  RotateCcw,
  AlertCircle,
  Video,
  Users
} from 'lucide-react';

const getShuffledOptions = (options: string[], qId: string) => {
  const list = options.map((text, originalIndex) => ({ text, originalIndex }));
  let hash = 0;
  for (let i = 0; i < qId.length; i++) hash = (hash << 5) - hash + qId.charCodeAt(i);
  return list.sort((a, b) => {
    const valA = (Math.sin(hash + a.originalIndex) * 10000) % 1;
    const valB = (Math.sin(hash + b.originalIndex) * 10000) % 1;
    return valA - valB;
  });
};

const WOOCOMMERCE_COURSE_DATA = {
  id: 'c2',
  title: 'Formation Vidéo : Vendre ses créations avec WooCommerce',
  instructor: 'Stéphanie ROCQ',
  congratulationsMsg: 'Félicitations ! Votre boutique WooCommerce est prête à encaisser des commandes.',
  bonusDocTitle: 'Checklist des 25 points à vérifier avant d’ouvrir sa boutique',
  bonusDocUrl: 'https://www.guides-digitaux.com/wp-content/uploads/2026/02/checklist-a-verifier-avant-le-lancement-du-site.webp',
  modules: [
    {
      id: 'm1',
      title: 'Module 1 : Configuration WooCommerce & Produits',
      lessons: [
        {
          id: 'l1',
          title: '1.1 Installer et configurer l’extension WooCommerce',
          duration: '12:15',
          completed: false,
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          notes: 'Suivez étape par étape la configuration initiale des devises, adresses et réglages de votre boutique.'
        },
        {
          id: 'l2',
          title: '1.2 Créer ses premières fiches produits',
          duration: '18:30',
          completed: false,
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
          notes: 'Ajouter les photos de vos créations, fixer les prix TTC et rédiger des descriptions captivantes.'
        }
      ]
    },
    {
      id: 'm2',
      title: 'Module 2 : Paiement Stripe & Expédition',
      lessons: [
        {
          id: 'l3',
          title: '2.1 Connecter Stripe pour encaisser par Carte Bancaire',
          duration: '14:20',
          completed: false,
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
          notes: 'Activer le paiement sécurisé par carte sans frais d’abonnement fixes.'
        },
        {
          id: 'l4',
          title: '2.2 Configurer les modes de livraison et frais de port',
          duration: '11:45',
          completed: false,
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutback2012.mp4',
          notes: 'Paramétrer la livraison Colissimo, Mondial Relay ou le retrait en atelier.'
        }
      ]
    }
  ]
};

const WORDPRESS_COURSE_DATA = {
  id: 'c1',
  title: 'Formation Vidéo : Créer sa vitrine en ligne avec WordPress',
  instructor: 'Stéphanie ROCQ',
  congratulationsMsg: 'Bravo ! Tu as construit ton site vitrine en toute autonomie.',
  bonusDocTitle: 'Feuille de route de maintenance & sécurité WordPress',
  bonusDocUrl: 'https://www.guides-digitaux.com/wp-content/uploads/2026/02/checklist-securite-et-anti-spam-wordpress.webp',
  modules: [
    {
      id: 'm1',
      title: 'Module 1 : Prise en main & Choix de l’hébergement',
      lessons: [
        {
          id: 'l1',
          title: '1.1 Bienvenue & Présentation du programme',
          duration: '08:15',
          completed: true,
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
          notes: 'Dans cette première leçon, nous faisons le tour de votre espace de formation et posons les bases de votre projet de site vitrine.'
        },
        {
          id: 'l2',
          title: '1.2 Réserver son nom de domaine et son hébergement',
          duration: '14:30',
          completed: true,
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
          notes: 'Comment choisir un bon nom de domaine pour son activité d’artisan et réserver son hébergement web sans payer de suppléments inutiles.'
        }
      ],
      quiz: {
        id: 'q1',
        title: 'Quizz de validation du Module 1 : Hébergement & Domaine',
        passingScorePercent: 100,
        questions: [
          {
            id: 'q1-1',
            question: 'Quel est l\'élément indispensable pour installer WordPress et héberger son site web ?',
            options: [
              'Un serveur d\'hébergement web et un nom de domaine',
              'Un compte Instagram Pro',
              'Une imprimante 3D'
            ],
            correctOptionIndex: 0,
            explanation: 'Un nom de domaine et un serveur d\'hébergement sont requis pour rendre votre site accessible en ligne.'
          },
          {
            id: 'q1-2',
            question: 'Quelle est la bonne pratique pour choisir son nom de domaine ?',
            options: [
              'Prendre un nom le plus long possible avec plein d\'accents',
              'Choisir un nom court, mémorisable et en rapport avec sa marque',
              'Utiliser des caractères spéciaux étranges'
            ],
            correctOptionIndex: 1,
            explanation: 'Un nom court et mémorisable facilite le bouche-à-oreille et les recherches de vos clients.'
          }
        ]
      }
    },
    {
      id: 'm2',
      title: 'Module 2 : Installation & Réglages WordPress',
      lessons: [
        {
          id: 'l3',
          title: '2.1 Installer WordPress en 1 clic chez l’hébergeur',
          duration: '12:40',
          completed: true,
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
          notes: 'Procédure pas à pas pour lancer l’installation automatique et se connecter au tableau de bord.'
        },
        {
          id: 'l4',
          title: '2.2 Configurer les paramètres généraux et les permaliens',
          duration: '10:15',
          completed: false,
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyshakes.mp4',
          notes: 'Réglages d’affichage, fuseau horaire et structure des liens personnalisés pour le référencement Google.'
        }
      ]
    },
    {
      id: 'm3',
      title: 'Module 3 : Personnalisation Graphique & Thème',
      lessons: [
        {
          id: 'l5',
          title: '3.1 Choisir et installer un thème rapide et épuré',
          duration: '16:50',
          completed: false,
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerMeltdowns.mp4',
          notes: 'Sélection d’un thème léger adapté aux créateurs (Astra, Kadence ou GeneratePress).'
        },
        {
          id: 'l6',
          title: '3.2 Créer son en-tête avec son logo et son menu',
          duration: '19:10',
          completed: false,
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
          notes: 'Mettre en place la navigation principale et intégrer son identité visuelle.'
        }
      ]
    },
    {
      id: 'm4',
      title: 'Module 4 : Pages Clés & Mise en Ligne',
      lessons: [
        {
          id: 'l7',
          title: '4.1 Rédiger et concevoir la page d’accueil',
          duration: '22:00',
          completed: false,
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/SubaruOutback2012.mp4',
          notes: 'Agencement des blocs de présentation, témoignages clients et boutons d’appel à l’action.'
        },
        {
          id: 'l8',
          title: '4.2 Ajouter un formulaire de contact & mettre en ligne',
          duration: '15:20',
          completed: false,
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
          notes: 'Dernières vérifications avant l’ouverture officielle de votre site au public.'
        }
      ]
    }
  ]
};

export default function FormationViewerPage() {
  const params = useParams();
  const router = useRouter();
  const rawSlug = (params?.slug as string) || '';
  const slug = decodeURIComponent(rawSlug);

  useEffect(() => {
    if (slug.includes('precommande') || slug === 'precommande-fiche-google') {
      router.replace('/precommande');
      return;
    }
  }, [slug, router]);

  const [courseData, setCourseData] = useState<any>(WORDPRESS_COURSE_DATA);
  const [activeLesson, setActiveLesson] = useState<any>(WORDPRESS_COURSE_DATA.modules[0].lessons[0]);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);

  // QUIZ STATE
  const [passedQuizzes, setPassedQuizzes] = useState<Record<string, boolean>>({});
  const [selectedQuizAnswers, setSelectedQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [quizPassed, setQuizPassed] = useState<boolean>(false);

  useEffect(() => {
    // 1. Check if an edited version exists in localStorage first
    const customCourses = getStoredCourses();
    const match = customCourses.find(c => 
      c.id === slug || 
      (slug === 'formation-woocommerce' && (c.id === 'c2' || c.title.toLowerCase().includes('woocommerce'))) ||
      (slug === 'creer-sa-vitrine-wordpress' && (c.id === 'c1' || c.title.toLowerCase().includes('wordpress')))
    );

    if (match && match.modules && match.modules.length > 0 && match.modules[0].lessons.length > 0) {
      const formatted = {
        id: match.id,
        title: match.title,
        instructor: 'Stéphanie ROCQ',
        congratulationsMsg: match.congratulationsMsg || 'Félicitations pour l’accomplissement de cette formation !',
        bonusDocTitle: match.bonusDocTitle || 'Fiche bonus de conclusion',
        bonusDocUrl: match.bonusDocUrl || 'https://www.guides-digitaux.com/wp-content/uploads/2026/02/checklist-a-verifier-avant-le-lancement-du-site.webp',
        communityLink: match.communityLink,
        liveStreamUrl: match.liveStreamUrl,
        liveStreamDate: match.liveStreamDate,
        liveStreamTitle: match.liveStreamTitle,
        modules: match.modules
      };
      setCourseData(formatted);
      setActiveLesson(match.modules[0].lessons[0]);
      return;
    }

    // 2. Fallback default static mock courses
    if (slug === 'formation-woocommerce' || slug === 'c2') {
      setCourseData(WOOCOMMERCE_COURSE_DATA);
      setActiveLesson(WOOCOMMERCE_COURSE_DATA.modules[0].lessons[0]);
    } else {
      setCourseData(WORDPRESS_COURSE_DATA);
      setActiveLesson(WORDPRESS_COURSE_DATA.modules[0].lessons[0]);
    }
  }, [slug]);

  // Flattened array of all lessons across all modules for sequential navigation
  const allLessons: any[] = [];
  if (courseData?.modules) {
    courseData.modules.forEach((mod: any) => {
      if (mod.lessons) {
        mod.lessons.forEach((les: any) => {
          allLessons.push(les);
        });
      }
    });
  }

  // RESTORE COMPLETED LESSONS & PASSED QUIZZES FROM LOCALSTORAGE
  useEffect(() => {
    if (typeof window === 'undefined' || !courseData?.id) return;
    try {
      const saved = localStorage.getItem(`gd_completed_lessons_${courseData.id}`);
      if (saved) {
        setCompletedLessons(JSON.parse(saved));
      } else {
        const defaults = courseData.modules?.flatMap((m: any) => m.lessons?.filter((l: any) => l.completed).map((l: any) => l.id)) || [];
        setCompletedLessons(defaults);
      }

      const savedQuizzes = localStorage.getItem(`gd_passed_quizzes_${courseData.id}`);
      if (savedQuizzes) {
        setPassedQuizzes(JSON.parse(savedQuizzes));
      }
    } catch (e) {}
  }, [courseData?.id]);

  // Reset quiz local form when switching lessons
  useEffect(() => {
    setSelectedQuizAnswers({});
    setQuizSubmitted(false);
    setQuizScore(0);
    setQuizPassed(false);
  }, [activeLesson?.id]);

  const toggleLessonCompletion = (lessonId: string) => {
    const updated = completedLessons.includes(lessonId)
      ? completedLessons.filter(id => id !== lessonId)
      : [...completedLessons, lessonId];
    
    setCompletedLessons(updated);
    if (typeof window !== 'undefined' && courseData?.id) {
      localStorage.setItem(`gd_completed_lessons_${courseData.id}`, JSON.stringify(updated));
    }
  };

  // Find active module
  const activeModuleIndex = courseData?.modules?.findIndex((m: any) => m.lessons?.some((l: any) => l.id === activeLesson?.id)) ?? 0;
  const activeModule = courseData?.modules?.[activeModuleIndex];

  // Navigation handlers
  const currentLessonIndex = allLessons.findIndex(l => l.id === activeLesson?.id);
  const previousLesson = currentLessonIndex > 0 ? allLessons[currentLessonIndex - 1] : null;
  const nextLesson = currentLessonIndex < allLessons.length - 1 ? allLessons[currentLessonIndex + 1] : null;

  const validCompletedCount = allLessons.filter(l => completedLessons.includes(l.id)).length;
  const totalLessons = allLessons.length;
  const progressPercent = totalLessons > 0 ? Math.round((validCompletedCount / totalLessons) * 100) : 0;
  const isFullyCompleted = progressPercent === 100;

  // QUIZ SUBMIT HANDLER
  const handleQuizSubmit = (quiz: any) => {
    if (!quiz || !quiz.questions) return;
    let correctCount = 0;
    quiz.questions.forEach((q: any) => {
      if (selectedQuizAnswers[q.id] === q.correctOptionIndex) {
        correctCount++;
      }
    });

    const score = Math.round((correctCount / quiz.questions.length) * 100);
    const required = quiz.passingScorePercent !== undefined ? quiz.passingScorePercent : 100;
    const passed = score >= required;

    setQuizScore(score);
    setQuizPassed(passed);
    setQuizSubmitted(true);

    if (passed && activeModule) {
      const updated = { ...passedQuizzes, [activeModule.id]: true };
      setPassedQuizzes(updated);
      if (typeof window !== 'undefined' && courseData?.id) {
        localStorage.setItem(`gd_passed_quizzes_${courseData.id}`, JSON.stringify(updated));
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#332420] font-sans flex flex-col justify-between">
      <div>
        <Header />

        {/* BREADCRUMB HEADER */}
        <div className="bg-[#f5f1e8] py-3.5 border-b border-[#e8ded0]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-between gap-3">
            <Link href="/dashboard/eleve" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#18757d] hover:underline">
              <ArrowLeft className="w-4 h-4" />
              Retour à mon Espace Élève
            </Link>

            <div className="flex items-center gap-3">
              <span className="text-xs font-extrabold text-[#332420] truncate max-w-md hidden sm:inline">
                {courseData.title}
              </span>

              {/* REJOINDRE LA COMMUNAUTÉ BUTTON (Conditionnel si renseigné en Admin) */}
              {courseData?.communityLink && courseData.communityLink.trim() !== '' && (
                <a
                  href={courseData.communityLink}
                  target="_blank"
                  rel="noreferrer"
                  className="px-3.5 py-1.5 text-xs font-extrabold text-white bg-[#18757d] hover:bg-[#12595f] rounded-xl transition-colors flex items-center gap-1.5 uppercase tracking-wider shadow-xs"
                >
                  <Users className="w-3.5 h-3.5" />
                  Rejoindre la communauté
                </a>
              )}
            </div>
          </div>
        </div>

        {/* COURSE PLAYER MAIN SECTION */}
        <section className="py-8 md:py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* LEFT: Main Player Area (8 Cols) */}
              <div className="lg:col-span-8 space-y-6">
                
                {/* LIVE STREAM BANNER (Si renseigné en Admin) */}
                {courseData?.liveStreamUrl && courseData.liveStreamUrl.trim() !== '' && (
                  <div className="p-5 bg-gradient-to-r from-blue-600 to-[#18757d] rounded-3xl text-white shadow-md flex flex-col sm:flex-row items-center justify-between gap-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-2xl bg-white/20 flex items-center justify-center font-extrabold shrink-0">
                        <Video className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <span className="text-[10px] font-extrabold uppercase tracking-wider text-blue-200">Diffusion Live / Visioconférence</span>
                        <h4 className="text-sm font-extrabold">{courseData.liveStreamTitle || 'Session Direct & Questions/Réponses'}</h4>
                        {courseData.liveStreamDate && (
                          <p className="text-[11px] text-blue-100 font-medium mt-0.5">
                            📅 Programmé le {new Date(courseData.liveStreamDate).toLocaleDateString('fr-FR')} à {new Date(courseData.liveStreamDate).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}
                          </p>
                        )}
                      </div>
                    </div>

                    <a
                      href={courseData.liveStreamUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="px-5 py-3 text-xs font-extrabold text-[#332420] bg-amber-400 hover:bg-amber-300 rounded-xl transition-colors uppercase tracking-wider shrink-0 flex items-center gap-2"
                    >
                      <Video className="w-4 h-4 text-[#332420]" />
                      Rejoindre le Direct →
                    </a>
                  </div>
                )}

                {/* VIDEO CONTAINER */}
                <div className="bg-black rounded-3xl overflow-hidden shadow-xl border border-[#eee7da]">
                  <VideoPlayer
                    url={activeLesson?.videoUrl || 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4'}
                  />
                </div>

                {/* LESSON TITLE & PROGRESS BAR */}
                <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#eee7da] shadow-sm space-y-6">
                  
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#eee7da] pb-6">
                    <div>
                      <span className="text-xs font-extrabold text-[#18757d] uppercase tracking-wider block mb-1">
                        Leçon en cours
                      </span>
                      <h1 className="text-xl sm:text-2xl font-extrabold text-[#332420]">
                        {activeLesson?.title}
                      </h1>
                    </div>

                    {/* Toggle Completion Button */}
                    <button
                      onClick={() => toggleLessonCompletion(activeLesson?.id)}
                      className={`px-5 py-3 rounded-2xl text-xs font-extrabold transition-all flex items-center justify-center gap-2 uppercase tracking-wider shrink-0 ${
                        completedLessons.includes(activeLesson?.id)
                          ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                          : 'bg-[#18757d] text-white hover:bg-[#12595f] shadow-sm'
                      }`}
                    >
                      <CheckCircle2 className="w-4 h-4" />
                      {completedLessons.includes(activeLesson?.id) ? 'LEÇON TERMINÉE ✓' : 'MARQUER COMME TERMINÉE'}
                    </button>
                  </div>

                  {/* PREVIOUS & NEXT LESSON BUTTONS */}
                  <div className="flex items-center justify-between gap-4 pt-2">
                    {previousLesson ? (
                      <button
                        onClick={() => setActiveLesson(previousLesson)}
                        className="px-5 py-3 text-xs font-extrabold text-[#332420] bg-[#faf8f5] hover:bg-[#e6f4f3] hover:text-[#18757d] rounded-2xl border border-[#eee7da] transition-all flex items-center gap-2 uppercase tracking-wider"
                      >
                        <ArrowLeft className="w-4 h-4" />
                        Leçon Précédente
                      </button>
                    ) : (
                      <div />
                    )}

                    {nextLesson && (
                      <button
                        onClick={() => setActiveLesson(nextLesson)}
                        className="px-5 py-3 text-xs font-extrabold text-white bg-[#18757d] hover:bg-[#12595f] rounded-2xl shadow-sm transition-all flex items-center gap-2 uppercase tracking-wider ml-auto"
                      >
                        Leçon Suivante
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>

                {/* CONGRATULATIONS & END OF COURSE DOCUMENT SHARE BOX */}
                {isFullyCompleted && (
                  <div className="bg-gradient-to-br from-[#18757d] to-[#0f4d53] text-white p-8 rounded-3xl shadow-xl border border-teal-800 space-y-4 animate-in fade-in duration-300">
                    <div className="flex items-center gap-3">
                      <Award className="w-8 h-8 text-amber-300 shrink-0" />
                      <div>
                        <span className="text-xs font-extrabold uppercase tracking-wider text-amber-300 block">Formation Terminée !</span>
                        <h2 className="text-2xl font-extrabold text-white">
                          Bravo pour votre réussite ! 🎓
                        </h2>
                      </div>
                    </div>

                    <p className="text-xs sm:text-sm text-teal-100 leading-relaxed">
                      {courseData.congratulationsMsg || 'Vous avez complété 100% des cours de cette formation.'}
                    </p>

                    <div className="pt-2 flex flex-col sm:flex-row items-center gap-4">
                      <a
                        href={courseData.bonusDocUrl || 'https://www.guides-digitaux.com/wp-content/uploads/2026/02/checklist-a-verifier-avant-le-lancement-du-site.webp'}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full sm:w-auto px-6 py-3.5 text-xs font-extrabold text-[#332420] bg-amber-400 hover:bg-amber-300 rounded-xl shadow-md uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
                      >
                        <Award className="w-4 h-4 text-[#332420]" />
                        Télécharger le certificat de formation
                      </a>

                      {courseData?.communityLink && courseData.communityLink.trim() !== '' && (
                        <a
                          href={courseData.communityLink}
                          target="_blank"
                          rel="noreferrer"
                          className="w-full sm:w-auto px-6 py-3.5 text-xs font-extrabold text-white bg-white/20 hover:bg-white/30 rounded-xl border border-white/30 text-center uppercase tracking-wider transition-colors"
                        >
                          REJOINDRE LA COMMUNAUTÉ
                        </a>
                      )}
                    </div>
                  </div>
                )}

                {/* Lesson Notes & Resource Downloads */}
                <div className="bg-white p-8 rounded-3xl border border-[#eee7da] shadow-sm space-y-6">
                  <div className="border-b border-[#eee7da] pb-4">
                    <h3 className="text-base font-extrabold text-[#332420] flex items-center gap-2">
                      <FileText className="w-4 h-4 text-[#18757d]" />
                      Notes de cours & explications
                    </h3>
                  </div>

                  <p className="text-sm text-[#5e4d46] leading-relaxed whitespace-pre-wrap">
                    {activeLesson?.notes || 'Descriptif et notes d\'accompagnement de la leçon.'}
                  </p>

                  {/* Multiple PDF & Resource Files Download Boxes */}
                  {activeLesson?.files && activeLesson.files.length > 0 ? (
                    <div className="space-y-3 pt-2">
                      <h4 className="text-xs font-extrabold text-[#18757d] uppercase tracking-wider">Fichiers & supports téléchargeables</h4>
                      <div className="space-y-2">
                        {activeLesson.files.map((file: any) => (
                          <div key={file.id} className="p-4 bg-[#faf8f5] rounded-2xl border border-[#eee7da] flex flex-col sm:flex-row items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                              <div className="w-9 h-9 rounded-xl bg-[#e6f4f3] text-[#18757d] flex items-center justify-center shrink-0">
                                <Download className="w-4 h-4" />
                              </div>
                              <div>
                                <h5 className="text-xs font-extrabold text-[#332420]">{file.name}</h5>
                                <p className="text-[10px] text-slate-500">Document joint de la leçon (PDF / Archive)</p>
                              </div>
                            </div>
                            <a
                              href={file.url}
                              target="_blank"
                              rel="noreferrer"
                              className="px-4 py-2 text-xs font-extrabold text-[#18757d] bg-white border border-[#eee7da] hover:bg-[#18757d] hover:text-white rounded-xl transition-colors uppercase tracking-wider shrink-0"
                            >
                              TÉLÉCHARGER
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="p-5 bg-[#faf8f5] rounded-2xl border border-[#eee7da] flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#e6f4f3] text-[#18757d] flex items-center justify-center shrink-0">
                          <Download className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-xs font-extrabold text-[#332420]">Fiche récapitulative & Support PDF</h4>
                          <p className="text-[11px] text-slate-500">Document d'accompagnement de la leçon (Format PDF)</p>
                        </div>
                      </div>

                      <a
                        href={activeLesson?.pdfUrl || "https://www.guides-digitaux.com/wp-content/uploads/2026/02/checklist-a-verifier-avant-le-lancement-du-site.webp"}
                        target="_blank"
                        rel="noreferrer"
                        className="px-5 py-2.5 text-xs font-extrabold text-[#18757d] bg-white border border-[#eee7da] hover:bg-[#18757d] hover:text-white rounded-xl transition-colors uppercase tracking-wider shrink-0"
                      >
                        TÉLÉCHARGER
                      </a>
                    </div>
                  )}

                  {/* Multiple External Links Boxes */}
                  {activeLesson?.links && activeLesson.links.length > 0 && (
                    <div className="space-y-3 pt-2">
                      <h4 className="text-xs font-extrabold text-[#18757d] uppercase tracking-wider">Liens externes utiles & Notion</h4>
                      <div className="space-y-2">
                        {activeLesson.links.map((link: any) => (
                          <div key={link.id} className="p-4 bg-blue-50/60 rounded-2xl border border-blue-100 flex items-center justify-between gap-4">
                            <span className="text-xs font-extrabold text-blue-950">{link.title}</span>
                            <a
                              href={link.url}
                              target="_blank"
                              rel="noreferrer"
                              className="px-4 py-2 text-xs font-extrabold text-blue-700 bg-white hover:bg-blue-600 hover:text-white rounded-xl border border-blue-200 transition-colors uppercase tracking-wider shrink-0"
                            >
                              Ouvrir le lien →
                            </a>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                {/* MODULE QUIZ EVALUATION INTERFACE FOR STUDENT */}
                {activeModule?.quiz && (
                  <div className="bg-gradient-to-r from-purple-50 to-indigo-50 p-8 rounded-3xl border-2 border-purple-200 shadow-md space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-purple-200 pb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center font-extrabold shrink-0 shadow-sm">
                          🧠
                        </div>
                        <div>
                          <span className="text-[10px] font-extrabold text-purple-700 uppercase tracking-wider">Évaluation Obligatoire</span>
                          <h3 className="text-lg font-extrabold text-purple-950">
                            {activeModule.quiz.title}
                          </h3>
                        </div>
                      </div>

                      <span className="px-3.5 py-1 rounded-full text-xs font-extrabold bg-purple-200 text-purple-900 border border-purple-300">
                        Score requis : {activeModule.quiz.passingScorePercent !== undefined ? activeModule.quiz.passingScorePercent : 100}%
                      </span>
                    </div>

                    {/* Quiz Passed Banner */}
                    {passedQuizzes[activeModule.id] ? (
                      <div className="p-6 bg-emerald-50 rounded-2xl border border-emerald-300 space-y-2">
                        <div className="flex items-center gap-3 text-emerald-900">
                          <CheckCircle2 className="w-6 h-6 text-emerald-600 shrink-0" />
                          <div>
                            <h4 className="text-sm font-extrabold">Quizz de ce module validé avec succès ! 🎉</h4>
                            <p className="text-xs text-emerald-700">Vous avez débloqué l'accès complet au module suivant.</p>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {/* Questions */}
                        {activeModule.quiz.questions?.map((q: any, qIdx: number) => (
                          <div key={q.id} className="p-6 bg-white rounded-2xl border border-purple-200 space-y-4 shadow-xs">
                            <h4 className="text-sm font-extrabold text-purple-950">
                              Question {qIdx + 1} : {q.question}
                            </h4>

                            {/* Shuffle answer options per question */}
                            <div className="space-y-2">
                              {getShuffledOptions(q.options || [], q.id).map((optObj) => (
                                <label
                                  key={optObj.originalIndex}
                                  className={`flex items-center gap-3 p-3.5 rounded-xl border cursor-pointer transition-all text-xs font-semibold ${
                                    selectedQuizAnswers[q.id] === optObj.originalIndex
                                      ? 'border-purple-600 bg-purple-50 text-purple-950 font-extrabold'
                                      : 'border-[#eee7da] hover:bg-[#faf8f5] text-[#332420]'
                                  }`}
                                >
                                  <input
                                    type="radio"
                                    name={`quiz-${q.id}`}
                                    checked={selectedQuizAnswers[q.id] === optObj.originalIndex}
                                    onChange={() => setSelectedQuizAnswers({ ...selectedQuizAnswers, [q.id]: optObj.originalIndex })}
                                    className="w-4 h-4 accent-purple-700"
                                  />
                                  <span>{optObj.text}</span>
                                </label>
                              ))}
                            </div>

                            {/* Show Explanation if submitted */}
                            {quizSubmitted && (
                              <div className={`p-3 rounded-xl text-xs font-medium ${
                                selectedQuizAnswers[q.id] === q.correctOptionIndex ? 'bg-emerald-50 text-emerald-900 border border-emerald-200' : 'bg-rose-50 text-rose-900 border border-rose-200'
                              }`}>
                                💡 <strong>Explication :</strong> {q.explanation || 'Vérifiez la bonne réponse.'}
                              </div>
                            )}
                          </div>
                        ))}

                        {/* Submitted result feedback */}
                        {quizSubmitted && !quizPassed && (
                          <div className="p-5 bg-rose-50 rounded-2xl border border-rose-200 flex items-center justify-between gap-4">
                            <div className="flex items-center gap-3 text-rose-900">
                              <AlertCircle className="w-6 h-6 text-rose-600 shrink-0" />
                              <div>
                                <h4 className="text-xs font-extrabold">Score obtenu : {quizScore}% (Score requis : {activeModule.quiz.passingScorePercent}%)</h4>
                                <p className="text-[11px] text-rose-700">Relisez les explications et réessayez pour valider ce module.</p>
                              </div>
                            </div>

                            <button
                              onClick={() => setQuizSubmitted(false)}
                              className="px-4 py-2 text-xs font-extrabold text-rose-800 bg-white hover:bg-rose-100 rounded-xl border border-rose-300 uppercase flex items-center gap-1.5 shrink-0"
                            >
                              <RotateCcw className="w-3.5 h-3.5" />
                              Réessayer
                            </button>
                          </div>
                        )}

                        <div className="pt-2">
                          <button
                            onClick={() => handleQuizSubmit(activeModule.quiz)}
                            className="w-full py-4 text-xs font-extrabold text-white bg-purple-700 hover:bg-purple-800 rounded-2xl shadow-lg uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
                          >
                            <CheckSquare className="w-4 h-4" />
                            VALIDER MES RÉPONSES AU QUIZZ
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}

              </div>

              {/* RIGHT: Course Modules & Lessons Sidebar Tree */}
              <div className="lg:col-span-4 bg-white rounded-3xl p-6 border border-[#eee7da] shadow-sm space-y-6">
                <div>
                  <h3 className="text-base font-extrabold text-[#332420]">Sommaire de la formation</h3>
                  <p className="text-xs text-slate-500 mt-0.5">{validCompletedCount} sur {totalLessons} leçons validées</p>
                </div>

                <div className="space-y-4">
                  {courseData.modules?.map((module: any, mIdx: number) => {
                    const hasQuiz = !!module.quiz;
                    const isQuizPassed = passedQuizzes[module.id];

                    return (
                      <div key={module.id} className="space-y-2">
                        <div className="flex items-center justify-between bg-[#faf8f5] p-3 rounded-xl border border-[#eee7da]">
                          <h4 className="text-xs font-extrabold text-[#18757d] uppercase tracking-wider">
                            {module.title}
                          </h4>
                          {hasQuiz && (
                            <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                              isQuizPassed ? 'bg-emerald-100 text-emerald-800' : 'bg-purple-100 text-purple-900'
                            }`}>
                              {isQuizPassed ? 'Quizz ✓' : 'Quizz à faire'}
                            </span>
                          )}
                        </div>

                        <div className="space-y-1 pl-1">
                          {module.lessons?.map((lesson: any) => {
                            const isSelected = activeLesson?.id === lesson.id;
                            const isDone = completedLessons.includes(lesson.id);

                            return (
                              <button
                                key={lesson.id}
                                onClick={() => setActiveLesson(lesson)}
                                className={`w-full text-left p-3 rounded-xl transition-all flex items-center justify-between text-xs font-semibold ${
                                  isSelected
                                    ? 'bg-[#e6f4f3] text-[#18757d] border border-[#18757d]/30 font-bold'
                                    : 'hover:bg-[#faf8f5] text-[#332420]'
                                }`}
                              >
                                <div className="flex items-center gap-2.5 min-w-0 pr-2">
                                  {isDone ? (
                                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                                  ) : (
                                    <Circle className="w-4 h-4 text-slate-300 shrink-0" />
                                  )}
                                  <span className="truncate">{lesson.title}</span>
                                </div>

                                <span className="text-[10px] text-slate-400 shrink-0">{lesson.duration}</span>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}
