import { Link, useLocation } from "react-router";
import { Home, Users, ClipboardList, User as UserIcon, Plus, Search, Settings, LogIn, ListChecks, FileText, KeyRound, UserPlus, Zap } from "lucide-react";
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

      if (hasPermission(user, "view-orders") || hasPermission(user, "create-orders")) {
        items.push({
          href: "/customers/search",
          label: t.nav.searchCustomer,
          icon: Search,
          requiresAuth: true,
        });
      }

      if (hasPermission(user, "create-orders")) {
        items.push({
          href: "/customers/create",
          label: t.nav.newCustomer,
          icon: FileText,
          requiresAuth: true,
        });
      }

      const canCreateRequests = hasPermission(user, "create-requests");
      const canProcessRequests = hasPermission(user, "process-requests") || hasPermission(user, "approve-requests");
      if (canCreateRequests || canProcessRequests) {
        items.push({
          href: "/sales/activation-requests",
          label: canProcessRequests ? t.nav.activationRequests : t.nav.simActivation,
          icon: ClipboardList,
          requiresAuth: true,
        });
      }

      if (isAdmin(user) && items.length < 4) {
        items.push({
          href: "/admin",
          label: t.nav.admin,
          icon: Settings,
          requiresAuth: true,
        });
      }

      items.push({
        href: "/profile",
        label: t.pages.profile.title,
        icon: UserIcon,
        requiresAuth: true,
      });
    } else {
      items.push({
        href: "/login",
        label: t.actions.login,
        icon: LogIn,
        requiresAuth: false,
      });
    }

    return items;
  })();

  const quickActions = (() => {
    if (!isAuthenticated || !user) return [];

    const actions: { href: string; label: string; icon: React.ComponentType<{ className?: string }>; color: string }[] = [];

    if (hasPermission(user, "create-orders")) {
      actions.push({
        href: "/customers/create",
        label: t.nav.newCustomer,
        icon: UserPlus,
        color: "from-emerald-500 to-teal-500",
      });
    }

    if (hasPermission(user, "create-orders")) {
      actions.push({
        href: "/customers/identify",
        label: t.customerIdentify.title,
        icon: Search,
        color: "from-blue-500 to-cyan-500",
      });
    }

    if (hasPermission(user, "create-requests")) {
      actions.push({
        href: "/sales/activation-requests?mine=1",
        label: t.nav.simActivation,
        icon: Zap,
        color: "from-amber-500 to-orange-500",
      });
    }

    // Gérer les demandes - si l'utilisateur peut traiter/approuver
    const canProcessRequests = hasPermission(user, "process-requests") || hasPermission(user, "approve-requests");
    if (canProcessRequests) {
      actions.push({
        href: "/sales/activation-requests",
        label: t.nav.activationRequests,
        icon: ListChecks,
        color: "from-babana-cyan to-babana-blue",
      });
    }

    // Administration - si l'utilisateur est admin
    if (isAdmin(user)) {
      actions.push({
        href: "/admin",
        label: t.nav.admin,
        icon: Settings,
        color: "from-purple-500 to-indigo-500",
      });

      // Logins CAMTEL - si admin
      actions.push({
        href: "/admin/camtel-logins",
        label: t.nav.camtelLogins,
        icon: KeyRound,
        color: "from-slate-600 to-slate-800",
      });
    }

    // Gestion des utilisateurs - si l'utilisateur peut voir les utilisateurs
    if (hasPermission(user, "view-users")) {
      actions.push({
        href: "/admin/users",
        label: language === "fr" ? "Utilisateurs" : "Users",
        icon: Users,
        color: "from-violet-500 to-purple-500",
      });
    }

    // Rapports - si l'utilisateur peut voir les rapports
    if (hasPermission(user, "view-reports")) {
      actions.push({
        href: "/admin/reports",
        label: language === "fr" ? "Rapports" : "Reports",
        icon: FileText,
        color: "from-orange-500 to-red-500",
      });
    }

    return actions;
  })();

  const hasQuickActions = quickActions.length > 0;

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
          "md:hidden fixed bottom-0 left-0 right-0 z-100",
          "bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl",
          "border-t border-gray-200/60 dark:border-gray-700/60",
          "shadow-[0_-8px_30px_rgba(0,0,0,0.12)] dark:shadow-[0_-8px_30px_rgba(0,0,0,0.4)]"
        )}
        style={{ paddingBottom: "env(safe-area-inset-bottom, 0px)" }}
      >
        {/* Glow effect top border */}
        <div className="absolute top-0 left-0 right-0 h-px bg-linear-to-r from-transparent via-babana-cyan/60 to-transparent" />

        <div className="flex items-center justify-around px-1 py-2">
          {navItems.map((item, index) => {
            const isActive = isActiveHref(item.href);
            const Icon = item.icon;

            const isCenterPosition = hasQuickActions && index === Math.floor(navItems.length / 2);

            if (isCenterPosition) {
              return (
                <div key="center-action" className="flex-1 flex items-center justify-center relative">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowQuickActions(!showQuickActions);
                    }}
                    className={cn(
                      "absolute -top-7 w-14 h-14 rounded-full",
                      "bg-linear-to-br from-babana-cyan via-babana-cyan to-babana-blue",
                      "shadow-xl shadow-babana-cyan/50 dark:shadow-babana-cyan/60",
                      "flex items-center justify-center",
                      "transform transition-all duration-300",
                      "hover:scale-110 hover:shadow-2xl hover:shadow-babana-cyan/60",
                      "active:scale-95",
                      "border-4 border-white dark:border-gray-900",
                      showQuickActions && "rotate-45 bg-linear-to-br from-red-500 to-orange-500"
                    )}
                    aria-label={language === "fr" ? "Actions rapides" : "Quick actions"}
                  >
                    <Plus 
                      className={cn(
                        "w-7 h-7 text-white transition-all duration-300",
                        showQuickActions && "rotate-180"
                      )} 
                    />
                    {/* Effet de pulsation */}
                    {showQuickActions && (
                      <div className="absolute inset-0 rounded-full bg-babana-cyan/30 animate-ping" />
                    )}
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
                {isActive && (
                  <div className="absolute -top-0.5 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-babana-cyan" />
                )}

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

                  {item.badge && item.badge > 0 && (
                    <span className="absolute -top-1.5 -right-2 min-w-[16px] h-4 px-1 bg-red-500 text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                      {item.badge > 9 ? "9+" : item.badge}
                    </span>
                  )}
                </div>

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
          <div className="absolute inset-0 bg-black/50 backdrop-blur-md animate-in fade-in duration-300 dark:bg-black/60" />

          <div
            className={cn(
              "absolute bottom-20 left-1/2 -translate-x-1/2 w-[calc(100%-2rem)] max-w-sm",
              "animate-in slide-in-from-bottom-4 fade-in duration-300"
            )}
            onClick={(e) => e.stopPropagation()}
          >
            {/* Container avec fond et ombre */}
            <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl rounded-3xl shadow-2xl border border-gray-200/50 dark:border-gray-700/50 p-4 max-h-[70vh] overflow-y-auto">
              {/* Titre */}
              <div className="mb-4 px-2">
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">
                  {language === "fr" ? "Actions rapides" : "Quick Actions"}
                </h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">
                  {language === "fr" ? "Accès rapide aux fonctionnalités" : "Quick access to features"}
                </p>
              </div>

              {/* Grille d'actions - 2 colonnes */}
              <div className="grid grid-cols-2 gap-2.5">
                {quickActions.map((action, idx) => {
                  const Icon = action.icon;
                  return (
                    <Link
                      key={action.href}
                      to={action.href}
                      onClick={() => setShowQuickActions(false)}
                      className={cn(
                        "group relative flex flex-col items-center justify-center",
                        "px-3 py-4 rounded-2xl",
                        "bg-linear-to-br from-gray-50 to-gray-100/50 dark:from-gray-800/50 dark:to-gray-900/50",
                        "border border-gray-200/60 dark:border-gray-700/60",
                        "hover:border-babana-cyan/40 dark:hover:border-babana-cyan/40",
                        "hover:shadow-lg hover:shadow-babana-cyan/10 dark:hover:shadow-babana-cyan/20",
                        "active:scale-95 transition-all duration-200",
                        "animate-in zoom-in fade-in"
                      )}
                      style={{ animationDelay: `${idx * 30}ms` }}
                    >

                      <div
                        className={cn(
                          "w-12 h-12 rounded-xl flex items-center justify-center mb-2",
                          "bg-linear-to-br shadow-md group-hover:shadow-lg",
                          "group-hover:scale-110 transition-transform duration-200",
                          action.color
                        )}
                      >
                        <Icon className="w-6 h-6 text-white" />
                      </div>
                      
                      <span className="text-xs font-semibold text-center text-gray-700 dark:text-gray-300 group-hover:text-babana-cyan dark:group-hover:text-babana-cyan transition-colors duration-200 leading-tight px-1">
                        {action.label}
                      </span>

                      <div className="absolute inset-0 rounded-2xl bg-linear-to-br from-white/0 via-white/0 to-white/20 dark:from-white/0 dark:via-white/0 dark:to-white/5 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none" />
                    </Link>
                  );
                })}
              </div>

              <button
                onClick={() => setShowQuickActions(false)}
                className={cn(
                  "mt-4 w-full py-2.5 rounded-xl",
                  "bg-gray-100 dark:bg-gray-800",
                  "text-gray-700 dark:text-gray-300",
                  "font-semibold text-sm",
                  "hover:bg-gray-200 dark:hover:bg-gray-700",
                  "active:scale-95 transition-all duration-200"
                )}
              >
                {language === "fr" ? "Fermer" : "Close"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>,
    document.body
  );
}
