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
 * Vérifie si une erreur serveur indique une déconnexion/session expirée
 * Certains serveurs peuvent renvoyer des erreurs 500/502/503 avec un code ou message
 * indiquant que la session est invalide
 */
export const isSessionExpiredError = (error: AxiosError): boolean => {
  const status = error.response?.status;
  const data = error.response?.data as any;
  
  // Vérifier le code HTTP
  if (status === 401) {
    return true;
  }
  
  // Vérifier si le serveur renvoie un code d'erreur spécifique indiquant une déconnexion
  const errorCode = data?.code || data?.error?.code;
  if (errorCode) {
    const sessionExpiredCodes = [
      'SESSION_EXPIRED',
      'UNAUTHORIZED',
      'AUTHENTICATION_REQUIRED',
      'TOKEN_EXPIRED',
      'INVALID_SESSION',
      'LOGOUT_REQUIRED'
    ];
    if (sessionExpiredCodes.some(code => 
      errorCode.toUpperCase().includes(code) || 
      errorCode.toUpperCase() === code
    )) {
      return true;
    }
  }
  
  // Vérifier le message d'erreur pour des mots-clés indiquant une déconnexion
  const errorMessage = (
    data?.message || 
    data?.error?.message || 
    data?.error || 
    ''
  ).toLowerCase();
  
  const sessionExpiredKeywords = [
    'session expirée',
    'session expired',
    'non authentifié',
    'unauthorized',
    'déconnecté',
    'disconnected',
    'token expiré',
    'token expired',
    'invalid session',
    'session invalide'
  ];
  
  if (sessionExpiredKeywords.some(keyword => errorMessage.includes(keyword))) {
    return true;
  }
  
  return false;
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
 * Priorise les messages détaillés sur les messages génériques
 */
const extractErrorMessage = (data: any, defaultMessage: string): string => {
  // Messages génériques à éviter
  const genericMessages = [
    'Unprocessable Entity',
    'Validation error',
    'Erreur de validation',
    'Bad Request',
    'Internal Server Error',
  ];

  // 1. Vérifier si data.error est une string détaillée (priorité)
  if (data?.error && typeof data.error === 'string' && data.error.trim()) {
    return data.error;
  }

  // 2. Vérifier si data.error.message existe
  if (data?.error?.message && typeof data.error.message === 'string') {
    return data.error.message;
  }

  // 3. Vérifier data.message, mais seulement s'il n'est pas générique
  if (data?.message && typeof data.message === 'string') {
    const message = data.message.trim();
    // Si le message n'est pas générique, l'utiliser
    if (message && !genericMessages.includes(message)) {
      return message;
    }
    // Si le message est générique mais qu'on a data.error (string), l'utiliser
    if (genericMessages.includes(message) && data?.error && typeof data.error === 'string') {
      return data.error;
    }
  }

  // 4. Fallback sur data.error si c'est une string
  if (data?.error && typeof data.error === 'string') {
    return data.error;
  }

  // 5. Message par défaut
  return defaultMessage;
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
  // Utiliser extractErrorMessage pour tous les cas pour gérer data.error correctement
  switch (status) {
    case 401:
      handleUnauthorized();
      apiError.message = extractErrorMessage(data, common.sessionExpired);
      break;
    case 403:
      apiError.message = extractErrorMessage(data, common.accessDenied);
      break;
    case 404:
      apiError.message = extractErrorMessage(data, common.resourceNotFound);
      break;
    case 422:
      // Pour les erreurs 422, prioriser :
      // 1. Premier message de validation (le plus spécifique)
      // 2. Message détaillé depuis extractErrorMessage (qui gère data.error)
      // 3. Message par défaut
      apiError.message =
        getFirstValidationMessage(validationErrors) ||
        extractErrorMessage(data, common.invalidData);
      break;
    case 429:
      apiError.message = extractErrorMessage(data, common.tooManyRequests);
      break;
    case 500:
    case 502:
    case 503:
    case 504:
      apiError.message = extractErrorMessage(data, common.serverError);
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

