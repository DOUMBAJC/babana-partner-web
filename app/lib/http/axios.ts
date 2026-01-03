/**
 * Configuration et instance Axios principale
 * Gère les requêtes HTTP vers l'API backend
 */

import axios, { type AxiosError, type AxiosRequestConfig } from "axios";
import {
  generateCustomUserAgent,
  addClientMetadataToHeaders,
  getClientMetadata,
} from "../client/client-metadata";
import {
  addGeolocationToHeaders,
  getCachedGeolocation,
  type GeolocationData,
} from "../geo/geolocation";
import {
  handleAxiosError,
  isSessionExpiredError,
  logRequest,
  logResponse,
  setErrorLanguage,
  type ApiError,
} from "./api-error-handler";
import { API_CONFIG, isPublicEndpoint } from "./api-constants";

// Ré-exports pour compatibilité avec le code existant
export type { ApiError, GeolocationData };
export {
  requestGeolocation,
  clearGeolocation,
  getCachedGeolocation,
  hasGeolocation,
} from "../geo/geolocation";
export {
  getClientMetadata,
  generateCustomUserAgent,
  detectOS,
  detectBrowser,
} from "../client/client-metadata";

// Export des fonctions avec gestion du consentement
// Recommandé : Utilisez ces fonctions au lieu de requestGeolocation directement
export {
  requestGeolocationWithConsent,
  hasGeolocationConsent,
  useGeolocationWithConsent,
} from "../geo/consent-geolocation";

/**
 * Création de l'instance Axios configurée
 */
const axiosInstance = axios.create({
  baseURL: API_CONFIG.baseURL,
  timeout: API_CONFIG.timeout,
  headers: {
    "Content-Type": "application/json",
    "X-API-Key": API_CONFIG.apiKey,
    "User-Agent": generateCustomUserAgent(),
  },
  withCredentials: true,
});

/**
 * Lit la langue depuis le cookie babana-language
 */
const getLanguageFromCookie = (): "fr" | "en" => {
  if (typeof document === "undefined") return "fr";
  
  const match = document.cookie.match(/(?:^|;\s*)babana-language=([^;]+)/);
  const language = match ? match[1] : null;
  
  if (language === "en" || language === "fr") {
    return language;
  }
  
  return "fr";
};

/**
 * Gestion de la langue pour l'API
 * Initialise avec la langue du cookie si disponible
 */
let currentLanguage: "fr" | "en" = getLanguageFromCookie();

// Synchroniser la langue des erreurs dès l'initialisation
setErrorLanguage(currentLanguage);

export const setApiLanguage = (language: "fr" | "en"): void => {
  currentLanguage = language;
  setErrorLanguage(language);
};

export const getApiLanguage = (): string => {
  return currentLanguage;
};

/**
 * Intercepteur de requête
 * Ajoute les headers nécessaires et les métadonnées client
 */
axiosInstance.interceptors.request.use(
  (config) => {
    // Langue de l'API
    config.headers["Accept-Language"] = currentLanguage;

    // Clé API
    if (API_CONFIG.apiKey) {
      config.headers["X-API-Key"] = API_CONFIG.apiKey;
    }

    // Ajout des métadonnées du client
    if (typeof window !== "undefined") {
      config.headers = addClientMetadataToHeaders(
        config.headers as Record<string, string>
      ) as any;

      // Ajout de la géolocalisation si disponible
      config.headers = addGeolocationToHeaders(
        config.headers as Record<string, string>
      ) as any;
    }

    // Log en développement
    if (API_CONFIG.isDevelopment) {
      const isPublic = isPublicEndpoint(config.url);
      logRequest(config.method, config.url, isPublic);
    }

    return config;
  },
  (error) => {
    console.error("❌ Request error:", error);
    return Promise.reject(error);
  }
);

/**
 * Intercepteur de réponse
 * Gère les erreurs et les logs
 */
axiosInstance.interceptors.response.use(
  (response) => {
    if (API_CONFIG.isDevelopment) {
      logResponse(response.status, response.config.url);
    }
    return response;
  },
  (error: AxiosError) => {
    const apiError = handleAxiosError(error, API_CONFIG.isDevelopment);
    
    // Émettre un événement personnalisé pour les erreurs d'authentification côté client
    // Cela inclut les erreurs 401 et les erreurs serveur qui indiquent une session expirée
    // MAIS PAS pour certains endpoints (pour éviter les déconnexions automatiques)
    if (typeof window !== "undefined" && isSessionExpiredError(error)) {
      const url = error.config?.url || "";
      const isNotificationEndpoint = url.includes("/notifications");
      const isSessionsEndpoint = url.includes("/api/sessions") || url.includes("/auth/sessions");
      
      // Ne déclencher la déconnexion QUE si ce n'est PAS un endpoint exclu
      // Les endpoints de sessions et notifications peuvent échouer sans déconnecter l'utilisateur
      if (!isNotificationEndpoint && !isSessionsEndpoint) {
        window.dispatchEvent(new CustomEvent("auth:unauthorized"));
      }
    }
    
    return Promise.reject(apiError);
  }
);

/**
 * Types pour les requêtes API
 */
export type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export interface RequestOptions
  extends Omit<AxiosRequestConfig, "method" | "url"> {
  showLoader?: boolean;
  requiresAuth?: boolean;
}

/**
 * Interface simplifiée pour les requêtes API
 */
export const api = {
  get: <T = any>(url: string, config?: RequestOptions) =>
    axiosInstance.get<T>(url, config).then((res) => res.data),

  post: <T = any>(url: string, data?: any, config?: RequestOptions) =>
    axiosInstance.post<T>(url, data, config).then((res) => res.data),

  put: <T = any>(url: string, data?: any, config?: RequestOptions) =>
    axiosInstance.put<T>(url, data, config).then((res) => res.data),

  patch: <T = any>(url: string, data?: any, config?: RequestOptions) =>
    axiosInstance.patch<T>(url, data, config).then((res) => res.data),

  delete: <T = any>(url: string, config?: RequestOptions) =>
    axiosInstance.delete<T>(url, config).then((res) => res.data),
};

/**
 * Exporte les informations complètes du client
 * Utile pour le débogage ou l'affichage dans l'interface
 */
export const getClientInfo = () => {
  return {
    ...getClientMetadata(),
    geolocation: getCachedGeolocation(),
    customUserAgent: generateCustomUserAgent(),
  };
};

export default axiosInstance;
