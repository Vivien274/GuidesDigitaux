'use client';

import React from 'react';
import { Bold, Italic, List, ListOrdered, Heading, Quote, Link as LinkIcon } from 'lucide-react';

interface WysiwygEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

export default function WysiwygEditor({ value, onChange, placeholder }: WysiwygEditorProps) {
  
  const insertFormatting = (prefix: string, suffix: string = '') => {
    const textarea = document.getElementById(`wysiwyg-area-${value.slice(0, 8)}`) as HTMLTextAreaElement;
    if (!textarea) {
      onChange(`${value} ${prefix}texte${suffix}`);
      return;
    }

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const selectedText = value.substring(start, end) || 'texte';
    const newText = value.substring(0, start) + prefix + selectedText + suffix + value.substring(end);
    onChange(newText);
  };

  return (
    <div className="border border-[#eee7da] rounded-2xl overflow-hidden bg-white shadow-2xs">
      {/* WYSIWYG TOOLBAR */}
      <div className="bg-[#faf8f5] px-3 py-2 border-b border-[#eee7da] flex items-center gap-1.5 flex-wrap">
        <button
          type="button"
          onClick={() => insertFormatting('**', '**')}
          className="p-1.5 rounded-lg hover:bg-[#e6f4f3] hover:text-[#18757d] text-slate-700 font-bold text-xs flex items-center gap-1"
          title="Gras (**texte**)"
        >
          <Bold className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => insertFormatting('*', '*')}
          className="p-1.5 rounded-lg hover:bg-[#e6f4f3] hover:text-[#18757d] text-slate-700 italic text-xs flex items-center gap-1"
          title="Italique (*texte*)"
        >
          <Italic className="w-4 h-4" />
        </button>

        <div className="w-px h-4 bg-[#eee7da] mx-1" />

        <button
          type="button"
          onClick={() => insertFormatting('\n- ')}
          className="p-1.5 rounded-lg hover:bg-[#e6f4f3] hover:text-[#18757d] text-slate-700 text-xs flex items-center gap-1"
          title="Liste à puces"
        >
          <List className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => insertFormatting('\n1. ')}
          className="p-1.5 rounded-lg hover:bg-[#e6f4f3] hover:text-[#18757d] text-slate-700 text-xs flex items-center gap-1"
          title="Liste numérotée"
        >
          <ListOrdered className="w-4 h-4" />
        </button>

        <div className="w-px h-4 bg-[#eee7da] mx-1" />

        <button
          type="button"
          onClick={() => insertFormatting('### ')}
          className="p-1.5 rounded-lg hover:bg-[#e6f4f3] hover:text-[#18757d] text-slate-700 text-xs flex items-center gap-1 font-extrabold"
          title="Titre de section"
        >
          <Heading className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => insertFormatting('\n> ')}
          className="p-1.5 rounded-lg hover:bg-[#e6f4f3] hover:text-[#18757d] text-slate-700 text-xs flex items-center gap-1"
          title="Citation / Remarque"
        >
          <Quote className="w-4 h-4" />
        </button>

        <button
          type="button"
          onClick={() => insertFormatting('[', '](https://...)')}
          className="p-1.5 rounded-lg hover:bg-[#e6f4f3] hover:text-[#18757d] text-slate-700 text-xs flex items-center gap-1"
          title="Lien hypertexte"
        >
          <LinkIcon className="w-4 h-4" />
        </button>
      </div>

      {/* TEXT AREA */}
      <textarea
        rows={6}
        placeholder={placeholder || "Saisissez les notes de cours et explications détaillées pour les élèves..."}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full p-4 text-xs sm:text-sm text-[#332420] focus:outline-none bg-white leading-relaxed min-h-[160px] resize-y"
      />
    </div>
  );
}
