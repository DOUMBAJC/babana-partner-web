/**
 * Types pour le système de notifications
 */

/**
 * Type de notification
 */
export type NotificationType = 
  | 'activation_request'
  | 'activation_approved'
  | 'activation_rejected'
  | 'password_changed'
  | 'email_verified'
  | 'system_update'
  | 'welcome'
  | 'info'
  | 'warning'
  | 'error'
  | 'success';

/**
 * Notification de l'utilisateur
 */
export interface Notification {
  id: string;
  /**
   * Type backend: peut être une clé UI (success/error/...) OU un nom de classe Laravel
   * (ex: "App\\Notifications\\ActivationRequestApproved").
   */
  type: string;
  notifiable_type: string;
  notifiable_id: number;
  data: NotificationData;
  read_at: string | null;
  created_at: string;
  updated_at: string;
}

/**
 * Données de notification (peut varier selon le type)
 */
export interface NotificationData {
  title: string;
  message: string;
  /** Type métier côté backend (ex: activation_approved, password_changed, ...) */
  type?: string;
  action_url?: string;
  action_label?: string;
  icon?: string;
  metadata?: Record<string, any>;
}

/**
 * Réponse de la liste des notifications
 */
export interface NotificationsResponse {
  success: boolean;
  message: string;
  data: {
    notifications: Notification[];
    pagination: {
      current_page: number;
      last_page: number;
      per_page: number;
      total: number;
    };
    unread_count: number;
  };
}

/**
 * Réponse du compteur de notifications non lues
 */
export interface UnreadCountResponse {
  success: boolean;
  data: {
    unread_count: number;
  };
}

/**
 * Réponse d'une notification unique
 */
export interface NotificationResponse {
  success: boolean;
  message: string;
  data: Notification;
}

/**
 * Réponse générique de succès
 */
export interface NotificationActionResponse {
  success: boolean;
  message: string;
}

/**
 * Préférences de notifications
 */
export interface NotificationPreferences {
  id: number;
  user_id: number;
  // Email notifications
  email_activation_request: boolean;
  email_activation_approved: boolean;
  email_activation_rejected: boolean;
  email_system_updates: boolean;
  email_welcome: boolean;
  // Database/In-app notifications
  database_activation_request: boolean;
  database_activation_approved: boolean;
  database_activation_rejected: boolean;
  database_system_updates: boolean;
  database_welcome: boolean;
  // Push notifications
  push_activation_request: boolean;
  push_activation_approved: boolean;
  push_activation_rejected: boolean;
  push_system_updates: boolean;
  // Paramètres généraux
  notify_on_weekends: boolean;
  quiet_hours_start: string | null;
  quiet_hours_end: string | null;
  preferred_language: 'fr' | 'en';
  created_at: string;
  updated_at: string;
}

/**
 * Réponse des préférences de notifications
 */
export interface NotificationPreferencesResponse {
  success: boolean;
  message: string;
  data: NotificationPreferences;
}

/**
 * Paramètres pour la mise à jour des préférences
 */
export interface UpdateNotificationPreferencesParams {
  email_activation_request?: boolean;
  email_activation_approved?: boolean;
  email_activation_rejected?: boolean;
  email_system_updates?: boolean;
  email_welcome?: boolean;
  database_activation_request?: boolean;
  database_activation_approved?: boolean;
  database_activation_rejected?: boolean;
  database_system_updates?: boolean;
  database_welcome?: boolean;
  push_activation_request?: boolean;
  push_activation_approved?: boolean;
  push_activation_rejected?: boolean;
  push_system_updates?: boolean;
  notify_on_weekends?: boolean;
  quiet_hours_start?: string | null;
  quiet_hours_end?: string | null;
  preferred_language?: 'fr' | 'en';
}

/**
 * Paramètres de requête pour la liste des notifications
 */
export interface NotificationsQueryParams {
  per_page?: number;
  page?: number;
  unread_only?: boolean;
}

