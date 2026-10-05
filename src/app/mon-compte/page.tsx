'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { Lock, Mail, Key, ArrowRight, ShieldCheck, Eye, EyeOff, CheckCircle2, AlertCircle, Sparkles } from 'lucide-react';

export default function MonComptePage() {
  const { login } = useAuth();
  
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Password reset / Account activation state
  const [showForgotPassword, setShowForgotPassword] = useState(false);
  const [forgotEmail, setForgotEmail] = useState('');
  const [forgotLoading, setForgotLoading] = useState(false);
  const [forgotSuccess, setForgotSuccess] = useState('');
  const [forgotError, setForgotError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    if (!email) return;

    const res = await login(email, password);
    if (!res.success) {
      setErrorMsg(res.error || 'Mot de passe ou identifiants incorrects.');
      return;
    }

    const urlParams = typeof window !== 'undefined' ? new URLSearchParams(window.location.search) : null;
    const redirectParam = urlParams?.get('redirect');

    let destination = '/dashboard/eleve';
    if (redirectParam && redirectParam.startsWith('/') && !redirectParam.startsWith('//')) {
      destination = redirectParam;
    } else if (res.role === 'superadmin') {
      destination = '/dashboard/admin';
    } else if (res.role === 'formateur') {
      destination = '/dashboard/formateur';
    }

    // Reload the destination so its access guard reads the newly issued session cookie.
    window.location.assign(destination);
  };

  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    setForgotError('');
    setForgotSuccess('');
    const targetEmail = (forgotEmail || email).trim();

    if (!targetEmail) {
      setForgotError('Veuillez saisir votre adresse e-mail.');
      return;
    }

    setForgotLoading(true);

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: targetEmail })
      });

      const data = await res.json();

      if (!res.ok) {
        setForgotError(data.error || 'Erreur lors de la demande de réinitialisation.');
      } else {
        setForgotSuccess(data.message || 'Un lien sécurisé vous a été envoyé par e-mail. Vérifiez votre boîte de réception.');
      }
    } catch (err: unknown) {
      setForgotError('Erreur réseau. Veuillez réessayer.');
    } finally {
      setForgotLoading(false);
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

          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#332420] tracking-tight mb-2">
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

            {showForgotPassword ? (
              /* FORGOT PASSWORD / FIRST LOGIN FORM */
              <div className="space-y-5">
                <div className="space-y-1.5">
                  <span className="inline-flex items-center gap-1.5 text-xs font-extrabold text-[#18757d] uppercase tracking-wider">
                    <Key className="w-3.5 h-3.5 text-[#18757d]" />
                    Récupération & Première Connexion
                  </span>
                  <h2 className="text-xl font-extrabold text-[#332420]">
                    Mot de passe oublié ?
                  </h2>
                  <p className="text-xs text-[#5e4d46] leading-relaxed">
                    Saisis ton adresse e-mail d'achat pour recevoir un lien direct de connexion et définir ton mot de passe.
                  </p>
                </div>

                {forgotError && (
                  <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-xl flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                    <span>{forgotError}</span>
                  </div>
                )}

                {forgotSuccess ? (
                  <div className="space-y-4">
                    <div className="p-4 bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-bold rounded-2xl flex items-start gap-2.5">
                      <CheckCircle2 className="w-5 h-5 shrink-0 text-emerald-600 mt-0.5" />
                      <div className="space-y-1">
                        <p>{forgotSuccess}</p>
                        <p className="text-[11px] font-normal text-emerald-700">Pensez à vérifier vos dossiers "Spams" ou "Courrier indésirable" si besoin.</p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => {
                        setShowForgotPassword(false);
                        setForgotSuccess('');
                      }}
                      className="w-full py-3.5 text-xs font-extrabold text-[#18757d] bg-[#e6f4f3] hover:bg-[#d4edea] rounded-xl transition-colors text-center"
                    >
                      ← Retour à la connexion
                    </button>
                  </div>
                ) : (
                  <form onSubmit={handleForgotPassword} className="space-y-4">
                    <div className="space-y-1.5">
                      <label className="text-xs font-extrabold text-[#332420]">Ton adresse e-mail :</label>
                      <div className="relative">
                        <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                        <input
                          type="email"
                          required
                          placeholder="ton.email@exemple.fr"
                          value={forgotEmail || email}
                          onChange={(e) => setForgotEmail(e.target.value)}
                          className="w-full bg-[#faf8f5] border border-[#eee7da] rounded-xl pl-10 pr-4 py-3 text-xs text-[#332420] focus:outline-none focus:border-[#18757d]"
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={forgotLoading}
                      className="w-full py-4 text-xs font-extrabold text-white bg-[#18757d] hover:bg-[#12595f] disabled:opacity-50 rounded-2xl shadow-md uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer"
                    >
                      <Mail className="w-4 h-4" />
                      {forgotLoading ? 'ENVOI EN COURS...' : 'M\'ENVOYER MON LIEN DE CONNEXION'}
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setShowForgotPassword(false);
                        setForgotError('');
                      }}
                      className="w-full py-2.5 text-xs font-bold text-slate-500 hover:text-[#18757d] transition-colors text-center block"
                    >
                      ← Annuler et revenir à la connexion
                    </button>
                  </form>
                )}
              </div>
            ) : (
              /* STANDARD LOGIN / REGISTER FORM */
              <>
                {/* Tabs */}
                <div className="flex bg-[#faf8f5] p-1.5 rounded-2xl border border-[#eee7da]">
                  <button
                    type="button"
                    onClick={() => setIsLogin(true)}
                    className={`flex-1 py-2.5 text-xs font-extrabold rounded-xl transition-all ${
                      isLogin ? 'bg-[#18757d] text-white shadow-sm' : 'text-[#5e4d46] hover:text-[#18757d]'
                    }`}
                  >
                    Se Connecter
                  </button>
                  <button
                    type="button"
                    onClick={() => setIsLogin(false)}
                    className={`flex-1 py-2.5 text-xs font-extrabold rounded-xl transition-all ${
                      !isLogin ? 'bg-[#18757d] text-white shadow-sm' : 'text-[#5e4d46] hover:text-[#18757d]'
                    }`}
                  >
                    Première Connexion
                  </button>
                </div>

                {!isLogin && (
                  <div className="p-3.5 bg-amber-50 border border-amber-200 text-amber-900 text-xs rounded-xl space-y-1">
                    <p className="font-extrabold flex items-center gap-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-amber-600" />
                      Vous venez de passer commande ?
                    </p>
                    <p className="text-[11px] text-amber-800 leading-relaxed">
                      Votre compte client a été créé automatiquement avec votre achat. Si vous n'avez pas encore défini votre mot de passe, cliquez ci-dessous pour recevoir votre lien d'accès direct par e-mail.
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setShowForgotPassword(true);
                        setForgotEmail(email);
                      }}
                      className="inline-block mt-1 font-extrabold text-[#18757d] underline hover:text-[#12595f] text-xs"
                    >
                      👉 Activer mon compte / Choisir mon mot de passe →
                    </button>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  {errorMsg && (
                    <div className="p-3 bg-rose-50 border border-rose-200 text-rose-700 text-xs font-bold rounded-xl flex items-center gap-2">
                      <AlertCircle className="w-4 h-4 shrink-0 text-rose-600" />
                      <span>{errorMsg}</span>
                    </div>
                  )}

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
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-extrabold text-[#332420]">Mot de passe :</label>
                      <button
                        type="button"
                        onClick={() => {
                          setShowForgotPassword(true);
                          setForgotEmail(email);
                        }}
                        className="text-[11px] font-bold text-[#18757d] hover:underline cursor-pointer"
                      >
                        Mot de passe oublié ?
                      </button>
                    </div>
                    <div className="relative">
                      <Key className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                      <input
                        type={showPassword ? 'text' : 'password'}
                        required
                        minLength={8}
                        placeholder="••••••••"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full bg-[#faf8f5] border border-[#eee7da] rounded-xl pl-10 pr-11 py-3 text-xs text-[#332420] focus:outline-none focus:border-[#18757d]"
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword((visible) => !visible)}
                        aria-label={showPassword ? 'Masquer le mot de passe' : 'Afficher le mot de passe'}
                        aria-pressed={showPassword}
                        className="absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#18757d] focus:outline-none focus-visible:ring-2 focus-visible:ring-[#18757d] rounded-md cursor-pointer"
                      >
                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                      </button>
                    </div>
                  </div>

                  <button
                    type="submit"
                    className="w-full py-4 text-xs font-extrabold text-white bg-[#18757d] hover:bg-[#12595f] rounded-2xl shadow-md uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer mt-2"
                  >
                    <Lock className="w-4 h-4" />
                    {isLogin ? 'SE CONNECTER À MON ESPACE' : 'VALIDER & ACCÉDER À MON ESPACE'}
                  </button>
                </form>
              </>
            )}

            <div className="p-4 bg-[#f4ede0] rounded-2xl text-[11px] text-[#332420] font-semibold flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-[#18757d] shrink-0" />
              <span>Authentification 100% sécurisée SSL. Vos données personnelles restent strictement protégées.</span>
            </div>

          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
}
