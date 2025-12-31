import type { ReactNode } from 'react';
import type { Permission, RoleSlug } from '~/types/auth.types';
import { usePermissions } from '~/hooks/usePermissions';

interface CanProps {
  children: ReactNode;
  /**
   * Permission(s) requise(s)
   */
  permission?: Permission | Permission[];
  /**
   * Rôle(s) requis
   */
  role?: RoleSlug | RoleSlug[];
  /**
   * Mode de vérification pour les permissions multiples
   * - 'all': toutes les permissions doivent être présentes
   * - 'any': au moins une permission doit être présente
   */
  mode?: 'all' | 'any';
  /**
   * Contenu à afficher si l'utilisateur n'a pas les permissions
   */
  fallback?: ReactNode;
}

/**
 * Composant pour afficher conditionnellement du contenu basé sur les permissions
 *
 * @example
 * ```tsx
 * <Can permission="create-users">
 *   <Button>Créer un utilisateur</Button>
 * </Can>
 * ```
 *
 * @example
 * ```tsx
 * <Can permission={['create-users', 'edit-users']} mode="any">
 *   <Button>Gérer les utilisateurs</Button>
 * </Can>
 * ```
 *
 * @example
 * ```tsx
 * <Can role="admin">
 *   <AdminPanel />
 * </Can>
 * ```
 */
export function Can({
  children,
  permission,
  role,
  mode = 'all',
  fallback = null,
}: CanProps) {
  const permissions = usePermissions();

  let hasAccess = false;

  // Vérifier les permissions
  if (permission) {
    const perms = Array.isArray(permission) ? permission : [permission];
    hasAccess = mode === 'all' ? permissions.canAll(perms) : permissions.canAny(perms);
  }
  // Vérifier les rôles
  else if (role) {
    const roles = Array.isArray(role) ? role : [role];
    hasAccess =
      mode === 'all' ? permissions.hasAllRoles(roles) : permissions.hasAnyRole(roles);
  }

  return hasAccess ? <>{children}</> : <>{fallback}</>;
}

