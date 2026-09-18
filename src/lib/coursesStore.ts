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
  order_index?: number;
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
  order_index?: number;
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
    "id": "22222222-2222-4222-a222-222222222222",
    "slug": "formation-woocommerce",
    "title": "Formation ajouter une boutique en ligne avec WooCommerce",
    "description": "La formation pratique pour intégrer une boutique en ligne e-commerce complète à ton site WordPress et encaisser par carte bancaire.",
    "duration": "2h15",
    "level": "Tous niveaux",
    "prerequisites": "Avoir un site WordPress déjà créé ou en cours de création.",
    "price": 99,
    "originalPrice": 249,
    "image": "/images/products/formation-woocommerce.webp",
    "status": "Publié",
    "category": "formation",
    "congratulationsMsg": "Félicitations ! Ta boutique WooCommerce est configurée et prête à enregistrer tes premières ventes !",
    "modules": [
      {
        "id": "aa118416-2b97-432a-bd4a-2a1c844d7c57",
        "title": "Découvrir WooCommerce",
        "lessons": [
          {
            "id": "7e06df03-f7d0-470b-be10-682d65962511",
            "title": "1.1 Présentation de WooCommerce et prérequis e-commerce",
            "videoUrl": "https://youtu.be/a9ZuN80VWF0",
            "notes": "<p className=\"mb-3 leading-relaxed text-[#4a3b35]\">Créer un site internet peut sembler compliqué, technique, voire stressant…<br /><strong>Bonne nouvelle : ça ne doit pas l’être.</strong></p>\n\n<p className=\"mb-3 leading-relaxed text-[#4a3b35]\">Dans cette première vidéo, je te souhaite la bienvenue dans cette série de tutoriels dédiée à la création d’un site WordPress, pensée spécialement pour les débutants, les indépendants, les artisans, les créateurs et les entrepreneurs qui veulent un site simple, professionnel et efficace, sans jargon inutile ni prise de tête.</p>\n\n<p className=\"mb-3 leading-relaxed text-[#4a3b35]\">Je suis Stéphanie, fondatrice de <strong>Stratec Digital</strong>, et depuis plusieurs années j’accompagne des professionnels qui veulent se digitaliser à leur rythme, avec des outils adaptés et une méthode claire.<br />Cette série de vidéos est née d’un constat très simple :</p>\n\n<ul className=\"list-disc list-inside space-y-1 my-3 pl-2 text-[#4a3b35]\">\n  <li>beaucoup de personnes veulent créer leur site WordPress seules,</li>\n  <li>mais se sentent vite perdues, découragées ou bloquées par la technique.</li>\n</ul>\n\n<p className=\"mb-4 leading-relaxed font-bold text-[#18757d]\">Ici, on fait exactement l’inverse.</p>\n\n<h3 className=\"text-base font-extrabold text-[#18757d] mt-6 mb-2\">🎯 Objectif de cette formation WordPress :</h3>\n<p className=\"mb-2 text-[#4a3b35]\">Te guider pas à pas, dans le bon ordre, pour créer un site :</p>\n<ul className=\"list-disc list-inside space-y-1 my-3 pl-2 text-[#4a3b35]\">\n  <li>clair</li>\n  <li>fonctionnel</li>\n  <li>sécurisé</li>\n  <li>agréable pour tes visiteurs</li>\n  <li>et utile pour ton activité</li>\n</ul>\n\n<p className=\"my-3 font-semibold text-[#18757d]\">Sans pression. Sans perfectionnisme. Sans y passer tes nuits.</p>\n\n<h3 className=\"text-base font-extrabold text-[#18757d] mt-6 mb-2\">📌 Ce que tu vas apprendre dans cette série de vidéos</h3>\n<p className=\"mb-2 text-[#4a3b35]\">Tout au long de ces tutoriels WordPress, tu vas apprendre à :</p>\n<ul className=\"list-disc list-inside space-y-1 my-3 pl-2 text-[#4a3b35]\">\n  <li>Préparer ton projet web (nom de domaine, hébergement, email pro)</li>\n  <li>Installer WordPress facilement, même si tu n’y connais rien</li>\n  <li>Sécuriser ton site dès le départ</li>\n  <li>Choisir un thème adapté à ton activité</li>\n  <li>Installer uniquement les plugins vraiment utiles</li>\n  <li>Créer tes pages essentielles (Accueil, À propos, Contact…)</li>\n  <li>Organiser ton menu de navigation</li>\n  <li>Améliorer l’expérience utilisateur (UX)</li>\n  <li>Paramétrer correctement les URL et le HTTPS</li>\n  <li>Mettre en place des sauvegardes automatiques</li>\n  <li>Tester ton site avant le lancement</li>\n  <li>Comprendre les bases du référencement naturel (SEO)</li>\n  <li>Mettre ton site en ligne en toute sérénité</li>\n</ul>\n\n<p className=\"my-3 font-bold text-[#18757d]\">🎬 Chaque vidéo est courte, ciblée, et va droit au but.</p>\n\n<h3 className=\"text-base font-extrabold text-[#18757d] mt-6 mb-2\">💡 Une méthode “tranquille mais efficace”</h3>\n<p className=\"mb-2 text-[#4a3b35]\">Cette formation WordPress suit une philosophie simple : faire les choses dans le bon ordre, sans surcharger ton site ni ton cerveau.</p>\n<p className=\"mb-1 text-[#4a3b35] font-medium\">Pas besoin :</p>\n<ul className=\"list-disc list-inside space-y-1 my-3 pl-2 text-[#4a3b35]\">\n  <li>d’être développeur</li>\n  <li>d’avoir un budget énorme</li>\n  <li>de maîtriser le webmarketing</li>\n  <li>ni de passer 6 mois sur ton site</li>\n</ul>\n<p className=\"my-3 text-[#4a3b35]\">Tu avances étape par étape, tu appliques, et tu construis un site qui te ressemble.</p>\n\n<h3 className=\"text-base font-extrabold text-[#18757d] mt-6 mb-2\">👉 À qui s’adresse cette série de tutos WordPress ?</h3>\n<p className=\"mb-2 text-[#4a3b35]\">Cette formation est faite pour toi si tu es :</p>\n<ul className=\"list-disc list-inside space-y-1 my-3 pl-2 text-[#4a3b35]\">\n  <li>artisan</li>\n  <li>indépendant</li>\n  <li>créateur</li>\n  <li>thérapeute</li>\n  <li>consultant</li>\n  <li>entrepreneur débutant</li>\n  <li>ou simplement quelqu’un qui veut créer son site WordPress seul</li>\n</ul>\n<p className=\"mb-1 text-[#4a3b35] font-medium\">Même si :</p>\n<ul className=\"list-disc list-inside space-y-1 my-3 pl-2 text-[#4a3b35]\">\n  <li>tu débutes totalement</li>\n  <li>tu n’as jamais touché à WordPress</li>\n  <li>tu as déjà essayé et abandonné</li>\n</ul>\n\n<h3 className=\"text-base font-extrabold text-[#18757d] mt-6 mb-2\">🎬 Comment utiliser ces vidéos</h3>\n<ul className=\"list-none space-y-1.5 my-3 pl-1 text-[#4a3b35]\">\n  <li>▶️ <strong>Regarde les vidéos dans l’ordre</strong></li>\n  <li>🛠️ <strong>Applique au fur et à mesure</strong></li>\n  <li>⏸️ <strong>Mets pause si besoin</strong></li>\n  <li>🔄 <strong>Reviens quand tu veux</strong></li>\n</ul>\n<p className=\"my-3 text-[#4a3b35]\">Chaque vidéo correspond à une étape précise de la création de ton site WordPress.</p>\n\n<h3 className=\"text-base font-extrabold text-[#18757d] mt-6 mb-2\">🚀 Et maintenant ?</h3>\n<p className=\"mb-2 text-[#4a3b35]\">Dans la prochaine vidéo, on commence concrètement avec une étape clé :<br /><strong>Trouver le bon nom pour son site et son nom de domaine, sans se tromper.</strong></p>\n<p className=\"mt-4 font-bold text-[#18757d]\">Abonne-toi à la chaîne pour ne rien manquer, et surtout… avance à ton rythme. Ton site n’a pas besoin d’être parfait pour être efficace.</p>",
            "pdfUrl": "",
            "externalLink": "",
            "duration": "07:30",
            "order_index": 1
          },
          {
            "id": "4078cba7-6837-41e4-8508-cf72e4903eeb",
            "title": "Introduction à Woocommerce",
            "videoUrl": "https://youtu.be/a9ZuN80VWF0",
            "notes": "<h3>🎥 1️⃣ Découvrir WooCommerce – Transformer WordPress en boutique en ligne 🛍️</h3><p>Ton site WordPress est en ligne… mais il ne vend encore rien.</p><p>Dans cette vidéo, je te montre comment transformer ton site classique en véritable boutique en ligne grâce à WooCommerce, la solution e-commerce la plus utilisée avec WordPress.</p><p>Même si tu es débutant·e, tu vas comprendre comment ajouter une fonctionnalité de vente à ton site sans changer de plateforme ni repartir de zéro.</p><h3>🎯 <strong>Ce que tu vas apprendre dans cette vidéo :</strong></h3><p>Qu’est-ce que WooCommerce exactement<br>Pourquoi WooCommerce est idéal pour créer une boutique en ligne<br>Ce que tu peux vendre (produits physiques, numériques, services)<br>Comment WooCommerce s’intègre à WordPress<br>À quoi ressemble le tableau de bord WooCommerce</p><h3>🧠 <strong>Pourquoi WooCommerce est un choix stratégique</strong></h3><p>WooCommerce est utilisé par des millions de boutiques dans le monde 🌍.</p><p>Il te permet :</p><p>de garder le contrôle total sur ton site<br>de personnaliser ton design<br>d’ajouter des moyens de paiement<br>de gérer tes produits facilement<br>de développer ton activité sans limites</p><p>Contrairement aux plateformes fermées, tu restes propriétaire de ton site et de tes données.</p><p>👉 L’objectif de cette vidéo : te donner une vision claire du potentiel de WooCommerce avant de passer à l’installation.</p><p>🛠️ Dans la vidéo, tu verras concrètement :</p><p>Comment WooCommerce transforme WordPress en site e-commerce<br>Les types de produits que tu peux vendre<br>Comment se présente l’interface d’administration<br>Pourquoi cette solution est adaptée aux entrepreneurs, freelances et créateurs</p><h3>💡 <strong>Astuce Stratec Digital :</strong></h3><p>Avant d’installer quoi que ce soit, comprends la logique.<br>Un bon e-commerce commence toujours par une base bien pensée.</p><h3>🔑 <strong>Résultat après cette vidéo :</strong></h3><p>Tu comprends le fonctionnement global de WooCommerce<br>Tu sais si cette solution correspond à ton projet<br>Tu es prêt·e à passer à l’installation</p>",
            "pdfUrl": "",
            "externalLink": "",
            "duration": "11:15",
            "order_index": 2
          },
          {
            "id": "e6c43c99-8e17-4c05-a396-06b917a4fdaf",
            "title": "1.3 Paramétrage des options de commande et e-mails",
            "videoUrl": "https://youtu.be/a9ZuN80VWF0",
            "notes": "Personnalisation du logo et du message sur les e-mails de confirmation de commande.",
            "pdfUrl": "",
            "externalLink": "",
            "duration": "09:40",
            "order_index": 3
          }
        ],
        "order_index": 1
      },
      {
        "id": "47832487-a5e6-478d-acfa-df724038c42a",
        "title": "Installer et configurer WooCommerce",
        "lessons": [
          {
            "id": "e31f1ee2-78b9-4a40-977b-13deb6a4c348",
            "title": "Installer et configurer WooCommerce",
            "videoUrl": "https://youtu.be/144Et02WVKY",
            "notes": "<h3>🎥 2️⃣ Installer et Configurer WooCommerce – Guide Débutant ⚙️</h3><p>Tu es prêt·e à vendre en ligne ?<br>Alors il est temps d’installer WooCommerce correctement.</p><p>Dans cette vidéo, je t’accompagne pas à pas pour installer et configurer WooCommerce sans erreur, même si tu n’as aucune compétence technique.</p><h3>🎯 <strong>Ce que tu vas apprendre dans cette vidéo :</strong></h3><p>Comment installer WooCommerce depuis WordPress<br>Comment utiliser l’assistant de configuration<br>Paramétrer ta devise et ton pays<br>Définir le type de produits que tu vas vendre<br>Comprendre les premiers réglages importants</p><h3>🧠 <strong>Pourquoi l’installation est une étape clé</strong></h3><p>Une mauvaise configuration peut entraîner :</p><p>des erreurs de prix<br>des problèmes de paiement<br>une mauvaise expérience client<br>des réglages à refaire plus tard</p><p>👉 L’objectif ici est de poser des bases solides dès le départ.</p><p>WooCommerce fonctionne comme une extension : en quelques clics, ton site devient capable de gérer des commandes, des clients et des paiements.</p><p>🛠️ Dans la vidéo, tu verras concrètement :</p><p>Où installer WooCommerce<br>Comment suivre l’assistant étape par étape<br>Quels choix faire selon ton projet<br>Comment éviter les erreurs fréquentes</p><h3>💡 <strong>Astuce Stratec Digital :</strong></h3><p>Ne clique pas “suivant” sans comprendre.<br>Chaque réglage a un impact sur ta future boutique.</p><h3>🔑 <strong>Résultat après cette vidéo :</strong></h3><p>WooCommerce est installé correctement<br>Les paramètres de base sont configurés<br>Ta boutique est prête à accueillir ses premiers produits</p>",
            "pdfUrl": "",
            "externalLink": "",
            "duration": "14:20",
            "order_index": 1
          },
          {
            "id": "c23a0168-8211-4c87-bc81-85487c4a1e10",
            "title": "Réglages essentiels de la boutique",
            "videoUrl": "https://youtu.be/p3wcDqPpxRg",
            "notes": "<h3>🎥 3️⃣ Réglages Essentiels de la Boutique WooCommerce 🛠️</h3><p>WooCommerce est installé…<br>Mais ta boutique n’est pas encore prête à vendre.</p><p>Dans cette vidéo, je te montre les réglages essentiels pour que ta boutique en ligne soit professionnelle, cohérente et prête à accueillir des clients.</p><p>🎯 <strong>Ce que tu vas apprendre dans cette vidéo :</strong></p><p>Configurer les informations générales de ta boutique<br>Paramétrer les taxes<br>Comprendre les options de livraison<br>Gérer les comptes clients<br>Configurer les emails automatiques<br>Vérifier les paramètres importants</p><p>🧠 <strong>Pourquoi ces réglages sont cruciaux</strong></p><p>Sans configuration adaptée :</p><p>les prix peuvent s’afficher incorrectement<br>les frais de livraison peuvent être faux<br>les clients peuvent ne pas recevoir d’email<br>l’expérience d’achat peut être confuse</p><p>👉 L’objectif de cette vidéo : sécuriser et structurer ta boutique avant d’ajouter des produits.</p><p>🛠️ Dans la vidéo, tu verras concrètement :</p><p>Où se trouvent les réglages WooCommerce<br>Comment les configurer selon ton pays<br>Quels paramètres laisser par défaut<br>Quels réglages personnaliser<br>Les erreurs courantes à éviter</p><p>💡 <strong>Astuce Stratec Digital :</strong></p><p>Une boutique professionnelle ne se voit pas seulement au design.<br>Elle se voit dans les détails invisibles : emails, taxes, livraison, cohérence.</p><p>🔑 <strong>Résultat après cette vidéo :</strong></p><p>Ta boutique est correctement paramétrée<br>Les bases techniques sont solides<br>Tu peux commencer à ajouter tes produits en toute confiance</p><p>&nbsp;</p>",
            "pdfUrl": "",
            "externalLink": "",
            "duration": "10:15",
            "order_index": 2
          },
          {
            "id": "2cc53456-0cb3-42c3-b500-311104f81d3f",
            "title": "2.2 Créer des produits à variations (tailles, couleurs, déclinaisons)",
            "videoUrl": "https://youtu.be/a9ZuN80VWF0",
            "notes": "Mise en place des attributs de produits pour permettre au client de choisir sa déclinaison.",
            "pdfUrl": "",
            "externalLink": "",
            "duration": "16:50",
            "order_index": 3
          },
          {
            "id": "977eeb75-b3d9-42c1-9d49-468f9fa53321",
            "title": "2.4 Gestion automatisée des stocks et alertes de rupture",
            "videoUrl": "https://youtu.be/a9ZuN80VWF0",
            "notes": "Définition des seuils de stock et réception d’alertes e-mail quand le stock faiblit.",
            "pdfUrl": "",
            "externalLink": "",
            "duration": "08:30",
            "order_index": 4
          }
        ],
        "order_index": 2
      },
      {
        "id": "b419f3ab-638e-446c-8a10-7352a9aa0240",
        "title": "Créer et gérer ses produits",
        "lessons": [
          {
            "id": "1da0333e-1973-4617-aba9-5300180abb35",
            "title": "Créer son premier produit simple",
            "videoUrl": "https://youtu.be/2lNnAne1Ty4",
            "notes": "<p class=\"font-claude-response-body break-words whitespace-normal leading-[1.7]\">🎥 4️⃣ Créer son premier produit WooCommerce – Mettre un produit en ligne correctement 🛍️</p><p class=\"font-claude-response-body break-words whitespace-normal leading-[1.7]\">Tu as installé WooCommerce, configuré les réglages essentiels… et maintenant vient le moment que tu attendais : <strong>mettre ton premier produit en ligne.</strong></p><p class=\"font-claude-response-body break-words whitespace-normal leading-[1.7]\">Dans cette vidéo, je t'accompagne pas à pas pour créer un produit simple sur WooCommerce, de A à Z. Titre, description, prix, stock, image, catégories… on passe tout en revue, sans rien oublier. Parce qu'un produit bien construit, c'est un client rassuré, et un client rassuré, c'est une vente conclue. 😎</p><hr class=\"border-border-200 border-t-0.5 my-3 mx-1.5\"><p class=\"font-claude-response-body break-words whitespace-normal leading-[1.7]\">🎯 <strong>Ce que tu vas apprendre dans cette vidéo :</strong></p><ul class=\"[li_&amp;]:mb-0 [li_&amp;]:mt-1 [li_&amp;]:gap-1 [&amp;:not(:last-child)_ul]:pb-1 [&amp;:not(:last-child)_ol]:pb-1 list-disc flex flex-col gap-1 pl-8 mb-3\"><li class=\"whitespace-normal break-words pl-2\">Ce qu'est un produit simple dans WooCommerce</li><li class=\"whitespace-normal break-words pl-2\">Comment rédiger un titre et une description qui donnent envie d'acheter</li><li class=\"whitespace-normal break-words pl-2\">Comment fixer un prix et gérer ton stock</li><li class=\"whitespace-normal break-words pl-2\">Les bonnes pratiques pour l'image produit</li><li class=\"whitespace-normal break-words pl-2\">Comment utiliser les catégories et les étiquettes pour organiser ta boutique</li></ul><hr class=\"border-border-200 border-t-0.5 my-3 mx-1.5\"><p class=\"font-claude-response-body break-words whitespace-normal leading-[1.7]\">🧱 <strong>Pourquoi bien créer son premier produit, c'est crucial</strong></p><p class=\"font-claude-response-body break-words whitespace-normal leading-[1.7]\">Beaucoup de personnes qui débutent avec WooCommerce font l'erreur de remplir leurs fiches produits à la va-vite : un titre flou, une description copiée-collée, une photo prise avec le téléphone en mauvaise lumière… Et ils se demandent ensuite pourquoi ça ne vend pas.</p><p class=\"font-claude-response-body break-words whitespace-normal leading-[1.7]\">La vérité, c'est que <strong>ta fiche produit, c'est ton vendeur silencieux.</strong> C'est lui qui convainc ton visiteur de passer à l'achat, même quand tu n'es pas là. Alors autant lui donner toutes les chances de faire du bon travail.</p><p class=\"font-claude-response-body break-words whitespace-normal leading-[1.7]\">Dans cette vidéo, je te montre comment créer une fiche produit claire, rassurante et professionnelle — même si tu vends ton tout premier article, même si tu n'as aucune expérience en e-commerce.</p><hr class=\"border-border-200 border-t-0.5 my-3 mx-1.5\"><p class=\"font-claude-response-body break-words whitespace-normal leading-[1.7]\">🛠️ <strong>Dans la vidéo, tu verras concrètement :</strong></p><p class=\"font-claude-response-body break-words whitespace-normal leading-[1.7]\"><strong>👉 Le produit simple : c'est quoi exactement ?</strong> WooCommerce propose plusieurs types de produits. On commence par le plus fondamental : le produit simple. C'est le point de départ idéal pour comprendre la logique de la plateforme avant d'aller vers des configurations plus avancées.</p><p class=\"font-claude-response-body break-words whitespace-normal leading-[1.7]\"><strong>👉 Titre et description efficaces</strong> Un bon titre, c'est clair, précis et orienté bénéfice. Je te montre comment formuler ton titre pour qu'il soit compris en une seconde, et comment rédiger une description qui répond aux vraies questions de ton client : Qu'est-ce que c'est ? Pour qui ? Pourquoi l'acheter ?</p><p class=\"font-claude-response-body break-words whitespace-normal leading-[1.7]\"><strong>👉 Prix et gestion du stock</strong> On configure le prix de vente, et si besoin le prix barré pour une promotion. Je t'explique aussi comment activer la gestion du stock directement dans WooCommerce, pour que ta boutique soit toujours à jour, sans que tu aies à t'en préoccuper manuellement.</p><p class=\"font-claude-response-body break-words whitespace-normal leading-[1.7]\"><strong>👉 L'image produit : les bonnes pratiques</strong> L'image, c'est souvent la première chose que voit ton visiteur. Je te donne les règles simples à respecter : dimensions recommandées, fond, qualité, format. Des conseils concrets pour que ton produit soit mis en valeur, même si tu n'as pas de matériel photo professionnel.</p><p class=\"font-claude-response-body break-words whitespace-normal leading-[1.7]\"><strong>👉 Catégories et étiquettes</strong> Comment organiser ta boutique pour que tes clients s'y retrouvent facilement ? Les catégories et étiquettes WooCommerce sont tes alliées. Je te montre comment les créer, les attribuer, et pourquoi c'est aussi utile pour le référencement naturel de ta boutique.</p><hr class=\"border-border-200 border-t-0.5 my-3 mx-1.5\"><p class=\"font-claude-response-body break-words whitespace-normal leading-[1.7]\">💡 <strong>Astuce Stratec Digital :</strong></p><p class=\"font-claude-response-body break-words whitespace-normal leading-[1.7]\">Un bon produit, c'est <strong>clair, rassurant et facile à comprendre.</strong> Si ton visiteur doit se poser des questions pour comprendre ce qu'il achète, tu as déjà perdu la vente. Mets-toi dans la peau de ton client : est-ce qu'il comprend immédiatement ce que tu vends, à qui ça s'adresse, et ce qu'il va recevoir ? Si la réponse est oui, tu es sur la bonne voie. ✅</p><hr class=\"border-border-200 border-t-0.5 my-3 mx-1.5\"><p class=\"font-claude-response-body break-words whitespace-normal leading-[1.7]\">🔑 <strong>Résultat après cette vidéo :</strong></p><ul class=\"[li_&amp;]:mb-0 [li_&amp;]:mt-1 [li_&amp;]:gap-1 [&amp;:not(:last-child)_ul]:pb-1 [&amp;:not(:last-child)_ol]:pb-1 list-disc flex flex-col gap-1 pl-8 mb-3\"><li class=\"whitespace-normal break-words pl-2\">Tu sais créer un produit simple dans WooCommerce de A à Z</li><li class=\"whitespace-normal break-words pl-2\">Tu as une fiche produit propre, complète et professionnelle</li><li class=\"whitespace-normal break-words pl-2\">Ton premier produit est en ligne et prêt à être acheté</li><li class=\"whitespace-normal break-words pl-2\">Tu comprends la logique de WooCommerce pour aller encore plus loin dans les prochaines vidéos</li></ul><hr class=\"border-border-200 border-t-0.5 my-3 mx-1.5\"><p class=\"font-claude-response-body break-words whitespace-normal leading-[1.7]\">🎓 <strong>Cette vidéo fait partie de la formation complète WooCommerce by Stratec Digital.</strong> On part de zéro pour arriver à une boutique en ligne fonctionnelle, sécurisée et prête à vendre — étape par étape, sans stress, sans jargon inutile.</p>",
            "pdfUrl": "",
            "externalLink": "",
            "duration": "09:20",
            "order_index": 1
          },
          {
            "id": "3f46195b-a229-4fe2-a2e2-fa579c5dfc60",
            "title": "Produits variables (tailles, couleurs…)",
            "videoUrl": "https://youtu.be/a9ZuN80VWF0",
            "notes": "<h3>🎥 5️⃣ Produits variables WooCommerce – Gérer les tailles, couleurs et variantes sans se perdre 🎨</h3><p class=\"font-claude-response-body break-words whitespace-normal leading-[1.7]\">Tu vends un t-shirt disponible en 3 tailles et 5 couleurs ? Une formation déclinée en version PDF et vidéo ? Un produit proposé en différentes matières ou formats ?</p><p class=\"font-claude-response-body break-words whitespace-normal leading-[1.7]\">Alors tu as besoin des <strong>produits variables WooCommerce.</strong></p><p class=\"font-claude-response-body break-words whitespace-normal leading-[1.7]\">Dans cette vidéo, je t'explique comment créer et gérer des produits avec des variantes — taille, couleur, matière, format… — de façon claire et organisée. Parce que oui, les produits variables font souvent peur aux débutants. Mais une fois que tu as compris la logique, c'est une des fonctionnalités les plus puissantes de WooCommerce. Et je vais te montrer que c'est beaucoup plus simple que ça en a l'air. 😎</p><hr class=\"border-border-200 border-t-0.5 my-3 mx-1.5\"><p class=\"font-claude-response-body break-words whitespace-normal leading-[1.7]\">🎯 <strong>Ce que tu vas apprendre dans cette vidéo :</strong></p><ul class=\"[li_&amp;]:mb-0 [li_&amp;]:mt-1 [li_&amp;]:gap-1 [&amp;:not(:last-child)_ul]:pb-1 [&amp;:not(:last-child)_ol]:pb-1 list-disc flex flex-col gap-1 pl-8 mb-3\"><li class=\"whitespace-normal break-words pl-2\">Quand utiliser un produit variable plutôt qu'un produit simple</li><li class=\"whitespace-normal break-words pl-2\">Comment créer des attributs (taille, couleur, matière…)</li><li class=\"whitespace-normal break-words pl-2\">Comment générer les variations à partir de ces attributs</li><li class=\"whitespace-normal break-words pl-2\">Comment définir un prix et un stock différent pour chaque variation</li><li class=\"whitespace-normal break-words pl-2\">Les erreurs les plus courantes à éviter pour ne pas se retrouver bloqué</li></ul><hr class=\"border-border-200 border-t-0.5 my-3 mx-1.5\"><p class=\"font-claude-response-body break-words whitespace-normal leading-[1.7]\">🧩 <strong>Pourquoi les produits variables changent tout</strong></p><p class=\"font-claude-response-body break-words whitespace-normal leading-[1.7]\">Imagine que tu vends un sac à main disponible en noir, marron et beige, chacun en taille S et L. Sans les produits variables, tu devrais créer <strong>six fiches produits séparées.</strong> Six pages à gérer, six images à uploader, six stocks à suivre… Un vrai casse-tête.</p><p class=\"font-claude-response-body break-words whitespace-normal leading-[1.7]\">Avec les produits variables, tu crées <strong>une seule fiche produit,</strong> et tu laisses ton client choisir la combinaison qui lui convient directement sur la page. C'est plus propre, plus professionnel, et surtout beaucoup plus agréable pour l'expérience d'achat.</p><p class=\"font-claude-response-body break-words whitespace-normal leading-[1.7]\">Et ce n'est pas réservé aux boutiques de mode ! Les produits variables sont utiles pour énormément de types de ventes : formations en différentes formules, produits artisanaux en plusieurs finitions, services proposés en différents niveaux, produits numériques en plusieurs formats… Dès que tu as des déclinaisons, le produit variable est ta solution.</p><hr class=\"border-border-200 border-t-0.5 my-3 mx-1.5\"><p class=\"font-claude-response-body break-words whitespace-normal leading-[1.7]\">🛠️ <strong>Dans la vidéo, tu verras concrètement :</strong></p><p class=\"font-claude-response-body break-words whitespace-normal leading-[1.7]\"><strong>👉 Quand utiliser un produit variable</strong> Pas besoin de tout transformer en produit variable. Je t'explique clairement dans quels cas c'est pertinent, et quand le produit simple suffit largement. Bien choisir son type de produit, c'est déjà éviter beaucoup de complications inutiles.</p><p class=\"font-claude-response-body break-words whitespace-normal leading-[1.7]\"><strong>👉 Créer ses attributs : taille, couleur, matière…</strong> Un attribut, c'est simplement une caractéristique de ton produit qui peut varier. Je te montre comment les créer dans WooCommerce, les nommer correctement et les réutiliser d'un produit à l'autre pour gagner du temps. On voit ensemble des exemples concrets pour que ce soit parfaitement clair.</p><p class=\"font-claude-response-body break-words whitespace-normal leading-[1.7]\"><strong>👉 Générer les variations</strong> Une fois les attributs définis, WooCommerce peut générer automatiquement toutes les combinaisons possibles. Je te montre comment faire ça en quelques clics, et comment les retrouver facilement dans l'interface d'administration, même quand il y en a beaucoup.</p><p class=\"font-claude-response-body break-words whitespace-normal leading-[1.7]\"><strong>👉 Prix et stock par variation</strong> C'est là que ça devient vraiment intéressant. Chaque variation peut avoir son propre prix, son propre stock, voire sa propre image. Je t'explique comment configurer tout ça proprement pour que ta boutique soit à la fois précise et facile à gérer au quotidien.</p><p class=\"font-claude-response-body break-words whitespace-normal leading-[1.7]\"><strong>👉 Les erreurs courantes à éviter</strong> Les produits variables, c'est puissant… mais c'est aussi là où beaucoup de débutants se perdent. Variations invisibles sur le site, attributs mal configurés, stock qui ne se met pas à jour… Je te montre les pièges les plus fréquents pour que tu ne tombes pas dedans. Un gain de temps précieux ! ⏱️</p><hr class=\"border-border-200 border-t-0.5 my-3 mx-1.5\"><p class=\"font-claude-response-body break-words whitespace-normal leading-[1.7]\">💡 <strong>Astuce Stratec Digital :</strong></p><p class=\"font-claude-response-body break-words whitespace-normal leading-[1.7]\">Avant de créer tes variations, <strong>pense d'abord à l'expérience de ton client.</strong> Est-ce qu'il comprend facilement les options disponibles ? Est-ce que les noms que tu donnes à tes attributs sont clairs pour lui ? Un produit variable bien construit, c'est un produit où le client trouve immédiatement ce qu'il cherche, sans hésitation et sans frustration. Moins il réfléchit, plus il achète. ✅</p><hr class=\"border-border-200 border-t-0.5 my-3 mx-1.5\"><p class=\"font-claude-response-body break-words whitespace-normal leading-[1.7]\">🔑 <strong>Résultat après cette vidéo :</strong></p><ul class=\"[li_&amp;]:mb-0 [li_&amp;]:mt-1 [li_&amp;]:gap-1 [&amp;:not(:last-child)_ul]:pb-1 [&amp;:not(:last-child)_ol]:pb-1 list-disc flex flex-col gap-1 pl-8 mb-3\"><li class=\"whitespace-normal break-words pl-2\">Tu sais exactement quand et pourquoi utiliser un produit variable</li><li class=\"whitespace-normal break-words pl-2\">Tu as créé tes attributs et généré tes variations sans te perdre</li><li class=\"whitespace-normal break-words pl-2\">Chaque déclinaison a son propre prix et son propre stock</li><li class=\"whitespace-normal break-words pl-2\">Tu as évité les erreurs classiques qui font perdre du temps</li><li class=\"whitespace-normal break-words pl-2\">Ta boutique gère plusieurs déclinaisons de façon propre et professionnelle</li></ul><hr class=\"border-border-200 border-t-0.5 my-3 mx-1.5\"><p class=\"font-claude-response-body break-words whitespace-normal leading-[1.7]\">🎓 <strong>Cette vidéo fait partie de la formation complète WooCommerce by Stratec Digital.</strong> On construit ensemble une boutique en ligne fonctionnelle, organisée et prête à vendre — étape par étape, sans stress et sans jargon inutile.</p>",
            "pdfUrl": "",
            "externalLink": "",
            "duration": "13:45",
            "order_index": 2
          },
          {
            "id": "1a4f45e0-e69e-4a3a-8369-a06e544fd8c9",
            "title": "Produits numériques & services",
            "videoUrl": "https://youtu.be/F7tRXg55iOw",
            "notes": "<h3>🎥 6️⃣ Produits numériques &amp; services WooCommerce – Vendre sans livraison physique 📦✨</h3><p class=\"font-claude-response-body break-words whitespace-normal leading-[1.7]\">Tu vends un ebook, une formation, un coaching, une prestation de service ou une réservation en ligne ?</p><p class=\"font-claude-response-body break-words whitespace-normal leading-[1.7]\">Bonne nouvelle : <strong>tu n'as pas besoin de gérer de stock, de colis, ni de livraison.</strong> WooCommerce te permet de vendre des produits 100 % numériques et des services en quelques clics, et de les livrer automatiquement à tes clients dès le paiement confirmé.</p><p class=\"font-claude-response-body break-words whitespace-normal leading-[1.7]\">Dans cette vidéo, je t'explique comment configurer des produits téléchargeables et des services dans WooCommerce, pour que ta boutique tourne toute seule — même pendant que tu dors. 😎 Parce qu'un bon système, c'est celui qui travaille à ta place.</p><hr class=\"border-border-200 border-t-0.5 my-3 mx-1.5\"><p class=\"font-claude-response-body break-words whitespace-normal leading-[1.7]\">🎯 <strong>Ce que tu vas apprendre dans cette vidéo :</strong></p><ul class=\"[li_&amp;]:mb-0 [li_&amp;]:mt-1 [li_&amp;]:gap-1 [&amp;:not(:last-child)_ul]:pb-1 [&amp;:not(:last-child)_ol]:pb-1 list-disc flex flex-col gap-1 pl-8 mb-3\"><li class=\"whitespace-normal break-words pl-2\">Comment créer un produit téléchargeable dans WooCommerce</li><li class=\"whitespace-normal break-words pl-2\">Comment automatiser l'accès au fichier après le paiement</li><li class=\"whitespace-normal break-words pl-2\">Comment vendre des services et des prestations sans stock physique</li><li class=\"whitespace-normal break-words pl-2\">Des cas concrets pour t'inspirer : ebook, coaching, formation, réservation</li></ul><hr class=\"border-border-200 border-t-0.5 my-3 mx-1.5\"><p class=\"font-claude-response-body break-words whitespace-normal leading-[1.7]\">💡 <strong>Pourquoi vendre du numérique ou des services, c'est une opportunité énorme</strong></p><p class=\"font-claude-response-body break-words whitespace-normal leading-[1.7]\">On parle souvent de WooCommerce pour les boutiques qui vendent des produits physiques. Mais la réalité, c'est que <strong>WooCommerce est tout aussi puissant — voire plus simple à gérer — pour les produits numériques et les services.</strong></p><p class=\"font-claude-response-body break-words whitespace-normal leading-[1.7]\">Pas de stock à gérer. Pas de transporteur à contacter. Pas de retours produits compliqués. Ton client paie, il reçoit automatiquement son fichier ou son accès, et toi tu peux te concentrer sur ce que tu fais vraiment bien.</p><p class=\"font-claude-response-body break-words whitespace-normal leading-[1.7]\">C'est le modèle idéal pour les créateurs de contenu, les formateurs, les consultants, les coachs, les graphistes, les photographes… Bref, pour tous ceux qui vendent <strong>de la valeur plutôt que de la matière.</strong> Et si c'est ton cas, cette vidéo est exactement ce qu'il te faut.</p><hr class=\"border-border-200 border-t-0.5 my-3 mx-1.5\"><p class=\"font-claude-response-body break-words whitespace-normal leading-[1.7]\">🛠️ <strong>Dans la vidéo, tu verras concrètement :</strong></p><p class=\"font-claude-response-body break-words whitespace-normal leading-[1.7]\"><strong>👉 Les produits téléchargeables : comment ça fonctionne</strong> Un produit téléchargeable, c'est n'importe quel fichier que tu veux vendre en ligne : un ebook en PDF, un pack de photos, un template, une formation audio, un fichier SVG… Je te montre comment l'uploader dans WooCommerce, comment le relier à un produit et comment tout paramétrer pour que la livraison soit instantanée et automatique.</p><p class=\"font-claude-response-body break-words whitespace-normal leading-[1.7]\"><strong>👉 L'accès après paiement : automatiser la livraison</strong> C'est la magie du numérique. Dès que ton client a payé, WooCommerce lui envoie automatiquement un lien de téléchargement sécurisé par e-mail. Je t'explique comment configurer correctement les limites de téléchargement et la durée d'accès, pour que tu gardes le contrôle sur ce que tu distribues — sans avoir à intervenir manuellement à chaque vente. 🚀</p><p class=\"font-claude-response-body break-words whitespace-normal leading-[1.7]\"><strong>👉 Les services et prestations</strong> Tu ne vends pas un fichier, mais du temps, de l'expertise ou une prestation ? Pas de problème. WooCommerce permet aussi de vendre des services à la commande : une heure de coaching, une prestation de design, un audit, une consultation… Je te montre comment créer ce type de produit proprement, sans que WooCommerce te demande inutilement un stock ou un poids de livraison.</p><p class=\"font-claude-response-body break-words whitespace-normal leading-[1.7]\"><strong>👉 Des cas concrets pour t'inspirer</strong> Pour que ce soit le plus utile possible, on passe en revue plusieurs exemples réels et pratiques :</p><ul class=\"[li_&amp;]:mb-0 [li_&amp;]:mt-1 [li_&amp;]:gap-1 [&amp;:not(:last-child)_ul]:pb-1 [&amp;:not(:last-child)_ol]:pb-1 list-disc flex flex-col gap-1 pl-8 mb-3\"><li class=\"whitespace-normal break-words pl-2\">📖 Un <strong>ebook</strong> vendu en téléchargement automatique</li><li class=\"whitespace-normal break-words pl-2\">🎓 Une <strong>formation en ligne</strong> accessible après paiement</li><li class=\"whitespace-normal break-words pl-2\">🧑‍💻 Une session de <strong>coaching individuel</strong> réservable et payable en ligne</li><li class=\"whitespace-normal break-words pl-2\">📅 Une <strong>réservation de prestation</strong> intégrée directement dans ta boutique</li></ul><p class=\"font-claude-response-body break-words whitespace-normal leading-[1.7]\">Des exemples concrets qui te permettront d'identifier immédiatement comment adapter tout ça à ton activité.</p><hr class=\"border-border-200 border-t-0.5 my-3 mx-1.5\"><p class=\"font-claude-response-body break-words whitespace-normal leading-[1.7]\">💡 <strong>Astuce Stratec Digital :</strong></p><p class=\"font-claude-response-body break-words whitespace-normal leading-[1.7]\">Avec les produits numériques, <strong>la confiance est encore plus importante qu'avec un produit physique.</strong> Ton client ne peut pas toucher ce qu'il achète avant de payer. Alors soigne ta description, sois précis sur ce qu'il va recevoir, et rassure-le sur la simplicité de l'accès. Un client qui sait exactement ce qu'il va obtenir est un client qui n'hésite pas à cliquer sur \"Commander\". ✅</p><hr class=\"border-border-200 border-t-0.5 my-3 mx-1.5\"><p class=\"font-claude-response-body break-words whitespace-normal leading-[1.7]\">🔑 <strong>Résultat après cette vidéo :</strong></p><ul class=\"[li_&amp;]:mb-0 [li_&amp;]:mt-1 [li_&amp;]:gap-1 [&amp;:not(:last-child)_ul]:pb-1 [&amp;:not(:last-child)_ol]:pb-1 list-disc flex flex-col gap-1 pl-8 mb-3\"><li class=\"whitespace-normal break-words pl-2\">Tu sais créer et configurer un produit téléchargeable dans WooCommerce</li><li class=\"whitespace-normal break-words pl-2\">La livraison de tes fichiers est automatique et sécurisée dès le paiement</li><li class=\"whitespace-normal break-words pl-2\">Tu sais vendre des services et des prestations sans gestion de stock</li><li class=\"whitespace-normal break-words pl-2\">Tu as des idées concrètes pour adapter tout ça à ton activité</li><li class=\"whitespace-normal break-words pl-2\">Ta boutique peut vendre du numérique 24h/24, 7j/7, sans intervention de ta part</li></ul><hr class=\"border-border-200 border-t-0.5 my-3 mx-1.5\"><p class=\"font-claude-response-body break-words whitespace-normal leading-[1.7]\">🎓 <strong>Cette vidéo fait partie de la formation complète WooCommerce by Stratec Digital.</strong> On construit ensemble une boutique en ligne complète, flexible et prête à vendre tout type de produit — physique, numérique ou service — étape par étape, sans stress et sans jargon inutile.</p>",
            "pdfUrl": "",
            "externalLink": "",
            "duration": "07:50",
            "order_index": 3
          }
        ],
        "order_index": 3
      },
      {
        "id": "6d52eb88-5578-4e84-95fc-2b4e1b7d9bd9",
        "title": "Paiement et livraison",
        "lessons": [
          {
            "id": "643f86c4-c103-4096-a424-9776e35cd326",
            "title": "Paramétrer les moyens de paiement",
            "videoUrl": "https://youtu.be/a9I-kILkgbs",
            "notes": "<h3>🎥 7️⃣ Paramétrer les moyens de paiement WooCommerce – Être payé simplement et en sécurité 💳</h3><p class=\"font-claude-response-body break-words whitespace-normal leading-[1.7]\">Tu as créé tes produits, ta boutique est belle, tout est en place…</p><p class=\"font-claude-response-body break-words whitespace-normal leading-[1.7]\">Mais si tes clients ne peuvent pas payer facilement et en toute confiance, <strong>tout ce travail ne sert à rien.</strong></p><p class=\"font-claude-response-body break-words whitespace-normal leading-[1.7]\">Les moyens de paiement, c'est l'étape que beaucoup redoutent. Et pourtant, c'est une des plus importantes — et heureusement, une des plus simples à configurer avec WooCommerce. Dans cette vidéo, je t'accompagne pas à pas pour mettre en place les bonnes solutions de paiement, sécuriser les transactions et tester que tout fonctionne avant de te lancer officiellement. Parce qu'une boutique qui encaisse bien, c'est une boutique qui tourne vraiment. 😎</p><hr class=\"border-border-200 border-t-0.5 my-3 mx-1.5\"><p class=\"font-claude-response-body break-words whitespace-normal leading-[1.7]\">🎯 <strong>Ce que tu vas apprendre dans cette vidéo :</strong></p><ul class=\"[li_&amp;]:mb-0 [li_&amp;]:mt-1 [li_&amp;]:gap-1 [&amp;:not(:last-child)_ul]:pb-1 [&amp;:not(:last-child)_ol]:pb-1 list-disc flex flex-col gap-1 pl-8 mb-3\"><li class=\"whitespace-normal break-words pl-2\">Quels sont les moyens de paiement disponibles par défaut dans WooCommerce</li><li class=\"whitespace-normal break-words pl-2\">Comment intégrer Stripe pour accepter les paiements par carte bancaire</li><li class=\"whitespace-normal break-words pl-2\">Comment connecter PayPal à ta boutique</li><li class=\"whitespace-normal break-words pl-2\">Les bonnes pratiques pour sécuriser les paiements de tes clients</li><li class=\"whitespace-normal break-words pl-2\">Comment tester un paiement pour vérifier que tout fonctionne avant la mise en ligne</li></ul><hr class=\"border-border-200 border-t-0.5 my-3 mx-1.5\"><p class=\"font-claude-response-body break-words whitespace-normal leading-[1.7]\">💳 <strong>Pourquoi bien configurer ses paiements, c'est non négociable</strong></p><p class=\"font-claude-response-body break-words whitespace-normal leading-[1.7]\">Imagine : ton client tombe sur ta boutique, il aime ce que tu proposes, il clique sur \"Commander\"… et là, il ne trouve pas son moyen de paiement habituel. Ou pire, le processus lui semble peu rassurant, peu sécurisé. Résultat ? Il quitte ta boutique sans acheter, et il ne revient probablement pas.</p><p class=\"font-claude-response-body break-words whitespace-normal leading-[1.7]\"><strong>Un moyen de paiement mal configuré, c'est de l'argent laissé sur la table.</strong> Et c'est souvent évitable.</p><p class=\"font-claude-response-body break-words whitespace-normal leading-[1.7]\">La règle d'or en e-commerce, c'est de proposer plusieurs options de paiement, de rassurer ton client à chaque étape, et de t'assurer que l'encaissement est fiable et sécurisé. C'est exactement ce qu'on va construire ensemble dans cette vidéo.</p><hr class=\"border-border-200 border-t-0.5 my-3 mx-1.5\"><p class=\"font-claude-response-body break-words whitespace-normal leading-[1.7]\">🛠️ <strong>Dans la vidéo, tu verras concrètement :</strong></p><p class=\"font-claude-response-body break-words whitespace-normal leading-[1.7]\"><strong>👉 Les paiements par défaut : virement bancaire et chèque</strong> WooCommerce propose dès l'installation deux moyens de paiement basiques : le virement bancaire et le chèque. Je te montre comment les activer et les configurer correctement. Ce sont des options utiles pour certaines activités — notamment les services ou les commandes sur devis — mais elles ne suffisent pas pour une boutique e-commerce moderne. On va donc aller plus loin.</p><p class=\"font-claude-response-body break-words whitespace-normal leading-[1.7]\"><strong>👉 Stripe : accepter les paiements par carte bancaire</strong> Stripe, c'est aujourd'hui la référence pour encaisser des paiements par carte bancaire sur WordPress et WooCommerce. Simple à installer, fiable, sécurisé, et compatible avec un maximum de cartes. Je te montre comment créer ton compte Stripe, connecter le plugin à ta boutique et paramétrer tout ça correctement pour que tes clients puissent payer en quelques secondes, directement sur ta page de commande. Pas de redirection complexe, pas d'étape inutile. Fluide et professionnel. 🚀</p><p class=\"font-claude-response-body break-words whitespace-normal leading-[1.7]\"><strong>👉 PayPal : une option rassurante pour tes clients</strong> PayPal reste un moyen de paiement très apprécié par de nombreux acheteurs en ligne, notamment parce qu'il offre une couche de protection supplémentaire et qu'il est très reconnu. Je te montre comment le connecter à WooCommerce simplement, et dans quels cas il est pertinent de le proposer en complément de Stripe. Avoir les deux, c'est souvent la meilleure stratégie pour maximiser tes conversions.</p><p class=\"font-claude-response-body break-words whitespace-normal leading-[1.7]\"><strong>👉 Les conseils sécurité paiement</strong> Sécuriser les paiements de ta boutique, ce n'est pas qu'une question technique — c'est aussi une question de confiance. Je te donne les points essentiels à vérifier : certificat SSL actif, affichage des logos de paiement sécurisé, messages de réassurance sur ta page de commande… Des détails qui font toute la différence pour convaincre un client hésitant de finaliser son achat. Parce que tes clients ont besoin de se sentir en sécurité avant de sortir leur carte. 🔒</p><p class=\"font-claude-response-body break-words whitespace-normal leading-[1.7]\"><strong>👉 Tester un paiement avant de se lancer</strong> C'est l'étape que beaucoup oublient et qui peut pourtant éviter bien des mauvaises surprises. Je te montre comment effectuer un paiement test sur ta boutique — sans débiter de vraie carte — pour vérifier que tout le tunnel de commande fonctionne correctement : de l'ajout au panier jusqu'à l'e-mail de confirmation. Un test rapide qui te permet de lancer ta boutique l'esprit tranquille. ✅</p><hr class=\"border-border-200 border-t-0.5 my-3 mx-1.5\"><p class=\"font-claude-response-body break-words whitespace-normal leading-[1.7]\">💡 <strong>Astuce Stratec Digital :</strong></p><p class=\"font-claude-response-body break-words whitespace-normal leading-[1.7]\"><strong>Ne propose jamais un seul moyen de paiement.</strong> Chaque client a ses habitudes : certains préfèrent payer par carte, d'autres uniquement via PayPal. Plus tu multiplies les options, moins tu crées de frictions à l'achat. Et moins il y a de frictions… plus tu vends. C'est aussi simple que ça. 😉</p><hr class=\"border-border-200 border-t-0.5 my-3 mx-1.5\"><p class=\"font-claude-response-body break-words whitespace-normal leading-[1.7]\">🔑 <strong>Résultat après cette vidéo :</strong></p><ul class=\"[li_&amp;]:mb-0 [li_&amp;]:mt-1 [li_&amp;]:gap-1 [&amp;:not(:last-child)_ul]:pb-1 [&amp;:not(:last-child)_ol]:pb-1 list-disc flex flex-col gap-1 pl-8 mb-3\"><li class=\"whitespace-normal break-words pl-2\">Tes moyens de paiement par défaut sont correctement configurés</li><li class=\"whitespace-normal break-words pl-2\">Stripe est connecté et prêt à encaisser des paiements par carte bancaire</li><li class=\"whitespace-normal break-words pl-2\">PayPal est intégré à ta boutique comme option complémentaire</li><li class=\"whitespace-normal break-words pl-2\">Tes paiements sont sécurisés et inspirent confiance à tes clients</li><li class=\"whitespace-normal break-words pl-2\">Tu as effectué un test de paiement et tout fonctionne parfaitement</li><li class=\"whitespace-normal break-words pl-2\">Ta boutique est prête à encaisser ses premières vraies commandes 🎉</li></ul><hr class=\"border-border-200 border-t-0.5 my-3 mx-1.5\"><p class=\"font-claude-response-body break-words whitespace-normal leading-[1.7]\">🎓 <strong>Cette vidéo fait partie de la formation complète WooCommerce by Stratec Digital.</strong> On construit ensemble une boutique en ligne sérieuse, sécurisée et prête à vendre — étape par étape, sans stress et sans jargon inutile.</p>",
            "pdfUrl": "",
            "externalLink": "",
            "duration": "12:30",
            "order_index": 1
          },
          {
            "id": "d5604eb7-dac2-4664-8807-b45deca47a94",
            "title": "Configurer la livraison",
            "videoUrl": "https://youtu.be/SWBlHB9bSYY",
            "notes": "<h3>🎥 8️⃣ Configurer la livraison WooCommerce – Comprendre et paramétrer les livraisons 📦</h3><p class=\"font-claude-response-body break-words whitespace-normal leading-[1.7]\">Tu as tes produits en ligne, tes paiements sont configurés…</p><p class=\"font-claude-response-body break-words whitespace-normal leading-[1.7]\">Mais avant que ta boutique soit vraiment prête à vendre, il reste une étape que beaucoup bâclent — et qui peut pourtant faire fuir un client à la dernière seconde : <strong>la livraison.</strong></p><p class=\"font-claude-response-body break-words whitespace-normal leading-[1.7]\">Frais trop élevés, zones mal configurées, livraison gratuite mal pensée… Les erreurs de configuration de livraison sont parmi les premières causes d'abandon de panier en e-commerce. Dans cette vidéo, je t'explique comment paramétrer ta livraison de façon claire, logique et adaptée à ton activité — que tu vendes des produits physiques ou entièrement numériques. Parce qu'une livraison bien configurée, c'est un client qui va jusqu'au bout de sa commande. 😎</p><hr class=\"border-border-200 border-t-0.5 my-3 mx-1.5\"><p class=\"font-claude-response-body break-words whitespace-normal leading-[1.7]\">🎯 <strong>Ce que tu vas apprendre dans cette vidéo :</strong></p><ul class=\"[li_&amp;]:mb-0 [li_&amp;]:mt-1 [li_&amp;]:gap-1 [&amp;:not(:last-child)_ul]:pb-1 [&amp;:not(:last-child)_ol]:pb-1 list-disc flex flex-col gap-1 pl-8 mb-3\"><li class=\"whitespace-normal break-words pl-2\">Comment créer et gérer des zones de livraison dans WooCommerce</li><li class=\"whitespace-normal break-words pl-2\">La différence entre des frais fixes et des frais calculés, et quand utiliser l'un ou l'autre</li><li class=\"whitespace-normal break-words pl-2\">Quand et comment proposer la livraison offerte sans y perdre</li><li class=\"whitespace-normal break-words pl-2\">Comment gérer la livraison pour les produits numériques et les services</li></ul><hr class=\"border-border-200 border-t-0.5 my-3 mx-1.5\"><p class=\"font-claude-response-body break-words whitespace-normal leading-[1.7]\">🚚 <strong>Pourquoi la livraison, c'est bien plus qu'un simple réglage technique</strong></p><p class=\"font-claude-response-body break-words whitespace-normal leading-[1.7]\">Tu le sais sûrement en tant qu'acheteur toi-même : rien n'est plus frustrant que d'arriver à la page de paiement et de découvrir des frais de livraison inattendus ou incompréhensibles. C'est le moment où beaucoup de clients abandonnent leur panier… et vont acheter ailleurs.</p><p class=\"font-claude-response-body break-words whitespace-normal leading-[1.7]\">À l'inverse, une livraison bien présentée, transparente et cohérente avec ton offre, c'est un vrai argument de vente. Elle rassure, elle encourage à commander, et elle évite les mauvaises surprises qui nuisent à ta réputation.</p><p class=\"font-claude-response-body break-words whitespace-normal leading-[1.7]\"><strong>La livraison, c'est une partie intégrante de l'expérience client.</strong> Et dans WooCommerce, elle est entièrement personnalisable — à condition de bien comprendre comment elle fonctionne. C'est exactement l'objectif de cette vidéo.</p><hr class=\"border-border-200 border-t-0.5 my-3 mx-1.5\"><p class=\"font-claude-response-body break-words whitespace-normal leading-[1.7]\">🛠️ <strong>Dans la vidéo, tu verras concrètement :</strong></p><p class=\"font-claude-response-body break-words whitespace-normal leading-[1.7]\"><strong>👉 Les zones de livraison : structurer ta logistique</strong> Une zone de livraison, c'est simplement une zone géographique à laquelle tu associes une ou plusieurs méthodes de livraison. Par exemple : France métropolitaine, Belgique, Europe, reste du monde… Je te montre comment créer ces zones dans WooCommerce, les organiser logiquement et y assigner les bonnes options. Une configuration propre dès le départ t'évitera beaucoup de confusion par la suite — pour toi comme pour tes clients.</p><p class=\"font-claude-response-body break-words whitespace-normal leading-[1.7]\"><strong>👉 Frais fixes vs frais calculés : choisir la bonne approche</strong> WooCommerce te permet de proposer des frais de livraison de plusieurs façons. Les <strong>frais fixes</strong>, c'est simple : un montant défini à l'avance, quel que soit le contenu du panier. Les <strong>frais calculés</strong>, c'est plus précis : ils s'adaptent en fonction du poids, du montant ou du nombre d'articles commandés. Je t'explique les avantages et les limites de chaque approche, et comment choisir celle qui correspond vraiment à ton activité et à tes marges. Pas de formule magique : la bonne solution dépend de ce que tu vends et de comment tu travailles.</p><p class=\"font-claude-response-body break-words whitespace-normal leading-[1.7]\"><strong>👉 La livraison offerte : quand l'utiliser vraiment</strong> La livraison gratuite, tout le monde en rêve côté client. Mais côté vendeur, mal utilisée, elle peut sérieusement mordre dans tes marges. Je te montre comment l'activer dans WooCommerce, comment la conditionner à un montant minimum de commande — une technique très efficace pour augmenter ton panier moyen — et comment l'utiliser comme argument commercial sans te mettre en danger financièrement. Offrir la livraison, oui, mais intelligemment. 😉</p><p class=\"font-claude-response-body break-words whitespace-normal leading-[1.7]\"><strong>👉 Le cas des produits numériques : zéro livraison à gérer</strong> Si tu vends des ebooks, des formations, des templates ou des services, tu n'as tout simplement aucune livraison physique à gérer. WooCommerce le sait, et il est possible de configurer ta boutique pour qu'aucun frais de livraison ne s'affiche pour ce type de produit. Je te montre comment faire pour que le tunnel de commande reste propre, fluide et professionnel — sans que ton client se retrouve face à une case \"livraison\" qui n'a aucun sens pour lui.</p><hr class=\"border-border-200 border-t-0.5 my-3 mx-1.5\"><p class=\"font-claude-response-body break-words whitespace-normal leading-[1.7]\">💡 <strong>Astuce Stratec Digital :</strong></p><p class=\"font-claude-response-body break-words whitespace-normal leading-[1.7]\"><strong>Sois toujours transparent sur tes frais de livraison, le plus tôt possible.</strong> N'attends pas la dernière étape du tunnel de commande pour les afficher. Un client qui découvre des frais inattendus juste avant de payer a de grandes chances d'abandonner. À l'inverse, un client qui sait dès la page produit à quoi s'en tenir commande avec bien plus de confiance et de sérénité. La transparence, c'est l'un des meilleurs outils de conversion que tu aies. ✅</p><hr class=\"border-border-200 border-t-0.5 my-3 mx-1.5\"><p class=\"font-claude-response-body break-words whitespace-normal leading-[1.7]\">🔑 <strong>Résultat après cette vidéo :</strong></p><ul class=\"[li_&amp;]:mb-0 [li_&amp;]:mt-1 [li_&amp;]:gap-1 [&amp;:not(:last-child)_ul]:pb-1 [&amp;:not(:last-child)_ol]:pb-1 list-disc flex flex-col gap-1 pl-8 mb-3\"><li class=\"whitespace-normal break-words pl-2\">Tes zones de livraison sont créées et correctement configurées</li><li class=\"whitespace-normal break-words pl-2\">Tu as choisi et paramétré la méthode de tarification adaptée à ton activité</li><li class=\"whitespace-normal break-words pl-2\">Tu sais comment utiliser la livraison offerte de façon stratégique</li><li class=\"whitespace-normal break-words pl-2\">Les produits numériques de ta boutique n'affichent aucun frais de livraison inutile</li><li class=\"whitespace-normal break-words pl-2\">Ton tunnel de commande est fluide, transparent et professionnel de bout en bout</li><li class=\"whitespace-normal break-words pl-2\">Tes clients savent exactement ce qu'ils paient avant de valider leur commande 🎉</li></ul><hr class=\"border-border-200 border-t-0.5 my-3 mx-1.5\"><p class=\"font-claude-response-body break-words whitespace-normal leading-[1.7]\">🎓 <strong>Cette vidéo fait partie de la formation complète WooCommerce by Stratec Digital.</strong> On construit ensemble une boutique en ligne sérieuse, bien configurée et prête à vendre — étape par étape, sans stress et sans jargon inutile.</p>",
            "pdfUrl": "",
            "externalLink": "",
            "duration": "08:40",
            "order_index": 2
          },
          {
            "id": "cae3c7f3-85b8-4e4c-b53a-fcfc52f630d5",
            "title": "4.3 Offrir la livraison gratuite selon le montant du panier",
            "videoUrl": "https://youtu.be/a9ZuN80VWF0",
            "notes": "Création d’un code promo ou règle de franco de port à partir de 50 €.",
            "pdfUrl": "",
            "externalLink": "",
            "duration": "06:50",
            "order_index": 3
          }
        ],
        "order_index": 4
      },
      {
        "id": "99fe03f4-ecbe-409b-a638-bbc885c6d4dd",
        "title": "Design et expérience client",
        "lessons": [
          {
            "id": "2a54e8bd-6f5a-4964-9fb5-fcfc0f17a7a1",
            "title": "Personnaliser la boutique",
            "videoUrl": "https://youtu.be/mfcxgN4Whvg",
            "notes": "<h3>🎥 9️⃣ Personnaliser sa boutique WooCommerce – Avoir une boutique cohérente avec son site 🎨</h3><p class=\"font-claude-response-body break-words whitespace-normal leading-[1.7]\">Tu as configuré tes produits, tes paiements, ta livraison…</p><p class=\"font-claude-response-body break-words whitespace-normal leading-[1.7]\">Mais quand tu regardes ta boutique, tu as cette impression que quelque chose cloche. Les couleurs ne correspondent pas à ton identité, les textes sont génériques, les boutons ne ressemblent à rien… <strong>Ta boutique fonctionne, mais elle ne te ressemble pas encore.</strong></p><p class=\"font-claude-response-body break-words whitespace-normal leading-[1.7]\">Et ça, c'est un problème. Parce qu'une boutique qui manque de cohérence visuelle avec le reste de ton site, c'est une boutique qui inspire moins confiance — et qui convertit moins. Dans cette vidéo, je t'explique comment personnaliser ta boutique WooCommerce pour qu'elle soit parfaitement alignée avec ton image, ton univers et ton identité de marque. Pas besoin d'être graphiste ni développeur : je te montre les bons réglages, les bons outils, et les bonnes pratiques pour un résultat propre et professionnel. 😎</p><hr class=\"border-border-200 border-t-0.5 my-3 mx-1.5\"><p class=\"font-claude-response-body break-words whitespace-normal leading-[1.7]\">🎯 <strong>Ce que tu vas apprendre dans cette vidéo :</strong></p><ul class=\"[li_&amp;]:mb-0 [li_&amp;]:mt-1 [li_&amp;]:gap-1 [&amp;:not(:last-child)_ul]:pb-1 [&amp;:not(:last-child)_ol]:pb-1 list-disc flex flex-col gap-1 pl-8 mb-3\"><li class=\"whitespace-normal break-words pl-2\">Comment personnaliser ta page boutique pour qu'elle soit claire et attrayante</li><li class=\"whitespace-normal break-words pl-2\">Comment optimiser la page produit pour mieux convertir tes visiteurs</li><li class=\"whitespace-normal break-words pl-2\">Comment modifier les boutons, textes et messages de WooCommerce</li><li class=\"whitespace-normal break-words pl-2\">Comment choisir un thème vraiment compatible avec WooCommerce</li><li class=\"whitespace-normal break-words pl-2\">Quels plugins utiliser pour améliorer l'affichage de ta boutique sans coder</li></ul><hr class=\"border-border-200 border-t-0.5 my-3 mx-1.5\"><p class=\"font-claude-response-body break-words whitespace-normal leading-[1.7]\">🎨 <strong>Pourquoi la cohérence visuelle, c'est une question de confiance</strong></p><p class=\"font-claude-response-body break-words whitespace-normal leading-[1.7]\">Mets-toi une seconde dans la peau de ton visiteur. Il navigue sur ton site, il apprécie ton univers, il clique sur ta boutique… et là, il se retrouve face à une page qui semble venir d'un autre site. Des boutons avec des textes par défaut en anglais, des couleurs qui tranchent avec le reste, une mise en page froide et générique.</p><p class=\"font-claude-response-body break-words whitespace-normal leading-[1.7]\">Le message inconscient que ça envoie ? <strong>\"Ce site n'est pas vraiment fini.\"</strong> Et un site qui semble inachevé, c'est un site sur lequel on n'achète pas.</p><p class=\"font-claude-response-body break-words whitespace-normal leading-[1.7]\">À l'inverse, une boutique cohérente avec ton identité visuelle, c'est une boutique qui inspire confiance dès la première seconde. Ton client se sent au bon endroit, il reconnaît ta marque, et il avance naturellement vers l'achat. La personnalisation, ce n'est pas juste une question d'esthétique — c'est une question de performance. 🚀</p><hr class=\"border-border-200 border-t-0.5 my-3 mx-1.5\"><p class=\"font-claude-response-body break-words whitespace-normal leading-[1.7]\">🛠️ <strong>Dans la vidéo, tu verras concrètement :</strong></p><p class=\"font-claude-response-body break-words whitespace-normal leading-[1.7]\"><strong>👉 La page boutique : organiser et embellir ton catalogue</strong> La page boutique, c'est la vitrine principale de tes produits. C'est souvent la première page que visitent tes clients lorsqu'ils arrivent sur ta boutique. Je te montre comment la configurer dans WooCommerce, comment choisir le nombre de produits affichés, comment organiser les colonnes et les lignes, et comment lui donner un aspect propre et engageant qui donne envie de rester et d'explorer. Une bonne page boutique, c'est un client qui scrolle et qui clique. ✅</p><p class=\"font-claude-response-body break-words whitespace-normal leading-[1.7]\"><strong>👉 La page produit : optimiser pour convertir</strong> La page produit, c'est là où la décision d'achat se prend. Chaque élément compte : la place de l'image, la lisibilité du prix, la position du bouton d'ajout au panier, les informations complémentaires… Je te montre comment organiser et personnaliser cette page pour qu'elle soit claire, rassurante et efficace. Une page produit bien construite, c'est directement plus de ventes.</p><p class=\"font-claude-response-body break-words whitespace-normal leading-[1.7]\"><strong>👉 Boutons, textes et messages : parler le langage de ta marque</strong> Par défaut, WooCommerce affiche des textes génériques — parfois même en anglais — qui ne correspondent pas forcément à ton ton, à ta clientèle ou à ta façon de communiquer. \"Add to cart\", \"Checkout\", \"No products found\"… Je te montre comment modifier tous ces textes facilement pour qu'ils soient en français, cohérents avec ta marque et adaptés à ton audience. Un détail qui change énormément la perception de ta boutique. 😉</p><p class=\"font-claude-response-body break-words whitespace-normal leading-[1.7]\"><strong>👉 Choisir un thème vraiment compatible WooCommerce</strong> Tous les thèmes WordPress ne sont pas créés égaux face à WooCommerce. Certains sont magnifiques sur les pages classiques mais deviennent catastrophiques sur les pages boutique et produit. Je t'explique ce qu'il faut vérifier avant de choisir ou de garder un thème, quels sont les critères de compatibilité importants, et quelques recommandations concrètes de thèmes qui fonctionnent vraiment bien avec WooCommerce — gratuits comme premium. Choisir le bon thème dès le départ, c'est s'éviter beaucoup de problèmes d'affichage par la suite.</p><p class=\"font-claude-response-body break-words whitespace-normal leading-[1.7]\"><strong>👉 Les plugins utiles pour l'affichage</strong> WooCommerce de base, c'est bien. WooCommerce avec les bons plugins d'affichage, c'est beaucoup mieux. Je te présente une sélection de plugins soigneusement choisis pour améliorer l'apparence et l'ergonomie de ta boutique sans alourdir ton site : galeries produits améliorées, affichage des avis clients, mise en avant des promotions, filtres de recherche produits… Des outils concrets, testés et recommandés par Stratec Digital pour booster ton expérience utilisateur sans te noyer dans les options inutiles.</p><hr class=\"border-border-200 border-t-0.5 my-3 mx-1.5\"><p class=\"font-claude-response-body break-words whitespace-normal leading-[1.7]\">💡 <strong>Astuce Stratec Digital :</strong></p><p class=\"font-claude-response-body break-words whitespace-normal leading-[1.7]\"><strong>La cohérence prime toujours sur la complexité.</strong> Inutile de multiplier les couleurs, les polices ou les effets visuels pour paraître professionnel. Une boutique propre, avec deux ou trois couleurs bien choisies, des textes clairs et une mise en page aérée, convaincra toujours mieux qu'une boutique surchargée. Moins c'est plus — en design comme en vente. ✅</p><hr class=\"border-border-200 border-t-0.5 my-3 mx-1.5\"><p class=\"font-claude-response-body break-words whitespace-normal leading-[1.7]\">🔑 <strong>Résultat après cette vidéo :</strong></p><ul class=\"[li_&amp;]:mb-0 [li_&amp;]:mt-1 [li_&amp;]:gap-1 [&amp;:not(:last-child)_ul]:pb-1 [&amp;:not(:last-child)_ol]:pb-1 list-disc flex flex-col gap-1 pl-8 mb-3\"><li class=\"whitespace-normal break-words pl-2\">Ta page boutique est organisée, claire et cohérente avec l'identité de ton site</li><li class=\"whitespace-normal break-words pl-2\">Ta page produit est optimisée pour guider tes visiteurs vers l'achat</li><li class=\"whitespace-normal break-words pl-2\">Les boutons, textes et messages de WooCommerce parlent le langage de ta marque</li><li class=\"whitespace-normal break-words pl-2\">Ton thème est bien compatible avec WooCommerce et ne crée aucun problème d'affichage</li><li class=\"whitespace-normal break-words pl-2\">Tu as installé les bons plugins pour améliorer l'expérience visuelle de ta boutique</li><li class=\"whitespace-normal break-words pl-2\">Ta boutique inspire confiance dès la première seconde 🎉</li></ul><hr class=\"border-border-200 border-t-0.5 my-3 mx-1.5\"><p class=\"font-claude-response-body break-words whitespace-normal leading-[1.7]\">🎓 <strong>Cette vidéo fait partie de la formation complète WooCommerce by Stratec Digital.</strong> On construit ensemble une boutique en ligne cohérente, professionnelle et prête à vendre — étape par étape, sans stress et sans jargon inutile.</p>",
            "pdfUrl": "",
            "externalLink": "",
            "duration": "08:15",
            "order_index": 1
          },
          {
            "id": "08d46710-109d-4b3e-b48d-a3c1cc53ae42",
            "title": "Rassurer ses clients",
            "videoUrl": "https://youtu.be/g2d0RZX3xvM",
            "notes": "<h3>🎥 🔟 Rassurer ses clients WooCommerce – Donner confiance pour acheter 🔒</h3><p class=\"font-claude-response-body break-words whitespace-normal leading-[1.7]\">Ton site est beau, tes produits sont bien présentés, ta boutique est configurée…</p><p class=\"font-claude-response-body break-words whitespace-normal leading-[1.7]\">Mais est-ce que ton client se sent vraiment en confiance pour sortir sa carte bancaire ?</p><p class=\"font-claude-response-body break-words whitespace-normal leading-[1.7]\">Sur internet, la confiance ne se donne pas automatiquement — elle se construit. Et ce sont souvent les petits détails légaux et humains qui font la différence entre un visiteur qui achète et un visiteur qui repart. Dans cette vidéo, je te montre comment rassurer tes clients efficacement pour lever leurs dernières hésitations. 😎</p><hr class=\"border-border-200 border-t-0.5 my-3 mx-1.5\"><p class=\"font-claude-response-body break-words whitespace-normal leading-[1.7]\">🎯 <strong>Ce que tu vas apprendre :</strong></p><ul class=\"[li_&amp;]:mb-0 [li_&amp;]:mt-1 [li_&amp;]:gap-1 [&amp;:not(:last-child)_ul]:pb-1 [&amp;:not(:last-child)_ol]:pb-1 list-disc flex flex-col gap-1 pl-8 mb-3\"><li class=\"whitespace-normal break-words pl-2\">Quelles mentions légales et CGV mettre en place</li><li class=\"whitespace-normal break-words pl-2\">Comment rédiger une politique de retour claire et rassurante</li><li class=\"whitespace-normal break-words pl-2\">Où et comment placer des messages de réassurance</li><li class=\"whitespace-normal break-words pl-2\">Pourquoi un contact visible change tout</li><li class=\"whitespace-normal break-words pl-2\">Comment intégrer les avis clients dans ta boutique</li></ul><hr class=\"border-border-200 border-t-0.5 my-3 mx-1.5\"><p class=\"font-claude-response-body break-words whitespace-normal leading-[1.7]\">🛠️ <strong>Au programme :</strong></p><p class=\"font-claude-response-body break-words whitespace-normal leading-[1.7]\"><strong>Mentions légales &amp; CGV</strong> → Ce n'est pas qu'une obligation légale, c'est aussi un signal de sérieux. Je te montre ce qu'elles doivent contenir et comment les intégrer proprement dans WooCommerce pour être en règle et inspirer confiance.</p><p>Tu peux créer toutes tes pages juridiques via ce site spécialisé : <a href=\"https://www.rocketlawyer.com/fr/fr\">Rocket lawyer</a></p><p>Pense aussi au médiateur de la consommation si tu veux à des particuliers ! <a href=\"https://www.mediateur-consommation-smp.fr/\">Je t'en conseille un agréé, spécial pour les petites entreprises : SMP</a></p><p class=\"font-claude-response-body break-words whitespace-normal leading-[1.7]\"><strong>Politique de retour</strong> → Un client qui sait qu'il peut se rétracter achète bien plus facilement. Je t'explique comment rédiger une politique de retour simple, honnête et rassurante — et comment la rendre visible au bon endroit dans ton tunnel de commande.</p><p class=\"font-claude-response-body break-words whitespace-normal leading-[1.7]\"><strong>Messages rassurants</strong> → Quelques mots bien placés sur ta page produit ou ta page panier peuvent suffire à lever une hésitation. Paiement sécurisé, livraison fiable, satisfait ou remboursé… Je te montre comment et où les intégrer pour un impact maximal.</p><p class=\"font-claude-response-body break-words whitespace-normal leading-[1.7]\"><strong>Contact visible</strong> → Rien n'est plus rassurant pour un acheteur que de savoir qu'il peut joindre un vrai humain en cas de problème. Un e-mail, un formulaire, un numéro de téléphone… Je t'explique comment rendre ton contact facilement accessible et pourquoi c'est un élément clé de la conversion.</p><p class=\"font-claude-response-body break-words whitespace-normal leading-[1.7]\"><strong>Avis clients</strong> → Les avis, c'est la preuve sociale par excellence. Je te donne les bases pour commencer à les collecter et les afficher sur ta boutique — même quand tu pars de zéro. Un produit avec des avis, c'est un produit qui rassure et qui vend mieux.</p><hr class=\"border-border-200 border-t-0.5 my-3 mx-1.5\"><p class=\"font-claude-response-body break-words whitespace-normal leading-[1.7]\">💡 <strong>Astuce Stratec Digital :</strong> Ton client ne te connaît pas encore. Chaque élément de réassurance est un message qui lui dit : <em>\"Tu peux avoir confiance, tu es entre de bonnes mains.\"</em> Ne laisse jamais un doute s'installer sans lui apporter une réponse. ✅</p><hr class=\"border-border-200 border-t-0.5 my-3 mx-1.5\"><p class=\"font-claude-response-body break-words whitespace-normal leading-[1.7]\">🔑 <strong>Résultat après cette vidéo :</strong></p><ul class=\"[li_&amp;]:mb-0 [li_&amp;]:mt-1 [li_&amp;]:gap-1 [&amp;:not(:last-child)_ul]:pb-1 [&amp;:not(:last-child)_ol]:pb-1 list-disc flex flex-col gap-1 pl-8 mb-3\"><li class=\"whitespace-normal break-words pl-2\">Tes mentions légales et CGV sont en place et conformes</li><li class=\"whitespace-normal break-words pl-2\">Ta politique de retour est claire et visible</li><li class=\"whitespace-normal break-words pl-2\">Des messages rassurants sont intégrés aux bons endroits</li><li class=\"whitespace-normal break-words pl-2\">Ton contact est facilement accessible depuis toute ta boutique</li><li class=\"whitespace-normal break-words pl-2\">Les bases des avis clients sont en place pour booster ta crédibilité 🎉</li></ul><hr class=\"border-border-200 border-t-0.5 my-3 mx-1.5\"><p class=\"font-claude-response-body break-words whitespace-normal leading-[1.7]\">🎓 Cette vidéo fait partie de la <strong>formation complète WooCommerce by Stratec Digital</strong> — une boutique professionnelle, étape par étape, sans stress.</p><p class=\"font-claude-response-body break-words whitespace-pre-wrap leading-[1.7]\">&nbsp;</p>",
            "pdfUrl": "",
            "externalLink": "",
            "duration": "10:10",
            "order_index": 2
          },
          {
            "id": "de059e2d-586a-4961-8d45-6980232b20eb",
            "title": "5.3 Checklist finale d’ouverture officielle de votre e-commerce",
            "videoUrl": "https://youtu.be/a9ZuN80VWF0",
            "notes": "Dernière vérification avant la communication officielle sur tes réseaux et newsletter.",
            "pdfUrl": "",
            "externalLink": "",
            "duration": "09:30",
            "order_index": 3
          }
        ],
        "order_index": 5
      }
    ]
  },
  {
    "id": "11111111-1111-4111-a111-111111111111",
    "slug": "creer-sa-vitrine-wordpress",
    "title": "Formation : créer sa vitrine en ligne avec WordPress",
    "description": "Le cursus vidéo pas-à-pas pour concevoir un site vitrine professionnel de A à Z avec WordPress et Elementor sans coder.",
    "duration": "3h30",
    "level": "Débutant",
    "prerequisites": "Aucune connaissance préalable en programmation requise. Un ordinateur et un accès Internet suffisent.",
    "price": 199,
    "originalPrice": 249,
    "image": "/images/products/formation-wordpress.webp",
    "status": "Publié",
    "category": "formation",
    "congratulationsMsg": "Bravo ! Tu as terminé l’intégralité de la Formation Site Vitrine WordPress. Ton site est désormais prêt et en ligne !",
    "modules": [
      {
        "id": "bc671728-fdce-4363-85cf-71d0528100c2",
        "title": "Préparer son projet",
        "lessons": [
          {
            "id": "82108731-6193-42c5-937e-91614ccdf906",
            "title": "Trouver le bon nom pour son site",
            "videoUrl": "https://youtu.be/Zb4ZKpTd0_8",
            "notes": "<p>Tu veux créer ton site WordPress mais tu bloques sur <strong>le nom de ton site</strong> ?<br>Nom de domaine, nom de marque, nom SEO… 🤯<br>Dans cette vidéo, je t’explique <strong>comment choisir un nom simple, efficace et cohérent</strong>, même si tu débutes totalement.</p><p>👉 Pas besoin d’être expert en marketing : on va à l’essentiel, sans prise de tête.</p><hr><h3>🎯 Ce que tu vas apprendre dans cette vidéo :</h3><ul><li><p>La différence entre <strong>nom de site, nom de domaine et nom de marque</strong></p></li><li><p>Les <strong>erreurs classiques</strong> à éviter quand on débute</p></li><li><p>Comment choisir un nom :</p><ul><li><p>facile à retenir</p></li><li><p>facile à écrire</p></li><li><p>cohérent avec ton activité</p></li></ul></li><li><p>Faut-il mettre ton prénom ? ton métier ? ta ville ?</p></li><li><p>Comment vérifier rapidement si ton nom est disponible</p></li></ul><hr><h3>🔗 Ressources utiles :</h3><p>✔️ Outils pour vérifier la disponibilité d’un nom de domaine<br>✔️ Conseils pratiques pour un nom compatible SEO<br>✔️ Méthode simple pour trancher sans stress</p><hr><p>💡 <strong>Astuce importante</strong> :<br>Un bon nom de site n’a pas besoin d’être parfait.<br>Il doit surtout être <strong>compréhensible, crédible et aligné avec ton activité</strong>.</p>",
            "pdfUrl": "",
            "externalLink": "",
            "duration": "06:12",
            "order_index": 1
          },
          {
            "id": "202afb84-bcff-48ab-8a22-26be120eb9df",
            "title": "Acheter son nom de domaine et son hébergement",
            "videoUrl": "https://youtu.be/uJF-70yHiFI",
            "notes": "<p>Tu as trouvé le nom de ton site ?<br>Parfait. Maintenant, place à <strong>l’étape la plus redoutée quand on débute</strong> :<br>👉 acheter son <strong>nom de domaine</strong> et son <strong>hébergement web</strong>.</p><p>Bonne nouvelle : ce n’est <strong>ni compliqué, ni réservé aux experts</strong>.</p><h3>🎯 Ce que tu vas apprendre dans cette vidéo :</h3><ul><li><p>À quoi sert <strong>vraiment</strong> un hébergement web</p></li><li><p>La différence entre <strong>nom de domaine</strong> et <strong>hébergement</strong></p></li><li><p>Comment choisir un hébergeur adapté à <strong>WordPress</strong></p></li><li><p>Les critères importants :</p><ul><li><p>fiabilité</p></li><li><p>simplicité</p></li><li><p>support client</p></li><li><p>prix raisonnable</p></li></ul></li><li><p>Les pièges classiques à éviter lors de l’achat</p></li><li><p>Une <strong>démonstration concrète</strong> chez des hébergeurs populaires (OVH, O2Switch, Ionos…)</p></li></ul><hr><h3>🧠 Pourquoi cette étape est essentielle</h3><p>Ton hébergement, c’est la <strong>maison de ton site</strong> 🏠<br>S’il est mal choisi :</p><ul><li><p>ton site peut être lent</p></li><li><p>instable</p></li><li><p>compliqué à gérer</p></li><li><p>difficile à sécuriser</p></li></ul><p>👉 L’objectif ici :<br><strong>partir sur une base saine</strong>, simple et évolutive, sans te suréquiper dès le départ.</p><hr><p>Pour ceux qui serait tenter par l<strong>'offre d'O2Switch</strong>, voici le lien&nbsp; : <a href=\"https://clients.o2switch.fr/offre-hebergement-unique?sc=e4be20977f\">https://clients.o2switch.fr/offre-hebergement-unique?sc=e4be20977f</a></p><p>&nbsp;</p>",
            "pdfUrl": "",
            "externalLink": "",
            "duration": "10:30",
            "order_index": 2
          },
          {
            "id": "7fdca9c7-2013-432a-ad28-29a14bb56462",
            "title": "Bienvenue dans l'aventure !",
            "videoUrl": "https://youtu.be/eT1oRbogGvc",
            "notes": "<p className=\"mb-3 leading-relaxed text-[#4a3b35]\">Créer un site internet peut sembler compliqué, technique, voire stressant…<br /><strong>Bonne nouvelle : ça ne doit pas l’être.</strong></p>\n\n<p className=\"mb-3 leading-relaxed text-[#4a3b35]\">Dans cette première vidéo, je te souhaite la bienvenue dans cette série de tutoriels dédiée à la création d’un site WordPress, pensée spécialement pour les débutants, les indépendants, les artisans, les créateurs et les entrepreneurs qui veulent un site simple, professionnel et efficace, sans jargon inutile ni prise de tête.</p>\n\n<p className=\"mb-3 leading-relaxed text-[#4a3b35]\">Je suis Stéphanie, fondatrice de <strong>Stratec Digital</strong>, et depuis plusieurs années j’accompagne des professionnels qui veulent se digitaliser à leur rythme, avec des outils adaptés et une méthode claire.<br />Cette série de vidéos est née d’un constat très simple :</p>\n\n<ul className=\"list-disc list-inside space-y-1 my-3 pl-2 text-[#4a3b35]\">\n  <li>beaucoup de personnes veulent créer leur site WordPress seules,</li>\n  <li>mais se sentent vite perdues, découragées ou bloquées par la technique.</li>\n</ul>\n\n<p className=\"mb-4 leading-relaxed font-bold text-[#18757d]\">Ici, on fait exactement l’inverse.</p>\n\n<h3 className=\"text-base font-extrabold text-[#18757d] mt-6 mb-2\">🎯 Objectif de cette formation WordPress :</h3>\n<p className=\"mb-2 text-[#4a3b35]\">Te guider pas à pas, dans le bon ordre, pour créer un site :</p>\n<ul className=\"list-disc list-inside space-y-1 my-3 pl-2 text-[#4a3b35]\">\n  <li>clair</li>\n  <li>fonctionnel</li>\n  <li>sécurisé</li>\n  <li>agréable pour tes visiteurs</li>\n  <li>et utile pour ton activité</li>\n</ul>\n\n<p className=\"my-3 font-semibold text-[#18757d]\">Sans pression. Sans perfectionnisme. Sans y passer tes nuits.</p>\n\n<h3 className=\"text-base font-extrabold text-[#18757d] mt-6 mb-2\">📌 Ce que tu vas apprendre dans cette série de vidéos</h3>\n<p className=\"mb-2 text-[#4a3b35]\">Tout au long de ces tutoriels WordPress, tu vas apprendre à :</p>\n<ul className=\"list-disc list-inside space-y-1 my-3 pl-2 text-[#4a3b35]\">\n  <li>Préparer ton projet web (nom de domaine, hébergement, email pro)</li>\n  <li>Installer WordPress facilement, même si tu n’y connais rien</li>\n  <li>Sécuriser ton site dès le départ</li>\n  <li>Choisir un thème adapté à ton activité</li>\n  <li>Installer uniquement les plugins vraiment utiles</li>\n  <li>Créer tes pages essentielles (Accueil, À propos, Contact…)</li>\n  <li>Organiser ton menu de navigation</li>\n  <li>Améliorer l’expérience utilisateur (UX)</li>\n  <li>Paramétrer correctement les URL et le HTTPS</li>\n  <li>Mettre en place des sauvegardes automatiques</li>\n  <li>Tester ton site avant le lancement</li>\n  <li>Comprendre les bases du référencement naturel (SEO)</li>\n  <li>Mettre ton site en ligne en toute sérénité</li>\n</ul>\n\n<p className=\"my-3 font-bold text-[#18757d]\">🎬 Chaque vidéo est courte, ciblée, et va droit au but.</p>\n\n<h3 className=\"text-base font-extrabold text-[#18757d] mt-6 mb-2\">💡 Une méthode “tranquille mais efficace”</h3>\n<p className=\"mb-2 text-[#4a3b35]\">Cette formation WordPress suit une philosophie simple : faire les choses dans le bon ordre, sans surcharger ton site ni ton cerveau.</p>\n<p className=\"mb-1 text-[#4a3b35] font-medium\">Pas besoin :</p>\n<ul className=\"list-disc list-inside space-y-1 my-3 pl-2 text-[#4a3b35]\">\n  <li>d’être développeur</li>\n  <li>d’avoir un budget énorme</li>\n  <li>de maîtriser le webmarketing</li>\n  <li>ni de passer 6 mois sur ton site</li>\n</ul>\n<p className=\"my-3 text-[#4a3b35]\">Tu avances étape par étape, tu appliques, et tu construis un site qui te ressemble.</p>\n\n<h3 className=\"text-base font-extrabold text-[#18757d] mt-6 mb-2\">👉 À qui s’adresse cette série de tutos WordPress ?</h3>\n<p className=\"mb-2 text-[#4a3b35]\">Cette formation est faite pour toi si tu es :</p>\n<ul className=\"list-disc list-inside space-y-1 my-3 pl-2 text-[#4a3b35]\">\n  <li>artisan</li>\n  <li>indépendant</li>\n  <li>créateur</li>\n  <li>thérapeute</li>\n  <li>consultant</li>\n  <li>entrepreneur débutant</li>\n  <li>ou simplement quelqu’un qui veut créer son site WordPress seul</li>\n</ul>\n<p className=\"mb-1 text-[#4a3b35] font-medium\">Même si :</p>\n<ul className=\"list-disc list-inside space-y-1 my-3 pl-2 text-[#4a3b35]\">\n  <li>tu débutes totalement</li>\n  <li>tu n’as jamais touché à WordPress</li>\n  <li>tu as déjà essayé et abandonné</li>\n</ul>\n\n<h3 className=\"text-base font-extrabold text-[#18757d] mt-6 mb-2\">🎬 Comment utiliser ces vidéos</h3>\n<ul className=\"list-none space-y-1.5 my-3 pl-1 text-[#4a3b35]\">\n  <li>▶️ <strong>Regarde les vidéos dans l’ordre</strong></li>\n  <li>🛠️ <strong>Applique au fur et à mesure</strong></li>\n  <li>⏸️ <strong>Mets pause si besoin</strong></li>\n  <li>🔄 <strong>Reviens quand tu veux</strong></li>\n</ul>\n<p className=\"my-3 text-[#4a3b35]\">Chaque vidéo correspond à une étape précise de la création de ton site WordPress.</p>\n\n<h3 className=\"text-base font-extrabold text-[#18757d] mt-6 mb-2\">🚀 Et maintenant ?</h3>\n<p className=\"mb-2 text-[#4a3b35]\">Dans la prochaine vidéo, on commence concrètement avec une étape clé :<br /><strong>Trouver le bon nom pour son site et son nom de domaine, sans se tromper.</strong></p>\n<p className=\"mt-4 font-bold text-[#18757d]\">Abonne-toi à la chaîne pour ne rien manquer, et surtout… avance à ton rythme. Ton site n’a pas besoin d’être parfait pour être efficace.</p>",
            "pdfUrl": "",
            "externalLink": "",
            "duration": "08:45",
            "order_index": 3
          }
        ],
        "order_index": 1
      },
      {
        "id": "d94a83f2-930d-40b4-aac6-aa8ddc20e251",
        "title": "Installation de WordPress",
        "lessons": [
          {
            "id": "dad64521-fb26-4788-a680-3c0ae06a0c1a",
            "title": "Première connexion et réglages essentiels",
            "videoUrl": "https://youtu.be/-JUL4C1W69g",
            "notes": "<h3>🎥 Vidéo 5 – Première connexion et réglages essentiels sur WordPress</h3><p>Ton site WordPress est installé ✅<br>👉 maintenant, il est temps de <strong>prendre en main ton tableau de bord</strong> et de faire les <strong>réglages indispensables dès le départ</strong>.</p><p>Dans cette vidéo, je t’accompagne pas à pas lors de ta <strong>première connexion à WordPress</strong>, pour que ton site soit propre, cohérent et prêt à être construit sur de bonnes bases.</p><hr><h3>🎯 Ce que tu vas apprendre dans cette vidéo :</h3><ul><li><p>Comment te connecter à l’interface d’administration WordPress</p></li><li><p>Comprendre les <strong>éléments clés du tableau de bord</strong></p></li><li><p>Modifier le <strong>titre du site</strong> et le <strong>slogan</strong></p></li><li><p>Choisir la <strong>langue</strong> de WordPress</p></li><li><p>Régler le <strong>fuseau horaire</strong> (très important pour les publications)</p></li><li><p>Paramétrer le <strong>format de date et d’heure</strong></p></li><li><p>Vérifier les premiers réglages essentiels avant d’aller plus loin</p></li></ul><hr><h3>🧠 Pourquoi ces réglages sont importants</h3><p>Ces paramètres semblent simples…<br>mais mal configurés, ils peuvent entraîner :</p><ul><li><p>des dates incorrectes sur ton site</p></li><li><p>des publications mal programmées</p></li><li><p>une image peu professionnelle</p></li><li><p>des soucis pour le SEO plus tard</p></li></ul><p>👉 L’objectif ici : <strong>mettre ton site WordPress au propre dès le départ</strong>.</p><hr><h3>🛠️ Dans la vidéo, tu verras concrètement :</h3><ul><li><p>Où cliquer pour accéder aux réglages généraux</p></li><li><p>À quoi servent les principales rubriques du menu WordPress</p></li><li><p>Comment éviter les erreurs classiques des débutants</p></li><li><p>Comment repartir sur une base saine avant d’installer thème et plugins</p></li></ul><hr><p>💡 <strong>Conseil Stratec Digital</strong><br>Un site WordPress bien réglé dès le début,<br>c’est un site <strong>plus simple à gérer</strong>, <strong>plus crédible</strong> et <strong>plus efficace</strong> sur le long terme.</p>",
            "pdfUrl": "",
            "externalLink": "",
            "duration": "12:40",
            "order_index": 1
          },
          {
            "id": "e4bbda0a-e050-4c74-9116-1973831ad37b",
            "title": "2.3 Supprimer les contenus et plugins inutiles de démonstration",
            "videoUrl": "https://youtu.be/Zb4ZKpTd0_8",
            "notes": "Fais le ménage initial pour repartir sur une installation saine et légère.",
            "pdfUrl": "",
            "externalLink": "",
            "duration": "05:20",
            "order_index": 2
          },
          {
            "id": "9e916a91-6ccb-405a-bd92-a86f396800b7",
            "title": "2.4 Réglages généraux, fuseau horaire et permaliens SEO",
            "videoUrl": "https://youtu.be/Zb4ZKpTd0_8",
            "notes": "Configure la structure des liens permanents en \"Titre de l’article\" pour maximiser le référencement Google.",
            "pdfUrl": "",
            "externalLink": "",
            "duration": "09:10",
            "order_index": 3
          },
          {
            "id": "a4878463-05ea-4e19-bb6d-81a13759b1cd",
            "title": "Installer WordPress en 5 minutes",
            "videoUrl": "https://youtu.be/knos7u3RxFc",
            "notes": "<h3>🎥 Vidéo 4 – Installer WordPress en 5 minutes (même quand on débute)</h3><p>Tu as ton nom de domaine, ton hébergement…<br>👉 il est temps de <strong>donner vie à ton site</strong> en installant WordPress.</p><p>Bonne nouvelle : <strong>installer WordPress n’a rien de compliqué</strong>, même si tu n’es pas développeur·se.<br>Dans cette vidéo, je te montre <strong>comment installer WordPress en moins de 5 minutes</strong>, sans stress et sans jargon technique.</p><p>Place à la pratique !<br>Je t’explique une méthode simple pour installer WordPress : via l’auto-installateur de ton hébergeur<br>À la fin de la vidéo, ton site sera en ligne, prêt à être personnalisé.</p><hr><h3>🧠 Pourquoi cette étape est clé</h3><p>WordPress est le <strong>socle de ton site</strong>.<br>Une installation propre dès le départ, c’est :</p><ul><li><p>moins de bugs</p></li><li><p>moins de problèmes techniques</p></li><li><p>une base saine pour la suite (thème, plugins, contenus…)</p></li></ul><p>👉 L’objectif ici : <strong>installer WordPress simplement, correctement et sans te compliquer la vie</strong>.</p><h3>🛠️ Dans la vidéo, tu verras :</h3><ul><li><p>Où cliquer exactement chez ton hébergeur</p></li><li><p>À quoi correspondent les champs demandés</p></li><li><p>Comment choisir un identifiant et un mot de passe sécurisés</p></li><li><p>Comment vérifier que ton site fonctionne correctement après l’installation</p></li></ul><hr><p>💡 <strong>Conseil Stratec Digital</strong><br>Pas besoin d’être expert·e pour créer un site pro.<br>WordPress est justement fait pour que <strong>tu puisses te concentrer sur ton activité</strong>, pas sur la technique.</p>",
            "pdfUrl": "",
            "externalLink": "",
            "duration": "07:15",
            "order_index": 4
          }
        ],
        "order_index": 2
      },
      {
        "id": "447ea7f0-f86c-4a21-a61c-671e05681a43",
        "title": "Sécuriser et mettre en place la base",
        "lessons": [
          {
            "id": "453d8ede-752b-45cf-b5e0-86efd6c51fe7",
            "title": "Installer un thème WordPress adapté à ton projet",
            "videoUrl": "https://youtu.be/8vYFxnxBH84",
            "notes": "<h3>🎥 Vidéo 7 – Installer un thème WordPress adapté à ton projet</h3><p>Le thème WordPress, c’est <strong>l’apparence de ton site</strong>, mais aussi une partie de son confort d’utilisation, de sa crédibilité et même de ses performances.</p><p>Dans cette vidéo, je t’explique <strong>comment choisir et installer un thème WordPress adapté à ton projet</strong>, sans te perdre dans les milliers d’options disponibles et sans faire d’erreurs difficiles à corriger plus tard.</p><hr><h3>🎯 Ce que tu vas apprendre dans cette vidéo :</h3><ul><li><p>À quoi sert réellement un thème WordPress</p></li><li><p>La différence entre <strong>thème gratuit</strong> et <strong>thème payant</strong></p></li><li><p>Où trouver des thèmes fiables et bien conçus</p></li><li><p>Comment installer un thème WordPress pas à pas</p></li><li><p>Les premiers réglages de personnalisation essentiels</p></li><li><p>Les erreurs fréquentes à éviter quand on débute</p></li></ul><hr><h3>🧠 Pourquoi le choix du thème est stratégique</h3><p>Un mauvais thème peut :</p><ul><li><p>ralentir ton site</p></li><li><p>compliquer les réglages</p></li><li><p>te bloquer dans l’évolution de ton projet</p></li><li><p>nuire à ton image professionnelle</p></li></ul><p>👉 L’objectif de cette vidéo : <strong>choisir un thème simple, propre et évolutif</strong>, qui s’adapte à ton activité, et non l’inverse.</p><hr><h3>🛠️ Dans la vidéo, tu verras concrètement :</h3><ul><li><p>Où chercher un thème directement depuis WordPress</p></li><li><p>Comment vérifier si un thème est bien maintenu et compatible</p></li><li><p>Comment l’installer et l’activer en quelques clics</p></li><li><p>Comment faire une <strong>première personnalisation sans tout casser</strong></p></li><li><p>Pourquoi il vaut mieux commencer simple</p></li></ul><p>💡 Conseil Stratec Digital :</p><blockquote><p>Un bon thème ne doit pas tout faire. Il doit surtout te laisser <strong>libre de créer ton contenu</strong>, sans t’imposer des contraintes inutiles.</p></blockquote><hr><h3>🔑 Résultat après cette vidéo :</h3><ul><li><p>Ton site a une base visuelle propre</p></li><li><p>Ton thème est installé correctement</p></li><li><p>Tu sais ce que tu peux modifier… et ce qu’il vaut mieux éviter</p></li><li><p>Tu es prêt·e à passer à l’étape suivante : les plugins essentiels</p></li></ul><hr><p>&nbsp;</p>",
            "pdfUrl": "",
            "externalLink": "",
            "duration": "14:20",
            "order_index": 1
          },
          {
            "id": "8723ad89-8f2f-4e64-ac22-d6425018eba1",
            "title": "Sécuriser son site dès le départ",
            "videoUrl": "https://youtu.be/7qgr0brwDCM",
            "notes": "<p>Ton site WordPress est installé et prêt à accueillir ton contenu… mais avant de te lancer, <strong>la sécurité est essentielle</strong>. 🔒</p><p>Dans cette vidéo, je te montre comment <strong>sécuriser ton site WordPress dès le départ</strong>, pour éviter les problèmes techniques, les piratages ou la perte de données, même si tu es débutant·e et que tu n’y connais rien en technique.</p><hr><h3>🎯 Ce que tu vas apprendre dans cette vidéo :</h3><ul><li><p>Pourquoi la sécurité d’un site WordPress ne doit pas être prise à la légère</p></li><li><p>Comment choisir un <strong>mot de passe fort et sécurisé</strong></p></li><li><p>Comment <strong>supprimer les contenus par défaut</strong> (articles, pages et plugins inutiles)</p></li><li><p>Installer <strong>ton premier plugin de sécurité</strong> pour protéger ton site</p></li><li><p>Les erreurs de débutants à éviter pour ne pas créer de failles</p></li><li><p>Conseils simples pour que ton site soit <strong>tranquille mais efficace</strong></p></li></ul><hr><h3>🧠 Pourquoi sécuriser ton site dès le départ est crucial</h3><p>WordPress est le CMS le plus utilisé dans le monde 🌍, et c’est aussi une cible pour les pirates.</p><p>Sans sécurité :</p><ul><li><p>ton site peut être piraté</p></li><li><p>tes données peuvent être perdues</p></li><li><p>ton site peut devenir inaccessible pour tes visiteurs</p></li><li><p>ton image professionnelle peut être impactée</p></li></ul><p>👉 L’objectif de cette vidéo : <strong>poser des bases solides</strong> pour que ton site reste sécurisé tout en restant simple à gérer.</p><hr><h3>🛠️ Dans la vidéo, tu verras concrètement :</h3><ul><li><p>Comment créer un mot de passe robuste facilement</p></li><li><p>Comment nettoyer ton site de tout contenu inutile</p></li><li><p>Comment installer et configurer un plugin de sécurité simple</p></li><li><p>Des astuces pour <strong>prévenir les problèmes futurs</strong></p></li></ul><p>💡 Astuce Stratec Digital :</p><blockquote><p>Sécuriser ton site WordPress ne doit pas être compliqué. Quelques réglages simples suffisent pour dormir tranquille et te concentrer sur ton contenu et tes clients.</p></blockquote><hr><h3>🔑 Résultat après cette vidéo :</h3><ul><li><p>Ton site WordPress est plus sûr dès le départ</p></li><li><p>Tu connais les bases de la sécurité WordPress</p></li><li><p>Tu peux avancer vers l’installation de ton thème et tes plugins essentiels avec confiance</p></li></ul>",
            "pdfUrl": "",
            "externalLink": "",
            "duration": "09:30",
            "order_index": 2
          },
          {
            "id": "39333d3b-4764-47d1-9ec1-9a0e2f6bb49c",
            "title": "Les plugins indispensables",
            "videoUrl": "https://youtu.be/g7fgz3n1BlU",
            "notes": "<h3>🎥 Vidéo 8 – Les plugins indispensables pour un site WordPress efficace</h3><p>Les plugins WordPress, c’est un peu comme des <strong>extensions pour ton site</strong> : ils lui ajoutent des fonctionnalités sans avoir besoin de coder.<br>Mais attention ⚠️ : trop de plugins, ou de mauvais plugins, peuvent <strong>ralentir ton site, créer des bugs ou des failles de sécurité</strong>.</p><p>Dans cette vidéo, je te montre <strong>les plugins vraiment indispensables</strong> pour démarrer un site WordPress sain, sécurisé et efficace, sans tomber dans l’usine à gaz.</p><hr><h3>🎯 Ce que tu vas apprendre dans cette vidéo :</h3><ul><li><p>À quoi servent les plugins WordPress (et à quoi ils ne servent pas)</p></li><li><p>Combien de plugins installer quand on débute</p></li><li><p>Les <strong>catégories de plugins essentiels</strong> :</p><ul><li><p>sécurité</p></li><li><p>sauvegardes</p></li><li><p>SEO</p></li><li><p>formulaire de contact</p></li><li><p>optimisation des performances</p></li></ul></li><li><p>Comment installer et activer un plugin proprement</p></li><li><p>Les erreurs classiques à éviter quand on débute</p></li></ul><hr><h3>🧠 Pourquoi bien choisir ses plugins est crucial</h3><p>WordPress permet de tout faire…<br>mais ce n’est pas parce qu’un plugin existe qu’il faut l’installer.</p><p>Un mauvais choix de plugins peut :</p><ul><li><p>ralentir ton site</p></li><li><p>provoquer des conflits</p></li><li><p>compliquer la maintenance</p></li><li><p>nuire à ton référencement naturel</p></li></ul><p>👉 L’objectif de cette vidéo : <strong>un site “tranquille mais efficace”</strong>, avec uniquement ce dont tu as vraiment besoin.</p><hr><h3>🛠️ Dans la vidéo, tu verras concrètement :</h3><ul><li><p>Où trouver des plugins fiables depuis WordPress</p></li><li><p>Comment reconnaître un plugin de qualité</p></li><li><p>Quels plugins installer en priorité</p></li><li><p>Pourquoi moins de plugins = souvent mieux</p></li><li><p>Comment garder ton site simple et performant</p></li></ul><p>💡 Conseil Stratec Digital :</p><blockquote><p>Un bon site WordPress n’est pas celui qui a le plus de plugins,<br>c’est celui qui a <strong>les bons plugins</strong>, bien choisis et bien utilisés.</p></blockquote><hr><h3>🔑 Résultat après cette vidéo :</h3><ul><li><p>Tu sais quels plugins installer sans te poser mille questions</p></li><li><p>Ton site est plus sécurisé et plus stable</p></li><li><p>Tu poses une base saine pour la suite de ton projet</p></li><li><p>Tu gagnes en autonomie et en sérénité</p></li></ul>",
            "pdfUrl": "",
            "externalLink": "",
            "duration": "11:05",
            "order_index": 3
          }
        ],
        "order_index": 3
      },
      {
        "id": "064b6a37-6cf8-43ee-9ea2-749411f7f364",
        "title": "Créer et organiser son contenu",
        "lessons": [
          {
            "id": "12c1633c-ebaf-40cc-bb82-1d6264ad6fd2",
            "title": "Construire le menu de navigation",
            "videoUrl": "https://youtu.be/LvjoduwLVVs",
            "notes": "<h3>🎥 Vidéo 11 – Construire le menu de navigation de son site WordPress</h3><p>Un beau site, c’est bien.<br>👉 Un site où l’on se repère facilement, c’est encore mieux.</p><p>Dans cette vidéo, je t’explique <strong>comment créer et organiser le menu de navigation de ton site WordPress</strong>, pour que tes visiteurs trouvent rapidement ce qu’ils cherchent… sans se perdre.</p><hr><h3>🎯 Ce que tu vas apprendre dans cette vidéo :</h3><ul><li><p>À quoi sert réellement un menu de navigation</p></li><li><p>Où se gèrent les menus dans WordPress</p></li><li><p>Comment ajouter des pages à ton menu</p></li><li><p>Créer des <strong>sous-menus</strong> simplement</p></li><li><p>Organiser ton menu de façon logique</p></li><li><p>Les erreurs fréquentes à éviter quand on débute</p></li></ul><hr><h3>🧠 Pourquoi le menu est essentiel</h3><p>Le menu est l’un des premiers éléments regardés sur un site.<br>Un menu mal construit peut :</p><ul><li><p>perdre tes visiteurs</p></li><li><p>créer de la frustration</p></li><li><p>diminuer le taux de contact</p></li><li><p>nuire à l’expérience utilisateur</p></li></ul><p>👉 L’objectif de cette vidéo : <strong>un menu clair, simple et efficace</strong>, adapté à ton activité.</p><hr><h3>🛠️ Dans la vidéo, tu verras concrètement :</h3><ul><li><p>Comment accéder aux menus WordPress</p></li><li><p>Ajouter, retirer et réorganiser les éléments</p></li><li><p>Créer des sous-menus sans difficulté</p></li><li><p>Adapter ton menu à ton thème</p></li><li><p>Tester ton menu côté visiteur</p></li></ul><p>💡 Conseil Stratec Digital :</p><blockquote><p>Un bon menu, c’est un menu qui <strong>guide</strong> le visiteur,<br>pas un menu qui lui donne trop de choix.</p></blockquote><hr><h3>🔑 Résultat après cette vidéo :</h3><ul><li><p>Ton menu est structuré et lisible</p></li><li><p>Tes pages sont accessibles facilement</p></li><li><p>Ton site est plus agréable à parcourir</p></li><li><p>Tu poses une vraie base d’expérience utilisateur</p></li></ul>",
            "pdfUrl": "",
            "externalLink": "",
            "duration": "16:30",
            "order_index": 1
          },
          {
            "id": "b13cbb26-baaf-4f7c-92ec-734b471f3032",
            "title": "Créer son premier article de blog",
            "videoUrl": "https://youtu.be/-pics7BChQs",
            "notes": "<h3>🎥 Vidéo 10 – Créer son premier article de blog sur WordPress (pages vs articles)</h3><p>Créer un blog sur WordPress peut faire peur quand on débute…<br>👉 Pourtant, un article de blog est l’un des <strong>meilleurs outils pour gagner en visibilité, expliquer ton métier et rassurer tes futurs clients</strong>.</p><p>Dans cette vidéo, je t’explique <strong>comment créer ton tout premier article de blog sur WordPress</strong>, en comprenant enfin la différence entre une page et un article, et en mettant en place une structure simple et efficace.</p><hr><h3>🎯 Ce que tu vas apprendre dans cette vidéo :</h3><ul><li><p>La <strong>différence entre une page et un article</strong> sur WordPress</p></li><li><p>À quoi sert un article de blog (et à quoi il ne sert pas)</p></li><li><p>Comment créer un article pas à pas</p></li><li><p>Découvrir l’éditeur WordPress (Gutenberg) sans stress</p></li><li><p>Structurer un article de blog simplement</p></li><li><p>Les erreurs classiques quand on débute</p></li></ul><hr><h3>🧠 Pourquoi créer des articles de blog est utile</h3><p>Un article de blog permet de :</p><ul><li><p>montrer ton expertise sans te vendre de force</p></li><li><p>répondre aux questions de tes clients</p></li><li><p>améliorer ton référencement naturel (SEO)</p></li><li><p>alimenter ton site avec du contenu vivant</p></li></ul><p>👉 L’objectif de cette vidéo : <strong>te montrer que le blog n’est pas réservé aux experts</strong>, et que tu peux écrire des articles utiles même avec peu de temps.</p><hr><h3>🛠️ Dans la vidéo, tu verras concrètement :</h3><ul><li><p>Où créer un article dans WordPress</p></li><li><p>Comment ajouter un titre, du texte, des images</p></li><li><p>Comment utiliser les blocs WordPress</p></li><li><p>Comment organiser ton contenu pour qu’il soit lisible</p></li><li><p>Pourquoi il vaut mieux faire simple quand on débute</p></li></ul><p>💡 Conseil Stratec Digital :</p><blockquote><p>Un bon article de blog n’est pas forcément long.<br>Il doit surtout <strong>répondre à une vraie question de ton audience</strong>.</p></blockquote><hr><h3>🔑 Résultat après cette vidéo :</h3><ul><li><p>Tu sais créer un article de blog sans stress</p></li><li><p>Tu comprends enfin la logique pages / articles</p></li><li><p>Ton site commence à vivre et à évoluer</p></li><li><p>Tu gagnes en confiance pour publier du contenu</p></li></ul>",
            "pdfUrl": "",
            "externalLink": "",
            "duration": "22:15",
            "order_index": 2
          },
          {
            "id": "5e4a3c62-21b3-4533-8907-bbc1b5dc40b6",
            "title": "Créer ses premières pages",
            "videoUrl": "https://youtu.be/UZlNiTvP0RY",
            "notes": "<h3>🎥 Vidéo 9 – Créer ses premières pages sur WordPress (Accueil, À propos, Services, Contact)</h3><p>Ton site WordPress est installé, sécurisé, équipé des bons plugins…<br>👉 il est temps de <strong>créer les pages essentielles de ton site</strong>.</p><p>Dans cette vidéo, je t’accompagne pas à pas pour créer <strong>les premières pages indispensables</strong> d’un site professionnel :<br>Accueil, À propos, Services (ou Produits) et Contact.</p><hr><h3>🎯 Ce que tu vas apprendre dans cette vidéo :</h3><ul><li><p>La différence entre <strong>page</strong> et <strong>article</strong> (et pourquoi c’est important)</p></li><li><p>Comment créer une page sur WordPress</p></li><li><p>Quelles pages sont indispensables quand on débute</p></li><li><p>Que mettre sur chaque page (sans jargon marketing)</p></li><li><p>Les erreurs classiques à éviter</p></li><li><p>Comment structurer ton contenu pour être clair et rassurant</p></li></ul><hr><h3>🧠 Pourquoi ces pages sont essentielles</h3><p>Un site sans pages claires, c’est comme un magasin sans panneau 🚪<br>Tes visiteurs doivent comprendre en quelques secondes :</p><ul><li><p>qui tu es</p></li><li><p>ce que tu proposes</p></li><li><p>à qui tu t’adresses</p></li><li><p>comment te contacter</p></li></ul><p>👉 L’objectif de cette vidéo : <strong>poser une base solide et cohérente</strong>, même si tu n’aimes pas écrire ou que tu débutes complètement.</p><hr><h3>🛠️ Dans la vidéo, tu verras concrètement :</h3><ul><li><p>Comment créer une page depuis le tableau de bord</p></li><li><p>Comment structurer une page Accueil efficace</p></li><li><p>Que raconter sur la page À propos sans te vendre de force</p></li><li><p>Comment présenter tes services ou produits simplement</p></li><li><p>Comment créer une page Contact claire et fonctionnelle</p></li></ul><p>💡 Conseil Stratec Digital :</p><blockquote><p>Ton site n’a pas besoin d’être parfait.<br>Il a besoin d’être <strong>clair, honnête et utile</strong> pour tes visiteurs.</p></blockquote><hr><h3>🔑 Résultat après cette vidéo :</h3><ul><li><p>Ton site contient les pages essentielles</p></li><li><p>Tes visiteurs comprennent ton activité</p></li><li><p>Ton site commence à prendre vie</p></li><li><p>Tu avances sans te disperser</p></li></ul>",
            "pdfUrl": "",
            "externalLink": "",
            "duration": "18:45",
            "order_index": 3
          },
          {
            "id": "ba855833-7444-4175-9234-ce90d0d364c8",
            "title": "Configurer la page d'accueil",
            "videoUrl": "https://youtu.be/d6tDuasaCP0",
            "notes": "<p><span style=\"color: rgb(51, 36, 32); font-size: 1.35rem; font-weight: 800;\">🎥 Vidéo 12 – Configurer la page d’accueil de son site WordPress</span></p><p>La page d’accueil, c’est <strong>la vitrine de ton site</strong>.<br>C’est souvent la première page que tes visiteurs voient… et celle qui leur donne (ou non) envie de continuer.</p><p>Dans cette vidéo, je t’explique <strong>comment configurer correctement la page d’accueil de ton site WordPress</strong>, même si tu débutes et que tu ne sais pas encore exactement quoi afficher.</p><hr><h3>🎯 Ce que tu vas apprendre dans cette vidéo :</h3><ul><li><p>La différence entre <strong>page d’accueil statique</strong> et <strong>derniers articles</strong></p></li><li><p>Comment choisir le bon type de page d’accueil selon ton projet</p></li><li><p>Où faire le réglage dans WordPress</p></li><li><p>Comment définir ta page Accueil et ta page Blog</p></li><li><p>Les erreurs fréquentes à éviter</p></li><li><p>Les bonnes pratiques pour une page d’accueil claire et efficace</p></li></ul><hr><h3>🧠 Pourquoi la page d’accueil est stratégique</h3><p>Une page d’accueil mal configurée peut :</p><ul><li><p>embrouiller tes visiteurs</p></li><li><p>donner une image peu professionnelle</p></li><li><p>faire fuir des prospects pourtant intéressés</p></li></ul><p>👉 L’objectif de cette vidéo : <strong>une page d’accueil simple, compréhensible et rassurante</strong>, sans chercher la perfection.</p><hr><h3>🛠️ Dans la vidéo, tu verras concrètement :</h3><ul><li><p>Où se trouve le réglage de la page d’accueil dans WordPress</p></li><li><p>Comment créer une page Accueil dédiée</p></li><li><p>Comment définir une page pour les articles de blog</p></li><li><p>Comment tester l’affichage côté visiteur</p></li><li><p>Comment ajuster ton choix si ton projet évolue</p></li></ul><p>💡 Conseil Stratec Digital :</p><blockquote><p>Ta page d’accueil n’a pas besoin de tout dire.<br>Elle doit surtout <strong>donner envie d’aller plus loin</strong>.</p></blockquote><hr><h3>🔑 Résultat après cette vidéo :</h3><ul><li><p>Ta page d’accueil est correctement configurée</p></li><li><p>Ton site est plus cohérent et professionnel</p></li><li><p>Tes visiteurs comprennent rapidement ton activité</p></li><li><p>Tu avances sereinement dans la création de ton site</p></li></ul>",
            "pdfUrl": "",
            "externalLink": "",
            "duration": "12:00",
            "order_index": 4
          }
        ],
        "order_index": 4
      },
      {
        "id": "d119f22b-cbd7-46d8-acce-3472e970573f",
        "title": "Réglages avancées",
        "lessons": [
          {
            "id": "f8f76d0c-5359-4566-a98e-84be8da3689d",
            "title": "Améliorer l'expérience utilisateur",
            "videoUrl": "https://youtu.be/7mKruDDDEbc",
            "notes": "<h3>🎥 Vidéo 13 – Améliorer l’expérience utilisateur sur WordPress (couleurs, polices, logo, favicon)</h3><p>Un site peut être techniquement bien fait…<br>👉 mais si on n’a pas envie d’y rester, il ne fera pas son job.</p><p>Dans cette vidéo, je t’explique <strong>comment améliorer l’expérience utilisateur (UX) de ton site WordPress</strong>, en travaillant des éléments simples mais essentiels :<br>les couleurs, les polices, le logo et le favicon.</p><hr><h3>🎯 Ce que tu vas apprendre dans cette vidéo :</h3><ul><li><p>Ce qu’est vraiment l’expérience utilisateur (UX)</p></li><li><p>Pourquoi l’UX est importante même sur un petit site</p></li><li><p>Comment choisir des <strong>couleurs cohérentes</strong> pour ton activité</p></li><li><p>Comment sélectionner des <strong>polices lisibles</strong></p></li><li><p>Où ajouter ton <strong>logo</strong> sur WordPress</p></li><li><p>À quoi sert le <strong>favicon</strong> et comment l’installer</p></li></ul><hr><h3>🧠 Pourquoi l’expérience utilisateur est essentielle</h3><p>Un site difficile à lire ou mal présenté peut :</p><ul><li><p>fatiguer tes visiteurs</p></li><li><p>donner une impression peu professionnelle</p></li><li><p>faire fuir avant même qu’ils te contactent</p></li></ul><p>👉 L’objectif de cette vidéo : <strong>un site agréable, clair et rassurant</strong>, sans entrer dans du design compliqué.</p><hr><h3>🛠️ Dans la vidéo, tu verras concrètement :</h3><ul><li><p>Où modifier les couleurs et polices dans WordPress</p></li><li><p>Comment éviter les combinaisons illisibles</p></li><li><p>Comment importer et afficher ton logo</p></li><li><p>Comment ajouter un favicon facilement</p></li><li><p>Des conseils simples pour une identité visuelle cohérente</p></li></ul><p>💡 Conseil Stratec Digital :</p><blockquote><p>Un site efficace n’est pas forcément “beau”.<br>Il est surtout <strong>agréable à utiliser</strong>.</p></blockquote><hr><h3>🔑 Résultat après cette vidéo :</h3><ul><li><p>Ton site est plus lisible</p></li><li><p>Ton identité visuelle est cohérente</p></li><li><p>Tes visiteurs se sentent à l’aise</p></li><li><p>Ton site gagne en crédibilité</p></li></ul><hr><p>&nbsp;</p>",
            "pdfUrl": "",
            "externalLink": "",
            "duration": "15:10",
            "order_index": 1
          },
          {
            "id": "1e77b284-606a-4196-a982-f41565373e20",
            "title": "Paramétrer les URL et le HTTPS",
            "videoUrl": "https://youtu.be/48aBNqww7ps",
            "notes": "<h3>🎥 Vidéo 14 – Paramétrer les URL et le HTTPS sur WordPress</h3><p>Les URL et le HTTPS, ça peut sembler très technique…<br>👉 et pourtant, ce sont des réglages <strong>indispensables</strong> pour un site propre, sécurisé et bien référencé sur Google.</p><p>Dans cette vidéo, je t’explique <strong>comment paramétrer correctement les URL (permaliens) et activer le HTTPS sur ton site WordPress</strong>, même si tu débutes et que tu ne veux pas “casser ton site”.</p><hr><h3>🎯 Ce que tu vas apprendre dans cette vidéo :</h3><ul><li><p>Ce qu’est une <strong>URL</strong> et à quoi elle sert</p></li><li><p>Ce que sont les <strong>permaliens WordPress</strong></p></li><li><p>Pourquoi les URL propres sont importantes pour le SEO</p></li><li><p>Comment choisir la bonne structure de liens</p></li><li><p>À quoi sert le <strong>HTTPS</strong></p></li><li><p>Comment vérifier que ton certificat SSL est actif</p></li><li><p>Les erreurs à éviter lors de ces réglages</p></li></ul><hr><h3>🧠 Pourquoi ces réglages sont essentiels</h3><p>Des URL mal configurées ou l’absence de HTTPS peuvent :</p><ul><li><p>nuire à ton référencement naturel</p></li><li><p>afficher un message “site non sécurisé”</p></li><li><p>faire fuir tes visiteurs</p></li><li><p>compliquer la suite de ton projet</p></li></ul><p>👉 L’objectif de cette vidéo : <strong>poser des bases techniques saines</strong>, une fois pour toutes.</p><hr><h3>🛠️ Dans la vidéo, tu verras concrètement :</h3><ul><li><p>Où régler les permaliens dans WordPress</p></li><li><p>Quelle structure choisir quand on débute</p></li><li><p>Comment vérifier le HTTPS sur ton site</p></li><li><p>Ce qu’il faut faire côté hébergeur si besoin</p></li><li><p>Comment éviter les erreurs irréversibles</p></li></ul><p>💡 Conseil Stratec Digital :</p><blockquote><p>Ces réglages sont à faire <strong>une seule fois</strong>,<br>mais bien les faire t’évitera beaucoup de soucis plus tard.</p></blockquote><hr><h3>🔑 Résultat après cette vidéo :</h3><ul><li><p>Tes URL sont propres et lisibles</p></li><li><p>Ton site est sécurisé en HTTPS</p></li><li><p>Ton site inspire confiance</p></li><li><p>Tu es prêt·e à avancer sereinement</p></li></ul>",
            "pdfUrl": "",
            "externalLink": "",
            "duration": "10:40",
            "order_index": 2
          },
          {
            "id": "865839fc-cd4d-4cc7-ae6a-386d38b9ea9d",
            "title": "Sauvegardes automatiques et anti-spam",
            "videoUrl": "https://youtu.be/-AT00Q6aYdw",
            "notes": "<h3>🎥 Vidéo 15 – Sauvegardes automatiques et anti-spam sur WordPress</h3><h3>Mettre son site en mode “tranquille mais efficace”</h3><p>Créer son site WordPress, c’est une chose.<br>👉 <strong>Le protéger sur la durée</strong>, c’est ce qui te permettra de dormir tranquille.</p><p>Dans cette vidéo, je t’explique comment <strong>mettre en place des sauvegardes automatiques et un système anti-spam</strong>, sans complexité technique, pour éviter les mauvaises surprises : site cassé, contenu perdu ou formulaires envahis de spams.</p><hr><h3>🎯 Ce que tu vas apprendre dans cette vidéo :</h3><ul><li><p>Pourquoi les <strong>sauvegardes sont indispensables</strong>, même sur un petit site</p></li><li><p>Les risques si tu n’as <strong>aucune sauvegarde</strong></p></li><li><p>Les différents types de sauvegardes (site complet, base de données…)</p></li><li><p>Comment mettre en place des <strong>sauvegardes automatiques</strong></p></li><li><p>Où et comment stocker tes sauvegardes en sécurité</p></li><li><p>Pourquoi le spam est un vrai problème sur WordPress</p></li><li><p>Comment protéger efficacement tes formulaires contre le spam</p></li></ul><hr><h3>🧠 Pourquoi ces réglages sont essentiels</h3><p>Sans sauvegarde :</p><ul><li><p>une mauvaise manipulation peut tout casser</p></li><li><p>une mise à jour peut provoquer un bug</p></li><li><p>un piratage peut te faire perdre ton site</p></li></ul><p>Sans anti-spam :</p><ul><li><p>ta boîte mail peut être saturée</p></li><li><p>tu peux rater de vrais messages de clients</p></li><li><p>ton site perd en crédibilité</p></li></ul><p>👉 L’objectif de cette vidéo : <strong>anticiper les problèmes au lieu de les subir</strong>.</p><hr><h3>🛠️ Dans la vidéo, tu verras concrètement :</h3><ul><li><p>Quels plugins utiliser pour les sauvegardes</p></li><li><p>Comment programmer des sauvegardes automatiques</p></li><li><p>Où vérifier que tout fonctionne correctement</p></li><li><p>Comment protéger simplement tes formulaires</p></li><li><p>Les erreurs classiques à éviter</p></li></ul><p>💡 Conseil Stratec Digital :</p><blockquote><p>Un site bien sauvegardé, c’est un site qu’on peut faire évoluer <strong>sans peur</strong>.</p></blockquote><hr><h3>🔑 Résultat après cette vidéo :</h3><ul><li><p>Ton site est sauvegardé automatiquement</p></li><li><p>Tes données sont protégées</p></li><li><p>Tes formulaires sont propres et fonctionnels</p></li><li><p>Tu peux avancer sereinement sur ton site</p></li></ul>",
            "pdfUrl": "",
            "externalLink": "",
            "duration": "08:15",
            "order_index": 3
          }
        ],
        "order_index": 5
      },
      {
        "id": "169a47a1-38d5-45c0-9859-d9397e8e06ae",
        "title": "Mise en ligne et suivi",
        "lessons": [
          {
            "id": "b137e711-8235-485d-851c-6f39cfc85d8f",
            "title": "Tester son site avant le grand lancement",
            "videoUrl": "https://youtu.be/xKS5R2wD2Eg",
            "notes": "<h3>🎥 Vidéo 16 – Tester son site WordPress avant le grand lancement</h3><h3>Mobile, tablette, formulaires : ne rien oublier</h3><p>Ton site est presque prêt…<br>👉 avant de le partager partout, il y a <strong>une étape indispensable que beaucoup zappent : les tests</strong>.</p><p>Dans cette vidéo, je te montre <strong>comment tester ton site WordPress avant sa mise en ligne officielle</strong>, pour t’assurer que tout fonctionne correctement, sur tous les supports, et éviter les mauvaises surprises.</p><hr><h3>🎯 Ce que tu vas apprendre dans cette vidéo :</h3><ul><li><p>Pourquoi tester son site avant le lancement est indispensable</p></li><li><p>Comment vérifier l’affichage sur <strong>ordinateur, mobile et tablette</strong></p></li><li><p>Les points clés à contrôler pour l’expérience utilisateur</p></li><li><p>Comment tester correctement tes <strong>formulaires de contact</strong></p></li><li><p>Vérifier les liens, boutons et pages importantes</p></li><li><p>Les erreurs fréquentes repérées juste avant le lancement</p></li></ul><hr><h3>🧠 Pourquoi cette étape est cruciale</h3><p>Un site non testé peut :</p><ul><li><p>mal s’afficher sur mobile</p></li><li><p>avoir un formulaire qui ne fonctionne pas</p></li><li><p>contenir des liens cassés</p></li><li><p>donner une image peu professionnelle</p></li></ul><p>👉 L’objectif de cette vidéo : <strong>lancer ton site en toute confiance</strong>, sans stress et sans oubli.</p><hr><h3>🛠️ Dans la vidéo, tu verras concrètement :</h3><ul><li><p>Comment tester ton site comme un vrai visiteur</p></li><li><p>Où regarder en priorité sur mobile</p></li><li><p>Comment vérifier que les messages arrivent bien</p></li><li><p>Quels ajustements faire avant le lancement</p></li><li><p>Une méthode simple pour ne rien oublier</p></li></ul><p>💡 Conseil Stratec Digital :</p><blockquote><p>Tester ton site, ce n’est pas douter de ton travail.<br>C’est <strong>le respect de tes futurs visiteurs</strong>.</p></blockquote><hr><h3>🔑 Résultat après cette vidéo :</h3><ul><li><p>Ton site fonctionne sur tous les supports</p></li><li><p>Tes formulaires sont opérationnels</p></li><li><p>Ton site est prêt à être montré</p></li><li><p>Tu peux lancer ton site sereinement</p></li></ul>",
            "pdfUrl": "",
            "externalLink": "",
            "duration": "14:00",
            "order_index": 1
          },
          {
            "id": "ab7b638c-55b1-448b-afbd-efa547f5b6f0",
            "title": "Félicitations : ton site est en ligne !",
            "videoUrl": "https://youtu.be/IThZBmGGoJA",
            "notes": "<h3>🎉 Vidéo – Félicitations : ton site est en ligne !</h3><p><strong>Checklist finale + bonnes pratiques pour la suite</strong></p><p>Ça y est… <strong>ton site est en ligne</strong> 🚀<br>Et rien que pour ça : <strong>bravo</strong> 👏</p><p>Mais avant de passer à autre chose (ou de sabrer le champagne 🍾), il y a <strong>quelques vérifications essentielles</strong> à faire pour partir sur de bonnes bases.</p><hr><h3>🎯 Objectif de la vidéo</h3><p>T’aider à <strong>finaliser ton site proprement</strong>, éviter les oublis classiques et savoir <strong>quoi faire après la mise en ligne</strong> pour qu’il reste efficace dans le temps.</p><hr><h3>📌 Au programme :</h3><ul><li><p>La <strong>checklist finale</strong> avant de dire “c’est bon, je publie”</p></li><li><p>Les derniers points à vérifier (contenu, navigation, sécurité)</p></li><li><p>Les erreurs fréquentes à éviter après la mise en ligne</p></li><li><p>Les <strong>bonnes pratiques pour la suite</strong> (maintenance, mises à jour, contenu)</p></li><li><p>Comment garder un site <strong>propre, sécurisé et utile</strong> sur la durée</p></li></ul><hr><p>👉 <strong>Pas besoin d’en faire trop</strong> : quelques habitudes simples suffisent pour garder un site sain et efficace.</p><p>💡 Cette vidéo marque la <strong>fin de la création du site</strong>, et le début de sa vraie vie en ligne.</p>",
            "pdfUrl": "",
            "externalLink": "",
            "duration": "09:45",
            "order_index": 2
          },
          {
            "id": "ef8ed86c-38b7-4648-94c5-e02fed50c6b4",
            "title": "Se faire remarquer par Google",
            "videoUrl": "https://youtu.be/4uKtrfggTFM",
            "notes": "<h3>🎥 Vidéo 17 – Se faire remarquer par Google</h3><p><strong>Search Console, Analytics et bases du SEO</strong></p><p>Ton site est en ligne… mais maintenant, une vraie question se pose 👇<br>👉 <strong>Comment Google va le trouver (et surtout le comprendre) ?</strong></p><p>Dans cette vidéo, on pose <strong>les bases essentielles du référencement</strong>, sans technique compliquée ni prise de tête.</p><hr><h3>🎯 Objectif de la vidéo</h3><p>T’aider à comprendre <strong>comment Google fonctionne</strong>, quels outils utiliser dès le départ et <strong>par quoi commencer pour gagner en visibilité</strong>, même si tu débutes totalement.</p><hr><h3>📌 Au programme :</h3><ul><li><p>À quoi sert <strong>Google Search Console</strong> et pourquoi l’installer dès maintenant</p></li><li><p>Le rôle de <strong>Google Analytics</strong> (et ce qu’il faut vraiment regarder)</p></li><li><p>La différence entre les deux outils (et pourquoi tu as besoin des deux)</p></li><li><p>Les <strong>bases du SEO</strong> à connaître quand on crée son site</p></li><li><p>Ce que Google aime… et ce qui peut bloquer ton référencement</p></li><li><p>Les premières bonnes pratiques à adopter sans être expert</p></li></ul><hr><p>👉 <strong>Pas besoin de tout maîtriser tout de suite</strong> : ici, on pose des fondations solides pour la suite.</p><p>💡 Dans les prochaines vidéos, on verra comment <strong>passer à l’action concrètement</strong> pour améliorer ta visibilité.</p><hr><p>&nbsp;</p>",
            "pdfUrl": "",
            "externalLink": "",
            "duration": "11:20",
            "order_index": 3
          }
        ],
        "order_index": 6
      },
      {
        "id": "17867174-2424-4000-a000-000000000000",
        "title": "BONUS",
        "lessons": [
          {
            "id": "17867174-5748-4000-a000-000000000000",
            "title": "Ajouter des photos / vidéos sur Wordpress",
            "videoUrl": "https://youtu.be/fcbVtJJWfME",
            "notes": "Notes explicatives et consignes...",
            "pdfUrl": "",
            "externalLink": "",
            "duration": "12:00",
            "order_index": 1
          },
          {
            "id": "17867175-0514-4000-a000-000000000000",
            "title": "Créer son adresse e-mail pro gratuitement",
            "videoUrl": "https://youtu.be/OrVeMTlIVeg",
            "notes": "<p><br></p>",
            "pdfUrl": "",
            "externalLink": "",
            "duration": "12:00",
            "order_index": 2
          }
        ],
        "order_index": 7
      }
    ]
  },
  {
    "id": "17873181-7987-4000-a000-000000000000",
    "slug": "formation-fiche-google",
    "title": "Cap Visibilité Google : Le GPS pas-à-pas pour guider vos clients locaux jusqu'à votre atelier",
    "description": "Formation vidéo pratique pour artisans et créateurs.",
    "duration": "2h",
    "level": "Débutant",
    "prerequisites": "Aucun prérequis technique nécessaire. Avoir un ordinateur connecté à internet.",
    "price": 29,
    "originalPrice": 149,
    "image": "/images/products/formation-fiche-google-mockup.png",
    "status": "Planifié",
    "category": "formation",
    "congratulationsMsg": "Bravo ! Tu as terminé avec succès l'ensemble des leçons de cette formation.",
    "bonusDocTitle": "Checklist ultime de contrôle post-formation",
    "bonusDocUrl": "https://www.guides-digitaux.com/wp-content/uploads/2026/02/checklist-a-verifier-avant-le-lancement-du-site.webp",
    "modules": [
      {
        "id": "10000000-0000-4000-a000-000000000000",
        "title": "Bienvenue et mise en route sans stress",
        "lessons": [
          {
            "id": "10000000-0000-4000-a000-000000000000",
            "title": "Bienvenue dans cette formation",
            "videoUrl": "https://youtu.be/jyySdvvd1fY",
            "notes": "<p>Tu as du talent, un savoir-faire précieux et l'envie d'exercer ton métier avec passion. Mais aujourd'hui, le bouche-à-oreille classique ne suffit plus : <strong>97 % des consommateurs recherchent un professionnel local sur Google</strong> avant de décrocher leur téléphone ou de se déplacer en boutique.</p>\n\n<p>Bienvenue dans cette formation spécialement conçue pour toi ! Que tu sois artisan du bâtiment, créatrice d’objets d’art faits main, commerçant de quartier, prestataire de services ou indépendant, tu as fait le meilleur choix possible pour pérenniser ton activité.</p>\n\n<p>Créer et optimiser sa <strong>Fiche Google Business Profile</strong> (anciennement <em>Google My Business</em>), ce n'est pas juste cocher une case administrative sur Internet. C'est activer <strong>le canal d'acquisition client le plus puissant, le plus rapide et le plus rentable</strong> qui existe pour une activité de proximité. Contrairement à un site web qui met parfois plusieurs mois à apparaître en tête des résultats naturels, une fiche d'établissement bien structurée peut t'apporter tes premières demandes de devis et tes premiers appels en quelques jours seulement, et ce, sans débourser un seul centime en publicité payante.</p>\n\n<h3>🎯 Pourquoi cette formation est différente de tout ce que tu as vu ?</h3>\n<p>Trop de guides en ligne se perdent dans un jargon d'ingénieur ou te noient sous des tutoriels théoriques interminables. Ici, nous adoptons une méthode <strong>pas-à-pas, découpée en micro-actions concrètes</strong>, pensée pour les professionnels qui manquent de temps et qui ont horreur de la complexité technique.</p>\n\n<ul>\n  <li><strong>Zéro stress technologique</strong> : chaque écran est partagé, chaque clic est expliqué simplement.</li>\n  <li><strong>Psychologie client &amp; Neuromarketing</strong> : nous n'allons pas seulement plaire aux algorithmes de Google ; nous allons surtout formater ta fiche pour rassurer le cerveau de tes prospects et déclencher un passage à l'action immédiat (appel téléphonique, demande d'itinéraire, visite sur place).</li>\n  <li><strong>Une vision long terme</strong> : tu apprendras à installer une routine de seulement 10 minutes par mois pour garder une fiche toujours vivante et au sommet du groupe de tête des cartes locales.</li>\n</ul>\n\n<h3>📌 Comment tirer le maximum de bénéfices de ces cours ?</h3>\n<ol>\n  <li><strong>Télécharge immédiatement ta feuille de route</strong> : clique sur le document joint ci-dessous. Elle te servira de boussole tout au long de ton parcours pour valider tes étapes une à une.</li>\n  <li><strong>Adopte le principe d'implémentation immédiate</strong> : ne regarde pas les vidéos d'une traite comme un simple spectateur. Visionne une leçon, mets pause, applique directement sur ton écran, puis passe à la suite.</li>\n  <li><strong>Avance avec bienveillance envers toi-même</strong> : ta fiche n'a pas besoin d'être \"parfaite\" dès la première minute pour commencer à générer des résultats. L'important est de poser des bases saines.</li></ol><ul>\n</ul>\n\n<blockquote><strong>💡 Le Mémo de l'Expert</strong> : Tu es au bon endroit pour transformer Google en ton meilleur apporteur d'affaires. Ouvre ta feuille de route, prépare tes identifiants et passons tout de suite à la radiographie d'une fiche Google à succès dans la vidéo suivante !</blockquote>",
            "pdfUrl": "",
            "externalLink": "https://drive.google.com/file/d/1hd3y0uzwHUAPxt2aF0TicVgus02khhu8/view?usp=drive_link",
            "duration": "10:00",
            "order_index": 1
          },
          {
            "id": "17890334-9895-4000-a000-000000000000",
            "title": "A. quoi ressemble un fiche Google ?",
            "videoUrl": "https://youtu.be/nuqqB7fhjrg",
            "notes": "<p>Quand un prospect tape <em>« plombier autour de moi »</em> ou <em>« poterie artisanale »</em>, son regard ne parcourt pas la page au hasard. Il scanne les résultats en moins de 3 secondes selon un schéma cognitif ultra-précis.</p>\n\n<p>Avant de plonger les mains dans la configuration de ton propre profil, il est capital de comprendre ce que voient réellement tes clients lorsqu'ils recherchent tes services sur leur smartphone ou leur ordinateur. Dans cette leçon, nous disséquons l'anatomie exacte d'une <strong>Fiche Google Business Profile d'élite</strong> et nous analysons les zones stratégiques qui captent le regard.</p>\n\n<p>Une fiche d'établissement Google n'est pas un simple annuaire téléphonique. C'est une <strong>véritable vitrine interactive</strong> qui s'affiche à deux endroits stratégiques majeurs :</p>\n<ol>\n  <li><strong>Dans l'encadré local prioritaire de Google</strong> : la carte géographique qui apparaît tout en haut de la première page, bien avant les résultats de sites web classiques.</li>\n  <li><strong>Sur Google Maps</strong> : l'application GPS utilisée quotidiennement par des millions de personnes pour trouver un commerce, un atelier ou un artisan à proximité immédiate de leur position géographique.</li>\n</ol>\n\n<h3>🎯 Les 6 zones critiques d'une fiche irrésistible</h3>\n<p>Pour transformer un simple internaute curieux en client payant, ta fiche doit cocher les cases de la réassurance psychologique :</p>\n<ul>\n  <li><strong>L'En-tête et le Nom d'établissement</strong> : clair, professionnel, sans sur-optimisation abusive qui risquerait une suspension par les robots de Google.</li>\n  <li><strong>La Note moyenne et le volume d'avis</strong> : la fameuse barre des 4.8+ étoiles avec des avis récents qui fait office de preuve sociale irréfutable.</li>\n  <li><strong>La Catégorie principale et secondaire</strong> : le signal algorithmique n°1 pour dire à Google exactement quand t'afficher.</li>\n  <li><strong>Les Boutons d'Action Rapide</strong> : <em>Appeler</em>, <em>Itinéraire</em>, <em>Site web</em>, <em>Réserver</em> — ces raccourcis réduisent l'effort de recherche du prospect à zéro.</li>\n  <li><strong>Le carrousel Photos &amp; Vidéos</strong> : la démonstration visuelle de ton savoir-faire en atelier ou sur chantier.</li>\n  <li><strong>Les Attributs &amp; Prestations détaillées</strong> : la liste transparente de ce que tu proposes avec tes tarifs indicatifs ou zones desservies.</li>\n</ul>\n\n<h3>🔍 Pourquoi la majorité de tes concurrents passent à côté ?</h3>\n<p>En observant les fiches de ta ville, tu constateras rapidement que 80 % d'entre elles sont incomplètes, abandonnées, sans photos récentes ou avec des horaires erronés. C'est une opportunité en or pour toi : en appliquant simplement les bonnes pratiques de cette formation, tu vas mécaniquement te hisser au-dessus d'eux sans forcer.</p><ul>\n</ul>\n\n<blockquote><strong>💡 Le Mémo de l'Expert</strong> : Ta fiche Google est ton commercial n°1 ouvert 24h/24 et 7j/7. En comprenant sa structure visuelle et ses leviers d'action, tu sais exactement sur quels boutons appuyer pour déclencher des conversions.</blockquote>",
            "pdfUrl": "",
            "externalLink": "",
            "duration": "12:00",
            "order_index": 2
          },
          {
            "id": "17884295-9695-4000-a000-000000000000",
            "title": "Matériels requis",
            "videoUrl": "https://youtu.be/B4yuHI5g5J8",
            "notes": "<p>Rien n'est plus frustrant que d'être interrompu au milieu d'une démarche parce qu'il te manque une photo, un justificatif d'entreprise ou une adresse mail dédiée. Préparons ton espace de travail en amont pour avancer l'esprit léger.</p>\n\n<p>Pour aborder le Module 2 sereinement et configurer ta fiche sans blocage technique, cette leçon fait l'inventaire complet des éléments dont tu as besoin. En préparant ces quelques informations dès maintenant dans un dossier dédié sur ton ordinateur ou ton téléphone, tu vas diviser par trois le temps nécessaire à la mise en place de ta fiche.</p>\n\n<h3>📁 1. Le compte Google dédié à ton entreprise</h3>\n<p>Il est fortement recommandé de ne pas mélanger ta boîte mail personnelle et la gestion de ton entreprise. Idéalement, utilise une adresse Google / Gmail professionnelle ou dédiée à ton activité (ex: <code>contact.monatelier@gmail.com</code> ou ton adresse reliée à ton propre nom de domaine). Cela te permettra de déléguer plus tard des accès si nécessaire et de séparer tes notifications clients de tes courriers personnels.</p>\n\n<h3>📍 2. Les informations administratives et d'identité (Le trio Nom-Adresse-Téléphone)</h3>\n<p>En référencement local, la règle d'or consiste à maintenir une parfaite concordance des coordonnées. Pour que Google t'accorde une confiance maximale, ces trois informations doivent être rigoureusement identiques partout sur le web :</p>\n<ul>\n  <li><strong>Le Nom officiel de ton entreprise</strong> (tel qu'enregistré auprès des registres officiels / chambre de métiers).</li>\n  <li><strong>L'adresse physique de ton siège ou atelier</strong> (ou la liste précise de tes villes d'intervention si tu travailles uniquement au domicile de tes clients sans accueillir de public).</li>\n  <li><strong>Ton numéro de téléphone professionnel direct</strong> (privilégie un numéro fixe ou mobile sur lequel tu es réellement joignable pendant tes heures d'ouverture).</li>\n  <li><strong>Ton justificatif officiel d'immatriculation</strong> : très utile en cas de vérification avancée par Google.</li>\n</ul>\n\n<h3>📸 3. Tes premiers visuels et photos brutes</h3>\n<p>Pas besoin de payer un photographe de studio à 1 000 € ! Ton smartphone moderne fait parfaitement l'affaire. Prépare :</p>\n<ul>\n  <li>Une photo de toi au travail ou avec ton tablier/tenue professionnelle (l'humain rassure instantanément).</li>\n  <li>3 à 5 photos de réalisations nettes, lumineuses et authentiques.</li>\n  <li>Une photo de ta devanture, de ton véhicule professionnel ou de ton espace de travail.</li></ul><ul>\n</ul>\n\n<blockquote><strong>💡 Le Mémo de l'Expert</strong> : Télécharge la checklist des prérequis ci-dessous, rassemble tes 5 photos et tes informations d'entreprise dans un dossier dédié. Dès que c'est fait, rejoins-moi dans le Module 2 pour créer et valider officiellement ta fiche !</blockquote>",
            "pdfUrl": "",
            "externalLink": "https://drive.google.com/file/d/1LytRfNJxZjgdvsNuJRuUrbgwzYOl6X5Y/view?usp=drive_link",
            "duration": "12:00",
            "order_index": 3
          }
        ],
        "order_index": 1
      },
      {
        "id": "17884296-5879-4000-a000-000000000000",
        "title": "Créer et valider sa fiche dans les règles de l'art",
        "lessons": [
          {
            "id": "17884296-9025-4000-a000-000000000000",
            "title": "Vérifier les doublons et révoquer une fiche",
            "videoUrl": "https://youtu.be/5st-C8Cjyy8",
            "notes": "<p>Savais-tu que Google crée parfois des fiches automatiquement sans même te prévenir ? Avant d'en créer une nouvelle, vérifions qu'aucun profil fantôme ne vient parasiter ta visibilité.</p>\n\n<p>Lorsque l'on souhaite créer sa présence sur Google, l'erreur la plus fréquente consiste à se précipiter pour créer un nouveau profil sans vérifier l'existant. Pourtant, les robots de Google scrutent les annuaires publics, les registres d'entreprises et les pages jaunes. Il arrive très souvent qu'une fiche préliminaire ait déjà été générée à ton insu, ou qu'un ancien propriétaire, un prestataire ou un employé ait créé un profil par le passé.</p>\n\n<p>Si tu crées une deuxième fiche sans nettoyer la première, tu tombes dans le piège redoutable du <strong>doublon d'établissement</strong>. Les conséquences sont immédiates et pénalisantes :</p>\n<ul>\n  <li>Google divise la réputation et les avis entre les deux profils.</li>\n  <li>Les algorithmes sont désorientés et finissent par déclasser les deux fiches.</li>\n  <li>Tes prospects tombent sur des horaires erronés ou des numéros obsolètes.</li>\n</ul>\n\n<h3>🎯 Comment détecter et neutraliser les doublons ?</h3>\n<p>Dans cette vidéo, je te montre la méthode simple pour auditer ta présence en 3 minutes :</p>\n<ol>\n  <li><strong>La recherche sur Google Maps</strong> : taper le nom exact de ton entreprise, ton ancienne adresse ou ton numéro de téléphone pour repérer toute fiche flottante.</li>\n  <li><strong>La revendication de propriété</strong> : si une fiche existe déjà pour ton établissement, nous voyons ensemble comment cliquer sur « <em>Vous êtes le propriétaire de cet établissement ?</em> » pour en reprendre le contrôle officiel en toute légitimité.</li>\n  <li><strong>La demande de suppression ou de fusion</strong> : si un doublon persiste ou si une ancienne fiche inactive bloque ta progression, je t'explique la démarche pour demander à Google de supprimer ou de fusionner les données proprement.</li>\n</ol>\n\n<p>Prendre ce temps de vérification dès le départ, c'est t'assurer que chaque futur avis client et chaque clic viendront renforcer une seule et unique vitrine officielle.</p>\n\n<blockquote><strong>💡 Le Mémo de l'Expert</strong> : Fais l'audit de ton nom d'entreprise sur Google Maps. Si une ancienne fiche existe, revendique-la ; sinon, tu as le feu vert pour créer ton profil sur un terrain parfaitement vierge et sécurisé !</blockquote>",
            "pdfUrl": "",
            "externalLink": "",
            "duration": "12:00",
            "order_index": 1
          },
          {
            "id": "17884299-6823-4000-a000-000000000000",
            "title": "Création de la fiche : nom et zone géographique",
            "videoUrl": "https://youtu.be/rg-UPY_YUgE",
            "notes": "<p>Faut-il ajouter ton métier et ta ville à côté de ton nom d'entreprise ? Où te situer si tu travailles depuis chez toi sans recevoir de clients ? Voici les réponses claires pour éviter toute suspension de compte.</p>\n\n<p>Nous entrons dans le cœur de la création de ta fiche d'établissement. Deux choix fondamentaux se posent à cette étape et conditionnent toute ta stratégie de référencement local : le <strong>nom d'affichage</strong> et le <strong>type d'adresse</strong>.</p>\n\n<h3>🏷️ 1. Le nom de ton établissement : la règle d'or</h3>\n<p>Beaucoup de guides obsolètes conseillent d'abuser des mots-clés dans le titre (par exemple : <em>« Menuiserie Dupont - Menuisier Lille Sur Mesure Dépannage Rapide »</em>). C'est ce qu'on appelle la sur-optimisation artificielle. Même si cela a pu fonctionner il y a plusieurs années, les consignes officielles de Google sont aujourd'hui formelles : ton nom sur la fiche doit être strictement <strong>le nom réel et officiel de ton entreprise</strong>.</p>\n\n<p>Dans cette vidéo, je te montre comment rester 100 % conforme pour ne prendre aucun risque de suspension tout en valorisant naturellement ta marque auprès de tes clients locaux.</p>\n\n<h3>📍 2. Établissement physique ou Prestataire de services à domicile ?</h3>\n<p>La question essentielle : reçois-tu des clients dans un atelier, une boutique ou un bureau, ou te déplaces-tu exclusivement chez tes clients ?</p>\n<ul>\n  <li><strong>Si tu as un local ouvert au public</strong> : nous renseignons ton adresse physique complète avec numéro de rue. Ton entreprise sera matérialisée par une épingle précise sur la carte Google Maps.</li>\n  <li><strong>Si tu travailles à domicile (sans accueil du public)</strong> : nous masquons ton adresse personnelle pour préserver ta vie privée et nous configurons une <strong>zone de desserte</strong>. Tu pourras ainsi sélectionner tes villes d'intervention clés (par exemple : Lille, Roubaix, Tourcoing, Comines et les communes avoisinantes).</li>\n</ul>\n\n<p>Cette distinction est cruciale : elle permet à Google de comprendre où tu es pertinent sans induire tes clients en erreur avec une porte close.</p><ul>\n</ul>\n\n<blockquote><strong>💡 Le Mémo de l'Expert</strong> : Renseigne ton nom officiel sans le surcharger artificiellement, et choisis judicieusement entre adresse visible et zone d'intervention selon la réalité de ton métier au quotidien.</blockquote>",
            "pdfUrl": "",
            "externalLink": "",
            "duration": "12:00",
            "order_index": 2
          },
          {
            "id": "17884299-6901-4000-a000-000000000000",
            "title": "Indiquer ses horaires",
            "videoUrl": "https://youtu.be/9YXE_fuN6Dw",
            "notes": "<p>Imagine faire 20 minutes de route pour trouver un atelier fermé alors que Google indiquait « Ouvert »… Un client déçu de la sorte ne revient jamais. Voyons comment verrouiller tes horaires réguliers et exceptionnels.</p>\n\n<p>Les horaires d'ouverture sont l'une des informations les plus consultées sur une fiche d'établissement, particulièrement sur smartphone en fin de journée ou le week-end. Quand un internaute recherche un artisan ou un commerce, son cerveau cherche une confirmation rapide : <em>« Puis-je l'appeler maintenant ? Est-il disponible ? »</em>.</p>\n\n<p>Afficher des horaires imprécis ou abandonnés engendre une friction majeure :</p>\n<ul>\n  <li>Des appels sans réponse qui te font perdre des contrats au profit d'un concurrent plus réactif.</li>\n  <li>Des clients frustrés qui peuvent laisser un avis négatif à cause d'un déplacement inutile.</li>\n  <li>Un signal négatif envoyé aux algorithmes de Google si les utilisateurs signalent fréquemment que l'établissement est fermé.</li>\n</ul>\n\n<h3>⏰ Configurer ses horaires comme un professionnel</h3>\n<p>Dans cette leçon, nous configurons pas à pas :</p>\n<ol>\n  <li><strong>Les horaires habituels d'ouverture</strong> : définir précisément les plages du lundi au samedi, avec gestion des coupures du midi si nécessaire.</li>\n  <li><strong>L'option « Ouvert 24h/24 » (avec discernement)</strong> : réservée uniquement aux services de dépannage d'urgence réels (serrurerie d'urgence, dépannage fuite). Pour les autres métiers, des horaires réalistes inspirent bien plus confiance.</li>\n  <li><strong>Les horaires exceptionnels (jours fériés et congés)</strong> : anticiper les ponts du mois de mai, le 14 juillet, le 15 août ou tes vacances annuelles pour que ta fiche prévienne automatiquement tes clients sans que tu aies à y penser le jour J.</li>\n</ol>\n\n<p>Une fiche dont les horaires sont rigoureusement tenus à jour témoigne d'un professionnalisme irréprochable et rassure instantanément tout nouveau visiteur.</p><ul>\n</ul>\n\n<blockquote><strong>💡 Le Mémo de l'Expert</strong> : Renseigne tes vraies heures de disponibilité et prends le réflexe d'ajuster tes congés à l'avance. C'est le gage d'une relation de confiance durable avec ta clientèle locale.</blockquote>",
            "pdfUrl": "",
            "externalLink": "",
            "duration": "12:00",
            "order_index": 3
          },
          {
            "id": "17890361-5802-4000-a000-000000000000",
            "title": "Fin des paramètres et explications des options payantes",
            "videoUrl": "https://youtu.be/DY6TDiHG1n4",
            "notes": "<p>Dès la validation terminée, Google te propose d'acheter un nom de domaine ou de dépenser des centaines d'euros en annonces publicitaires. Apprenons à dire « non » pour profiter de la puissance 100 % gratuite de ta fiche.</p>\n\n<p>Félicitations, ta fiche est en cours de déploiement ! À cette étape charnière, l'interface de Google te présente une série d'écrans de finalisation. C'est ici que de nombreux artisans s'interrogent et se demandent s'ils doivent sortir leur carte bancaire.</p>\n\n<p>Cette leçon est là pour te rassurer et t'éviter des dépenses superflues : <strong>la création, l'optimisation et la visibilité naturelle de ta fiche Google sont entièrement gratuites à vie.</strong></p>\n\n<h3>🚫 Décryptage des propositions commerciales de Google :</h3>\n<ul>\n  <li><strong>L'offre de crédit publicitaire payant</strong> : Google t'offre souvent un coupon d'essai (ex: 400 € offerts pour 400 € dépensés). Pour l'instant, ignore cette offre. Nous voulons d'abord bâtir un référencement naturel solide et pérenne qui t'apporte des clients réguliers sans budget publicitaire quotidien.</li>\n  <li><strong>L'achat d'un nom de domaine ou d'adresse mail</strong> : si tu possèdes déjà ton site ou ton adresse professionnelle chez un hébergeur indépendant, clique simplement sur « Ignorer ».</li>\n  <li><strong>L'activation de la messagerie instantanée</strong> : nous voyons comment l'activer ou la désactiver selon ton envie de recevoir des messages écrits directs de prospects.</li>\n</ul>\n\n<p>Nous passons en revue ces derniers réglages pour que ton tableau de bord soit parfaitement propre, épuré et prêt pour l'optimisation avancée du Module 3.</p><ul>\n</ul>\n\n<blockquote><strong>💡 Le Mémo de l'Expert</strong> : Clique sur « Ignorer » lors des incitations publicitaires. Ta fiche est désormais active et gratuite. Direction le Module 3 pour propulser ton profil tout en haut des résultats grâce aux techniques de référencement local !</blockquote>",
            "pdfUrl": "",
            "externalLink": "",
            "duration": "12:00",
            "order_index": 4
          },
          {
            "id": "17884300-2576-4000-a000-000000000000",
            "title": "Valider sa fiche sans rester bloqué",
            "videoUrl": "https://youtu.be/_LRRK58pOuA",
            "notes": "<p>La validation est l'étape où beaucoup d'indépendants se découragent : vidéo d'entreprise demandée, code postal qui tarde… Découvrons ensemble comment franchir ce cap avec sérénité.</p>\n\n<p>Pour lutter contre les fausses entreprises et les arnaques, Google impose une procédure de vérification obligatoire avant de publier officiellement ta fiche sur Google Maps et dans les résultats de recherche. Tant que cette validation n'est pas effectuée, ta fiche reste invisible pour le grand public.</p>\n\n<h3>🔍 Les différentes méthodes de vérification proposées :</h3>\n<ul>\n  <li><strong>La vérification par vidéo enregistrée</strong> : de plus en plus courante, elle te demande de filmer en une seule prise continue ton environnement de travail (devanture, véhicule professionnel floqué, outils de travail, badge, facture ou extrait de registre d'entreprise).</li>\n  <li><strong>La vérification par SMS ou appel téléphonique</strong> : la plus rapide, avec un code à 6 chiffres envoyé instantanément sur ton téléphone professionnel.</li>\n  <li><strong>La vérification par e-mail professionnel</strong> : disponible si tu possèdes une adresse mail liée au nom de domaine officiel de ton entreprise.</li>\n  <li><strong>Le courrier postal classique</strong> : l'envoi d'une carte postale contenant un code secret sous 5 à 10 jours ouvrés.</li>\n</ul>\n\n<h3>🛠️ Que faire en cas de blocage ou de rejet ?</h3>\n<p>Si ta vidéo n'est pas acceptée du premier coup ou si le courrier n'arrive pas, pas de panique ! Dans ce cours, je te donne toutes les astuces pratiques pour préparer tes justificatifs officiels (extrait d'immatriculation, carte professionnelle, devis avec en-tête) et contacter directement le support d'assistance pour débloquer la situation rapidement.</p><ul>\n</ul>\n\n<blockquote><strong>💡 Le Mémo de l'Expert</strong> : Choisis la méthode de validation proposée, prépare tes justificatifs et filme ton matériel avec calme. Si tu rencontres la moindre difficulté, consulte le guide joint pour débloquer ton dossier !</blockquote>",
            "pdfUrl": "",
            "externalLink": "https://notion.so",
            "duration": "12:00",
            "order_index": 5
          }
        ],
        "order_index": 2
      },
      {
        "id": "17884296-6622-4000-a000-000000000000",
        "title": "Optimiser sa fiche pour le référencement local (SEO)",
        "lessons": [
          {
            "id": "17884301-3644-4000-a000-000000000000",
            "title": "Horaires, coordonnées et fermetures",
            "videoUrl": "https://youtu.be/OeH6eVy-IDY",
            "notes": "<p>Un changement de numéro ? Une fermeture pour inventaire ou formation ? Garde le contrôle absolu sur tes informations pour ne jamais perdre un client fidèle.</p>\n\n<p>Au fur et à mesure de la vie de ton entreprise, tes disponibilités évoluent. Que ce soit pour une fermeture estivale, une intervention exceptionnelle sur un chantier ou un ajustement d'horaires d'hiver, savoir gérer ces réglages avec précision est une compétence essentielle.</p>\n\n<h3>🛠️ Les réglages clés pour une gestion sans faille :</h3>\n<ul>\n  <li><strong>Les horaires secondaires</strong> : très utiles si tu proposes des plages spécifiques (par exemple : <em>Accueil atelier sur rendez-vous</em>, <em>Permanence téléphonique</em>, <em>Retrait des commandes</em>).</li>\n  <li><strong>Le statut de fermeture temporaire</strong> : comment indiquer à Google et à tes clients que tu es fermé pour congés ou travaux pendant 2 ou 3 semaines <strong>sans perdre ton référencement ni tes avis accumulés</strong>.</li>\n  <li><strong>Le numéro de téléphone secondaire</strong> : comment renseigner une ligne fixe et un numéro de portable pour assurer une continuité de contact optimale.</li>\n  <li><strong>Le lien vers ton site vitrine</strong> : comment ajouter l'adresse exacte de ton site pour diriger naturellement les visiteurs vers tes galeries de réalisations complètes.</li>\n</ul>\n\n<blockquote><strong>💡 Le Mémo de l'Expert</strong> : Prends 2 minutes avant chaque départ en congé pour cocher la fermeture temporaire sur ta fiche. Tes clients sont prévenus en toute transparence et ton référencement reste parfaitement préservé.</blockquote>",
            "pdfUrl": "",
            "externalLink": "",
            "duration": "12:00",
            "order_index": 1
          },
          {
            "id": "17884301-3710-4000-a000-000000000000",
            "title": "Choisir ses catégories d'activités",
            "videoUrl": "https://youtu.be/Co42FbjXWCc",
            "notes": "<p>Si tu te trompes de catégorie principale, Google ne saura jamais à qui te présenter. Découvrons la méthode exacte pour choisir celle qui génère 80 % de tes futures impressions.</p>\n\n<p>Parmi les centaines de critères pris en compte par les algorithmes de Google Maps, le choix de la <strong>catégorie principale d'activité</strong> est mathématiquement le facteur de classement le plus lourd.</p>\n\n<p>Si un ébéniste choisit simplement la catégorie générique « Magasin de meubles » au lieu de « Atelier de menuiserie » ou « Ébéniste », il se prive instantanément des personnes qui recherchent une fabrication artisanale sur-mesure.</p>\n\n<h3>🎯 La stratégie en deux temps :</h3>\n<ol>\n  <li><strong>La Catégorie Principale</strong> : elle doit représenter le cœur exact de ton métier et ton savoir-faire premier. C'est sur cette catégorie que ton positionnement géographique sera le plus puissant.</li>\n  <li><strong>Les Catégories Secondaires (jusqu'à 9)</strong> : elles permettent d'élargir ton champ d'action aux prestations complémentaires sans diluer ton identité première (par exemple : <em>Peintre en bâtiment</em> en catégorie principale, puis <em>Entreprise de revêtements de sol</em> et <em>Plâtrier</em> en secondaires).</li>\n</ol>\n\n<p>Dans ce cours, nous analysons ensemble la liste fermée des catégories officielles de Google et nous étudions les choix des leaders de ton secteur pour te positionner sur la combinaison la plus stratégique et la plus rémunératrice.</p><ul>\n</ul>\n\n<blockquote><strong>💡 Le Mémo de l'Expert</strong> : Choisis une catégorie principale ultra-précise qui définit ton savoir-faire d'artisan, puis ajoute 2 à 4 catégories secondaires pertinentes pour couvrir toutes tes spécialités sans perdre en clarté.</blockquote>",
            "pdfUrl": "",
            "externalLink": "",
            "duration": "12:00",
            "order_index": 2
          },
          {
            "id": "17884301-3546-4000-a000-000000000000",
            "title": "Rédiger une description vendeuse",
            "videoUrl": "https://youtu.be/tjAW2TcvjjA",
            "notes": "<p>Tu disposes de 750 caractères pour raconter ton histoire, valoriser ton savoir-faire et inciter le prospect à te faire confiance. Rédigeons ensemble un texte captivant.</p>\n\n<p>La section de description de ta fiche Google remplit un double rôle fondamental :</p>\n<ol>\n  <li>Elle nourrit les robots d'indexation avec un champ lexical riche et géolocalisé.</li>\n  <li>Elle rassure le prospect en lui expliquant qui tu es, ce qui t'anime et pourquoi il doit faire appel à toi plutôt qu'à un autre.</li>\n</ol>\n\n<p>Trop de fiches se contentent d'un texte plat du type : <em>« Nous sommes une entreprise créée en 2018, nous faisons des travaux de qualité. »</em> Ce genre de description n'apporte aucune émotion, ne se démarque pas et ne donne aucun élément de réassurance tangible.</p>\n\n<h3>✍️ La structure idéale d'une description persuasive (la méthode des 3 blocs) :</h3>\n<ul>\n  <li><strong>L'Accroche immédiate (les 100 premiers caractères)</strong> : c'est la seule partie visible sans cliquer sur « En savoir plus ». Elle doit contenir ton métier, tes valeurs et ta zone d'action principale (ex: <em>« Artisan menuisier passionné, je conçois vos meubles sur-mesure et aménagements intérieurs à Lille et environs. »</em>).</li>\n  <li><strong>Le Corps de texte (ton savoir-faire et tes engagements)</strong> : détaille la qualité de tes matériaux, ton expérience, ton accompagnement personnalisé, tes garanties (décennale, fabrication locale, finitions soignées).</li>\n  <li><strong>L'Appel à l'action final</strong> : invite chaleureusement le lecteur à prendre contact pour échanger sur son projet ou obtenir un devis personnalisé et gratuit.</li>\n</ul>\n\n<p>Télécharge les modèles joints dans la ressource de ce cours : il te suffit de compléter les champs avec les spécificités de ton atelier !</p><ul>\n</ul>\n\n<blockquote><strong>💡 Le Mémo de l'Expert</strong> : Rédige une description chaleureuse de 500 à 700 caractères qui met en avant ton savoir-faire et ton amour du travail bien fait. Utilise les modèles fournis pour gagner un temps précieux !</blockquote>",
            "pdfUrl": "",
            "externalLink": "https://drive.google.com/file/d/1R_Tihx7aPw6s8J3qBNpMT_dOuSXKa9JJ/view?usp=drive_link",
            "duration": "12:00",
            "order_index": 3
          },
          {
            "id": "17890422-2136-4000-a000-000000000000",
            "title": "Ajouter un lien de réservation",
            "videoUrl": "https://youtu.be/29JPCJds00c",
            "notes": "<p>Combien de clients potentiels renoncent parce qu'ils n'osent pas téléphoner le soir après 20h ? En ajoutant un lien direct de prise de contact ou de rendez-vous, tu captures des clients même pendant ton sommeil.</p>\n\n<p>L'époque où les clients attendaient le lendemain matin pour appeler est révolue. Aujourd'hui, une grande partie des recherches locales s'effectue le soir dans le canapé, le week-end ou pendant une pause au travail. Si ta fiche ne propose qu'un numéro de téléphone à ces heures-là, le prospect risque de reporter sa démarche et d'oublier, ou pire, de contacter un confrère qui propose une réservation en ligne.</p>\n\n<p>Google te permet d'ajouter un bouton dédié très visible : <strong>« Rendez-vous »</strong> ou <strong>« Demande de devis »</strong>.</p>\n\n<h3>🔗 Les options de redirection à ta disposition :</h3>\n<ul>\n  <li><strong>Lien vers la page de contact de ton site internet</strong> : l'option la plus simple pour recevoir des demandes structurées par formulaire.</li>\n  <li><strong>Lien vers un calendrier de réservation en ligne (type Calendly, Cal.com ou Google Agenda)</strong> : idéal pour les coachs, consultants, esthéticiennes, coiffeuses, ou pour fixer un premier échange téléphonique de 15 minutes avec un artisan.</li>\n  <li><strong>Lien vers un formulaire d'estimation de projet</strong> : parfait pour préqualifier le budget et les besoins d'un chantier.</li>\n</ul>\n\n<p>Dans ce tutoriel, nous configurons ce lien stratégique pour transformer ta fiche en un véritable système d'acquisition automatique 24h/24.</p><ul>\n</ul>\n\n<blockquote><strong>💡 Le Mémo de l'Expert</strong> : Ajoute dès maintenant le lien vers ton formulaire de contact ou ton calendrier en ligne. Tu offres une flexibilité totale à tes futurs clients et tu ne laisses plus aucune opportunité s'échapper !</blockquote>",
            "pdfUrl": "",
            "externalLink": "",
            "duration": "12:00",
            "order_index": 4
          },
          {
            "id": "17884301-3240-4000-a000-000000000000",
            "title": "L'ajout de services",
            "videoUrl": "https://youtu.be/noEp0SEv3M8",
            "notes": "<p>Les clients ne cherchent pas seulement un « électricien » ; ils cherchent « pose de tableau électrique », « mise aux normes » ou « installation borne de recharge ». Donnons-leur exactement ce qu'ils attendent.</p>\n\n<p>La section <strong>Services</strong> de ta fiche Google est l'une des armes les plus sous-estimées du référencement local. Trop souvent délaissée, elle permet pourtant d'associer à chacune de tes catégories une liste détaillée de prestations sur-mesure.</p>\n\n<p>Quand un internaute tape une requête précise sur son smartphone, Google analyse cette section pour vérifier si tu proposes expressément la prestation demandée. Si c'est le cas, un petit badge distinctif apparaît dans les résultats : <em>« Propose : Rénovation salle de bain »</em>. Ce détail visuel fait bondir le taux de clic sur ta fiche !</p>\n\n<h3>📋 Comment structurer tes services :</h3>\n<ol>\n  <li><strong>Créer des services personnalisés</strong> : ne te contente pas des suggestions automatiques de Google. Ajoute tes propres intitulés professionnels avec le vocabulaire employé par tes clients.</li>\n  <li><strong>Rédiger une description courte pour chaque prestation (jusqu'à 300 caractères)</strong> : explique en quoi consiste le service, les matériaux utilisés ou le déroulement de l'intervention.</li>\n  <li><strong>Indiquer un tarif indicatif ou la mention « Sur devis »</strong> : la transparence rassure et filtre naturellement les demandes qualifiées.</li></ol><ul>\n</ul>\n\n<blockquote><strong>💡 Le Mémo de l'Expert</strong> : Renseigne 5 à 10 services précis avec une courte description pour chacun. C'est le meilleur moyen de prouver ton expertise et de capter des demandes de devis sur des besoins très spécifiques.</blockquote>",
            "pdfUrl": "",
            "externalLink": "",
            "duration": "12:00",
            "order_index": 5
          },
          {
            "id": "17890421-2579-4000-a000-000000000000",
            "title": "Remplis l'onglet \"plus\"",
            "videoUrl": "https://youtu.be/qwHtvP2x4DU",
            "notes": "<p>Entreprise gérée par une femme, accessible aux personnes à mobilité réduite, devis en ligne disponibles… Ces petits badges créent un coup de cœur immédiat auprès de ta clientèle locale.</p>\n\n<p>L'onglet <strong>« Plus »</strong> regroupe ce que Google appelle les <strong>attributs d'établissement</strong>. Ce sont des caractéristiques précises qui apparaissent sous forme d'icônes ou de mentions distinctives sur ton profil public.</p>\n\n<h3>🏷️ Les attributs indispensables à activer selon ton activité :</h3>\n<ul>\n  <li><strong>Identité et gouvernance</strong> : <em>Entreprise dirigée par des femmes</em>, <em>Entreprise artisanale locale</em>.</li>\n  <li><strong>Accessibilité physique</strong> : <em>Entrée accessible en fauteuil roulant</em>, <em>Parking accessible</em>, <em>Toilettes adaptées</em>.</li>\n  <li><strong>Options de service</strong> : <em>Devis en ligne</em>, <em>Services sur place</em>, <em>Assistance dans une autre langue</em>.</li>\n  <li><strong>Moyens de paiement acceptés</strong> : <em>Cartes bancaires</em>, <em>Paiement mobile sans contact</em>, <em>Chèques</em>, <em>Espèces</em>.</li>\n</ul>\n\n<p>Dans cette vidéo, nous cochons ensemble tous les attributs pertinents pour ton activité. En quelques clics, tu complètes ton profil à 100 %, ce qui envoie un signal très positif aux algorithmes d'évaluation de la qualité de Google.</p><ul>\n</ul>\n\n<blockquote><strong>💡 Le Mémo de l'Expert</strong> : Passe en revue tous les attributs de l'onglet « Plus » et active tout ce qui correspond à la réalité de ton entreprise. Chaque case cochée renforce la proximité avec tes clients !</blockquote>",
            "pdfUrl": "",
            "externalLink": "",
            "duration": "12:00",
            "order_index": 6
          }
        ],
        "order_index": 3
      },
      {
        "id": "17884296-6730-4000-a000-000000000000",
        "title": "Visuels et vitrine produits",
        "lessons": [
          {
            "id": "17884302-5120-4000-a000-000000000000",
            "title": "Ajout de photos et règles de nommage",
            "videoUrl": "https://youtu.be/mLHERw7HWoo",
            "notes": "<p>Une image vaut mille mots, mais sur Google, une photo bien choisie et bien nommée vaut des dizaines d'appels chaque mois. Découvrons comment mettre en scène ton savoir-faire d'artisan.</p>\n\n<p>Quand un internaute découvre ta fiche sur son smartphone, son regard se pose en une fraction de seconde sur les images. Les statistiques officielles de Google sont sans appel : <strong>les fiches d'établissement qui possèdent des photos régulières et authentiques reçoivent 42 % de demandes d'itinéraires en plus et 35 % de clics vers leur site internet en plus</strong> que celles qui n'en ont pas.</p>\n\n<p>Pour un artisan ou un créateur indépendant, les photos ne servent pas uniquement à décorer : elles apportent la <strong>preuve tangible de la qualité de ton travail</strong>. Elles lèvent le doute que tout prospect ressent avant de contacter un nouveau professionnel.</p>\n\n<h3>📸 Les 3 catégories d'images indispensables :</h3>\n<ol>\n  <li><strong>La photo de couverture et la photo de profil</strong> : choisis une image nette, lumineuse et représentative (par exemple : ton logo pour le profil, et une superbe vue d'ensemble de ton atelier ou d'un chantier terminé pour la couverture).</li>\n  <li><strong>Les photos de réalisations (avant / après)</strong> : montrer l'état initial d'un projet puis le résultat sublimé est le moyen le plus puissant pour prouver ton efficacité et susciter le désir.</li>\n  <li><strong>Les photos de l'humain et des coulisses</strong> : un portrait souriant de toi dans ton atelier, tes mains en train de façonner un matériau, tes outils rangés… L'authenticité crée un attachement émotionnel immédiat.</li>\n</ol>\n\n<h3>🏷️ La règle d'or du nommage des fichiers (le signal méconnu)</h3>\n<p>Trop d'indépendants téléchargent des photos avec des noms incompréhensibles du type <code>IMG_0492.jpg</code>. C'est une occasion manquée !</p>\n\n<p>Avant de téléverser une photo, renomme ton fichier avec des termes explicites associant ton savoir-faire et ta commune (par exemple : <code>renovation-salle-de-bain-marbre-lille.jpg</code> ou <code>creation-table-bois-massif-comines.jpg</code>). Les robots de lecture d'images de Google interprètent ce nom pour mieux comprendre tes compétences et te positionner sur ces recherches locales.</p>\n\n<p>Consulte le guide joint pour retrouver la liste exacte des dimensions recommandées et des exemples de noms optimisés.</p><ul>\n</ul>\n\n<blockquote><strong>💡 Le Mémo de l'Expert</strong> : Publie au moins 10 vraies photos de qualité prises avec ton smartphone, nomme chaque fichier avec soin, et prends l'habitude d'en ajouter 2 nouvelles par mois pour montrer que ton entreprise est en pleine activité !</blockquote>",
            "pdfUrl": "",
            "externalLink": "https://drive.google.com/file/d/1vvZtW88tsTh5x4vi2ITVpfYkFkxJ74pp/view?usp=drive_link",
            "duration": "12:00",
            "order_index": 1
          },
          {
            "id": "17884302-5191-4000-a000-000000000000",
            "title": "Comment ajouter des vidéos et règles d'acceptation",
            "videoUrl": "https://youtu.be/3GXJRTChRaI",
            "notes": "<p>Quoi de plus captivant que de voir un artisan en action, d'entendre le son de ses machines ou de découvrir le résultat final d'une création à 360 degrés ? Faisons de ta fiche une vitrine vivante.</p>\n\n<p>La vidéo est le format le plus captivant du web moderne, et c'est encore plus vrai sur Google Maps où moins de 5 % des entreprises prennent la peine d'en publier. En ajoutant ne serait-ce qu'une ou deux courtes vidéos sur ta fiche, <strong>tu te démarques instantanément de 95 % de tes concurrents locaux</strong>.</p>\n\n<p>Une courte vidéo permet de montrer ce qu'une photo statique ne peut pas transmettre : le mouvement, la précision d'un geste, la brillance d'un vernis, la propreté d'un chantier après passage, ou encore ta voix chaleureuse pour présenter ton engagement professionnel.</p>\n\n<h3>📐 Les critères techniques imposés par Google :</h3>\n<p>Pour que ta vidéo soit acceptée sans être rejetée par les robots de contrôle, elle doit respecter des règles simples :</p>\n<ul>\n  <li><strong>Durée maximale</strong> : jusqu'à 30 secondes (inutile de faire trop long, les vidéos de 15 à 20 secondes sont les plus percutantes).</li>\n  <li><strong>Poids du fichier</strong> : 75 Mo maximum.</li>\n  <li><strong>Résolution minimale</strong> : 720p (la plupart des smartphones filment en 1080p ou 4K, ce qui est amplement suffisant).</li>\n  <li><strong>Qualité du contenu</strong> : pas d'effets tape-à-l'œil, de filtres excessifs ni de textes clignotants. Google privilégie les plans stables, bien éclairés et réalistes.</li>\n</ul>\n\n<p>Dans ce cours, je te montre comment filmer une séquence courte et propre depuis ton téléphone, comment vérifier son poids, et comment la téléverser en quelques secondes sur ton tableau de bord.</p><ul>\n</ul>\n\n<blockquote><strong>💡 Le Mémo de l'Expert</strong> : Filme une courte vidéo de 15 à 20 secondes montrant une réalisation sous tous ses angles ou ton atelier en plein travail. Téléverse-la en suivant la fiche technique jointe pour bluffer tes futurs clients !</blockquote>",
            "pdfUrl": "",
            "externalLink": "https://drive.google.com/file/d/1jZdgw0FF9WBXA5cd3mk3PJxTj3wcnMIb/view?usp=drive_link",
            "duration": "12:00",
            "order_index": 2
          },
          {
            "id": "17884302-5264-4000-a000-000000000000",
            "title": "La section produits",
            "videoUrl": "https://youtu.be/RCDLORAKPUc",
            "notes": "<p>Pourquoi attendre qu'un prospect visite ton site pour lui montrer ce que tu vends ? La section produits transforme ta fiche en une véritable boutique en libre-service.</p>\n\n<p>La section <strong>Produits</strong> est l'un des espaces visuels les plus valorisants de ta fiche Google. Elle permet de créer des encadrés sous forme de carrousel interactif avec une photo grand format, un titre accrocheur, une catégorie, une fourchette de prix ou un tarif fixe, une description détaillée et un bouton d'action direct (vers ton site ou ton numéro).</p>\n\n<p>Même si tu es prestataire de services et non commerçant, cette section est une opportunité formidable ! Tu peux structurer tes prestations sous forme d'offres claires (par exemple : <em>« Forfait Entretien Chaudière »</em>, <em>« Création Logo &amp; Identité Visuelle »</em>, <em>« Séance Portrait Photo en Extérieur »</em>).</p>\n\n<h3>🛍️ Comment composer une fiche produit irrésistible :</h3>\n<ol>\n  <li><strong>Une photo épurée et lumineuse</strong> : privilégie un fond neutre ou une mise en situation élégante de ton objet ou de ton service.</li>\n  <li><strong>Un nom d'offre explicite</strong> : va droit au but avec des termes compréhensibles pour le grand public.</li>\n  <li><strong>La catégorie de produit</strong> : regroupe tes offres par familles pour faciliter la navigation (ex: <em>Mobilier sur-mesure</em>, <em>Décoration</em>, <em>Restauration</em>).</li>\n  <li><strong>La transparence tarifaire</strong> : afficher un prix fixe ou une mention « à partir de » élimine la crainte des tarifs exorbitants chez le client.</li>\n  <li><strong>La description de 1 000 caractères</strong> : résume les bénéfices majeurs, les délais et ce qui est inclus.</li>\n  <li><strong>Le bouton de redirection</strong> : ajoute un lien direct vers la page exacte de ton site vitrine ou de ta boutique pour concrétiser la prise de contact.</li></ol><ul>\n</ul>\n\n<blockquote><strong>💡 Le Mémo de l'Expert</strong> : Crée dès aujourd'hui 3 à 6 produits ou forfaits phares dans cette section. Utilise les modèles de fiches joints pour structurer des présentations claires qui incitent à l'achat immédiat !</blockquote>",
            "pdfUrl": "",
            "externalLink": "https://drive.google.com/file/d/1LpfuvwQGzst9YnZRehF3PDlN0IktjEP9/view?usp=drive_link",
            "duration": "12:00",
            "order_index": 3
          }
        ],
        "order_index": 4
      },
      {
        "id": "17884296-6788-4000-a000-000000000000",
        "title": "La stratégie avis clients (le levier de confiance)",
        "lessons": [
          {
            "id": "17884305-1240-4000-a000-000000000000",
            "title": "L'impact des avis sur la visibilité et comment les demander",
            "videoUrl": "https://youtu.be/FfmpP3IvB_k",
            "notes": "<p>9 personnes sur 10 consultent les avis avant de choisir un professionnel. Découvrons pourquoi les avis sont à la fois l'obsession de Google et le premier déclencheur de décision de tes clients.</p>\n\n<p>Dans l'écosystème du référencement local, les avis clients jouent un rôle monumental. Ils constituent l'un des trois piliers majeurs de l'algorithme de Google Maps (aux côtés de la pertinence et de la proximité géographique).</p>\n\n<p>Mais leur impact dépasse largement la technique : les avis sont le <strong>véritable juge de paix psychologique</strong>. Un artisan qui affiche 45 avis avec une note moyenne de 4.9 étoiles remportera presque toujours le contrat face à un confrère qui n'a que 3 avis, même si ce dernier est physiquement plus proche du client.</p>\n\n<h3>⭐ Les 4 critères que Google et tes clients scrutent attentivement :</h3>\n<ul>\n  <li><strong>Le volume total d'avis</strong> : plus tu en as, plus ton autorité d'établissement est forte.</li>\n  <li><strong>La note moyenne globale</strong> : viser entre 4.7 et 5.0 étoiles est la zone idéale de crédibilité.</li>\n  <li><strong>La régularité et la fraîcheur</strong> : avoir 10 avis récents obtenus au cours des derniers mois est bien plus puissant que d'en avoir 50 qui datent d'il y a 3 ans.</li>\n  <li><strong>La présence de termes précis dans les commentaires</strong> : quand un client écrit spontanément <em>« Merci pour la pose impeccable de notre parquet à Roubaix »</em>, Google prend en compte ces termes pour renforcer ton positionnement sur ces requêtes.</li>\n</ul>\n\n<h3>🔗 Comment obtenir ton lien court direct d'avis ?</h3>\n<p>Dans cette leçon, je te montre où récupérer ton <strong>lien d'avis direct personnalisé</strong> dans ton tableau de bord. Ce lien ouvre directement la fenêtre 5 étoiles sur le téléphone de ton client, lui évitant toute recherche fastidieuse.</p><ul>\n</ul>\n\n<blockquote><strong>💡 Le Mémo de l'Expert</strong> : Les avis sont le trésor de ton entreprise. Récupère ton lien court officiel dès la fin de cette vidéo et garde-le précieusement pour les prochaines leçons où nous mettrons en place un système de collecte sans effort !</blockquote>",
            "pdfUrl": "",
            "externalLink": "https://drive.google.com/file/d/1DrC6o2kYdiF2o78Xk6KNF5MIIrIjs0zi/view?usp=drive_link",
            "duration": "12:00",
            "order_index": 1
          },
          {
            "id": "17884305-1315-4000-a000-000000000000",
            "title": "Demander des avis sans être insistant",
            "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
            "notes": "<p>Tu as peur de déranger tes clients ou de passer pour un mendiant d'étoiles ? Voici la méthode simple et respectueuse pour faire de tes clients satisfaits tes meilleurs ambassadeurs.</p>\n\n<p>La plupart des artisans et indépendants font un travail formidable, mais commettent une erreur classique : ils attendent que le client pense spontanément à laisser un avis. La réalité, c'est qu'un client très satisfait passe vite à autre chose dans son quotidien si on ne lui tend pas une perche facile au bon moment.</p>\n\n<p>Demander un avis ne doit jamais ressembler à une obligation ni à une démarche insistante. C'est simplement <strong>la conclusion naturelle d'une collaboration réussie</strong>.</p>\n\n<h3>🎁 Le moment parfait : la phase d'enthousiasme client</h3>\n<p>Il existe une fenêtre d'opportunité idéale : <strong>le moment précis de la livraison ou de la finalisation</strong>.</p>\n<ul>\n  <li>Quand le client découvre sa cuisine posée, sa création sur-mesure ou son projet terminé et qu'il s'exclame : <em>« C'est magnifique, merci beaucoup ! »</em>.</li>\n  <li>C'est exactement à cet instant que tu réponds avec le sourire : <em>« Je suis tellement ravi que ça vous plaise ! Votre satisfaction est ma meilleure récompense. Comme je suis un artisan indépendant, un petit mot sur ma fiche Google m'aide énormément à me faire connaître dans la région. Je peux vous envoyer un petit lien par SMS ? »</em>.</li>\n</ul>\n\n<h3>📱 Les supports pratiques à mettre en place :</h3>\n<ol>\n  <li><strong>Le SMS court et personnalisé</strong> : envoyé 24h après la fin de la prestation avec ton lien direct.</li>\n  <li><strong>Le QR Code pratique</strong> : imprimé sur ta carte de visite, ton devis ou glissé dans le colis de livraison (le client le scanne avec son smartphone et dépose son avis en 30 secondes).</li>\n  <li><strong>L'e-mail de remerciement et de suivi de fin de prestation</strong>.</li></ol><ul>\n</ul>\n\n<blockquote><strong>💡 Le Mémo de l'Expert</strong> : Intègre la demande d'avis dans ta routine de fin de prestation. En formulant ta demande avec le cœur et en facilitant l'accès au formulaire, tu obtiendras un taux de réponse exceptionnel !</blockquote>",
            "pdfUrl": "",
            "externalLink": "",
            "duration": "12:00",
            "order_index": 2
          },
          {
            "id": "17884305-1373-4000-a000-000000000000",
            "title": "Savoir répondre à tous les retours",
            "videoUrl": "https://youtu.be/FiCgZ_EGJ4E",
            "notes": "<p>Quand tu réponds à un avis sur Google, tu ne réponds pas seulement à une personne : tu t'adresses à tous tes futurs clients qui liront ton échange dans les six prochains mois.</p>\n\n<p>Répondre aux avis déposés sur ta fiche est un devoir absolu pour deux raisons majeures :</p>\n<ol>\n  <li><strong>Pour Google</strong> : cela prouve que tu es un gérant impliqué, attentif et que ta fiche est surveillée activement.</li>\n  <li><strong>Pour tes futurs clients</strong> : la façon dont tu réponds aux commentaires en dit dix fois plus sur ton professionnalisme que tes propres discours promotionnels.</li>\n</ol>\n\n<h3>🌟 1. Répondre aux avis 5 étoiles (l'art de la gratitude)</h3>\n<p>Ne te contente pas d'un banal « <em>Merci</em> ». Prends le temps de personnaliser ta réponse :</p>\n<ul>\n  <li>Remercie chaleureusement le client en citant son prénom.</li>\n  <li>Rappelle le contexte du projet (ex: <em>« C'était un plaisir de fabriquer cette table en chêne massif pour votre salon à Lille »</em>).</li>\n  <li>Glisse naturellement quelques termes géographiques et professionnels pour enrichir le référencement de ta fiche.</li>\n</ul>\n\n<h3>🛡️ 2. Répondre aux avis négatifs ou injustifiés (garder son calme)</h3>\n<p>Recevoir un avis négatif fait toujours mal au cœur. Mais attention : ne réagis jamais sous le coup de la colère ! Une réponse agressive ou accusatrice détruit ta réputation aux yeux des centaines de personnes qui la liront plus tard.</p>\n\n<p>La méthode des 4 étapes pour désamorcer un avis négatif :</p>\n<ul>\n  <li><strong>Rester courtois et professionnel</strong> : saluer poliment.</li>\n  <li><strong>Exprimer de l'empathie</strong> : reconnaître la déception sans nécessairement admettre une faute injustifiée.</li>\n  <li><strong>Apporter des faits objectifs avec calme</strong> : expliquer posément la situation.</li>\n  <li><strong>Déplacer la conversation en privé</strong> : inviter la personne à te contacter par téléphone ou e-mail pour trouver une solution amiable.</li>\n</ul>\n\n<p>Télécharge les modèles de réponses prêts à l'emploi dans la ressource jointe pour faire face à toutes les situations avec élégance.</p><ul>\n</ul>\n\n<blockquote><strong>💡 Le Mémo de l'Expert</strong> : Prends l'habitude de répondre à chaque avis sous 48 heures. Sois chaleureux avec tes clients fidèles et ultra-professionnel avec les mécontents. Utilise les modèles fournis pour ne jamais être pris au dépourvu !</blockquote>",
            "pdfUrl": "",
            "externalLink": "https://drive.google.com/file/d/11KfvEg9gsAjhCjhTobPfULEjFIAWErB3/view?usp=drive_link",
            "duration": "12:00",
            "order_index": 3
          }
        ],
        "order_index": 5
      },
      {
        "id": "17884296-7805-4000-a000-000000000000",
        "title": "Animer sa fiche en 10 minutes par mois",
        "lessons": [
          {
            "id": "17884306-4631-4000-a000-000000000000",
            "title": "Publier des posts et actualités",
            "videoUrl": "https://youtu.be/h8vdbgEfRMc",
            "notes": "<p>Tu as de nouveaux chantiers terminés, une offre temporaire ou une nouveauté à partager ? Les publications Google sont le moyen idéal de faire vivre ta fiche sans y passer tes soirées.</p>\n\n<p>Créer et optimiser sa fiche d'établissement est une première étape essentielle, mais pour rester durablement au sommet des résultats de recherche, il faut envoyer des <strong>signaux de vitalité réguliers</strong> à Google. C'est exactement le rôle de l'outil de <strong>publications d'actualités</strong>.</p>\n\n<p>Une publication sur ta fiche fonctionne un peu comme une publication sur un réseau social, mais avec un avantage décisif : <strong>elle touche directement des personnes en recherche active de tes prestations dans ta ville</strong>, et non de simples internautes distraits qui font défiler leur fil d'actualité.</p>\n\n<h3>📢 Les 3 grands types de publications à exploiter :</h3>\n<ul>\n  <li><strong>La publication « Nouveauté / Réalisation »</strong> : présente une photo d'un travail récent avec un texte court explicatif et un bouton d'action vers ton site ou ton téléphone.</li>\n  <li><strong>La publication « Offre / Promotion »</strong> : idéale pour les périodes creuses ou les événements saisonniers (fêtes de fin d'année, rentrée, printemps). Tu peux y ajouter un titre promotionnel, une date de début et de fin, ainsi qu'un code avantage.</li>\n  <li><strong>La publication « Événement »</strong> : parfaite si tu organises des portes ouvertes dans ton atelier, si tu participes à un marché de créateurs local ou à un salon professionnel de ta région.</li>\n</ul>\n\n<h3>⚡ Le secret d'une publication efficace en 3 minutes chrono :</h3>\n<ul>\n  <li><strong>Une photo séduisante et authentique</strong> : un plan net de ton travail ou de ton équipe.</li>\n  <li><strong>Un texte court de 3 à 5 lignes</strong> : va droit au but, partage un conseil ou le résultat d'un projet.</li>\n  <li><strong>Un bouton d'action clair</strong> : sélectionne <em>« Appeler »</em>, <em>« En savoir plus »</em> ou <em>« Réserver »</em> pour guider immédiatement le visiteur vers l'étape suivante.</li>\n</ul>\n\n<p>En publiant une seule actualité toutes les deux ou trois semaines, tu montres à Google et à tes prospects que ton entreprise est dynamique, passionnée et disponible.</p><ul>\n</ul>\n\n<blockquote><strong>💡 Le Mémo de l'Expert</strong> : Rédige une publication rapide dès que tu termines un joli projet. Une belle photo, 4 phrases bienveillantes, un bouton d'appel, et ta fiche conserve une avance décisive sur tous les concurrents endormis !</blockquote>",
            "pdfUrl": "",
            "externalLink": "",
            "duration": "12:00",
            "order_index": 1
          },
          {
            "id": "17884306-4781-4000-a000-000000000000",
            "title": "Foire aux questions et gestion des notifications",
            "videoUrl": "https://youtu.be/sW07uH4sq2A",
            "notes": "<p>Quelles sont les 3 questions que tes clients te posent systématiquement avant de signer un devis ? Répondons-y directement sur ta fiche pour lever tous les freins à l'achat.</p>\n\n<p>La section <strong>Questions et Réponses</strong> de ta fiche Google est un espace collaboratif public où n'importe quel internaute peut poser une question… et où n'importe qui peut y répondre !</p>\n\n<p>Pour éviter que des inconnus ne répondent de travers à ta place ou que des questions restent sans réponse pendant des mois, il existe une stratégie proactive très puissante : <strong>alimenter toi-même ta propre foire aux questions</strong>.</p>\n\n<h3>❓ La méthode de la Foire aux Questions proactive :</h3>\n<p>Tu as parfaitement le droit (et c'est même fortement recommandé) de poser toi-même les questions les plus fréquentes sur ta fiche et d'y apporter la réponse officielle en tant que propriétaire d'établissement :</p>\n<ul>\n  <li><em>« Proposez-vous des devis gratuits et sans engagement ? »</em> ➡️ <em>« Oui, tous nos devis sont 100 % gratuits et personnalisés après étude de votre projet à Lille et dans toute la métropole. »</em></li>\n  <li><em>« Quels sont vos délais moyens de fabrication ou d'intervention ? »</em></li>\n  <li><em>« Travaillez-vous avec des matériaux écologiques ou d'origine française ? »</em></li>\n  <li><em>« Vos travaux sont-ils couverts par une garantie décennale ? »</em></li>\n</ul>\n\n<h3>🔔 Paramétrer ses notifications pour ne rien manquer :</h3>\n<p>Dans cette vidéo, nous configurons également tes alertes par e-mail et sur smartphone pour que tu sois averti instantanément dès qu'un nouvel avis est déposé ou qu'une question est posée. Être le premier à répondre avec courtoisie renforce ton image de professionnel d'élite.</p><ul>\n</ul>\n\n<blockquote><strong>💡 Le Mémo de l'Expert</strong> : Rédige 3 à 5 questions/réponses stratégiques sur ta fiche dès aujourd'hui pour devancer les interrogations de tes prospects et vérifie que tes alertes e-mails sont bien actives !</blockquote>",
            "pdfUrl": "",
            "externalLink": "",
            "duration": "12:00",
            "order_index": 2
          },
          {
            "id": "17884306-4697-4000-a000-000000000000",
            "title": "Messagerie et module Questions/Réponses",
            "videoUrl": "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
            "notes": "<p>Recevoir des demandes de devis par message écrit directement depuis l'application Google Maps : aubaine pour ton chiffre d'affaires ou source de stress supplémentaire ? Faisons le bon choix pour ton organisation.</p>\n\n<p>Google propose une fonctionnalité de <strong>messagerie instantanée</strong> qui fait apparaître un bouton bleu « Discuter » ou « Envoyer un message » sur ta fiche d'établissement lorsque les internautes te consultent sur leur téléphone portable.</p>\n\n<p>Cette option est particulièrement appréciée par les jeunes générations et les personnes qui préfèrent envoyer quelques photos de leur besoin par message plutôt que de téléphoner.</p>\n\n<h3>🤔 Faut-il activer la messagerie pour ton activité ?</h3>\n<p>La réponse dépend exclusivement de ton mode de travail au quotidien :</p>\n<ul>\n  <li><strong>Active-la si</strong> : tu gardes ton smartphone à portée de main, tu aimes échanger par message court, et tu as la capacité de répondre en moins de quelques heures.</li>\n  <li><strong>Désactive-la si</strong> : tu es sur chantier toute la journée sans pouvoir regarder ton écran, ou si tu préfères concentrer toutes tes demandes sur ton formulaire de contact de site internet et tes appels téléphoniques.</li>\n</ul>\n\n<h3>💬 Les bonnes pratiques si tu choisis de l'activer :</h3>\n<p>Dans cette leçon, nous voyons comment :</p>\n<ol>\n  <li>Configurer un <strong>message d'accueil automatique chaleureux</strong> qui remercie l'internaute et lui indique tes horaires de réponse habituels.</li>\n  <li>Définir des réponses rapides types pour gagner du temps.</li>\n  <li>Éviter d'être pénalisé par Google (un délai de réponse trop long peut amener Google à désactiver automatiquement la messagerie de ta fiche).</li></ol><ul>\n</ul>\n\n<blockquote><strong>💡 Le Mémo de l'Expert</strong> : Choisis le mode de contact qui te correspond le mieux. Si tu actives la messagerie, personnalise ton message d'accueil automatique pour poser un cadre clair et accueillant dès la première seconde !</blockquote>",
            "pdfUrl": "",
            "externalLink": "",
            "duration": "12:00",
            "order_index": 3
          },
          {
            "id": "17890461-3401-4000-a000-000000000000",
            "title": "10 min par mois pour mettre à jour",
            "videoUrl": "https://youtu.be/YDEz8kwtrbA",
            "notes": "<p>Pas besoin de passer 2 heures par semaine sur Google pour obtenir des résultats spectaculaires. Voici la routine ultra-légère pour maintenir ta fiche au sommet toute l'année.</p>\n\n<p>Le secret de la réussite sur Internet n'est pas de faire un effort surhumain pendant 3 jours puis de tout abandonner pendant un an. La véritable clé réside dans une <strong>petite régularité méthodique</strong>, facile à tenir et intégrée naturellement à ton planning d'artisan ou d'indépendant.</p>\n\n<p>Dans cette leçon de synthèse, nous mettons en place <strong>la routine des 10 minutes par mois</strong>. Un rituel simple que tu peux caler le premier lundi de chaque mois, autour d'un café.</p>\n\n<h3>⏳ Les 4 étapes de ta routine mensuelle express :</h3>\n<ol>\n  <li><strong>Minute 1 à 3 : Traiter et remercier les nouveaux avis</strong> : vérifier les commentaires reçus au cours des 30 derniers jours et publier des réponses chaleureuses et personnalisées.</li>\n  <li><strong>Minute 4 à 6 : Ajouter 2 ou 3 nouvelles photos fraîches</strong> : téléverser les réalisations marquantes du mois écoulé, avec un nom de fichier soigné et géolocalisé.</li>\n  <li><strong>Minute 7 à 9 : Publier une actualité ou une offre du mois</strong> : partager un conseil pratique, une nouveauté d'atelier ou les disponibilités du mois suivant.</li>\n  <li><strong>Minute 10 : Vérifier les horaires du mois à venir</strong> : anticiper les jours fériés ou les éventuelles fermetures exceptionnelles.</li>\n</ol>\n\n<p>Télécharge ta grille de suivi et ton calendrier mensuel dans les ressources jointes : imprime-le ou garde-le sur ton bureau pour cocher tes étapes mois après mois l'esprit totalement serein.</p><ul>\n</ul>\n\n<blockquote><strong>💡 Le Mémo de l'Expert</strong> : Bloque 10 minutes dans ton agenda au début de chaque mois. Cette simple habitude suffit à garantir un flux continu d'appels et de demandes de devis tout au long de l'année !</blockquote>",
            "pdfUrl": "",
            "externalLink": "https://drive.google.com/file/d/1stUvYoYScKbwn8mOR47o-9hZFVpdblaj/view?usp=drive_link",
            "duration": "12:00",
            "order_index": 4
          }
        ],
        "order_index": 6
      },
      {
        "id": "17884308-7815-4000-a000-000000000000",
        "title": "Suivre ses résultats et aller plus loin",
        "lessons": [
          {
            "id": "17884308-8576-4000-a000-000000000000",
            "title": "Cohérence web locale : ajouter ses liens réseaux sociaux",
            "videoUrl": "https://youtu.be/QvSeL7jwpdU",
            "notes": "<p>Ta fiche Google est la porte d'entrée royale, mais elle gagne une force décuplée lorsqu'elle est interconnectée avec ton site web et tes profils sociaux. Bâtissons ta forteresse de visibilité locale.</p>\n\n<p>Pour clore en beauté cette formation, nous prenons un peu de recul pour relier tous les éléments de ta présence en ligne. Dans le monde du référencement moderne, Google n'analyse pas ta fiche d'établissement de façon isolée : il vérifie la <strong>cohérence globale de tout ton écosystème numérique</strong>.</p>\n\n<p>Quand les informations de ta fiche Google concordent parfaitement avec celles de ton site vitrine sous WordPress, de ta page Facebook, de ton compte Instagram ou de ton profil professionnel LinkedIn, Google t'accorde une note de confiance maximale.</p>\n\n<h3>🌐 Les 3 connexions stratégiques à finaliser :</h3>\n<ol>\n  <li><strong>Intégrer les liens de tes réseaux sociaux sur ta fiche</strong> : Google permet désormais d'ajouter officiellement les icônes de tes profils Instagram, Facebook, LinkedIn ou Pinterest directement au bas de ta fiche d'établissement.</li>\n  <li><strong>Insérer la carte Google Maps sur la page contact de ton site internet</strong> : intégrer un plan interactif sur ton site vitrine envoie un signal géographique bidirectionnel extrêmement puissant aux moteurs de recherche.</li>\n  <li><strong>Harmoniser tes coordonnées partout sur le web</strong> : vérifier que ton adresse, ton numéro de téléphone et ton nom sont strictement identiques sur ton site, tes devis, tes factures et tes annuaires locaux.</li>\n</ol>\n\n<p>En reliant ainsi tous les rouages de ta présence en ligne, tu crées un cercle vertueux : chaque nouvel avis Google renforce ton site, et chaque visite sur ton site renforce ta fiche d'établissement !</p><ul>\n</ul>\n\n<blockquote><strong>💡 Le Mémo de l'Expert</strong> : Relie tes réseaux sociaux à ta fiche et intègre ta carte Google Maps sur ton site vitrine. Félicitations, tu disposes désormais d'un écosystème local complet, professionnel et redoutablement efficace pour capter des clients toute l'année !</blockquote>",
            "pdfUrl": "",
            "externalLink": "",
            "duration": "12:00",
            "order_index": 1
          },
          {
            "id": "17884308-8516-4000-a000-000000000000",
            "title": "Comprendre ses statistiques simples",
            "videoUrl": "https://youtu.be/RTuQZXy2EwA",
            "notes": "<p>Nombre d'appels passés, demandes d'itinéraires, clics vers ton site… Découvrons le tableau de bord des statistiques pour voir concrètement l'impact de ta fiche sur ton carnet de commandes.</p>\n\n<p>Ce qui ne se mesure pas ne peut pas progresser. Heureusement, Google met à ta disposition un espace <strong>Performances</strong> remarquablement simple et visuel. Nul besoin d'être un statisticien ou un spécialiste des données pour comprendre ce qui s'y passe : tout est pensé pour les chefs d'entreprise et les artisans de terrain.</p>\n\n<p>Dans cette leçon, nous apprenons à lire et interpréter les indicateurs clés pour mesurer ton retour sur investissement.</p>\n\n<h3>📊 Les 4 indicateurs fondamentaux à surveiller :</h3>\n<ul>\n  <li><strong>Les termes de recherche (mots-clés réels)</strong> : la liste exacte des expressions que les internautes ont tapées pour tomber sur ta fiche (par exemple : <em>« couturière Comines »</em>, <em>« réparation meuble ancien »</em>, <em>« électricien d'urgence »</em>). C'est une mine d'or pour savoir ce que tes clients recherchent vraiment !</li>\n  <li><strong>Le nombre d'appels téléphoniques déclenchés</strong> : combien de personnes ont cliqué sur le bouton « Appeler » depuis leur mobile au cours du mois.</li>\n  <li><strong>Les demandes d'itinéraire</strong> : combien de clients ont lancé leur GPS pour venir jusqu'à ton atelier, ta boutique ou ton bureau.</li>\n  <li><strong>Les clics vers ton site internet</strong> : le volume de trafic qualifié envoyé directement sur tes pages de vente ou formulaires de devis.</li>\n</ul>\n\n<p>Analyser ces chiffres une fois par trimestre te permet d'ajuster tes catégories, tes photos et tes descriptions pour maximiser les résultats qui t'apportent le plus de chiffre d'affaires.</p><ul>\n</ul>\n\n<blockquote><strong>💡 Le Mémo de l'Expert</strong> : Consulte ton onglet Performances une fois par trimestre. Les mots-clés utilisés par tes clients sont la meilleure boussole pour continuer à enrichir ta fiche et faire grandir ton entreprise !</blockquote>",
            "pdfUrl": "",
            "externalLink": "",
            "duration": "12:00",
            "order_index": 2
          }
        ],
        "order_index": 7
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
