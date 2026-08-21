'use client';

import React from 'react';
import { Mail, CheckCircle2, ShieldCheck } from 'lucide-react';

interface NewsletterOptInProps {
  checked: boolean;
  onChange: (checked: boolean) => void;
  className?: string;
}

export default function NewsletterOptIn({ checked, onChange, className = '' }: NewsletterOptInProps) {
  return (
    <div className={`p-4 bg-gradient-to-r from-[#e6f4f3] to-[#faf3eb] rounded-2xl border border-[#18757d]/30 shadow-xs transition-all ${className}`}>
      <label className="flex items-start gap-3 cursor-pointer group">
        <input
          type="checkbox"
          checked={checked}
          onChange={(e) => onChange(e.target.checked)}
          className="w-5 h-5 mt-0.5 text-[#18757d] rounded accent-[#18757d] cursor-pointer shrink-0 transition-transform group-hover:scale-105"
        />
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs font-black text-[#18757d] uppercase tracking-wider">
            <Mail className="w-3.5 h-3.5 text-amber-600 shrink-0" />
            <span>Bonus Exclusif : Les Secrets de Visibilité de Stéphanie</span>
          </div>
          <p className="text-xs font-bold text-[#332420] leading-relaxed">
            Oui ! Je souhaite recevoir 1 conseil concret par semaine pour booster mon site web & mon référencement local (100% gratuit, 0 spam, désinscription en 1 clic).
          </p>
          <div className="flex items-center gap-3 text-[11px] font-extrabold text-[#5e4d46] pt-1">
            <span className="flex items-center gap-1 text-emerald-700">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              Rejoint par +500 artisans & créateurs
            </span>
            <span className="flex items-center gap-1 text-slate-500">
              <ShieldCheck className="w-3 h-3 text-slate-400" />
              Confidentialité garantie
            </span>
          </div>
        </div>
      </label>
    </div>
  );
}
