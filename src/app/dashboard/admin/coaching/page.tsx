'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { 
  getStoredCoachingRecords, 
  saveCoachingRecord, 
  setCompletedSessions, 
  resetCoachingForRepurchase,
  CoachingRecord 
} from '@/lib/coachingStore';
import { getUserPurchasesAsync } from '@/lib/userPurchasesStore';
import { supabase } from '@/lib/supabaseLms';
import { 
  Calendar, 
  CheckCircle2, 
  Clock, 
  Search, 
  ArrowLeft, 
  Plus, 
  Minus, 
  RotateCcw, 
  Lock, 
  Sparkles,
  UserCheck,
  ShieldCheck
} from 'lucide-react';

export default function AdminCoachingPage() {
  const { user, role } = useAuth();
  const [records, setRecords] = useState<CoachingRecord[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'in_progress' | 'completed'>('all');
  const [isLoading, setIsLoading] = useState(true);

  // Sync users from Supabase DB orders & profiles + local storage
  const syncCoachingData = async () => {
    setIsLoading(true);
    try {
      const stored = getStoredCoachingRecords();
      const existingEmails = new Set(stored.map(r => r.userEmail.toLowerCase().trim()));

      // Fetch profiles & orders from Supabase DB
      const [profilesRes, ordersRes] = await Promise.all([
        supabase.from('profiles').select('*'),
        supabase.from('orders').select('*')
      ]);

      const updatedRecords = [...stored];

      // Find any coaching orders from DB
      if (ordersRes.data) {
        ordersRes.data.forEach((ord: any) => {
          const em = ord.customer_email?.toLowerCase().trim();
          const itemsStr = JSON.stringify(ord.items || []).toLowerCase();
          const isCoachingOrder = itemsStr.includes('coaching') || ord.product_id === 'coaching-site';

          if (em && isCoachingOrder && !existingEmails.has(em)) {
            existingEmails.add(em);
            const matchingProfile = profilesRes.data?.find((p: any) => p.email?.toLowerCase().trim() === em);
            updatedRecords.push({
              id: `coaching-${em}`,
              userEmail: em,
              userName: matchingProfile?.full_name || ord.customer_name || em.split('@')[0],
              productTitle: 'Coaching Individuel & Accompagnement Sur-Mesure',
              purchaseDate: ord.created_at ? ord.created_at.split('T')[0] : new Date().toISOString().split('T')[0],
              completedSessions: 0,
              maxSessions: 2
            });
          }
        });
      }

      setRecords(updatedRecords);
    } catch (err) {
      console.error('Failed to sync coaching data', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    syncCoachingData();
  }, []);

  const handleUpdateSessions = (email: string, newCount: number) => {
    const updatedRecord = setCompletedSessions(email, newCount);
    setRecords(prev => prev.map(r => r.userEmail.toLowerCase().trim() === email.toLowerCase().trim() ? updatedRecord : r));
  };

  const handleResetForRepurchase = (email: string) => {
    if (confirm(`Confirmez-vous le réarmement de 2 nouvelles sessions de coaching pour ${email} (ex: suite à un nouveau paiement) ?`)) {
      const updatedRecord = resetCoachingForRepurchase(email);
      setRecords(prev => prev.map(r => r.userEmail.toLowerCase().trim() === email.toLowerCase().trim() ? updatedRecord : r));
    }
  };

  const filteredRecords = records.filter(r => {
    const matchesSearch = r.userEmail.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          (r.userName && r.userName.toLowerCase().includes(searchTerm.toLowerCase()));
    
    if (filterStatus === 'pending') return matchesSearch && r.completedSessions === 0;
    if (filterStatus === 'in_progress') return matchesSearch && r.completedSessions === 1;
    if (filterStatus === 'completed') return matchesSearch && r.completedSessions >= r.maxSessions;
    return matchesSearch;
  });

  const totalClients = records.length;
  const pendingCount = records.filter(r => r.completedSessions === 0).length;
  const inProgressCount = records.filter(r => r.completedSessions === 1).length;
  const completedCount = records.filter(r => r.completedSessions >= r.maxSessions).length;

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#332420] font-sans">
      <Header />

      {/* BANNER HEADER */}
      <section className="py-10 bg-gradient-to-b from-[#fff7ed] to-[#faf8f5] border-b border-[#e8ded0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/admin"
              className="w-10 h-10 rounded-2xl bg-white border border-[#e8ded0] text-[#332420] hover:text-[#18757d] flex items-center justify-center shadow-2xs transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <span className="inline-block px-3 py-0.5 rounded-full text-[11px] font-extrabold bg-amber-100 text-[#332420] uppercase tracking-wider mb-1">
                Suivi des Sessions Individuelles
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#332420]">
                Gestion des RDV <span className="text-[#18757d]">Coaching (2 Sessions)</span>
              </h1>
              <p className="text-xs text-[#5e4d46] font-medium">
                Validez les rendez-vous réalisés. Dès qu'un client atteint 2/2 RDV, son lien Google Calendar est automatiquement verrouillé.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">

          {/* STATS CARDS */}
          <div className="grid grid-cols-1 sm:grid-cols-4 gap-5">
            <div className="bg-white p-5 rounded-3xl border border-[#eee7da] shadow-2xs space-y-1">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Clients Coaching</span>
              <div className="text-3xl font-black text-[#332420]">{totalClients}</div>
              <p className="text-[11px] text-slate-500">Forfaits souscrits</p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-[#eee7da] shadow-2xs space-y-1">
              <span className="text-xs font-bold text-amber-600 uppercase tracking-wider">0 / 2 RDV (En attente)</span>
              <div className="text-3xl font-black text-amber-600">{pendingCount}</div>
              <p className="text-[11px] text-slate-500">Créneaux à venir</p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-[#eee7da] shadow-2xs space-y-1">
              <span className="text-xs font-bold text-sky-600 uppercase tracking-wider">1 / 2 RDV (En cours)</span>
              <div className="text-3xl font-black text-sky-600">{inProgressCount}</div>
              <p className="text-[11px] text-slate-500">1 session effectuée</p>
            </div>

            <div className="bg-white p-5 rounded-3xl border border-[#eee7da] shadow-2xs space-y-1">
              <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">2 / 2 RDV (Terminés 🔒)</span>
              <div className="text-3xl font-black text-emerald-600">{completedCount}</div>
              <p className="text-[11px] text-slate-500">Agenda verrouillé</p>
            </div>
          </div>

          {/* FILTERS & SEARCH BAR */}
          <div className="bg-white p-4 sm:p-6 rounded-3xl border border-[#eee7da] shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Rechercher par nom ou email client..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#faf8f5] border border-[#eee7da] rounded-xl text-xs text-[#332420] focus:outline-none focus:border-[#18757d]"
              />
            </div>

            <div className="flex items-center gap-2 overflow-x-auto w-full sm:w-auto">
              <button
                onClick={() => setFilterStatus('all')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  filterStatus === 'all'
                    ? 'bg-[#18757d] text-white shadow-2xs'
                    : 'bg-[#faf8f5] text-[#332420] hover:bg-[#e6f4f3] border border-[#eee7da]'
                }`}
              >
                Tous ({records.length})
              </button>
              <button
                onClick={() => setFilterStatus('pending')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  filterStatus === 'pending'
                    ? 'bg-amber-500 text-white shadow-2xs'
                    : 'bg-[#faf8f5] text-[#332420] hover:bg-amber-50 border border-[#eee7da]'
                }`}
              >
                0 / 2 RDV ({pendingCount})
              </button>
              <button
                onClick={() => setFilterStatus('in_progress')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  filterStatus === 'in_progress'
                    ? 'bg-sky-600 text-white shadow-2xs'
                    : 'bg-[#faf8f5] text-[#332420] hover:bg-sky-50 border border-[#eee7da]'
                }`}
              >
                1 / 2 RDV ({inProgressCount})
              </button>
              <button
                onClick={() => setFilterStatus('completed')}
                className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                  filterStatus === 'completed'
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : 'bg-[#faf8f5] text-[#332420] hover:bg-emerald-50 border border-[#eee7da]'
                }`}
              >
                2 / 2 RDV ({completedCount})
              </button>
            </div>
          </div>

          {/* TABLE RECORD LIST */}
          <div className="bg-white rounded-3xl border border-[#eee7da] shadow-2xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead>
                  <tr className="bg-[#faf8f5] border-b border-[#eee7da] text-[11px] font-extrabold text-[#5e4d46] uppercase tracking-wider">
                    <th className="py-4 px-6">Client / Élève</th>
                    <th className="py-4 px-6">Offre de Coaching</th>
                    <th className="py-4 px-6">Date d'Achat</th>
                    <th className="py-4 px-6 text-center">Progression (RDV)</th>
                    <th className="py-4 px-6 text-center">Accès Google Calendar</th>
                    <th className="py-4 px-6 text-right">Actions Admin</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#eee7da] text-xs font-semibold">
                  {filteredRecords.length === 0 ? (
                    <tr>
                      <td colSpan={6} className="py-12 text-center text-slate-400 font-medium">
                        Aucun client de coaching trouvé.
                      </td>
                    </tr>
                  ) : (
                    filteredRecords.map((r) => {
                      const isFullyCompleted = r.completedSessions >= r.maxSessions;
                      return (
                        <tr key={r.id} className="hover:bg-[#faf8f5]/60 transition-colors">
                          
                          {/* CLIENT */}
                          <td className="py-4 px-6">
                            <div className="font-extrabold text-[#332420] text-sm">
                              {r.userName || r.userEmail.split('@')[0]}
                            </div>
                            <div className="text-[11px] text-slate-500 font-mono">
                              {r.userEmail}
                            </div>
                          </td>

                          {/* OFFRE */}
                          <td className="py-4 px-6 text-[#5e4d46] font-medium max-w-xs">
                            {r.productTitle}
                          </td>

                          {/* DATE */}
                          <td className="py-4 px-6 text-slate-500 text-[11px] font-mono">
                            {r.purchaseDate}
                          </td>

                          {/* PROGRESSION */}
                          <td className="py-4 px-6 text-center">
                            <span className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-black uppercase tracking-wider ${
                              isFullyCompleted
                                ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                                : r.completedSessions === 1
                                ? 'bg-sky-100 text-sky-800 border border-sky-300'
                                : 'bg-amber-100 text-amber-800 border border-amber-300'
                            }`}>
                              {isFullyCompleted ? (
                                <>
                                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                                  2 / 2 RDV Honorés
                                </>
                              ) : r.completedSessions === 1 ? (
                                <>
                                  <Clock className="w-3.5 h-3.5 text-sky-600" />
                                  1 / 2 RDV Réalisé
                                </>
                              ) : (
                                <>
                                  <Calendar className="w-3.5 h-3.5 text-amber-600" />
                                  0 / 2 RDV (En Attente)
                                </>
                              )}
                            </span>
                          </td>

                          {/* CALENDAR ACCESS STATUS */}
                          <td className="py-4 px-6 text-center">
                            {isFullyCompleted ? (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-rose-600 bg-rose-50 px-2.5 py-1 rounded-lg border border-rose-200">
                                <Lock className="w-3 h-3 text-rose-600" />
                                Verrouillé (0 créneau)
                              </span>
                            ) : (
                              <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-lg border border-emerald-200">
                                <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                                Accès Autorisé ({r.maxSessions - r.completedSessions} créneau{r.maxSessions - r.completedSessions > 1 ? 'x' : ''})
                              </span>
                            )}
                          </td>

                          {/* ACTIONS */}
                          <td className="py-4 px-6 text-right space-x-2">
                            <button
                              onClick={() => handleUpdateSessions(r.userEmail, r.completedSessions + 1)}
                              disabled={isFullyCompleted}
                              title="Valider 1 rendez-vous honoré"
                              className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all inline-flex items-center gap-1 cursor-pointer ${
                                isFullyCompleted 
                                  ? 'bg-slate-100 text-slate-400 cursor-not-allowed' 
                                  : 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-2xs'
                              }`}
                            >
                              <Plus className="w-3.5 h-3.5" />
                              +1 RDV Validé
                            </button>

                            {r.completedSessions > 0 && (
                              <button
                                onClick={() => handleUpdateSessions(r.userEmail, r.completedSessions - 1)}
                                title="Annuler 1 validation de RDV"
                                className="px-2.5 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl transition-colors inline-flex items-center gap-1 cursor-pointer"
                              >
                                <Minus className="w-3.5 h-3.5" />
                                -1 RDV
                              </button>
                            )}

                            {isFullyCompleted && (
                              <button
                                onClick={() => handleResetForRepurchase(r.userEmail)}
                                title="Réarmer pour un nouveau coaching racheté"
                                className="px-3 py-1.5 bg-[#18757d] hover:bg-[#12595f] text-white text-xs font-bold rounded-xl transition-colors inline-flex items-center gap-1 shadow-2xs cursor-pointer"
                              >
                                <RotateCcw className="w-3.5 h-3.5" />
                                Réarmer 2 RDV
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
}
