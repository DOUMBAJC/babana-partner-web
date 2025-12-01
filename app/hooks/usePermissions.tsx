import { useMemo } from 'react';
import type { Permission, RoleSlug } from '~/types/auth.types';
import {
  hasPermission,
  hasAllPermissions,
  hasAnyPermission,
  hasRole,
  hasAllRoles,
  hasAnyRole,
  isAdmin,
  isSuperAdmin,
  getUserPermissions,
} from '~/lib/permissions';
import { useAuth } from './useAuth';

/**
 * Hook pour gérer les permissions de l'utilisateur connecté
 */
export function usePermissions() {
  const { user } = useAuth();

  return useMemo(
    () => ({
      /**
       * Vérifie si l'utilisateur a une permission spécifique
       */
      can: (permission: Permission): boolean => {
        return hasPermission(user, permission);
      },

      /**
       * Vérifie si l'utilisateur a toutes les permissions spécifiées
       */
      canAll: (permissions: Permission[]): boolean => {
        return hasAllPermissions(user, permissions);
      },

      /**
       * Vérifie si l'utilisateur a au moins une des permissions spécifiées
       */
      canAny: (permissions: Permission[]): boolean => {
        return hasAnyPermission(user, permissions);
      },

      /**
       * Vérifie si l'utilisateur a un rôle spécifique
       */
      hasRole: (role: RoleSlug): boolean => {
        return hasRole(user, role);
      },

      /**
       * Vérifie si l'utilisateur a tous les rôles spécifiés
       */
      hasAllRoles: (roles: RoleSlug[]): boolean => {
        return hasAllRoles(user, roles);
      },

      /**
       * Vérifie si l'utilisateur a au moins un des rôles spécifiés
       */
      hasAnyRole: (roles: RoleSlug[]): boolean => {
        return hasAnyRole(user, roles);
      },

      /**
       * Vérifie si l'utilisateur est administrateur (super_admin ou admin)
       */
      isAdmin: (): boolean => {
        return isAdmin(user);
      },

      /**
       * Vérifie si l'utilisateur est super administrateur
       */
      isSuperAdmin: (): boolean => {
        return isSuperAdmin(user);
      },

      /**
       * Obtenir toutes les permissions de l'utilisateur
       */
      permissions: getUserPermissions(user),

      /**
       * Obtenir les rôles de l'utilisateur
       */
      roles: user?.roles || [],
    }),
    [user]
  );
}

