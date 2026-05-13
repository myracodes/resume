# Gestion des traductions

Ce projet utilise **Angular i18n natif** (build-time). Les traductions sont inlinées au moment du build — il n'y a pas de changement de langue à la volée : chaque locale produit un bundle JS distinct.

La locale source est le **français** (`fr`). La locale cible est **l'anglais** (`en`).

---

## Fichiers concernés

```
src/
├── locale/
│   ├── messages.xlf        ← source FR (généré automatiquement, ne pas éditer à la main)
│   └── messages.en.xlf     ← traductions EN (à maintenir manuellement)
```

---

## Lancer l'app dans une locale

```bash
# Français (défaut)
npm start

# Anglais
npm start -- --configuration=en --port=4201
```

---

## Ajouter une string traduisible

### Dans un template HTML

Ajouter l'attribut `i18n` avec un identifiant personnalisé (`@@mon-id`) :

```html
<h3 i18n="@@mon-composant.monId">Mon texte en français</h3>
```

Pour un attribut HTML (pas le contenu d'un élément) :

```html
<img i18n-alt="@@mon-composant.imageAlt" alt="Description en français" />
```

> **Limite :** `i18n` ne fonctionne que sur du texte statique dans le template. Les interpolations `{{ variable }}` ne sont pas marquables directement — utiliser `$localize` dans le TypeScript à la place.

### Dans un fichier TypeScript

Importer le type global (déjà configuré via `/// <reference types="@angular/localize" />` dans `main.ts`) et utiliser le tag `$localize` :

```typescript
monTexte = $localize`:@@mon-composant.monId:Mon texte en français`;
```

Le format du tag est `:description@@identifiant:texte source`.

---

## Workflow complet après avoir ajouté des strings

### 1. Régénérer le fichier source

```bash
npx ng extract-i18n
```

Cela met à jour `src/locale/messages.xlf` avec les nouvelles entrées. Les entrées existantes sont préservées.

### 2. Comparer avec le fichier de traduction

Ouvrir `src/locale/messages.xlf` et repérer les `<trans-unit>` qui n'ont pas encore de correspondance dans `src/locale/messages.en.xlf`.

### 3. Ajouter les traductions manquantes dans `messages.en.xlf`

Copier le bloc `<trans-unit>` depuis `messages.xlf` et ajouter un élément `<target>` :

```xml
<!-- Dans messages.xlf (source, généré) -->
<trans-unit id="mon-composant.monId" datatype="html">
  <source>Mon texte en français</source>
</trans-unit>

<!-- Dans messages.en.xlf (à compléter manuellement) -->
<trans-unit id="mon-composant.monId" datatype="html">
  <source>Mon texte en français</source>
  <target>My text in English</target>
</trans-unit>
```

> Le `<source>` dans `messages.en.xlf` n'est pas obligatoire pour le build, mais il aide à comprendre ce qu'on traduit sans avoir à ouvrir l'autre fichier.

---

## Build de production avec toutes les locales

```bash
npm run build
```

Le build de production génère un bundle par locale dans `docs/` :

```
docs/
├── fr/       ← version française
└── en/       ← version anglaise
```

Pour builder une seule locale :

```bash
npx ng build --configuration=en
```

---

## Ajouter une nouvelle locale (ex : espagnol)

1. Déclarer la locale dans `angular.json` :

```json
"i18n": {
  "sourceLocale": "fr",
  "locales": {
    "en": { "translation": "src/locale/messages.en.xlf" },
    "es": { "translation": "src/locale/messages.es.xlf" }
  }
}
```

2. Ajouter les configurations de build et serve dans `angular.json` :

```json
"build": {
  "configurations": {
    "es": { "localize": ["es"] }
  }
},
"serve": {
  "configurations": {
    "es": { "buildTarget": "resume:build:es,development" }
  }
}
```

3. Créer `src/locale/messages.es.xlf` sur le modèle de `messages.en.xlf`.

---

## Ce qui n'est pas traduit automatiquement

- Les noms de technos (`ReactJS`, `Angular`, `TypeScript`…) : intentionnellement laissés tels quels.
- Les noms propres et noms d'entreprises.
- Le contenu des autres composants : seul `SkillsComponent` est configuré pour l'instant. Étendre aux autres composants suit exactement le même workflow.
