'use client';

import React, { useState } from 'react';
import { X, Sparkles, CheckCircle2, Mail, Lock, Send, ShieldCheck } from 'lucide-react';

interface VipSubscribeModalProps {
  isOpen: boolean;
  onClose: () => void;
  defaultTag?: string;
  courseTitle?: string;
}

export default function VipSubscribeModal({
  isOpen,
  onClose,
  defaultTag = 'prevente-gmb',
  courseTitle = 'Formation Fiche Google Business Profile'
}: VipSubscribeModalProps) {
  const [email, setEmail] = useState('');
  const [fullName, setFullName] = useState('');
  const [honeypot, setHoneypot] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) {
      setErrorMessage('Veuillez renseigner une adresse email valide.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    setSuccessMessage(null);

    try {
      const res = await fetch('/api/mailchimp/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: email.trim(),
          fullName: fullName.trim(),
          tag: defaultTag,
          tags: [defaultTag, 'prevente-gmb', 'prévente-GMB'],
          honeypot
        })
      });

      const data = await res.json();

      if (res.ok && data.success) {
        setSuccessMessage(
          data.message || '🎉 Félicitations ! Tu es bien inscrite sur la Liste VIP Prévente GMB.'
        );
        setEmail('');
        setFullName('');
      } else {
        setErrorMessage(data.error || 'Erreur lors de l’inscription. Veuillez réessayer.');
      }
    } catch (err: any) {
      console.error('[VIP Modal Error]', err);
      setErrorMessage('Une erreur est survenue. Veuillez vérifier votre connexion.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div 
        className="bg-white rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border-2 border-[#18757d] relative overflow-hidden space-y-6"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-[#562C2C] p-2 rounded-full hover:bg-slate-100 transition-colors cursor-pointer"
          aria-label="Fermer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header Header */}
        <div className="text-center space-y-2">
          <span className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full text-xs font-black bg-amber-100 text-[#562C2C] border border-amber-300 uppercase tracking-wider">
            <Sparkles className="w-4 h-4 text-amber-600" />
            Accès Liste VIP Explicative
          </span>

          <h2 className="text-2xl sm:text-3xl font-black text-[#332420] leading-tight">
            Rejoins la Liste VIP
          </h2>

          <p className="text-xs sm:text-sm text-[#5e4d46] font-medium leading-relaxed max-w-sm mx-auto">
            Reçois les infos et les offres privilégiées en avant-première pour le lancement de la <strong>{courseTitle}</strong>.
          </p>
        </div>

        {/* Success Banner */}
        {successMessage ? (
          <div className="bg-emerald-50 border-2 border-emerald-500 rounded-2xl p-5 text-center space-y-3">
            <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
            <p className="text-sm font-extrabold text-emerald-950">
              {successMessage}
            </p>
            <p className="text-xs text-emerald-700 font-medium">
              Surveille ta boîte mail, tu recevras un message dès l'ouverture des accès VIP !
            </p>
            <button
              onClick={onClose}
              className="mt-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-extrabold text-xs rounded-full uppercase tracking-wider cursor-pointer"
            >
              Fermer la fenêtre
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Honeypot anti-spam field */}
            <input
              type="text"
              name="website"
              value={honeypot}
              onChange={(e) => setHoneypot(e.target.value)}
              className="hidden"
              tabIndex={-1}
              autoComplete="off"
            />

            <div>
              <label className="block text-xs font-extrabold text-[#332420] uppercase tracking-wider mb-1.5">
                Ton Prénom (optionnel)
              </label>
              <input
                type="text"
                placeholder="Ex: Camille"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full px-4 py-3 rounded-2xl border border-slate-300 focus:border-[#18757d] focus:ring-2 focus:ring-[#18757d]/20 text-sm outline-none transition-all"
              />
            </div>

            <div>
              <label className="block text-xs font-extrabold text-[#332420] uppercase tracking-wider mb-1.5">
                Ton Adresse Email <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <Mail className="w-5 h-5 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="camille@exemple.fr"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 rounded-2xl border border-slate-300 focus:border-[#18757d] focus:ring-2 focus:ring-[#18757d]/20 text-sm outline-none transition-all"
                />
              </div>
            </div>

            {errorMessage && (
              <p className="text-xs font-bold text-red-600 bg-red-50 p-3 rounded-xl border border-red-200">
                {errorMessage}
              </p>
            )}

            <button
              type="submit"
              disabled={isSubmitting}
              className="w-full py-4 bg-[#18757d] hover:bg-[#12595f] text-white font-extrabold text-sm rounded-2xl shadow-lg uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer border border-white/20"
            >
              {isSubmitting ? (
                <span>Inscription en cours...</span>
              ) : (
                <>
                  <Send className="w-4 h-4 text-amber-300" />
                  <span>👉 M'INSCRIRE À LA LISTE VIP</span>
                </>
              )}
            </button>

            <p className="text-[11px] text-slate-500 text-center font-medium flex items-center justify-center gap-1.5 pt-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              Vos données sont 100% sécurisées • Désinscription en 1 clic
            </p>
          </form>
        )}
      </div>
    </div>
  );
}
