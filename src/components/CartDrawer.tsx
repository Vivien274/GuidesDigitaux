'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { X, Trash2, Plus, Minus, ShoppingBag, ArrowRight, Lock, Sparkles } from 'lucide-react';

export default function CartDrawer() {
  const { cart, removeFromCart, updateQuantity, totalPrice, isCartOpen, setIsCartOpen, totalItems, clearCart } = useCart();
  const [isProcessing, setIsProcessing] = useState(false);

  if (!isCartOpen) return null;

  const handleCheckout = async () => {
    setIsProcessing(true);
    try {
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
      setIsCartOpen(false);
      window.location.href = '/dashboard/eleve?purchased=true';
    } catch (err) {
      alert(`Paiement initié pour ${totalPrice.toFixed(2)} €`);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col border-l border-[#eee7da] animate-in slide-in-from-right duration-300">
          
          {/* Header Drawer */}
          <div className="p-6 bg-[#faf8f5] border-b border-[#eee7da] flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-[#e6f4f3] text-[#18757d] flex items-center justify-center font-bold">
                <ShoppingBag className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-base font-extrabold text-[#332420]">Ton Panier</h2>
                <span className="text-xs text-slate-500 font-medium">
                  {totalItems} article{totalItems > 1 ? 's' : ''}
                </span>
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(false)}
              className="w-9 h-9 rounded-full bg-[#f4ede0] text-[#332420] flex items-center justify-center hover:bg-[#e05a47] hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4 py-12">
                <div className="w-16 h-16 rounded-full bg-[#e6f4f3] text-[#18757d] flex items-center justify-center">
                  <ShoppingBag className="w-8 h-8" />
                </div>
                <h3 className="text-base font-extrabold text-[#332420]">Ton panier est vide</h3>
                <p className="text-xs text-slate-500 max-w-xs leading-relaxed">
                  Découvre nos e-books, checklists et formations pour booster ton activité digitale !
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-6 py-3 text-xs font-extrabold text-white bg-[#18757d] hover:bg-[#12595f] rounded-xl transition-colors uppercase tracking-wider"
                >
                  DECOUVRIR LES GUIDES
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="p-4 bg-[#faf8f5] rounded-2xl border border-[#eee7da] flex gap-4 items-center">
                  <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 border border-[#eee7da]">
                    <Image src={item.image} alt={item.title} fill className="object-cover" />
                  </div>

                  <div className="flex-1 min-w-0">
                    <span className="text-[10px] font-extrabold text-[#18757d] uppercase tracking-wider block">
                      {item.categoryLabel}
                    </span>
                    <h4 className="text-xs font-extrabold text-[#332420] truncate">{item.title}</h4>
                    <span className="text-sm font-extrabold text-[#18757d] block mt-1">
                      {item.price.toFixed(2).replace('.', ',')} €
                    </span>

                    {/* Quantity Selector */}
                    <div className="flex items-center gap-2 mt-2">
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity - 1)}
                        className="w-6 h-6 rounded-lg bg-white border border-[#eee7da] text-[#332420] flex items-center justify-center hover:bg-[#18757d] hover:text-white transition-colors"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="text-xs font-bold text-[#332420] px-1">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item.id, item.quantity + 1)}
                        className="w-6 h-6 rounded-lg bg-white border border-[#eee7da] text-[#332420] flex items-center justify-center hover:bg-[#18757d] hover:text-white transition-colors"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>
                  </div>

                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="w-8 h-8 rounded-xl text-slate-400 hover:text-[#e05a47] hover:bg-rose-50 flex items-center justify-center transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Footer Checkout Summary */}
          {cart.length > 0 && (
            <div className="p-6 bg-[#faf8f5] border-t border-[#eee7da] space-y-4">
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span>Sous-total TTC :</span>
                  <span className="font-extrabold text-[#332420]">{totalPrice.toFixed(2).replace('.', ',')} €</span>
                </div>
                <div className="flex items-center justify-between text-xs text-slate-600">
                  <span>Frais de port :</span>
                  <span className="font-bold text-emerald-600">0,00 € (Téléchargement direct)</span>
                </div>
                <div className="pt-2 border-t border-[#eee7da] flex items-center justify-between text-base font-extrabold text-[#332420]">
                  <span>Total :</span>
                  <span className="text-xl text-[#18757d]">{totalPrice.toFixed(2).replace('.', ',')} €</span>
                </div>
              </div>

              <div className="space-y-2">
                <button
                  onClick={handleCheckout}
                  disabled={isProcessing}
                  className="w-full py-4 text-xs font-extrabold text-white bg-[#18757d] hover:bg-[#12595f] rounded-2xl shadow-md uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  PASSER LA COMMANDE ({totalPrice.toFixed(2).replace('.', ',')} €)
                </button>

                <Link
                  href="/panier"
                  onClick={() => setIsCartOpen(false)}
                  className="w-full py-3 text-xs font-extrabold text-[#18757d] bg-[#e6f4f3] hover:bg-[#d4edea] rounded-2xl text-center block uppercase tracking-wider transition-colors"
                >
                  VOIR LE PANIER DÉTAILLÉ
                </Link>
              </div>

              <p className="text-[11px] text-center text-slate-500 font-medium">
                🔒 Paiement 100% sécurisé via Stripe & Supabase
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
