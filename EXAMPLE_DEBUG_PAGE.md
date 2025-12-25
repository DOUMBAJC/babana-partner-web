# 🎯 Exemple Pratique - Page avec Débogage Complet

Ce document montre comment créer une page complète avec tous les outils de débogage.

## 📄 Exemple : Page de Profil Utilisateur

Créez le fichier `app/routes/profile.tsx` avec le code suivant :

```tsx
import type { Route } from "./+types/profile";
import { useLoaderData } from 'react-router';
import { useEffect } from 'react';
import { 
  DebugPanel,
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  Avatar,
  AvatarImage,
  AvatarFallback,
  Badge,
} from '~/components';
import { 
  logServer, 
  logClient, 
  PerformanceLogger,
  useDebugValue,
} from '~/lib';
import { requireUserToken } from '~/services/session.server';
import { createApiFromRequest } from '~/services/api.server';

// ============================================================================
// LOADER - Côté Serveur
// ============================================================================
export async function loader({ request }: Route.LoaderArgs) {
  // 🟢 1. Mesurer les performances
  const perf = new PerformanceLogger('Profile Loader');
  
  try {
    // 🟢 2. Vérifier l'authentification
    const token = await requireUserToken(request);
    
    // 🟢 3. Créer l'API et récupérer les données
    const api = await createApiFromRequest(request);
    const response = await api.get('/auth/me');
    
    // 🟢 4. Logger les données désérialisées (visible dans le TERMINAL)
    logServer('✅ Profile loaded successfully', {
      userId: response.data.data.user.id,
      userName: response.data.data.user.name,
      rolesCount: response.data.data.user.roles.length,
      permissionsCount: response.data.data.user.roles[0]?.permissions.length || 0,
    });
    
    // 🟢 5. Terminer la mesure de performance
    perf.end({ 
      success: true, 
      userId: response.data.data.user.id 
    });
    
    // 🟢 6. Retourner les données filtrées (seulement ce qui est nécessaire)
    return {
      success: true,
      user: {
        id: response.data.data.user.id,
        name: response.data.data.user.name,
        email: response.data.data.user.email,
        fullName: response.data.data.user.full_name,
        accountStatus: response.data.data.user.account_status,
        createdAt: response.data.data.user.created_at,
        roles: response.data.data.user.roles.map((role: any) => ({
          id: role.id,
          name: role.name,
          slug: role.slug,
          permissionsCount: role.permissions.length,
        })),
      },
    };
    
  } catch (error: any) {
    // 🔴 Logger les erreurs
    logServer('❌ Failed to load profile', {
      error: error.message,
      status: error.response?.status,
    });
    
    perf.end({ success: false });
    
    return {
      success: false,
      error: error.message || 'Failed to load profile',
      user: null,
    };
  }
}

// ============================================================================
// COMPOSANT - Côté Client
// ============================================================================
export default function ProfilePage() {
  const data = useLoaderData<typeof loader>();
  
  // 🟢 1. Logger les données côté client (visible dans la CONSOLE du navigateur)
  useEffect(() => {
    logClient('🎨 Profile page mounted', data);
  }, [data]);
  
  // 🟢 2. Hook de debug automatique (optionnel)
  useDebugValue('Profile Data', data);
  
  // Gestion d'erreur
  if (!data.success || !data.user) {
    return (
      <div className="container mx-auto p-6">
        <DebugPanel data={data} label="Profile Error" position="bottom-right" />
        
        <Card className="border-red-200 bg-red-50">
          <CardHeader>
            <CardTitle className="text-red-600">Erreur</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-red-600">{data.error || 'Une erreur est survenue'}</p>
          </CardContent>
        </Card>
      </div>
    );
  }
  
  const { user } = data;
  
  return (
    <div className="container mx-auto p-6 space-y-6">
      {/* 🟢 3. Panneau de debug flottant (visible uniquement en DEV) */}
      <DebugPanel 
        data={data} 
        label="Profile Page Data" 
        position="bottom-right" 
      />
      
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold">Mon Profil</h1>
        <Badge variant={user.accountStatus === 'active' ? 'default' : 'secondary'}>
          {user.accountStatus}
        </Badge>
      </div>
      
      {/* Carte Profil */}
      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Avatar className="h-20 w-20">
              <AvatarImage src={`https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}`} />
              <AvatarFallback>{user.name.substring(0, 2).toUpperCase()}</AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-2xl">{user.fullName || user.name}</CardTitle>
              <p className="text-muted-foreground">{user.email}</p>
              <p className="text-sm text-muted-foreground mt-1">
                Membre depuis {new Date(user.createdAt).toLocaleDateString('fr-FR')}
              </p>
            </div>
          </div>
        </CardHeader>
      </Card>
      
      {/* Carte Rôles */}
      <Card>
        <CardHeader>
          <CardTitle>Rôles et Permissions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {user.roles.map((role: any) => (
              <div key={role.id} className="flex items-center justify-between p-3 border rounded">
                <div>
                  <h3 className="font-semibold">{role.name}</h3>
                  <p className="text-sm text-muted-foreground">{role.slug}</p>
                </div>
                <Badge variant="outline">
                  {role.permissionsCount} permissions
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      {/* Informations de Debug (visible uniquement en dev) */}
      {import.meta.env.DEV && (
        <Card className="border-purple-200 bg-purple-50/50">
          <CardHeader>
            <CardTitle className="text-purple-600 flex items-center gap-2">
              🐛 Mode Développement
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2 text-sm">
            <p>✅ <strong>Données désérialisées</strong> : Oui, automatiquement</p>
            <p>✅ <strong>Format Turbo Stream</strong> : Actif (optimisation -38%)</p>
            <p>✅ <strong>Logs serveur</strong> : Visibles dans le terminal</p>
            <p>✅ <strong>Logs client</strong> : Visibles dans la console</p>
            <p>✅ <strong>DebugPanel</strong> : Disponible en bas à droite 👉</p>
            <hr className="my-2" />
            <p className="text-xs text-muted-foreground">
              💡 Ce panneau disparaîtra automatiquement en production
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
```

## 🎯 Ce que fait cet exemple

### Côté Serveur (Loader)

1. ✅ **Mesure les performances** avec `PerformanceLogger`
2. ✅ **Vérifie l'authentification** avec `requireUserToken`
3. ✅ **Récupère les données** depuis l'API
4. ✅ **Filtre les données sensibles** (ne retourne que ce qui est nécessaire)
5. ✅ **Logs lisibles** dans le terminal avec `logServer()`

### Côté Client (Composant)

1. ✅ **Logs dans la console** avec `logClient()`
2. ✅ **Panneau de debug** avec `<DebugPanel>`
3. ✅ **Hook de debug** avec `useDebugValue()`
4. ✅ **Gestion d'erreurs** avec affichage approprié
5. ✅ **UI moderne** avec shadcn/ui

## 📊 Résultat

### Dans le Terminal (Serveur)
```
================================================================================
🔵 [SERVER] ✅ Profile loaded successfully
================================================================================
{
  "userId": 1,
  "userName": "Jean Calvain Doumba",
  "rolesCount": 1,
  "permissionsCount": 35
}
================================================================================

⏱️ [PERF] Profile Loader - END (234.56ms)
Info: { success: true, userId: 1 }
```

### Dans la Console du Navigateur
```
🟢 [CLIENT] 🎨 Profile page mounted
  Data: { success: true, user: {...} }
  JSON: {
    "success": true,
    "user": {
      "id": 1,
      "name": "Jean Calvain Doumba",
      ...
    }
  }
```

### Dans l'Application
- 🎨 Page de profil moderne et responsive
- 🐛 Panneau de debug flottant en bas à droite
- 📊 Toutes les données visibles et lisibles
- ✅ Aucun format bizarre visible !

## 🚀 Pour Tester

1. **Créez le fichier** `app/routes/profile.tsx` avec le code ci-dessus

2. **Ajoutez la route** dans `app/routes.ts` :
```tsx
import { type RouteConfig, route } from "@react-router/dev/routes";

export default [
  // ... vos routes existantes
  route("profile", "./routes/profile.tsx"),
] satisfies RouteConfig;
```

3. **Lancez le serveur** :
```bash
npm run dev
```

4. **Naviguez vers** `http://localhost:5173/profile`

5. **Regardez** :
   - Le **terminal** pour les logs serveur
   - La **console du navigateur** (F12) pour les logs client
   - Le **panneau flottant** en bas à droite pour les données complètes
   - Le **Network Inspector** : vous verrez le format Turbo Stream (mais vous n'en avez plus besoin !)

## 💡 Points Clés

### ✅ Ce qui est fait correctement

```tsx
// Filtrage des données sensibles
return {
  user: {
    id: user.id,
    name: user.name,
    email: user.email,
    // ✅ Pas de mot de passe, token, etc.
  }
};
```

### ❌ Ce qu'il NE faut PAS faire

```tsx
// Exposer toutes les données
return response.data; // ❌ Peut contenir des données sensibles
```

## 🎓 Ce que vous apprenez

1. ✅ Comment utiliser `PerformanceLogger` pour mesurer les performances
2. ✅ Comment utiliser `logServer()` et `logClient()` pour déboguer
3. ✅ Comment utiliser `<DebugPanel>` pour visualiser les données
4. ✅ Comment filtrer les données côté serveur pour la sécurité
5. ✅ Comment gérer les erreurs proprement
6. ✅ Pourquoi vous n'avez plus besoin du Network Inspector

## 📚 Prochaines Étapes

- [ ] Testez cet exemple dans votre projet
- [ ] Ajoutez `<DebugPanel>` à vos autres pages
- [ ] Utilisez `logServer()` dans vos autres loaders
- [ ] Lisez [DEBUG_QUICKSTART.md](./DEBUG_QUICKSTART.md) pour plus d'exemples

---

**Bon débogage ! 🐛** Si vous avez des questions, consultez [QUICK_REFERENCE.md](./QUICK_REFERENCE.md)

