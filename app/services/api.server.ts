import axios, { type AxiosError, type InternalAxiosRequestConfig } from "axios";
import { getUserToken, logout, getLanguage } from "./session.server";
import type { User } from "~/types/auth.types";

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
  const language = await getLanguage(request);
  return createApi({ language });
};

export const createAuthenticatedApi = async (request: Request) => {
  const token = await getUserToken(request);
  const language = await getLanguage(request);
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

export async function getCurrentUser(request: Request): Promise<User | null> {
  const token = await getUserToken(request);
  if (!token) return null;

  try {
    const api = await createAuthenticatedApi(request);
    const response = await api.get("/auth/user");
    
    // L'API retourne { success: true, data: { user, roles, permissions } }
    const apiData = response.data;
    
    // Si c'est un succès et qu'on a data.user
    if (apiData.success && apiData.data) {
      const { user, roles, permissions } = apiData.data;
      
      // Merger user avec roles transformés en objets { slug }
      return {
        ...user,
        roles: roles.map((slug: string) => ({ slug })),
        permissions: permissions || []
      };
    }
    
    // Fallback : si la structure est différente
    return apiData.user || apiData.data?.user || null;
  } catch (error: any) {
    console.error('Error getting current user:', error.message);
    return null; 
  }
}
