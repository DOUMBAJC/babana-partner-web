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
 * Rôle tel que renvoyé par l'API (Eloquent)
 * Peut inclure des métadonnées + pivot (relation many-to-many).
 */
export type ApiRole = Role & {
  id: number;
  created_at?: string;
  updated_at?: string;
  pivot?: unknown;
};

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
  camtel_login?: string | null;
  personal_phone?: string | null;
  email_verified_at?: string | null;
  account_status: AccountStatus;
  first_name?: string;
  last_name?: string;
  full_name?: string;
  roles: RoleSlug[];
  /**
   * Rôles complets renvoyés par l'API (ex: `User::with('roles.permissions')`).
   * Utile pour afficher name/description/permissions côté UI sans heuristiques.
   */
  roles_details?: ApiRole[];
  permissions?: Permission[];
  avatar?: string;
  created_at: string;
  updated_at: string;
  activated_by?: number | null;
  activated_at?: string | null;
  rejection_reason?: string | null;

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

/**
 * User tel que renvoyé par l'API: `roles` peut être un tableau de slugs
 * OU un tableau d'objets Role (avec pivot).
 */
export type ApiUser = Omit<User, 'roles'> & {
  roles: Array<RoleSlug | ApiRole>;
};

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

export interface RegisterFormData {
  firstName: string;
  lastName: string;
  email: string;
  personal_phone: string;
  password: string;
  confirmPassword: string;
}

export interface RegisterFormErrors {
  firstName?: string;
  lastName?: string;
  email?: string;
  personal_phone?: string;
  password?: string;
  confirmPassword?: string;
  general?: string;
}

export interface UserSession {
  id: number;
  device_name: string;
  device_info: {
    os: string;
    os_version: string | null;
    browser: string;
    browser_version: string | null;
    device_type: string;
    platform: string;
  };
  client_info: {
    screen_resolution: string | null;
    timezone: string | null;
    language: string | null;
  };
  location: string | null;
  ip_address: string | null;
  user_agent: string | null;
  last_used_at: string;
  last_used_human: string;
  created_at: string;
  is_current: boolean;
}
