/**
 * Normalisation + style (icône/couleur) pour les notifications.
 * L'API backend peut renvoyer `notification.type` comme nom de classe Laravel
 * (ex: "App\\Notifications\\ActivationRequestApproved") tandis que le "vrai"
 * statut UI est souvent dans `notification.data.type` et/ou `notification.data.icon`.
 */

import type React from "react";
import {
  AlertCircle,
  AlertTriangle,
  CheckCircle,
  Info,
  Sparkles,
} from "lucide-react";
import type { Notification, NotificationType } from "~/types/notification.types";

export type NotificationStyle = {
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
  /** clé normalisée utilisée pour debug/analytics si besoin */
  key: NotificationType;
};

const isNotificationType = (value: unknown): value is NotificationType => {
  return (
    typeof value === "string" &&
    [
      "activation_request",
      "activation_approved",
      "activation_rejected",
      "password_changed",
      "email_verified",
      "system_update",
      "welcome",
      "info",
      "warning",
      "error",
      "success",
    ].includes(value)
  );
};

/**
 * Déduit une clé UI stable à partir de différentes sources backend.
 * Priorité:
 * 1) `data.icon` (success/error/warning/info)
 * 2) `data.type` (activation_approved, password_changed, ...)
 * 3) `type` (nom de classe Laravel)
 */
export const getNotificationKey = (notification: Notification): NotificationType => {
  const dataIcon = notification.data?.icon;
  if (isNotificationType(dataIcon)) return dataIcon;

  const dataType = notification.data?.type;
  if (isNotificationType(dataType)) return dataType;

  const rawType = notification.type || "";
  const t = String(rawType);

  // Laravel class names
  if (/ActivationRequestApproved/i.test(t)) return "activation_approved";
  if (/ActivationRequestRejected/i.test(t)) return "activation_rejected";
  if (/ActivationRequest/i.test(t)) return "activation_request";
  if (/PasswordChanged/i.test(t)) return "password_changed";
  if (/EmailVerified/i.test(t)) return "email_verified";

  return "info";
};

export const getNotificationStyle = (notification: Notification): NotificationStyle => {
  const key = getNotificationKey(notification);

  switch (key) {
    case "activation_approved":
    case "email_verified":
    case "success":
      return {
        key,
        icon: CheckCircle,
        color: "text-green-500",
        bgColor: "bg-green-100 dark:bg-green-900/30",
      };

    case "activation_rejected":
    case "error":
      return {
        key,
        icon: AlertCircle,
        color: "text-red-500",
        bgColor: "bg-red-100 dark:bg-red-900/30",
      };

    case "password_changed":
    case "warning":
      return {
        key,
        icon: AlertTriangle,
        color: "text-orange-500",
        bgColor: "bg-orange-100 dark:bg-orange-900/30",
      };

    case "activation_request":
      return {
        key,
        icon: Sparkles,
        color: "text-babana-cyan",
        bgColor: "bg-babana-cyan/10 dark:bg-babana-cyan/20",
      };

    case "system_update":
    case "welcome":
    case "info":
    default:
      return {
        key,
        icon: Info,
        color: "text-blue-500",
        bgColor: "bg-blue-100 dark:bg-blue-900/30",
      };
  }
};


