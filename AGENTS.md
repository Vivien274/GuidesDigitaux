<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# AGENTS.md — GuidesDigitaux

## 1. RÔLE DE L'AGENT

Tu interviens comme développeur technique sur GuidesDigitaux.

Ton objectif est de résoudre précisément les demandes de l'utilisateur tout en préservant le fonctionnement existant de l'application, les données clients, les contenus pédagogiques et les règles métier.

Tu peux analyser, diagnostiquer, modifier, tester et corriger le code nécessaire à la demande.

Tu ne dois jamais profiter d'une tâche pour réorganiser, nettoyer, refactorer ou modifier des éléments sans rapport direct avec celle-ci.

---

# 2. PRINCIPE FONDAMENTAL : DIFF MINIMAL

Pour chaque demande, recherche la solution correcte qui nécessite le moins de modifications possible.

Avant de modifier le projet, identifie mentalement :

1. le problème demandé ;
2. sa cause probable ;
3. les fichiers directement concernés ;
4. le plus petit changement permettant de le résoudre.

Ne modifie que ce qui est nécessaire.

Une tâche locale doit produire un changement local.

Une tâche technique ne doit pas devenir une refonte d'architecture.

Une correction d'affichage ne doit pas modifier les données métier.

Une correction de stockage ne doit pas modifier les contenus.

---

# 3. PÉRIMÈTRE STRICT

Tu modifies uniquement les éléments nécessaires à la demande.

Il est interdit de profiter d'une intervention pour :

- nettoyer du code adjacent ;
- reformater des fichiers sans nécessité ;
- renommer des variables ou composants sans nécessité ;
- déplacer des fichiers ;
- modifier l'architecture ;
- changer une API ;
- créer une nouvelle abstraction ;
- ajouter un fallback ;
- migrer des données ;
- normaliser des données existantes ;
- modifier des contenus ;
- réorganiser des éléments ;
- corriger un autre problème découvert en chemin.

Si tu identifies un autre problème, signale-le à l'utilisateur après avoir traité la demande initiale.

Ne le corrige pas automatiquement.

---

# 4. RÈGLE DES 3 FICHIERS

Si une demande apparemment locale nécessite de modifier plus de 3 fichiers, vérifie avant de continuer que chaque fichier est réellement indispensable.

Si l'intervention implique une nouvelle architecture, une migration, une modification importante du modèle de données ou plusieurs couches indépendantes de l'application, explique brièvement la conséquence et demande validation avant de l'entreprendre.

Cette règle ne doit pas empêcher une correction naturellement transversale demandée explicitement par l'utilisateur.

---

# 5. CONTENU MÉTIER SANCTUARISÉ

Les contenus existants sont des données métier et non du contenu que tu peux réécrire librement.

Sans demande explicite, tu ne dois jamais :

- renommer une formation ;
- renommer un produit ;
- renommer un module ;
- renommer une leçon ;
- modifier un titre ;
- reformuler une description ;
- changer un tarif ;
- changer une date ;
- supprimer une leçon ;
- ajouter une leçon ;
- déplacer une leçon ;
- réordonner des modules ;
- modifier une URL pédagogique ;
- remplacer une vidéo ;
- supprimer un document ;
- modifier une programmation.

Les noms et contenus existants doivent être considérés comme intentionnels.

Si une incohérence semble exister, signale-la au lieu de la corriger automatiquement.

---

# 6. STRUCTURE DES FORMATIONS

L'ordre et la hiérarchie des formations sont protégés.

Ne modifie jamais :

formation → modules → leçons

ni leurs `order_index`, sauf demande explicite concernant cet ordre.

Une synchronisation avec Supabase ne constitue PAS une autorisation de modifier la structure pédagogique.

Une migration technique ne constitue PAS une autorisation de supprimer ou normaliser du contenu.

---

# 7. DONNÉES : ZÉRO INVENTION

N'invente jamais de données pour faire fonctionner une fonctionnalité.

Évite toute donnée factice ou placeholder dans le fonctionnement réel de l'application.

Les données métier doivent provenir :

- de Supabase ;
- d'une API existante ;
- d'une configuration explicitement prévue ;
- ou d'une donnée fournie par l'utilisateur.

Les données de démonstration sont acceptables uniquement dans un environnement ou composant explicitement identifié comme démonstration/test.

---

# 8. SUPABASE

Supabase est la source de vérité des données dynamiques concernées par l'application.

Utilise `@supabase/ssr` pour la gestion des sessions dans Next.js App Router lorsque cela concerne l'authentification SSR.

Respecte les politiques RLS.

L'isolation entre utilisateurs doit être assurée côté base de données lorsque les données sont privées.

Exemple attendu :

`auth.uid() = user_id`

Ne considère jamais un filtrage côté frontend comme une protection suffisante.

---

# 9. SERVICE ROLE SUPABASE

La clé `service_role` est extrêmement privilégiée.

Elle ne doit jamais être exposée au navigateur.

Elle ne doit jamais être utilisée simplement pour contourner une politique RLS qui bloque une fonctionnalité.

Si une opération serveur nécessite légitimement les privilèges administrateur, son utilisation est autorisée uniquement :

- côté serveur ;
- dans un endpoint protégé ;
- après vérification explicite des permissions de l'utilisateur ;
- lorsque l'opération nécessite réellement ces privilèges.

Ne crée jamais un contournement de sécurité uniquement parce qu'une requête Supabase échoue.

Cherche d'abord la cause du problème.

---

# 10.1 ZÉRO ÉCRITURE DISTANTE PENDANT LE DIAGNOSTIC

Par défaut, toute investigation doit être locale et en lecture seule.

Commence toujours par analyser le code, les types, les flux de données et l'historique local pertinent avant d'interroger un service distant.

Tu peux effectuer des requêtes distantes strictement en lecture seule lorsqu'une information nécessaire au diagnostic ne peut pas être déterminée localement.

Sans autorisation explicite de l'utilisateur, il est interdit d'effectuer sur Supabase ou tout autre service distant :

- `INSERT` ;
- `UPDATE` ;
- `UPSERT` ;
- `DELETE` ;
- migration ;
- modification de schéma ;
- appel RPC provoquant une écriture ;
- script de synchronisation ;
- ou toute autre opération susceptible de modifier des données distantes.

Cette interdiction s'applique également aux données de test et aux tentatives utilisant des identifiants supposés inexistants.

La présence d'une `service_role`, d'une clé secrète ou d'identifiants administrateur dans `.env.local` ne constitue jamais une autorisation d'écriture.

Une `service_role` peut être utilisée en lecture seule lorsque cela est réellement nécessaire au diagnostic, mais ses privilèges ne doivent jamais servir à tester une écriture sans accord explicite.

Si la vérification d'une hypothèse nécessite une écriture distante, explique ce que tu souhaites tester et demande l'autorisation avant de l'exécuter.

# 10.2 PAS DE FALLBACK SILENCIEUX

N'ajoute pas automatiquement un deuxième système lorsque le premier échoue.

Exemples à éviter :

Supabase → localStorage  
API serveur → écriture client directe  
BDD → données hardcodées  
API réelle → mock automatique

Un fallback peut masquer un problème et créer plusieurs sources de vérité.

Si la source principale échoue, corrige la cause lorsque c'est possible.

Si un fallback est réellement nécessaire, il doit être justifié par le besoin fonctionnel.

---

# 11. SOURCE DE VÉRITÉ UNIQUE

Évite de maintenir simultanément plusieurs versions indépendantes d'une même donnée.

Si les formations sont stockées dans Supabase, ne crée pas silencieusement une seconde version éditable dans :

- localStorage ;
- un tableau TypeScript ;
- un JSON ;
- une autre base ;
- une API parallèle.

Les constantes utilisées comme valeurs initiales, fixtures ou données de développement doivent être clairement identifiées comme telles.

---

# 12. TYPESCRIPT

Utilise TypeScript strict.

Évite `any`.

Privilégie :

- types explicites ;
- interfaces ;
- types générés depuis Supabase lorsque disponibles ;
- validation des données externes.

Ne remplace pas une erreur de typage par `any` simplement pour faire passer le build.

---

# 13. STRIPE ET ACHATS

Stripe est une source critique concernant les paiements.

Les droits d'accès issus d'un achat doivent être confirmés côté serveur.

Les événements Stripe doivent être validés avant modification des données correspondantes.

Ne donne jamais accès à un produit payant uniquement sur la base d'une information contrôlée par le frontend.

Les webhooks Stripe validés doivent rester la référence lorsqu'ils déterminent les achats et droits utilisateurs.

---

# 14. ACCESSIBILITÉ

Respecte les principes RGAA/WCAG existants.

Notamment :

- structure sémantique cohérente ;
- hiérarchie correcte des titres ;
- navigation clavier ;
- labels accessibles ;
- `aria-label` lorsque nécessaire ;
- images décoratives avec `alt=""` lorsque pertinent.

Évite les liens redondants menant exactement vers la même destination dans un même composant lorsque cela dégrade l'accessibilité.

Préserve les patterns accessibles déjà présents lorsqu'ils fonctionnent.

---

# 15. TRACKING : ZONE PROTÉGÉE

Les éléments de tracking sont sensibles.

Ne modifie, ne déplace et ne supprime pas sans demande explicite :

- Meta Pixel ;
- Facebook Ads ;
- Google Tag Manager ;
- GA4 ;
- scripts publicitaires ;
- balises `<noscript>` associées ;
- événements de conversion.

Une alerte provenant d'un outil d'audit ne constitue pas une autorisation pour supprimer un tracker.

---

# 16. SEO DES FICHES PRODUIT

Cette règle s'applique uniquement lorsqu'il est explicitement demandé de créer ou enrichir une fiche produit.

Dans ce cas :

- produire une description détaillée ;
- viser environ 600 mots ou plus lorsque le sujet le justifie ;
- structurer le contenu avec des titres pertinents ;
- utiliser des listes lorsque cela améliore la lecture ;
- travailler les mots-clés utiles aux artisans, créateurs et indépendants ;
- intégrer le contexte Lille / Nord lorsqu'il est réellement pertinent ;
- utiliser le maillage interne approprié ;
- ajouter des sources externes uniquement lorsqu'elles apportent une vraie valeur.

Ne gonfle pas artificiellement un texte uniquement pour atteindre un nombre de mots.

---

# 17. NE PAS CONFONDRE BUG ET OPPORTUNITÉ D'AMÉLIORATION

Pendant une intervention, tu peux découvrir :

- dette technique ;
- duplication ;
- architecture améliorable ;
- ancien code ;
- optimisation possible ;
- problème UX adjacent.

Cela ne fait pas automatiquement partie de la tâche.

Résous le problème demandé.

Puis indique éventuellement :

> J'ai repéré également X. Je ne l'ai pas modifié car ce n'était pas nécessaire pour cette demande.

---

# 18. TESTS APRÈS MODIFICATION

Après une modification, vérifie autant que possible :

- TypeScript ;
- lint ;
- build lorsque pertinent ;
- comportement directement concerné ;
- absence de régression évidente dans la zone modifiée.

Ne corrige pas automatiquement tous les problèmes historiques révélés par un lint ou un build.

Distingue les erreurs introduites par ton changement des erreurs préexistantes.

---

# 19. GIT

Tu peux utiliser Git pour inspecter :

- `git status`
- `git diff`
- `git log`
- historique d'un fichier

Tu peux préparer les modifications.

En revanche :

**ne fais jamais de `git commit` ni de `git push` sans demande ou validation explicite de l'utilisateur.**

Ne réécris pas l'historique Git.

N'utilise pas de commande destructive (`reset --hard`, suppression massive, etc.) sans autorisation explicite.

---

# 20. AVANT DE TERMINER

Avant de considérer une tâche terminée, vérifie :

1. Ai-je répondu exactement à la demande ?
2. Ai-je modifié quelque chose qui n'était pas nécessaire ?
3. Ai-je changé une donnée métier ?
4. Ai-je changé l'ordre ou la structure d'un contenu ?
5. Ai-je créé une nouvelle source de vérité ?
6. Ai-je ajouté un fallback inutile ?
7. Ai-je affaibli une règle de sécurité ?
8. Ai-je modifié un tracker ?
9. Le diff contient-il uniquement les changements attendus ?

Si une modification ne peut pas être directement justifiée par la demande utilisateur, retire-la.

---

# 21. COMPORTEMENT ATTENDU

Le comportement recherché est :

**Comprendre → diagnostiquer → modifier le minimum nécessaire → tester → rendre compte.**

Pas :

**Comprendre → repenser l'architecture → nettoyer → migrer → optimiser → modifier des contenus → résoudre la demande.**

La qualité d'une intervention ne se mesure pas au nombre de fichiers modifiés.

Une bonne intervention est une intervention précise, fiable et prévisible.
