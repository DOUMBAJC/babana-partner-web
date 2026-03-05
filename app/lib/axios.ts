/**
 * Public API (compat): axios client + helpers.
 *
 * Ce fichier existe pour fournir un point d'entrée stable `~/lib/axios`
 * même si l'implémentation est organisée dans `app/lib/http`, `app/lib/geo`, etc.
 */

export { default } from "./http/axios";

export {
  default as axiosInstance,
  api,
  setApiLanguage,
  getApiLanguage,
  setApiToken,
  getClientInfo,
  // Géolocalisation
  requestGeolocation,
  clearGeolocation,
  getCachedGeolocation,
  hasGeolocation,
  // Metadata client
  getClientMetadata,
  generateCustomUserAgent,
  detectOS,
  detectBrowser,
  // Consent + géoloc
  requestGeolocationWithConsent,
  hasGeolocationConsent,
  useGeolocationWithConsent,
} from "./http/axios";

export type { ApiError, GeolocationData, HttpMethod, RequestOptions } from "./http/axios";


