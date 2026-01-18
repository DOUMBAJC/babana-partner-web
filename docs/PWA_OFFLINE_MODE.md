# 📱 Mode Hors Ligne (PWA) - Guide Complet

## 📖 Qu'est-ce qu'une PWA et le mode hors ligne ?

### Définition

Une **PWA (Progressive Web App)** est une application web qui se comporte comme une application native mobile/desktop. Le **mode hors ligne** permet à l'application de fonctionner même sans connexion internet.

### Comment ça fonctionne ?

1. **Service Worker** : Script JavaScript qui s'exécute en arrière-plan et intercepte les requêtes réseau
2. **Cache Strategy** : Stratégie de mise en cache des ressources (HTML, CSS, JS, images, données API)
3. **IndexedDB** : Base de données côté client pour stocker les données
4. **Manifest.json** : Fichier de configuration qui permet l'installation de l'app

### Schéma de fonctionnement

```
┌─────────────────────────────────────────────────────────┐
│                    UTILISATEUR                          │
└────────────────────┬────────────────────────────────────┘
                     │
                     ▼
┌─────────────────────────────────────────────────────────┐
│              APPLICATION WEB (React)                     │
│  ┌──────────────────────────────────────────────────┐   │
│  │         Service Worker (en arrière-plan)         │   │
│  │  ┌────────────────────────────────────────────┐   │   │
│  │  │  Intercepte les requêtes réseau          │   │   │
│  │  │  - Vérifie le cache                      │   │   │
│  │  │  - Retourne données cachées si offline   │   │   │
│  │  │  - Met à jour le cache si online         │   │   │
│  │  └────────────────────────────────────────────┘   │   │
│  └──────────────────────────────────────────────────┘   │
└────────────────────┬────────────────────────────────────┘
                     │
         ┌───────────┴───────────┐
         │                       │
         ▼                       ▼
┌─────────────────┐    ┌─────────────────┐
│   ONLINE        │    │   OFFLINE        │
│                 │    │                 │
│ - Requête API  │    │ - Cache local   │
│ - Mise à jour  │    │ - IndexedDB     │
│ - Sync données  │    │ - Queue actions │
└─────────────────┘    └─────────────────┘
```

---

## ✅ Est-ce possible pour votre projet ?

### **OUI, c'est tout à fait possible !** ✅

Votre projet utilise :
- ✅ **React Router 7** : Compatible avec les PWA
- ✅ **Vite** : Supporte les PWA via des plugins
- ✅ **React 19** : Parfait pour les PWA
- ✅ **Déjà un système de détection de connexion** (`ConnectionAlert`)

### Avantages pour votre plateforme BABANA

1. **Expérience utilisateur améliorée**
   - Les utilisateurs peuvent continuer à travailler sans internet
   - Consultation des données déjà chargées
   - Création de demandes d'activation en mode hors ligne (mise en file d'attente)

2. **Performance**
   - Chargement plus rapide grâce au cache
   - Réduction de la consommation de données

3. **Installation comme app**
   - Les utilisateurs peuvent installer l'app sur leur téléphone/desktop
   - Icône sur l'écran d'accueil
   - Expérience native

---

## 🎯 Ce qui fonctionnera en mode hors ligne

### ✅ Fonctionnalités possibles

1. **Consultation**
   - ✅ Voir les données déjà chargées (clients, activations, crédits)
   - ✅ Naviguer dans les pages déjà visitées
   - ✅ Consulter l'historique des transactions

2. **Création en file d'attente**
   - ✅ Créer des clients (stockés localement, synchronisés après)
   - ✅ Créer des demandes d'activation (mise en queue)
   - ✅ Remplir des formulaires

3. **Interface**
   - ✅ Toutes les pages statiques
   - ✅ Navigation entre pages
   - ✅ Thème et préférences

### ❌ Limitations

1. **Données en temps réel**
   - ❌ Pas de nouvelles données de l'API
   - ❌ Pas de notifications push en temps réel
   - ❌ Pas de synchronisation immédiate

2. **Actions nécessitant le serveur**
   - ❌ Recharge de crédits (nécessite paiement)
   - ❌ Validation finale des activations
   - ❌ Export de rapports

---

## 🛠️ Comment l'implémenter ?

### Architecture proposée

```
babana-partner-web/
├── public/
│   ├── manifest.json          # Configuration PWA
│   ├── sw.js                  # Service Worker
│   └── icons/                 # Icônes PWA (déjà présentes)
├── app/
│   ├── lib/
│   │   ├── pwa/
│   │   │   ├── service-worker.ts    # Logique du Service Worker
│   │   │   ├── cache-strategy.ts    # Stratégies de cache
│   │   │   └── offline-queue.ts     # File d'attente hors ligne
│   │   └── storage/
│   │       └── indexeddb.ts          # Wrapper IndexedDB
│   ├── hooks/
│   │   └── useOffline.tsx            # Hook pour gérer l'offline
│   └── components/
│       └── offline/
│           ├── OfflineBanner.tsx     # Bannière mode hors ligne
│           └── OfflineQueue.tsx      # Liste des actions en attente
└── vite.config.ts                    # Configuration Vite PWA
```

### Étapes d'implémentation

#### 1. Installation des dépendances

```bash
npm install vite-plugin-pwa workbox-window
npm install -D @types/workbox-window
```

#### 2. Configuration Vite

Modifier `vite.config.ts` :

```typescript
import { reactRouter } from "@react-router/dev/vite";
import tailwindcss from "@tailwindcss/vite";
import { defineConfig } from "vite";
import tsconfigPaths from "vite-tsconfig-paths";
import { VitePWA } from 'vite-plugin-pwa';

export default defineConfig({
  plugins: [
    tailwindcss(), 
    reactRouter(), 
    tsconfigPaths(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.ico', 'images/**/*'],
      manifest: {
        name: 'BABANA Partner',
        short_name: 'BABANA',
        description: 'Plateforme partenaire BABANA ETS DAIROU',
        theme_color: '#5FC8E9',
        background_color: '#0D1B4D',
        display: 'standalone',
        icons: [
          {
            src: 'images/icon-smartphone.jpeg',
            sizes: '192x192',
            type: 'image/jpeg'
          },
          // Ajouter d'autres tailles d'icônes
        ]
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,jpg,jpeg}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/api\.babana\.com\/.*/i,
            handler: 'NetworkFirst',
            options: {
              cacheName: 'api-cache',
              expiration: {
                maxEntries: 50,
                maxAgeSeconds: 60 * 60 * 24 // 24 heures
              },
              networkTimeoutSeconds: 10
            }
          }
        ]
      }
    })
  ],
});
```

#### 3. Créer le manifest.json

Créer `public/manifest.json` :

```json
{
  "name": "BABANA Partner",
  "short_name": "BABANA",
  "description": "Plateforme partenaire BABANA ETS DAIROU",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#0D1B4D",
  "theme_color": "#5FC8E9",
  "orientation": "portrait-primary",
  "icons": [
    {
      "src": "/images/icon-smartphone.jpeg",
      "sizes": "192x192",
      "type": "image/jpeg",
      "purpose": "any maskable"
    }
  ]
}
```

#### 4. Enregistrer le Service Worker

Modifier `app/root.tsx` pour enregistrer le Service Worker :

```typescript
import { useEffect } from 'react';
import { registerSW } from 'virtual:pwa-register';

// Dans le composant Layout ou App
useEffect(() => {
  if ('serviceWorker' in navigator) {
    const updateSW = registerSW({
      onNeedRefresh() {
        // Afficher une notification pour mettre à jour
        console.log('Nouvelle version disponible');
      },
      onOfflineReady() {
        console.log('Application prête pour le mode hors ligne');
      },
    });
  }
}, []);
```

#### 5. Créer un hook pour gérer l'offline

Créer `app/hooks/useOffline.tsx` :

```typescript
import { useState, useEffect } from 'react';

export function useOffline() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isOfflineReady, setIsOfflineReady] = useState(false);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Vérifier si le Service Worker est prêt
    if ('serviceWorker' in navigator) {
      navigator.serviceWorker.ready.then(() => {
        setIsOfflineReady(true);
      });
    }

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  return { isOnline, isOfflineReady };
}
```

#### 6. Créer une file d'attente pour les actions hors ligne

Créer `app/lib/pwa/offline-queue.ts` :

```typescript
interface QueuedAction {
  id: string;
  type: 'create-customer' | 'create-activation' | 'update-profile';
  data: any;
  timestamp: number;
  retries: number;
}

class OfflineQueue {
  private queue: QueuedAction[] = [];
  private readonly STORAGE_KEY = 'babana-offline-queue';
  private readonly MAX_RETRIES = 3;

  constructor() {
    this.loadQueue();
  }

  private loadQueue() {
    try {
      const stored = localStorage.getItem(this.STORAGE_KEY);
      if (stored) {
        this.queue = JSON.parse(stored);
      }
    } catch (error) {
      console.error('Erreur lors du chargement de la file:', error);
    }
  }

  private saveQueue() {
    try {
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(this.queue));
    } catch (error) {
      console.error('Erreur lors de la sauvegarde de la file:', error);
    }
  }

  add(action: Omit<QueuedAction, 'id' | 'timestamp' | 'retries'>) {
    const queuedAction: QueuedAction = {
      ...action,
      id: `action-${Date.now()}-${Math.random()}`,
      timestamp: Date.now(),
      retries: 0,
    };

    this.queue.push(queuedAction);
    this.saveQueue();
    return queuedAction.id;
  }

  async processQueue(apiCall: (action: QueuedAction) => Promise<any>) {
    const online = navigator.onLine;
    if (!online) return;

    const actionsToProcess = [...this.queue];
    
    for (const action of actionsToProcess) {
      try {
        await apiCall(action);
        this.remove(action.id);
      } catch (error) {
        action.retries++;
        if (action.retries >= this.MAX_RETRIES) {
          this.remove(action.id);
          console.error(`Action ${action.id} échouée après ${this.MAX_RETRIES} tentatives`);
        } else {
          this.saveQueue();
        }
      }
    }
  }

  remove(id: string) {
    this.queue = this.queue.filter(action => action.id !== id);
    this.saveQueue();
  }

  getAll() {
    return [...this.queue];
  }

  clear() {
    this.queue = [];
    this.saveQueue();
  }
}

export const offlineQueue = new OfflineQueue();
```

#### 7. Utiliser la file d'attente dans les formulaires

Exemple dans `app/routes/customers/create/route.tsx` :

```typescript
import { offlineQueue } from '~/lib/pwa/offline-queue';
import { useOffline } from '~/hooks/useOffline';

// Dans le composant
const { isOnline } = useOffline();

const handleSubmit = async (data: FormData) => {
  if (!isOnline) {
    // Mettre en file d'attente
    const actionId = offlineQueue.add({
      type: 'create-customer',
      data: data,
    });
    
    toast.info('Action mise en file d\'attente. Synchronisation automatique à la reconnexion.');
    return;
  }

  // Action normale si en ligne
  // ... code existant
};
```

---

## 📊 Stratégies de cache

### 1. Cache First (pour les assets statiques)
- CSS, JS, images
- Toujours utiliser le cache si disponible

### 2. Network First (pour les données API)
- Essayer le réseau d'abord
- Utiliser le cache si le réseau échoue
- Parfait pour les données qui changent souvent

### 3. Stale While Revalidate
- Retourner le cache immédiatement
- Mettre à jour en arrière-plan
- Bon pour les données qui changent peu

### 4. Network Only
- Toujours utiliser le réseau
- Pour les actions critiques (paiements, etc.)

---

## 🎨 Composants UI à ajouter

### 1. Bannière mode hors ligne

```typescript
// app/components/offline/OfflineBanner.tsx
export function OfflineBanner() {
  const { isOnline } = useOffline();
  
  if (isOnline) return null;
  
  return (
    <div className="fixed bottom-4 right-4 bg-orange-500 text-white p-4 rounded-lg shadow-lg">
      <p>Mode hors ligne activé</p>
    </div>
  );
}
```

### 2. Liste des actions en attente

```typescript
// app/components/offline/OfflineQueue.tsx
export function OfflineQueue() {
  const queue = offlineQueue.getAll();
  
  if (queue.length === 0) return null;
  
  return (
    <Card>
      <CardHeader>
        <CardTitle>Actions en attente ({queue.length})</CardTitle>
      </CardHeader>
      <CardContent>
        {queue.map(action => (
          <div key={action.id}>
            {action.type} - {new Date(action.timestamp).toLocaleString()}
          </div>
        ))}
      </CardContent>
    </Card>
  );
}
```

---

## 🚀 Avantages pour votre plateforme

1. **Expérience utilisateur**
   - Les BA peuvent continuer à créer des clients même sans internet
   - Les données sont disponibles instantanément
   - Synchronisation automatique à la reconnexion

2. **Performance**
   - Chargement plus rapide
   - Moins de requêtes au serveur
   - Économie de données mobiles

3. **Fiabilité**
   - Fonctionne même avec une connexion instable
   - Pas de perte de données
   - File d'attente automatique

---

## ⚠️ Points d'attention

1. **Synchronisation des données**
   - Gérer les conflits si les données changent côté serveur
   - Valider les données avant synchronisation

2. **Sécurité**
   - Ne pas mettre en cache les données sensibles
   - Chiffrer les données stockées localement si nécessaire

3. **Stockage**
   - Limiter la taille du cache
   - Nettoyer régulièrement les anciennes données

4. **Tests**
   - Tester en mode hors ligne
   - Tester la synchronisation
   - Tester sur différents navigateurs

---

## 📱 Installation comme app

Une fois la PWA configurée, les utilisateurs pourront :

1. **Sur mobile** :
   - Ouvrir dans Chrome/Safari
   - Menu → "Ajouter à l'écran d'accueil"
   - L'app apparaîtra comme une app native

2. **Sur desktop** :
   - Chrome/Edge : Icône d'installation dans la barre d'adresse
   - L'app s'ouvrira dans une fenêtre séparée

---

## 🔄 Prochaines étapes

1. ✅ Installer les dépendances
2. ✅ Configurer Vite PWA
3. ✅ Créer le manifest.json
4. ✅ Enregistrer le Service Worker
5. ✅ Créer le hook useOffline
6. ✅ Implémenter la file d'attente
7. ✅ Ajouter les composants UI
8. ✅ Tester en mode hors ligne
9. ✅ Documenter pour les utilisateurs

---

## 📚 Ressources

- [MDN - Service Workers](https://developer.mozilla.org/fr/docs/Web/API/Service_Worker_API)
- [Vite PWA Plugin](https://vite-pwa-org.netlify.app/)
- [Workbox Documentation](https://developers.google.com/web/tools/workbox)
- [PWA Checklist](https://web.dev/pwa-checklist/)

---

**Note** : Cette implémentation est progressive. Vous pouvez commencer par les fonctionnalités de base et ajouter les fonctionnalités avancées progressivement.

