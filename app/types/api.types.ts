/**
 * Types génériques pour les réponses API
 */

/**
 * Métadonnées de pagination
 */
export interface PaginationMeta {
  currentPage: number;
  lastPage: number;
  perPage: number;
  total: number;
  from: number;
  to: number;
}

/**
 * Réponse paginée de l'API
 */
export interface PaginatedResponse<T> {
  data: T[];
  meta: PaginationMeta;
  links?: {
    first?: string;
    last?: string;
    prev?: string;
    next?: string;
  };
}

/**
 * Réponse API simple
 */
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
}

/**
 * Erreur de validation API
 */
export interface ValidationError {
  field: string;
  message: string;
}

/**
 * Réponse d'erreur API
 */
export interface ApiErrorResponse {
  message: string;
  code?: string;
  status?: number;
  errors?: ValidationError[];
  details?: any;
}

/**
 * Paramètres de pagination
 */
export interface PaginationParams {
  page?: number;
  perPage?: number;
  sortBy?: string;
  sortOrder?: 'asc' | 'desc';
}

/**
 * Paramètres de requête avec pagination
 */
export interface QueryParams extends PaginationParams {
  search?: string;
  include?: string | string[];
  [key: string]: any;
}

/**
 * Options de requête API
 */
export interface ApiRequestOptions {
  params?: QueryParams;
  showLoader?: boolean;
  requiresAuth?: boolean;
}

