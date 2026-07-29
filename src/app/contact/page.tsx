'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Mail, MessageSquare, Phone, Send, CheckCircle2, Sparkles } from 'lucide-react';

export default function ContactPage() {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', subject: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => {
      setSubmitted(false);
      setFormData({ name: '', email: '', subject: '', message: '' });
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#332420] font-sans">
      <Header />

      {/* HERO SECTION */}
      <section className="py-16 md:py-24 bg-gradient-to-b from-[#eef4fb] to-[#faf8f5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="inline-block px-3.5 py-1 rounded-full text-xs font-extrabold bg-[#e6f4f3] text-[#18757d] uppercase tracking-wider">
            Équipe à ton écoute
          </span>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#332420] tracking-tight">
            Une question ? <span className="text-[#18757d]">Contacte-nous</span>
          </h1>

          <p className="text-sm sm:text-base text-[#5e4d46] max-w-2xl mx-auto leading-relaxed">
            Une question sur un e-book, besoin d'aide pour choisir ta formation ou une demande spécifique ? Écris-nous, nous te répondons sous 24h ouvrées.
          </p>
        </div>
      </section>

      {/* MAIN CONTENT GRID */}
      <section className="py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
            
            {/* Left Info Cards */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white p-8 rounded-3xl border border-[#eee7da] shadow-sm space-y-6">
                <h3 className="text-xl font-extrabold text-[#332420]">
                  Guides Digitaux par Stratec Digital
                </h3>
                <p className="text-xs text-[#5e4d46] leading-relaxed">
                  Conçu avec passion par Stéphanie ROCQ pour accompagner les artisans, créateurs et indépendants vers une autonomie digitale sereine.
                </p>

                <div className="space-y-4 pt-4 border-t border-[#eee7da]">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#e6f4f3] text-[#18757d] flex items-center justify-center shrink-0">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-500 font-bold block">Email support</span>
                      <a href="mailto:contact@guides-digitaux.com" className="text-sm font-extrabold text-[#18757d] hover:underline">
                        contact@guides-digitaux.com
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-2xl bg-[#f4ede0] text-[#332420] flex items-center justify-center shrink-0">
                      <MessageSquare className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-500 font-bold block">Délai de réponse</span>
                      <span className="text-xs font-bold text-[#332420]">Du lundi au vendredi (sous 24h)</span>
                    </div>
                  </div>
                </div>

                <div className="p-4 bg-[#f4ede0] rounded-2xl text-xs text-[#332420] font-semibold flex items-center gap-2.5">
                  <Sparkles className="w-5 h-5 text-[#e05a47] shrink-0" />
                  <span>Tu peux aussi consulter nos fiches produits pour retrouver toutes les réponses aux questions fréquentes.</span>
                </div>
              </div>
            </div>

            {/* Right Contact Form */}
            <div className="lg:col-span-7">
              <div className="bg-white p-8 sm:p-12 rounded-3xl border border-[#eee7da] shadow-sm space-y-6">
                <h2 className="text-2xl font-extrabold text-[#332420]">
                  Envoie-nous un message
                </h2>

                {submitted ? (
                  <div className="p-6 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-2 text-emerald-800">
                    <CheckCircle2 className="w-10 h-10 text-emerald-600 mx-auto" />
                    <h3 className="text-base font-extrabold">Message bien envoyé !</h3>
                    <p className="text-xs font-medium">Merci, nous avons bien reçu ton message et nous te répondrons très vite.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-extrabold text-[#332420]">Ton Prénom / Nom :</label>
                        <input
                          type="text"
                          required
                          placeholder="Stéphanie Rocq"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full bg-[#faf8f5] border border-[#eee7da] rounded-xl px-4 py-3 text-xs text-[#332420] focus:outline-none focus:border-[#18757d]"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-extrabold text-[#332420]">Ton Adresse Email :</label>
                        <input
                          type="email"
                          required
                          placeholder="stephanie@exemple.fr"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full bg-[#faf8f5] border border-[#eee7da] rounded-xl px-4 py-3 text-xs text-[#332420] focus:outline-none focus:border-[#18757d]"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-extrabold text-[#332420]">Sujet de ta demande :</label>
                      <input
                        type="text"
                        required
                        placeholder="Ex: Renseignement sur la formation WooCommerce"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full bg-[#faf8f5] border border-[#eee7da] rounded-xl px-4 py-3 text-xs text-[#332420] focus:outline-none focus:border-[#18757d]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-extrabold text-[#332420]">Ton Message :</label>
                      <textarea
                        rows={5}
                        required
                        placeholder="Pose ta question en toute liberté..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full bg-[#faf8f5] border border-[#eee7da] rounded-xl p-4 text-xs text-[#332420] focus:outline-none focus:border-[#18757d]"
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-4 text-xs font-extrabold text-white bg-[#18757d] hover:bg-[#12595f] rounded-2xl shadow-md uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      ENVOYER MON MESSAGE
                    </button>
                  </form>
                )}

              </div>
            </div>

          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}
