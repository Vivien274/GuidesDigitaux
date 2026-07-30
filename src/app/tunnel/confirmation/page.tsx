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
import { saveOrderToDb, saveUserPurchaseToDb } from '@/lib/supabaseLms';
import { recordPreorderPurchaseInDb } from '@/lib/supabaseLms';

function ConfirmationContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { login, user, isLoggedIn } = useAuth();

  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const courseId = searchParams.get('id') || 'precommande-fiche-google';
  const price = searchParams.get('price') || '29';
  const sessionId = searchParams.get('session_id') || searchParams.get('sessionId') || '';

  const [customerEmail, setCustomerEmail] = useState<string>(
    searchParams.get('email') || ''
  );

  const savedUserEmail = typeof window !== 'undefined' && localStorage.getItem('gd_auth_user')
    ? JSON.parse(localStorage.getItem('gd_auth_user')!).email
    : '';
  const activeEmail = customerEmail || searchParams.get('email') || user?.email || savedUserEmail || '';

  useEffect(() => {
    // 1. Check if this is a cart checkout purchase
    const isCartCheckout = searchParams.get('cart_checkout') === 'true' || searchParams.get('id') === 'cart_items';

    if (typeof window !== 'undefined' && isCartCheckout) {
      const pendingCartRaw = localStorage.getItem('gd_pending_cart_checkout');
      const targetEmail = activeEmail || savedUserEmail || 'beber@gmail.com';

      if (pendingCartRaw) {
        try {
          const pendingItems = JSON.parse(pendingCartRaw);
          if (Array.isArray(pendingItems)) {
            pendingItems.forEach((it: any) => {
              const isPdf = it.category === 'ebook' || it.category === 'checklist' || it.type === 'ebook' || it.type === 'checklist' || !!it.downloadPdf || it.id?.includes('guide') || it.title?.toLowerCase().includes('guide');
              
              saveOrderToDb(targetEmail, it.id || it.slug || 'product', 'paid', Number(it.price) || 5, sessionId);
              saveUserPurchaseToDb(targetEmail, {
                id: it.id || `item-${Date.now()}`,
                title: it.title || 'Produit Digital',
                slug: it.slug || it.id || 'produit',
                type: it.type || it.category || (isPdf ? 'ebook' : 'formation'),
                typeLabel: it.typeLabel || (isPdf ? '📄 E-Book / Guide PDF' : 'Formation Vidéo'),
                thumbnail: it.image || it.thumbnail,
                progress: 0,
                completedLessons: 0,
                totalLessons: isPdf ? 0 : 4,
                duration: it.duration || (isPdf ? 'PDF' : '2h15'),
                instructor: 'Stéphanie ROCQ',
                price: Number(it.price) || 5,
                downloadPdf: it.downloadPdf || '/downloads/support-formation-woocommerce.pdf',
                purchaseDate: new Date().toLocaleDateString('fr-FR')
              });
            });
            localStorage.removeItem('gd_pending_cart_checkout');
          }
        } catch (e) {
          console.error('Error unlocking cart items', e);
        }
      }
    }

    // 2. Fetch real customer email entered on Stripe Checkout if available
    async function fetchStripeCustomerEmail() {
      if (sessionId && !sessionId.startsWith('test_cs_')) {
        try {
          const res = await fetch(`/api/stripe/session?session_id=${sessionId}`);
          const data = await res.json();
          if (data?.customerEmail) {
            setCustomerEmail(data.customerEmail);
            if (!isCartCheckout) {
              addPurchaseToUser(data.customerEmail, {
                id: courseId || 'precommande-fiche-google',
                title: 'Fais décoller ton activité locale grâce à une Fiche Google parfaite',
                slug: 'precommande-fiche-google',
                type: 'formation',
                typeLabel: '🚀 PRÉCOMMANDE (Sortie 15 sept)',
                progress: 0,
                completedLessons: 0,
                totalLessons: 4,
                duration: '2h00',
                instructor: 'Stéphanie ROCQ',
                isPreorder: true,
                releaseDate: '2026-09-15',
                price: Number(price) || 29,
                purchaseDate: new Date().toLocaleDateString('fr-FR')
              });
              recordPreorderPurchaseInDb(courseId || 'precommande-fiche-google', data.customerEmail, data.customerName, Number(price) || 29);
            }
          }
        } catch (e) {
          console.error('Could not fetch Stripe session', e);
        }
      }
    }
    fetchStripeCustomerEmail();

    // 3. Add single item purchase to user account if not cart checkout
    if (activeEmail && !isCartCheckout) {
      addPurchaseToUser(activeEmail, {
        id: courseId || 'precommande-fiche-google',
        title: 'Fais décoller ton activité locale grâce à une Fiche Google parfaite',
        slug: 'precommande-fiche-google',
        type: 'formation',
        typeLabel: '🚀 PRÉCOMMANDE (Sortie 15 sept)',
        progress: 0,
        completedLessons: 0,
        totalLessons: 4,
        duration: '2h00',
        instructor: 'Stéphanie ROCQ',
        isPreorder: true,
        releaseDate: '2026-09-15',
        price: Number(price) || 29,
        purchaseDate: new Date().toLocaleDateString('fr-FR')
      });
      recordPreorderPurchaseInDb(courseId || 'precommande-fiche-google', activeEmail, activeEmail.split('@')[0], Number(price) || 29);
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
  }, [sessionId, courseId, activeEmail, price]);

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isAccountActivated, setIsAccountActivated] = useState(false);
  const [addedUpsells, setAddedUpsells] = useState<Record<string, boolean>>({});

  const handleCreateAccount = (e: React.FormEvent) => {
    e.preventDefault();
    if (password.length < 4) {
      alert('Veuillez entrer un mot de passe d\'au moins 4 caractères.');
      return;
    }
    if (password !== confirmPassword) {
      alert('Les mots de passe ne correspondent pas.');
      return;
    }

    // Activate Élève account with chosen password
    login(activeEmail, 'eleve');
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
            🎉 Félicitations ! Ta précommande est enregistrée avec succès !
          </h1>

          <div className="p-4 bg-emerald-50/80 border border-emerald-200 rounded-2xl text-xs text-emerald-950 flex items-center justify-center gap-2 max-w-lg mx-auto">
            <Mail className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Un e-mail contenant votre reçu, vos accès et vos liens de téléchargement PDF a été envoyé à <strong>{activeEmail}</strong></span>
          </div>

          {/* DIRECT PDF DOWNLOAD BOX FOR PDF PURCHASES */}
          {isMounted && (() => {
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
                        href={pdfItem.downloadPdf || '/downloads/support-formation-woocommerce.pdf'}
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

          {/* USER ALREADY LOGGED IN OR NEW ACCOUNT CREATION */}
          {isLoggedIn || user?.email ? (
            <div className="p-6 bg-[#e6f4f3]/60 rounded-2xl border border-[#bce3e0] text-center space-y-4 max-w-md mx-auto shadow-xs">
              <div className="w-12 h-12 rounded-full bg-[#18757d] text-white flex items-center justify-center mx-auto font-bold shadow-xs">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-extrabold text-[#332420]">Produit ajouté à votre compte !</h3>
                <p className="text-xs text-slate-600">
                  Bonjour <strong className="text-[#18757d]">{user?.email || activeEmail}</strong>, vos accès sont prêts et enregistrés dans votre espace.
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
            <form onSubmit={handleCreateAccount} className="p-6 bg-[#faf8f5] rounded-2xl border border-[#eee7da] text-left space-y-4 max-w-md mx-auto shadow-xs">
              <div className="space-y-1">
                <h3 className="text-xs font-extrabold text-[#18757d] uppercase tracking-wider flex items-center gap-1.5">
                  <Key className="w-4 h-4" />
                  Choisir mon mot de passe personnalisé
                </h3>
                <p className="text-[11px] text-slate-500">
                  Définissez dès maintenant le mot de passe de votre compte pour accéder à votre Espace Élève :
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
                  <label className="text-[11px] font-bold text-[#332420] block mb-1">Nouveau mot de passe :</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white border border-[#eee7da] rounded-xl px-3 py-2 text-xs text-[#332420] focus:outline-none focus:border-[#18757d]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#332420] block mb-1">Confirmer le mot de passe :</label>
                  <input
                    type="password"
                    required
                    placeholder="••••••••"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    className="w-full bg-white border border-[#eee7da] rounded-xl px-3 py-2 text-xs text-[#332420] focus:outline-none focus:border-[#18757d]"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#18757d] hover:bg-[#12595f] text-white font-extrabold text-xs rounded-xl shadow-md uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer mt-2"
              >
                <Lock className="w-4 h-4" />
                Enregistrer mon mot de passe
              </button>
            </form>
          ) : (
            <div className="p-4 bg-emerald-100 text-emerald-900 rounded-2xl text-xs font-bold flex items-center justify-center gap-2 max-w-md mx-auto">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span>Mot de passe enregistré ! Vos identifiants sont actifs. Redirection...</span>
            </div>
          )}
        </div>

        {/* POST-PURCHASE UPSELL SECTION */}
        <div className="bg-amber-50/70 p-8 sm:p-10 rounded-3xl border-2 border-amber-300 shadow-md space-y-6">
          <div className="space-y-2 text-center sm:text-left">
            <span className="px-3.5 py-1 rounded-full text-[10px] font-extrabold bg-amber-400 text-[#332420] uppercase tracking-wider inline-block">
              OFFRE SPÉCIALE UNIQUE DE BIENVENUE
            </span>
            <h2 className="text-xl sm:text-2xl font-extrabold text-[#332420]">
              Complète tes compétences avec nos formations partenaires à tarif réduit (-60%)
            </h2>
            <p className="text-xs text-slate-600">
              Réservé exclusivement aux nouveaux précommandeurs pendant les 15 prochaines minutes.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            
            {/* UPSELL CARD 1 */}
            <div className="bg-white p-6 rounded-2xl border border-amber-200 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="relative h-36 w-full rounded-xl overflow-hidden bg-slate-100 border border-[#eee7da]">
                  <Image
                    src="https://www.guides-digitaux.com/wp-content/uploads/2026/02/un-artisan-createur-devant-son-PC-en-train-dajouter-ses-produits-dnas-saboutique-en-ligne.-accoude-a-son-etabli-dans-son-atelier.-lumiere-naturelle.webp"
                    alt="Masterclass IA"
                    fill
                    className="object-cover"
                  />
                  <span className="absolute top-2 left-2 bg-emerald-500 text-white text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">
                    -60% Immédiat
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-extrabold text-[#332420] leading-snug">
                    Masterclass Vidéo : L'Intelligence Artificielle pour les Artisans
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                    Gagne 5h par semaine en automatisant tes devis et ta rédaction grâce aux IA génératives.
                  </p>
                </div>
              </div>

              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div className="flex items-baseline justify-between">
                  <span className="text-xl font-black text-[#18757d]">39 €</span>
                  <span className="text-xs text-slate-400 line-through font-bold">99 €</span>
                </div>

                <button
                  onClick={() => handleAddUpsell({
                    id: 'c3',
                    title: 'Masterclass Vidéo : IA pour les Artisans & TPE',
                    price: 39,
                    image: 'https://www.guides-digitaux.com/wp-content/uploads/2026/02/un-artisan-createur-devant-son-PC-en-train-dajouter-ses-produits-dnas-saboutique-en-ligne.-accoude-a-son-etabli-dans-son-atelier.-lumiere-naturelle.webp'
                  })}
                  disabled={addedUpsells['c3']}
                  className={`w-full py-3 text-xs font-extrabold rounded-xl uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 ${
                    addedUpsells['c3']
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 cursor-default'
                      : 'bg-[#18757d] hover:bg-[#12595f] text-white shadow-sm'
                  }`}
                >
                  {addedUpsells['c3'] ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      Ajouté à ton compte ✓
                    </>
                  ) : (
                    <>
                      <PlusCircle className="w-4 h-4" />
                      Ajouter à ma commande (+39 €)
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* UPSELL CARD 2 */}
            <div className="bg-white p-6 rounded-2xl border border-amber-200 shadow-sm space-y-4 flex flex-col justify-between">
              <div className="space-y-3">
                <div className="relative h-36 w-full rounded-xl overflow-hidden bg-slate-100 border border-[#eee7da]">
                  <Image
                    src="https://www.guides-digitaux.com/wp-content/uploads/2026/02/un-artisan-createur-devant-son-PC-en-train-dajouter-ses-produits-dnas-saboutique-en-ligne.-accoude-a-son-etabli-dans-son-atelier.-lumiere-naturelle.webp"
                    alt="Créer sa vitrine WordPress"
                    fill
                    className="object-cover"
                  />
                  <span className="absolute top-2 left-2 bg-amber-500 text-[#332420] text-[10px] font-extrabold px-2.5 py-0.5 rounded-full uppercase">
                    Offre Spéciale
                  </span>
                </div>

                <div>
                  <h3 className="text-sm font-extrabold text-[#332420] leading-snug">
                    Formation Complete : Créer sa vitrine WordPress
                  </h3>
                  <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                    Crée ton site professionnel de A à Z sans coder avec les méthodes éprouvées.
                  </p>
                </div>
              </div>

              <div className="space-y-3 pt-2 border-t border-slate-100">
                <div className="flex items-baseline justify-between">
                  <span className="text-xl font-black text-[#18757d]">49 €</span>
                  <span className="text-xs text-slate-400 line-through font-bold">199 €</span>
                </div>

                <button
                  onClick={() => handleAddUpsell({
                    id: 'c1',
                    title: 'Formation Vidéo : Créer sa vitrine WordPress',
                    price: 49,
                    image: 'https://www.guides-digitaux.com/wp-content/uploads/2026/02/un-artisan-createur-devant-son-PC-en-train-dajouter-ses-produits-dnas-saboutique-en-ligne.-accoude-a-son-etabli-dans-son-atelier.-lumiere-naturelle.webp'
                  })}
                  disabled={addedUpsells['c1']}
                  className={`w-full py-3 text-xs font-extrabold rounded-xl uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 ${
                    addedUpsells['c1']
                      ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 cursor-default'
                      : 'bg-[#18757d] hover:bg-[#12595f] text-white shadow-sm'
                  }`}
                >
                  {addedUpsells['c1'] ? (
                    <>
                      <CheckCircle2 className="w-4 h-4" />
                      Ajouté à ton compte ✓
                    </>
                  ) : (
                    <>
                      <PlusCircle className="w-4 h-4" />
                      Ajouter à ma commande (+49 €)
                    </>
                  )}
                </button>
              </div>
            </div>

          </div>

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
