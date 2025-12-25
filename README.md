# 🌐 BABANA - Plateforme Partenaire

**Plateforme partenaire BABANA ETS DAIROU**

Version simplifiée pour apprendre React Router pas à pas.

---

## 🚨 NOUVEAU : Vous voyez des données bizarres dans le Network Inspector ?

➡️ **Lisez ceci immédiatement :** [START_HERE.md](./START_HERE.md) ou [SUMMARY.md](./SUMMARY.md)

**TL;DR :** C'est normal, c'est sécurisé, et on vous a créé des outils de debug ! ✨

---

## 📖 À Propos

Ce projet est configuré avec React Router 7, Tailwind CSS et TypeScript. Il est volontairement simple pour faciliter l'apprentissage.

## ✨ Ce qui est inclus

- 🎨 **Thème BABANA** : Couleurs cyan (#5FC8E9) et navy (#0D1B4D)
- 🌙 **Mode Sombre** : Support du thème sombre
- 🌍 **Support Bilingue** : Français & Anglais avec détection automatique
- 🔌 **Configuration HTTP** : Axios avec intercepteurs et gestion d'erreurs
- 📱 **Responsive** : Adapté mobile et desktop
- ⚡ **Vite** : Build rapide
- 🔒 **TypeScript** : Code typé
- 🎯 **React Router 7** : Navigation entre pages
- 🎨 **shadcn/ui** : Composants UI modernes et accessibles

## 🚀 Démarrage

```bash
# 1. Installer les dépendances
npm install

# 2. Configurer les variables d'environnement
cp .env.example .env
# Puis éditer .env avec vos valeurs

# 3. Lancer le serveur de développement
npm run dev
```

L'application sera accessible sur **http://localhost:5173**

## ⚠️ NOTE IMPORTANTE : Format Turbo Stream

> **"Les réponses du serveur sont bizarres dans le Network Inspector !"**

**C'est NORMAL !** React Router 7 utilise le format **Turbo Stream** pour optimiser les performances (-38% de taille). Ce n'est PAS dangereux.

➡️ **Lisez ceci :** [SUMMARY.md](./SUMMARY.md) ou [QUICK_REFERENCE.md](./QUICK_REFERENCE.md)

**Outils de debug fournis :**
- `<DebugPanel>` : Panneau visuel flottant
- `logServer()` : Logs dans le terminal
- `logClient()` : Logs dans la console

**Vous n'avez rien à changer dans votre code !** 🎉

## 📚 Documentation

### 🚨 Débogage et Format Turbo Stream (NOUVEAU)
- **[SUMMARY.md](./SUMMARY.md)** - 📝 Réponse à votre question sur les réponses serveur
- **[QUICK_REFERENCE.md](./QUICK_REFERENCE.md)** - ⚡ Référence rapide (2 min)
- **[DEBUG_QUICKSTART.md](./DEBUG_QUICKSTART.md)** - 🐛 Guide de démarrage rapide
- **[TURBO_STREAM_EXPLAINED.md](./TURBO_STREAM_EXPLAINED.md)** - 📖 Explication détaillée
- **[STREAMING_DEBUG_GUIDE.md](./STREAMING_DEBUG_GUIDE.md)** - 🔧 Guide technique complet
- **[SECURITY_FAQ.md](./SECURITY_FAQ.md)** - 🔒 FAQ Sécurité et bonnes pratiques
- **[EXAMPLE_DEBUG_PAGE.md](./EXAMPLE_DEBUG_PAGE.md)** - 🎯 Exemple pratique complet

### 📖 Guides Généraux
- **[DOCS_INDEX.md](./DOCS_INDEX.md)** - 📚 Index de toute la documentation
- **[API_GUIDE.md](./API_GUIDE.md)** - Guide complet pour utiliser l'API avec axios
- **[HTTP_CONFIG.md](./HTTP_CONFIG.md)** - Documentation de la configuration HTTP
- **[SHADCN_GUIDE.md](./SHADCN_GUIDE.md)** - Guide des composants shadcn/ui
- **[TRANSLATIONS_QUICKSTART.md](./TRANSLATIONS_QUICKSTART.md)** - Guide du système de traductions
- **[AUTH_GUIDE.md](./AUTH_GUIDE.md)** - Guide d'authentification et permissions

## 🛠 Technologies

- **React 19** : Library UI moderne
- **React Router 7** : Navigation et SSR
- **TypeScript 5.9** : JavaScript typé
- **Tailwind CSS 4** : Framework CSS utilitaire
- **Vite 7** : Build tool ultra-rapide
- **shadcn/ui** : Composants UI (style "new-york")
- **Axios** : Client HTTP
- **GSAP 3** : Animations
- **React Hook Form** : Gestion de formulaires
- **Zod** : Validation de schémas

## 📁 Structure du Projet

```
app/
├── root.tsx                  # Layout principal avec Providers
├── routes.ts                 # Configuration des routes
├── app.css                   # Styles globaux + variables Tailwind
├── routes/
│   └── home.tsx              # Page d'accueil (/)
├── components/
│   ├── index.ts              # Exports centralisés
│   ├── Header.tsx            # Header avec navigation
│   ├── Logo.tsx              # Logo BABANA
│   ├── ThemeToggle.tsx       # Sélecteur de thème
│   ├── LanguageToggle.tsx    # Sélecteur de langue
│   └── ui/                   # Composants shadcn/ui
├── hooks/
│   ├── index.ts              # Exports centralisés
│   ├── useTheme.tsx          # Hook pour le thème
│   ├── useLanguage.tsx       # Hook pour la langue
│   ├── useTranslation.tsx    # Hook pour les traductions
│   └── useScrolled.ts        # Hook pour détecter le scroll
├── lib/
│   ├── index.ts              # Exports centralisés
│   ├── utils.ts              # Utilitaires (cn, etc.)
│   ├── axios.ts              # Configuration HTTP
│   └── translations.ts       # Système de traductions
└── assets/
    └── logo.png              # Logo BABANA

.env                          # Variables d'environnement
components.json               # Configuration shadcn/ui
tailwind.config.js            # Configuration Tailwind
```

## 🎨 Couleurs BABANA

- **Cyan** : `#5FC8E9` (Couleur principale)
- **Navy** : `#0D1B4D` (Couleur secondaire)

Ces couleurs sont utilisées dans le CSS via les classes Tailwind :
- `text-babana-cyan`, `bg-babana-cyan`
- `text-babana-navy`, `bg-babana-navy`

## 🎯 Fonctionnalités Principales

### 🌍 Système de Traductions Complet

Le système de traductions permet d'afficher votre application en français et en anglais automatiquement.

```tsx
import { useTranslation } from '~/hooks';

function MyComponent() {
  const { t, language } = useTranslation();
  
  return (
    <div>
      <h1>{t.nav.home}</h1>
      <button>{t.actions.save}</button>
      <p>{t.common.loading}</p>
    </div>
  );
}
```

**Fonctionnalités :**
- ✅ Détection automatique de la langue du navigateur
- ✅ Changement de langue en temps réel
- ✅ Persistance dans localStorage
- ✅ Header `Accept-Language` automatique dans les requêtes API
- ✅ Plus de 100 traductions prêtes à l'emploi
- ✅ TypeScript avec autocomplétion
- ✅ Interpolation de variables

**Documentation :** [TRANSLATIONS_QUICKSTART.md](./TRANSLATIONS_QUICKSTART.md)

### 🔌 Requêtes HTTP avec Axios

```tsx
import { api } from '~/lib';

// GET
const users = await api.get('/users');

// POST
const newUser = await api.post('/users', {
  name: 'John Doe',
  email: 'john@example.com'
});

// Gestion des erreurs
try {
  const data = await api.get('/users');
} catch (err) {
  console.error(err.message); // Message d'erreur localisé
}
```

### 🎨 Composants shadcn/ui

Plus de 20 composants UI prêts à l'emploi :

```tsx
import { Button, Card, Dialog, Input, Select } from '~/components';

<Button variant="default">Cliquer</Button>
<Card>
  <CardHeader>
    <CardTitle>Titre</CardTitle>
  </CardHeader>
  <CardContent>Contenu</CardContent>
</Card>
```

Voir [SHADCN_GUIDE.md](./SHADCN_GUIDE.md) pour la liste complète.

### 🐛 Outils de Débogage

React Router 7 utilise un format de sérialisation optimisé (Turbo Stream) qui peut sembler étrange dans le Network Inspector. **C'est normal et sécurisé !**

#### DebugPanel (Composant visuel)

Affiche vos données en temps réel dans un panneau flottant :

```tsx
import { DebugPanel } from '~/components';

export default function MyPage() {
  const data = useLoaderData<typeof loader>();
  
  return (
    <>
      <DebugPanel data={data} label="Loader Data" />
      <div>...</div>
    </>
  );
}
```

#### Fonctions de logging

```tsx
import { logServer, logClient, PerformanceLogger } from '~/lib';

// Côté serveur (visible dans le terminal)
export async function loader({ request }: Route.LoaderArgs) {
  const perf = new PerformanceLogger('User Loader');
  const data = await fetchData();
  
  logServer('Users loaded', data);
  perf.end();
  
  return data;
}

// Côté client (visible dans la console du navigateur)
export default function MyComponent() {
  const data = useLoaderData<typeof loader>();
  
  useEffect(() => {
    logClient('Component data', data);
  }, [data]);
  
  return <div>...</div>;
}
```

**Documentation complète :** [STREAMING_DEBUG_GUIDE.md](./STREAMING_DEBUG_GUIDE.md)

## 📝 Commandes

```bash
npm run dev         # Lancer en développement
npm run build       # Créer un build
npm run typecheck   # Vérifier les types TypeScript
```

## 🔑 Variables d'Environnement

Configurez votre fichier `.env` :

```env
# API Configuration
VITE_API_BASE_URL=https://api.babana.com
VITE_API_TIMEOUT=30000
VITE_API_KEY=your_api_key_here

# App Configuration
VITE_APP_NAME=BABANA Partner
VITE_APP_VERSION=1.0.0
NODE_ENV=development
```

## 🚀 Démarrage

1. **Configurer l'API** : Éditer `.env` avec l'URL de votre API
2. **Lire la documentation** : Consulter les guides dans le dossier racine
3. **Créer des services** : Ajouter vos services API dans `app/lib/`
4. **Créer des pages** : Ajouter de nouvelles routes dans `app/routes/`
5. **Personnaliser** : Adapter les composants à vos besoins

## 📚 Ressources

- [Documentation React Router](https://reactrouter.com/docs)
- [Documentation Tailwind CSS](https://tailwindcss.com/docs)
- [Tutoriel React Router](https://reactrouter.com/start/framework/tutorial)

## 📄 License

© 2025 BABANA ETS DAIROU. Tous droits réservés.
