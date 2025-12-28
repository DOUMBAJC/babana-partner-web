import {
  isRouteErrorResponse,
  Links,
  Meta,
  Outlet,
  Scripts,
  ScrollRestoration,
} from "react-router";

import type { Route } from "./+types/root";
import { ThemeProvider, LanguageProvider, AuthProvider, ConsentProvider } from "~/hooks";
import { LanguageSync } from "~/components/LanguageSync";
import { ConsentBanner } from "~/components/ConsentBanner";
import "./app.css";

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

export async function loader({ request }: Route.LoaderArgs) {
  const user = await getCurrentUser(request);
  const language = await getLanguage(request);
  return { user, language };
}

import { useLoaderData } from "react-router";

export function Layout({ children }: { children: React.ReactNode }) {
  // On récupère les données du loader de manière sécurisée
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
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <Meta />
        <Links />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              try {
                const theme = localStorage.getItem('babana-ui-theme') || 'system';
                if (theme === 'dark' || (theme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
                  document.documentElement.classList.add('dark');
                } else {
                  document.documentElement.classList.add('light');
                }
              } catch (e) {}
            `,
          }}
        />
      </head>
      <body className="min-h-screen bg-background font-sans antialiased">
        <LanguageProvider defaultLanguage={language as any} storageKey="babana-language">
          <ThemeProvider defaultTheme="system" storageKey="babana-ui-theme">
            <ConsentProvider>
              <AuthProvider initialUser={user}>
                <LanguageSync />
                {children}
                <ConsentBanner />
              </AuthProvider>
            </ConsentProvider>
          </ThemeProvider>
        </LanguageProvider>
        <ScrollRestoration />
        <Scripts />
      </body>
    </html>
  );
}

export default function App() {
  return <Outlet />;
}

export function ErrorBoundary({ error }: Route.ErrorBoundaryProps) {
  let message = "Oops!";
  let details = "An unexpected error occurred.";
  let stack: string | undefined;

  if (isRouteErrorResponse(error)) {
    message = error.status === 404 ? "404" : "Error";
    details =
      error.status === 404
        ? "The requested page could not be found."
        : error.statusText || details;
  } else if (import.meta.env.DEV && error && error instanceof Error) {
    details = error.message;
    stack = error.stack;
  }

  return (
    <main className="pt-16 p-4 container mx-auto">
      <h1>{message}</h1>
      <p>{details}</p>
      {stack && (
        <pre className="w-full p-4 overflow-x-auto">
          <code>{stack}</code>
        </pre>
      )}
    </main>
  );
}
