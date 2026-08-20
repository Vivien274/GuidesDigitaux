export interface Product {
  id: string;
  title: string;
  slug: string;
  category: 'ebook' | 'checklist' | 'formation' | 'coaching';
  categoryLabel: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  badge?: string;
  image: string;
  imageAlt: string;
  gallery?: string[];
  description: string;
  longDescription?: string;
  features: string[];
  bookingUrl?: string;
  downloadPdf?: string;
  productType?: 'simple' | 'bundle';
  bundleProductIds?: string[];
  bundleCustomItems?: { title: string; pdfUrl?: string }[];
}

export const DEFAULT_PRODUCTS: Product[] = [
  {
    "id": "mini-guide-ecrire-web-artisan",
    "title": "Mini-guide : Écrire pour le web quand on est artisan",
    "slug": "mini-guide-ecrire-web-artisan",
    "category": "ebook",
    "categoryLabel": "E-Book / Guide PDF",
    "price": 5,
    "rating": 5,
    "reviewsCount": 0,
    "badge": "NOUVEAUTÉ",
    "image": "/images/products/ecrire-page-4.webp",
    "imageAlt": "Conseils pratiques pour rédiger pour le web quand on est artisan - Guides digitaux - Comines",
    "gallery": [
      "/images/products/ecrire-page-4.webp",
      "/images/products/ecrire-page-1.webp",
      "/images/products/ecrire-page-2.webp",
      "/images/products/ecrire-page-3.webp"
    ],
    "description": "Des conseils pratiques et concrets pour rédiger des textes captivants et optimisés pour le web quand on est artisan.",
    "longDescription": "<h3>Pourquoi la rédaction web est le cœur de votre visibilité artisanale</h3>\n<p>Quand on est artisan, créateur ou indépendant dans la Métropole lilloise ou le Nord de la France, on pense souvent que seules les photos parlent pour soi. Pourtant, sur Internet et particulièrement sur les moteurs de recherche comme Google, ce sont les mots qui permettent d'être trouvé et de convaincre. Savoir <strong>rédiger des textes captivants pour le web sans jargon technique</strong> est la compétence clé pour faire passer vos visiteurs du statut de simples curieux à celui de clients engagés.</p>\n\n<p>Trop souvent, les artisans commettent deux erreurs opposées : soit écrire des textes trop courts et vagues par manque de temps, soit copier le style institutionnel et rigide de grandes entreprises. Ce mini-guide pratique a été spécifiquement conçu pour vous apporter une méthode simple, directe et immédiatement opérationnelle pour affirmer votre identité d'artisan en ligne.</p>\n\n<h3>Ce que vous allez apprendre et concrétiser avec ce guide</h3>\n<p>Grâce à ce guide au format PDF téléchargeable immédiatement, vous découvrirez comment structurer chaque page de votre site internet (page d'accueil, présentation de votre savoir-faire, fiches produits et prestations) avec une clarté remarquable :</p>\n<ul>\n  <li><strong>L'art de l'accroche percutante</strong> : Captiver l'attention de vos visiteurs dès les premières secondes de lecture grâce à un titre percutant.</li>\n  <li><strong>Structurer vos contenus pour la lecture sur écran</strong> : Utilisation stratégique des sous-titres (H2, H3), des paragraphes courts et des listes à puces pour maximiser le confort de lecture mobile.</li>\n  <li><strong>Trouver le bon ton de voix (Tone of Voice)</strong> : Exprimer votre passion et la noblesse de votre savoir-faire artisanal tout en restant accessible et chaleureux.</li>\n  <li><strong>Intégration naturelle des mots-clés SEO</strong> : Insérer efficacement des mots-clés locaux (ex: <em>menuisier Lille</em>, <em>créateur bijoux Comines</em>) sans dénaturer le style rédactionnel.</li>\n  <li><strong>Appels à l'action (CTA) incitatifs</strong> : Rédiger des boutons et des conclusions qui incitent naturellement à la prise de contact ou au devis.</li>\n</ul>\n\n<h3>Une méthode testée et approuvée pour les métiers manuels et créatifs</h3>\n<p>Que vous soyez ébéniste, céramiste, peintre en bâtiment, couturière ou créateur de bijoux, les principes transmis dans ce mini-guide reposent sur la psychologie du client local. Nous vous guidons pas à pas pour expliquer la valeur de vos matériaux, la précision de vos gestes et la garantie de votre travail sur mesure.</p>\n\n<p>En appliquant ces conseils, vous améliorerez naturellement votre positionnement dans la <a href=\"https://search.google.com/search-console\" target=\"_blank\" rel=\"noopener noreferrer\">Google Search Console</a> et donnerez une raison solide à vos prospects de vous contacter plutôt qu'un concurrent. Pour compléter votre démarche, découvrez également notre guide pour <a href=\"/produit/ebook-visibilite-ligne-artisan\">Bien Démarrer sa Visibilité en Ligne Quand on est Artisan</a> ou explorez l'ensemble de notre <a href=\"/boutique\">boutique de ressources digitales</a>.</p>\n\n<h3>À qui s'adresse ce mini-guide ?</h3>\n<p>Ce guide est 100% adapté aux débutants qui n'ont aucune expérience préalable en rédaction web ou en copywriting. Il convient parfaitement si :</p>\n<ul>\n  <li>Vous créez votre site vitrine ou votre boutique en ligne avec <a href=\"https://wordpress.org\" target=\"_blank\" rel=\"noopener noreferrer\">WordPress</a>.</li>\n  <li>Vous souhaitez réécrire les textes existants de votre site pour booster votre taux de conversion.</li>\n  <li>Vous voulez rédiger des fiches produits ou des articles de blog captivants pour vos clients du Nord de la France.</li>\n</ul>\n<p>Téléchargez votre exemplaire dès aujourd'hui et donnez à votre savoir-faire les mots qu'il mérite ! Si vous avez la moindre question, n'hésitez pas à nous écrire via notre <a href=\"/contact\">page de contact dédiée</a>.</p>",
    "features": [
      "Format PDF immédiatement téléchargeable et consultable sur smartphone",
      "Méthode de rédaction pas-à-pas adaptée aux artisans et créateurs",
      "Exemples de structures de pages vitrines et de fiches produits",
      "Intégration naturelle des mots-clés locaux pour booster le SEO"
    ],
    "downloadPdf": "/downloads/mini-guide-ecrire-web-artisan.pdf"
  },
  {
    "id": "mini-guide-comprendre-ses-stats-sans-etre-data-scientist",
    "title": "Mini-Guide : Comprendre ses stats sans être data scientist",
    "slug": "mini-guide-comprendre-ses-stats-sans-etre-data-scientist",
    "category": "ebook",
    "categoryLabel": "E-Book / Guide PDF",
    "price": 5,
    "rating": 5,
    "reviewsCount": 0,
    "badge": "NOUVEAUTÉ",
    "image": "/images/products/stats-page-4.webp",
    "imageAlt": "Analyser et comprendre ses statistiques web facilement - Guides digitaux - Métropole lilloise",
    "gallery": [
      "/images/products/stats-page-4.webp",
      "/images/products/stats-page-1.webp",
      "/images/products/stats-page-2.webp",
      "/images/products/stats-page-3.webp"
    ],
    "description": "Apprends à analyser les statistiques de ton site et de tes réseaux pour prendre de bonnes décisions sans t’emmêler les pinceaux.",
    "longDescription": "<h3>Reprenez le contrôle des performances de votre site internet</h3>\n<p>Posséder un site web ou une boutique en ligne quand on est artisan ou entrepreneur individuel dans la Métropole lilloise est une excellente étape. Mais savez-vous réellement ce que font vos visiteurs une fois arrivés sur votre site ? D'où viennent-ils ? Combien de temps restent-ils sur vos pages ? Quelles prestations suscitent le plus d'intérêt ? <strong>Comprendre ses statistiques web sans être un data scientist</strong> est le meilleur moyen d'arrêter de deviner et de commencer à prendre des décisions stratégiques rentables.</p>\n\n<p>De nombreux indépendants se sentent effrayés par la complexité des outils d'analyse comme <a href=\"https://analytics.google.com\" target=\"_blank\" rel=\"noopener noreferrer\">Google Analytics 4</a> ou la <a href=\"https://search.google.com/search-console\" target=\"_blank\" rel=\"noopener noreferrer\">Google Search Console</a>. Ce mini-guide synthétique dépoussière l'analyse de données web en traduisant le jargon technique en concepts simples et concrets pour les artisans.</p>\n\n<h3>Les indicateurs clés de performance (KPI) essentiels à suivre</h3>\n<p>Plutôt que de vous perdre dans des centaines de graphiques inutiles, ce guide se concentre uniquement sur les métriques qui ont un impact réel sur votre chiffre d'affaires :</p>\n<ul>\n  <li><strong>Les visiteurs uniques et sessions</strong> : Mesurer la portée réelle de votre site et l'évolution de votre visibilité au fil des mois.</li>\n  <li><strong>Les sources de trafic</strong> : Identifier si vos prospects proviennent de la recherche Google (SEO local), des réseaux sociaux ou de liens directs.</li>\n  <li><strong>Le taux de rebond et le temps passé par page</strong> : Comprendre si vos contenus retiennent l'attention ou si vos visiteurs quittent le site prématurément.</li>\n  <li><strong>Le taux de conversion (Demandes de devis / Ventes)</strong> : Calculer le pourcentage exact de visiteurs qui deviennent des prospects ou des clients.</li>\n  <li><strong>Les mots-clés de recherche réelle</strong> : Découvrir les expressions exactes tapées par vos prospects dans Google pour vous trouver.</li>\n</ul>\n\n<h3>Prendre de bonnes décisions pour faire grandir votre activité</h3>\n<p>L'objectif ultime de l'analyse statistique n'est pas de contempler des chiffres, mais d'ajuster vos actions marketing. Grâce aux conseils de ce manuel :</p>\n<ul>\n  <li>Vous saurez sur quels réseaux sociaux investir votre temps prioritairement.</li>\n  <li>Vous identifierez les pages de votre site qui nécessitent une réécriture ou un nouvel appel à l'action.</li>\n  <li>Vous pourrez mesurer le retour sur investissement de vos campagnes de référencement local ou d'acquisition.</li>\n</ul>\n\n<p>Pour aller plus loin dans l'optimisation de votre présence de proximité, consultez également notre mini-guide dédié au <a href=\"/produit/mini-guide-seo-local\">SEO Local et à la Fiche Google Business Profile</a>. Découvrez l'ensemble des outils pédagogiques disponibles sur notre <a href=\"/boutique\">boutique en ligne Guides Digitaux</a>.</p>\n\n<h3>Un guide pédagogique accessible à tous les débutants</h3>\n<p>Rédigé sans aucune formule mathématique ni jargon obscur, ce mini-guide est conçu pour une lecture rapide et une mise en pratique en moins d'une heure. Il s'adresse aux artisans, créateurs, thérapeutes et prestataires de services qui veulent suivre leur progression en toute autonomie. Téléchargez votre guide dès maintenant et transformez vos statistiques en levier de croissance ! Une question ? Écrivez-nous à tout moment via notre <a href=\"/contact\">formulaire de contact</a>.</p>",
    "features": [
      "Guide pas-à-pas d’analyse statistique pour artisans et indépendants",
      "Explication claire des métriques Google Analytics et Search Console",
      "Méthode simple pour identifier les canaux qui apportent des clients",
      "Format PDF clair et synthétique consultable sur tous vos écrans"
    ],
    "downloadPdf": "/downloads/1786958633139-mini-guide-comprendre-ses-stats-sans-etre-data-scientist.pdf"
  },
  {
    "id": "mini-guide-optimiser-ses-photos",
    "title": "Mini-Guide : Optimiser ses photos sans perdre en qualité",
    "slug": "mini-guide-optimiser-ses-photos",
    "category": "ebook",
    "categoryLabel": "E-Book / Guide PDF",
    "price": 5,
    "rating": 5,
    "reviewsCount": 0,
    "badge": "NOUVEAUTÉ",
    "image": "/images/products/photos-page-3.webp",
    "imageAlt": "Optimiser le poids des images et photos sans perte de qualité - Guides digitaux - Nord de la France",
    "gallery": [
      "/images/products/photos-page-3.webp",
      "/images/products/photos-page-1.webp",
      "/images/products/photos-page-2.webp"
    ],
    "description": "Réduis le poids de tes visuels pour accélérer le chargement de ton site tout en préservant une netteté irréprochable.",
    "longDescription": "<h3>Le problème n°1 qui ralentit les sites web d'artisans</h3>\n<p>En tant qu'artisan ou créateur dans le Nord de la France, vous prenez de magnifiques photos de vos réalisations, de vos chantiers ou de vos créations faites main. Mais lorsque vous téléversez directement les photos de votre smartphone ou appareil photo (pesant souvent entre 5 Mo et 15 Mo chacune) sur votre site WordPress, votre site devient extrêmement lent. <strong>Optimiser ses photos sans perdre en qualité</strong> est l'action technique la plus rentable pour accélérer votre site et plaire à Google.</p>\n\n<p>Un site lent fait fuir plus de 50% de vos visiteurs mobiles dès les 3 premières secondes. De plus, Google pénalise sévèrement les sites lents dans ses résultats de recherche locale. Ce mini-guide vous dévoile la méthode exacte pour diviser le poids de vos images par 10 tout en conservant des visuels éclatants et nets.</p>\n\n<h3>Ce que contient ce mini-guide d'optimisation visuelle</h3>\n<p>À travers des fiches pratiques et des illustrations étape par étape, vous apprendrez à maîtriser le traitement des images web :</p>\n<ul>\n  <li><strong>Les bonnes dimensions d'affichage</strong> : Redimensionner vos visuels aux tailles exactes requises pour le web (bannières, fiches produits, galeries d'artisan).</li>\n  <li><strong>Le comparatif des formats web modernes</strong> : Choisir le bon format entre WebP, JPEG et PNG selon le type d'image.</li>\n  <li><strong>La compression sans perte visible (Lossless / Lossy)</strong> : Réduire le poids de 80% sans qu'aucun œil humain ne perçoive de différence de qualité.</li>\n  <li><strong>Les outils gratuits et performants</strong> : Utiliser des solutions en ligne gratuites comme <a href=\"https://tinypng.com\" target=\"_blank\" rel=\"noopener noreferrer\">TinyPNG</a> ou des extensions <a href=\"https://wordpress.org\" target=\"_blank\" rel=\"noopener noreferrer\">WordPress</a> automatiques.</li>\n  <li><strong>L'optimisation des balises ALT pour le SEO</strong> : Rédiger des textes alternatifs descriptifs pour être bien référencé dans Google Images.</li>\n</ul>\n\n<h3>Un impact direct sur votre référencement et vos ventes</h3>\n<p>En appliquant les principes de ce guide :</p>\n<ul>\n  <li>Votre site chargera instantanément sur smartphone, même avec une faible connexion 4G.</li>\n  <li>Vous améliorerez votre score Core Web Vitals sur <a href=\"https://pagespeed.web.dev/\" target=\"_blank\" rel=\"noopener noreferrer\">Google PageSpeed Insights</a>.</li>\n  <li>Vos fiches produits WooCommerce seront plus fluides et agréables à parcourir.</li>\n</ul>\n\n<p>Pour parfaire l'ergonomie globale de votre site, découvrez notre <a href=\"/produit/checklist-les-principes-ux\">Checklist des Principes Clés UX</a> ou parcourez l'ensemble de nos outils sur la <a href=\"/boutique\">boutique Guides Digitaux</a>.</p>\n\n<h3>Un guide simple et accessible à tous</h3>\n<p>Pas besoin d'acheter Photoshop ni d'avoir un diplôme en graphisme ! Ce mini-guide PDF vous donne des solutions gratuites et rapides à mettre en œuvre. Téléchargez votre guide maintenant et offrez à votre site la vitesse qu'il mérite ! Pour toute question, contactez Stéphanie via notre <a href=\"/contact\">page de contact</a>.</p>",
    "features": [
      "Méthode simple pour réduire le poids de vos visuels jusqu’à -80%",
      "Sélection des meilleurs outils d’optimisation d’images gratuits",
      "Guide du format moderne WebP et du redimensionnement optimal",
      "Instructions concrètes pour optimiser vos balises ALT pour Google"
    ],
    "downloadPdf": "/downloads/1786958659305-mini-guide-optimiser-ses-photos-sans-perdre-en-qualite.pdf"
  },
  {
    "id": "mini-guide-seo-local",
    "title": "Mini-Guide : SEO Local — Être trouvé par les clients près de chez toi",
    "slug": "mini-guide-seo-local",
    "category": "ebook",
    "categoryLabel": "E-Book / Guide PDF",
    "price": 5,
    "rating": 5,
    "reviewsCount": 0,
    "badge": "NOUVEAUTÉ",
    "image": "/images/products/seo-page-6.webp",
    "imageAlt": "Stratégie de référencement naturel et SEO local sur Google Maps - Guides digitaux - Hauts-de-France",
    "gallery": [
      "/images/products/seo-page-6.webp",
      "/images/products/seo-page-1.webp",
      "/images/products/seo-page-2.webp",
      "/images/products/seo-page-3.webp",
      "/images/products/seo-page-4.webp",
      "/images/products/seo-page-5.webp"
    ],
    "description": "Optimise ta présence sur Google Maps et la recherche locale pour attirer des clients situés dans ta zone géographique.",
    "longDescription": "<h3>Le levier n°1 pour capter des clients dans votre ville et région</h3>\n<p>Pour un artisan, un commerçant ou un professionnel indépendant basé à Comines, Lille ou dans la région Hauts-de-France, 90% des nouveaux clients commencent par une recherche géographique sur internet. Taper <em>« menuisier près de chez moi »</em>, <em>« couturière Comines »</em> ou <em>« artisan peintre Métropole lilloise »</em> est devenu le reflexe quotidien de vos prospects. Le <strong>SEO Local et la maîtrise de Google Maps</strong> constituent le canal d'acquisition le plus rapide et le plus rentable qui existe.</p>\n\n<p>Pourtant, la majorité des indépendants négligent leur fiche d'établissement ou commettent des erreurs qui les rendent invisibles face à leurs concurrents. Ce mini-guide synthétique vous livre la feuille de route exacte pour vous hisser dans le \"Local Pack\" (le top 3 affiché sur Google Maps).</p>\n\n<h3>Ce que vous allez accomplir avec ce mini-guide</h3>\n<p>Conçu pour être mis en pratique immédiatement, ce guide vous accompagne pas à pas :</p>\n<ul>\n  <li><strong>Optimisation de la Fiche Google Business Profile</strong> : Remplir stratégiquement votre fiche <a href=\"https://business.google.com\" target=\"_blank\" rel=\"noopener noreferrer\">Google Business Profile</a> (nom, catégories principales et secondaires, description, zones de desserte).</li>\n  <li><strong>Stratégie de collecte et gestion des avis clients</strong> : Déployer un système simple pour obtenir régulièrement des avis 5 étoiles élogieux et savoir y répondre professionnellement.</li>\n  <li><strong>Ciblage des mots-clés géolocalisés</strong> : Choisir les expressions exactes associant votre métier à vos villes d'intervention (ex: <em>Lille, Comines, Armentières, Tourcoing</em>).</li>\n  <li><strong>Cohérence NAP (Name, Address, Phone)</strong> : Harmoniser vos coordonnées sur votre site web, les annuaires locaux et les réseaux sociaux.</li>\n  <li><strong>Photos et publications régulières</strong> : Mettre en valeur vos réalisations chantiers pour rassurer vos futurs clients.</li>\n</ul>\n\n<h3>Pourquoi le SEO local surpasse la publicité payante</h3>\n<p>Contrairement aux annonces payantes qui s'arrêtent dès que vous coupez votre budget, le référencement local crée un actif durable. Une fiche bien positionnée sur Google Maps vous apporte un flux régulier d'appels téléphoniques et de demandes de devis qualifiées chaque semaine, sans débourser un centime en publicité.</p>\n\n<p>Pour combiner votre SEO local avec un site vitrine performant, découvrez également notre <a href=\"/produit/ebook-visibilite-ligne-artisan\">Ebook : Bien Démarrer sa Visibilité en Ligne Quand on est Artisan</a> ou rejoignez notre précommande spéciale <a href=\"/tunnel/precommande-fiche-google\">Optimisation Fiche Google</a>. Retrouvez toutes nos solutions sur la <a href=\"/boutique\">boutique Guides Digitaux</a>.</p>\n\n<h3>Un guide accessible sans compétences techniques</h3>\n<p>Ce mini-guide PDF de mise en œuvre rapide est rédigé dans un langage clair et direct. Il s'adresse à tous les artisans et créateurs voulant être visibles dans leur zone géographique. Téléchargez votre guide dès maintenant et devenez l'artisan incontournable de votre ville ! Besoin de conseils sur-mesure ? Contactez-nous via notre <a href=\"/contact\">formulaire de contact</a>.</p>",
    "features": [
      "Guide d’optimisation pas-à-pas de votre fiche Google Business Profile",
      "Techniques concrètes pour récolter plus d’avis clients 5 étoiles",
      "Stratégie de mots-clés géolocalisés pour la recherche de proximité",
      "Checklist de déploiement rapide en 1 heure"
    ],
    "downloadPdf": "/downloads/1786961735239-mini-guide-seo-local.pdf"
  },
  {
    "id": "ebook-visibilite-ligne-artisan",
    "title": "Ebook : Bien Démarrer sa Visibilité en Ligne Quand on est Artisan",
    "slug": "ebook-visibilite-ligne-artisan",
    "category": "ebook",
    "categoryLabel": "E-Book / Guide PDF",
    "price": 15,
    "rating": 5,
    "reviewsCount": 0,
    "badge": "ESSENTIEL",
    "image": "/images/products/ebook-visibilite-ligne-artisan.png",
    "imageAlt": "Guide pratique pour bien démarrer sa visibilité en ligne quand on est artisan - Guides digitaux - Lille",
    "gallery": [
      "/images/products/ebook-visibilite-ligne-artisan.png",
      "/images/products/ebook-visibilite-ligne-artisan.webp"
    ],
    "description": "Le guide pratique pour attirer des clients sans perdre de temps, surtout quand on n’est pas à l’aise avec la tech.",
    "longDescription": "<h3>Le manuel stratégique complet pour réussir sur Internet</h3>\n<p>Lancer ou développer son activité d'artisan, de créateur ou d'indépendant est une aventure passionnante mais exigeante. Aujourd'hui, avoir un savoir-faire d'exception ne suffit plus si personne ne vous trouve sur le web. Cependant, entre les réseaux sociaux, la création de site internet, le SEO, les avis clients et la publicité, il est très facile de se sentir submergé et de perdre un temps précieux. Ce livre numérique fondateur, <strong>« Bien Démarrer sa Visibilité en Ligne Quand on est Artisan »</strong>, a été conçu pour poser des fondations solides et claires, sans stress et sans jargon.</p>\n\n<p>Pensé par Stéphanie Rocq de <a href=\"/a-propos\">Stratec Digital & Guides Digitaux</a>, cet e-book va droit au but : vous donner une méthode étape par étape pour construire une présence digitale cohérente qui attire régulièrement des clients qualifiés.</p>\n\n<h3>Les 4 piliers fondamentaux abordés dans cet e-book</h3>\n<p>Ce livre électronique s'articule autour d'un parcours logique pensé pour les métiers manuels et créatifs :</p>\n<ul>\n  <li><strong>Pilier 1 : Définir sa proposition de valeur et sa cible</strong> : Identifier clairement ce qui vous différencie de la concurrence et comprendre qui sont vos clients idéaux dans le Nord et la Métropole lilloise.</li>\n  <li><strong>Pilier 2 : Bâtir son socle digital (Site Vitrine & Fiche Google)</strong> : Les règles d'or pour créer ou faire créer un site vitrine professionnel sous <a href=\"https://wordpress.org\" target=\"_blank\" rel=\"noopener noreferrer\">WordPress</a> et piloter votre <a href=\"https://business.google.com\" target=\"_blank\" rel=\"noopener noreferrer\">Fiche Google Business</a>.</li>\n  <li><strong>Pilier 3 : Développer sa visibilité locale & réseaux sociaux</strong> : Sélectionner les canaux pertinents (Instagram, Facebook, Google Maps) sans y passer 3 heures par jour.</li>\n  <li><strong>Pilier 4 : Convertir les visiteurs en clients fidèles</strong> : Mettre en place des moyens simples de prise de rendez-vous, d'envoi de devis et d'encaissement sécurisé avec <a href=\"https://stripe.com\" target=\"_blank\" rel=\"noopener noreferrer\">Stripe</a>.</li>\n</ul>\n\n<h3>Pourquoi cet e-book est différent des guides théoriques</h3>\n<p>La plupart des livres sur le marketing digital s'adressent à de grandes entreprises avec des budgets colossaux. Cet e-book a été écrit exclusivement pour la réalité des artisans : budgets maîtrisés, temps limité et besoin de résultats tangibles. Vous y trouverez des fiches d'action prêtes à l'emploi, des exemples d'artisans inspirants et des conseils de bon sens.</p>\n\n<p>Pour passer à l'action supérieure et créer vous-même votre site vitrine ou e-commerce, découvrez notre <a href=\"/produit/bundle-vitrine-boutique-wordpress-le-combo-pour-vendre-en-ligne\">Bundle Formation Vitrine + Boutique WooCommerce</a> ou explorez l'ensemble de notre <a href=\"/boutique\">boutique de guides digitaux</a>.</p>\n\n<h3>Un investissement immédiatement rentable</h3>\n<p>En téléchargeant cet e-book au format PDF consultable à vie sur tous vos appareils, vous évitez les erreurs coûteuses et gagnez des mois de tâtonnements. Prenez votre visibilité en main dès aujourd'hui ! Une question avant d'acheter ? Contactez-nous à tout moment via notre <a href=\"/contact\">page de contact</a>.</p>",
    "features": [
      "Manuel complet de stratégie digitale structuré en 4 piliers fondamentaux",
      "Conseils 100% adaptés aux artisans, créateurs et métiers manuels",
      "Fiches d’action guidées et exemples d’artisans inspirants",
      "Format PDF téléchargeable et consultable à vie sur tous vos appareils"
    ],
    "downloadPdf": "/downloads/1786961735239-ebook-visibilite-ligne-artisan.pdf"
  },
  {
    "id": "checklist-securite-anti-spam-wordpress",
    "title": "Checklist : Sécurité & Anti-Spam WordPress",
    "slug": "checklist-securite-anti-spam-wordpress",
    "category": "checklist",
    "categoryLabel": "Checklist Digital",
    "price": 3,
    "rating": 5,
    "reviewsCount": 0,
    "badge": "PRATIQUE",
    "image": "/images/products/checklist-securite-anti-spam-wordpress.webp",
    "imageAlt": "Checklist de sécurité anti-piratage et anti-spam WordPress - Guides digitaux - Nord (59)",
    "description": "La grille de contrôle essentielle pour immuniser ton site WordPress contre les piratages automatisés, sécuriser tes formulaires de contact et protéger la réputation de ton entreprise d’artisan.",
    "longDescription": "<h3>Ne laisse pas les hackers et les spambots détruire la réputation de ton site d'artisan</h3>\n<p>Un site internet indisponible, affichant une page blanche ou infecté par des spams de redirections douteuses peut ruiner des mois d'efforts et faire fuir tes prospects en quelques secondes. Beaucoup d'artisans, de créateurs et d'indépendants dans le Nord et la Métropole lilloise pensent à tort que leur site vitrine n'intéresse pas les pirates informatiques. C'est une idée reçue extrêmement dangereuse ! Sur Internet, les attaques ne sont pas ciblées à la main : ce sont des robots automatisés (botnets) qui scandent et attaquent quotidiennement des milliers de sites sous <a href=\"https://wordpress.org\" target=\"_blank\" rel=\"noopener noreferrer\">WordPress</a> à la recherche de failles non colmatées.</p>\n\n<p>Chaque jour sans protection adéquate, ton formulaire de contact risque d'être bombardé de messages indésirables, ou pire, ton site peut servir de relais pour des attaques malveillantes sans que tu ne t'en rendes compte. La <strong>Checklist Sécurité & Anti-Spam WordPress</strong> a été spécialement créée pour te donner une feuille de route simple, claire et accessible sans aucune connaissance préalable en développement web.</p>\n\n<h3>Les 5 piliers fondamentaux de la sécurité WordPress passés au crible</h3>\n<p>Cette grille de contrôle interactive te guide pas-à-pas pour vérifier et verrouiller chaque point névralgique de ton site web :</p>\n<ul>\n  <li><strong>Pilier 1 : Sauvegardes automatiques et protocole de restauration d'urgence</strong> : Mettre en place des sauvegardes régulières et automatisées sur un serveur distant sécurisé grâce à des extensions certifiées comme <a href=\"https://updraftplus.com/\" target=\"_blank\" rel=\"noopener noreferrer\">UpdraftPlus</a>, et tester au moins une fois la procédure de restauration pour parer à tout crash.</li>\n  <li><strong>Pilier 2 : Protection des formulaires de contact et filtrage anti-spam intelligent</strong> : Éliminer 99,9 % des spambots sur tes formulaires de devis et espace commentaires grâce à des pièges à robots (Honeypot) et des outils comme <a href=\"https://akismet.com/\" target=\"_blank\" rel=\"noopener noreferrer\">Akismet</a> ou Cloudflare Turnstile, sans imposer de Captcha illisible qui décourage tes vrais clients.</li>\n  <li><strong>Pilier 3 : Verrouillage des accès d'administration & Double Authentification (2FA)</strong> : Supprimer le compte administrateur « admin » par défaut, modifier l'URL d'accès au back-office, imposer des mots de passe ultra-sécurisés et limiter le nombre de tentatives de connexion échouées (Limit Login Attempts).</li>\n  <li><strong>Pilier 4 : Maintenance préventive & mises à jour du cœur WordPress, thèmes et plugins</strong> : Établir une routine de mise à jour mensuelle sans risque pour colmataer immédiatement les failles de sécurité (CVE) récemment découvertes sur tes extensions.</li>\n  <li><strong>Pilier 5 : Sécurisation de la base de données & Conformité aux normes de protection</strong> : Modifier le préfixe de base de données par défaut (`wp_`), désactiver l'éditeur de fichier interne et appliquer les bonnes pratiques recommandées par l'<a href=\"https://www.ssi.gouv.fr/\" target=\"_blank\" rel=\"noopener noreferrer\">ANSSI (Agence Nationale de la Sécurité des Systèmes d'Information)</a> et la <a href=\"https://www.cybermalveillance.gouv.fr/\" target=\"_blank\" rel=\"noopener noreferrer\">Plateforme Nationale Cybermalveillance</a>.</li>\n</ul>\n\n<h3>Pourquoi cette checklist est un investissement indispensable pour ton activité</h3>\n<p>Faire réparer un site piraté par un prestataire informatique coûte généralement entre 300 € et 1 500 €, sans compter la perte de chiffre d'affaires pendant la coupure. En appliquant cette checklist en moins de 30 minutes :</p>\n<ul>\n  <li>Tu nettoies définitivement ta boîte mail des dizaines de spams quotidiens.</li>\n  <li>Tu garantis la confidentialité des données personnelles de tes clients conformément au RGPD préconisé par la <a href=\"https://www.cnil.fr/\" target=\"_blank\" rel=\"noopener noreferrer\">CNIL</a>.</li>\n  <li>Tu offres à ton entreprise artisanale un niveau de protection pro digne d'une grande structure.</li>\n</ul>\n\n<p>Pour construire des fondations solides et inscrire ton site dans une véritable démarche de conversion globale, associe cette checklist à notre <a href=\"/produit/ebook-visibilite-ligne-artisan\">Ebook Visibilité en Ligne Artisan</a>. Si tu souhaites apprendre à maîtriser l'ensemble de la plateforme de A à Z, découvre notre <a href=\"/produit/formation-wordpress\">Formation Vidéo Vitrine WordPress</a>. Retrouve également l'intégralité de nos guides dans notre <a href=\"/produit/pack-guides\">Pack Guides Utiles Création de Site</a> accessible sur la <a href=\"/boutique\">boutique digitale Guides Digitaux</a>.</p>\n\n<h3>Un format PDF dynamique, clair et réutilisable à vie</h3>\n<p>Disponible en téléchargement immédiat au format PDF interactif ou imprimable, cette checklist te permet de cocher chaque point directement sur ton écran. Une question sur la mise en place d'une extension de sécurité ? Stéphanie et l'équipe sont à ton écoute via la <a href=\"/contact\">page de contact</a>.</p>",
    "features": [
      "Checklist dynamique à cocher pour immuniser ton site WordPress",
      "Protocole anti-spam complet pour formulaires de contact sans Captcha complexe",
      "Guide pas-à-pas de sauvegarde automatique et de restauration d'urgence",
      "Conseils de sécurité alignés avec les recommandations ANSSI et RGPD"
    ],
    "downloadPdf": "/downloads/1786958808414-checklist-securite-et-anti-spam-wordpress.pdf"
  },
  {
    "id": "checklist-les-principes-ux",
    "title": "Checklist : les principes clés de l’expérience utilisateur (obligatoire pour ton site)",
    "slug": "checklist-les-principes-ux",
    "category": "checklist",
    "categoryLabel": "Checklist Digital",
    "price": 3,
    "rating": 5,
    "reviewsCount": 0,
    "badge": "RECOMMANDÉ",
    "image": "/images/products/checklist-les-principes-ux.webp",
    "imageAlt": "Principes clés de l’expérience utilisateur UX pour site web - Guides digitaux - Comines",
    "description": "La méthode pas-à-pas pour transformer ton site vitrine ou e-commerce en machine à convertir : optimise l’ergonomie, la lisibilité mobile et la réassurance pour captiver tes visiteurs et déclencher des demandes de devis.",
    "longDescription": "<h3>Ne perds plus aucun prospect qualifié à cause d'une mauvaise expérience utilisateur</h3>\n<p>L'Expérience Utilisateur (ou UX pour <em>User Experience</em>) désigne l'ensemble des impressions, de la facilité de navigation et du confort ressentis par un internaute lorsqu'il parcourt ton site internet. Aujourd'hui, avoir de magnifiques photos de tes réalisations d'artisan ou des tarifs compétitifs ne suffit plus : si ton bouton de contact est masqué, si ton texte est trop petit sur smartphone ou si ton menu de navigation est confus, le visiteur quittera ton site en moins de 3 secondes pour aller chez un concurrent. La <strong>Checklist des Principes Clés UX pour Site Web Artisan</strong> est la grille d'évaluation indispensable pour auditer ton site et le transformer en véritable générateur de demandes de devis.</p>\n\n<p>Conçue spécifiquement pour la réalité des artisans, créateurs et indépendants de la Métropole lilloise et du Nord, cette checklist s'appuie sur les normes internationales d'ergonomie et d'accessibilité dictées par le <a href=\"https://www.w3.org/WAI/\" target=\"_blank\" rel=\"noopener noreferrer\">W3C Web Accessibility Initiative (WAI)</a> et les études d'utilisabilité du <a href=\"https://www.nngroup.com/\" target=\"_blank\" rel=\"noopener noreferrer\">Nielsen Norman Group (NNGroup)</a>.</p>\n\n<h3>Les 5 règles d'or de l'ergonomie web et de la conversion passées en revue</h3>\n<p>Grâce à des items clairs et concrets à cocher, passe ton site au crible pour garantir une expérience sans friction :</p>\n<ul>\n  <li><strong>Règle 1 : Ergonomie Mobile & Touch-First Design</strong> : S'assurer que tous les boutons cliquables mesurent au moins 48px de hauteur pour un confort au pouce sur écran tactile, et vérifier que la vitesse d'affichage respecte les indicateurs <a href=\"https://web.dev/vitals/\" target=\"_blank\" rel=\"noopener noreferrer\">Google Core Web Vitals</a> (LCP, CLS, FID) mesurés sur <a href=\"https://pagespeed.web.dev/\" target=\"_blank\" rel=\"noopener noreferrer\">Google PageSpeed Insights</a>.</li>\n  <li><strong>Règle 2 : Structuration selon le schéma de lecture en F & Hiérarchie visuelle</strong> : Organiser tes contenus avec une hiérarchie de titres limpide (H1, H2, H3), des contrastes de couleurs WCAG 2.1 élevés et des paragraphes aérés pour guider naturellement le regard de l'internaute vers l'action.</li>\n  <li><strong>Règle 3 : Clarté de la proposition de valeur & Positionnement des boutons d'action (CTA)</strong> : Placer dès le premier écran (au-dessus de la ligne de flottaison) ton titre d'accroche métier (« Qui tu es », « Ce que tu apportes », « Où tu interviens ») et un bouton d'action bien visible (« Demander un devis gratuit », « Appeler l'artisan »).</li>\n  <li><strong>Règle 4 : Blocs de réassurance locale & Éléments de confiance immédiats</strong> : Mettre en avant tes certifications professionnelles, assurances décennales, avis clients vérifiés Google et coordonnées complètes (adresse, téléphone, horaires) dans le pied de page et les pages clés.</li>\n  <li><strong>Règle 5 : Simplification des formulaires de contact et suppression des frictions</strong> : Réduire au strict minimum les champs demandés dans tes formulaires pour multiplier jusqu'à 2,5x le nombre de messages reçus.</li>\n</ul>\n\n<h3>Transformez votre trafic habituel en demandes de devis réelles</h3>\n<p>Plutôt que de dépenser des centaines d'euros en publicité pour faire venir plus de monde sur un site mal optimisé, améliorer l'UX de ton site actuel est le levier le plus rapide et le plus économique pour doubler tes contacts. En appliquant cette checklist :</p>\n<ul>\n  <li>Tu diminues drastiquement le taux de rebond de ton site sur mobile.</li>\n  <li>Tu facilites le parcours de décision de tes prospects locaux.</li>\n  <li>Tu renvoies une image haut de gamme, moderne et rassurante de ton savoir-faire artisan.</li>\n</ul>\n\n<p>Pour alléger tes visuels avant de valider l'ergonomie, combine cette checklist avec notre <a href=\"/produit/mini-guide-optimiser-ses-photos\">Mini-Guide Optimiser ses Photos</a> et le <a href=\"/produit/mini-guide-seo-local\">Mini-Guide SEO Local</a>. Si tu souhaites lancer ou refondre ta boutique e-commerce, découvre notre <a href=\"/produit/formation-ajouter-une-boutique-en-ligne-avec-woocommerce\">Formation WooCommerce</a> ou opte pour le <a href=\"/produit/bundle-vitrine-boutique-wordpress-le-combo-pour-vendre-en-ligne\">Bundle Vitrine + E-commerce</a>. Retrouve l'ensemble de nos outils sur la <a href=\"/boutique\">boutique Guides Digitaux</a>.</p>\n\n<h3>Un format PDF dynamique prêt à l'emploi</h3>\n<p>Télécharge ta checklist immédiatement après commande au format PDF interactif ou imprimable et évalue ton site web en moins de 20 minutes ! Une hésitation sur un choix de mise en page ? Écris à Stéphanie via notre <a href=\"/contact\">page de contact</a>.</p>",
    "features": [
      "Checklist d’ergonomie et d’expérience utilisateur (UX) spécial artisans",
      "Grille d'évaluation conforme aux normes W3C WAI et Google Core Web Vitals",
      "Optimisation de la lisibilité mobile, de la hiérarchie visuelle et des boutons CTA",
      "Format dynamique à cocher et imprimable pour une révision immédiata"
    ],
    "downloadPdf": "/downloads/1786959220933-checklist-obligatoire-pour-ton-site-les-principes-cles-de-l-ux.pdf"
  },
  {
    "id": "checklist-profil-reseaux-sociaux",
    "title": "Checklist : Profil réseaux sociaux pro",
    "slug": "checklist-profil-reseaux-sociaux",
    "category": "checklist",
    "categoryLabel": "Checklist Digital",
    "price": 3,
    "rating": 5,
    "reviewsCount": 0,
    "badge": "PRATIQUE",
    "image": "/images/products/checklist-profil-reseaux-sociaux.webp",
    "imageAlt": "Checklist d’optimisation de profil professionnel sur réseaux sociaux - Guides digitaux - Métropole lilloise",
    "description": "La grille d'audit essentielle en 40 points de contrôle pour configurer tes profils Instagram, Facebook et LinkedIn pro, captiver tes visiteurs et les convertir en clients fidèles.",
    "longDescription": "<h3>Ne laisse plus une mauvaise biographie faire fuir tes abonnés réseaux sociaux</h3>\n<p>Pour un artisan, un créateur fait-main ou un professionnel indépendant exerçant dans le Nord et la Métropole lilloise, les réseaux sociaux comme Instagram, Facebook ou LinkedIn constituent une vitrine permanente et incontournable. Chaque jour, des dizaines d'habitants de ta ville et de futurs clients découvrent tes réels, tes photos d'atelier ou tes publications de réalisations. Mais lorsque l'un de ces prospects intrigués clique sur ton profil pour en savoir plus, que découvre-t-il ? S'il tombe sur une biographie floue, des liens cassés, une photo de profil floue ou des boutons de contact manquants, tu perds immédiatement une vente ou une demande de devis au profit d'un concurrent mieux préparé. La <strong>Checklist Profil Réseaux Sociaux Pro</strong> est la méthode pas-à-pas en 40 points de contrôle pour transformer tes comptes sociaux en aimants à clients qualifiés.</p>\n\n<p>Pensée spécifiquement pour la réalité des métiers manuels, créatifs et des indépendants, cette grille d'audit dynamique te donne toutes les clés du neuromarketing et de l'ergonomie mobile appliquée aux médias sociaux.</p>\n\n<h3>Les 5 piliers d'une présence sociale irréprochable et rentable</h3>\n\n<p>Passe en revue chaque module de contrôle interactif pour optimiser tes profils de A à Z :</p>\n\n<ul>\n  <li><strong>Pilier 1 : Biographie percutante & Mots-clés métiers géolocalisés</strong> : Rédiger une biographie concise et percutante structurée en 3 lignes (« Qui tu es », « Quel problème tu résous », « Où tu interviens avec tes mots-clés locaux comme <em>Lille, Roubaix, Marcq-en-Barœul</em> ») et insérer un appel à l'action direct (CTA) vers ton lien principal.</li>\n  <li><strong>Pilier 2 : Photo de profil pro & Cohérence visuelle de marque</strong> : Sélectionner un logo haute définition ou une photo de profil souriante et éclairée, et harmoniser la palette de couleurs et la typographie de tes visuels grâce à notre <a href=\"/produit/mini-guide-optimiser-ses-photos\">Mini-Guide Optimiser ses Photos</a>.</li>\n  <li><strong>Pilier 3 : Structuration des Stories à la une (Highlights) & Contenus Épinglés</strong> : Organiser tes Highlights sur <a href=\"https://instagram.com\" target=\"_blank\" rel=\"noopener noreferrer\">Instagram</a> et ta page <a href=\"https://facebook.com\" target=\"_blank\" rel=\"noopener noreferrer\">Facebook</a> en 4 à 5 catégories indispensables (Avis clients vérifiés, Grille de tarifs, Coulisses d'atelier, FAQ & Prise de RDV) et épingler 3 posts stratégiques en haut de ton feed.</li>\n  <li><strong>Pilier 4 : Configuration des Boutons de Contact Direct & Liens Multiples (Link-in-bio)</strong> : Activer les boutons d'action professionnels (Appeler, E-mail, Itinéraire, <a href=\"https://whatsapp.com\" target=\"_blank\" rel=\"noopener noreferrer\">WhatsApp Business</a>) et mettre en place une page de liens optimisée redirigeant vers ton site vitrine ou ta boutique e-commerce.</li>\n  <li><strong>Pilier 5 : Automatisation de la Messagerie Privée & Modèles de Réponse Rapides</strong> : Paramétrer les réponses automatiques d'accueil sur <a href=\"https://business.facebook.com\" target=\"_blank\" rel=\"noopener noreferrer\">Meta Business Suite</a> et préparer des modèles de messages pour répondre instantanément aux demandes de devis fréquentes sans y passer tes soirées.</li>\n</ul>\n\n<h3>Pourquoi cette checklist est un levier de conversion immédiat pour ton activité</h3>\n<p>Contrairement aux idées reçues, accumuler des milliers d'abonnés ne sert à rien si tes profils ne sont pas optimisés pour convertir le trafic en acheteurs réels. En consacrant 20 minutes à cette checklist :</p>\n<ul>\n  <li>Tu transmets immédiatement une image haut de gamme, moderne et rassurante de ton savoir-faire artisan.</li>\n  <li>Tu facilites le passage à l'acte de tes visiteurs en réduisant le nombre de clics nécessaires pour te contacter.</li>\n  <li>Tu réorientes efficacement le trafic de tes réseaux sociaux vers ton site web ou ta boutique en ligne.</li>\n</ul>\n\n<p>Pour relier tes réseaux sociaux à une stratégie digitale globale et pérenne, combine cette checklist avec notre <a href=\"/produit/ebook-visibilite-ligne-artisan\">Ebook Visibilité en Ligne Artisan</a> et évalue l'ergonomie de ton site avec la <a href=\"/produit/checklist-les-principes-ux\">Checklist des Principes Clés UX</a>. Pour apprendre à rédiger des textes captivants, consulte notre <a href=\"/produit/mini-guide-ecrire-web-artisan\">Mini-Guide Rédaction Web Artisan</a> ou retrouve l'ensemble de nos outils dans le <a href=\"/produit/pack-guides\">Pack Guides Utiles Création de Site</a> sur la <a href=\"/boutique\">boutique Guides Digitaux</a>.</p>\n\n<h3>Format PDF dynamique interactif à cocher et imprimable</h3>\n<p>Disponible en téléchargement immédiat au format PDF interactif utilisable sur smartphone, tablette et ordinateur, ou imprimable. Une question sur le paramétrage de ton profil pro ? Écris directement à Stéphanie sur la <a href=\"/contact\">page de contact</a>.</p>",
    "features": [
      "Checklist de configuration complète pour Instagram, Facebook et LinkedIn",
      "Optimisation de la biographie, de la photo pro et des boutons de contact",
      "Guide d’organisation des Stories à la une (Highlights) et du feed",
      "Conseils pour paramétrer la messagerie et les réponses automatiques"
    ],
    "downloadPdf": "/downloads/1786959425575-checklist-profil-pro-rs.pdf"
  },
  {
    "id": "checklist-verification-lancement-site",
    "title": "Checklist : Vérification avant le lancement du site",
    "slug": "checklist-verification-lancement-site",
    "category": "checklist",
    "categoryLabel": "Checklist Digital",
    "price": 3,
    "rating": 5,
    "reviewsCount": 0,
    "badge": "INCONTOURNABLE",
    "image": "/images/uploads/1786962171965-checklist-a-verifier-avant-le-lancement-du-site.webp",
    "imageAlt": "Checklist d'audit et de vérification complète avant mise en ligne de site web artisan - Guides digitaux",
    "description": "La grille d'audit ultime de 50 points de contrôle pour tester ton site vitrine ou e-commerce avant sa mise en ligne officielle : zéro lien cassé, zéro erreur SEO, zéro pénalité Google.",
    "longDescription": "<h3>Ne gâche pas le lancement officiel de ton site d'artisan par des erreurs invisibles</h3>\n<p>Créer ou refondre son site internet d'artisan, de créateur ou d'indépendant représente des dizaines d'heures de travail passionné. Mais au moment d'appuyer sur le bouton « Publier » ou d'ouvrir le site au public, le stress monte : es-tu certain que tous tes formulaires fonctionnent ? Que tes liens ne renvoient pas vers des erreurs 404 ? Que ton site s'affiche parfaitement sur smartphone et qu'aucun texte de démonstration (<em>Lorem Ipsum</em>) n'est resté caché sur une page secondaire ? La <strong>Checklist de Vérification avant le Lancement du Site</strong> est la grille d'audit méthodique indispensable pour passer ton site au crible et garantir un lancement zéro défaut.</p>\n\n<p>Utilisée par les professionnels du web et les agences digitales de la Métropole lilloise et du Nord, cette liste de contrôle rassemble plus de 50 points d'audit technique, SEO et ergonomique avant la mise en ligne officielle.</p>\n\n<h3>Les 6 phases clés d'audit et de recette avant ouverture au public</h3>\n<p>Passe en revue chaque module de contrôle interactif pour sécuriser ton lancement :</p>\n<ul>\n  <li><strong>Phase 1 : Audit Technique, Sécurité & Sauvegarde initiale</strong> : Vérifier la présence et la validité du certificat SSL/HTTPS, s'assurer du blocage des spambots sur les formulaires grâce à notre <a href=\"/produit/checklist-securite-anti-spam-wordpress\">Checklist Sécurité & Anti-Spam WordPress</a>, désactiver la visibilité des moteurs de recherche en mode recette et effectuer une sauvegarde complète de la base de données sous <a href=\"https://wordpress.org\" target=\"_blank\" rel=\"noopener noreferrer\">WordPress</a>.</li>\n  <li><strong>Phase 2 : Audit Référencement Naturel (SEO Local) & Indexation Google</strong> : S'assurer de la présence d'une balise Title unique et d'une Meta-description attractive sur chaque page, vérifier l'arborescence (H1, H2, H3), tester la génération du sitemap XML et sa soumission sur la <a href=\"https://search.google.com/search-console\" target=\"_blank\" rel=\"noopener noreferrer\">Google Search Console</a>, et relier le site à la Fiche <a href=\"https://business.google.com\" target=\"_blank\" rel=\"noopener noreferrer\">Google Business Profile</a>.</li>\n  <li><strong>Phase 3 : Recette Mobile & Ergonomie Utilisateur (UX)</strong> : Tester l'affichage responsive sur smartphones iOS et Android, vérifier la taille des zones cliquables selon la <a href=\"/produit/checklist-les-principes-ux\">Checklist des Principes Clés UX</a> et s'aligner sur les directives du <a href=\"https://www.w3.org/WAI/\" target=\"_blank\" rel=\"noopener noreferrer\">W3C Web Accessibility Initiative</a>.</li>\n  <li><strong>Phase 4 : Validation des Formulaires, Panier & Tunnel de Paiement</strong> : Envoyer un message de test sur chaque formulaire de contact, vérifier la réception des notifications mails sur ta boîte professionnelle, et effectuer une commande de test en mode réel sur <a href=\"https://stripe.com\" target=\"_blank\" rel=\"noopener noreferrer\">Stripe</a> ou PayPal si tu gères une boutique <a href=\"https://woocommerce.com\" target=\"_blank\" rel=\"noopener noreferrer\">WooCommerce</a>.</li>\n  <li><strong>Phase 5 : Vitesse d'Affichage & Métriques Core Web Vitals</strong> : Optimiser le poids de chaque visuel en suivant notre <a href=\"/produit/mini-guide-optimiser-ses-photos\">Mini-Guide Optimiser ses Photos</a> et valider la vitesse sur <a href=\"https://pagespeed.web.dev/\" target=\"_blank\" rel=\"noopener noreferrer\">Google PageSpeed Insights</a> (score vert exigé).</li>\n  <li><strong>Phase 6 : Conformité Juridique RGPD & Mentions Légales</strong> : Rédiger la page Mentions Légales, intégrer la Politique de Confidentialité obligatoire préconisée par la <a href=\"https://www.cnil.fr/\" target=\"_blank\" rel=\"noopener noreferrer\">CNIL</a> et configurer le bandeau de consentement aux cookies.</li>\n</ul>\n\n<h3>Pourquoi cette checklist est ton assurance sérénité absolue</h3>\n<p>Une seule erreur d'indexation ou un lien cassé sur ton bouton de devis peut te faire perdre des milliers d'euros de chantiers ou de commandes d'artisan. En consacrant 45 minutes à cette checklist avant ton lancement :</p>\n<ul>\n  <li>Tu offres immédiatement une expérience irréprochable et professionnelle à tes premiers visiteurs.</li>\n  <li>Tu évites les pénalités de référencement Google dues aux erreurs 404 ou aux pages dupliquées.</li>\n  <li>Tu lances ton activité en ligne l'esprit totalement serein.</li>\n</ul>\n\n<p>Pour construire une stratégie digitale globale avant le lancement, consulte notre <a href=\"/produit/ebook-visibilite-ligne-artisan\">Ebook Visibilité en Ligne Artisan</a> et apprends à piloter ton site de A à Z avec la <a href=\"/produit/formation-wordpress\">Formation Vidéo Vitrine WordPress</a>. Retrouve l'ensemble de nos checklists et guides regroupés dans le <a href=\"/produit/pack-guides\">Pack Guides Utiles Création de Site</a> sur la <a href=\"/boutique\">boutique Guides Digitaux</a>.</p>\n\n<h3>Format PDF interactif à cocher et imprimable</h3>\n<p>Disponible en téléchargement immédiat au format PDF interactif utilisable sur ordinateur, tablette ou imprimable. Une question technique sur l'une des étapes de vérification ? Écris directement à Stéphanie sur la <a href=\"/contact\">page de contact</a>.</p>",
    "features": [
      "Grille d’audit complète de 50 points de contrôle avant la mise en ligne",
      "Vérification technique, SEO local, ergonomie mobile et formulaires",
      "Recette du tunnel de paiement et de la conformité juridique RGPD / CNIL",
      "Format PDF dynamique interactif à cocher et imprimable"
    ],
    "downloadPdf": "/downloads/1786961163702-checklist-a-verifier-avant-le-lancement-du-site.pdf"
  },
  {
    "id": "checklist-google-business-profile",
    "title": "Checklist : Optimisation Google Business Profile",
    "slug": "checklist-google-business-profile",
    "category": "checklist",
    "categoryLabel": "Checklist Digital",
    "price": 3,
    "rating": 5,
    "reviewsCount": 0,
    "badge": "TOP CONVERSION",
    "image": "/images/uploads/1786961766754-checklist-optimisation-fiche-google-business-profile---2.webp",
    "imageAlt": "Checklist d'optimisation de Fiche Google Business Profile pour artisan et commerce local - Guides digitaux",
    "description": "La grille de contrôle pas-à-pas pour positionner ta Fiche Google Business Profile au sommet du Local 3-Pack de Google Maps et capter les clients de ta ville.",
    "longDescription": "<h3>Domine les recherches locales sur Google Maps et devance tes concurrents</h3>\n<p>Pour un artisan, un créateur ou un indépendant exerçant dans la Métropole lilloise, le Nord ou le Pas-de-Calais, ta Fiche <a href=\"https://business.google.com\" target=\"_blank\" rel=\"noopener noreferrer\">Google Business Profile</a> (anciennement Google My Business) est ton canal d'acquisition client n°1. Lorsqu'un habitant cherche un ébéniste, un céramiste, un plombier ou un couturier à proximité, Google affiche prioritairement la carte <a href=\"https://maps.google.com\" target=\"_blank\" rel=\"noopener noreferrer\">Google Maps</a> et son fameux <strong>Local 3-Pack</strong> (les 3 premiers résultats géolocalisés). Si ta fiche est incomplète, mal optimisée ou dépourvue d'avis récents, tu laisses filer des dizaines de prospects qualifiés chaque semaine chez tes concurrents directes.</p>\n\n<p>La <strong>Checklist d'Optimisation Google Business Profile</strong> a été spécialement développée pour te donner une feuille de route pas-à-pas en 30 points d'audit pour hisser ton entreprise locale au sommet des résultats de recherche.</p>\n\n<h3>Les 5 phases stratégiques pour transformer ta Fiche Google en aimant à clients</h3>\n\n<p>Passe en revue chaque module d'optimisation dynamique pour verrouiller ta visibilité géolocalisée :</p>\n\n<ul>\n  <li><strong>Phase 1 : Configuration des informations NAP (Nom, Adresse, Téléphone) & Catégorie principale</strong> : Valider la cohérence absolue du Nom, de l'Adresse et du Numéro de téléphone (données NAP) sur l'ensemble du web, sélectionner la catégorie métier principale exacte préconisée par le <a href=\"https://support.google.com/business\" target=\"_blank\" rel=\"noopener noreferrer\">Centre d'aide Google Business</a> et ajouter des catégories secondaires pertinentes.</li>\n  <li><strong>Phase 2 : Rédaction de la description d'entreprise optimisée SEO Local</strong> : Rédiger un texte de présentation captivant de 750 caractères intégrant ton savoir-faire, tes zones d'intervention exactes (ex: <em>Lille, Roubaix, Tourcoing, Marcq-en-Barœul, Seclin</em>) et tes mots-clés stratégiques.</li>\n  <li><strong>Phase 3 : Galerie photo HD géolocalisée & Mise en valeur du savoir-faire</strong> : Téléverser des photos Haute Définition de tes chantiers, de tes créations et de ton équipe (optimisées au préalable grâce à notre <a href=\"/produit/mini-guide-optimiser-ses-photos\">Mini-Guide Optimiser ses Photos</a>) et ajouter ton logo ainsi qu'une bannière personnalisée.</li>\n  <li><strong>Phase 4 : Protocole de collecte & Gestion dynamique des avis clients Google</strong> : Mettre en place un système automatique de demande d'avis avec lien direct ou QR Code, et appliquer la méthode exacte pour répondre à 100 % des avis (positifs comme négatifs) en intégrant tes mots-clés locaux.</li>\n  <li><strong>Phase 5 : Publication de Google Posts, Produits & Foire Aux Questions (FAQ)</strong> : Publier régulièrement des actualités, nouveautés et promotions via les Google Posts, lister tes prestations ou produits avec leurs tarifs, et remplir la section Q&R pour lever les freins d'achat.</li>\n</ul>\n\n<h3>Pourquoi cette checklist est le levier le plus rapide pour multiplier tes appels</h3>\n<p>Contrairement aux stratégies SEO qui demandent parfois des mois de travail, optimiser ta Fiche Google avec cette checklist produit des résultats visibles en quelques jours seulement. En appliquant cette grille de contrôle :</p>\n<ul>\n  <li>Tu multiplies le nombre d'itinéraires demandés vers ton atelier ou boutique.</li>\n  <li>Tu déclenches des appels téléphoniques directs depuis la fiche mobile.</li>\n  <li>Tu bâtis une e-réputation solide et rassurante qui fait la différence.</li>\n</ul>\n\n<p>Pour lier ta fiche Google à un site vitrine ultra-performant, combine cette checklist avec notre <a href=\"/produit/mini-guide-seo-local\">Mini-Guide SEO Local</a> et le <a href=\"/produit/mini-guide-ecrire-web-artisan\">Mini-Guide Rédaction Web Artisan</a>. Pour concevoir un site web digne de ce nom, découvre notre <a href=\"/produit/formation-wordpress\">Formation Vidéo Vitrine WordPress</a> ou explore l'ensemble des ressources du <a href=\"/produit/pack-guides\">Pack Guides Utiles Création de Site</a> sur la <a href=\"/boutique\">boutique Guides Digitaux</a>.</p>\n\n<h3>Format PDF dynamique interactif à cocher et imprimable</h3>\n<p>Disponible en téléchargement immédiat au format PDF interactif utilisable sur ordinateur, tablette ou imprimable. Une question sur l'optimisation de ta fiche ? Écris à Stéphanie sur la <a href=\"/contact\">page de contact</a>.</p>",
    "features": [
      "Grille d’audit complète de 30 points de contrôle pour Fiche Google",
      "Optimisation NAP, catégorie métier, mots-clés locaux et galerie photo",
      "Protocole de collecte et de réponse aux avis clients Google",
      "Format PDF dynamique interactif à cocher et imprimable"
    ],
    "downloadPdf": "/downloads/1786961735239-checklist-fiche-google.pdf"
  },
  {
    "id": "pack-guides",
    "title": "Pack guides utiles pour la création de ton site",
    "slug": "pack-guides",
    "category": "ebook",
    "categoryLabel": "Pack Spécial",
    "price": 17,
    "rating": 5,
    "reviewsCount": 0,
    "badge": "MEILLEURE OFFRE",
    "image": "/images/products/pack-guides-mockup-2.webp",
    "imageAlt": "Pack complet de guides et checklists pour créer son site - Guides digitaux - Nord de la France",
    "gallery": [
      "/images/products/pack-guides-mockup-2.webp",
      "/images/products/pack-guides-mockup-1.webp"
    ],
    "description": "Le coffret intégral regroupant les 4 mini-guides et les 3 checklists clés pour concevoir, sécuriser et réussir son site web d'artisan.",
    "longDescription": "<h3>Le coffret intégral des 7 ressources indispensables pour réussir ton site internet</h3>\n<p>Tu es artisan, créateur ou indépendant dans la Métropole lilloise ou le Nord de la France, et tu souhaites concevoir, refondre ou optimiser ton site web professionnel sans investir des milliers d'euros auprès d'une agence ? Plutôt que d'acheter des guides et checklists séparés, le <strong>Pack Guides Utiles pour la Création de ton Site</strong> regroupe l'intégralité des meilleures ressources méthodologiques de Guides Digitaux dans un coffret complet à un tarif préférentiel imbattable.</p>\n\n<p>Pensé dans l'ordre logique de ton avancement web, ce pack complet t'accompagne pas-à-pas : de la rédaction de tes textes à la sécurité WordPress, en passant par le SEO local, l'ergonomie UX et la recette finale avant le lancement officiel.</p>\n\n<h3>Ce que contient ton Pack Guides complet (7 Ressources Clés)</h3>\n\n<p>En commandant ce pack, tu télécharges immédiatement un coffret numérique complet réunissant 4 mini-guides méthodologiques et 3 checklists de contrôle interactives :</p>\n\n<ul>\n  <li><strong>1. Mini-Guide Rédaction Web Artisan</strong> : La méthode concrète et les formules prêtes à l'emploi pour rédiger une page d'accueil captivante, une page « À propos » authentique et des fiches de prestations convaincantes sans jargon (à découvrir aussi sur la fiche du <a href=\"/produit/mini-guide-ecrire-web-artisan\">Mini-Guide Rédaction Web</a>).</li>\n  <li><strong>2. Mini-Guide SEO Local & Google Business Profile</strong> : Les 8 actions décisives pour hisser ton entreprise en tête des recherches Google Maps dans un rayon de 15 km autour de chez toi (à consulter sur la fiche du <a href=\"/produit/mini-guide-seo-local\">Mini-Guide SEO Local</a>).</li>\n  <li><strong>3. Mini-Guide Optimisation Photos & Vitesse</strong> : La technique pour diviser le poids de tes visuels d'artisan par 10 sans aucune perte de qualité et booster ton score sur <a href=\"https://pagespeed.web.dev/\" target=\"_blank\" rel=\"noopener noreferrer\">Google PageSpeed Insights</a> (voir la fiche du <a href=\"/produit/mini-guide-optimiser-ses-photos\">Mini-Guide Optimiser ses Photos</a>).</li>\n  <li><strong>4. Mini-Guide Comprendre ses Stats sans être Data Scientist</strong> : Pour mesurer ton trafic web, identifier la provenance de tes visiteurs et comprendre ce qui déclenche tes demandes de devis.</li>\n  <li><strong>5. Checklist Sécurité & Anti-Spam WordPress</strong> : La grille de contrôle essentielle pour immuniser ton site sous <a href=\"https://wordpress.org\" target=\"_blank\" rel=\"noopener noreferrer\">WordPress</a> contre les piratages et éliminer les spambots indésirables (détails sur la <a href=\"/produit/checklist-securite-anti-spam-wordpress\">Checklist Sécurité & Anti-Spam</a>).</li>\n  <li><strong>6. Checklist des Principes Clés UX & Ergonomie</strong> : Les règles d'ergonomie mobile et de hiérarchie visuelle conformes au <a href=\"https://www.w3.org/WAI/\" target=\"_blank\" rel=\"noopener noreferrer\">W3C WAI</a> pour captiver tes prospects en 3 secondes (détails sur la <a href=\"/produit/checklist-les-principes-ux\">Checklist Principes Clés UX</a>).</li>\n  <li><strong>7. Checklist de Vérification avant le Lancement du Site</strong> : La recette finale en 50 points d'audit technique, juridique (<a href=\"https://www.cnil.fr/\" target=\"_blank\" rel=\"noopener noreferrer\">CNIL</a>) et SEO pour appuyer sur « Publier » en toute sérénité (détails sur la <a href=\"/produit/checklist-verification-lancement-site\">Checklist Lancement du Site</a>).</li>\n</ul>\n\n<h3>Une économie importante et des mises à jour incluses à vie</h3>\n<p>En optant pour ce coffret groupé :</p>\n<ul>\n  <li>Tu bénéficies d'une réduction exceptionnelle par rapport à l'achat individuel de chaque guide.</li>\n  <li>Tu avances avec une feuille de route claire, fluide et sans manque.</li>\n  <li>Tu conserves un accès illimité à vie et télécharges gratuitement toutes les futures mises à jour des guides.</li>\n</ul>\n\n<p>Pour associer ces guides méthodologiques à un apprentissage vidéo pas-à-pas, découvre également notre <a href=\"/produit/formation-wordpress\">Formation Vidéo Vitrine WordPress</a> et notre <a href=\"/produit/bundle-vitrine-boutique-wordpress-le-combo-pour-vendre-en-ligne\">Bundle Formation Vitrine + E-commerce WooCommerce</a>. Retrouve l'ensemble de nos outils sur la <a href=\"/boutique\">boutique digitale Guides Digitaux</a>.</p>\n\n<h3>Accès instantané après commande</h3>\n<p>Télécharge l'intégralité de tes fichiers PDF immédiatement après ton paiement sécurisé sur <a href=\"https://stripe.com\" target=\"_blank\" rel=\"noopener noreferrer\">Stripe</a>. Équipe-toi de la meilleure boîte à outils web pour faire décoller ton entreprise d'artisan ! Une question ? Écris directement à Stéphanie sur la <a href=\"/contact\">page de contact</a>.</p>",
    "features": [
      "Coffret groupé réunissant les 4 mini-guides et les 3 checklists clés",
      "Tarif préférentiel avantageux avec accès à vie et mises à jour incluses",
      "Feuille de route complète de la création à l’optimisation de votre site",
      "Téléchargement immédiat au format PDF haute définition"
    ],
    "productType": "bundle",
    "bundleProductIds": [
      "mini-guide-ecrire-web-artisan",
      "mini-guide-comprendre-ses-stats-sans-etre-data-scientist",
      "mini-guide-optimiser-ses-photos",
      "mini-guide-seo-local",
      "checklist-securite-anti-spam-wordpress",
      "checklist-les-principes-ux",
      "checklist-verification-lancement-site"
    ]
  },
  {
    "id": "bundle-vitrine-boutique-wordpress-le-combo-pour-vendre-en-ligne",
    "title": "Bundle : Vitrine + Boutique WordPress (Le Combo Vendre en Ligne)",
    "slug": "bundle-vitrine-boutique-wordpress-le-combo-pour-vendre-en-ligne",
    "category": "formation",
    "categoryLabel": "Combo 2 Formations",
    "price": 250,
    "originalPrice": 298,
    "rating": 5,
    "reviewsCount": 0,
    "badge": "ÉCONOMISE 48€",
    "image": "/images/products/bundle-vitrine-boutique-wordpress.webp",
    "imageAlt": "Combo 2 formations vitrine et boutique WooCommerce WordPress - Guides digitaux - Hauts-de-France",
    "gallery": [
      "/images/products/bundle-vitrine-boutique-wordpress.webp",
      "/images/products/formation-wordpress.webp",
      "/images/products/formation-woocommerce.jpg"
    ],
    "description": "Le combo ultime regroupant la Formation Vitrine WordPress (199 €) et la Formation E-commerce WooCommerce (99 €). Obtiens les 2 formations pour 250 € au lieu de 298 €.",
    "longDescription": "<h3>Le parcours de formation ultime pour concevoir votre site vitrine et vendre vos créations sur Internet</h3>\n<p>Vous êtes artisan, créateur ou indépendant et vous souhaitez avoir un site web complet qui présente votre savoir-faire et vous permet d'encaisser des commandes en ligne 24h/24 ? Faire appel à une agence web coûte souvent entre 3 000 € et 8 000 €, sans garantie d'être autonome par la suite. Le <strong>Bundle Vitrine + Boutique WordPress</strong> réunit l'intégralité de nos deux formations vidéo phares pour vous apprendre à bâtir vous-même votre écosystème web professionnel de A à Z.</p>\n\n<p>En choisissant ce combo d'excellence au tarif privilégié de <strong>250 € au lieu de 298 €</strong>, vous réalisez une <strong>économie immédiate de 48 €</strong> tout en débloquant l'accès illimité aux deux cursus vidéo d'apprentissage.</p>\n\n<h3>Ce que contiennent les 2 formations incluses dans ce Bundle</h3>\n\n<p><strong>1. Formation Vitrine WordPress complète (Valeur individuelle : 199 €)</strong></p>\n<p>Apprenez à réserver votre nom de domaine, installer le CMS <a href=\"https://wordpress.org\" target=\"_blank\" rel=\"noopener noreferrer\">WordPress</a>, maîtriser le constructeur de page Elementor, concevoir une arborescence sur-mesure, sécuriser votre site et optimiser son référencement naturel (SEO local) pour être trouvé par les clients de votre ville et région.</p>\n\n<p><strong>2. Formation WooCommerce E-commerce (Valeur individuelle : 99 €)</strong></p>\n<p>Transformez votre site en boutique e-commerce performante grâce à <a href=\"https://woocommerce.com\" target=\"_blank\" rel=\"noopener noreferrer\">WooCommerce</a>. Créez vos fiches produits interactives, gérez les stocks, configurez les modes de livraison (Click & Collect, Colissimo, Mondial Relay) et encaissez les cartes bancaires en toute sécurité avec <a href=\"https://stripe.com\" target=\"_blank\" rel=\"noopener noreferrer\">Stripe</a> et PayPal.</p>\n\n<h3>Les avantages exclusifs du Bundle Combo</h3>\n<ul>\n  <li><strong>Économie nette de 48 €</strong> par rapport à l'achat séparé des cursus.</li>\n  <li><strong>Accès simultané et immédiat aux 2 formations</strong> dans votre espace membre élève.</li>\n  <li><strong>Apprentissage fluide et logique</strong> : Construisez d'abord les fondations de votre site vitrine puis ajoutez la brique e-commerce sans friction.</li>\n  <li><strong>Accès illimité 24h/24 et à vie</strong> avec toutes les mises à jour futures des cours offertes.</li>\n  <li><strong>Exercices pratiques et ressources téléchargeables</strong> pour valider chaque étape de votre site.</li>\n</ul>\n\n<p>Si vous hésitez ou souhaitez en savoir plus sur les cursus individuels, consultez la fiche de la <a href=\"/produit/formation-wordpress\">Formation Vitrine WordPress</a> ou de la <a href=\"/produit/formation-ajouter-une-boutique-en-ligne-avec-woocommerce\">Formation WooCommerce</a>. Retrouvez tous nos guides sur la <a href=\"/boutique\">boutique Guides Digitaux</a>.</p>\n\n<h3>Rejoignez la communauté des artisans autonomes du web</h3>\n<p>Pas besoin de savoir coder ni d'être un expert en informatique ! Nos cours vidéo pas-à-pas sont conçus pour les débutants. Commandez votre Bundle dès aujourd'hui et commencez à bâtir votre réussite en ligne. Des questions ? Contactez Stéphanie via notre <a href=\"/contact\">page de contact</a>.</p>",
    "features": [
      "Accès immédiat et à vie aux 2 formations vidéo intégrales (Vitrine + WooCommerce)",
      "Économie immédiate de 48 € (250 € au lieu de 298 €)",
      "Tutoriels pas-à-pas HD avec exercices pratiques et modèles prêts à l’emploi",
      "Configuration complète des paiements Stripe/PayPal & gestion des livraisons",
      "Support réactif et accès illimité 24/7 dans votre espace élève"
    ],
    "productType": "bundle",
    "bundleProductIds": [
      "formation-wordpress",
      "formation-ajouter-une-boutique-en-ligne-avec-woocommerce"
    ]
  },
  {
    "id": "coaching-site",
    "title": "Coaching Individuel & Accompagnement Sur-Mesure",
    "slug": "coaching-site",
    "category": "coaching",
    "categoryLabel": "Accompagnement Sur-Mesure",
    "price": 97,
    "originalPrice": 149,
    "rating": 5,
    "reviewsCount": 18,
    "badge": "ACCOMPAGNEMENT 1-SUR-1",
    "bookingUrl": "https://calendar.app.google/A4SMq4zBbZYnnCr18",
    "image": "/images/products/coaching-site.webp",
    "imageAlt": "Stéphanie en visio de coaching individuel création de site WordPress - Guides digitaux",
    "gallery": [
      "/images/products/coaching-site.webp",
      "/images/products/stephanie-coaching.webp"
    ],
    "description": "Deux sessions individuelles de 45 minutes en visio pour débloquer ton site, poser tes questions et avancer deux fois plus vite, l’esprit tranquille.",
    "longDescription": "<h3>Tu suis la formation, tu avances à ton rythme.</h3>\n<p>Et puis, à un moment, tu tombes sur quelque chose qui ne fonctionne pas comme prévu. Un réglage qui ne s’affiche pas comme sur la vidéo. Une erreur que tu ne comprends pas. Une décision à prendre sur la structure de ton site, et tu n’es pas sûr du bon choix. Tu cherches sur Google, tu trouves des réponses contradictoires, tu perds deux heures — et tu n’avances plus.</p>\n<p>C’est exactement pour ça que ce coaching existe.</p>\n\n<h3>Ce que tu obtiens : 2 sessions de 45 minutes, rien que pour toi</h3>\n<p>Pas un webinaire avec 50 participants où tu n’oses pas poser ta question. Pas un groupe Facebook où tu attends une réponse pendant 3 jours. Une session individuelle, en visio, avec ton écran partagé, sur ton propre site.</p>\n<p>Tu poses tes questions. On regarde ensemble. On règle le problème. Tu me quittes avec la solution et la compréhension de pourquoi ça fonctionne maintenant — pour ne plus jamais bloquer au même endroit.</p>\n\n<h3>Les 2 sessions peuvent couvrir :</h3>\n<ul>\n  <li>Un point de la formation qui ne correspond pas à ce que tu vois sur ton écran</li>\n  <li>La configuration de tes réglages SEO pour ton activité précise (menuisier, photographe, artisan, thérapeute...)</li>\n  <li>Le choix de tes extensions selon ton type de site</li>\n  <li>La mise en page d’une page ou d’un article qui ne rend pas comme tu le souhaites</li>\n  <li>La connexion de ton formulaire de contact ou de ton outil de prise de rendez-vous</li>\n  <li>La vérification complète de ton site avant la mise en ligne</li>\n  <li>Tout autre blocage spécifique à ton projet</li>\n</ul>\n<p>Les sessions sont espacées selon ton avancement — tu les planifies quand tu en as besoin, pas toutes d’un coup.</p>\n\n<h3>Pourquoi ce coaching change tout pour les artisans et créateurs</h3>\n<p>Quand on n’est pas à l’aise avec l’informatique, le moindre blocage peut décourager. Pas parce qu’on n’est pas capable — mais parce qu’on ne sait pas si ce qu’on fait est normal, si on va « tout casser », ou si on prend la bonne direction.</p>\n<p>Avoir quelqu’un à qui poser la question et qui répond en français, sur ton propre site, avec ta propre configuration — c’est ce qui fait la différence entre un projet abandonné à mi-chemin et un site en ligne dont tu es fier.</p>\n<p>La plupart des participants au coaching finalisent leur site en deux fois moins de temps qu’en avançant seuls. Non pas parce qu’ils travaillent plus vite, mais parce qu’ils ne perdent plus de temps à tourner en rond.</p>\n\n<h3>Comment ça se passe concrètement</h3>\n<p>Après ton achat, tu reçois un email avec un lien pour réserver ta première session dans mon agenda. Les sessions se font en visioconférence — tu partages ton écran, on travaille ensemble sur ton site en temps réel. Pas de support technique asynchrone, pas de réponse par email : une vraie session de travail, efficace et dédiée à ton projet.</p>\n<p>La deuxième session se planifie au fil de ton avancement, selon tes besoins.</p>\n\n<h3>Ce coaching est fait pour toi si…</h3>\n<p>Tu as acheté la <a href=\"/produit/formation-wordpress\">Formation WordPress</a> ou la <a href=\"/produit/formation-ajouter-une-boutique-en-ligne-avec-woocommerce\">Formation WooCommerce</a> et tu souhaites avancer plus vite avec un filet de sécurité.</p>\n\n<h3>97 € pour 2 sessions — le calcul est simple</h3>\n<p>Un prestataire WordPress facture entre 60 € et 120 € de l’heure pour du support technique. Pour 97 €, tu obtiens deux sessions de 45 minutes dédiées à 100 % à ton projet. Si une seule session t'évite de payer un prestataire pour une intervention d’urgence, elle est déjà rentabilisée.</p>",
    "features": [
      "2 sessions individuelles de 45 minutes en visio",
      "Écran partagé directement sur ton propre site web",
      "Résolution pas-à-pas de tes blocages techniques & SEO",
      "Planification flexible au fil de ton avancement",
      "Accompagnement 100% personnalisé avec Stéphanie Rocq"
    ]
  },
  {
    "id": "formation-wordpress",
    "title": "Formation : créer sa vitrine en ligne avec WordPress",
    "slug": "formation-wordpress",
    "category": "formation",
    "categoryLabel": "Formation Vidéo",
    "price": 199,
    "rating": 5,
    "reviewsCount": 0,
    "badge": "FORMATION VIDÉO",
    "image": "/images/products/formation-wordpress.webp",
    "imageAlt": "Formation vidéo complète pour créer sa vitrine WordPress - Guides digitaux - Nord (59)",
    "gallery": [
      "/images/products/formation-wordpress.webp",
      "/images/products/stephanie-coaching.webp"
    ],
    "description": "Apprends à créer un site vitrine professionnel de A à Z avec WordPress et Elementor.",
    "longDescription": "<h3>Le cursus vidéo pas-à-pas pour bâtir votre site vitrine professionnel</h3>\n<p>Vous souhaitez créer le site vitrine de votre activité d'artisan, de créateur ou de prestataire indépendant sans dépendre d'un sous-traitant ? La <strong>Formation Vidéo : Créer sa vitrine en ligne avec WordPress</strong> est le programme complet conçu pour vous guider de A à Z, depuis le choix du nom de domaine jusqu'à la mise en ligne d'un site moderne et référencé sur Google.</p>\n\n<p>Grâce à des vidéos enregistrées en haute définition et expliquées dans un langage simple sans jargon informatique, toutes les leçons peuvent être visionnées de manière 100% indépendante les unes des autres tout en suivant une trame pédagogique fluide.</p>\n\n<h3>Le programme pédagogique officiel (6 Modules)</h3>\n<ul>\n  <li><strong>Module 1 : Préparer son projet</strong> : Bienvenue, choix du nom de domaine efficace, achat de l'hébergement (OVH, O2Switch, Ionos...) et création d'une adresse email pro.</li>\n  <li><strong>Module 2 : Installation de WordPress</strong> : Installation rapide en 5 minutes et réglages essentiels du tableau de bord.</li>\n  <li><strong>Module 3 : Sécuriser et mettre en place la base</strong> : Sécurisation initiale, installation du thème graphique et des plugins indispensables.</li>\n  <li><strong>Module 4 : Créer et organiser son contenu</strong> : Création des premières pages (Accueil, À propos, Services, Contact), du blog et du menu de navigation.</li>\n  <li><strong>Module 5 : Réglages avancés</strong> : Personnalisation de l'expérience utilisateur (polices, couleurs, logo), gestion des URL/HTTPS et sauvegardes automatiques.</li>\n  <li><strong>Module 6 : Mise en ligne et suivi</strong> : Tests d'affichage mobile et formulaires, référencement naturel (Google Search Console & Analytics) et checklist de lancement.</li>\n</ul>\n\n<h3>Devenez 100% autonome sur la gestion de votre site</h3>\n<p>À l'issue de cette formation vidéo :</p>\n<ul>\n  <li>Vous possédez un site vitrine sur-mesure à l'image de votre marque artisanale.</li>\n  <li>Vous savez modifier vos textes, ajouter de nouvelles réalisations et mettre à jour vos contenus en toute autonomie.</li>\n  <li>Vous économisez des milliers d'euros de prestations d'agences web.</li>\n</ul>\n\n<p>Si vous envisagez également d'ajouter une boutique en ligne e-commerce, optez pour notre <a href=\"/produit/bundle-vitrine-boutique-wordpress-le-combo-pour-vendre-en-ligne\">Bundle Formation Vitrine + WooCommerce</a> pour bénéficier de 48 € de réduction. Découvrez toutes nos ressources sur la <a href=\"/boutique\">boutique Guides Digitaux</a>.</p>\n\n<h3>Accès illimité 24/7 dans votre espace élève</h3>\n<p>Rejoignez la formation dès aujourd'hui et progressez à votre propre rythme ! Votre accès est valable à vie. Une question sur le programme ? Contactez-nous à tout moment via la <a href=\"/contact\">page de contact</a>.</p>",
    "features": [
      "Cursus vidéo complet pas-à-pas accessible 24/7 dans votre espace élève",
      "Apprentissage sur WordPress et Elementor sans aucune connaissance en code",
      "Modules dédiés au design responsive mobile, à la sécurité et au SEO local",
      "Accès illimité à vie avec toutes les futures mises à jour vidéo incluses"
    ]
  },
  {
    "id": "formation-ajouter-une-boutique-en-ligne-avec-woocommerce",
    "title": "Formation ajouter une boutique en ligne avec WooCommerce",
    "slug": "formation-ajouter-une-boutique-en-ligne-avec-woocommerce",
    "category": "formation",
    "categoryLabel": "Formation Vidéo",
    "price": 99,
    "rating": 5,
    "reviewsCount": 0,
    "badge": "FORMATION VIDÉO",
    "image": "/images/products/formation-woocommerce.jpg",
    "imageAlt": "Formation pratique pour ajouter une boutique en ligne WooCommerce - Guides digitaux - Comines",
    "description": "Transforme ton site WordPress en boutique e-commerce performante grâce à WooCommerce.",
    "longDescription": "<h3>Transformez votre site WordPress en une boutique e-commerce rentable</h3>\n<p>Vous avez déjà un site WordPress ou vous souhaitez ajouter un module de vente en ligne pour vendre vos produits artisanaux, vos créations faites main ou vos réservations de prestations ? La <strong>Formation Vidéo : Ajouter une boutique en ligne avec WooCommerce</strong> est la formation pratique pas-à-pas pour paramétrer votre boutique e-commerce et encaisser vos premiers paiements par carte bancaire en toute sécurité.</p>\n\n<p>Utilisé par des millions de commerçants à travers le monde, <a href=\"https://woocommerce.com\" target=\"_blank\" rel=\"noopener noreferrer\">WooCommerce</a> est le système e-commerce le plus flexible et puissant pour <a href=\"https://wordpress.org\" target=\"_blank\" rel=\"noopener noreferrer\">WordPress</a>.</p>\n\n<h3>Le programme complet de la formation WooCommerce</h3>\n<p>Ce cours vidéo interactif vous enseigne chaque étape de configuration :</p>\n<ul>\n  <li><strong>Module 1 : Installation et paramétrage de WooCommerce</strong> : Configurer les devises, la TVA, les zones d'expédition et les e-mails automatiques de commande.</li>\n  <li><strong>Module 2 : Création de fiches produits attractives</strong> : Rédiger des fiches produits optimisées SEO, ajouter des galeries d'images HD, des variations (tailles, couleurs, options) et gérer vos stocks.</li>\n  <li><strong>Module 3 : Configuration des passerelles de paiement sécurisées</strong> : Connecter <a href=\"https://stripe.com\" target=\"_blank\" rel=\"noopener noreferrer\">Stripe</a> (carte bancaire, Apple Pay) et <a href=\"https://paypal.com\" target=\"_blank\" rel=\"noopener noreferrer\">PayPal</a> pour recevoir votre argent directement sur votre compte bancaire.</li>\n  <li><strong>Module 4 : Gestion des modes de livraison</strong> : Paramétrer le Click & Collect (retrait en atelier), Colissimo, Mondial Relay et les frais de port gratuits.</li>\n  <li><strong>Module 5 : Gestion des commandes et tableau de bord</strong> : Suivre vos ventes, traiter les expéditions et éditer vos factures.</li>\n</ul>\n\n<h3>Développez votre chiffre d'affaires au-delà de votre zone locale</h3>\n<p>En intégrant WooCommerce à votre site :</p>\n<ul>\n  <li>Vous permettez à vos clients d'acheter vos créations 24h/24 et 7j/7.</li>\n  <li>Vous élargissez votre clientèle à toute la France, la Belgique et l'Europe.</li>\n  <li>Vous automatisez vos encaissements et la gestion de vos factures.</li>\n</ul>\n\n<p>Pour vous former simultanément à la création de votre site vitrine et de votre boutique, découvrez notre <a href=\"/produit/bundle-vitrine-boutique-wordpress-le-combo-pour-vendre-en-ligne\">Bundle Formation Vitrine + WooCommerce</a> et économisez 48 €. Découvrez toutes nos ressources sur la <a href=\"/boutique\">boutique Guides Digitaux</a>.</p>\n\n<h3>Formation disponible immédiatement</h3>\n<p>Accédez instantanément à tous les modules vidéo après votre commande et créez votre boutique en ligne sereinement ! Des questions ? Contactez Stéphanie via notre <a href=\"/contact\">page de contact</a>.</p>",
    "features": [
      "Formation vidéo intégrale pas-à-pas pour maîtriser WooCommerce",
      "Création de fiches produits simples et à variations avec gestion de stock",
      "Configuration des paiements sécurisés Stripe / CB / Apple Pay / PayPal",
      "Paramétrage des livraisons (Click & Collect, Colissimo, Mondial Relay)"
    ]
  }
];
