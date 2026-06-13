# Guidelines for AI agents

## Build & commits

- **Ne pas lancer `npm run build` (ou `ng build`) après une modif de code**, sauf si c'est explicitement nécessaire pour valider le changement.
  - Le build régénère `docs/` (artefacts GitHub Pages) et `src/version.ts`, ce qui pollue le diff et mélange code source + build dans un même commit.
  - Si un build est vraiment nécessaire, il doit faire l'objet d'un **commit séparé** (ne pas mélanger avec les changements de code source).
  - Le déploiement (`npm run build:deploy` / `npm run deploy`) reste une action manuelle de l'utilisateur, ne pas l'exécuter automatiquement.

## Commits

- Suivre la convention existante (Conventional Commits) : `feat:`, `fix:`, `chore:`, etc.
- Ne créer un commit que si demandé explicitement.

## Stack

- Angular 19 + PrimeNG, SCSS, i18n (`@angular/localize`) — voir [TRANSLATIONS.md](TRANSLATIONS.md).
- `npm start` pour le serveur de dev.
- `npm test` pour les tests unitaires (Karma/Jasmine).
