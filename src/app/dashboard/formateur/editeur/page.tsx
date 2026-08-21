'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WysiwygEditor from '@/components/WysiwygEditor';
import { useAuth } from '@/context/AuthContext';
import { fetchCoursesFromDb, saveCourseToDb, toUuid } from '@/lib/supabaseLms';
import { Course, Module, Lesson, LessonResourceFile, LessonExternalLink, QuizQuestion, ModuleQuiz } from '@/lib/coursesStore';
import { 
  ArrowLeft, 
  ArrowRight, 
  CheckCircle2, 
  FolderPlus, 
  PlusCircle, 
  Trash2, 
  Video, 
  FileText, 
  Download, 
  Sparkles, 
  Award, 
  Gift, 
  Check, 
  Save, 
  Layers, 
  HelpCircle,
  Clock,
  BookOpen,
  Edit3,
  Tag,
  Calendar,
  Link as LinkIcon,
  Paperclip,
  Plus,
  ChevronDown,
  ChevronRight,
  ArrowUp,
  ArrowDown,
  MoveHorizontal,
  FolderInput,
  CheckSquare
} from 'lucide-react';

function CourseEditorContent() {
  const router = useRouter();
  const { user, role } = useAuth();
  const searchParams = useSearchParams();
  const courseId = searchParams.get('id');

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('gd_auth_user');
      const parsedRole = savedUser ? JSON.parse(savedUser).role : role;
      if (!savedUser && !user) {
        router.push('/mon-compte');
        return;
      }
      if (parsedRole !== 'formateur' && parsedRole !== 'superadmin' && role !== 'formateur' && role !== 'superadmin') {
        router.push('/dashboard/eleve');
        return;
      }
    }
  }, [user, role, router]);

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [course, setCourse] = useState<Course | null>(null);
  const [isSaving, setIsSaving] = useState(false);

  // STEP 1: INFORMATIONS DE BASE, VISUEL, STATUT & TARIF REMISÉ
  const [title, setTitle] = useState('');
  const [imageUrl, setImageUrl] = useState('https://www.guides-digitaux.com/wp-content/uploads/2026/02/un-artisan-createur-devant-son-PC-en-train-dajouter-ses-produits-dnas-saboutique-en-ligne.-accoude-a-son-etabli-dans-son-atelier.-lumiere-naturelle.webp');
  const [status, setStatus] = useState<'Publié' | 'Brouillon' | 'Planifié'>('Publié');
  const [scheduledPublishDate, setScheduledPublishDate] = useState('');
  const [liveStreamUrl, setLiveStreamUrl] = useState('');
  const [liveStreamDate, setLiveStreamDate] = useState('');
  const [liveStreamTitle, setLiveStreamTitle] = useState('Masterclass Live & Questions/Réponses');
  const [duration, setDuration] = useState('3h30');
  const [level, setLevel] = useState('Débutant');
  const [prerequisites, setPrerequisites] = useState('');
  const [normalPrice, setNormalPrice] = useState('149');
  const [discountedPrice, setDiscountedPrice] = useState('');
  const [category, setCategory] = useState('Formation Vidéo');
  const [description, setDescription] = useState('');

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          const rawResult = reader.result;
          const imageElement = document.createElement('img');
          imageElement.onload = () => {
            try {
              const canvas = document.createElement('canvas');
              const maxDim = 800;
              let w = imageElement.width;
              let h = imageElement.height;
              if (w > maxDim || h > maxDim) {
                if (w > h) {
                  h = Math.round((h * maxDim) / w);
                  w = maxDim;
                } else {
                  w = Math.round((w * maxDim) / h);
                  h = maxDim;
                }
              }
              canvas.width = w;
              canvas.height = h;
              const ctx = canvas.getContext('2d');
              if (ctx) {
                ctx.drawImage(imageElement, 0, 0, w, h);
                const compressed = canvas.toDataURL('image/jpeg', 0.82);
                setImageUrl(compressed);
              } else {
                setImageUrl(rawResult);
              }
            } catch (err) {
              setImageUrl(rawResult);
            }
          };
          imageElement.src = rawResult;
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // STEP 2: CONTENU (MODULES & COURS EXPANDED)
  const [modules, setModules] = useState<Module[]>([]);

  // COLLAPSIBLE STATES
  const [collapsedModules, setCollapsedModules] = useState<Record<string, boolean>>({});
  const [collapsedLessons, setCollapsedLessons] = useState<Record<string, boolean>>({});

  // STEP 3: PARTAGE À LA FIN
  const [congratulationsMsg, setCongratulationsMsg] = useState('Bravo ! Tu as terminé avec succès l\'ensemble des leçons de cette formation.');
  const [certificateEnabled, setCertificateEnabled] = useState(true);
  const [bonusDocTitle, setBonusDocTitle] = useState('Checklist ultime de contrôle post-formation');
  const [bonusDocUrl, setBonusDocUrl] = useState('https://www.guides-digitaux.com/wp-content/uploads/2026/02/checklist-a-verifier-avant-le-lancement-du-site.webp');
  const [communityLink, setCommunityLink] = useState('');

  // Load existing course data on mount from Supabase / localStorage
  useEffect(() => {
    async function loadData() {
      const allCourses = await fetchCoursesFromDb();
      let target: Course | undefined;
      if (courseId) {
        target = allCourses.find((c) => c.id === courseId);
      }
      if (!target && allCourses.length > 0) {
        target = allCourses[0];
      }

      if (target) {
        setCourse(target);
        setTitle(target.title || '');
        setDuration(target.duration || '3h30');
        setLevel(target.level || 'Débutant');
        setPrerequisites(target.prerequisites || 'Aucun prérequis technique nécessaire.');
        const eff = target.price || 99;
        const orig = target.originalPrice || target.normalPrice || 0;
        if (orig > 0 && orig > eff) {
          setNormalPrice(orig.toString());
          setDiscountedPrice(eff.toString());
        } else if (target.discountedPrice && target.discountedPrice > 0) {
          setNormalPrice(eff.toString());
          setDiscountedPrice(target.discountedPrice.toString());
        } else {
          setNormalPrice(eff.toString());
          setDiscountedPrice('');
        }
        if (target.image) setImageUrl(target.image);
        if (target.status) setStatus(target.status);
        if (target.scheduledPublishDate) setScheduledPublishDate(target.scheduledPublishDate);
        setLiveStreamUrl(target.liveStreamUrl ?? '');
        setLiveStreamDate(target.liveStreamDate ?? '');
        if (target.liveStreamTitle) setLiveStreamTitle(target.liveStreamTitle);
        setCategory(target.category || 'Formation Vidéo');
        setDescription(target.description || '');

        setModules(target.modules || []);
        if (target.congratulationsMsg) setCongratulationsMsg(target.congratulationsMsg);
        if (target.certificateEnabled !== undefined) setCertificateEnabled(target.certificateEnabled);
        if (target.bonusDocTitle) setBonusDocTitle(target.bonusDocTitle);
        if (target.bonusDocUrl) setBonusDocUrl(target.bonusDocUrl);
        setCommunityLink(target.communityLink ?? '');
      }
    }
    loadData();
  }, [courseId]);

  // TOGGLE COLLAPSE MODULE / LESSON
  const toggleModuleCollapse = (modId: string) => {
    setCollapsedModules(prev => ({ ...prev, [modId]: !prev[modId] }));
  };

  const toggleLessonCollapse = (lesId: string) => {
    setCollapsedLessons(prev => ({ ...prev, [lesId]: !prev[lesId] }));
  };

  // REORDER MODULES (MONTER / DESCENDRE)
  const handleMoveModule = (index: number, direction: 'up' | 'down') => {
    const newModules = [...modules];
    const targetIdx = direction === 'up' ? index - 1 : index + 1;
    if (targetIdx < 0 || targetIdx >= newModules.length) return;

    const temp = newModules[index];
    newModules[index] = newModules[targetIdx];
    newModules[targetIdx] = temp;
    setModules(newModules);
  };

  // REORDER LESSONS WITHIN A MODULE (MONTER / DESCENDRE)
  const handleMoveLesson = (modId: string, lIdx: number, direction: 'up' | 'down') => {
    setModules(modules.map(m => {
      if (m.id === modId) {
        const newLessons = [...m.lessons];
        const targetIdx = direction === 'up' ? lIdx - 1 : lIdx + 1;
        if (targetIdx < 0 || targetIdx >= newLessons.length) return m;

        const temp = newLessons[lIdx];
        newLessons[lIdx] = newLessons[targetIdx];
        newLessons[targetIdx] = temp;
        return { ...m, lessons: newLessons };
      }
      return m;
    }));
  };

  // TRANSFER LESSON TO ANOTHER MODULE
  const handleTransferLesson = (sourceModId: string, targetModId: string, lesId: string) => {
    if (sourceModId === targetModId) return;
    let movedLesson: Lesson | undefined;

    // Remove from source module
    const updatedModules = modules.map(m => {
      if (m.id === sourceModId) {
        movedLesson = m.lessons.find(l => l.id === lesId);
        return { ...m, lessons: m.lessons.filter(l => l.id !== lesId) };
      }
      return m;
    });

    // Add to target module
    if (movedLesson) {
      setModules(updatedModules.map(m => {
        if (m.id === targetModId) {
          return { ...m, lessons: [...m.lessons, movedLesson!] };
        }
        return m;
      }));
    }
  };

  // Module & Lesson Add/Remove Handlers
  const handleAddModule = () => {
    const newMod: Module = {
      id: toUuid(`mod-${Date.now()}`),
      title: `Module ${modules.length + 1} : Nouveau Chapitre`,
      lessons: []
    };
    setModules([...modules, newMod]);
  };

  const handleAddLesson = (modId: string) => {
    const newLes: Lesson = {
      id: toUuid(`les-${Date.now()}`),
      title: 'Cours : Nouvelle vidéo & ressources',
      videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
      notes: 'Notes explicatives et consignes...',
      duration: '12:00',
      files: [],
      links: []
    };
    setModules(modules.map(m => m.id === modId ? { ...m, lessons: [...m.lessons, newLes] } : m));
  };

  const handleRemoveModule = (modId: string) => {
    setModules(modules.filter(m => m.id !== modId));
  };

  const handleRemoveLesson = (modId: string, lesId: string) => {
    setModules(modules.map(m => m.id === modId ? { ...m, lessons: m.lessons.filter(l => l.id !== lesId) } : m));
  };

  // MULTIPLE FILES & LINKS HANDLERS
  const handleAddFileToLesson = (modId: string, lesId: string) => {
    setModules(modules.map(m => {
      if (m.id === modId) {
        return {
          ...m,
          lessons: m.lessons.map(l => {
            if (l.id === lesId) {
              const currentFiles = l.files || [];
              const newFile: LessonResourceFile = {
                id: `file-${Date.now()}`,
                name: `Support PDF N°${currentFiles.length + 1}`,
                url: 'https://www.guides-digitaux.com/wp-content/uploads/2026/02/checklist-a-verifier-avant-le-lancement-du-site.webp'
              };
              return { ...l, files: [...currentFiles, newFile] };
            }
            return l;
          })
        };
      }
      return m;
    }));
  };

  const handleRemoveFileFromLesson = (modId: string, lesId: string, fileId: string) => {
    setModules(modules.map(m => {
      if (m.id === modId) {
        return {
          ...m,
          lessons: m.lessons.map(l => {
            if (l.id === lesId) {
              return { ...l, files: (l.files || []).filter(f => f.id !== fileId) };
            }
            return l;
          })
        };
      }
      return m;
    }));
  };

  const handleAddLinkToLesson = (modId: string, lesId: string) => {
    setModules(modules.map(m => {
      if (m.id === modId) {
        return {
          ...m,
          lessons: m.lessons.map(l => {
            if (l.id === lesId) {
              const currentLinks = l.links || [];
              const newLink: LessonExternalLink = {
                id: `link-${Date.now()}`,
                title: `Ressource utile / Notion N°${currentLinks.length + 1}`,
                url: 'https://notion.so'
              };
              return { ...l, links: [...currentLinks, newLink] };
            }
            return l;
          })
        };
      }
      return m;
    }));
  };

  const handleRemoveLinkFromLesson = (modId: string, lesId: string, linkId: string) => {
    setModules(modules.map(m => {
      if (m.id === modId) {
        return {
          ...m,
          lessons: m.lessons.map(l => {
            if (l.id === lesId) {
              return { ...l, links: (l.links || []).filter(lk => lk.id !== linkId) };
            }
            return l;
          })
        };
      }
      return m;
    }));
  };

  // QUIZ HANDLERS
  const handleAddQuizToModule = (modId: string) => {
    setModules(modules.map(m => {
      if (m.id === modId) {
        const newQuiz: ModuleQuiz = {
          id: `quiz-${Date.now()}`,
          title: `Quizz de validation du ${m.title}`,
          passingScorePercent: 100,
          questions: [
            {
              id: `q-${Date.now()}-1`,
              question: 'Quelle est la notion essentielle vue dans ce module ?',
              options: ['Option A (Bonne réponse)', 'Option B (Erreur)', 'Option C (Erreur)'],
              correctOptionIndex: 0,
              explanation: 'Explication pédagogique de la bonne réponse...'
            }
          ]
        };
        return { ...m, quiz: newQuiz };
      }
      return m;
    }));
  };

  const handleRemoveQuizFromModule = (modId: string) => {
    setModules(modules.map(m => m.id === modId ? { ...m, quiz: undefined } : m));
  };

  const handleAddQuestionToQuiz = (modId: string) => {
    setModules(modules.map(m => {
      if (m.id === modId && m.quiz) {
        const newQuestion: QuizQuestion = {
          id: `q-${Date.now()}-${m.quiz.questions.length + 1}`,
          question: `Question N°${m.quiz.questions.length + 1}`,
          options: ['Choix A', 'Choix B', 'Choix C'],
          correctOptionIndex: 0,
          explanation: 'Explication...'
        };
        return {
          ...m,
          quiz: {
            ...m.quiz,
            questions: [...m.quiz.questions, newQuestion]
          }
        };
      }
      return m;
    }));
  };

  const handleRemoveQuestionFromQuiz = (modId: string, qId: string) => {
    setModules(modules.map(m => {
      if (m.id === modId && m.quiz) {
        return {
          ...m,
          quiz: {
            ...m.quiz,
            questions: m.quiz.questions.filter(q => q.id !== qId)
          }
        };
      }
      return m;
    }));
  };

  // PERSIST EDITED FORMATION TO SUPABASE DB & LOCALSTORAGE & REDIRECT
  const handleSaveCourse = async () => {
    setIsSaving(true);

    const parsedNormal = parseFloat(normalPrice) || 0;
    const parsedDiscounted = parseFloat(discountedPrice) || 0;

    let finalPrice = parsedNormal;
    let finalOriginalPrice: number | undefined = undefined;

    if (parsedDiscounted > 0) {
      finalPrice = parsedDiscounted; // L'élève paie le prix remisé
      finalOriginalPrice = parsedNormal; // Le prix normal est barré
    }

    const updatedCourseObj: Course = {
      id: courseId || course?.id || `course-${Date.now()}`,
      title: title || 'Formation sans titre',
      description,
      duration,
      level,
      prerequisites,
      price: finalPrice,
      originalPrice: finalOriginalPrice,
      normalPrice: parsedNormal,
      discountedPrice: parsedDiscounted > 0 ? parsedDiscounted : undefined,
      image: imageUrl,
      category,
      status,
      scheduledPublishDate: status === 'Planifié' ? scheduledPublishDate : undefined,
      studentsCount: course?.studentsCount || 0,
      modules,
      congratulationsMsg,
      certificateEnabled,
      bonusDocTitle,
      bonusDocUrl,
      communityLink,
      liveStreamUrl,
      liveStreamDate,
      liveStreamTitle
    };

    await saveCourseToDb(updatedCourseObj);
    setIsSaving(false);
    router.push('/dashboard/formateur');
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#332420] font-sans">
      <Header />

      {/* BREADCRUMB */}
      <div className="bg-[#f5f1e8] py-3.5 border-b border-[#e8ded0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link href="/dashboard/formateur" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#18757d] hover:underline">
            <ArrowLeft className="w-4 h-4" />
            Retour au Studio Formateur
          </Link>
          <span className="text-xs font-extrabold text-[#332420]">
            Studio de Formation • Édition de la formation
          </span>
        </div>
      </div>

      {/* STEPPER PROGRESS BAR (FULL WIDE) */}
      <section className="py-8 bg-white border-b border-[#eee7da]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-3 gap-6 text-center">
            
            {/* Step 1 Pill */}
            <button
              onClick={() => setCurrentStep(1)}
              className={`p-5 rounded-3xl border-2 transition-all text-left flex items-center gap-4 ${
                currentStep === 1
                  ? 'border-[#18757d] bg-[#e6f4f3] text-[#18757d]'
                  : currentStep > 1
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                  : 'border-[#eee7da] bg-[#faf8f5] text-slate-400'
              }`}
            >
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-extrabold text-sm shrink-0 ${
                currentStep === 1 ? 'bg-[#18757d] text-white' : currentStep > 1 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
              }`}>
                {currentStep > 1 ? '✓' : '1'}
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider block">Étape 1</span>
                <span className="text-sm font-extrabold">Infos et tarifs</span>
              </div>
            </button>

            {/* Step 2 Pill */}
            <button
              onClick={() => setCurrentStep(2)}
              className={`p-5 rounded-3xl border-2 transition-all text-left flex items-center gap-4 ${
                currentStep === 2
                  ? 'border-[#18757d] bg-[#e6f4f3] text-[#18757d]'
                  : currentStep > 2
                  ? 'border-emerald-500 bg-emerald-50 text-emerald-800'
                  : 'border-[#eee7da] bg-[#faf8f5] text-slate-400'
              }`}
            >
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-extrabold text-sm shrink-0 ${
                currentStep === 2 ? 'bg-[#18757d] text-white' : currentStep > 2 ? 'bg-emerald-600 text-white' : 'bg-slate-200 text-slate-600'
              }`}>
                {currentStep > 2 ? '✓' : '2'}
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider block">Étape 2</span>
                <span className="text-sm font-extrabold">Contenu et fichiers ({modules.length} modules)</span>
              </div>
            </button>

            {/* Step 3 Pill */}
            <button
              onClick={() => setCurrentStep(3)}
              className={`p-5 rounded-3xl border-2 transition-all text-left flex items-center gap-4 ${
                currentStep === 3
                  ? 'border-[#18757d] bg-[#e6f4f3] text-[#18757d]'
                  : 'border-[#eee7da] bg-[#faf8f5] text-slate-400'
              }`}
            >
              <div className={`w-10 h-10 rounded-2xl flex items-center justify-center font-extrabold text-sm shrink-0 ${
                currentStep === 3 ? 'bg-[#18757d] text-white' : 'bg-slate-200 text-slate-600'
              }`}>
                3
              </div>
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-wider block">Étape 3</span>
                <span className="text-sm font-extrabold">Conclusion</span>
              </div>
            </button>

          </div>
        </div>
      </section>

      {/* FORM BODY CONTAINER (FULL WIDE MAX-W-7XL) */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white p-8 sm:p-12 rounded-3xl border border-[#eee7da] shadow-sm space-y-10">
            
            {/* STEP 1 CONTENT: INFOS ET TARIFS */}
            {currentStep === 1 && (
              <div className="space-y-8 animate-in fade-in duration-200">
                <div className="border-b border-[#eee7da] pb-6 flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-extrabold text-[#332420] flex items-center gap-2">
                      <Edit3 className="w-6 h-6 text-[#18757d]" />
                      Étape 1 : Infos et tarifs
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">Définissez le titre, le visuel de couverture et la tarification de la formation.</p>
                  </div>
                </div>

                <div className="space-y-6">
                  {/* Title */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold text-[#332420]">Nom / Titre de la Formation :</label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full bg-[#faf8f5] border border-[#eee7da] rounded-2xl px-5 py-4 text-sm font-bold text-[#332420] focus:outline-none focus:border-[#18757d]"
                    />
                  </div>

                  {/* Status Selection Section */}
                  <div className="p-6 bg-[#faf8f5] rounded-3xl border border-[#eee7da] space-y-4">
                    <div className="flex items-center gap-2">
                      <Layers className="w-5 h-5 text-[#18757d]" />
                      <h3 className="text-sm font-extrabold text-[#332420] uppercase tracking-wider">État / Statut de la Formation</h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {/* Publié */}
                      <button
                        type="button"
                        onClick={() => setStatus('Publié')}
                        className={`p-4 rounded-2xl border-2 transition-all text-left space-y-1 ${
                          status === 'Publié'
                            ? 'border-emerald-500 bg-emerald-50 text-emerald-900 shadow-xs'
                            : 'border-[#eee7da] bg-white text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-extrabold uppercase tracking-wider text-emerald-700">● Publié</span>
                          {status === 'Publié' && <CheckCircle2 className="w-4 h-4 text-emerald-600" />}
                        </div>
                        <p className="text-[11px] font-medium text-slate-600">Visible immédiatement sur la boutique et accessible aux élèves.</p>
                      </button>

                      {/* Brouillon */}
                      <button
                        type="button"
                        onClick={() => setStatus('Brouillon')}
                        className={`p-4 rounded-2xl border-2 transition-all text-left space-y-1 ${
                          status === 'Brouillon'
                            ? 'border-amber-500 bg-amber-50 text-amber-900 shadow-xs'
                            : 'border-[#eee7da] bg-white text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-extrabold uppercase tracking-wider text-amber-700">✍️ Brouillon</span>
                          {status === 'Brouillon' && <CheckCircle2 className="w-4 h-4 text-amber-600" />}
                        </div>
                        <p className="text-[11px] font-medium text-slate-600">Masqué de la boutique publique. Réservé à votre édition formateur.</p>
                      </button>

                      {/* Planifié */}
                      <button
                        type="button"
                        onClick={() => setStatus('Planifié')}
                        className={`p-4 rounded-2xl border-2 transition-all text-left space-y-1 ${
                          status === 'Planifié'
                            ? 'border-[#18757d] bg-[#e6f4f3] text-[#18757d] shadow-xs'
                            : 'border-[#eee7da] bg-white text-slate-600 hover:border-slate-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-extrabold uppercase tracking-wider text-[#18757d]">📅 Planifié</span>
                          {status === 'Planifié' && <CheckCircle2 className="w-4 h-4 text-[#18757d]" />}
                        </div>
                        <p className="text-[11px] font-medium text-slate-600">Publication automatique programmée à une date & heure précises.</p>
                      </button>
                    </div>

                    {/* Date & Time Picker for Planifié */}
                    {status === 'Planifié' && (
                      <div className="pt-4 border-t border-[#eee7da] grid grid-cols-1 sm:grid-cols-2 gap-6 animate-in fade-in duration-200">
                        <div className="space-y-1.5">
                          <label className="text-xs font-extrabold text-[#332420]">Date & Heure de publication automatique :</label>
                          <input
                            type="datetime-local"
                            value={scheduledPublishDate}
                            onChange={(e) => setScheduledPublishDate(e.target.value)}
                            className="w-full bg-white border border-[#18757d] rounded-xl px-4 py-3 text-xs font-bold text-[#332420] focus:outline-none"
                          />
                        </div>

                        <div className="p-4 bg-[#e6f4f3] rounded-2xl border border-[#18757d]/30 text-xs text-[#18757d] font-bold flex items-center gap-2">
                          <Clock className="w-5 h-5 shrink-0 text-[#18757d]" />
                          <span>
                            {scheduledPublishDate
                              ? `Publication automatique programmée le ${new Date(scheduledPublishDate).toLocaleDateString('fr-FR')} à ${new Date(scheduledPublishDate).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}.`
                              : 'Veuillez choisir la date et l\'heure de sortie ci-contre.'}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Cover Photo Upload Section */}
                  <div className="p-6 bg-[#faf8f5] rounded-3xl border border-[#eee7da] space-y-4">
                    <div className="flex items-center gap-2">
                      <Sparkles className="w-5 h-5 text-[#18757d]" />
                      <h3 className="text-sm font-extrabold text-[#332420] uppercase tracking-wider">Photo / Visuel de couverture de la Formation</h3>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
                      <div className="md:col-span-4 relative h-48 rounded-2xl overflow-hidden border-2 border-[#18757d]/30 bg-slate-100 shadow-sm shrink-0">
                        {imageUrl ? (
                          <img src={imageUrl} alt="Aperçu couverture" className="w-full h-full object-cover" />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs font-bold">
                            Aucun visuel
                          </div>
                        )}
                        <span className="absolute top-3 left-3 bg-[#18757d] text-white text-[10px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider">
                          Aperçu Fiche
                        </span>
                      </div>

                      <div className="md:col-span-8 space-y-4">
                        <div className="space-y-1.5">
                          <label className="text-xs font-extrabold text-[#332420]">Uploader une photo depuis votre ordinateur :</label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            className="w-full text-xs text-slate-600 bg-white border border-[#eee7da] rounded-xl p-3 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-extrabold file:bg-[#18757d] file:text-white hover:file:bg-[#12595f] cursor-pointer"
                          />
                          <span className="text-[11px] text-slate-500">Sélectionnez une image (JPG, PNG, WebP) pour la télécharger.</span>
                        </div>

                        <div className="space-y-1.5">
                          <label className="text-xs font-extrabold text-[#332420]">Ou coller l'URL d'une image en ligne :</label>
                          <input
                            type="text"
                            placeholder="https://..."
                            value={imageUrl}
                            onChange={(e) => setImageUrl(e.target.value)}
                            className="w-full bg-white border border-[#eee7da] rounded-xl px-4 py-3 text-xs font-bold text-[#332420] focus:outline-none focus:border-[#18757d]"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Pricing & Offer Section */}
                  <div className="p-6 bg-[#faf8f5] rounded-3xl border border-[#eee7da] space-y-4">
                    <div className="flex items-center gap-2">
                      <Tag className="w-5 h-5 text-[#18757d]" />
                      <h3 className="text-sm font-extrabold text-[#332420] uppercase tracking-wider">Tarification & Promotion</h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-1.5">
                        <label className="text-xs font-extrabold text-[#332420]">Prix normal (€ TTC) :</label>
                        <input
                          type="number"
                          placeholder="Ex: 149"
                          value={normalPrice}
                          onChange={(e) => setNormalPrice(e.target.value)}
                          className="w-full bg-white border border-[#eee7da] rounded-xl px-4 py-3.5 text-sm font-bold text-[#332420] focus:outline-none focus:border-[#18757d]"
                        />
                        <span className="text-[11px] text-slate-500">Prix de base / standard de la formation.</span>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-extrabold text-[#332420]">Prix remisé (€ TTC - Optionnel) :</label>
                        <input
                          type="number"
                          placeholder="Ex: 100"
                          value={discountedPrice}
                          onChange={(e) => setDiscountedPrice(e.target.value)}
                          className="w-full bg-white border border-[#eee7da] rounded-xl px-4 py-3.5 text-sm font-bold text-[#18757d] focus:outline-none focus:border-[#18757d]"
                        />
                        <span className="text-[11px] text-slate-500">
                          {discountedPrice && parseFloat(discountedPrice) > 0
                            ? `🎉 L'élève paiera ${discountedPrice} € et le prix normal de ${normalPrice || 0} € sera affiché barré.`
                            : 'Laissez ce champ vide si vous ne souhaitez appliquer aucune promotion.'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Live Stream Section (Meet, Zoom, etc.) */}
                  <div className="p-6 bg-gradient-to-r from-blue-50 to-[#faf8f5] rounded-3xl border border-blue-200 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Video className="w-5 h-5 text-blue-600 shrink-0" />
                        <h3 className="text-sm font-extrabold text-[#332420] uppercase tracking-wider">Session en Direct (Google Meet, Zoom, Teams...)</h3>
                      </div>
                      <span className="text-[10px] font-extrabold px-3 py-1 rounded-full bg-blue-100 text-blue-900 border border-blue-200">
                        Optionnel
                      </span>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-1.5 sm:col-span-2">
                        <label className="text-xs font-extrabold text-[#332420]">Intitulé du Direct :</label>
                        <input
                          type="text"
                          placeholder="Ex: Session Live & Questions/Réponses avec Stéphanie"
                          value={liveStreamTitle}
                          onChange={(e) => setLiveStreamTitle(e.target.value)}
                          className="w-full bg-white border border-blue-200 rounded-xl px-4 py-3 text-xs font-bold text-[#332420]"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-extrabold text-[#332420]">Lien URL du Direct (Meet, Zoom...) :</label>
                        <input
                          type="url"
                          placeholder="https://meet.google.com/abc-defg-hij ou https://zoom.us/j/..."
                          value={liveStreamUrl}
                          onChange={(e) => setLiveStreamUrl(e.target.value)}
                          className="w-full bg-white border border-blue-200 rounded-xl px-4 py-3 text-xs font-bold text-[#332420]"
                        />
                        <span className="text-[11px] text-slate-500">Collez le lien de votre réunion en direct.</span>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-extrabold text-[#332420]">Date & Heure de la diffusion :</label>
                        <input
                          type="datetime-local"
                          value={liveStreamDate}
                          onChange={(e) => setLiveStreamDate(e.target.value)}
                          className="w-full bg-white border border-blue-200 rounded-xl px-4 py-3 text-xs font-bold text-[#332420]"
                        />
                        <span className="text-[11px] text-slate-500">Un macaron "Direct Programmé" sera affiché pour les élèves.</span>
                      </div>
                    </div>
                  </div>

                  {/* General Info Details */}
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    <div className="space-y-1.5">
                      <label className="text-xs font-extrabold text-[#332420]">Durée estimée :</label>
                      <input
                        type="text"
                        value={duration}
                        onChange={(e) => setDuration(e.target.value)}
                        className="w-full bg-[#faf8f5] border border-[#eee7da] rounded-xl px-4 py-3 text-xs text-[#332420]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-extrabold text-[#332420]">Niveau requis :</label>
                      <select
                        value={level}
                        onChange={(e) => setLevel(e.target.value)}
                        className="w-full bg-[#faf8f5] border border-[#eee7da] rounded-xl px-4 py-3 text-xs text-[#332420]"
                      >
                        <option value="100% Adapté Débutant">100% Adapté Débutant</option>
                        <option value="Intermédiaire">Intermédiaire</option>
                        <option value="Tous niveaux">Tous niveaux</option>
                      </select>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-extrabold text-[#332420]">Catégorie :</label>
                      <input
                        type="text"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                        className="w-full bg-[#faf8f5] border border-[#eee7da] rounded-xl px-4 py-3 text-xs text-[#332420]"
                      />
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold text-[#332420]">Description courte :</label>
                    <input
                      type="text"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full bg-[#faf8f5] border border-[#eee7da] rounded-xl px-4 py-3 text-xs text-[#332420]"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold text-[#332420]">Prérequis nécessaires :</label>
                    <textarea
                      rows={3}
                      value={prerequisites}
                      onChange={(e) => setPrerequisites(e.target.value)}
                      className="w-full bg-[#faf8f5] border border-[#eee7da] rounded-xl p-4 text-xs text-[#332420]"
                    ></textarea>
                  </div>
                </div>

                <div className="pt-6 border-t border-[#eee7da] flex items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={handleSaveCourse}
                    disabled={isSaving}
                    className="px-6 py-4 text-xs font-extrabold text-white bg-emerald-600 hover:bg-emerald-700 rounded-2xl shadow-md uppercase tracking-wider transition-colors flex items-center gap-2"
                  >
                    <Save className="w-4.5 h-4.5" />
                    {isSaving ? 'ENREGISTREMENT...' : 'ENREGISTRER RAPIDEMENT'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="px-8 py-4 text-xs font-extrabold text-white bg-[#18757d] hover:bg-[#12595f] rounded-2xl shadow-md uppercase tracking-wider transition-colors flex items-center gap-2"
                  >
                    CONTINUER VERS L'ÉTAPE 2 (CONTENU & RESSOURCES)
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 2 CONTENT: CONTENU (EDITION PLEINE PAGE MULTI-FICHIERS, COLLAPSIBLE & DEPLACEMENT) */}
            {currentStep === 2 && (
              <div className="space-y-8 animate-in fade-in duration-200">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#eee7da] pb-6 gap-4">
                  <div>
                    <h2 className="text-2xl font-extrabold text-[#332420] flex items-center gap-2">
                      <Layers className="w-6 h-6 text-[#18757d]" />
                      Étape 2 : Édition des Modules & Cours, Déplacement & Collapsible
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">
                      Réduisez/Dépliez les modules et cours, réordonnez-les avec les flèches ou déplacez un cours vers un autre module.
                    </p>
                  </div>

                  <button
                    type="button"
                    onClick={handleAddModule}
                    className="px-5 py-3 text-xs font-extrabold text-white bg-[#18757d] hover:bg-[#12595f] rounded-2xl transition-colors flex items-center gap-2 uppercase tracking-wider shrink-0 shadow-sm"
                  >
                    <FolderPlus className="w-4 h-4" />
                    + Ajouter un Module
                  </button>
                </div>

                {/* Modules Builder (Full Width Expanded Cards with Reordering & Collapsible Controls) */}
                <div className="space-y-8">
                  {modules.map((mod, mIdx) => {
                    const isModCollapsed = collapsedModules[mod.id] || false;

                    return (
                      <div key={mod.id} className="p-8 bg-[#faf8f5] rounded-3xl border-2 border-[#18757d]/30 space-y-6">
                        
                        {/* Module Title Header Bar */}
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#eee7da]">
                          
                          <div className="flex items-center gap-3 flex-1">
                            {/* Collapse Toggle Button */}
                            <button
                              type="button"
                              onClick={() => toggleModuleCollapse(mod.id)}
                              className="p-2 rounded-xl bg-[#faf8f5] hover:bg-[#e6f4f3] text-[#18757d] transition-colors"
                              title={isModCollapsed ? "Déplier le module" : "Réduire le module"}
                            >
                              {isModCollapsed ? <ChevronRight className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                            </button>

                            <span className="text-sm font-extrabold text-[#18757d] shrink-0">Module {mIdx + 1} :</span>
                            <input
                              type="text"
                              value={mod.title}
                              onChange={(e) => {
                                const val = e.target.value;
                                setModules(modules.map(m => m.id === mod.id ? { ...m, title: val } : m));
                              }}
                              className="font-extrabold text-base text-[#332420] bg-[#faf8f5] border border-[#eee7da] rounded-xl px-4 py-2.5 w-full focus:outline-none focus:border-[#18757d]"
                            />
                          </div>

                          {/* Reordering & Action Controls */}
                          <div className="flex items-center gap-2 shrink-0">
                            {/* Up / Down Module Buttons */}
                            <button
                              type="button"
                              disabled={mIdx === 0}
                              onClick={() => handleMoveModule(mIdx, 'up')}
                              className="p-2 rounded-xl bg-[#faf8f5] hover:bg-[#18757d] hover:text-white text-slate-600 disabled:opacity-30 disabled:hover:bg-[#faf8f5] disabled:hover:text-slate-600 transition-colors"
                              title="Déplacer le module vers le haut"
                            >
                              <ArrowUp className="w-4 h-4" />
                            </button>
                            <button
                              type="button"
                              disabled={mIdx === modules.length - 1}
                              onClick={() => handleMoveModule(mIdx, 'down')}
                              className="p-2 rounded-xl bg-[#faf8f5] hover:bg-[#18757d] hover:text-white text-slate-600 disabled:opacity-30 disabled:hover:bg-[#faf8f5] disabled:hover:text-slate-600 transition-colors"
                              title="Déplacer le module vers le bas"
                            >
                              <ArrowDown className="w-4 h-4" />
                            </button>

                            <div className="w-px h-5 bg-[#eee7da] mx-1" />

                            <button
                              type="button"
                              onClick={() => handleAddLesson(mod.id)}
                              className="px-4 py-2.5 text-xs font-extrabold text-white bg-[#18757d] hover:bg-[#12595f] rounded-xl transition-colors flex items-center gap-1.5 uppercase tracking-wider shadow-2xs"
                            >
                              <PlusCircle className="w-4 h-4" />
                              + Ajouter un Cours
                            </button>

                            <button
                              type="button"
                              onClick={() => handleRemoveModule(mod.id)}
                              className="p-2.5 text-slate-400 hover:text-[#e05a47] rounded-xl transition-colors"
                            >
                              <Trash2 className="w-5 h-5" />
                            </button>
                          </div>

                        </div>

                        {/* Lessons Expanded / Collapsed Tree */}
                        {!isModCollapsed && (
                          <div className="space-y-6">
                            <div className="space-y-6 pl-4 border-l-4 border-[#18757d] animate-in fade-in duration-150">
                            {mod.lessons.map((les, lIdx) => {
                              const isLesCollapsed = collapsedLessons[les.id] || false;

                              return (
                                <div key={les.id} className="p-6 bg-white rounded-3xl border border-[#eee7da] space-y-6 shadow-sm">
                                  
                                  {/* Lesson Header Bar */}
                                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#eee7da] pb-3">
                                    <div className="flex items-center gap-3">
                                      <button
                                        type="button"
                                        onClick={() => toggleLessonCollapse(les.id)}
                                        className="p-1.5 rounded-lg bg-[#faf8f5] hover:bg-[#e6f4f3] text-[#18757d]"
                                        title={isLesCollapsed ? "Déplier le cours" : "Réduire le cours"}
                                      >
                                        {isLesCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                                      </button>

                                      <span className="text-xs font-extrabold text-[#18757d] uppercase tracking-wider flex items-center gap-2">
                                        <Video className="w-4 h-4" />
                                        Cours {mIdx + 1}.{lIdx + 1} : {les.title}
                                      </span>
                                    </div>

                                    {/* Reorder & Transfer Controls */}
                                    <div className="flex items-center gap-2 flex-wrap">
                                      
                                      {/* Move Lesson to Another Module Selector */}
                                      <div className="flex items-center gap-1 bg-[#faf8f5] px-2.5 py-1 rounded-xl border border-[#eee7da]">
                                        <FolderInput className="w-3.5 h-3.5 text-[#18757d]" />
                                        <select
                                          value={mod.id}
                                          onChange={(e) => handleTransferLesson(mod.id, e.target.value, les.id)}
                                          className="bg-transparent text-[11px] font-extrabold text-[#332420] focus:outline-none cursor-pointer"
                                          title="Changer ce cours de module"
                                        >
                                          <option value={mod.id}>Dans ce Module {mIdx + 1}</option>
                                          {modules.filter(m => m.id !== mod.id).map((targetM, targetIdx) => (
                                            <option key={targetM.id} value={targetM.id}>Déplacer vers Module {targetIdx + 1} ({targetM.title})</option>
                                          ))}
                                        </select>
                                      </div>

                                      {/* Up / Down Lesson Buttons */}
                                      <button
                                        type="button"
                                        disabled={lIdx === 0}
                                        onClick={() => handleMoveLesson(mod.id, lIdx, 'up')}
                                        className="p-1.5 rounded-lg bg-[#faf8f5] hover:bg-[#18757d] hover:text-white text-slate-600 disabled:opacity-30 transition-colors"
                                        title="Déplacer le cours vers le haut"
                                      >
                                        <ArrowUp className="w-3.5 h-3.5" />
                                      </button>

                                      <button
                                        type="button"
                                        disabled={lIdx === mod.lessons.length - 1}
                                        onClick={() => handleMoveLesson(mod.id, lIdx, 'down')}
                                        className="p-1.5 rounded-lg bg-[#faf8f5] hover:bg-[#18757d] hover:text-white text-slate-600 disabled:opacity-30 transition-colors"
                                        title="Déplacer le cours vers le bas"
                                      >
                                        <ArrowDown className="w-3.5 h-3.5" />
                                      </button>

                                      <button
                                        type="button"
                                        onClick={() => handleRemoveLesson(mod.id, les.id)}
                                        className="text-slate-400 hover:text-[#e05a47] text-xs font-bold flex items-center gap-1 ml-2"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </div>

                                  {/* Lesson Content Body (Shown if not collapsed) */}
                                  {!isLesCollapsed && (
                                    <div className="space-y-6 animate-in fade-in duration-150">
                                      
                                      {/* Lesson Title & Video URL */}
                                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                        <div className="space-y-1.5">
                                          <label className="text-xs font-extrabold text-slate-700">Titre du Cours :</label>
                                          <input
                                            type="text"
                                            value={les.title}
                                            onChange={(e) => {
                                              const val = e.target.value;
                                              setModules(modules.map(m => {
                                                if (m.id === mod.id) {
                                                  return { ...m, lessons: m.lessons.map(l => l.id === les.id ? { ...l, title: val } : l) };
                                                }
                                                return m;
                                              }));
                                            }}
                                            className="w-full bg-[#faf8f5] border border-[#eee7da] rounded-xl px-4 py-3 text-xs font-bold text-[#332420]"
                                          />
                                        </div>

                                        <div className="space-y-1.5">
                                          <label className="text-xs font-extrabold text-slate-700">URL Vidéo (YouTube / Vimeo / MP4) :</label>
                                          <input
                                            type="text"
                                            value={les.videoUrl}
                                            onChange={(e) => {
                                              const val = e.target.value;
                                              setModules(modules.map(m => {
                                                if (m.id === mod.id) {
                                                  return { ...m, lessons: m.lessons.map(l => l.id === les.id ? { ...l, videoUrl: val } : l) };
                                                }
                                                return m;
                                              }));
                                            }}
                                            className="w-full bg-[#faf8f5] border border-[#eee7da] rounded-xl px-4 py-3 text-xs text-[#332420]"
                                          />
                                        </div>
                                      </div>

                                      {/* Large WYSIWYG Notes Editor */}
                                      <div className="space-y-1.5">
                                        <label className="text-xs font-extrabold text-slate-700">Notes de cours & explications (Éditeur Rich-Text WYSIWYG) :</label>
                                        <WysiwygEditor
                                          value={les.notes || ''}
                                          onChange={(val) => {
                                            setModules(modules.map(m => {
                                              if (m.id === mod.id) {
                                                return { ...m, lessons: m.lessons.map(l => l.id === les.id ? { ...l, notes: val } : l) };
                                              }
                                              return m;
                                            }));
                                          }}
                                          placeholder="Saisissez le contenu riche du cours, les consignes et explications détaillées..."
                                        />
                                      </div>

                                      {/* MULTIPLE RESOURCE FILES SECTION */}
                                      <div className="p-5 bg-[#faf8f5] rounded-2xl border border-[#eee7da] space-y-4">
                                        <div className="flex items-center justify-between">
                                          <div className="flex items-center gap-2">
                                            <Paperclip className="w-4 h-4 text-[#18757d]" />
                                            <span className="text-xs font-extrabold text-[#332420]">Fichiers PDF / Supports téléchargeables ({les.files?.length || 0})</span>
                                          </div>
                                          <button
                                            type="button"
                                            onClick={() => handleAddFileToLesson(mod.id, les.id)}
                                            className="px-3 py-1.5 text-xs font-extrabold text-[#18757d] bg-[#e6f4f3] hover:bg-[#d4edea] rounded-xl transition-colors flex items-center gap-1 uppercase tracking-wider"
                                          >
                                            <Plus className="w-3.5 h-3.5" />
                                            + Ajouter un Fichier
                                          </button>
                                        </div>

                                        {(!les.files || les.files.length === 0) ? (
                                          <p className="text-[11px] text-slate-400 italic">Aucun fichier rattaché à ce cours pour le moment.</p>
                                        ) : (
                                          <div className="space-y-2">
                                            {les.files.map((file) => (
                                              <div key={file.id} className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white p-3 rounded-xl border border-[#eee7da] items-center">
                                                <input
                                                  type="text"
                                                  placeholder="Nom du fichier ex: Fiche pratique PDF"
                                                  value={file.name}
                                                  onChange={(e) => {
                                                    const val = e.target.value;
                                                    setModules(modules.map(m => {
                                                      if (m.id === mod.id) {
                                                        return {
                                                          ...m,
                                                          lessons: m.lessons.map(l => {
                                                            if (l.id === les.id) {
                                                              return {
                                                                ...l,
                                                                files: (l.files || []).map(f => f.id === file.id ? { ...f, name: val } : f)
                                                              };
                                                            }
                                                            return l;
                                                          })
                                                        };
                                                      }
                                                      return m;
                                                    }));
                                                  }}
                                                  className="bg-[#faf8f5] border border-[#eee7da] rounded-lg px-3 py-1.5 text-xs font-bold text-[#332420]"
                                                />

                                                <div className="flex items-center gap-2">
                                                  <input
                                                    type="text"
                                                    placeholder="URL du fichier (https://.../fiche.pdf)"
                                                    value={file.url}
                                                    onChange={(e) => {
                                                      const val = e.target.value;
                                                      setModules(modules.map(m => {
                                                        if (m.id === mod.id) {
                                                          return {
                                                            ...m,
                                                            lessons: m.lessons.map(l => {
                                                              if (l.id === les.id) {
                                                                return {
                                                                  ...l,
                                                                  files: (l.files || []).map(f => f.id === file.id ? { ...f, url: val } : f)
                                                                };
                                                              }
                                                              return l;
                                                            })
                                                          };
                                                        }
                                                        return m;
                                                      }));
                                                    }}
                                                    className="bg-[#faf8f5] border border-[#eee7da] rounded-lg px-3 py-1.5 text-xs text-[#332420] w-full"
                                                  />
                                                  <button
                                                    type="button"
                                                    onClick={() => handleRemoveFileFromLesson(mod.id, les.id, file.id)}
                                                    className="p-1.5 text-slate-400 hover:text-[#e05a47]"
                                                  >
                                                    <Trash2 className="w-4 h-4" />
                                                  </button>
                                                </div>
                                              </div>
                                            ))}
                                          </div>
                                        )}
                                      </div>

                                      {/* MULTIPLE EXTERNAL LINKS SECTION */}
                                      <div className="p-5 bg-[#faf8f5] rounded-2xl border border-[#eee7da] space-y-4">
                                        <div className="flex items-center justify-between">
                                          <div className="flex items-center gap-2">
                                            <LinkIcon className="w-4 h-4 text-[#18757d]" />
                                            <span className="text-xs font-extrabold text-[#332420]">Liens externes utiles / Notion / Drive ({les.links?.length || 0})</span>
                                          </div>
                                          <button
                                            type="button"
                                            onClick={() => handleAddLinkToLesson(mod.id, les.id)}
                                            className="px-3 py-1.5 text-xs font-extrabold text-[#18757d] bg-[#e6f4f3] hover:bg-[#d4edea] rounded-xl transition-colors flex items-center gap-1 uppercase tracking-wider"
                                          >
                                            <Plus className="w-3.5 h-3.5" />
                                            + Ajouter un Lien
                                          </button>
                                        </div>

                                        {(!les.links || les.links.length === 0) ? (
                                          <p className="text-[11px] text-slate-400 italic">Aucun lien externe rattaché à ce cours pour le moment.</p>
                                        ) : (
                                          <div className="space-y-2">
                                            {les.links.map((link) => (
                                              <div key={link.id} className="grid grid-cols-1 sm:grid-cols-2 gap-3 bg-white p-3 rounded-xl border border-[#eee7da] items-center">
                                                <input
                                                  type="text"
                                                  placeholder="Intitulé du lien ex: Modèle Notion"
                                                  value={link.title}
                                                  onChange={(e) => {
                                                    const val = e.target.value;
                                                    setModules(modules.map(m => {
                                                      if (m.id === mod.id) {
                                                        return {
                                                          ...m,
                                                          lessons: m.lessons.map(l => {
                                                            if (l.id === les.id) {
                                                              return {
                                                                ...l,
                                                                links: (l.links || []).map(lk => lk.id === link.id ? { ...lk, title: val } : lk)
                                                              };
                                                            }
                                                            return l;
                                                          })
                                                        };
                                                      }
                                                      return m;
                                                    }));
                                                  }}
                                                  className="bg-[#faf8f5] border border-[#eee7da] rounded-lg px-3 py-1.5 text-xs font-bold text-[#332420]"
                                                />

                                                <div className="flex items-center gap-2">
                                                  <input
                                                    type="text"
                                                    placeholder="URL du lien (https://notion.so/...)"
                                                    value={link.url}
                                                    onChange={(e) => {
                                                      const val = e.target.value;
                                                      setModules(modules.map(m => {
                                                        if (m.id === mod.id) {
                                                          return {
                                                            ...m,
                                                            lessons: m.lessons.map(l => {
                                                              if (l.id === les.id) {
                                                                return {
                                                                  ...l,
                                                                  links: (l.links || []).map(lk => lk.id === link.id ? { ...lk, url: val } : lk)
                                                                };
                                                              }
                                                              return l;
                                                            })
                                                          };
                                                        }
                                                        return m;
                                                      }));
                                                    }}
                                                    className="bg-[#faf8f5] border border-[#eee7da] rounded-lg px-3 py-1.5 text-xs text-[#332420] w-full"
                                                  />
                                                  <button
                                                    type="button"
                                                    onClick={() => handleRemoveLinkFromLesson(mod.id, les.id, link.id)}
                                                    className="p-1.5 text-slate-400 hover:text-[#e05a47]"
                                                  >
                                                    <Trash2 className="w-4 h-4" />
                                                  </button>
                                                </div>
                                              </div>
                                            ))}
                                          </div>
                                        )}
                                      </div>

                                    </div>
                                  )}

                                </div>
                              );
                            })}
                          </div>

                          {/* MODULE QUIZ BUILDER SECTION */}
                          <div className="pt-6 border-t-2 border-dashed border-[#eee7da]">
                            {!mod.quiz ? (
                              <div className="p-5 bg-purple-50/50 rounded-2xl border border-purple-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                                <div className="flex items-center gap-3">
                                  <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center font-extrabold shrink-0">
                                    🧠
                                  </div>
                                  <div>
                                    <h4 className="text-xs font-extrabold text-purple-950">Quizz & Évaluation de fin de module (Optionnel)</h4>
                                    <p className="text-[11px] text-purple-700">Validez les connaissances de l'élève à la fin de ce chapitre avant de débloquer le suivant.</p>
                                  </div>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => handleAddQuizToModule(mod.id)}
                                  className="px-5 py-2.5 text-xs font-extrabold text-white bg-purple-700 hover:bg-purple-800 rounded-xl shadow-xs transition-colors uppercase tracking-wider shrink-0"
                                >
                                  + AJOUTER UN QUIZZ
                                </button>
                              </div>
                            ) : (
                              <div className="p-6 bg-gradient-to-r from-purple-50 to-indigo-50 rounded-3xl border-2 border-purple-200 space-y-6">
                                
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-purple-200 pb-4">
                                  <div className="flex items-center gap-2">
                                    <CheckSquare className="w-5 h-5 text-purple-700" />
                                    <h4 className="text-sm font-extrabold text-purple-950 uppercase tracking-wider">
                                      Éditeur du Quizz du Module {mIdx + 1} ({mod.quiz.questions.length} Question(s))
                                    </h4>
                                  </div>

                                  <button
                                    type="button"
                                    onClick={() => handleRemoveQuizFromModule(mod.id)}
                                    className="px-3 py-1.5 text-xs font-extrabold text-rose-600 bg-rose-50 hover:bg-rose-100 rounded-xl transition-colors border border-rose-200"
                                  >
                                    Supprimer le Quizz
                                  </button>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                  <div className="space-y-1">
                                    <label className="text-xs font-extrabold text-purple-950">Titre du Quizz :</label>
                                    <input
                                      type="text"
                                      value={mod.quiz.title}
                                      onChange={(e) => {
                                        const val = e.target.value;
                                        setModules(modules.map(m => m.id === mod.id && m.quiz ? { ...m, quiz: { ...m.quiz, title: val } } : m));
                                      }}
                                      className="w-full bg-white border border-purple-200 rounded-xl px-4 py-2.5 text-xs font-bold text-purple-950"
                                    />
                                  </div>

                                  <div className="space-y-1">
                                    <label className="text-xs font-extrabold text-purple-950">Score requis pour réussir (%) :</label>
                                    <select
                                      value={mod.quiz.passingScorePercent}
                                      onChange={(e) => {
                                        const parsed = parseInt(e.target.value);
                                        const val = isNaN(parsed) ? 100 : parsed;
                                        setModules(modules.map(m => m.id === mod.id && m.quiz ? { ...m, quiz: { ...m.quiz, passingScorePercent: val } } : m));
                                      }}
                                      className="w-full bg-white border border-purple-200 rounded-xl px-4 py-2.5 text-xs font-bold text-purple-950"
                                    >
                                      <option value={100}>100% (Sans faute exigé)</option>
                                      <option value={75}>75% (3/4 de bonnes réponses)</option>
                                      <option value={50}>50% (Moyenne)</option>
                                      <option value={0}>0% (Évaluation indicative - Validation auto)</option>
                                    </select>
                                  </div>
                                </div>

                                {/* Question list */}
                                <div className="space-y-6">
                                  {mod.quiz.questions.map((q, qIdx) => (
                                    <div key={q.id} className="p-5 bg-white rounded-2xl border border-purple-200 space-y-4 shadow-xs">
                                      <div className="flex items-center justify-between border-b border-slate-100 pb-2">
                                        <span className="text-xs font-extrabold text-purple-800">
                                          Question N°{qIdx + 1} :
                                        </span>
                                        <button
                                          type="button"
                                          onClick={() => handleRemoveQuestionFromQuiz(mod.id, q.id)}
                                          className="text-slate-400 hover:text-rose-600 text-xs"
                                        >
                                          <Trash2 className="w-4 h-4" />
                                        </button>
                                      </div>

                                      <div className="space-y-1.5">
                                        <label className="text-xs font-extrabold text-slate-700">Intitulé de la question :</label>
                                        <input
                                          type="text"
                                          value={q.question}
                                          onChange={(e) => {
                                            const val = e.target.value;
                                            setModules(modules.map(m => {
                                              if (m.id === mod.id && m.quiz) {
                                                return {
                                                  ...m,
                                                  quiz: {
                                                    ...m.quiz,
                                                    questions: m.quiz.questions.map(quest => quest.id === q.id ? { ...quest, question: val } : quest)
                                                  }
                                                };
                                              }
                                              return m;
                                            }));
                                          }}
                                          className="w-full bg-[#faf8f5] border border-[#eee7da] rounded-xl px-4 py-2.5 text-xs font-bold text-[#332420]"
                                        />
                                      </div>

                                      {/* Options */}
                                      <div className="space-y-2">
                                        <label className="text-xs font-extrabold text-slate-700 block">Options de réponses (Cochez la bonne réponse) :</label>
                                        {q.options.map((opt, optIdx) => (
                                          <div key={optIdx} className="flex items-center gap-3">
                                            <input
                                              type="radio"
                                              name={`correct-${q.id}`}
                                              checked={q.correctOptionIndex === optIdx}
                                              onChange={() => {
                                                setModules(modules.map(m => {
                                                  if (m.id === mod.id && m.quiz) {
                                                    return {
                                                      ...m,
                                                      quiz: {
                                                        ...m.quiz,
                                                        questions: m.quiz.questions.map(quest => quest.id === q.id ? { ...quest, correctOptionIndex: optIdx } : quest)
                                                      }
                                                    };
                                                  }
                                                  return m;
                                                }));
                                              }}
                                              className="w-4 h-4 accent-purple-700 cursor-pointer"
                                            />
                                            <input
                                              type="text"
                                              value={opt}
                                              onChange={(e) => {
                                                const val = e.target.value;
                                                setModules(modules.map(m => {
                                                  if (m.id === mod.id && m.quiz) {
                                                    return {
                                                      ...m,
                                                      quiz: {
                                                        ...m.quiz,
                                                        questions: m.quiz.questions.map(quest => {
                                                          if (quest.id === q.id) {
                                                            const newOpts = [...quest.options];
                                                            newOpts[optIdx] = val;
                                                            return { ...quest, options: newOpts };
                                                          }
                                                          return quest;
                                                        })
                                                      }
                                                    };
                                                  }
                                                  return m;
                                                }));
                                              }}
                                              className={`w-full border rounded-xl px-3 py-2 text-xs ${
                                                q.correctOptionIndex === optIdx ? 'border-emerald-500 bg-emerald-50 font-bold text-emerald-900' : 'border-[#eee7da] bg-[#faf8f5]'
                                              }`}
                                            />
                                          </div>
                                        ))}
                                      </div>

                                      {/* Explanation */}
                                      <div className="space-y-1 pt-1">
                                        <label className="text-[11px] font-extrabold text-slate-500">Explication affichée après validation :</label>
                                        <input
                                          type="text"
                                          placeholder="Explicité pourquoi cette réponse est exacte..."
                                          value={q.explanation || ''}
                                          onChange={(e) => {
                                            const val = e.target.value;
                                            setModules(modules.map(m => {
                                              if (m.id === mod.id && m.quiz) {
                                                return {
                                                  ...m,
                                                  quiz: {
                                                    ...m.quiz,
                                                    questions: m.quiz.questions.map(quest => quest.id === q.id ? { ...quest, explanation: val } : quest)
                                                  }
                                                };
                                              }
                                              return m;
                                            }));
                                          }}
                                          className="w-full bg-[#faf8f5] border border-[#eee7da] rounded-xl px-3 py-2 text-xs text-[#332420]"
                                        />
                                      </div>

                                    </div>
                                  ))}
                                </div>

                                <button
                                  type="button"
                                  onClick={() => handleAddQuestionToQuiz(mod.id)}
                                  className="w-full py-3 text-xs font-extrabold text-purple-900 bg-white hover:bg-purple-100 rounded-xl border border-purple-300 transition-colors uppercase tracking-wider"
                                >
                                  + AJOUTER UNE QUESTION AU QUIZZ
                                </button>

                              </div>
                            )}
                          </div>
                        </div>
                      )}

                    </div>
                  );
                })}
                </div>

                <div className="pt-6 border-t border-[#eee7da] flex items-center justify-between gap-4">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="px-6 py-4 text-xs font-extrabold text-slate-600 hover:bg-slate-100 rounded-2xl uppercase tracking-wider transition-colors"
                  >
                    ← ÉTAPE PRÉCÉDENTE
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveCourse}
                    disabled={isSaving}
                    className="px-6 py-4 text-xs font-extrabold text-white bg-emerald-600 hover:bg-emerald-700 rounded-2xl shadow-md uppercase tracking-wider transition-colors flex items-center gap-2"
                  >
                    <Save className="w-4.5 h-4.5" />
                    {isSaving ? 'ENREGISTREMENT...' : 'ENREGISTRER RAPIDEMENT'}
                  </button>

                  <button
                    type="button"
                    onClick={() => setCurrentStep(3)}
                    className="px-8 py-4 text-xs font-extrabold text-white bg-[#18757d] hover:bg-[#12595f] rounded-2xl shadow-md uppercase tracking-wider transition-colors flex items-center gap-2"
                  >
                    CONTINUER VERS L'ÉTAPE 3 (PARTAGE À LA FIN)
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}

            {/* STEP 3 CONTENT: PARTAGE À LA FIN */}
            {currentStep === 3 && (
              <div className="space-y-6 animate-in fade-in duration-200">
                <div className="border-b border-[#eee7da] pb-4">
                  <h2 className="text-2xl font-extrabold text-[#332420] flex items-center gap-2">
                    <Gift className="w-6 h-6 text-[#18757d]" />
                    Étape 3 : Certificat de Fin, Conclusion & Lien Communauté
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">Configurez l'attestation PDF nominative et le message de félicitations affiché à la fin.</p>
                </div>

                <div className="space-y-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold text-[#332420]">Message de félicitations affiché à la fin :</label>
                    <textarea
                      rows={3}
                      value={congratulationsMsg}
                      onChange={(e) => setCongratulationsMsg(e.target.value)}
                      className="w-full bg-[#faf8f5] border border-[#eee7da] rounded-xl p-4 text-xs text-[#332420]"
                    ></textarea>
                  </div>

                  <div className="p-5 bg-[#faf8f5] rounded-2xl border border-[#eee7da] flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Award className="w-6 h-6 text-amber-500 shrink-0" />
                      <div>
                        <h4 className="text-xs font-extrabold text-[#332420]">Certificat de fin de formation</h4>
                        <p className="text-[11px] text-slate-500">Générer automatiquement une attestation nominative PDF de réussite pour l'élève.</p>
                      </div>
                    </div>

                    <input
                      type="checkbox"
                      checked={certificateEnabled}
                      onChange={(e) => setCertificateEnabled(e.target.checked)}
                      className="w-5 h-5 accent-[#18757d] cursor-pointer"
                    />
                  </div>

                  <div className="space-y-4 p-5 bg-[#faf8f5] rounded-2xl border border-[#eee7da]">
                    <span className="text-xs font-extrabold text-[#18757d] uppercase tracking-wider block">
                      Document / Fichier Bonus Partagé à la Fin
                    </span>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-extrabold text-[#332420]">Nom du document final :</label>
                        <input
                          type="text"
                          value={bonusDocTitle}
                          onChange={(e) => setBonusDocTitle(e.target.value)}
                          className="w-full bg-white border border-[#eee7da] rounded-xl px-4 py-3 text-xs text-[#332420]"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-extrabold text-[#332420]">Lien du PDF / Fichier final :</label>
                        <input
                          type="text"
                          value={bonusDocUrl}
                          onChange={(e) => setBonusDocUrl(e.target.value)}
                          className="w-full bg-white border border-[#eee7da] rounded-xl px-4 py-3 text-xs text-[#332420]"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold text-[#332420]">Lien d'accès au groupe / communauté :</label>
                    <input
                      type="text"
                      value={communityLink}
                      onChange={(e) => setCommunityLink(e.target.value)}
                      className="w-full bg-[#faf8f5] border border-[#eee7da] rounded-xl px-4 py-3 text-xs text-[#332420]"
                    />
                  </div>
                </div>

                {/* SAVE ACTIONS */}
                <div className="pt-6 border-t border-[#eee7da] flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(2)}
                    className="px-6 py-4 text-xs font-extrabold text-slate-600 hover:bg-slate-100 rounded-2xl uppercase tracking-wider transition-colors"
                  >
                    ← ÉTAPE PRÉCÉDENTE
                  </button>

                  <button
                    type="button"
                    onClick={handleSaveCourse}
                    disabled={isSaving}
                    className="px-8 py-4 text-xs font-extrabold text-white bg-emerald-600 hover:bg-emerald-700 rounded-2xl shadow-lg uppercase tracking-wider transition-colors flex items-center gap-2"
                  >
                    <Save className="w-5 h-5" />
                    {isSaving ? 'ENREGISTREMENT EN COURS...' : 'ENREGISTRER LES MODIFICATIONS'}
                  </button>
                </div>
              </div>
            )}

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default function CourseEditorPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs font-bold text-[#18757d]">Chargement de l'éditeur...</div>}>
      <CourseEditorContent />
    </Suspense>
  );
}
