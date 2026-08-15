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
    ]
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
    ]
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
    ]
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
    ]
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
    ]
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
    "description": "Protège ton site contre les piratages et élimine le spam sur tes formulaires de contact en quelques clics.",
    "longDescription": "<h3>Protégez votre site WordPress contre les piratages et les spambots</h3>\n<p>Un site internet d'artisan indisponible ou infecté par des spams peut nuire gravement à votre réputation et vous faire perdre des dizaines de demandes de devis. Beaucoup d'artisans pensent que leur petit site vitrine n'intéresse pas les pirates. C'est une idée reçue dangereuse : les robots malveillants attaquent de manière automatisée des milliers de sites <a href=\"https://wordpress.org\" target=\"_blank\" rel=\"noopener noreferrer\">WordPress</a> chaque jour. La <strong>Checklist Sécurité & Anti-Spam WordPress</strong> vous permet de sécuriser votre site en quelques clics sans compétences techniques.</p>\n\n<p>Conçue par des experts web, cette grille de contrôle interactive rassemble toutes les actions préventives essentielles pour dormir sur vos deux oreilles.</p>\n\n<h3>Les 4 modules de vérification inclus dans la checklist</h3>\n<p>Cette checklist dynamique à cocher couvre l'ensemble des points d'attention cruciaux :</p>\n<ul>\n  <li><strong>Module 1 : Sauvegardes automatiques et restauration</strong> : Mettre en place des sauvegardes régulières externalisées (avec des outils comme <a href=\"https://wordpress.org/plugins/updraftplus/\" target=\"_blank\" rel=\"noopener noreferrer\">UpdraftPlus</a>) et vérifier leur capacité de restauration.</li>\n  <li><strong>Module 2 : Protection des formulaires et anti-spam</strong> : Bloquer les spambots sur vos formulaires de contact et commentaires grâce à des filtres intelligents (ex: <a href=\"https://wordpress.org/plugins/akismet/\" target=\"_blank\" rel=\"noopener noreferrer\">Akismet</a> ou Captcha sans gêner vos utilisateurs).</li>\n  <li><strong>Module 3 : Gestion des identifiants et des mots de passe</strong> : Supprimer le compte \"admin\" par défaut, imposer des mots de passe robustes et masquer l'adresse e-mail en clair.</li>\n  <li><strong>Module 4 : Mises à jour du cœur WordPress, thèmes et plugins</strong> : Instaurer une routine simple de mise à jour préventive pour boucher les failles de sécurité.</li>\n</ul>\n\n<h3>Une sérénité garantie pour votre outil de travail</h3>\n<p>En appliquant cette checklist en moins de 30 minutes :</p>\n<ul>\n  <li>Vous éliminez 99% des soumissions de formulaires d'indésirables dans votre boîte mail.</li>\n  <li>Vous protégez les données personnelles de vos clients en conformité avec le RGPD.</li>\n  <li>Vous garantissez la continuité de votre activité en ligne.</li>\n</ul>\n\n<p>Pour suivre une formation vidéo complète sur la création et la sécurisation de votre site, découvrez notre <a href=\"/produit/formation-wordpress\">Formation Vitrine WordPress</a> ou parcourez nos autres <a href=\"/boutique\">checklists et guides digitaux</a>.</p>\n\n<h3>Format pratique et réutilisable</h3>\n<p>Cette checklist numérique est utilisable immédiatement sur ordinateur, tablette ou imprimable en version papier. Téléchargez-la dès maintenant et protégez votre outil de travail ! Pour toute question, notre équipe est à votre disposition via la <a href=\"/contact\">page de contact</a>.</p>",
    "features": [
      "Checklist dynamique à cocher pour sécuriser votre site WordPress",
      "Protocole complet anti-spam pour formulaires de contact et commentaires",
      "Guide de mise en place de sauvegardes automatiques externalisées",
      "Mise en œuvre simple et rapide sans développement informatique"
    ]
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
    "description": "Assure une navigation fluide et intuitive à tes visiteurs pour transformer vos visites en demandes de devis ou achats.",
    "longDescription": "<h3>Offrez une navigation fluide qui transforme vos visiteurs en clients</h3>\n<p>L'Expérience Utilisateur (ou UX Design) désigne le sentiment et la facilité d'utilisation qu'éprouve un internaute lorsqu'il navigue sur votre site internet. Même si vous avez les plus belles photos et les meilleurs prix, si un prospect ne trouve pas votre numéro de téléphone ou si votre menu est confus, il quittera immédiatement votre site. La <strong>Checklist des Principes Clés UX pour Site Vitrine et Boutique</strong> vous donne la grille de contrôle obligatoire pour faire de votre site un véritable convertisseur de prospects.</p>\n\n<p>Pensée spécifiquement pour les sites d'artisans, cette checklist s'appuie sur les normes d'ergonomie web et d'accessibilité recommandées par le <a href=\"https://www.w3.org/WAI/\" target=\"_blank\" rel=\"noopener noreferrer\">W3C WAI</a>.</p>\n\n<h3>Les critères d'ergonomie web passés au crible</h3>\n<p>Cette checklist dynamique vous permet de valider chaque élément crucial de votre site :</p>\n<ul>\n  <li><strong>Ergonomie Mobile & Responsive Design</strong> : Vérifier la taille des boutons cliquables au pouce et la lisibilité du texte sur smartphone.</li>\n  <li><strong>Arborescence et Navigation intuitive</strong> : Proposer un menu clair avec 5 à 6 catégories maximum et un fil d'Ariane.</li>\n  <li><strong>Positionnement des Boutons d'Action (CTA)</strong> : Placer des boutons bien visibles (« Demander un devis », « Appeler l'artisan ») au-dessus de la ligne de flottaison.</li>\n  <li><strong>Vitesse d'affichage et hiérarchie visuelle</strong> : Organiser les titres (H1, H2, H3) et alléger la mise en page pour guider l'œil.</li>\n  <li><strong>Réassurance et Éléments de confiance</strong> : Afficher clairement vos certifications, garanties décennales, avis clients et coordonnées dans le pied de page.</li>\n</ul>\n\n<h3>Transformez votre trafic en demandes de devis réelles</h3>\n<p>En corrigeant les défauts d'ergonomie de votre site grâce à cette checklist :</p>\n<ul>\n  <li>Vous diminuerez votre taux de rebond de manière significative.</li>\n  <li>Vous augmenterez le nombre de demandes d'informations et de rendez-vous téléphoniques.</li>\n  <li>Vous offrirez une image moderne et professionnelle de votre entreprise artisanale.</li>\n</ul>\n\n<p>Pour optimiser la vitesse de vos visuels avant de valider l'UX, consultez notre <a href=\"/produit/mini-guide-optimiser-ses-photos\">Mini-Guide Optimiser ses Photos</a>. Retrouvez l'ensemble de nos outils sur la <a href=\"/boutique\">boutique Guides Digitaux</a>.</p>\n\n<h3>Un outil immédiatement utilisable</h3>\n<p>Téléchargez cette checklist au format dynamique ou PDF imprimable et passez votre site au crible dès aujourd'hui ! Besoin d'un avis d'expert ? Contactez-nous via notre <a href=\"/contact\">formulaire de contact</a>.</p>",
    "features": [
      "Checklist d’ergonomie et d’expérience utilisateur (UX) pour site web",
      "Validation de la lisibilité mobile, de l’arborescence et des boutons CTA",
      "Grille d’évaluation de la réassurance et des éléments de confiance",
      "Format dynamique à cocher et imprimable pour une révision rapide"
    ]
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
    "description": "S’assurer que tous les éléments essentiels de vos profils sociaux sont correctement configurés pour être visible et crédible.",
    "longDescription": "<h3>Convertissez vos abonnés réseaux sociaux en clients pour votre entreprise</h3>\n<p>Sur Instagram, Facebook ou LinkedIn, votre profil est votre première carte de visite virtuelle. Lorsqu'un habitant de votre ville ou de la Métropole lilloise découvre vos publications d'artisan, son premier réflexe est de cliquer sur votre profil. S'il y trouve une biographie floue, des liens cassés ou des visuels de mauvaise qualité, vous perdez un prospect qualifié. La <strong>Checklist Profil Réseaux Sociaux Pro</strong> vous garantit une configuration irréprochable qui inspire confiance et génère des contacts.</p>\n\n<p>Cette checklist pas-à-pas a été conçue à partir des meilleures pratiques de conversion sur les réseaux sociaux pour les indépendants et créateurs.</p>\n\n<h3>Les 4 étapes d'optimisation de votre profil professionnel</h3>\n<p>Passez en revue et cochez chaque point stratégique de votre profil :</p>\n<ul>\n  <li><strong>Étape 1 : Informations générales & Biographie percutante</strong> : Rédiger une bio en 3 lignes (« Qui vous êtes », « Ce que vous faites », « Pour qui ») avec une photo de profil nette et professionnelle.</li>\n  <li><strong>Étape 2 : Contenu initial & Stories à la une (Highlights)</strong> : Publier 3 à 5 posts fondateurs pour présenter vos réalisations et organiser vos stories à la une (Avis, Tarifs, Coulisses).</li>\n  <li><strong>Étape 3 : Cohérence visuelle & Boutons d'action</strong> : Définir une palette de couleurs représentative et configurer les boutons de contact (WhatsApp, Email, Téléphone, Lien vers le site web).</li>\n  <li><strong>Étape 4 : Interactions, messagerie & réponses automatiques</strong> : Activer les messages privés et préparer des modèles de réponses rapides pour traiter les demandes fréquentes.</li>\n</ul>\n\n<h3>Développez votre communauté locale efficacement</h3>\n<p>Grâce à cette checklist :</p>\n<ul>\n  <li>Vous présenterez une image soignée et haut de gamme de votre savoir-faire.</li>\n  <li>Vous orienterez facilement vos abonnés vers votre site vitrine ou votre boutique en ligne.</li>\n  <li>Vous gagnerez du temps dans la gestion quotidienne de vos messages d'indépendants.</li>\n</ul>\n\n<p>Pour lier vos réseaux sociaux à une stratégie digitale globale, découvrez notre <a href=\"/produit/ebook-visibilite-ligne-artisan\">Ebook Visibilité en Ligne Artisan</a> et parcourez les ressources de notre <a href=\"/boutique\">boutique Guides Digitaux</a>.</p>\n\n<h3>Un format synthétique et pratique</h3>\n<p>Format PDF dynamique et imprimable utilisable tout de suite. Téléchargez votre checklist et optimisez vos profils réseaux sociaux en moins de 20 minutes ! Une question ? Écrivez-nous sur la <a href=\"/contact\">page de contact</a>.</p>",
    "features": [
      "Checklist de configuration complète pour Instagram, Facebook et LinkedIn",
      "Optimisation de la biographie, de la photo pro et des boutons de contact",
      "Guide d’organisation des Stories à la une (Highlights) et du feed",
      "Conseils pour paramétrer la messagerie et les réponses automatiques"
    ]
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
    "description": "Le pack combinant les guides et checklists essentiels pour concevoir et réussir son site web sans stress.",
    "longDescription": "<h3>Le coffret intégral des ressources indispensables pour réussir votre site internet</h3>\n<p>Vous souhaitez concevoir, refondre ou optimiser votre site internet d'artisan sans investir des milliers d'euros ? Plutôt que d'acheter des guides séparés, le <strong>Pack Guides Utiles pour la Création de ton Site</strong> regroupe l'intégralité des meilleures ressources méthodologiques de Guides Digitaux à un tarif préférentiel imbattable.</p>\n\n<p>Ce pack complet a été spécialement assemblé pour vous accompagner à chaque étape du projet : de la rédaction des textes à l'optimisation des visuels, en passant par le SEO local et l'ergonomie utilisateur.</p>\n\n<h3>Ce que contient le Pack Guides complet</h3>\n<p>En commandant ce pack, vous téléchargez immédiatement un coffret de 5 guides et checklists complémentaires :</p>\n<ul>\n  <li><strong>Mini-Guide Rédaction Web Artisan</strong> : Pour rédiger des textes captivants et bien référencés sur Google sans jargon.</li>\n  <li><strong>Mini-Guide Optimisation Photos & Vitesse</strong> : La méthode pour alléger vos visuels par 10 sans perte de netteté.</li>\n  <li><strong>Mini-Guide SEO Local & Google Business Profile</strong> : Pour vous hisser en tête des recherches Google Maps dans votre région.</li>\n  <li><strong>Checklist Sécurité & Anti-Spam WordPress</strong> : La grille de contrôle pour protéger votre site des spams et piratages.</li>\n  <li><strong>Checklist Principes Clés UX & Ergonomie</strong> : La méthode pour transformer vos simples visiteurs en demandes de devis réelles.</li>\n</ul>\n\n<h3>Une économie importante et des mises à jour incluses à vie</h3>\n<p>En optant pour ce pack groupé :</p>\n<ul>\n  <li>Vous bénéficiez d'une réduction avantageuse par rapport à l'achat individuel des ressources.</li>\n  <li>Vous disposez d'une feuille de route complète et cohérente sans manque ni doublon.</li>\n  <li>Vous conservez un accès à vie et téléchargez gratuitement toutes les futures mises à jour de ces guides.</li>\n</ul>\n\n<p>Pour passer de la théorie à la pratique vidéo guidée, découvrez également notre <a href=\"/produit/bundle-vitrine-boutique-wordpress-le-combo-pour-vendre-en-ligne\">Bundle Formation Vitrine + E-commerce WooCommerce</a>. Retrouvez toutes nos solutions sur notre <a href=\"/boutique\">boutique digitale</a>.</p>\n\n<h3>Accès instantané après commande</h3>\n<p>Téléchargez l'intégralité de vos fichiers PDF immédiatement après votre paiement sécurisé. Équipez-vous du meilleur kit digital pour votre activité d'artisan ! Des questions ? Contactez Stéphanie via notre <a href=\"/contact\">page de contact</a>.</p>",
    "features": [
      "Coffret groupé réunissant les 3 mini-guides et les 2 checklists clés",
      "Tarif préférentiel avantageux avec accès à vie et mises à jour incluses",
      "Feuille de route complète de la création à l’optimisation de votre site",
      "Téléchargement immédiat au format PDF haute définition"
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
    "longDescription": "<h3>Le cursus vidéo pas-à-pas pour bâtir votre site vitrine professionnel</h3>\n<p>Vous souhaitez créer le site vitrine de votre activité d'artisan, de créateur ou de prestataire indépendant sans dépendre d'un sous-traitant ? La <strong>Formation Vidéo : Créer sa vitrine en ligne avec WordPress</strong> est le programme complet conçu pour vous guider de A à Z, depuis l'achat du nom de domaine jusqu'à la mise en ligne d'un site moderne et référencé sur Google.</p>\n\n<p>Grâce à des modules vidéo enregistrés en haute définition et expliqués dans un langage simple sans jargon informatique, vous construisez votre propre site en suivant les pas du formateur sur votre écran.</p>\n\n<h3>Le programme pédagogique détaillé du cours</h3>\n<p>Cette formation s'articule autour de modules d'apprentissage progressifs :</p>\n<ul>\n  <li><strong>Module 1 : Nom de domaine et hébergement web</strong> : Réserver votre nom de domaine professionnel et installer <a href=\"https://wordpress.org\" target=\"_blank\" rel=\"noopener noreferrer\">WordPress</a> en 1 clic chez votre hébergeur.</li>\n  <li><strong>Module 2 : Prise en main et configuration de WordPress</strong> : Paramétrer les réglages généraux, les permaliens SEO et le thème graphique.</li>\n  <li><strong>Module 3 : Conception de pages avec Elementor</strong> : Maîtriser le constructeur de page visuel Elementor pour créer des mises en page élégantes (Page d'accueil, Services, À propos, Contact).</li>\n  <li><strong>Module 4 : Optimisation mobile (Responsive)</strong> : Adapter parfaitement le design et les boutons d'action sur smartphones et tablettes.</li>\n  <li><strong>Module 5 : Référencement naturel (SEO local) & Sécurité</strong> : Optimiser vos balises meta, installer un plugin de sécurité anti-spam et connecter votre site à Google Maps.</li>\n</ul>\n\n<h3>Devenez 100% autonome sur la gestion de votre site</h3>\n<p>À l'issue de cette formation vidéo :</p>\n<ul>\n  <li>Vous possédez un site vitrine sur-mesure à l'image de votre marque artisanale.</li>\n  <li>Vous savez modifier vos textes, ajouter de nouvelles réalisations et mettre à jour vos contenus en toute autonomie.</li>\n  <li>Vous économisez des milliers d'euros de prestations d'agences web.</li>\n</ul>\n\n<p>Si vous envisagez également d'ajouter une boutique en ligne e-commerce, optez pour notre <a href=\"/produit/bundle-vitrine-boutique-wordpress-le-combo-pour-vendre-en-ligne\">Bundle Formation Vitrine + WooCommerce</a> pour bénéficier de 48 € de réduction. Découvrez toutes nos ressources sur la <a href=\"/boutique\">boutique Guides Digitaux</a>.</p>\n\n<h3>Accès illimité 24/7 dans votre espace élève</h3>\n<p>Rejoignez la formation dès aujourd'hui et progressez à votre propre rythme ! Votre accès est valable à vie. Une question sur le programme ? Contactez-nous à tout moment via la <a href=\"/contact\">page de contact</a>.</p>",
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
