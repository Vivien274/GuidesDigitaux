'use client';

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { getUserPurchasesAsync } from '@/lib/userPurchasesStore';
import { getCoachingStatusForUser } from '@/lib/coachingStore';
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
  ShoppingCart,
  Calendar
} from 'lucide-react';

import { notFound } from 'next/navigation';
import { fetchCoursesFromDb, fetchProductsFromDb } from '@/lib/supabaseLms';

interface Product {
  id: string;
  title: string;
  slug?: string;
  category: 'ebook' | 'checklist' | 'formation' | 'coaching';
  categoryLabel: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  badge?: string;
  image: string;
  imageAlt?: string;
  gallery?: string[];
  description: string;
  longDescription?: string;
  features: string[];
  bookingUrl?: string;
  productType?: 'simple' | 'bundle';
  bundleProductIds?: string[];
  bundleCustomItems?: { title: string; pdfUrl?: string }[];
}

import { DEFAULT_PRODUCTS } from '@/data/defaultProducts';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const productId = params?.id as string;
  const [isBuying, setIsBuying] = useState(false);
  const { addToCart } = useCart();

  const [product, setProduct] = useState<Product | null>(null);
  const [allProducts, setAllProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function syncProductFromDb() {
      setIsLoading(true);
      const [dbProducts, dbCourses] = await Promise.all([
        fetchProductsFromDb(),
        fetchCoursesFromDb()
      ]);

      setAllProducts(dbProducts || []);
      let match = (dbProducts || []).find(p => p.id === productId || p.slug === productId);
      
      const defaultMatch = DEFAULT_PRODUCTS.find(p => 
        p.id === productId || 
        p.slug === productId || 
        (match && (p.id === match.id || p.slug === match.slug || p.title.toLowerCase().trim() === match.title.toLowerCase().trim()))
      );

      if (match) {
        if (defaultMatch) {
          match.longDescription = defaultMatch.longDescription || match.longDescription;
          match.description = defaultMatch.description || match.description;
          match.image = defaultMatch.image || match.image;
          match.imageAlt = defaultMatch.imageAlt || match.imageAlt;
        }
      } else if (defaultMatch) {
        match = defaultMatch as any;
      }

      if (!match) {
        const courseMatch = (dbCourses || []).find(c => 
          c.id === productId || 
          (productId === 'creation-gmb' && (c.id === '17873181-7987-4000-a000-000000000000' || c.title.toLowerCase().includes('google')))
        );
        if (courseMatch) {
          match = {
            id: courseMatch.id,
            slug: courseMatch.id === '17873181-7987-4000-a000-000000000000' ? 'creation-gmb' : undefined,
            title: courseMatch.title,
            category: 'formation',
            categoryLabel: 'Formation Vidéo',
            price: courseMatch.price || 99,
            originalPrice: courseMatch.originalPrice,
            rating: 5,
            reviewsCount: 0,
            image: courseMatch.image || 'https://www.guides-digitaux.com/wp-content/uploads/2026/02/un-artisan-createur-devant-son-PC-en-train-dajouter-ses-produits-dnas-saboutique-en-ligne.-accoude-a-son-etabli-dans-son-atelier.-lumiere-naturelle.webp',
            description: courseMatch.description || 'Formation vidéo complète pas-à-pas.',
            features: [
              'Accès illimité 24/7',
              `${courseMatch.modules?.length || 0} Modules vidéo pas-à-pas`,
              'Support et exercices pratiques'
            ]
          };
        }
      }

      if (!match) {
        notFound();
        return;
      }

      setProduct(match);
      setIsLoading(false);
    }
    syncProductFromDb();
  }, [productId]);

  const [activeImage, setActiveImage] = useState<string>('');
  const [hasPurchased, setHasPurchased] = useState(false);
  const [coachingStatus, setCoachingStatus] = useState<any>(null);
  const { user } = useAuth();

  useEffect(() => {
    if (product) {
      const currentProd = product;
      const gallery = currentProd.gallery && currentProd.gallery.length > 0 ? currentProd.gallery : [currentProd.image];
      setActiveImage(gallery[0]);

      async function checkPurchased() {
        try {
          const savedEmail = typeof window !== 'undefined' && localStorage.getItem('gd_auth_user') ? JSON.parse(localStorage.getItem('gd_auth_user')!).email : '';
          const userEmail = user?.email || savedEmail;
          if (userEmail) {
            setCoachingStatus(getCoachingStatusForUser(userEmail));
            const purchases = await getUserPurchasesAsync(userEmail);
            const isMatch = (purchases || []).some((p: any) => p.id === currentProd.id || (currentProd.slug && p.slug === currentProd.slug) || (currentProd.category === 'coaching' && p.slug === 'coaching-site'));
            setHasPurchased(isMatch);
          }
        } catch (e) {
          console.error(e);
        }
      }
      checkPurchased();
    }
  }, [product?.id, user?.email]);

  if (isLoading || !product) {
    return (
      <div className="min-h-screen bg-[#faf8f5] flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#18757d] border-t-transparent"></div>
      </div>
    );
  }

  const productGallery = product.gallery && product.gallery.length > 0 ? product.gallery : [product.image];
  const relatedProducts = allProducts.filter(
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

  const productJsonLd = {
    '@context': 'https://schema.org/',
    '@type': 'Product',
    'name': product.title,
    'image': [
      `https://www.guides-digitaux.com${product.image}`,
      ...(product.gallery ? product.gallery.map((g: string) => `https://www.guides-digitaux.com${g}`) : [])
    ],
    'description': product.description,
    'sku': product.id,
    'brand': {
      '@type': 'Brand',
      'name': 'Guides Digitaux'
    },
    'offers': {
      '@type': 'Offer',
      'url': `https://www.guides-digitaux.com/produit/${product.slug || product.id}`,
      'priceCurrency': 'EUR',
      'price': product.price,
      'availability': 'https://schema.org/InStock',
      'seller': {
        '@type': 'Organization',
        'name': 'Guides Digitaux'
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#332420] font-sans">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(productJsonLd) }}
      />
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

      {/* COACHING PURCHASED ACCESS BANNER */}
      {hasPurchased && (product.category === 'coaching' || product.id === 'coaching-site' || !!product.bookingUrl) && (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-4">
          {coachingStatus && coachingStatus.completedSessions >= coachingStatus.maxSessions ? (
            <div className="bg-[#f5ebd9] text-[#332420] p-6 sm:p-8 rounded-3xl shadow-md border-2 border-amber-300 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="space-y-1.5 text-center sm:text-left">
                <span className="inline-flex items-center gap-2 px-3.5 py-1 bg-amber-200/80 rounded-full text-xs font-black text-amber-900 uppercase tracking-wider">
                  🔒 TES 2 RENDEZ-VOUS ONT ÉTÉ HONORÉS
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-[#332420]">
                  Tes 2 sessions de coaching sont terminées
                </h3>
                <p className="text-xs sm:text-sm font-semibold text-[#5e4d46]">
                  Tu as réalisé tes 2 rendez-vous en visio avec Stéphanie. Si tu souhaites reprogrammer de nouvelles sessions, tu peux commander un nouveau forfait ci-dessous.
                </p>
              </div>
              <button
                onClick={handleCheckout}
                disabled={isBuying}
                className="px-8 py-4 bg-[#18757d] hover:bg-[#12595f] text-white text-xs font-black rounded-2xl shadow-xl uppercase tracking-wider transition-transform hover:scale-105 shrink-0 flex items-center gap-2 cursor-pointer"
              >
                REPRENDRE DES SESSIONS DE COACHING (97 €) →
              </button>
            </div>
          ) : (
            <div className="bg-amber-400 text-[#332420] p-6 sm:p-8 rounded-3xl shadow-lg border-2 border-amber-500 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div className="space-y-1.5 text-center sm:text-left">
                <span className="inline-flex items-center gap-2 px-3.5 py-1 bg-white/90 rounded-full text-xs font-black text-[#332420] uppercase tracking-wider">
                  🎉 TON ACCOMPAGNEMENT EST RÉSERVÉ & DÉBLOQUÉ
                </span>
                <h3 className="text-xl sm:text-2xl font-black">
                  Réserve ton créneau avec Stéphanie
                </h3>
                <p className="text-xs sm:text-sm font-semibold text-[#4a362c]">
                  Choisis la date et l'heure de ta session individuelle dans l'agenda Google ({2 - (coachingStatus?.completedSessions || 0)}/2 restant{2 - (coachingStatus?.completedSessions || 0) > 1 ? 's' : ''}).
                </p>
              </div>
              <a
                href={product.bookingUrl || 'https://calendar.app.google/A4SMq4zBbZYnnCr18'}
                target="_blank"
                rel="noreferrer"
                className="px-8 py-4 bg-[#18757d] hover:bg-[#12595f] text-white text-xs font-black rounded-2xl shadow-xl uppercase tracking-wider transition-transform hover:scale-105 shrink-0 flex items-center gap-2"
              >
                <Calendar className="w-5 h-5" />
                RÉSERVER DANS L'AGENDA GOOGLE →
              </a>
            </div>
          )}
        </div>
      )}

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
                  alt={product.imageAlt || `${product.title} - Guides digitaux - Nord (59)`}
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

              {/* Special Bundle Highlight Box */}
              {(product.id.includes('bundle') || (product.slug && product.slug.includes('bundle'))) && (
                <div className="bg-gradient-to-br from-[#18757d]/10 via-[#e6f4f3] to-[#f4ede0] p-6 rounded-3xl border-2 border-[#18757d]/30 space-y-4 shadow-sm">
                  <div className="flex items-center justify-between">
                    <span className="px-3.5 py-1 bg-[#18757d] text-white text-xs font-black rounded-full uppercase tracking-wider">
                      Combo 2 Formations en 1
                    </span>
                    <span className="text-xs font-black text-[#e05a47] bg-white px-3 py-1 rounded-full border border-[#e05a47]/20 shadow-2xs">
                      Économie de 48 €
                    </span>
                  </div>
                  
                  <div className="space-y-3 pt-1">
                    <div className="bg-white p-4 rounded-2xl border border-[#eee7da] flex items-center justify-between shadow-2xs">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#e6f4f3] text-[#18757d] flex items-center justify-center font-extrabold text-sm">1</div>
                        <div>
                          <h4 className="text-xs sm:text-sm font-extrabold text-[#332420]">Formation Vitrine WordPress</h4>
                          <p className="text-[11px] text-slate-500">Créer sa vitrine en ligne professionnelle</p>
                        </div>
                      </div>
                      <span className="text-xs font-black text-slate-400 line-through sm:text-sm">199 €</span>
                    </div>

                    <div className="bg-white p-4 rounded-2xl border border-[#eee7da] flex items-center justify-between shadow-2xs">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-[#e6f4f3] text-[#18757d] flex items-center justify-center font-extrabold text-sm">2</div>
                        <div>
                          <h4 className="text-xs sm:text-sm font-extrabold text-[#332420]">Formation WooCommerce E-commerce</h4>
                          <p className="text-[11px] text-slate-500">Ajouter une boutique en ligne & paiements</p>
                        </div>
                      </div>
                      <span className="text-xs font-black text-slate-400 line-through sm:text-sm">99 €</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#18757d]/20 flex items-center justify-between text-xs sm:text-sm">
                    <span className="font-bold text-[#5e4d46]">Valeur totale des 2 formations : <span className="line-through text-slate-400">298 €</span></span>
                    <span className="font-extrabold text-[#18757d] text-base">Prix Combo : 250 €</span>
                  </div>
                </div>
              )}

              {/* Information de livraison numérique */}
              <div className="p-4 bg-[#f4ede0] rounded-2xl text-xs text-[#332420] font-semibold flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-[#e05a47] shrink-0" />
                <span>
                  {(product.id.includes('bundle') || (product.slug && product.slug.includes('bundle')))
                    ? 'Accès immédiat aux 2 formations par e-mail et accessible 24h/24 dans ton espace membre.'
                    : 'Accès immédiat par e-mail et accessible 24h/24 dans ton espace membre.'}
                </span>
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

            <div 
              className="text-sm sm:text-base text-[#5e4d46] leading-relaxed space-y-4 prose prose-emerald max-w-none [&_h3]:text-lg [&_h3]:font-extrabold [&_h3]:text-[#332420] [&_h3]:mt-6 [&_h3]:mb-3 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-1.5 [&_a]:text-[#18757d] [&_a]:font-bold [&_a]:underline hover:[&_a]:text-[#12595f] [&_p]:mb-4"
              dangerouslySetInnerHTML={{ __html: product.longDescription || product.description }}
            />
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

          {/* BAS - BLOC 2.B : SI PRODUIT EST UN BUNDLE / PACK COMBO */}
          {(product.productType === 'bundle' || (product.bundleProductIds && product.bundleProductIds.length > 0)) && (
            <div className="bg-gradient-to-br from-amber-50 to-[#fdf8f0] rounded-3xl p-8 sm:p-12 border-2 border-amber-200 shadow-sm space-y-6">
              <div className="border-b border-amber-200 pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div>
                  <span className="inline-block px-3 py-0.5 rounded-full text-[10px] font-extrabold bg-amber-200 text-amber-900 uppercase tracking-wider mb-2">
                    Pack Multi-Ressources
                  </span>
                  <h2 className="text-xl sm:text-2xl font-extrabold text-[#332420]">
                    📦 Détail du contenu inclus dans ce Pack Combo
                  </h2>
                </div>
                {product.bundleProductIds && product.bundleProductIds.length > 0 && (
                  <span className="text-xs font-black text-emerald-800 bg-emerald-100 px-4 py-2 rounded-xl">
                    Valeur cumulée : {
                      allProducts
                        .filter(p => product.bundleProductIds?.includes(p.id))
                        .reduce((sum, p) => sum + p.price, 0)
                    } € ➔ Inclus pour {product.price} € !
                  </span>
                )}
              </div>

              {/* GRID OF BUNDLED CATALOG PRODUCTS */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {allProducts
                  .filter(p => product.bundleProductIds?.includes(p.id))
                  .map((bundledProd) => (
                    <div key={bundledProd.id} className="bg-white p-5 rounded-2xl border border-amber-200 shadow-2xs flex items-center gap-4 hover:border-[#18757d] transition-colors">
                      <div className="relative w-16 h-16 rounded-xl overflow-hidden bg-slate-100 shrink-0">
                        <Image src={bundledProd.image} alt={bundledProd.title} fill className="object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-[10px] font-extrabold text-[#18757d] bg-[#e6f4f3] px-2 py-0.5 rounded-full uppercase">
                            {bundledProd.categoryLabel || bundledProd.category}
                          </span>
                          <span className="text-xs text-slate-400 font-bold line-through">
                            {bundledProd.price} €
                          </span>
                        </div>
                        <h4 className="text-xs font-extrabold text-[#332420] line-clamp-1">{bundledProd.title}</h4>
                        <p className="text-[11px] text-[#5e4d46] line-clamp-1 mt-0.5">{bundledProd.description}</p>
                      </div>
                      <Link
                        href={`/produit/${bundledProd.slug || bundledProd.id}`}
                        target="_blank"
                        className="p-2 text-slate-400 hover:text-[#18757d] rounded-lg hover:bg-slate-100 transition-colors"
                        title="Voir la fiche individuelle ↗"
                      >
                        <ArrowRight className="w-4 h-4" />
                      </Link>
                    </div>
                  ))}

                {/* CUSTOM BUNDLE ITEMS */}
                {product.bundleCustomItems?.map((customItem: { title: string; pdfUrl?: string }, cIdx: number) => (
                  <div key={cIdx} className="bg-white p-5 rounded-2xl border border-amber-200 shadow-2xs flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-amber-100 text-amber-800 font-extrabold flex items-center justify-center shrink-0 text-sm">
                      🎁
                    </div>
                    <div className="flex-1 min-w-0">
                      <span className="text-[10px] font-extrabold text-amber-800 bg-amber-100 px-2 py-0.5 rounded-full uppercase mb-1 inline-block">
                        Bonus Exclusif Pack
                      </span>
                      <h4 className="text-xs font-extrabold text-[#332420]">{customItem.title}</h4>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

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
