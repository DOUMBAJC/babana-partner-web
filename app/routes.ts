import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  // Index
  index("routes/home/route.tsx"),
  
  // Routes d'authentification
  route("login", "routes/auth/login.tsx"),
  route("logout", "routes/auth/logout.tsx"),
  route("register", "routes/auth/register.tsx"),
  route("forgot-password", "routes/auth/forgot-password.tsx"),
  route("reset-password", "routes/auth/reset-password.tsx"),
  route("verify-email", "routes/auth/verify-email.tsx"),
  
  // Routes protégées
  route("unauthorized", "routes/unauthorized/route.tsx"),
  route("admin", "routes/admin/route.tsx"),
  route("admin/users", "routes/admin/users/route.tsx"),
  route("roles-matrix", "routes/roles-matrix/route.tsx"),
  route("profile", "routes/profile/route.tsx"),
  route("customers/search", "routes/customers/search/route.tsx"),
  route("customers/create", "routes/customers/create/route.tsx"),
  route("sales/activation", "routes/sales/activation/route.tsx"),
  route("sales/activation-requests", "routes/sales/activation-requests/route.tsx"),
  route("sales/activation-requests/:id", "routes/sales.activation-requests.$id.tsx"),

  // Notifications
  route("notifications", "routes/notifications/route.tsx"),
  route("notifications/preferences", "routes/notifications/preferences/route.tsx"),

  // Resource routes (SSR proxies)
  route("api/notifications", "routes/api/notifications.tsx"),
  route("api/notifications/:id", "routes/api/notifications.$id.tsx"),
  route(
    "api/notifications/:id/mark-as-read",
    "routes/api/notifications.$id.mark-as-read.tsx"
  ),
  route("api/notifications/mark-all-as-read", "routes/api/notifications.mark-all-as-read.tsx"),
  route("api/notifications/read", "routes/api/notifications.read.tsx"),
  route("api/notifications/unread-count", "routes/api/notifications.unread-count.tsx"),
  route("api/notifications/preferences", "routes/api/notifications.preferences.tsx"),
  route("api/notifications/preferences/reset", "routes/api/notifications.preferences.reset.tsx"),
  
  // Route 404 - doit être la dernière pour capturer toutes les routes non définies
  route("*", "routes/$.tsx"),
] satisfies RouteConfig;
