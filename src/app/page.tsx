'use client';

import React, { useState, useEffect, useMemo } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import DigitalizationQuiz from '@/components/DigitalizationQuiz';
import { BLOG_ARTICLES, getArticleTimestamp } from '@/data/blogArticles';
import { 
  PhoneCall, 
  ArrowRight, 
  Users, 
  GraduationCap, 
  CheckCircle2, 
  Search, 
  FileText, 
  Video, 
  Layers, 
  ShoppingBag, 
  Star, 
  X, 
  Lock, 
  Clock, 
  Sparkles,
  HelpCircle,
  BookOpen,
  Calendar,
  User,
  Send,
  CheckSquare,
  LifeBuoy,
  Target,
  Mail
} from 'lucide-react';

interface ProductItem {
  id: string;
  slug: string;
  title: string;
  category: 'all' | 'ebook' | 'checklist' | 'formation' | 'coaching';
  categoryLabel?: string;
  badge: string;
  badgeBg: string;
  price: number;
  originalPrice?: number;
  description: string;
  features: string[];
  pagesOrDuration: string;
  isPreorder?: boolean;
  releaseDate?: string;
  image: string;
  isNew?: boolean;
  orderPriority: number;
  detailsUrl: string;
  buyUrl?: string;
}

import { DEFAULT_PRODUCTS } from '@/data/defaultProducts';
import { fetchCoursesFromDb, fetchProductsFromDb } from '@/lib/supabaseLms';

const PRIORITY_ORDER: Record<string, { priority: number; isNew?: boolean; badge?: string; badgeBg?: string; detailsUrl?: string; buyUrl?: string; image?: string }> = {
  'kit-serenite': {
    priority: 1,
    isNew: true,
    badge: 'NOUVEAUTÉ',
    badgeBg: 'bg-[#18757d] text-white',
    detailsUrl: '/produit/kit-serenite',
    image: '/images/products/kit-serenite-posts-google.jpg'
  },
  'formation-fiche-google': {
    priority: 2,
    isNew: true,
    badge: 'LANCEMENT -40%',
    badgeBg: 'bg-[#c03823] text-white',
    detailsUrl: '/formation/formation-fiche-google',
    buyUrl: '/tunnel/formation-fiche-google',
    image: '/images/products/formation-fiche-google-mockup.webp'
  },
  '17873181-7987-4000-a000-000000000000': {
    priority: 2,
    isNew: true,
    badge: 'LANCEMENT -40%',
    badgeBg: 'bg-[#c03823] text-white',
    detailsUrl: '/formation/formation-fiche-google',
    buyUrl: '/tunnel/formation-fiche-google',
    image: '/images/products/formation-fiche-google-mockup.webp'
  },
  'orderbump-calculateur-score': {
    priority: 3,
    isNew: true,
    badge: 'OUTIL EXCLUSIF',
    badgeBg: 'bg-amber-600 text-white',
    detailsUrl: '/outils/calculateur-fiche-google',
    image: '/images/products/formation-fiche-google-bundle-hero.jpg'
  },
  'calculateur-fiche-google': {
    priority: 3,
    isNew: true,
    badge: 'OUTIL EXCLUSIF',
    badgeBg: 'bg-amber-600 text-white',
    detailsUrl: '/outils/calculateur-fiche-google',
    image: '/images/products/formation-fiche-google-bundle-hero.jpg'
  },
  'formation-wordpress': {
    priority: 4,
    badge: 'BEST-SELLER',
    badgeBg: 'bg-[#18757d] text-white',
    detailsUrl: '/formation/formation-wordpress',
    buyUrl: '/tunnel/formation-wordpress',
    image: '/images/products/formation-wordpress.webp'
  },
  '11111111-1111-4111-a111-111111111111': {
    priority: 4,
    badge: 'BEST-SELLER',
    badgeBg: 'bg-[#18757d] text-white',
    detailsUrl: '/formation/formation-wordpress',
    buyUrl: '/tunnel/formation-wordpress',
    image: '/images/products/formation-wordpress.webp'
  },
  'formation-ajouter-une-boutique-en-ligne-avec-woocommerce': {
    priority: 5,
    badge: 'POPULAIRE',
    badgeBg: 'bg-[#18757d] text-white',
    detailsUrl: '/formation/formation-ajouter-une-boutique-en-ligne-avec-woocommerce',
    image: '/images/products/formation-woocommerce.jpg'
  },
  '22222222-2222-4222-a222-222222222222': {
    priority: 5,
    badge: 'POPULAIRE',
    badgeBg: 'bg-[#18757d] text-white',
    detailsUrl: '/formation/formation-ajouter-une-boutique-en-ligne-avec-woocommerce',
    image: '/images/products/formation-woocommerce.jpg'
  },
  'bundle-vitrine-boutique-wordpress-le-combo-pour-vendre-en-ligne': {
    priority: 6,
    badge: 'ÉCONOMISE 48€',
    badgeBg: 'bg-[#c03823] text-white',
    detailsUrl: '/produit/bundle-vitrine-boutique-wordpress-le-combo-pour-vendre-en-ligne',
    image: '/images/products/bundle-vitrine-boutique-wordpress.webp'
  },
  'coaching-site': {
    priority: 7,
    badge: 'ACCOMPAGNEMENT 1-SUR-1',
    badgeBg: 'bg-[#18757d] text-white',
    detailsUrl: '/produit/coaching-site',
    image: '/images/products/coaching-site.webp'
  },
  'mini-guide-seo-local': {
    priority: 8,
    badge: 'POPULAIRE',
    badgeBg: 'bg-[#18757d] text-white',
    detailsUrl: '/produit/mini-guide-seo-local',
    image: '/images/products/mini-guide-seo-local.webp'
  },
  'ebook-visibilite-ligne-artisan': {
    priority: 9,
    badge: 'GUIDE FONDATION',
    badgeBg: 'bg-[#18757d] text-white',
    detailsUrl: '/produit/ebook-visibilite-ligne-artisan',
    image: '/images/products/ebook-visibilite-ligne-artisan.webp'
  },
  'pack-guides': {
    priority: 10,
    badge: 'PACK ÉCONOMIQUE',
    badgeBg: 'bg-[#18757d] text-white',
    detailsUrl: '/produit/pack-guides',
    image: '/images/products/pack-guides.webp'
  },
  'checklist-google-business-profile': {
    priority: 11,
    badge: 'CHECKLIST RAPIDE',
    badgeBg: 'bg-[#18757d] text-white',
    detailsUrl: '/produit/checklist-google-business-profile',
    image: '/images/products/checklist-google-business-profile.webp'
  },
  'checklist-profil-reseaux-sociaux': {
    priority: 12,
    badge: 'RÉSEAUX SOCIAUX',
    badgeBg: 'bg-[#18757d] text-white',
    detailsUrl: '/produit/checklist-profil-reseaux-sociaux',
    image: '/images/products/checklist-profil-reseaux-sociaux.webp'
  },
  'checklist-securite-anti-spam-wordpress': {
    priority: 13,
    badge: 'SÉCURITÉ WEB',
    badgeBg: 'bg-[#18757d] text-white',
    detailsUrl: '/produit/checklist-securite-anti-spam-wordpress',
    image: '/images/products/checklist-securite-anti-spam-wordpress.webp'
  },
  'checklist-les-principes-ux': {
    priority: 14,
    badge: 'ERGONOMIE',
    badgeBg: 'bg-[#18757d] text-white',
    detailsUrl: '/produit/checklist-les-principes-ux',
    image: '/images/products/checklist-les-principes-ux.webp'
  },
  'checklist-verification-lancement-site': {
    priority: 15,
    badge: 'CHECKLIST PRÉ-LANCEMENT',
    badgeBg: 'bg-[#18757d] text-white',
    detailsUrl: '/produit/checklist-verification-lancement-site',
    image: '/images/products/checklist-verification-lancement-site.webp'
  },
  'mini-guide-ecrire-web-artisan': {
    priority: 16,
    badge: 'RÉDACTION WEB',
    badgeBg: 'bg-[#18757d] text-white',
    detailsUrl: '/produit/mini-guide-ecrire-web-artisan',
    image: '/images/products/mini-guide-ecrire-web-artisan.webp'
  },
  'mini-guide-optimiser-ses-photos': {
    priority: 17,
    badge: 'PERFORMANCE VITESSE',
    badgeBg: 'bg-[#18757d] text-white',
    detailsUrl: '/produit/mini-guide-optimiser-ses-photos',
    image: '/images/products/mini-guide-optimiser-ses-photos.webp'
  },
  'mini-guide-comprendre-ses-stats-sans-etre-data-scientist': {
    priority: 18,
    badge: 'STATISTIQUES & KPI',
    badgeBg: 'bg-[#18757d] text-white',
    detailsUrl: '/produit/mini-guide-comprendre-ses-stats-sans-etre-data-scientist',
    image: '/images/products/mini-guide-comprendre-ses-stats.webp'
  }
};

function mapToProductItem(p: any): ProductItem {
  const meta = PRIORITY_ORDER[p.id] || PRIORITY_ORDER[p.slug] || {};
  const isCoaching = p.id === 'coaching-site' || p.slug === 'coaching-site' || (p.title || '').toLowerCase().includes('coaching');
  const category = isCoaching ? 'coaching' : (p.category === 'formation' ? 'formation' : (p.category === 'checklist' ? 'checklist' : 'ebook'));
  const pagesOrDuration = isCoaching 
    ? '2 sessions en visio' 
    : (category === 'formation' ? 'Formation Vidéo' : (category === 'checklist' ? 'Checklist PDF' : 'E-Book PDF HD'));

  return {
    id: p.id,
    slug: p.slug || p.id,
    title: p.title,
    category,
    categoryLabel: p.categoryLabel || (category === 'formation' ? 'Formation' : (category === 'checklist' ? 'Checklist' : 'E-Book')),
    badge: meta.badge || p.badge || (category === 'formation' ? 'FORMATION' : 'GUIDE PRATIQUE'),
    badgeBg: meta.badgeBg || 'bg-[#18757d] text-white',
    price: Number(p.price) || 0,
    originalPrice: p.originalPrice ? Number(p.originalPrice) : (p.original_price ? Number(p.original_price) : undefined),
    description: p.description || '',
    features: Array.isArray(p.features) ? p.features : [],
    pagesOrDuration,
    image: meta.image || p.image || p.image_url || '/images/products/formation-wordpress.webp',
    isNew: meta.isNew || false,
    orderPriority: meta.priority ?? 50,
    detailsUrl: meta.detailsUrl || `/produit/${p.slug || p.id}`,
    buyUrl: meta.buyUrl
  };
}

const INITIAL_PRODUCTS: ProductItem[] = DEFAULT_PRODUCTS
  .filter(p => p.id !== 'precommande-fiche-google' && p.slug !== 'precommande-fiche-google')
  .map(mapToProductItem)
  .sort((a, b) => a.orderPriority - b.orderPriority);

export default function HomePage() {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [activeModalProduct, setActiveModalProduct] = useState<ProductItem | null>(null);
  const [loadingCheckoutId, setLoadingCheckoutId] = useState<string | null>(null);
  const [newsletterEmail, setNewsletterEmail] = useState<string>('');
  const [newsletterSubmitted, setNewsletterSubmitted] = useState<boolean>(false);
  const [productsList, setProductsList] = useState<ProductItem[]>(INITIAL_PRODUCTS);

  const recentBlogArticles = useMemo(() => {
    return BLOG_ARTICLES
      .filter((article) => {
        if (article.status === 'draft') return false;
        if (article.status === 'scheduled' && article.scheduledAt) {
          return new Date(article.scheduledAt).getTime() <= Date.now();
        }
        return true;
      })
      .sort((a, b) => getArticleTimestamp(b) - getArticleTimestamp(a))
      .slice(0, 3);
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined' && window.location.hash) {
      const targetId = window.location.hash.replace('#', '');
      if (targetId) {
        setTimeout(() => {
          const element = document.getElementById(targetId);
          if (element) {
            element.scrollIntoView({ behavior: 'smooth', block: 'start' });
          }
        }, 300);
      }
    }
  }, []);

  useEffect(() => {
    async function syncDynamicCatalog() {
      try {
        const [dbProducts, dbCourses] = await Promise.all([
          fetchProductsFromDb(),
          fetchCoursesFromDb()
        ]);

        const itemsMap = new Map<string, ProductItem>();
        
        // 1. Seed with DEFAULT_PRODUCTS
        DEFAULT_PRODUCTS.forEach(p => {
          if (p.id !== 'precommande-fiche-google' && p.slug !== 'precommande-fiche-google') {
            itemsMap.set(p.id, mapToProductItem(p));
          }
        });

        // 2. Override with DB products
        if (dbProducts && dbProducts.length > 0) {
          dbProducts.forEach(p => {
            if (p.id !== 'precommande-fiche-google' && p.slug !== 'precommande-fiche-google' && !p.title?.toLowerCase().includes('précommande')) {
              itemsMap.set(p.id, mapToProductItem(p));
            }
          });
        }

        // 3. Sync published courses
        if (dbCourses && dbCourses.length > 0) {
          const now = new Date();
          const publishedCourses = dbCourses.filter(c => {
            if (c.status === 'Brouillon') return false;
            if (c.status === 'Planifié') {
              if (!c.scheduledPublishDate) return false;
              return now >= new Date(c.scheduledPublishDate);
            }
            return true;
          });

          publishedCourses.forEach(c => {
            const titleLower = (c.title || '').toLowerCase().trim();
            if (c.id === '17873181-7987-4000-a000-000000000000' || titleLower.includes('google')) {
              const existing = itemsMap.get('formation-fiche-google') || itemsMap.get(c.id);
              itemsMap.set('formation-fiche-google', {
                ...(existing || mapToProductItem(c)),
                id: 'formation-fiche-google',
                slug: 'formation-fiche-google',
                title: c.title || existing?.title || 'Cap Visibilité Google',
                price: c.price || 29,
                image: '/images/products/formation-fiche-google-mockup.webp',
                detailsUrl: '/formation/formation-fiche-google',
                buyUrl: '/tunnel/formation-fiche-google',
                category: 'formation',
                badge: 'LANCEMENT -40%',
                badgeBg: 'bg-[#c03823] text-white',
                isNew: true,
                orderPriority: 2
              });
            } else if (c.id === '11111111-1111-4111-a111-111111111111' || titleLower.includes('vitrine') || titleLower.includes('wordpress')) {
              const existing = itemsMap.get('formation-wordpress') || itemsMap.get(c.id);
              itemsMap.set('formation-wordpress', {
                ...(existing || mapToProductItem(c)),
                id: 'formation-wordpress',
                slug: 'formation-wordpress',
                title: c.title || existing?.title || 'Formation : créer sa vitrine en ligne avec WordPress',
                price: c.price || 199,
                image: '/images/products/formation-wordpress.webp',
                detailsUrl: '/formation/formation-wordpress',
                buyUrl: '/tunnel/formation-wordpress',
                category: 'formation',
                badge: 'BEST-SELLER',
                orderPriority: 4
              });
            } else if (c.id === '22222222-2222-4222-a222-222222222222' || titleLower.includes('woocommerce')) {
              const existing = itemsMap.get('formation-ajouter-une-boutique-en-ligne-avec-woocommerce') || itemsMap.get(c.id);
              itemsMap.set('formation-ajouter-une-boutique-en-ligne-avec-woocommerce', {
                ...(existing || mapToProductItem(c)),
                id: 'formation-ajouter-une-boutique-en-ligne-avec-woocommerce',
                slug: 'formation-ajouter-une-boutique-en-ligne-avec-woocommerce',
                title: c.title || existing?.title || 'Formation ajouter une boutique en ligne avec WooCommerce',
                price: c.price || 99,
                image: '/images/products/formation-woocommerce.jpg',
                detailsUrl: '/formation/formation-ajouter-une-boutique-en-ligne-avec-woocommerce',
                category: 'formation',
                badge: 'POPULAIRE',
                orderPriority: 5
              });
            }
          });
        }

        const sorted = Array.from(itemsMap.values()).sort((a, b) => a.orderPriority - b.orderPriority);
        setProductsList(sorted);
      } catch (err) {
        console.error('Error syncing homepage catalog:', err);
      }
    }

    syncDynamicCatalog();
  }, []);

  const filteredProducts = productsList.filter(product => {
    let matchesCategory = true;
    if (selectedCategory === 'nouveautes') {
      matchesCategory = !!product.isNew;
    } else if (selectedCategory !== 'all') {
      matchesCategory = product.category === selectedCategory;
    }
    const matchesSearch = 
      product.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      product.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.badge.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesCategory && matchesSearch;
  });

  const handleCheckout = async (productId: string) => {
    try {
      setLoadingCheckoutId(productId);
      const res = await fetch('/api/checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId }),
      });
      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        alert(data.error || 'Une erreur est survenue lors du paiement Stripe.');
      }
    } catch (err) {
      alert('Erreur lors de la connexion avec Stripe Checkout.');
    } finally {
      setLoadingCheckoutId(null);
    }
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsletterSubmitted(true);
      setTimeout(() => setNewsletterSubmitted(false), 4000);
      setNewsletterEmail('');
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#332420] font-sans">
      
      <Header />

      {/* HERO SECTION */}
      <section className="relative pt-10 pb-16 md:pt-16 md:pb-24 bg-gradient-to-b from-[#eef4fb] via-[#faf8f5] to-[#faf8f5] overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-7 relative z-10">
              
              {/* Saturn Doodle SVG */}
              <div className="absolute -top-10 -left-6 text-[#18757d]/30 hidden sm:block">
                <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <ellipse cx="12" cy="12" rx="7" ry="4" transform="rotate(-30 12 12)" />
                  <ellipse cx="12" cy="12" rx="10" ry="2" transform="rotate(-30 12 12)" />
                </svg>
              </div>

              {/* Badge 100% Adapté aux débutants */}
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-xs font-bold bg-[#f4ede0] text-[#4a3b35] border border-[#e8ded0] mb-6 shadow-2xs">
                <span>100% Adapté aux débutants</span>
                <span className="w-1.5 h-1.5 rounded-full bg-[#e05a47]"></span>
              </div>

              {/* Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-[#332420] tracking-tight leading-[1.15]">
                Des{' '}
                <span className="text-[#18757d]">Guides</span>{' '}
                <span className="text-[#18757d] relative inline-block">
                  digitaux
                  <svg className="absolute -bottom-2 left-0 w-full h-3" viewBox="0 0 140 14" fill="none">
                    <path d="M4 10C35 4 105 3 136 10" stroke="#e05a47" strokeWidth="4" strokeLinecap="round" />
                  </svg>
                </span>{' '}
                pour faire évoluer ton entreprise
              </h1>

              {/* Subtitle */}
              <p className="mt-6 text-base sm:text-lg text-[#5e4d46] leading-relaxed max-w-xl">
                Formations, ebooks et checklists pour t’aider à booster ta visibilité, gérer ton business en ligne et enfin comprendre le digital à ton rythme.
              </p>

              {/* Action Buttons Row */}
              <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center gap-6">
                <a
                  href="#boutique"
                  className="px-7 py-4 text-sm font-extrabold text-white bg-[#18757d] hover:bg-[#12595f] rounded-2xl shadow-lg shadow-[#18757d]/20 transition-all flex items-center justify-center gap-2 tracking-wider uppercase"
                >
                  VOIR LES GUIDES
                  <ArrowRight className="w-4 h-4" />
                </a>

                <a 
                  href="tel:0782404062" 
                  className="flex items-center gap-3.5 text-left group px-2 py-1"
                >
                  <div className="w-12 h-12 rounded-full bg-[#18757d]/10 border border-[#18757d]/20 flex items-center justify-center text-[#18757d] group-hover:bg-[#18757d] group-hover:text-white transition-colors shrink-0">
                    <PhoneCall className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-slate-500 font-medium block">Besoin d'aide ?</span>
                    <span className="text-base font-extrabold text-[#18757d] group-hover:underline">
                      07.82.40.40.62
                    </span>
                  </div>
                </a>
              </div>

            </div>

            {/* Right Visual Image & Floating Badges */}
            <div className="lg:col-span-5 relative flex justify-center">
              <div className="absolute inset-0 flex items-center justify-center -z-10">
                <div className="w-80 h-80 sm:w-96 sm:h-96 rounded-[40px] bg-[#18757d] rotate-6 opacity-90"></div>
                <div className="absolute top-10 right-0 w-44 h-44 rounded-full bg-[#f5d76e] -z-10 blur-xs opacity-90"></div>
              </div>

              <div className="relative z-10 w-full max-w-md">
                <Image
                  src="/images/hero_artisan.png"
                  alt="Artisane et créatrice Guides Digitaux"
                  width={500}
                  height={500}
                  priority
                  className="rounded-[32px] object-cover shadow-2xl transition-transform duration-500 hover:scale-105 border-4 border-white"
                />

                <div className="absolute -top-5 left-1 sm:top-12 sm:-left-10 bg-white p-3 sm:p-4 rounded-2xl shadow-xl card-shadow-soft border border-slate-100 flex items-center gap-2.5 sm:gap-3 animate-float-slow z-20">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#18757d] flex items-center justify-center text-white shrink-0">
                    <Users className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] sm:text-[11px] text-slate-400 block font-medium">Spécial</span>
                    <span className="text-xs sm:text-sm font-extrabold text-[#332420]">Artisans / créateurs</span>
                  </div>
                </div>

                <div className="absolute bottom-4 right-1 sm:bottom-6 sm:-right-8 bg-white p-3 sm:p-4 rounded-2xl shadow-xl card-shadow-soft border border-slate-100 flex items-center gap-2.5 sm:gap-3 animate-float-delay z-20">
                  <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-full bg-[#e05a47] flex items-center justify-center text-white shrink-0">
                    <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] sm:text-[11px] text-slate-400 block font-medium">Guides & Formations</span>
                    <span className="text-xs sm:text-sm font-extrabold text-[#18757d]">en ligne</span>
                  </div>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* SECOND SECTION: ABOUT & TARGET AUDIENCE */}
      <section id="about" className="py-16 md:py-24 bg-[#faf8f5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* LEFT: Overlapping Image Cards with Floating Badge */}
            <div className="lg:col-span-5 relative">
              <div className="relative mx-auto max-w-md pt-6 pl-6">
                
                {/* Floating Teal Badge */}
                <div className="absolute top-0 left-0 z-20 bg-[#18757d] text-white px-5 py-3 rounded-2xl shadow-lg text-center leading-tight">
                  <span className="text-xl font-extrabold block">10 +</span>
                  <span className="text-[11px] font-medium tracking-wide">guides et tutoriels</span>
                </div>

                {/* Main Portrait Card (Man with red t-shirt holding smartphone) */}
                <div className="relative h-[420px] w-full">
                  <Image
                    src="/images/about_man.png"
                    alt="Créateur ou artisan utilisant son smartphone"
                    fill
                    className="object-contain object-top"
                  />
                </div>

                {/* Overlapping Secondary Card (Girl in pink hoodie with laptop) */}
                <div className="absolute -bottom-6 -left-6 z-10 w-48 h-48 sm:w-56 sm:h-56 hidden sm:block">
                  <Image
                    src="/images/about_woman.png"
                    alt="Créatrice travaillant sur ordinateur"
                    fill
                    className="object-contain"
                  />
                </div>

              </div>
            </div>

            {/* RIGHT: Text Content matching exact reference */}
            <div className="lg:col-span-7 space-y-6">
              
              {/* Badge Pill */}
              <span className="inline-block px-3.5 py-1 rounded-full text-xs font-extrabold bg-[#f4ede0] text-[#332420]">
                À propos de Guides Digitaux
              </span>

              {/* Title */}
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#332420] leading-tight">
                Le digital expliqué{' '}
                <span className="text-[#18757d] relative inline-block">
                  simplement
                  <svg className="absolute -bottom-1.5 left-0 w-full h-3" viewBox="0 0 140 14" fill="none">
                    <path d="M4 10C35 4 105 3 136 10" stroke="#e05a47" strokeWidth="4" strokeLinecap="round" />
                  </svg>
                </span>
                , pour ceux qui aiment le concret.
              </h2>

              {/* Paragraph 1 */}
              <p className="text-sm sm:text-base text-[#5e4d46] leading-relaxed">
                Tu es artisan, créateur ou indépendant, et tu veux développer ton activité en ligne... mais tu ne sais pas par où commencer ?
              </p>

              {/* Highlight Box */}
              <p className="text-sm sm:text-base text-[#332420] font-medium leading-relaxed">
                👉 Ici, pas de blabla marketing : des <strong className="font-extrabold text-[#332420]">ressources claires, concrètes et adaptées à ton quotidien.</strong>
              </p>

              {/* Intro List */}
              <div className="space-y-3 text-sm sm:text-base text-[#5e4d46]">
                <p>
                  Chez <strong className="font-extrabold text-[#332420]">Guides Digitaux</strong>, nous t'aidons à franchir chaque étape de ta <strong className="font-extrabold text-[#332420]">transformation digitale</strong> :
                </p>
                <ul className="space-y-2 pl-4 list-disc marker:text-[#332420]">
                  <li>créer une présence en ligne efficace,</li>
                  <li>comprendre les réseaux sociaux,</li>
                  <li>automatiser certaines tâches,</li>
                  <li>et surtout, <strong className="font-extrabold text-[#332420]">gagner du temps et de la visibilité.</strong></li>
                </ul>
              </div>

              {/* Conclusion Paragraph */}
              <p className="text-sm sm:text-base text-[#5e4d46] leading-relaxed">
                Nos contenus sont conçus <strong className="font-extrabold text-[#332420]">par une experte du digital</strong> qui connaît les défis des artisans et créateurs travaillant à domicile.
              </p>

              {/* CTA Button */}
              <div className="pt-4">
                <Link
                  href="/boutique"
                  className="inline-flex items-center gap-2 px-7 py-4 text-xs font-extrabold text-white bg-[#18757d] hover:bg-[#12595f] rounded-2xl shadow-md uppercase tracking-wider transition-colors"
                >
                  EXPLORER LES FORMATIONS
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* 2.5. STRATEGIC NEUROMARKETING QUIZ SECTION */}
      <section id="quiz-site" className="py-14 md:py-20 bg-gradient-to-b from-[#faf8f5] via-[#f7f3eb] to-[#faf8f5] border-y border-[#eee7da] scroll-mt-24">
        <div id="quiz" className="scroll-mt-24" />
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="text-center space-y-3 mb-6">
            <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-extrabold bg-[#e6f4f3] text-[#18757d] uppercase tracking-wider border border-[#18757d]/20 shadow-2xs">
              <Sparkles className="w-4 h-4 text-[#F2542D]" />
              DIAGNOSTIC DIGITAL EXPRESS (2 MIN)
            </span>
            <h2 className="text-2xl sm:text-4xl font-extrabold text-[#332420] tracking-tight">
              Tu hésites encore ? Découvre la formule <span className="text-[#18757d]">idéale pour toi !</span>
            </h2>
            <p className="text-xs sm:text-sm text-[#5e4d46] font-semibold max-w-xl mx-auto">
              Réponds à 6 questions simples et obtiens immédiatement ton profil personnalisé et ta recommandation sur-mesure.
            </p>
          </div>

          <DigitalizationQuiz />
        </div>
      </section>

      {/* BOUTIQUE / CATALOG SECTION */}
      <section id="boutique" className="py-16 md:py-24 bg-[#faf8f5]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-[#c03823] block mb-2">Boutique en ligne</span>
              <h2 className="text-3xl sm:text-4xl font-extrabold text-[#332420]">
                Nos Guides & Formations Disponibles
              </h2>
              <p className="text-sm text-[#5e4d46] mt-2">
                Les nouveautés et ajouts récents sont présentés en priorité. Choisis une catégorie pour filtrer.
              </p>
            </div>

            <div className="relative w-full md:w-80">
              <label htmlFor="search-guides-input" className="sr-only">
                Chercher un guide (SEO, Google, Instagram...)
              </label>
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" aria-hidden="true" />
              <input
                id="search-guides-input"
                name="search-guides"
                type="text"
                placeholder="Chercher un guide (SEO, Google...)"
                aria-label="Chercher un guide (SEO, Google...)"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-white border border-[#eee7da] rounded-2xl pl-10 pr-4 py-3 text-sm text-[#332420] placeholder-slate-400 focus:outline-none focus:border-[#18757d] transition-colors shadow-2xs"
              />
            </div>
          </div>

          {/* CATEGORY FILTER TABS */}
          <div className="flex overflow-x-auto sm:flex-wrap items-center gap-2.5 pb-2 mb-10 scrollbar-none">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-4 sm:px-5 py-2.5 rounded-full text-xs font-bold transition-all shrink-0 ${
                selectedCategory === 'all'
                  ? 'bg-[#18757d] text-white shadow-sm'
                  : 'bg-white text-[#332420] hover:bg-[#e6f4f3] border border-[#eee7da]'
              }`}
            >
              Tous les contenus ({productsList.length})
            </button>

            <button
              onClick={() => setSelectedCategory('nouveautes')}
              className={`px-4 sm:px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                selectedCategory === 'nouveautes'
                  ? 'bg-[#c03823] text-white shadow-sm'
                  : 'bg-white text-[#c03823] hover:bg-rose-50 border border-[#eee7da]'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              Nouveautés ({productsList.filter(p => p.isNew).length})
            </button>

            <button
              onClick={() => setSelectedCategory('formation')}
              className={`px-4 sm:px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                selectedCategory === 'formation'
                  ? 'bg-[#18757d] text-white shadow-sm'
                  : 'bg-white text-[#332420] hover:bg-[#e6f4f3] border border-[#eee7da]'
              }`}
            >
              <GraduationCap className="w-3.5 h-3.5" />
              Formations Vidéo ({productsList.filter(p => p.category === 'formation').length})
            </button>

            <button
              onClick={() => setSelectedCategory('ebook')}
              className={`px-4 sm:px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                selectedCategory === 'ebook'
                  ? 'bg-[#18757d] text-white shadow-sm'
                  : 'bg-white text-[#332420] hover:bg-[#e6f4f3] border border-[#eee7da]'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              Kits & E-books ({productsList.filter(p => p.category === 'ebook').length})
            </button>

            <button
              onClick={() => setSelectedCategory('checklist')}
              className={`px-4 sm:px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                selectedCategory === 'checklist'
                  ? 'bg-[#18757d] text-white shadow-sm'
                  : 'bg-white text-[#332420] hover:bg-[#e6f4f3] border border-[#eee7da]'
              }`}
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              Checklists ({productsList.filter(p => p.category === 'checklist').length})
            </button>

            <button
              onClick={() => setSelectedCategory('coaching')}
              className={`px-4 sm:px-5 py-2.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 shrink-0 ${
                selectedCategory === 'coaching'
                  ? 'bg-[#18757d] text-white shadow-sm'
                  : 'bg-white text-[#332420] hover:bg-[#e6f4f3] border border-[#eee7da]'
              }`}
            >
              <Users className="w-3.5 h-3.5" />
              Coaching ({productsList.filter(p => p.category === 'coaching').length})
            </button>
          </div>

          {/* Product Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                className="relative bg-white rounded-3xl p-6 sm:p-7 border border-[#eee7da] shadow-xs hover:shadow-xl transition-all duration-300 flex flex-col justify-between group cursor-pointer"
              >
                <div>
                  {/* Product Cover Image */}
                  {product.image && (
                    <div
                      className="relative w-full h-48 sm:h-52 mb-5 rounded-2xl overflow-hidden bg-[#f4ede0] border border-[#eee7da] shadow-xs"
                    >
                      <Image
                        src={product.image}
                        alt=""
                        aria-hidden="true"
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      />
                      {product.isNew && (
                        <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-[#c03823] text-white shadow-md flex items-center gap-1">
                          <Sparkles className="w-3 h-3" /> NOUVEAUTÉ
                        </span>
                      )}
                    </div>
                  )}

                  <div className="flex items-center justify-between mb-3">
                    <span className={`px-3 py-1 rounded-full text-[11px] font-extrabold uppercase tracking-wider ${product.badgeBg}`}>
                      {product.badge}
                    </span>
                    <span className="text-xs text-slate-500 font-semibold">
                      {product.pagesOrDuration}
                    </span>
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-[#332420] group-hover:text-[#18757d] transition-colors mb-2 leading-snug line-clamp-2 h-14">
                    <Link href={product.detailsUrl} className="after:absolute after:inset-0 after:z-0 focus:outline-none">
                      {product.title}
                    </Link>
                  </h3>

                  <p className="text-xs text-[#5e4d46] mb-5 leading-relaxed line-clamp-2 h-9">
                    {product.description}
                  </p>

                  <ul className="space-y-2 mb-6 text-xs text-[#332420] border-t border-[#eee7da] pt-4 min-h-[5.5rem]">
                    {product.features.slice(0, 3).map((feat, idx) => (
                      <li key={idx} className="flex items-start gap-2">
                        <CheckCircle2 className="w-4 h-4 text-[#18757d] shrink-0 mt-0.5" />
                        <span className="line-clamp-1">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="border-t border-[#eee7da] pt-4 mt-auto">
                  <div className="flex items-baseline justify-between mb-4">
                    <div className="flex items-baseline gap-2">
                      <span className="text-2xl sm:text-3xl font-extrabold text-[#332420]">{product.price} €</span>
                      {product.originalPrice && product.originalPrice > product.price && (
                        <span className="text-xs text-slate-400 line-through font-semibold">
                          {product.originalPrice} €
                        </span>
                      )}
                    </div>
                    {product.originalPrice && product.originalPrice > product.price && (
                      <span className="text-[11px] font-bold text-[#c03823] bg-rose-50 px-2 py-0.5 rounded-md">
                        -{Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)}%
                      </span>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-2.5">
                    <span
                      aria-hidden="true"
                      className="w-full py-2.5 px-3 text-xs font-extrabold text-[#332420] bg-[#f4ede0] group-hover:bg-[#e8ded0] rounded-xl transition-colors text-center flex items-center justify-center pointer-events-none"
                    >
                      Détails
                    </span>
                    {product.buyUrl ? (
                      <Link
                        href={product.buyUrl}
                        className="relative z-10 w-full py-2.5 px-3 text-xs font-extrabold text-white bg-[#18757d] hover:bg-[#12595f] rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5"
                      >
                        Commander
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    ) : (
                      <button
                        onClick={() => handleCheckout(product.id)}
                        disabled={loadingCheckoutId === product.id}
                        className="relative z-10 w-full py-2.5 px-3 text-xs font-extrabold text-white bg-[#18757d] hover:bg-[#12595f] rounded-xl shadow-md transition-all flex items-center justify-center gap-1.5 disabled:opacity-50"
                      >
                        {loadingCheckoutId === product.id ? (
                          <span className="animate-pulse">Chargement...</span>
                        ) : (
                          <>
                            Commander
                            <ArrowRight className="w-3.5 h-3.5" />
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </div>

              </div>
            ))}
          </div>

        </div>
      </section>

      {/* NEW SECTION 1: DES OUTILS CONCRETS POUR AVANCER PAS À PAS (SCREENSHOT 1) */}
      <section className="py-16 md:py-24 bg-[#faf8f5] border-t border-[#eee7da] relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            
            {/* Left Content */}
            <div className="lg:col-span-6 space-y-6">
              
              <div className="inline-block px-4 py-1.5 rounded-full text-xs font-bold bg-[#f4ede0] text-[#332420]">
                Nos ressources pour te simplifier le digital
              </div>

              <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#332420] tracking-tight leading-tight">
                Des Outils Concrets{' '}
                <span className="text-[#18757d] relative inline-block">
                  Pour Avancer
                  <svg className="absolute -bottom-2 left-0 w-full h-3" viewBox="0 0 140 14" fill="none">
                    <path d="M4 10C35 4 105 3 136 10" stroke="#e05a47" strokeWidth="4" strokeLinecap="round" />
                  </svg>
                </span>{' '}
                Pas À Pas
              </h2>

              <p className="text-base text-[#5e4d46] leading-relaxed max-w-lg">
                Chaque ressource est pensée pour t’aider à comprendre, appliquer et progresser rapidement, même si tu n’es pas à l’aise avec l’informatique.
              </p>

              <div className="pt-2 space-y-3">
                <p className="text-sm font-bold text-[#332420]">Choisis le format qui te convient :</p>

                <ul className="space-y-3 text-sm text-[#4a3b35]">
                  <li className="flex items-start gap-2.5">
                    <span className="text-base">📖</span>
                    <span><strong className="text-[#332420]">E-books</strong> : apprends les bases de la digitalisation à ton rythme.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-base">✅</span>
                    <span><strong className="text-[#332420]">Checklists</strong> : garde le cap avec des étapes simples à suivre.</span>
                  </li>
                  <li className="flex items-start gap-2.5">
                    <span className="text-base">🎓</span>
                    <span><strong className="text-[#332420]">Formations en ligne</strong> : passe à l’action grâce à des explications claires et des exemples concrets.</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4">
                <a
                  href="#boutique"
                  className="inline-flex items-center gap-2 px-7 py-4 text-xs font-extrabold text-white bg-[#18757d] hover:bg-[#12595f] rounded-2xl shadow-md uppercase tracking-wider transition-colors"
                >
                  VOIR TOUS LES PRODUITS
                  <ArrowRight className="w-4 h-4" />
                </a>
              </div>

            </div>

            {/* Right Format Cards Grid */}
            <div className="lg:col-span-6 relative">
              
              {/* Pink Zigzag Doodle */}
              <div className="absolute -top-10 left-1/3 text-[#ff00aa] hidden sm:block">
                <svg className="w-24 h-8" viewBox="0 0 100 24" fill="none">
                  <path d="M5 12 L 20 2 L 35 22 L 50 2 L 65 22 L 80 2 L 95 12" stroke="#ff00aa" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 pt-6">
                
                {/* Format Card 1: Checklist */}
                <div className="bg-[#f2f8fc] rounded-3xl p-8 text-center flex flex-col items-center justify-center hover:shadow-lg transition-all border border-[#e2eff7]">
                  <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-[#18757d] shadow-sm mb-4">
                    <FileText className="w-8 h-8" />
                  </div>
                  <h3 className="text-base font-extrabold text-[#18757d]">Checklist</h3>
                </div>

                {/* Format Card 2: Ebooks */}
                <div className="bg-[#f2f8fc] rounded-3xl p-8 text-center flex flex-col items-center justify-center hover:shadow-lg transition-all border border-[#e2eff7]">
                  <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-[#18757d] shadow-sm mb-4">
                    <BookOpen className="w-8 h-8" />
                  </div>
                  <h3 className="text-base font-extrabold text-[#18757d]">Ebooks</h3>
                </div>

                {/* Format Card 3: Formation */}
                <div className="bg-[#f2f8fc] rounded-3xl p-8 text-center flex flex-col items-center justify-center hover:shadow-lg transition-all border border-[#e2eff7]">
                  <div className="w-16 h-16 rounded-full bg-white flex items-center justify-center text-[#18757d] shadow-sm mb-4">
                    <GraduationCap className="w-8 h-8" />
                  </div>
                  <h3 className="text-base font-extrabold text-[#18757d]">Formation</h3>
                </div>

              </div>

            </div>

          </div>

        </div>
      </section>

      {/* NEW SECTION 2: PARCE QUE TON MÉTIER C'EST TON SAVOIR-FAIRE (SCREENSHOT 2) */}
      <section className="py-16 md:py-24 bg-[#f5f1e8] border-t border-[#e8ded0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-block px-4 py-1.5 rounded-full text-xs font-bold bg-[#f4ede0] text-[#332420] mb-4">
              Pourquoi choisir Guides Digitaux ?
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#332420] tracking-tight">
              Parce Que Ton{' '}
              <span className="text-[#18757d] relative inline-block">
                Métier
                <svg className="absolute -bottom-2 left-0 w-full h-3" viewBox="0 0 100 12" fill="none">
                  <path d="M3 8C25 3 75 2 97 9" stroke="#e05a47" strokeWidth="4" strokeLinecap="round" />
                </svg>
              </span>{' '}
              C'est Ton Savoir-Faire
            </h2>

            <p className="mt-4 text-sm sm:text-base text-[#5e4d46]">
              Le digital, c’est le nôtre. 👉 Nos guides sont faits pour toi si tu veux :
            </p>
          </div>

          {/* 3 Pillar Teal Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            
            {/* Pillar Card 1: Attirer */}
            <div className="bg-[#18757d] text-white rounded-3xl p-6 text-center shadow-lg overflow-hidden group hover:-translate-y-1 transition-transform">
              <div className="w-full h-44 relative rounded-2xl overflow-hidden mb-6">
                <Image
                  src="/images/attirer.png"
                  alt="Attirer plus de clients"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="text-2xl font-extrabold mb-2">Attirer</h3>
              <p className="text-xs text-white/90 leading-relaxed px-2">
                plus de clients grâce à une meilleure visibilité en ligne
              </p>
            </div>

            {/* Pillar Card 2: Transformer */}
            <div className="bg-[#18757d] text-white rounded-3xl p-6 text-center shadow-lg overflow-hidden group hover:-translate-y-1 transition-transform">
              <div className="w-full h-44 relative rounded-2xl overflow-hidden mb-6">
                <Image
                  src="/images/transformer.png"
                  alt="Transformer ton savoir-faire"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="text-2xl font-extrabold mb-2">Transformer</h3>
              <p className="text-xs text-white/90 leading-relaxed px-2">
                ton savoir-faire en présence digitale efficace
              </p>
            </div>

            {/* Pillar Card 3: Apprendre */}
            <div className="bg-[#18757d] text-white rounded-3xl p-6 text-center shadow-lg overflow-hidden group hover:-translate-y-1 transition-transform">
              <div className="w-full h-44 relative rounded-2xl overflow-hidden mb-6">
                <Image
                  src="/images/apprendre.png"
                  alt="Apprendre les bons outils"
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <h3 className="text-2xl font-extrabold mb-2">Apprendre</h3>
              <p className="text-xs text-white/90 leading-relaxed px-2">
                à utiliser les bons outils numériques sans perdre des heures
              </p>
            </div>

          </div>

          {/* Avantages clés Section */}
          <div className="pt-4 border-t border-[#e8ded0]">
            <h3 className="text-2xl font-extrabold text-[#332420] mb-8">
              Avantages clés :
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              
              <div className="flex items-center gap-4 bg-white p-5 rounded-2xl border border-[#e8ded0] shadow-2xs">
                <div className="w-12 h-12 rounded-xl bg-blue-50 text-[#18757d] flex items-center justify-center shrink-0">
                  <FileText className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-[#332420] leading-snug">Explications simples</h4>
                  <p className="text-xs text-[#5e4d46]">et illustrées</p>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-white p-5 rounded-2xl border border-[#e8ded0] shadow-2xs">
                <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
                  <Calendar className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-[#332420] leading-snug">Mise à jour régulière</h4>
                  <p className="text-xs text-[#5e4d46]">des contenus</p>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-white p-5 rounded-2xl border border-[#e8ded0] shadow-2xs">
                <div className="w-12 h-12 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center shrink-0">
                  <LifeBuoy className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-[#332420] leading-snug">Support et conseils</h4>
                  <p className="text-xs text-[#5e4d46]">personnalisés</p>
                </div>
              </div>

              <div className="flex items-center gap-4 bg-white p-5 rounded-2xl border border-[#e8ded0] shadow-2xs">
                <div className="w-12 h-12 rounded-xl bg-rose-50 text-[#e05a47] flex items-center justify-center shrink-0">
                  <GraduationCap className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-sm font-extrabold text-[#332420] leading-snug">Résultats concrets</h4>
                  <p className="text-xs text-[#5e4d46]">et mesurables</p>
                </div>
              </div>

            </div>

          </div>

        </div>
      </section>

      {/* NEW SECTION 3: ACTUALITÉS & BLOG + NEWSLETTER (SCREENSHOT 3) */}
      <section id="blog" className="py-16 md:py-24 bg-[#faf8f5] border-t border-[#eee7da]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center max-w-3xl mx-auto mb-14">
            <div className="inline-block px-4 py-1.5 rounded-full text-xs font-bold bg-[#f4ede0] text-[#332420] mb-4">
              Quoi de neuf ?
            </div>

            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#332420] tracking-tight">
              <span className="text-[#e05a47] relative inline-block">
                Actualités
                <svg className="absolute -bottom-2 left-0 w-full h-3" viewBox="0 0 120 12" fill="none">
                  <path d="M3 8C30 3 90 2 117 9" stroke="#e05a47" strokeWidth="4" strokeLinecap="round"/>
                </svg>
              </span>{' '}
              & Blog
            </h2>

            <p className="mt-4 text-sm sm:text-base text-[#5e4d46]">
              Des articles simples et concrets pour avancer à ton rythme — parce que le digital, ça s'apprend sans se prendre la tête.
            </p>
          </div>

          {/* Blog Cards Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-10">
            {recentBlogArticles.map((article) => (
              <Link
                key={article.id}
                href={`/blog/${article.slug}`}
                className="group bg-white rounded-3xl overflow-hidden border border-[#eee7da] shadow-xs hover:shadow-xl hover:border-[#18757d]/40 transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="relative h-48 w-full bg-[#f4ede0] overflow-hidden">
                    <Image
                      src={article.image}
                      alt={article.imageAlt || article.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                    <div className="absolute top-3.5 left-3.5">
                      <span className="inline-block px-3 py-1 rounded-full text-[11px] font-extrabold bg-[#faf8f5]/95 backdrop-blur-xs text-[#332420] uppercase tracking-wider border border-[#eee7da] shadow-xs">
                        {article.category}
                      </span>
                    </div>
                  </div>

                  <div className="p-6">
                    <h3 className="text-base font-extrabold text-[#332420] group-hover:text-[#18757d] transition-colors leading-snug line-clamp-2 mb-3">
                      {article.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-[#5e4d46] line-clamp-2 leading-relaxed">
                      {article.excerpt}
                    </p>
                  </div>
                </div>

                <div className="p-6 pt-0">
                  <div className="flex items-center justify-between text-xs text-slate-500 border-t border-[#eee7da] pt-4 font-medium">
                    <span className="flex items-center gap-1.5">
                      <User className="w-3.5 h-3.5 text-[#18757d]" />
                      {article.author || 'Stéphanie Rocq'}
                    </span>
                    <span className="flex items-center gap-1.5">
                      <Calendar className="w-3.5 h-3.5 text-[#18757d]" />
                      {article.date}
                    </span>
                  </div>
                </div>
              </Link>
            ))}
          </div>

          {/* Bouton vers tous les articles de blog */}
          <div className="text-center mb-16 sm:mb-20">
            <Link
              href="/blog"
              className="inline-flex items-center gap-2.5 px-8 py-4 bg-[#18757d] hover:bg-[#12595f] text-white font-extrabold text-xs sm:text-sm uppercase tracking-wider rounded-2xl shadow-md hover:shadow-lg transition-all duration-200 transform hover:-translate-y-0.5 active:translate-y-0"
            >
              <span>Voir tous les articles de blog</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {/* NEWSLETTER BAR: TÉLÉCHARGE TON MINI-GUIDE OFFERT 🎁 */}
          <div className="bg-[#faf8f5] rounded-3xl p-8 sm:p-10 border border-[#eee7da] shadow-xs flex flex-col lg:flex-row items-center justify-between gap-8">
            
            <div className="flex items-center gap-5 text-center lg:text-left">
              <div className="w-16 h-16 rounded-2xl bg-[#e6f4f3] flex items-center justify-center text-[#18757d] shrink-0 hidden sm:flex">
                <Mail className="w-8 h-8" />
              </div>
              <div>
                <h3 className="text-xl sm:text-2xl font-extrabold text-[#332420] flex items-center gap-2 justify-center lg:justify-start">
                  Télécharge ton mini-guide offert 🎁
                </h3>
                <p className="text-xs sm:text-sm text-[#5e4d46] mt-1">
                  Reçois immédiatement tes conseils gratuits par e-mail.
                </p>
              </div>
            </div>

            {/* Form */}
            <form onSubmit={handleNewsletterSubmit} className="w-full lg:w-auto flex flex-col sm:flex-row items-center gap-3">
              <div className="relative w-full sm:w-80">
                <label htmlFor="newsletter-home-email" className="sr-only">
                  Votre adresse e-mail
                </label>
                <input
                  id="newsletter-home-email"
                  name="email"
                  type="email"
                  placeholder="Votre adresse e-mail"
                  aria-label="Votre adresse e-mail"
                  required
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="w-full bg-[#f4ede0] border border-[#e8ded0] rounded-full px-6 py-3.5 text-sm text-[#332420] placeholder-[#8a7b74] focus:outline-none focus:border-[#18757d] transition-colors"
                />
              </div>

              <button
                type="submit"
                className="w-full sm:w-auto px-7 py-3.5 text-xs font-extrabold text-white bg-[#18757d] hover:bg-[#12595f] rounded-full tracking-wider uppercase transition-colors shrink-0 shadow-md"
              >
                ABONNE-TOI
              </button>
            </form>

            {newsletterSubmitted && (
              <div className="text-xs font-bold text-emerald-600 bg-emerald-50 px-4 py-2 rounded-full">
                ✓ Merci ! Votre mini-guide a été envoyé par email.
              </div>
            )}

          </div>

        </div>
      </section>

      {/* FAQ SECTION */}
      <section className="py-16 md:py-24 bg-[#f5f1e8] border-t border-[#e8ded0]">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="text-center mb-12">
            <h2 className="text-3xl font-extrabold text-[#332420]">Des questions ?</h2>
            <p className="mt-2 text-sm text-[#5e4d46]">Retrouve toutes les réponses sur le fonctionnement des guides et formations.</p>
          </div>

          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-6 border border-[#e8ded0] shadow-2xs">
              <h3 className="text-base font-extrabold text-[#332420] flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-[#18757d] shrink-0" />
                Comment vais-je recevoir mes guides PDF après l'achat ?
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-[#5e4d46] leading-relaxed pl-7">
                Dès la validation de ton paiement via Stripe, tu reçois un email de confirmation et tes fichiers sont directement accessibles dans ton Espace Client. Tu peux les télécharger autant de fois que tu le souhaites.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 border border-[#e8ded0] shadow-2xs">
              <h3 className="text-base font-extrabold text-[#332420] flex items-center gap-2">
                <HelpCircle className="w-5 h-5 text-[#18757d] shrink-0" />
                Est-ce adapté si je n'y connais rien au digital ?
              </h3>
              <p className="mt-2 text-xs sm:text-sm text-[#5e4d46] leading-relaxed pl-7">
                Oui ! Tous nos guides et formations sont écrits sans jargon technique, avec des captures d'écran pas-à-pas spécialement conçues pour les débutants.
              </p>
            </div>
          </div>

        </div>
      </section>

      {/* FOOTER */}
      <Footer />

      {/* MODAL DETAILED PRODUCT PREVIEW */}
      {activeModalProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 sm:p-8 relative border border-[#eee7da] shadow-2xl max-h-[90vh] overflow-y-auto">
            <button
              onClick={() => setActiveModalProduct(null)}
              className="absolute top-5 right-5 p-2 rounded-full text-slate-400 hover:text-[#332420] hover:bg-slate-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-2 mb-3">
              <span className={`px-3 py-1 rounded-full text-[11px] font-extrabold uppercase ${activeModalProduct.badgeBg}`}>
                {activeModalProduct.badge}
              </span>
              <span className="text-xs text-slate-500">{activeModalProduct.pagesOrDuration}</span>
            </div>

            {/* Product Cover Image in Modal */}
            {activeModalProduct.image && (
              <div className="relative w-full h-56 sm:h-64 mb-5 rounded-2xl overflow-hidden bg-[#f4ede0] border border-[#eee7da] shadow-xs">
                <Image
                  src={activeModalProduct.image}
                  alt={activeModalProduct.title}
                  fill
                  className="object-cover object-center"
                />
              </div>
            )}

            <h3 className="text-xl font-extrabold text-[#332420] mb-3">{activeModalProduct.title}</h3>
            <p className="text-xs sm:text-sm text-[#5e4d46] mb-6 leading-relaxed">{activeModalProduct.description}</p>

            <div className="bg-[#faf8f5] rounded-2xl p-5 border border-[#eee7da] mb-6">
              <h4 className="text-xs font-bold uppercase tracking-wider text-[#18757d] mb-3">
                Inclus dans votre commande :
              </h4>
              <ul className="space-y-2 text-xs text-[#332420]">
                {activeModalProduct.features.map((feat, idx) => (
                  <li key={idx} className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-[#18757d] shrink-0 mt-0.5" />
                    <span>{feat}</span>
                  </li>
                ))}
              </ul>
            </div>

            <div className="flex items-center justify-between border-t border-[#eee7da] pt-5">
              <div>
                <span className="text-2xl font-extrabold text-[#332420]">{activeModalProduct.price} €</span>
                {activeModalProduct.originalPrice && (
                  <span className="ml-2 text-xs text-slate-400 line-through font-semibold">
                    {activeModalProduct.originalPrice} €
                  </span>
                )}
              </div>

              <button
                onClick={() => {
                  const id = activeModalProduct.id;
                  setActiveModalProduct(null);
                  handleCheckout(id);
                }}
                className="px-6 py-3 text-xs font-extrabold text-white bg-[#18757d] hover:bg-[#12595f] rounded-xl shadow-md transition-all flex items-center gap-2 uppercase tracking-wider"
              >
                Commander avec Stripe
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
}
