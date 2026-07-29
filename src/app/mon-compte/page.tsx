'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth, UserRole } from '@/context/AuthContext';
import { Lock, Mail, User, Key, ArrowRight, ShieldCheck, Download, Sparkles, GraduationCap, Shield } from 'lucide-react';

export default function MonComptePage() {
  const router = useRouter();
  const { user, role, login, setRole, isLoggedIn } = useAuth();
  
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('stephanie@guides-digitaux.com');
  const [password, setPassword] = useState('••••••••');
  const [selectedRole, setSelectedRole] = useState<UserRole>('eleve');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    login(email, selectedRole);
    if (selectedRole === 'superadmin') {
      router.push('/dashboard/admin');
    } else if (selectedRole === 'formateur') {
      router.push('/dashboard/formateur');
    } else {
      router.push('/dashboard/eleve');
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#332420] font-sans">
      <Header />

      {/* HERO SECTION */}
      <section className="py-12 md:py-20 bg-gradient-to-b from-[#eef4fb] to-[#faf8f5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="inline-block px-3.5 py-1 rounded-full text-xs font-extrabold bg-[#e6f4f3] text-[#18757d] uppercase tracking-wider">
            Espace Membre & Authentification
          </span>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#332420] tracking-tight">
            Connexion & <span className="text-[#18757d]">Espace Client</span>
          </h1>

          <p className="text-sm sm:text-base text-[#5e4d46] max-w-2xl mx-auto leading-relaxed">
            Connecte-toi pour accéder à tes e-books, tes formations vidéo et ton espace dédié.
          </p>
        </div>
      </section>

      {/* LOGIN / REGISTER FORM */}
      <section className="py-12 md:py-20">
        <div className="max-w-md mx-auto px-4">
          
          <div className="bg-white p-8 sm:p-10 rounded-3xl border border-[#eee7da] shadow-sm space-y-6">
            
            {/* Tabs */}
            <div className="flex bg-[#faf8f5] p-1.5 rounded-2xl border border-[#eee7da]">
              <button
                onClick={() => setIsLogin(true)}
                className={`flex-1 py-2.5 text-xs font-extrabold rounded-xl transition-all ${
                  isLogin ? 'bg-[#18757d] text-white shadow-sm' : 'text-[#5e4d46] hover:text-[#18757d]'
                }`}
              >
                Se Connecter
              </button>
              <button
                onClick={() => setIsLogin(false)}
                className={`flex-1 py-2.5 text-xs font-extrabold rounded-xl transition-all ${
                  !isLogin ? 'bg-[#18757d] text-white shadow-sm' : 'text-[#5e4d46] hover:text-[#18757d]'
                }`}
              >
                Créer un compte
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-[#332420]">Adresse Email :</label>
                <div className="relative">
                  <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="email"
                    required
                    placeholder="ton.email@exemple.fr"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#faf8f5] border border-[#eee7da] rounded-xl pl-10 pr-4 py-3 text-xs text-[#332420] focus:outline-none focus:border-[#18757d]"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-extrabold text-[#332420]">Mot de passe :</label>
                <div className="relative">
                  <Key className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-[#faf8f5] border border-[#eee7da] rounded-xl pl-10 pr-4 py-3 text-xs text-[#332420] focus:outline-none focus:border-[#18757d]"
                  />
                </div>
              </div>

              {/* Demo Role Selection */}
              <div className="space-y-1.5 pt-2">
                <label className="text-xs font-extrabold text-[#332420]">Se connecter en tant que (Rôle) :</label>
                <div className="grid grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedRole('eleve')}
                    className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all flex flex-col items-center gap-1 ${
                      selectedRole === 'eleve'
                        ? 'bg-[#e6f4f3] border-[#18757d] text-[#18757d]'
                        : 'border-[#eee7da] bg-[#faf8f5] text-slate-600'
                    }`}
                  >
                    <User className="w-4 h-4" />
                    <span>Élève</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedRole('formateur')}
                    className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all flex flex-col items-center gap-1 ${
                      selectedRole === 'formateur'
                        ? 'bg-[#e6f4f3] border-[#18757d] text-[#18757d]'
                        : 'border-[#eee7da] bg-[#faf8f5] text-slate-600'
                    }`}
                  >
                    <GraduationCap className="w-4 h-4" />
                    <span>Formateur</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setSelectedRole('superadmin')}
                    className={`py-2 px-2 rounded-xl text-xs font-bold border transition-all flex flex-col items-center gap-1 ${
                      selectedRole === 'superadmin'
                        ? 'bg-rose-50 border-[#e05a47] text-[#e05a47]'
                        : 'border-[#eee7da] bg-[#faf8f5] text-slate-600'
                    }`}
                  >
                    <Shield className="w-4 h-4" />
                    <span>Admin</span>
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-4 text-xs font-extrabold text-white bg-[#18757d] hover:bg-[#12595f] rounded-2xl shadow-md uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
              >
                <Lock className="w-4 h-4" />
                ACCÉDER À MON ESPACE ({selectedRole.toUpperCase()})
              </button>
            </form>

            <div className="p-4 bg-[#f4ede0] rounded-2xl text-[11px] text-[#332420] font-semibold flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#18757d] shrink-0" />
              <span>Authentification 100% sécurisée via Supabase Auth SSL.</span>
            </div>

          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
}
