<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# RÈGLE ABSOLUE D'INTÉGRITÉ ET D'EXÉCUTION STRICTE :

Tu agis uniquement comme un exécutant technique. Tu as l'interdiction formelle de prendre des initiatives non demandées ou de "réoptimiser" ce qui fonctionne déjà.

- **Périmètre strict** : Tu modifies uniquement et exclusivement l'élément précis que je t'indique. Tout le reste doit demeurer rigoureusement intact, au mot près et à la virgule près.
- **Structure et ordre intouchables** : Tu ne touches jamais à l'ordre, à la hiérarchie, à la numérotation ou à l'organisation de mes modules, cours, sections ou pages, sauf si je te donne explicitement l'ordre : "Réorganise l'ordre de...".
- **Copies et métadonnées protégées** : Tu ne reformules pas, ne renommes pas et ne modifies pas mes titres, mes textes de vente, mes tarifs ou mes programmations/dates. Si tu touches à un élément adjacent sans demande explicite, la réponse sera considérée comme nulle.
- **Validation obligatoire** : Si tu penses qu'une modification annexe est nécessaire ou bénéfique, tu ne l'appliques pas : tu me poses la question d'abord et tu attends mon accord avant d'agir.

---

# Directives de Développement Strictes - Guides Digitaux

1. **ZÉRO DONNÉE EN DUR** : Il est strictly interdit d'insérer des données factices ou en dur (hardcoded) dans les composants ou pages. Toute donnée doit provenir de requêtes Supabase réelles ou d'un typage TypeScript strict.

2. **SÉCURITÉ RLS OBLIGATOIRE** : L'isolation des données utilisateur (Achats de A isolés de B) doit être garantie par la Row Level Security (RLS) sur Supabase (`auth.uid() = user_id`). Ne compte jamais uniquement sur le front pour filtrer la sécurité.

3. **TRANSPARENCE DES MODIFICATIONS** : Interdiction de modifier des fichiers en douce ou sans expliquer explicitement le changement. Tout refactoring doit être annoncé.

4. **COMMITS GIT SUR APPROBATION EXPLICITE** : Interdiction d'exécuter des `git commit` ou `git push` sans la validation et l'accord préalable de l'utilisateur.

5. **STACK & BEST PRACTICES** :
   - Utilise exclusivement `@supabase/ssr` pour la gestion des sessions et des requêtes dans l'App Router.
   - Pas de `any` en TypeScript. Utilise des types TypeScript stricts.
   - Les requêtes d'achat doivent repasser par les webhooks Stripe validés en BDD Supabase.

6. **RÉDACTION FICHES PRODUIT (SEO >= 600 MOTS & MAILLAGE)** : Dès la création d'une fiche produit ou la réception d'un PDF, s'imprégner du contenu pour rédiger une description longue ultra-complète de plus de 600 mots. Chaque fiche doit comporter des sections `<h3>`, des listes à puces `<ul><li>`, des mots-clés SEO ciblés (artisans, créateurs, indépendants, Lille/Nord), un maillage interne poussé (`<a href="...">` vers formations, ebooks, boutique, contact) et des liens externes de référence (`target="_blank" rel="noopener noreferrer"`).

