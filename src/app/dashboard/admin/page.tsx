'use client';

import React, { useState, useEffect } from 'react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useAuth, UserRole } from '@/context/AuthContext';
import Link from 'next/link';
import { 
  Shield, 
  DollarSign, 
  Users, 
  ShoppingBag, 
  GraduationCap, 
  Trash2,
  RefreshCw,
  Plus,
  Rocket,
  UserCheck,
  BookOpen,
  Tag,
  BarChart2,
  X,
  ExternalLink,
  Download,
  Eye,
  Receipt,
  Clock,
  Package,
  Mail,
  Send,
  CheckCircle2
} from 'lucide-react';

export interface UserPurchaseDetail {
  id: string;
  title: string;
  price: number;
  date: string;
  type: string;
  slug?: string;
  downloadPdf?: string;
}

interface AdminUserItem {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  purchasesCount: number;
  totalSpent: number;
  purchasesDetails: UserPurchaseDetail[];
}

import { purgeAllCoursesData, getStoredCourses } from '@/lib/coursesStore';
import { purgeAllPreorders } from '@/lib/preordersStore';
import { purgeAllUserPurchases, getUserPurchases } from '@/lib/userPurchasesStore';
import { getEncryptedDownloadUrl } from '@/lib/downloadSecurity';
import { supabase } from '@/lib/supabaseLms';
import { DEFAULT_PRODUCTS } from '@/data/defaultProducts';

function resolveProductInfo(rawTitle?: string, productId?: string, slug?: string, rawDownloadPdf?: string, price?: number) {
  const isGeneric = !rawTitle || 
    rawTitle.trim().length === 0 ||
    rawTitle.toLowerCase() === 'produit digital' || 
    rawTitle.toLowerCase() === 'achat boutique' || 
    rawTitle.toLowerCase() === 'commande produit digital' ||
    rawTitle.toLowerCase() === 'commande digital' ||
    rawTitle.toLowerCase() === 'formation lms' ||
    rawTitle.toLowerCase() === 'guide digital' ||
    rawTitle.toLowerCase() === 'mini-guide / produit digital';

  const lookupKey = productId || slug || (isGeneric ? '' : rawTitle) || '';

  let finalTitle = rawTitle;
  let finalDownloadPdf = rawDownloadPdf;
  let finalSlug = slug || productId;

  // 1. Match in DEFAULT_PRODUCTS by id, slug, or title
  const prodMatch = DEFAULT_PRODUCTS.find(p => 
    p.id === lookupKey || 
    p.slug === lookupKey || 
    (productId && p.id === productId) || 
    (slug && p.slug === slug) ||
    (rawTitle && p.title.toLowerCase() === rawTitle.toLowerCase())
  );

  if (prodMatch) {
    finalTitle = prodMatch.title;
    if (!finalDownloadPdf && prodMatch.downloadPdf) {
      finalDownloadPdf = prodMatch.downloadPdf;
    }
    if (!finalSlug && prodMatch.slug) {
      finalSlug = prodMatch.slug;
    }
  } else {
    // 2. Match in Courses Store
    try {
      const coursesList = getStoredCourses();
      const courseMatch = coursesList.find(c => 
        c.id === lookupKey || 
        (productId && c.id === productId) ||
        (rawTitle && c.title.toLowerCase() === rawTitle.toLowerCase())
      );

      if (courseMatch) {
        finalTitle = courseMatch.title;
      }
    } catch (e) {}
  }

  // 3. Fallback: match by price if title is generic or missing
  if (isGeneric || !finalTitle || finalTitle.toLowerCase() === 'guide digital') {
    if (lookupKey && lookupKey.length > 2 && lookupKey !== 'guide digital') {
      finalTitle = lookupKey
        .replace(/[-_]/g, ' ')
        .replace(/\b\w/g, char => char.toUpperCase());
    } else if (price) {
      if (price === 5) {
        finalTitle = "Mini-guide : Écrire pour le web quand on est artisan";
      } else if (price === 3) {
        finalTitle = "Mini-Guide : Comprendre ses stats sans être data scientist";
      } else if (price === 15) {
        finalTitle = "Checklist : Sécurité & Anti-Spam WordPress";
      } else if (price === 29) {
        finalTitle = "Ebook : Doubler sa visibilité locale";
      } else if (price === 199 || price === 99) {
        finalTitle = "Formation : Créer sa vitrine en ligne avec WordPress";
      } else {
        finalTitle = "Guide Digital & Ressource Pro";
      }
    } else {
      finalTitle = "Guide Digital & Ressource Pro";
    }
  }

  return {
    title: finalTitle,
    downloadPdf: finalDownloadPdf,
    slug: finalSlug
  };
}

import { useRouter } from 'next/navigation';

export default function SuperadminDashboardPage() {
  const { user, role } = useAuth();
  const router = useRouter();

  const [usersList, setUsersList] = useState<AdminUserItem[]>([]);
  const [stats, setStats] = useState({
    totalRevenue: 0,
    totalMembers: 0,
    totalOrders: 0
  });

  const [newFormateurName, setNewFormateurName] = useState('');
  const [newFormateurEmail, setNewFormateurEmail] = useState('');
  const [showCreateFormateur, setShowCreateFormateur] = useState(false);

  const [selectedUserForDetails, setSelectedUserForDetails] = useState<AdminUserItem | null>(null);

  // Email Management States
  const [manualEmailTarget, setManualEmailTarget] = useState('');
  const [manualNameTarget, setManualNameTarget] = useState('');
  const [manualProductTarget, setManualProductTarget] = useState('precommande-fiche-google');
  const [manualAmountTarget, setManualAmountTarget] = useState<number>(29);
  const [isSendingEmail, setIsSendingEmail] = useState(false);
  const [emailStatusMsg, setEmailStatusMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [resendStatusPerUser, setResendStatusPerUser] = useState<Record<string, string>>({});

  const handleSendManualEmail = async (overrideEmail?: string, overrideProductId?: string, overrideAmount?: number) => {
    const targetEmail = (overrideEmail || manualEmailTarget).trim();
    const targetProduct = overrideProductId || manualProductTarget;
    const targetAmount = overrideAmount !== undefined ? overrideAmount : manualAmountTarget;
    const targetName = manualNameTarget.trim();

    if (!targetEmail || !targetEmail.includes('@')) {
      alert('Veuillez saisir une adresse e-mail valide.');
      return;
    }

    setIsSendingEmail(true);
    setEmailStatusMsg(null);
    if (overrideEmail) {
      setResendStatusPerUser(prev => ({ ...prev, [overrideEmail]: 'Envoi...' }));
    }

    try {
      const foundProduct = DEFAULT_PRODUCTS.find(p => p.id === targetProduct || p.slug === targetProduct);
      const productTitle = foundProduct?.title || 'Fais décoller ton activité locale grâce à une Fiche Google parfaite';

      const res = await fetch('/api/admin/send-manual-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          customerEmail: targetEmail,
          customerName: targetName || targetEmail.split('@')[0],
          productId: targetProduct,
          productTitle: productTitle,
          amount: targetAmount,
          orderId: `MANUAL-ADMIN-${Date.now()}`
        })
      });

      const data = await res.json();
      if (res.ok && data?.success) {
        setEmailStatusMsg({ type: 'success', text: data.message || `E-mail et liens de téléchargement envoyés à ${targetEmail}` });
        if (overrideEmail) {
          setResendStatusPerUser(prev => ({ ...prev, [overrideEmail]: 'Envoyé ✓' }));
        }
      } else {
        setEmailStatusMsg({ type: 'error', text: data?.error || 'Erreur lors de l’envoi de l’e-mail.' });
        if (overrideEmail) {
          setResendStatusPerUser(prev => ({ ...prev, [overrideEmail]: 'Erreur' }));
        }
      }
    } catch (e: any) {
      setEmailStatusMsg({ type: 'error', text: `Erreur technique : ${e?.message || 'Connexion au serveur échouée'}` });
      if (overrideEmail) {
        setResendStatusPerUser(prev => ({ ...prev, [overrideEmail]: 'Erreur' }));
      }
    } finally {
      setIsSendingEmail(false);
    }
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedUser = localStorage.getItem('gd_auth_user');
      const parsedRole = savedUser ? JSON.parse(savedUser).role : role;
      if (!savedUser && !user) {
        router.push('/mon-compte');
        return;
      }
      if (parsedRole !== 'superadmin' && role !== 'superadmin') {
        router.push('/dashboard/eleve');
        return;
      }
    }
  }, [user, role, router]);

  // Load real accounts & purchases via secure server API route (bypassing client RLS restrictions)
  const loadDashboardData = async () => {
    try {
      const res = await fetch('/api/admin/dashboard-stats');
      if (res.ok) {
        const data = await res.json();
        if (data?.usersList && data?.stats) {
          let mergedUsers = [...data.usersList];
          let mergedStats = { ...data.stats };

          // Fallback merge for client-only local test purchases
          if (typeof window !== 'undefined') {
            const localPurchasesStr = localStorage.getItem('gd_user_purchases');
            if (localPurchasesStr) {
              try {
                const localPurchases = JSON.parse(localPurchasesStr);
                const accountsMap = new Map(mergedUsers.map(u => [u.email.toLowerCase().trim(), u]));

                Object.entries(localPurchases).forEach(([emailKey, items]: [string, any]) => {
                  const em = emailKey.toLowerCase().trim();
                  if (em && Array.isArray(items) && items.length > 0) {
                    items.forEach((item: any) => {
                      const amount = item.price ? Number(item.price) : 0;
                      const existing = accountsMap.get(em);
                      if (existing) {
                        if (existing.purchasesCount === 0) {
                          existing.purchasesCount += 1;
                          existing.totalSpent += amount;
                          mergedStats.totalOrders += 1;
                          mergedStats.totalRevenue += amount;
                        }
                      } else {
                        const newUserItem = {
                          id: `lp-${Date.now()}_${Math.random()}`,
                          name: em.split('@')[0],
                          email: em,
                          role: 'eleve' as UserRole,
                          purchasesCount: 1,
                          totalSpent: amount
                        };
                        accountsMap.set(em, newUserItem);
                        mergedStats.totalOrders += 1;
                        mergedStats.totalRevenue += amount;
                      }
                    });
                  }
                });

                mergedUsers = Array.from(accountsMap.values());
                mergedStats.totalMembers = mergedUsers.length;
              } catch (e) {}
            }
          }

          setUsersList(mergedUsers);
          setStats(mergedStats);
          return;
        }
      }
    } catch (err) {
      console.error('Failed to load dashboard stats via API', err);
    }

    try {
      const accountsMap = new Map<string, AdminUserItem>();


      // 1. Fetch all registered user profiles from Supabase DB
      const { data: profiles } = await supabase.from('profiles').select('*');
      if (profiles && Array.isArray(profiles)) {
        profiles.forEach((p: any) => {
          const em = (p.email || '').toLowerCase().trim();
          if (em) {
            accountsMap.set(em, {
              id: p.id || `sp-${Date.now()}`,
              name: p.full_name || em.split('@')[0],
              email: em,
              role: p.role || 'eleve',
              purchasesCount: 0,
              totalSpent: 0,
              purchasesDetails: []
            });
          }
        });
      }

      let totalRev = 0;
      let totalOrdersCount = 0;

      // Helper to resolve product price from store
      const resolveProductPrice = (productId?: string, fallbackPrice?: number): number => {
        if (fallbackPrice && fallbackPrice > 0) return fallbackPrice;
        if (productId) {
          const prod = DEFAULT_PRODUCTS.find(p => p.id === productId || p.slug === productId);
          if (prod?.price) return prod.price;
        }
        return 0;
      };

      // 2. Fetch sales from orders table
      const { data: orders } = await supabase.from('orders').select('*');
      if (orders && Array.isArray(orders)) {
        orders.forEach((ord: any) => {
          const em = (ord.customer_email || ord.user_email || ord.email || '').toLowerCase().trim();
          const rawPrice = ord.amount ? Number(ord.amount) : (ord.total_amount_cents ? ord.total_amount_cents / 100 : (ord.price ? Number(ord.price) : 0));
          const amount = resolveProductPrice(ord.product_id, rawPrice);

          totalOrdersCount += 1;
          totalRev += amount;

          const info = resolveProductInfo(
            ord.product_title || ord.title || ord.product_name,
            ord.product_id,
            ord.slug,
            ord.download_pdf || ord.pdf_url,
            amount
          );

          const detailItem: UserPurchaseDetail = {
            id: ord.id || `ord-${Math.random().toString(36).substring(2, 7)}`,
            title: info.title,
            price: amount,
            date: ord.created_at || ord.purchase_date || new Date().toISOString(),
            type: ord.category || ord.type || 'Achat Boutique',
            slug: info.slug,
            downloadPdf: info.downloadPdf
          };

          if (em) {
            let userObj = accountsMap.get(em);
            if (!userObj) {
              userObj = {
                id: ord.id || `o-${Date.now()}`,
                name: ord.customer_name || em.split('@')[0],
                email: em,
                role: 'eleve',
                purchasesCount: 0,
                totalSpent: 0,
                purchasesDetails: []
              };
              accountsMap.set(em, userObj);
            }
            if (!userObj.purchasesDetails.some(d => d.title === detailItem.title || d.id === detailItem.id)) {
              userObj.purchasesCount += 1;
              userObj.totalSpent += amount;
              userObj.purchasesDetails.push(detailItem);
            }
          }
        });
      }

      // 3. Fetch sales from enrollments table
      const { data: enrollments } = await supabase.from('enrollments').select('*');
      if (enrollments && Array.isArray(enrollments)) {
        enrollments.forEach((enr: any) => {
          const em = (enr.user_email || enr.customer_email || enr.email || '').toLowerCase().trim();
          const rawPrice = enr.price ? Number(enr.price) : (enr.amount ? Number(enr.amount) : 0);
          const amount = resolveProductPrice(enr.product_id || enr.course_id, rawPrice);

          const info = resolveProductInfo(
            enr.course_title || enr.title || enr.item_title,
            enr.course_id || enr.product_id,
            enr.course_slug || enr.slug,
            enr.download_pdf,
            amount
          );

          const detailItem: UserPurchaseDetail = {
            id: enr.id || `enr-${Math.random().toString(36).substring(2, 7)}`,
            title: info.title,
            price: amount,
            date: enr.enrolled_at || enr.created_at || new Date().toISOString(),
            type: enr.category || enr.item_type || 'Formation LMS',
            slug: info.slug,
            downloadPdf: info.downloadPdf
          };

          if (em) {
            let userObj = accountsMap.get(em);
            if (!userObj) {
              userObj = {
                id: enr.id || `e-${Date.now()}`,
                name: enr.user_name || em.split('@')[0],
                email: em,
                role: 'eleve',
                purchasesCount: 0,
                totalSpent: 0,
                purchasesDetails: []
              };
              accountsMap.set(em, userObj);
            }
            if (!userObj.purchasesDetails.some(d => d.title === detailItem.title || d.id === detailItem.id)) {
              userObj.purchasesCount += 1;
              userObj.totalSpent += amount;
              userObj.purchasesDetails.push(detailItem);
              totalOrdersCount += 1;
              totalRev += amount;
            }
          }
        });
      }

      // 4. Fetch preorder_buyers table from Supabasepabase
      const { data: prebuyers } = await supabase.from('preorder_buyers').select('*');
      if (prebuyers && Array.isArray(prebuyers)) {
        prebuyers.forEach((pb: any) => {
          const em = (pb.customer_email || pb.email || pb.user_email || '').toLowerCase().trim();
          const amount = pb.amount ? Number(pb.amount) : 29;

          const info = resolveProductInfo(
            pb.campaign_title || pb.title || 'Précommande Formation',
            pb.campaign_id || pb.product_id,
            pb.slug,
            undefined,
            amount
          );

          const detailItem: UserPurchaseDetail = {
            id: pb.id || `pb-${Math.random().toString(36).substring(2, 7)}`,
            title: info.title,
            price: amount,
            date: pb.created_at || new Date().toISOString(),
            type: 'Précommande',
            slug: info.slug
          };

          if (em) {
            let userObj = accountsMap.get(em);
            if (!userObj) {
              userObj = {
                id: pb.id || `pb-${Date.now()}`,
                name: pb.customer_name || em.split('@')[0],
                email: em,
                role: 'eleve',
                purchasesCount: 0,
                totalSpent: 0,
                purchasesDetails: []
              };
              accountsMap.set(em, userObj);
            }
            if (!userObj.purchasesDetails.some(d => d.title === detailItem.title || d.id === detailItem.id)) {
              userObj.purchasesCount += 1;
              userObj.totalSpent += amount;
              userObj.purchasesDetails.push(detailItem);
              totalOrdersCount += 1;
              totalRev += amount;
            }
          }
        });
      }

      // 5. Merge localStorage purchases and gd_enrolled_courses across all client sessions
      if (typeof window !== 'undefined') {
        try {
          const enrolledRaw = localStorage.getItem('gd_enrolled_courses');
          if (enrolledRaw) {
            const list = JSON.parse(enrolledRaw);
            if (Array.isArray(list)) {
              list.forEach((item: any) => {
                const em = (item.email || item.customerEmail || (localStorage.getItem('gd_auth_user') ? JSON.parse(localStorage.getItem('gd_auth_user')!).email : '')).toLowerCase().trim();
                if (em) {
                  const price = item.price || 29;
                  const info = resolveProductInfo(item.title, item.id, item.slug, item.downloadPdf, price);
                  let userObj = accountsMap.get(em);
                  if (!userObj) {
                    userObj = {
                      id: `loc-${Date.now()}`,
                      name: em.split('@')[0],
                      email: em,
                      role: 'eleve',
                      purchasesCount: 0,
                      totalSpent: 0,
                      purchasesDetails: []
                    };
                    accountsMap.set(em, userObj);
                  }
                  if (!userObj.purchasesDetails.some(d => d.title === info.title || d.id === item.id)) {
                    userObj.purchasesCount += 1;
                    userObj.totalSpent += price;
                    userObj.purchasesDetails.push({
                      id: item.id || `loc-${Date.now()}`,
                      title: info.title,
                      price: price,
                      date: item.purchaseDate || new Date().toISOString(),
                      type: item.typeLabel || item.type || 'Formation / Guide',
                      slug: info.slug,
                      downloadPdf: info.downloadPdf
                    });
                  }
                }
              });
            }
          }
        } catch (e) {}

        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          if (key && key.startsWith('gd_user_purchases_')) {
            const em = key.replace('gd_user_purchases_', '').toLowerCase().trim();
            if (em && em !== 'anonymous') {
              const localItems = getUserPurchases(em);
              if (localItems && localItems.length > 0) {
                let userObj = accountsMap.get(em);
                if (!userObj) {
                  userObj = {
                    id: `loc-${Date.now()}`,
                    name: em.split('@')[0],
                    email: em,
                    role: 'eleve',
                    purchasesCount: 0,
                    totalSpent: 0,
                    purchasesDetails: []
                  };
                  accountsMap.set(em, userObj);
                }
                localItems.forEach(item => {
                  const price = item.price || 29;
                  const info = resolveProductInfo(item.title, item.id, item.slug, item.downloadPdf, price);
                  if (!userObj!.purchasesDetails.some(d => d.title === info.title || d.id === item.id)) {
                    userObj!.purchasesCount += 1;
                    userObj!.totalSpent += price;
                    userObj!.purchasesDetails.push({
                      id: item.id || `loc-${Date.now()}`,
                      title: info.title,
                      price: price,
                      date: item.purchaseDate || new Date().toISOString(),
                      type: item.typeLabel || item.type || 'Guide Digital',
                      slug: info.slug,
                      downloadPdf: info.downloadPdf
                    });
                  }
                });
              }
            }
          }
        }
      }

      // 4. Fetch sales from preorder_buyers table
      try {
        const { data: preorderBuyers } = await supabase.from('preorder_buyers').select('*');
        if (preorderBuyers && Array.isArray(preorderBuyers)) {
          preorderBuyers.forEach((pb: any) => {
            const em = (pb.customer_email || pb.email || '').toLowerCase().trim();
            const rawPrice = pb.price ? Number(pb.price) : 0;
            const amount = resolveProductPrice(pb.campaign_id || pb.course_id, rawPrice);

            if (em) {
              const existing = accountsMap.get(em);
              if (existing) {
                if (existing.purchasesCount === 0) {
                  existing.purchasesCount += 1;
                  existing.totalSpent += amount;
                  totalOrdersCount += 1;
                  totalRev += amount;
                }
              } else {
                accountsMap.set(em, {
                  id: pb.id || `pb-${Date.now()}`,
                  name: pb.customer_name || em.split('@')[0],
                  email: em,
                  role: 'eleve',
                  purchasesCount: 1,
                  totalSpent: amount,
                  purchasesDetails: []
                });
                totalOrdersCount += 1;
                totalRev += amount;
              }
            }
          });
        }
      } catch (pbErr) {
        console.warn('Preorder buyers load notice:', pbErr);
      }


      // 5. Aggregate local purchases storage (fallback for client-only test purchases)
      if (typeof window !== 'undefined') {
        const localPurchasesStr = localStorage.getItem('gd_user_purchases');
        if (localPurchasesStr) {
          try {
            const localPurchases = JSON.parse(localPurchasesStr);
            Object.entries(localPurchases).forEach(([emailKey, items]: [string, any]) => {
              const em = emailKey.toLowerCase().trim();
              if (em && Array.isArray(items) && items.length > 0) {
                items.forEach((item: any) => {
                  const amount = item.price ? Number(item.price) : 29;
                  const existing = accountsMap.get(em);
                  if (existing) {
                    if (existing.purchasesCount === 0) {
                      existing.purchasesCount += 1;
                      existing.totalSpent += amount;
                      totalOrdersCount += 1;
                      totalRev += amount;
                    }
                  } else {
                    accountsMap.set(em, {
                      id: `lp-${Date.now()}_${Math.random()}`,
                      name: em.split('@')[0],
                      email: em,
                      role: 'eleve',
                      purchasesCount: 1,
                      totalSpent: amount,
                      purchasesDetails: []
                    });
                    totalOrdersCount += 1;
                    totalRev += amount;
                  }
                });
              }
            });
          } catch (e) {}
        }
      }

      const uniqueList = Array.from(accountsMap.values());


      setUsersList(uniqueList);
      setStats({
        totalRevenue: totalRev,
        totalMembers: uniqueList.length,
        totalOrders: totalOrdersCount
      });
    } catch (err) {
      console.error('Failed to load admin dashboard data', err);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleCreateFormateur = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFormateurEmail) return;

    const normalizedEmail = newFormateurEmail.toLowerCase().trim();
    const formateurName = newFormateurName || normalizedEmail.split('@')[0];

    // Save directly to Supabase profiles table
    try {
      await supabase.from('profiles').upsert({
        email: normalizedEmail,
        full_name: formateurName,
        role: 'formateur',
        updated_at: new Date().toISOString()
      }, { onConflict: 'email' });
    } catch (e) {
      console.warn('Error upserting formateur profile in Supabase', e);
    }

    setNewFormateurName('');
    setNewFormateurEmail('');
    setShowCreateFormateur(false);
    await loadDashboardData();
    alert(`Compte Formateur créé et enregistré dans Supabase BDD pour ${normalizedEmail} !`);
  };

  const handleRoleChange = async (userEmail: string, newRole: UserRole) => {
    // Update local state immediately for UI responsiveness
    setUsersList(
      usersList.map((u) => (u.email === userEmail ? { ...u, role: newRole } : u))
    );

    // Persist role update in Supabase DB profiles table
    try {
      await supabase.from('profiles').update({
        role: newRole,
        updated_at: new Date().toISOString()
      }).eq('email', userEmail.toLowerCase().trim());
    } catch (e) {
      console.warn('Failed to update user role in Supabase profiles', e);
    }
  };

  const handleResetPurchasesOnly = async () => {
    if (confirm('Voulez-vous réinitialiser TOUS les achats et commandes effectués pour chaque profil élève à zéro (0 €) ?')) {
      if (typeof window !== 'undefined') {
        purgeAllUserPurchases();
      }
      try {
        await supabase.from('enrollments').delete().neq('id', '00000000-0000-0000-0000-000000000000');
      } catch (e) {}
      loadDashboardData();
      alert('Tous les achats élèves ont été réinitialisés à zéro pour l\'ensemble des profils !');
    }
  };

  const handleResetData = () => {
    if (confirm('Voulez-vous vraiment réinitialiser toutes les données de test à zéro ? Vos formations et précommandes précédentes seront effacées.')) {
      if (typeof window !== 'undefined') {
        purgeAllCoursesData();
        purgeAllPreorders();
        purgeAllUserPurchases();
        localStorage.clear();
      }
      loadDashboardData();
      alert('Base de données entièrement nettoyée ! Vous repartez de zéro.');
    }
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#332420] font-sans">
      <Header />

      {/* BANNER HEADER */}
      <section className="py-10 bg-gradient-to-b from-[#fdf2f0] to-[#faf8f5] border-b border-[#e8ded0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-[#e05a47] text-white flex items-center justify-center font-extrabold text-2xl shadow-md border-2 border-white">
              <Shield className="w-8 h-8 text-white" />
            </div>
            <div>
              <span className="inline-block px-3 py-0.5 rounded-full text-[11px] font-extrabold bg-rose-100 text-[#e05a47] uppercase tracking-wider mb-1">
                Espace Superadmin / Direction
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#332420]">
                Centre de Contrôle <span className="text-[#e05a47]">Guides Digitaux</span>
              </h1>
              <p className="text-xs text-[#5e4d46] font-medium">
                Pilotage des ventes réelles, gestion des rôles utilisateurs et modération de la plateforme.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <button
              onClick={loadDashboardData}
              className="px-4 py-2 bg-[#18757d] hover:bg-[#12595f] text-white text-xs font-bold rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 text-white" />
              Actualiser les ventes BDD
            </button>

            <button
              onClick={handleResetPurchasesOnly}
              className="px-4 py-2 bg-white border border-[#e8ded0] text-xs font-bold text-[#5e4d46] hover:text-[#18757d] hover:border-[#18757d]/30 rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5 text-[#18757d]" />
              Vider les achats élèves (0 €)
            </button>

            <button
              onClick={handleResetData}
              className="px-4 py-2 bg-white border border-[#e8ded0] text-xs font-bold text-[#5e4d46] hover:text-[#e05a47] hover:border-rose-300 rounded-xl transition-colors flex items-center gap-1.5 shadow-2xs cursor-pointer"
            >
              <Trash2 className="w-3.5 h-3.5 text-rose-500" />
              Réinitialiser tout à zéro
            </button>
          </div>

        </div>
      </section>

      {/* MAIN CONTENT */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">
          
          {/* Superadmin Full Access Shortcuts Hub */}
          <div className="bg-gradient-to-br from-[#18757d]/10 via-white to-[#f4ede0] p-6 sm:p-8 rounded-3xl border-2 border-[#18757d]/30 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="px-3 py-1 bg-[#18757d] text-white text-xs font-black rounded-full uppercase tracking-wider">
                  Accès Intégral Superadmin
                </span>
                <h2 className="text-xl sm:text-2xl font-black text-[#332420] mt-2">
                  Studio Formations, Catalogue & Espace Élève
                </h2>
                <p className="text-xs sm:text-sm text-[#5e4d46] font-medium">
                  En tant que Superadmin, vous possédez un accès illimité et direct à l'ensemble du LMS sans besoin de créer un compte formateur séparé.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-2">
              <Link
                href="/dashboard/admin/produits"
                className="bg-white p-4 rounded-2xl border border-[#eee7da] hover:border-[#e05a47] hover:shadow-md transition-all flex items-center gap-3 group"
              >
                <div className="w-10 h-10 rounded-xl bg-rose-50 text-[#e05a47] flex items-center justify-center group-hover:bg-[#e05a47] group-hover:text-white transition-colors">
                  <ShoppingBag className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-[#332420] group-hover:text-[#e05a47]">Fiches Produits & Tarifs</h4>
                  <p className="text-[11px] text-slate-500">Gérer la boutique, prix et offres</p>
                </div>
              </Link>

              <Link
                href="/dashboard/admin/blog"
                className="bg-white p-4 rounded-2xl border border-[#eee7da] hover:border-[#18757d] hover:shadow-md transition-all flex items-center gap-3 group"
              >
                <div className="w-10 h-10 rounded-xl bg-[#e6f4f3] text-[#18757d] flex items-center justify-center group-hover:bg-[#18757d] group-hover:text-white transition-colors">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-[#332420] group-hover:text-[#18757d]">Articles de Blog</h4>
                  <p className="text-[11px] text-slate-500">Rédiger & gérer les articles</p>
                </div>
              </Link>

              <Link
                href="/dashboard/formateur"
                className="bg-white p-4 rounded-2xl border border-[#eee7da] hover:border-[#18757d] hover:shadow-md transition-all flex items-center gap-3 group"
              >
                <div className="w-10 h-10 rounded-xl bg-[#e6f4f3] text-[#18757d] flex items-center justify-center group-hover:bg-[#18757d] group-hover:text-white transition-colors">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-[#332420] group-hover:text-[#18757d]">Studio Formations LMS</h4>
                  <p className="text-[11px] text-slate-500">Gérer tous les cours vidéo</p>
                </div>
              </Link>

              <Link
                href="/dashboard/admin/stats"
                className="bg-white p-4 rounded-2xl border border-[#eee7da] hover:border-purple-500 hover:shadow-md transition-all flex items-center gap-3 group"
              >
                <div className="w-10 h-10 rounded-xl bg-purple-50 text-purple-600 flex items-center justify-center group-hover:bg-purple-600 group-hover:text-white transition-colors">
                  <BarChart2 className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-[#332420] group-hover:text-purple-600">Statistiques & Audience</h4>
                  <p className="text-[11px] text-slate-500">Visiteurs, pages vues & paniers abandonnés</p>
                </div>
              </Link>

              <Link
                href="/dashboard/admin/marketing"
                className="bg-white p-4 rounded-2xl border border-[#eee7da] hover:border-amber-500 hover:shadow-md transition-all flex items-center gap-3 group"
              >
                <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center group-hover:bg-amber-600 group-hover:text-white transition-colors">
                  <Tag className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-[#332420] group-hover:text-amber-600">Marketing & Codes Promo</h4>
                  <p className="text-[11px] text-slate-500">Créer des remises % ou €</p>
                </div>
              </Link>

              <Link
                href="/dashboard/admin/coaching"
                className="bg-white p-4 rounded-2xl border border-[#eee7da] hover:border-emerald-600 hover:shadow-md transition-all flex items-center gap-3 group"
              >
                <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-700 flex items-center justify-center group-hover:bg-emerald-600 group-hover:text-white transition-colors">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-[#332420] group-hover:text-emerald-600">Suivi Coaching (2 RDV)</h4>
                  <p className="text-[11px] text-slate-500">Valider les RDV & verrouiller agenda</p>
                </div>
              </Link>

              <Link
                href="/dashboard/admin/produits/editeur"
                className="bg-white p-4 rounded-2xl border border-[#eee7da] hover:border-[#e05a47] hover:shadow-md transition-all flex items-center gap-3 group"
              >
                <div className="w-10 h-10 rounded-xl bg-rose-50 text-[#e05a47] flex items-center justify-center group-hover:bg-[#e05a47] group-hover:text-white transition-colors">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-[#332420] group-hover:text-[#e05a47]">Créer un Produit</h4>
                  <p className="text-[11px] text-slate-500">Ajouter une fiche produit</p>
                </div>
              </Link>

              <Link
                href="/dashboard/admin/blog/editeur"
                className="bg-white p-4 rounded-2xl border border-[#eee7da] hover:border-[#18757d] hover:shadow-md transition-all flex items-center gap-3 group"
              >
                <div className="w-10 h-10 rounded-xl bg-[#e6f4f3] text-[#18757d] flex items-center justify-center group-hover:bg-[#18757d] group-hover:text-white transition-colors">
                  <Plus className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-[#332420] group-hover:text-[#18757d]">Rédiger un Article</h4>
                  <p className="text-[11px] text-slate-500">Publier sur le blog</p>
                </div>
              </Link>

              <Link
                href="/dashboard/eleve"
                className="bg-white p-4 rounded-2xl border border-[#eee7da] hover:border-[#18757d] hover:shadow-md transition-all flex items-center gap-3 group"
              >
                <div className="w-10 h-10 rounded-xl bg-[#e6f4f3] text-[#18757d] flex items-center justify-center group-hover:bg-[#18757d] group-hover:text-white transition-colors">
                  <UserCheck className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-xs font-extrabold text-[#332420] group-hover:text-[#18757d]">Espace Élève / Achats</h4>
                  <p className="text-[11px] text-slate-500">Tester la vue apprenant</p>
                </div>
              </Link>
            </div>
          </div>

          {/* Revenue & Sales KPI Overview */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-3xl border border-[#eee7da] shadow-2xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
                <DollarSign className="w-6 h-6" />
              </div>
              <div>
                <span className="text-2xl font-extrabold text-[#18757d]">
                  {stats.totalRevenue.toFixed(2).replace('.', ',')} €
                </span>
                <span className="text-xs text-slate-500 font-bold block">Chiffre d'Affaires Total (Réel)</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-[#eee7da] shadow-2xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-[#e6f4f3] text-[#18757d] flex items-center justify-center">
                <Users className="w-6 h-6" />
              </div>
              <div>
                <span className="text-2xl font-extrabold text-[#332420]">{usersList.length}</span>
                <span className="text-xs text-slate-500 font-bold block">Comptes Utilisateurs Réels</span>
              </div>
            </div>

            <div className="bg-white p-6 rounded-3xl border border-[#eee7da] shadow-2xs flex items-center gap-4">
              <div className="w-12 h-12 rounded-2xl bg-rose-50 text-[#e05a47] flex items-center justify-center">
                <ShoppingBag className="w-6 h-6" />
              </div>
              <div>
                <span className="text-2xl font-extrabold text-[#332420]">{stats.totalOrders}</span>
                <span className="text-xs text-slate-500 font-bold block">Commandes Inscrites</span>
              </div>
            </div>
          </div>

          {/* SUPERADMIN EMAIL MANAGEMENT CONTROL PANEL */}
          <div className="bg-white p-8 rounded-3xl border-2 border-[#18757d]/30 shadow-md space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#eee7da] pb-4 gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="px-3 py-1 bg-[#18757d] text-white text-[10px] font-black uppercase rounded-full tracking-wider">
                    MODULE SUPERADMIN
                  </span>
                  <h2 className="text-xl font-extrabold text-[#332420] flex items-center gap-2">
                    <Mail className="w-5 h-5 text-[#18757d]" />
                    Gestion & Envoi des E-mails de Commande Client
                  </h2>
                </div>
                <p className="text-xs text-slate-500 font-medium">
                  Testez les envois, vérifiez les e-mails de vos clientes ou renvoyez manuellement une confirmation avec tous les bonus PDF en 1 clic.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs font-bold bg-[#faf8f5] px-3.5 py-2 rounded-xl border border-[#eee7da]">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>Service d'envoi d'e-mails : <strong className="text-[#18757d]">Actif</strong></span>
              </div>
            </div>

            {/* Live Feedback Alert */}
            {emailStatusMsg && (
              <div className={`p-4 rounded-2xl text-xs font-extrabold flex items-center justify-between gap-3 ${
                emailStatusMsg.type === 'success'
                  ? 'bg-emerald-50 text-emerald-900 border border-emerald-300'
                  : 'bg-rose-50 text-rose-900 border border-rose-300'
              }`}>
                <div className="flex items-center gap-2">
                  {emailStatusMsg.type === 'success' ? <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" /> : <X className="w-4 h-4 text-rose-600 shrink-0" />}
                  <span>{emailStatusMsg.text}</span>
                </div>
                <button onClick={() => setEmailStatusMsg(null)} className="text-slate-400 hover:text-slate-600 text-xs">
                  ✕
                </button>
              </div>
            )}

            {/* Manual Dispatch Form */}
            <form onSubmit={(e) => { e.preventDefault(); handleSendManualEmail(); }} className="bg-[#faf8f5] p-5 rounded-2xl border border-[#eee7da] space-y-4">
              <h3 className="text-xs font-extrabold text-[#332420] uppercase tracking-wider flex items-center gap-1.5">
                <Send className="w-4 h-4 text-[#18757d]" />
                Formulaire d'Envoi / Renvoi d'E-mail Manuel
              </h3>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label className="text-[11px] font-bold text-[#332420] block mb-1">E-mail de la cliente :</label>
                  <input
                    type="email"
                    required
                    placeholder="exemple@domaine.fr"
                    value={manualEmailTarget}
                    onChange={(e) => setManualEmailTarget(e.target.value)}
                    className="w-full bg-white border border-[#eee7da] rounded-xl px-3 py-2 text-xs text-[#332420] focus:outline-none focus:border-[#18757d]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#332420] block mb-1">Nom / Prénom (Optionnel) :</label>
                  <input
                    type="text"
                    placeholder="Ex: Sophie"
                    value={manualNameTarget}
                    onChange={(e) => setManualNameTarget(e.target.value)}
                    className="w-full bg-white border border-[#eee7da] rounded-xl px-3 py-2 text-xs text-[#332420] focus:outline-none focus:border-[#18757d]"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#332420] block mb-1">Produit / Offre :</label>
                  <select
                    value={manualProductTarget}
                    onChange={(e) => {
                      const selId = e.target.value;
                      setManualProductTarget(selId);
                      const prod = DEFAULT_PRODUCTS.find(p => p.id === selId || p.slug === selId);
                      if (prod?.price) setManualAmountTarget(prod.price);
                    }}
                    className="w-full bg-white border border-[#eee7da] rounded-xl px-3 py-2 text-xs text-[#332420] focus:outline-none focus:border-[#18757d]"
                  >
                    <option value="precommande-fiche-google">🚀 Précommande Fiche Google (29€ - 3 Bonus Inclus)</option>
                    {DEFAULT_PRODUCTS.map(p => (
                      <option key={p.id} value={p.id}>
                        {p.title} ({p.price}€)
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-[11px] font-bold text-[#332420] block mb-1">Montant (€) :</label>
                  <input
                    type="number"
                    value={manualAmountTarget}
                    onChange={(e) => setManualAmountTarget(Number(e.target.value))}
                    className="w-full bg-white border border-[#eee7da] rounded-xl px-3 py-2 text-xs text-[#332420] focus:outline-none focus:border-[#18757d]"
                  />
                </div>
              </div>

              <div className="flex justify-end pt-1">
                <button
                  type="submit"
                  disabled={isSendingEmail}
                  className="px-6 py-3 bg-[#18757d] hover:bg-[#12595f] text-white font-extrabold text-xs rounded-xl shadow-sm uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
                >
                  <Send className="w-4 h-4" />
                  {isSendingEmail ? 'Envoi en cours...' : 'Envoyer l’e-mail de confirmation & bonus'}
                </button>
              </div>
            </form>
          </div>

          {/* User Roles & Recent Orders Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            
            {/* User Roles Management Table */}
            <div className="bg-white p-8 rounded-3xl border border-[#eee7da] shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#eee7da] pb-4 gap-4">
                <div>
                  <h2 className="text-xl font-extrabold text-[#332420]">
                    Gestion des Utilisateurs & Rôles
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">{usersList.length} comptes authentifiés répertoriés</p>
                </div>

                <button
                  onClick={() => setShowCreateFormateur(!showCreateFormateur)}
                  className="px-4 py-2 bg-[#18757d] hover:bg-[#12595f] text-white rounded-xl text-xs font-extrabold shadow-sm transition-colors flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
                >
                  <GraduationCap className="w-4 h-4" />
                  + Formateur
                </button>
              </div>

              {/* Formateur Creation Box */}
              {showCreateFormateur && (
                <form onSubmit={handleCreateFormateur} className="p-5 bg-[#e6f4f3]/60 rounded-2xl border border-[#18757d]/30 space-y-4 animate-in fade-in duration-200">
                  <h3 className="text-xs font-extrabold text-[#18757d] uppercase tracking-wider">
                    Nouveau Compte Formateur
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-xs font-bold text-[#332420] block mb-1">Nom du formateur :</label>
                      <input
                        type="text"
                        placeholder="Ex: Claire Martin"
                        value={newFormateurName}
                        onChange={(e) => setNewFormateurName(e.target.value)}
                        className="w-full bg-white border border-[#eee7da] rounded-xl px-3.5 py-2 text-xs text-[#332420] focus:outline-none focus:border-[#18757d]"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-bold text-[#332420] block mb-1">Adresse email du formateur :</label>
                      <input
                        type="email"
                        required
                        placeholder="formateur@exemple.fr"
                        value={newFormateurEmail}
                        onChange={(e) => setNewFormateurEmail(e.target.value)}
                        className="w-full bg-white border border-[#eee7da] rounded-xl px-3.5 py-2 text-xs text-[#332420] focus:outline-none focus:border-[#18757d]"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end gap-2 pt-1">
                    <button
                      type="button"
                      onClick={() => setShowCreateFormateur(false)}
                      className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-bold transition-colors"
                    >
                      Annuler
                    </button>
                    <button
                      type="submit"
                      className="px-5 py-2 bg-[#18757d] hover:bg-[#12595f] text-white rounded-xl text-xs font-extrabold transition-colors shadow-sm"
                    >
                      Valider le compte Formateur
                    </button>
                  </div>
                </form>
              )}

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs font-semibold text-[#332420]">
                  <thead>
                    <tr className="border-b border-[#eee7da] text-slate-500 uppercase tracking-wider text-[10px]">
                      <th className="pb-3 px-3">Utilisateur</th>
                      <th className="pb-3 px-3">Achats</th>
                      <th className="pb-3 px-3">Dépensé</th>
                      <th className="pb-3 px-3 text-right">Rôle / Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#eee7da]">
                    {usersList.map((u) => (
                      <tr key={u.id} className="hover:bg-[#faf8f5] transition-colors">
                        <td className="py-3.5 px-3">
                          <button
                            onClick={() => setSelectedUserForDetails(u)}
                            className="text-[#18757d] hover:text-[#e05a47] font-extrabold cursor-pointer hover:underline text-left"
                            title="Cliquer pour consulter le détail des commandes"
                          >
                            <div className="font-extrabold">{u.name}</div>
                            <div className="text-[10px] text-slate-400 font-normal">{u.email}</div>
                          </button>
                        </td>
                        <td className="py-3.5 px-3">
                          <button
                            onClick={() => setSelectedUserForDetails(u)}
                            className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-teal-50 text-[#18757d] hover:bg-[#18757d] hover:text-white transition-colors cursor-pointer inline-flex items-center gap-1"
                            title="Voir les achats de ce client"
                          >
                            <ShoppingBag className="w-3 h-3" />
                            {u.purchasesCount}
                          </button>
                        </td>
                        <td className="py-3.5 px-3 font-bold text-[#18757d] whitespace-nowrap">{u.totalSpent.toFixed(2).replace('.', ',')} €</td>
                        <td className="py-3.5 px-3 text-right">
                          <select
                            value={u.role}
                            onChange={(e) => handleRoleChange(u.email, e.target.value as UserRole)}
                            className="bg-[#faf8f5] border border-[#eee7da] rounded-xl px-2 py-1 text-[11px] font-bold text-[#332420] focus:outline-none focus:border-[#18757d]"
                          >
                            <option value="eleve">Élève</option>
                            <option value="formateur">Formateur</option>
                            <option value="superadmin">Superadmin</option>
                          </select>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* List of Recent Orders Table */}
            <div className="bg-white p-8 rounded-3xl border border-[#eee7da] shadow-sm space-y-6">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#eee7da] pb-4 gap-4">
                <div>
                  <h2 className="text-xl font-extrabold text-[#332420] flex items-center gap-2">
                    <Receipt className="w-5 h-5 text-[#18757d]" />
                    Liste des Commandes Passées
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">Triées par date d'achat (récentes en premier)</p>
                </div>

                <span className="px-3 py-1 bg-emerald-100 text-emerald-900 text-xs font-black rounded-full uppercase tracking-wider self-start sm:self-auto">
                  {stats.totalOrders} commande(s)
                </span>
              </div>

              {(() => {
                const allOrders = usersList.flatMap(u => 
                  (u.purchasesDetails || []).map(p => ({
                    id: p.id,
                    title: p.title,
                    price: p.price,
                    date: p.date,
                    type: p.type,
                    userName: u.name,
                    userEmail: u.email
                  }))
                ).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

                if (allOrders.length === 0) {
                  return (
                    <div className="py-12 text-center text-xs text-slate-400 font-medium">
                      Aucune commande enregistrée pour le moment.
                    </div>
                  );
                }

                return (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-xs font-semibold text-[#332420]">
                      <thead>
                        <tr className="border-b border-[#eee7da] text-slate-500 uppercase tracking-wider text-[10px]">
                          <th className="pb-3 px-3">Date</th>
                          <th className="pb-3 px-3">Montant</th>
                          <th className="pb-3 px-3">Utilisateur</th>
                          <th className="pb-3 px-3">Produit</th>
                          <th className="pb-3 px-3 text-center">E-mail</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-[#eee7da]">
                        {allOrders.map((ord, idx) => {
                          const dateObj = new Date(ord.date);
                          const formattedDate = isNaN(dateObj.getTime()) 
                            ? ord.date 
                            : dateObj.toLocaleDateString('fr-FR', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' });

                          return (
                            <tr key={ord.id || idx} className="hover:bg-[#faf8f5] transition-colors">
                              <td className="py-3.5 px-3 font-mono text-slate-600 text-[11px] whitespace-nowrap">
                                {formattedDate}
                              </td>
                              <td className="py-3.5 px-3 font-extrabold text-emerald-700 whitespace-nowrap">
                                {ord.price.toFixed(2).replace('.', ',')} €
                              </td>
                              <td className="py-3.5 px-3 font-bold text-[#332420]">
                                <div className="font-extrabold truncate max-w-[130px]">{ord.userName}</div>
                                <div className="text-[10px] text-slate-400 font-normal truncate max-w-[130px]">{ord.userEmail}</div>
                              </td>
                              <td className="py-3.5 px-3">
                                <div className="flex flex-col gap-0.5">
                                  <span className="font-bold text-[#332420] text-[11px] line-clamp-1">{ord.title}</span>
                                  <span className="text-[9px] font-extrabold text-[#18757d] uppercase">{ord.type}</span>
                                </div>
                              </td>
                              <td className="py-3.5 px-3 text-center whitespace-nowrap">
                                <button
                                  onClick={() => handleSendManualEmail(ord.userEmail, ord.id || 'precommande-fiche-google', ord.price)}
                                  disabled={isSendingEmail}
                                  className="px-2 py-1 bg-[#e6f4f3] hover:bg-[#18757d] text-[#18757d] hover:text-white rounded-lg text-[10px] font-extrabold transition-colors inline-flex items-center gap-1 cursor-pointer"
                                  title="Renvoyer l'e-mail de confirmation"
                                >
                                  <Mail className="w-3 h-3" />
                                  <span>Email</span>
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                );
              })()}
            </div>

          </div>

        </div>
      </section>

      {/* USER PURCHASES & ORDERS DETAIL MODAL */}
      {selectedUserForDetails && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white w-full max-w-3xl rounded-3xl border border-[#eee7da] shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
            {/* Modal Header */}
            <div className="p-6 bg-[#faf8f5] border-b border-[#eee7da] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-[#e6f4f3] text-[#18757d] flex items-center justify-center font-bold">
                  <Receipt className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#332420]">
                    Historique des Achats de {selectedUserForDetails.name}
                  </h3>
                  <p className="text-xs text-slate-500 font-medium">{selectedUserForDetails.email}</p>
                </div>
              </div>

              <button
                onClick={() => setSelectedUserForDetails(null)}
                className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 hover:bg-rose-100 hover:text-rose-600 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Modal Summary KPI */}
            <div className="p-6 border-b border-[#f4ede0] bg-white grid grid-cols-3 gap-4 text-center">
              <div className="p-3 bg-[#faf8f5] rounded-2xl border border-[#eee7da]">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Total Dépensé</span>
                <span className="text-lg font-black text-[#18757d]">
                  {selectedUserForDetails.totalSpent.toFixed(2).replace('.', ',')} €
                </span>
              </div>
              <div className="p-3 bg-[#faf8f5] rounded-2xl border border-[#eee7da]">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Nombre d'Achats</span>
                <span className="text-lg font-black text-[#332420]">
                  {selectedUserForDetails.purchasesCount}
                </span>
              </div>
              <div className="p-3 bg-[#faf8f5] rounded-2xl border border-[#eee7da]">
                <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider block">Rôle Compte</span>
                <span className="text-xs font-black text-[#e05a47] uppercase inline-block mt-1">
                  {selectedUserForDetails.role}
                </span>
              </div>
            </div>

            {/* Modal Content / Orders List */}
            <div className="p-6 max-h-[60vh] overflow-y-auto space-y-4">
              {(!selectedUserForDetails.purchasesDetails || selectedUserForDetails.purchasesDetails.length === 0) ? (
                <div className="py-12 text-center text-xs text-slate-400 font-medium">
                  Aucune commande enregistrée pour ce profil client.
                </div>
              ) : (
                <div className="space-y-3">
                  {selectedUserForDetails.purchasesDetails.map((item, idx) => (
                    <div key={idx} className="p-4 bg-[#faf8f5] rounded-2xl border border-[#eee7da] flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-[#18757d] transition-colors">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-[#e6f4f3] text-[#18757d]">
                            {item.type}
                          </span>
                          <span className="text-xs font-extrabold text-[#332420]">{item.title}</span>
                        </div>
                        <p className="text-[11px] text-slate-500 flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          Commande du {new Date(item.date).toLocaleDateString('fr-FR')} • Réf: <span className="font-mono">{item.id.substring(0, 14)}</span>
                        </p>
                      </div>

                      <div className="flex items-center gap-3 self-end sm:self-auto">
                        <span className="text-sm font-black text-[#18757d] font-mono whitespace-nowrap">
                          {item.price.toFixed(2).replace('.', ',')} €
                        </span>

                        <div className="flex items-center gap-1.5">
                          <Link
                            href={item.slug ? `/produit/${item.slug}` : '/boutique'}
                            target="_blank"
                            className="p-1.5 text-slate-500 hover:text-[#18757d] hover:bg-white rounded-xl transition-colors"
                            title="Voir la page produit"
                          >
                            <Eye className="w-4 h-4" />
                          </Link>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-[#faf8f5] border-t border-[#eee7da] text-right">
              <button
                onClick={() => setSelectedUserForDetails(null)}
                className="px-5 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl text-xs font-extrabold transition-colors cursor-pointer"
              >
                Fermer
              </button>
            </div>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
