'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth } from '@/context/AuthContext';
import { BlogArticle } from '@/data/blogArticles';
import { getStoredBlogArticles, deleteBlogArticle } from '@/lib/blogStore';
import { 
  FileText, 
  Plus, 
  Edit3, 
  Trash2, 
  Eye, 
  Search, 
  ArrowLeft, 
  Calendar, 
  User, 
  ExternalLink,
  BookOpen
} from 'lucide-react';

export default function AdminBlogPage() {
  const { user, role } = useAuth();
  const [articles, setArticles] = useState<BlogArticle[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    setArticles(getStoredBlogArticles());
  }, []);

  const handleDelete = (id: string, title: string) => {
    if (confirm(`Voulez-vous vraiment supprimer l'article de blog "${title}" ?`)) {
      const updated = deleteBlogArticle(id);
      setArticles(updated);
    }
  };

  const filteredArticles = articles.filter(a => {
    return a.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
           a.category.toLowerCase().includes(searchTerm.toLowerCase());
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
              <span className="inline-block px-3 py-0.5 rounded-full text-[11px] font-extrabold bg-teal-100 text-[#18757d] uppercase tracking-wider mb-1">
                Blog WordPress / Rédactionnel
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#332420]">
                Gestion des <span className="text-[#18757d]">Articles de Blog</span>
              </h1>
              <p className="text-xs text-[#5e4d46] font-medium">
                Rédigez, éditez et gérez les articles publiés sur le blog Guides Digitaux.
              </p>
            </div>
          </div>

          <Link
            href="/dashboard/admin/blog/editeur"
            className="px-5 py-3 bg-[#18757d] hover:bg-[#12595f] text-white text-xs font-extrabold rounded-2xl shadow-md transition-all flex items-center gap-2 uppercase tracking-wider self-start md:self-auto cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            Rédiger un nouvel article
          </Link>
        </div>
      </section>

      {/* MAIN CONTENT TABLE */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* SEARCH */}
          <div className="bg-white p-4 sm:p-6 rounded-3xl border border-[#eee7da] shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-4">
            <div className="relative w-full sm:w-96">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Rechercher un article par titre ou catégorie..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-[#faf8f5] border border-[#eee7da] rounded-xl text-xs text-[#332420] focus:outline-none focus:border-[#18757d]"
              />
            </div>

            <span className="text-xs font-extrabold text-[#18757d]">
              {filteredArticles.length} Article(s) répertorié(s)
            </span>
          </div>

          {/* ARTICLES TABLE */}
          <div className="bg-white rounded-3xl border border-[#eee7da] shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-[#faf8f5] border-b border-[#eee7da] text-[#5e4d46] font-extrabold uppercase tracking-wider">
                  <tr>
                    <th className="p-4 sm:p-5">Article & Visuel</th>
                    <th className="p-4 sm:p-5">Catégorie & Auteur</th>
                    <th className="p-4 sm:p-5">Statut</th>
                    <th className="p-4 sm:p-5">Date</th>
                    <th className="p-4 sm:p-5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#eee7da]">
                  {filteredArticles.map((article) => (
                    <tr key={article.id} className="hover:bg-[#faf8f5]/60 transition-colors">
                      <td className="p-4 sm:p-5">
                        <div className="flex items-center gap-3.5">
                          <img
                            src={article.image}
                            alt={article.title}
                            className="w-14 h-10 rounded-xl object-cover border border-[#eee7da] shrink-0"
                          />
                          <div>
                            <h3 className="font-extrabold text-[#332420] text-xs sm:text-sm line-clamp-1">{article.title}</h3>
                            <span className="text-[11px] text-slate-500 font-mono">/blog/{article.slug}</span>
                          </div>
                        </div>
                      </td>

                      <td className="p-4 sm:p-5">
                        <div className="space-y-1">
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black bg-[#e6f4f3] text-[#18757d] uppercase tracking-wider">
                            {article.category}
                          </span>
                          <span className="block text-[11px] text-slate-500 font-medium">
                            ✍️ {article.author} ({article.readTime})
                          </span>
                        </div>
                      </td>

                      <td className="p-4 sm:p-5">
                        {(!article.status || article.status === 'published') && (
                          <span className="px-2.5 py-1 bg-emerald-100 text-emerald-800 text-[10px] font-black rounded-full uppercase tracking-wider">
                            🟢 Publié
                          </span>
                        )}
                        {article.status === 'draft' && (
                          <span className="px-2.5 py-1 bg-amber-100 text-amber-800 text-[10px] font-black rounded-full uppercase tracking-wider">
                            🟠 Brouillon
                          </span>
                        )}
                        {article.status === 'scheduled' && (
                          <span className="px-2.5 py-1 bg-purple-100 text-purple-800 text-[10px] font-black rounded-full uppercase tracking-wider">
                            🟣 Programmé ({article.scheduledAt ? new Date(article.scheduledAt).toLocaleDateString('fr-FR') : ''})
                          </span>
                        )}
                      </td>

                      <td className="p-4 sm:p-5 text-slate-500 font-medium text-xs">
                        📅 {article.date}
                      </td>

                      <td className="p-4 sm:p-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            href={`/blog/${article.slug}`}
                            target="_blank"
                            className="p-2 bg-slate-50 border border-[#eee7da] text-slate-600 hover:text-[#18757d] rounded-xl transition-colors"
                            title="Voir l'article public"
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>

                          <Link
                            href={`/dashboard/admin/blog/editeur?id=${article.id}`}
                            className="p-2 bg-[#e6f4f3] text-[#18757d] hover:bg-[#18757d] hover:text-white rounded-xl transition-colors font-bold text-xs flex items-center gap-1"
                            title="Éditer l'article"
                          >
                            <Edit3 className="w-4 h-4" />
                            <span>Éditer</span>
                          </Link>

                          <button
                            onClick={() => handleDelete(article.id, article.title)}
                            className="p-2 bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white rounded-xl transition-colors cursor-pointer"
                            title="Supprimer l'article"
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
