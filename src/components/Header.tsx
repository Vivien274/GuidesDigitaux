'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { 
  ShoppingBag, 
  Lock, 
  UserCheck, 
  GraduationCap, 
  Shield, 
  LogOut, 
  Menu, 
  X, 
  Home, 
  Compass, 
  BookOpen, 
  Mail, 
  PhoneCall, 
  ChevronRight, 
  Sparkles 
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import CartDrawer from '@/components/CartDrawer';

export default function Header() {
  const pathname = usePathname();
  const { totalItems, setIsCartOpen } = useCart();
  const { role, user, isLoggedIn, logout } = useAuth();
  const [mounted, setMounted] = React.useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);

  React.useEffect(() => {
    setMounted(true);
  }, []);

  // Close mobile menu on page route change
  React.useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  // Prevent background scroll when mobile menu is open
  React.useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isMobileMenuOpen]);

  const isActive = (path: string) => {
    if (path === '/' && pathname === '/') return true;
    if (path !== '/' && pathname.startsWith(path)) return true;
    return false;
  };

  const getDashboardLink = () => {
    if (role === 'superadmin') return '/dashboard/admin';
    if (role === 'formateur') return '/dashboard/formateur';
    return '/dashboard/eleve';
  };

  // DISTRACTION-FREE SALES FUNNEL HEADER (NO NAV LINKS, NO MENUS, NO CART FOR HIGH CRO)
  if (pathname?.startsWith('/tunnel')) {
    return (
      <header className="w-full bg-[#faf8f5] border-b border-[#eee7da] sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="relative h-12 w-48 sm:w-52">
              <Image
                src="/images/logo.png"
                alt="Guides Digitaux"
                fill
                className="object-contain object-left"
                priority
              />
            </div>
          </div>

          {/* Reassuring Security Badge (Zero navigation menus to optimize conversion) */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 bg-[#e6f4f3] border border-[#18757d]/20 px-3.5 py-1.5 rounded-full text-[#18757d] text-xs font-extrabold shadow-2xs">
              <Lock className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
              <span>Commande 100% Sécurisée</span>
            </div>
          </div>

        </div>
      </header>
    );
  }

  return (
    <>
      <header className="w-full bg-[#faf8f5] border-b border-[#eee7da] sticky top-0 z-40 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          
          {/* Official Logo */}
          <Link href="/" className="flex items-center gap-3">
            <div className="relative h-12 w-48 sm:w-52">
              <Image
                src="/images/logo.png"
                alt="Guides Digitaux"
                fill
                className="object-contain object-left"
                priority
              />
            </div>
          </Link>

          {/* Nav Links */}
          <nav className="hidden md:flex items-center gap-7 text-sm font-semibold text-[#4a3b35]">
            <Link 
              href="/" 
              className={`transition-colors pb-1 ${
                isActive('/') && pathname === '/' 
                  ? 'text-[#18757d] font-bold border-b-2 border-[#18757d]' 
                  : 'hover:text-[#18757d]'
              }`}
            >
              Accueil
            </Link>
            
            <Link 
              href="/a-propos" 
              className={`transition-colors pb-1 ${
                isActive('/a-propos') 
                  ? 'text-[#18757d] font-bold border-b-2 border-[#18757d]' 
                  : 'hover:text-[#18757d]'
              }`}
            >
              A Propos
            </Link>

            <Link 
              href="/boutique" 
              className={`transition-colors pb-1 ${
                isActive('/boutique') 
                  ? 'text-[#18757d] font-bold border-b-2 border-[#18757d]' 
                  : 'hover:text-[#18757d]'
              }`}
            >
              Boutique
            </Link>

            <Link 
              href="/blog" 
              className={`transition-colors pb-1 ${
                isActive('/blog') 
                  ? 'text-[#18757d] font-bold border-b-2 border-[#18757d]' 
                  : 'hover:text-[#18757d]'
              }`}
            >
              Blog
            </Link>

            <Link 
              href="/contact" 
              className={`transition-colors pb-1 ${
                isActive('/contact') 
                  ? 'text-[#18757d] font-bold border-b-2 border-[#18757d]' 
                  : 'hover:text-[#18757d]'
              }`}
            >
              Contact
            </Link>

            {mounted && isLoggedIn && user ? (
              <>
                {role === 'superadmin' && (
                  <>
                    <Link 
                      href="/dashboard/eleve" 
                      className={`transition-colors flex items-center gap-1.5 pb-1 ${
                        isActive('/dashboard/eleve')
                          ? 'text-[#18757d] font-bold border-b-2 border-[#18757d]' 
                          : 'hover:text-[#18757d]'
                      }`}
                    >
                      <UserCheck className="w-3.5 h-3.5 text-[#18757d]" />
                      <span>Espace Élève (Tous les cours)</span>
                    </Link>
                    <Link 
                      href="/dashboard/formateur" 
                      className={`transition-colors flex items-center gap-1.5 pb-1 ${
                        isActive('/dashboard/formateur')
                          ? 'text-[#18757d] font-bold border-b-2 border-[#18757d]' 
                          : 'hover:text-[#18757d]'
                      }`}
                    >
                      <GraduationCap className="w-3.5 h-3.5 text-[#18757d]" />
                      <span>Studio Formations</span>
                    </Link>
                  </>
                )}
                <Link 
                  href={getDashboardLink()} 
                  className={`transition-colors flex items-center gap-1.5 pb-1 ${
                    isActive('/dashboard/admin') || (role !== 'superadmin' && isActive('/dashboard'))
                      ? 'text-[#e05a47] font-bold border-b-2 border-[#e05a47]' 
                      : 'hover:text-[#18757d]'
                  }`}
                >
                  {role === 'superadmin' ? (
                    <Shield className="w-3.5 h-3.5 text-[#e05a47]" />
                  ) : role === 'formateur' ? (
                    <GraduationCap className="w-3.5 h-3.5 text-[#18757d]" />
                  ) : (
                    <UserCheck className="w-3.5 h-3.5 text-[#18757d]" />
                  )}
                  <span>{role === 'superadmin' ? 'Back-Office Admin' : role === 'formateur' ? 'Mon Espace Formateur' : 'Mon Espace Élève'}</span>
                </Link>
              </>
            ) : (
              <Link 
                href="/mon-compte" 
                className={`transition-colors flex items-center gap-1.5 pb-1 ${
                  isActive('/mon-compte')
                    ? 'text-[#18757d] font-bold border-b-2 border-[#18757d]' 
                    : 'hover:text-[#18757d]'
                }`}
              >
                <Lock className="w-3.5 h-3.5 text-[#18757d]" />
                <span>Connexion</span>
              </Link>
            )}
          </nav>

          {/* Cart, Logout & Mobile Burger Button */}
          <div className="flex items-center gap-2 sm:gap-3">
            {(mounted ? role !== 'formateur' : true) && !pathname.startsWith('/dashboard/formateur') && (
              <button 
                onClick={() => setIsCartOpen(true)}
                aria-label="Voir le panier"
                className={`px-3.5 sm:px-4 py-2 text-sm font-bold rounded-full transition-all flex items-center gap-2 relative ${
                  totalItems > 0
                    ? 'bg-[#18757d] text-white shadow-sm'
                    : 'bg-[#e6f4f3] text-[#18757d] hover:bg-[#d4edea]'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span className="hidden sm:inline">Panier</span>
                {totalItems > 0 && (
                  <span className="bg-[#c43c1d] text-white text-[11px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center -ml-0.5">
                    {totalItems}
                  </span>
                )}
              </button>
            )}

            {mounted && isLoggedIn && (
              <button
                onClick={() => {
                  logout();
                  window.location.href = '/mon-compte';
                }}
                title="Se déconnecter"
                aria-label="Se déconnecter"
                className="hidden sm:flex px-3 py-2 text-xs font-bold text-slate-600 hover:text-[#e05a47] hover:bg-rose-50 rounded-xl transition-colors border border-transparent hover:border-rose-200 items-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-4 h-4 text-slate-500" />
                <span>Déconnexion</span>
              </button>
            )}

            {/* Mobile Hamburger Toggle Button */}
            <button
              type="button"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              aria-label={isMobileMenuOpen ? "Fermer le menu" : "Ouvrir le menu de navigation"}
              aria-expanded={isMobileMenuOpen}
              className="md:hidden w-10 h-10 rounded-full bg-[#f4ede0] text-[#332420] hover:bg-[#e6f4f3] hover:text-[#18757d] flex items-center justify-center transition-colors focus:outline-none focus:ring-2 focus:ring-[#18757d]"
            >
              {isMobileMenuOpen ? (
                <X className="w-5 h-5 text-[#332420]" />
              ) : (
                <Menu className="w-5 h-5 text-[#332420]" />
              )}
            </button>
          </div>

        </div>
      </header>

      {/* MOBILE NAVIGATION SLIDE-OVER DRAWER */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 md:hidden overflow-hidden" role="dialog" aria-modal="true" aria-label="Menu mobile">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
            onClick={() => setIsMobileMenuOpen(false)}
            aria-hidden="true"
          />

          {/* Drawer Container */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-8">
            <div className="w-screen max-w-xs sm:max-w-sm bg-[#faf8f5] shadow-2xl flex flex-col border-l border-[#eee7da] animate-in slide-in-from-right duration-300">
              
              {/* Drawer Top Header */}
              <div className="p-5 bg-white border-b border-[#eee7da] flex items-center justify-between">
                <div className="relative h-9 w-40">
                  <Image
                    src="/images/logo.png"
                    alt="Guides Digitaux"
                    fill
                    className="object-contain object-left"
                    priority
                  />
                </div>
                <button
                  type="button"
                  onClick={() => setIsMobileMenuOpen(false)}
                  aria-label="Fermer le menu"
                  className="w-9 h-9 rounded-full bg-[#f4ede0] text-[#332420] flex items-center justify-center hover:bg-[#c43c1d] hover:text-white transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Drawer Links */}
              <div className="flex-1 overflow-y-auto p-5 space-y-5">
                
                {/* Main Navigation Links */}
                <div className="space-y-1">
                  <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#8a7b74] px-3 mb-2">
                    Navigation
                  </p>

                  <Link
                    href="/"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-3.5 py-3 rounded-2xl text-sm font-bold transition-all ${
                      isActive('/') && pathname === '/'
                        ? 'bg-[#18757d] text-white shadow-xs'
                        : 'text-[#332420] hover:bg-[#f4ede0]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Home className="w-4 h-4 opacity-80" />
                      <span>Accueil</span>
                    </div>
                    <ChevronRight className="w-4 h-4 opacity-50" />
                  </Link>

                  <Link
                    href="/boutique"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-3.5 py-3 rounded-2xl text-sm font-bold transition-all ${
                      isActive('/boutique')
                        ? 'bg-[#18757d] text-white shadow-xs'
                        : 'text-[#332420] hover:bg-[#f4ede0]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <ShoppingBag className="w-4 h-4 opacity-80" />
                      <span>Boutique</span>
                    </div>
                    <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-[#e6f4f3] text-[#18757d]">
                      Guides & Vidéos
                    </span>
                  </Link>

                  <Link
                    href="/quiz"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-3.5 py-3 rounded-2xl text-sm font-bold transition-all ${
                      isActive('/quiz')
                        ? 'bg-[#18757d] text-white shadow-xs'
                        : 'text-[#332420] hover:bg-[#f4ede0]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Sparkles className="w-4 h-4 text-[#c43c1d]" />
                      <span>Quiz Gratuit</span>
                    </div>
                    <span className="text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-full bg-[#fff1ee] text-[#c43c1d] border border-[#fdd8d2]">
                      2 min
                    </span>
                  </Link>

                  <Link
                    href="/blog"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-3.5 py-3 rounded-2xl text-sm font-bold transition-all ${
                      isActive('/blog')
                        ? 'bg-[#18757d] text-white shadow-xs'
                        : 'text-[#332420] hover:bg-[#f4ede0]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <BookOpen className="w-4 h-4 opacity-80" />
                      <span>Blog & Astuces</span>
                    </div>
                    <ChevronRight className="w-4 h-4 opacity-50" />
                  </Link>

                  <Link
                    href="/a-propos"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-3.5 py-3 rounded-2xl text-sm font-bold transition-all ${
                      isActive('/a-propos')
                        ? 'bg-[#18757d] text-white shadow-xs'
                        : 'text-[#332420] hover:bg-[#f4ede0]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Compass className="w-4 h-4 opacity-80" />
                      <span>À Propos</span>
                    </div>
                    <ChevronRight className="w-4 h-4 opacity-50" />
                  </Link>

                  <Link
                    href="/contact"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={`flex items-center justify-between px-3.5 py-3 rounded-2xl text-sm font-bold transition-all ${
                      isActive('/contact')
                        ? 'bg-[#18757d] text-white shadow-xs'
                        : 'text-[#332420] hover:bg-[#f4ede0]'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Mail className="w-4 h-4 opacity-80" />
                      <span>Contact</span>
                    </div>
                    <ChevronRight className="w-4 h-4 opacity-50" />
                  </Link>
                </div>

                {/* Member Area / Account Links */}
                <div className="pt-4 border-t border-[#eee7da] space-y-2">
                  <p className="text-[11px] font-extrabold uppercase tracking-wider text-[#8a7b74] px-3 mb-2">
                    Espace Membre
                  </p>

                  {mounted && isLoggedIn && user ? (
                    <>
                      <Link
                        href={getDashboardLink()}
                        onClick={() => setIsMobileMenuOpen(false)}
                        className="flex items-center justify-between px-3.5 py-3 rounded-2xl text-sm font-extrabold bg-[#e6f4f3] text-[#18757d] hover:bg-[#d4edea] transition-all"
                      >
                        <div className="flex items-center gap-2.5">
                          {role === 'superadmin' ? (
                            <Shield className="w-4 h-4 text-[#c43c1d]" />
                          ) : (
                            <UserCheck className="w-4 h-4 text-[#18757d]" />
                          )}
                          <span>{role === 'superadmin' ? 'Back-Office Admin' : role === 'formateur' ? 'Espace Formateur' : 'Mon Espace Élève'}</span>
                        </div>
                        <ChevronRight className="w-4 h-4" />
                      </Link>

                      <button
                        type="button"
                        onClick={() => {
                          setIsMobileMenuOpen(false);
                          logout();
                          window.location.href = '/mon-compte';
                        }}
                        className="w-full flex items-center gap-2.5 px-3.5 py-2.5 text-xs font-bold text-slate-600 hover:text-[#c43c1d] rounded-xl transition-colors cursor-pointer"
                      >
                        <LogOut className="w-4 h-4" />
                        <span>Se déconnecter</span>
                      </button>
                    </>
                  ) : (
                    <Link
                      href="/mon-compte"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="flex items-center justify-between px-3.5 py-3 rounded-2xl text-sm font-extrabold bg-white border border-[#eee7da] text-[#332420] hover:bg-[#f4ede0] transition-all shadow-2xs"
                    >
                      <div className="flex items-center gap-2.5">
                        <Lock className="w-4 h-4 text-[#18757d]" />
                        <span>Connexion / Mon Compte</span>
                      </div>
                      <ChevronRight className="w-4 h-4 opacity-50" />
                    </Link>
                  )}
                </div>

                {/* Direct Phone Assistance Banner */}
                <div className="pt-3 border-t border-[#eee7da]">
                  <a
                    href="tel:0782404062"
                    className="flex items-center gap-3 p-3.5 bg-white rounded-2xl border border-[#eee7da] shadow-2xs hover:border-[#18757d] transition-colors"
                  >
                    <div className="w-10 h-10 rounded-full bg-[#18757d]/10 text-[#18757d] flex items-center justify-center shrink-0">
                      <PhoneCall className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[11px] text-slate-500 font-medium block">Besoin d'aide ?</span>
                      <span className="text-sm font-extrabold text-[#18757d]">07.82.40.40.62</span>
                    </div>
                  </a>
                </div>

              </div>

            </div>
          </div>
        </div>
      )}

      {/* Cart Drawer Slide-Over */}
      <CartDrawer />
    </>
  );
}
