/**
 * Public API (compat): géolocalisation.
 * Point d'entrée stable `~/lib/geolocation`.
 */

export {
  requestGeolocation,
  clearGeolocation,
  getCachedGeolocation,
  hasGeolocation,
  addGeolocationToHeaders,
} from "./geo/geolocation";

export type { GeolocationData } from "./geo/geolocation";


