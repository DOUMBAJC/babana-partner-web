/**
 * Public API (compat): permissions / authz helpers.
 * Point d'entrée stable `~/lib/permissions`.
 */

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
} from "./auth/permissions";


