// Utilities
export { cn } from './utils';

// Axios configuration and API client
export { default as axiosInstance, api, setApiLanguage, getApiLanguage } from './axios';
export type { ApiError, HttpMethod, RequestOptions } from './axios';

// Translations
export { translations, interpolate } from './translations';
export type { Language, Translations } from './translations';

// Roles and Permissions
export { ROLES, getRoleBySlug, getAllRoleSlugs, getRolePermissions } from './roles';
export {
  hasPermission,
  hasAllPermissions,
  hasAnyPermission,
  hasRole,
  hasAllRoles,
  hasAnyRole,
  isAdmin,
  isSuperAdmin,
  getUserPermissions,
} from './permissions';

// Auth Service
export { authService } from './auth.service';
export type { LoginResponse, RegisterResponse } from './auth.service';

// Customer Service
export { customerService } from './customer.service';

// Activation Request Service
export { activationRequestService } from './activation-request.service';
