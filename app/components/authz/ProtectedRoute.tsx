import { Navigate } from 'react-router';
import type { ReactNode } from 'react';
import type { Permission, RoleSlug } from '~/types/auth.types';
import { useAuth } from '~/hooks/useAuth';
import { usePermissions } from '~/hooks/usePermissions';

interface ProtectedRouteProps {
  children: ReactNode;
  /**
   * Permission(s) requise(s) pour accéder à la route
   */
  permission?: Permission | Permission[];
  /**
   * Rôle(s) requis pour accéder à la route
   */
  role?: RoleSlug | RoleSlug[];
  /**
   * Mode de vérification pour les permissions/rôles multiples
   * - 'all': toutes les permissions/rôles doivent être présents
   * - 'any': au moins une permission/rôle doit être présent
   */
  mode?: 'all' | 'any';
  /**
   * Route de redirection si l'utilisateur n'est pas authentifié
   */
  redirectTo?: string;
  /**
   * Route de redirection si l'utilisateur n'a pas les permissions
   */
  unauthorizedRedirect?: string;
}

/**
 * Composant pour protéger les routes basé sur l'authentification et les permissions
 */
export function ProtectedRoute({
  children,
  permission,
  role,
  mode = 'all',
  redirectTo = '/login',
  unauthorizedRedirect = '/unauthorized',
}: ProtectedRouteProps) {
  const { isAuthenticated, isLoading } = useAuth();
  const permissions = usePermissions();

  // Afficher un loader pendant le chargement
  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="h-12 w-12 animate-spin rounded-full border-4 border-babana-cyan border-t-transparent" />
      </div>
    );
  }

  // Rediriger vers la page de connexion si l'utilisateur n'est pas authentifié
  if (!isAuthenticated) {
    return <Navigate to={redirectTo} replace />;
  }

  // Vérifier les permissions
  if (permission) {
    const perms = Array.isArray(permission) ? permission : [permission];
    const hasAccess =
      mode === 'all' ? permissions.canAll(perms) : permissions.canAny(perms);

    if (!hasAccess) {
      return <Navigate to={unauthorizedRedirect} replace />;
    }
  }

  // Vérifier les rôles
  if (role) {
    const roles = Array.isArray(role) ? role : [role];
    const hasAccess =
      mode === 'all'
        ? permissions.hasAllRoles(roles)
        : permissions.hasAnyRole(roles);

    if (!hasAccess) {
      return <Navigate to={unauthorizedRedirect} replace />;
    }
  }

  return <>{children}</>;
}

