import { useEffect, useMemo, useState } from "react";
import { createPortal } from "react-dom";
import { Link, useLocation } from "react-router";
import { Menu, X, Sparkles, LogIn, LogOut, User as UserIcon, Shield, Sun, Moon, Globe, Wallet } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { useTranslation, useAuth, useTheme } from "~/hooks";
import { cn } from "~/lib/utils";
import { isAdmin } from "~/lib/permissions";
import { ConsentSettings } from "~/components/ConsentSettings";

interface NavLink {
  href: string;
  label: string;
  icon?: React.ComponentType<{ className?: string }>;
  permission?: string;
  requiresAuth?: boolean;
}

interface MobileNavProps {
  links: NavLink[];
}

export function MobileNav({ links }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [mounted, setMounted] = useState(false);
  const location = useLocation();
  const { t, language, setLanguage } = useTranslation();
  const { user, isAuthenticated, logout } = useAuth();
  const { theme, setTheme } = useTheme();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const handleLogout = () => {
    logout();
    closeMenu();
  };

  const getInitials = (name: string) => {
    const safe = (name ?? "").trim();
    if (!safe) return "??";
    return safe
      .split(" ")
      .filter(Boolean)
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  const dedupedLinks = useMemo(() => {
    const byHref = new Map<string, NavLink>();
    for (const l of links) byHref.set(l.href, l);
    return Array.from(byHref.values());
  }, [links]);

  // Eviter le mismatch SSR (portal uniquement côté client)
  useEffect(() => {
    setMounted(true);
  }, []);

  // Lock scroll + escape-to-close quand le drawer est ouvert (meilleure UX mobile)
  useEffect(() => {
    if (!isOpen) return;

    const prevBodyOverflow = document.body.style.overflow;
    const prevHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") closeMenu();
    };
    window.addEventListener("keydown", onKeyDown);

    return () => {
      window.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = prevBodyOverflow;
      document.documentElement.style.overflow = prevHtmlOverflow;
    };
  }, [isOpen]);

  return (
    <div className="md:hidden">
      {/* Bouton Menu Mobile avec design amélioré */}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleMenu}
        aria-label={t.header.menuAriaLabel}
        aria-expanded={isOpen}
        className="relative hover:bg-babana-cyan/10 dark:hover:bg-babana-cyan/20 hover:text-babana-cyan dark:hover:text-babana-cyan transition-all duration-300"
      >
        {isOpen ? (
          <X className="h-6 w-6 transition-transform rotate-90 text-gray-700 dark:text-gray-300" />
        ) : (
          <Menu className="h-6 w-6 transition-transform text-gray-700 dark:text-gray-300" />
        )}
      </Button>

      {/* Menu Mobile Overlay */}
      {mounted && isOpen
        ? createPortal(
            <>
              {/* Backdrop */}
              <div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] transition-all duration-300 animate-in fade-in"
                onClick={closeMenu}
                aria-hidden="true"
              />

              {/* Drawer */}
              <nav
                role="dialog"
                aria-modal="true"
                aria-label={language === "fr" ? "Menu de navigation" : "Navigation menu"}
                className="fixed inset-y-0 right-0 w-full max-w-[420px] h-dvh z-[100] animate-in slide-in-from-right duration-300"
              >
                <div className="h-full bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl border-l border-babana-cyan/25 shadow-2xl shadow-babana-cyan/15 flex flex-col overflow-hidden">
                  {/* Header premium (fixe) */}
                  <div className="relative px-6 pt-6 pb-5 bg-linear-to-br from-babana-cyan via-babana-blue to-babana-navy flex-none">
                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_30%_20%,rgba(255,255,255,0.35),transparent_45%),radial-gradient(circle_at_70%_80%,rgba(255,255,255,0.18),transparent_45%)]" />
                    <div className="relative flex items-start justify-between gap-4">
                      <div className="min-w-0">
                        <div className="text-white/90 text-xs font-semibold tracking-wider uppercase">
                          {language === "fr" ? "Navigation" : "Navigation"}
                        </div>
                        <div className="text-white text-2xl font-black tracking-tight">BABANA</div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={closeMenu}
                        aria-label={t.actions.close}
                        className="h-10 w-10 rounded-xl bg-white/15 hover:bg-white/25 border border-white/25 text-white"
                      >
                        <X className="h-5 w-5" />
                      </Button>
                    </div>

                    {/* Carte utilisateur */}
                    {isAuthenticated && user ? (
                      <div className="relative mt-4 rounded-2xl border border-white/25 bg-white/10 backdrop-blur-sm p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 rounded-2xl bg-white/15 border border-white/25 flex items-center justify-center text-white font-black">
                            {getInitials(user.name)}
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-sm font-bold text-white truncate">{user.name}</div>
                            <div className="text-xs text-white/80 truncate">{user.email}</div>
                            <div className="text-xs text-white/85 font-semibold mt-1 truncate">
                              {(user.roles ?? []).join(", ")}
                            </div>
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="relative mt-4 rounded-2xl border border-white/25 bg-white/10 backdrop-blur-sm p-4">
                        <div className="text-white/90 text-sm font-semibold">
                          {language === "fr" ? "Accès rapide" : "Quick access"}
                        </div>
                        <div className="text-white/75 text-xs mt-1">
                          {language === "fr"
                            ? "Connecte-toi pour accéder à toutes les fonctionnalités."
                            : "Sign in to access all features."}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Contenu scrollable */}
                  <div className="flex-1 overflow-y-auto overflow-x-hidden p-6 space-y-6">
                    {/* Section Paramètres rapides - Mobile Only */}
                    <div className="space-y-3">
                      <div className="text-xs font-black uppercase tracking-wider text-slate-600 dark:text-slate-300 px-2">
                        {language === "fr" ? "Paramètres" : "Settings"}
                      </div>
                      
                      {/* Crédit Display */}
                      {isAuthenticated && user && (user as any).wallet && (() => {
                        const balance = (user as any).wallet?.balance ?? 0;
                        
                        // Configuration basée sur le niveau de crédit
                        const getStatusConfig = (val: number) => {
                          if (val < 10) {
                            return {
                              container: "bg-rose-50/80 dark:bg-rose-950/40 border-rose-300 dark:border-rose-700",
                              icon: "from-rose-500 to-red-600",
                              text: "text-rose-600 dark:text-rose-400",
                              label: "text-rose-500 dark:text-rose-400",
                              animate: "animate-pulse"
                            };
                          }
                          if (val < 20) {
                            return {
                              container: "bg-amber-50/80 dark:bg-amber-950/40 border-amber-300 dark:border-amber-700",
                              icon: "from-amber-500 to-orange-600",
                              text: "text-amber-600 dark:text-amber-400",
                              label: "text-amber-500 dark:text-amber-400",
                              animate: ""
                            };
                          }
                          return {
                            container: "bg-emerald-50/80 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-700",
                            icon: "from-emerald-500 to-teal-600",
                            text: "text-emerald-600 dark:text-emerald-400",
                            label: "text-emerald-500 dark:text-emerald-400",
                            animate: ""
                          };
                        };
                        
                        const config = getStatusConfig(balance);
                        
                        return (
                          <Link
                            to="/credits"
                            onClick={closeMenu}
                            className={cn(
                              "flex items-center justify-between px-4 py-3 rounded-2xl border transition-all duration-200 hover:scale-[1.02] active:scale-95",
                              config.container,
                              config.animate
                            )}
                          >
                            <div className="flex items-center gap-3">
                              <div className={cn(
                                "w-10 h-10 rounded-xl bg-gradient-to-br flex items-center justify-center shadow-md",
                                config.icon
                              )}>
                                <Wallet className="w-5 h-5 text-white" />
                              </div>
                              <div>
                                <div className={cn("text-xs font-medium", config.label)}>
                                  {language === "fr" ? "Mes crédits" : "My credits"}
                                </div>
                                <div className={cn("text-xl font-black", config.text)}>
                                  {balance.toLocaleString()}
                                </div>
                              </div>
                            </div>
                            <div className={cn(
                              "px-2 py-1 rounded-lg text-xs font-bold",
                              balance < 10 ? "bg-rose-200 dark:bg-rose-800 text-rose-700 dark:text-rose-200" :
                              balance < 20 ? "bg-amber-200 dark:bg-amber-800 text-amber-700 dark:text-amber-200" :
                              "bg-emerald-200 dark:bg-emerald-800 text-emerald-700 dark:text-emerald-200"
                            )}>
                              {balance < 10 
                                ? (language === "fr" ? "Faible" : "Low") 
                                : balance < 20 
                                  ? (language === "fr" ? "Moyen" : "Medium")
                                  : (language === "fr" ? "Bon" : "Good")}
                            </div>
                          </Link>
                        );
                      })()}

                      {/* Theme & Language toggles */}
                      <div className="flex gap-2">
                        {/* Theme Toggle */}
                        <button
                          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-card/40 border border-border/50 hover:bg-babana-cyan/10 transition-all duration-200"
                        >
                          {theme === "dark" ? (
                            <Sun className="w-5 h-5 text-amber-500" />
                          ) : (
                            <Moon className="w-5 h-5 text-indigo-500" />
                          )}
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {theme === "dark"
                              ? (language === "fr" ? "Clair" : "Light")
                              : (language === "fr" ? "Sombre" : "Dark")}
                          </span>
                        </button>

                        {/* Language Toggle */}
                        <button
                          onClick={() => {
                            setLanguage(language === "fr" ? "en" : "fr");
                          }}
                          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-2xl bg-card/40 border border-border/50 hover:bg-babana-cyan/10 transition-all duration-200"
                        >
                          <Globe className="w-5 h-5 text-babana-cyan" />
                          <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                            {language === "fr" ? "English" : "Français"}
                          </span>
                        </button>
                      </div>
                    </div>

                    <Separator className="bg-gray-200 dark:bg-gray-800" />
                    {/* Section Compte */}
                    {isAuthenticated && user ? (
                      <div className="space-y-2">
                        <div className="text-xs font-black uppercase tracking-wider text-slate-600 dark:text-slate-300 px-2">
                          {language === "fr" ? "Compte" : "Account"}
                        </div>
                        <Link
                          to="/profile"
                          onClick={closeMenu}
                          className={cn(
                            "relative px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 group flex items-center gap-3",
                            location.pathname.startsWith("/profile")
                              ? "bg-linear-to-r from-babana-cyan/20 to-babana-blue/20 dark:from-babana-cyan/30 dark:to-babana-blue/30 text-babana-cyan shadow-md"
                              : "bg-card/40 border border-border/50 text-gray-800 dark:text-gray-200 hover:bg-babana-cyan/10 dark:hover:bg-babana-cyan/15"
                          )}
                        >
                          <UserIcon className="w-4 h-4 shrink-0" />
                          <span className="flex-1">{t.pages.profile.title}</span>
                        </Link>

                        {isAdmin(user) ? (
                          <Link
                            to="/admin"
                            onClick={closeMenu}
                            className={cn(
                              "relative px-4 py-3 rounded-2xl text-sm font-semibold transition-all duration-300 group flex items-center gap-3",
                              location.pathname.startsWith("/admin")
                                ? "bg-linear-to-r from-babana-cyan/20 to-babana-blue/20 dark:from-babana-cyan/30 dark:to-babana-blue/30 text-babana-cyan shadow-md"
                                : "bg-card/40 border border-border/50 text-gray-800 dark:text-gray-200 hover:bg-babana-cyan/10 dark:hover:bg-babana-cyan/15"
                            )}
                          >
                            <Shield className="w-4 h-4 shrink-0" />
                            <span className="flex-1">{t.nav.admin}</span>
                          </Link>
                        ) : null}
                      </div>
                    ) : null}

                    <Separator className="bg-gray-200 dark:bg-gray-800" />

                    {/* Section Navigation */}
                    <div className="space-y-2">
                      <div className="text-xs font-black uppercase tracking-wider text-slate-600 dark:text-slate-300 px-2">
                        {language === "fr" ? "Pages" : "Pages"}
                      </div>
                      {dedupedLinks.map((link) => {
                        const isActive =
                          location.pathname === link.href ||
                          (link.href !== "/" && location.pathname.startsWith(link.href));
                        const Icon = link.icon;

                        return (
                          <Link
                            key={link.href}
                            to={link.href}
                            onClick={closeMenu}
                            className={cn(
                              "relative px-4 py-3 rounded-2xl text-sm font-semibold",
                              "transition-all duration-300 group",
                              "flex items-center gap-3",
                              isActive
                                ? "bg-linear-to-r from-babana-cyan/20 to-babana-blue/20 dark:from-babana-cyan/30 dark:to-babana-blue/30 text-babana-cyan dark:text-babana-cyan shadow-md"
                                : "bg-card/30 border border-border/40 text-gray-800 dark:text-gray-200 hover:bg-babana-cyan/10 dark:hover:bg-babana-cyan/15 hover:text-babana-cyan dark:hover:text-babana-cyan"
                            )}
                          >
                            {/* Indicateur actif */}
                            {isActive && (
                              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-linear-to-b from-babana-cyan to-babana-blue rounded-r-full" />
                            )}

                            {Icon && <Icon className="w-4 h-4 relative z-10 shrink-0" />}
                            <span className={cn("relative z-10", isActive && "ml-1")}>{link.label}</span>

                            {/* Hover line */}
                            <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-linear-to-r from-transparent via-babana-cyan to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          </Link>
                        );
                      })}
                    </div>
                  </div>

                  {/* Actions (fixées en bas) */}
                  <div className="flex-none p-6 pt-0 space-y-3">
                    {isAuthenticated && user ? (
                      <Button
                        onClick={handleLogout}
                        variant="outline"
                        className="w-full justify-center rounded-2xl border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 transition-all duration-300 group"
                        size="lg"
                      >
                        <LogOut className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                        {t.actions.logout}
                      </Button>
                    ) : (
                      <>
                        <Link to="/login" onClick={closeMenu}>
                          <Button
                            variant="ghost"
                            className="w-full justify-center rounded-2xl text-gray-800 dark:text-gray-200 hover:text-babana-cyan dark:hover:text-babana-cyan hover:bg-babana-cyan/10 dark:hover:bg-babana-cyan/15 transition-all duration-300 group"
                            size="lg"
                          >
                            <LogIn className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                            {t.actions.login}
                          </Button>
                        </Link>

                        <Link to="/register" onClick={closeMenu}>
                          <Button
                            className="w-full justify-center rounded-2xl relative overflow-hidden bg-linear-to-r from-babana-cyan to-babana-blue text-white shadow-lg hover:shadow-xl hover:shadow-babana-cyan/40 dark:hover:shadow-babana-cyan/60 transition-all duration-300 group"
                            size="lg"
                          >
                            <span className="relative z-10 flex items-center gap-2">
                              <Sparkles className="h-4 w-4 group-hover:rotate-12 transition-transform" />
                              {t.actions.signup}
                            </span>
                            <div className="absolute inset-0 bg-linear-to-r from-babana-blue to-babana-cyan opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                          </Button>
                        </Link>
                      </>
                    )}
                  </div>

                  {/* Footer */}
                  <div className="flex-none pb-6 pt-2 flex flex-col items-center gap-2">
                    <ConsentSettings 
                      variant="link" 
                      className="text-xs opacity-70 hover:opacity-100" 
                      onOpen={closeMenu}
                    />
                    <p className="text-xs text-center text-muted-foreground">© 2025 - {new Date().getFullYear()} BABANA Partner</p>
                  </div>
                </div>
              </nav>
            </>,
            document.body
          )
        : null}
    </div>
  );
}


