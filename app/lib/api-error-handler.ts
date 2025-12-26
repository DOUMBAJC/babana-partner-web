/**
 * Module de gestion des erreurs API
 * Centralise la logique de traitement des erreurs HTTP et réseau
 */

import type { AxiosError } from "axios";
import { translations, type Language } from "~/lib/translations";

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  details?: any;
  error?: any;
}

/**
 * Langue courante pour les messages d'erreur
 */
let currentLanguage: Language = "fr";

/**
 * Définit la langue pour les messages d'erreur
 */
export const setErrorLanguage = (language: Language): void => {
  currentLanguage = language;
};

/**
 * Récupère la langue courante
 */
export const getErrorLanguage = (): Language => {
  return currentLanguage;
};

/**
 * Gère la redirection en cas d'erreur 401 (non authentifié)
 */
const handleUnauthorized = (): void => {
  if (typeof window !== "undefined") {
    window.location.href = "/login";
  }
};

/**
 * Extrait le message d'erreur des données de réponse
 */
const extractErrorMessage = (data: any, defaultMessage: string): string => {
  return (
    data?.error?.message || data?.message || data?.error || defaultMessage
  );
};

/**
 * Construit un ApiError à partir d'une erreur de réponse HTTP
 */
const buildResponseError = (
  error: AxiosError,
  isDevelopment: boolean
): ApiError => {
  const data = error.response?.data as any;
  const common = translations[currentLanguage].common;
  const status = error.response?.status;

  const apiError: ApiError = {
    message: extractErrorMessage(data, common.serverError),
    status,
    code: data?.code,
    details: data?.details,
  };

  if (isDevelopment) {
    console.log("Error message:", data?.error?.message);
  }

  // Messages d'erreur spécifiques selon le code HTTP
  switch (status) {
    case 401:
      handleUnauthorized();
      apiError.message = data?.message || common.sessionExpired;
      break;
    case 403:
      apiError.message = data?.message || common.accessDenied;
      break;
    case 404:
      apiError.message = data?.message || common.resourceNotFound;
      break;
    case 422:
      apiError.message = data?.error?.message || common.invalidData;
      break;
    case 429:
      apiError.message = data?.message || common.tooManyRequests;
      break;
    case 500:
    case 502:
    case 503:
    case 504:
      apiError.message = data?.message || common.serverError;
      break;
  }

  return apiError;
};

/**
 * Construit un ApiError à partir d'une erreur réseau
 */
const buildNetworkError = (): ApiError => {
  const common = translations[currentLanguage].common;
  return {
    message: common.unableToContactServer,
    code: "NETWORK_ERROR",
  };
};

/**
 * Construit un ApiError à partir d'une erreur de configuration
 */
const buildConfigError = (error: AxiosError): ApiError => {
  const common = translations[currentLanguage].common;
  return {
    message: error.message || common.errorPreparingRequest,
  };
};

/**
 * Traite une erreur Axios et la transforme en ApiError
 */
export const handleAxiosError = (
  error: AxiosError,
  isDevelopment = false
): ApiError => {
  let apiError: ApiError;

  if (error.response) {
    // Erreur de réponse HTTP
    apiError = buildResponseError(error, isDevelopment);
  } else if (error.request) {
    // Erreur réseau (pas de réponse reçue)
    apiError = buildNetworkError();
  } else {
    // Erreur de configuration de la requête
    apiError = buildConfigError(error);
  }

  if (isDevelopment) {
    console.error(
      "❌ API Error:",
      error.config?.url,
      apiError.status,
      apiError.message
    );
  }

  return apiError;
};

/**
 * Log une requête en mode développement
 */
export const logRequest = (
  method: string | undefined,
  url: string | undefined,
  isPublic: boolean
): void => {
  console.log(
    "📤 API Request:",
    method?.toUpperCase(),
    url,
    isPublic ? "(public)" : "(⚠️ requires SSR for auth)"
  );
};

/**
 * Log une réponse en mode développement
 */
export const logResponse = (status: number, url: string | undefined): void => {
  console.log("📥 API Response:", status, url);
};

