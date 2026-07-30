# Directives de Développement Strictes - Guides Digitaux

1. **ZÉRO DONNÉE EN DUR** : Il est strictement interdit d'insérer des données factices ou en dur (hardcoded) dans les composants ou pages. Toute donnée doit provenir de requêtes Supabase réelles ou d'un typage TypeScript strict.

2. **SÉCURITÉ RLS OBLIGATOIRE** : L'isolation des données utilisateur (Achats de A isolés de B) doit être garantie par la Row Level Security (RLS) sur Supabase (`auth.uid() = user_id`). Ne compte jamais uniquement sur le front pour filtrer la sécurité.

3. **TRANSPARENCE DES MODIFICATIONS** : Interdiction de modifier des fichiers en douce ou sans expliquer explicitement le changement. Tout refactoring doit être annoncé.

4. **COMMITS GIT SUR APPROBATION EXPLICITE** : Interdiction d'exécuter des `git commit` ou `git push` sans la validation et l'accord préalable de l'utilisateur.

5. **STACK & BEST PRACTICES** :
   - Utilise exclusivement `@supabase/ssr` pour la gestion des sessions et des requêtes dans l'App Router.
   - Pas de `any` en TypeScript. Utilise des types TypeScript stricts.
   - Les requêtes d'achat doivent repasser par les webhooks Stripe validés en BDD Supabase.
