/**
 * Module qui connecte le système de consentement avec la géolocalisation
 * Assure que la géolocalisation n'est demandée que si l'utilisateur a donné son consentement
 */

import { requestGeolocation as originalRequestGeolocation, type GeolocationData } from './geolocation';

/**
 * Vérifie si l'utilisateur a consenti à la géolocalisation
 */
export const hasGeolocationConsent = (): boolean => {
  if (typeof window === 'undefined') return false;
  
  try {
    const stored = localStorage.getItem('babana-consent-preferences');
    if (!stored) return false;
    
    const consent = JSON.parse(stored);
    return consent.geolocation === true;
  } catch {
    return false;
  }
};

/**
 * Demande la géolocalisation uniquement si l'utilisateur a consenti
 * @returns Les données de géolocalisation ou null
 */
export const requestGeolocationWithConsent = async (): Promise<GeolocationData | null> => {
  // Vérifier le consentement d'abord
  if (!hasGeolocationConsent()) {
    console.info('Géolocalisation non demandée : consentement non accordé');
    return null;
  }

  // Si le consentement est accordé, demander la géolocalisation
  return originalRequestGeolocation();
};

/**
 * Hook pour vérifier et demander la géolocalisation avec consentement
 * À utiliser dans les composants React
 */
export const useGeolocationWithConsent = () => {
  const hasConsent = hasGeolocationConsent();

  const requestLocation = async (): Promise<GeolocationData | null> => {
    if (!hasConsent) {
      console.warn('Tentative d\'accès à la géolocalisation sans consentement');
      return null;
    }
    return originalRequestGeolocation();
  };

  return {
    hasConsent,
    requestLocation,
  };
};

