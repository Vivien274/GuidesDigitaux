'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { Coupon } from '@/lib/couponsStore';
import { getStoredCoupons, deleteCoupon, saveCoupon } from '@/lib/couponsStore';
import { 
  Tag, 
  Plus, 
  Edit3, 
  Trash2, 
  Search, 
  ArrowLeft, 
  Percent, 
  DollarSign, 
  Calendar, 
  CheckCircle2, 
  XCircle,
  Zap,
  TrendingUp
} from 'lucide-react';

export default function AdminMarketingPage() {
  const { user, role } = useAuth();
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setCoupons(getStoredCoupons());
  }, []);

  const handleDelete = (id: string, code: string) => {
    if (confirm(`Voulez-vous vraiment supprimer le code promo "${code}" ?`)) {
      const updated = deleteCoupon(id);
      setCoupons(updated);
    }
  };

  const handleToggleActive = (coupon: Coupon) => {
    const updatedCoupon: Coupon = {
      ...coupon,
      isActive: !coupon.isActive
    };
    const list = saveCoupon(updatedCoupon);
    setCoupons(list);
  };

  const filteredCoupons = coupons.filter(c => 
    c.code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const activeCount = coupons.filter(c => c.isActive).length;
  const totalUses = coupons.reduce((acc, c) => acc + (c.usageCount || 0), 0);

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#332420] font-sans">
      <Header />

      {/* BANNER HEADER */}
      <section className="py-10 bg-gradient-to-b from-[#fdf2f0] to-[#faf8f5] border-b border-[#e8ded0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/admin"
              className="w-10 h-10 rounded-2xl bg-white border border-[#e8ded0] text-[#332420] hover:text-[#18757d] flex items-center justify-center shadow-2xs transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <span className="inline-block px-3 py-0.5 rounded-full text-[11px] font-extrabold bg-amber-100 text-amber-800 uppercase tracking-wider mb-1">
                Marketing & Promotions
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#332420]">
                Gestion des <span className="text-amber-600">Codes Promo</span>
              </h1>
              <p className="text-xs text-[#5e4d46] font-medium">
                Créez des remises en pourcentage ou en euros avec conditions de montant minimum ou date d'expiration.
              </p>
            </div>
          </div>

          <Link
            href="/dashboard/admin/marketing/editeur"
            className="px-5 py-3 bg-amber-600 hover:bg-amber-700 text-white text-xs font-extrabold rounded-2xl shadow-md transition-all flex items-center gap-2 uppercase tracking-wider self-start md:self-auto cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Créer un nouveau code promo
          </Link>
        </div>
      </section>

      {/* STATS OVERVIEW */}
      <section className="py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-[#eee7da] shadow-2xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                <Tag className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-slate-500 font-extrabold uppercase">Codes Actifs</span>
                <p className="text-2xl font-extrabold text-[#332420]">{activeCount} / {coupons.length}</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-[#eee7da] shadow-2xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                <TrendingUp className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-slate-500 font-extrabold uppercase">Utilisations Totales</span>
                <p className="text-2xl font-extrabold text-[#332420]">{totalUses} fois</p>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-[#eee7da] shadow-2xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-teal-50 text-[#18757d] flex items-center justify-center shrink-0">
                <Zap className="w-6 h-6" />
              </div>
              <div>
                <span className="text-xs text-slate-500 font-extrabold uppercase">Fonctionnalité</span>
                <p className="text-sm font-extrabold text-[#332420]">Valide sur le panier</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT TABLE */}
      <section className="pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* SEARCH */}
          <div className="bg-white p-4 sm:p-6 rounded-3xl border border-[#eee7da] shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Rechercher un code promo (ex: BIENVENUE10)..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#faf8f5] border border-[#eee7da] rounded-xl text-xs text-[#332420] focus:outline-none focus:border-amber-600 font-mono"
              />
            </div>
          </div>

          {/* TABLE */}
          <div className="bg-white rounded-3xl border border-[#eee7da] shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#faf8f5] border-b border-[#eee7da] text-[#5e4d46] font-extrabold uppercase tracking-wider">
                  <tr>
                    <th className="p-4 sm:p-5">Code Promo</th>
                    <th className="p-4 sm:p-5">Réduction</th>
                    <th className="p-4 sm:p-5">Conditions</th>
                    <th className="p-4 sm:p-5">Utilisations</th>
                    <th className="p-4 sm:p-5">Statut</th>
                    <th className="p-4 sm:p-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#eee7da]">
                  {filteredCoupons.map((coupon) => (
                    <tr key={coupon.id} className="hover:bg-[#faf8f5]/60 transition-colors">
                      <td className="p-4 sm:p-5 font-mono font-black text-[#332420] text-sm sm:text-base">
                        <span className="px-3 py-1.5 bg-[#faf8f5] border border-[#eee7da] rounded-xl text-amber-700">
                          🎟️ {coupon.code}
                        </span>
                      </td>

                      <td className="p-4 sm:p-5 font-extrabold text-emerald-600 text-sm">
                        {coupon.discountType === 'percentage' ? `-${coupon.discountValue}%` : `-${coupon.discountValue} €`}
                      </td>

                      <td className="p-4 sm:p-5 text-slate-600 space-y-0.5">
                        <p className="font-medium">
                          Min. Panier : {coupon.minOrderAmount ? `${coupon.minOrderAmount} €` : 'Aucun'}
                        </p>
                        {coupon.expiryDate && (
                          <p className="text-[11px] text-rose-500 font-bold">
                            📅 Expire le {coupon.expiryDate}
                          </p>
                        )}
                      </td>

                      <td className="p-4 sm:p-5 font-bold text-[#332420]">
                        {coupon.usageCount} {coupon.usageLimit ? `/ ${coupon.usageLimit}` : 'fois'}
                      </td>

                      <td className="p-4 sm:p-5">
                        <button
                          onClick={() => handleToggleActive(coupon)}
                          className={`px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1 cursor-pointer transition-colors ${
                            coupon.isActive
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-emerald-200'
                              : 'bg-slate-100 text-slate-500 hover:bg-slate-200'
                          }`}
                        >
                          {coupon.isActive ? (
                            <>
                              <CheckCircle2 className="w-3 h-3" /> Actif
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3 h-3" /> Inactif
                            </>
                          )}
                        </button>
                      </td>

                      <td className="p-4 sm:p-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/dashboard/admin/marketing/editeur?id=${coupon.id}`}
                            className="p-2 bg-amber-50 text-amber-700 hover:bg-amber-600 hover:text-white rounded-xl transition-colors font-bold text-xs flex items-center gap-1"
                            title="Éditer le code promo"
                          >
                            <Edit3 className="w-4 h-4" />
                            <span>Éditer</span>
                          </Link>

                          <button
                            onClick={() => handleDelete(coupon.id, coupon.code)}
                            className="p-2 bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white rounded-xl transition-colors cursor-pointer"
                            title="Supprimer le code promo"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
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
