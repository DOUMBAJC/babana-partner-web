# 📚 babana-partner-web — Documentation de Référence Frontend

> **Dernière mise à jour :** 22 février 2026  
> **Framework :** React Router v7 (SSR + SPA)  
> **Rôle :** Interface partenaire — gestion des activations SIM, clients, admin, support.

---

## 1. Stack & Dépendances

| Package | Version | Rôle |
|---|---|---|
| `react` | ^19.1.1 | UI Library |
| `react-router` | ^7.9.2 | Routing SSR/SPA (mode Framework) |
| `typescript` | ^5.9.2 | Typage statique |
| `tailwindcss` | ^4.1.13 | CSS utilitaires |
| `vite` | ^7.1.7 | Bundler |
| `@radix-ui/*` | multiple | Composants primitifs accessibles |
| `lucide-react` | ^0.555.0 | Icônes |
| `react-hook-form` | ^7.67.0 | Gestion des formulaires |
| `zod` | ^4.1.13 | Validation de schémas |
| `axios` | ^1.13.2 | Client HTTP |
| `gsap` | ^3.13.0 | Animations avancées |
| `sonner` | ^1.7.4 | Toasts / Notifications UI |
| `laravel-echo` | ^2.2.7 | Temps réel (Pusher) |
| `pusher-js` | ^8.4.0 | WebSocket client |
| `date-fns` | ^4.1.0 | Manipulation de dates |

---

## 2. Variables d'Environnement (`.env`)

```env
# API Backend
VITE_APP_API_URL=http://localhost:8000/api
# En production → https://babana.sapjasha.com/api

VITE_APP_API_TIMEOUT=30000       # 30 secondes
VITE_APP_API_KEY="X-BABANA..."   # Doit correspondre à API_KEY_WEB du backend

# Application
VITE_APP_BASE_URL=https://babana-mobile.vercel.app
VITE_APP_NAME=BABANA Partner
VITE_APP_VERSION=1.0.0
VITE_APP_MODE=development

# Session SSR
SESSION_SECRET="X-rNQGP..."

# Pusher (temps réel)
VITE_PUSHER_APP_KEY=002776c5b2672f44b491
VITE_PUSHER_APP_CLUSTER=mt1
VITE_PUSHER_PORT=443
VITE_PUSHER_SCHEME=https
```

---

## 3. Architecture des Dossiers

```
app/
├── app.css              → Styles globaux + variables CSS design tokens
├── root.tsx             → Layout racine, providers globaux, error boundary
├── routes.ts            → ⭐ Déclaration CENTRALISÉE de toutes les routes
├── components/          → Composants réutilisables (~78 fichiers)
├── hooks/               → Hooks React custom (13 hooks)
├── lib/                 → Bibliothèques et services (38 fichiers)
│   ├── auth/
│   │   ├── roles.ts          → Définition des 9 rôles avec permissions
│   │   └── permissions.ts    → Helpers de vérification authz
│   ├── i18n/
│   │   ├── translations.ts   → Traductions FR/EN (~174 Ko)
│   │   └── notification-translations.ts
│   ├── services/             → Services API (9 services)
│   │   ├── auth.service.ts
│   │   ├── customer.service.ts
│   │   ├── activation-request.service.ts
│   │   ├── id-card-type.service.ts
│   │   └── notification.service.ts
│   ├── http/                 → Client HTTP et intercepteurs
│   ├── axios.ts              → Config Axios centralisée
│   ├── api-error-handler.ts  → Gestion centralisée des erreurs
│   └── index.ts              → ⭐ Barrel export (imports via ~/lib/*)
├── routes/              → Pages React Router (188 fichiers)
│   ├── admin/           → Interface admin
│   ├── api/             → Proxy SSR (26 routes resource)
│   ├── auth/            → Authentification
│   ├── customers/       → Gestion clients
│   ├── sales/           → Activations SIM
│   ├── support/         → Support tickets
│   ├── notifications/   → Notifications
│   ├── credits/         → Portefeuille
│   ├── profile/         → Profil utilisateur
│   ├── messages/        → Messagerie
│   └── tutorials/       → Tutoriels
├── services/            → Services SSR (2 fichiers)
└── types/               → Types TypeScript (6 fichiers)
```

---

## 4. Routing — `app/routes.ts`

**Convention :** Toute nouvelle route doit être déclarée dans `app/routes.ts`.

### Pages Publiques
```typescript
index("routes/home/route.tsx")           // /
route("login", "routes/auth/login.tsx")
route("register", "routes/auth/register.tsx")
route("forgot-password", "routes/auth/forgot-password.tsx")
route("reset-password", "routes/auth/reset-password.tsx")
route("verify-email", "routes/auth/verify-email.tsx")
route("logout", "routes/auth/logout.tsx")
```

### Pages Protégées
```typescript
route("profile", "routes/profile/route.tsx")
route("credits", "routes/credits/route.tsx")
route("messages", "routes/messages/route.tsx")
route("notifications", "routes/notifications/route.tsx")
route("notifications/preferences", "routes/notifications/preferences/route.tsx")
route("support", "routes/support/route.tsx")
route("support/tickets", "routes/support/tickets/route.tsx")
route("support/tickets/:id", "routes/support/tickets/$id/route.tsx")
route("tutorials", "routes/tutorials/route.tsx")
route("tutorials/:id", "routes/tutorials/$id/route.tsx")
```

### Pages Partenaires (BA / POS / Activateur)
```typescript
route("customers/search", "routes/customers/search/route.tsx")
route("customers/create", "routes/customers/create/route.tsx")
route("customers/identify", "routes/customers/identify/route.tsx")
route("customers/update/identify/:id", "routes/customers/update/identify.$id.tsx")
route("sales/activation", "routes/sales/activation/route.tsx")
route("sales/activation-requests", "routes/sales/activation-requests/route.tsx")
route("sales/activation-requests/:id", "routes/sales/activation-requests/$id/route.tsx")
```

### Pages Admin
```typescript
route("admin", "routes/admin/route.tsx")
route("admin/users", "routes/admin/users/route.tsx")
route("admin/reports", "routes/admin/reports/route.tsx")
route("admin/camtel-logins", "routes/admin/camtel-logins/route.tsx")
route("admin/settings", "routes/admin/settings/route.tsx")
route("admin/logs", "routes/admin/logs/route.tsx")
route("admin/support", "routes/admin/support/route.tsx")
route("admin/support/:id", "routes/admin/support/$id/route.tsx")
route("roles-matrix", "routes/roles-matrix/route.tsx")
```

### Routes API (Proxy SSR — `api/*`)
```typescript
// Notifications (9 routes)
// Sessions (4 routes)
// Auth (2 routes)
// Reports (2 routes)
// Logs (4 routes)
// Support (5 routes)
// Tutorials (1 route)
```

> **Pourquoi des routes `api/*` ?** React Router v7 en mode SSR permet d'exposer des "resource routes" qui proxifient les appels vers le backend Laravel. Cela évite les problèmes CORS en production et centralise les appels API côté serveur.

---

## 5. Système de Rôles & Permissions

### Rôles Définis (`app/lib/auth/roles.ts`)

| Slug | Nom | Permissions clés |
|---|---|---|
| `super_admin` | Super Administrateur | `all` (bypass total) |
| `admin` | Administrateur | admin-access, view/edit users, approve/reject requests, reports |
| `ba` | Brand Ambassador | create-requests, view-requests, create-orders |
| `activateur` | Activateur | process/approve/reject-requests, view-reports |
| `pos` | Point de Vente | create/edit-orders, view-inventory, view-sales |
| `dsm` | District Sales Manager | manage-pos, assign-tasks, export-reports |
| `vendeur` | Vendeur | create/edit-sales, view-inventory |
| `client` | Client | view-products, view-orders |
| `autre` | Autre | view-own-tasks, manage-own-tasks |

### Helpers Disponibles (`app/lib/auth/permissions.ts`)

```typescript
import { hasPermission, hasRole, isAdmin, isSuperAdmin, getUserPermissions } from '~/lib';

// Vérification de permission
hasPermission(user, 'approve-requests')  // boolean

// Vérification de rôle
hasRole(user, 'ba')                      // boolean
hasAllRoles(user, ['admin', 'ba'])       // boolean (tous)
hasAnyRole(user, ['admin', 'activateur']) // boolean (au moins un)

// Vérification combinée
hasAllPermissions(user, ['view-reports', 'export-reports'])
hasAnyPermission(user, ['view-users', 'edit-users'])

// Raccourcis
isAdmin(user)       // super_admin OU admin
isSuperAdmin(user)  // super_admin uniquement

// Toutes les permissions
getUserPermissions(user)   // Permission[]
```

### Utilisation dans les Routes

```typescript
// Exemple dans un loader React Router
export async function loader({ request }: LoaderFunctionArgs) {
  const user = await getUser(request);
  if (!isAdmin(user)) {
    throw redirect('/unauthorized');
  }
  // ...
}
```

---

## 6. Internationalisation (i18n)

### Configuration
- **Langues :** `fr` (défaut), `en`
- **Fichier principal :** `app/lib/i18n/translations.ts` (~174 Ko)
- **Stockage :** Cookie (pour persistance SSR côté server)

### Utilisation

```typescript
import { getTranslations, interpolate } from '~/lib';

// Obtenir les traductions selon la langue
const t = getTranslations(lang); // lang: 'fr' | 'en'

// Texte simple
t.common.save           // → "Enregistrer"

// Avec interpolation de variables
interpolate(t.messages.welcome, { name: 'Jean' })
```

### Ajouter une Traduction

1. Ouvrir `app/lib/i18n/translations.ts`
2. Ajouter la clé dans les deux langues (`fr` + `en`) dans la section concernée
3. Exporter/utiliser via `getTranslations(lang).votreCle`

> **⚠️ JAMAIS de texte en dur dans les composants.** Tout texte visible doit passer par `translations.ts`.

---

## 7. Client HTTP — Axios

### Configuration (`app/lib/axios.ts`)

```typescript
// Importation
import { api, axiosInstance } from '~/lib';

// Instance préconfigurée avec :
// - Base URL: VITE_APP_API_URL
// - Timeout: VITE_APP_API_TIMEOUT (30s)
// - Header X-API-KEY automatique
// - Header Accept-Language selon la locale courante
// - Gestion centralisée des erreurs (401, 403, 422, 500...)
```

### Changer la langue de l'API

```typescript
import { setApiLanguage } from '~/lib';
setApiLanguage('en'); // ou 'fr'
```

---

## 8. Services API Disponibles

Importables via `~/lib` (barrel pattern) :

```typescript
import {
  authService,
  customerService,
  idCardTypeService,
  activationRequestService,
  notificationService
} from '~/lib';
```

### `authService`
- Connexion, inscription, déconnexion, changement mdp, profil

### `customerService`
- Recherche par CNI, création, identification, mise à jour

### `activationRequestService`
- Création, liste, détail, mise à jour, annulation, traitement

### `idCardTypeService`
- Liste des types de CNI disponibles

### `notificationService`
- Liste, marquer comme lu, préférences

---

## 9. Composants UI

### Primitives (Radix UI)
Importables depuis `@radix-ui/react-*` :
- `Dialog` → Modales
- `Select` → Listes déroulantes
- `Tabs` → Onglets
- `Tooltip` → Info-bulles
- `Checkbox` / `Switch` → Contrôles booléens
- `DropdownMenu` → Menus contextuels
- `Popover` → Fenêtres flottantes
- `RadioGroup` → Groupes radio
- `ScrollArea` → Zone de défilement custom
- `Separator` → Séparateurs
- `Avatar` → Avatars utilisateur

### Icônes
```typescript
import { User, Bell, Settings, ... } from 'lucide-react';
```

### Animations
```typescript
import { gsap } from 'gsap';  // Animations complexes

// Micro-animations CSS
import 'tw-animate-css'; // Classes Tailwind d'animation
```

### Toasts / Notifications UI
```typescript
import { toast } from 'sonner';

toast.success('Requête créée avec succès');
toast.error('Une erreur est survenue');
toast.loading('Chargement...');
```

### Formulaires (React Hook Form + Zod)
```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const schema = z.object({
  sim_number: z.string().min(1),
  iccid: z.string().optional(),
});

const form = useForm({
  resolver: zodResolver(schema),
});
```

### Styles (Tailwind v4)
```typescript
import { cn } from '~/lib'; // Merge de classes Tailwind

<div className={cn('base-class', condition && 'conditional-class')} />
```

---

## 10. Design Tokens (`app/app.css`)

Les couleurs, espacements et typographies de la marque Babana sont définis comme variables CSS.  
Consulter `app/app.css` et `tailwind.config.js` pour la liste complète.

**Principes design de la plateforme :**
- Thème sombre privilégié (dark mode)
- Glassmorphism sur les cartes et panneaux
- Micro-animations sur les interactions
- Couleurs de marque : palette Babana (voir `tailwind.config.js`)
- Police : définie dans `app.css`

---

## 11. Patterns & Conventions

### Structure d'une Route React Router v7

```typescript
// app/routes/mon-domaine/route.tsx

// Types
import type { LoaderFunctionArgs } from 'react-router';

// Loader (SSR / données)
export async function loader({ request }: LoaderFunctionArgs) {
  // Récupération des données côté serveur
  const data = await monService.getData();
  return { data };
}

// Action (mutations côté serveur)
export async function action({ request }: ActionFunctionArgs) {
  const formData = await request.formData();
  // Traitement...
  return { success: true };
}

// Composant
export default function MaRoute() {
  const { data } = useLoaderData<typeof loader>();
  return <div>...</div>;
}
```

### Protection de Route par Rôle

```typescript
export async function loader({ request }: LoaderFunctionArgs) {
  const user = await requireUser(request); // redirige vers /login si non auth
  
  if (!isAdmin(user)) {
    throw redirect('/unauthorized');
  }
  
  return { user };
}
```

### Appel API depuis un Loader (SSR)

```typescript
export async function loader({ request }: LoaderFunctionArgs) {
  const session = await getSession(request);
  const token = session.get('token');
  
  const response = await fetch(`${process.env.API_URL}/activation-requests`, {
    headers: {
      'Authorization': `Bearer ${token}`,
      'X-API-KEY': process.env.API_KEY,
    }
  });
  
  return response.json();
}
```

### Imports via Barrel (`~/lib`)

```typescript
// ✅ Correct — import stable
import { isAdmin, translations, customerService } from '~/lib';

// ❌ Éviter — import direct (instable si refactor)
import { isAdmin } from '~/lib/auth/permissions';
```

---

## 12. Hooks Custom (`app/hooks/`)

13 hooks disponibles dans le dossier `hooks/` :
- Hooks d'authentification
- Hooks de gestion des formulaires
- Hooks de notifications temps réel (Pusher/Echo)
- Hooks de pagination
- Hooks d'internationalisation

> Consulter `app/hooks/` pour la liste complète et les signatures.

---

## 13. Temps Réel (Laravel Echo + Pusher)

```typescript
// Écoute des événements Pusher
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

// Config dans root.tsx ou un hook dédié
const echo = new Echo({
  broadcaster: 'pusher',
  key: import.meta.env.VITE_PUSHER_APP_KEY,
  cluster: import.meta.env.VITE_PUSHER_APP_CLUSTER,
  forceTLS: true,
});

// Écouter un canal
echo.channel(`user.${userId}`).listen('NotificationSent', (e) => {
  // Mettre à jour l'UI
});
```

---

## 14. SEO

Chaque route doit exporter des métadonnées :

```typescript
export function meta() {
  return [
    { title: 'Titre de la Page | BABANA Partner' },
    { name: 'description', content: 'Description de la page...' },
  ];
}
```

Routes SEO spéciales :
- `routes/robots.txt.tsx` → Génère `robots.txt`
- `routes/sitemap.xml.tsx` → Génère `sitemap.xml`

---

## 15. Commandes de Développement

```bash
# Démarrage en développement
npm run dev
# → react-router dev --host --port 3000

# Build production
npm run build
# → react-router build

# Démarrage production
npm run start
# → react-router-serve ./build/server/index.js

# Vérification TypeScript
npm run typecheck
# → react-router typegen && tsc
```

### URL de développement
- **Frontend :** `http://localhost:3000`
- **API Backend :** `http://localhost:8000/api` (doit être démarré séparément)

---

## 16. Points d'Attention

### ⚠️ À TOUJOURS FAIRE

- **i18n obligatoire :** Tout texte affiché → via `translations.ts` (FR + EN)
- **Imports via `~/lib`** : Utiliser le barrel pour les imports stables
- **Nouveau rôle :** Déclarer dans `app/lib/auth/roles.ts` ET dans le backend
- **Nouvelle route :** Ajouter dans `app/routes.ts`
- **Validation formulaires :** Toujours utiliser Zod + React Hook Form
- **Erreurs API :** Toujours gérer via `api-error-handler.ts`

### ❌ À NE JAMAIS FAIRE

- Texte en dur dans les composants (utiliser les traductions)
- Appels Axios directs sans passer par les services
- Import direct dans `app/lib/auth/permissions.ts` (utiliser `~/lib`)
- Stocker des données sensibles (tokens) dans le `localStorage` — utiliser les cookies
- Modifier les rôles côté frontend sans modifier le backend en parallèle

### 🎨 Design

- **Mode sombre en priorité** — tester en dark mode avant light
- **Glassmorphism** sur les cartes et panneaux principaux
- **Micro-animations** sur les boutons, transitions de pages, et états de chargement
- **Premium first** — éviter les designs basiques, viser la qualité visuelle

---

*Documentation babana-partner-web — générée le 22/02/2026*
