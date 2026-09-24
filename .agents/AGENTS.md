# RÈGLE ABSOLUE D'INTÉGRITÉ ET D'EXÉCUTION STRICTE :

Tu agis uniquement comme un exécutant technique. Tu as l'interdiction formelle de prendre des initiatives non demandées ou de "réoptimiser" ce qui fonctionne déjà.

- **Périmètre strict** : Tu modifies uniquement et exclusivement l'élément précis que je t'indique. Tout le reste doit demeurer rigoureusement intact, au mot près et à la virgule près.
- **Structure et ordre intouchables** : Tu ne touches jamais à l'ordre, à la hiérarchie, à la numérotation ou à l'organisation de mes modules, cours, sections ou pages, sauf si je te donne explicitement l'ordre : "Réorganise l'ordre de...".
- **Copies et métadonnées protégées** : Tu ne reformules pas, ne renommes pas et ne modifies pas mes titres, mes textes de vente, mes tarifs ou mes programmations/dates. Si tu touches à un élément adjacent sans demande explicite, la réponse sera considérée comme nulle.
- **Validation obligatoire** : Si tu penses qu'une modification annexe est nécessaire ou bénéfique, tu ne l'appliques pas : tu me poses la question d'abord et tu attends mon accord avant d'agir.

---

# Directives de Développement Strictes - Guides Digitaux

1. **ZÉRO DONNÉE EN DUR** : Il est strictement interdit d'insérer des données factices ou en dur (hardcoded) dans les composants ou pages. Toute donnée doit provenir de requêtes Supabase réelles ou d'un typage TypeScript strict.

2. **SÉCURITÉ RLS OBLIGATOIRE** : L'isolation des données utilisateur (Achats de A isolés de B) doit être garantie par la Row Level Security (RLS) sur Supabase (`auth.uid() = user_id`). Ne compte jamais uniquement sur le front pour filtrer la sécurité.

3. **TRANSPARENCE DES MODIFICATIONS** : Interdiction de modifier des fichiers en douce ou sans expliquer explicitement le changement. Tout refactoring doit être annoncé.

4. **COMMITS GIT SUR APPROBATION EXPLICITE** : Interdiction d'exécuter des `git commit` ou `git push` sans la validation et l'accord préalable de l'utilisateur.

5. **STACK & BEST PRACTICES** :
   - Utilise exclusivement `@supabase/ssr` pour la gestion des sessions et des requêtes dans l'App Router.
   - Pas de `any` en TypeScript. Utilise des types TypeScript stricts.
   - Les requêtes d'achat doivent repasser par les webhooks Stripe validés en BDD Supabase.

6. **RÉDACTION FICHES PRODUIT (SEO >= 600 MOTS & MAILLAGE)** : Dès la création d'une fiche produit ou la réception d'un PDF, s'imprégner du contenu pour rédiger une description longue ultra-complète de plus de 600 mots. Chaque fiche doit comporter des sections `<h3>`, des listes à puces `<ul><li>`, des mots-clés SEO ciblés (artisans, créateurs, indépendants, Lille/Nord), un maillage interne poussé (`<a href="...">` vers formations, ebooks, boutique, contact) et des liens externes de référence (`target="_blank" rel="noopener noreferrer"`).

7. **ACCESSIBILITÉ STRICTE (RGAA & WCAG - ZÉRO LIEN REDONDANT) & SANCTUAIRE TRACKERS PUBLICITAIRES** :
   - **Zéro lien redondant (WCAG 2.4.4 / RGAA Critère 13.1)** : Ne jamais insérer plusieurs balises `<a>` menant à la même URL dans un même conteneur (ex: image + titre + bouton détails). Utiliser le pattern accessible du lien étendu (*stretched-link* avec `after:absolute after:inset-0` sur le titre, et boutons d'action secondaires comme "Commander" ou "Ajouter" en `relative z-10`).
   - **SANCTUAIRE ABSOLU DES SCRIPTS & TRACKERS (META PIXEL, GTM, GA4, NOSCRIPT)** : Interdiction formelle de toucher, altérer ou supprimer les balises `<noscript>`, les pixels Meta / Facebook Ads, Google Tag Manager (GTM), GA4 ou tout tracker publicitaire. Même si un outil d'audit (ex: WAVE) affiche une alerte consultative (*advisory alert*) sur un `<noscript>`, ne JAMAIS les supprimer car ils sont indispensables aux campagnes publicitaires et au tracking des conversions.
   - **Conformité globale** : Structure sémantique rigoureuse des titres (`h1`, `h2`, `h3`), attributs `aria-label`, images décoratives avec `alt="" aria-hidden="true"`, et accessibilité au clavier / lecteur d'écran.
