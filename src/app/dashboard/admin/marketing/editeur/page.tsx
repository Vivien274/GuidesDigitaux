'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Coupon, getStoredCoupons, saveCoupon } from '@/lib/couponsStore';
import { 
  ArrowLeft, 
  Save, 
  Tag, 
  Percent, 
  DollarSign, 
  Calendar, 
  CheckCircle2, 
  XCircle,
  Hash
} from 'lucide-react';

function CouponEditorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const couponId = searchParams.get('id');

  const [id, setId] = useState('');
  const [code, setCode] = useState('');
  const [discountType, setDiscountType] = useState<'percentage' | 'fixed'>('percentage');
  const [discountValue, setDiscountValue] = useState('20');
  const [minOrderAmount, setMinOrderAmount] = useState('0');
  const [expiryDate, setExpiryDate] = useState('');
  const [usageLimit, setUsageLimit] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    if (couponId) {
      const all = getStoredCoupons();
      const found = all.find(c => c.id === couponId);
      if (found) {
        setId(found.id);
        setCode(found.code);
        setDiscountType(found.discountType);
        setDiscountValue(String(found.discountValue));
        setMinOrderAmount(found.minOrderAmount ? String(found.minOrderAmount) : '0');
        setExpiryDate(found.expiryDate || '');
        setUsageLimit(found.usageLimit ? String(found.usageLimit) : '');
        setIsActive(found.isActive);
      }
    } else {
      setId(`coup-${Date.now()}`);
    }
  }, [couponId]);

  const handleSave = () => {
    if (!code.trim()) {
      alert('Veuillez entrer un nom de code promo (ex: LANCEMENT20).');
      return;
    }

    const updatedCoupon: Coupon = {
      id: id || `coup-${Date.now()}`,
      code: code.trim().toUpperCase(),
      discountType,
      discountValue: parseFloat(discountValue) || 0,
      minOrderAmount: minOrderAmount ? parseFloat(minOrderAmount) : 0,
      expiryDate: expiryDate || undefined,
      usageLimit: usageLimit ? parseInt(usageLimit) : undefined,
      usageCount: 0,
      isActive
    };

    saveCoupon(updatedCoupon);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
    router.push('/dashboard/admin/marketing');
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#332420] font-sans">
      <Header />

      {/* BANNER HEADER */}
      <section className="py-10 bg-gradient-to-b from-[#fdf2f0] to-[#faf8f5] border-b border-[#e8ded0]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/admin/marketing"
              className="w-10 h-10 rounded-2xl bg-white border border-[#e8ded0] text-[#332420] hover:text-amber-600 flex items-center justify-center shadow-2xs transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <span className="inline-block px-3 py-0.5 rounded-full text-[11px] font-extrabold bg-amber-100 text-amber-800 uppercase tracking-wider mb-1">
                Création de Code Promo
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#332420]">
                {couponId ? 'Modifier le Code Promo' : 'Nouveau Code Promo'}
              </h1>
            </div>
          </div>

          <button
            onClick={handleSave}
            className="px-6 py-3 bg-amber-600 hover:bg-amber-700 text-white text-xs font-extrabold rounded-2xl shadow-md transition-all flex items-center gap-2 uppercase tracking-wider cursor-pointer"
          >
            <Save className="w-4 h-4" />
            {isSaved ? 'Enregistré ! ✓' : 'Enregistrer'}
          </button>
        </div>
      </section>

      {/* EDITOR FORM */}
      <section className="py-12 md:py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#eee7da] shadow-sm space-y-6">
            <h2 className="text-base font-extrabold text-[#332420] border-b border-[#eee7da] pb-3">
              Configuration du Code Promo
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-extrabold text-[#5e4d46] uppercase">Code Promo (en majuscules sans espaces) :</label>
                <input
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value.toUpperCase().replace(/\s+/g, ''))}
                  placeholder="ex: BIENVENUE20"
                  className="w-full p-3.5 bg-[#faf8f5] border border-[#eee7da] rounded-2xl text-lg font-mono font-black text-amber-700 focus:outline-none focus:border-amber-600 uppercase"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-extrabold text-[#5e4d46] uppercase">Type de Réduction :</label>
                <select
                  value={discountType}
                  onChange={(e) => setDiscountType(e.target.value as any)}
                  className="w-full p-3 bg-[#faf8f5] border border-[#eee7da] rounded-xl text-xs font-bold text-[#332420] focus:outline-none"
                >
                  <option value="percentage">Pourcentage (-%)</option>
                  <option value="fixed">Montant Fixe (-€)</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-extrabold text-[#5e4d46] uppercase">
                  Valeur de la Réduction ({discountType === 'percentage' ? '%' : '€'}) :
                </label>
                <input
                  type="number"
                  value={discountValue}
                  onChange={(e) => setDiscountValue(e.target.value)}
                  placeholder="20"
                  className="w-full p-3 bg-[#faf8f5] border border-[#eee7da] rounded-xl text-base font-extrabold text-[#332420] focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-extrabold text-[#5e4d46] uppercase">Montant Minimum de Panier (€) :</label>
                <input
                  type="number"
                  value={minOrderAmount}
                  onChange={(e) => setMinOrderAmount(e.target.value)}
                  placeholder="0"
                  className="w-full p-3 bg-[#faf8f5] border border-[#eee7da] rounded-xl text-xs font-bold text-[#332420] focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-extrabold text-[#5e4d46] uppercase">Limite Max d'Utilisations :</label>
                <input
                  type="number"
                  value={usageLimit}
                  onChange={(e) => setUsageLimit(e.target.value)}
                  placeholder="Illimité"
                  className="w-full p-3 bg-[#faf8f5] border border-[#eee7da] rounded-xl text-xs font-bold text-[#332420] focus:outline-none"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-extrabold text-[#5e4d46] uppercase">Date d'expiration (Optionnel) :</label>
                <input
                  type="date"
                  value={expiryDate}
                  onChange={(e) => setExpiryDate(e.target.value)}
                  className="w-full p-3 bg-[#faf8f5] border border-[#eee7da] rounded-xl text-xs font-bold text-[#332420] focus:outline-none"
                />
              </div>

              <div className="space-y-2 md:col-span-2 pt-2">
                <label className="flex items-center gap-3 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isActive}
                    onChange={(e) => setIsActive(e.target.checked)}
                    className="w-5 h-5 text-amber-600 rounded accent-amber-600 cursor-pointer"
                  />
                  <span className="text-xs font-extrabold text-[#332420]">
                    Activer ce code promo immédiatement
                  </span>
                </label>
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default function CouponEditorPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-500">Chargement de l'éditeur...</div>}>
      <CouponEditorContent />
    </Suspense>
  );
}
