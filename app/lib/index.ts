// Public API barrel (stable imports via `~/lib/*`)

// Utilities
export { cn } from "./utils";

// Axios configuration and API client
export { axiosInstance, api, setApiLanguage, getApiLanguage, getClientInfo } from "./axios";
export type { ApiError, HttpMethod, RequestOptions, GeolocationData } from "./axios";

// Translations
export { translations, interpolate, getTranslations } from "./translations";
export type { Language, Translations } from "./translations";
export { notificationTranslations } from "./notification-translations";
export type { NotificationTranslations } from "./notification-translations";

// Roles and Permissions
export { ROLES, getRoleBySlug, getAllRoleSlugs, getRolePermissions } from "./roles";
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
} from "./permissions";

// Client-side services
export { authService } from "./services/auth.service";
export { customerService } from "./services/customer.service";
export { idCardTypeService } from "./services/id-card-type.service";
export { activationRequestService } from "./services/activation-request.service";
export { notificationService } from "./services/notification.service";
