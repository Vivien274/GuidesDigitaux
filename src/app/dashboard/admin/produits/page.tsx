'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { Product } from '@/data/defaultProducts';
import { getStoredProducts, deleteProduct } from '@/lib/productsStore';
import { 
  ShoppingBag, 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  Search, 
  ArrowLeft, 
  Tag, 
  DollarSign, 
  ExternalLink,
  Sparkles
} from 'lucide-react';

export default function AdminProductsPage() {
  const { user, role } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string>('all');

  useEffect(() => {
    setProducts(getStoredProducts());
  }, []);

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Voulez-vous vraiment supprimer la fiche produit "${title}" ?`)) {
      const updated = deleteProduct(id);
      setProducts(updated);
    }
  };

  const filteredProducts = products.filter(p => {
    const matchesSearch = p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          p.slug.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCat = categoryFilter === 'all' || p.category === categoryFilter;
    return matchesSearch && matchesCat;
  });

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
              <span className="inline-block px-3 py-0.5 rounded-full text-[11px] font-extrabold bg-rose-100 text-[#e05a47] uppercase tracking-wider mb-1">
                Catalogue WooCommerce / Boutique
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#332420]">
                Gestion des <span className="text-[#e05a47]">Fiches Produits</span>
              </h1>
              <p className="text-xs text-[#5e4d46] font-medium">
                Créez, modifiez les tarifs, visuels, descriptions et badges de vos offres.
              </p>
            </div>
          </div>

          <Link
            href="/dashboard/admin/produits/editeur"
            className="px-5 py-3 bg-[#e05a47] hover:bg-[#c94a38] text-white text-xs font-extrabold rounded-2xl shadow-md transition-all flex items-center gap-2 uppercase tracking-wider self-start md:self-auto cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Créer un nouveau produit
          </Link>
        </div>
      </section>

      {/* MAIN CONTENT TABLE */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* SEARCH & FILTERS */}
          <div className="bg-white p-4 sm:p-6 rounded-3xl border border-[#eee7da] shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Rechercher un produit..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#faf8f5] border border-[#eee7da] rounded-xl text-xs text-[#332420] focus:outline-none focus:border-[#18757d]"
              />
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <span className="text-xs text-slate-500 font-extrabold uppercase">Catégorie :</span>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="px-3 py-2 bg-[#faf8f5] border border-[#eee7da] rounded-xl text-xs font-bold text-[#332420] focus:outline-none"
              >
                <option value="all">Toutes les offres</option>
                <option value="formation">Formations Vidéo</option>
                <option value="ebook">E-Books & Guides</option>
                <option value="checklist">Checklists & Outils</option>
              </select>
            </div>
          </div>

          {/* PRODUCTS TABLE */}
          <div className="bg-white rounded-3xl border border-[#eee7da] shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#faf8f5] border-b border-[#eee7da] text-[#5e4d46] font-extrabold uppercase tracking-wider">
                  <tr>
                    <th className="p-4 sm:p-5">Visuel & Produit</th>
                    <th className="p-4 sm:p-5">Catégorie / Badge</th>
                    <th className="p-4 sm:p-5">Prix</th>
                    <th className="p-4 sm:p-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#eee7da]">
                  {filteredProducts.map((product) => (
                    <tr key={product.id} className="hover:bg-[#faf8f5]/60 transition-colors">
                      <td className="p-4 sm:p-5">
                        <div className="flex items-center gap-3.5">
                          <img
                            src={product.image}
                            alt={product.title}
                            className="w-12 h-12 rounded-xl object-cover border border-[#eee7da] shrink-0"
                          />
                          <div>
                            <h3 className="font-extrabold text-[#332420] text-xs sm:text-sm">{product.title}</h3>
                            <span className="text-[11px] text-slate-500 font-mono">/produit/{product.slug}</span>
                          </div>
                        </div>
                      </td>

                      <td className="p-4 sm:p-5">
                        <div className="space-y-1">
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black bg-[#e6f4f3] text-[#18757d] uppercase tracking-wider">
                            {product.categoryLabel || product.category}
                          </span>
                          {product.badge && (
                            <span className="block text-[10px] font-black text-rose-500 uppercase tracking-wider">
                              🏷️ {product.badge}
                            </span>
                          )}
                          {product.downloadPdf ? (
                            <a 
                              href={product.downloadPdf} 
                              target="_blank" 
                              rel="noopener noreferrer" 
                              className="inline-flex items-center gap-1 text-[10px] font-extrabold text-emerald-700 bg-emerald-50 border border-emerald-200 px-2 py-0.5 rounded-full hover:underline"
                            >
                              <span>📄 PDF Associé ✓</span>
                            </a>
                          ) : (product.category === 'ebook' || product.category === 'checklist') ? (
                            <span className="inline-block text-[10px] font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded-full border border-amber-200">
                              ⚠️ Pas de PDF téléversé
                            </span>
                          ) : null}
                        </div>
                      </td>

                      <td className="p-4 sm:p-5 font-black text-[#18757d] text-sm sm:text-base">
                        {product.price} €
                        {product.originalPrice && (
                          <span className="text-xs text-slate-400 line-through font-normal ml-2">
                            {product.originalPrice} €
                          </span>
                        )}
                      </td>

                      <td className="p-4 sm:p-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/produit/${product.slug}`}
                            target="_blank"
                            className="p-2 bg-slate-50 border border-[#eee7da] text-slate-600 hover:text-[#18757d] rounded-xl transition-colors"
                            title="Voir la fiche publique"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>

                          <Link
                            href={`/dashboard/admin/produits/editeur?id=${product.id}`}
                            className="p-2 bg-[#e6f4f3] text-[#18757d] hover:bg-[#18757d] hover:text-white rounded-xl transition-colors font-bold text-xs flex items-center gap-1"
                            title="Éditer la fiche produit"
                          >
                            <Edit3 className="w-4 h-4" />
                            <span>Éditer</span>
                          </Link>

                          <button
                            onClick={() => handleDelete(product.id, product.title)}
                            className="p-2 bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white rounded-xl transition-colors cursor-pointer"
                            title="Supprimer la fiche"
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
