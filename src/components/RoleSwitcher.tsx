'use client';

import React from 'react';
import { useAuth, UserRole } from '@/context/AuthContext';
import { Shield, GraduationCap, UserCheck, LayoutDashboard } from 'lucide-react';
import Link from 'next/link';

export default function RoleSwitcher() {
  const { user, role, setRole } = useAuth();

  return (
    <div className="bg-[#332420] text-white py-2 px-4 border-b border-amber-900/40 text-xs font-semibold">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <span className="bg-[#e05a47] text-white text-[10px] uppercase font-extrabold px-2 py-0.5 rounded-md">
            Mode Démo
          </span>
          <span className="text-amber-100/90 text-[11px]">
            Connecté en tant que <strong className="text-white font-bold">{user?.fullName || 'Stéphanie Rocq'}</strong> ({user?.email})
          </span>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-[11px] text-slate-300">Changer de profil :</span>
          
          <div className="flex items-center gap-1.5 bg-black/30 p-1 rounded-xl border border-white/10">
            <button
              onClick={() => setRole('eleve')}
              className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 ${
                role === 'eleve'
                  ? 'bg-[#18757d] text-white shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <UserCheck className="w-3 h-3" />
              Élève
            </button>

            <button
              onClick={() => setRole('formateur')}
              className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 ${
                role === 'formateur'
                  ? 'bg-[#18757d] text-white shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <GraduationCap className="w-3 h-3" />
              Formateur
            </button>

            <button
              onClick={() => setRole('superadmin')}
              className={`px-3 py-1 rounded-lg text-[11px] font-bold transition-all flex items-center gap-1 ${
                role === 'superadmin'
                  ? 'bg-[#e05a47] text-white shadow-sm'
                  : 'text-slate-300 hover:text-white'
              }`}
            >
              <Shield className="w-3 h-3" />
              Superadmin
            </button>
          </div>

          <Link
            href={
              role === 'superadmin' 
                ? '/dashboard/admin' 
                : role === 'formateur' 
                ? '/dashboard/formateur' 
                : '/dashboard/eleve'
            }
            className="px-3 py-1 bg-white/10 hover:bg-white/20 text-white rounded-lg text-[11px] font-bold transition-colors flex items-center gap-1.5"
          >
            <LayoutDashboard className="w-3 h-3" />
            Mon Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
