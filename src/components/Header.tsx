'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { ShoppingBag, Lock, UserCheck, GraduationCap, Shield, LogOut } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import CartDrawer from '@/components/CartDrawer';

export default function Header() {
  const pathname = usePathname();
  const { totalItems, setIsCartOpen } = useCart();
  const { role, user, isLoggedIn, logout } = useAuth();

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

            {isLoggedIn && user ? (
              <Link 
                href={getDashboardLink()} 
                className={`transition-colors flex items-center gap-1.5 pb-1 ${
                  isActive('/dashboard') || isActive('/mon-compte')
                    ? 'text-[#18757d] font-bold border-b-2 border-[#18757d]' 
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
                <span>Mon Espace ({role === 'superadmin' ? 'Admin' : role === 'formateur' ? 'Formateur' : 'Élève'})</span>
              </Link>
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

          {/* Cart & Logout Buttons */}
          <div className="flex items-center gap-3">
            {role !== 'formateur' && !pathname.startsWith('/dashboard/formateur') && (
              <button 
                onClick={() => setIsCartOpen(true)}
                className={`px-4 py-2 text-sm font-bold rounded-full transition-all flex items-center gap-2 relative ${
                  totalItems > 0
                    ? 'bg-[#18757d] text-white shadow-sm'
                    : 'bg-[#e6f4f3] text-[#18757d] hover:bg-[#d4edea]'
                }`}
              >
                <ShoppingBag className="w-4 h-4" />
                <span className="hidden sm:inline">Panier</span>
                {totalItems > 0 && (
                  <span className="bg-[#e05a47] text-white text-[11px] font-extrabold w-5 h-5 rounded-full flex items-center justify-center -ml-0.5">
                    {totalItems}
                  </span>
                )}
              </button>
            )}

            {isLoggedIn && (
              <button
                onClick={() => {
                  logout();
                  window.location.href = '/mon-compte';
                }}
                title="Se déconnecter"
                className="px-3 py-2 text-xs font-bold text-slate-600 hover:text-[#e05a47] hover:bg-rose-50 rounded-xl transition-colors border border-transparent hover:border-rose-200 flex items-center gap-1.5 cursor-pointer"
              >
                <LogOut className="w-4 h-4 text-slate-500" />
                <span className="hidden sm:inline">Déconnexion</span>
              </button>
            )}
          </div>

        </div>
      </header>

      {/* Cart Drawer Slide-Over */}
      <CartDrawer />
    </>
  );
}
