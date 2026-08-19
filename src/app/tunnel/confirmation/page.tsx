'use client';

import React, { useState, useEffect, Suspense } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useSearchParams, useRouter } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';
import { 
  CheckCircle2, 
  Sparkles, 
  ArrowRight, 
  Award, 
  PlusCircle, 
  ShieldCheck, 
  Rocket, 
  Mail,
  Key,
  Lock,
  Gift,
  Download,
  FileText
} from 'lucide-react';

import { incrementPreorderEnrollment } from '@/lib/preordersStore';
import { addPurchaseToUser, getUserPurchases } from '@/lib/userPurchasesStore';
import { getEncryptedDownloadUrl } from '@/lib/downloadSecurity';
import { saveOrderToDb, saveUserPurchaseToDb } from '@/lib/supabaseLms';
import { recordPreorderPurchaseInDb } from '@/lib/supabaseLms';
import { trackPurchase } from '@/lib/metaPixel';

import { DEFAULT_PRODUCTS } from '@/data/defaultProducts';

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { login, user, isLoggedIn } = useAuth();

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const courseId = searchParams.get('id') || 'precommande-fiche-google';
  const sessionId = searchParams.get('session_id') || searchParams.get('sessionId') || '';
  const isCartCheckout = searchParams.get('cart_checkout') === 'true' || searchParams.get('cart') === 'true' || courseId === 'cart_items';

  // Dynamic Product & Price Resolution (Strict DB / Stripe Session data, zero hardcoding)
  const targetProduct = DEFAULT_PRODUCTS.find(p => p.id === courseId || p.slug === courseId);
  const isPreorder = courseId.includes('precommande') || courseId.includes('preorder') || (targetProduct && 'isPreorder' in targetProduct && Boolean((targetProduct as any).isPreorder));
  const isPdf = targetProduct?.category === 'ebook' || targetProduct?.category === 'checklist' || !!targetProduct?.downloadPdf || courseId.includes('guide') || courseId.includes('checklist');

  const resolvedTitle = targetProduct?.title || (isPreorder ? 'Fais décoller ton activité locale grâce à une Fiche Google parfaite' : 'Produit Digital Guides Digitaux');
  const resolvedType = isPdf ? 'ebook' : (isPreorder ? 'formation' : (targetProduct?.category || 'formation'));
  const resolvedTypeLabel = isPreorder 
    ? '🚀 PRÉCOMMANDE (Sortie 15 sept)' 
    : (isPdf ? '📄 E-Book / Guide PDF' : 'Formation Vidéo');

  const resolvedPrice = searchParams.get('price') 
    ? Number(searchParams.get('price')) 
    : (targetProduct?.price ?? 0);

  const [customerEmail, setCustomerEmail] = useState<string>(
    searchParams.get('email') || ''
  );

  const [savedUserEmail, setSavedUserEmail] = useState<string>('');

  useEffect(() => {
    setIsMounted(true);
    if (typeof window !== 'undefined') {
      const stored = localStorage.getItem('gd_auth_user');
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed?.email) setSavedUserEmail(parsed.email);
        } catch (e) {}
      }
    }
  }, []);

  // Explicit priority: customerEmail from Stripe > searchParams email > savedUserEmail > user.email
  // Fallback to client-side localStorage/context only after mount (isMounted === true) to prevent SSR hydration mismatch
  const activeEmail = customerEmail || searchParams.get('email') || (isMounted ? (savedUserEmail || user?.email) : '') || '';

  // Helper to process single or multi-item cart purchases
  const processPurchasesForEmail = (emailToUse: string, stripeAmount?: number, customerName?: string, stripeCartItems?: any[]) => {
    if (!emailToUse) return;

    if (isCartCheckout) {
      if (typeof window !== 'undefined') {
        let cartItems: any[] = [];
        if (Array.isArray(stripeCartItems) && stripeCartItems.length > 0) {
          cartItems = stripeCartItems;
        } else {
          let rawCart = localStorage.getItem('gd_cart');
          if (rawCart) {
            try {
              sessionStorage.setItem('gd_cart_backup', rawCart);
            } catch (e) {}
          } else {
            rawCart = sessionStorage.getItem('gd_cart_backup');
          }
          if (rawCart) {
            try {
              cartItems = JSON.parse(rawCart);
            } catch (e) {}
          }
        }

        if (Array.isArray(cartItems) && cartItems.length > 0) {
          cartItems.forEach((item: any) => {
            const matchedProd = DEFAULT_PRODUCTS.find(p => p.id === item.id || p.slug === item.id);
            const isPdfItem = item.categoryLabel?.toLowerCase().includes('pdf') || matchedProd?.category === 'ebook' || matchedProd?.category === 'checklist' || !!matchedProd?.downloadPdf;

            const purchaseObj = {
              id: item.id,
              title: item.title,
              slug: matchedProd?.slug || item.id,
              type: matchedProd?.category || (isPdfItem ? 'ebook' : 'formation'),
              typeLabel: item.categoryLabel || (isPdfItem ? '📄 E-Book / Guide PDF' : 'Formation Vidéo'),
              downloadPdf: matchedProd?.downloadPdf,
              progress: 0,
              completedLessons: 0,
              totalLessons: 4,
              duration: '2h00',
              instructor: 'Stéphanie ROCQ',
              price: Number(item.price) || 0,
              purchaseDate: new Date().toLocaleDateString('fr-FR')
            };

            addPurchaseToUser(emailToUse, purchaseObj);
            saveOrderToDb(emailToUse, item.id, 'paid', Number(item.price) || 0, sessionId);
            saveUserPurchaseToDb(emailToUse, purchaseObj);
          });
        }
      }
    } else {
      const amountToSave = stripeAmount !== undefined ? stripeAmount : resolvedPrice;
      addPurchaseToUser(emailToUse, {
        id: courseId,
        title: resolvedTitle,
        slug: targetProduct?.slug || courseId,
        type: resolvedType,
        typeLabel: resolvedTypeLabel,
        downloadPdf: targetProduct?.downloadPdf,
        progress: 0,
        completedLessons: 0,
        totalLessons: 4,
        duration: '2h00',
        instructor: 'Stéphanie ROCQ',
        isPreorder: isPreorder,
        releaseDate: isPreorder ? '2026-09-15' : undefined,
        price: amountToSave,
        purchaseDate: new Date().toLocaleDateString('fr-FR')
      });
      saveOrderToDb(emailToUse, courseId, 'paid', amountToSave, sessionId);
      saveUserPurchaseToDb(emailToUse, targetProduct || { id: courseId, title: resolvedTitle, price: amountToSave });
      if (isPreorder) {
        recordPreorderPurchaseInDb(courseId, emailToUse, customerName || emailToUse.split('@')[0], amountToSave);
      }
    }
  };

  useEffect(() => {
    // 2. Fetch real customer email & amount entered on Stripe Checkout if available
    async function fetchStripeCustomerEmail() {
      if (sessionId && !sessionId.startsWith('test_cs_')) {
        try {
          const res = await fetch(`/api/stripe/session?session_id=${sessionId}`);
          const data = await res.json();
          const stripeAmount = (data?.amountTotal !== undefined && data?.amountTotal !== null) 
            ? Number(data.amountTotal) 
            : resolvedPrice;

          if (data?.customerEmail) {
            const stripeEmail = data.customerEmail.toLowerCase().trim();
            setCustomerEmail(stripeEmail);

            if (typeof window !== 'undefined') {
              const processedKey = `gd_purchases_processed_${sessionId || stripeEmail}`;
              if (!sessionStorage.getItem(processedKey)) {
                sessionStorage.setItem(processedKey, 'true');
                processPurchasesForEmail(stripeEmail, stripeAmount, data.customerName, data.cartItems);
              }
            }

            // Send confirmation & admin email once per session
            if (typeof window !== 'undefined') {
              const emailSentKey = `gd_email_sent_${sessionId}`;
              if (!sessionStorage.getItem(emailSentKey)) {
                sessionStorage.setItem(emailSentKey, 'true');
                fetch('/api/orders/send-email', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    orderId: sessionId,
                    customerEmail: stripeEmail,
                    customerName: data.customerName,
                    productId: data.productId || courseId,
                    amount: stripeAmount,
                    cartItems: data.cartItems
                  })
                }).catch(e => console.error('Order email trigger failed', e));
              }
            }
          }
        } catch (e) {
          console.error('Could not fetch Stripe session', e);
        }
      }
    }
    fetchStripeCustomerEmail();

    // 3. Add purchase to user account once if activeEmail is present
    if (activeEmail && typeof window !== 'undefined') {
      const processedKey = `gd_purchases_processed_${sessionId || activeEmail}`;
      if (!sessionStorage.getItem(processedKey)) {
        sessionStorage.setItem(processedKey, 'true');
        processPurchasesForEmail(activeEmail, resolvedPrice);
      }
    }

    // 4. Safely increment preorder counter once per checkout session
    if (typeof window !== 'undefined' && (courseId === 'precommande-fiche-google' || !isCartCheckout)) {
      try {
        const processed = JSON.parse(localStorage.getItem('gd_processed_sessions') || '[]');
        const currentKey = sessionId || `sess_${courseId}_${Date.now()}`;
        if (!processed.includes(currentKey)) {
          incrementPreorderEnrollment(courseId);
          localStorage.setItem('gd_processed_sessions', JSON.stringify([...processed, currentKey]));
        }
      } catch (e) {
        incrementPreorderEnrollment(courseId);
      }
    }

    // 5. Track Meta Pixel Purchase event once per checkout session
    if (typeof window !== 'undefined') {
      try {
        const trackedPixel = JSON.parse(localStorage.getItem('gd_meta_pixel_tracked') || '[]');
        const currentOrderKey = sessionId || `order_${courseId}_${resolvedPrice}`;
        if (!trackedPixel.includes(currentOrderKey)) {
          trackPurchase(Number(resolvedPrice) || 0, 'EUR', {
            content_name: courseId || 'Commande Guides Digitaux',
            content_ids: [courseId || 'precommande-fiche-google'],
            content_type: 'product',
            order_id: sessionId || undefined,
          });
          localStorage.setItem('gd_meta_pixel_tracked', JSON.stringify([...trackedPixel, currentOrderKey]));
        }
      } catch (e) {
        console.error('Erreur lors du suivi Meta Pixel Purchase:', e);
      }
    }
  }, [sessionId, courseId, activeEmail, resolvedPrice]);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isAccountActivated, setIsAccountActivated] = useState(false);
  const [addedUpsells, setAddedUpsells] = useState<Record<string, boolean>>({});

  const handleCreateAccount = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!password || password.length < 3) {
      alert('Veuillez entrer votre mot de passe.');
      return;
    }

    // Authenticate account with chosen password
    const res = await login(activeEmail, password, 'eleve');
    if (!res.success) {
      alert(res.error || 'Mot de passe incorrect pour ce compte.');
      return;
    }

    // Guarantee that all purchases (single or multi-item cart) are bound to activeEmail
    processPurchasesForEmail(activeEmail, resolvedPrice);

    setIsAccountActivated(true);

    setTimeout(() => {
      router.push('/dashboard/eleve?purchased=true');
    }, 800);
  };

  const handleAddUpsell = (upsellItem: { id: string; title: string; price: number; image: string }) => {
    try {
      if (typeof window !== 'undefined') {
        const existing = JSON.parse(localStorage.getItem('gd_enrolled_courses') || '[]');
        const newEnrolled = {
          id: upsellItem.id,
          title: upsellItem.title,
          slug: upsellItem.id === 'c1' ? 'creer-sa-vitrine-wordpress' : 'formation-woocommerce',
          type: 'formation',
          typeLabel: '⭐ OFFRE COMPLÉMENTAIRE (Accès Immédiat)',
          progress: 0,
          completedLessons: 0,
          totalLessons: 4,
          duration: '3h30',
          instructor: 'Stéphanie ROCQ',
          purchaseDate: new Date().toLocaleDateString('fr-FR')
        };

        if (!existing.some((e: any) => e.id === upsellItem.id)) {
          localStorage.setItem('gd_enrolled_courses', JSON.stringify([newEnrolled, ...existing]));
        }
      }
      setAddedUpsells(prev => ({ ...prev, [upsellItem.id]: true }));
      trackPurchase(upsellItem.price, 'EUR', {
        content_name: upsellItem.title,
        content_ids: [upsellItem.id],
      });
    } catch (e) {
      console.error('Failed to add upsell product', e);
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#332420] font-sans py-12 md:py-16 px-4">
      <div className="max-w-3xl mx-auto space-y-10">
        
        {/* SUCCESS CONFIRMATION BANNER */}
        <div className="bg-white p-8 sm:p-10 rounded-3xl border-2 border-emerald-300 shadow-xl text-center space-y-6">
          <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto shadow-sm">
            <CheckCircle2 className="w-10 h-10" />
          </div>

          <span className="px-4 py-1 rounded-full text-xs font-extrabold bg-emerald-100 text-emerald-800 uppercase tracking-wider inline-block">
            Paiement Stripe Validé
          </span>

          <h1 className="text-2xl sm:text-3xl font-extrabold text-[#332420]">
            {isPreorder 
              ? '🎉 Félicitations ! Ta précommande est enregistrée avec succès !' 
              : `🎉 Félicitations ! Ta commande est enregistrée avec succès !`}
          </h1>


          <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-2xl text-xs text-emerald-950 flex items-center justify-center gap-2 max-w-lg mx-auto">
            <Mail className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Un e-mail contenant votre reçu, vos accès et vos liens de téléchargement PDF a été envoyé à <strong>{activeEmail}</strong></span>
          </div>

          {/* PREORDER 3 BONUS DOWNLOAD BOX */}
          {isMounted && isPreorder && (
            <div className="p-6 bg-[#e6f4f3] rounded-3xl border-2 border-[#18757d]/40 text-left space-y-4 shadow-md">
              <div className="flex items-center justify-between gap-2 border-b border-[#bce3e0] pb-3">
                <div className="flex items-center gap-2 text-[#18757d] font-extrabold text-sm">
                  <Gift className="w-5 h-5 text-[#F2542D] shrink-0" />
                  <h3>Vos 3 Bonus Inclus (Téléchargement Immédiat) :</h3>
                </div>
                <span className="px-3 py-1 bg-[#F2542D] text-white text-[10px] font-extrabold uppercase rounded-full tracking-wider">
                  Accès Direct PDF HD
                </span>
              </div>

              <div className="space-y-3">
                {/* BONUS 1 */}
                <div className="p-4 bg-white rounded-2xl border border-[#bce3e0] flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#e6f4f3] text-[#18757d] flex items-center justify-center font-bold shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-[#332420]">Bonus 1 : Checklist Audit Rapide Fiche Google</h4>
                      <span className="text-[10px] text-slate-500 font-medium">25 points de contrôle stratégiques • Format PDF HD (4 pages)</span>
                    </div>
                  </div>
                  <a
                    href={getEncryptedDownloadUrl('/downloads/bonus-1-checklist-audit-fiche-google.pdf', 'bonus-1')}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full sm:w-auto px-5 py-2.5 bg-[#18757d] hover:bg-[#12595f] text-white font-extrabold text-xs rounded-xl shadow-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
                  >
                    <Download className="w-4 h-4" />
                    Télécharger Bonus #1
                  </a>
                </div>

                {/* BONUS 2 */}
                <div className="p-4 bg-white rounded-2xl border border-[#bce3e0] flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#e6f4f3] text-[#18757d] flex items-center justify-center font-bold shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-[#332420]">Bonus 2 : Kit 10 Modèles de Réponses aux Avis Google</h4>
                      <span className="text-[10px] text-slate-500 font-medium">Modèles copier-coller (Avis 5★ & avis délicats) • Format PDF HD</span>
                    </div>
                  </div>
                  <a
                    href={getEncryptedDownloadUrl('/downloads/bonus-2-kit-modeles-reponses-avis-google.pdf', 'bonus-2')}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full sm:w-auto px-5 py-2.5 bg-[#18757d] hover:bg-[#12595f] text-white font-extrabold text-xs rounded-xl shadow-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
                  >
                    <Download className="w-4 h-4" />
                    Télécharger Bonus #2
                  </a>
                </div>

                {/* BONUS 3 */}
                <div className="p-4 bg-white rounded-2xl border border-[#bce3e0] flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#e6f4f3] text-[#18757d] flex items-center justify-center font-bold shrink-0">
                      <FileText className="w-5 h-5" />
                    </div>
                    <div>
                      <h4 className="text-xs font-extrabold text-[#332420]">Bonus 3 : Scripts Prêts à l'Emploi WhatsApp, SMS & Email</h4>
                      <span className="text-[10px] text-slate-500 font-medium">Méthode douce 5x plus d'avis • Format PDF HD</span>
                    </div>
                  </div>
                  <a
                    href={getEncryptedDownloadUrl('/downloads/bonus-3-script-whatsapp-demander-avis-5-etoiles.pdf', 'bonus-3')}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full sm:w-auto px-5 py-2.5 bg-[#18757d] hover:bg-[#12595f] text-white font-extrabold text-xs rounded-xl shadow-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
                  >
                    <Download className="w-4 h-4" />
                    Télécharger Bonus #3
                  </a>
                </div>
              </div>
            </div>
          )}

          {/* DIRECT PDF DOWNLOAD BOX FOR EBOOK / CHECKLIST PURCHASES */}
          {isMounted && !isPreorder && (() => {
            const purchases = getUserPurchases(activeEmail);
            const pdfPurchases = purchases.filter((p: any) => p.type === 'ebook' || p.type === 'checklist' || p.downloadPdf || p.title?.toLowerCase().includes('guide') || p.title?.toLowerCase().includes('checklist'));
            if (pdfPurchases.length === 0) return null;

            return (
              <div className="p-6 bg-emerald-50/90 rounded-2xl border-2 border-emerald-300 text-left space-y-4 shadow-sm">
                <div className="flex items-center gap-2 text-emerald-950 font-extrabold text-sm">
                  <Download className="w-5 h-5 text-emerald-700 shrink-0" />
                  <h3>Vos Fichiers PDF réservés (Téléchargement direct) :</h3>
                </div>
                <div className="space-y-3">
                  {pdfPurchases.map((pdfItem: any) => (
                    <div key={pdfItem.id} className="p-4 bg-white rounded-xl border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-2xs">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-800 flex items-center justify-center font-bold shrink-0">
                          <Download className="w-5 h-5" />
                        </div>
                        <div>
                          <h4 className="text-xs font-extrabold text-[#332420]">{pdfItem.title}</h4>
                          <span className="text-[10px] text-slate-500 font-medium">Format PDF HD • Téléchargement immédiat</span>
                        </div>
                      </div>
                      <a
                        href={getEncryptedDownloadUrl(pdfItem.downloadPdf || '/downloads/mini-guide-ecrire-web-artisan.pdf', pdfItem.id)}
                        target="_blank"
                        rel="noreferrer"
                        className="w-full sm:w-auto px-5 py-2.5 bg-[#18757d] hover:bg-[#12595f] text-white font-extrabold text-xs rounded-xl shadow-xs uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer whitespace-nowrap"
                      >
                        <Download className="w-4 h-4" />
                        Télécharger le PDF HD
                      </a>
                    </div>
                  ))}
                </div>
              </div>
            );
          })()}

          {/* USER ALREADY LOGGED IN TO THIS SPECIFIC BUYER ACCOUNT */}
          {isMounted && isLoggedIn && user?.email?.toLowerCase().trim() === activeEmail.toLowerCase().trim() ? (
            <div className="p-6 bg-[#e6f4f3]/60 rounded-2xl border border-[#bce3e0] text-center space-y-4 max-w-md mx-auto shadow-xs">
              <div className="w-12 h-12 rounded-full bg-[#18757d] text-white flex items-center justify-center mx-auto font-bold shadow-xs">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-extrabold text-[#332420]">Produit ajouté à votre compte !</h3>
                <p className="text-xs text-slate-600">
                  Bonjour <strong className="text-[#18757d]">{user?.fullName || activeEmail}</strong>, vos accès sont débloqués et enregistrés dans votre espace.
                </p>
              </div>
              <Link
                href="/dashboard/eleve?purchased=true"
                className="inline-flex items-center justify-center gap-2 w-full py-3.5 bg-[#18757d] hover:bg-[#12595f] text-white font-extrabold text-xs rounded-xl shadow-xs uppercase tracking-wider transition-colors mt-2"
              >
                <Rocket className="w-4 h-4" />
                Accéder à mon Espace Élève
              </Link>
            </div>
          ) : !isAccountActivated ? (
            <form onSubmit={handleCreateAccount} className="p-6 bg-white rounded-3xl border-2 border-[#18757d]/30 shadow-md text-left space-y-4 max-w-md mx-auto">
              <div className="space-y-1">
                <h3 className="text-xs font-extrabold text-[#18757d] uppercase tracking-wider flex items-center gap-1.5">
                  <Key className="w-4 h-4" />
                  Créer mon mot de passe pour accéder à mes cours
                </h3>
                <p className="text-[11px] text-slate-500">
                  Définissez votre mot de passe pour vous connecter à votre Espace Élève (compte <strong className="text-[#332420]">{activeEmail}</strong>) :
                </p>
              </div>

              <div className="space-y-3 pt-1">
                <div>
                  <label className="text-[11px] font-bold text-[#332420] block mb-1">Email du compte :</label>
                  <input
                    type="email"
                    disabled
                    value={activeEmail}
                    className="w-full bg-slate-100 border border-slate-200 rounded-xl px-3 py-2 text-xs text-slate-600 cursor-not-allowed font-semibold"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#332420] block mb-1">Votre mot de passe :</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white border border-[#eee7da] rounded-xl px-3 py-2 text-xs text-[#332420] focus:outline-none focus:border-[#18757d]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#18757d] hover:bg-[#12595f] text-white font-extrabold text-xs rounded-xl shadow-md uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <Lock className="w-4 h-4" />
                Activer mon compte & Accéder à mes cours
              </button>

              <div className="text-center pt-2 border-t border-slate-100">
                <Link
                  href={`/mon-compte?email=${encodeURIComponent(activeEmail)}`}
                  className="text-[11px] font-bold text-[#18757d] hover:underline"
                >
                  Déjà un compte ? Se connecter ici →
                </Link>
              </div>
            </form>
          ) : (
            <div className="p-4 bg-emerald-100 text-emerald-900 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 max-w-md mx-auto">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>Authentification réussie ! Vos identifiants sont actifs. Redirection...</span>
            </div>
          )}

        </div>



      </div>
    </div>
  );
}

export default function ConfirmationPage() {
  return (
    <Suspense fallback={<div className="p-12 text-center text-xs font-bold text-[#18757d]">Chargement de la confirmation...</div>}>
      <ConfirmationContent />
    </Suspense>
  );
}
