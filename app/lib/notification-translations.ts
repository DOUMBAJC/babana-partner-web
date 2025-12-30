/**
 * Traductions pour le système de notifications
 */

export interface NotificationTranslations {
  title: string;
  tabs: {
    all: string;
    unread: string;
  };
  time: {
    justNow: string;
    minute: string;
    minutes: string;
    hour: string;
    hours: string;
    day: string;
    days: string;
  };
  actions: {
    markAsRead: string;
    markAllAsRead: string;
    delete: string;
    deleteRead: string;
    viewAll: string;
    preferences: string;
  };
  empty: {
    all: string;
    unread: string;
  };
  preferences: {
    title: string;
  };
}

export const notificationTranslations: Record<"fr" | "en", { notifications: NotificationTranslations }> = {
  fr: {
    notifications: {
      title: "Notifications",
      tabs: {
        all: "Toutes",
        unread: "Non lues",
      },
      time: {
        justNow: "À l'instant",
        minute: "minute",
        minutes: "minutes",
        hour: "heure",
        hours: "heures",
        day: "jour",
        days: "jours",
      },
      actions: {
        markAsRead: "Marquer comme lu",
        markAllAsRead: "Tout marquer comme lu",
        delete: "Supprimer",
        deleteRead: "Supprimer lues",
        viewAll: "Voir toutes les notifications",
        preferences: "Préférences",
      },
      empty: {
        all: "Aucune notification",
        unread: "Aucune notification non lue",
      },
      preferences: {
        title: "Préférences de notifications",
      },
    },
  },
  en: {
    notifications: {
      title: "Notifications",
      tabs: {
        all: "All",
        unread: "Unread",
      },
      time: {
        justNow: "Just now",
        minute: "minute",
        minutes: "minutes",
        hour: "hour",
        hours: "hours",
        day: "day",
        days: "days",
      },
      actions: {
        markAsRead: "Mark as read",
        markAllAsRead: "Mark all as read",
        delete: "Delete",
        deleteRead: "Delete read",
        viewAll: "View all notifications",
        preferences: "Preferences",
      },
      empty: {
        all: "No notifications",
        unread: "No unread notifications",
      },
      preferences: {
        title: "Notification preferences",
      },
    },
  },
};

