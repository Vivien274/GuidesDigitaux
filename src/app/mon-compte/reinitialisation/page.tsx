'use client';

import React, { useState, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Lock, Key, ArrowRight, Eye, EyeOff, CheckCircle2, AlertCircle } from 'lucide-react';

function ReinitialisationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get('token') || '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');

    if (!token) {
      setErrorMsg('Le jeton de sécurité est manquant. Veuillez recliquer sur le lien reçu par e-mail.');
      return;
    }

    if (password.length < 8) {
      setErrorMsg('Le mot de passe doit comporter au moins 8 caractères.');
      return;
    }

    if (password !== confirmPassword) {
      setErrorMsg('Les deux mots de passe ne correspondent pas.');
      return;
    }

    setIsSubmitting(true);

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, password })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        setErrorMsg(data.error || 'Erreur lors de la mise à jour du mot de passe.');
        setIsSubmitting(false);
        return;
      }

      setSuccessMsg('🎉 Votre mot de passe a été défini avec succès ! Connexion en cours...');
      setTimeout(() => {
        window.location.assign('/dashboard/eleve');
      }, 1200);

    } catch (err: unknown) {
      setErrorMsg('Erreur de connexion avec le serveur. Veuillez réessayer.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#332420] font-sans flex flex-col justify-between">
      <div>
        <Header />

        <section className="py-12 md:py-20 bg-gradient-to-b from-[#eef4fb] to-[#faf8f5]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
            <span className="inline-block px-3.5 py-1 rounded-full text-xs font-extrabold bg-[#e6f4f3] text-[#18757d] uppercase tracking-wider">
              Sécurité & Accès
            </span>

            <h1 className="text-3xl sm:text-4xl font-extrabold text-[#332420] tracking-tight">
              Définir votre <span className="text-[#18757d]">Mot de Passe</span>
            </h1>

            <p className="text-sm text-[#5e4d46] max-w-xl mx-auto leading-relaxed">
              Choisissez votre nouveau mot de passe pour accéder à vos formations et vos téléchargements.
            </p>
          </div>
        </section>

        <section className="py-10 md:py-16">
          <div className="max-w-md mx-auto px-4">
            <div className="bg-white p-8 sm:p-10 rounded-3xl border border-[#eee7da] shadow-sm space-y-6">

              {errorMsg && (
                <div className="p-3.5 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-xl flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                  <span>{errorMsg}</span>
                </div>
              )}

              {successMsg && (
                <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-emerald-700 text-xs font-bold rounded-xl flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>{successMsg}</span>
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-[#332420]">Nouveau mot de passe :</label>
                  <div className="relative">
                    <Key className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength={8}
                      placeholder="Au moins 8 caractères"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full bg-[#faf8f5] border border-[#eee7da] rounded-xl pl-10 pr-11 py-3 text-xs text-[#332420] focus:outline-none focus:border-[#18757d]"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      aria-label={showPassword ? 'Masquer' : 'Afficher'}
                      className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#18757d]"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-[#332420]">Confirmer le mot de passe :</label>
                  <div className="relative">
                    <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      minLength={8}
                      placeholder="Répétez votre mot de passe"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full bg-[#faf8f5] border border-[#eee7da] rounded-xl pl-10 pr-4 py-3 text-xs text-[#332420] focus:outline-none focus:border-[#18757d]"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full py-4 text-xs font-extrabold text-white bg-[#18757d] hover:bg-[#12595f] disabled:opacity-50 rounded-2xl shadow-md uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer mt-4"
                >
                  <Lock className="w-4 h-4" />
                  {isSubmitting ? 'ENREGISTREMENT...' : 'ENREGISTRER & ACCÉDER À MON ESPACE'}
                </button>
              </form>

            </div>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
}

export default function ReinitialisationPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#18757d] border-t-transparent"></div>
      </div>
    }>
      <ReinitialisationContent />
    </Suspense>
  );
}
