import { useState } from "react";
import { Link, useLocation } from "react-router";
import { Menu, X } from "lucide-react";
import { Button } from "~/components/ui/button";
import { Separator } from "~/components/ui/separator";
import { cn } from "~/lib/utils";

interface NavLink {
  href: string;
  label: string;
}

interface MobileNavProps {
  links: NavLink[];
}

export function MobileNav({ links }: MobileNavProps) {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <div className="md:hidden">
      {/* Bouton Menu Mobile */}
      <Button
        variant="ghost"
        size="icon"
        onClick={toggleMenu}
        aria-label="Menu de navigation"
        aria-expanded={isOpen}
        className="relative"
      >
        {isOpen ? (
          <X className="h-6 w-6 transition-transform rotate-90" />
        ) : (
          <Menu className="h-6 w-6 transition-transform" />
        )}
      </Button>

      {/* Menu Mobile Overlay */}
      {isOpen && (
        <>
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/50 z-40 transition-opacity animate-in fade-in duration-200"
            onClick={closeMenu}
            aria-hidden="true"
          />

          {/* Menu Slide-in */}
          <nav
            className={cn(
              "fixed top-[65px] right-0 h-[calc(100vh-65px)] w-72 bg-background border-l z-50",
              "transform transition-transform duration-300 ease-in-out",
              "shadow-xl animate-in slide-in-from-right"
            )}
          >
            <div className="flex flex-col h-full p-4">
              {/* Navigation Links */}
              <div className="flex flex-col space-y-1 mb-6">
                {links.map((link) => {
                  const isActive = location.pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      to={link.href}
                      onClick={closeMenu}
                      className={cn(
                        "px-4 py-3 rounded-md text-sm font-medium",
                        "transition-all duration-200",
                        isActive
                          ? "bg-babana-cyan/10 text-babana-cyan dark:bg-babana-cyan/20 shadow-sm"
                          : "hover:bg-accent hover:text-accent-foreground"
                      )}
                    >
                      {link.label}
                    </Link>
                  );
                })}
              </div>

              <Separator className="my-4" />

              {/* Actions Mobile */}
              <div className="space-y-2 mt-auto">
                <Button variant="outline" className="w-full" size="sm">
                  Connexion
                </Button>
                <Button
                  className="w-full bg-babana-cyan hover:bg-babana-cyan/90 text-white shadow-md"
                  size="sm"
                >
                  Inscription
                </Button>
              </div>
            </div>
          </nav>
        </>
      )}
    </div>
  );
}

