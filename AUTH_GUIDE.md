# Guide d'Authentification et de Gestion des Permissions

Ce guide explique comment utiliser le système d'authentification et de gestion des permissions dans BABANA Partner Web.

## 📋 Table des matières

- [Vue d'ensemble](#vue-densemble)
- [Rôles et Permissions](#rôles-et-permissions)
- [Installation et Configuration](#installation-et-configuration)
- [Authentification](#authentification)
- [Vérification des Permissions](#vérification-des-permissions)
- [Protection des Routes](#protection-des-routes)
- [Affichage Conditionnel](#affichage-conditionnel)
- [Exemples Pratiques](#exemples-pratiques)

## Vue d'ensemble

Le système de gestion des permissions de BABANA Partner Web est basé sur un modèle de **rôles et permissions**. Chaque utilisateur peut avoir un ou plusieurs rôles, et chaque rôle possède un ensemble de permissions spécifiques.

### Architecture

```
User
  ├── roles: RoleSlug[]
  └── (permissions calculées depuis les rôles)

Role
  ├── name: string
  ├── slug: RoleSlug
  ├── description: string
  └── permissions: Permission[] | 'all'
```

## Rôles et Permissions

### Liste des Rôles

| Rôle | Slug | Description |
|------|------|-------------|
| Super Administrateur | `super_admin` | Accès complet à toutes les fonctionnalités |
| Administrateur | `admin` | Accès à la plupart des fonctionnalités administratives |
| Brand Ambassador (BA) | `ba` | Ambassadeur de marque avec accès aux fonctionnalités de base |
| Activateur | `activateur` | Gère et traite les requêtes des BA |
| Point de Vente (POS) | `pos` | Point de vente avec droits étendus |
| District Sales Manager (DSM) | `dsm` | Gère les points de vente |
| Vendeur | `vendeur` | Vend les produits aux BA |
| Client | `client` | Client de la plateforme |
| Autre | `autre` | Accès limité à la gestion de leurs tâches |

### Catégories de Permissions

#### 👥 Utilisateurs
- `view-users` - Voir les utilisateurs
- `create-users` - Créer des utilisateurs
- `edit-users` - Modifier des utilisateurs

#### 📦 Produits
- `view-products` - Voir les produits
- `create-products` - Créer des produits
- `edit-products` - Modifier des produits

#### 📝 Commandes
- `view-orders` - Voir les commandes
- `create-orders` - Créer des commandes
- `edit-orders` - Modifier des commandes
- `approve-orders` - Approuver des commandes

#### 🎫 Requêtes
- `view-requests` - Voir les requêtes
- `create-requests` - Créer des requêtes
- `process-requests` - Traiter des requêtes
- `approve-requests` - Approuver des requêtes
- `reject-requests` - Rejeter des requêtes

#### 📊 Inventaire
- `view-inventory` - Voir l'inventaire
- `manage-inventory` - Gérer l'inventaire

#### 📈 Rapports
- `view-reports` - Voir les rapports
- `create-reports` - Créer des rapports
- `export-reports` - Exporter des rapports

#### 💰 Ventes
- `view-sales` - Voir les ventes
- `create-sales` - Créer des ventes
- `edit-sales` - Modifier des ventes

#### 🏪 Points de Vente
- `view-pos` - Voir les points de vente
- `manage-pos` - Gérer les points de vente

#### ✅ Tâches
- `view-own-tasks` - Voir ses propres tâches
- `manage-own-tasks` - Gérer ses propres tâches
- `view-all-tasks` - Voir toutes les tâches
- `assign-tasks` - Assigner des tâches

#### 🔐 Administration
- `admin-access` - Accès administrateur

## Installation et Configuration

### 1. Ajouter le Provider d'authentification

Dans votre fichier `app/root.tsx`, ajoutez le `AuthProvider` :

```tsx
import { AuthProvider } from '~/hooks';

export default function App() {
  return (
    <html lang="fr">
      <head>
        <Meta />
        <Links />
      </head>
      <body>
        <ThemeProvider>
          <LanguageProvider>
            <AuthProvider>
              {/* Votre contenu */}
              <Outlet />
            </AuthProvider>
          </LanguageProvider>
        </ThemeProvider>
        <Scripts />
      </body>
    </html>
  );
}
```

### 2. Types TypeScript

Tous les types sont disponibles via :

```tsx
import type {
  User,
  Role,
  RoleSlug,
  Permission,
  AuthState,
  LoginCredentials,
  RegisterData,
} from '~/types';
```

## Authentification

### Hook `useAuth`

Le hook `useAuth` fournit l'accès à l'état d'authentification et aux actions.

```tsx
import { useAuth } from '~/hooks';

function MyComponent() {
  const {
    user,              // User | null
    token,             // string | null
    isAuthenticated,   // boolean
    isLoading,         // boolean
    login,             // (credentials: LoginCredentials) => Promise<void>
    logout,            // () => void
    updateUser,        // (user: User) => void
  } = useAuth();

  // ...
}
```

### Connexion

```tsx
import { useAuth } from '~/hooks';
import type { LoginCredentials } from '~/types';

function LoginPage() {
  const { login } = useAuth();

  const handleLogin = async () => {
    const credentials: LoginCredentials = {
      email: 'user@example.com',
      password: 'password123',
    };

    try {
      await login(credentials);
      // Rediriger vers le dashboard
    } catch (error) {
      console.error('Login failed:', error);
    }
  };

  return <button onClick={handleLogin}>Se connecter</button>;
}
```

### Déconnexion

```tsx
import { useAuth } from '~/hooks';

function LogoutButton() {
  const { logout } = useAuth();

  return (
    <button onClick={logout}>
      Se déconnecter
    </button>
  );
}
```

### Afficher les informations de l'utilisateur

```tsx
import { useAuth } from '~/hooks';

function UserProfile() {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return <p>Non connecté</p>;
  }

  return (
    <div>
      <h1>{user.name}</h1>
      <p>{user.email}</p>
      <p>Rôles : {user.roles.join(', ')}</p>
    </div>
  );
}
```

## Vérification des Permissions

### Hook `usePermissions`

Le hook `usePermissions` fournit des méthodes pour vérifier les permissions de l'utilisateur connecté.

```tsx
import { usePermissions } from '~/hooks';

function MyComponent() {
  const {
    can,              // (permission: Permission) => boolean
    canAll,           // (permissions: Permission[]) => boolean
    canAny,           // (permissions: Permission[]) => boolean
    hasRole,          // (role: RoleSlug) => boolean
    hasAllRoles,      // (roles: RoleSlug[]) => boolean
    hasAnyRole,       // (roles: RoleSlug[]) => boolean
    isAdmin,          // () => boolean
    isSuperAdmin,     // () => boolean
    permissions,      // Permission[]
    roles,            // RoleSlug[]
  } = usePermissions();

  // ...
}
```

### Exemples de vérification

```tsx
import { usePermissions } from '~/hooks';

function ProductsPage() {
  const permissions = usePermissions();

  // Vérifier une permission unique
  const canCreateProduct = permissions.can('create-products');

  // Vérifier plusieurs permissions (toutes requises)
  const canManageProducts = permissions.canAll([
    'view-products',
    'create-products',
    'edit-products',
  ]);

  // Vérifier plusieurs permissions (au moins une requise)
  const canViewOrCreateProducts = permissions.canAny([
    'view-products',
    'create-products',
  ]);

  // Vérifier un rôle
  const isAdmin = permissions.hasRole('admin');

  // Vérifier plusieurs rôles (au moins un requis)
  const isAdminOrSuperAdmin = permissions.hasAnyRole(['admin', 'super_admin']);

  return (
    <div>
      {canCreateProduct && (
        <button>Créer un produit</button>
      )}
    </div>
  );
}
```

### Utilitaires de permissions

Vous pouvez aussi utiliser les fonctions utilitaires directement :

```tsx
import { hasPermission, hasRole, isAdmin } from '~/lib';
import { useAuth } from '~/hooks';

function MyComponent() {
  const { user } = useAuth();

  if (hasPermission(user, 'create-users')) {
    // L'utilisateur peut créer des utilisateurs
  }

  if (hasRole(user, 'admin')) {
    // L'utilisateur est admin
  }

  if (isAdmin(user)) {
    // L'utilisateur est admin ou super_admin
  }
}
```

## Protection des Routes

### Composant `ProtectedRoute`

Le composant `ProtectedRoute` permet de protéger des routes entières basées sur l'authentification et les permissions.

```tsx
import { ProtectedRoute } from '~/components';

// Route nécessitant uniquement d'être authentifié
function Dashboard() {
  return (
    <ProtectedRoute>
      <DashboardContent />
    </ProtectedRoute>
  );
}

// Route nécessitant une permission spécifique
function UsersPage() {
  return (
    <ProtectedRoute permission="view-users">
      <UsersContent />
    </ProtectedRoute>
  );
}

// Route nécessitant plusieurs permissions (toutes requises)
function ProductsManagement() {
  return (
    <ProtectedRoute
      permission={['view-products', 'edit-products']}
      mode="all"
    >
      <ProductsContent />
    </ProtectedRoute>
  );
}

// Route nécessitant au moins une permission
function Reports() {
  return (
    <ProtectedRoute
      permission={['view-reports', 'create-reports']}
      mode="any"
    >
      <ReportsContent />
    </ProtectedRoute>
  );
}

// Route nécessitant un rôle spécifique
function AdminPanel() {
  return (
    <ProtectedRoute role="admin">
      <AdminContent />
    </ProtectedRoute>
  );
}

// Route nécessitant au moins un des rôles
function Management() {
  return (
    <ProtectedRoute role={['admin', 'super_admin', 'dsm']} mode="any">
      <ManagementContent />
    </ProtectedRoute>
  );
}

// Personnaliser les redirections
function SecurePage() {
  return (
    <ProtectedRoute
      permission="admin-access"
      redirectTo="/login"
      unauthorizedRedirect="/forbidden"
    >
      <SecureContent />
    </ProtectedRoute>
  );
}
```

### Props de `ProtectedRoute`

| Prop | Type | Description |
|------|------|-------------|
| `children` | `ReactNode` | Contenu à afficher si autorisé |
| `permission` | `Permission \| Permission[]` | Permission(s) requise(s) |
| `role` | `RoleSlug \| RoleSlug[]` | Rôle(s) requis |
| `mode` | `'all' \| 'any'` | Mode de vérification (défaut: `'all'`) |
| `redirectTo` | `string` | Redirection si non authentifié (défaut: `'/login'`) |
| `unauthorizedRedirect` | `string` | Redirection si non autorisé (défaut: `'/unauthorized'`) |

## Affichage Conditionnel

### Composant `Can`

Le composant `Can` permet d'afficher conditionnellement du contenu basé sur les permissions.

```tsx
import { Can } from '~/components';

// Afficher si l'utilisateur a la permission
function ProductsPage() {
  return (
    <div>
      <Can permission="create-products">
        <button>Créer un produit</button>
      </Can>

      <Can permission="edit-products">
        <button>Modifier</button>
      </Can>
    </div>
  );
}

// Afficher si l'utilisateur a toutes les permissions
function AdminTools() {
  return (
    <Can permission={['admin-access', 'view-users']} mode="all">
      <AdminPanel />
    </Can>
  );
}

// Afficher si l'utilisateur a au moins une permission
function OrderActions() {
  return (
    <Can permission={['edit-orders', 'approve-orders']} mode="any">
      <OrderManagement />
    </Can>
  );
}

// Afficher si l'utilisateur a un rôle spécifique
function SuperAdminPanel() {
  return (
    <Can role="super_admin">
      <DangerZone />
    </Can>
  );
}

// Afficher si l'utilisateur a au moins un des rôles
function SalesPanel() {
  return (
    <Can role={['vendeur', 'dsm', 'pos']} mode="any">
      <SalesTools />
    </Can>
  );
}

// Avec un fallback
function FeatureSection() {
  return (
    <Can
      permission="premium-features"
      fallback={<p>Cette fonctionnalité nécessite un compte premium.</p>}
    >
      <PremiumFeatures />
    </Can>
  );
}
```

### Props de `Can`

| Prop | Type | Description |
|------|------|-------------|
| `children` | `ReactNode` | Contenu à afficher si autorisé |
| `permission` | `Permission \| Permission[]` | Permission(s) requise(s) |
| `role` | `RoleSlug \| RoleSlug[]` | Rôle(s) requis |
| `mode` | `'all' \| 'any'` | Mode de vérification (défaut: `'all'`) |
| `fallback` | `ReactNode` | Contenu à afficher si non autorisé (défaut: `null`) |

## Exemples Pratiques

### Exemple 1 : Page de gestion des utilisateurs

```tsx
import { ProtectedRoute, Can } from '~/components';
import { usePermissions } from '~/hooks';

export default function UsersPage() {
  const permissions = usePermissions();

  return (
    <ProtectedRoute permission="view-users">
      <div>
        <div className="flex justify-between">
          <h1>Gestion des utilisateurs</h1>
          
          <Can permission="create-users">
            <button>Créer un utilisateur</button>
          </Can>
        </div>

        <UsersList />

        {permissions.can('edit-users') && (
          <EditUserDialog />
        )}
      </div>
    </ProtectedRoute>
  );
}
```

### Exemple 2 : Dashboard avec permissions multiples

```tsx
import { ProtectedRoute, Can } from '~/components';

export default function Dashboard() {
  return (
    <ProtectedRoute>
      <div className="grid grid-cols-3 gap-4">
        <Can permission="view-sales">
          <SalesCard />
        </Can>

        <Can permission="view-inventory">
          <InventoryCard />
        </Can>

        <Can permission="view-reports">
          <ReportsCard />
        </Can>

        <Can role={['admin', 'super_admin']} mode="any">
          <AdminCard />
        </Can>
      </div>
    </ProtectedRoute>
  );
}
```

### Exemple 3 : Menu de navigation basé sur les rôles

```tsx
import { Can } from '~/components';
import { usePermissions } from '~/hooks';

function Navigation() {
  const permissions = usePermissions();

  return (
    <nav>
      <Can permission="view-products">
        <NavLink to="/products">Produits</NavLink>
      </Can>

      <Can permission="view-orders">
        <NavLink to="/orders">Commandes</NavLink>
      </Can>

      <Can permission="view-inventory">
        <NavLink to="/inventory">Inventaire</NavLink>
      </Can>

      {permissions.isAdmin() && (
        <>
          <NavLink to="/users">Utilisateurs</NavLink>
          <NavLink to="/settings">Paramètres</NavLink>
        </>
      )}

      {permissions.isSuperAdmin() && (
        <NavLink to="/admin">Administration</NavLink>
      )}
    </nav>
  );
}
```

### Exemple 4 : Formulaire avec permissions conditionnelles

```tsx
import { Can } from '~/components';
import { usePermissions } from '~/hooks';

function ProductForm() {
  const permissions = usePermissions();
  const canEdit = permissions.can('edit-products');

  return (
    <form>
      <input
        type="text"
        name="name"
        disabled={!canEdit}
      />

      <Can permission="edit-products">
        <button type="submit">Enregistrer</button>
      </Can>

      <Can permission="create-products">
        <button type="button">Dupliquer</button>
      </Can>

      <Can role="admin">
        <button type="button" className="text-red-500">
          Supprimer définitivement
        </button>
      </Can>
    </form>
  );
}
```

### Exemple 5 : API avec token d'authentification

Le token d'authentification est automatiquement ajouté aux requêtes API via l'intercepteur axios.

```tsx
import { api } from '~/lib';
import { useAuth } from '~/hooks';

function ProductsList() {
  const { isAuthenticated } = useAuth();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    if (isAuthenticated) {
      // Le token est automatiquement ajouté via l'intercepteur
      api.get('/products')
        .then(setProducts)
        .catch(console.error);
    }
  }, [isAuthenticated]);

  return <div>{/* Afficher les produits */}</div>;
}
```

## 🔒 Bonnes Pratiques

### 1. Double vérification

Toujours vérifier les permissions côté frontend ET côté backend :

```tsx
// Frontend (UX)
<Can permission="delete-user">
  <button onClick={handleDelete}>Supprimer</button>
</Can>

// Backend (Sécurité)
// L'API doit TOUJOURS vérifier les permissions
```

### 2. Granularité des permissions

Utiliser des permissions granulaires plutôt que des vérifications de rôles :

```tsx
// ✅ Bon
<Can permission="create-products">
  <CreateButton />
</Can>

// ❌ Moins bon
<Can role="admin">
  <CreateButton />
</Can>
```

### 3. Loader pendant le chargement

Afficher un loader pendant la vérification de l'authentification :

```tsx
function MyApp() {
  const { isLoading } = useAuth();

  if (isLoading) {
    return <Loader />;
  }

  return <AppContent />;
}
```

### 4. Messages d'erreur explicites

Utiliser le prop `fallback` pour afficher des messages explicites :

```tsx
<Can
  permission="premium-feature"
  fallback={
    <Alert>
      Cette fonctionnalité est réservée aux comptes premium.
    </Alert>
  }
>
  <PremiumContent />
</Can>
```

## 📚 Références

- Types : `app/types/auth.types.ts`
- Rôles : `app/lib/roles.ts`
- Permissions : `app/lib/permissions.ts`
- Hook Auth : `app/hooks/useAuth.tsx`
- Hook Permissions : `app/hooks/usePermissions.tsx`
- Composant Can : `app/components/Can.tsx`
- Composant ProtectedRoute : `app/components/ProtectedRoute.tsx`

