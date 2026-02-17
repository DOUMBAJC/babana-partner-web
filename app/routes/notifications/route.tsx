import { useEffect, useState } from "react";
import { Link } from "react-router";
import {
  Bell,
  Check,
  CheckCheck,
  Trash2,
  Settings,
  RefreshCw,
  CheckCircle,
  Loader2,
} from "lucide-react";
import { Button } from "~/components/ui/button";
import { Card, CardContent } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "~/components/ui/select";
import { cn } from "~/lib/utils";
import { useNotifications } from "~/hooks/useNotifications";
import { useLanguage } from "~/hooks/useLanguage";
import { notificationTranslations } from "~/lib/notification-translations";
import { usePageTitle } from "~/hooks/usePageTitle";
import { Layout } from "~/components";
import { getNotificationStyle } from "~/lib/notifications/notification-style";
import type { Notification } from "~/types/notification.types";

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
    return lang === "fr" 
      ? `Il y a ${minutes} ${minutes > 1 ? t.time.minutes : t.time.minute}`
      : `${minutes} ${minutes > 1 ? t.time.minutes : t.time.minute} ago`;
  }
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return lang === "fr"
      ? `Il y a ${hours} ${hours > 1 ? t.time.hours : t.time.hour}`
      : `${hours} ${hours > 1 ? t.time.hours : t.time.hour} ago`;
  }
  const days = Math.floor(diffInSeconds / 86400);
  return lang === "fr"
    ? `Il y a ${days} ${days > 1 ? t.time.days : t.time.day}`
    : `${days} ${days > 1 ? t.time.days : t.time.day} ago`;
};

/**
 * Formate la date complète
 */
const formatFullDate = (dateString: string, lang: "fr" | "en"): string => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat(lang === "fr" ? "fr-FR" : "en-US", {
    day: "numeric",
    month: "long",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(date);
};

/**
 * Composant NotificationCard
 */
interface NotificationCardProps {
  notification: Notification;
  onMarkAsRead: (id: string) => void;
  onDelete: (id: string) => void;
}

function NotificationCard({
  notification,
  onMarkAsRead,
  onDelete,
}: NotificationCardProps) {
  const { language } = useLanguage();
  const t = notificationTranslations[language].notifications;
  const isUnread = !notification.read_at;
  const { icon: Icon, color, bgColor } = getNotificationStyle(notification);

  return (
    <Card
      className={cn(
        "group hover:shadow-md transition-all duration-200",
        isUnread && "border-l-4 border-l-babana-cyan bg-babana-cyan/5 dark:bg-babana-cyan/10"
      )}
    >
      <CardContent className="p-4">
        <div className="flex gap-4">
          {/* Icône */}
          <div className={cn("shrink-0 p-3 rounded-full h-fit", bgColor)}>
            <Icon className={cn("w-6 h-6", color)} />
          </div>

          {/* Contenu */}
          <div className="flex-1 min-w-0">
            <div className="flex items-start justify-between gap-3">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <h3
                    className={cn(
                      "text-base font-semibold",
                      isUnread
                        ? "text-foreground"
                        : "text-muted-foreground"
                    )}
                  >
                    {notification.data.title}
                  </h3>
                  {isUnread && (
                    <Badge
                      variant="default"
                      className="bg-babana-cyan text-white text-xs"
                    >
                      {language === "fr" ? "Nouveau" : "New"}
                    </Badge>
                  )}
                </div>
                <p className="text-sm text-muted-foreground mb-2">
                  {notification.data.message}
                </p>
                <div className="flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                  <span>{formatRelativeTime(notification.created_at, language)}</span>
                  <span className="hidden sm:inline">•</span>
                  <span className="hidden sm:inline">
                    {formatFullDate(notification.created_at, language)}
                  </span>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-col gap-2">
                {isUnread && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => onMarkAsRead(notification.id)}
                    className="whitespace-nowrap"
                  >
                    <Check className="w-4 h-4 mr-1.5" />
                    {language === "fr" ? "Marquer lu" : "Mark as read"}
                  </Button>
                )}
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => onDelete(notification.id)}
                  className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 whitespace-nowrap"
                >
                  <Trash2 className="w-4 h-4 mr-1.5" />
                  {t.actions.delete}
                </Button>
              </div>
            </div>

            {/* Action URL */}
            {notification.data.action_url && (
              <div className="mt-3">
                <Link to={notification.data.action_url}>
                  <Button variant="link" size="sm" className="p-0 h-auto text-babana-cyan">
                    {notification.data.action_label || (language === "fr" ? "Voir les détails" : "View details")} →
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/**
 * Composant principal de la page Notifications
 */
export default function NotificationsPage() {
  const { language } = useLanguage();
  const t = notificationTranslations[language].notifications;
  usePageTitle(t.title);

  const [activeTab, setActiveTab] = useState<"all" | "unread">("all");
  const [perPage, setPerPage] = useState(15);

  const {
    notifications,
    unreadCount,
    isLoading,
    currentPage,
    hasMore,
    total,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    deleteReadNotifications,
    loadMore,
  } = useNotifications({
    autoRefresh: true,
    refreshInterval: 30000,
    initialParams: { per_page: perPage },
  });

  // Filtrer selon l'onglet actif
  const unreadNotifications = notifications.filter((n) => !n.read_at);

  const handleMarkAsRead = async (id: string) => {
    try {
      await markAsRead(id);
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await deleteNotification(id);
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  const handleDeleteRead = async () => {
    try {
      await deleteReadNotifications();
    } catch (error) {
      console.error("Erreur:", error);
    }
  };

  const handleRefresh = () => {
    fetchNotifications({ per_page: perPage, page: 1 });
  };

  const handlePerPageChange = (value: string) => {
    setPerPage(parseInt(value));
    fetchNotifications({ per_page: parseInt(value), page: 1 });
  };

  // Charger les notifications au montage de la page
  useEffect(() => {
    fetchNotifications({ per_page: perPage, page: 1 });
  }, []);

  return (
    <Layout>
      <div className="bg-background">
        <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-xl bg-linear-to-br from-babana-cyan/20 to-babana-blue/20">
                <Bell className="w-8 h-8 text-babana-cyan" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-foreground">
                  {t.title}
                </h1>
                <p className="text-sm text-muted-foreground mt-1">
                  {language === "fr" 
                    ? "Gérez vos notifications et restez informé" 
                    : "Manage your notifications and stay informed"}
                </p>
              </div>
            </div>

            <Link to="/notifications/preferences">
              <Button variant="outline">
                <Settings className="w-4 h-4 mr-2" />
                {t.actions.preferences}
              </Button>
            </Link>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {language === "fr" ? "Total" : "Total"}
                    </p>
                    <p className="text-2xl font-bold text-foreground">
                      {total}
                    </p>
                  </div>
                  <Bell className="w-8 h-8 text-muted-foreground/70" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {language === "fr" ? "Non lues" : "Unread"}
                    </p>
                    <p className="text-2xl font-bold text-babana-cyan">
                      {unreadCount}
                    </p>
                  </div>
                  <div className="p-2 rounded-full bg-babana-cyan/10">
                    <Bell className="w-6 h-6 text-babana-cyan" />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-muted-foreground">
                      {language === "fr" ? "Lues" : "Read"}
                    </p>
                    <p className="text-2xl font-bold text-green-500">
                      {total - unreadCount}
                    </p>
                  </div>
                  <CheckCircle className="w-8 h-8 text-green-500/70" />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Actions et filtres */}
          <Card>
            <CardContent className="p-4">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex flex-wrap items-center gap-2">
                  {unreadCount > 0 && (
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleMarkAllAsRead}
                    >
                      <CheckCheck className="w-4 h-4 mr-2" />
                      {t.actions.markAllAsRead}
                    </Button>
                  )}
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleDeleteRead}
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    {t.actions.deleteRead}
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleRefresh}
                    disabled={isLoading}
                  >
                    <RefreshCw
                      className={cn("w-4 h-4 mr-2", isLoading && "animate-spin")}
                    />
                    {language === "fr" ? "Actualiser" : "Refresh"}
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  <span className="text-sm text-muted-foreground">
                    {language === "fr" ? "Par page :" : "Per page:"}
                  </span>
                  <Select
                    value={perPage.toString()}
                    onValueChange={handlePerPageChange}
                  >
                    <SelectTrigger className="w-20">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="10">10</SelectItem>
                      <SelectItem value="15">15</SelectItem>
                      <SelectItem value="25">25</SelectItem>
                      <SelectItem value="50">50</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Onglets et contenu */}
        <Tabs value={activeTab} onValueChange={(v) => setActiveTab(v as any)}>
          <TabsList className="mb-6">
            <TabsTrigger value="all" onClick={() => setActiveTab("all")}>
              {t.tabs.all} ({notifications.length})
            </TabsTrigger>
            <TabsTrigger value="unread" onClick={() => setActiveTab("unread")}>
              {t.tabs.unread} ({unreadCount})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all">
            {isLoading && currentPage === 1 ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-8 h-8 animate-spin text-babana-cyan" />
              </div>
            ) : notifications.length > 0 ? (
              <div className="space-y-4">
                {notifications.map((notification) => (
                  <NotificationCard
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={handleMarkAsRead}
                    onDelete={handleDelete}
                  />
                ))}

                {/* Load More */}
                {hasMore && (
                  <div className="flex justify-center pt-6">
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={loadMore}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          {language === "fr" ? "Chargement..." : "Loading..."}
                        </>
                      ) : (
                        language === "fr" ? "Charger plus" : "Load more"
                      )}
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <Card>
                <CardContent className="py-16">
                  <div className="flex flex-col items-center justify-center text-center">
                    <Bell className="w-16 h-16 text-muted-foreground/50 mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {t.empty.all}
                    </h3>
                    <p className="text-sm text-muted-foreground max-w-md">
                      {language === "fr"
                        ? "Vous n'avez pas encore de notifications"
                        : "You don't have any notifications yet"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="unread">
            {isLoading && currentPage === 1 ? (
              <div className="flex items-center justify-center py-16">
                <Loader2 className="w-8 h-8 animate-spin text-babana-cyan" />
              </div>
            ) : unreadNotifications.length > 0 ? (
              <div className="space-y-4">
                {unreadNotifications.map((notification) => (
                  <NotificationCard
                    key={notification.id}
                    notification={notification}
                    onMarkAsRead={handleMarkAsRead}
                    onDelete={handleDelete}
                  />
                ))}

                {/* Load More */}
                {hasMore && (
                  <div className="flex justify-center pt-6">
                    <Button
                      variant="outline"
                      size="lg"
                      onClick={loadMore}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <>
                          <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                          {language === "fr" ? "Chargement..." : "Loading..."}
                        </>
                      ) : (
                        language === "fr" ? "Charger plus" : "Load more"
                      )}
                    </Button>
                  </div>
                )}
              </div>
            ) : (
              <Card>
                <CardContent className="py-16">
                  <div className="flex flex-col items-center justify-center text-center">
                    <Bell className="w-16 h-16 text-muted-foreground/50 mb-4" />
                    <h3 className="text-lg font-semibold text-foreground mb-2">
                      {t.empty.unread}
                    </h3>
                    <p className="text-sm text-muted-foreground max-w-md">
                      {language === "fr"
                        ? "Toutes vos notifications sont marquées comme lues"
                        : "All your notifications are marked as read"}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
        </div>
      </div>
    </Layout>
  );
}

