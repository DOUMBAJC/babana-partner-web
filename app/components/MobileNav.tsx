import { useState } from "react";
import { Link, useLocation } from "react-router";
import { Menu, X, Sparkles, LogIn, LogOut } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { useTranslation, useAuth } from "~/hooks";
import { cn } from "~/lib/utils";

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
  const location = useLocation();
  const { t, language } = useTranslation();
  const { user, isAuthenticated, logout } = useAuth();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  const handleLogout = () => {
    logout();
    closeMenu();
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((n) => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

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
      {isOpen && (
        <>
          {/* Backdrop avec meilleur effet */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 transition-all duration-300 animate-in fade-in"
            onClick={closeMenu}
            aria-hidden="true"
          />

          {/* Menu Slide-in avec fond solide et glassmorphism */}
          <nav
            className={cn(
              "fixed top-[65px] right-0 h-[calc(100vh-65px)] w-80 z-50",
              "bg-white/95 dark:bg-gray-900/95 backdrop-blur-xl",
              "border-l-2 border-babana-cyan/30 dark:border-babana-cyan/40",
              "shadow-2xl shadow-babana-cyan/10 dark:shadow-babana-cyan/20",
              "transform transition-all duration-300 ease-out",
              "animate-in slide-in-from-right"
            )}
          >
            <div className="flex flex-col h-full p-6">
              {/* Header du menu avec info utilisateur si connecté */}
              <div className="mb-6">
                {isAuthenticated && user ? (
                  <div className="space-y-3">
                    <h2 className="text-lg font-bold bg-linear-to-r from-babana-cyan to-babana-navy dark:from-babana-cyan dark:to-white bg-clip-text text-transparent">
                      Menu
                    </h2>
                    {/* User info card */}
                    <div className="bg-gradient-to-r from-babana-cyan/10 to-babana-blue/10 dark:from-babana-cyan/20 dark:to-babana-blue/20 rounded-xl p-4 border border-babana-cyan/20">
                      <div className="flex items-center gap-3">
                        <div className="w-12 h-12 rounded-full bg-babana-cyan flex items-center justify-center text-white font-bold text-lg">
                          {getInitials(user.name)}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-foreground truncate">{user.name}</p>
                          <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                          <p className="text-xs text-babana-cyan font-medium mt-0.5">
                            {user.roles.join(', ')}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div>
                    <h2 className="text-lg font-bold bg-linear-to-r from-babana-cyan to-babana-navy dark:from-babana-cyan dark:to-white bg-clip-text text-transparent">
                      Menu
                    </h2>
                    <p className="text-xs text-muted-foreground mt-1">
                      {language === 'fr' ? 'Navigation rapide' : 'Quick navigation'}
                    </p>
                  </div>
                )}
              </div>

              {/* Navigation Links avec design amélioré */}
              <div className="flex flex-col space-y-2 mb-6">
                {links.map((link) => {
                  const isActive = location.pathname === link.href || 
                                  (link.href !== "/" && location.pathname.startsWith(link.href));
                  const Icon = link.icon;
                  
                  return (
                    <Link
                      key={link.href}
                      to={link.href}
                      onClick={closeMenu}
                      className={cn(
                        "relative px-4 py-3 rounded-xl text-sm font-medium",
                        "transition-all duration-300 group",
                        "flex items-center gap-3",
                        isActive
                          ? "bg-linear-to-r from-babana-cyan/20 to-babana-blue/20 dark:from-babana-cyan/30 dark:to-babana-blue/30 text-babana-cyan dark:text-babana-cyan shadow-md"
                          : "text-gray-700 dark:text-gray-300 hover:bg-babana-cyan/10 dark:hover:bg-babana-cyan/20 hover:text-babana-cyan dark:hover:text-babana-cyan"
                      )}
                    >
                      {/* Indicateur actif */}
                      {isActive && (
                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-linear-to-b from-babana-cyan to-babana-blue rounded-r-full" />
                      )}
                      
                      {Icon && <Icon className="w-4 h-4 relative z-10 flex-shrink-0" />}
                      <span className={cn("relative z-10", isActive && "ml-1")}>
                        {link.label}
                      </span>
                      
                      {/* Hover line */}
                      <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-linear-to-r from-transparent via-babana-cyan to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    </Link>
                  );
                })}
              </div>

              <Separator className="my-4 bg-gray-300 dark:bg-gray-700" />

              {/* Actions Mobile avec design moderne */}
              <div className="space-y-3 mt-auto">
                {isAuthenticated && user ? (
                  // Actions pour utilisateur connecté
                  <Button
                    onClick={handleLogout}
                    variant="outline"
                    className="w-full justify-center border-red-300 dark:border-red-700 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-950 transition-all duration-300 group"
                    size="lg"
                  >
                    <LogOut className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                    {t.actions.logout}
                  </Button>
                ) : (
                  // Actions pour utilisateur non connecté
                  <>
                    <Link to="/login" onClick={closeMenu}>
                      <Button 
                        variant="ghost" 
                        className="w-full justify-center text-gray-700 dark:text-gray-300 hover:text-babana-cyan dark:hover:text-babana-cyan hover:bg-babana-cyan/10 dark:hover:bg-babana-cyan/20 transition-all duration-300 group" 
                        size="lg"
                      >
                        <LogIn className="mr-2 h-4 w-4 group-hover:scale-110 transition-transform" />
                        {t.actions.login}
                      </Button>
                    </Link>
                    
                    <Link to="/register" onClick={closeMenu}>
                      <Button
                        className="w-full justify-center relative overflow-hidden bg-linear-to-r from-babana-cyan to-babana-blue text-white shadow-lg hover:shadow-xl hover:shadow-babana-cyan/40 dark:hover:shadow-babana-cyan/60 transition-all duration-300 group"
                        size="lg"
                      >
                        <span className="relative z-10 flex items-center gap-2">
                          <Sparkles className="h-4 w-4 group-hover:rotate-12 transition-transform" />
                          {t.actions.signup}
                        </span>
                        {/* Hover shine effect */}
                        <div className="absolute inset-0 bg-linear-to-r from-babana-blue to-babana-cyan opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                      </Button>
                    </Link>
                  </>
                )}
              </div>

              {/* Footer info */}
              <div className="mt-6 pt-4 border-t border-gray-300 dark:border-gray-700">
                <p className="text-xs text-center text-muted-foreground">
                  © 2025 BABANA Partner
                </p>
              </div>
            </div>
          </nav>
        </>
      )}
    </div>
  );
}


