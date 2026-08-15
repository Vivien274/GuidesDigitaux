'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useParams, useRouter, notFound } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import VideoPlayer from '@/components/VideoPlayer';
import { getStoredCourses, Course } from '@/lib/coursesStore';
import { fetchCoursesFromDb } from '@/lib/supabaseLms';
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

  const [courseData, setCourseData] = useState<any>(null);
  const [activeLesson, setActiveLesson] = useState<any>(null);
  const [completedLessons, setCompletedLessons] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // QUIZ STATE
  const [passedQuizzes, setPassedQuizzes] = useState<Record<string, boolean>>({});
  const [selectedQuizAnswers, setSelectedQuizAnswers] = useState<Record<string, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [quizScore, setQuizScore] = useState<number>(0);
  const [quizPassed, setQuizPassed] = useState<boolean>(false);

  useEffect(() => {
    async function syncCourse() {
      setIsLoading(true);
      const dbCourses = await fetchCoursesFromDb();
      let match = (dbCourses || []).find(c => 
        c.id === slug || 
        (c as any).slug === slug ||
        (slug === 'formation-woocommerce' && (c.id === 'c2' || c.title.toLowerCase().includes('woocommerce'))) ||
        (slug === 'creer-sa-vitrine-wordpress' && (c.id === 'c1' || c.title.toLowerCase().includes('wordpress')))
      );

      if (!match) {
        const localCourses = getStoredCourses();
        match = localCourses.find(c => c.id === slug || (c as any).slug === slug);
      }

      if (!match || !match.modules || match.modules.length === 0) {
        notFound();
        return;
      }

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
      if (formatted.modules[0]?.lessons?.length > 0) {
        setActiveLesson(formatted.modules[0].lessons[0]);
      }
      setIsLoading(false);
    }
    syncCourse();
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

  if (isLoading || !courseData) {
    return (
      <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#18757d] border-t-transparent"></div>
      </div>
    );
  }

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

                  <div 
                    className="text-sm text-[#5e4d46] leading-relaxed prose max-w-none prose-headings:text-[#18757d] prose-headings:font-extrabold prose-strong:text-[#332420] prose-strong:font-black prose-a:text-[#18757d] prose-a:font-bold hover:prose-a:underline prose-li:text-[#5e4d46]"
                    dangerouslySetInnerHTML={{ __html: activeLesson?.notes || 'Descriptif et notes d\'accompagnement de la leçon.' }}
                  />

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
