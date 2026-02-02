import type { Permission, RoleSlug, User } from '~/types/auth.types';
import { getRolePermissions } from './roles';

/**
 * Vérifie si un utilisateur a une permission spécifique
 */
export const hasPermission = (
  user: User | null,
  permission: Permission
): boolean => {
  if (!user || !user.roles || !Array.isArray(user.roles) || user.roles.length === 0) {
    return false;
  }

  // Si l'utilisateur a le rôle super_admin, il a toutes les permissions
  if (user.roles.includes('super_admin')) {
    return true;
  }

  // Vérifier si l'une des permissions des rôles de l'utilisateur correspond
  for (const roleSlug of user.roles) {
    const permissions = getRolePermissions(roleSlug);
    if (permissions.includes('all') || permissions.includes(permission)) {
      return true;
    }
  }

  return false;
};

/**
 * Vérifie si un utilisateur a toutes les permissions spécifiées
 */
export const hasAllPermissions = (
  user: User | null,
  permissions: Permission[]
): boolean => {
  return permissions.every((permission) => hasPermission(user, permission));
};

/**
 * Vérifie si un utilisateur a au moins une des permissions spécifiées
 */
export const hasAnyPermission = (
  user: User | null,
  permissions: Permission[]
): boolean => {
  return permissions.some((permission) => hasPermission(user, permission));
};

/**
 * Vérifie si un utilisateur a un rôle spécifique
 */
export const hasRole = (user: User | null, role: RoleSlug): boolean => {
  if (!user || !user.roles || !Array.isArray(user.roles) || user.roles.length === 0) {
    return false;
  }
  return user.roles.includes(role);
};

/**
 * Vérifie si un utilisateur a tous les rôles spécifiés
 */
export const hasAllRoles = (user: User | null, roles: RoleSlug[]): boolean => {
  return roles.every((role) => hasRole(user, role));
};

/**
 * Vérifie si un utilisateur a au moins un des rôles spécifiés
 */
export const hasAnyRole = (user: User | null, roles: RoleSlug[]): boolean => {
  return roles.some((role) => hasRole(user, role));
};

/**
 * Vérifie si un utilisateur est administrateur (super_admin ou admin)
 */
export const isAdmin = (user: User | null): boolean => {
  return hasAnyRole(user, ['super_admin', 'admin']);
};

/**
 * Vérifie si un utilisateur est super administrateur
 */
export const isSuperAdmin = (user: User | null): boolean => {
  return hasRole(user, 'super_admin');
};

/**
 * Obtenir toutes les permissions d'un utilisateur
 */
export const getUserPermissions = (user: User | null): Permission[] => {
  if (!user || !user.roles || !Array.isArray(user.roles) || user.roles.length === 0) {
    return [];
  }

  // Si l'utilisateur a le rôle super_admin, il a toutes les permissions
  if (user.roles.includes('super_admin')) {
    return ['all'];
  }

  // Collecter toutes les permissions uniques des rôles de l'utilisateur
  const allPermissions = new Set<Permission>();

  for (const roleSlug of user.roles) {
    const permissions = getRolePermissions(roleSlug);
    permissions.forEach((permission) => allPermissions.add(permission as Permission));
  }

  return Array.from(allPermissions);
};

