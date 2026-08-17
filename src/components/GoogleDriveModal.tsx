'use client';

import React, { useState } from 'react';
import { X, Check, Copy, ExternalLink, HardDrive, FileText, Image as ImageIcon, Sparkles } from 'lucide-react';
import { convertToGoogleDrivePdfUrl, convertToGoogleDriveImageUrl, extractGoogleDriveId } from '@/lib/googleDriveHelper';

interface GoogleDriveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSelectUrl: (directUrl: string) => void;
  type: 'pdf' | 'image';
  title?: string;
}

export default function GoogleDriveModal({
  isOpen,
  onClose,
  onSelectUrl,
  type,
  title = "Importer depuis Google Drive"
}: GoogleDriveModalProps) {
  const [driveInput, setDriveInput] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleConvertAndApply = () => {
    if (!driveInput.trim()) {
      setErrorMsg('Veuillez coller un lien Google Drive.');
      return;
    }

    const fileId = extractGoogleDriveId(driveInput);
    if (!fileId && !driveInput.includes('http')) {
      setErrorMsg('Lien Google Drive non reconnu. Collez un lien du type https://drive.google.com/file/d/.../view');
      return;
    }

    const converted = type === 'pdf'
      ? convertToGoogleDrivePdfUrl(driveInput)
      : convertToGoogleDriveImageUrl(driveInput);

    onSelectUrl(converted);
    setDriveInput('');
    setErrorMsg('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-fade-in">
      <div className="bg-white text-[#332420] rounded-3xl max-w-lg w-full p-6 sm:p-8 border border-[#eee7da] shadow-2xl space-y-6 relative">
        
        {/* CLOSE BUTTON */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 text-slate-400 hover:text-[#332420] hover:bg-slate-100 rounded-full transition-colors cursor-pointer"
        >
          <X className="w-5 h-5" />
        </button>

        {/* HEADER */}
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-800 flex items-center justify-center shrink-0">
            <HardDrive className="w-6 h-6 text-amber-700" />
          </div>
          <div>
            <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-black bg-amber-100 text-amber-900 uppercase tracking-wider mb-1">
              Google Drive Assistant
            </span>
            <h3 className="text-xl font-extrabold text-[#332420]">
              {title}
            </h3>
          </div>
        </div>

        {/* INSTRUCTIONS */}
        <div className="p-4 bg-[#FAF8F5] border border-[#eee7da] rounded-2xl space-y-2 text-xs text-[#5e4d46] font-medium leading-relaxed">
          <p className="font-bold text-[#332420] flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-[#F2542D]" />
            Comment faire en 2 secondes :
          </p>
          <ol className="list-decimal pl-4 space-y-1">
            <li>Sur Google Drive, fais un clic droit sur ton {type === 'pdf' ? 'fichier PDF' : 'image'} ➔ <strong>Partager ➔ Copier le lien</strong>.</li>
            <li>Assure-toi que l'accès est bien réglé sur <em>« Tous les utilisateurs disposant du lien »</em>.</li>
            <li>Colle le lien ci-dessous : nous le convertissons automatiquement en lien d'affichage/téléchargement direct !</li>
          </ol>
        </div>

        {/* INPUT FIELD */}
        <div className="space-y-2">
          <label className="text-xs font-extrabold text-[#5e4d46] uppercase flex items-center gap-1.5">
            {type === 'pdf' ? <FileText className="w-4 h-4 text-[#18757d]" /> : <ImageIcon className="w-4 h-4 text-[#18757d]" />}
            Lien Google Drive :
          </label>
          <input
            type="text"
            value={driveInput}
            onChange={(e) => {
              setDriveInput(e.target.value);
              if (errorMsg) setErrorMsg('');
            }}
            placeholder="https://drive.google.com/file/d/1ABC123xyz.../view?usp=sharing"
            className="w-full p-3.5 bg-white border-2 border-[#eee7da] focus:border-[#18757d] rounded-2xl text-xs font-mono text-[#332420] outline-none shadow-inner"
          />
          {errorMsg && (
            <p className="text-xs font-bold text-rose-600 pt-1">{errorMsg}</p>
          )}
        </div>

        {/* CONVERTED PREVIEW IF VALID */}
        {driveInput.trim() && extractGoogleDriveId(driveInput) && (
          <div className="p-3.5 bg-emerald-50 border border-emerald-200 rounded-xl text-xs text-emerald-900 font-medium space-y-1">
            <span className="font-extrabold block text-emerald-800">✓ Lien Google Drive détecté avec succès !</span>
            <span className="block font-mono text-[11px] truncate text-emerald-700">
              Lien direct : {type === 'pdf' ? convertToGoogleDrivePdfUrl(driveInput) : convertToGoogleDriveImageUrl(driveInput)}
            </span>
          </div>
        )}

        {/* ACTIONS */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onClose}
            className="px-5 py-3 text-xs font-bold text-[#5e4d46] hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={handleConvertAndApply}
            className="px-6 py-3 bg-[#18757d] hover:bg-[#12595f] text-white text-xs font-extrabold rounded-xl shadow-md transition-transform hover:scale-105 uppercase tracking-wider cursor-pointer"
          >
            Valider et Importer →
          </button>
        </div>

      </div>
    </div>
  );
}
