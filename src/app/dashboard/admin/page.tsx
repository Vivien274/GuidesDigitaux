'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth, UserRole } from '@/context/AuthContext';
import { 
  Shield, 
  DollarSign, 
  Users, 
  ShoppingBag, 
  CheckCircle2, 
  Sparkles, 
  UserCheck, 
  GraduationCap, 
  TrendingUp,
  Download
} from 'lucide-react';

export default function SuperadminDashboardPage() {
  const { user } = useAuth();

  const [usersList, setUsersList] = useState([
    { id: 'u1', name: 'Stéphanie ROCQ', email: 'stephanie@guides-digitaux.com', role: 'superadmin' as UserRole, purchasesCount: 15, totalSpent: 450.0 },
    { id: 'u2', name: 'Jean Dupont', email: 'jean.dupont@artisan-bois.fr', role: 'eleve' as UserRole, purchasesCount: 3, totalSpent: 27.0 },
    { id: 'u3', name: 'Claire Martin', email: 'claire@ceramique-atelier.com', role: 'formateur' as UserRole, purchasesCount: 5, totalSpent: 199.0 },
    { id: 'u4', name: 'Marc Leroy', email: 'marc.leroy@boulangerie.fr', role: 'eleve' as UserRole, purchasesCount: 1, totalSpent: 5.0 }
  ]);

  const handleRoleChange = (userId: string, newRole: UserRole) => {
    setUsersList(
      usersList.map((u) => (u.id === userId ? { ...u, role: newRole } : u))
    );
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
                Pilotage global des ventes, gestion des rôles utilisateurs et modération de la plateforme.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          {/* Revenue & Sales KPI Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-[#eee7da] shadow-2xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <DollarSign className="w-6 h-6" />
              </div>
              <div>
                <span className="text-2xl font-extrabold text-[#18757d]">4 850,00 €</span>
                <span className="text-xs text-slate-500 font-bold block">Chiffre d'Affaires Total (TTC)</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-[#eee7da] shadow-2xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#e6f4f3] text-[#18757d] flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <span className="text-2xl font-extrabold text-[#332420]">340</span>
                <span className="text-xs text-slate-500 font-bold block">Membres inscrits</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-[#eee7da] shadow-2xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-[#e05a47] flex items-center justify-center">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div>
                <span className="text-2xl font-extrabold text-[#332420]">184</span>
                <span className="text-xs text-slate-500 font-bold block">Commandes validées (Stripe)</span>
              </div>
            </div>
          </div>

          {/* User Roles Management Table */}
          <div className="bg-white p-8 rounded-3xl border border-[#eee7da] shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-[#eee7da] pb-4">
              <h2 className="text-xl font-extrabold text-[#332420]">
                Gestion des Utilisateurs & Attribution des Rôles
              </h2>
              <span className="text-xs text-slate-500 font-medium">{usersList.length} membres répertoriés</span>
            </div>

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
                      <td className="py-4 px-4 font-bold text-[#18757d]">{u.totalSpent.toFixed(2)} €</td>
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
                          onChange={(e) => handleRoleChange(u.id, e.target.value as UserRole)}
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
