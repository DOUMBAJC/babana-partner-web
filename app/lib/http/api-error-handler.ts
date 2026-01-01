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
 * Lit la langue depuis le cookie babana-language
 */
const getLanguageFromCookie = (): Language => {
  if (typeof document === "undefined") return "fr";
  
  const match = document.cookie.match(/(?:^|;\s*)babana-language=([^;]+)/);
  const language = match ? match[1] : null;
  
  if (language === "en" || language === "fr") {
    return language;
  }
  
  return "fr";
};

/**
 * Langue courante pour les messages d'erreur
 * Initialise avec la langue du cookie si disponible
 */
let currentLanguage: Language = getLanguageFromCookie();

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
 * Gère l'erreur 401 (non authentifié)
 * Note: La redirection doit être gérée par l'application (AuthProvider, loaders, etc.)
 * pour éviter les conflits avec le cycle de rendu de React
 */
const handleUnauthorized = (): void => {
  // Ne plus faire de redirection brutale ici
  // Laisser l'application gérer via les mécanismes React appropriés
  if (typeof window !== "undefined") {
    // On peut logger pour le debug
    console.warn("⚠️ Session expirée - l'utilisateur doit se reconnecter");
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
 * Extrait les erreurs de validation (format Laravel classique: { errors: { field: [msg] } })
 */
const extractValidationErrors = (data: any): Record<string, string[]> | null => {
  const errors =
    data?.errors ||
    data?.error?.errors ||
    data?.data?.errors ||
    null;

  if (!errors || typeof errors !== "object") return null;
  return errors as Record<string, string[]>;
};

/**
 * Récupère le premier message d'erreur de validation disponible
 */
const getFirstValidationMessage = (
  errors: Record<string, string[]> | null
): string | null => {
  if (!errors) return null;
  for (const key of Object.keys(errors)) {
    const value = errors[key];
    if (Array.isArray(value) && value.length > 0 && typeof value[0] === "string") {
      return value[0];
    }
  }
  return null;
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
  const validationErrors = extractValidationErrors(data);

  const apiError: ApiError = {
    message: extractErrorMessage(data, common.serverError),
    status,
    code: data?.code,
    // Laravel renvoie souvent `errors` plutôt que `details`
    details: data?.details ?? validationErrors ?? data?.error?.details,
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
      // Ne pas écraser `data.message` (ex: Laravel "The given data was invalid.")
      // et, si possible, afficher un message plus précis (première erreur de validation)
      apiError.message =
        getFirstValidationMessage(validationErrors) ||
        extractErrorMessage(data, common.invalidData);
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

