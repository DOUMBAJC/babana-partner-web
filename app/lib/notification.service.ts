/**
 * Service pour la gestion des notifications
 */

import { api } from "./axios";
import type {
  Notification,
  NotificationsResponse,
  UnreadCountResponse,
  NotificationResponse,
  NotificationActionResponse,
  NotificationPreferences,
  NotificationPreferencesResponse,
  UpdateNotificationPreferencesParams,
  NotificationsQueryParams,
} from "~/types/notification.types";

/**
 * Service de gestion des notifications
 */
export const notificationService = {
  /**
   * Récupère la liste des notifications
   */
  getNotifications: async (
    params?: NotificationsQueryParams
  ): Promise<NotificationsResponse> => {
    return api.get("/notifications", { params });
  },

  /**
   * Récupère le nombre de notifications non lues
   */
  getUnreadCount: async (): Promise<UnreadCountResponse> => {
    return api.get("/notifications/unread-count");
  },

  /**
   * Récupère une notification spécifique
   */
  getNotification: async (id: string): Promise<NotificationResponse> => {
    return api.get(`/notifications/${id}`);
  },

  /**
   * Marque une notification comme lue
   */
  markAsRead: async (id: string): Promise<NotificationResponse> => {
    return api.post(`/notifications/${id}/mark-as-read`);
  },

  /**
   * Marque toutes les notifications comme lues
   */
  markAllAsRead: async (): Promise<NotificationActionResponse> => {
    return api.post("/notifications/mark-all-as-read");
  },

  /**
   * Supprime une notification
   */
  deleteNotification: async (id: string): Promise<NotificationActionResponse> => {
    return api.delete(`/notifications/${id}`);
  },

  /**
   * Supprime toutes les notifications lues
   */
  deleteReadNotifications: async (): Promise<NotificationActionResponse> => {
    return api.delete("/notifications/read");
  },

  /**
   * Récupère les préférences de notifications
   */
  getPreferences: async (): Promise<NotificationPreferencesResponse> => {
    return api.get("/notifications/preferences");
  },

  /**
   * Met à jour les préférences de notifications
   */
  updatePreferences: async (
    preferences: UpdateNotificationPreferencesParams
  ): Promise<NotificationPreferencesResponse> => {
    return api.put("/notifications/preferences", preferences);
  },

  /**
   * Réinitialise les préférences de notifications aux valeurs par défaut
   */
  resetPreferences: async (): Promise<NotificationPreferencesResponse> => {
    return api.post("/notifications/preferences/reset");
  },
};

export default notificationService;

