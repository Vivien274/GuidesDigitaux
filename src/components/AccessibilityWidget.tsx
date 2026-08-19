'use client';

import React, { useState, useEffect, useRef } from 'react';
import { 
  Eye, 
  Type, 
  ZoomIn, 
  ZoomOut, 
  Sun, 
  Moon, 
  Volume2, 
  VolumeX, 
  RotateCcw, 
  X, 
  Sparkles, 
  Sliders, 
  MousePointer, 
  Link as LinkIcon, 
  PauseCircle, 
  BookOpen,
  Check,
  AlignJustify
} from 'lucide-react';

interface A11yState {
  fontSize: 'normal' | 'lg' | 'xl' | 'xxl';
  dyslexicFont: boolean;
  textSpacing: boolean;
  contrastMode: 'normal' | 'high' | 'dark' | 'grayscale';
  highlightLinks: boolean;
  readingRuler: boolean;
  stopAnimations: boolean;
  largeCursor: boolean;
}

const DEFAULT_STATE: A11yState = {
  fontSize: 'normal',
  dyslexicFont: false,
  textSpacing: false,
  contrastMode: 'normal',
  highlightLinks: false,
  readingRuler: false,
  stopAnimations: false,
  largeCursor: false,
};

export default function AccessibilityWidget() {
  const [isOpen, setIsOpen] = useState(false);
  const [state, setState] = useState<A11yState>(DEFAULT_STATE);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [rulerY, setRulerY] = useState<number>(0);
  const [isMounted, setIsMounted] = useState(false);

  // Load preferences from localStorage on mount
  useEffect(() => {
    setIsMounted(true);
    try {
      const saved = localStorage.getItem('gd_a11y_prefs');
      if (saved) {
        const parsed = JSON.parse(saved);
        setState(prev => ({ ...prev, ...parsed }));
      }
    } catch (e) {
      console.error('Error loading a11y preferences', e);
    }
  }, []);

  // Apply CSS classes to document.documentElement (html)
  useEffect(() => {
    if (!isMounted || typeof document === 'undefined') return;

    const html = document.documentElement;

    // Font size
    html.classList.remove('a11y-font-lg', 'a11y-font-xl', 'a11y-font-xxl');
    if (state.fontSize === 'lg') html.classList.add('a11y-font-lg');
    if (state.fontSize === 'xl') html.classList.add('a11y-font-xl');
    if (state.fontSize === 'xxl') html.classList.add('a11y-font-xxl');

    // Dyslexic Font
    if (state.dyslexicFont) {
      html.classList.add('a11y-dyslexic');
    } else {
      html.classList.remove('a11y-dyslexic');
    }

    // Text Spacing
    if (state.textSpacing) {
      html.classList.add('a11y-spacing');
    } else {
      html.classList.remove('a11y-spacing');
    }

    // Contrast modes
    html.classList.remove('a11y-high-contrast', 'a11y-dark-contrast', 'a11y-grayscale');
    if (state.contrastMode === 'high') html.classList.add('a11y-high-contrast');
    if (state.contrastMode === 'dark') html.classList.add('a11y-dark-contrast');
    if (state.contrastMode === 'grayscale') html.classList.add('a11y-grayscale');

    // Highlight links
    if (state.highlightLinks) {
      html.classList.add('a11y-highlight-links');
    } else {
      html.classList.remove('a11y-highlight-links');
    }

    // Stop animations
    if (state.stopAnimations) {
      html.classList.add('a11y-stop-animations');
    } else {
      html.classList.remove('a11y-stop-animations');
    }

    // Large cursor
    if (state.largeCursor) {
      html.classList.add('a11y-large-cursor');
    } else {
      html.classList.remove('a11y-large-cursor');
    }

    // Save to localStorage
    try {
      localStorage.setItem('gd_a11y_prefs', JSON.stringify(state));
    } catch (e) {}
  }, [state, isMounted]);

  // Track cursor position for reading ruler
  useEffect(() => {
    if (!state.readingRuler) return;

    const handleMouseMove = (e: MouseEvent) => {
      setRulerY(e.clientY);
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [state.readingRuler]);

  // Text-To-Speech handler
  const handleToggleSpeech = () => {
    if (typeof window === 'undefined' || !('speechSynthesis' in window)) {
      alert('La synthèse vocale n’est pas supportée par votre navigateur.');
      return;
    }

    if (isSpeaking) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    // Read selected text or main page text
    const selectedText = window.getSelection()?.toString().trim();
    const textToRead = selectedText || document.querySelector('main')?.innerText || document.body.innerText;

    if (!textToRead) return;

    const utterance = new SpeechSynthesisUtterance(textToRead);
    utterance.lang = 'fr-FR';
    utterance.rate = 1.0;

    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleReset = () => {
    setState(DEFAULT_STATE);
    if (typeof window !== 'undefined' && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      setIsSpeaking(false);
    }
  };

  if (!isMounted) return null;

  const hasActiveModifiers = 
    state.fontSize !== 'normal' ||
    state.dyslexicFont ||
    state.textSpacing ||
    state.contrastMode !== 'normal' ||
    state.highlightLinks ||
    state.readingRuler ||
    state.stopAnimations ||
    state.largeCursor;

  return (
    <>
      {/* READING RULER GUIDE */}
      {state.readingRuler && (
        <div 
          className="fixed left-0 w-full pointer-events-none z-[999998] transition-transform duration-75 ease-out"
          style={{ 
            top: `${rulerY - 20}px`,
            height: '40px',
            backgroundColor: 'rgba(24, 117, 125, 0.18)',
            borderTop: '2px solid #18757d',
            borderBottom: '2px solid #18757d',
            boxShadow: '0 0 20px rgba(24, 117, 125, 0.25)'
          }}
        />
      )}

      {/* FLOATING TRIGGER BUTTON (BOTTOM-LEFT) */}
      <div className="fixed bottom-6 left-6 z-[99999] print:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          aria-label="Options d'accessibilité (Ally)"
          title="Accessibilité numérique (a11y)"
          className={`relative p-3.5 sm:p-4 rounded-full shadow-2xl transition-all transform hover:scale-110 active:scale-95 flex items-center justify-center cursor-pointer border-2 ${
            hasActiveModifiers 
              ? 'bg-[#F2542D] border-white text-white ring-4 ring-[#F2542D]/30 shadow-[#F2542D]/40' 
              : 'bg-[#18757d] border-white/80 text-white hover:bg-[#12595f] ring-4 ring-[#18757d]/20'
          }`}
        >
          <Eye className="w-6 h-6 animate-pulse" />
          {hasActiveModifiers && (
            <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-400 border-2 border-white rounded-full"></span>
          )}
        </button>
      </div>

      {/* ACCESSIBILITY DRAWER / MODAL */}
      {isOpen && (
        <div className="fixed inset-0 z-[999999] flex items-end sm:items-center justify-start p-3 sm:p-6 bg-black/40 backdrop-blur-xs animate-in fade-in duration-200">
          
          <div 
            className="w-full sm:w-[420px] max-h-[85vh] overflow-y-auto bg-white rounded-3xl shadow-2xl border-2 border-[#18757d]/20 p-5 sm:p-6 text-[#332420] space-y-5 animate-in slide-in-from-bottom sm:slide-in-from-left duration-200"
            role="dialog"
            aria-modal="true"
          >
            
            {/* HEADER */}
            <div className="flex items-center justify-between border-b border-[#eee7da] pb-3">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-[#e6f4f3] text-[#18757d] flex items-center justify-center font-bold">
                  <Eye className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-extrabold text-[#332420]">Accessibilité (Ally)</h3>
                  <p className="text-[11px] text-[#5e4d46] font-medium">Personnalise ton confort de lecture</p>
                </div>
              </div>

              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-[#332420] hover:bg-slate-100 transition-colors cursor-pointer"
                aria-label="Fermer le panneau d'accessibilité"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* QUICK CONTROLS GRID */}
            <div className="space-y-4 text-xs font-bold">
              
              {/* 1. TAILLE DU TEXTE */}
              <div className="space-y-2">
                <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Type className="w-3.5 h-3.5 text-[#18757d]" />
                  Taille du texte
                </label>
                <div className="grid grid-cols-4 gap-1.5">
                  {[
                    { key: 'normal', label: '100%' },
                    { key: 'lg', label: '112%' },
                    { key: 'xl', label: '125%' },
                    { key: 'xxl', label: '140%' }
                  ].map(item => (
                    <button
                      key={item.key}
                      onClick={() => setState(prev => ({ ...prev, fontSize: item.key as any }))}
                      className={`py-2 px-1 rounded-xl border text-center transition-all cursor-pointer ${
                        state.fontSize === item.key
                          ? 'bg-[#18757d] text-white border-[#18757d] shadow-xs'
                          : 'bg-[#faf8f5] text-[#332420] border-[#eee7da] hover:border-[#18757d]'
                      }`}
                    >
                      {item.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* 2. CONTRASTES & COULEURS */}
              <div className="space-y-2">
                <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Sun className="w-3.5 h-3.5 text-[#F2542D]" />
                  Contraste & Affichage
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setState(prev => ({ 
                      ...prev, 
                      contrastMode: prev.contrastMode === 'high' ? 'normal' : 'high' 
                    }))}
                    className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                      state.contrastMode === 'high'
                        ? 'bg-[#18757d] text-white border-[#18757d]'
                        : 'bg-[#faf8f5] border-[#eee7da] hover:border-[#18757d]'
                    }`}
                  >
                    <span>Contraste élevé</span>
                    {state.contrastMode === 'high' && <Check className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    onClick={() => setState(prev => ({ 
                      ...prev, 
                      contrastMode: prev.contrastMode === 'dark' ? 'normal' : 'dark' 
                    }))}
                    className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                      state.contrastMode === 'dark'
                        ? 'bg-[#18757d] text-white border-[#18757d]'
                        : 'bg-[#faf8f5] border-[#eee7da] hover:border-[#18757d]'
                    }`}
                  >
                    <span>Mode Sombre</span>
                    {state.contrastMode === 'dark' && <Check className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    onClick={() => setState(prev => ({ 
                      ...prev, 
                      contrastMode: prev.contrastMode === 'grayscale' ? 'normal' : 'grayscale' 
                    }))}
                    className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                      state.contrastMode === 'grayscale'
                        ? 'bg-[#18757d] text-white border-[#18757d]'
                        : 'bg-[#faf8f5] border-[#eee7da] hover:border-[#18757d]'
                    }`}
                  >
                    <span>Niveaux de gris</span>
                    {state.contrastMode === 'grayscale' && <Check className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    onClick={() => setState(prev => ({ ...prev, dyslexicFont: !prev.dyslexicFont }))}
                    className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                      state.dyslexicFont
                        ? 'bg-[#18757d] text-white border-[#18757d]'
                        : 'bg-[#faf8f5] border-[#eee7da] hover:border-[#18757d]'
                    }`}
                  >
                    <span>Police Dyslexie</span>
                    {state.dyslexicFont && <Check className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* 3. AIDE À LA LECTURE & ERGONOMIE */}
              <div className="space-y-2">
                <label className="text-[11px] font-extrabold uppercase tracking-wider text-slate-500 flex items-center gap-1.5">
                  <Sliders className="w-3.5 h-3.5 text-[#18757d]" />
                  Aides de Navigation
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    onClick={() => setState(prev => ({ ...prev, readingRuler: !prev.readingRuler }))}
                    className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                      state.readingRuler
                        ? 'bg-[#18757d] text-white border-[#18757d]'
                        : 'bg-[#faf8f5] border-[#eee7da] hover:border-[#18757d]'
                    }`}
                  >
                    <span>Règle de lecture</span>
                    {state.readingRuler && <Check className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    onClick={() => setState(prev => ({ ...prev, highlightLinks: !prev.highlightLinks }))}
                    className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                      state.highlightLinks
                        ? 'bg-[#18757d] text-white border-[#18757d]'
                        : 'bg-[#faf8f5] border-[#eee7da] hover:border-[#18757d]'
                    }`}
                  >
                    <span>Surligner liens</span>
                    {state.highlightLinks && <Check className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    onClick={() => setState(prev => ({ ...prev, textSpacing: !prev.textSpacing }))}
                    className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                      state.textSpacing
                        ? 'bg-[#18757d] text-white border-[#18757d]'
                        : 'bg-[#faf8f5] border-[#eee7da] hover:border-[#18757d]'
                    }`}
                  >
                    <span>Espacer textes</span>
                    {state.textSpacing && <Check className="w-3.5 h-3.5" />}
                  </button>

                  <button
                    onClick={() => setState(prev => ({ ...prev, stopAnimations: !prev.stopAnimations }))}
                    className={`p-2.5 rounded-xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                      state.stopAnimations
                        ? 'bg-[#18757d] text-white border-[#18757d]'
                        : 'bg-[#faf8f5] border-[#eee7da] hover:border-[#18757d]'
                    }`}
                  >
                    <span>Stopper anims</span>
                    {state.stopAnimations && <Check className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {/* 4. LECTEUR VOCAL (TEXT-TO-SPEECH) */}
              <div className="pt-2 border-t border-[#eee7da]">
                <button
                  onClick={handleToggleSpeech}
                  className={`w-full py-3 px-4 rounded-2xl font-black text-xs uppercase tracking-wider flex items-center justify-center gap-2 transition-all cursor-pointer shadow-sm ${
                    isSpeaking 
                      ? 'bg-amber-500 hover:bg-amber-600 text-white animate-pulse'
                      : 'bg-[#18757d] hover:bg-[#12595f] text-white'
                  }`}
                >
                  {isSpeaking ? (
                    <>
                      <VolumeX className="w-4 h-4" />
                      <span>Arrêter la lecture audio</span>
                    </>
                  ) : (
                    <>
                      <Volume2 className="w-4 h-4" />
                      <span>Lire la page / sélection à voix haute</span>
                    </>
                  )}
                </button>
              </div>

            </div>

            {/* FOOTER ACTIONS */}
            <div className="pt-3 border-t border-[#eee7da] flex items-center justify-between text-xs">
              <button
                onClick={handleReset}
                className="text-slate-500 hover:text-[#F2542D] font-extrabold flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Réinitialiser tout</span>
              </button>

              <button
                onClick={() => setIsOpen(false)}
                className="px-4 py-2 bg-[#FAF8F5] hover:bg-[#eee7da] border border-[#eee7da] font-extrabold text-[#332420] rounded-xl transition-colors cursor-pointer"
              >
                Fermer
              </button>
            </div>

          </div>

        </div>
      )}
    </>
  );
}
