'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WysiwygEditor from '@/components/WysiwygEditor';
import { saveCourseToDb } from '@/lib/supabaseLms';
import { Course, Module, Lesson, LessonResourceFile, LessonExternalLink } from '@/lib/coursesStore';
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
  Tag,
  Calendar,
  Link as LinkIcon,
  Paperclip,
  Plus
} from 'lucide-react';

export default function NewCourseWizardPage() {
  const router = useRouter();
  const [currentStep, setCurrentStep] = useState<1 | 2 | 3>(1);
  const [isSaving, setIsSaving] = useState(false);

  // STEP 1: INFORMATIONS DE BASE, TARIF REMISÉ & PRÉCOMMANDE
  const [title, setTitle] = useState('');
  const [duration, setDuration] = useState('3h30');
  const [level, setLevel] = useState('Débutant');
  const [prerequisites, setPrerequisites] = useState('Aucun prérequis technique nécessaire. Avoir un ordinateur connecté à internet.');
  const [price, setPrice] = useState('99');
  const [originalPrice, setOriginalPrice] = useState('149');
  const [isPreorder, setIsPreorder] = useState(false);
  const [preorderReleaseDate, setPreorderReleaseDate] = useState('15 Novembre 2026');
  const [category, setCategory] = useState('Formation Vidéo');
  const [status, setStatus] = useState<'Publié' | 'Brouillon' | 'Planifié'>('Brouillon');
  const [scheduledPublishDate, setScheduledPublishDate] = useState('');
  const [description, setDescription] = useState('Formation vidéo pratique pour artisans et créateurs.');

  // STEP 2: CONTENU (MODULES & COURS EXPANDED)
  const [modules, setModules] = useState<Module[]>([
    {
      id: 'mod-1',
      title: 'Module 1 : Prise en main et Prérequis',
      lessons: [
        {
          id: 'les-1',
          title: 'Cours 1.1 : Bienvenue & Présentation du programme',
          videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
          notes: 'Présentation globale de la formation et téléchargement de la feuille de route.',
          duration: '10:00',
          files: [
            {
              id: 'file-init-1',
              name: 'Support PDF N°1 - Feuille de route',
              url: 'https://www.guides-digitaux.com/wp-content/uploads/2026/02/checklist-a-verifier-avant-le-lancement-du-site.webp'
            }
          ],
          links: [
            {
              id: 'link-init-1',
              title: 'Tableau Notion d’accompagnement',
              url: 'https://notion.so'
            }
          ]
        }
      ]
    }
  ]);

  // STEP 3: PARTAGE À LA FIN
  const [congratulationsMsg, setCongratulationsMsg] = useState('Bravo ! Tu as terminé avec succès l\'ensemble des leçons de cette formation.');
  const [certificateEnabled, setCertificateEnabled] = useState(true);
  const [bonusDocTitle, setBonusDocTitle] = useState('Checklist ultime de contrôle post-formation');
  const [bonusDocUrl, setBonusDocUrl] = useState('https://www.guides-digitaux.com/wp-content/uploads/2026/02/checklist-a-verifier-avant-le-lancement-du-site.webp');
  const [communityLink, setCommunityLink] = useState('');

  // Module & Lesson Handlers
  const handleAddModule = () => {
    const newMod: Module = {
      id: `mod-${Date.now()}`,
      title: `Module ${modules.length + 1} : Nouveau Chapitre`,
      lessons: []
    };
    setModules([...modules, newMod]);
  };

  const handleAddLesson = (modId: string) => {
    const newLes: Lesson = {
      id: `les-${Date.now()}`,
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

  // PERSIST NEW FORMATION TO SUPABASE DB & LOCALSTORAGE & REDIRECT
  const handleSaveCourse = async () => {
    setIsSaving(true);
    const newCourseObj: Course = {
      id: `course-${Date.now()}`,
      title: title || 'Nouvelle Formation sans titre',
      description,
      duration,
      level,
      prerequisites,
      price: parseFloat(price) || 99,
      originalPrice: parseFloat(originalPrice) || 0,
      isPreorder,
      preorderReleaseDate,
      category,
      status,
      scheduledPublishDate: status === 'Planifié' ? scheduledPublishDate : undefined,
      studentsCount: 0,
      modules,
      congratulationsMsg,
      certificateEnabled,
      bonusDocTitle,
      bonusDocUrl,
      communityLink
    };

    await saveCourseToDb(newCourseObj);
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
            Studio de Création de Formation
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
                <span className="text-sm font-extrabold">Infos, Tarif Remisé & Précommande</span>
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
                <span className="text-sm font-extrabold">Contenu, WYSIWYG & Fichiers ({modules.length} modules)</span>
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
                <span className="text-sm font-extrabold">Certificat, Conclusion & Partage</span>
              </div>
            </button>

          </div>
        </div>
      </section>

      {/* FORM BODY CONTAINER (FULL WIDE MAX-W-7XL) */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white p-8 sm:p-12 rounded-3xl border border-[#eee7da] shadow-sm space-y-10">
            
            {/* STEP 1 CONTENT: INFORMATIONS DE BASE, TARIF REMISÉ & PRÉCOMMANDE */}
            {currentStep === 1 && (
              <div className="space-y-8 animate-in fade-in duration-200">
                <div className="border-b border-[#eee7da] pb-6">
                  <h2 className="text-2xl font-extrabold text-[#332420] flex items-center gap-2">
                    <BookOpen className="w-6 h-6 text-[#18757d]" />
                    Étape 1 : Informations de base, Tarif Remisé & Précommande
                  </h2>
                  <p className="text-xs text-slate-500 mt-1">Définissez le titre, le tarif de vente, le tarif d'origine barré et l'option de précommande.</p>
                </div>

                <div className="space-y-6">
                  {/* Title */}
                  <div className="space-y-1.5">
                    <label className="text-xs font-extrabold text-[#332420]">Nom / Titre de la Formation :</label>
                    <input
                      type="text"
                      required
                      placeholder="Ex: Formation Vidéo : Maîtriser le SEO & la rédaction web pour artisans"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      className="w-full bg-[#faf8f5] border border-[#eee7da] rounded-2xl px-5 py-4 text-sm font-bold text-[#332420] focus:outline-none focus:border-[#18757d]"
                    />
                  </div>

                  {/* Status Selection Section */}
                  <div className="p-6 bg-[#faf8f5] rounded-3xl border border-[#eee7da] space-y-4">
                    <div className="flex items-center gap-2">
                      <Layers className="w-5 h-5 text-[#18757d]" />
                      <h3 className="text-sm font-extrabold text-[#332420] uppercase tracking-wider">Statut & Publication</h3>
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

                  {/* Pricing & Offer Section */}
                  <div className="p-6 bg-[#faf8f5] rounded-3xl border border-[#eee7da] space-y-4">
                    <div className="flex items-center gap-2">
                      <Tag className="w-5 h-5 text-[#18757d]" />
                      <h3 className="text-sm font-extrabold text-[#332420] uppercase tracking-wider">Tarification & Promotion</h3>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                      <div className="space-y-1.5">
                        <label className="text-xs font-extrabold text-[#332420]">Tarif de vente final (€ TTC) :</label>
                        <input
                          type="number"
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          className="w-full bg-white border border-[#eee7da] rounded-xl px-4 py-3.5 text-sm font-bold text-[#18757d]"
                        />
                        <span className="text-[11px] text-slate-500">Prix réel payé par l'élève lors de la commande.</span>
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-extrabold text-[#332420]">Tarif d'origine remisé / barré (€ TTC) :</label>
                        <input
                          type="number"
                          placeholder="Ex: 149 (Affiche 149€ barré ➔ 99€)"
                          value={originalPrice}
                          onChange={(e) => setOriginalPrice(e.target.value)}
                          className="w-full bg-white border border-[#eee7da] rounded-xl px-4 py-3.5 text-sm font-bold text-slate-400 line-through"
                        />
                        <span className="text-[11px] text-slate-500">Affiché sous forme de prix de base barré pour valoriser l'offre.</span>
                      </div>
                    </div>
                  </div>

                  {/* Preorder Option Section */}
                  <div className="p-6 bg-gradient-to-r from-amber-50 to-[#faf8f5] rounded-3xl border border-amber-200 space-y-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <Calendar className="w-6 h-6 text-amber-600 shrink-0" />
                        <div>
                          <h3 className="text-sm font-extrabold text-[#332420]">Proposer cette formation en précommande</h3>
                          <p className="text-xs text-slate-600">Permet aux élèves de précommander la formation avant la date officielle de sortie.</p>
                        </div>
                      </div>

                      <input
                        type="checkbox"
                        checked={isPreorder}
                        onChange={(e) => setIsPreorder(e.target.checked)}
                        className="w-6 h-6 accent-amber-600 cursor-pointer rounded-lg"
                      />
                    </div>

                    {isPreorder && (
                      <div className="pt-4 border-t border-amber-200/60 grid grid-cols-1 sm:grid-cols-2 gap-6 animate-in fade-in duration-200">
                        <div className="space-y-1.5">
                          <label className="text-xs font-extrabold text-[#332420]">Date de disponibilité / Sortie officielle :</label>
                          <input
                            type="text"
                            placeholder="Ex: 15 Novembre 2026"
                            value={preorderReleaseDate}
                            onChange={(e) => setPreorderReleaseDate(e.target.value)}
                            className="w-full bg-white border border-amber-300 rounded-xl px-4 py-3 text-xs font-bold text-[#332420]"
                          />
                        </div>

                        <div className="p-4 bg-white/80 rounded-2xl border border-amber-200 text-xs text-amber-900 font-medium">
                          💡 <strong>Mode Précommande activé :</strong> Un badge "PRÉCOMMANDE - SORTIE LE {preorderReleaseDate.toUpperCase()}" sera affiché sur la fiche formation avec le tarif promotionnel de lancement.
                        </div>
                      </div>
                    )}
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

                <div className="pt-6 border-t border-[#eee7da] flex justify-end">
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

            {/* STEP 2 CONTENT: CONTENU (EDITION PLEINE PAGE MULTI-FICHIERS ET LIENS) */}
            {currentStep === 2 && (
              <div className="space-y-8 animate-in fade-in duration-200">
                <div className="flex items-center justify-between border-b border-[#eee7da] pb-6">
                  <div>
                    <h2 className="text-2xl font-extrabold text-[#332420] flex items-center gap-2">
                      <Layers className="w-6 h-6 text-[#18757d]" />
                      Étape 2 : Éditeur de Cours, Notes WYSIWYG & Zone de Ressources
                    </h2>
                    <p className="text-xs text-slate-500 mt-1">Espace d'édition pleine page. Ajoutez des notes détaillées, plusieurs fichiers téléchargeables et des liens utiles par cours.</p>
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

                {/* Modules Builder (Full Width Expanded Cards) */}
                <div className="space-y-8">
                  {modules.map((mod, mIdx) => (
                    <div key={mod.id} className="p-8 bg-[#faf8f5] rounded-3xl border-2 border-[#18757d]/30 space-y-6">
                      
                      {/* Module Title Header */}
                      <div className="flex items-center justify-between gap-4 bg-white p-4 rounded-2xl border border-[#eee7da]">
                        <div className="flex items-center gap-3 flex-1">
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

                        <div className="flex items-center gap-3 shrink-0">
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

                      {/* Lessons Expanded Tree */}
                      <div className="space-y-6 pl-4 border-l-4 border-[#18757d]">
                        {mod.lessons.map((les, lIdx) => (
                          <div key={les.id} className="p-6 bg-white rounded-3xl border border-[#eee7da] space-y-6 shadow-sm">
                            <div className="flex items-center justify-between border-b border-[#eee7da] pb-3">
                              <span className="text-xs font-extrabold text-[#18757d] uppercase tracking-wider flex items-center gap-2">
                                <Video className="w-4 h-4" />
                                Édition du Cours {mIdx + 1}.{lIdx + 1}
                              </span>
                              <button
                                type="button"
                                onClick={() => handleRemoveLesson(mod.id, les.id)}
                                className="text-slate-400 hover:text-[#e05a47] text-xs font-bold flex items-center gap-1"
                              >
                                <Trash2 className="w-4 h-4" />
                                Supprimer le cours
                              </button>
                            </div>

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
                        ))}
                      </div>

                    </div>
                  ))}
                </div>

                <div className="pt-6 border-t border-[#eee7da] flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => setCurrentStep(1)}
                    className="px-6 py-4 text-xs font-extrabold text-slate-600 hover:bg-slate-100 rounded-2xl uppercase tracking-wider transition-colors"
                  >
                    ← ÉTAPE PRÉCÉDENTE
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
                    {isSaving ? 'ENREGISTREMENT EN COURS...' : 'ENREGISTRER & PUBLIER'}
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
