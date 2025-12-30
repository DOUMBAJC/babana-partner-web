/**
 * Hook personnalisé pour la gestion des notifications
 */

import { useState, useEffect, useCallback, useRef } from "react";
import { notificationService } from "~/lib/notification.service";
import type {
  Notification,
  NotificationsQueryParams,
} from "~/types/notification.types";

interface UseNotificationsOptions {
  autoRefresh?: boolean;
  refreshInterval?: number; // en millisecondes
  initialParams?: NotificationsQueryParams;
}

interface UseNotificationsReturn {
  notifications: Notification[];
  unreadCount: number;
  isLoading: boolean;
  error: string | null;
  currentPage: number;
  lastPage: number;
  total: number;
  hasMore: boolean;
  fetchNotifications: (params?: NotificationsQueryParams) => Promise<void>;
  markAsRead: (id: string) => Promise<void>;
  markAllAsRead: () => Promise<void>;
  deleteNotification: (id: string) => Promise<void>;
  deleteReadNotifications: () => Promise<void>;
  refreshUnreadCount: () => Promise<void>;
  loadMore: () => Promise<void>;
}

/**
 * Hook pour gérer les notifications
 */
export function useNotifications(
  options: UseNotificationsOptions = {}
): UseNotificationsReturn {
  const {
    autoRefresh = false,
    refreshInterval = 30000, // 30 secondes par défaut
    initialParams = { per_page: 15, page: 1 },
  } = options;

  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(initialParams.page || 1);
  const [lastPage, setLastPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [queryParams, setQueryParams] = useState<NotificationsQueryParams>(initialParams);
  
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  /**
   * Récupère le nombre de notifications non lues
   */
  const refreshUnreadCount = useCallback(async () => {
    try {
      const response = await notificationService.getUnreadCount();
      setUnreadCount(response.data.unread_count);
    } catch (err: any) {
      if (err.status !== 401) {
        console.error("Erreur lors de la récupération du compteur:", err);
      }
    }
  }, []);

  /**
   * Récupère la liste des notifications
   */
  const fetchNotifications = useCallback(
    async (params?: NotificationsQueryParams) => {
      setIsLoading(true);
      setError(null);

      try {
        const finalParams = params || queryParams;
        const response = await notificationService.getNotifications(finalParams);

        setNotifications(response.data.notifications);
        setUnreadCount(response.data.unread_count);
        setCurrentPage(response.data.pagination.current_page);
        setLastPage(response.data.pagination.last_page);
        setTotal(response.data.pagination.total);
        
        if (params) {
          setQueryParams(finalParams);
        }
      } catch (err: any) {
        // Ignorer silencieusement les erreurs 401 pour éviter les déconnexions
        if (err.status !== 401) {
          setError(err.message || "Une erreur est survenue");
          console.error("Erreur lors de la récupération des notifications:", err);
        }
      } finally {
        setIsLoading(false);
      }
    },
    [queryParams]
  );

  /**
   * Charge plus de notifications (pagination)
   */
  const loadMore = useCallback(async () => {
    if (currentPage >= lastPage || isLoading) return;

    const nextPage = currentPage + 1;
    setIsLoading(true);
    setError(null);

    try {
      const params = { ...queryParams, page: nextPage };
      const response = await notificationService.getNotifications(params);

      setNotifications((prev) => [...prev, ...response.data.notifications]);
      setCurrentPage(response.data.pagination.current_page);
      setLastPage(response.data.pagination.last_page);
      setTotal(response.data.pagination.total);
      setQueryParams(params);
    } catch (err: any) {
      setError(err.message || "Une erreur est survenue");
      console.error("Erreur lors du chargement des notifications:", err);
    } finally {
      setIsLoading(false);
    }
  }, [currentPage, lastPage, isLoading, queryParams]);

  /**
   * Marque une notification comme lue
   */
  const markAsRead = useCallback(
    async (id: string) => {
      try {
        await notificationService.markAsRead(id);

        // Met à jour localement
        setNotifications((prev) =>
          prev.map((notif) =>
            notif.id === id
              ? { ...notif, read_at: new Date().toISOString() }
              : notif
          )
        );

        // Met à jour le compteur
        setUnreadCount((prev) => Math.max(0, prev - 1));
      } catch (err: any) {
        console.error("Erreur lors du marquage comme lu:", err);
        throw err;
      }
    },
    []
  );

  /**
   * Marque toutes les notifications comme lues
   */
  const markAllAsRead = useCallback(async () => {
    try {
      await notificationService.markAllAsRead();

      // Met à jour localement
      setNotifications((prev) =>
        prev.map((notif) => ({
          ...notif,
          read_at: notif.read_at || new Date().toISOString(),
        }))
      );

      setUnreadCount(0);
    } catch (err: any) {
      console.error("Erreur lors du marquage de toutes comme lues:", err);
      throw err;
    }
  }, []);

  /**
   * Supprime une notification
   */
  const deleteNotification = useCallback(
    async (id: string) => {
      try {
        await notificationService.deleteNotification(id);

        // Récupère si la notification était non lue
        const wasUnread = notifications.find((n) => n.id === id)?.read_at === null;

        // Met à jour localement
        setNotifications((prev) => prev.filter((notif) => notif.id !== id));

        // Met à jour le compteur si nécessaire
        if (wasUnread) {
          setUnreadCount((prev) => Math.max(0, prev - 1));
        }

        setTotal((prev) => Math.max(0, prev - 1));
      } catch (err: any) {
        console.error("Erreur lors de la suppression:", err);
        throw err;
      }
    },
    [notifications]
  );

  /**
   * Supprime toutes les notifications lues
   */
  const deleteReadNotifications = useCallback(async () => {
    try {
      await notificationService.deleteReadNotifications();

      // Met à jour localement
      setNotifications((prev) => prev.filter((notif) => notif.read_at === null));

      // Recalcule le total
      setTotal((prev) => prev - notifications.filter((n) => n.read_at !== null).length);
    } catch (err: any) {
      console.error("Erreur lors de la suppression des notifications lues:", err);
      throw err;
    }
  }, [notifications]);

  /**
   * Ne pas charger automatiquement les notifications au montage
   * Elles seront chargées à la demande (ouverture du dropdown ou de la page)
   */
  // useEffect(() => {
  //   fetchNotifications();
  // }, []);

  /**
   * Configure le rafraîchissement automatique
   */
  useEffect(() => {
    if (autoRefresh) {
      intervalRef.current = setInterval(() => {
        refreshUnreadCount();
      }, refreshInterval);

      return () => {
        if (intervalRef.current) {
          clearInterval(intervalRef.current);
        }
      };
    }
  }, [autoRefresh, refreshInterval, refreshUnreadCount]);

  return {
    notifications,
    unreadCount,
    isLoading,
    error,
    currentPage,
    lastPage,
    total,
    hasMore: currentPage < lastPage,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteReadNotifications,
    refreshUnreadCount,
    loadMore,
  };
}

export default useNotifications;

