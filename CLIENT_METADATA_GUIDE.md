# Guide des Métadonnées Client

## 📋 Vue d'ensemble

Le système de métadonnées client a été implémenté dans `app/lib/axios.ts` pour envoyer automatiquement des informations sur le client (navigateur, OS, localisation, etc.) à chaque requête API.

## 🔄 Métadonnées Automatiques

Les métadonnées suivantes sont **automatiquement collectées et envoyées** avec chaque requête API :

### En-têtes HTTP envoyés

| En-tête | Description | Exemple |
|---------|-------------|---------|
| `User-Agent` | User-Agent personnalisé | `BabanaPartner/Chrome/120.0 (Windows; Win32)` |
| `X-Client-OS` | Système d'exploitation | `Windows`, `macOS`, `Linux`, `Android`, `iOS` |
| `X-Client-Browser` | Nom du navigateur | `Chrome`, `Firefox`, `Safari`, `Edge`, `Opera` |
| `X-Client-Browser-Version` | Version du navigateur | `120.0` |
| `X-Client-Platform` | Plateforme du système | `Win32`, `MacIntel`, `Linux x86_64` |
| `X-Client-Screen-Resolution` | Résolution de l'écran | `1920x1080` |
| `X-Client-Timezone` | Fuseau horaire | `Europe/Paris`, `America/New_York` |
| `X-Client-Language` | Langue du navigateur | `fr-FR`, `en-US` |

### Détection automatique

- ✅ **OS** : Windows, macOS, Linux, Android, iOS
- ✅ **Navigateur** : Chrome, Firefox, Safari, Edge, Opera
- ✅ **Version du navigateur** : Détection automatique
- ✅ **Résolution d'écran** : Largeur x Hauteur
- ✅ **Fuseau horaire** : Détecté via `Intl.DateTimeFormat()`
- ✅ **Langue** : Langue préférée du navigateur

## 📍 Géolocalisation (Optionnelle)

La géolocalisation n'est **pas activée par défaut** et nécessite le consentement explicite de l'utilisateur.

### Activation de la géolocalisation

```typescript
import { requestGeolocation } from "~/lib/axios";

// Demander la permission et activer la géolocalisation
const geolocation = await requestGeolocation();

if (geolocation) {
  console.log("Position:", geolocation.latitude, geolocation.longitude);
  // Les futures requêtes incluront automatiquement ces données
}
```

### En-têtes de géolocalisation

Lorsque activée, les en-têtes suivants sont ajoutés :

| En-tête | Description | Exemple |
|---------|-------------|---------|
| `X-Client-Latitude` | Latitude GPS | `48.8566` |
| `X-Client-Longitude` | Longitude GPS | `2.3522` |
| `X-Client-Location-Accuracy` | Précision en mètres | `10` |

### Effacer les données de géolocalisation

```typescript
import { clearGeolocation } from "~/lib/axios";

// Effacer les données de géolocalisation
clearGeolocation();
```

## 🔍 Consultation des métadonnées

Pour consulter les métadonnées actuelles du client :

```typescript
import { getClientInfo } from "~/lib/axios";

const clientInfo = getClientInfo();
console.log("Informations client:", clientInfo);

// Exemple de sortie :
// {
//   os: "Windows",
//   browser: "Chrome",
//   browserVersion: "120.0",
//   platform: "Win32",
//   screenResolution: "1920x1080",
//   timezone: "Europe/Paris",
//   language: "fr-FR",
//   userAgent: "Mozilla/5.0...",
//   geolocation: { latitude: 48.8566, longitude: 2.3522, accuracy: 10 },
//   customUserAgent: "BabanaPartner/Chrome/120.0 (Windows; Win32)"
// }
```

## 🎯 Cas d'usage

### 1. Affichage dans l'interface utilisateur

```typescript
import { getClientInfo } from "~/lib/axios";

function ClientInfoComponent() {
  const clientInfo = getClientInfo();
  
  return (
    <div>
      <p>Navigateur : {clientInfo.browser} {clientInfo.browserVersion}</p>
      <p>OS : {clientInfo.os}</p>
      <p>Fuseau horaire : {clientInfo.timezone}</p>
    </div>
  );
}
```

### 2. Demande de géolocalisation au login

```typescript
import { requestGeolocation } from "~/lib/axios";

async function handleLogin() {
  // Demander la géolocalisation lors de la connexion
  await requestGeolocation();
  
  // Effectuer la connexion (la géolocalisation sera incluse)
  await api.post("/auth/login", { email, password });
}
```

### 3. Débogage

```typescript
import { getClientInfo } from "~/lib/axios";

// En mode développement
if (import.meta.env.DEV) {
  console.table(getClientInfo());
}
```

## 🔒 Sécurité et Confidentialité

### Données collectées automatiquement
- ✅ Ne nécessitent pas de permission utilisateur
- ✅ Sont des informations publiques du navigateur
- ✅ Ne compromettent pas la vie privée

### Géolocalisation
- 🔐 Nécessite le consentement explicite de l'utilisateur
- 🔐 Le navigateur affiche une demande de permission
- 🔐 Peut être refusée ou désactivée à tout moment
- 🔐 Cache de 5 minutes pour éviter les demandes répétées

## ⚙️ Configuration Backend

Le backend doit être configuré pour accepter et traiter ces en-têtes personnalisés.

### Exemple Node.js/Express

```javascript
app.use((req, res, next) => {
  // Récupérer les métadonnées du client
  const clientMetadata = {
    os: req.headers['x-client-os'],
    browser: req.headers['x-client-browser'],
    browserVersion: req.headers['x-client-browser-version'],
    platform: req.headers['x-client-platform'],
    screenResolution: req.headers['x-client-screen-resolution'],
    timezone: req.headers['x-client-timezone'],
    language: req.headers['x-client-language'],
    latitude: req.headers['x-client-latitude'],
    longitude: req.headers['x-client-longitude'],
    locationAccuracy: req.headers['x-client-location-accuracy'],
  };
  
  // Utiliser les métadonnées pour logging, analytics, etc.
  req.clientMetadata = clientMetadata;
  next();
});
```

### Exemple de logging

```javascript
// Logger les connexions avec les métadonnées
app.post('/api/auth/login', (req, res) => {
  console.log('Login attempt:', {
    email: req.body.email,
    client: req.clientMetadata,
    timestamp: new Date(),
  });
  
  // Traitement de la connexion...
});
```

## 📊 Analytics et Tracking

Les métadonnées peuvent être utilisées pour :

- 📈 **Statistiques d'utilisation** : Navigateurs, OS, résolutions les plus utilisés
- 🌍 **Analyse géographique** : Répartition des utilisateurs par pays/région
- 🐛 **Débogage** : Reproduire les bugs spécifiques à certains navigateurs/OS
- 🔐 **Sécurité** : Détecter les connexions suspectes (changement de localisation)
- 🎨 **UX** : Adapter l'interface selon la résolution d'écran

## ⚠️ Notes importantes

1. **SSR (Server-Side Rendering)** : Les métadonnées ne sont collectées que côté client. En SSR, des valeurs par défaut sont utilisées.

2. **Performance** : La collecte des métadonnées est instantanée et n'impacte pas les performances.

3. **Cache de géolocalisation** : La position GPS est mise en cache pendant 5 minutes pour éviter de solliciter trop souvent l'utilisateur.

4. **CORS** : Assurez-vous que le backend accepte les en-têtes personnalisés `X-Client-*` dans la configuration CORS.

## 🔧 Dépannage

### Les métadonnées ne sont pas envoyées

- Vérifiez que vous utilisez `api` de `~/lib/axios` et non `axios` directement
- Vérifiez que le code s'exécute côté client (`typeof window !== "undefined"`)

### La géolocalisation ne fonctionne pas

- Vérifiez que le navigateur supporte l'API Geolocation
- Vérifiez que le site est en HTTPS (obligatoire pour la géolocalisation)
- Vérifiez que l'utilisateur a donné sa permission

### Les en-têtes sont rejetés par le backend

- Vérifiez la configuration CORS du backend
- Ajoutez les en-têtes `X-Client-*` aux en-têtes autorisés

## 📚 Références

- [MDN - Geolocation API](https://developer.mozilla.org/fr/docs/Web/API/Geolocation_API)
- [MDN - Navigator](https://developer.mozilla.org/fr/docs/Web/API/Navigator)
- [MDN - Screen](https://developer.mozilla.org/fr/docs/Web/API/Screen)


