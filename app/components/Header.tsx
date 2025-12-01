import { Link, useLocation } from "react-router";
import { Logo } from "~/components/Logo";
import { ThemeToggle } from "~/components/ThemeToggle";
import { LanguageToggle } from "~/components/LanguageToggle";
import { MobileNav } from "~/components/MobileNav";
import { Button } from "~/components/ui/button";
import { useScrolled } from "~/hooks";
import { cn } from "~/lib/utils";
import logoUrl from "~/assets/logo.png";

interface NavLink {
  href: string;
  label: string;
}

const navLinks: NavLink[] = [
  { href: "/", label: "Accueil" },
  { href: "/dashboard", label: "Tableau de bord" },
  { href: "/partenaires", label: "Partenaires" },
  { href: "/transactions", label: "Transactions" },
  { href: "/aide", label: "Aide" },
];

export function Header() {
  const location = useLocation();
  const scrolled = useScrolled(20);

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b transition-all duration-300",
        scrolled
          ? "bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/90 shadow-md"
          : "bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60"
      )}
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={cn(
            "flex items-center justify-between transition-all duration-300",
            scrolled ? "h-14" : "h-16"
          )}
        >
          {/* Logo */}
          <div className="flex items-center gap-2">
            <Link to="/" className="flex items-center space-x-2 group">
              <div className="w-10 h-10 flex items-center justify-center">
                <Logo logoUrl={logoUrl} />
              </div>
              <span className="font-bold text-xl bg-linear-to-r from-babana-cyan to-babana-navy bg-clip-text text-transparent group-hover:from-babana-navy group-hover:to-babana-cyan transition-all duration-300">
                BABANA
              </span>
            </Link>
          </div>

          {/* Navigation Desktop */}
          <nav className="hidden md:flex items-center space-x-1">
            {navLinks.map((link) => {
              const isActive = location.pathname === link.href;
              return (
                <Link
                  key={link.href}
                  to={link.href}
                  className={cn(
                    "px-4 py-2 rounded-md text-sm font-medium",
                    "transition-all duration-200",
                    isActive
                      ? "bg-babana-cyan/10 text-babana-cyan dark:bg-babana-cyan/20"
                      : "hover:bg-accent hover:text-accent-foreground"
                  )}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            {/* Language Toggle */}
            <LanguageToggle />
            
            {/* Theme Toggle */}
            <ThemeToggle />

            {/* Bouton Action Desktop */}
            <div className="hidden md:flex items-center space-x-2 ml-2">
              <Button variant="ghost" size="sm">
                Connexion
              </Button>
              <Button
                size="sm"
                className="bg-babana-cyan hover:bg-babana-cyan/90 text-white shadow-md hover:shadow-lg transition-all duration-200"
              >
                Inscription
              </Button>
            </div>

            {/* Mobile Navigation */}
            <MobileNav links={navLinks} />
          </div>
        </div>
      </div>

      {/* Barre de progression active */}
      <div className="h-0.5 bg-linear-to-r from-babana-cyan via-babana-navy to-babana-cyan" />
    </header>
  );
}

