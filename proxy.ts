import { NextRequest, NextResponse } from "next/server";

import {
  AUTH_COOKIES,
  COOKIE_OPTIONS,
  SESSION_CHECK_COOKIE,
  SESSION_CHECK_SECONDS,
  TOKEN_MAX_AGES,
  isAccessTokenValid,
  refreshTokens,
} from "@/lib/sso";

const publicRoutes = ["/"];

/** Modification de cookie : value absente = suppression. */
type CookieUpdate = { name: string; value?: string; maxAge?: number };

/**
 * Met la session à jour avant le rendu de la page :
 * - access token révoqué (déconnexion globale faite ailleurs) ou absent -> refresh ;
 * - refresh impossible -> session vidée.
 * Les modifications sont appliquées à la requête (visibles par le rendu) et retournées
 * pour être écrites dans le navigateur.
 */
async function syncSession(request: NextRequest): Promise<CookieUpdate[]> {
  const updates: CookieUpdate[] = [];
  const setCookie = (name: string, value: string | undefined, maxAge: number) => {
    if (!value) return;
    request.cookies.set(name, value);
    updates.push({ name, value, maxAge });
  };
  const clearSession = () => {
    Object.values(AUTH_COOKIES).forEach((name) => {
      request.cookies.delete(name);
      updates.push({ name });
    });
  };

  let accessToken = request.cookies.get(AUTH_COOKIES.access)?.value;
  const refreshToken = request.cookies.get(AUTH_COOKIES.refresh)?.value;

  if (accessToken && !request.cookies.has(SESSION_CHECK_COOKIE)) {
    const valid = await isAccessTokenValid(accessToken);
    if (valid === false) {
      accessToken = undefined;
    } else if (valid) {
      setCookie(SESSION_CHECK_COOKIE, "1", SESSION_CHECK_SECONDS);
    }
  }

  if (!accessToken) {
    if (!refreshToken) {
      if (request.cookies.has(AUTH_COOKIES.access)) clearSession();
      return updates;
    }
    const tokens = await refreshTokens(refreshToken, request.cookies.get(AUTH_COOKIES.clientId)?.value);
    if (!tokens) {
      clearSession();
      return updates;
    }
    setCookie(AUTH_COOKIES.access, tokens.access_token, TOKEN_MAX_AGES.ACCESS);
    setCookie(AUTH_COOKIES.refresh, tokens.refresh_token, TOKEN_MAX_AGES.REFRESH);
    setCookie(AUTH_COOKIES.idToken, tokens.id_token, TOKEN_MAX_AGES.REFRESH);
    setCookie(SESSION_CHECK_COOKIE, "1", SESSION_CHECK_SECONDS);
  }

  return updates;
}

function withCookies(response: NextResponse, updates: CookieUpdate[]) {
  updates.forEach(({ name, value, maxAge }) =>
    value ? response.cookies.set(name, value, { ...COOKIE_OPTIONS, maxAge }) : response.cookies.delete(name)
  );
  return response;
}

export default async function proxy(request: NextRequest) {
  const updates = await syncSession(request);

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
    return withCookies(NextResponse.redirect(loginUrl), updates);
  }

  // CAS 2 : Déjà connecté sur "/" sans flux OAuth -> Dashboard
  // (avec des paramètres OAuth, la page génère directement le code pour l'app cliente)
  if (hasToken && isPublicRoute && !hasOAuthParams) {
    return withCookies(NextResponse.redirect(new URL("/dashboard", request.url)), updates);
  }

  return withCookies(NextResponse.next({ request: { headers: request.headers } }), updates);
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
