/**
 * Service pour la gestion des notifications
 * Utilise les routes Remix (SSR) pour assurer l'authentification correcte
 */

import { api, type ApiError } from "./axios";
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
      return await api.get<NotificationsResponse>("/api/notifications", {
        // On vise la route Remix (same-origin) plutôt que le backend direct (API_CONFIG.baseURL)
        baseURL: "",
        params,
      });
    } catch (error) {
      throw error as ApiError;
    }
  },

  /**
   * Récupère le nombre de notifications non lues
   */
  getUnreadCount: async (): Promise<UnreadCountResponse> => {
    try {
      return await api.get<UnreadCountResponse>("/api/notifications/unread-count", {
        baseURL: "",
      });
    } catch (error) {
      throw error as ApiError;
    }
  },

  /**
   * Récupère une notification spécifique
   */
  getNotification: async (id: string): Promise<NotificationResponse> => {
    try {
      return await api.get<NotificationResponse>(`/api/notifications/${id}`, {
        baseURL: "",
      });
    } catch (error) {
      throw error as ApiError;
    }
  },

  /**
   * Marque une notification comme lue
   */
  markAsRead: async (id: string): Promise<NotificationResponse> => {
    try {
      return await api.post<NotificationResponse>(
        `/api/notifications/${id}/mark-as-read`,
        undefined,
        { baseURL: "" }
      );
    } catch (error) {
      throw error as ApiError;
    }
  },

  /**
   * Marque toutes les notifications comme lues
   */
  markAllAsRead: async (): Promise<NotificationActionResponse> => {
    try {
      return await api.post<NotificationActionResponse>(
        "/api/notifications/mark-all-as-read",
        undefined,
        { baseURL: "" }
      );
    } catch (error) {
      throw error as ApiError;
    }
  },

  /**
   * Supprime une notification
   */
  deleteNotification: async (id: string): Promise<NotificationActionResponse> => {
    try {
      return await api.delete<NotificationActionResponse>(`/api/notifications/${id}`, {
        baseURL: "",
      });
    } catch (error) {
      throw error as ApiError;
    }
  },

  /**
   * Supprime toutes les notifications lues
   */
  deleteReadNotifications: async (): Promise<NotificationActionResponse> => {
    try {
      return await api.delete<NotificationActionResponse>("/api/notifications/read", {
        baseURL: "",
      });
    } catch (error) {
      throw error as ApiError;
    }
  },

  /**
   * Récupère les préférences de notifications
   */
  getPreferences: async (): Promise<NotificationPreferencesResponse> => {
    try {
      return await api.get<NotificationPreferencesResponse>("/api/notifications/preferences", {
        baseURL: "",
      });
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
      return await api.put<NotificationPreferencesResponse>(
        "/api/notifications/preferences",
        preferences,
        { baseURL: "" }
      );
    } catch (error) {
      throw error as ApiError;
    }
  },

  /**
   * Réinitialise les préférences de notifications aux valeurs par défaut
   */
  resetPreferences: async (): Promise<NotificationPreferencesResponse> => {
    try {
      return await api.post<NotificationPreferencesResponse>(
        "/api/notifications/preferences/reset",
        undefined,
        { baseURL: "" }
      );
    } catch (error) {
      throw error as ApiError;
    }
  },
};

export default notificationService;

