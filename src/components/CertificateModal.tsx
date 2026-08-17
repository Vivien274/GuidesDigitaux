'use client';

import React, { useRef } from 'react';
import { Printer, X, Award, Calendar, CheckCircle2 } from 'lucide-react';

interface CertificateModalProps {
  isOpen: boolean;
  onClose: () => void;
  studentName: string;
  courseTitle: string;
  completionDate?: string;
}

export default function CertificateModal({
  isOpen,
  onClose,
  studentName,
  courseTitle,
  completionDate
}: CertificateModalProps) {
  const printRef = useRef<HTMLDivElement>(null);

  if (!isOpen) return null;

  const formattedDate = completionDate || new Date().toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const isWoo = courseTitle.toLowerCase().includes('woocommerce') || courseTitle.toLowerCase().includes('boutique');
  const isWp = courseTitle.toLowerCase().includes('wordpress') || courseTitle.toLowerCase().includes('vitrine');
  
  const bgImage = isWoo
    ? '/images/certificates/certificat-woocommerce.png'
    : (isWp ? '/images/certificates/certificat-wordpress.png' : '/images/certificates/certificat-wordpress.png');

  const cleanStudentName = studentName && studentName.trim().length > 0 ? studentName : 'Élève Guides Digitaux';
  const cleanCourseTitle = courseTitle ? courseTitle.replace(/^formation\s*:\s*/i, '') : 'formation';

  const handlePrint = () => {
    if (typeof window === 'undefined') return;
    const printContent = printRef.current;
    if (!printContent) return;

    const printWindow = window.open('', '_blank');
    if (!printWindow) return;

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Certificat de Formation - ${cleanStudentName}</title>
          <style>
            @page {
              size: A4 landscape;
              margin: 0;
            }
            body {
              margin: 0;
              padding: 0;
              background-color: #faf8f5;
              font-family: 'Georgia', serif;
              display: flex;
              align-items: center;
              justify-content: center;
              height: 100vh;
            }
            .cert-container {
              position: relative;
              width: 100vw;
              height: 100vh;
              max-width: 1120px;
              max-height: 790px;
              box-sizing: border-box;
            }
            .cert-bg {
              width: 100%;
              height: 100%;
              object-fit: contain;
            }
            .name-overlay {
              position: absolute;
              top: 45.5%;
              left: 50%;
              transform: translate(-50%, -50%);
              width: 60%;
              text-align: center;
              font-size: 28px;
              font-weight: 800;
              font-style: italic;
              color: #2d1e18;
              letter-spacing: 0.5px;
            }
            .date-overlay {
              position: absolute;
              bottom: 4.5%;
              right: 5%;
              font-size: 13px;
              font-weight: 600;
              color: #5e4d46;
              background: rgba(248, 243, 233, 0.85);
              padding: 4px 12px;
              border-radius: 6px;
            }
          </style>
        </head>
        <body>
          <div class="cert-container">
            <img src="${bgImage}" class="cert-bg" alt="Certificat de fin de formation" />
            <div class="name-overlay">${cleanStudentName}</div>
            <div class="date-overlay">Délivré le ${formattedDate}</div>
          </div>
          <script>
            window.onload = function() {
              window.print();
              setTimeout(function() { window.close(); }, 500);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/75 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-[#faf8f5] rounded-3xl border border-[#eee7da] shadow-2xl w-full max-w-4xl overflow-hidden flex flex-col my-auto animate-in fade-in zoom-in-95 duration-200">
        
        {/* Header */}
        <div className="p-5 bg-white border-b border-[#eee7da] flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-[#e6f4f3] text-[#18757d] flex items-center justify-center shrink-0">
              <Award className="w-5 h-5" />
            </div>
            <div>
              <span className="text-[10px] font-extrabold bg-[#e6f4f3] text-[#18757d] px-2 py-0.5 rounded-md uppercase tracking-wider">
                Certificat Officiel de Réussite
              </span>
              <h3 className="text-base font-extrabold text-[#332420] leading-tight">
                {courseTitle}
              </h3>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-[#18757d] hover:bg-[#12595f] text-white rounded-xl text-xs font-extrabold transition-colors flex items-center gap-1.5 shadow-sm cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              Imprimer / Télécharger (PDF)
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-xl transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Certificate Display Area */}
        <div className="p-6 bg-slate-900/5 flex items-center justify-center">
          <div
            ref={printRef}
            className="relative w-full max-w-[840px] aspect-[1.414/1] bg-white rounded-2xl shadow-xl border border-[#eee7da] overflow-hidden group select-none"
          >
            {/* Background Template */}
            {/* eslint-disable-next-html-element-for-img */}
            <img
              src={bgImage}
              alt="Certificat de participation STRATEC Digital / Guides Digitaux"
              className="w-full h-full object-contain pointer-events-none"
            />

            {/* Dynamic Student Name Overlay */}
            <div className="absolute top-[45.2%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[65%] text-center font-serif text-xl sm:text-2xl md:text-3xl font-extrabold italic text-[#2d1e18] tracking-wide drop-shadow-2xs">
              {cleanStudentName}
            </div>

            {/* Dynamic Acquisition Date Overlay */}
            <div className="absolute bottom-[4.2%] right-[4.5%] text-[10px] sm:text-xs font-semibold text-[#5e4d46] bg-[#f8f3e9]/90 backdrop-blur-2xs px-2.5 py-1 rounded-md border border-[#eee7da]/80 shadow-2xs flex items-center gap-1.5">
              <Calendar className="w-3 h-3 text-[#18757d]" />
              Délivré le <span className="font-extrabold text-[#332420]">{formattedDate}</span>
            </div>
          </div>
        </div>

        {/* Footer info */}
        <div className="p-4 bg-white border-t border-[#eee7da] flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-slate-500 font-medium">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Félicitations pour l'obtention de votre certificat de compétences !</span>
          </div>
          <span className="text-slate-400 font-mono text-[11px]">
            Organisme : STRATEC Digital / Guides Digitaux
          </span>
        </div>

      </div>
    </div>
  );
}
