import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { getUserToken, logout, getLanguage, getAcceptLanguageHeader } from "./session.server";
import type { User } from "~/types/auth.types";
import type { Role } from "~/types/auth.types";

/**
 * Liste des endpoints publics qui n'ont pas besoin d'authentification
 * Ces routes ne recevront pas le header Authorization
 */
const PUBLIC_ENDPOINTS = [
  "/auth/login",
  "/auth/register",
  "/auth/forgot-password",
  "/auth/reset-password",
  "/auth/verify-email",
  "/auth/resend-verification",
  "/public/",
];

/**
 * Vérifie si une URL est un endpoint public
 */
const isPublicEndpoint = (url: string | undefined): boolean => {
  if (!url) return false;
  return PUBLIC_ENDPOINTS.some(
    (endpoint) => url === endpoint || url.startsWith(endpoint)
  );
};

export interface CreateApiOptions {
  token?: string | null;
  language?: string;
}

export const createApi = (options: CreateApiOptions = {}) => {
  const { token, language = "fr" } = options;
  const baseURL = import.meta.env.VITE_APP_API_URL || "http://localhost:8000/api";

  const api = axios.create({
    baseURL,
    headers: {
      "Content-Type": "application/json",
      "Accept-Language": language,
      "X-API-Key": import.meta.env.VITE_APP_API_KEY || "",
    },
  });

  // Intercepteur pour ajouter le token uniquement aux endpoints protégés
  api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
      if (token && !isPublicEndpoint(config.url)) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
  );

  return api;
};

/**
 * Crée une instance API avec la langue extraite de la requête
 */
export const createApiFromRequest = async (request: Request) => {
  const language = await getAcceptLanguageHeader(request);
  return createApi({ language });
};

export const createAuthenticatedApi = async (request: Request) => {
  const token = await getUserToken(request);
  const language = await getAcceptLanguageHeader(request);
  const api = createApi({ token, language });

  api.interceptors.response.use(
    (response) => response,
    async (error: AxiosError) => {
      if (error.response?.status === 401) {
        throw await logout(request);
      }
      return Promise.reject(error);
    }
  );

  return api;
};

/**
 * Cache en mémoire pour les données utilisateur
 * Clé : token, Valeur : { user, timestamp }
 */
const userCache = new Map<string, { user: User | null, timestamp: number }>();
const USER_CACHE_DURATION = 5000; // 5 secondes

/**
 * Nettoie les entrées du cache expirées (appelé périodiquement)
 */
const cleanUserCache = () => {
  const now = Date.now();
  for (const [token, cached] of userCache.entries()) {
    if (now - cached.timestamp > USER_CACHE_DURATION) {
      userCache.delete(token);
    }
  }
};

// Nettoyer le cache toutes les 10 secondes
if (typeof setInterval !== 'undefined') {
  setInterval(cleanUserCache, 10000);
}

export async function getCurrentUser(request: Request): Promise<User | null> {
  const token = await getUserToken(request);
  if (!token) return null;

  // Vérifier le cache
  const cached = userCache.get(token);
  if (cached && (Date.now() - cached.timestamp) < USER_CACHE_DURATION) {
    return cached.user;
  }

  try {
    const api = await createAuthenticatedApi(request);
    const response = await api.get("/auth/user");
    
    // L'API retourne { success: true, data: { user, roles, permissions } }
    const apiData = response.data;
    
    let user: User | null = null;
    
    // Fonction helper pour normaliser les rôles en slugs
    const normalizeRoles = (rolesInput: any): string[] => {
      if (!rolesInput) return [];
      
      const rolesArray = Array.isArray(rolesInput) ? rolesInput : [rolesInput];
      
      return rolesArray.map((role: any) => {
        if (!role) return '';
        if (typeof role === 'string') return role;
        if (typeof role === 'object' && 'slug' in role) return role.slug;
        return '';
      }).filter(Boolean);
    };
    
    // Si c'est un succès et qu'on a data.user
    if (apiData.success && apiData.data) {
      const { user: userData, roles, permissions } = apiData.data;
      
      // Extraire les slugs des rôles (les rôles peuvent être des objets Role ou des strings)
      // Utiliser les rôles de data.roles en priorité, sinon userData.roles
      const rolesToNormalize = roles || userData?.roles || [];
      const roleSlugs = normalizeRoles(rolesToNormalize);
      
      // Merger user avec roles transformés en slugs
      user = {
        ...userData,
        roles: roleSlugs,
        permissions: permissions || userData?.permissions || []
      };
    } else {
      // Fallback : si la structure est différente
      const fallbackUser = apiData.user || apiData.data?.user || null;
      if (fallbackUser) {
        // Normaliser les rôles même dans le fallback
        const normalizedRoles = normalizeRoles(fallbackUser.roles);
        user = {
          ...fallbackUser,
          roles: normalizedRoles
        };
      }
    }
    if (user) {
      // S'assurer que roles est toujours un tableau
      if (!user.roles || !Array.isArray(user.roles)) {
        user.roles = [];
      }
      userCache.set(token, { user, timestamp: Date.now() });
    }
    
    return user;
  } catch (error: any) {
    console.error('Error getting current user:', error.message);
    // Ne pas mettre en cache les erreurs
    return null; 
  }
}

/**
 * Invalide le cache utilisateur pour un token spécifique
 * Utile après une mise à jour du profil
 */
export function invalidateUserCache(token: string) {
  userCache.delete(token);
}

/**
 * Invalide tout le cache utilisateur
 */
export function clearUserCache() {
  userCache.clear();
}
