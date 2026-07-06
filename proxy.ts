import { NextRequest } from "next/server";
import { NextResponse } from "next/server";

const publicRoutes = ["/", "/dashboard"];

export default function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // 1. On récupère le cookie
  const hasToken = request.cookies.has('refresh_token');

  // DÉBOGAGE : Regardez ce message dans votre terminal VS Code / Docker !
  console.log(`📡 [PROXY] Page demandée: "${pathname}" | Jeton trouvé en BDD/Cookie: ${hasToken}`);

  const isPublicRoute = publicRoutes.some((route) =>
    route === "/" ? pathname === "/" : pathname.startsWith(route)
  );

  // CAS 1 : L'utilisateur n'est PAS connecté et tente d'aller sur une page privée
  if (!hasToken && !isPublicRoute) {
    console.log(`🔒 [PROXY] Accès refusé. Redirection vers "/"`);
    const loginUrl = new URL("/", request.url);
    loginUrl.searchParams.set("next", pathname);
    return NextResponse.redirect(loginUrl);
  }

  // CAS 2 : L'utilisateur EST connecté et tente de revenir sur la page de connexion ("/")
  if (hasToken && isPublicRoute) {
    console.log(`🔑 [PROXY] Déjà connecté. Redirection vers "/dashboard"`);
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  console.log(`🟢 [PROXY] Autorisé à charger: "${pathname}"`);
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
