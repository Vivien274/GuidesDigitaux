'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Course } from '@/lib/coursesStore';
import { fetchCoursesFromDb, fetchPreordersFromDb, savePreorderToDb, deletePreorderFromDb, fetchPreorderBuyersFromDb, deletePreorderBuyerFromDb, PreorderBuyer } from '@/lib/supabaseLms';
import { getStoredPreorders, savePreorder, PreorderCampaign, formatFrenchDate, getPreorderStatusDetails, getPreorderDestinationUrl } from '@/lib/preordersStore';
import { 
  ArrowLeft, 
  Plus, 
  Calendar, 
  Tag, 
  Users, 
  Target, 
  Award, 
  CheckCircle2, 
  Sparkles, 
  Gift, 
  Edit3, 
  Clock, 
  TrendingUp,
  Save,
  Rocket,
  ExternalLink,
  ImageIcon,
  Upload,
  Link2,
  Globe,
  RefreshCw,
  Trash2,
  ChevronDown,
  ChevronUp,
  Mail
} from 'lucide-react';

export default function FormateurPreorderPage() {
  const [courses, setCourses] = useState<Course[]>([]);
  const [preorders, setPreorders] = useState<PreorderCampaign[]>([]);

  // Form State for creating/editing a Preorder Campaign
  const [editingId, setEditingId] = useState<string | null>(null);
  const [selectedCourseId, setSelectedCourseId] = useState<string>('new');
  const [courseTitle, setCourseTitle] = useState<string>('');
  const [price, setPrice] = useState<string>('79');
  const [originalPrice, setOriginalPrice] = useState<string>('149');
  const [targetEnrollments, setTargetEnrollments] = useState<string>('15');
  const [currentEnrollments, setCurrentEnrollments] = useState<string>('18');
  const [endDate, setEndDate] = useState<string>('2026-08-20');
  const [releaseDate, setReleaseDate] = useState<string>('2026-09-15');
  const [imageUrl, setImageUrl] = useState<string>('https://www.guides-digitaux.com/wp-content/uploads/2026/02/un-artisan-createur-devant-son-PC-en-train-dajouter-ses-produits-dnas-saboutique-en-ligne.-accoude-a-son-etabli-dans-son-atelier.-lumiere-naturelle.webp');
  const [description, setDescription] = useState<string>('Formation pratique en précommande avec tarif privilégié de lancement.');
  const [bonus, setBonus] = useState<string>('Accès VIP au groupe privé + Fiche bonus exclusive');

  // Destination page state
  const [destinationType, setDestinationType] = useState<'existing' | 'custom'>('existing');
  const [selectedExistingPage, setSelectedExistingPage] = useState<string>('tunnel');
  const [customDestinationUrl, setCustomDestinationUrl] = useState<string>('');
  const [isFormOpen, setIsFormOpen] = useState<boolean>(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  const [buyers, setBuyers] = useState<PreorderBuyer[]>([]);
  const [expandedBuyersId, setExpandedBuyersId] = useState<string | null>(null);

  const handleDeleteBuyer = async (buyer: PreorderBuyer, campaignId?: string) => {
    if (confirm(`Voulez-vous supprimer définitivement la précommande de ${buyer.customerEmail} de la BDD Supabase ?`)) {
      await deletePreorderBuyerFromDb(buyer.id, buyer.customerEmail, campaignId);
      const updatedBuyers = await fetchPreorderBuyersFromDb();
      setBuyers(updatedBuyers);
      const updatedPreorders = await fetchPreordersFromDb();
      setPreorders(updatedPreorders);
      setSyncStatus(`✓ Précommande de ${buyer.customerEmail} supprimée définitivement de Supabase BDD.`);
      setTimeout(() => setSyncStatus(null), 4000);
    }
  };

  const handleDeletePreorder = async (po: PreorderCampaign) => {
    if (confirm(`Êtes-vous sûr de vouloir supprimer définitivement la précommande "${po.courseTitle}" de Supabase BDD ?`)) {
      const updated = await deletePreorderFromDb(po.id);
      setPreorders(updated);
      setSyncStatus(`✓ Précommande "${po.courseTitle}" supprimée définitivement de Supabase BDD.`);
      setTimeout(() => setSyncStatus(null), 4000);
    }
  };

  useEffect(() => {
    async function loadData() {
      const courseList = await fetchCoursesFromDb();
      setCourses(courseList);
      const preorderList = await fetchPreordersFromDb();
      setPreorders(preorderList);
      const buyersList = await fetchPreorderBuyersFromDb();
      setBuyers(buyersList);
    }
    loadData();
  }, []);

  const handleImageFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        if (typeof reader.result === 'string') {
          setImageUrl(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOpenCreateForm = () => {
    setEditingId(null);
    setSelectedCourseId('new');
    setCourseTitle('');
    setPrice('79');
    setOriginalPrice('149');
    setTargetEnrollments('15');
    setCurrentEnrollments('0');
    setEndDate('2026-08-20');
    setReleaseDate('2026-09-15');
    setImageUrl('https://www.guides-digitaux.com/wp-content/uploads/2026/02/un-artisan-createur-devant-son-PC-en-train-dajouter-ses-produits-dnas-saboutique-en-ligne.-accoude-a-son-etabli-dans-son-atelier.-lumiere-naturelle.webp');
    setDescription('Formation pratique en précommande avec tarif privilégié de lancement.');
    setBonus('Accès VIP au groupe privé + Fiche bonus exclusive');
    setDestinationType('existing');
    setSelectedExistingPage('tunnel');
    setCustomDestinationUrl('');
    setIsFormOpen(true);
  };

  const handleOpenEditForm = (po: PreorderCampaign) => {
    setEditingId(po.id);
    setSelectedCourseId(po.courseId || 'new');
    setCourseTitle(po.courseTitle);
    setPrice(po.price.toString());
    setOriginalPrice(po.originalPrice ? po.originalPrice.toString() : '149');
    setTargetEnrollments(po.targetEnrollments.toString());
    setCurrentEnrollments(po.currentEnrollments.toString());
    setEndDate(po.endDate || '2026-11-30');
    setReleaseDate(po.releaseDate || '2026-12-15');
    setImageUrl(po.image || 'https://www.guides-digitaux.com/wp-content/uploads/2026/02/un-artisan-createur-devant-son-PC-en-train-dajouter-ses-produits-dnas-saboutique-en-ligne.-accoude-a-son-etabli-dans-son-atelier.-lumiere-naturelle.webp');
    setDescription(po.description);
    setBonus(po.bonus);

    const type = po.destinationType || (po.destinationUrl?.startsWith('http') ? 'custom' : 'existing');
    setDestinationType(type);
    if (type === 'custom') {
      setCustomDestinationUrl(po.destinationUrl || '');
      setSelectedExistingPage('tunnel');
    } else {
      setSelectedExistingPage(po.destinationUrl || 'tunnel');
      setCustomDestinationUrl('');
    }
    setIsFormOpen(true);

    window.scrollTo({ top: 300, behavior: 'smooth' });
  };

  const handleCourseSelect = (id: string) => {
    setSelectedCourseId(id);
    if (id !== 'new') {
      const match = courses.find(c => c.id === id);
      if (match) {
        setCourseTitle(match.title);
        setPrice(match.price ? match.price.toString() : '79');
        setOriginalPrice(match.originalPrice ? match.originalPrice.toString() : '149');
      }
    }
  };

  const handleSaveCampaign = async (e: React.FormEvent) => {
    e.preventDefault();
    const currentId = editingId || `po-${Date.now()}`;
    let computedUrl = '';
    if (destinationType === 'custom') {
      computedUrl = customDestinationUrl.trim();
    } else {
      if (selectedExistingPage === 'tunnel') {
        computedUrl = `/tunnel/${currentId}`;
      } else if (selectedExistingPage === 'precommande_public') {
        computedUrl = `/precommande/${currentId}`;
      } else {
        computedUrl = selectedExistingPage;
      }
    }

    const updatedCamp: PreorderCampaign = {
      id: currentId,
      courseId: selectedCourseId !== 'new' ? selectedCourseId : undefined,
      courseTitle: courseTitle || 'Nouvelle Formation en Précommande',
      price: parseFloat(price) || 79,
      originalPrice: parseFloat(originalPrice) || 149,
      targetEnrollments: parseInt(targetEnrollments) || 25,
      currentEnrollments: parseInt(currentEnrollments) || 0,
      endDate: endDate || '2026-11-30',
      releaseDate: releaseDate || '2026-12-15',
      image: imageUrl,
      description,
      bonus,
      status: 'En cours',
      destinationType,
      destinationUrl: computedUrl
    };

    const updated = await savePreorderToDb(updatedCamp);
    setPreorders(updated);
    setIsFormOpen(false);
    setEditingId(null);
  };

  return (
    <div className="min-h-screen bg-[#faf8f5] text-[#332420] font-sans">
      <Header />

      {/* BREADCRUMB */}
      <div className="bg-[#f5f1e8] py-3.5 border-b border-[#e8ded0]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          <Link href="/dashboard/formateur" className="inline-flex items-center gap-1.5 text-xs font-bold text-[#18757d] hover:underline">
            <ArrowLeft className="w-4 h-4" />
            Retour au Studio Formateur
          </Link>
          <span className="text-xs font-extrabold text-[#332420]">
            Studio de Gestion des Précommandes (Image & Date inputs)
          </span>
        </div>
      </div>

      {/* BANNER HEADER */}
      <section className="py-10 bg-gradient-to-b from-[#eef4fb] to-[#faf8f5] border-b border-[#eee7da]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-2xl bg-amber-500 text-white flex items-center justify-center font-extrabold text-2xl shadow-md border-2 border-white">
              <Rocket className="w-8 h-8 text-white" />
            </div>
            <div>
              <span className="inline-block px-3 py-0.5 rounded-full text-[11px] font-extrabold bg-amber-100 text-amber-900 uppercase tracking-wider mb-1">
                Lancement & Édition de Précommandes
              </span>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-[#332420]">
                Gestionnaire des <span className="text-[#18757d]">Précommandes</span>
              </h1>
              <p className="text-xs text-[#5e4d46] font-medium">
                Upload d'image de couverture, sélection de dates type calendrier HTML5 et suivi des objectifs.
              </p>
            </div>
          </div>

          <button
            onClick={handleOpenCreateForm}
            className="px-6 py-4 text-xs font-extrabold text-white bg-[#18757d] hover:bg-[#12595f] rounded-2xl shadow-md uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            LANCER UNE NOUVELLE PRÉCOMMANDE
          </button>
        </div>

        {syncStatus && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-4">
            <div className="p-3.5 bg-emerald-100 border border-emerald-300 text-emerald-900 rounded-2xl text-xs font-extrabold flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-emerald-700 shrink-0" />
              <span>{syncStatus}</span>
            </div>
          </div>
        )}
      </section>

      {/* MAIN CONTENT AREA */}
      <section className="py-12 md:py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10">

          {/* CREATE / EDIT PREORDER FORM PANEL */}
          {isFormOpen && (
            <form onSubmit={handleSaveCampaign} className="bg-white p-8 sm:p-12 rounded-3xl border-2 border-amber-400 shadow-xl space-y-8 animate-in fade-in duration-200">
              <div className="border-b border-[#eee7da] pb-4 flex items-center justify-between">
                <div>
                  <h2 className="text-xl font-extrabold text-[#332420] flex items-center gap-2">
                    <Rocket className="w-5 h-5 text-amber-500" />
                    {editingId ? 'Édition de la Précommande' : 'Création d’une Nouvelle Précommande'}
                  </h2>
                  <p className="text-xs text-slate-500 mt-0.5">Téléversez l'image de couverture et réglez les dates d'échéance via le calendrier.</p>
                </div>
                
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-4 py-2 text-xs font-extrabold text-slate-500 hover:bg-slate-100 rounded-xl uppercase"
                >
                  Fermer
                </button>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                
                {/* Course Selection */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-extrabold text-[#332420]">Formation associée :</label>
                  <select
                    value={selectedCourseId}
                    onChange={(e) => handleCourseSelect(e.target.value)}
                    className="w-full bg-[#faf8f5] border border-[#eee7da] rounded-xl px-4 py-3.5 text-xs font-bold text-[#332420]"
                  >
                    <option value="new">+ Créer un nouveau projet de formation en précommande</option>
                    {courses.map(c => (
                      <option key={c.id} value={c.id}>Formation existante : {c.title}</option>
                    ))}
                  </select>
                </div>

                {/* Course Title */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-extrabold text-[#332420]">Titre de la Formation en précommande :</label>
                  <input
                    type="text"
                    required
                    placeholder="Ex: Masterclass Vidéo : Intelligence Artificielle pour les Artisans & TPE"
                    value={courseTitle}
                    onChange={(e) => setCourseTitle(e.target.value)}
                    className="w-full bg-[#faf8f5] border border-[#eee7da] rounded-xl px-4 py-3 text-xs font-bold text-[#332420]"
                  />
                </div>

                {/* IMAGE COVER UPLOAD & URL FIELD */}
                <div className="space-y-3 sm:col-span-2 p-5 bg-[#faf8f5] rounded-2xl border border-[#eee7da]">
                  <label className="text-xs font-extrabold text-[#332420] flex items-center gap-2">
                    <ImageIcon className="w-4 h-4 text-[#18757d]" />
                    Photo de couverture de la précommande (Affichée sur la fiche produit) :
                  </label>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
                    {/* Image Preview */}
                    <div className="relative h-36 w-full rounded-2xl overflow-hidden border-2 border-[#eee7da] bg-white">
                      {imageUrl ? (
                        <Image src={imageUrl} alt="Prévisualisation" fill className="object-cover" />
                      ) : (
                        <div className="h-full flex items-center justify-center text-xs text-slate-400 font-bold">Aperçu photo</div>
                      )}
                    </div>

                    {/* Upload Controls & URL */}
                    <div className="md:col-span-2 space-y-3">
                      <div className="flex items-center gap-3">
                        <label className="px-4 py-2.5 bg-[#18757d] text-white text-xs font-extrabold rounded-xl hover:bg-[#12595f] transition-colors cursor-pointer flex items-center gap-2">
                          <Upload className="w-4 h-4" />
                          Téléverser une image
                          <input type="file" accept="image/*" onChange={handleImageFileChange} className="hidden" />
                        </label>
                        <span className="text-[11px] text-slate-500 font-medium">PNG, JPG, WEBP acceptés</span>
                      </div>

                      <div className="space-y-1">
                        <label className="text-[10px] font-extrabold text-slate-600">Ou collez une URL d'image externe :</label>
                        <input
                          type="text"
                          placeholder="https://.../photo.webp"
                          value={imageUrl}
                          onChange={(e) => setImageUrl(e.target.value)}
                          className="w-full bg-white border border-[#eee7da] rounded-xl px-3 py-2 text-xs text-[#332420]"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Tarif Précommande & Tarif d'origine */}
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-[#332420]">Tarif Spécial Précommande (€ TTC) :</label>
                  <input
                    type="number"
                    required
                    value={price}
                    onChange={(e) => setPrice(e.target.value)}
                    className="w-full bg-[#faf8f5] border border-[#eee7da] rounded-xl px-4 py-3 text-xs font-bold text-[#18757d]"
                  />
                  <span className="text-[11px] text-slate-500">Tarif réduit consenti aux 1ers précommandeurs.</span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-[#332420]">Tarif officiel de sortie (€ TTC) :</label>
                  <input
                    type="number"
                    value={originalPrice}
                    onChange={(e) => setOriginalPrice(e.target.value)}
                    className="w-full bg-[#faf8f5] border border-[#eee7da] rounded-xl px-4 py-3 text-xs text-slate-400 line-through font-bold"
                  />
                  <span className="text-[11px] text-slate-500">Prix barré qui sera appliqué après le lancement.</span>
                </div>

                {/* Seuil d'inscriptions nécessaires */}
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-[#332420]">Objectif d'inscriptions nécessaires (Seuil) :</label>
                  <input
                    type="number"
                    required
                    placeholder="Ex: 25 précommandes"
                    value={targetEnrollments}
                    onChange={(e) => setTargetEnrollments(e.target.value)}
                    className="w-full bg-[#faf8f5] border border-[#eee7da] rounded-xl px-4 py-3 text-xs font-bold text-[#332420]"
                  />
                  <span className="text-[11px] text-slate-500">Nombre d'inscriptions requises pour valider le lancement.</span>
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-[#332420]">Précommandes déjà enregistrées :</label>
                  <input
                    type="number"
                    value={currentEnrollments}
                    onChange={(e) => setCurrentEnrollments(e.target.value)}
                    className="w-full bg-[#faf8f5] border border-[#eee7da] rounded-xl px-4 py-3 text-xs font-bold text-[#332420]"
                  />
                </div>

                {/* DATE INPUTS WITH CALENDAR (type="date") */}
                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-[#332420]">Date de fin de la campagne de précommande :</label>
                  <input
                    type="date"
                    required
                    value={endDate}
                    onChange={(e) => setEndDate(e.target.value)}
                    className="w-full bg-[#faf8f5] border border-[#eee7da] rounded-xl px-4 py-3 text-xs text-[#332420] font-bold"
                  />
                </div>

                <div className="space-y-1.5">
                  <label className="text-xs font-extrabold text-[#332420]">Date de sortie officielle du cours :</label>
                  <input
                    type="date"
                    required
                    value={releaseDate}
                    onChange={(e) => setReleaseDate(e.target.value)}
                    className="w-full bg-[#faf8f5] border border-[#eee7da] rounded-xl px-4 py-3 text-xs text-[#332420] font-bold"
                  />
                </div>

                {/* Description & Bonus */}
                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-extrabold text-[#332420]">Description du projet en précommande :</label>
                  <textarea
                    rows={3}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full bg-[#faf8f5] border border-[#eee7da] rounded-xl p-4 text-xs text-[#332420]"
                  ></textarea>
                </div>

                <div className="space-y-1.5 sm:col-span-2">
                  <label className="text-xs font-extrabold text-[#332420]">Bonus exclusif réservé aux précommandeurs :</label>
                  <input
                    type="text"
                    placeholder="Ex: Accès VIP au groupe privé + 50 Prompts prêts à l’emploi"
                    value={bonus}
                    onChange={(e) => setBonus(e.target.value)}
                    className="w-full bg-[#faf8f5] border border-[#eee7da] rounded-xl px-4 py-3 text-xs text-[#332420]"
                  />
                </div>

                {/* CHOICE OF DESTINATION PAGE / URL */}
                <div className="space-y-4 sm:col-span-2 p-6 bg-[#faf8f5] rounded-2xl border border-[#eee7da]">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <label className="text-xs font-extrabold text-[#332420] flex items-center gap-2">
                      <Link2 className="w-4 h-4 text-[#18757d]" />
                      Page de destination de la précommande (Redirection au clic) :
                    </label>
                    <span className="text-[11px] font-extrabold text-[#18757d] bg-[#e6f4f3] px-3 py-1 rounded-full border border-[#bce3e0] self-start sm:self-auto">
                      📍 {destinationType === 'custom' ? (customDestinationUrl || 'URL non définie') : (selectedExistingPage === 'tunnel' ? `/tunnel/${editingId || 'nouvelle-po'}` : selectedExistingPage === 'precommande_public' ? `/precommande/${editingId || 'nouvelle-po'}` : selectedExistingPage)}
                    </span>
                  </div>

                  {/* Toggle Type Radio Buttons */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <button
                      type="button"
                      onClick={() => setDestinationType('existing')}
                      className={`p-3.5 rounded-xl border text-xs font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        destinationType === 'existing'
                          ? 'bg-[#18757d] text-white border-[#18757d] shadow-xs'
                          : 'bg-white text-slate-700 border-[#eee7da] hover:bg-slate-50'
                      }`}
                    >
                      <Globe className="w-4 h-4" />
                      Une page existante du site
                    </button>

                    <button
                      type="button"
                      onClick={() => setDestinationType('custom')}
                      className={`p-3.5 rounded-xl border text-xs font-extrabold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                        destinationType === 'custom'
                          ? 'bg-[#18757d] text-white border-[#18757d] shadow-xs'
                          : 'bg-white text-slate-700 border-[#eee7da] hover:bg-slate-50'
                      }`}
                    >
                      <Link2 className="w-4 h-4" />
                      Une URL personnalisée (Lien libre)
                    </button>
                  </div>

                  {/* Mode: Page existante */}
                  {destinationType === 'existing' && (
                    <div className="space-y-1.5 pt-1">
                      <label className="text-[11px] font-extrabold text-slate-600">
                        Sélectionner la page cible dans la liste :
                      </label>
                      <select
                        value={selectedExistingPage}
                        onChange={(e) => setSelectedExistingPage(e.target.value)}
                        className="w-full bg-white border border-[#eee7da] rounded-xl px-4 py-3 text-xs font-bold text-[#332420]"
                      >
                        <optgroup label="✨ Pages Spécifiques Précommande">
                          <option value="tunnel">Tunnel de Vente Direct (/tunnel/{editingId || 'id'}) [Par défaut]</option>
                          <option value="precommande_public">Fiche Publique Précommande (/precommande/{editingId || 'id'})</option>
                          <option value="/precommande">Galerie de toutes les précommandes (/precommande)</option>
                        </optgroup>
                        
                        <optgroup label="🛍️ Pages Principales du Site">
                          <option value="/boutique">Boutique officielle (/boutique)</option>
                          <option value="/dashboard/eleve">Espace Élève (/dashboard/eleve)</option>
                          <option value="/a-propos">Page À propos (/a-propos)</option>
                          <option value="/contact">Page Contact (/contact)</option>
                          <option value="/blog">Le Blog (/blog)</option>
                        </optgroup>

                        {courses.length > 0 && (
                          <optgroup label="📚 Formations du Catalogue">
                            {courses.map(c => (
                              <option key={c.id} value={`/formation/${c.id}`}>
                                Formation : {c.title} (/formation/{c.id})
                              </option>
                            ))}
                          </optgroup>
                        )}
                      </select>
                    </div>
                  )}

                  {/* Mode: URL personnalisée */}
                  {destinationType === 'custom' && (
                    <div className="space-y-1.5 pt-1">
                      <label className="text-[11px] font-extrabold text-slate-600">
                        Saisissez l'URL personnalisée (externe `https://...` ou interne `/...`) :
                      </label>
                      <input
                        type="text"
                        required={destinationType === 'custom'}
                        placeholder="Ex: https://mon-domaine.com/page-specifique ou /landing-page"
                        value={customDestinationUrl}
                        onChange={(e) => setCustomDestinationUrl(e.target.value)}
                        className="w-full bg-white border border-[#eee7da] rounded-xl px-4 py-3 text-xs font-bold text-[#332420]"
                      />
                    </div>
                  )}
                </div>

              </div>

              <div className="pt-6 border-t border-[#eee7da] flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="px-6 py-4 text-xs font-extrabold text-slate-600 hover:bg-slate-100 rounded-2xl uppercase"
                >
                  Annuler
                </button>

                <button
                  type="submit"
                  className="px-8 py-4 text-xs font-extrabold text-white bg-amber-600 hover:bg-amber-700 rounded-2xl shadow-lg uppercase tracking-wider transition-colors flex items-center gap-2"
                >
                  <Save className="w-5 h-5" />
                  {editingId ? 'ENREGISTRER LES MODIFICATIONS' : 'PUBLIER LA PRÉCOMMANDE'}
                </button>
              </div>
            </form>
          )}

          {/* LIST OF ACTIVE PREORDER CAMPAIGNS */}
          <div className="bg-white p-8 rounded-3xl border border-[#eee7da] shadow-sm space-y-6">
            <div className="flex items-center justify-between border-b border-[#eee7da] pb-4">
              <div>
                <h2 className="text-xl font-extrabold text-[#332420]">
                  Mes Campagnes de Précommande
                </h2>
                <p className="text-xs text-slate-500 mt-0.5">Éditez les tarifs, la photo de couverture et les dates de votre calendrier.</p>
              </div>

              <span className="text-xs text-slate-500 font-medium">{preorders.length} campagne(s) répertoriée(s)</span>
            </div>

            <div className="space-y-6">
              {preorders.map((po) => {
                const campaignBuyers = buyers.filter(b => 
                  !b.courseId ||
                  b.courseId === po.id || 
                  b.courseId === po.courseId || 
                  po.id.includes(b.courseId) || 
                  b.courseId.includes(po.id) ||
                  (po.courseTitle && b.courseTitle && b.courseTitle.toLowerCase().includes(po.courseTitle.toLowerCase().slice(0, 6))) ||
                  preorders.length === 1
                );

                const effectiveEnrollments = campaignBuyers.length;
                const percent = Math.min(100, Math.round((effectiveEnrollments / po.targetEnrollments) * 100));
                const remaining = Math.max(0, po.targetEnrollments - effectiveEnrollments);

                const cleanDesc = (po.description || '').replace(/<br\s*\/?>/gi, ' ');

                return (
                  <div key={po.id} className="p-6 sm:p-8 bg-[#faf8f5] rounded-3xl border border-[#eee7da] shadow-xs space-y-6">
                    
                    {/* TOP HEADER BAR: IMAGE, TITLE, BADGES, PRICE */}
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 pb-6 border-b border-[#eee7da]">
                      <div className="flex items-start gap-4 flex-1">
                        {po.image && (
                          <div className="relative w-20 h-20 sm:w-24 sm:h-24 rounded-2xl overflow-hidden border border-[#eee7da] shrink-0 bg-white shadow-xs">
                            <Image src={po.image} alt={po.courseTitle} fill className="object-cover" />
                          </div>
                        )}

                        <div className="space-y-2">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="px-3 py-1 rounded-full text-[11px] font-extrabold bg-amber-100 text-amber-900 uppercase tracking-wider">
                              PRÉCOMMANDE EN COURS
                            </span>
                            <span className="text-xs text-slate-500 font-semibold flex items-center gap-1 bg-white px-3 py-1 rounded-full border border-[#eee7da]">
                              <Calendar className="w-3.5 h-3.5 text-[#18757d]" />
                              Sortie : {formatFrenchDate(po.releaseDate)} • Limite : {formatFrenchDate(po.endDate)}
                            </span>
                          </div>

                          <h3 className="text-xl sm:text-2xl font-extrabold text-[#332420]">{po.courseTitle}</h3>
                        </div>
                      </div>

                      {/* PRICE BADGE */}
                      <div className="bg-white p-4 rounded-2xl border border-[#eee7da] shadow-xs text-center shrink-0 self-start">
                        <span className="text-xs font-bold text-slate-400 block uppercase tracking-wider">Tarif Précommande</span>
                        <span className="text-2xl sm:text-3xl font-extrabold text-[#18757d] block">{po.price.toFixed(2)} €</span>
                        {po.originalPrice && (
                          <span className="text-xs text-slate-400 line-through font-bold block">Prix public : {po.originalPrice.toFixed(2)} €</span>
                        )}
                      </div>
                    </div>

                    {/* DESCRIPTION & DESTINATION */}
                    <div className="space-y-4">
                      <p className="text-sm text-[#4a3b36] leading-relaxed font-medium">{cleanDesc}</p>
                      
                      <div className="flex items-center gap-2">
                        <span className="inline-flex flex-wrap items-center gap-2 px-3.5 py-2 rounded-xl bg-white border border-[#bce3e0] text-xs font-extrabold text-[#18757d]">
                          <Link2 className="w-4 h-4 text-[#18757d]" />
                          <span>Page de destination :</span>
                          <span className="font-mono text-slate-800 bg-[#e6f4f3] px-2.5 py-1 rounded-md border border-[#bce3e0]">{getPreorderDestinationUrl(po)}</span>
                        </span>
                      </div>
                    </div>

                    {/* ACTION TOOLBAR BAR */}
                    <div className="pt-2 flex flex-wrap items-center justify-between gap-3 border-t border-[#eee7da]">
                      <div className="flex flex-wrap items-center gap-2.5">
                        <button
                          type="button"
                          onClick={() => setExpandedBuyersId(expandedBuyersId === po.id ? null : po.id)}
                          className="px-4 py-3 text-xs font-extrabold text-[#18757d] bg-[#e6f4f3] hover:bg-[#d4edea] rounded-xl border border-[#bce3e0] transition-colors flex items-center gap-2 uppercase tracking-wider cursor-pointer"
                          title="Voir la liste des clients ayant précommandé"
                        >
                          <Users className="w-4 h-4 text-[#18757d]" />
                          <span>INSCRITS ({campaignBuyers.length})</span>
                          {expandedBuyersId === po.id ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>

                        <button
                          onClick={() => handleOpenEditForm(po)}
                          className="px-5 py-3 text-xs font-extrabold text-white bg-[#18757d] hover:bg-[#12595f] rounded-xl shadow-xs transition-colors flex items-center gap-2 uppercase tracking-wider cursor-pointer"
                        >
                          <Edit3 className="w-4 h-4" />
                          ÉDITER
                        </button>

                        <button
                          type="button"
                          onClick={() => handleDeletePreorder(po)}
                          className="px-4 py-3 text-xs font-extrabold text-red-700 bg-red-50 hover:bg-red-100 rounded-xl border border-red-200 transition-colors flex items-center gap-1.5 uppercase tracking-wider cursor-pointer"
                          title="Supprimer la précommande de Supabase BDD"
                        >
                          <Trash2 className="w-4 h-4 text-red-600" />
                          SUPPRIMER
                        </button>
                      </div>

                      <Link
                        href={getPreorderDestinationUrl(po)}
                        target="_blank"
                        className="px-4 py-3 text-[#18757d] bg-white hover:bg-[#e6f4f3] rounded-xl border border-[#bce3e0] transition-colors flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider"
                        title={`Ouvrir la page de destination (${getPreorderDestinationUrl(po)})`}
                      >
                        <ExternalLink className="w-4 h-4" />
                        <span>VOIR LA PAGE</span>
                      </Link>
                    </div>

                    {/* JAUGE DE PROGRESSION DU SEUIL */}
                    <div className="p-6 bg-white rounded-2xl border border-[#eee7da] space-y-3 shadow-xs">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs font-extrabold text-[#332420] gap-2">
                        <span className="flex items-center gap-2 text-[#18757d]">
                          <Target className="w-4 h-4 text-amber-500" />
                          Jauge d'Objectif : {effectiveEnrollments} / {po.targetEnrollments} précommandes validées ({percent}%)
                        </span>

                        <span className="text-amber-900 bg-amber-100 px-3.5 py-1 rounded-full border border-amber-200">
                          {remaining === 0 ? "🎉 Objectif de précommandes atteint !" : `Plus que ${remaining} précommande(s) pour valider le projet !`}
                        </span>
                      </div>

                      {/* Progress Bar */}
                      <div className="w-full bg-[#faf8f5] rounded-full h-4 border border-[#eee7da] overflow-hidden p-0.5">
                        <div
                          className="bg-gradient-to-r from-amber-400 to-[#18757d] h-full rounded-full transition-all duration-500"
                          style={{ width: `${percent}%` }}
                        />
                      </div>

                      {/* Bonus */}
                      {po.bonus && (
                        <div className="pt-2 text-xs text-[#5e4d46] font-medium flex items-center gap-2">
                          <Gift className="w-4 h-4 text-amber-500 shrink-0" />
                          <span><strong>Bonus précommande offert :</strong> {po.bonus}</span>
                        </div>
                      )}
                    </div>

                    {/* PANNEAU DES PRÉCOMMANDEURS INSCRITS */}
                    {expandedBuyersId === po.id && (
                      <div className="mt-4 p-6 bg-[#eef4fb] rounded-2xl border-2 border-[#18757d]/30 space-y-4 animate-in fade-in duration-200">
                        <div className="flex items-center justify-between border-b border-[#18757d]/20 pb-3">
                          <h4 className="text-sm font-extrabold text-[#332420] flex items-center gap-2">
                            <Users className="w-4 h-4 text-[#18757d]" />
                            Liste des Précommandeurs pour "{po.courseTitle}" ({campaignBuyers.length})
                          </h4>
                          {campaignBuyers.length > 0 && (
                            <a
                              href={`mailto:${campaignBuyers.map(b => b.customerEmail).join(',')}`}
                              className="text-xs font-extrabold text-[#18757d] hover:underline flex items-center gap-1 bg-white px-3 py-1.5 rounded-lg border border-[#bce3e0]"
                            >
                              <Mail className="w-3.5 h-3.5" />
                              Contacter tous par email
                            </a>
                          )}
                        </div>

                        {campaignBuyers.length === 0 ? (
              <div className="p-6 bg-white rounded-xl text-center text-xs font-semibold text-slate-500 border border-slate-200">
                            <p>Aucune précommande enregistrée pour cette formation pour le moment.</p>
                            <p className="text-[11px] text-slate-400 mt-1">Dès qu'un client précommande via Stripe ou le tunnel, son nom et son email s'afficheront automatiquement ici.</p>
                          </div>
                        ) : (
                          <div className="overflow-x-auto bg-white rounded-xl border border-slate-200 shadow-xs">
                            <table className="w-full text-left text-xs font-medium border-collapse">
                              <thead>
                                <tr className="bg-[#f5f1e8] text-[#332420] font-extrabold uppercase text-[10px] tracking-wider border-b border-slate-200">
                                  <th className="p-3.5">#</th>
                                  <th className="p-3.5">Nom & Prénom</th>
                                  <th className="p-3.5">Adresse E-mail</th>
                                  <th className="p-3.5">Date d'inscription</th>
                                  <th className="p-3.5 text-right">Montant payé</th>
                                  <th className="p-3.5 text-center">Action</th>
                                </tr>
                              </thead>
                              <tbody className="divide-y divide-slate-100">
                                {campaignBuyers.map((buyer, idx) => (
                                  <tr key={buyer.id || idx} className="hover:bg-[#faf8f5] transition-colors">
                                    <td className="p-3.5 text-slate-400 font-extrabold">{idx + 1}</td>
                                    <td className="p-3.5 font-extrabold text-[#332420] capitalize">
                                      {buyer.customerName || buyer.customerEmail.split('@')[0]}
                                    </td>
                                    <td className="p-3.5">
                                      <a
                                        href={`mailto:${buyer.customerEmail}`}
                                        className="text-[#18757d] font-bold hover:underline flex items-center gap-1"
                                      >
                                        <Mail className="w-3.5 h-3.5 text-[#18757d]/70" />
                                        {buyer.customerEmail}
                                      </a>
                                    </td>
                                    <td className="p-3.5 text-slate-600 font-semibold">
                                      {(() => {
                                        if (!buyer.purchasedAt) return formatFrenchDate(new Date().toISOString().split('T')[0]);
                                        if (typeof buyer.purchasedAt === 'string' && buyer.purchasedAt.includes('/')) return buyer.purchasedAt;
                                        const d = new Date(buyer.purchasedAt);
                                        return isNaN(d.getTime()) ? buyer.purchasedAt : d.toLocaleDateString('fr-FR', {
                                          day: 'numeric',
                                          month: 'long',
                                          year: 'numeric'
                                        });
                                      })()}
                                    </td>
                                    <td className="p-3.5 text-right font-extrabold text-emerald-700">
                                      {buyer.price ? `${buyer.price.toFixed(2)} €` : `${po.price.toFixed(2)} €`}
                                    </td>
                                    <td className="p-3.5 text-center">
                                      <button
                                        type="button"
                                        onClick={() => handleDeleteBuyer(buyer, po.id)}
                                        className="p-1.5 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-lg transition-colors inline-flex items-center justify-center cursor-pointer"
                                        title="Supprimer définitivement ce précommandeur"
                                      >
                                        <Trash2 className="w-4 h-4 text-red-600" />
                                      </button>
                                    </td>
                                  </tr>
                                ))}
                              </tbody>
                            </table>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </section>

      <Footer />
    </div>
  );
}
