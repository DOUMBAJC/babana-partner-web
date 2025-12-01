# 🌍 Guide d'internationalisation (i18n) - react-i18next

## 📚 Table des matières

1. [Introduction](#introduction)
2. [Installation](#installation)
3. [Structure des fichiers](#structure-des-fichiers)
4. [Configuration](#configuration)
5. [Utilisation](#utilisation)
6. [Meilleures pratiques](#meilleures-pratiques)
7. [Type Safety](#type-safety)
8. [Exemples](#exemples)

---

## Introduction

Ce projet utilise **react-i18next** pour la gestion de l'internationalisation (i18n). Le système est intégré avec notre hook `useLanguage` existant et synchronisé avec les appels API via le header `Accept-language`.

### Langues supportées
- 🇫🇷 Français (fr) - langue par défaut
- 🇬🇧 Anglais (en)

---

## Installation

Les packages nécessaires sont déjà installés :

```bash
npm install react-i18next i18next
```

---

## Structure des fichiers

```
locales/
├── fr/
│   ├── common.json      # Traductions communes (header, boutons, etc.)
│   └── home.json        # Traductions spécifiques à la page d'accueil
└── en/
    ├── common.json
    └── home.json

app/
├── lib/
│   └── i18n.ts          # Configuration i18next
├── types/
│   └── i18next.d.ts     # Types TypeScript pour l'autocomplétion
└── hooks/
    └── useLanguage.tsx   # Hook intégré avec i18next
```

### Structure d'un fichier de traduction

**`locales/fr/common.json`** :

```json
{
  "header": {
    "home": "Accueil",
    "products": "Produits",
    "partners": "Partenaires"
  },
  "buttons": {
    "save": "Enregistrer",
    "cancel": "Annuler",
    "submit": "Soumettre"
  },
  "theme": {
    "light": "Clair",
    "dark": "Sombre"
  }
}
```

---

## Configuration

### Configuration i18next (`app/lib/i18n.ts`)

```typescript
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      fr: {
        common: commonFr,
        home: homeFr,
      },
      en: {
        common: commonEn,
        home: homeEn,
      },
    },
    defaultNS: 'common',           // Namespace par défaut
    fallbackLng: 'fr',             // Langue de secours
    supportedLngs: ['fr', 'en'],   // Langues supportées
    interpolation: {
      escapeValue: false,           // React échappe déjà
    },
    react: {
      useSuspense: false,           // Important pour SSR
    },
  });
```

### Intégration dans `root.tsx`

```typescript
import { I18nextProvider } from 'react-i18next';
import i18n from './lib/i18n';

export default function App() {
  return (
    <I18nextProvider i18n={i18n}>
      <ThemeProvider>
        <LanguageProvider>
          <LanguageSync />
          <outlet />
        </LanguageProvider>
      </ThemeProvider>
    </I18nextProvider>
  );
}
```

---

## Utilisation

### 1. Hook `useTranslation` - Usage basique

```typescript
import { useTranslation } from 'react-i18next';

function MyComponent() {
  const { t } = useTranslation();
  
  return (
    <div>
      <h1>{t('header.home')}</h1>
      <button>{t('buttons.save')}</button>
    </div>
  );
}
```

### 2. Utiliser plusieurs namespaces

```typescript
function HomePage() {
  const { t } = useTranslation(['home', 'common']);
  
  return (
    <div>
      <h1>{t('home:hero.title')}</h1>
      <button>{t('common:buttons.save')}</button>
    </div>
  );
}
```

### 3. Interpolation (variables dynamiques)

**Fichier JSON** :
```json
{
  "welcome": "Bienvenue, {{name}} !",
  "itemCount": "Vous avez {{count}} élément(s)"
}
```

**Composant** :
```typescript
function Welcome() {
  const { t } = useTranslation();
  const userName = "Jean";
  
  return (
    <div>
      <h1>{t('welcome', { name: userName })}</h1>
      <p>{t('itemCount', { count: 5 })}</p>
    </div>
  );
}
```

### 4. Pluralisation

**Fichier JSON** :
```json
{
  "item_zero": "Aucun élément",
  "item_one": "Un élément",
  "item_other": "{{count}} éléments"
}
```

**Composant** :
```typescript
function ItemList({ count }: { count: number }) {
  const { t } = useTranslation();
  
  return <p>{t('item', { count })}</p>;
}
```

### 5. Changer de langue programmatiquement

```typescript
function LanguageSwitcher() {
  const { i18n } = useTranslation();
  const { setLanguage } = useLanguage(); // Notre hook custom
  
  const changeLanguage = (lng: 'fr' | 'en') => {
    setLanguage(lng);  // Synchronise avec notre système
  };
  
  return (
    <button onClick={() => changeLanguage('en')}>
      English
    </button>
  );
}
```

---

## Meilleures pratiques

### 1. Organisation des fichiers de traduction

- ✅ Créez un fichier par domaine fonctionnel (`auth.json`, `dashboard.json`, etc.)
- ✅ Utilisez `common.json` pour les éléments réutilisables
- ✅ Gardez une structure JSON plate pour les petits fichiers
- ✅ Utilisez des objets imbriqués pour grouper les traductions liées

**Bon exemple** :
```json
{
  "auth": {
    "login": "Connexion",
    "logout": "Déconnexion",
    "forgot_password": "Mot de passe oublié"
  }
}
```

**Mauvais exemple** :
```json
{
  "auth_login": "Connexion",
  "auth_logout": "Déconnexion",
  "auth_forgot_password": "Mot de passe oublié"
}
```

### 2. Nommage des clés

- ✅ Utilisez snake_case ou camelCase de manière cohérente
- ✅ Soyez descriptif mais concis
- ✅ Regroupez par contexte

```json
{
  "buttons": {
    "submit_form": "Soumettre",
    "cancel_action": "Annuler"
  }
}
```

### 3. Éviter les traductions hardcodées

❌ **Mauvais** :
```typescript
<button>Sauvegarder</button>
```

✅ **Bon** :
```typescript
<button>{t('buttons.save')}</button>
```

### 4. Utiliser l'interpolation pour les valeurs dynamiques

❌ **Mauvais** :
```typescript
<p>Bienvenue, {userName} !</p>
```

✅ **bon** :
```typescript
<p>{t('welcome', { name: userName })}</p>
```

---

## Type Safety

### Configuration TypeScript (`app/types/i18next.d.ts`)

```typescript
import 'react-i18next';
import commonFr from '../../locales/fr/common.json';
import homefr from '../../locales/fr/home.json';

declare module 'react-i18next' {
  interface CustomTypeOptions {
    defaultNS: 'common';
    resources: {
      common: typeof commonFr;
      home: typeof homeFr;
    };
  }
}
```

### Avantages

- ✅ Autocomplétion des clés de traduction
- ✅ Erreurs TypeScript si une clé n'existe pas
- ✅ Refactoring sécurisé

---

## Exemples

### Exemple 1 : Header naviguant

```typescript
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';

export function Header() {
  const { t } = useTranslation();
  
  return (
    <header>
      <nav>
        <Link to="/">{t('header.home')}</link>
        <Link to="/products">{t('header.products')}</Link>
        <Link to="/partners">{t('header.partners')}</Link>
      </nav>
    </header>
  );
}
```

### Exemple 2 : Formulaire avec boutons

```typescript
import { useTranslation } from 'react-i18next';

export function ContactForm() {
  const { t } = useTranslation();
  
  return (
    <form>
      <input type="text" placeholder={t('form.name_placeholder')} />
      <input type="email" placeholder={t('form.email_placeholder')} />
      <button type="submit">{t('buttons.submit')}</button>
      <button type="button">{t('buttons.cancel')}</button>
    </form>
  );
}
```

### Exemple 3 : Page complète avec namespace dédié

```typescript
import { useTranslation } from 'react-i18next';

export default function HomePage() {
  const { t } = useTranslation(['home', 'common']);
  
  return (
    <div>
      <h1>{t('home:hero.title')}</h1>
      <p>{t('home:hero.subtitle')}</p>
      
      <button>{t('common:buttons.save')}</button>
    </div>
  );
}
```

### Exemple 4 : État de chargement multilingue

```typescript
import { useTranslation } from 'react-i18next';
import { useState } from 'react';

export function DataLoader() {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  if (loading) return <p>{t('common.loading')}</p>;
  if (error) return <p>{t('common.error')}: {error}</p>;
  
  return <div>{/* Contenu */}</div>;
}
```

---

## 🎯 Points clés à retenir

1. **Toujours utiliser `t()`** pour les textes affichés
2. **Organiser les traductions par domaine** fonctionnel
3. **Utiliser l'interpolation** pour les valeurs dynamiques
4. **Profiter du type-safety** de TypeScript
5. **Créer un fichier de traduction** pour chaque nouvelle section importante
6. **Synchronisation automatique** : Notre hook `useLanguage` change automatiquement la langue dans i18next
7. **API sync** : Le header `Accept-Language` est automatiquement mis à jour avec la langue sélectionnée

---

## 📝 Ajouter une nouvelle langue

Pour ajouter une nouvelle langue (ex: espagnol) :

1. Créer le dossier `locales/es/`
2. Copier et traduire tous les fichiers JSON
3. Mettre à jour `app/lib/i18n.ts` :

```typescript
import commonEs from '../../locales/es/common.json';
import homeEs from '../../locales/es/home.json';

const resources = {
  fr: { common: commonFr, home: homeFr },
  en: { common: commonEn, home: homeEn },
  es: { common: commonEs, home: homeEs },  // Nouveau
};

export const supportedLanguages = ['fr', 'en', 'es'];
```

4. Mettre à jour `app/types/i18next.d.ts`
5. Mettre à jour le composant `LanguageToggle.tsx`

---

## 🔗 Ressources

- [Documentation officielle react-i18next](https://react.i18next.com/)
- [Documentation i18next](https://www.i18next.com/)
- [Playground i18next](https://www.i18next.com/overview/api)

---

**Bonne internationalisation ! 🌍**

