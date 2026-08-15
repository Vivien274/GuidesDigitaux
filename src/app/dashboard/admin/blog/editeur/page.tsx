'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WysiwygEditor from '@/components/WysiwygEditor';
import { BlogArticle } from '@/data/blogArticles';
import { getStoredBlogArticles, saveBlogArticle } from '@/lib/blogStore';
import { 
  ArrowLeft, 
  Save, 
  Tag, 
  User, 
  Clock, 
  Image as ImageIcon, 
  FileText, 
  Sparkles,
  Upload,
  Calendar,
  Eye,
  Bot
} from 'lucide-react';

const PREDEFINED_CATEGORIES = [
  'Vendre en ligne',
  'Je me lance en ligne',
  'WordPress & Web',
  'Réseaux Sociaux',
  'Digitalisation',
  'SEO & Visibilité'
];

function BlogEditorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const articleId = searchParams.get('id');

  const [id, setId] = useState('');
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState('Digitalisation');
  const [readTime, setReadTime] = useState('5 min de lecture');
  const [author, setAuthor] = useState('Stéphanie Rocq');
  const [date, setDate] = useState('13 Août 2026');
  const [image, setImage] = useState('https://www.guides-digitaux.com/wp-content/uploads/2026/03/pexels-karola-g2-6168-1024x683.webp');
  const [excerpt, setExcerpt] = useState('');
  const [contentHtml, setContentHtml] = useState('');
  const [status, setStatus] = useState<'published' | 'draft' | 'scheduled'>('published');
  const [scheduledAt, setScheduledAt] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  // Gemini AI modal state
  const [isGeminiOpen, setIsGeminiOpen] = useState(false);
  const [geminiTopic, setGeminiTopic] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  useEffect(() => {
    if (articleId) {
      const all = getStoredBlogArticles();
      const found = all.find(a => a.id === articleId || a.slug === articleId);
      if (found) {
        setId(found.id);
        setTitle(found.title);
        setSlug(found.slug);
        setCategory(found.category || 'Digitalisation');
        setReadTime(found.readTime || '5 min de lecture');
        setAuthor(found.author || 'Stéphanie Rocq');
        setDate(found.date || '13 Août 2026');
        setImage(found.image || '');
        setExcerpt(found.excerpt || '');
        setContentHtml(found.contentHtml || '');
        setStatus(found.status || 'published');
        setScheduledAt(found.scheduledAt || '');
      }
    } else {
      setId(`art-${Date.now()}`);
    }
  }, [articleId]);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!articleId) {
      const generatedSlug = val
        .toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setSlug(generatedSlug);
    }
  };

  const handleImageFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setImage(event.target.result as string);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleGenerateWithGemini = async () => {
    if (!geminiTopic.trim()) {
      alert('Veuillez entrer une idée ou un sujet pour l\'article.');
      return;
    }

    setIsGenerating(true);
    try {
      const res = await fetch('/api/admin/blog/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          topic: geminiTopic.trim(),
          category
        })
      });

      const data = await res.json();
      if (data.article) {
        setTitle(data.article.title);
        const generatedSlug = data.article.title
          .toLowerCase()
          .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)+/g, '');
        setSlug(generatedSlug);
        setExcerpt(data.article.excerpt);
        setContentHtml(data.article.contentHtml);
        setReadTime(data.article.readTime);
        setIsGeminiOpen(false);
        setGeminiTopic('');
      } else {
        alert(data.error || 'Erreur lors de la génération avec Gemini.');
      }
    } catch (e) {
      console.error('Erreur génération Gemini:', e);
      alert('Une erreur s\'est produite lors de la génération par Gemini AI.');
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = () => {
    if (!title.trim()) {
      alert('Veuillez saisir un titre pour l\'article de blog.');
      return;
    }

    const updatedArticle: BlogArticle = {
      id: id || `art-${Date.now()}`,
      title,
      slug: slug || 'nouvel-article',
      category,
      date: date || '13 Août 2026',
      readTime,
      author,
      image,
      imageAlt: title,
      excerpt,
      contentHtml,
      status,
      scheduledAt: status === 'scheduled' ? scheduledAt : undefined
    };

    saveBlogArticle(updatedArticle);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
    router.push('/dashboard/admin/blog');
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#332420] font-sans">
      <Header />

      {/* BANNER HEADER */}
      <section className="py-10 bg-gradient-to-b from-[#fdf2f0] to-[#faf8f5] border-b border-[#e8ded0]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/admin/blog"
              className="w-10 h-10 rounded-2xl bg-white border border-[#e8ded0] text-[#332420] hover:text-[#18757d] flex items-center justify-center shadow-2xs transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <span className="inline-block px-3 py-0.5 rounded-full text-[11px] font-extrabold bg-teal-100 text-[#18757d] uppercase tracking-wider mb-1">
                Éditeur d'Article de Blog
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#332420]">
                {articleId ? 'Modifier l\'Article' : 'Rédiger un Article'}
              </h1>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setIsGeminiOpen(true)}
              className="px-4 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-extrabold rounded-2xl shadow-md transition-all flex items-center gap-2 uppercase tracking-wider cursor-pointer"
            >
              <Bot className="w-4 h-4" />
              <span>Rédaction Gemini AI</span>
            </button>

            <button
              onClick={handleSave}
              className="px-6 py-3 bg-[#18757d] hover:bg-[#12595f] text-white text-xs font-extrabold rounded-2xl shadow-md transition-all flex items-center gap-2 uppercase tracking-wider cursor-pointer"
            >
              <Save className="w-4 h-4" />
              {isSaved ? 'Enregistré ! ✓' : 'Enregistrer'}
            </button>
          </div>
        </div>
      </section>

      {/* EDITOR FORM */}
      <section className="py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* STATUS & PUBLICATION BOX */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#eee7da] shadow-sm space-y-6">
            <h2 className="text-base font-extrabold text-[#332420] border-b border-[#eee7da] pb-3 flex items-center gap-2">
              <Calendar className="w-5 h-5 text-[#18757d]" />
              Statut de Publication & Programmation
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <label className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${status === 'published' ? 'border-[#18757d] bg-[#e6f4f3]/50' : 'border-[#eee7da] bg-[#faf8f5]'}`}>
                <input
                  type="radio"
                  name="status"
                  value="published"
                  checked={status === 'published'}
                  onChange={() => setStatus('published')}
                  className="sr-only"
                />
                <span className="block text-xs font-black uppercase text-[#18757d]">🟢 Publié Immédiatement</span>
                <span className="block text-[11px] text-slate-500 mt-1">Visible sur le blog public</span>
              </label>

              <label className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${status === 'draft' ? 'border-amber-500 bg-amber-50/50' : 'border-[#eee7da] bg-[#faf8f5]'}`}>
                <input
                  type="radio"
                  name="status"
                  value="draft"
                  checked={status === 'draft'}
                  onChange={() => setStatus('draft')}
                  className="sr-only"
                />
                <span className="block text-xs font-black uppercase text-amber-700">🟠 Brouillon</span>
                <span className="block text-[11px] text-slate-500 mt-1">Masqué du site public</span>
              </label>

              <label className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${status === 'scheduled' ? 'border-purple-600 bg-purple-50/50' : 'border-[#eee7da] bg-[#faf8f5]'}`}>
                <input
                  type="radio"
                  name="status"
                  value="scheduled"
                  checked={status === 'scheduled'}
                  onChange={() => setStatus('scheduled')}
                  className="sr-only"
                />
                <span className="block text-xs font-black uppercase text-purple-700">🟣 Programmé</span>
                <span className="block text-[11px] text-slate-500 mt-1">Publication automatique différée</span>
              </label>
            </div>

            {status === 'scheduled' && (
              <div className="pt-2">
                <label className="text-xs font-extrabold text-[#5e4d46] uppercase block mb-1">Date & Heure de Publication Programmée :</label>
                <input
                  type="datetime-local"
                  value={scheduledAt}
                  onChange={(e) => setScheduledAt(e.target.value)}
                  className="w-full sm:w-80 p-3 bg-[#faf8f5] border border-[#eee7da] rounded-xl text-xs font-bold text-[#332420] focus:outline-none"
                />
              </div>
            )}
          </div>

          {/* METADATA BOX */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#eee7da] shadow-sm space-y-6">
            <h2 className="text-base font-extrabold text-[#332420] border-b border-[#eee7da] pb-3">
              Méta-données de l'Article
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-extrabold text-[#5e4d46] uppercase">Titre de l'Article :</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="ex: Marketplace ou site e-commerce : quelle solution choisir..."
                  className="w-full p-3.5 bg-[#faf8f5] border border-[#eee7da] rounded-2xl text-sm text-[#332420] focus:outline-none focus:border-[#18757d] font-bold"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-extrabold text-[#5e4d46] uppercase">Slug URL (Permalien) :</label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="ex: marketplace-ou-site-e-commerce"
                  className="w-full p-3 bg-[#faf8f5] border border-[#eee7da] rounded-xl text-xs text-[#332420] font-mono focus:outline-none"
                />
              </div>

              {/* PREDEFINED CATEGORIES */}
              <div className="space-y-2">
                <label className="text-xs font-extrabold text-[#5e4d46] uppercase">Catégorie :</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full p-3 bg-[#faf8f5] border border-[#eee7da] rounded-xl text-xs font-bold text-[#332420] focus:outline-none"
                >
                  {PREDEFINED_CATEGORIES.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                  <option value="Autre">Autre...</option>
                </select>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-extrabold text-[#5e4d46] uppercase">Auteur :</label>
                <input
                  type="text"
                  value={author}
                  onChange={(e) => setAuthor(e.target.value)}
                  placeholder="Stéphanie Rocq"
                  className="w-full p-3 bg-[#faf8f5] border border-[#eee7da] rounded-xl text-xs font-bold text-[#332420] focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-extrabold text-[#5e4d46] uppercase">Temps de lecture :</label>
                <input
                  type="text"
                  value={readTime}
                  onChange={(e) => setReadTime(e.target.value)}
                  placeholder="5 min de lecture"
                  className="w-full p-3 bg-[#faf8f5] border border-[#eee7da] rounded-xl text-xs font-bold text-[#332420] focus:outline-none"
                />
              </div>

              {/* COVER IMAGE WITH FILE UPLOAD */}
              <div className="space-y-3 md:col-span-2">
                <label className="text-xs font-extrabold text-[#5e4d46] uppercase">Image de Couverture :</label>
                
                {image && (
                  <div className="w-full h-48 rounded-2xl overflow-hidden border border-[#eee7da] bg-slate-100 mb-3">
                    <img src={image} alt="Aperçu couverture" className="w-full h-full object-cover" />
                  </div>
                )}

                <div className="flex flex-col sm:flex-row items-center gap-3">
                  <label className="px-4 py-3 bg-[#18757d] hover:bg-[#12595f] text-white text-xs font-extrabold rounded-xl transition-colors cursor-pointer flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    <span>Téléverser une Image depuis mon Ordinateur</span>
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageFileUpload}
                      className="sr-only"
                    />
                  </label>

                  <span className="text-xs text-slate-400 font-bold">ou par URL :</span>

                  <input
                    type="text"
                    value={image}
                    onChange={(e) => setImage(e.target.value)}
                    placeholder="https://... ou /images/..."
                    className="flex-1 p-3 bg-[#faf8f5] border border-[#eee7da] rounded-xl text-xs font-mono text-[#332420] focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* EXCERPT & CONTENT BOX */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#eee7da] shadow-sm space-y-6">
            <h2 className="text-base font-extrabold text-[#332420] border-b border-[#eee7da] pb-3">
              Résumé / Extrait (Aperçu dans la liste du blog)
            </h2>
            <textarea
              rows={3}
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              placeholder="Court résumé d'accroche pour la liste d'articles..."
              className="w-full p-4 bg-[#faf8f5] border border-[#eee7da] rounded-2xl text-xs sm:text-sm text-[#332420] focus:outline-none"
            />

            <h2 className="text-base font-extrabold text-[#332420] border-b border-[#eee7da] pb-3 pt-4">
              Contenu de l'Article de Blog (Éditeur Visuel)
            </h2>
            <WysiwygEditor
              value={contentHtml}
              onChange={setContentHtml}
              placeholder="Rédigez ou collez le corps complet de votre article de blog..."
            />
          </div>
        </div>
      </section>

      {/* GEMINI AI GENERATOR MODAL */}
      {isGeminiOpen && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 space-y-6 border border-[#eee7da] shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-purple-100 text-purple-700 flex items-center justify-center">
                <Bot className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-lg font-black text-[#332420]">Assistant Rédaction Gemini AI</h3>
                <p className="text-xs text-slate-500">Rédigez un article structuré en quelques secondes.</p>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-extrabold text-[#5e4d46] uppercase">Idée ou Sujet de l'Article :</label>
              <input
                type="text"
                value={geminiTopic}
                onChange={(e) => setGeminiTopic(e.target.value)}
                placeholder="ex: Comment choisir le bon nom de domaine quand on est artisan ?"
                className="w-full p-4 bg-[#faf8f5] border border-[#eee7da] rounded-2xl text-sm font-bold text-[#332420] focus:outline-none focus:border-purple-600"
              />
            </div>

            <div className="flex items-center justify-end gap-3 pt-2">
              <button
                onClick={() => setIsGeminiOpen(false)}
                className="px-5 py-3 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-extrabold rounded-2xl transition-colors cursor-pointer"
              >
                Annuler
              </button>

              <button
                onClick={handleGenerateWithGemini}
                disabled={isGenerating}
                className="px-6 py-3 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white text-xs font-extrabold rounded-2xl shadow-md transition-all flex items-center gap-2 uppercase tracking-wider cursor-pointer"
              >
                <Sparkles className="w-4 h-4" />
                {isGenerating ? 'Rédaction par Gemini...' : 'Générer l\'Article'}
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}

export default function BlogEditorPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-500">Chargement de l'éditeur...</div>}>
      <BlogEditorContent />
    </Suspense>
  );
}
