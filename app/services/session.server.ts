import { createCookieSessionStorage, createCookie, redirect } from "react-router";

// Use a secure secret from env or fallback for dev
const sessionSecret = import.meta.env.SESSION_SECRET || "default-secret-change-me";

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: [sessionSecret],
    secure: import.meta.env.PROD, // Secure only in production
  },
});

// Cookie pour la langue (accessible côté client aussi)
export const languageCookie = createCookie("babana-language", {
  path: "/",
  sameSite: "lax",
  secure: import.meta.env.PROD,
  maxAge: 60 * 60 * 24 * 365, // 1 an
});

export const { getSession, commitSession, destroySession } = sessionStorage;

export async function createUserSession(token: string, redirectTo: string) {
  const session = await getSession();
  session.set("token", token);
  return redirect(redirectTo, {
    headers: {
      "Set-Cookie": await commitSession(session),
    },
  });
}

export async function getUserToken(request: Request) {
  const session = await getSession(request.headers.get("Cookie"));
  return session.get("token");
}

export async function requireUserToken(request: Request) {
  const token = await getUserToken(request);
  if (!token) {
    throw redirect("/auth/login");
  }
  return token;
}

export async function logout(request: Request) {
  const session = await getSession(request.headers.get("Cookie"));
  return redirect("/auth/login", {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
}

/**
 * Récupère la langue depuis le cookie ou le header Accept-Language
 */
export async function getLanguage(request: Request): Promise<string> {
  // D'abord, essayer de lire depuis le cookie
  const cookieHeader = request.headers.get("Cookie");
  const language = await languageCookie.parse(cookieHeader);
  
  if (language && (language === "fr" || language === "en")) {
    return language;
  }
  
  // Sinon, utiliser le header Accept-Language du navigateur
  const acceptLanguage = request.headers.get("Accept-Language");
  if (acceptLanguage) {
    if (acceptLanguage.includes("fr")) return "fr";
    if (acceptLanguage.includes("en")) return "en";
  }
  
  // Par défaut, français
  return "fr";
}

/**
 * Définit la langue dans un cookie
 */
export async function setLanguage(language: "fr" | "en") {
  return languageCookie.serialize(language);
}
