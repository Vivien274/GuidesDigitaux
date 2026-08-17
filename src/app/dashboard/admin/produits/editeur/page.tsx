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
  Check,
  HardDrive,
  Search
} from 'lucide-react';

import { getStoredCategories, saveCategory, ProductCategoryItem } from '@/lib/categoriesStore';
import GoogleDriveModal from '@/components/GoogleDriveModal';
import DragAndDropUploader from '@/components/DragAndDropUploader';
import { convertToGoogleDriveImageUrl, convertToGoogleDrivePdfUrl } from '@/lib/googleDriveHelper';

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
  const [downloadPdf, setDownloadPdf] = useState('');
  const [isUploadingPdf, setIsUploadingPdf] = useState(false);
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

  // Bundle / Pack Combo States
  const [productType, setProductType] = useState<'simple' | 'bundle'>('simple');
  const [bundleProductIds, setBundleProductIds] = useState<string[]>([]);
  const [bundleCustomItems, setBundleCustomItems] = useState<{ title: string; pdfUrl?: string }[]>([]);
  const [newCustomItemTitle, setNewCustomItemTitle] = useState('');
  const [newCustomItemPdfUrl, setNewCustomItemPdfUrl] = useState('');
  const [allAvailableProducts, setAllAvailableProducts] = useState<Product[]>([]);
  const [bundleSearchQuery, setBundleSearchQuery] = useState('');
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Google Drive Modal State
  const [driveModalOpen, setDriveModalOpen] = useState(false);
  const [driveModalTarget, setDriveModalTarget] = useState<'cover' | 'pdf' | 'gallery'>('cover');

  const openDriveModal = (target: 'cover' | 'pdf' | 'gallery') => {
    setDriveModalTarget(target);
    setDriveModalOpen(true);
  };

  const handleDriveUrlSelect = (convertedUrl: string) => {
    if (driveModalTarget === 'cover') {
      setImage(convertedUrl);
    } else if (driveModalTarget === 'pdf') {
      setDownloadPdf(convertedUrl);
    } else if (driveModalTarget === 'gallery') {
      setGallery(prev => [...prev, convertedUrl]);
    }
  };

  useEffect(() => {
    setCategoriesList(getStoredCategories());
    const all = getStoredProducts();
    setAllAvailableProducts(all.filter(p => p.id !== productId && p.slug !== productId));

    if (productId) {
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
        setDownloadPdf(found.downloadPdf || '');
        setImage(found.image || '');
        setGallery(found.gallery || [found.image]);
        setDescription(found.description || '');
        setLongDescription(found.longDescription || found.description || '');
        setFeatures(found.features && found.features.length > 0 ? found.features : ['Accès immédiat par e-mail']);
        setProductType(found.productType || (found.category === 'ebook' && found.categoryLabel?.toLowerCase().includes('pack') ? 'bundle' : 'simple'));
        setBundleProductIds(found.bundleProductIds || []);
        setBundleCustomItems(found.bundleCustomItems || []);
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

  const handleToggleBundleProduct = (prodId: string) => {
    if (bundleProductIds.includes(prodId)) {
      setBundleProductIds(bundleProductIds.filter(id => id !== prodId));
    } else {
      setBundleProductIds([...bundleProductIds, prodId]);
    }
  };

  const handleAddBundleCustomItem = () => {
    if (newCustomItemTitle.trim()) {
      setBundleCustomItems([
        ...bundleCustomItems,
        { title: newCustomItemTitle.trim(), pdfUrl: newCustomItemPdfUrl.trim() || undefined }
      ]);
      setNewCustomItemTitle('');
      setNewCustomItemPdfUrl('');
    }
  };

  const handleRemoveBundleCustomItem = (index: number) => {
    setBundleCustomItems(bundleCustomItems.filter((_, i) => i !== index));
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

  const handlePdfFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.toLowerCase().endsWith('.pdf')) {
      alert('Veuillez sélectionner un fichier au format .pdf');
      return;
    }

    setIsUploadingPdf(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await fetch('/api/admin/upload-pdf', {
        method: 'POST',
        body: formData
      });
      const data = await res.json();

      if (data.url) {
        setDownloadPdf(data.url);
      } else {
        alert(data.error || 'Erreur lors du téléversement du fichier PDF');
      }
    } catch (err: any) {
      console.error(err);
      alert('Erreur serveur lors du téléversement du PDF');
    } finally {
      setIsUploadingPdf(false);
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
      bookingUrl: bookingUrl.trim() || undefined,
      downloadPdf: downloadPdf.trim() || undefined,
      productType,
      bundleProductIds: productType === 'bundle' ? bundleProductIds : undefined,
      bundleCustomItems: productType === 'bundle' && bundleCustomItems.length > 0 ? bundleCustomItems : undefined
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

              {/* PRODUCT TYPE SELECTOR: SIMPLE VS BUNDLE */}
              <div className="space-y-3 md:col-span-2 p-5 bg-[#FAF8F5] border border-[#eee7da] rounded-2xl">
                <label className="text-xs font-extrabold text-[#332420] uppercase block">
                  Format du Produit :
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <label className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${productType === 'simple' ? 'border-[#18757d] bg-white shadow-xs' : 'border-slate-200 bg-slate-50'}`}>
                    <input
                      type="radio"
                      name="productType"
                      value="simple"
                      checked={productType === 'simple'}
                      onChange={() => setProductType('simple')}
                      className="sr-only"
                    />
                    <div className="flex items-center gap-2">
                      <span className="text-[#18757d] font-bold text-base">📄</span>
                      <div>
                        <span className="block text-xs font-extrabold text-[#332420] uppercase">Produit Simple</span>
                        <span className="block text-[11px] text-[#5e4d46]">Un guide PDF, une checklist ou une formation unique</span>
                      </div>
                    </div>
                  </label>

                  <label className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${productType === 'bundle' ? 'border-amber-600 bg-amber-50/50 shadow-xs' : 'border-slate-200 bg-slate-50'}`}>
                    <input
                      type="radio"
                      name="productType"
                      value="bundle"
                      checked={productType === 'bundle'}
                      onChange={() => setProductType('bundle')}
                      className="sr-only"
                    />
                    <div className="flex items-center gap-2">
                      <span className="text-amber-700 font-bold text-base">📦</span>
                      <div>
                        <span className="block text-xs font-extrabold text-amber-900 uppercase">Pack Combo / Bundle</span>
                        <span className="block text-[11px] text-amber-800">Regroupement de plusieurs guides/formations à prix réduit</span>
                      </div>
                    </div>
                  </label>
                </div>
              </div>

              {/* BUNDLE / PACK COMBO CONTENT MANAGER */}
              {productType === 'bundle' && (
                <div className="space-y-5 md:col-span-2 p-6 bg-amber-50/60 border-2 border-amber-300 rounded-3xl">
                  <div className="flex items-center justify-between border-b border-amber-200 pb-3">
                    <h3 className="text-sm font-extrabold text-amber-900 flex items-center gap-2">
                      <span>📦 Composition du Pack Combo ({bundleProductIds.length + bundleCustomItems.length} éléments inclus)</span>
                    </h3>
                    
                    {/* VALUE SUMMARY */}
                    {allAvailableProducts.length > 0 && (
                      <span className="text-xs font-extrabold text-emerald-800 bg-emerald-100 px-3 py-1 rounded-full">
                        Valeur cumulée : {
                          allAvailableProducts
                            .filter(p => bundleProductIds.includes(p.id))
                            .reduce((sum, p) => sum + p.price, 0)
                        } € ➔ Prix Vente Pack : {price || 0} €
                      </span>
                    )}
                  </div>

                  {/* CATALOG PRODUCTS SEARCH & DROPDOWN SELECTOR */}
                  <div className="space-y-4">
                    <label className="text-xs font-extrabold text-amber-950 uppercase block">
                      1. Choisir des produits existants dans le catalogue :
                    </label>

                    {/* SELECT DROPDOWN + AUTOCOMPLETE SEARCH BAR ROW */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      
                      {/* OPTION A: STANDARD DROPDOWN MENU */}
                      <div className="space-y-1">
                        <span className="text-[11px] font-extrabold text-[#5e4d46]">via Menu Déroulant :</span>
                        <select
                          value=""
                          onChange={(e) => {
                            if (e.target.value) {
                              if (!bundleProductIds.includes(e.target.value)) {
                                setBundleProductIds([...bundleProductIds, e.target.value]);
                              }
                            }
                          }}
                          className="w-full p-3 bg-white border-2 border-amber-300 focus:border-[#18757d] rounded-2xl text-xs font-bold text-[#332420] outline-none shadow-2xs"
                        >
                          <option value="">-- Choisir un produit dans la liste... --</option>
                          {allAvailableProducts.map((p) => {
                            const isAlreadySelected = bundleProductIds.includes(p.id);
                            return (
                              <option key={p.id} value={p.id} disabled={isAlreadySelected}>
                                {isAlreadySelected ? '✓ ' : ''}{p.title} ({p.categoryLabel || p.category} - {p.price} €)
                              </option>
                            );
                          })}
                        </select>
                      </div>

                      {/* OPTION B: AUTOCOMPLETE SEARCH INPUT */}
                      <div className="space-y-1 relative">
                        <span className="text-[11px] font-extrabold text-[#5e4d46]">ou par Recherche (tape les 1ères lettres) :</span>
                        <div className="relative">
                          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5 pointer-events-none" />
                          <input
                            type="text"
                            value={bundleSearchQuery}
                            onFocus={() => setIsDropdownOpen(true)}
                            onChange={(e) => {
                              setBundleSearchQuery(e.target.value);
                              setIsDropdownOpen(true);
                            }}
                            placeholder="Tape 'Checklist', 'Mini-guide', 'Formation'..."
                            className="w-full pl-10 pr-4 p-3 bg-white border-2 border-amber-300 focus:border-[#18757d] rounded-2xl text-xs font-medium text-[#332420] outline-none shadow-2xs"
                          />
                        </div>

                        {/* AUTOCOMPLETE SUGGESTIONS POPUP DROPDOWN */}
                        {isDropdownOpen && bundleSearchQuery.trim().length > 0 && (
                          <div className="absolute top-full left-0 right-0 z-30 mt-1 bg-white border-2 border-amber-300 rounded-2xl shadow-xl max-h-56 overflow-y-auto divide-y divide-slate-100">
                            {allAvailableProducts
                              .filter(p => 
                                p.title.toLowerCase().includes(bundleSearchQuery.toLowerCase()) || 
                                (p.categoryLabel && p.categoryLabel.toLowerCase().includes(bundleSearchQuery.toLowerCase()))
                              )
                              .map((p) => {
                                const isAlreadySelected = bundleProductIds.includes(p.id);
                                return (
                                  <button
                                    key={p.id}
                                    type="button"
                                    onClick={() => {
                                      if (!isAlreadySelected) {
                                        setBundleProductIds([...bundleProductIds, p.id]);
                                      }
                                      setBundleSearchQuery('');
                                      setIsDropdownOpen(false);
                                    }}
                                    className={`w-full p-3 text-left flex items-center justify-between transition-colors ${
                                      isAlreadySelected ? 'bg-amber-50 text-slate-400 cursor-not-allowed' : 'hover:bg-[#e6f4f3] cursor-pointer'
                                    }`}
                                  >
                                    <div>
                                      <span className="block text-xs font-extrabold text-[#332420]">{p.title}</span>
                                      <span className="block text-[10px] text-slate-500 font-medium">
                                        {p.categoryLabel || p.category}
                                      </span>
                                    </div>
                                    <span className="text-xs font-black text-[#18757d] shrink-0">
                                      {isAlreadySelected ? '✓ Déjà ajouté' : `+ Ajouter (${p.price} €)`}
                                    </span>
                                  </button>
                                );
                              })}
                            {allAvailableProducts.filter(p => p.title.toLowerCase().includes(bundleSearchQuery.toLowerCase())).length === 0 && (
                              <div className="p-4 text-center text-xs text-slate-400">
                                Aucun produit correspondant à "{bundleSearchQuery}"
                              </div>
                            )}
                          </div>
                        )}
                      </div>

                    </div>

                    {/* SELECTED PRODUCTS CARDS IN BUNDLE */}
                    <div className="pt-2">
                      <span className="text-xs font-extrabold text-amber-900 block mb-2">
                        Produits du catalogue inclus dans ce Pack ({bundleProductIds.length}) :
                      </span>

                      {bundleProductIds.length === 0 ? (
                        <div className="p-4 bg-white/80 border border-dashed border-amber-300 rounded-2xl text-center text-xs text-amber-800 font-medium">
                          💡 Aucun produit du catalogue sélectionné. Choisis un produit dans le menu déroulant ou la recherche ci-dessus pour l'ajouter au pack !
                        </div>
                      ) : (
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {bundleProductIds.map((selectedId) => {
                            const foundProduct = allAvailableProducts.find(p => p.id === selectedId || p.slug === selectedId);
                            if (!foundProduct) return null;
                            return (
                              <div
                                key={selectedId}
                                className="p-3.5 bg-white border-2 border-amber-300 rounded-2xl flex items-center justify-between gap-3 shadow-2xs"
                              >
                                <div className="flex items-center gap-3 min-w-0">
                                  <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-800 flex items-center justify-center text-base shrink-0 font-bold">
                                    📦
                                  </div>
                                  <div className="min-w-0">
                                    <span className="block text-xs font-extrabold text-[#332420] truncate">
                                      {foundProduct.title}
                                    </span>
                                    <span className="block text-[10px] text-slate-500 font-bold">
                                      {foundProduct.categoryLabel || foundProduct.category} • <span className="text-[#18757d]">{foundProduct.price} €</span>
                                    </span>
                                  </div>
                                </div>

                                <button
                                  type="button"
                                  onClick={() => handleToggleBundleProduct(selectedId)}
                                  className="p-1.5 bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white rounded-xl transition-colors cursor-pointer shrink-0"
                                  title="Retirer ce produit du pack"
                                >
                                  <Trash2 className="w-4 h-4" />
                                </button>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* CUSTOM SPECIFIC ITEMS WITH MULTI-FILE DRAG AND DROP */}
                  <div className="space-y-3 pt-2">
                    <label className="text-xs font-extrabold text-amber-900 uppercase block">
                      2. Ou ajouter / glisser-déposer des fichiers PDF supplémentaires pour ce pack :
                    </label>

                    {/* MULTI-PDF DRAG & DROP ZONE */}
                    <DragAndDropUploader
                      type="pdf"
                      accept=".pdf"
                      multiple={true}
                      label="Glisse-dépose plusieurs fichiers PDF ici"
                      sublabel="Tu peux glisser-déposer 2, 5 ou 10 fichiers PDF en même temps depuis ton Mac !"
                      onUploadSuccess={(urls) => {
                        const newItems = urls.map(url => {
                          const filename = url.split('/').pop()?.replace(/^[0-9]+-/, '').replace(/\.pdf$/i, '').replace(/[-_]+/g, ' ') || 'Document PDF';
                          const cleanTitle = filename.charAt(0).toUpperCase() + filename.slice(1);
                          return { title: cleanTitle, pdfUrl: url };
                        });
                        setBundleCustomItems(prev => {
                          const combined = [...prev, ...newItems];
                          const seen = new Set<string>();
                          return combined.filter(item => {
                            if (!item.pdfUrl) return true;
                            const normalized = item.pdfUrl.toLowerCase().trim();
                            if (seen.has(normalized)) return false;
                            seen.add(normalized);
                            return true;
                          });
                        });
                      }}
                    />

                    {bundleCustomItems.map((item, idx) => (
                      <div key={idx} className="flex items-center justify-between p-3.5 bg-white rounded-2xl border border-amber-200 shadow-2xs">
                        <div className="min-w-0 flex-1 pr-2">
                          <span className="text-xs font-extrabold text-amber-950 block">📄 {item.title}</span>
                          {item.pdfUrl && (
                            <a
                              href={item.pdfUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-[11px] font-mono text-[#18757d] hover:underline truncate block pt-0.5"
                            >
                              {item.pdfUrl} ↗
                            </a>
                          )}
                        </div>
                        <button
                          type="button"
                          onClick={() => handleRemoveBundleCustomItem(idx)}
                          className="p-1.5 bg-rose-50 text-rose-600 hover:bg-rose-600 hover:text-white rounded-xl transition-colors cursor-pointer shrink-0"
                          title="Supprimer ce fichier"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    ))}

                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-1">
                      <input
                        type="text"
                        value={newCustomItemTitle}
                        onChange={(e) => setNewCustomItemTitle(e.target.value)}
                        placeholder="Titre de l'élément (ex: Checklist Bonus Exclusif)..."
                        className="flex-1 p-2.5 bg-white border border-amber-300 rounded-xl text-xs text-[#332420] focus:outline-none"
                      />
                      <input
                        type="text"
                        value={newCustomItemPdfUrl}
                        onChange={(e) => setNewCustomItemPdfUrl(convertToGoogleDrivePdfUrl(e.target.value))}
                        placeholder="URL PDF ou Lien Drive (optionnel)..."
                        className="flex-1 p-2.5 bg-white border border-amber-300 rounded-xl text-xs font-mono text-[#332420] focus:outline-none"
                      />
                      <button
                        type="button"
                        onClick={handleAddBundleCustomItem}
                        className="px-4 py-2.5 bg-amber-700 hover:bg-amber-800 text-white text-xs font-extrabold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1 shrink-0"
                      >
                        <Plus className="w-4 h-4" />
                        Ajouter
                      </button>
                    </div>
                  </div>
                </div>
              )}

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

              {/* PDF FILE UPLOAD & URL BLOCK */}
              <div className="space-y-4 md:col-span-2 p-5 bg-[#f4ede0]/50 border-2 border-dashed border-[#18757d]/40 rounded-2xl">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold text-[#18757d] uppercase flex items-center gap-1.5">
                    📄 Fichier PDF & Support Téléchargeable (Ebooks / Checklists) :
                  </label>
                  {downloadPdf && (
                    <a 
                      href={downloadPdf} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="text-xs font-extrabold text-[#F2542D] hover:underline flex items-center gap-1"
                    >
                      <span>Tester le PDF ↗</span>
                    </a>
                  )}
                </div>

                {/* DRAG AND DROP ZONE FOR PDF */}
                <DragAndDropUploader
                  type="pdf"
                  accept=".pdf"
                  label="Glisse-dépose ton fichier PDF ici"
                  sublabel="ou clique pour sélectionner le fichier PDF depuis ton ordinateur"
                  onUploadSuccess={(urls) => {
                    if (urls[0]) setDownloadPdf(urls[0]);
                  }}
                />

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
                  {/* File Upload Button */}
                  <label className="px-4 py-3 bg-[#18757d] hover:bg-[#12595f] text-white text-xs font-extrabold rounded-xl cursor-pointer transition-colors shrink-0 flex items-center justify-center gap-2">
                    <span>{isUploadingPdf ? 'Téléversement...' : '📤 Choisir un PDF'}</span>
                    <input 
                      type="file" 
                      accept=".pdf"
                      onChange={handlePdfFileUpload}
                      disabled={isUploadingPdf}
                      className="hidden"
                    />
                  </label>

                  {/* Google Drive PDF Button */}
                  <button
                    type="button"
                    onClick={() => openDriveModal('pdf')}
                    className="px-4 py-3 bg-amber-600 hover:bg-amber-700 text-white text-xs font-extrabold rounded-xl transition-colors shrink-0 flex items-center justify-center gap-1.5 cursor-pointer shadow-xs"
                  >
                    <HardDrive className="w-4 h-4" />
                    <span>📁 Lien Google Drive</span>
                  </button>

                  <span className="text-xs font-bold text-slate-400 text-center">ou URL :</span>

                  {/* Manual URL Input */}
                  <input
                    type="text"
                    value={downloadPdf}
                    onChange={(e) => setDownloadPdf(convertToGoogleDrivePdfUrl(e.target.value))}
                    placeholder="Saisir URL ou lien Google Drive..."
                    className="flex-1 p-3 bg-white border border-[#eee7da] rounded-xl text-xs font-mono text-[#332420] focus:outline-none focus:border-[#18757d]"
                  />
                </div>
              </div>

              {/* COVER IMAGE BLOCK WITH DRAG & DROP */}
              <div className="space-y-3 md:col-span-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-extrabold text-[#5e4d46] uppercase">Visuel Principal (Couverture) :</label>
                  <button
                    type="button"
                    onClick={() => openDriveModal('cover')}
                    className="text-xs font-extrabold text-amber-700 hover:text-amber-800 flex items-center gap-1 cursor-pointer"
                  >
                    <HardDrive className="w-3.5 h-3.5" />
                    <span>📁 Importer depuis Google Drive</span>
                  </button>
                </div>

                <DragAndDropUploader
                  type="image"
                  accept="image/*"
                  label="Glisse-dépose l'image de couverture ici"
                  sublabel="Glisse une image PNG, WebP ou JPG"
                  onUploadSuccess={(urls) => {
                    if (urls[0]) setImage(urls[0]);
                  }}
                />

                <input
                  type="text"
                  value={image}
                  onChange={(e) => setImage(convertToGoogleDriveImageUrl(e.target.value))}
                  placeholder="/images/products/formation-wordpress.webp ou lien Google Drive..."
                  className="w-full p-3 bg-[#faf8f5] border border-[#eee7da] rounded-xl text-xs font-mono text-[#332420] focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* GALLERY IMAGES MANAGER BOX WITH DRAG & DROP */}
          <div className="bg-white p-6 sm:p-8 rounded-3xl border border-[#eee7da] shadow-sm space-y-6">
            <h2 className="text-base font-extrabold text-[#332420] border-b border-[#eee7da] pb-3 flex items-center justify-between">
              <span>🖼️ Galerie Photos de la Fiche Produit ({gallery.length})</span>
              <button
                type="button"
                onClick={() => openDriveModal('gallery')}
                className="text-xs font-extrabold text-amber-700 hover:text-amber-800 flex items-center gap-1.5 px-3 py-1.5 bg-amber-50 rounded-xl border border-amber-200 cursor-pointer"
              >
                <HardDrive className="w-4 h-4 text-amber-600" />
                <span>+ Google Drive Photo</span>
              </button>
            </h2>

            {/* DRAG AND DROP ZONE FOR GALLERY (MULTIPLE FILES) */}
            <DragAndDropUploader
              type="image"
              accept="image/*"
              multiple={true}
              label="Glisse-dépose tes photos de galerie ici"
              sublabel="Tu peux glisser plusieurs images en même temps !"
              onUploadSuccess={(urls) => {
                setGallery(prev => [...prev, ...urls]);
              }}
            />

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
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 pt-2">
              <input
                type="text"
                value={newGalleryUrl}
                onChange={(e) => setNewGalleryUrl(convertToGoogleDriveImageUrl(e.target.value))}
                placeholder="Coller l'URL d'une photo ou lien Google Drive..."
                className="flex-1 p-3 bg-[#faf8f5] border border-[#eee7da] rounded-xl text-xs font-mono text-[#332420] focus:outline-none"
              />
              <button
                type="button"
                onClick={handleAddGalleryImage}
                className="px-4 py-3 bg-[#18757d] hover:bg-[#12595f] text-white text-xs font-extrabold rounded-xl transition-colors cursor-pointer flex items-center justify-center gap-1"
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

      {/* GOOGLE DRIVE ASSISTANT MODAL */}
      <GoogleDriveModal
        isOpen={driveModalOpen}
        onClose={() => setDriveModalOpen(false)}
        onSelectUrl={handleDriveUrlSelect}
        type={driveModalTarget === 'pdf' ? 'pdf' : 'image'}
        title={
          driveModalTarget === 'pdf' 
            ? "Importer un Fichier PDF depuis Google Drive" 
            : (driveModalTarget === 'cover' ? "Importer la Photo de Couverture depuis Google Drive" : "Ajouter une Photo à la Galerie via Google Drive")
        }
      />

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
