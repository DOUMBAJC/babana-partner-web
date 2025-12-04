/**
 * Types pour l'authentification et la gestion des permissions
 */

export type RoleSlug =
  | 'super_admin'
  | 'admin'
  | 'ba'
  | 'activateur'
  | 'pos'
  | 'dsm'
  | 'vendeur'
  | 'client'
  | 'autre';

export type Permission =
  | 'all'
  // Users
  | 'view-users'
  | 'create-users'
  | 'edit-users'
  // Products
  | 'view-products'
  | 'create-products'
  | 'edit-products'
  // Orders
  | 'view-orders'
  | 'create-orders'
  | 'edit-orders'
  | 'approve-orders'
  // Requests
  | 'view-requests'
  | 'create-requests'
  | 'process-requests'
  | 'approve-requests'
  | 'reject-requests'
  // Inventory
  | 'view-inventory'
  | 'manage-inventory'
  // Reports
  | 'view-reports'
  | 'create-reports'
  | 'export-reports'
  // Sales
  | 'view-sales'
  | 'create-sales'
  | 'edit-sales'
  // POS
  | 'view-pos'
  | 'manage-pos'
  // Tasks
  | 'view-own-tasks'
  | 'manage-own-tasks'
  | 'view-all-tasks'
  | 'assign-tasks'
  // Admin
  | 'admin-access';

export interface Role {
  name: string;
  slug: RoleSlug;
  description: string;
  permissions: Permission[] | 'all';
}

/**
 * Statut d'un compte utilisateur
 */
export type AccountStatus =
  | 'pending_verification'  // En attente de vérification email
  | 'verified'              // Email vérifié, en attente d'activation admin
  | 'active'                // Compte actif
  | 'suspended'             // Compte suspendu
  | 'rejected';             // Compte rejeté

/**
 * Utilisateur (User)
 */
export interface User {
  id: number;
  name: string;
  email: string;
  roles: RoleSlug[];
  permissions?: Permission[];
  avatar?: string;
  createdAt: string;
  updatedAt: string;

  // Relations (chargées via include)
  activator?: {
    id: number;
    name: string;
    email: string;
  };
  
  // Méthodes helper (côté frontend)
  isActive?: boolean;
  isSuspended?: boolean;
  isVerified?: boolean;
  canLogin?: boolean;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  password_confirmation: string;
}

