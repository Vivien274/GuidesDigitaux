'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { fetchCoursesFromDb } from '@/lib/supabaseLms';
import { getRealCourseStats, fetchRealCourseStatsFromDb, Course } from '@/lib/coursesStore';
import { 
  GraduationCap, 
  Plus, 
  Video, 
  Users, 
  Star, 
  Layers, 
  CheckCircle2, 
  FileText, 
  Edit3, 
  Trash2, 
  Sparkles,
  Eye,
  Gift,
  Award,
  TrendingUp,
  UserCheck,
  Rocket,
  LogOut,
  Clock,
  Calendar,
  FileEdit
} from 'lucide-react';

import { useRouter } from 'next/navigation';

export default function FormateurDashboardPage() {
  const { user, role, logout } = useAuth();
  const router = useRouter();
  const [coursesList, setCoursesList] = useState<Course[]>([]);
  const [statsMap, setStatsMap] = useState<Record<string, { enrolledCount: number; completedCount: number; completionPercentage: number }>>({});
  const [isLoading, setIsLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState<'all' | 'published' | 'draft' | 'scheduled'>('all');

  useEffect(() => {
    if (!user) {
      router.push('/mon-compte');
      return;
    }
    if (role !== 'formateur' && role !== 'superadmin') {
      router.push('/dashboard/eleve');
      return;
    }
  }, [user, role, router]);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const list = await fetchCoursesFromDb();
      setCoursesList(list);

      // Compute real student stats per course from DB / localStorage
      const map = await fetchRealCourseStatsFromDb(list);
      setStatsMap(map);
      setIsLoading(false);
    }
    loadData();
  }, []);

  // Calculate REAL totals across all courses
  const totalCourses = coursesList.length;
  const totalEnrolled = Object.values(statsMap).reduce((acc, curr) => acc + curr.enrolledCount, 0);
  const totalCompleted = Object.values(statsMap).reduce((acc, curr) => acc + curr.completedCount, 0);
  const overallCompletionRate = totalEnrolled > 0 ? Math.round((totalCompleted / totalEnrolled) * 100) : 0;

  // Filter courses by status
  const now = new Date();
  const filteredCourses = coursesList.filter(c => {
    const st = c.status || 'Publié';
    if (statusFilter === 'published') {
      if (st === 'Publié') return true;
      if (st === 'Planifié' && c.scheduledPublishDate && now >= new Date(c.scheduledPublishDate)) return true;
      return false;
    }
    if (statusFilter === 'draft') return st === 'Brouillon';
    if (statusFilter === 'scheduled') {
      if (st === 'Planifié') {
        if (!c.scheduledPublishDate) return true;
        return now < new Date(c.scheduledPublishDate);
      }
      return false;
    }
    return true;
  });

  const publishedCount = coursesList.filter(c => {
    const st = c.status || 'Publié';
    if (st === 'Publié') return true;
    if (st === 'Planifié' && c.scheduledPublishDate && now >= new Date(c.scheduledPublishDate)) return true;
    return false;
  }).length;

  const draftCount = coursesList.filter(c => (c.status || 'Publié') === 'Brouillon').length;

  const scheduledCount = coursesList.filter(c => {
    const st = c.status || 'Publié';
    if (st === 'Planifié') {
      if (!c.scheduledPublishDate) return true;
      return now < new Date(c.scheduledPublishDate);
    }
    return false;
  }).length;

  const renderStatusBadge = (c: Course) => {
    const st = c.status || 'Publié';

    if (st === 'Brouillon') {
      return (
        <span className="px-3 py-1 rounded-full text-[10px] font-black bg-amber-100 text-amber-900 border border-amber-300 uppercase tracking-wider flex items-center gap-1.5 shadow-2xs">
          <FileEdit className="w-3.5 h-3.5 text-amber-700 shrink-0" />
          <span>BROUILLON (MASQUÉ)</span>
        </span>
      );
    }

    if (st === 'Planifié') {
      const pubDate = c.scheduledPublishDate ? new Date(c.scheduledPublishDate) : null;
      const isAlreadyPublished = pubDate && now >= pubDate;

      if (isAlreadyPublished) {
        return (
          <span className="px-3 py-1 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300 uppercase tracking-wider flex items-center gap-1.5 shadow-2xs">
            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
            <span>PUBLIÉ (AUTO-PUBLIÉ LE {pubDate.toLocaleDateString('fr-FR')})</span>
          </span>
        );
      }

      return (
        <span className="px-3 py-1 rounded-full text-[10px] font-black bg-sky-100 text-sky-900 border border-sky-300 uppercase tracking-wider flex items-center gap-1.5 shadow-2xs">
          <Clock className="w-3.5 h-3.5 text-sky-600 shrink-0" />
          <span>
            PROGRAMMÉ LE {pubDate ? `${pubDate.toLocaleDateString('fr-FR')} À ${pubDate.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}` : 'DATE À VENIR'}
          </span>
        </span>
      );
    }

    return (
      <span className="px-3 py-1 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300 uppercase tracking-wider flex items-center gap-1.5 shadow-2xs">
        <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
        <span>PUBLIÉ EN LIGNE</span>
      </span>
    );
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#332420] font-sans">
      <Header />

      {/* BANNER HEADER */}
      <section className="py-10 bg-gradient-to-b from-[#eef4fb] to-[#faf8f5] border-b border-[#eee7da]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#18757d] text-white flex items-center justify-center font-extrabold text-2xl shadow-md border-2 border-white">
              <GraduationCap className="w-8 h-8 text-amber-300" />
            </div>
            <div>
              <span className="inline-block px-3 py-0.5 rounded-full text-[11px] font-extrabold bg-[#e6f4f3] text-[#18757d] uppercase tracking-wider mb-1">
                Studio Formateur / Tableau de bord
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#332420]">
                Gestionnaire de <span className="text-[#18757d]">Formations</span>
              </h1>
              <p className="text-xs text-[#5e4d46] font-medium">
                Gérez vos statuts de publication (Publié, Brouillon, Programmé) et suivez les statistiques d'inscription en temps réel.
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row items-center gap-3">
            <Link
              href="/dashboard/formateur/precommande"
              className="px-6 py-4 text-xs font-extrabold text-[#332420] bg-amber-400 hover:bg-amber-300 rounded-2xl shadow-md uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
            >
              <Rocket className="w-4 h-4 text-[#332420]" />
              CRÉER UNE PRÉCOMMANDE
            </Link>

            <Link
              href="/dashboard/formateur/nouveau"
              className="px-6 py-4 text-xs font-extrabold text-white bg-[#18757d] hover:bg-[#12595f] rounded-2xl shadow-md uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              CRÉER UNE FORMATION
            </Link>

            <button
              onClick={() => {
                logout();
                window.location.href = '/mon-compte';
              }}
              className="px-4 py-4 text-xs font-extrabold text-slate-600 bg-white hover:bg-rose-50 hover:text-[#e05a47] rounded-2xl border border-[#eee7da] shadow-2xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <LogOut className="w-4 h-4" />
              SE DÉCONNECTER
            </button>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          {/* Formateur Real Stats Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-6">
            
            <div className="bg-white p-6 rounded-3xl border border-[#eee7da] shadow-2xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#e6f4f3] text-[#18757d] flex items-center justify-center shrink-0">
                <Video className="w-6 h-6" />
              </div>
              <div>
                <span className="text-2xl font-extrabold text-[#332420]">{totalCourses}</span>
                <span className="text-xs text-slate-500 font-bold block">Formations répertoriées</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-[#eee7da] shadow-2xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <span className="text-2xl font-extrabold text-[#332420]">{totalEnrolled}</span>
                <span className="text-xs text-slate-500 font-bold block">Élèves inscrits (réel)</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-[#eee7da] shadow-2xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <UserCheck className="w-6 h-6" />
              </div>
              <div>
                <span className="text-2xl font-extrabold text-emerald-700">{totalCompleted}</span>
                <span className="text-xs text-slate-500 font-bold block">Formations terminées (100%)</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-[#eee7da] shadow-2xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <Award className="w-6 h-6" />
              </div>
              <div>
                <span className="text-2xl font-extrabold text-[#332420]">{overallCompletionRate}%</span>
                <span className="text-xs text-slate-500 font-bold block">Taux de réussite global</span>
              </div>
            </div>

          </div>

          {/* List of Formations with REAL Student Metrics */}
          <div className="bg-white p-8 rounded-3xl border border-[#eee7da] shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#eee7da] pb-6 gap-4">
              <div>
                <h2 className="text-xl font-extrabold text-[#332420]">
                  Catalogue & Suivi des Formations
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">Filtrage et gestion des statuts de publication (Publié, Brouillon, Programmé).</p>
              </div>

              {/* Status Filter Tabs */}
              <div className="flex items-center gap-2 bg-[#faf8f5] p-1.5 rounded-2xl border border-[#eee7da] self-start sm:self-auto flex-wrap">
                <button
                  onClick={() => setStatusFilter('all')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    statusFilter === 'all'
                      ? 'bg-[#18757d] text-white shadow-xs'
                      : 'text-slate-600 hover:text-[#332420]'
                  }`}
                >
                  Toutes ({coursesList.length})
                </button>

                <button
                  onClick={() => setStatusFilter('published')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    statusFilter === 'published'
                      ? 'bg-emerald-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-emerald-700'
                  }`}
                >
                  Publiées ({publishedCount})
                </button>

                <button
                  onClick={() => setStatusFilter('draft')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    statusFilter === 'draft'
                      ? 'bg-amber-500 text-white shadow-xs'
                      : 'text-slate-600 hover:text-amber-700'
                  }`}
                >
                  Brouillons ({draftCount})
                </button>

                <button
                  onClick={() => setStatusFilter('scheduled')}
                  className={`px-3.5 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
                    statusFilter === 'scheduled'
                      ? 'bg-sky-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-sky-700'
                  }`}
                >
                  Programmées ({scheduledCount})
                </button>
              </div>
            </div>

            {isLoading ? (
              <div className="p-8 text-center text-xs font-bold text-[#18757d]">Chargement des données depuis la base Supabase...</div>
            ) : filteredCourses.length === 0 ? (
              <div className="p-12 text-center text-xs text-slate-500 font-bold bg-[#faf8f5] rounded-3xl border border-[#eee7da]">
                Aucune formation ne correspond à ce filtre pour le moment.
              </div>
            ) : (
              <div className="space-y-6">
                {filteredCourses.map((course) => {
                  const totalLessons = course.modules ? course.modules.reduce((acc, m) => acc + (m.lessons ? m.lessons.length : 0), 0) : 0;
                  
                  // Real analytics for this specific course
                  const courseStats = statsMap[course.id] || { enrolledCount: 0, completedCount: 0, completionPercentage: 0 };

                  return (
                    <div key={course.id} className="p-6 bg-[#faf8f5] rounded-3xl border border-[#eee7da] space-y-4">
                      
                      {/* Top row info */}
                      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                        {/* Image Thumbnail */}
                        <div className="relative w-32 h-24 rounded-2xl overflow-hidden bg-slate-100 shrink-0 border border-[#eee7da] shadow-2xs">
                          {course.image ? (
                            <img src={course.image} alt={course.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-slate-400 text-xs font-extrabold bg-[#e6f4f3] text-[#18757d]">
                              Vidéo HD
                            </div>
                          )}
                        </div>

                        <div className="space-y-2 flex-1">
                          <div className="flex items-center gap-3 flex-wrap">
                            {renderStatusBadge(course)}

                            <span className="text-xs text-slate-500 font-semibold">
                              Durée: {course.duration} • {course.modules ? course.modules.length : 0} module(s) • {totalLessons} cours
                            </span>
                          </div>

                          <h3 className="text-lg font-extrabold text-[#332420]">{course.title}</h3>
                          <p className="text-xs text-[#5e4d46]">{course.description}</p>
                        </div>

                        <div className="flex items-center gap-4 shrink-0">
                          <span className="text-xl font-extrabold text-[#18757d]">{course.price.toFixed(2)} €</span>
                          
                          <Link 
                            href={`/dashboard/formateur/editeur?id=${course.id}`}
                            className="px-5 py-3 text-xs font-extrabold text-white bg-[#18757d] hover:bg-[#12595f] rounded-xl shadow-xs transition-colors flex items-center gap-2 uppercase tracking-wider"
                          >
                            <Edit3 className="w-4 h-4" />
                            ÉDITER
                          </Link>
                        </div>
                      </div>

                      {/* Bottom Row: REAL Student Analytics Grid */}
                      <div className="pt-4 border-t border-[#eee7da] grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white p-4 rounded-2xl border border-[#eee7da]">
                        
                        {/* Inscrits réels */}
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
                            <Users className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-xs font-extrabold text-[#332420] block">{courseStats.enrolledCount} élève(s) inscrit(s)</span>
                            <span className="text-[10px] text-slate-400 font-medium">Inscriptions réelles effectuées</span>
                          </div>
                        </div>

                        {/* Terminés réels */}
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                            <UserCheck className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-xs font-extrabold text-emerald-700 block">{courseStats.completedCount} élève(s) ont terminé (100%)</span>
                            <span className="text-[10px] text-slate-400 font-medium">Taux de réussite : {courseStats.completionPercentage}%</span>
                          </div>
                        </div>

                        {/* Taux de progression moyen */}
                        <div className="flex flex-col justify-center space-y-1.5">
                          <div className="flex items-center justify-between text-xs font-extrabold text-[#332420]">
                            <span>Taux d'achèvement réel :</span>
                            <span className="text-[#18757d]">{courseStats.completionPercentage}%</span>
                          </div>
                          <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden border border-slate-200">
                            <div 
                              className="h-full bg-gradient-to-r from-[#18757d] to-emerald-500 rounded-full transition-all duration-500"
                              style={{ width: `${courseStats.completionPercentage}%` }}
                            />
                          </div>
                        </div>

                      </div>

                    </div>
                  );
                })}
              </div>
            )}

          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
}
