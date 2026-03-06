import { Link, useLocation } from "react-router";
import { Logo } from "~/components/Logo";
import { ThemeToggle } from "~/components/ThemeToggle";
import { LanguageToggle } from "~/components/LanguageToggle";
import { MobileNav } from "~/components/MobileNav";
import { UserMenu } from "~/components/UserMenu";
import { NotificationDropdown } from "~/components/NotificationDropdown";
import { Button } from "~/components/ui/button";
import { useScrolled, useTranslation, useAuth } from "~/hooks";
import { cn } from "~/lib/utils";
import { KeyRound, Sparkles, Home, Users, FileText, ClipboardList, Settings, User as UserIcon, ChevronDown, MapPin } from "lucide-react";
import logoUrl from "~/assets/logo.png";
import { hasPermission, isAdmin, hasRole } from "~/lib/permissions";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "~/components/ui/dropdown-menu";
import { CreditDisplay } from "./CreditDisplay";

interface NavLink {
  href: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  permission?: string;
  requiresAuth?: boolean;
}

export function Header() {
  const location = useLocation();
  const scrolled = useScrolled(20);
  const { t } = useTranslation();
  const { user, isAuthenticated } = useAuth();

  const isActiveHref = (href: string) => location.pathname === href || (href !== "/" && location.pathname.startsWith(href));

  // Liens de navigation adaptés aux permissions (sans doublons)
  const navLinks: NavLink[] = (() => {
    const links: NavLink[] = [{ href: "/", label: t.nav.home, icon: Home, requiresAuth: false }];

    if (!isAuthenticated || !user) return links;

    if (hasPermission(user, "view-orders") || hasPermission(user, "create-orders")) {
      links.push({ href: "/customers/search", label: t.nav.searchCustomer, icon: Users, requiresAuth: true });
    }

    if (hasPermission(user, "create-orders")) {
      links.push({ href: "/customers/create", label: t.nav.newCustomer, icon: FileText, requiresAuth: true });
    }

    const canCreateRequests = hasPermission(user, "create-requests");
    const canProcessRequests = hasPermission(user, "process-requests") || hasPermission(user, "approve-requests");
    if (canCreateRequests || canProcessRequests) {
      links.push({
        href: "/sales/activation-requests",
        label: canProcessRequests ? t.nav.activationRequests : t.nav.simActivation,
        icon: ClipboardList,
        requiresAuth: true,
      });
    }

    if (canProcessRequests) {
      links.push({
        href: "/admin/identifications",
        label: t.nav.identificationManagement,
        icon: FileText,
        requiresAuth: true,
      });
    }

    if (hasPermission(user, "manage-pos") || hasRole(user, 'dsm') || isAdmin(user)) {
      links.push({
        href: "/sales/pos",
        label: t.nav.posManagement,
        icon: MapPin,
        requiresAuth: true,
      });
    }

    return links;
  })();

  const adminLinks: NavLink[] =
    isAuthenticated && user && isAdmin(user)
      ? [
          { href: "/admin", label: t.nav.admin, icon: Settings, requiresAuth: true },
          { href: "/admin/camtel-logins", label: t.nav.camtelLogins, icon: KeyRound, requiresAuth: true },
        ]
      : [];

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b transition-all duration-300",
        scrolled
          ? "bg-white/80 dark:bg-gray-900/80 backdrop-blur-xl shadow-lg shadow-babana-cyan/5 dark:shadow-babana-cyan/10 border-babana-cyan/20 dark:border-babana-cyan/20"
          : "bg-white/70 dark:bg-gray-900/70 backdrop-blur-md border-gray-200/50 dark:border-gray-800/50"
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 overflow-x-hidden">
        <div
          className={cn(
            "flex items-center justify-between transition-all duration-300",
            scrolled ? "h-14" : "h-16"
          )}
        >
          {/* Logo with Glow Effect */}
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center space-x-3 group">
              <div className="relative w-10 h-10 flex items-center justify-center">
                {/* Glow effect on hover */}
                <div className="absolute inset-0 bg-babana-cyan/20 dark:bg-babana-cyan/30 rounded-full blur-md opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <Logo logoUrl={logoUrl} />
              </div>
              <div className="flex flex-col">
                <span className="font-bold text-lg sm:text-xl bg-linear-to-r from-babana-cyan to-babana-navy dark:from-babana-cyan dark:to-white bg-clip-text text-transparent group-hover:from-babana-navy group-hover:to-babana-cyan dark:group-hover:from-white dark:group-hover:to-babana-cyan transition-all duration-300">
                  BABANA
                </span>
                <span className="hidden sm:inline text-[10px] text-muted-foreground font-medium -mt-1">Partner Platform</span>
              </div>
            </Link>
          </div>

          {/* Navigation Desktop */}
          <nav className="hidden md:flex items-center gap-1">
            {navLinks.map((link) => {
              const isActive = isActiveHref(link.href);
              const Icon = link.icon;

              return (
                <Link
                  key={link.href}
                  to={link.href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(
                    "relative px-3 py-2 rounded-xl text-sm font-semibold",
                    "transition-all duration-300 group",
                    "flex items-center gap-2",
                    isActive
                      ? "text-babana-cyan dark:text-babana-cyan"
                      : "text-gray-700 dark:text-gray-300 hover:text-babana-cyan dark:hover:text-babana-cyan"
                  )}
                >
                  {isActive ? (
                    <div className="absolute inset-0 rounded-xl bg-linear-to-r from-babana-cyan/15 via-babana-blue/10 to-transparent dark:from-babana-cyan/20 dark:via-babana-blue/15 dark:to-transparent" />
                  ) : (
                    <div className="absolute inset-0 rounded-xl bg-babana-cyan/5 dark:bg-babana-cyan/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                  )}

                  {Icon && <Icon className="w-4 h-4 relative z-10" />}
                  <span className="relative z-10">{link.label}</span>

                  {isActive && (
                    <div className="absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-1/2 h-0.5 bg-linear-to-r from-transparent via-babana-cyan to-transparent" />
                  )}
                </Link>
              );
            })}

            {adminLinks.length ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    className={cn(
                      "h-10 px-3 rounded-xl font-semibold",
                      "text-gray-700 dark:text-gray-300 hover:text-babana-cyan dark:hover:text-babana-cyan",
                      "hover:bg-babana-cyan/10 dark:hover:bg-babana-cyan/15"
                    )}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    <span>{t.nav.admin}</span>
                    <ChevronDown className="h-4 w-4 ml-2 opacity-70" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  align="start"
                  className="w-72 rounded-2xl p-2 bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl text-slate-900 dark:text-slate-100 border border-babana-cyan/20 shadow-2xl"
                >
                  {adminLinks.map((l, idx) => {
                    const Icon = l.icon;
                    const active = isActiveHref(l.href);
                    return (
                      <DropdownMenuItem
                        key={l.href}
                        asChild
                        className={cn(
                          "cursor-pointer rounded-xl px-3 py-2.5 text-sm font-semibold",
                          "text-slate-700 dark:text-slate-200 focus:bg-babana-cyan/10 focus:text-babana-cyan",
                          active && "bg-babana-cyan/10 text-babana-cyan"
                        )}
                      >
                        <Link to={l.href}>
                          {Icon ? <Icon className="mr-2 h-4 w-4" /> : null}
                          <span className="flex-1">{l.label}</span>
                        </Link>
                      </DropdownMenuItem>
                    );
                  })}
                  <DropdownMenuSeparator className="bg-slate-200/70 dark:bg-slate-700/70" />
                  <DropdownMenuItem
                    asChild
                    className="cursor-pointer rounded-xl px-3 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-200 focus:bg-babana-cyan/10 focus:text-babana-cyan"
                  >
                    <Link to="/profile">
                      <UserIcon className="mr-2 h-4 w-4" />
                      <span className="flex-1">{t.pages.profile.title}</span>
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : null}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            {/* Credit Display - Desktop seulement */}
            <div className="hidden md:block">
              <CreditDisplay />
            </div>
            
            {/* Language Toggle - Desktop seulement */}
            <div className="hidden md:block">
              <LanguageToggle />
            </div>
            
            {/* Theme Toggle - Desktop seulement */}
            <div className="hidden md:block">
              <ThemeToggle />
            </div>

            {/* Notifications - Toujours visible */}
            {isAuthenticated && user && (
              <NotificationDropdown />
            )}

            {/* Profil - accès direct (desktop) */}
            {isAuthenticated && user ? (
              <Link to="/profile" className="hidden md:block">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-9 px-3 rounded-xl text-gray-700 dark:text-gray-300 hover:text-babana-cyan dark:hover:text-babana-cyan hover:bg-babana-cyan/10 dark:hover:bg-babana-cyan/15 transition-all duration-300"
                >
                  <UserIcon className="h-4 w-4 mr-2" />
                  <span className="hidden lg:inline">{t.pages.profile.title}</span>
                </Button>
              </Link>
            ) : null}

            {/* Separator */}
            <div className="hidden md:block w-px h-6 bg-gray-300 dark:bg-gray-700 mx-1" />

            {/* Action Buttons Desktop - Afficher selon l'authentification */}
            <div className="hidden md:flex items-center gap-2">
              {isAuthenticated && user ? (
                // Afficher le menu utilisateur si connecté
                <UserMenu />
              ) : (
                // Afficher les boutons Login/Register si non connecté
                <>
                  <Link to="/login">
                    <Button 
                      variant="ghost" 
                      size="sm"
                      className="text-gray-700 dark:text-gray-300 hover:text-babana-cyan dark:hover:text-babana-cyan hover:bg-babana-cyan/10 dark:hover:bg-babana-cyan/20 transition-all duration-300"
                    >
                      {t.actions.login}
                    </Button>
                  </Link>
                  <Link to="/register">
                    <Button
                      size="sm"
                      className="relative overflow-hidden bg-linear-to-r from-babana-cyan to-babana-blue text-white shadow-md hover:shadow-lg hover:shadow-babana-cyan/30 dark:hover:shadow-babana-cyan/50 transition-all duration-300 group"
                    >
                      <span className="relative z-10 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5" />
                        {t.actions.signup}
                      </span>
                      {/* Hover shine effect */}
                      <div className="absolute inset-0 bg-linear-to-r from-babana-blue to-babana-cyan opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </Button>
                  </Link>
                </>
              )}
            </div>

            {/* Mobile Navigation */}
            <MobileNav links={navLinks} />
          </div>
        </div>
      </div>

      {/* Animated gradient progress bar */}
      <div className="h-0.5 bg-linear-to-r from-transparent via-babana-cyan to-transparent dark:from-transparent dark:via-babana-cyan dark:to-transparent opacity-60 dark:opacity-80" />
    </header>
  );
}


