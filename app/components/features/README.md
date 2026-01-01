# Composants de Fonctionnalités (Features)

Ce dossier contient les composants pour afficher les fonctionnalités de l'application avec gestion des permissions et rôles.

## Composants

### 1. `FeatureCard`

Carte de fonctionnalité simple et claire qui affiche uniquement les fonctionnalités accessibles.

**Props:**
- `title` (string): Titre de la fonctionnalité
- `description` (string): Description détaillée
- `icon` (LucideIcon): Icône de la fonctionnalité
- `href?` (string): Lien de destination (optionnel)
- `color?` (string): Classe Tailwind pour la couleur de fond de l'icône (défaut: 'bg-babana-cyan')
- `permission?` (Permission): Permission requise (utilisé en interne, non affiché)
- `hasAccess` (boolean): Indique si l'utilisateur a accès
- `actionLabel?` (string): Label pour le bouton d'action (défaut: 'Accéder')
- `size?` ('default' | 'compact'): Taille de la carte (défaut: 'default')

**Exemple:**
```tsx
<FeatureCard
  title="Gestion des utilisateurs"
  description="Créer, modifier et gérer les utilisateurs"
  icon={Users}
  href="/admin/users"
  color="bg-blue-500"
  hasAccess={permissions.can('view-users')}
/>
```

### 2. `PermissionBadge`

Badge pour afficher une permission ou un rôle avec un style cohérent.

**Props:**
- `permission?` (Permission): Permission à afficher
- `role?` (RoleSlug): Rôle à afficher
- `variant?` ('default' | 'compact'): Variant du badge (défaut: 'default')
- `showIcon?` (boolean): Afficher l'icône (défaut: true)

**Exemple:**
```tsx
<PermissionBadge permission="view-users" />
<PermissionBadge role="admin" />
```

### 3. `FeaturesSection`

Section affichant une grille de fonctionnalités. Affiche automatiquement uniquement les fonctionnalités accessibles.

**Props:**
- `title` (string): Titre de la section
- `subtitle?` (string): Sous-titre (optionnel)
- `features` (Feature[]): Liste des fonctionnalités
- `layout?` ('grid' | 'list'): Type de disposition (défaut: 'grid')
- `columns?` (2 | 3 | 4): Nombre de colonnes (défaut: 3)
- `actionLabel?` (string): Label pour les actions

**Type Feature:**
```tsx
interface Feature {
  title: string;
  description: string;
  icon: LucideIcon;
  href?: string;
  color?: string;
  permission: Permission;
  hasAccess: boolean;
}
```

**Exemple:**
```tsx
const features = [
  {
    title: 'Gestion des utilisateurs',
    description: 'Créer et gérer les utilisateurs',
    icon: Users,
    href: '/admin/users',
    color: 'bg-blue-500',
    permission: 'view-users',
    hasAccess: permissions.can('view-users'),
  },
  {
    title: 'Gestion des produits',
    description: 'Créer et modifier les produits',
    icon: Package,
    href: '/admin/products',
    color: 'bg-green-500',
    permission: 'view-products',
    hasAccess: permissions.can('view-products'),
  },
  // ... autres fonctionnalités
];

<FeaturesSection
  title="Fonctionnalités d'administration"
  subtitle="Gérez votre plateforme"
  features={features}
  columns={3}
/>
```

**Note:** Le composant filtre automatiquement pour n'afficher que les fonctionnalités où `hasAccess` est `true`.

## Utilisation avec les hooks de permissions

Ces composants fonctionnent en parfaite synergie avec le hook `usePermissions` :

```tsx
import { usePermissions } from '~/hooks';
import { FeatureCard } from '~/components';

function MyComponent() {
  const permissions = usePermissions();

  return (
    <FeatureCard
      title="Ma fonctionnalité"
      description="Description"
      icon={MyIcon}
      permission="my-permission"
      hasAccess={permissions.can('my-permission')}
      href="/my-route"
    />
  );
}
```

## Styles et personnalisation

Les composants utilisent :
- **Tailwind CSS** pour le styling
- **shadcn/ui** pour les composants de base (Card, Badge)
- **lucide-react** pour les icônes
- Les couleurs de la marque **babana-cyan** et **babana-navy**

Les cartes incluent :
- ✅ Effets de survol animés
- ✅ Design épuré et moderne
- ✅ Indicateur de progression au survol
- ✅ Mode dark supporté
- ✅ Responsive design
- ✅ Affichage uniquement des fonctionnalités accessibles

## Architecture des permissions

### Hiérarchie des rôles
1. **super_admin** - Accès complet à tout
2. **admin** - Accès à la plupart des fonctionnalités
3. **activateur** - Gestion des activations
4. **ba** (Brand Ambassador) - Fonctionnalités de base
5. **pos**, **dsm**, **vendeur**, etc. - Rôles spécialisés

### Principe de conception

**Simplicité avant tout** : Les composants suivent le principe de n'afficher que ce qui est pertinent pour l'utilisateur. Pas de fonctionnalités verrouillées, pas de badges de rôles - uniquement ce que l'utilisateur peut utiliser.

## Bonnes pratiques

1. **Toujours calculer `hasAccess`** avec les permissions réelles de l'utilisateur via `usePermissions()`
2. **Utiliser `FeaturesSection`** pour afficher plusieurs fonctionnalités cohérentes
3. **Grouper par contexte** : Administration, Ventes, Gestion client, etc.
4. **Utiliser des couleurs cohérentes** pour les catégories de fonctionnalités
5. **Fournir des descriptions claires** de ce que fait chaque fonctionnalité
6. **Ne pas afficher les fonctionnalités inaccessibles** - laissez le système filtrer automatiquement

