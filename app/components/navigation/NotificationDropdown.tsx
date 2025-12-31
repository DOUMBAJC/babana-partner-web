/**
 * Composant Dropdown des notifications
 * Interface moderne et attrayante pour gérer les notifications
 */

import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router";
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  Settings,
  X,
  AlertCircle,
  Info,
  CheckCircle,
  AlertTriangle,
  Sparkles,
  ChevronRight,
} from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover";
import { Button } from "~/components/ui/button";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Badge } from "~/components/ui/badge";
import { Separator } from "~/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import { cn } from "~/lib/utils";
import { useNotifications } from "~/hooks/useNotifications";
import { useLanguage } from "~/hooks/useLanguage";
import { notificationTranslations } from "~/lib/notification-translations";
import type { Notification, NotificationType } from "~/types/notification.types";

/**
 * Obtient l'icône et la couleur selon le type de notification
 */
const getNotificationStyle = (type: NotificationType) => {
  switch (type) {
    case "activation_approved":
    case "success":
      return {
        icon: CheckCircle,
        color: "text-green-500",
        bgColor: "bg-green-100 dark:bg-green-900/30",
      };
    case "activation_rejected":
    case "error":
      return {
        icon: AlertCircle,
        color: "text-red-500",
        bgColor: "bg-red-100 dark:bg-red-900/30",
      };
    case "warning":
      return {
        icon: AlertTriangle,
        color: "text-orange-500",
        bgColor: "bg-orange-100 dark:bg-orange-900/30",
      };
    case "activation_request":
      return {
        icon: Sparkles,
        color: "text-babana-cyan",
        bgColor: "bg-babana-cyan/10 dark:bg-babana-cyan/20",
      };
    default:
      return {
        icon: Info,
        color: "text-blue-500",
        bgColor: "bg-blue-100 dark:bg-blue-900/30",
      };
  }
};

/**
 * Formate le temps relatif
 */
const formatRelativeTime = (dateString: string, lang: "fr" | "en"): string => {
  const t = notificationTranslations[lang].notifications;
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) return t.time.justNow;
  if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} ${minutes > 1 ? t.time.minutes : t.time.minute}`;
  }
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} ${hours > 1 ? t.time.hours : t.time.hour}`;
  }
  const days = Math.floor(diffInSeconds / 86400);
  return `${days} ${days > 1 ? t.time.days : t.time.day}`;
};

/**
 * Composant NotificationItem
 */
interface NotificationItemProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
  onClose: () => void;
}

function NotificationItem({
  notification,
  onMarkAsRead,
  onDelete,
  onClose,
}: NotificationItemProps) {
  const { language } = useLanguage();
  const t = notificationTranslations[language].notifications;
  const navigate = useNavigate();
  const isUnread = !notification.read_at;
  const { icon: Icon, color, bgColor } = getNotificationStyle(notification.type);

  const handleClick = () => {
    if (isUnread) {
      onMarkAsRead(notification.id);
    }
    if (notification.data.action_url) {
      navigate(notification.data.action_url);
      onClose();
    }
  };

  return (
    <div
      className={cn(
        "group relative p-4 rounded-xl transition-all duration-200 border outline-none",
        "bg-white dark:bg-gray-900 hover:shadow-md",
        "border-gray-200 dark:border-gray-700",
        "focus-within:ring-2 focus-within:ring-babana-cyan/30 focus-within:ring-offset-2 focus-within:ring-offset-white dark:focus-within:ring-offset-gray-950",
        isUnread &&
          "bg-linear-to-r from-babana-cyan/10 via-babana-cyan/5 to-transparent dark:from-babana-cyan/20 dark:via-babana-cyan/10 border-l-4 border-babana-cyan shadow-sm",
        notification.data.action_url && "cursor-pointer hover:border-babana-cyan/50"
      )}
      onClick={notification.data.action_url ? handleClick : undefined}
    >
      <div className="flex gap-3">
        {/* Icône */}
        <div className={cn("shrink-0 p-2 rounded-full", bgColor)}>
          <Icon className={cn("w-5 h-5", color)} />
        </div>

        {/* Contenu */}
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1">
              <p
                className={cn(
                  "text-sm font-medium",
                  isUnread
                    ? "text-gray-900 dark:text-white"
                    : "text-gray-700 dark:text-gray-300"
                )}
              >
                {notification.data.title}
              </p>
              <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                {notification.data.message}
              </p>
            </div>

            {/* Badge non lu */}
            {isUnread && (
              <div className="shrink-0">
                <div className="w-2 h-2 rounded-full bg-babana-cyan animate-pulse" />
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="flex items-center justify-between mt-2">
            <span className="text-xs text-gray-500 dark:text-gray-500">
              {formatRelativeTime(notification.created_at, language)}
            </span>

            {/* Actions */}
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 transition-opacity">
              {isUnread && (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7"
                  onClick={(e) => {
                    e.stopPropagation();
                    onMarkAsRead(notification.id);
                  }}
                  title={t.actions.markAsRead}
                >
                  <Check className="w-4 h-4" />
                </Button>
              )}
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-red-500 hover:text-red-600 hover:bg-red-100 dark:hover:bg-red-900/30"
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(notification.id);
                }}
                title={t.actions.delete}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/**
 * Composant principal NotificationDropdown
 */
export function NotificationDropdown() {
  const { language } = useLanguage();
  const t = notificationTranslations[language].notifications;
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState<"all" | "unread">("all");

  const {
    notifications,
    unreadCount,
    isLoading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteReadNotifications,
    refreshUnreadCount,
  } = useNotifications({
    autoRefresh: false, // ❌ Désactivé pour éviter les déconnexions automatiques
    refreshInterval: 30000,
    initialParams: { per_page: 10 },
  });

  // Charger les notifications quand le dropdown est ouvert
  useEffect(() => {
    if (open) {
      fetchNotifications();
    }
  }, [open]);

  // Rafraîchir le compteur périodiquement (sans charger toutes les notifications)
  useEffect(() => {
    // Charger le compteur au montage (après un petit délai pour éviter les erreurs au démarrage)
    const initialTimeout = setTimeout(() => {
      refreshUnreadCount();
    }, 1000);

    // Rafraîchir toutes les 60 secondes
    const interval = setInterval(() => {
      refreshUnreadCount();
    }, 60000);

    return () => {
      clearTimeout(initialTimeout);
      clearInterval(interval);
    };
  }, [refreshUnreadCount]);

  // Filtrer selon l'onglet actif
  const displayedNotifications =
    activeTab === "unread"
      ? notifications.filter((n) => !n.read_at)
      : notifications;

  const handleMarkAsRead = async (id: string) => {
    try {
      await markAsRead(id);
    } catch (error) {
      console.error("Erreur lors du marquage comme lu:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
    } catch (error) {
      console.error("Erreur lors du marquage de toutes comme lues:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteNotification(id);
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
    }
  };

  const handleDeleteRead = async () => {
    try {
      await deleteReadNotifications();
    } catch (error) {
      console.error("Erreur lors de la suppression des notifications lues:", error);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="relative hover:bg-babana-cyan/10 dark:hover:bg-babana-cyan/20 transition-all duration-300"
        >
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <>
              {/* Badge de notification */}
              <Badge
                className="absolute -top-1 -right-1 h-5 min-w-[20px] flex items-center justify-center px-1 bg-red-500 text-white text-xs border-2 border-white dark:border-gray-900 animate-in fade-in zoom-in"
                variant="default"
              >
                {unreadCount > 99 ? "99+" : unreadCount}
              </Badge>
              {/* Animation de pulse */}
              <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 rounded-full animate-ping opacity-75" />
            </>
          )}
        </Button>
      </PopoverTrigger>

      <PopoverContent
        className="w-[360px] sm:w-[420px] p-0 shadow-2xl border bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl"
        align="end"
        sideOffset={8}
      >
        {/* Header */}
        <div className="p-4 border-b bg-linear-to-r from-babana-cyan/5 to-transparent dark:from-babana-cyan/10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 bg-babana-cyan/10 rounded-lg">
                <Bell className="w-5 h-5 text-babana-cyan" />
              </div>
              <h3 className="font-semibold text-base text-gray-900 dark:text-white">
                {t.title}
              </h3>
              {unreadCount > 0 && (
                <Badge
                  variant="secondary"
                  className="bg-red-500 text-white font-bold shadow-lg shadow-red-500/30"
                >
                  {unreadCount}
                </Badge>
              )}
            </div>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 hover:bg-gray-100 dark:hover:bg-gray-800"
              onClick={() => setOpen(false)}
              aria-label={language === "fr" ? "Fermer" : "Close"}
            >
              <X className="w-4 h-4" />
            </Button>
          </div>

          {/* Actions rapides */}
          <div className="flex items-center gap-2 mt-3">
            {unreadCount > 0 && (
              <Button
                variant="ghost"
                size="sm"
                className="text-xs h-7 text-babana-cyan hover:text-babana-cyan hover:bg-babana-cyan/10"
                onClick={handleMarkAllAsRead}
              >
                <CheckCheck className="w-3.5 h-3.5 mr-1.5" />
                {t.actions.markAllAsRead}
              </Button>
            )}
            <Button
              variant="ghost"
              size="sm"
              className="text-xs h-7 text-gray-600 dark:text-gray-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20"
              onClick={handleDeleteRead}
            >
              <Trash2 className="w-3.5 h-3.5 mr-1.5" />
              {t.actions.deleteRead}
            </Button>
          </div>
        </div>

        {/* Onglets */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)} className="w-full">
          <div className="px-4 pt-3 pb-2">
            <TabsList className="grid w-full grid-cols-2 bg-muted/40">
              <TabsTrigger value="all" className="text-xs">
                {t.tabs.all} ({notifications.length})
              </TabsTrigger>
              <TabsTrigger value="unread" className="text-xs">
                {t.tabs.unread} ({unreadCount})
              </TabsTrigger>
            </TabsList>
          </div>

          {/* Contenu */}
          <TabsContent value={activeTab} className="m-0">
            <ScrollArea className="h-[380px] sm:h-[400px] bg-gray-50/50 dark:bg-gray-900/50">
              <div className="px-3 pb-3 pt-2">
                {isLoading ? (
                  <div className="flex items-center justify-center h-32">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-babana-cyan" />
                  </div>
                ) : displayedNotifications.length > 0 ? (
                  <div className="space-y-2">
                    {displayedNotifications.map((notification) => (
                      <NotificationItem
                        key={notification.id}
                        notification={notification}
                        onMarkAsRead={handleMarkAsRead}
                        onDelete={handleDelete}
                        onClose={() => setOpen(false)}
                      />
                    ))}
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center h-32 text-center px-4">
                    <Bell className="w-12 h-12 text-gray-300 dark:text-gray-700 mb-2" />
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      {activeTab === "unread"
                        ? t.empty.unread
                        : t.empty.all}
                    </p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>

        {/* Footer */}
        {displayedNotifications.length > 0 && (
          <>
            <Separator className="bg-linear-to-r from-transparent via-gray-300 dark:via-gray-700 to-transparent" />
            <div className="p-3 bg-linear-to-t from-gray-50/50 dark:from-gray-900/50">
              <Link to="/notifications" onClick={() => setOpen(false)}>
                <Button
                  variant="ghost"
                  className="w-full justify-between text-sm text-babana-cyan hover:text-babana-cyan hover:bg-babana-cyan/10 font-medium"
                >
                  <span>{t.actions.viewAll}</span>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
              <Link to="/notifications/preferences" onClick={() => setOpen(false)}>
                <Button
                  variant="ghost"
                  className="w-full justify-between text-sm mt-1 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                >
                  <span className="flex items-center gap-2">
                    <Settings className="w-4 h-4" />
                    {t.actions.preferences}
                  </span>
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </Link>
            </div>
          </>
        )}
      </PopoverContent>
    </Popover>
  );
}

export default NotificationDropdown;

