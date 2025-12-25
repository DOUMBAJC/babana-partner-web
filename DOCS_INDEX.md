# 📚 Index de la Documentation BABANA Partner Web

## 🎯 Guides par Catégorie

### 🏃 Démarrage
- **[README.md](./README.md)** - Vue d'ensemble du projet et démarrage rapide

### 🐛 Débogage (NOUVEAU)
- **[QUICK_REFERENCE.md](./QUICK_REFERENCE.md)** ⭐ - Référence rapide (commencez ici !)
- **[DEBUG_QUICKSTART.md](./DEBUG_QUICKSTART.md)** - Guide de démarrage rapide pour le débogage
- **[TURBO_STREAM_EXPLAINED.md](./TURBO_STREAM_EXPLAINED.md)** - Explication complète du format Turbo Stream
- **[STREAMING_DEBUG_GUIDE.md](./STREAMING_DEBUG_GUIDE.md)** - Guide détaillé du format de streaming

### 🔐 Sécurité (NOUVEAU)
- **[SECURITY_FAQ.md](./SECURITY_FAQ.md)** - FAQ sur la sécurité et bonnes pratiques

### 🔌 API et HTTP
- **[API_GUIDE.md](./API_GUIDE.md)** - Guide complet pour utiliser l'API avec axios
- **[HTTP_CONFIG.md](./HTTP_CONFIG.md)** - Documentation de la configuration HTTP

### 🌍 Internationalisation
- **[TRANSLATIONS_QUICKSTART.md](./TRANSLATIONS_QUICKSTART.md)** - Guide du système de traductions

### 🎨 Composants UI
- **[SHADCN_GUIDE.md](./SHADCN_GUIDE.md)** - Guide des composants shadcn/ui

### 🔑 Authentification
- **[AUTH_GUIDE.md](./AUTH_GUIDE.md)** - Guide d'authentification et de gestion des permissions

## 🆘 Problème Fréquent

### "Les réponses du serveur sont bizarres dans le Network Inspector !"

➡️ **Lisez ceci en premier :** [QUICK_REFERENCE.md](./QUICK_REFERENCE.md)

**Résumé rapide :**
- ✅ C'est normal (format Turbo Stream de React Router 7)
- ✅ C'est sécurisé (optimisation automatique)
- ✅ Utilisez les outils de debug fournis

**Outils disponibles :**
```tsx
// Option 1 : Panneau visuel
import { DebugPanel } from '~/components';
<DebugPanel data={data} label="Debug" />

// Option 2 : Logging serveur
import { logServer } from '~/lib';
logServer('Data loaded', data);

// Option 3 : Logging client
import { logClient } from '~/lib';
logClient('Component data', data);
```

## 📖 Parcours d'Apprentissage Recommandé

### Pour les Nouveaux Développeurs

1. **[README.md](./README.md)** - Comprendre le projet
2. **[SHADCN_GUIDE.md](./SHADCN_GUIDE.md)** - Apprendre les composants UI
3. **[TRANSLATIONS_QUICKSTART.md](./TRANSLATIONS_QUICKSTART.md)** - Gérer les traductions
4. **[API_GUIDE.md](./API_GUIDE.md)** - Faire des requêtes API
5. **[DEBUG_QUICKSTART.md](./DEBUG_QUICKSTART.md)** - Déboguer efficacement

### Pour les Développeurs Expérimentés

1. **[README.md](./README.md)** - Vue d'ensemble rapide
2. **[API_GUIDE.md](./API_GUIDE.md)** - Configuration API
3. **[AUTH_GUIDE.md](./AUTH_GUIDE.md)** - Système d'authentification
4. **[TURBO_STREAM_EXPLAINED.md](./TURBO_STREAM_EXPLAINED.md)** - Comprendre l'optimisation
5. **[SECURITY_FAQ.md](./SECURITY_FAQ.md)** - Bonnes pratiques de sécurité

### Pour les Chefs de Projet

1. **[README.md](./README.md)** - Architecture du projet
2. **[SECURITY_FAQ.md](./SECURITY_FAQ.md)** - Considérations de sécurité
3. **[AUTH_GUIDE.md](./AUTH_GUIDE.md)** - Système de permissions

## 🔧 Outils Disponibles

### Composants
- `<DebugPanel>` - Panneau de débogage visuel
- `<Can>` - Affichage conditionnel basé sur permissions
- `<ProtectedRoute>` - Protection de routes
- `<AuthLayout>` - Layout pour pages d'authentification
- `<FormInput>` - Input de formulaire stylisé

### Hooks
- `useAuth()` - Gestion de l'authentification
- `usePermissions()` - Vérification des permissions
- `useTheme()` - Gestion du thème
- `useLanguage()` - Gestion de la langue
- `useTranslation()` - Traductions
- `useDebugPanel()` - Hook de débogage

### Fonctions Utilitaires
- `logServer()` - Logger côté serveur
- `logClient()` - Logger côté client
- `logError()` - Logger les erreurs
- `logApiRequest()` - Logger les requêtes API
- `logApiResponse()` - Logger les réponses API
- `PerformanceLogger` - Mesurer les performances

### Services
- `api` - Client HTTP axios configuré
- `authService` - Service d'authentification
- `customerService` - Service client
- `activationRequestService` - Service de requêtes d'activation

## 📊 Structure de la Documentation

```
Documentation/
├── README.md                        # Point d'entrée principal
├── DOCS_INDEX.md                    # Ce fichier
│
├── 🐛 Débogage/
│   ├── QUICK_REFERENCE.md          # Référence rapide
│   ├── DEBUG_QUICKSTART.md         # Guide de démarrage
│   ├── TURBO_STREAM_EXPLAINED.md   # Explication détaillée
│   └── STREAMING_DEBUG_GUIDE.md    # Guide technique complet
│
├── 🔐 Sécurité/
│   └── SECURITY_FAQ.md             # FAQ et bonnes pratiques
│
├── 🔌 API/
│   ├── API_GUIDE.md                # Guide API complet
│   └── HTTP_CONFIG.md              # Configuration HTTP
│
├── 🌍 i18n/
│   └── TRANSLATIONS_QUICKSTART.md  # Système de traductions
│
├── 🎨 UI/
│   └── SHADCN_GUIDE.md            # Composants shadcn/ui
│
└── 🔑 Auth/
    └── AUTH_GUIDE.md               # Authentification et permissions
```

## 🎯 Cas d'Usage Rapides

### Je veux...

| Besoin | Document |
|--------|----------|
| Déboguer les données du serveur | [DEBUG_QUICKSTART.md](./DEBUG_QUICKSTART.md) |
| Comprendre le format Turbo Stream | [TURBO_STREAM_EXPLAINED.md](./TURBO_STREAM_EXPLAINED.md) |
| Vérifier la sécurité | [SECURITY_FAQ.md](./SECURITY_FAQ.md) |
| Faire une requête API | [API_GUIDE.md](./API_GUIDE.md) |
| Ajouter une traduction | [TRANSLATIONS_QUICKSTART.md](./TRANSLATIONS_QUICKSTART.md) |
| Utiliser un composant UI | [SHADCN_GUIDE.md](./SHADCN_GUIDE.md) |
| Gérer les permissions | [AUTH_GUIDE.md](./AUTH_GUIDE.md) |

## 📞 Support

### Problèmes Fréquents

1. **Réponses serveur "bizarres"** → [QUICK_REFERENCE.md](./QUICK_REFERENCE.md)
2. **Erreur 401/403** → [AUTH_GUIDE.md](./AUTH_GUIDE.md)
3. **Traduction manquante** → [TRANSLATIONS_QUICKSTART.md](./TRANSLATIONS_QUICKSTART.md)
4. **Erreur API** → [API_GUIDE.md](./API_GUIDE.md)
5. **Composant ne s'affiche pas** → [SHADCN_GUIDE.md](./SHADCN_GUIDE.md)

### Checklist de Démarrage

- [ ] Lire [README.md](./README.md)
- [ ] Configurer le fichier `.env`
- [ ] Installer les dépendances (`npm install`)
- [ ] Lancer le serveur (`npm run dev`)
- [ ] Lire [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) pour comprendre le format Turbo Stream
- [ ] Explorer [API_GUIDE.md](./API_GUIDE.md) pour les requêtes API

## 🚀 Mises à Jour

### Nouveautés (Décembre 2025)

- ✨ **Outils de débogage** : DebugPanel, logServer(), logClient()
- 📖 **Guide Turbo Stream** : Explication complète du format de sérialisation
- 🔒 **FAQ Sécurité** : Questions et réponses sur la sécurité
- 🎯 **Référence rapide** : Guide de démarrage ultra-rapide

## 📝 Contribuer à la Documentation

Si vous trouvez une erreur ou souhaitez améliorer la documentation :

1. Identifiez le fichier concerné
2. Proposez vos modifications
3. Testez les exemples de code
4. Mettez à jour cet index si nécessaire

---

**Bonne lecture ! 📚** Si vous ne trouvez pas ce que vous cherchez, commencez par [QUICK_REFERENCE.md](./QUICK_REFERENCE.md) ou [README.md](./README.md).

