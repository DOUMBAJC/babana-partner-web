/**
 * Point d'entrée principal pour les modules API
 * Facilite les imports en centralisant les exports
 */

// Export de l'instance axios et des fonctions principales
export {
  default as axiosInstance,
  api,
  setApiLanguage,
  getApiLanguage,
  getClientInfo,
  type ApiError,
  type HttpMethod,
  type RequestOptions,
} from "../axios";

// Export des fonctions de géolocalisation
export {
  requestGeolocation,
  clearGeolocation,
  getCachedGeolocation,
  hasGeolocation,
  type GeolocationData,
} from "../geolocation";

// Export des fonctions de métadonnées client
export {
  getClientMetadata,
  generateCustomUserAgent,
  detectOS,
  detectBrowser,
  addClientMetadataToHeaders,
  type ClientMetadata,
} from "../client-metadata";

// Export des constantes API
export { PUBLIC_ENDPOINTS, isPublicEndpoint, API_CONFIG } from "../api-constants";

// Export des fonctions de gestion d'erreurs
export {
  handleAxiosError,
  setErrorLanguage,
  getErrorLanguage,
} from "../api-error-handler";

