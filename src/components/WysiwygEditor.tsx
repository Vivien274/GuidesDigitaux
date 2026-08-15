'use client';

import React, { useRef, useEffect, useState } from 'react';
import { Bold, Italic, List, ListOrdered, Heading, Quote, Link as LinkIcon, Eye, Code } from 'lucide-react';

interface WysiwygEditorProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

/**
 * Helper to clean raw/pasted HTML and remove attributes like data-start, inline styles, etc.
 */
function sanitizeHtml(html: string): string {
  if (!html) return '';
  
  // If text is plain without HTML tags, wrap line breaks cleanly
  if (!/<[a-z][\s\S]*>/i.test(html)) {
    return html
      .split(/\r?\n/)
      .map(line => line.trim())
      .filter(Boolean)
      .map(line => `<p>${line}</p>`)
      .join('');
  }

  return html
    .replace(/\s*data-[a-z0-9-]+="[^"]*"/gi, '') // Remove data-start, data-end attributes
    .replace(/\s*style="[^"]*"/gi, '') // Remove inline style noise
    .replace(/<span[^>]*>(.*?)<\/span>/gi, '$1') // Strip spans
    .replace(/<div[^>]*>(.*?)<\/div>/gi, '<p>$1</p>') // Turn divs into paragraphs
    .replace(/<b\b[^>]*>(.*?)<\/b>/gi, '<strong>$1</strong>')
    .replace(/<i\b[^>]*>(.*?)<\/i>/gi, '<em>$1</em>')
    .replace(/<h[1-6]\b[^>]*>(.*?)<\/h[1-6]>/gi, '<h3>$1</h3>')
    .replace(/<p>\s*<\/p>/gi, '') // Remove empty paragraphs
    .trim();
}

export default function WysiwygEditor({ value, onChange, placeholder }: WysiwygEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);
  const [showCode, setShowCode] = useState(false);

  // Sync value from props to editor innerHTML safely without resetting cursor when typing
  useEffect(() => {
    if (editorRef.current) {
      const cleanValue = sanitizeHtml(value);
      if (editorRef.current.innerHTML !== cleanValue && editorRef.current.innerHTML !== value) {
        editorRef.current.innerHTML = cleanValue;
      }
    }
  }, [value]);

  const handleInput = () => {
    if (editorRef.current) {
      const currentHtml = editorRef.current.innerHTML;
      onChange(currentHtml);
    }
  };

  const execCmd = (command: string, arg: string = '') => {
    if (editorRef.current) {
      editorRef.current.focus();
      document.execCommand(command, false, arg);
      handleInput();
    }
  };

  const handlePaste = (e: React.ClipboardEvent<HTMLDivElement>) => {
    e.preventDefault();
    const htmlData = e.clipboardData.getData('text/html');
    const plainText = e.clipboardData.getData('text/plain');

    let cleanHtml = '';

    if (htmlData && htmlData.includes('<')) {
      try {
        const parser = new DOMParser();
        const doc = parser.parseFromString(htmlData, 'text/html');
        cleanHtml = sanitizeHtml(doc.body.innerHTML);
      } catch (err) {
        console.warn('HTML paste parsing fallback:', err);
      }
    }

    if (!cleanHtml && plainText) {
      cleanHtml = sanitizeHtml(plainText);
    }

    if (cleanHtml) {
      document.execCommand('insertHTML', false, cleanHtml);
      handleInput();
    }
  };

  return (
    <div className="border border-[#eee7da] rounded-2xl overflow-hidden bg-white shadow-2xs">
      {/* VISUAL WYSIWYG TOOLBAR */}
      <div className="bg-[#faf8f5] px-3 py-2 border-b border-[#eee7da] flex items-center justify-between gap-1.5 flex-wrap">
        <div className="flex items-center gap-1 flex-wrap">
          <button
            type="button"
            onClick={() => execCmd('bold')}
            className="p-2 rounded-lg hover:bg-[#e6f4f3] hover:text-[#18757d] text-slate-700 font-bold text-xs flex items-center gap-1 cursor-pointer transition-colors"
            title="Gras (Sélectionnez le texte et cliquez)"
          >
            <Bold className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => execCmd('italic')}
            className="p-2 rounded-lg hover:bg-[#e6f4f3] hover:text-[#18757d] text-slate-700 italic text-xs flex items-center gap-1 cursor-pointer transition-colors"
            title="Italique"
          >
            <Italic className="w-4 h-4" />
          </button>

          <div className="w-px h-4 bg-[#eee7da] mx-1" />

          <button
            type="button"
            onClick={() => execCmd('insertUnorderedList')}
            className="p-2 rounded-lg hover:bg-[#e6f4f3] hover:text-[#18757d] text-slate-700 text-xs flex items-center gap-1 cursor-pointer transition-colors"
            title="Liste à puces"
          >
            <List className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => execCmd('insertOrderedList')}
            className="p-2 rounded-lg hover:bg-[#e6f4f3] hover:text-[#18757d] text-slate-700 text-xs flex items-center gap-1 cursor-pointer transition-colors"
            title="Liste numérotée"
          >
            <ListOrdered className="w-4 h-4" />
          </button>

          <div className="w-px h-4 bg-[#eee7da] mx-1" />

          <button
            type="button"
            onClick={() => execCmd('formatBlock', '<h3>')}
            className="p-2 rounded-lg hover:bg-[#e6f4f3] hover:text-[#18757d] text-slate-700 text-xs flex items-center gap-1 font-extrabold cursor-pointer transition-colors"
            title="Titre de section H3"
          >
            <Heading className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => execCmd('formatBlock', '<blockquote>')}
            className="p-2 rounded-lg hover:bg-[#e6f4f3] hover:text-[#18757d] text-slate-700 text-xs flex items-center gap-1 cursor-pointer transition-colors"
            title="Citation / Remarque"
          >
            <Quote className="w-4 h-4" />
          </button>

          <button
            type="button"
            onClick={() => {
              const url = prompt('Entrez l\'URL du lien hypertexte :');
              if (url) execCmd('createLink', url);
            }}
            className="p-2 rounded-lg hover:bg-[#e6f4f3] hover:text-[#18757d] text-slate-700 text-xs flex items-center gap-1 cursor-pointer transition-colors"
            title="Lien hypertexte"
          >
            <LinkIcon className="w-4 h-4" />
          </button>
        </div>

        {/* MODE TOGGLE: VISUAL / HTML CODE */}
        <button
          type="button"
          onClick={() => setShowCode(!showCode)}
          className="px-2.5 py-1 text-[11px] font-extrabold text-[#18757d] bg-[#e6f4f3] hover:bg-[#18757d] hover:text-white rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
        >
          {showCode ? (
            <>
              <Eye className="w-3.5 h-3.5" />
              <span>Vue Visuelle</span>
            </>
          ) : (
            <>
              <Code className="w-3.5 h-3.5" />
              <span>Code HTML</span>
            </>
          )}
        </button>
      </div>

      {/* EDITOR INPUT AREA */}
      {showCode ? (
        <textarea
          rows={8}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="w-full p-4 font-mono text-xs text-slate-700 bg-slate-50 focus:outline-none leading-relaxed min-h-[180px]"
        />
      ) : (
        <div
          ref={editorRef}
          contentEditable
          onInput={handleInput}
          onBlur={handleInput}
          onKeyUp={handleInput}
          onPaste={handlePaste}
          data-placeholder={placeholder || "Saisissez ou collez ici vos notes de cours..."}
          className="w-full p-4 text-xs sm:text-sm text-[#332420] focus:outline-none bg-white min-h-[180px] leading-relaxed prose max-w-none prose-headings:text-[#18757d] prose-headings:font-black prose-strong:text-[#332420] prose-strong:font-black prose-a:text-[#18757d] prose-a:font-bold prose-ul:list-disc prose-ul:pl-5 prose-ol:list-decimal prose-ol:pl-5 relative empty:before:content-[attr(data-placeholder)] empty:before:text-slate-400 empty:before:pointer-events-none"
        />
      )}
    </div>
  );
}
