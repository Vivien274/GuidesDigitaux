'use client';

export interface LessonResourceFile {
  id: string;
  name: string;
  url: string;
}

export interface LessonExternalLink {
  id: string;
  title: string;
  url: string;
}

export interface Lesson {
  id: string;
  title: string;
  videoUrl: string;
  notes: string;
  pdfUrl?: string;
  externalLink?: string;
  duration: string;
  files?: LessonResourceFile[];
  links?: LessonExternalLink[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctOptionIndex: number;
  explanation?: string;
}

export interface ModuleQuiz {
  id: string;
  title: string;
  passingScorePercent: number;
  questions: QuizQuestion[];
}

export interface Module {
  id: string;
  title: string;
  lessons: Lesson[];
  quiz?: ModuleQuiz;
}

export interface Course {
  id: string;
  slug?: string;
  title: string;
  description: string;
  duration: string;
  level: string;
  prerequisites: string;
  price: number;
  originalPrice?: number;
  normalPrice?: number;
  discountedPrice?: number;
  image?: string;
  isPreorder?: boolean;
  preorderReleaseDate?: string;
  category: string;
  status: 'Publié' | 'Brouillon' | 'Planifié';
  scheduledPublishDate?: string;
  modules: Module[];
  congratulationsMsg?: string;
  certificateEnabled?: boolean;
  bonusDocTitle?: string;
  bonusDocUrl?: string;
  communityLink?: string;
  liveStreamUrl?: string;
  liveStreamDate?: string;
  liveStreamTitle?: string;
  studentsCount?: number;
}

const DEFAULT_COURSES: Course[] = [
  {
    id: '11111111-1111-4111-a111-111111111111',
    slug: 'formation-wordpress',
    title: 'Formation : créer sa vitrine en ligne avec WordPress',
    description: 'Le cursus vidéo pas-à-pas pour concevoir un site vitrine professionnel de A à Z avec WordPress et Elementor sans coder.',
    duration: '3h30',
    level: 'Débutant',
    prerequisites: 'Aucune connaissance préalable en programmation requise. Un ordinateur et un accès Internet suffisent.',
    price: 199,
    originalPrice: 249,
    image: '/images/products/formation-wordpress.webp',
    status: 'Publié',
    category: 'formation',
    congratulationsMsg: 'Bravo ! Tu as terminé l’intégralité de la Formation Site Vitrine WordPress. Ton site est désormais prêt et en ligne !',
    modules: [
      {
        id: 'mod-wp-1',
        title: '🧭 Module 1 – Préparer son projet web & Nom de domaine',
        lessons: [
          {
            id: 'les-wp-1-1',
            title: '1.1 Trouver le nom idéal et réserver l’hébergement',
            videoUrl: 'https://www.youtube.com/watch?v=k3_tw44QsZQ',
            duration: '08:45',
            notes: `<p>Créer un site internet peut sembler compliqué, technique, voire stressant…</p>
<p><strong>Bonne nouvelle : ça ne doit pas l’être.</strong></p>

<p>Dans cette première vidéo, je te souhaite la bienvenue dans cette série de tutoriels dédiée à la création d’un site WordPress, pensée spécialement pour les débutants, les indépendants, les artisans, les créateurs et les entrepreneurs qui veulent un site simple, professionnel et efficace, sans jargon inutile ni prise de tête.</p>

<p>Je suis Stéphanie, fondatrice de <strong>Stratec Digital</strong>, et depuis plusieurs années j’accompagne des professionnels qui veulent se digitaliser à leur rythme, avec des outils adaptés et une méthode claire.<br />Cette série de vidéos est née d’un constat très simple :</p>

<ul>
  <li>beaucoup de personnes veulent créer leur site WordPress seules,</li>
  <li>mais se sentent vite perdues, découragées ou bloquées par la technique.</li>
</ul>

<p><strong>Ici, on fait exactement l’inverse.</strong></p>

<h3>🎯 Objectif de cette formation WordPress :</h3>
<p>Te guider pas à pas, dans le bon ordre, pour créer un site :</p>
<ul>
  <li>clair</li>
  <li>fonctionnel</li>
  <li>sécurisé</li>
  <li>agréable pour tes visiteurs</li>
  <li>et utile pour ton activité</li>
</ul>

<p><strong>Sans pression. Sans perfectionnisme. Sans y passer tes nuits.</strong></p>

<h3>📌 Ce que tu vas apprendre dans cette série de vidéos</h3>
<p>Tout au long de ces tutoriels WordPress, tu vas apprendre à :</p>
<ul>
  <li>Préparer ton projet web (nom de domaine, hébergement, email pro)</li>
  <li>Installer WordPress facilement, même si tu n’y connais rien</li>
  <li>Sécuriser ton site dès le départ</li>
  <li>Choisir un thème adapté à ton activité</li>
  <li>Installer uniquement les plugins vraiment utiles</li>
  <li>Créer tes pages essentielles (Accueil, À propos, Contact…)</li>
  <li>Organiser ton menu de navigation</li>
  <li>Améliorer l’expérience utilisateur (UX)</li>
  <li>Paramétrer correctement les URL et le HTTPS</li>
  <li>Mettre en place des sauvegardes automatiques</li>
  <li>Tester ton site avant le lancement</li>
  <li>Comprendre les bases du référencement naturel (SEO)</li>
  <li>Mettre ton site en ligne en toute sérénité</li>
</ul>

<p><strong>🎬 Chaque vidéo est courte, ciblée, et va droit au but.</strong></p>

<h3>💡 Une méthode “tranquille mais efficace”</h3>
<p>Cette formation WordPress suit une philosophie simple : faire les choses dans le bon ordre, sans surcharger ton site ni ton cerveau.</p>
<p>Pas besoin :</p>
<ul>
  <li>d’être développeur</li>
  <li>d’avoir un budget énorme</li>
  <li>de maîtriser le webmarketing</li>
  <li>ni de passer 6 mois sur ton site</li>
</ul>
<p>Tu avances étape par étape, tu appliques, et tu construis un site qui te ressemble.</p>

<h3>👉 À qui s’adresse cette série de tutos WordPress ?</h3>
<p>Cette formation est faite pour toi si tu es :</p>
<ul>
  <li>artisan</li>
  <li>indépendant</li>
  <li>créateur</li>
  <li>thérapeute</li>
  <li>consultant</li>
  <li>entrepreneur débutant</li>
  <li>ou simplement quelqu’un qui veut créer son site WordPress seul</li>
</ul>
<p>Même si :</p>
<ul>
  <li>tu débutes totalement</li>
  <li>tu n’as jamais touché à WordPress</li>
  <li>tu as déjà essayé et abandonné</li>
</ul>

<h3>🎬 Comment utiliser ces vidéos</h3>
<ul>
  <li>▶️ <strong>Regarde les vidéos dans l’ordre</strong></li>
  <li>🛠️ <strong>Applique au fur et à mesure</strong></li>
  <li>⏸️ <strong>Mets pause si besoin</strong></li>
  <li>🔄 <strong>Reviens quand tu veux</strong></li>
</ul>
<p>Chaque vidéo correspond à une étape précise de la création de ton site WordPress.</p>

<h3>🚀 Et maintenant ?</h3>
<p>Dans la prochaine vidéo, on commence concrètement avec une étape clé :<br /><strong>Trouver le bon nom pour son site et son nom de domaine, sans se tromper.</strong></p>
<p><strong>Abonne-toi à la chaîne pour ne rien manquer, et surtout… avance à ton rythme. Ton site n’a pas besoin d’être parfait pour être efficace.</strong></p>`
          },
          {
            id: 'les-wp-1-2',
            title: '1.2 Créer son adresse e-mail professionnelle liée au domaine',
            videoUrl: 'https://www.youtube.com/watch?v=k3_tw44QsZQ',
            duration: '06:12',
            notes: 'Une adresse du type contact@ton-entreprise.fr renforce immédiatement la crédibilité auprès de tes clients.'
          },
          {
            id: 'les-wp-1-3',
            title: '1.3 Poser l’arborescence et la stratégie du site vitrine',
            videoUrl: 'https://www.youtube.com/watch?v=k3_tw44QsZQ',
            duration: '10:30',
            notes: 'Définis les 4 à 5 pages principales nécessaires : Accueil, À propos, Prestations/Créations, Avis & Contact.'
          }
        ]
      },
      {
        id: 'mod-wp-2',
        title: '⚙️ Module 2 – Installation & Nettoyage de WordPress',
        lessons: [
          {
            id: 'les-wp-2-1',
            title: '2.1 Installer WordPress en 1-clic chez l’hébergeur',
            videoUrl: 'https://www.youtube.com/watch?v=k3_tw44QsZQ',
            duration: '07:15',
            notes: 'Suis la procédure d’installation automatisée chez O2Switch ou Hostinger.'
          },
          {
            id: 'les-wp-2-2',
            title: '2.2 Découverte complète du tableau de bord Wp-Admin',
            videoUrl: 'https://www.youtube.com/watch?v=k3_tw44QsZQ',
            duration: '12:40',
            notes: 'Visite guidée du menu latéral : Articles, Médias, Pages, Extension, Apparence et Réglages.'
          },
          {
            id: 'les-wp-2-3',
            title: '2.3 Supprimer les contenus et plugins inutiles de démonstration',
            videoUrl: 'https://www.youtube.com/watch?v=k3_tw44QsZQ',
            duration: '05:20',
            notes: 'Fais le ménage initial pour repartir sur une installation saine et légère.'
          },
          {
            id: 'les-wp-2-4',
            title: '2.4 Réglages généraux, fuseau horaire et permaliens SEO',
            videoUrl: 'https://www.youtube.com/watch?v=k3_tw44QsZQ',
            duration: '09:10',
            notes: 'Configure la structure des liens permanents en "Titre de l’article" pour maximiser le référencement Google.'
          }
        ]
      },
      {
        id: 'mod-wp-3',
        title: '🔒 Module 3 – Sécurisation & Thème Graphique',
        lessons: [
          {
            id: 'les-wp-3-1',
            title: '3.1 Activer le certificat SSL (HTTPS) et la sécurité anti-spam',
            videoUrl: 'https://www.youtube.com/watch?v=k3_tw44QsZQ',
            duration: '09:30',
            notes: 'Le cadenas vert HTTPS est obligatoire pour rassurer les visiteurs et être bien positionné par Google.'
          },
          {
            id: 'les-wp-3-2',
            title: '3.2 Installer et personnaliser le thème Astra / Cadence',
            videoUrl: 'https://www.youtube.com/watch?v=k3_tw44QsZQ',
            duration: '14:20',
            notes: 'Découvre le thème rapide, léger et personnalisable sur-mesure.'
          },
          {
            id: 'les-wp-3-3',
            title: '3.3 Installer les plugins indispensables (SEO, Sauvegardes)',
            videoUrl: 'https://www.youtube.com/watch?v=k3_tw44QsZQ',
            duration: '11:05',
            notes: 'Installation des extensions clés : Rank Math / Yoast SEO, UpdraftPlus pour les sauvegardes.'
          }
        ]
      },
      {
        id: 'mod-wp-4',
        title: '🧱 Module 4 – Création des Pages avec Elementor',
        lessons: [
          {
            id: 'les-wp-4-1',
            title: '4.1 Prise en main du constructeur visuel Elementor',
            videoUrl: 'https://www.youtube.com/watch?v=k3_tw44QsZQ',
            duration: '18:45',
            notes: 'Apprends le glisser-déposer de blocs (sections, colonnes, titres, images, boutons).'
          },
          {
            id: 'les-wp-4-2',
            title: '4.2 Concevoir la Page d’Accueil et la section Hero',
            videoUrl: 'https://www.youtube.com/watch?v=k3_tw44QsZQ',
            duration: '22:15',
            notes: 'Crée une en-tête percutante avec un titre attractif et un bouton d’action clair.'
          },
          {
            id: 'les-wp-4-3',
            title: '4.3 Créer les pages À Propos, Services et Galerie réalisations',
            videoUrl: 'https://www.youtube.com/watch?v=k3_tw44QsZQ',
            duration: '16:30',
            notes: 'Raconte ton histoire d’artisan et présente tes travaux avec de belles galeries d’images.'
          },
          {
            id: 'les-wp-4-4',
            title: '4.4 Construire le Menu de navigation et le Footer du site',
            videoUrl: 'https://www.youtube.com/watch?v=k3_tw44QsZQ',
            duration: '12:00',
            notes: 'Mise en place de l’en-tête de navigation principale et du pied de page légal.'
          }
        ]
      },
      {
        id: 'mod-wp-5',
        title: '🎨 Module 5 – Design Mobile, Formulaires & Anti-Spam',
        lessons: [
          {
            id: 'les-wp-5-1',
            title: '5.1 Optimiser la version mobile (Design Responsive)',
            videoUrl: 'https://www.youtube.com/watch?v=k3_tw44QsZQ',
            duration: '15:10',
            notes: 'Ajuste la taille des polices et des marges pour les téléphones portables et tablettes.'
          },
          {
            id: 'les-wp-5-2',
            title: '5.2 Créer un formulaire de contact professionnel et sécurisé',
            videoUrl: 'https://www.youtube.com/watch?v=k3_tw44QsZQ',
            duration: '10:40',
            notes: 'Configure la réception automatique des demandes de devis sur ta boîte mail.'
          },
          {
            id: 'les-wp-5-3',
            title: '5.3 Configurer les sauvegardes automatiques de sécurité',
            videoUrl: 'https://www.youtube.com/watch?v=k3_tw44QsZQ',
            duration: '08:15',
            notes: 'Programmation d’une sauvegarde hebdomadaire vers ton Google Drive ou Dropbox.'
          }
        ]
      },
      {
        id: 'mod-wp-6',
        title: '🚀 Module 6 – SEO Local, Google Maps & Lancement',
        lessons: [
          {
            id: 'les-wp-6-1',
            title: '6.1 Optimiser les balises meta SEO pour être visible sur Google',
            videoUrl: 'https://www.youtube.com/watch?v=k3_tw44QsZQ',
            duration: '14:00',
            notes: 'Rédaction des titres et descriptions captivantes pour remonter dans les résultats de recherche.'
          },
          {
            id: 'les-wp-6-2',
            title: '6.2 Relier sa Fiche Google Business Profile & Google Maps',
            videoUrl: 'https://www.youtube.com/watch?v=k3_tw44QsZQ',
            duration: '11:20',
            notes: 'Connecte ton établissement local pour recevoir des appels et demandes d’itinéraires de clients proches.'
          },
          {
            id: 'les-wp-6-3',
            title: '6.3 Checklist ultime de pré-lancement du site',
            videoUrl: 'https://www.youtube.com/watch?v=k3_tw44QsZQ',
            duration: '09:45',
            notes: 'Relecture finale, validation des liens et mise en ligne officielle.'
          }
        ]
      }
    ]
  },
  {
    id: '22222222-2222-4222-a222-222222222222',
    slug: 'formation-ajouter-une-boutique-en-ligne-avec-woocommerce',
    title: 'Formation ajouter une boutique en ligne avec WooCommerce',
    description: 'La formation pratique pour intégrer une boutique en ligne e-commerce complète à ton site WordPress et encaisser par carte bancaire.',
    duration: '2h15',
    level: 'Tous niveaux',
    prerequisites: 'Avoir un site WordPress déjà créé ou en cours de création.',
    price: 99,
    originalPrice: 149,
    image: '/images/products/formation-woocommerce.jpg',
    status: 'Publié',
    category: 'formation',
    congratulationsMsg: 'Félicitations ! Ta boutique WooCommerce est configurée et prête à enregistrer tes premières ventes !',
    modules: [
      {
        id: 'mod-wc-1',
        title: '🛒 Module 1 – Découvrir & Configurer WooCommerce',
        lessons: [
          {
            id: 'les-wc-1-1',
            title: '1.1 Présentation de WooCommerce et prérequis e-commerce',
            videoUrl: 'https://www.youtube.com/watch?v=k3_tw44QsZQ',
            duration: '07:30',
            notes: 'Comprendre l’architecture e-commerce et le parcours d’achat des clients.'
          },
          {
            id: 'les-wc-1-2',
            title: '1.2 Assistant de configuration initiale (Devise, Pays, TVA)',
            videoUrl: 'https://www.youtube.com/watch?v=k3_tw44QsZQ',
            duration: '11:15',
            notes: 'Réglage de la monnaie (Euro €), des taux de TVA applicables et de la localisation.'
          },
          {
            id: 'les-wc-1-3',
            title: '1.3 Paramétrage des options de commande et e-mails',
            videoUrl: 'https://www.youtube.com/watch?v=k3_tw44QsZQ',
            duration: '09:40',
            notes: 'Personnalisation du logo et du message sur les e-mails de confirmation de commande.'
          }
        ]
      },
      {
        id: 'mod-wc-2',
        title: '📦 Module 2 – Créer ses Fiches Produits & Variantes',
        lessons: [
          {
            id: 'les-wc-2-1',
            title: '2.1 Création d’un produit simple avec photos optimisées',
            videoUrl: 'https://www.youtube.com/watch?v=k3_tw44QsZQ',
            duration: '10:20',
            notes: 'Mettre en valeur son savoir-faire artisanal avec un descriptif clair et des visuels soignés.'
          },
          {
            id: 'les-wc-2-2',
            title: '2.2 Produits variables (tailles, coloris, options sur-mesure)',
            videoUrl: 'https://www.youtube.com/watch?v=k3_tw44QsZQ',
            duration: '12:45',
            notes: 'Création d’attributs et de variations de stock et prix pour les déclinaisons.'
          },
          {
            id: 'les-wc-2-3',
            title: '2.3 Gestion des catégories de produits et étiquettes',
            videoUrl: 'https://www.youtube.com/watch?v=k3_tw44QsZQ',
            duration: '08:10',
            notes: 'Organisation claire du catalogue pour faciliter la navigation des visiteurs.'
          },
          {
            id: 'les-wc-2-4',
            title: '2.4 Mise en place des ventes croisées et produits suggérés',
            videoUrl: 'https://www.youtube.com/watch?v=k3_tw44QsZQ',
            duration: '07:50',
            notes: 'Booster son panier moyen grâce au cross-sell et up-sell.'
          }
        ]
      },
      {
        id: 'mod-wc-3',
        title: '🚚 Module 3 – Configurer les Modes de Livraison',
        lessons: [
          {
            id: 'les-wc-3-1',
            title: '3.1 Zones d’expédition et tarifs personnalisés',
            videoUrl: 'https://www.youtube.com/watch?v=k3_tw44QsZQ',
            duration: '11:00',
            notes: 'Configuration des frais de port pour la France métropolitaine et l’international.'
          },
          {
            id: 'les-wc-3-2',
            title: '3.2 Livraison Colissimo, Mondial Relay et Click & Collect à l’atelier',
            videoUrl: 'https://www.youtube.com/watch?v=k3_tw44QsZQ',
            duration: '13:30',
            notes: 'Offrir le retrait gratuit à l’atelier et les points relais les plus avantageux.'
          },
          {
            id: 'les-wc-3-3',
            title: '3.3 Livraison offerte à partir d’un montant d’achat',
            videoUrl: 'https://www.youtube.com/watch?v=k3_tw44QsZQ',
            duration: '06:45',
            notes: 'Mettre en place le franco de port pour inciter à commander davantage.'
          }
        ]
      },
      {
        id: 'mod-wc-4',
        title: '💳 Module 4 – Encaisser par Carte Bancaire avec Stripe & PayPal',
        lessons: [
          {
            id: 'les-wc-4-1',
            title: '4.1 Création et liaison du compte Stripe professionnel',
            videoUrl: 'https://www.youtube.com/watch?v=k3_tw44QsZQ',
            duration: '10:15',
            notes: 'Configuration du compte bancaire pour recevoir automatiquement les virements de ventes.'
          },
          {
            id: 'les-wc-4-2',
            title: '4.2 Intégration du paiement Apple Pay et Google Pay en 1 clic',
            videoUrl: 'https://www.youtube.com/watch?v=k3_tw44QsZQ',
            duration: '08:40',
            notes: 'Permettre aux acheteurs mobiles de commander en 5 secondes sans saisir leur numéro de carte.'
          },
          {
            id: 'les-wc-4-3',
            title: '4.3 Tests de paiement en mode Sandbox avant le lancement',
            videoUrl: 'https://www.youtube.com/watch?v=k3_tw44QsZQ',
            duration: '07:20',
            notes: 'Passer une commande test réelle pour valider l’ensemble du tunnel de vente.'
          }
        ]
      },
      {
        id: 'mod-wc-5',
        title: '📊 Module 5 – Traitement des Commandes & Facturation',
        lessons: [
          {
            id: 'les-wc-5-1',
            title: '5.1 Tableau de bord des commandes et suivi des statuts',
            videoUrl: 'https://www.youtube.com/watch?v=k3_tw44QsZQ',
            duration: '09:10',
            notes: 'Passer les commandes de « En cours » à « Terminée » et envoyer le numéro de suivi au client.'
          },
          {
            id: 'les-wc-5-2',
            title: '5.2 Génération et envoi automatique des factures PDF',
            videoUrl: 'https://www.youtube.com/watch?v=k3_tw44QsZQ',
            duration: '08:15',
            notes: 'Mise en place de l’extension de facturation automatique aux normes comptables.'
          },
          {
            id: 'les-wc-5-3',
            title: '5.3 Checklist finale d’ouverture officielle de votre e-commerce',
            videoUrl: 'https://www.youtube.com/watch?v=k3_tw44QsZQ',
            duration: '09:30',
            notes: 'Dernière vérification avant la communication officielle sur tes réseaux et newsletter.'
          }
        ]
      }
    ]
  },
  {
    id: '33333333-3333-4333-a333-333333333333',
    slug: 'formation-fiche-google',
    title: 'Formation : Domine le Pack Local Google Maps pour Artisans & Indépendants',
    description: 'La méthode pas-à-pas en 7 modules vidéo pour propulser ton atelier ou ton commerce dans le Top 3 Google Maps et capter un flux régulier de clients locaux.',
    duration: '2h45',
    level: 'Tous niveaux',
    prerequisites: 'Avoir ou vouloir créer une Fiche Google Business Profile pour son activité.',
    price: 29,
    originalPrice: 149,
    image: '/images/products/formation-fiche-google-mockup.jpg',
    status: 'Publié',
    category: 'formation',
    congratulationsMsg: 'Félicitations ! Tu as complété l’ensemble des 7 modules de la Formation Fiche Google. Ta visibilité locale est maintenant blindée pour le Top 3 !',
    bonusDocTitle: 'Checklist d\'Audit en 25 Points & Scripts Avis WhatsApp',
    bonusDocUrl: '/downloads/support-formation-woocommerce.pdf',
    modules: [
      {
        id: 'mod-gmb-1',
        title: '📍 Module 1 – Les Fondations de l\'Algorithme Google Maps',
        lessons: [
          {
            id: 'les-gmb-1-1',
            title: '1.1 Comment fonctionne le Pack Local Google et les 3 facteurs de classement',
            videoUrl: 'https://www.youtube.com/watch?v=k3_tw44QsZQ',
            duration: '08:30',
            notes: 'Comprendre la pertinence, la distance et la proéminence pour dominer la concurrence locale.'
          },
          {
            id: 'les-gmb-1-2',
            title: '1.2 Audit express de sa fiche actuelle et détection des pénalités',
            videoUrl: 'https://www.youtube.com/watch?v=k3_tw44QsZQ',
            duration: '10:15',
            notes: 'Utilisation de la grille d’audit en 25 points pour identifier vos fuites de visibilité.'
          }
        ]
      },
      {
        id: 'mod-gmb-2',
        title: '🛠️ Module 2 – Configuration & Catégorisation Stratégique',
        lessons: [
          {
            id: 'les-gmb-2-1',
            title: '2.1 Choisir la catégorie principale qui draine 80% du trafic',
            videoUrl: 'https://www.youtube.com/watch?v=k3_tw44QsZQ',
            duration: '09:20',
            notes: 'La différence cruciale entre catégorie principale et catégories secondaires.'
          },
          {
            id: 'les-gmb-2-2',
            title: '2.2 Définir sa zone de chalandise pour artisans et ateliers sans vitrine',
            videoUrl: 'https://www.youtube.com/watch?v=k3_tw44QsZQ',
            duration: '11:45',
            notes: 'Comment configurer correctement une entreprise de zone de service (SAB) sans risque de suspension.'
          }
        ]
      },
      {
        id: 'mod-gmb-3',
        title: '✍️ Module 3 – Description Vendeuse & Prompts IA',
        lessons: [
          {
            id: 'les-gmb-3-1',
            title: '3.1 Rédiger les 750 caractères parfaits avec les 10 Prompts IA',
            videoUrl: 'https://www.youtube.com/watch?v=k3_tw44QsZQ',
            duration: '12:10',
            notes: 'Intégrer vos mots-clés de savoir-faire artisanal couplés à vos villes cibles.'
          }
        ]
      },
      {
        id: 'mod-gmb-4',
        title: '📸 Module 4 – Photos Vendeuses & Google Vision AI',
        lessons: [
          {
            id: 'les-gmb-4-1',
            title: '4.1 Optimisation des photos d\'atelier et lecture par l\'IA de Google',
            videoUrl: 'https://www.youtube.com/watch?v=k3_tw44QsZQ',
            duration: '10:50',
            notes: 'Comment Google Vision analyse vos images pour classer votre fiche.'
          }
        ]
      },
      {
        id: 'mod-gmb-5',
        title: '🛍️ Module 5 – Produits, Prestations & Menus Interactifs',
        lessons: [
          {
            id: 'les-gmb-5-1',
            title: '5.1 Ajouter ses créations et services avec boutons d\'action directe',
            videoUrl: 'https://www.youtube.com/watch?v=k3_tw44QsZQ',
            duration: '13:00',
            notes: 'Transformer sa fiche Google en catalogue e-commerce miniature qui génère des appels.'
          }
        ]
      },
      {
        id: 'mod-gmb-6',
        title: '⭐ Module 6 – La Machine à Avis 5 Étoiles & Réponses SEO',
        lessons: [
          {
            id: 'les-gmb-6-1',
            title: '6.1 Les scripts WhatsApp, SMS et e-mail à envoyer après chaque prestation',
            videoUrl: 'https://www.youtube.com/watch?v=k3_tw44QsZQ',
            duration: '14:20',
            notes: 'Modèles de messages prêts à copier-coller pour obtenir un avis 5 étoiles en moins de 48h.'
          },
          {
            id: 'les-gmb-6-2',
            title: '6.2 Répondre aux avis avec les mots-clés stratégiques pour doper le NLP Google',
            videoUrl: 'https://www.youtube.com/watch?v=k3_tw44QsZQ',
            duration: '11:15',
            notes: 'Kit des 10 réponses types (avis élogieux et avis délicats).'
          }
        ]
      },
      {
        id: 'mod-gmb-7',
        title: '🚀 Module 7 – Routine 5 min/Semaine & Posts Google',
        lessons: [
          {
            id: 'les-gmb-7-1',
            title: '7.1 La routine hebdomadaire en 5 minutes pour maintenir sa position Top 3',
            videoUrl: 'https://www.youtube.com/watch?v=k3_tw44QsZQ',
            duration: '09:40',
            notes: 'Publication de posts Google, analyse des statistiques et suivi de la concurrence.'
          }
        ]
      }
    ]
  }
];

export function purgeAllCoursesData(): void {
  if (typeof window !== 'undefined') {
    localStorage.removeItem('gd_custom_courses');
    localStorage.removeItem('gd_enrolled_courses');
    Object.keys(localStorage).forEach(key => {
      if (key.startsWith('gd_user_purchases_') || key.startsWith('gd_completed_lessons_')) {
        localStorage.removeItem(key);
      }
    });
  }
}

export function getStoredCourses(): Course[] {
  if (typeof window === 'undefined') return DEFAULT_COURSES;
  try {
    const data = localStorage.getItem('gd_custom_courses');
    if (data) {
      return JSON.parse(data);
    }
  } catch (e) {
    console.error('Failed to parse gd_custom_courses', e);
  }
  return DEFAULT_COURSES;
}

export function saveCourse(newCourse: Course): Course[] {
  const current = getStoredCourses();
  const index = current.findIndex(c => c.id === newCourse.id);
  let updated: Course[];
  if (index >= 0) {
    updated = current.map(c => c.id === newCourse.id ? newCourse : c);
  } else {
    updated = [newCourse, ...current];
  }
  if (typeof window !== 'undefined') {
    try {
      localStorage.setItem('gd_custom_courses', JSON.stringify(updated));
    } catch (quotaError) {
      console.warn('localStorage quota exceeded when saving gd_custom_courses. Preserving images while trimming heavy pdfs/videos...', quotaError);
      const sanitized = updated.map(c => ({
        ...c,
        image: c.image && c.image.length > 2000000 ? c.image.slice(0, 500000) : c.image,
        modules: (c.modules || []).map(m => ({
          ...m,
          lessons: (m.lessons || []).map(l => ({
            ...l,
            pdfUrl: l.pdfUrl && l.pdfUrl.length > 200000 ? '' : l.pdfUrl,
            videoUrl: l.videoUrl && l.videoUrl.length > 500000 ? '' : l.videoUrl
          }))
        }))
      }));
      try {
        localStorage.setItem('gd_custom_courses', JSON.stringify(sanitized));
      } catch (e) {
        console.error('Could not save sanitized courses to localStorage', e);
      }
    }
  }
  return updated;
}

export interface RealCourseStats {
  enrolledCount: number;
  completedCount: number;
  completionPercentage: number;
}

/**
 * Calculate REAL student stats based on actual enrolments in localStorage
 */
import { supabase } from '@/lib/supabaseLms';

export function getRealCourseStats(courseId: string, courseTitle?: string): RealCourseStats {
  if (typeof window === 'undefined') {
    return { enrolledCount: 0, completedCount: 0, completionPercentage: 0 };
  }

  try {
    const rawEnrolled = localStorage.getItem('gd_enrolled_courses');
    const enrolledList = rawEnrolled ? JSON.parse(rawEnrolled) : [];

    // Filter enrollments matching courseId or courseTitle keyword
    const matchingEnrollments = enrolledList.filter((item: any) => {
      if (item.id === courseId) return true;
      if (courseId === 'c2' && (item.slug === 'formation-woocommerce' || item.title?.toLowerCase().includes('woocommerce'))) return true;
      if (courseId === 'c1' && (item.slug === 'creer-sa-vitrine-wordpress' || item.title?.toLowerCase().includes('wordpress'))) return true;
      if (courseTitle && item.title?.toLowerCase() === courseTitle.toLowerCase()) return true;
      return false;
    });

    const enrolledCount = matchingEnrollments.length;
    
    // Calculate completed count from matching enrollments having progress >= 100
    const completedCount = matchingEnrollments.filter((item: any) => 
      item.progress >= 100 || (item.completedLessons && item.totalLessons && item.completedLessons >= item.totalLessons)
    ).length;
    
    const completionPercentage = enrolledCount > 0 ? Math.round((completedCount / enrolledCount) * 100) : 0;

    return {
      enrolledCount,
      completedCount,
      completionPercentage
    };
  } catch (e) {
    console.error('Failed to compute real student stats', e);
  }

  return { enrolledCount: 0, completedCount: 0, completionPercentage: 0 };
}

function matchesCourse(row: any, course: Course): boolean {
  const cId = (course.id || '').toLowerCase();
  const cTitle = (course.title || '').toLowerCase();

  const rCourseId = (row.course_id || '').toLowerCase();
  const rProductId = (row.product_id || row.item_id || row.campaign_id || '').toLowerCase();
  const rTitle = (row.item_title || row.product_title || row.title || row.campaign_title || '').toLowerCase();

  // 1. Direct ID / Slug equality
  if (rCourseId && (rCourseId === cId || rCourseId === course.slug?.toLowerCase())) return true;
  if (rProductId && (rProductId === cId || rProductId === course.slug?.toLowerCase())) return true;

  // 2. Keyword matching for WordPress / Vitrine
  if (cTitle.includes('wordpress') || cId.includes('wordpress') || cId === 'c1' || cId === '11111111-1111-4111-a111-111111111111') {
    if (rProductId.includes('wordpress') || rCourseId.includes('wordpress') || rTitle.includes('wordpress')) return true;
    if (rProductId.includes('vitrine') || rCourseId.includes('vitrine') || rTitle.includes('vitrine')) return true;
  }

  // 3. Keyword matching for WooCommerce / Boutique
  if (cTitle.includes('woocommerce') || cId.includes('woocommerce') || cId === 'c2' || cId === '22222222-2222-4222-a222-222222222222') {
    if (rProductId.includes('woocommerce') || rCourseId.includes('woocommerce') || rTitle.includes('woocommerce')) return true;
    if (rProductId.includes('boutique') || rCourseId.includes('boutique') || rTitle.includes('boutique')) return true;
  }

  // 4. Keyword match
  if (rTitle && cTitle) {
    const titleWords = rTitle.split(/\s+/).filter((w: string) => w.length > 3);
    if (titleWords.some((w: string) => cTitle.includes(w))) return true;
  }

  // 5. Fallback for course price tier (e.g. 199€ or 99€ course orders)
  const rPrice = Number(row.price || row.amount || (row.total_amount_cents ? row.total_amount_cents / 100 : 0));
  if ((rPrice >= 49 || rPrice === 199 || rPrice === 99) && (cTitle.includes('wordpress') || cId === 'c1' || cId === '11111111-1111-4111-a111-111111111111')) {
    return true;
  }

  return false;
}

/**
 * Async computation of REAL student stats per course querying Supabase tables (enrollments, orders, preorder_buyers, user_access, preorders) & localStorage
 */
export async function fetchRealCourseStatsFromDb(coursesList: Course[]): Promise<Record<string, RealCourseStats>> {
  const statsMap: Record<string, RealCourseStats> = {};

  coursesList.forEach(c => {
    statsMap[c.id] = { enrolledCount: 0, completedCount: 0, completionPercentage: 0 };
  });

  try {
    const uniqueStudentsPerCourse = new Map<string, Set<string>>();
    const completedStudentsPerCourse = new Map<string, Set<string>>();

    coursesList.forEach(c => {
      uniqueStudentsPerCourse.set(c.id, new Set());
      completedStudentsPerCourse.set(c.id, new Set());
    });

    // 1. Fetch from enrollments table
    const { data: dbEnrollments } = await supabase.from('enrollments').select('*');
    if (dbEnrollments && Array.isArray(dbEnrollments)) {
      dbEnrollments.forEach((row: any) => {
        const email = (row.user_email || row.customer_email || row.email || '').toLowerCase().trim();
        if (!email) return;

        coursesList.forEach(c => {
          if (matchesCourse(row, c)) {
            const studentSet = uniqueStudentsPerCourse.get(c.id) || new Set();
            studentSet.add(email);
            uniqueStudentsPerCourse.set(c.id, studentSet);

            if (row.progress >= 100 || row.status === 'completed') {
              const completedSet = completedStudentsPerCourse.get(c.id) || new Set();
              completedSet.add(email);
              completedStudentsPerCourse.set(c.id, completedSet);
            }
          }
        });
      });
    }

    // 2. Fetch from orders table
    const { data: dbOrders } = await supabase.from('orders').select('*');
    if (dbOrders && Array.isArray(dbOrders)) {
      dbOrders.forEach((row: any) => {
        const email = (row.customer_email || row.user_email || row.email || '').toLowerCase().trim();
        if (!email) return;

        coursesList.forEach(c => {
          if (matchesCourse(row, c)) {
            const studentSet = uniqueStudentsPerCourse.get(c.id) || new Set();
            studentSet.add(email);
            uniqueStudentsPerCourse.set(c.id, studentSet);
          }
        });
      });
    }

    // 3. Fetch from preorder_buyers table
    const { data: dbPreorderBuyers } = await supabase.from('preorder_buyers').select('*');
    if (dbPreorderBuyers && Array.isArray(dbPreorderBuyers)) {
      dbPreorderBuyers.forEach((row: any) => {
        const email = (row.customer_email || row.email || row.user_email || '').toLowerCase().trim();
        if (!email) return;

        coursesList.forEach(c => {
          if (matchesCourse(row, c)) {
            const studentSet = uniqueStudentsPerCourse.get(c.id) || new Set();
            studentSet.add(email);
            uniqueStudentsPerCourse.set(c.id, studentSet);
          }
        });
      });
    }

    // 4. Fetch from user_access table
    const { data: dbUserAccess } = await supabase.from('user_access').select('*');
    if (dbUserAccess && Array.isArray(dbUserAccess)) {
      dbUserAccess.forEach((row: any) => {
        const email = (row.user_email || row.email || row.user_id || '').toLowerCase().trim();
        if (!email) return;

        coursesList.forEach(c => {
          if (matchesCourse(row, c)) {
            const studentSet = uniqueStudentsPerCourse.get(c.id) || new Set();
            studentSet.add(email);
            uniqueStudentsPerCourse.set(c.id, studentSet);
          }
        });
      });
    }

    // 5. Fetch from preorders table (current_enrollments field)
    const { data: dbPreorders } = await supabase.from('preorders').select('*');
    if (dbPreorders && Array.isArray(dbPreorders)) {
      dbPreorders.forEach((po: any) => {
        const count = Number(po.current_enrollments || po.buyers_count || 0);
        if (count > 0) {
          coursesList.forEach(c => {
            if (matchesCourse(po, c) || (c.title && po.title && c.title.toLowerCase().includes(po.title.toLowerCase()))) {
              const studentSet = uniqueStudentsPerCourse.get(c.id) || new Set();
              for (let i = 0; i < count; i++) {
                studentSet.add(`po_buyer_${po.id}_${i}`);
              }
              uniqueStudentsPerCourse.set(c.id, studentSet);
            }
          });
        }
      });
    }

    // 6. Merge from localStorage
    if (typeof window !== 'undefined') {
      try {
        const rawEnrolled = localStorage.getItem('gd_enrolled_courses');
        const enrolledList = rawEnrolled ? JSON.parse(rawEnrolled) : [];
        if (Array.isArray(enrolledList)) {
          enrolledList.forEach((item: any) => {
            const email = (item.email || item.customerEmail || 'anon@student.local').toLowerCase().trim();
            coursesList.forEach(c => {
              if (matchesCourse(item, c)) {
                const studentSet = uniqueStudentsPerCourse.get(c.id) || new Set();
                studentSet.add(email);
                uniqueStudentsPerCourse.set(c.id, studentSet);

                if (item.progress >= 100) {
                  const completedSet = completedStudentsPerCourse.get(c.id) || new Set();
                  completedSet.add(email);
                  completedStudentsPerCourse.set(c.id, completedSet);
                }
              }
            });
          });
        }
      } catch (e) {}
    }

    // Compile final stats per course
    coursesList.forEach(c => {
      const studentSet = uniqueStudentsPerCourse.get(c.id) || new Set();
      const completedSet = completedStudentsPerCourse.get(c.id) || new Set();
      const enrolledCount = studentSet.size;
      const completedCount = completedSet.size;
      const completionPercentage = enrolledCount > 0 ? Math.round((completedCount / enrolledCount) * 100) : 0;

      statsMap[c.id] = {
        enrolledCount,
        completedCount,
        completionPercentage
      };
    });

  } catch (err) {
    console.error('Failed to fetch real course stats from DB:', err);
  }

  return statsMap;
}
