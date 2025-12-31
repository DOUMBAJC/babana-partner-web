/**
 * Constantes pour la configuration de l'API
 */

/**
 * Liste des endpoints publics qui n'ont pas besoin d'authentification
 * Ces routes ne recevront pas le header Authorization
 */
export const PUBLIC_ENDPOINTS = [
  "/auth/login",
  "/auth/register",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/auth/verify-email",
  "/auth/resend-verification",
  "/public/",
] as const;

/**
 * Vérifie si une URL est un endpoint public
 */
export const isPublicEndpoint = (url: string | undefined): boolean => {
  if (!url) return false;
  return PUBLIC_ENDPOINTS.some(
    (endpoint) => url === endpoint || url.startsWith(endpoint)
  );
};

/**
 * Configuration par défaut de l'API
 */
export const API_CONFIG = {
  baseURL: import.meta.env.VITE_APP_API_URL || "http://localhost:8000/api",
  timeout: parseInt(import.meta.env.VITE_APP_API_TIMEOUT || "30000", 10),
  apiKey: import.meta.env.VITE_APP_API_KEY,
  isDevelopment: import.meta.env.VITE_APP_MODE === "development",
} as const;

