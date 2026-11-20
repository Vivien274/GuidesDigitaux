export interface ProjectItem {
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
  gallery?: string | null;
  liveUrl?: string | null;
  featured?: boolean;
  sortOrder?: number;
  createdAt?: string | Date;
  updatedAt?: string | Date;
}

export const PROJECTS_DATA: ProjectItem[] = [
  {
    "id": "cmshmkrya0009avo9pa0oxv5b",
    "slug": "cyaness",
    "title": "Cyaness",
    "clientName": "Cyntia - Cyaness Savonnerie Artisanale",
    "category": "Boutique E-Commerce - Savonnerie Artisanale",
    "year": "2026",
    "summary": "Refonte complète et renaissance digitale de la boutique e-commerce de savons artisanaux Cyaness : univers premium accessible, charte graphique raffinée et accessibilité numérique sans concession.",
    "challenge": "Cyntia m’a contactée pour repenser totalement la présence en ligne de sa marque de savons artisanaux, Cyaness (* site internet : cyaness.com *). Bien qu'elle disposait déjà d'un site e-commerce, celui-ci ne reflétait plus la qualité de ses créations ni l'image de marque qu'elle souhaitait véhiculer.\n\nPlutôt que d'effectuer une simple mise à jour visuelle, j'ai fait le choix stratégique de repartir d'une page blanche. L'objectif était de reconstruire un écosystème e-commerce moderne, élégant et performant, capable de sublimer ses produits et d'offrir une expérience d'achat irréprochable.\n\nCyntia souhaitait positionner Cyaness comme une marque premium mais accessible, mettant en avant son savoir-faire artisanal, l'esthétique de ses produits et ses engagements éthiques.\n\nÀ l'issue de notre cadrage, j'ai défini les axes prioritaires du projet :\n\n➡️ Une refonte graphique complète : Moderniser l'image de la marque en conservant le logo existant, tout en retravaillant la palette de couleurs pour un rendu haut de gamme.\n\n➡️ Une accessibilité numérique sans concession : Imposer des contrastes visuels forts et une typographie parfaitement lisible pour garantir un confort de lecture optimal à tous les visiteurs.\n\n➡️ Une expérience utilisateur (UX) entièrement repensée : Restructurer l'arborescence et le menu pour pallier l'absence totale de parcours utilisateur sur l'ancien site.\n\n➡️ La valorisation de l'éthique et du savoir-faire : Mettre en avant la qualité des ingrédients, le fait main et les valeurs écoresponsables de la savonnerie.\n\n➡️ Un levier de conversion et de fidélisation : Implémenter des outils marketing efficaces (pop-up d'offre de lancement, newsletter et formulaire optimisé).",
    "solution": "Pour mener à bien cette transformation globale, j'ai piloté le projet en m'entourant d'expertises complémentaires (UX designer freelance et photographe professionnel).\n\nJ'ai défini l'orientation stratégique et technique du nouveau site Cyaness autour de plusieurs choix majeurs :\n\n• La refonte de l'univers visuel et le respect de l'accessibilité : En collaboration avec mon UX designer freelance, nous avons retravaillé la charte graphique globale. Tout en conservant le logo d'origine de Cyntia, nous avons entièrement repensé la palette chromatique. J'ai apporté une attention toute particulière à l'accessibilité web : j'ai exigé des contrastes suffisamment élevés pour respecter les normes du digital, assurant une lisibilité parfaite pour tous les profils d'utilisateurs sans dénaturer l'aspect élégant.\n\n• Une arborescence et un parcours UX retravaillés : L'ancien site souffrait d'un manque d'organisation. J'ai entièrement repensé la navigation, de la page d'accueil jusqu'au paiement. Nous avons conçu des menus simplifiés et des filtres de recherche fluides permettant de naviguer facilement par type de produit ou par besoin spécifique de peau.\n\n• Une mise en valeur visuelle d'exception : Pour incarner le positionnement premium, un travail visuel de haute qualité était indispensable. Les visuels produits ont été réalisés par le photographe [L'instant Brut](https://linstantbrut.fr), apportant une touche esthétique authentique et professionnelle qui sublime le travail de Cyntia.\n\n• Une narration axée sur l'éthique et la transparence : J'ai conseillé d'intégrer des sections dédiées à l'histoire de la marque et à sa démarche artisanale, afin de créer un lien émotionnel fort avec les clients et de justifier le positionnement haut de gamme.\n\n• La réalisation & Les fonctionnalités clés :\n- Une vitrine e-commerce haut de gamme et accessible : Mise en page épurée, aérée et moderne mettant en scène les visuels des savons artisanaux, soutenue par une typographie et des couleurs à fort contraste pour une lisibilité parfaite.\n- Fiches produits détaillées et immersives : Présentation complète de la composition des savons, des bienfaits pour la peau, des conseils d'utilisation et des engagements écoresponsables (zéro déchet, ingrédients naturels).\n- Dispositif marketing de lancement : Création et paramétrage d'une pop-up d'accueil élégante proposant une offre promotionnelle exclusive pour le premier mois d'ouverture du nouveau site.\n- Stratégie de capture d'e-mails & Newsletter : Intégration d'un système de capture d'e-mails fluide et conforme RGPD.\n- Formulaire de contact et demandes spécifiques sur-mesure : Refonte complète du formulaire pour les questions ou commandes personnalisées (événements, coffrets cadeaux, commandes pro).\n- Tunnel de commande optimisé : Panier et page de commande simplifiés à l'extrême pour réduire au minimum les frictions.\n\n• L'accompagnement & La livraison :\n- Prise en main du back-office : Formation d'un après-midi pour transmettre à Cyntia la gestion du catalogue (ajout de nouveaux savons, stocks, expéditions).\n- Guide d'administration personnalisé : Documentation récapitulative pour gérer ses promotions, exporter les prospects newsletter et mettre à jour ses contenus de manière autonome.\n- Optimisation technique continue : Protocoles de sécurité, sauvegardes automatiques et vitesse de chargement.",
    "result": "Positionnement 'premium accessible' clarifié, expérience utilisateur fluide et accessible, et lancement réussi avec engagement fort dès les premières semaines.",
    "testimonialText": "Le nouveau site cyaness.com met enfin en valeur mes savons artisanaux avec une élégance et une clarté incroyables. La boutique est fluide et mes clients adorent !",
    "testimonialAuthor": "Cyntia - Fondatrice de Cyaness",
    "image": "/images/cyaness/cyaness-hero.webp",
    "gallery": "[\"/images/cyaness/cyaness-hero.webp\",\"/images/cyaness/cyaness-origines.webp\",\"/images/cyaness/cyaness-histoire.webp\",\"/images/cyaness/cyaness-engagements.webp\",\"/images/cyaness/cyaness-catalogue.webp\",\"/images/cyaness/cyaness-gamme.webp\",\"/images/cyaness/cyaness-avis.webp\",\"/images/cyaness/cyaness-contact.webp\",\"/images/cyaness/cyaness-newsletter.webp\"]",
    "liveUrl": "https://cyaness.com",
    "featured": true,
    "sortOrder": 1,
    "createdAt": "2026-08-06T14:42:41.410Z",
    "updatedAt": "2026-11-07T17:41:26.031Z"
  },
  {
    "id": "cmshlim450007av6e789kbnp4",
    "slug": "1m2-masante",
    "title": "1m2 : ma santé !",
    "clientName": "Edwige - Association 1m2 : ma santé !",
    "category": "Site vitrine - Association & Santé",
    "year": "2026",
    "summary": "Création intégrale d'un site vitrine accueillant, chaleureux et facile d'administration pour l'association 1m2 : ma santé !, dédiée au bien-être, à la prévention et aux habitudes de vie saines.",
    "challenge": "Edwige m’a contactée suite à la création de son association « 1m2 : ma santé ! » (site internet : 1m2-masante.fr). Fraîchement lancée dans cette belle aventure dédiée au bien-être, à la prévention et à l'accessibilité aux habitudes de vie saines, elle ressentait la nécessité fondamentale de se doter d'une présence en ligne solide, accueillante et rassurante.\n\nN'étant pas particulièrement à l'aise avec le digital et appréhendant la gestion technique quotidienne d'un outil web, Edwige m'a confié la création intégrale de son site vitrine. Son objectif était d'obtenir une plateforme captivante, chaleureuse et représentative de ses engagements, qu'elle pourrait ensuite administrer en toute simplicité au quotidien.\n\nÀ l'issue de nos premiers échanges, j'ai identifié et structuré ses attentes principales pour ce projet :\n\n➡️ Une identité visuelle fidèle et incarnée : Traduire graphiquement l'esprit et les valeurs de l'association à travers un univers à la fois naturel, chaleureux, vivant et coloré.\n\n➡️ Un site vitrine clair et accessible : Structurer les informations essentielles pour présenter la vision, la philosophie et les ateliers de l'association de façon simple et attrayante pour tous les publics.\n\n➡️ Une facilité d'administration et d'autonomie : Développer une solution technique ergonomique permettant à Edwige d'effectuer elle-même ses mises à jour sans crainte d'endommager la mise en page.\n\n➡️ Un canal de contact fluide et optimisé : Faciliter les échanges avec les futurs adhérents, participants et partenaires grâce à une prise de contact claire et structurée.",
    "solution": "Face au profil d'Edwige et à sa crainte des outils informatiques complexes, j'ai élaboré une stratégie web sur-mesure, épurée et rassurante. J'ai traduit ses idées et ses besoins en une architecture digitale efficace et adaptée.\n\nJ'ai orienté le projet vers des choix techniques et graphiques répondant parfaitement à ses objectifs :\n\n• Le choix d'un WordPress épuré et ultra-accessible : J'ai recommandé la plateforme WordPress pour sa pérennité et sa flexibilité. Afin d'offrir à Edwige une interface d'administration claire et sans stress, j'ai sélectionné et configuré un constructeur visuel intuitif, allégé de toutes les fonctionnalités superflues.\n\n• Une direction artistique « Naturelle & Colorée » : Pour la création de la charte graphique, j'ai mis Edwige en relation avec un partenaire freelance. Ensemble, ils ont élaboré un univers visuel original associant des teintes végétales et douces (évoquant la santé, la terre et la sérénité) à des touches de couleurs pimpantes et chaleureuses (symbolisant l'énergie, l'accueil et le dynamisme).\n\n• Optimisation SEO et réécriture des contenus : J'ai retravaillé l'ensemble des textes fournis par Edwige pour aérer la lecture et hiérarchiser les messages clés. J'y ai intégré naturellement des termes stratégiques afin d'assurer un bon référencement naturel (SEO) local sur les requêtes liées à la santé et au bien-être.\n\n• Conception UX/UI centrée sur l'utilisateur : J'ai pensé l'arborescence du site pour qu'elle soit la plus fluide possible. Les menus sont synthétiques, les appels à l'action (demande d'information, adhésion, contact) sont bien visibles sans être agressifs, et l'expérience est parfaitement optimisée pour tous les écrans (responsive design).\n\n• La réalisation & Les fonctionnalités clés :\n- Une page d'accueil engageante et bienveillante : Design immersif dès l'arrivée sur le site grâce à un bandeau d'accueil chaleureux, présentation synthétique du concept « 1m2 » et accès rapides vers les rubriques clés.\n- La mise en valeur des activités et ateliers : Fiches explicatives claires pour détailler les différents projets et ateliers de l'association.\n- Un formulaire de contact avec présélection des demandes : Formulaire guidé (adhésion, question sur un atelier, partenariat) permettant de trier les emails reçus.\n- Optimisation technique, sécurité et rapidité : Protection anti-spam, optimisation des temps de chargement, et conformité RGPD.\n\n• La formation et la transmission du projet :\n- Session de prise en main personnalisée : Formation individuelle à distance pour guider pas à pas Edwige dans l'interface d'administration.\n- Guide d'utilisation sur-mesure : Guide pas-à-pas rédigé et illustré récapitulant les actions courantes (modifier un texte, remplacer une image, publier un événement).\n- Levée des blocages et prise de confiance : Accompagnement personnalisé pour transformer ses appréhensions initiales en enthousiasme.",
    "result": "Vitrine digitale moderne et authentique, autonomie sereine sans blocage technique et canal de ralliement efficace.",
    "testimonialText": "Le site 1m2-masante.fr reflète exactement l'esprit et la chaleur de notre association. Stéphanie m'a formée pas à pas et je gère mon site en toute sérénité !",
    "testimonialAuthor": "Edwige - Présidente de 1m2 : ma santé !",
    "image": "/images/1m2masante/1m2masante-hero.webp",
    "gallery": "[\"/images/1m2masante/1m2masante-hero.webp\",\"/images/1m2masante/1m2masante-histoire.webp\",\"/images/1m2masante/1m2masante-origine.webp\",\"/images/1m2masante/1m2masante-plantes.webp\",\"/images/1m2masante/1m2masante-pedagogie.webp\",\"/images/1m2masante/1m2masante-enfants.webp\",\"/images/1m2masante/1m2masante-soutenir.webp\",\"/images/1m2masante/1m2masante-points-vente.webp\",\"/images/1m2masante/1m2masante-contact.webp\",\"/images/1m2masante/1m2masante-formulaire.webp\"]",
    "liveUrl": "https://1m2-masante.fr",
    "featured": true,
    "sortOrder": 2,
    "createdAt": "2026-08-06T14:13:00.918Z",
    "updatedAt": "2026-11-07T17:41:26.036Z"
  },
  {
    "id": "cmshcf5se0008avlqywwv6miv",
    "slug": "studiomacarons",
    "title": "Studio macarons",
    "clientName": "Camille - Studio Macarons",
    "category": "Boutique en ligne - Pâtissier",
    "year": "2025",
    "summary": "Camille m'a contactée pour la réalisation de son site internet. Elle avait démarré un site sur WordPress avec son nom de domaine et hébergement, mais ne savait pas si ce qu'elle avait commencé était correct.",
    "challenge": "Camille m'a contacté pour la réalisation de son site internet. Elle avait démarré un site sur Wordpress, avait déjà acheté le nom de domaine et l'hébergement, mais ne savais pas si ce qu'elle avait commencé était correct, et prenait beaucoup de temps à la réalisation du site. De plus elle voulait ajouter des fonctionnalités à son site :\n\n- Une page pour présenter ses ateliers patisserie, avec la possibilité de les réserver et de les payer en ligne\n- Une boutique en ligne pour proposer les produits en click and collect\n- Un formulaire de contact pour la prise de contact, de demande de personnalisation, d'évènementiel.",
    "solution": "J'ai proposé à Camille de rester sur Wordpress, en choisissant un thème compatible Woocommerce pour la boutique en ligne, mais surtout en lien avec son secteur d'activité. Nous avons fait la recherche du thème ensemble, j'ai repensé ses pages vitrine en partant de son texte de départ, mais en y incrustant des mots clés pour un meilleur référencement naturel.\n\nJ'ai travaillé sur la page atelier en y ajoutant une extension permettant la réservation des ateliers proposés sous forme de calendrier. De cette manière, les clients ont une vision nette des dates et horaires proposés, mais paient aussi directement l'atelier en ligne (gain de temps et de logistique: plus d'impayés, et logistique facilitée par la mise en place d'un nombre de participants restreints).\n\nUne page de contact optimisée pour une simplification de réception des emails (les visiteurs doivent choisir un objet dans un menu déroulant, qui sera visible par Studio macaron sur leur boîte email : de quoi faciliter les réponses et trier facilement les emails).\n\nUne optimisation du contenu SEO pour la visibilité locale, des photos au format WebP, des balises ALT sur chaque photo en ligne... Les contenus juridiques en vigueur pour une boutique en ligne (mentions légales, politique de confidentialité, RGPD, CGV).",
    "result": "Réservation automatique des ateliers pâtisserie sans impayés, boutique Click & Collect fonctionnelle et visibilité locale renforcée.",
    "testimonialText": "Grâce à Stéphanie, mes ateliers se réservent et se paient directement en ligne sans aucun stress de gestion !",
    "testimonialAuthor": "Camille - Studio Macarons",
    "image": "/images/studiomacarons/studiomacarons.webp",
    "gallery": "[\"/images/studiomacarons/studiomacarons.webp\",\"/images/studiomacarons/page d'accueil-studiomacarons.webp\",\"/images/studiomacarons/page ateliers - studiomacarons.webp\",\"/images/studiomacarons/ateliers enfants - studiomacarons.webp\",\"/images/studiomacarons/page boutique studiomacarons.webp\",\"/images/studiomacarons/personnalisation - studiomacarons.webp\",\"/images/studiomacarons/formulaire de contact - studiomacarons.webp\",\"/images/studiomacarons/avis - studiomacarons.webp\"]",
    "liveUrl": "https://studiomacarons.fr",
    "featured": true,
    "sortOrder": 3,
    "createdAt": "2026-08-06T09:58:23.246Z",
    "updatedAt": "2026-11-07T17:41:26.043Z"
  },
  {
    "id": "cmshm4hc00008avhc4oc301gz",
    "slug": "guides-digitaux",
    "title": "Guides Digitaux",
    "clientName": "Stéphanie ROCQ - Guides Digitaux",
    "category": "Boutique E-Commerce & E-Learning (LMS)",
    "year": "2026",
    "summary": "Création de ma propre boutique en ligne et plateforme de formations e-learning dédiée aux artisans, créateurs et micro-entrepreneurs pour se digitaliser en toute autonomie.",
    "challenge": "En parallèle de mon activité de consultante en digitalisation, j'ai souhaité développer une offre complémentaire et accessible pour accompagner encore plus loin les indépendants : la création de ma propre boutique en ligne, Guides Digitaux (* site internet : guides-digitaux.com *).\n\nMon objectif principal était d'apporter une réponse concrète aux artisans, créateurs à domicile et micro-entrepreneurs qui recherchent des solutions autonomes, concrètes et sans jargon technique pour faire progresser leur activité. Pour ne pas brouiller le positionnement de mon site vitrine de conseil, je voulais une plateforme e-commerce totalement dédiée et indépendante, proposant des ressources 100 % numériques et téléchargeables.\n\nPour répondre à l'ensemble des besoins de ma cible, le projet devait intégrer trois piliers majeurs :\n\n➡️ Une boutique e-commerce fluide pour produits digitaux : Vendre des guides, e-books, modèles et checklists immédiatement téléchargeables après achat.\n\n➡️ Un espace blog à forte valeur ajoutée : Publier des articles pédagogiques sur la digitalisation des artisans pour travailler le SEO naturel et offrir du contenu gratuit de qualité.\n\n➡️ Une plateforme d'apprentissage et de formations vidéo (LMS) : Héberger des cours en ligne structurés par modules, avec un espace membre sécurisé réservé aux « étudiants » pour suivre leur progression.\n\n➡️ Un univers de marque accessible et décomplexant : Concevoir une identité claire, moderne et rassurante, fidèle à ma pédagogie « zéro jargon ».",
    "solution": "La création d'un écosystème combinant e-commerce, plateforme e-learning et stratégie de contenu demande une architecture technique robuste mais parfaitement optimisée pour éviter toute lourdeur de chargement.\n\nJ'ai donc conçu et orchestré l'ensemble de la structure digitale autour de choix stratégiques et ergonomiques :\n\n• Une architecture WordPress & WooCommerce sur-mesure : J'ai configuré WordPress couplé à WooCommerce en l'optimisant spécifiquement pour la vente de produits dématérialisés. J'ai automatisé la livraison des fichiers PDF dès la validation de la commande pour garantir un parcours d'achat instantané et sans accroc.\n\n• L'intégration d'un système LMS (Learning Management System) : Pour la partie vidéo et formations en ligne, j'ai implémenté et paramétré une plateforme de cours intégrée. Ce système permet de gérer la progression des élèves, de verrouiller les accès en fonction des achats et de proposer une interface d'apprentissage fluide, épurée et immersive.\n\n• Une stratégie éditoriale et SEO axée sur l'artisanat : J'ai pensé la section blog comme un véritable levier d'acquisition. J'ai structuré une ligne éditoriale répondant directement aux problématiques concrètes des artisans (visibilité locale, organisation, réseaux sociaux), optimisée avec des mots-clés stratégiques pour capter un trafic qualifié.\n\n• Une expérience utilisateur (UX/UI) claire et intuitive : J'ai conçu un design épuré, très visuel et structuré par catégories (Guides, Checklists, Formations, Blog). L'objectif était d'offrir une navigation limpide sur ordinateur comme sur mobile, permettant de trouver la bonne ressource en seulement deux clics.\n\n• La réalisation & Les fonctionnalités clés :\n- Catalogue de produits numériques & téléchargement immédiat : Fiches produits détaillées avec aperçus et système de téléchargement automatique et sécurisé par e-mail et espace client.\n- Espace formation & lecteur vidéo interactif : Tableau de bord dédié permettant de retrouver ses formations achetées, de suivre sa progression et d'accéder aux ressources complémentaires.\n- Blog optimisé et maillage interne : Articles de blog structurés intégrant des appels à l'action intelligents vers les guides ou checklists payants.\n- Tunnel de vente et paiement sécurisé : Intégration des passerelles de paiement (CB, Stripe, PayPal) avec checkout simplifié.\n- Automatisations et e-mails transactionnels : Paramétrage d'e-mails automatiques personnalisés pour l'envoi des factures, des liens et des accès de formation.\n\n• La gestion au quotidien & L'optimisation continue :\n- Gestion autonome des contenus : Système de publication simplifié permettant d'ajouter de nouveaux guides PDF ou de créer de nouveaux modules vidéo en quelques minutes.\n- Suivi des ventes et statistiques : Outils d'analyse pour mesurer les performances et le comportement des acheteurs.\n- Sérénité technique : Protocoles de sauvegarde automatique, sécurité renforcée et optimisation du cache.",
    "result": "Offre diversifiée et évolutive du guide téléchargeable à la formation vidéo complète, levier d'acquisition régulier et expérience client automatisée 24h/24.",
    "testimonialText": "Guides-Digitaux.com rend la digitalisation simple et accessible à tous les artisans grâce à des formations vidéo et checklists concrètes.",
    "testimonialAuthor": "Stéphanie ROCQ - Fondatrice de Guides Digitaux",
    "image": "/images/guidesdigitaux/guidesdigitaux-hero.webp",
    "gallery": "[\"/images/guidesdigitaux/guidesdigitaux-hero.webp\",\"/images/guidesdigitaux/guidesdigitaux-presentation.webp\",\"/images/guidesdigitaux/guidesdigitaux-artisans.webp\",\"/images/guidesdigitaux/guidesdigitaux-stephanie.webp\",\"/images/guidesdigitaux/guidesdigitaux-concept.webp\",\"/images/guidesdigitaux/guidesdigitaux-formations.webp\",\"/images/guidesdigitaux/guidesdigitaux-blog.webp\",\"/images/guidesdigitaux/guidesdigitaux-newsletter.webp\",\"/images/guidesdigitaux/guidesdigitaux-footer.webp\"]",
    "liveUrl": "https://guides-digitaux.com",
    "featured": true,
    "sortOrder": 4,
    "createdAt": "2026-08-06T14:30:01.152Z",
    "updatedAt": "2026-11-07T17:41:26.040Z"
  },
  {
    "id": "cmsg9hyoz000bavpaum41xvwb",
    "slug": "linstant-brut",
    "title": "L'instant Brut",
    "clientName": "Vivien - Photographe",
    "category": "Site portfolio - Photographe",
    "year": "2025",
    "summary": "Photographe passionné depuis plusieurs années, Vivien a longtemps capturé le monde qui l’entoure pour le plaisir, avant de décider de franchir un cap : proposer ses services en tant que photographe indépendant.",
    "challenge": "Photographe passionné depuis plusieurs années, Vivien a longtemps capturé le monde qui l’entoure pour le plaisir, avant de décider de franchir un cap : proposer ses services en tant que photographe indépendant.\n\nSon approche est simple et sincère. À travers L’Instant Brut, il souhaite mettre en valeur les instants vrais, les émotions spontanées, les lieux ou les visages qui racontent quelque chose. Il ne s’agit pas de faire du bruit ou de poser un décor trop lisse, mais de saisir la beauté brute de ce qui est là, sans artifices.\n\nCe site est à la fois sa vitrine et son point de contact. Un espace pour partager ses images, montrer son univers, et permettre à celles et ceux qui le souhaitent de le contacter pour une séance photo – que ce soit pour un événement, un portrait, un reportage ou un projet plus personnel.\n\nL’Instant Brut, c’est une démarche humaine, une envie de faire des images qui résonnent, et surtout une manière de photographier qui reste fidèle à ce que Vivien aime le plus : l’authenticité.\n\nIl y a plusieurs défis à relever :\n- gérer les performances malgré des images lourdes et grandes\n- avoir un accès \"verrouillable\" pour ses clients\n- afficher ses prestations qui sont très détaillées, d'une manière simple.",
    "solution": "J'ai conseillé L'instant Brut sur la mise en place d'un site Wordpress. C'est un CMS que je maîtrise bien et qui propose beaucoup d'extensions adaptées à la photo.\n\nNous avons fait la recherche du thème ensemble. Il avait déjà le logo et une idée de charte graphique assez précise.\n\nJe lui ai conseillé une structure de navigation simple, qui reflète à la fois son image, et les besoins des clients. Je l'ai challengé aussi sur la définition de son offre, qui était claire pour lui, mais pas simple à expliquer.\n\nIl a choisi d'animer un seul réseau social : Instagram. De mon point de vue c'est un choix logique, puisque le cœur de son activité est aussi le type de média que l'on partage le plus sur Instagram : des photos.",
    "result": "Un espace d'exposition sobre et performant, valorisant les images authentiques de Vivien.",
    "testimonialText": "Une approche éthique et transparente. Stéphanie prend le temps d'expliquer chaque choix.",
    "testimonialAuthor": "Vivien - L'instant Brut",
    "image": "/images/linstantbrutmin.jpg",
    "gallery": "[\"/images/linstantbrut/linstantbrut-1.webp\",\"/images/linstantbrut/linstantbrut-2.webp\",\"/images/linstantbrut/linstantbrut-3.webp\",\"/images/linstantbrut/linstantbrut-4.webp\",\"/images/linstantbrut/linstantbrut-5.webp\"]",
    "liveUrl": "https://linstantbrut.fr",
    "featured": true,
    "sortOrder": 5,
    "createdAt": "2026-08-05T15:48:48.996Z",
    "updatedAt": "2026-11-07T17:41:26.046Z"
  },
  {
    "id": "cmsg9hynq0008avpa0zrvzk51",
    "slug": "artfolium",
    "title": "Artfolium",
    "clientName": "Arthur - Paysagiste",
    "category": "Paysagiste, 1 an d'expérience à son compte",
    "year": "2025",
    "summary": "Arthur, paysagiste récemment installé à son compte, avait créé AJRecyclage mais le nom choisi ne le rendait pas visible en ligne.",
    "challenge": "Arthur, paysagiste récemment installé à son compte, avait créé AJRecyclage mais le nom choisi ne le rendait pas visible en ligne, car trop compliqué et ne renvoyait pas à son métier de jardinier. Il a fait appel aux services de Stratec-Digital.\n\nL'objectif est simple : revoir son image, son nom pour qu'il colle plus à son activité de jardinier. Améliorer sa présence en ligne, mettre de la cohérence en ajoutant de la clarté à son offre. Tout en restant simple car Arthur ne souhaite pas passer beaucoup de temps à gérer la partie digitale.",
    "solution": "J'ai donc conseillé un changement de nom, et après quelques échanges nous avons trouvé \"Artfolium\" (le mot \"art\" lui tenait à cœur et une consonance latine en rapport avec les noms des plantes en botanique était demandée).\n\nNous avons ensuite revu entièrement ses réseaux sociaux (Instagram et Facebook).\n\nUn calendrier éditorial et quelques posts ont été créés ainsi que des conseils dans la gestion de ses réseaux sociaux.\n\nEn collaboration avec un UI/UX designer, nous avons créé une charte graphique ainsi qu'un logo vectorisé et sous différents formats (couleurs, noir et blanc, version favicon etc).\n\nDans le but de lui faciliter la vie pour ses flyers / cartes de visites, je lui ai conseillé la création d'une page de gestion de liens, pratique dans le cas d'un éventuel changement et d'une économie d'impressions.\n\nArthur souhaite passer de micro-entreprise à entreprise individuelle prochainement donc nous avons réfléchi à un site internet évolutif en fonction de l'évolution de ses services (possible passage en boutique en ligne, ajout d'un formulaire de contact etc).",
    "result": "Identité de marque forte et lisible, gestion des réseaux simplifiée et présence locale optimisée.",
    "testimonialText": "Stéphanie m'a construit une nouvelle marque claire et efficace.",
    "testimonialAuthor": "Arthur - Artfolium",
    "image": "/images/artfolium.jpg",
    "gallery": "[\"/images/artfolium/artfolium-1.jpg\",\"/images/artfolium/capture-site-artfolium.webp\",\"/images/artfolium/capture-paage-artfolium.webp\",\"/images/artfolium/logo-carre-artfolium.webp\"]",
    "liveUrl": "https://artfolium.fr",
    "featured": true,
    "sortOrder": 6,
    "createdAt": "2026-08-05T15:48:48.950Z",
    "updatedAt": "2026-11-07T17:41:26.049Z"
  },
  {
    "id": "cmsg9hypi000cavpauthpf5x6",
    "slug": "spoolio",
    "title": "Spoolio",
    "clientName": "Vivien - Spoolio",
    "category": "Site e-commerce, objets 3D pour les grands enfants",
    "year": "2025",
    "summary": "Vivien, le créateur de Spoolio, voulait créer son site de lui-même. Il avait envie de créer une boutique en ligne d'objets en impression 3D.",
    "challenge": "Vivien, le créateur de Spoolio, voulait créer son site de lui-même. Il avait envie de créer une boutique en ligne d'objets en impression 3D, destinés aux geeks et grands enfants. Pour ce projet, il voulait être aidé pour ne rien oublier (et surtout pour être dans les normes légales, logistique et de référencement).",
    "solution": "Nous sommes donc partis de sa charte graphique et de son logo pour créer ce site (CMS Wordpress et extension WooCommerce). Tout en avançant en autonomie, je l'ai aidé sur la partie \"ajout d'articles\", créer les différents packs et variables de ses produits.\n\nJe l'ai aidé à créer les pages légales d'un site : mentions légales et politique de confidentialité, politique de cookies et RGPD, conditions générales de vente. Je l'ai même mis en contact avec un médiateur de la consommation : qui est obligatoire lorsqu'on vend des produits à des particuliers.\n\nPour la partie logistique, je l'ai mis en contact avec des prestataires pour avoir des tarifs \"entreprises\" pour l'envoi de ses colis et on a ajouté et configuré les extensions nécessaires sur le site.\n\nPour un meilleur référencement en ligne, une page blog a été ajoutée, dans laquelle les articles parlent d'objets produits mais surtout empreints de mots-clés qui permettent une meilleure visibilité du site.\n\nLe référencement a évidemment été un enjeu important, je lui ai donc donné des conseils sur les bases du référencement et l'ai aidé dans sa mise en pratique.\n\nUne page Google My Business, pour le référencement local, a été créée et optimisée.\n\nUne page Linktree a été créée dans le but de rassembler les liens de la marque, ce qui a permis de créer des flyers ou cartes de visites papier en ajoutant ou modifiant les liens au fur et à mesure de l'évolution.",
    "result": "Boutique e-commerce opérationnelle, juridiquement conforme et optimisée pour la logistique de livraison.",
    "testimonialText": "Une boutique ultra-rapide et parfaitement adaptée aux normes et à la logistique.",
    "testimonialAuthor": "Vivien - Spoolio",
    "image": "/images/spoolio/spoolio.webp",
    "gallery": "[\"/images/spoolio/accueil-spoolio.webp\",\"/images/spoolio/footer-spoolio.webp\",\"/images/spoolio/blog-spoolio.webp\",\"/images/spoolio/panier-spoolio.webp\"]",
    "liveUrl": "https://spoolio.fr",
    "featured": false,
    "sortOrder": 7,
    "createdAt": "2026-08-05T15:48:49.014Z",
    "updatedAt": "2026-11-07T17:41:26.051Z"
  },
  {
    "id": "cmsg9hyoa0009avpaugg1t0d3",
    "slug": "dekalekatam",
    "title": "Décalé-Katam",
    "clientName": "Décalé Katam",
    "category": "Site e-commerce, objets décalés",
    "year": "2024",
    "summary": "Décalé-Katam, c’est notre projet à deux, monté en couple avec une idée simple : créer des objets en bois qui claquent — autant par leur qualité que par leur humour.",
    "challenge": "Décalé-Katam, c’est notre projet à deux, monté en couple avec une idée simple : créer des objets en bois qui claquent — autant par leur qualité que par leur humour.\n\nOn aime le beau travail, le bois massif, les finitions propres… mais on aime aussi rire un peu (beaucoup), parfois de tout, et parfois de ce qu’il ne faudrait pas. Chez nous, l’humour est assumé, parfois noir, souvent décalé, et clairement pas toujours pour les enfants.\n\nChaque objet est pensé, fabriqué, poncé, gravé avec soin… puis saupoudré d’une bonne dose d’irrévérence. Que ce soit pour offrir, pour décorer ou pour afficher fièrement votre sens de la vanne, vous trouverez ici des pièces uniques, faites maison, qui ne laissent pas indifférent.\n\nL'objectif était de créer une boutique en ligne, simple mais élégante, avec un esprit jeune et amusant. Le côté \"décalé\" et \"humour\" devait se refléter dans le site.",
    "solution": "J'ai mis en place une stratégie de communication, un ton et une ligne éditoriale claire. On mise sur le décalé, donc on communique avec un ton amusant et amical mais toujours respectueux.\n\nNous avons mis en place un calendrier éditorial et avons réparti le travail pour que l'on puisse interagir ensemble sur les différentes tâches.\n\nLe site e-commerce est créé à partir du CMS Wordpress et de son extension WooCommerce. Certains produits sont personnalisables par la taille, la couleur ou encore la gravure souhaitée.\n\nPour un meilleur référencement en ligne, une page blog a été ajoutée, dans laquelle les articles parlent d'objets produits mais surtout empreints de mots-clés qui permettent une meilleure visibilité du site.\n\nUne page Google My Business, pour le référencement local, a été créée et optimisée.\n\nUne page Linktree a été créée dans le but de rassembler les liens de la marque, ce qui a permis de créer des flyers ou cartes de visites papier en ajoutant ou modifiant les liens au fur et à mesure de l'évolution.\n\nLes réseaux principaux (Instagram et Facebook) sont régulièrement alimentés et d'autres canaux de communication ont été ajoutés pour le référencement comme Pinterest et Etsy.\n\nLe graphisme du site, du logo et des différents supports, ainsi que la production des objets est assurée par Vivien. Je m'occupe de toute la communication et de la gestion du site.",
    "result": "Boutique en ligne complète avec identité décalée affirmée et canaux de vente connectés.",
    "testimonialText": "Accompagnement au top ! Le site reflète parfaitement l'atmosphère décalée de notre marque.",
    "testimonialAuthor": "L'équipe Décalé Katam",
    "image": "/images/decalekatam/decalekatam.webp",
    "gallery": "[\"/images/decalekatam/decalekatam-2.webp\",\"/images/decalekatam/decalekatam-3.webp\",\"/images/decalekatam/page blog DK.webp\",\"/images/decalekatam/page-conception-DK.webp\"]",
    "liveUrl": "https://decale-katam.fr",
    "featured": true,
    "sortOrder": 8,
    "createdAt": "2026-08-05T15:48:48.970Z",
    "updatedAt": "2026-11-07T17:41:26.054Z"
  },
  {
    "id": "cmsg9hyos000aavpacd581n5b",
    "slug": "handmakers",
    "title": "Handmakers",
    "clientName": "Handmakers Collective",
    "category": "Blog, DIY",
    "year": "2023",
    "summary": "Handmakers est un projet personnel. L'idée était de créer un blog qui regroupe des articles parlant de DIY (Do It Yourself).",
    "challenge": "Handmakers est un projet personnel. L'idée était de créer un blog qui regroupe des articles parlant de DIY (Do It Yourself) en y mélangeant diverses activités comme la couture, l'impression 3D, la gravure laser et la personnalisation.\n\nCe projet avait comme but de m'entraîner à la conception de site internet. Il s'agit là surtout d'un projet test, en lien avec mes loisirs (autant y apporter une touche de plaisir !).",
    "solution": "J'ai donc pensé le site comme quelque chose de simple, avec une charte graphique et un logo cohérents aux couleurs choisies. Le CMS Wordpress étant le plus connu et le plus adapté à ce genre de site, ce blog est donc un Wordpress avec un thème payant.\n\nOn y retrouve 4 pages distinctes : la page d'accueil, la page \"notre histoire\", la page \"blog\" ainsi qu'une page de contact.\n\nLes mentions légales, politique de cookies et de confidentialité sont aussi présentes car obligatoires : la mention légale pour tous types de sites, mais les cookies et politique de confidentialité sont présentes du fait de l'utilisation de Google Analytics et de la présence d'un formulaire de contact.",
    "result": "Un blog créatif fluide et bien référencé mettant en avant l'univers du fait-main.",
    "testimonialText": "Un outil clair et bien pensé qui met le fait-main et la création à l'honneur.",
    "testimonialAuthor": "Handmakers",
    "image": "/images/handmakers.jpg",
    "gallery": "[\"/images/handmakers/page-accueil-handmakers.webp\",\"/images/handmakers/blog-handmakers.webp\",\"/images/handmakers/contact-handmakers.webp\"]",
    "liveUrl": "https://handmakers.fr",
    "featured": true,
    "sortOrder": 9,
    "createdAt": "2026-08-05T15:48:48.989Z",
    "updatedAt": "2026-11-07T17:41:26.056Z"
  }
];
