import { Link, useLocation } from "react-router";
import { Home, Users, ClipboardList, User as UserIcon, Menu, Plus, Search, Bell, Settings, LogIn } from "lucide-react";
import { cn } from "~/lib/utils";
import { useTranslation, useAuth } from "~/hooks";
import { hasPermission, isAdmin } from "~/lib/permissions";
import { useState, useEffect } from "react";
import { createPortal } from "react-dom";

interface NavItem {
  href: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  requiresAuth?: boolean;
  badge?: number;
}

export function BottomNav() {
  const location = useLocation();
  const { t, language } = useTranslation();
  const { user, isAuthenticated } = useAuth();
  const [mounted, setMounted] = useState(false);
  const [showQuickActions, setShowQuickActions] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const isActiveHref = (href: string) =>
    location.pathname === href || (href !== "/" && location.pathname.startsWith(href));

  // Navigation items basés sur les permissions
  const navItems: NavItem[] = (() => {
    const items: NavItem[] = [];

    // Home - toujours visible
    items.push({
      href: "/",
      label: t.nav.home,
      icon: Home,
      requiresAuth: false,
    });

    if (isAuthenticated && user) {
      // Recherche clients
      if (hasPermission(user, "view-orders") || hasPermission(user, "create-orders")) {
        items.push({
          href: "/customers/search",
          label: language === "fr" ? "Clients" : "Customers",
          icon: Search,
          requiresAuth: true,
        });
      }

      // Demandes d'activation
      const canCreateRequests = hasPermission(user, "create-requests");
      const canProcessRequests = hasPermission(user, "process-requests") || hasPermission(user, "approve-requests");
      if (canCreateRequests || canProcessRequests) {
        items.push({
          href: "/sales/activation-requests",
          label: language === "fr" ? "Activations" : "Activations",
          icon: ClipboardList,
          requiresAuth: true,
        });
      }

      // Profil
      items.push({
        href: "/profile",
        label: t.pages.profile.title,
        icon: UserIcon,
        requiresAuth: true,
      });
    } else {
      // Non connecté - Login
      items.push({
        href: "/login",
        label: t.actions.login,
        icon: LogIn,
        requiresAuth: false,
      });
    }

    return items;
  })();

  // Actions rapides pour le bouton central
  const quickActions = (() => {
    if (!isAuthenticated || !user) return [];

    const actions: { href: string; label: string; icon: React.ComponentType<{ className?: string }>; color: string }[] = [];

    if (hasPermission(user, "create-orders")) {
      actions.push({
        href: "/customers/create",
        label: language === "fr" ? "Nouveau client" : "New customer",
        icon: Users,
        color: "from-emerald-500 to-teal-500",
      });
    }

    // if (hasPermission(user, "create-requests")) {
    //   actions.push({
    //     href: "/sales/activation-requests/new",
    //     label: language === "fr" ? "Nouvelle activation" : "New activation",
    //     icon: ClipboardList,
    //     color: "from-babana-cyan to-babana-blue",
    //   });
    // }

    if (isAdmin(user)) {
      actions.push({
        href: "/admin",
        label: language === "fr" ? "Administration" : "Administration",
        icon: Settings,
        color: "from-purple-500 to-indigo-500",
      });
    }

    return actions;
  })();

  const hasQuickActions = quickActions.length > 0;

  // Fermer le menu des actions rapides quand on clique ailleurs
  useEffect(() => {
    if (!showQuickActions) return;

    const handleClick = () => setShowQuickActions(false);
    document.addEventListener("click", handleClick);
    return () => document.removeEventListener("click", handleClick);
  }, [showQuickActions]);

  if (!mounted) return null;

  return createPortal(
    <>
      {/* Bottom Navigation Bar */}
      <nav
        className={cn(
          "md:hidden fixed bottom-0 left-0 right-0 z-[100]",
          "bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl",
          "border-t border-gray-200/60 dark:border-gray-700/60",
          "shadow-[0_-8px_30px_rgba(0,0,0,0.12)] dark:shadow-[0_-8px_30px_rgba(0,0,0,0.4)]"
        )}
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      >
        {/* Glow effect top border */}
        <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-babana-cyan/60 to-transparent" />

        <div className="flex items-center justify-around px-1 py-2">
          {navItems.map((item, index) => {
            const isActive = isActiveHref(item.href);
            const Icon = item.icon;

            // Position centrale pour le bouton d'actions rapides
            const isCenterPosition = hasQuickActions && index === Math.floor(navItems.length / 2);

            if (isCenterPosition) {
              return (
                <div key="center-action" className="flex-1 flex items-center justify-center relative">
                  {/* Bouton d'action centrale (FAB style) */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowQuickActions(!showQuickActions);
                    }}
                    className={cn(
                      "absolute -top-6 w-12 h-12 rounded-full",
                      "bg-gradient-to-br from-babana-cyan to-babana-blue",
                      "shadow-lg shadow-babana-cyan/40 dark:shadow-babana-cyan/60",
                      "flex items-center justify-center",
                      "transform transition-all duration-300",
                      "hover:scale-110 active:scale-95",
                      "border-4 border-white dark:border-gray-900",
                      showQuickActions && "rotate-45"
                    )}
                    aria-label={language === "fr" ? "Actions rapides" : "Quick actions"}
                  >
                    <Plus className="w-6 h-6 text-white transition-transform duration-300" />
                  </button>
                </div>
              );
            }

            return (
              <Link
                key={item.href}
                to={item.href}
                className={cn(
                  "flex-1 flex flex-col items-center justify-center py-1 px-0.5 min-w-0",
                  "transition-all duration-200 group relative"
                )}
              >
                {/* Indicateur actif (dot en haut) */}
                {isActive && (
                  <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-babana-cyan" />
                )}

                {/* Icon */}
                <div
                  className={cn(
                    "relative w-6 h-6 flex items-center justify-center mb-0.5",
                    "transition-all duration-200"
                  )}
                >
                  <Icon
                    className={cn(
                      "w-5 h-5 transition-colors duration-200",
                      isActive
                        ? "text-babana-cyan"
                        : "text-gray-400 dark:text-gray-500 group-active:text-babana-cyan"
                    )}
                  />

                  {/* Badge de notification */}
                  {item.badge && item.badge > 0 && (
                    <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {item.badge > 9 ? "9+" : item.badge}
                    </span>
                  )}
                </div>

                {/* Label */}
                <span
                  className={cn(
                    "text-[10px] font-medium truncate max-w-full",
                    "transition-colors duration-200",
                    isActive
                      ? "text-babana-cyan font-semibold"
                      : "text-gray-400 dark:text-gray-500"
                  )}
                >
                  {item.label}
                </span>
              </Link>
            );
          })}
        </div>
      </nav>

      {/* Quick Actions Popup */}
      {showQuickActions && hasQuickActions && (
        <div className="md:hidden fixed inset-0 z-40" onClick={() => setShowQuickActions(false)}>
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200" />

          {/* Actions menu */}
          <div
            className={cn(
              "absolute bottom-24 left-1/2 -translate-x-1/2",
              "flex flex-col gap-3 items-center",
              "animate-in slide-in-from-bottom-4 fade-in duration-300"
            )}
            onClick={(e) => e.stopPropagation()}
          >
            {quickActions.map((action, idx) => {
              const Icon = action.icon;
              return (
                <Link
                  key={action.href}
                  to={action.href}
                  onClick={() => setShowQuickActions(false)}
                  className={cn(
                    "flex items-center gap-3 px-5 py-3 rounded-2xl",
                    "bg-white dark:bg-gray-800 shadow-xl",
                    "border border-gray-200/50 dark:border-gray-700/50",
                    "hover:scale-105 active:scale-95 transition-all duration-200",
                    "animate-in slide-in-from-bottom-2 fade-in"
                  )}
                  style={{ animationDelay: `${idx * 50}ms` }}
                >
                  <div
                    className={cn(
                      "w-10 h-10 rounded-xl flex items-center justify-center",
                      "bg-gradient-to-br shadow-lg",
                      action.color
                    )}
                  >
                    <Icon className="w-5 h-5 text-white" />
                  </div>
                  <span className="text-sm font-semibold text-gray-800 dark:text-gray-200 whitespace-nowrap">
                    {action.label}
                  </span>
                </Link>
              );
            })}
          </div>
        </div>
      )}
    </>,
    document.body
  );
}
