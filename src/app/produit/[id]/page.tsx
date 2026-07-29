'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';
import { 
  CheckCircle2, 
  Star, 
  ShoppingBag, 
  ArrowLeft, 
  Lock, 
  Download, 
  ShieldCheck, 
  Sparkles,
  ArrowRight,
  ShoppingCart
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
  gallery?: string[];
  description: string;
  longDescription?: string;
  features: string[];
}

const PRODUCTS_LIST: Product[] = productsData as unknown as Product[];
const PRODUCTS_MAP: Record<string, Product> = PRODUCTS_LIST.reduce(
  (acc, prod) => {
    acc[prod.id] = prod;
    return acc;
  },
  {} as Record<string, Product>
);

import { fetchCoursesFromDb } from '@/lib/supabaseLms';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params?.id as string;
  const [isBuying, setIsBuying] = useState(false);
  const { addToCart } = useCart();

  // Retrieve exact product by slug/id with fallback to static map
  const initialProduct = PRODUCTS_MAP[productId] || PRODUCTS_LIST[0];
  const [product, setProduct] = useState<Product>(initialProduct);

  useEffect(() => {
    async function syncProductFromDb() {
      const dbCourses = await fetchCoursesFromDb();
      const match = dbCourses.find(c => c.id === productId || (initialProduct?.title && c.title.toLowerCase().includes(initialProduct.title.toLowerCase().slice(0, 10))));
      if (match) {
        setProduct(prev => ({
          ...prev,
          title: match.title || prev.title,
          price: match.price || prev.price,
          originalPrice: match.originalPrice !== undefined ? match.originalPrice : prev.originalPrice,
          image: match.image || prev.image,
          description: match.description || prev.description
        }));
      }
    }
    syncProductFromDb();
  }, [productId]);

  // Active main image state
  const productGallery = product.gallery && product.gallery.length > 0 ? product.gallery : [product.image];
  const [activeImage, setActiveImage] = useState<string>(productGallery[0]);

  useEffect(() => {
    if (productGallery && productGallery.length > 0) {
      setActiveImage(productGallery[0]);
    }
  }, [product.id]);

  // Related products from the same category
  const relatedProducts = PRODUCTS_LIST.filter(
    (p) => p.id !== product.id && (p.category === product.category || p.category === 'ebook')
  ).slice(0, 3);

  const handleCheckout = async () => {
    setIsBuying(true);
    try {
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          productId: product.id,
          title: product.title,
          price: product.price
        })
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(`Redirection vers le système de paiement Stripe pour : ${product.title}`);
      }
    } catch (err) {
      alert(`Paiement initié pour ${product.title}`);
    } finally {
      setIsBuying(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#332420] font-sans">
      <Header />

      {/* BREADCRUMB / FIL D'ARIANE */}
      <div className="bg-[#faf8f5] pt-6 pb-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center gap-2 text-xs font-semibold text-[#5e4d46]">
          <Link href="/boutique" className="inline-flex items-center gap-1.5 text-[#18757d] font-bold hover:underline">
            <ArrowLeft className="w-4 h-4" />
            Boutique
          </Link>
          <span>/</span>
          <span className="capitalize">{product.categoryLabel}</span>
          <span>/</span>
          <span className="text-[#332420] font-bold truncate max-w-md">{product.title}</span>
        </div>
      </div>

      {/* ZONE HAUT : Visuels, Titre, Avis, Prix, Résumé */}
      <section className="py-8 md:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
            
            {/* HAUT - GAUCHE : Visuel Principal & Galerie Miniatures */}
            <div className="lg:col-span-6 space-y-4">
              
              {/* Image principale sélectionnée */}
              <div className="relative h-96 sm:h-[450px] w-full rounded-3xl overflow-hidden border border-[#eee7da] shadow-md bg-white">
                <Image
                  src={activeImage || product.image}
                  alt={product.title}
                  fill
                  className="object-cover transition-all duration-300"
                />
                {product.badge && (
                  <span className="absolute top-6 left-6 bg-[#e05a47] text-white text-xs font-extrabold px-4 py-1.5 rounded-full uppercase tracking-wider shadow-sm">
                    {product.badge}
                  </span>
                )}
              </div>

              {/* Galerie de vignettes interactives (si plusieurs images) */}
              {productGallery.length > 1 && (
                <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-thin">
                  {productGallery.map((imgUrl, index) => (
                    <button
                      key={index}
                      onClick={() => setActiveImage(imgUrl)}
                      className={`relative w-20 h-20 rounded-2xl overflow-hidden border-2 shrink-0 transition-all ${
                        activeImage === imgUrl 
                          ? 'border-[#18757d] shadow-md scale-105' 
                          : 'border-[#eee7da] opacity-70 hover:opacity-100'
                      }`}
                    >
                      <Image
                        src={imgUrl}
                        alt={`Aperçu ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                    </button>
                  ))}
                </div>
              )}

              {/* Badges de réassurance sous l'image */}
              <div className="bg-white rounded-2xl p-5 border border-[#eee7da] grid grid-cols-3 gap-4 text-center shadow-2xs">
                <div className="flex flex-col items-center">
                  <Download className="w-5 h-5 text-[#18757d] mb-1" />
                  <span className="text-[11px] font-bold text-[#332420]">Accès instantané</span>
                </div>
                <div className="flex flex-col items-center">
                  <Lock className="w-5 h-5 text-[#18757d] mb-1" />
                  <span className="text-[11px] font-bold text-[#332420]">Paiement Stripe</span>
                </div>
                <div className="flex flex-col items-center">
                  <ShieldCheck className="w-5 h-5 text-[#18757d] mb-1" />
                  <span className="text-[11px] font-bold text-[#332420]">Garantie qualité</span>
                </div>
              </div>
            </div>

            {/* HAUT - DROITE : Catégorie, Titre, Avis, Prix, Résumé */}
            <div className="lg:col-span-6 space-y-6">
              
              {/* Badge Catégorie */}
              <div>
                <span className="inline-block px-3.5 py-1 rounded-full text-xs font-extrabold bg-[#e6f4f3] text-[#18757d] uppercase tracking-wider mb-3">
                  {product.categoryLabel}
                </span>

                {/* Titre Produit */}
                <h1 className="text-2xl sm:text-4xl font-extrabold text-[#332420] leading-tight mb-3">
                  {product.title}
                </h1>

                {/* Avis Client (Stars) - Only shown if real reviews exist */}
                {product.reviewsCount && product.reviewsCount > 0 ? (
                  <div className="flex items-center gap-2">
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} className="w-4 h-4 fill-amber-400" />
                      ))}
                    </div>
                    <span className="text-xs font-bold text-[#5e4d46]">
                      5,0 ({product.reviewsCount} avis clients)
                    </span>
                  </div>
                ) : null}
              </div>

              {/* Carte Prix & Boutons d'Achat */}
              <div className="bg-white p-6 rounded-2xl border border-[#eee7da] flex flex-col sm:flex-row sm:items-center justify-between gap-4 shadow-2xs">
                <div>
                  <span className="text-xs text-slate-500 block">Tarif unique TTC :</span>
                  <div className="flex items-baseline gap-3">
                    <span className="text-3xl font-extrabold text-[#18757d]">
                      {product.price.toFixed(2).replace('.', ',')} €
                    </span>
                    {product.originalPrice && (
                      <span className="text-sm text-slate-400 line-through">
                        {product.originalPrice.toFixed(2).replace('.', ',')} €
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button
                    onClick={() => addToCart(product)}
                    className="flex-1 sm:flex-initial px-5 py-4 text-xs font-extrabold text-[#18757d] bg-[#e6f4f3] hover:bg-[#d4edea] rounded-xl transition-colors flex items-center justify-center gap-2 uppercase tracking-wider"
                  >
                    <ShoppingCart className="w-4 h-4" />
                    Ajouter au panier
                  </button>

                  <button
                    onClick={handleCheckout}
                    disabled={isBuying}
                    className="flex-1 sm:flex-initial px-6 py-4 text-xs font-extrabold text-white bg-[#18757d] hover:bg-[#12595f] rounded-xl shadow-md uppercase tracking-wider transition-colors flex items-center justify-center gap-2"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Acheter
                  </button>
                </div>
              </div>

              {/* Résumé Produit (Description courte) */}
              <div className="bg-white p-6 rounded-2xl border border-[#eee7da] space-y-2">
                <h3 className="text-xs font-extrabold text-[#18757d] uppercase tracking-wider">Résumé du guide</h3>
                <p className="text-sm text-[#332420] font-medium leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Information de livraison numérique */}
              <div className="p-4 bg-[#f4ede0] rounded-2xl text-xs text-[#332420] font-semibold flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-[#e05a47] shrink-0" />
                <span>Téléchargement immédiat par e-mail et accessible 24h/24 dans votre espace membre Supabase.</span>
              </div>

            </div>

          </div>
        </div>
      </section>

      {/* ZONE BAS : Description, Ce qui est inclus, Produits liés */}
      <section className="py-12 md:py-20 bg-[#f5f1e8] border-t border-[#e8ded0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
          
          {/* BAS - BLOC 1 : Description Longue et Détaillée */}
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#e8ded0] shadow-sm space-y-6">
            <div className="border-b border-[#eee7da] pb-4">
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#332420]">
                Description complète du guide
              </h2>
            </div>

            <div className="text-sm sm:text-base text-[#5e4d46] leading-relaxed space-y-4 whitespace-pre-line">
              {product.longDescription || product.description}
            </div>
          </div>

          {/* BAS - BLOC 2 : Ce qui est inclus dans ce produit */}
          <div className="bg-white rounded-3xl p-8 sm:p-12 border border-[#e8ded0] shadow-sm space-y-6">
            <div className="border-b border-[#eee7da] pb-4">
              <h2 className="text-xl sm:text-2xl font-extrabold text-[#332420]">
                Ce qui est inclus dans ce produit
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {product.features.map((feature, idx) => (
                <div key={idx} className="bg-[#faf8f5] p-4 rounded-2xl border border-[#eee7da] flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-[#18757d] shrink-0" />
                  <span className="text-xs sm:text-sm font-bold text-[#332420]">{feature}</span>
                </div>
              ))}
            </div>
          </div>

          {/* BAS - BLOC 3 : Produits Liés */}
          <div className="pt-8">
            <div className="flex flex-col sm:flex-row items-center justify-between mb-8 gap-4">
              <div>
                <span className="inline-block px-3 py-1 rounded-full text-xs font-bold bg-[#f4ede0] text-[#332420] mb-2">
                  Complète tes connaissances
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#332420]">
                  Produits similaires
                </h2>
              </div>

              <Link
                href="/boutique"
                className="inline-flex items-center gap-2 text-xs font-extrabold text-[#18757d] hover:underline"
              >
                VOIR TOUTE LA BOUTIQUE
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {/* Grid of 3 Related Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              {relatedProducts.map((relProduct) => (
                <div key={relProduct.id} className="bg-white rounded-3xl overflow-hidden border border-[#e8ded0] shadow-sm hover:shadow-md transition-shadow flex flex-col justify-between">
                  <div>
                    <div className="relative h-48 w-full bg-[#faf8f5]">
                      <Image
                        src={relProduct.image}
                        alt={relProduct.title}
                        fill
                        className="object-cover"
                      />
                      <span className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-xs text-[#18757d] text-xs font-extrabold px-3 py-1 rounded-full border border-[#eee7da]">
                        {relProduct.categoryLabel}
                      </span>
                    </div>

                    <div className="p-6">
                      <span className="text-xs font-extrabold text-[#18757d] block mb-1">
                        {relProduct.price.toFixed(2).replace('.', ',')} €
                      </span>
                      <h3 className="text-sm font-extrabold text-[#332420] line-clamp-2 leading-snug">
                        {relProduct.title}
                      </h3>
                    </div>
                  </div>

                  <div className="p-6 pt-0">
                    <Link
                      href={`/produit/${relProduct.id}`}
                      className="w-full py-3 text-xs font-extrabold text-[#18757d] bg-[#e6f4f3] hover:bg-[#d4edea] rounded-xl transition-colors block text-center uppercase tracking-wider"
                    >
                      DÉCOUVRIR
                    </Link>
                  </div>
                </div>
              ))}
            </div>

          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
}
