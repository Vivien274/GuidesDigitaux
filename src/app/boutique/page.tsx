'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';
import { 
  CheckCircle2, 
  Star, 
  FileText, 
  BookOpen, 
  GraduationCap, 
  ShoppingBag, 
  ShoppingCart,
  ArrowRight, 
  HelpCircle, 
  Mail, 
  Sparkles,
  X,
  Lock,
  Clock,
  Layers
} from 'lucide-react';

import productsData from '@/data/products.json';

interface Product {
  id: string;
  title: string;
  category: 'ebook' | 'checklist' | 'formation';
  categoryLabel: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  badge?: string;
  image: string;
  description: string;
  features: string[];
}

import { getStoredPreorders, PreorderCampaign } from '@/lib/preordersStore';
import { fetchCoursesFromDb } from '@/lib/supabaseLms';
import { Rocket, Target, Calendar, Gift } from 'lucide-react';

const INITIAL_PRODUCTS: Product[] = productsData as unknown as Product[];

export default function BoutiquePage() {
  const [selectedCategory, setSelectedCategory] = useState<'all' | 'ebook' | 'checklist' | 'formation'>('all');
  const [activeModalProduct, setActiveModalProduct] = useState<Product | null>(null);
  const [isProcessingCheckout, setIsProcessingCheckout] = useState(false);
  const [preorders, setPreorders] = useState<PreorderCampaign[]>([]);
  const [productsList, setProductsList] = useState<Product[]>(INITIAL_PRODUCTS);
  const { addToCart } = useCart();

  React.useEffect(() => {
    setPreorders(getStoredPreorders());

    async function syncDynamicCourses() {
      const dbCourses = await fetchCoursesFromDb();
      if (dbCourses && dbCourses.length > 0) {
        const now = new Date();
        const publishedDbCourses = dbCourses.filter(c => {
          if (c.status === 'Brouillon') return false;
          if (c.status === 'Planifié') {
            if (!c.scheduledPublishDate) return false;
            return now >= new Date(c.scheduledPublishDate);
          }
          return true;
        });

        const nonFormations = INITIAL_PRODUCTS.filter(p => p.category !== 'formation');
        
        const dynamicFormations: Product[] = publishedDbCourses.map(c => {
          const staticMatch = INITIAL_PRODUCTS.find(p => p.id === c.id || (p.title && c.title.toLowerCase().includes(p.title.toLowerCase().slice(0, 10))));
          return {
            id: c.id,
            title: c.title,
            category: 'formation',
            categoryLabel: 'Formation Vidéo HD',
            price: c.price || 99,
            originalPrice: c.originalPrice,
            rating: 5,
            reviewsCount: 0,
            badge: c.isPreorder ? 'PRÉCOMMANDE' : undefined,
            image: c.image || staticMatch?.image || 'https://www.guides-digitaux.com/wp-content/uploads/2026/02/un-artisan-createur-devant-son-PC-en-train-dajouter-ses-produits-dnas-saboutique-en-ligne.-accoude-a-son-etabli-dans-son-atelier.-lumiere-naturelle.webp',
            description: c.description || 'Formation vidéo complète pas-à-pas avec exercices pratiques.',
            features: [
              'Accès illimité 24/7',
              `${c.modules?.length || 0} Modules vidéo pas-à-pas`,
              'Support et exercices pratiques',
              'Mises à jour gratuites incluses'
            ]
          };
        });

        setProductsList([...nonFormations, ...dynamicFormations]);
      }
    }
    syncDynamicCourses();
  }, []);

  const filteredProducts = productsList.filter(product => {
    if (selectedCategory === 'all') return true;
    return product.category === selectedCategory;
  });

  const handleBuyNow = async (product: Product) => {
    setIsProcessingCheckout(true);
    try {
      const response = await fetch('/api/stripe/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          courseId: product.id,
          courseTitle: product.title,
          price: product.price,
          isPreorder: false
        }),
      });

      const data = await response.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(`Paiement initié pour "${product.title}" (${product.price.toFixed(2)} €)`);
      }
    } catch (err) {
      console.error(err);
      alert(`Paiement initié pour "${product.title}".`);
    } finally {
      setIsProcessingCheckout(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#332420] font-sans">
      <Header />

      {/* HERO HEADER BOUTIQUE */}
      <section className="bg-[#faf8f5] py-12 md:py-16 border-b border-[#eee7da]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center sm:text-left">
          
          <div className="inline-block px-4 py-1.5 rounded-full text-xs font-bold bg-[#f4ede0] text-[#332420] mb-4">
            L'essentiel du digital pour ton métier
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold text-[#332420] tracking-tight leading-tight mb-4">
            Retrouve tous les guides digitaux{' '}
            <span className="text-[#18757d]">essentiels à ta réussite</span>
          </h1>

          <p className="text-sm sm:text-base text-[#5e4d46] max-w-3xl leading-relaxed mb-8">
            Des outils concrets, clairs et immédiatement applicables pour accélérer la digitalisation de ton activité. Choisis ta ressource et commence dès aujourd'hui.
          </p>

          {/* Key Advantage Badges */}
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl">
            <div className="bg-white px-4 py-3 rounded-2xl border border-[#eee7da] flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#18757d] shrink-0" />
              <span className="text-xs font-bold text-[#332420]">Téléchargement direct & immédiat</span>
            </div>

            <div className="bg-white px-4 py-3 rounded-2xl border border-[#eee7da] flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#18757d] shrink-0" />
              <span className="text-xs font-bold text-[#332420]">Mises à jour gratuites incluses</span>
            </div>

            <div className="bg-white px-4 py-3 rounded-2xl border border-[#eee7da] flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#18757d] shrink-0" />
              <span className="text-xs font-bold text-[#332420]">100% sans jargon technique</span>
            </div>

            <div className="bg-white px-4 py-3 rounded-2xl border border-[#eee7da] flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#18757d] shrink-0" />
              <span className="text-xs font-bold text-[#332420]">Conçus pour artisans & créateurs</span>
            </div>
          </div>

        </div>
      </section>

      {/* FILTER TABS */}
      <section className="bg-[#f5f1e8] py-6 border-b border-[#e8ded0] sticky top-20 z-30 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-wrap items-center justify-center sm:justify-start gap-3">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all ${
              selectedCategory === 'all'
                ? 'bg-[#18757d] text-white shadow-sm'
                : 'bg-white text-[#332420] hover:bg-[#e6f4f3] border border-[#e8ded0]'
            }`}
          >
            Tous les contenus ({productsList.length})
          </button>

          <button
            onClick={() => setSelectedCategory('ebook')}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${
              selectedCategory === 'ebook'
                ? 'bg-[#18757d] text-white shadow-sm'
                : 'bg-white text-[#332420] hover:bg-[#e6f4f3] border border-[#e8ded0]'
            }`}
          >
            <BookOpen className="w-3.5 h-3.5" />
            Nos e-books digitaux ({productsList.filter(p => p.category === 'ebook').length})
          </button>

          <button
            onClick={() => setSelectedCategory('checklist')}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${
              selectedCategory === 'checklist'
                ? 'bg-[#18757d] text-white shadow-sm'
                : 'bg-white text-[#332420] hover:bg-[#e6f4f3] border border-[#e8ded0]'
            }`}
          >
            <FileText className="w-3.5 h-3.5" />
            Nos checklists digitales ({productsList.filter(p => p.category === 'checklist').length})
          </button>

          <button
            onClick={() => setSelectedCategory('formation')}
            className={`px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-2 ${
              selectedCategory === 'formation'
                ? 'bg-[#18757d] text-white shadow-sm'
                : 'bg-white text-[#332420] hover:bg-[#e6f4f3] border border-[#e8ded0]'
            }`}
          >
            <GraduationCap className="w-3.5 h-3.5" />
            Nos formations en ligne ({productsList.filter(p => p.category === 'formation').length})
          </button>
        </div>
      </section>

      {/* SECTION 1: LES NOUVEAUTÉS & PRODUCT GRID */}
      <section className="py-16 md:py-24 bg-[#faf8f5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="mb-12">
            <div className="inline-block px-4 py-1.5 rounded-full text-xs font-bold bg-[#f4ede0] text-[#332420] mb-3">
              Nos derniers contenus créés pour toi
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#332420]">
              {selectedCategory === 'all' && 'Les nouveautés'}
              {selectedCategory === 'ebook' && 'Nos e-books digitaux'}
              {selectedCategory === 'checklist' && 'Nos checklists digitales'}
              {selectedCategory === 'formation' && 'Nos formations en ligne'}
            </h2>
          </div>

          {/* Grid of Cards (Products + Preorders) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Preorder Cards */}
            {(selectedCategory === 'all' || selectedCategory === 'formation') && preorders.map((po) => {
              const percent = Math.min(100, Math.round((po.currentEnrollments / po.targetEnrollments) * 100));

              return (
                <div 
                  key={po.id}
                  className="bg-white rounded-3xl overflow-hidden border-2 border-amber-300 shadow-md hover:shadow-xl transition-all duration-300 flex flex-col group relative"
                >
                  {/* Image */}
                  <div className="relative h-60 w-full overflow-hidden bg-amber-50">
                    <Image
                      src={po.image || "https://www.guides-digitaux.com/wp-content/uploads/2026/02/un-artisan-createur-devant-son-PC-en-train-dajouter-ses-produits-dnas-saboutique-en-ligne.-accoude-a-son-etabli-dans-son-atelier.-lumiere-naturelle.webp"}
                      alt={po.courseTitle}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <span className="absolute top-4 left-4 bg-amber-400 text-[#332420] text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm flex items-center gap-1">
                      <Rocket className="w-3.5 h-3.5 text-[#332420]" />
                      PRÉCOMMANDE (Sortie {po.releaseDate})
                    </span>
                    <span className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-xs text-amber-900 text-xs font-extrabold px-3 py-1.5 rounded-full border border-amber-200">
                      Formation en Précommande
                    </span>
                  </div>

                  {/* Body */}
                  <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                    <div className="space-y-3">
                      <div className="flex items-baseline gap-2">
                        <span className="text-2xl font-extrabold text-[#18757d]">
                          {po.price.toFixed(2).replace('.', ',')} €
                        </span>
                        {po.originalPrice && (
                          <span className="text-xs text-slate-400 line-through font-bold">
                            {po.originalPrice.toFixed(2).replace('.', ',')} €
                          </span>
                        )}
                      </div>

                      <Link href={`/tunnel/${po.id}`} className="block">
                        <h3 className="text-base font-extrabold text-[#332420] line-clamp-2 leading-snug hover:text-[#18757d] transition-colors">
                          {po.courseTitle}
                        </h3>
                      </Link>

                      {/* Mini Jauge Objectif */}
                      <div className="p-3 bg-[#faf8f5] rounded-xl border border-[#eee7da] space-y-1.5">
                        <div className="flex items-center justify-between text-[11px] font-extrabold text-slate-700">
                          <span>Jauge d'objectif :</span>
                          <span className="text-[#18757d]">{po.currentEnrollments}/{po.targetEnrollments} ({percent}%)</span>
                        </div>
                        <div className="w-full bg-white rounded-full h-2 border border-[#eee7da] overflow-hidden">
                          <div
                            className="bg-gradient-to-r from-amber-400 to-[#18757d] h-full rounded-full"
                            style={{ width: `${percent}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    <Link
                      href={`/tunnel/${po.id}`}
                      className="w-full py-3.5 text-xs font-extrabold text-[#332420] bg-amber-400 hover:bg-amber-300 rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 uppercase tracking-wider"
                    >
                      <Rocket className="w-4 h-4 text-[#332420]" />
                      PRÉCOMMANDER À {po.price} €
                    </Link>
                  </div>
                </div>
              );
            })}

            {filteredProducts.map((product) => (
              <div 
                key={product.id}
                className="bg-white rounded-3xl overflow-hidden border border-[#eee7da] shadow-sm hover:shadow-xl transition-all duration-300 flex flex-col group"
              >
                {/* Product Image */}
                <div className="relative h-60 w-full overflow-hidden bg-[#f5f1e8]">
                  <Image
                    src={product.image}
                    alt={product.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {product.badge && (
                    <span className="absolute top-4 left-4 bg-[#e05a47] text-white text-[11px] font-extrabold px-3 py-1 rounded-full uppercase tracking-wider shadow-sm">
                      {product.badge}
                    </span>
                  )}
                  <span className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-xs text-[#18757d] text-xs font-extrabold px-3 py-1.5 rounded-full border border-[#eee7da]">
                    {product.categoryLabel}
                  </span>
                </div>

                {/* Card Body */}
                <div className="p-6 flex-1 flex flex-col justify-between space-y-4">
                  <div>
                    {/* Price Tag */}
                    <div className="flex items-baseline gap-2 mb-2">
                      <span className="text-2xl font-extrabold text-[#18757d]">
                        {product.price.toFixed(2).replace('.', ',')} €
                      </span>
                      {product.originalPrice && (
                        <span className="text-xs text-slate-400 line-through">
                          {product.originalPrice.toFixed(2).replace('.', ',')} €
                        </span>
                      )}
                    </div>

                    {/* Title */}
                    <Link href={`/produit/${product.id}`} className="block">
                      <h3 className="text-base font-extrabold text-[#332420] line-clamp-2 leading-snug hover:text-[#18757d] transition-colors">
                        {product.title}
                      </h3>
                    </Link>

                    {/* Rating (Only shown if real reviews exist) */}
                    {product.reviewsCount && product.reviewsCount > 0 ? (
                      <div className="flex items-center gap-1.5 mt-3">
                        <div className="flex items-center text-amber-400">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} className="w-3.5 h-3.5 fill-amber-400" />
                          ))}
                        </div>
                        <span className="text-xs font-bold text-slate-500">
                          ({product.reviewsCount})
                        </span>
                      </div>
                    ) : null}
                  </div>

                  {/* Actions */}
                  <div className="pt-4 border-t border-[#eee7da] flex items-center gap-3">
                    <Link
                      href={`/produit/${product.id}`}
                      className="flex-1 px-4 py-3 text-xs font-extrabold text-[#18757d] bg-[#e6f4f3] hover:bg-[#d4edea] rounded-xl transition-colors text-center"
                    >
                      Détails
                    </Link>
                    
                    <button
                      onClick={() => addToCart(product)}
                      className="px-4 py-3 text-xs font-extrabold text-white bg-[#18757d] hover:bg-[#12595f] rounded-xl shadow-sm transition-colors flex items-center gap-1.5"
                    >
                      <ShoppingCart className="w-3.5 h-3.5" />
                      Ajouter
                    </button>
                  </div>

                </div>

              </div>
            ))}
          </div>

        </div>
      </section>

      {/* SECTION 2: NOS E-BOOKS DIGITAUX (SEPARATE CATEGORY HIGHLIGHT) */}
      <section className="py-16 md:py-24 bg-[#f5f1e8] border-t border-[#e8ded0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mb-12">
            <div className="inline-block px-4 py-1.5 rounded-full text-xs font-bold bg-[#f4ede0] text-[#332420] mb-3">
              Comprendre et structurer ton projet
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#332420] mb-4">
              Nos e-books digitaux
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-semibold text-[#5e4d46]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#18757d]" />
                Explications claires pas à pas et sans jargon technique
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#18757d]" />
                Exemples concrets issus d'activités artisanales
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#18757d]" />
                Format PDF à conserver pour toujours
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#18757d]" />
                Mises à jour incluses à vie
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {productsList.filter(p => p.category === 'ebook').slice(0, 3).map((product) => (
              <div key={product.id} className="bg-white rounded-3xl p-6 border border-[#e8ded0] shadow-sm flex flex-col justify-between">
                <div>
                  <div className="relative h-48 w-full rounded-2xl overflow-hidden mb-4">
                    <Image src={product.image} alt={product.title} fill className="object-cover" />
                  </div>
                  <span className="text-xs font-extrabold text-[#18757d] block mb-1">{product.price.toFixed(2)} €</span>
                  <h3 className="text-sm font-extrabold text-[#332420] mb-2">{product.title}</h3>
                </div>
                <button
                  onClick={() => handleBuyNow(product)}
                  className="w-full mt-4 py-2.5 text-xs font-extrabold text-white bg-[#18757d] hover:bg-[#12595f] rounded-xl transition-colors"
                >
                  COMMANDER L'EBOOK
                </button>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* SECTION 3: NOS CHECKLISTS DIGITALES */}
      <section className="py-16 md:py-24 bg-[#faf8f5] border-t border-[#eee7da]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="max-w-3xl mb-12">
            <div className="inline-block px-4 py-1.5 rounded-full text-xs font-bold bg-[#f4ede0] text-[#332420] mb-3">
              Passer à l'action sans rien oublier
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#332420] mb-4">
              Nos checklists digitales
            </h2>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-semibold text-[#5e4d46]">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#18757d]" />
                Format pratique à cocher et imprimer
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#18757d]" />
                Idéal pour structurer tes tâches
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#18757d]" />
                Gain de temps immédiat pour tes routines
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-[#18757d]" />
                Modèles prêts à l'emploi
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {productsList.filter(p => p.category === 'checklist').slice(0, 3).map((product) => (
              <div key={product.id} className="bg-white rounded-3xl p-6 border border-[#eee7da] shadow-sm flex flex-col justify-between">
                <div>
                  <div className="relative h-48 w-full rounded-2xl overflow-hidden mb-4">
                    <Image src={product.image} alt={product.title} fill className="object-cover" />
                  </div>
                  <span className="text-xs font-extrabold text-[#18757d] block mb-1">{product.price.toFixed(2)} €</span>
                  <h3 className="text-sm font-extrabold text-[#332420] mb-2">{product.title}</h3>
                </div>
                <button
                  onClick={() => handleBuyNow(product)}
                  className="w-full mt-4 py-2.5 text-xs font-extrabold text-white bg-[#18757d] hover:bg-[#12595f] rounded-xl transition-colors"
                >
                  TÉLÉCHARGER LA CHECKLIST
                </button>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* SECTION 4: NOS FORMATIONS EN LIGNE */}
      <section className="py-16 md:py-24 bg-[#f5f1e8] border-t border-[#e8ded0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="mb-12">
            <div className="inline-block px-4 py-1.5 rounded-full text-xs font-bold bg-[#f4ede0] text-[#332420] mb-3">
              Un accompagnement pas à pas
            </div>

            <h2 className="text-3xl sm:text-4xl font-extrabold text-[#332420] mb-3">
              Nos formations en ligne
            </h2>

            <p className="text-sm text-[#5e4d46]">
              Forme-toi à ton rythme grâce à nos formations vidéo complètes avec exercices pratiques.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {productsList.filter(p => p.category === 'formation').map((formation) => (
              <div key={formation.id} className="bg-white rounded-3xl overflow-hidden border border-[#e8ded0] shadow-md flex flex-col justify-between">
                <div>
                  <div className="relative h-64 w-full">
                    <Image src={formation.image} alt={formation.title} fill className="object-cover" />
                    {formation.badge && (
                      <span className="absolute top-4 left-4 bg-[#e05a47] text-white text-xs font-extrabold px-3 py-1 rounded-full uppercase">
                        {formation.badge}
                      </span>
                    )}
                    <span className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-xs text-[#18757d] text-xl font-extrabold px-4 py-1.5 rounded-full">
                      {formation.price.toFixed(2)} €
                    </span>
                  </div>

                  <div className="p-8 space-y-4">
                    <h3 className="text-xl font-extrabold text-[#332420]">{formation.title}</h3>
                    
                    <div className="flex flex-wrap gap-2">
                      <span className="px-3 py-1 bg-[#e6f4f3] text-[#18757d] text-xs font-bold rounded-full">Vidéo HD</span>
                      <span className="px-3 py-1 bg-[#e6f4f3] text-[#18757d] text-xs font-bold rounded-full">Accès à vie</span>
                      <span className="px-3 py-1 bg-[#e6f4f3] text-[#18757d] text-xs font-bold rounded-full">Accompagnement</span>
                    </div>

                    <p className="text-xs text-[#5e4d46] leading-relaxed">{formation.description}</p>
                  </div>
                </div>

                <div className="p-8 pt-0">
                  <button
                    onClick={() => handleBuyNow(formation)}
                    className="w-full py-4 text-xs font-extrabold text-white bg-[#18757d] hover:bg-[#12595f] rounded-2xl shadow-md uppercase tracking-wider transition-colors"
                  >
                    VOIR LA FORMATION
                  </button>
                </div>
              </div>
            ))}
          </div>

        </div>
      </section>

      {/* SECTION 5: POURQUOI CHOISIR GUIDES DIGITAUX ? */}
      <section className="py-16 md:py-24 bg-[#faf8f5] border-t border-[#eee7da]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          <h2 className="text-3xl sm:text-4xl font-extrabold text-[#332420] mb-6">
            Pourquoi choisir Guides Digitaux ?
          </h2>

          <p className="text-sm sm:text-base text-[#5e4d46] leading-relaxed mb-10">
            Nos guides et nos formations sont pensés pour te faire gagner du temps et de la clarté. Pas de grands discours théoriques : que du concret, immédiatement applicable pour ton activité d'artisan ou de créateur.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left max-w-2xl mx-auto">
            <div className="bg-white p-4 rounded-2xl border border-[#eee7da] flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#18757d] shrink-0" />
              <span className="text-xs font-bold text-[#332420]">Tout est testé et validé sur le terrain</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-[#eee7da] flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#18757d] shrink-0" />
              <span className="text-xs font-bold text-[#332420]">Accès immédiat après achat</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-[#eee7da] flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#18757d] shrink-0" />
              <span className="text-xs font-bold text-[#332420]">Support et réponses à tes questions</span>
            </div>

            <div className="bg-white p-4 rounded-2xl border border-[#eee7da] flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-[#18757d] shrink-0" />
              <span className="text-xs font-bold text-[#332420]">Mises à jour régulières offertes</span>
            </div>
          </div>

        </div>
      </section>

      {/* SECTION 6: UNE QUESTION AVANT D'ACHETER ? */}
      <section className="py-16 md:py-24 bg-[#f5f1e8] border-t border-[#e8ded0]">
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          
          <h2 className="text-2xl sm:text-3xl font-extrabold text-[#332420] mb-3">
            Une question avant d'acheter ?
          </h2>

          <p className="text-xs sm:text-sm text-[#5e4d46] mb-8">
            Tu as un doute sur la ressource qui correspond le mieux à tes besoins actuels ?
          </p>

          <div className="bg-white rounded-3xl p-8 border border-[#e8ded0] shadow-sm flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/contact"
              className="w-full sm:w-auto px-7 py-3.5 text-xs font-extrabold text-white bg-[#18757d] hover:bg-[#12595f] rounded-xl uppercase tracking-wider transition-colors"
            >
              ME CONTACTER
            </Link>

            <Link
              href="/#faq"
              className="w-full sm:w-auto px-7 py-3.5 text-xs font-extrabold text-[#18757d] bg-[#e6f4f3] hover:bg-[#d4edea] rounded-xl uppercase tracking-wider transition-colors"
            >
              VOIR LA FAQ
            </Link>
          </div>

        </div>
      </section>

      {/* PRODUCT DETAIL MODAL */}
      {activeModalProduct && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-8 border border-[#eee7da] shadow-2xl relative animate-in fade-in zoom-in duration-200">
            <button
              onClick={() => setActiveModalProduct(null)}
              className="absolute top-6 right-6 w-9 h-9 rounded-full bg-[#f4ede0] text-[#332420] flex items-center justify-center hover:bg-[#e05a47] hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <span className="inline-block px-3 py-1 rounded-full text-[11px] font-extrabold bg-[#e6f4f3] text-[#18757d] uppercase tracking-wider mb-3">
              {activeModalProduct.categoryLabel}
            </span>

            <h3 className="text-xl font-extrabold text-[#332420] mb-2">{activeModalProduct.title}</h3>
            
            <div className="text-2xl font-extrabold text-[#18757d] mb-4">
              {activeModalProduct.price.toFixed(2)} €
            </div>

            <p className="text-xs text-[#5e4d46] leading-relaxed mb-6">
              {activeModalProduct.description}
            </p>

            <h4 className="text-xs font-extrabold text-[#332420] uppercase tracking-wider mb-3">Ce que tu vas obtenir :</h4>
            <div className="space-y-2 mb-8">
              {activeModalProduct.features.map((feat, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-[#5e4d46]">
                  <CheckCircle2 className="w-4 h-4 text-[#18757d] shrink-0" />
                  <span>{feat}</span>
                </div>
              ))}
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => handleBuyNow(activeModalProduct)}
                disabled={isProcessingCheckout}
                className="w-full py-4 text-xs font-extrabold text-white bg-[#18757d] hover:bg-[#12595f] rounded-xl shadow-md uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-4 h-4" />
                COMMANDER DE SUITE ({activeModalProduct.price.toFixed(2)} €)
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
