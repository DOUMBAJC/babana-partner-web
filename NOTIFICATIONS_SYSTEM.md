# Système de Notifications - BABANA Partner

## 📋 Vue d'ensemble

Le système de notifications complet a été implémenté avec une interface utilisateur moderne et professionnelle. Il permet aux utilisateurs de recevoir, gérer et configurer leurs notifications en temps réel.

## 🎯 Fonctionnalités

### 1. **Dropdown de Notifications (Header)**
- Badge animé avec compteur de notifications non lues
- Animation de pulse pour attirer l'attention
- Liste des 10 dernières notifications
- Onglets "Toutes" et "Non lues"
- Actions rapides : marquer comme lu, supprimer
- Rafraîchissement automatique toutes les 30 secondes
- Liens vers la page complète et les préférences

### 2. **Page Liste des Notifications** (`/notifications`)
- Affichage paginé de toutes les notifications
- Statistiques en temps réel (Total, Non lues, Lues)
- Filtres par statut (Toutes / Non lues)
- Actions groupées :
  - Marquer toutes comme lues
  - Supprimer toutes les notifications lues
  - Actualiser
- Pagination avec "Charger plus"
- Cartes de notifications avec icônes colorées selon le type
- Responsive et optimisé mobile

### 3. **Page Préférences** (`/notifications/preferences`)
- Configuration des notifications par canal :
  - **Email** : Demandes d'activation, Approbations, Rejets, Mises à jour système, Bienvenue
  - **In-App** : Mêmes catégories que l'email
  - **Push** : Notifications push (si disponible)
- Paramètres généraux :
  - Notifications le week-end (On/Off)
  - Heures silencieuses (Début et Fin)
  - Langue préférée (Français / English)
- Boutons :
  - Enregistrer les modifications
  - Réinitialiser aux valeurs par défaut
  - Annuler

## 🏗️ Architecture

### Types TypeScript
**Fichier** : `app/types/notification.types.ts`

```typescript
- NotificationType
- Notification
- NotificationData
- NotificationsResponse
- UnreadCountResponse
- NotificationPreferences
- UpdateNotificationPreferencesParams
```

### Service API
**Fichier** : `app/lib/notification.service.ts`

Méthodes disponibles :
- `getNotifications(params)` - Liste des notifications avec pagination
- `getUnreadCount()` - Nombre de notifications non lues
- `getNotification(id)` - Détails d'une notification
- `markAsRead(id)` - Marquer une notification comme lue
- `markAllAsRead()` - Marquer toutes comme lues
- `deleteNotification(id)` - Supprimer une notification
- `deleteReadNotifications()` - Supprimer toutes les lues
- `getPreferences()` - Récupérer les préférences
- `updatePreferences(data)` - Mettre à jour les préférences
- `resetPreferences()` - Réinitialiser les préférences

### Hook personnalisé
**Fichier** : `app/hooks/useNotifications.tsx`

```typescript
const {
  notifications,
  unreadCount,
  isLoading,
  error,
  currentPage,
  lastPage,
  total,
  hasMore,
  fetchNotifications,
  markAsRead,
  markAllAsRead,
  deleteNotification,
  deleteReadNotifications,
  refreshUnreadCount,
  loadMore,
} = useNotifications({
  autoRefresh: true,
  refreshInterval: 30000,
  initialParams: { per_page: 15 }
});
```

### Composants

#### NotificationDropdown
**Fichier** : `app/components/NotificationDropdown.tsx`
- Composant Popover avec liste de notifications
- Intégré dans le Header
- Rafraîchissement automatique
- Animations et transitions fluides

#### Pages
1. **notifications.tsx** - Page liste complète
2. **notifications.preferences.tsx** - Page de configuration

## 🎨 Design & UX

### Couleurs par type de notification
- ✅ **Success / Approved** : Vert (`text-green-500`)
- ❌ **Error / Rejected** : Rouge (`text-red-500`)
- ⚠️ **Warning** : Orange (`text-orange-500`)
- ✨ **Activation Request** : Cyan BABANA (`text-babana-cyan`)
- ℹ️ **Info / System** : Bleu (`text-blue-500`)

### Animations
- Badge de compteur avec effet pulse
- Transitions fluides sur hover
- Animations d'apparition (fade-in, zoom-in)
- Spinner de chargement

### Responsive
- Mobile-first design
- Breakpoints adaptés
- Touch-friendly sur mobile
- Optimisé pour tablettes

## 📡 API Endpoints (Backend Laravel)

```php
// Liste des notifications
GET /api/notifications
Query params: per_page, page, unread_only

// Nombre de notifications non lues
GET /api/notifications/unread-count

// Marquer toutes comme lues
POST /api/notifications/mark-all-as-read

// Supprimer toutes les lues
DELETE /api/notifications/read

// Préférences
GET /api/notifications/preferences
PUT /api/notifications/preferences
POST /api/notifications/preferences/reset

// Actions sur une notification
GET /api/notifications/{id}
POST /api/notifications/{id}/mark-as-read
DELETE /api/notifications/{id}
```

## 🌐 Internationalisation

Les traductions sont gérées dans :
- `app/lib/notification-translations.ts`
- `locales/fr/notifications.json`
- `locales/en/notifications.json`

Langues supportées : Français (fr) et English (en)

## 🚀 Utilisation

### Intégration dans le Header
Le composant `NotificationDropdown` est déjà intégré dans le Header et s'affiche automatiquement pour les utilisateurs connectés.

### Navigation
- **Dropdown** : Cliquer sur l'icône de cloche dans le header
- **Page complète** : `/notifications`
- **Préférences** : `/notifications/preferences`

### Rafraîchissement automatique
Le hook `useNotifications` avec `autoRefresh: true` actualise automatiquement le compteur toutes les 30 secondes.

## 🔧 Configuration

### Modifier l'intervalle de rafraîchissement
```typescript
useNotifications({
  autoRefresh: true,
  refreshInterval: 60000, // 60 secondes
});
```

### Modifier le nombre d'éléments par page
```typescript
useNotifications({
  initialParams: { per_page: 20 }
});
```

## 📦 Dépendances

Nouvelles dépendances ajoutées :
- `@radix-ui/react-scroll-area` - Pour le scroll dans le dropdown

Composants UI utilisés (shadcn/ui) :
- Popover
- Button
- Badge
- Card
- Tabs
- Switch
- Select
- ScrollArea
- Separator
- Alert

## ✅ Checklist d'implémentation

- [x] Types TypeScript pour notifications
- [x] Service API notification.service.ts
- [x] Hook useNotifications avec auto-refresh
- [x] Composant NotificationDropdown
- [x] Intégration dans le Header
- [x] Page liste des notifications
- [x] Page préférences des notifications
- [x] Traductions FR/EN
- [x] Composant ScrollArea (shadcn/ui)
- [x] Gestion des erreurs
- [x] Loading states
- [x] Animations et transitions
- [x] Responsive design
- [x] Documentation

## 🎯 Prochaines étapes possibles

1. **Notifications en temps réel** : Intégrer WebSockets ou Server-Sent Events
2. **Notifications Push** : Implémenter les notifications push navigateur
3. **Sons de notification** : Ajouter des sons pour les nouvelles notifications
4. **Groupement** : Grouper les notifications similaires
5. **Recherche** : Ajouter une barre de recherche dans les notifications
6. **Filtres avancés** : Filtrer par type, date, etc.
7. **Export** : Permettre l'export des notifications

## 📝 Notes

- Le système est entièrement typé avec TypeScript
- Toutes les requêtes API incluent la gestion d'erreurs
- Les traductions sont séparées pour faciliter la maintenance
- Le design suit la charte graphique BABANA (cyan, navy, etc.)
- Compatible avec le mode sombre (dark mode)

---

**Développé pour BABANA Partner Platform** 🚀

