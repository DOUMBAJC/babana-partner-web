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
  route("admin/camtel-logins", "routes/admin/camtel-logins/route.tsx"),
  route("admin/settings", "routes/admin/settings/route.tsx"),
  route("roles-matrix", "routes/roles-matrix/route.tsx"),
  route("profile", "routes/profile/route.tsx"),
  route("credits", "routes/credits/route.tsx"),
  route("customers/search", "routes/customers/search/route.tsx"),
  route("customers/create", "routes/customers/create/route.tsx"),
  route("customers/identify", "routes/customers/identify/route.tsx"),
  route("customers/update/identify/:id", "routes/customers/update/identify.$id.tsx"),
  route("sales/activation", "routes/sales/activation/route.tsx"),
  route("sales/activation-requests", "routes/sales/activation-requests/route.tsx"),
  route("sales/activation-requests/:id", "routes/sales.activation-requests.$id.tsx"),

  // Messages
  route("messages", "routes/messages/route.tsx"),

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
  
  // Sessions API routes (SSR proxies)
  route("api/sessions", "routes/api/sessions.tsx"),
  route("api/sessions/:id", "routes/api/sessions.$id.tsx"),
  route("api/sessions/other/revoke", "routes/api/sessions.other.revoke.tsx"),
  route("api/sessions/activity", "routes/api/sessions.activity.tsx"),
  
  // Auth API routes (SSR proxies)
  route("api/auth/profile", "routes/api/auth.profile.tsx"),
  route("api/auth/change-password", "routes/api/auth.change-password.tsx"),
  
  // Route 404 - doit être la dernière pour capturer toutes les routes non définies
  route("*", "routes/$.tsx"),
] satisfies RouteConfig;
