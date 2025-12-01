import { Header } from "~/components/Header";

interface LayoutProps {
  children: React.ReactNode;
}

export function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1">{children}</main>
      <footer className="border-t py-6 md:py-8">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-sm text-muted-foreground text-center md:text-left">
              © {new Date().getFullYear()} BABANA ETS DAIROU. Tous droits
              réservés.
            </p>
            <div className="flex items-center gap-4 text-sm text-muted-foreground">
              <a
                href="/confidentialite"
                className="hover:text-foreground transition-colors"
              >
                Confidentialité
              </a>
              <a
                href="/conditions"
                className="hover:text-foreground transition-colors"
              >
                Conditions
              </a>
              <a
                href="/contact"
                className="hover:text-foreground transition-colors"
              >
                Contact
              </a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
