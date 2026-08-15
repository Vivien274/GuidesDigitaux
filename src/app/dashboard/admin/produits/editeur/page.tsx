'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import WysiwygEditor from '@/components/WysiwygEditor';
import { Product } from '@/data/defaultProducts';
import { getStoredProducts, saveProduct } from '@/lib/productsStore';
import { 
  ArrowLeft, 
  Save, 
  Tag, 
  DollarSign, 
  Image as ImageIcon, 
  FileText, 
  Plus, 
  Trash2, 
  Sparkles,
  Check
} from 'lucide-react';

import { getStoredCategories, saveCategory, ProductCategoryItem } from '@/lib/categoriesStore';

function ProductEditorContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const productId = searchParams.get('id');

  const [id, setId] = useState('');
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [category, setCategory] = useState<'ebook' | 'checklist' | 'formation' | 'coaching'>('formation');
  const [categoryLabel, setCategoryLabel] = useState('Formation Vidéo');
  const [badge, setBadge] = useState('FORMATION EN LIGNE');
  const [price, setPrice] = useState('199');
  const [originalPrice, setOriginalPrice] = useState('');
  const [bookingUrl, setBookingUrl] = useState('');
  const [image, setImage] = useState('/images/products/formation-wordpress.webp');
  const [gallery, setGallery] = useState<string[]>([]);
  const [newGalleryUrl, setNewGalleryUrl] = useState('');
  const [description, setDescription] = useState('');
  const [longDescription, setLongDescription] = useState('');
  const [features, setFeatures] = useState<string[]>(['Accès immédiat par e-mail']);
  const [newFeatureText, setNewFeatureText] = useState('');
  const [categoriesList, setCategoriesList] = useState<ProductCategoryItem[]>([]);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setCategoriesList(getStoredCategories());
    if (productId) {
      const all = getStoredProducts();
      const found = all.find(p => p.id === productId || p.slug === productId);
      if (found) {
        setId(found.id);
        setTitle(found.title);
        setSlug(found.slug);
        setCategory(found.category);
        setCategoryLabel(found.categoryLabel || 'Formation Vidéo');
        setBadge(found.badge || '');
        setPrice(String(found.price));
        setOriginalPrice(found.originalPrice ? String(found.originalPrice) : '');
        setBookingUrl(found.bookingUrl || '');
        setImage(found.image || '');
        setGallery(found.gallery || [found.image]);
        setDescription(found.description || '');
        setLongDescription(found.longDescription || found.description || '');
        setFeatures(found.features && found.features.length > 0 ? found.features : ['Accès immédiat par e-mail']);
      }
    } else {
      setId(`prod-${Date.now()}`);
    }
  }, [productId]);

  const handleTitleChange = (val: string) => {
    setTitle(val);
    if (!productId) {
      const generatedSlug = val
        .toLowerCase()
        .normalize("NFD").replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]+/g, '-')
        .replace(/(^-|-$)+/g, '');
      setSlug(generatedSlug);
    }
  };

  const handleAddFeature = () => {
    if (newFeatureText.trim()) {
      setFeatures([...features, newFeatureText.trim()]);
      setNewFeatureText('');
    }
  };

  const handleRemoveFeature = (index: number) => {
    setFeatures(features.filter((_, i) => i !== index));
  };

  const handleAddGalleryImage = () => {
    if (newGalleryUrl.trim()) {
      setGallery([...gallery, newGalleryUrl.trim()]);
      setNewGalleryUrl('');
    }
  };

  const handleRemoveGalleryImage = (index: number) => {
    setGallery(gallery.filter((_, i) => i !== index));
  };

  const handleCreateCategory = () => {
    if (newCategoryName.trim()) {
      const slugCat = newCategoryName.toLowerCase().replace(/[^a-z0-9]+/g, '-');
      const newCat: ProductCategoryItem = {
        id: `cat-${Date.now()}`,
        name: newCategoryName.trim(),
        slug: slugCat
      };
      const updated = saveCategory(newCat);
      setCategoriesList(updated);
      setCategory(slugCat as any);
      setCategoryLabel(newCategoryName.trim());
      setNewCategoryName('');
    }
  };

  const handleSave = () => {
    if (!title.trim()) {
      alert('Veuillez saisir un titre pour la fiche produit.');
      return;
    }

    const updatedProduct: Product = {
      id: id || `prod-${Date.now()}`,
      title,
      slug: slug || 'nouveau-produit',
      category,
      categoryLabel: categoryLabel || 'Formation Vidéo',
      badge,
      price: parseFloat(price) || 0,
      originalPrice: originalPrice ? parseFloat(originalPrice) : undefined,
      rating: 5,
      reviewsCount: 0,
      image,
      imageAlt: title,
      gallery: gallery.length > 0 ? gallery : [image],
      description,
      longDescription,
      features,
      bookingUrl: bookingUrl.trim() || undefined
    };

    saveProduct(updatedProduct);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
    router.push('/dashboard/admin/produits');
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#332420] font-sans">
      <Header />

      {/* BANNER HEADER */}
      <section className="py-10 bg-gradient-to-b from-[#fdf2f0] to-[#faf8f5] border-b border-[#e8ded0]">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <Link
              href="/dashboard/admin/produits"
              className="w-10 h-10 rounded-2xl bg-white border border-[#e8ded0] text-[#332420] hover:text-[#18757d] flex items-center justify-center shadow-2xs transition-colors"
            >
              <ArrowLeft className="w-5 h-5" />
            </Link>
            <div>
              <span className="inline-block px-3 py-0.5 rounded-full text-[11px] font-extrabold bg-rose-100 text-[#e05a47] uppercase tracking-wider mb-1">
                Éditeur de Fiche Produit
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#332420]">
                {productId ? 'Modifier le Produit' : 'Créer une Fiche Produit'}
              </h1>
            </div>
          </div>

          <button
            onClick={handleSave}
            className="px-6 py-3 bg-[#18757d] hover:bg-[#12595f] text-white text-xs font-extrabold rounded-2xl shadow-md transition-all flex items-center gap-2 uppercase tracking-wider cursor-pointer"
          >
            <Save className="w-4 h-4" />
            {isSaved ? 'Enregistré ! ✓' : 'Enregistrer'}
          </button>
        </div>
      </section>

      {/* EDITOR FORM */}
      <section className="py-12 md:py-16">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          {/* GENERAL INFO BOX */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#eee7da] shadow-sm space-y-6">
            <h2 className="text-base font-extrabold text-[#332420] border-b border-[#eee7da] pb-3">
              Informations Générales
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-extrabold text-[#5e4d46] uppercase">Titre de l'Offre / Produit :</label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => handleTitleChange(e.target.value)}
                  placeholder="ex: Formation : créer sa vitrine en ligne avec WordPress"
                  className="w-full p-3.5 bg-[#faf8f5] border border-[#eee7da] rounded-2xl text-sm text-[#332420] focus:outline-none focus:border-[#18757d] font-bold"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-extrabold text-[#5e4d46] uppercase">Slug URL (Permalien) :</label>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="ex: formation-wordpress"
                  className="w-full p-3 bg-[#faf8f5] border border-[#eee7da] rounded-xl text-xs text-[#332420] font-mono focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold text-[#5e4d46] uppercase">Catégorie du Produit :</label>
                </div>
                <div className="flex items-center gap-2">
                  <select
                    value={category}
                    onChange={(e) => {
                      setCategory(e.target.value as any);
                      const catObj = categoriesList.find(c => c.slug === e.target.value);
                      if (catObj) setCategoryLabel(catObj.name);
                    }}
                    className="flex-1 p-3 bg-[#faf8f5] border border-[#eee7da] rounded-xl text-xs font-bold text-[#332420] focus:outline-none"
                  >
                    {categoriesList.map(c => (
                      <option key={c.id} value={c.slug}>{c.name}</option>
                    ))}
                  </select>
                </div>

                {/* Add new Category inline */}
                <div className="flex items-center gap-2 pt-1">
                  <input
                    type="text"
                    value={newCategoryName}
                    onChange={(e) => setNewCategoryName(e.target.value)}
                    placeholder="Créer une nouvelle catégorie (ex: E-commerce)..."
                    className="flex-1 p-2 bg-[#faf8f5] border border-[#eee7da] rounded-lg text-[11px] text-[#332420] focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={handleCreateCategory}
                    className="px-3 py-2 bg-[#18757d] hover:bg-[#12595f] text-white text-[11px] font-extrabold rounded-lg transition-colors cursor-pointer"
                  >
                    + Créer
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-extrabold text-[#5e4d46] uppercase">Badge vert (ex: COACHING EN VISIO) :</label>
                <input
                  type="text"
                  value={badge}
                  onChange={(e) => setBadge(e.target.value)}
                  placeholder="ex: COACHING EN VISIO, FORMATION EN LIGNE"
                  className="w-full p-3 bg-[#faf8f5] border border-[#eee7da] rounded-xl text-xs font-bold text-[#332420] focus:outline-none"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-extrabold text-[#5e4d46] uppercase flex items-center gap-1.5">
                  📅 Lien d'Agenda Google / Réservation (Pour les offres de Coaching) :
                </label>
                <input
                  type="text"
                  value={bookingUrl}
                  onChange={(e) => setBookingUrl(e.target.value)}
                  placeholder="https://calendar.app.google/A4SMq4zBbZYnnCr18"
                  className="w-full p-3 bg-[#faf8f5] border border-[#eee7da] rounded-xl text-xs font-mono text-[#332420] focus:outline-none focus:border-[#18757d]"
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <label className="text-xs font-extrabold text-[#5e4d46] uppercase">Visuel Principal (Couverture) :</label>
                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(e.target.value)}
                  placeholder="/images/products/formation-wordpress.webp"
                  className="w-full p-3 bg-[#faf8f5] border border-[#eee7da] rounded-xl text-xs font-mono text-[#332420] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* GALLERY IMAGES MANAGER BOX */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#eee7da] shadow-sm space-y-6">
            <h2 className="text-base font-extrabold text-[#332420] border-b border-[#eee7da] pb-3 flex items-center justify-between">
              <span>🖼️ Galerie Photos de la Fiche Produit ({gallery.length})</span>
            </h2>

            {/* GALLERY THUMBNAILS GRID */}
            <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-4">
              {gallery.map((imgUrl, index) => (
                <div key={index} className="relative group rounded-2xl overflow-hidden border border-[#eee7da] aspect-square bg-slate-100">
                  <img src={imgUrl} alt={`Galerie ${index + 1}`} className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => handleRemoveGalleryImage(index)}
                    className="absolute top-1.5 right-1.5 p-1.5 bg-rose-600 text-white rounded-lg shadow-md opacity-90 hover:opacity-100 transition-opacity cursor-pointer"
                    title="Supprimer la photo"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))}
            </div>

            {/* ADD PHOTO TO GALLERY */}
            <div className="flex items-center gap-2 pt-2">
              <input
                type="text"
                value={newGalleryUrl}
                onChange={(e) => setNewGalleryUrl(e.target.value)}
                placeholder="Coller l'URL d'une photo supplémentaire à ajouter à la galerie..."
                className="flex-1 p-3 bg-[#faf8f5] border border-[#eee7da] rounded-xl text-xs font-mono text-[#332420] focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddGalleryImage}
                className="px-4 py-3 bg-[#18757d] hover:bg-[#12595f] text-white text-xs font-extrabold rounded-xl transition-colors cursor-pointer flex items-center gap-1"
              >
                <Plus className="w-4 h-4" />
                Ajouter la photo
              </button>
            </div>
          </div>

          {/* PRICING BOX */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#eee7da] shadow-sm space-y-6">
            <h2 className="text-base font-extrabold text-[#332420] border-b border-[#eee7da] pb-3 flex items-center gap-2">
              <DollarSign className="w-5 h-5 text-[#18757d]" />
              Tarification & Promotion (€)
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-xs font-extrabold text-[#5e4d46] uppercase">Prix Vente (€) :</label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="97"
                  className="w-full p-3.5 bg-[#faf8f5] border border-[#eee7da] rounded-2xl text-lg font-black text-[#18757d] focus:outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-extrabold text-[#5e4d46] uppercase">Prix Normal Barré (€) [Optionnel] :</label>
                <input
                  type="number"
                  value={originalPrice}
                  onChange={(e) => setOriginalPrice(e.target.value)}
                  placeholder="149"
                  className="w-full p-3.5 bg-[#faf8f5] border border-[#eee7da] rounded-2xl text-lg font-bold text-slate-400 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* DESCRIPTIONS WITH VISUAL WYSIWYG EDITOR */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#eee7da] shadow-sm space-y-6">
            <h2 className="text-base font-extrabold text-[#332420] border-b border-[#eee7da] pb-3">
              Description Courte (Accroche)
            </h2>
            <textarea
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Courte présentation résumée du produit..."
              className="w-full p-4 bg-[#faf8f5] border border-[#eee7da] rounded-2xl text-xs sm:text-sm text-[#332420] focus:outline-none"
            />

            <h2 className="text-base font-extrabold text-[#332420] border-b border-[#eee7da] pb-3 pt-4">
              Description Longue & Programme Détaillé (Éditeur Visuel)
            </h2>
            <WysiwygEditor
              value={longDescription}
              onChange={setLongDescription}
              placeholder="Rédigez ou collez ici la présentation détaillée de votre produit..."
            />
          </div>

          {/* FEATURES / BULLET POINTS BOX */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#eee7da] shadow-sm space-y-6">
            <h2 className="text-base font-extrabold text-[#332420] border-b border-[#eee7da] pb-3">
              Points Forts & Inclus dans l'offre
            </h2>

            <div className="space-y-3">
              {features.map((feat, index) => (
                <div key={index} className="flex items-center justify-between p-3 bg-[#faf8f5] rounded-xl border border-[#eee7da]">
                  <span className="text-xs font-bold text-[#332420]">✓ {feat}</span>
                  <button
                    onClick={() => handleRemoveFeature(index)}
                    className="text-rose-500 hover:text-rose-700 p-1 cursor-pointer"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input
                type="text"
                value={newFeatureText}
                onChange={(e) => setNewFeatureText(e.target.value)}
                placeholder="Ajouter un avantage (ex: 2 sessions de 45min en visio)..."
                className="flex-1 p-3 bg-[#faf8f5] border border-[#eee7da] rounded-xl text-xs text-[#332420] focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddFeature}
                className="px-4 py-3 bg-[#18757d] hover:bg-[#12595f] text-white text-xs font-extrabold rounded-xl transition-colors cursor-pointer"
              >
                Ajouter
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
}

export default function ProductEditorPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-xs text-slate-500">Chargement de l'éditeur...</div>}>
      <ProductEditorContent />
    </Suspense>
  );
}
