import { createCookieSessionStorage, createCookie, redirect } from "react-router";

const sessionSecret = import.meta.env.SESSION_SECRET || "default-secret-change-me";

export const sessionStorage = createCookieSessionStorage({
  cookie: {
    name: "__session",
    httpOnly: true,
    path: "/",
    sameSite: "lax",
    secrets: [sessionSecret],
    secure: import.meta.env.PROD,
  },
});

export const languageCookie = createCookie("babana-language", {
  path: "/",
  sameSite: "lax",
  secure: import.meta.env.PROD,
  maxAge: 60 * 60 * 24 * 365, // 1 an
});

export const { getSession, commitSession, destroySession } = sessionStorage;

export async function createUserSession(token: string, redirectTo: string, welcomeMessage?: string) {
  const session = await getSession();
  session.set("token", token);
  if (welcomeMessage) {
    session.flash("welcome", welcomeMessage);
  }
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
    throw redirect("/login");
  }
  return token;
}

export async function logout(request: Request) {
  const session = await getSession(request.headers.get("Cookie"));
  return redirect("/login", {
    headers: {
      "Set-Cookie": await destroySession(session),
    },
  });
}

/**
 * Récupère la langue depuis le cookie ou le header Accept-Language
 */
export async function getLanguage(request: Request): Promise<string> {
  const cookieHeader = request.headers.get("Cookie");
  
  let language: string | null = null;
  if (cookieHeader) {
    const match = cookieHeader.match(/(?:^|;\s*)babana-language=([^;]+)/);
    if (match) {
      language = match[1];
    }
  }
  
  if (language && (language === "fr" || language === "en")) {
    return language;
  }
  
  // Sinon, utiliser le header Accept-Language du navigateur
  const acceptLanguage = request.headers.get("Accept-Language");
  
  if (acceptLanguage) {
    // Si l'anglais est plus prioritaire que le français ou si seul l'anglais est présent
    const enIndex = acceptLanguage.indexOf("en");
    const frIndex = acceptLanguage.indexOf("fr");
    
    if (enIndex !== -1 && (frIndex === -1 || enIndex < frIndex)) {
      return "en";
    }
    if (frIndex !== -1) {
      return "fr";
    }
  }
  
  // Par défaut, français
  return "fr";
}

/**
 * Récupère le header Accept-Language brut ou la langue choisie
 * Utile pour transférer exactement ce que le navigateur demande à l'API backend
 */
export async function getAcceptLanguageHeader(request: Request): Promise<string> {
  const cookieHeader = request.headers.get("Cookie");
  
  // Lire manuellement le cookie (même méthode que getLanguage)
  let language: string | null = null;
  if (cookieHeader) {
    const match = cookieHeader.match(/(?:^|;\s*)babana-language=([^;]+)/);
    if (match) {
      language = match[1];
    }
  }
  
  if (language && (language === "fr" || language === "en")) {
    return language;
  }
  
  return request.headers.get("Accept-Language") || "fr";
}

/**
 * Définit la langue dans un cookie
 */
export async function setLanguage(language: "fr" | "en") {
  return languageCookie.serialize(language);
}
