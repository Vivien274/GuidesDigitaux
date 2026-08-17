'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth, UserRole } from '@/context/AuthContext';
import Link from 'next/link';
import { 
  Shield, 
  DollarSign, 
  Users, 
  ShoppingBag, 
  GraduationCap, 
  Trash2,
  RefreshCw,
  Plus,
  Rocket,
  UserCheck,
  BookOpen,
  Tag,
  BarChart2
} from 'lucide-react';

interface AdminUserItem {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  purchasesCount: number;
  totalSpent: number;
}

import { purgeAllCoursesData } from '@/lib/coursesStore';
import { purgeAllPreorders } from '@/lib/preordersStore';
import { purgeAllUserPurchases } from '@/lib/userPurchasesStore';
import { supabase } from '@/lib/supabaseLms';

import { useRouter } from 'next/navigation';

export default function SuperadminDashboardPage() {
  const { user, role } = useAuth();
  const router = useRouter();

  const [usersList, setUsersList] = useState<AdminUserItem[]>([]);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalMembers: 0,
    totalOrders: 0
  });

  const [newFormateurName, setNewFormateurName] = useState('');
  const [newFormateurEmail, setNewFormateurEmail] = useState('');
  const [showCreateFormateur, setShowCreateFormateur] = useState(false);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('gd_auth_user');
      const parsedRole = savedUser ? JSON.parse(savedUser).role : role;
      if (!savedUser && !user) {
        router.push('/mon-compte');
        return;
      }
      if (parsedRole !== 'superadmin' && role !== 'superadmin') {
        router.push('/dashboard/eleve');
        return;
      }
    }
  }, [user, role, router]);

  // Load real accounts & purchases from Supabase DB & localStorage
  // Load real accounts & purchases directly from Supabase DB tables (profiles, orders, enrollments, preorder_buyers)
  const loadDashboardData = async () => {
    try {
      const accountsMap = new Map<string, AdminUserItem>();

      // 1. Fetch all registered user profiles from Supabase DB
      const { data: profiles } = await supabase.from('profiles').select('*');
      if (profiles && Array.isArray(profiles)) {
        profiles.forEach((p: any) => {
          const em = p.email?.toLowerCase().trim();
          if (em) {
            accountsMap.set(em, {
              id: p.id || `sp-${Date.now()}`,
              name: p.full_name || em.split('@')[0],
              email: em,
              role: p.role || 'eleve',
              purchasesCount: 0,
              totalSpent: 0
            });
          }
        });
      }

      let totalRev = 0;
      let totalOrdersCount = 0;

      // 2. Fetch sales from orders table
      const { data: orders } = await supabase.from('orders').select('*');
      if (orders && Array.isArray(orders)) {
        orders.forEach((ord: any) => {
          const em = ord.customer_email?.toLowerCase().trim();
          const amount = ord.amount ? Number(ord.amount) : (ord.total_amount_cents ? ord.total_amount_cents / 100 : 29);
          totalOrdersCount += 1;
          totalRev += amount;

          if (em) {
            const existing = accountsMap.get(em);
            if (existing) {
              existing.purchasesCount += 1;
              existing.totalSpent += amount;
            } else {
              accountsMap.set(em, {
                id: ord.id || `o-${Date.now()}`,
                name: em.split('@')[0],
                email: em,
                role: 'eleve',
                purchasesCount: 1,
                totalSpent: amount
              });
            }
          }
        });
      }

      // 3. Fetch sales from enrollments table
      const { data: enrollments } = await supabase.from('enrollments').select('*');
      if (enrollments && Array.isArray(enrollments)) {
        enrollments.forEach((enr: any) => {
          const em = enr.user_email?.toLowerCase().trim();
          const amount = enr.price ? Number(enr.price) : 29;
          if (em) {
            const existing = accountsMap.get(em);
            if (existing) {
              if (existing.purchasesCount === 0) {
                existing.purchasesCount += 1;
                existing.totalSpent += amount;
                totalOrdersCount += 1;
                totalRev += amount;
              }
            } else {
              accountsMap.set(em, {
                id: enr.id || `e-${Date.now()}`,
                name: em.split('@')[0],
                email: em,
                role: 'eleve',
                purchasesCount: 1,
                totalSpent: amount
              });
              totalOrdersCount += 1;
              totalRev += amount;
            }
          }
        });
      }

      const uniqueList = Array.from(accountsMap.values());

      setUsersList(uniqueList);
      setStats({
        totalRevenue: totalRev,
        totalMembers: uniqueList.length,
        totalOrders: totalOrdersCount
      });
    } catch (err) {
      console.error('Failed to load admin dashboard data', err);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleCreateFormateur = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFormateurEmail) return;

    const normalizedEmail = newFormateurEmail.toLowerCase().trim();
    const formateurName = newFormateurName || normalizedEmail.split('@')[0];

    // Save directly to Supabase profiles table
    try {
      await supabase.from('profiles').upsert({
        email: normalizedEmail,
        full_name: formateurName,
        role: 'formateur',
        updated_at: new Date().toISOString()
      }, { onConflict: 'email' });
    } catch (e) {
      console.warn('Error upserting formateur profile in Supabase', e);
    }

    setNewFormateurName('');
    setNewFormateurEmail('');
    setShowCreateFormateur(false);
    await loadDashboardData();
    alert(`Compte Formateur créé et enregistré dans Supabase BDD pour ${normalizedEmail} !`);
  };

  const handleRoleChange = async (userEmail: string, newRole: UserRole) => {
    // Update local state immediately for UI responsiveness
    setUsersList(
      usersList.map((u) => (u.email === userEmail ? { ...u, role: newRole } : u))
    );

    // Persist role update in Supabase DB profiles table
    try {
      await supabase.from('profiles').update({
        role: newRole,
        updated_at: new Date().toISOString()
      }).eq('email', userEmail.toLowerCase().trim());
    } catch (e) {
      console.warn('Failed to update user role in Supabase profiles', e);
    }
  };

  const handleResetPurchasesOnly = async () => {
    if (confirm('Voulez-vous réinitialiser TOUS les achats et commandes effectués pour chaque profil élève à zéro (0 €) ?')) {
      if (typeof window !== 'undefined') {
        purgeAllUserPurchases();
      }
      try {
        await supabase.from('enrollments').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      } catch (e) {}
      loadDashboardData();
      alert('Tous les achats élèves ont été réinitialisés à zéro pour l\'ensemble des profils !');
    }
  };

  const handleResetData = () => {
    if (confirm('Voulez-vous vraiment réinitialiser toutes les données de test à zéro ? Vos formations et précommandes précédentes seront effacées.')) {
      if (typeof window !== 'undefined') {
        purgeAllCoursesData();
        purgeAllPreorders();
        purgeAllUserPurchases();
        localStorage.clear();
      }
      loadDashboardData();
      alert('Base de données entièrement nettoyée ! Vous repartez de zéro.');
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#332420] font-sans">
      <Header />

      {/* BANNER HEADER */}
      <section className="py-10 bg-gradient-to-b from-[#fdf2f0] to-[#faf8f5] border-b border-[#e8ded0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#e05a47] text-white flex items-center justify-center font-extrabold text-2xl shadow-md border-2 border-white">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <span className="inline-block px-3 py-0.5 rounded-full text-[11px] font-extrabold bg-rose-100 text-[#e05a47] uppercase tracking-wider mb-1">
                Espace Superadmin / Direction
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#332420]">
                Centre de Contrôle <span className="text-[#e05a47]">Guides Digitaux</span>
              </h1>
              <p className="text-xs text-[#5e4d46] font-medium">
                Pilotage des ventes réelles, gestion des rôles utilisateurs et modération de la plateforme.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={handleResetPurchasesOnly}
              className="px-4 py-2 bg-white border border-[#e8ded0] text-xs font-bold text-[#5e4d46] hover:text-[#18757d] hover:border-[#18757d]/30 rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#18757d]" />
              Vider les achats élèves (0 €)
            </button>

            <button
              onClick={handleResetData}
              className="px-4 py-2 bg-white border border-[#e8ded0] text-xs font-bold text-[#5e4d46] hover:text-[#e05a47] hover:border-rose-300 rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-500" />
              Réinitialiser tout à zéro
            </button>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          {/* Superadmin Full Access Shortcuts Hub */}
          <div className="bg-gradient-to-br from-[#18757d]/10 via-white to-[#f4ede0] p-6 sm:p-8 rounded-3xl border-2 border-[#18757d]/30 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="px-3 py-1 bg-[#18757d] text-white text-xs font-black rounded-full uppercase tracking-wider">
                  Accès Intégral Superadmin
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-[#332420] mt-2">
                  Studio Formations, Catalogue & Espace Élève
                </h2>
                <p className="text-xs sm:text-sm text-[#5e4d46] font-medium">
                  En tant que Superadmin, vous possédez un accès illimité et direct à l'ensemble du LMS sans besoin de créer un compte formateur séparé.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
              <Link
                href="/dashboard/admin/produits"
                className="bg-white p-4 rounded-2xl border border-[#eee7da] hover:border-[#e05a47] hover:shadow-md transition-all flex items-center gap-3 group"
              >
                <div className="w-10 h-10 rounded-xl bg-rose-50 text-[#e05a47] flex items-center justify-center group-hover:bg-[#e05a47] group-hover:text-white transition-colors">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-[#332420] group-hover:text-[#e05a47]">Fiches Produits & Tarifs</h4>
                  <p className="text-[11px] text-slate-500">Gérer la boutique, prix et offres</p>
                </div>
              </Link>

              <Link
                href="/dashboard/admin/blog"
                className="bg-white p-4 rounded-2xl border border-[#eee7da] hover:border-[#18757d] hover:shadow-md transition-all flex items-center gap-3 group"
              >
                <div className="w-10 h-10 rounded-xl bg-[#e6f4f3] text-[#18757d] flex items-center justify-center group-hover:bg-[#18757d] group-hover:text-white transition-colors">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-[#332420] group-hover:text-[#18757d]">Articles de Blog</h4>
                  <p className="text-[11px] text-slate-500">Rédiger & gérer les articles</p>
                </div>
              </Link>

              <Link
                href="/dashboard/formateur"
                className="bg-white p-4 rounded-2xl border border-[#eee7da] hover:border-[#18757d] hover:shadow-md transition-all flex items-center gap-3 group"
              >
                <div className="w-10 h-10 rounded-xl bg-[#e6f4f3] text-[#18757d] flex items-center justify-center group-hover:bg-[#18757d] group-hover:text-white transition-colors">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-[#332420] group-hover:text-[#18757d]">Studio Formations LMS</h4>
                  <p className="text-[11px] text-slate-500">Gérer tous les cours vidéo</p>
                </div>
              </Link>

              <Link
                href="/dashboard/admin/stats"
                className="bg-white p-4 rounded-2xl border border-[#eee7da] hover:border-purple-500 hover:shadow-md transition-all flex items-center gap-3 group"
              >
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
                  <BarChart2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-[#332420] group-hover:text-purple-600">Statistiques & Audience</h4>
                  <p className="text-[11px] text-slate-500">Visiteurs, pages vues & paniers abandonnés</p>
                </div>
              </Link>

              <Link
                href="/dashboard/admin/marketing"
                className="bg-white p-4 rounded-2xl border border-[#eee7da] hover:border-amber-500 hover:shadow-md transition-all flex items-center gap-3 group"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors">
                  <Tag className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-[#332420] group-hover:text-amber-600">Marketing & Codes Promo</h4>
                  <p className="text-[11px] text-slate-500">Créer des remises % ou €</p>
                </div>
              </Link>

              <Link
                href="/dashboard/admin/coaching"
                className="bg-white p-4 rounded-2xl border border-[#eee7da] hover:border-emerald-600 hover:shadow-md transition-all flex items-center gap-3 group"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-[#332420] group-hover:text-emerald-600">Suivi Coaching (2 RDV)</h4>
                  <p className="text-[11px] text-slate-500">Valider les RDV & verrouiller agenda</p>
                </div>
              </Link>

              <Link
                href="/dashboard/admin/produits/editeur"
                className="bg-white p-4 rounded-2xl border border-[#eee7da] hover:border-[#e05a47] hover:shadow-md transition-all flex items-center gap-3 group"
              >
                <div className="w-10 h-10 rounded-xl bg-rose-50 text-[#e05a47] flex items-center justify-center group-hover:bg-[#e05a47] group-hover:text-white transition-colors">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-[#332420] group-hover:text-[#e05a47]">Créer un Produit</h4>
                  <p className="text-[11px] text-slate-500">Ajouter une fiche produit</p>
                </div>
              </Link>

              <Link
                href="/dashboard/admin/blog/editeur"
                className="bg-white p-4 rounded-2xl border border-[#eee7da] hover:border-[#18757d] hover:shadow-md transition-all flex items-center gap-3 group"
              >
                <div className="w-10 h-10 rounded-xl bg-[#e6f4f3] text-[#18757d] flex items-center justify-center group-hover:bg-[#18757d] group-hover:text-white transition-colors">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-[#332420] group-hover:text-[#18757d]">Rédiger un Article</h4>
                  <p className="text-[11px] text-slate-500">Publier sur le blog</p>
                </div>
              </Link>

              <Link
                href="/dashboard/eleve"
                className="bg-white p-4 rounded-2xl border border-[#eee7da] hover:border-[#18757d] hover:shadow-md transition-all flex items-center gap-3 group"
              >
                <div className="w-10 h-10 rounded-xl bg-[#e6f4f3] text-[#18757d] flex items-center justify-center group-hover:bg-[#18757d] group-hover:text-white transition-colors">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-[#332420] group-hover:text-[#18757d]">Espace Élève / Achats</h4>
                  <p className="text-[11px] text-slate-500">Tester la vue apprenant</p>
                </div>
              </Link>
            </div>
          </div>

          {/* Revenue & Sales KPI Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-[#eee7da] shadow-2xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <DollarSign className="w-6 h-6" />
              </div>
              <div>
                <span className="text-2xl font-extrabold text-[#18757d]">
                  {stats.totalRevenue.toFixed(2).replace('.', ',')} €
                </span>
                <span className="text-xs text-slate-500 font-bold block">Chiffre d'Affaires Total (Réel)</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-[#eee7da] shadow-2xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#e6f4f3] text-[#18757d] flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <span className="text-2xl font-extrabold text-[#332420]">{usersList.length}</span>
                <span className="text-xs text-slate-500 font-bold block">Comptes Utilisateurs Réels</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-[#eee7da] shadow-2xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-[#e05a47] flex items-center justify-center">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div>
                <span className="text-2xl font-extrabold text-[#332420]">{stats.totalOrders}</span>
                <span className="text-xs text-slate-500 font-bold block">Commandes Inscrites</span>
              </div>
            </div>
          </div>

          {/* User Roles Management Table */}
          <div className="bg-white p-8 rounded-3xl border border-[#eee7da] shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#eee7da] pb-4 gap-4">
              <div>
                <h2 className="text-xl font-extrabold text-[#332420]">
                  Gestion des Utilisateurs & Attribution des Rôles
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">{usersList.length} comptes authentifiés répertoriés</p>
              </div>

              <button
                onClick={() => setShowCreateFormateur(!showCreateFormateur)}
                className="px-4 py-2 bg-[#18757d] hover:bg-[#12595f] text-white rounded-xl text-xs font-extrabold shadow-sm transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
              >
                <GraduationCap className="w-4 h-4" />
                + Créer un compte Formateur
              </button>
            </div>

            {/* Formateur Creation Box */}
            {showCreateFormateur && (
              <form onSubmit={handleCreateFormateur} className="p-5 bg-[#e6f4f3]/60 rounded-2xl border border-[#18757d]/30 space-y-4 animate-in fade-in duration-200">
                <h3 className="text-xs font-extrabold text-[#18757d] uppercase tracking-wider">
                  Nouveau Compte Formateur
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs font-bold text-[#332420] block mb-1">Nom du formateur :</label>
                    <input
                      type="text"
                      placeholder="Ex: Claire Martin"
                      value={newFormateurName}
                      onChange={(e) => setNewFormateurName(e.target.value)}
                      className="w-full bg-white border border-[#eee7da] rounded-xl px-3.5 py-2 text-xs text-[#332420] focus:outline-none focus:border-[#18757d]"
                    />
                  </div>
                  <div>
                    <label className="text-xs font-bold text-[#332420] block mb-1">Adresse email du formateur :</label>
                    <input
                      type="email"
                      required
                      placeholder="formateur@exemple.fr"
                      value={newFormateurEmail}
                      onChange={(e) => setNewFormateurEmail(e.target.value)}
                      className="w-full bg-white border border-[#eee7da] rounded-xl px-3.5 py-2 text-xs text-[#332420] focus:outline-none focus:border-[#18757d]"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowCreateFormateur(false)}
                    className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold transition-colors"
                  >
                    Annuler
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 bg-[#18757d] hover:bg-[#12595f] text-white rounded-xl text-xs font-extrabold transition-colors shadow-sm"
                  >
                    Valider le compte Formateur
                  </button>
                </div>
              </form>
            )}

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs font-semibold text-[#332420]">
                <thead>
                  <tr className="border-b border-[#eee7da] text-slate-500 uppercase tracking-wider text-[10px]">
                    <th className="pb-3 px-4">Utilisateur</th>
                    <th className="pb-3 px-4">Email</th>
                    <th className="pb-3 px-4">Achats</th>
                    <th className="pb-3 px-4">Total Dépensé</th>
                    <th className="pb-3 px-4">Rôle Actuel</th>
                    <th className="pb-3 px-4 text-right">Changer de rôle</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#eee7da]">
                  {usersList.map((u) => (
                    <tr key={u.id} className="hover:bg-[#faf8f5] transition-colors">
                      <td className="py-4 px-4 font-extrabold">{u.name}</td>
                      <td className="py-4 px-4 text-slate-600">{u.email}</td>
                      <td className="py-4 px-4">{u.purchasesCount} commande(s)</td>
                      <td className="py-4 px-4 font-bold text-[#18757d]">{u.totalSpent.toFixed(2).replace('.', ',')} €</td>
                      <td className="py-4 px-4">
                        <span className={`px-3 py-1 rounded-full text-[10px] font-extrabold uppercase ${
                          u.role === 'superadmin' 
                            ? 'bg-rose-100 text-[#e05a47]' 
                            : u.role === 'formateur' 
                            ? 'bg-[#e6f4f3] text-[#18757d]' 
                            : 'bg-[#f4ede0] text-[#332420]'
                        }`}>
                          {u.role}
                        </span>
                      </td>
                      <td className="py-4 px-4 text-right">
                        <select
                          value={u.role}
                          onChange={(e) => handleRoleChange(u.email, e.target.value as UserRole)}
                          className="bg-[#faf8f5] border border-[#eee7da] rounded-xl px-3 py-1.5 text-xs text-[#332420] focus:outline-none focus:border-[#18757d]"
                        >
                          <option value="eleve">Élève</option>
                          <option value="formateur">Formateur</option>
                          <option value="superadmin">Superadmin</option>
                        </select>
                      </td>
                    </tr>
                  ))}
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
