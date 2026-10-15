// app/api/auth/logout/route.ts — maillon central de la déconnexion globale
//
// Les applications clientes redirigent le navigateur ici :
//   GET /api/auth/logout?post_logout_redirect_uri=<https://app/>&id_token_hint=<id_token>
// 1. on vide la session du front SSO (sinon l'utilisateur serait reconnecté sans mot de passe),
// 2. on enchaîne sur l'API du SSO qui révoque TOUS les tokens de l'utilisateur
//    (toutes applications confondues) puis redirige vers post_logout_redirect_uri.
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

import { AUTH_COOKIES, DJANGO_API_URL, SESSION_CHECK_COOKIE } from "@/lib/sso";

/** Origine publique : derrière Cloud Run, request.url vaut http://0.0.0.0:8080. */
function publicOrigin(request: Request) {
  const host = request.headers.get("x-forwarded-host") || request.headers.get("host");
  const proto = request.headers.get("x-forwarded-proto") || "https";
  return host ? `${proto}://${host}` : new URL(request.url).origin;
}

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const origin = publicOrigin(request);
  const cookieStore = await cookies();

  const idTokenHint = searchParams.get("id_token_hint") || cookieStore.get(AUTH_COOKIES.idToken)?.value;
  // L'API du SSO n'accepte que les URIs des applications déclarées (sinon FRONTEND_URL)
  const postLogoutRedirectUri = searchParams.get("post_logout_redirect_uri") || `${origin}/`;

  const logoutUrl = new URL(`${DJANGO_API_URL}/api/o/logout/`);
  logoutUrl.searchParams.set("post_logout_redirect_uri", postLogoutRedirectUri);
  if (idTokenHint) {
    logoutUrl.searchParams.set("id_token_hint", idTokenHint);
  }

  const response = NextResponse.redirect(logoutUrl.toString());
  [...Object.values(AUTH_COOKIES), SESSION_CHECK_COOKIE].forEach((name) => response.cookies.delete(name));
  return response;
}
