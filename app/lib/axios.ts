/**
 * Configuration et instance Axios principale
 * Gère les requêtes HTTP vers l'API backend
 */

import axios, { type AxiosError, type AxiosRequestConfig } from "axios";
import {
  generateCustomUserAgent,
  addClientMetadataToHeaders,
} from "./client-metadata";
import {
  addGeolocationToHeaders,
  type GeolocationData,
} from "./geolocation";
import {
  handleAxiosError,
  logRequest,
  logResponse,
  setErrorLanguage,
  getErrorLanguage,
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
} from "./geolocation";
export {
  getClientMetadata,
  generateCustomUserAgent,
  detectOS,
  detectBrowser,
} from "./client-metadata";

// Export des fonctions avec gestion du consentement
// Recommandé : Utilisez ces fonctions au lieu de requestGeolocation directement
export {
  requestGeolocationWithConsent,
  hasGeolocationConsent,
  useGeolocationWithConsent,
} from "./consent-geolocation";

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
 * Gestion de la langue pour l'API
 */
let currentLanguage: "fr" | "en" = "fr";

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
    
    // Émettre un événement personnalisé pour les erreurs 401 côté client
    if (typeof window !== "undefined" && error.response?.status === 401) {
      window.dispatchEvent(new CustomEvent("auth:unauthorized"));
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
  const { getClientMetadata } = require("./client-metadata");
  const { getCachedGeolocation } = require("./geolocation");

  return {
    ...getClientMetadata(),
    geolocation: getCachedGeolocation(),
    customUserAgent: generateCustomUserAgent(),
  };
};

export default axiosInstance;
