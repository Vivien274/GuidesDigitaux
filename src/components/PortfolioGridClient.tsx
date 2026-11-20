"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ExternalLink,
  Quote,
  X,
  Sparkles,
  ChevronLeft,
  ChevronRight,
  Maximize2,
  CheckCircle2,
  HelpCircle,
  Phone
} from "lucide-react";

export type ProjectItem = {
  id: string;
  slug: string;
  title: string;
  clientName: string;
  category: string;
  year: string;
  summary: string;
  challenge?: string | null;
  solution?: string | null;
  result?: string | null;
  testimonialText?: string | null;
  testimonialAuthor?: string | null;
  image: string;
  gallery?: string | null; // JSON string array
  liveUrl?: string | null;
};

export default function PortfolioGridClient({ projects }: { projects: ProjectItem[] }) {
  const [selectedProject, setSelectedProject] = useState<ProjectItem | null>(null);
  const [lightboxImageIndex, setLightboxImageIndex] = useState<number | null>(null);

  // Parse gallery images for selected project
  const getGalleryImages = (project: ProjectItem): string[] => {
    try {
      if (!project.gallery) return [project.image];
      const parsed = JSON.parse(project.gallery);
      if (Array.isArray(parsed) && parsed.length > 0) return parsed;
    } catch {
      // fallback
    }
    return [project.image];
  };

  // Helper to parse markdown links [text](url) into clickable <a> tags
  const renderFormattedText = (text?: string | null) => {
    if (!text) return null;
    const parts: (string | React.ReactNode)[] = [];
    const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
    let lastIndex = 0;
    let match;

    while ((match = linkRegex.exec(text)) !== null) {
      if (match.index > lastIndex) {
        parts.push(text.substring(lastIndex, match.index));
      }
      parts.push(
        <a
          key={match.index}
          href={match[2]}
          target="_blank"
          rel="noreferrer"
          className="font-bold text-[#18757d] hover:underline inline-flex items-center gap-0.5"
          onClick={(e) => e.stopPropagation()}
        >
          {match[1]}
          <ExternalLink className="w-3.5 h-3.5 inline text-[#18757d]" />
        </a>
      );
      lastIndex = linkRegex.lastIndex;
    }
    if (lastIndex < text.length) {
      parts.push(text.substring(lastIndex));
    }

    return parts;
  };

  // Helper to generate precise descriptive SEO alt tags for every image
  const getImageAlt = (imgUrl: string, projectTitle: string): string => {
    const altMap: Record<string, string> = {
      // Guides Digitaux
      "guidesdigitaux-hero.webp": "Page d'accueil et présentation des guides digitaux pour artisans",
      "guidesdigitaux-presentation.webp": "Présentation de la plateforme de formation digitale sans stress et sans jargon",
      "guidesdigitaux-artisans.webp": "Accompagnement à la digitalisation des artisans et créateurs d'entreprise",
      "guidesdigitaux-stephanie.webp": "Présentation de Stéphanie ROCQ consultante en digitalisation des TPE et artisans",
      "guidesdigitaux-concept.webp": "Présentation du concept le digital expliqué simplement pour artisans",
      "guidesdigitaux-formations.webp": "Catalogue des formations digitales WordPress et WooCommerce",
      "guidesdigitaux-blog.webp": "Espace actualités et blog pour les créateurs et indépendants",
      "guidesdigitaux-newsletter.webp": "Formulaire de capture et mini-guide offert pour indépendants",
      "guidesdigitaux-footer.webp": "Pied de page et newsletter du site guides-digitaux.com",

      // Cyaness
      "cyaness-hero.webp": "Boutique en ligne de savons artisanaux et cosmétique saine Cyaness",
      "cyaness-origines.webp": "Les origines de Cyaness et la rencontre avec l'élevage familial d'ânesses",
      "cyaness-histoire.webp": "Des cosmétiques artisanaux qui ont une histoire et les nouveautés de la boutique",
      "cyaness-engagements.webp": "Des soins artisanaux au lait d'ânesse et engagements éthiques Bio et Cruelty free",
      "cyaness-catalogue.webp": "Catalogue des soins signature et savons saponifiés à froid",
      "cyaness-gamme.webp": "Gamme de soins artisanaux fabriqués en France à Comines",
      "cyaness-avis.webp": "Témoignages et avis clients satisfaits de la savonnerie Cyaness",
      "cyaness-contact.webp": "Formulaire de contact et atelier Cyaness à Comines",
      "cyaness-newsletter.webp": "Formulaire d'inscription newsletter et pied de page Cyaness",

      // 1m2 : ma santé !
      "1m2masante-hero.webp": "Page d'accueil et bandeau d'accueil association 1m2 ma santé",
      "1m2masante-histoire.webp": "Une histoire de transmission autour des plantes médicinales",
      "1m2masante-origine.webp": "A l'origine de l'association 1m2 ma santé et savoirs ancestraux",
      "1m2masante-plantes.webp": "Transmission des connaissances et sensibilisation aux plantes médicinales",
      "1m2masante-pedagogie.webp": "Transmettre par le récit et la pédagogie avec les enfants au cœur du projet",
      "1m2masante-enfants.webp": "Transmission aux enfants et présentation des livres éducatifs sur les plantes",
      "1m2masante-soutenir.webp": "Une association tournée vers le partage, l'avenir et le soutien",
      "1m2masante-points-vente.webp": "Points de vente en France des livres et coffrets 1m2 ma santé",
      "1m2masante-contact.webp": "Section contact et accès aux livres de l'association 1m2 ma santé",
      "1m2masante-formulaire.webp": "Formulaire de contact guidé et accord RGPD",

      // Studio Macarons
      "studiomacarons.webp": "Boutique en ligne et réservations ateliers pâtisserie Studio Macarons",
      "page d'accueil-studiomacarons.webp": "Page d'accueil Studio Macarons pâtisserie artisanale",
      "page ateliers - studiomacarons.webp": "Système de réservation des ateliers pâtisserie",
      "ateliers enfants - studiomacarons.webp": "Ateliers pâtisserie enfants et évènements sur-mesure",
      "page boutique studiomacarons.webp": "Boutique Click & Collect de macarons faits maison",
      "personnalisation - studiomacarons.webp": "Formulaire de personnalisation des macarons et évènementiel",
      "formulaire de contact - studiomacarons.webp": "Formulaire de contact qualifié Studio Macarons",
      "avis - studiomacarons.webp": "Témoignages et avis clients Studio Macarons",

      // L'instant Brut
      "linstantbrutmin.jpg": "Portfolio photographe indépendant L'instant Brut",
      "linstantbrut-1.webp": "Portfolio photographe indépendant L'instant Brut",
      "linstantbrut-2.webp": "Galerie photo reportage et portraits épurés",
      "linstantbrut-3.webp": "Présentation des prestations photographiques",
      "linstantbrut-4.webp": "Espace client sécurisé pour séances photos",
      "linstantbrut-5.webp": "Page de contact et réservation séance photo",

      // Artfolium
      "artfolium.jpg": "Identité visuelle et site vitrine jardinier paysagiste Artfolium",
      "artfolium-1.jpg": "Identité visuelle et site vitrine jardinier paysagiste Artfolium",
      "capture-site-artfolium.webp": "Page d'accueil Artfolium paysagiste",
      "capture-paage-artfolium.webp": "Présentation des services d'aménagement paysager",
      "logo-carre-artfolium.webp": "Logo vectoriel Artfolium paysagiste",

      // Spoolio
      "spoolio.webp": "Boutique e-commerce d'objets en impression 3D Spoolio",
      "accueil-spoolio.webp": "Page d'accueil boutique Spoolio objets 3D",
      "footer-spoolio.webp": "Pied de page et informations légales boutique 3D",
      "blog-spoolio.webp": "Section blog et tutoriels impression 3D",
      "panier-spoolio.webp": "Tunnel de commande et panier e-commerce Spoolio",

      // Décalé-Katam
      "decalekatam.webp": "Boutique e-commerce objets en bois décalés Décalé Katam",
      "decalekatam-2.webp": "Créations artisanales en bois gravé et personnalisé",
      "decalekatam-3.webp": "Présentation des objets déco et vannes humoristiques",
      "page blog DK.webp": "Articles de blog et actualités Décalé Katam",
      "page-conception-DK.webp": "Atelier de fabrication et conception artisanale en bois",

      // Handmakers
      "handmakers.jpg": "Blog créatif et tutoriels DIY Handmakers",
      "page-accueil-handmakers.webp": "Page d'accueil blog fait-main et DIY Handmakers",
      "blog-handmakers.webp": "Articles de couture, gravure laser et impression 3D",
      "contact-handmakers.webp": "Formulaire de contact et écosystème Handmakers",
    };

    const filename = decodeURIComponent(imgUrl.split("/").pop() || "");
    const description = altMap[filename] || `${projectTitle} - visuel et réalisation web`;

    // Vary location keywords for natural local SEO (Comines France, Hauts-de-France, Nord de la France, Métropole lilloise)
    const locations = [
      "Comines France",
      "Hauts-de-France",
      "Nord de la France",
      "Métropole lilloise",
      "Comines & Hauts-de-France",
      "Lille & Métropole lilloise",
    ];

    let hash = 0;
    for (let i = 0; i < filename.length; i++) {
      hash = (hash << 5) - hash + filename.charCodeAt(i);
      hash |= 0;
    }
    const location = locations[Math.abs(hash) % locations.length];

    return `${description} - création de site - stratec digital - ${location}`;
  };

  // Close modal on ESC key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        if (lightboxImageIndex !== null) {
          setLightboxImageIndex(null);
        } else {
          setSelectedProject(null);
        }
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxImageIndex]);

  // Lock body scroll when modal is open
  useEffect(() => {
    if (selectedProject) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [selectedProject]);

  const galleryImages = selectedProject ? getGalleryImages(selectedProject) : [];

  return (
    <>
      {/* PROJECTS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {projects.map((project) => (
          <div
            key={project.id}
            onClick={() => setSelectedProject(project)}
            className="bg-white rounded-3xl border border-slate-200/80 shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden flex flex-col justify-between group cursor-pointer ring-0 hover:ring-2 hover:ring-[#18757d]/20"
          >
            <div>
              {/* Thumbnail */}
              <div className="relative h-64 w-full bg-slate-100 overflow-hidden">
                <Image
                  src={project.image}
                  alt={getImageAlt(project.image, project.title)}
                  fill
                  className="object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute top-4 left-4 bg-[#332420]/90 backdrop-blur-md text-white text-xs font-bold px-3.5 py-1 rounded-full shadow-xs">
                  {project.category}
                </div>
                <div className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-md text-[#332420] text-xs font-extrabold px-3 py-1 rounded-full shadow-xs flex items-center gap-1 group-hover:bg-[#18757d] group-hover:text-white transition-colors">
                  <span>Voir le détail</span>
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
              </div>

              {/* Card Body */}
              <div className="p-6 space-y-3">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-black text-[#332420] group-hover:text-[#18757d] transition-colors">
                    {project.title}
                  </h2>
                  <span className="text-xs font-semibold text-slate-400 bg-slate-100 px-2.5 py-1 rounded-full">
                    {project.year}
                  </span>
                </div>

                <p className="text-xs font-bold text-[#18757d] uppercase tracking-wider">
                  {project.clientName}
                </p>

                <p className="text-sm text-slate-600 line-clamp-3 leading-relaxed">
                  {project.summary}
                </p>
              </div>
            </div>

            {/* Card Footer Button */}
            <div className="p-6 pt-0">
              <button
                type="button"
                className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-xl font-bold text-xs bg-slate-100 group-hover:bg-[#332420] text-[#332420] group-hover:text-white transition-all shadow-xs"
              >
                <span>Découvrir la réalisation</span>
                <Sparkles className="w-3.5 h-3.5 text-[#18757d] group-hover:text-[#f4ede0]" />
              </button>
            </div>
          </div>
        ))}

        {/* PROJET À VENIR CARD */}
        <div className="bg-gradient-to-br from-[#faf8f5] via-white to-[#f4ede0]/30 rounded-3xl border-2 border-dashed border-[#332420]/20 p-8 flex flex-col items-center justify-center text-center space-y-4 shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-[#f4ede0] text-[#332420] flex items-center justify-center font-black text-2xl shadow-xs">
            🚀
          </div>
          <div className="space-y-2">
            <span className="text-xs font-extrabold text-[#18757d] uppercase tracking-wider">
              Ton futur site web ?
            </span>
            <h3 className="text-xl font-black text-[#332420]">Ton projet pourrait être ici !</h3>
            <p className="text-xs text-slate-600 max-w-xs mx-auto leading-relaxed">
              Créons ensemble la vitrine ou la boutique digitale qui fera rayonner ton savoir-faire.
            </p>
          </div>
          <Link
            href="/contact"
            className="px-5 py-2.5 rounded-xl font-extrabold text-xs bg-[#332420] hover:bg-[#18757d] text-white transition-all shadow-md inline-flex items-center gap-2"
          >
            <span>Discuter de ton projet</span>
          </Link>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* PROJECT DETAIL MODAL */}
      {/* ========================================================================= */}
      {selectedProject && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-10 bg-slate-900/80 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
          <div
            className="relative w-full max-w-4xl bg-white rounded-3xl shadow-2xl overflow-hidden my-auto border border-slate-100 max-h-[90vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* MODAL HEADER */}
            <div className="sticky top-0 z-10 bg-white/95 backdrop-blur-md px-6 py-5 border-b border-slate-100 flex items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full bg-[#18757d]/10 text-[#18757d] text-xs font-extrabold uppercase tracking-wider">
                  {selectedProject.category}
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-[#332420]">
                  {selectedProject.title}
                </h3>
              </div>

              <button
                type="button"
                onClick={() => setSelectedProject(null)}
                className="w-9 h-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-600 flex items-center justify-center transition-colors shrink-0"
                aria-label="Fermer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* MODAL BODY */}
            <div className="p-6 sm:p-8 overflow-y-auto space-y-8 text-[#332420]">
              
              {/* HERO BANNER IMAGE */}
              <div className="relative h-64 sm:h-96 w-full rounded-2xl overflow-hidden bg-slate-100 border border-slate-200/80 shadow-inner group">
                <Image
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  fill
                  className="object-cover"
                />
                {selectedProject.liveUrl && (
                  <a
                    href={selectedProject.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="absolute bottom-4 right-4 bg-[#332420] hover:bg-[#18757d] text-white text-xs font-extrabold px-4 py-2.5 rounded-xl shadow-md transition-colors inline-flex items-center gap-2"
                  >
                    <span>Visiter le site en ligne</span>
                    <ExternalLink className="w-4 h-4 text-[#f4ede0]" />
                  </a>
                )}
              </div>

              {/* CLIENT & BRIEF */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-2">
                <div className="md:col-span-1 bg-[#faf8f5] p-5 rounded-2xl space-y-3 border border-[#332420]/10">
                  <h4 className="text-xs font-extrabold uppercase tracking-wider text-[#18757d]">
                    Informations Projet
                  </h4>
                  <div className="space-y-2 text-xs sm:text-sm">
                    <div>
                      <span className="text-slate-400 block font-semibold text-[11px]">CLIENT</span>
                      <span className="font-bold text-[#332420]">{selectedProject.clientName}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-semibold text-[11px]">ANNÉE</span>
                      <span className="font-bold text-[#332420]">{selectedProject.year}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-semibold text-[11px]">TYPE DE PRESTATION</span>
                      <span className="font-bold text-[#332420]">{selectedProject.category}</span>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2 space-y-3">
                  <h4 className="text-sm font-extrabold uppercase tracking-wider text-[#332420] flex items-center gap-2">
                    🎯 Le Brief de départ &amp; les Défis
                  </h4>
                  <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                    {renderFormattedText(selectedProject.challenge || selectedProject.summary)}
                  </p>
                </div>
              </div>

              {/* SOLUTION & CONSEILS */}
              {selectedProject.solution && (
                <div className="space-y-3 bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs">
                  <h4 className="text-sm font-extrabold uppercase tracking-wider text-[#332420] flex items-center gap-2">
                    💡 Les conseils &amp; solutions apportés par Stéphanie
                  </h4>
                  <p className="text-sm text-slate-700 leading-relaxed whitespace-pre-line">
                    {renderFormattedText(selectedProject.solution)}
                  </p>
                  {selectedProject.result && (
                    <div className="pt-3 border-t border-slate-100 flex items-center gap-2 text-xs font-extrabold text-[#18757d]">
                      <CheckCircle2 className="w-4 h-4 text-[#0E9594] shrink-0" />
                      <span>Résultat obtenu : {selectedProject.result}</span>
                    </div>
                  )}
                </div>
              )}

              {/* TESTIMONIAL */}
              {selectedProject.testimonialText && (
                <div className="p-6 bg-[#f4ede0]/40 rounded-2xl border border-[#332420]/10 space-y-3">
                  <div className="flex items-center gap-2 text-[#18757d]">
                    <Quote className="w-5 h-5 fill-[#18757d]" />
                    <span className="text-xs font-black uppercase tracking-wider text-[#332420]">
                      Témoignage Client
                    </span>
                  </div>
                  <p className="italic text-slate-800 text-sm font-medium leading-relaxed">
                    &quot;{selectedProject.testimonialText}&quot;
                  </p>
                  <p className="text-right font-bold text-[#332420] text-xs">
                    &mdash; {selectedProject.testimonialAuthor}
                  </p>
                </div>
              )}

              {/* PHOTO GALLERY */}
              <div className="space-y-4 pt-2">
                <h4 className="text-sm font-extrabold uppercase tracking-wider text-[#332420]">
                  📷 Captures d&apos;écran &amp; Photos de la réalisation
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {galleryImages.map((imgUrl, idx) => (
                    <div
                      key={idx}
                      onClick={() => setLightboxImageIndex(idx)}
                      className="relative h-44 rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 group cursor-pointer shadow-xs hover:shadow-md transition-all"
                    >
                      <Image
                        src={imgUrl}
                        alt={getImageAlt(imgUrl, selectedProject.title)}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute inset-0 bg-slate-900/30 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white">
                        <Maximize2 className="w-6 h-6 drop-shadow-md" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* MODAL FOOTER CALL TO ACTION */}
              <div className="pt-6 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-4">
                {selectedProject.liveUrl ? (
                  <a
                    href={selectedProject.liveUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-sm bg-[#332420] hover:bg-[#18757d] text-white transition-all shadow-md inline-flex items-center justify-center gap-2"
                  >
                    <span>Visiter le site en ligne</span>
                    <ExternalLink className="w-4 h-4 text-[#f4ede0]" />
                  </a>
                ) : (
                  <div />
                )}

                <Link
                  href="/contact"
                  className="w-full sm:w-auto px-6 py-3.5 rounded-xl font-bold text-sm bg-[#18757d] hover:bg-[#d8431f] text-white transition-all shadow-md inline-flex items-center justify-center gap-2"
                >
                  <span>Créer un projet similaire</span>
                </Link>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* LIGHTBOX FOR FULL IMAGE PREVIEW */}
      {selectedProject && lightboxImageIndex !== null && (
        <div
          className="fixed inset-0 z-[60] bg-black/95 flex items-center justify-center p-4"
          onClick={() => setLightboxImageIndex(null)}
        >
          <button
            type="button"
            onClick={() => setLightboxImageIndex(null)}
            className="absolute top-6 right-6 text-white hover:text-slate-300 p-2 rounded-full bg-white/10"
            aria-label="Fermer la photo"
          >
            <X className="w-6 h-6" />
          </button>

          {galleryImages.length > 1 && (
            <>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxImageIndex(
                    (lightboxImageIndex - 1 + galleryImages.length) % galleryImages.length
                  );
                }}
                className="absolute left-4 top-1/2 -translate-y-1/2 text-white hover:text-slate-300 p-3 rounded-full bg-white/10"
              >
                <ChevronLeft className="w-6 h-6" />
              </button>

              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setLightboxImageIndex((lightboxImageIndex + 1) % galleryImages.length);
                }}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-white hover:text-slate-300 p-3 rounded-full bg-white/10"
              >
                <ChevronRight className="w-6 h-6" />
              </button>
            </>
          )}

          <div
            className="relative max-w-5xl max-h-[85vh] w-full h-full flex items-center justify-center"
            onClick={(e) => e.stopPropagation()}
          >
            <Image
              src={galleryImages[lightboxImageIndex]}
              alt={getImageAlt(galleryImages[lightboxImageIndex], selectedProject.title)}
              width={1400}
              height={900}
              className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
            />
          </div>
        </div>
      )}
    </>
  );
}
