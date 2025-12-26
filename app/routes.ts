import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/home.tsx"),
  
  // Routes d'authentification
  route("login", "routes/auth/login.tsx"),
  route("logout", "routes/auth/logout.tsx"),
  route("register", "routes/auth/register.tsx"),
  route("forgot-password", "routes/auth/forgot-password.tsx"),
  route("reset-password", "routes/auth/reset-password.tsx"),
  route("verify-email", "routes/auth/verify-email.tsx"),
  
  // Routes protégées
  route("unauthorized", "routes/unauthorized.tsx"),
  route("admin", "routes/admin.tsx"),
  route("roles-matrix", "routes/roles-matrix.tsx"),
  route("customers/search", "routes/customers/customers.search.tsx"),
  route("customers/create", "routes/customers/customers.create.tsx"),
  route("sales/activation", "routes/sales.activation.tsx"),
  route("sales/activation-requests", "routes/sales.activation-requests.tsx"),
  route("sales/activation-requests/:id", "routes/sales.activation-requests.$id.tsx"),
  
  // Route 404 - doit être la dernière pour capturer toutes les routes non définies
  route("*", "routes/$.tsx"),
] satisfies RouteConfig;
