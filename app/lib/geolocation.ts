/**
 * Module de gestion de la géolocalisation
 * Gère la demande et le stockage de la position géographique de l'utilisateur
 */

export interface GeolocationData {
  latitude: number;
  longitude: number;
  accuracy: number;
}

/**
 * Stockage en cache de la géolocalisation
 */
let cachedGeolocation: GeolocationData | null = null;

/**
 * Options par défaut pour la géolocalisation
 */
const GEOLOCATION_OPTIONS: PositionOptions = {
  enableHighAccuracy: false,
  timeout: 5000,
  maximumAge: 300000, // 5 minutes de cache
};

/**
 * Obtient la géolocalisation de l'utilisateur (nécessite son consentement)
 * Cette fonction est optionnelle et ne bloque pas les requêtes
 */
export const requestGeolocation = async (): Promise<GeolocationData | null> => {
  if (typeof window === "undefined" || !navigator.geolocation) {
    return null;
  }

  return new Promise((resolve) => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const geolocation: GeolocationData = {
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
          accuracy: position.coords.accuracy,
        };
        cachedGeolocation = geolocation;
        resolve(geolocation);
      },
      (error) => {
        console.warn("Géolocalisation refusée ou indisponible:", error.message);
        resolve(null);
      },
      GEOLOCATION_OPTIONS
    );
  });
};

/**
 * Récupère la géolocalisation en cache sans faire de nouvelle demande
 */
export const getCachedGeolocation = (): GeolocationData | null => {
  return cachedGeolocation;
};

/**
 * Efface les données de géolocalisation en cache
 */
export const clearGeolocation = (): void => {
  cachedGeolocation = null;
};

/**
 * Vérifie si une géolocalisation est disponible en cache
 */
export const hasGeolocation = (): boolean => {
  return cachedGeolocation !== null;
};

/**
 * Ajoute les données de géolocalisation aux headers d'une requête
 */
export const addGeolocationToHeaders = (
  headers: Record<string, string>
): Record<string, string> => {
  if (!cachedGeolocation) {
    return headers;
  }

  return {
    ...headers,
    "X-Client-Latitude": cachedGeolocation.latitude.toString(),
    "X-Client-Longitude": cachedGeolocation.longitude.toString(),
    "X-Client-Location-Accuracy": cachedGeolocation.accuracy.toString(),
  };
};

