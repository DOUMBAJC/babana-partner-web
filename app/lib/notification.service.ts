/**
 * Service pour la gestion des notifications
 * Utilise les routes Remix (SSR) pour assurer l'authentification correcte
 */

import type { ApiError } from "./axios";
import type {
  NotificationsResponse,
  UnreadCountResponse,
  NotificationResponse,
  NotificationActionResponse,
  NotificationPreferencesResponse,
  UpdateNotificationPreferencesParams,
  NotificationsQueryParams,
} from "~/types/notification.types";

/**
 * Helper pour construire les paramètres de requête
 */
function buildQueryString(params?: Record<string, any>): string {
  if (!params) return "";
  const searchParams = new URLSearchParams();
  Object.entries(params).forEach(([key, value]) => {
    if (value !== undefined && value !== null) {
      searchParams.append(key, String(value));
    }
  });
  const query = searchParams.toString();
  return query ? `?${query}` : "";
}

/**
 * Helper pour gérer les erreurs des requêtes fetch
 */
async function handleFetchError(response: Response): Promise<never> {
  let errorMessage = "Une erreur est survenue";
  try {
    const data = await response.json();
    errorMessage = data.error || data.message || errorMessage;
  } catch {
    // Si la réponse n'est pas du JSON, utiliser le statusText
    errorMessage = response.statusText || errorMessage;
  }
  
  const error: ApiError = {
    message: errorMessage,
    status: response.status,
    code: `ERROR_${response.status}`,
  };
  
  throw error;
}

/**
 * Service de gestion des notifications
 * Utilise les routes Remix pour passer par le serveur et bénéficier de l'authentification SSR
 */
export const notificationService = {
  /**
   * Récupère la liste des notifications
   */
  getNotifications: async (
    params?: NotificationsQueryParams
  ): Promise<NotificationsResponse> => {
    try {
      const queryString = buildQueryString(params);
      const response = await fetch(`/api/notifications${queryString}`, {
        method: "GET",
        credentials: "include",
      });
      
      if (!response.ok) {
        await handleFetchError(response);
      }
      
      return await response.json();
    } catch (error) {
      throw error as ApiError;
    }
  },

  /**
   * Récupère le nombre de notifications non lues
   */
  getUnreadCount: async (): Promise<UnreadCountResponse> => {
    try {
      const response = await fetch("/api/notifications/unread-count", {
        method: "GET",
        credentials: "include",
      });
      
      if (!response.ok) {
        await handleFetchError(response);
      }
      
      return await response.json();
    } catch (error) {
      throw error as ApiError;
    }
  },

  /**
   * Récupère une notification spécifique
   */
  getNotification: async (id: string): Promise<NotificationResponse> => {
    try {
      const response = await fetch(`/api/notifications/${id}`, {
        method: "GET",
        credentials: "include",
      });
      
      if (!response.ok) {
        await handleFetchError(response);
      }
      
      return await response.json();
    } catch (error) {
      throw error as ApiError;
    }
  },

  /**
   * Marque une notification comme lue
   */
  markAsRead: async (id: string): Promise<NotificationResponse> => {
    try {
      const response = await fetch(`/api/notifications/${id}/mark-as-read`, {
        method: "POST",
        credentials: "include",
      });
      
      if (!response.ok) {
        await handleFetchError(response);
      }
      
      return await response.json();
    } catch (error) {
      throw error as ApiError;
    }
  },

  /**
   * Marque toutes les notifications comme lues
   */
  markAllAsRead: async (): Promise<NotificationActionResponse> => {
    try {
      const response = await fetch("/api/notifications/mark-all-as-read", {
        method: "POST",
        credentials: "include",
      });
      
      if (!response.ok) {
        await handleFetchError(response);
      }
      
      return await response.json();
    } catch (error) {
      throw error as ApiError;
    }
  },

  /**
   * Supprime une notification
   */
  deleteNotification: async (id: string): Promise<NotificationActionResponse> => {
    try {
      const response = await fetch(`/api/notifications/${id}`, {
        method: "DELETE",
        credentials: "include",
      });
      
      if (!response.ok) {
        await handleFetchError(response);
      }
      
      return await response.json();
    } catch (error) {
      throw error as ApiError;
    }
  },

  /**
   * Supprime toutes les notifications lues
   */
  deleteReadNotifications: async (): Promise<NotificationActionResponse> => {
    try {
      const response = await fetch("/api/notifications/read", {
        method: "DELETE",
        credentials: "include",
      });
      
      if (!response.ok) {
        await handleFetchError(response);
      }
      
      return await response.json();
    } catch (error) {
      throw error as ApiError;
    }
  },

  /**
   * Récupère les préférences de notifications
   */
  getPreferences: async (): Promise<NotificationPreferencesResponse> => {
    try {
      const response = await fetch("/api/notifications/preferences", {
        method: "GET",
        credentials: "include",
      });
      
      if (!response.ok) {
        await handleFetchError(response);
      }
      
      return await response.json();
    } catch (error) {
      throw error as ApiError;
    }
  },

  /**
   * Met à jour les préférences de notifications
   */
  updatePreferences: async (
    preferences: UpdateNotificationPreferencesParams
  ): Promise<NotificationPreferencesResponse> => {
    try {
      const response = await fetch("/api/notifications/preferences", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(preferences),
        credentials: "include",
      });
      
      if (!response.ok) {
        await handleFetchError(response);
      }
      
      return await response.json();
    } catch (error) {
      throw error as ApiError;
    }
  },

  /**
   * Réinitialise les préférences de notifications aux valeurs par défaut
   */
  resetPreferences: async (): Promise<NotificationPreferencesResponse> => {
    try {
      const response = await fetch("/api/notifications/preferences/reset", {
        method: "POST",
        credentials: "include",
      });
      
      if (!response.ok) {
        await handleFetchError(response);
      }
      
      return await response.json();
    } catch (error) {
      throw error as ApiError;
    }
  },
};

export default notificationService;

