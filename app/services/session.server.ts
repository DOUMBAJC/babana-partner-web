import { createCookieSessionStorage, redirect } from "react-router";

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
