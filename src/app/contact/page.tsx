'use client';

import React, { useState } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Link from 'next/link';
import { Mail, Phone, Send, CheckCircle2, Sparkles, Calendar, ArrowRight, HeartHandshake, Share2 } from 'lucide-react';

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
    <div className="min-h-screen bg-[#faf8f5] text-[#332420] font-sans selection:bg-[#18757d] selection:text-white">
      <Header />

      {/* HERO SECTION */}
      <section className="py-12 sm:py-16 md:py-20 bg-gradient-to-b from-[#f4ede0]/60 via-[#faf8f5] to-[#faf8f5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-4">
          <span className="inline-block px-4 py-1.5 rounded-full text-xs font-black bg-[#e6f4f3] text-[#18757d] uppercase tracking-wider shadow-2xs">
            Contacte-moi - guides-digitaux.com
          </span>

          <h1 className="text-3xl sm:text-5xl font-black text-[#332420] tracking-tight">
            Contacte-nous ou <span className="text-[#18757d]">prends RDV</span>
          </h1>

          <p className="text-sm sm:text-base text-[#5e4d46] max-w-2xl mx-auto leading-relaxed">
            Une question sur un e-book, une formation, une commande ou un accompagnement ? Je suis là pour t'aider à faire du digital un vrai allié pour ton activité.
          </p>
        </div>
      </section>

      {/* BLOC 1 : PARLONS DIGITAL + FORMULAIRE DE CONTACT */}
      <section className="py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-start">
            
            {/* Colonne Gauche - Parlons Digital */}
            <div className="lg:col-span-5 space-y-6">
              <div className="bg-white p-8 sm:p-10 rounded-3xl border border-[#e8ded0] shadow-md space-y-6">
                
                <div className="space-y-2">
                  <span className="text-xs font-black text-[#e05a47] uppercase tracking-wider block">
                    Contact direct
                  </span>
                  <h2 className="text-2xl font-black text-[#332420]">
                    Parlons digital (simplement)
                  </h2>
                </div>

                <p className="text-xs sm:text-sm text-[#5e4d46] leading-relaxed">
                  Une question sur un e-book, une formation, une commande ou un accompagnement ? Je suis là pour t'aider à faire du digital un vrai allié pour ton activité. Tu peux me contacter via le formulaire ci-contre, par e-mail ou sur les réseaux sociaux.
                </p>

                <div className="p-4 bg-[#e6f4f3] rounded-2xl border border-[#bce3e0] text-xs font-bold text-[#18757d] flex items-center gap-3">
                  <Sparkles className="w-5 h-5 text-[#18757d] shrink-0" />
                  <span>👉 Réponse garantie sous 48h ouvrées (et souvent bien plus vite !)</span>
                </div>

                <div className="space-y-4 pt-4 border-t border-[#eee7da]">
                  <div className="flex items-center gap-4 p-3 bg-[#faf8f5] rounded-2xl border border-[#eee7da]">
                    <div className="w-12 h-12 rounded-xl bg-[#18757d] text-white flex items-center justify-center shrink-0 shadow-xs">
                      <Phone className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-500 font-bold block uppercase tracking-wider">Téléphone</span>
                      <a href="tel:+33782404062" className="text-sm font-black text-[#332420] hover:text-[#18757d] transition-colors">
                        +33 7 82 40 40 62
                      </a>
                    </div>
                  </div>

                  <div className="flex items-center gap-4 p-3 bg-[#faf8f5] rounded-2xl border border-[#eee7da]">
                    <div className="w-12 h-12 rounded-xl bg-[#18757d] text-white flex items-center justify-center shrink-0 shadow-xs">
                      <Mail className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-500 font-bold block uppercase tracking-wider">Email support</span>
                      <a href="mailto:contact@guides-digitaux.com" className="text-sm font-black text-[#18757d] hover:underline">
                        contact@guides-digitaux.com
                      </a>
                    </div>
                  </div>
                </div>

              </div>
            </div>

            {/* Colonne Droite - Remplis ce formulaire */}
            <div className="lg:col-span-7">
              <div className="bg-white p-8 sm:p-12 rounded-3xl border border-[#e8ded0] shadow-md space-y-6">
                
                <div className="border-b border-[#eee7da] pb-4">
                  <h2 className="text-2xl font-black text-[#332420]">
                    Remplis ce formulaire
                  </h2>
                  <p className="text-xs text-[#5e4d46] mt-1">
                    Écris-nous directement et reçois une réponse personnalisée.
                  </p>
                </div>

                {submitted ? (
                  <div className="p-8 bg-emerald-50 border border-emerald-200 rounded-2xl text-center space-y-3 text-emerald-900">
                    <CheckCircle2 className="w-12 h-12 text-emerald-600 mx-auto" />
                    <h3 className="text-lg font-black">Message bien envoyé !</h3>
                    <p className="text-xs font-medium">Merci pour ton message. Nous l'avons bien reçu et t'apporterons une réponse rapidement.</p>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div className="space-y-1.5">
                        <label className="text-xs font-extrabold text-[#332420]">Nom :</label>
                        <input
                          type="text"
                          required
                          placeholder="Nom / Prénom"
                          value={formData.name}
                          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                          className="w-full bg-[#faf8f5] border border-[#eee7da] rounded-xl px-4 py-3.5 text-xs text-[#332420] focus:outline-none focus:border-[#18757d] focus:ring-1 focus:ring-[#18757d]"
                        />
                      </div>

                      <div className="space-y-1.5">
                        <label className="text-xs font-extrabold text-[#332420]">Email* :</label>
                        <input
                          type="email"
                          required
                          placeholder="Adresse email*"
                          value={formData.email}
                          onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                          className="w-full bg-[#faf8f5] border border-[#eee7da] rounded-xl px-4 py-3.5 text-xs text-[#332420] focus:outline-none focus:border-[#18757d] focus:ring-1 focus:ring-[#18757d]"
                        />
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-extrabold text-[#332420]">Sujet du message* :</label>
                      <input
                        type="text"
                        required
                        placeholder="Sujet de ta demande*"
                        value={formData.subject}
                        onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                        className="w-full bg-[#faf8f5] border border-[#eee7da] rounded-xl px-4 py-3.5 text-xs text-[#332420] focus:outline-none focus:border-[#18757d] focus:ring-1 focus:ring-[#18757d]"
                      />
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-xs font-extrabold text-[#332420]">Votre Message* :</label>
                      <textarea
                        rows={5}
                        required
                        placeholder="Exprime ta demande ou ta question..."
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="w-full bg-[#faf8f5] border border-[#eee7da] rounded-xl p-4 text-xs text-[#332420] focus:outline-none focus:border-[#18757d] focus:ring-1 focus:ring-[#18757d]"
                      ></textarea>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-4 text-xs font-black text-white bg-[#18757d] hover:bg-[#12595f] rounded-2xl shadow-md uppercase tracking-wider transition-all transform active:scale-[0.99] flex items-center justify-center gap-2"
                    >
                      <Send className="w-4 h-4" />
                      Envoyer
                    </button>
                  </form>
                )}

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* BLOC 2 : CONTACT DIRECT & RÉSEAUX SOCIAUX */}
      <section className="py-16 md:py-20 bg-white border-t border-b border-[#eee7da]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          
          <div className="space-y-3">
            <span className="inline-block px-4 py-1.5 rounded-full text-xs font-extrabold bg-[#f4ede0] text-[#332420] uppercase tracking-wider">
              Tu préfères le contact direct ?
            </span>
            <h2 className="text-2xl sm:text-4xl font-black text-[#332420]">
              D'autres moyens de nous contacter sont possibles
            </h2>
            <p className="text-sm font-semibold text-[#18757d]">
              Hé oui, c'est ça aussi le digital !
            </p>
          </div>

          <div className="space-y-4 pt-4">
            <h3 className="text-lg font-black text-[#332420]">Via les réseaux sociaux</h3>
            
            <div className="flex flex-wrap items-center justify-center gap-4">
              <a
                href="https://www.facebook.com/stratec-digital"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-6 py-3.5 bg-[#1877f2] text-white font-extrabold text-xs rounded-2xl shadow-sm hover:opacity-90 transition-opacity"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/></svg>
                <span>Facebook</span>
              </a>

              <a
                href="https://www.youtube.com/@stratecdigital-stephanie"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-6 py-3.5 bg-[#ff0000] text-white font-extrabold text-xs rounded-2xl shadow-sm hover:opacity-90 transition-opacity"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/></svg>
                <span>Youtube</span>
              </a>

              <a
                href="https://www.instagram.com/stratec_digital"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 px-6 py-3.5 bg-gradient-to-r from-[#833ab4] via-[#fd1d1d] to-[#fcb045] text-white font-extrabold text-xs rounded-2xl shadow-sm hover:opacity-90 transition-opacity"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24"><path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/></svg>
                <span>Instagram</span>
              </a>
            </div>
          </div>

        </div>
      </section>

      {/* BLOC 3 : PRENDRE UN RENDEZ-VOUS GRATUIT (BANNIÈRE CTA) */}
      <section className="py-16 md:py-24 bg-[#faf8f5]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-[#127475] via-[#18757d] to-[#0f4d52] p-8 sm:p-14 text-white shadow-xl text-center space-y-6">
            
            {/* Effet décoratif d'arrière-plan */}
            <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none"></div>
            <div className="absolute bottom-0 left-0 -mb-8 -ml-8 w-64 h-64 rounded-full bg-white/10 blur-2xl pointer-events-none"></div>

            <div className="relative z-10 space-y-4">
              <span className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-black bg-white/20 backdrop-blur-md uppercase tracking-wider">
                <Calendar className="w-4 h-4 text-emerald-300" />
                Prendre un Rendez-vous gratuit
              </span>

              <h2 className="text-3xl sm:text-5xl font-black tracking-tight">
                Prends un RDV gratuit
              </h2>

              <p className="text-sm sm:text-base text-emerald-100 max-w-xl mx-auto leading-relaxed">
                Clique ci-dessous pour réserver un échange offert de 30 min sur ton projet digital avec Stéphanie.
              </p>

              <div className="pt-4">
                <Link
                  href="/tunnel/precommande-fiche-google"
                  className="inline-flex items-center gap-3 px-8 py-4 bg-[#e05a47] hover:bg-[#c94937] text-white font-black text-xs sm:text-sm uppercase tracking-wider rounded-2xl shadow-lg transition-all transform hover:scale-105"
                >
                  <span>Réserve ton créneau</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
            </div>

          </div>

        </div>
      </section>

      {/* BLOC 4 : VALEURS HUMAINES ET ENGAGEMENTS GUIDES DIGITAUX */}
      <section className="py-16 md:py-24 bg-white border-t border-[#eee7da]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-center">
          
          <div className="w-16 h-16 rounded-3xl bg-[#e6f4f3] text-[#18757d] flex items-center justify-center mx-auto shadow-xs">
            <HeartHandshake className="w-8 h-8" />
          </div>

          <h3 className="text-2xl sm:text-3xl font-black text-[#332420] leading-snug">
            Chez <strong className="text-[#18757d]">Guides Digitaux</strong>, on aime les échanges simples, humains et constructifs.
          </h3>

          <p className="text-sm sm:text-base font-bold text-[#5e4d46]">
            Que tu sois totalement débutant(e) ou déjà lancé(e) dans ta digitalisation, toutes les questions sont les bienvenues.
          </p>

          <div className="p-8 bg-[#faf8f5] rounded-3xl border border-[#e8ded0] text-xs sm:text-sm text-[#5e4d46] leading-relaxed text-left space-y-4">
            <p>
              Guides Digitaux accompagne les <strong>artisans</strong>, <strong>créateurs</strong> et <strong>indépendants</strong> dans leur <strong>transformation digitale</strong>.
            </p>
            <p>
              Contacte-nous pour toute question sur nos <strong>e-books</strong>, <strong>checklists</strong>, <strong>formations en ligne</strong> ou nos <strong>conseils en communication digitale</strong>.
            </p>
            <p>
              Nous t'aidons à développer ta <strong>visibilité sur Internet</strong> et à maîtriser les <strong>outils numériques</strong> essentiels à ton activité.
            </p>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
}
