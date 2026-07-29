'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { 
  BookOpen, 
  Download, 
  PlayCircle, 
  CheckCircle2, 
  Clock, 
  Sparkles, 
  FileText, 
  ArrowRight,
  ShieldCheck,
  Check,
  ShoppingBag,
  Award
} from 'lucide-react';

import { fetchCoursesFromDb } from '@/lib/supabaseLms';

const DEFAULT_PURCHASED = [
  {
    id: 'c2',
    title: 'Formation Vidéo : Ajouter une boutique en ligne avec WooCommerce',
    slug: 'formation-woocommerce',
    type: 'formation',
    typeLabel: 'Formation Vidéo HD',
    thumbnail: 'https://www.guides-digitaux.com/wp-content/uploads/2026/02/un-artisan-createur-devant-son-PC-en-train-dajouter-ses-produits-dnas-saboutique-en-ligne.-accoude-a-son-etabli-dans-son-atelier.-lumiere-naturelle.webp',
    progress: 25,
    completedLessons: 1,
    totalLessons: 4,
    duration: '2h15',
    instructor: 'Stéphanie ROCQ',
    downloadPdf: '/downloads/support-formation-woocommerce.pdf'
  }
];

function EleveDashboardContent() {
  const { user } = useAuth();
  const searchParams = useSearchParams();
  const isJustPurchased = searchParams.get('purchased') === 'true';

  const [courses, setCourses] = useState(DEFAULT_PURCHASED);

  useEffect(() => {
    async function syncEnrolledCourses() {
      try {
        const dbCourses = await fetchCoursesFromDb();
        const publishedIds = new Set(dbCourses.map(c => c.id));
        const publishedSlugs = new Set(dbCourses.map(c => c.title.toLowerCase().includes('woocommerce') ? 'formation-woocommerce' : 'creer-sa-vitrine-wordpress'));

        const extra = localStorage.getItem('gd_enrolled_courses');
        let baseList: any[] = [];

        if (extra) {
          try {
            const parsed = JSON.parse(extra);
            if (Array.isArray(parsed) && parsed.length > 0) {
              baseList = parsed.filter((item: any) => {
                const itemSlug = item.slug || (item.title?.toLowerCase().includes('woocommerce') ? 'formation-woocommerce' : 'creer-sa-vitrine-wordpress');
                return publishedIds.has(item.id) || publishedSlugs.has(itemSlug) || dbCourses.some(c => c.title === item.title);
              });
            }
          } catch (e) {}
        }

        if (baseList.length === 0) {
          baseList = dbCourses.map(c => ({
            id: c.id,
            title: c.title,
            slug: c.title.toLowerCase().includes('woocommerce') ? 'formation-woocommerce' : 'creer-sa-vitrine-wordpress',
            type: 'formation',
            typeLabel: 'Formation Vidéo HD',
            duration: c.duration || '2h15',
            totalLessons: c.modules ? c.modules.reduce((acc, m) => acc + (m.lessons?.length || 0), 0) : 4
          }));
        }

        const formattedReal = baseList.map((item: any) => {
          const matchedDb = dbCourses.find(c => c.id === item.id || c.title === item.title);
          const targetTitle = matchedDb?.title || item.title || DEFAULT_PURCHASED[0].title;
          const targetId = matchedDb?.id || item.id || 'c2';
          const targetSlug = item.slug || (targetTitle.toLowerCase().includes('woocommerce') ? 'formation-woocommerce' : 'creer-sa-vitrine-wordpress');
          
          const totalLess = matchedDb?.modules ? matchedDb.modules.reduce((acc, m) => acc + (m.lessons?.length || 0), 0) : (item.totalLessons || 4);

          const storedBySlug = localStorage.getItem(`gd_completed_lessons_${targetSlug}`);
          const storedById = localStorage.getItem(`gd_completed_lessons_${targetId}`);
          
          const rawArr = storedBySlug || storedById;
          let liveProg = item.progress || 0;

          if (rawArr) {
            try {
              const arr = JSON.parse(rawArr);
              if (Array.isArray(arr) && arr.length > 0) {
                liveProg = Math.min(100, Math.round((arr.length / totalLess) * 100));
              }
            } catch (e) {}
          }

          return {
            id: targetId,
            title: targetTitle,
            slug: targetSlug,
            type: item.type || 'formation',
            typeLabel: item.typeLabel || 'Formation Vidéo HD',
            thumbnail: item.image || item.thumbnail || DEFAULT_PURCHASED[0].thumbnail,
            progress: liveProg,
            completedLessons: item.completedLessons || 0,
            totalLessons: totalLess,
            duration: matchedDb?.duration || item.duration || '2h15',
            instructor: 'Stéphanie ROCQ',
            downloadPdf: item.downloadPdf || '/downloads/support-formation-woocommerce.pdf'
          };
        });

        setCourses(formattedReal);
      } catch (e) {
        console.error('Failed to load enrolled courses', e);
      }
    }
    syncEnrolledCourses();
  }, []);

  const activeCourse = courses.length > 0 ? courses[0] : null;

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#332420] font-sans">
      <Header />

      {/* SUCCESS PURCHASE ALERT */}
      {isJustPurchased && (
        <div className="bg-emerald-600 text-white py-4 px-4 shadow-md">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 text-xs font-bold">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-amber-300 shrink-0" />
              <span>🎉 Félicitations pour votre achat ! Votre formation est débloquée et disponible ci-dessous.</span>
            </div>
            {activeCourse && (
              <Link href={`/formation/${activeCourse.slug}`} className="underline hover:text-amber-200">
                Lancer la vidéo immédiatement →
              </Link>
            )}
          </div>
        </div>
      )}

      {/* BANNER USER HEADER */}
      <section className="py-10 bg-gradient-to-b from-[#eef4fb] to-[#faf8f5] border-b border-[#eee7da]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="inline-block px-3 py-0.5 rounded-full text-[11px] font-extrabold bg-[#e6f4f3] text-[#18757d] uppercase tracking-wider mb-1">
              Espace Élève / Apprenant
            </span>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-[#332420]">
              Bonjour, <span className="text-[#18757d]">{user?.fullName || 'Stéphanie'}</span> 👋
            </h1>
            <p className="text-xs text-[#5e4d46] font-medium">
              Retrouve ici tous tes contenus débloqués et poursuis ton apprentissage.
            </p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-white p-3.5 rounded-2xl border border-[#eee7da] text-center shadow-2xs">
              <span className="text-xl font-extrabold text-[#18757d] block">{courses.length}</span>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Produit{courses.length > 1 ? 's' : ''} acheté{courses.length > 1 ? 's' : ''}</span>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-[#eee7da] text-center shadow-2xs">
              <span className="text-xl font-extrabold text-[#e05a47] block">
                {activeCourse ? `${activeCourse.progress}%` : '0%'}
              </span>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Progression</span>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-[#eee7da] text-center shadow-2xs">
              <span className="text-xl font-extrabold text-emerald-600 block">1</span>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">PDF disponible</span>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT GRID */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          {/* Active Course Banner */}
          {activeCourse && (
            <div className="bg-[#18757d] text-white rounded-3xl p-8 sm:p-10 shadow-xl border border-teal-800 flex flex-col lg:flex-row items-center justify-between gap-8 relative overflow-hidden">
              <div className="space-y-4 max-w-2xl">
                <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-extrabold bg-white/20 text-white uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-amber-300" />
                  Dernière formation achetée
                </span>

                <h2 className="text-2xl sm:text-3xl font-extrabold leading-tight">
                  {activeCourse.title}
                </h2>

                <p className="text-xs sm:text-sm text-teal-100 leading-relaxed">
                  Progression actuelle : {activeCourse.progress}% complétés.
                </p>

                {/* Progress Bar */}
                <div className="space-y-1.5 pt-2">
                  <div className="flex items-center justify-between text-xs font-bold text-teal-100">
                    <span>Progression globale :</span>
                    <span>{activeCourse.progress}%</span>
                  </div>
                  <div className="w-full bg-teal-900/60 rounded-full h-3 overflow-hidden p-0.5 border border-white/20">
                    <div className="bg-amber-400 h-full rounded-full transition-all duration-500" style={{ width: `${activeCourse.progress}%` }} />
                  </div>
                </div>
              </div>

              {activeCourse.progress >= 100 ? (
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto shrink-0">
                  <a
                    href={activeCourse.downloadPdf || 'https://www.guides-digitaux.com/wp-content/uploads/2026/02/checklist-a-verifier-avant-le-lancement-du-site.webp'}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full sm:w-auto px-6 py-4 text-xs font-extrabold text-[#332420] bg-amber-400 hover:bg-amber-300 rounded-2xl shadow-lg uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
                  >
                    <Award className="w-5 h-5 text-[#332420]" />
                    Télécharger le certificat
                  </a>

                  <Link
                    href={`/formation/${activeCourse.slug}`}
                    className="w-full sm:w-auto px-6 py-4 text-xs font-extrabold text-white bg-white/20 hover:bg-white/30 rounded-2xl border border-white/30 uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
                  >
                    <PlayCircle className="w-5 h-5 text-white" />
                    Naviguer dans la formation
                  </Link>
                </div>
              ) : (
                <Link
                  href={`/formation/${activeCourse.slug}`}
                  className="w-full lg:w-auto px-8 py-4 text-xs font-extrabold text-[#332420] bg-amber-400 hover:bg-amber-300 rounded-2xl shadow-lg uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shrink-0"
                >
                  <PlayCircle className="w-5 h-5 text-[#332420]" />
                  ACCÉDER AU LECTEUR VIDÉO
                </Link>
              )}
            </div>
          )}

          {/* All Purchased Products Grid */}
          <div className="space-y-6">
            <div className="flex items-center justify-between border-b border-[#eee7da] pb-4">
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#332420]">
                Tes ressources & formations accréditées
              </h2>
              <span className="text-xs text-slate-500 font-medium">{courses.length} contenu{courses.length > 1 ? 's' : ''} débloqué{courses.length > 1 ? 's' : ''}</span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {courses.map((item) => (
                <div key={item.id} className="bg-white rounded-3xl overflow-hidden border border-[#eee7da] shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                  <div>
                    <div className="relative h-48 w-full bg-[#faf8f5]">
                      <Image src={item.thumbnail} alt={item.title} fill className="object-cover" />
                      <span className="absolute top-3 left-3 bg-white/95 backdrop-blur-xs text-[#18757d] text-xs font-extrabold px-3 py-1 rounded-full border border-[#eee7da]">
                        {item.typeLabel}
                      </span>
                    </div>

                    <div className="p-6 space-y-3">
                      <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                        <span className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5" />
                          {item.duration}
                        </span>
                        <span>•</span>
                        <span>Par {item.instructor}</span>
                      </div>

                      <h3 className="text-base font-extrabold text-[#332420] leading-snug">
                        {item.title}
                      </h3>

                      {/* Mini Progress */}
                      <div className="pt-2 space-y-1">
                        <div className="flex items-center justify-between text-[11px] font-bold text-slate-600">
                          <span>Statut :</span>
                          <span className={item.progress === 100 ? "text-emerald-600 font-extrabold" : "text-[#18757d]"}>
                            {item.progress === 100 ? "✓ Terminé (100%)" : `${item.progress}% complété`}
                          </span>
                        </div>
                        <div className="w-full bg-[#faf8f5] rounded-full h-2 border border-[#eee7da]">
                          <div
                            className={`h-full rounded-full ${item.progress === 100 ? 'bg-emerald-500' : 'bg-[#18757d]'}`}
                            style={{ width: `${item.progress}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="p-6 pt-0 space-y-2">
                    {item.type === 'formation' || !item.downloadPdf ? (
                      <Link
                        href={`/formation/${item.slug}`}
                        className="w-full py-3.5 text-xs font-extrabold text-white bg-[#18757d] hover:bg-[#12595f] rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 uppercase tracking-wider"
                      >
                        <PlayCircle className="w-4 h-4" />
                        ACCÉDER AUX COURS
                      </Link>
                    ) : (
                      <a
                        href={item.downloadPdf}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full py-3.5 text-xs font-extrabold text-[#18757d] bg-[#e6f4f3] hover:bg-[#d4edea] rounded-xl transition-colors flex items-center justify-center gap-2 uppercase tracking-wider"
                      >
                        <Download className="w-4 h-4" />
                        TÉLÉCHARGER LE PDF HD
                      </a>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
}

export default function EleveDashboardPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs font-bold text-[#18757d]">Chargement de votre espace élève...</div>}>
      <EleveDashboardContent />
    </Suspense>
  );
}
