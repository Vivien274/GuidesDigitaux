'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { 
  Users, 
  Eye, 
  ShoppingCart, 
  ArrowLeft, 
  Smartphone, 
  Monitor, 
  Tablet,
  TrendingUp,
  Clock,
  ExternalLink,
  RefreshCw,
  Sparkles,
  BarChart2, 
  Compass, 
  Percent
} from 'lucide-react';

interface StatsData {
  summary: {
    totalVisitors: number;
    totalPageViews: number;
    pagesPerSession: string;
    abandonedCartsCount: number;
    abandonedTotalValue: number;
    conversionRate: string;
  };
  topPages: Array<{
    path: string;
    title: string;
    views: number;
    percentage: number;
  }>;
  trafficSources: Array<{
    category: string;
    count: number;
    percentage: number;
  }>;
  deviceCounts: {
    desktop: number;
    mobile: number;
    tablet: number;
  };
  abandonedCarts: Array<{
    sessionId: string;
    lastSeen: string;
    pagePath: string;
    deviceType: string;
    items: Array<{ id: string; title: string; price: number }>;
    total: number;
    itemCount: number;
  }>;
}

export default function AdminStatsPage() {
  const { user, role } = useAuth();
  const router = useRouter();

  const [period, setPeriod] = useState<string>('7d');
  const [loading, setLoading] = useState<boolean>(true);
  const [data, setData] = useState<StatsData | null>(null);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('gd_auth_user');
      const parsedRole = savedUser ? JSON.parse(savedUser).role : role;
      if (!savedUser && !user) {
        router.push('/mon-compte');
        return;
      }
      if (parsedRole !== 'superadmin' && role !== 'superadmin') {
        router.push('/dashboard/eleve');
        return;
      }
    }
  }, [user, role, router]);

  const loadStats = async (selectedPeriod: string = period) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/analytics/stats?period=${selectedPeriod}`);
      const json = await res.json();
      if (json.success) {
        setData(json);
      }
    } catch (e) {
      console.error('Failed to load analytics stats', e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadStats(period);
  }, [period]);

  const totalDevices = data ? (data.deviceCounts.desktop + data.deviceCounts.mobile + data.deviceCounts.tablet) : 0;
  const desktopPct = totalDevices > 0 ? Math.round((data!.deviceCounts.desktop / totalDevices) * 100) : 0;
  const mobilePct = totalDevices > 0 ? Math.round((data!.deviceCounts.mobile / totalDevices) * 100) : 0;
  const tabletPct = totalDevices > 0 ? Math.round((data!.deviceCounts.tablet / totalDevices) * 100) : 0;

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#332420] font-sans">
      <Header />

      {/* BANNER HEADER */}
      <section className="py-10 bg-gradient-to-b from-[#fdf2f0] to-[#faf8f5] border-b border-[#e8ded0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/admin"
              className="w-10 h-10 rounded-2xl bg-white border border-[#e8ded0] text-[#332420] hover:text-[#e05a47] flex items-center justify-center transition-colors shadow-2xs"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <span className="inline-block px-3 py-0.5 rounded-full text-[11px] font-extrabold bg-rose-100 text-[#e05a47] uppercase tracking-wider mb-1">
                Superadmin / Statistiques
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#332420]">
                Statistiques & Audience <span className="text-[#e05a47]">Guides Digitaux</span>
              </h1>
              <p className="text-xs text-[#5e4d46] font-medium">
                Analyse du trafic en temps réel, pages les plus vues, sources et abandons de panier.
              </p>
            </div>
          </div>

          {/* Period Filter Buttons */}
          <div className="flex items-center gap-2 bg-white p-1.5 rounded-2xl border border-[#e8ded0] shadow-2xs">
            {[
              { id: '24h', label: '24h' },
              { id: '7d', label: '7 jours' },
              { id: '30d', label: '30 jours' },
              { id: 'all', label: 'Tout' }
            ].map(item => (
              <button
                key={item.id}
                onClick={() => setPeriod(item.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  period === item.id 
                    ? 'bg-[#18757d] text-white shadow-xs' 
                    : 'text-[#5e4d46] hover:text-[#18757d]'
                }`}
              >
                {item.label}
              </button>
            ))}

            <button
              onClick={() => loadStats(period)}
              className="p-1.5 rounded-xl text-[#5e4d46] hover:text-[#18757d] transition-colors ml-1 cursor-pointer"
              title="Rafraîchir les données"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-[#18757d]' : ''}`} />
            </button>
          </div>
        </div>
      </section>

      {/* MAIN CONTENT */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* KPI CARDS GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {/* Visitors Card */}
            <div className="bg-white p-6 rounded-3xl border border-[#eee7da] shadow-sm flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Visiteurs Uniques</span>
                <div className="w-10 h-10 rounded-2xl bg-teal-50 text-[#18757d] flex items-center justify-center font-bold">
                  <Users className="w-5 h-5" />
                </div>
              </div>
              <div>
                <p className="text-3xl font-black text-[#332420]">
                  {loading ? '...' : (data?.summary.totalVisitors ?? 0)}
                </p>
                <p className="text-xs text-slate-500 mt-1 font-medium flex items-center gap-1">
                  <TrendingUp className="w-3.5 h-3.5 text-emerald-600 inline" />
                  {data?.summary.pagesPerSession ?? 0} pages / session en moyenne
                </p>
              </div>
            </div>

            {/* Pageviews Card */}
            <div className="bg-white p-6 rounded-3xl border border-[#eee7da] shadow-sm flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Pages Vues Totales</span>
                <div className="w-10 h-10 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                  <Eye className="w-5 h-5" />
                </div>
              </div>
              <div>
                <p className="text-3xl font-black text-[#332420]">
                  {loading ? '...' : (data?.summary.totalPageViews ?? 0)}
                </p>
                <p className="text-xs text-slate-500 mt-1 font-medium">
                  Pages vues cumulées sur la période
                </p>
              </div>
            </div>

            {/* Cart Abandonments Card */}
            <div className="bg-white p-6 rounded-3xl border border-[#eee7da] shadow-sm flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Paniers Abandonnés</span>
                <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                  <ShoppingCart className="w-5 h-5" />
                </div>
              </div>
              <div>
                <p className="text-3xl font-black text-rose-600">
                  {loading ? '...' : (data?.summary.abandonedCartsCount ?? 0)}
                </p>
                <p className="text-xs text-rose-500 font-bold mt-1">
                  {loading ? '...' : `${data?.summary.abandonedTotalValue ?? 0} €`} d'opportunités à relancer
                </p>
              </div>
            </div>

            {/* Conversion Rate Card */}
            <div className="bg-white p-6 rounded-3xl border border-[#eee7da] shadow-sm flex flex-col justify-between space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider">Taux de Conversion</span>
                <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold">
                  <Percent className="w-5 h-5" />
                </div>
              </div>
              <div>
                <p className="text-3xl font-black text-emerald-700">
                  {loading ? '...' : `${data?.summary.conversionRate ?? 0} %`}
                </p>
                <p className="text-xs text-slate-500 mt-1 font-medium">
                  Ratio Visiteurs → Achats validés
                </p>
              </div>
            </div>
          </div>

          {/* MAIN CHARTS / ANALYTICS COLUMNS */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            
            {/* TOP PAGES (2 cols) */}
            <div className="lg:col-span-2 bg-white p-6 sm:p-8 rounded-3xl border border-[#eee7da] shadow-sm space-y-6">
              <div className="flex items-center justify-between border-b border-[#f4ede0] pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-xl bg-teal-50 text-[#18757d] flex items-center justify-center font-bold">
                    <BarChart2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-extrabold text-[#332420]">Top 10 des Pages les Plus Consultées</h3>
                    <p className="text-xs text-slate-500">Parcours des utilisateurs et fiches produits vedettes</p>
                  </div>
                </div>
              </div>

              {loading ? (
                <div className="py-12 text-center text-xs text-slate-400 font-bold">Chargement des statistiques...</div>
              ) : (!data?.topPages || data.topPages.length === 0) ? (
                <div className="py-12 text-center text-xs text-slate-400 font-medium">
                  Aucune vue de page enregistrée pour cette période. Navigation en cours de collecte !
                </div>
              ) : (
                <div className="space-y-4">
                  {data.topPages.map((page, idx) => (
                    <div key={idx} className="space-y-1.5">
                      <div className="flex items-center justify-between text-xs font-bold text-[#332420]">
                        <div className="flex items-center gap-2 max-w-[75%] truncate">
                          <span className="w-5 text-slate-400 font-mono text-[11px]">#{idx + 1}</span>
                          <span className="truncate hover:text-[#18757d]" title={page.path}>
                            {page.title !== page.path ? page.title : page.path}
                          </span>
                          <a href={page.path} target="_blank" rel="noreferrer" className="text-slate-400 hover:text-[#18757d]">
                            <ExternalLink className="w-3 h-3" />
                          </a>
                        </div>
                        <span className="text-slate-600 font-mono">{page.views} vues ({page.percentage}%)</span>
                      </div>
                      <div className="w-full bg-[#faf8f5] h-2.5 rounded-full overflow-hidden border border-[#eee7da]">
                        <div 
                          className="bg-gradient-to-r from-[#18757d] to-teal-400 h-full rounded-full transition-all duration-500"
                          style={{ width: `${Math.max(page.percentage, 4)}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* TRAFFIC SOURCES & DEVICES (1 col) */}
            <div className="space-y-8">
              
              {/* Traffic Sources */}
              <div className="bg-white p-6 rounded-3xl border border-[#eee7da] shadow-sm space-y-5">
                <div className="flex items-center gap-3 border-b border-[#f4ede0] pb-4">
                  <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center font-bold">
                    <Compass className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-[#332420]">Sources de Trafic</h3>
                    <p className="text-[11px] text-slate-500">D'où viennent tes visiteurs</p>
                  </div>
                </div>

                {loading ? (
                  <div className="py-6 text-center text-xs text-slate-400 font-bold">Chargement...</div>
                ) : (!data?.trafficSources || data.trafficSources.length === 0) ? (
                  <div className="py-6 text-center text-xs text-slate-400 font-medium">Aucune donnée de provenance.</div>
                ) : (
                  <div className="space-y-3">
                    {data.trafficSources.map((source, idx) => (
                      <div key={idx} className="flex items-center justify-between text-xs">
                        <span className="font-extrabold text-[#332420] flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-[#18757d]"></span>
                          {source.category}
                        </span>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-slate-600 font-bold">{source.count}</span>
                          <span className="px-2 py-0.5 rounded-full text-[10px] font-black bg-slate-100 text-slate-600">
                            {source.percentage}%
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Devices */}
              <div className="bg-white p-6 rounded-3xl border border-[#eee7da] shadow-sm space-y-5">
                <div className="flex items-center gap-3 border-b border-[#f4ede0] pb-4">
                  <div className="w-9 h-9 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center font-bold">
                    <Monitor className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-sm font-extrabold text-[#332420]">Appareils Utilisés</h3>
                    <p className="text-[11px] text-slate-500">Mobile vs Ordinateur</p>
                  </div>
                </div>

                {loading ? (
                  <div className="py-6 text-center text-xs text-slate-400">Chargement...</div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-around text-center py-2">
                      <div className="space-y-1">
                        <Monitor className="w-6 h-6 text-slate-700 mx-auto" />
                        <p className="text-xs font-black text-[#332420]">{desktopPct}%</p>
                        <p className="text-[10px] text-slate-500 uppercase font-bold">Ordinateur</p>
                      </div>

                      <div className="space-y-1">
                        <Smartphone className="w-6 h-6 text-[#e05a47] mx-auto" />
                        <p className="text-xs font-black text-[#332420]">{mobilePct}%</p>
                        <p className="text-[10px] text-slate-500 uppercase font-bold">Mobile</p>
                      </div>

                      <div className="space-y-1">
                        <Tablet className="w-6 h-6 text-[#18757d] mx-auto" />
                        <p className="text-xs font-black text-[#332420]">{tabletPct}%</p>
                        <p className="text-[10px] text-slate-500 uppercase font-bold">Tablette</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

            </div>

          </div>

          {/* ABANDONED CARTS DETAILED SECTION */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#eee7da] shadow-sm space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#f4ede0] pb-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold">
                  <ShoppingCart className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#332420]">Journal des Paniers Abandonnés</h3>
                  <p className="text-xs text-slate-500">Utilisateurs ayant ajouté des produits en panier sans finaliser l'achat</p>
                </div>
              </div>

              {data?.summary.abandonedCartsCount ? (
                <span className="px-3 py-1 bg-rose-100 text-rose-700 text-xs font-black rounded-full uppercase tracking-wider self-start sm:self-auto">
                  {data.summary.abandonedCartsCount} panier(s) non finalisé(s)
                </span>
              ) : null}
            </div>

            {loading ? (
              <div className="py-12 text-center text-xs text-slate-400 font-bold">Chargement des paniers...</div>
            ) : (!data?.abandonedCarts || data.abandonedCarts.length === 0) ? (
              <div className="py-12 text-center space-y-2">
                <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center mx-auto">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h4 className="text-sm font-extrabold text-[#332420]">Aucun abandon de panier récent !</h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Les paniers en cours de commande s'afficheront ici en direct dès qu'un visiteur ajoutera des guides sans conclure le paiement.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse min-w-[650px]">
                  <thead>
                    <tr className="border-b border-[#e8ded0] text-[11px] font-black text-slate-500 uppercase tracking-wider">
                      <th className="pb-3">Session & Heure</th>
                      <th className="pb-3">Produits en Panier</th>
                      <th className="pb-3 text-center">Appareil</th>
                      <th className="pb-3 text-right">Montant Total</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#f4ede0] text-xs">
                    {data.abandonedCarts.map((cart, idx) => (
                      <tr key={idx} className="hover:bg-[#faf8f5] transition-colors">
                        <td className="py-4 space-y-1">
                          <span className="font-mono text-[11px] font-bold text-[#18757d] block">
                            {cart.sessionId.substring(0, 15)}...
                          </span>
                          <span className="text-[11px] text-slate-400 flex items-center gap-1">
                            <Clock className="w-3 h-3 inline" />
                            {new Date(cart.lastSeen).toLocaleString('fr-FR')}
                          </span>
                        </td>
                        <td className="py-4 max-w-xs">
                          <div className="space-y-1">
                            {cart.items.map((item, itemIdx) => (
                              <div key={itemIdx} className="flex items-center justify-between text-xs font-bold text-[#332420]">
                                <span className="truncate max-w-[200px]" title={item.title}>• {item.title}</span>
                                <span className="text-slate-500 font-mono text-[11px] ml-2">{item.price} €</span>
                              </div>
                            ))}
                          </div>
                        </td>
                        <td className="py-4 text-center">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-slate-100 text-slate-700 capitalize inline-flex items-center gap-1">
                            {cart.deviceType === 'mobile' ? <Smartphone className="w-3 h-3 text-[#e05a47]" /> : <Monitor className="w-3 h-3 text-[#18757d]" />}
                            {cart.deviceType}
                          </span>
                        </td>
                        <td className="py-4 text-right">
                          <span className="text-sm font-black text-rose-600 font-mono">
                            {cart.total} €
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
}
