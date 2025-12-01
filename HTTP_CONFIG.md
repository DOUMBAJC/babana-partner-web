# Configuration HTTP avec Axios - BABANA Partner Web

## ✅ Configuration terminée

La configuration axios est maintenant opérationnelle avec support bilingue (français/anglais) automatique.

## 📦 Ce qui a été configuré

### 1. Gestion de la langue (`app/hooks/useLanguage.tsx`)
- Hook React pour gérer la langue de l'utilisateur (fr/en)
- Sauvegarde automatique dans `localStorage`
- Détection automatique de la langue du navigateur
- Mise à jour de l'attribut `lang` du HTML

### 2. Configuration Axios (`app/lib/axios.ts`)
- Instance axios préconfigurée avec base URL depuis `.env`
- **Intercepteur de requête** :
  - Ajout automatique du header `Accept-Language` selon la langue de l'utilisateur
  - Ajout automatique du token d'authentification (`Authorization: Bearer {token}`)
  - Ajout de l'API Key si définie dans les variables d'environnement
  - Logs en mode développement
  
- **Intercepteur de réponse** :
  - Gestion automatique des erreurs (401, 403, 404, 422, 429, 500+)
  - Suppression automatique du token en cas d'erreur 401
  - Messages d'erreur personnalisés selon le code de statut
  - Logs en mode développement

- **API helpers** :
  - `api.get()`, `api.post()`, `api.put()`, `api.patch()`, `api.delete()`
  - Support TypeScript complet
  - Gestion des erreurs typées

### 3. Composants UI

#### `LanguageToggle` (`app/components/LanguageToggle.tsx`)
- Composant dropdown pour changer de langue
- Indicateur visuel de la langue active
- Intégré dans le Header

#### `LanguageSync` (`app/components/LanguageSync.tsx`)
- Composant invisible qui synchronise la langue avec axios
- Monté automatiquement dans `root.tsx`

### 4. Services d'exemple (`app/lib/services/example.service.ts`)
- Exemples de services API (auth, users)
- Types TypeScript pour les requêtes/réponses
- Bonnes pratiques de gestion d'erreurs

### 5. Variables d'environnement

Fichier `.env` créé à la racine :

```env
VITE_API_BASE_URL=http://localhost:3000/api
VITE_API_TIMEOUT=30000
VITE_API_KEY=
VITE_APP_NAME=BABANA Partner
VITE_APP_VERSION=1.0.0
NODE_ENV=development
```

Fichier `.env.example` pour référence avec les variables de production.

### 6. Documentation (`API_GUIDE.md`)
- Guide complet d'utilisation de l'API
- Exemples de code pour tous les cas d'usage
- Bonnes pratiques

## 🚀 Utilisation rapide

### 1. Faire une requête GET

```tsx
import { api } from '~/lib';

const users = await api.get('/users');
```

### 2. Faire une requête POST

```tsx
import { api } from '~/lib';

const newUser = await api.post('/users', {
  name: 'John Doe',
  email: 'john@example.com'
});
```

### 3. Gérer les erreurs

```tsx
import { api, ApiError } from '~/lib';

try {
  const data = await api.get('/users');
} catch (err) {
  const error = err as ApiError;
  console.error(error.message); // Message d'erreur localisé
  console.error(error.status);  // Code HTTP (401, 404, etc.)
}
```

### 4. Changer la langue

```tsx
import { useLanguage } from '~/hooks';

function MyComponent() {
  const { language, setLanguage } = useLanguage();
  
  return (
    <button onClick={() => setLanguage('en')}>
      Switch to English
    </button>
  );
}
```

## 🔑 Fonctionnalités automatiques

### Header Accept-Language
✅ Automatiquement ajouté à **toutes les requêtes** selon la langue de l'utilisateur

```
Accept-Language: fr  // ou "en" selon la langue choisie
```

### Token d'authentification
✅ Automatiquement ajouté à **toutes les requêtes** si un token est présent dans `localStorage`

```
Authorization: Bearer {token}
```

### API Key
✅ Automatiquement ajouté si défini dans `.env`

```
X-API-Key: {votre_clé}
```

## 📝 Structure des fichiers

```
app/
├── hooks/
│   ├── useLanguage.tsx          ✅ Hook pour gérer la langue
│   └── index.ts                 ✅ Exports
├── lib/
│   ├── axios.ts                 ✅ Configuration axios
│   ├── index.ts                 ✅ Exports
│   └── services/
│       └── example.service.ts   ✅ Services d'exemple
├── components/
│   ├── LanguageToggle.tsx       ✅ Sélecteur de langue
│   ├── LanguageSync.tsx         ✅ Synchronisation langue/axios
│   └── Header.tsx               ✅ Header avec LanguageToggle
└── root.tsx                     ✅ Providers montés

.env                              ✅ Variables d'environnement
.env.example                      ✅ Template des variables
API_GUIDE.md                      ✅ Guide complet
```

## 🔄 Flow de la langue

1. L'utilisateur change la langue via `LanguageToggle`
2. `useLanguage().setLanguage()` est appelé
3. La langue est sauvegardée dans `localStorage`
4. Le composant `LanguageSync` détecte le changement
5. `setApiLanguage()` est appelé pour mettre à jour axios
6. Toutes les prochaines requêtes incluent le bon header `Accept-Language`

## 🧪 Tester la configuration

### 1. Démarrer le serveur de développement

```bash
npm run dev
```

### 2. Ouvrir le navigateur et la console

Vous verrez les logs de requêtes en mode développement :

```
📤 Requête API: { method: 'GET', url: '/users', language: 'fr' }
📥 Réponse API: { status: 200, data: [...] }
```

### 3. Changer la langue

Cliquez sur le bouton de langue dans le header et observez que les prochaines requêtes incluent le nouveau header `Accept-Language`.

## 🎯 Prochaines étapes

1. ✅ Configuration axios terminée
2. ✅ Support bilingue opérationnel
3. ✅ Composants UI créés
4. ✅ Documentation complète
5. 📝 À faire : Créer vos propres services API dans `app/lib/services/`
6. 📝 À faire : Configurer l'URL de production dans `.env`

## 📚 Documentation complète

Consultez le fichier `API_GUIDE.md` pour :
- Exemples détaillés d'utilisation
- Gestion avancée des erreurs
- Création de services
- Upload de fichiers
- Pagination
- Et bien plus...

## 🆘 Aide

Si vous rencontrez des problèmes :

1. Vérifiez que `.env` est configuré correctement
2. Vérifiez les logs dans la console du navigateur
3. Consultez `API_GUIDE.md` pour des exemples
4. Testez avec un simple `api.get('/test')` pour valider la configuration

---

**Configuration par : Assistant IA**  
**Date : 1er décembre 2025**  
**Stack : React Router 7 + Axios + TypeScript**

