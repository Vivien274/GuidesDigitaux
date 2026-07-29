'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth, getRoleForEmail } from '@/context/AuthContext';
import { fetchCoursesFromDb } from '@/lib/supabaseLms';
import { getRealCourseStats, Course } from '@/lib/coursesStore';
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
  LogOut
} from 'lucide-react';

import { useRouter } from 'next/navigation';

export default function FormateurDashboardPage() {
  const { user, role, logout } = useAuth();
  const router = useRouter();
  const [coursesList, setCoursesList] = useState<Course[]>([]);
  const [statsMap, setStatsMap] = useState<Record<string, { enrolledCount: number; completedCount: number; completionPercentage: number }>>({});
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('gd_auth_user');
      const userEmail = user?.email || (savedUser ? JSON.parse(savedUser).email : '');
      const activeRole = getRoleForEmail(userEmail);

      if (!userEmail) {
        router.push('/mon-compte');
        return;
      }
      if (activeRole !== 'formateur' && activeRole !== 'superadmin') {
        router.push('/dashboard/eleve');
        return;
      }
    }
  }, [user, role, router]);

  useEffect(() => {
    async function loadData() {
      setIsLoading(true);
      const list = await fetchCoursesFromDb();
      setCoursesList(list);

      // Compute real student stats per course from DB / localStorage
      const map: Record<string, { enrolledCount: number; completedCount: number; completionPercentage: number }> = {};
      list.forEach(c => {
        map[c.id] = getRealCourseStats(c.id, c.title);
      });
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
                Suivez en temps réel le nombre d'élèves inscrits et les formations terminées.
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
                <span className="text-xs text-slate-500 font-bold block">Formations actives</span>
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
            <div className="flex items-center justify-between border-b border-[#eee7da] pb-4">
              <div>
                <h2 className="text-xl font-extrabold text-[#332420]">
                  Suivi des Inscriptions Élèves
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">Statistiques réelles basées sur les accès élèves attribués lors des commandes.</p>
              </div>

              <span className="text-xs text-slate-500 font-medium">{coursesList.length} formation(s) répertoriée(s)</span>
            </div>

            {isLoading ? (
              <div className="p-8 text-center text-xs font-bold text-[#18757d]">Chargement des données depuis la base Supabase...</div>
            ) : (
              <div className="space-y-6">
                {coursesList.map((course) => {
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
                          <div className="flex items-center gap-3">
                            <span className="px-3 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                              {course.status || 'Publié'}
                            </span>
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
                            <span className="text-[10px] text-slate-500 font-medium">Inscriptions réelles effectuées</span>
                          </div>
                        </div>

                        {/* Ayant terminé (100%) réels */}
                        <div className="flex items-center gap-3">
                          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                            <UserCheck className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="text-xs font-extrabold text-[#332420] block">{courseStats.completedCount} élève(s) ont terminé (100%)</span>
                            <span className="text-[10px] text-slate-500 font-medium">Taux de réussite : {courseStats.completionPercentage}%</span>
                          </div>
                        </div>

                        {/* Progress Bar */}
                        <div className="flex flex-col justify-center space-y-1">
                          <div className="flex items-center justify-between text-[11px] font-extrabold text-slate-700">
                            <span>Taux d'achèvement réel :</span>
                            <span className="text-[#18757d]">{courseStats.completionPercentage}%</span>
                          </div>
                          <div className="w-full bg-[#faf8f5] rounded-full h-2.5 border border-[#eee7da] overflow-hidden">
                            <div
                              className="bg-[#18757d] h-full rounded-full transition-all"
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
