import { useState, useEffect, useCallback } from 'react';

export interface ConnectionStatus {
  isOnline: boolean;
  hasNetworkError: boolean;
  errorMessage?: string;
}

/**
 * Hook pour détecter l'état de connexion réseau
 * Détecte les problèmes de connexion (offline, timeout, erreurs réseau)
 */
export function useConnectionStatus() {
  const [status, setStatus] = useState<ConnectionStatus>({
    isOnline: typeof navigator !== 'undefined' ? navigator.onLine : true,
    hasNetworkError: false,
  });

  // Fonction pour vérifier la connexion
  const checkConnection = useCallback(async () => {
    if (typeof navigator === 'undefined') return;

    const isOnline = navigator.onLine;
    
    // Si offline, on marque directement
    if (!isOnline) {
      setStatus({
        isOnline: false,
        hasNetworkError: true,
        errorMessage: 'offline',
      });
      return;
    }

    // Si online, on vérifie avec une requête légère
    try {
      // Tentative de ping vers un endpoint léger ou un service de vérification
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 3000); // Timeout de 3s
      
      const response = await fetch('/favicon.ico', {
        method: 'HEAD',
        signal: controller.signal,
        cache: 'no-cache',
      });
      
      clearTimeout(timeoutId);
      
      if (response.ok || response.status === 404) {
        // 404 est OK car cela signifie que le serveur répond
        setStatus({
          isOnline: true,
          hasNetworkError: false,
        });
      } else {
        setStatus({
          isOnline: true,
          hasNetworkError: true,
          errorMessage: 'server_error',
        });
      }
    } catch (error) {
      // Erreur réseau (timeout, pas de connexion, etc.)
      setStatus({
        isOnline: navigator.onLine,
        hasNetworkError: true,
        errorMessage: navigator.onLine ? 'timeout' : 'offline',
      });
    }
  }, []);

  // Écouter les événements online/offline
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleOnline = () => {
      checkConnection();
    };

    const handleOffline = () => {
      setStatus({
        isOnline: false,
        hasNetworkError: true,
        errorMessage: 'offline',
      });
    };

    // Écouter les événements du navigateur
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Vérifier la connexion au montage et périodiquement
    checkConnection();
    const interval = setInterval(checkConnection, 30000); // Vérifier toutes les 30s

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
      clearInterval(interval);
    };
  }, [checkConnection]);

  // Écouter les erreurs réseau depuis les intercepteurs axios
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const handleNetworkError = (event: CustomEvent) => {
      const error = event.detail as { code?: string; message?: string };
      setStatus({
        isOnline: navigator.onLine,
        hasNetworkError: true,
        errorMessage: error.code || 'network_error',
      });
    };

    const handleNetworkSuccess = () => {
      if (navigator.onLine) {
        setStatus(prev => ({
          ...prev,
          hasNetworkError: false,
          errorMessage: undefined,
        }));
      }
    };

    window.addEventListener('network:error' as any, handleNetworkError);
    window.addEventListener('network:success' as any, handleNetworkSuccess);

    return () => {
      window.removeEventListener('network:error' as any, handleNetworkError);
      window.removeEventListener('network:success' as any, handleNetworkSuccess);
    };
  }, []);

  return {
    ...status,
    checkConnection,
  };
}

