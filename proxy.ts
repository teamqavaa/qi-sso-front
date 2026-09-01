import { NextRequest, NextResponse } from "next/server";

const publicRoutes = ["/"];

export default function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;

  const hasToken = request.cookies.has('refresh_token');

  // 🚨 DÉTECTION DES PARAMÈTRES OAUTH ENVOYÉS PAR L'APP A
  const hasOAuthParams = searchParams.has("client_id") || searchParams.has("redirect_uri");

  const isPublicRoute = publicRoutes.some((route) =>
    route === "/" ? pathname === "/" : pathname.startsWith(route)
  );

  // CAS 1 : Non connecté sur route privée -> Redirection vers "/"
  if (!hasToken && !isPublicRoute) {
    const loginUrl = new URL("/", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // CAS 2 : Déjà connecté
  if (hasToken && isPublicRoute) {
    // 🚨 SI LA REQUÊTE CONTIENT OAUTH : Ne PAS rediriger vers /dashboard !
    if (hasOAuthParams) {
      return NextResponse.next();
    }

    // Connexion normale sans OAuth -> Aller au Dashboard
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
