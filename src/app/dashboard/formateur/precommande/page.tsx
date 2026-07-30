'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { Course } from '@/lib/coursesStore';
import { fetchCoursesFromDb, fetchPreordersFromDb, savePreorderToDb, deletePreorderFromDb } from '@/lib/supabaseLms';
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
  Trash2
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
  const [isSyncing, setIsSyncing] = useState<boolean>(false);
  const [syncStatus, setSyncStatus] = useState<string | null>(null);

  const handleManualSync = async () => {
    setIsSyncing(true);
    setSyncStatus('Synchronisation avec Supabase BDD...');
    const updatedList = await fetchPreordersFromDb();
    setPreorders(updatedList);
    setIsSyncing(false);
    setSyncStatus('✓ Précommandes synchronisées avec succès en BDD !');
    setTimeout(() => setSyncStatus(null), 4000);
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

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
            <button
              type="button"
              onClick={handleManualSync}
              disabled={isSyncing}
              className="px-5 py-4 text-xs font-extrabold text-[#18757d] bg-[#e6f4f3] hover:bg-[#d4edea] rounded-2xl border border-[#bce3e0] uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
              title="Transférer et synchroniser les précommandes dans Supabase BDD"
            >
              <RefreshCw className={`w-4 h-4 ${isSyncing ? 'animate-spin' : ''}`} />
              {isSyncing ? 'Synchronisation...' : 'Synchroniser avec Supabase'}
            </button>

            <button
              onClick={handleOpenCreateForm}
              className="px-6 py-4 text-xs font-extrabold text-white bg-[#18757d] hover:bg-[#12595f] rounded-2xl shadow-md uppercase tracking-wider transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              LANCER UNE NOUVELLE PRÉCOMMANDE
            </button>
          </div>
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
                const percent = Math.min(100, Math.round((po.currentEnrollments / po.targetEnrollments) * 100));
                const remaining = Math.max(0, po.targetEnrollments - po.currentEnrollments);

                return (
                  <div key={po.id} className="p-8 bg-[#faf8f5] rounded-3xl border border-[#eee7da] space-y-6">
                    
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                      
                      <div className="flex items-start gap-4 flex-1">
                        {po.image && (
                          <div className="relative w-24 h-24 rounded-2xl overflow-hidden border border-[#eee7da] shrink-0 bg-white">
                            <Image src={po.image} alt={po.courseTitle} fill className="object-cover" />
                          </div>
                        )}

                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <span className="px-3 py-1 rounded-full text-[11px] font-extrabold bg-amber-100 text-amber-900 uppercase tracking-wider">
                              PRÉCOMMANDE EN COURS
                            </span>
                            <span className="text-xs text-slate-500 font-semibold flex items-center gap-1">
                              <Calendar className="w-3.5 h-3.5" />
                              Sortie le {formatFrenchDate(po.releaseDate)} • Date limite : {formatFrenchDate(po.endDate)}
                            </span>
                          </div>

                          <h3 className="text-xl font-extrabold text-[#332420]">{po.courseTitle}</h3>
                          <p className="text-xs text-[#5e4d46] leading-relaxed">{po.description}</p>
                          
                          <div className="pt-1 flex items-center gap-2 text-xs font-bold text-[#18757d]">
                            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg bg-[#e6f4f3] border border-[#bce3e0]">
                              <Link2 className="w-3.5 h-3.5" />
                              Page de destination : <strong className="font-extrabold">{getPreorderDestinationUrl(po)}</strong>
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 shrink-0">
                        <div className="text-right mr-2">
                          <span className="text-2xl font-extrabold text-[#18757d] block">{po.price.toFixed(2)} €</span>
                          {po.originalPrice && (
                            <span className="text-xs text-slate-400 line-through font-bold">{po.originalPrice.toFixed(2)} €</span>
                          )}
                        </div>

                        {/* Action buttons */}
                        <div className="flex items-center gap-2">
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

                          <Link
                            href={getPreorderDestinationUrl(po)}
                            target="_blank"
                            className="p-3 text-[#18757d] bg-[#e6f4f3] hover:bg-[#d4edea] rounded-xl transition-colors flex items-center gap-1.5 text-xs font-extrabold"
                            title={`Ouvrir la page de destination (${getPreorderDestinationUrl(po)})`}
                          >
                            <ExternalLink className="w-4 h-4" />
                          </Link>
                        </div>
                      </div>
                    </div>

                    {/* JAUGE DE PROGRESSION DU SEUIL */}
                    <div className="p-6 bg-white rounded-2xl border border-[#eee7da] space-y-3">
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between text-xs font-extrabold text-[#332420] gap-2">
                        <span className="flex items-center gap-2 text-[#18757d]">
                          <Target className="w-4 h-4 text-amber-500" />
                          Jauge d'Objectif : {po.currentEnrollments} / {po.targetEnrollments} précommandes validées ({percent}%)
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
                        <div className="pt-2 text-xs text-slate-600 font-medium flex items-center gap-2">
                          <Gift className="w-4 h-4 text-amber-500 shrink-0" />
                          <span><strong>Bonus précommande offert :</strong> {po.bonus}</span>
                        </div>
                      )}
                    </div>

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
