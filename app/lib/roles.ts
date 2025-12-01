import type { Role } from '~/types/auth.types';

/**
 * Définition de tous les rôles disponibles dans la plateforme
 */
export const ROLES: Record<string, Role> = {
  SUPER_ADMIN: {
    name: 'Super Administrateur',
    slug: 'super_admin',
    description: 'Accès complet à toutes les fonctionnalités de la plateforme',
    permissions: 'all',
  },
  ADMIN: {
    name: 'Administrateur',
    slug: 'admin',
    description: 'Accès à la plupart des fonctionnalités administratives',
    permissions: [
      'view-users',
      'create-users',
      'edit-users',
      'view-products',
      'create-products',
      'edit-products',
      'view-orders',
      'edit-orders',
      'approve-orders',
      'view-requests',
      'process-requests',
      'approve-requests',
      'reject-requests',
      'view-inventory',
      'manage-inventory',
      'view-reports',
      'create-reports',
      'export-reports',
      'view-sales',
      'view-pos',
      'view-all-tasks',
      'assign-tasks',
      'admin-access',
    ],
  },
  BA: {
    name: 'Brand Ambassador (BA)',
    slug: 'ba',
    description: 'Ambassadeur de marque avec accès aux fonctionnalités de base',
    permissions: [
      'view-products',
      'view-orders',
      'create-orders',
      'create-requests',
      'view-requests',
      'view-own-tasks',
      'manage-own-tasks',
    ],
  },
  ACTIVATEUR: {
    name: 'Activateur',
    slug: 'activateur',
    description: 'Gère et traite les requêtes des BA',
    permissions: [
      'view-users',
      'view-products',
      'view-orders',
      'edit-orders',
      'create-orders',
      'view-requests',
      'process-requests',
      'approve-requests',
      'reject-requests',
      'view-inventory',
      'view-reports',
      'view-own-tasks',
      'manage-own-tasks',
      'view-all-tasks',
    ],
  },
  POS: {
    name: 'Point de Vente (POS)',
    slug: 'pos',
    description: 'Point de vente avec les droits des BA et des droits supplémentaires',
    permissions: [
      'view-products',
      'view-orders',
      'create-orders',
      'edit-orders',
      'create-requests',
      'view-requests',
      'view-inventory',
      'view-sales',
      'create-sales',
      'view-own-tasks',
      'manage-own-tasks',
    ],
  },
  DSM: {
    name: 'District Sales Manager (DSM)',
    slug: 'dsm',
    description: 'Gère les points de vente (POS)',
    permissions: [
      'view-users',
      'view-products',
      'view-orders',
      'edit-orders',
      'approve-orders',
      'view-requests',
      'process-requests',
      'view-inventory',
      'manage-inventory',
      'view-reports',
      'create-reports',
      'export-reports',
      'view-sales',
      'edit-sales',
      'manage-pos',
      'view-pos',
      'view-own-tasks',
      'manage-own-tasks',
      'view-all-tasks',
      'assign-tasks',
    ],
  },
  VENDEUR: {
    name: 'Vendeur',
    slug: 'vendeur',
    description: 'Vend les produits aux BA',
    permissions: [
      'view-users',
      'view-products',
      'view-orders',
      'create-orders',
      'edit-orders',
      'view-inventory',
      'view-sales',
      'create-sales',
      'edit-sales',
      'view-own-tasks',
      'manage-own-tasks',
    ],
  },
  CLIENT: {
    name: 'Client',
    slug: 'client',
    description: 'Client de la plateforme',
    permissions: [
      'view-products',
      'view-orders',
      'create-orders',
      'view-own-tasks',
      'manage-own-tasks',
    ],
  },
  AUTRE: {
    name: 'Autre',
    slug: 'autre',
    description: 'Utilisateur avec accès limité à la gestion de leurs tâches',
    permissions: ['view-own-tasks', 'manage-own-tasks'],
  },
};

/**
 * Obtenir un rôle par son slug
 */
export const getRoleBySlug = (slug: string): Role | undefined => {
  return Object.values(ROLES).find((role) => role.slug === slug);
};

/**
 * Obtenir tous les slugs de rôles
 */
export const getAllRoleSlugs = (): string[] => {
  return Object.values(ROLES).map((role) => role.slug);
};

/**
 * Obtenir toutes les permissions d'un rôle
 */
export const getRolePermissions = (slug: string): string[] => {
  const role = getRoleBySlug(slug);
  if (!role) return [];
  return role.permissions === 'all' ? ['all'] : role.permissions;
};

