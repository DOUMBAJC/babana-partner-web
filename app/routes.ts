import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  
  // Routes d'authentification
  route("login", "routes/login.tsx"),
  route("register", "routes/register.tsx"),
  route("forgot-password", "routes/forgot-password.tsx"),
  route("reset-password", "routes/reset-password.tsx"),
  route("verify-email", "routes/verify-email.tsx"),
  
  // Routes protégées
  route("unauthorized", "routes/unauthorized.tsx"),
  route("admin", "routes/admin.tsx"),
] satisfies RouteConfig;
