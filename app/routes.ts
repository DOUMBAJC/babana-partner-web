import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  
  // Routes d'authentification
  route("login", "routes/auth/login.tsx"),
  route("register", "routes/auth/register.tsx"),
  route("forgot-password", "routes/auth/forgot-password.tsx"),
  route("reset-password", "routes/auth/reset-password.tsx"),
  route("verify-email", "routes/auth/verify-email.tsx"),
  
  // Routes protégées
  route("unauthorized", "routes/unauthorized.tsx"),
  route("admin", "routes/admin.tsx"),
  
  // Route 404 - doit être la dernière pour capturer toutes les routes non définies
  route("*", "routes/$.tsx"),
] satisfies RouteConfig;
