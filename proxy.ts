import { NextRequest, NextResponse } from "next/server";

import { AUTH_COOKIES, COOKIE_OPTIONS, TOKEN_MAX_AGES, refreshTokens } from "@/lib/sso";

const publicRoutes = ["/"];

/**
 * Access token expiré (cookie absent) mais refresh token présent : on rafraîchit la session ici,
 * seul endroit où les nouveaux cookies peuvent être écrits avant le rendu de la page.
 * Retourne une réponse portant les cookies mis à jour, ou null si rien n'a été fait.
 */
async function refreshSessionCookies(request: NextRequest): Promise<NextResponse | null> {
  const refreshToken = request.cookies.get(AUTH_COOKIES.refresh)?.value;
  if (request.cookies.has(AUTH_COOKIES.access) || !refreshToken) {
    return null;
  }

  const tokens = await refreshTokens(refreshToken, request.cookies.get(AUTH_COOKIES.clientId)?.value);

  if (!tokens) {
    // Refresh token révoqué ou expiré : session vidée
    Object.values(AUTH_COOKIES).forEach((name) => request.cookies.delete(name));
    const response = NextResponse.next({ request: { headers: request.headers } });
    Object.values(AUTH_COOKIES).forEach((name) => response.cookies.delete(name));
    return response;
  }

  const updates: [string, string | undefined, number][] = [
    [AUTH_COOKIES.access, tokens.access_token, TOKEN_MAX_AGES.ACCESS],
    [AUTH_COOKIES.refresh, tokens.refresh_token, TOKEN_MAX_AGES.REFRESH],
    [AUTH_COOKIES.idToken, tokens.id_token, TOKEN_MAX_AGES.REFRESH],
  ];
  // Visibles par le rendu de cette requête…
  updates.forEach(([name, value]) => value && request.cookies.set(name, value));
  const response = NextResponse.next({ request: { headers: request.headers } });
  // …et enregistrés dans le navigateur
  updates.forEach(([name, value, maxAge]) => value && response.cookies.set(name, value, { ...COOKIE_OPTIONS, maxAge }));
  return response;
}

export default async function proxy(request: NextRequest) {
  const refreshed = await refreshSessionCookies(request);

  // Redirection qui conserve les cookies éventuellement rafraîchis
  const redirectTo = (url: URL) => {
    const response = NextResponse.redirect(url);
    refreshed?.cookies.getAll().forEach((cookie) => response.cookies.set(cookie));
    return response;
  };

  const { pathname, searchParams } = request.nextUrl;
  const hasToken = request.cookies.has(AUTH_COOKIES.refresh);

  // Paramètres OAuth envoyés par une application cliente
  const hasOAuthParams = searchParams.has("client_id") || searchParams.has("redirect_uri");

  const isPublicRoute = publicRoutes.some((route) =>
    route === "/" ? pathname === "/" : pathname.startsWith(route)
  );

  // CAS 1 : Non connecté sur route privée -> Redirection vers "/"
  if (!hasToken && !isPublicRoute) {
    const loginUrl = new URL("/", request.url);
    loginUrl.searchParams.set("next", pathname);
    return redirectTo(loginUrl);
  }

  // CAS 2 : Déjà connecté sur "/" sans flux OAuth -> Dashboard
  // (avec des paramètres OAuth, la page génère directement le code pour l'app cliente)
  if (hasToken && isPublicRoute && !hasOAuthParams) {
    return redirectTo(new URL("/dashboard", request.url));
  }

  return refreshed ?? NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
