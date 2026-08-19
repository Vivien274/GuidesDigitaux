'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useSearchParams, useRouter } from 'next/navigation';
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
  Award,
  Calendar,
  Lock,
  RotateCcw
} from 'lucide-react';

import { fetchCoursesFromDb, saveUserPurchaseToDb } from '@/lib/supabaseLms';
import { getUserPurchases, getUserPurchasesAsync, addPurchaseToUser } from '@/lib/userPurchasesStore';
import { getEncryptedDownloadUrl } from '@/lib/downloadSecurity';
import { getCoachingStatusForUser } from '@/lib/coachingStore';
import { getDeduplicatedDownloadLinksForProduct } from '@/lib/orderEmailService';

import CertificateModal from '@/components/CertificateModal';

const DEFAULT_THUMBNAIL = 'https://www.guides-digitaux.com/wp-content/uploads/2026/02/un-artisan-createur-devant-son-PC-en-train-dajouter-ses-produits-dnas-saboutique-en-ligne.-accoude-a-son-etabli-dans-son-atelier.-lumiere-naturelle.webp';

function EleveDashboardContent() {
  const { user, isLoggedIn } = useAuth();
  const router = useRouter();
  const searchParams = useSearchParams();
  const isJustPurchased = searchParams.get('purchased') === 'true';

  const [courses, setCourses] = useState<any[]>([]);
  const [coachingStatus, setCoachingStatus] = useState<any>(null);
  const [certModalCourse, setCertModalCourse] = useState<{ title: string; date?: string } | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('gd_auth_user');
      if (!savedUser && !user) {
        router.push('/mon-compte');
        return;
      }
    }
  }, [user, router]);

  useEffect(() => {
    async function syncEnrolledCourses() {
      if (!user?.email) return;
      try {
        const dbCourses = await fetchCoursesFromDb();
        const userEmail = user.email.toLowerCase().trim();
        setCoachingStatus(getCoachingStatusForUser(userEmail));

        const userPurchases = await getUserPurchasesAsync(userEmail);
        let baseList: any[] = userPurchases || [];

        const formattedReal = baseList.map((item: any) => {
          const matchedDb = dbCourses.find(c => c.id === item.id || c.title === item.title);
          const targetTitle = matchedDb?.title || item.title || 'Produit Guides Digitaux';
          const targetId = matchedDb?.id || item.id || `item-${Date.now()}`;
          const isPreorder = !!item.isPreorder || item.slug === 'precommande-fiche-google' || item.id === 'precommande-fiche-google' || (item.slug && item.slug.includes('precommande'));
          const isCoachingItem = item.category === 'coaching' || item.type === 'coaching' || item.slug === 'coaching-site' || item.id === 'coaching-site' || targetTitle.toLowerCase().includes('coaching') || targetTitle.toLowerCase().includes('accompagnement');
          const isPdfItem = !isPreorder && !isCoachingItem && (item.category === 'ebook' || item.category === 'checklist' || item.type === 'ebook' || item.type === 'checklist' || !!item.downloadPdf || (item.slug && item.slug.includes('guide')) || (item.id && item.id.includes('guide')));
          const targetSlug = item.slug || item.id || (targetTitle.toLowerCase().includes('woocommerce') ? 'formation-woocommerce' : (isCoachingItem ? 'coaching-site' : 'creer-sa-vitrine-wordpress'));
          
          const totalLess = matchedDb?.modules ? matchedDb.modules.reduce((acc, m) => acc + (m.lessons?.length || 0), 0) : (item.totalLessons || (isPdfItem || isCoachingItem ? 0 : 4));

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
            type: isCoachingItem ? 'coaching' : (isPreorder ? 'formation' : (item.type || (isPdfItem ? 'ebook' : 'formation'))),
            typeLabel: isCoachingItem ? '🗓️ Coaching & Accompagnement' : (isPreorder ? 'Précommande Enregistrée' : (item.typeLabel || (isPdfItem ? '📄 E-Book / Guide PDF' : 'Formation Vidéo'))),
            thumbnail: item.image || item.thumbnail || DEFAULT_THUMBNAIL,
            progress: (isPdfItem || isCoachingItem) ? 0 : liveProg,
            completedLessons: item.completedLessons || 0,
            totalLessons: totalLess,
            duration: matchedDb?.duration || item.duration || (isCoachingItem ? '2 x 45 min' : (isPdfItem ? 'PDF' : '2h15')),
            instructor: 'Stéphanie ROCQ',
            isPreorder: isPreorder,
            isCoaching: isCoachingItem,
            isPdf: isPdfItem,
            downloadPdf: isPdfItem ? (item.downloadPdf || '/downloads/support-formation-woocommerce.pdf') : undefined,
            bookingUrl: item.bookingUrl || 'https://calendar.app.google/A4SMq4zBbZYnnCr18'
          };
        });

        setCourses(formattedReal);
      } catch (e) {
        console.error('Failed to load enrolled courses', e);
      }
    }
    syncEnrolledCourses();
  }, [user?.email]);

  // Only real video formations or preorders are eligible for the hero banner
  const featuredFormation = courses.find(c => !c.isPdf && !c.isCoaching && !c.isPreorder);
  const featuredPreorder = courses.find(c => c.isPreorder);
  const heroBannerItem = featuredFormation || featuredPreorder;

  const formationCourses = courses.filter(c => !c.isPdf && !c.isCoaching && !c.isPreorder);
  const pdfCount = courses.filter(c => c.isPdf && !c.isPreorder).length;
  const avgFormationProgress = formationCourses.length > 0 
    ? Math.round(formationCourses.reduce((sum, c) => sum + (c.progress || 0), 0) / formationCourses.length) 
    : 0;

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#332420] font-sans">
      <Header />

      {/* SUCCESS PURCHASE ALERT */}
      {isJustPurchased && (
        <div className="bg-emerald-600 text-white py-4 px-4 shadow-md">
          <div className="max-w-7xl mx-auto flex items-center justify-between gap-4 text-xs font-bold">
            <div className="flex items-center gap-2">
              <CheckCircle2 className="w-5 h-5 text-amber-300 shrink-0" />
              <span>
                {heroBannerItem && heroBannerItem.isPreorder
                  ? '🎉 Félicitations pour votre précommande ! Votre place est réservée au Tarif Pionnier. Sortie officielle le 15 septembre 2026.'
                  : '🎉 Félicitations pour votre achat ! Vos produits et fichiers PDF sont débloqués ci-dessous.'}
              </span>
            </div>
            {heroBannerItem && (
              <Link
                href={heroBannerItem.isPreorder ? '/precommande' : `#produits-section`}
                className="underline hover:text-amber-200 whitespace-nowrap"
              >
                {heroBannerItem.isPreorder
                  ? 'Voir le statut de la précommande →'
                  : 'Accéder aux contenus →'}
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

            <div className="bg-[#FAF8F5] p-3.5 rounded-2xl border border-[#eee7da] text-center shadow-2xs">
              <span className="text-xl font-extrabold text-[#e05a47] block">
                {formationCourses.length > 0 ? `${avgFormationProgress}%` : '-'}
              </span>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">
                {formationCourses.length > 0 ? 'Progression' : 'Formations (0)'}
              </span>
            </div>

            <div className="bg-white p-3.5 rounded-2xl border border-[#eee7da] text-center shadow-2xs">
              <span className="text-xl font-extrabold text-emerald-600 block">{pdfCount}</span>
              <span className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">PDF disponible{pdfCount > 1 ? 's' : ''}</span>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT GRID */}
      <section className="py-12 md:py-16" id="produits-section">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

          {/* Active Course Banner - ONLY DISPLAYED IF USER PURCHASED A REAL VIDEO FORMATION OR PREORDER */}
          {heroBannerItem && (
            <div className={`rounded-3xl p-8 sm:p-10 shadow-xl border flex flex-col lg:flex-row items-center justify-between gap-8 relative overflow-hidden ${heroBannerItem.isPreorder
                ? 'bg-gradient-to-r from-[#18757d] to-[#11555b] text-white border-amber-400/40'
                : 'bg-[#18757d] text-white border-teal-800'
              }`}>
              <div className="space-y-4 max-w-2xl">
                <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-extrabold bg-amber-400 text-[#332420] uppercase tracking-wider">
                  <Sparkles className="w-4 h-4 text-[#332420]" />
                  {heroBannerItem.isPreorder
                    ? '🚀 Précommande Enregistrée (Sortie le 15 septembre)'
                    : 'Dernière formation achetée'}
                </span>

                <h2 className="text-2xl sm:text-3xl font-extrabold leading-tight">
                  {heroBannerItem.title}
                </h2>

                {heroBannerItem.isPreorder ? (
                  <p className="text-xs sm:text-sm text-amber-100 leading-relaxed font-medium">
                    Ta place est réservée au Tarif Pionnier ! Les modules vidéo seront débloqués automatiquement dans ton espace dès le <strong>15 septembre 2026</strong>.
                  </p>
                ) : (
                  <>
                    <p className="text-xs sm:text-sm text-teal-100 leading-relaxed">
                      Progression actuelle : {heroBannerItem.progress}% complétés.
                    </p>

                    {/* Progress Bar */}
                    <div className="space-y-1.5 pt-2">
                      <div className="flex items-center justify-between text-xs font-bold text-teal-100">
                        <span>Progression globale :</span>
                        <span>{heroBannerItem.progress}%</span>
                      </div>
                      <div className="w-full bg-teal-900/60 rounded-full h-3 overflow-hidden p-0.5 border border-white/20">
                        <div className="bg-amber-400 h-full rounded-full transition-all duration-500" style={{ width: `${heroBannerItem.progress}%` }} />
                      </div>
                    </div>
                  </>
                )}
              </div>

              {heroBannerItem.isPreorder ? (
                <Link
                  href="/precommande"
                  className="w-full lg:w-auto px-8 py-4 text-xs font-extrabold text-[#332420] bg-amber-400 hover:bg-amber-300 rounded-2xl shadow-lg uppercase tracking-wider transition-colors flex items-center justify-center gap-2 shrink-0"
                >
                  <Clock className="w-5 h-5 text-[#332420]" />
                  Voir les projets en précommande →
                </Link>
              ) : heroBannerItem.progress >= 100 ? (
                <div className="flex flex-col sm:flex-row items-center gap-3 w-full lg:w-auto shrink-0">
                  <button
                    onClick={() => setCertModalCourse({ title: heroBannerItem.title, date: heroBannerItem.purchaseDate })}
                    className="w-full sm:w-auto px-6 py-4 text-xs font-extrabold text-[#332420] bg-amber-400 hover:bg-amber-300 rounded-2xl shadow-lg uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Award className="w-5 h-5 text-[#332420]" />
                    Afficher / Imprimer le certificat
                  </button>

                  <Link
                    href={`/formation/${heroBannerItem.slug}`}
                    className="w-full sm:w-auto px-6 py-4 text-xs font-extrabold text-white bg-white/20 hover:bg-white/30 rounded-2xl border border-white/30 uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
                  >
                    <PlayCircle className="w-5 h-5 text-white" />
                    Naviguer dans la formation
                  </Link>
                </div>
              ) : (
                <Link
                  href={`/formation/${heroBannerItem.slug}`}
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
                Tes ressources & formations
              </h2>
              <span className="text-xs text-slate-500 font-medium">{courses.length} contenu{courses.length > 1 ? 's' : ''} débloqué{courses.length > 1 ? 's' : ''}</span>
            </div>

            {courses.length === 0 ? (
              <div className="bg-white rounded-3xl p-10 sm:p-12 border border-[#eee7da] shadow-xs text-center space-y-4 max-w-xl mx-auto">
                <div className="w-16 h-16 rounded-full bg-amber-50 text-amber-600 flex items-center justify-center mx-auto shadow-xs border border-amber-200">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <div className="space-y-1">
                  <h3 className="text-xl font-extrabold text-[#332420]">Aucun contenu débloqué pour le moment</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">
                    Vous n'avez actuellement aucune formation ni aucune précommande associée à votre adresse e-mail (<strong>{user?.email || 'votre compte'}</strong>).
                  </p>
                </div>
                <div className="pt-2">
                  <Link
                    href="/boutique"
                    className="inline-flex items-center gap-2 px-7 py-4 bg-[#18757d] hover:bg-[#12595f] text-white font-extrabold text-xs rounded-2xl shadow-md uppercase tracking-wider transition-colors"
                  >
                    <ArrowRight className="w-4 h-4" />
                    Découvrir nos formations & précommandes
                  </Link>
                </div>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                {courses.map((item) => {
                const isPreorderItem = item.isPreorder || item.slug?.includes('precommande') || item.id === 'precommande-fiche-google';

                return (
                  <div key={item.id} className="bg-white rounded-3xl overflow-hidden border border-[#eee7da] shadow-sm hover:shadow-md transition-all flex flex-col justify-between">
                    <div>
                      <div className="relative h-48 w-full bg-[#faf8f5]">
                        <Image src={item.thumbnail || 'https://www.guides-digitaux.com/wp-content/uploads/2026/02/un-artisan-createur-devant-son-PC-en-train-dajouter-ses-produits-dnas-saboutique-en-ligne.-accoude-a-son-etabli-dans-son-atelier.-lumiere-naturelle.webp'} alt={item.title} fill className="object-cover" />
                        <span className={`absolute top-3 left-3 text-xs font-extrabold px-3 py-1 rounded-full border ${isPreorderItem
                            ? 'bg-amber-400 text-[#332420] border-amber-300'
                            : 'bg-white/95 text-[#18757d] border-[#eee7da]'
                          }`}>
                          {isPreorderItem ? '🚀 PRÉCOMMANDE' : item.typeLabel}
                        </span>
                      </div>

                      <div className="p-6 space-y-3">
                        <div className="flex items-center gap-3 text-xs text-slate-500 font-medium">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {item.duration || '2h00'}
                          </span>
                          <span>•</span>
                          <span>Par {item.instructor || 'Stéphanie ROCQ'}</span>
                        </div>

                        <h3 className="text-base font-extrabold text-[#332420] leading-snug">
                          {item.title}
                        </h3>

                        {/* Mini Progress or Preorder Status (Only for Formations & Preorders) */}
                        <div className="pt-1">
                          {isPreorderItem ? (
                            <div className="flex items-center justify-between text-[11px] font-bold text-slate-600">
                              <span>Statut :</span>
                              <span className="text-amber-700 font-extrabold flex items-center gap-1">
                                <Sparkles className="w-3 h-3 text-amber-500" />
                                Précommande Enregistrée
                              </span>
                            </div>
                          ) : (item.isPdf || item.type === 'ebook' || item.type === 'checklist' || !!item.downloadPdf) ? null : (
                            <div className="space-y-1">
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
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="p-6 pt-0 space-y-2">
                      {item.isCoaching || item.type === 'coaching' || item.slug === 'coaching-site' ? (
                        (coachingStatus && coachingStatus.completedSessions >= coachingStatus.maxSessions) ? (
                          <div className="space-y-2.5">
                            <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-xs text-[#332420] font-semibold space-y-1">
                              <div className="font-extrabold text-amber-800 flex items-center gap-1.5">
                                <Lock className="w-3.5 h-3.5 text-amber-700" />
                                Tes 2 rendez-vous ont été honorés !
                              </div>
                              <p className="text-[11px] text-[#5e4d46]">
                                Tes 2 créneaux de coaching sont terminés. Si tu souhaites reprendre des sessions pour continuer à développer ton site, tu peux commander à nouveau ci-dessous.
                              </p>
                            </div>
                            <Link
                              href="/produit/coaching-site"
                              className="w-full py-3.5 text-xs font-black text-white bg-[#18757d] hover:bg-[#12595f] rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 uppercase tracking-wider text-center"
                            >
                              <RotateCcw className="w-4 h-4" />
                              REPRENDRE UN COACHING (97 €)
                            </Link>
                          </div>
                        ) : (
                          <a
                            href={item.bookingUrl || 'https://calendar.app.google/A4SMq4zBbZYnnCr18'}
                            target="_blank"
                            rel="noreferrer"
                            className="w-full py-3.5 text-xs font-black text-[#332420] bg-amber-400 hover:bg-amber-300 rounded-xl shadow-sm transition-transform hover:scale-[1.01] flex items-center justify-center gap-2 uppercase tracking-wider text-center"
                          >
                            <Calendar className="w-4 h-4 text-[#332420]" />
                            RÉSERVER MON CRÉNEAU EN VISIO ({2 - (coachingStatus?.completedSessions || 0)}/2 RESTANTS) →
                          </a>
                        )
                      ) : isPreorderItem ? (
                        <div className="space-y-2.5 w-full">
                          <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 text-[11px] font-semibold text-amber-900 flex items-center justify-between">
                            <span>🚀 Sortie des vidéos : 25 Août 2026</span>
                            <span className="font-extrabold text-[#18757d]">🎁 3 Bonus Inclus</span>
                          </div>

                          <a
                            href={getEncryptedDownloadUrl('/downloads/bonus-1-checklist-audit-fiche-google.pdf', 'bonus-1')}
                            target="_blank"
                            rel="noreferrer"
                            className="w-full py-2.5 px-3 text-[11px] font-extrabold text-[#18757d] bg-[#e6f4f3] hover:bg-[#d4edea] rounded-xl transition-colors flex items-center justify-between"
                          >
                            <span className="flex items-center gap-1.5 truncate">
                              <FileText className="w-3.5 h-3.5 shrink-0" />
                              Bonus 1 : Checklist Audit Fiche Google
                            </span>
                            <Download className="w-3.5 h-3.5 shrink-0 text-[#18757d]" />
                          </a>

                          <a
                            href={getEncryptedDownloadUrl('/downloads/bonus-2-kit-modeles-reponses-avis-google.pdf', 'bonus-2')}
                            target="_blank"
                            rel="noreferrer"
                            className="w-full py-2.5 px-3 text-[11px] font-extrabold text-[#18757d] bg-[#e6f4f3] hover:bg-[#d4edea] rounded-xl transition-colors flex items-center justify-between"
                          >
                            <span className="flex items-center gap-1.5 truncate">
                              <FileText className="w-3.5 h-3.5 shrink-0" />
                              Bonus 2 : Kit 10 Modèles Avis Google
                            </span>
                            <Download className="w-3.5 h-3.5 shrink-0 text-[#18757d]" />
                          </a>

                          <a
                            href={getEncryptedDownloadUrl('/downloads/bonus-3-script-whatsapp-demander-avis-5-etoiles.pdf', 'bonus-3')}
                            target="_blank"
                            rel="noreferrer"
                            className="w-full py-2.5 px-3 text-[11px] font-extrabold text-[#18757d] bg-[#e6f4f3] hover:bg-[#d4edea] rounded-xl transition-colors flex items-center justify-between"
                          >
                            <span className="flex items-center gap-1.5 truncate">
                              <FileText className="w-3.5 h-3.5 shrink-0" />
                              Bonus 3 : Scripts WhatsApp Avis 5★
                            </span>
                            <Download className="w-3.5 h-3.5 shrink-0 text-[#18757d]" />
                          </a>
                        </div>
                      ) : (item.id === 'pack-guides' || item.bundleProductIds?.length || item.productType === 'bundle') ? (
                        <div className="space-y-2 w-full">
                          <div className="p-2.5 bg-teal-50 rounded-xl border border-teal-200 text-[11px] font-extrabold text-[#18757d] text-center">
                            📦 Coffret Intégral (7 Guides & Checklists PDF)
                          </div>
                          {getDeduplicatedDownloadLinksForProduct(item.id).map((link, idx) => (
                            <a
                              key={idx}
                              href={link.url}
                              target="_blank"
                              rel="noreferrer"
                              className="w-full py-2.5 px-3 text-[11px] font-extrabold text-[#18757d] bg-[#e6f4f3] hover:bg-[#d4edea] rounded-xl transition-colors flex items-center justify-between"
                            >
                              <span className="flex items-center gap-1.5 truncate">
                                <FileText className="w-3.5 h-3.5 shrink-0 text-[#18757d]" />
                                {link.title}
                              </span>
                              <Download className="w-3.5 h-3.5 shrink-0 text-[#18757d]" />
                            </a>
                          ))}
                        </div>
                      ) : (item.type === 'formation' || item.category === 'formation') && !item.downloadPdf ? (
                        <Link
                          href={`/formation/${item.slug}`}
                          className="w-full py-3.5 text-xs font-extrabold text-white bg-[#18757d] hover:bg-[#12595f] rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 uppercase tracking-wider"
                        >
                          <PlayCircle className="w-4 h-4" />
                          ACCÉDER AUX COURS
                        </Link>
                      ) : (
                        <a
                          href={getEncryptedDownloadUrl(item.downloadPdf || '/downloads/mini-guide-ecrire-web-artisan.pdf', item.id)}
                          target="_blank"
                          rel="noreferrer"
                          className="w-full py-3.5 text-xs font-extrabold text-[#18757d] bg-[#e6f4f3] hover:bg-[#d4edea] rounded-xl transition-colors flex items-center justify-center gap-2 uppercase tracking-wider"
                        >
                          <Download className="w-4 h-4" />
                          TÉLÉCHARGER LE PDF
                        </a>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
            )}
          </div>

        </div>
      </section>

      <CertificateModal
        isOpen={!!certModalCourse}
        onClose={() => setCertModalCourse(null)}
        studentName={user?.fullName || user?.email?.split('@')[0] || ''}
        courseTitle={certModalCourse?.title || ''}
        completionDate={certModalCourse?.date}
      />

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
