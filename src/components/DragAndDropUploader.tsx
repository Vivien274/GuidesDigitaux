'use client';

import React, { useState, useRef } from 'react';
import { UploadCloud, FileText, Image as ImageIcon, CheckCircle2, Loader2, Plus } from 'lucide-react';

interface DragAndDropUploaderProps {
  accept?: string; // 'image/*' | '.pdf' | 'image/*,.pdf'
  multiple?: boolean;
  onUploadSuccess: (urls: string[]) => void;
  label?: string;
  sublabel?: string;
  type?: 'image' | 'pdf' | 'media';
  className?: string;
}

export default function DragAndDropUploader({
  accept = 'image/*',
  multiple = false,
  onUploadSuccess,
  label = "Glisse-dépose tes fichiers ici",
  sublabel = "ou clique pour sélectionner depuis ton ordinateur",
  type = 'image',
  className = ""
}: DragAndDropUploaderProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccessMsg, setUploadSuccessMsg] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!isDragging) setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      await processFiles(Array.from(e.dataTransfer.files));
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      await processFiles(Array.from(e.target.files));
    }
  };

  const processFiles = async (files: File[]) => {
    setIsUploading(true);
    setUploadSuccessMsg('');
    const uploadedUrls: string[] = [];

    for (const file of files) {
      // Validate PDF if type is pdf
      if (type === 'pdf' && !file.name.toLowerCase().endsWith('.pdf')) {
        alert(`Le fichier ${file.name} n'est pas au format .pdf`);
        continue;
      }

      const formData = new FormData();
      formData.append('file', file);

      try {
        const res = await fetch('/api/admin/upload-media', {
          method: 'POST',
          body: formData
        });
        const data = await res.json();
        if (data.url) {
          uploadedUrls.push(data.url);
        } else {
          console.error('Upload error', data.error);
        }
      } catch (err) {
        console.error('Upload request failed', err);
      }
    }

    setIsUploading(false);

    if (uploadedUrls.length > 0) {
      setUploadSuccessMsg(`${uploadedUrls.length} fichier(s) téléversé(s) !`);
      onUploadSuccess(uploadedUrls);
      setTimeout(() => setUploadSuccessMsg(''), 3000);
    }
  };

  return (
    <div
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      onClick={() => fileInputRef.current?.click()}
      className={`relative border-2 border-dashed rounded-2xl p-6 text-center cursor-pointer transition-all duration-200 ${
        isDragging
          ? 'border-[#18757d] bg-[#e6f4f3] scale-[1.01] shadow-md'
          : 'border-[#eee7da] hover:border-[#18757d] bg-[#faf8f5] hover:bg-[#faf8f5]/80'
      } ${className}`}
    >
      <input
        ref={fileInputRef}
        type="file"
        accept={accept}
        multiple={multiple}
        onChange={handleFileSelect}
        className="hidden"
      />

      <div className="flex flex-col items-center justify-center space-y-2 pointer-events-none">
        {isUploading ? (
          <Loader2 className="w-8 h-8 text-[#18757d] animate-spin" />
        ) : uploadSuccessMsg ? (
          <CheckCircle2 className="w-8 h-8 text-emerald-600 animate-bounce" />
        ) : type === 'pdf' ? (
          <FileText className={`w-8 h-8 ${isDragging ? 'text-[#18757d]' : 'text-slate-400'}`} />
        ) : (
          <UploadCloud className={`w-8 h-8 ${isDragging ? 'text-[#18757d]' : 'text-[#18757d]'}`} />
        )}

        <div className="space-y-1">
          <p className="text-xs sm:text-sm font-extrabold text-[#332420]">
            {isUploading ? 'Téléversement en cours...' : uploadSuccessMsg || label}
          </p>
          {!isUploading && !uploadSuccessMsg && (
            <p className="text-[11px] text-[#5e4d46] font-medium">
              {sublabel}
            </p>
          )}
        </div>

        {isDragging && (
          <span className="inline-block px-3 py-1 bg-[#18757d] text-white rounded-full text-xs font-bold uppercase tracking-wider animate-pulse">
            Dépose tes fichiers ici !
          </span>
        )}
      </div>
    </div>
  );
}
