import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import { NotFound } from "~/components/errors/NotFound";
import { ServerError } from "~/components/errors/ServerError";
import { ThemeProvider, LanguageProvider, AuthProvider, ConsentProvider } from "~/hooks";
import { LanguageSync } from "~/components/LanguageSync";
import { ConsentBanner } from "~/components/ConsentBanner";
import { ConnectionAlert } from "~/components/ConnectionAlert";
import { Toaster } from "~/components";
import "./app.css";

export function meta({}: Route.MetaArgs) {
  return [
    { charset: "utf-8" },
    { name: "viewport", content: "width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes, viewport-fit=cover" },
    { title: "Babana Partner" },
    { name: "description", content: "Plateforme partenaire BABANA ETS DAIROU" },
    { property: "og:site_name", content: "Babana Partner" },
    { property: "og:type", content: "website" },
    { name: "twitter:card", content: "summary_large_image" },
  ];
}

export const links: Route.LinksFunction = () => [
  { rel: "preconnect", href: "https://fonts.googleapis.com" },
  {
    rel: "preconnect",
    href: "https://fonts.gstatic.com",
    crossOrigin: "anonymous",
  },
  {
    rel: "stylesheet",
    href: "https://fonts.googleapis.com/css2?family=Inter:ital,opsz,wght@0,14..32,100..900;1,14..32,100..900&display=swap",
  },
];
import { getCurrentUser } from "~/services/api.server";
import { getLanguage } from "~/services/session.server";
import { data } from "react-router";

export async function loader({ request }: Route.LoaderArgs) {
  const user = await getCurrentUser(request);
  const language = await getLanguage(request);
  return data({ user, language });
}

import { useLoaderData } from "react-router";

export function Layout({ children }: { children: React.ReactNode }) {

  let data: { user?: any, language?: string } | undefined;
  try {
    data = useLoaderData<typeof loader>() as { user?: any, language?: string };
  } catch {
    data = undefined;
  }
  
  const user = data?.user || null;
  const language = data?.language || "fr";

  return (
    <html lang={language} suppressHydrationWarning>
      <head>
        <Meta />
        <Links />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                // Force viewport meta tag
                let viewport = document.querySelector('meta[name="viewport"]');
                if (!viewport) {
                  viewport = document.createElement('meta');
                  viewport.name = 'viewport';
                  document.head.appendChild(viewport);
                }
                viewport.content = 'width=device-width, initial-scale=1, maximum-scale=5, user-scalable=yes, viewport-fit=cover';
                
                // Theme initialization
                const theme = localStorage.getItem('babana-ui-theme') || 'system';
                if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.add('light');
                }
                
                // Force media query recalculation on resize
                let resizeTimer;
                function forceMediaQueryUpdate() {
                  // Trigger a reflow to force media query recalculation
                  document.body.style.display = 'none';
                  document.body.offsetHeight; // Trigger reflow
                  document.body.style.display = '';
                }
                
                window.addEventListener('resize', function() {
                  clearTimeout(resizeTimer);
                  resizeTimer = setTimeout(forceMediaQueryUpdate, 100);
                });
                
                // Force update on orientation change
                window.addEventListener('orientationchange', function() {
                  setTimeout(forceMediaQueryUpdate, 100);
                });
              } catch (e) {}
            `,
          }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "Organization",
              name: "Babana",
              url: "https://babana-mobile.vercel.app", 
              logo: "https://babana-mobile.vercel.app/app/assets/logo.png"
            }),
          }}
        />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        <LanguageProvider defaultLanguage={language as any} storageKey="babana-language">
          <ThemeProvider defaultTheme="system" storageKey="babana-ui-theme">
            <ConsentProvider>
              <AuthProvider initialUser={user}>
                <LanguageSync />
                <ConnectionAlert />
                {children}
                <ConsentBanner />
                <Toaster />
              </AuthProvider>
            </ConsentProvider>
          </ThemeProvider>
        </LanguageProvider>
        <ScrollRestoration />
        <Scripts />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              // Force media query recalculation after page load
              (function() {
                if (typeof window === 'undefined') return;
                
                function forceMediaQueryRecalc() {
                  // Force browser to recalculate media queries
                  const event = new Event('resize');
                  window.dispatchEvent(event);
                  
                  // Also trigger a reflow
                  document.body.style.display = 'none';
                  void document.body.offsetHeight;
                  document.body.style.display = '';
                }
                
                // Run after DOM is fully loaded
                if (document.readyState === 'complete') {
                  setTimeout(forceMediaQueryRecalc, 0);
                } else {
                  window.addEventListener('load', function() {
                    setTimeout(forceMediaQueryRecalc, 0);
                  });
                }
                
                // Also handle orientation changes
                window.addEventListener('orientationchange', function() {
                  setTimeout(forceMediaQueryRecalc, 100);
                });
              })();
            `,
          }}
        />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let isNotFound = false;
  

  if (isRouteErrorResponse(error)) {
    isNotFound = error.status === 404;
  }

  // Si c'est une 404, on rend le composant NotFound
  // Si c'est une 404, on suppose que c'est géré à l'intérieur du layout si possible,
  // ou on rend une structure complète si ça pète au niveau root.
  // Pour plus de sûreté, on va rendre une structure HTML complète pour l'ErrorBoundary root.

  return (
    <html lang="fr" className="h-full">
      <head>
        <Meta />
        <Links />
      </head>
      <body className="h-full bg-background font-sans antialiased">
        {isNotFound ? (
          <NotFound />
        ) : (
          <ServerError error={error} isDev={import.meta.env.DEV} />
        )}
        <Scripts />
      </body>
    </html>
  );
}
