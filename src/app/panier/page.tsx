'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';
import { 
  ShoppingBag, 
  Trash2, 
  Plus, 
  Minus, 
  Lock, 
  ArrowLeft, 
  CheckCircle2, 
  ShieldCheck, 
  Download, 
  Sparkles,
  ArrowRight
} from 'lucide-react';

export default function PanierPage() {
  const { cart, removeFromCart, updateQuantity, totalPrice, totalItems, clearCart } = useCart();
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  const discount = promoApplied ? totalPrice * 0.1 : 0;
  const finalPrice = totalPrice - discount;

  const handleApplyPromo = (e: React.FormEvent) => {
    e.preventDefault();
    if (promoCode.trim().toLowerCase() === 'bienvenue10' || promoCode.trim().toLowerCase() === 'artisan') {
      setPromoApplied(true);
    } else {
      alert('Code promo non valide. Essayez BIENVENUE10 !');
    }
  };

  const handleCheckout = async () => {
    setIsProcessing(true);
    try {
      // Save purchased items to localStorage under gd_enrolled_courses
      if (typeof window !== 'undefined') {
        const existing = JSON.parse(localStorage.getItem('gd_enrolled_courses') || '[]');
        const newEnrollments = cart.map(item => ({
          id: item.id,
          title: item.title,
          slug: item.id === 'c1' || item.title.includes('WordPress') ? 'creer-sa-vitrine-wordpress' : 'formation-woocommerce',
          image: item.image,
          date: new Date().toLocaleDateString('fr-FR'),
          progress: 0
        }));

        const merged = [...existing, ...newEnrollments];
        localStorage.setItem('gd_enrolled_courses', JSON.stringify(merged));
      }

      clearCart();
      window.location.href = '/dashboard/eleve?purchased=true';
    } catch (err) {
      alert(`Paiement initié pour ${finalPrice.toFixed(2)} €`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#332420] font-sans">
      <Header />

      {/* BREADCRUMB */}
      <div className="bg-[#faf8f5] pt-6 pb-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 text-xs font-semibold text-[#5e4d46]">
          <Link href="/boutique" className="inline-flex items-center gap-1.5 text-[#18757d] font-bold hover:underline">
            <ArrowLeft className="w-4 h-4" />
            Continuer mes achats
          </Link>
          <span>/</span>
          <span className="text-[#332420] font-bold">Mon Panier</span>
        </div>
      </div>

      <section className="py-8 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex items-center justify-between mb-8">
            <div>
              <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-[#f4ede0] text-[#332420] mb-2">
                Commande sécurisée
              </span>
              <h1 className="text-3xl sm:text-4xl font-extrabold text-[#332420]">
                Ton Panier <span className="text-[#18757d]">({totalItems})</span>
              </h1>
            </div>

            {cart.length > 0 && (
              <button
                onClick={clearCart}
                className="text-xs font-extrabold text-slate-500 hover:text-[#e05a47] transition-colors flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                Vider le panier
              </button>
            )}
          </div>

          {cart.length === 0 ? (
            /* EMPTY CART STATE */
            <div className="bg-white rounded-3xl p-12 text-center border border-[#eee7da] shadow-sm max-w-2xl mx-auto my-8 space-y-6">
              <div className="w-20 h-20 rounded-full bg-[#e6f4f3] text-[#18757d] flex items-center justify-center mx-auto">
                <ShoppingBag className="w-10 h-10" />
              </div>

              <h2 className="text-2xl font-extrabold text-[#332420]">Ton panier est actuellement vide</h2>
              
              <p className="text-sm text-[#5e4d46] max-w-md mx-auto leading-relaxed">
                Tu n'as pas encore ajouté de ressources. Parcours notre boutique et choisis parmi nos e-books, checklists et formations vidéo.
              </p>

              <div className="pt-2">
                <Link
                  href="/boutique"
                  className="inline-flex items-center gap-2 px-8 py-4 text-xs font-extrabold text-white bg-[#18757d] hover:bg-[#12595f] rounded-2xl shadow-md uppercase tracking-wider transition-colors"
                >
                  DÉCOUVRIR LES PRODUITS
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          ) : (
            /* CART CONTENT GRID */
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
              
              {/* Left Column: Items Table */}
              <div className="lg:col-span-8 space-y-4">
                {cart.map((item) => (
                  <div key={item.id} className="bg-white p-6 rounded-3xl border border-[#eee7da] shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-6">
                    <div className="flex items-center gap-4 w-full sm:w-auto">
                      <div className="relative w-20 h-20 rounded-2xl overflow-hidden shrink-0 border border-[#eee7da] bg-[#faf8f5]">
                        <Image src={item.image} alt={item.title} fill className="object-cover" />
                      </div>

                      <div>
                        <span className="text-[10px] font-extrabold text-[#18757d] uppercase tracking-wider block">
                          {item.categoryLabel}
                        </span>
                        <h3 className="text-base font-extrabold text-[#332420] leading-snug">
                          {item.title}
                        </h3>
                        <span className="text-sm font-extrabold text-[#18757d] block mt-1">
                          {item.price.toFixed(2).replace('.', ',')} € / unité
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto border-t sm:border-t-0 pt-4 sm:pt-0 border-[#eee7da]">
                      {/* Quantity selector */}
                      <div className="flex items-center gap-3 bg-[#faf8f5] px-3 py-1.5 rounded-xl border border-[#eee7da]">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="w-7 h-7 rounded-lg bg-white border border-[#eee7da] text-[#332420] flex items-center justify-center hover:bg-[#18757d] hover:text-white transition-colors"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="text-sm font-extrabold text-[#332420] px-1">{item.quantity}</span>
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="w-7 h-7 rounded-lg bg-white border border-[#eee7da] text-[#332420] flex items-center justify-center hover:bg-[#18757d] hover:text-white transition-colors"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      {/* Line total */}
                      <span className="text-base font-extrabold text-[#332420] min-w-[70px] text-right">
                        {(item.price * item.quantity).toFixed(2).replace('.', ',')} €
                      </span>

                      {/* Remove button */}
                      <button
                        onClick={() => removeFromCart(item.id)}
                        className="w-9 h-9 rounded-xl text-slate-400 hover:text-[#e05a47] hover:bg-rose-50 flex items-center justify-center transition-colors"
                      >
                        <Trash2 className="w-4.5 h-4.5" />
                      </button>
                    </div>

                  </div>
                ))}

                {/* Guarantee Banner */}
                <div className="bg-white rounded-3xl p-6 border border-[#eee7da] grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                  <div className="flex items-center gap-3">
                    <Download className="w-6 h-6 text-[#18757d] shrink-0" />
                    <div className="text-left">
                      <h4 className="text-xs font-extrabold text-[#332420]">Téléchargement Direct</h4>
                      <p className="text-[11px] text-slate-500">Reçois ton lien par mail</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Lock className="w-6 h-6 text-[#18757d] shrink-0" />
                    <div className="text-left">
                      <h4 className="text-xs font-extrabold text-[#332420]">Paiement Sécurisé</h4>
                      <p className="text-[11px] text-slate-500">Cryptage Stripe SSL 256-bit</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <ShieldCheck className="w-6 h-6 text-[#18757d] shrink-0" />
                    <div className="text-left">
                      <h4 className="text-xs font-extrabold text-[#332420]">Mises à jour à vie</h4>
                      <p className="text-[11px] text-slate-500">Accès garanti 24h/24</p>
                    </div>
                  </div>
                </div>

              </div>

              {/* Right Column: Summary Card */}
              <div className="lg:col-span-4 space-y-6">
                <div className="bg-white p-8 rounded-3xl border border-[#eee7da] shadow-sm space-y-6">
                  <h3 className="text-lg font-extrabold text-[#332420] border-b border-[#eee7da] pb-4">
                    Récapitulatif de la commande
                  </h3>

                  <div className="space-y-3 text-xs">
                    <div className="flex items-center justify-between text-[#5e4d46]">
                      <span>Sous-total HT :</span>
                      <span className="font-bold">{(totalPrice / 1.2).toFixed(2).replace('.', ',')} €</span>
                    </div>

                    <div className="flex items-center justify-between text-[#5e4d46]">
                      <span>TVA (20%) :</span>
                      <span className="font-bold">{(totalPrice - (totalPrice / 1.2)).toFixed(2).replace('.', ',')} €</span>
                    </div>

                    <div className="flex items-center justify-between text-[#5e4d46]">
                      <span>Frais de livraison :</span>
                      <span className="font-extrabold text-emerald-600">Offerts (Produits digitaux)</span>
                    </div>

                    {promoApplied && (
                      <div className="flex items-center justify-between text-[#e05a47] font-bold">
                        <span>Réduction Code Promo (10%) :</span>
                        <span>- {discount.toFixed(2).replace('.', ',')} €</span>
                      </div>
                    )}

                    <div className="pt-4 border-t border-[#eee7da] flex items-center justify-between text-lg font-extrabold text-[#332420]">
                      <span>Total TTC :</span>
                      <span className="text-2xl text-[#18757d]">{finalPrice.toFixed(2).replace('.', ',')} €</span>
                    </div>
                  </div>

                  {/* Promo Code Form */}
                  <form onSubmit={handleApplyPromo} className="space-y-2 pt-2">
                    <div className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder="Code promo (ex: BIENVENUE10)"
                        value={promoCode}
                        onChange={(e) => setPromoCode(e.target.value)}
                        className="w-full bg-[#faf8f5] border border-[#eee7da] rounded-xl px-4 py-2.5 text-xs text-[#332420] focus:outline-none focus:border-[#18757d]"
                      />
                      <button
                        type="submit"
                        className="px-4 py-2.5 text-xs font-extrabold text-[#18757d] bg-[#e6f4f3] hover:bg-[#d4edea] rounded-xl transition-colors shrink-0"
                      >
                        Appliquer
                      </button>
                    </div>
                    {promoApplied && (
                      <p className="text-[11px] font-bold text-emerald-600">✓ Code promo BIENVENUE10 appliqué (-10%) !</p>
                    )}
                  </form>

                  {/* Checkout Button */}
                  <button
                    onClick={handleCheckout}
                    disabled={isProcessing}
                    className="w-full py-4 text-xs font-extrabold text-white bg-[#18757d] hover:bg-[#12595f] rounded-2xl shadow-md uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
                  >
                    <Lock className="w-4 h-4" />
                    PASSER LA COMMANDE ({finalPrice.toFixed(2).replace('.', ',')} €)
                  </button>

                  <div className="p-4 bg-[#f4ede0] rounded-2xl text-xs text-[#332420] font-semibold flex items-center gap-2.5">
                    <Sparkles className="w-5 h-5 text-[#e05a47] shrink-0" />
                    <span>Accès immédiat garanti après votre paiement sécurisé.</span>
                  </div>

                </div>
              </div>

            </div>
          )}

        </div>
      </section>

      <Footer />
    </div>
  );
}
