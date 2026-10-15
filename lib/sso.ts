// lib/sso.ts — configuration et appels partagés avec l'API du SSO (Django)

export const DJANGO_API_URL = (
  process.env.DJANGO_API_URL || "https://qavaa-innovate-sso-zlvwvifuvq-ew.a.run.app"
).replace(/\/$/, "");

export const AUTH_COOKIES = {
  access: "access_token",
  refresh: "refresh_token",
  idToken: "id_token",
  // client_id de l'application OAuth2 du front SSO, requis par /o/token/ pour le refresh
  clientId: "sso_client_id",
} as const;

// Durées alignées avec ACCESS_TOKEN_EXPIRE_SECONDS / REFRESH_TOKEN_EXPIRE_SECONDS du SSO
export const TOKEN_MAX_AGES = {
  ACCESS: 60 * 60 * 24, // 1 jour
  REFRESH: 60 * 60 * 24 * 30, // 30 jours
};

export const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

export type RefreshedTokens = {
  access_token: string;
  refresh_token?: string;
  id_token?: string;
  expires_in?: number;
};

/** Échange un refresh token contre de nouveaux tokens (le refresh token change à chaque appel). */
export async function refreshTokens(
  refreshToken: string,
  clientId: string | undefined
): Promise<RefreshedTokens | null> {
  const body = new URLSearchParams({ grant_type: "refresh_token", refresh_token: refreshToken });
  if (clientId) {
    body.set("client_id", clientId);
  }

  try {
    const response = await fetch(`${DJANGO_API_URL}/o/token/`, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body,
      cache: "no-store",
    });
    if (!response.ok) {
      return null;
    }
    const data = await response.json();
    return data.access_token ? (data as RefreshedTokens) : null;
  } catch {
    return null;
  }
}

// Vérification périodique de la session auprès du SSO : détecte une déconnexion globale
// faite depuis une autre application (les tokens sont alors révoqués côté SSO).
export const SESSION_CHECK_COOKIE = "sso_session_checked";
export const SESSION_CHECK_SECONDS = 60;

/** true : token valide, false : révoqué/expiré, null : SSO injoignable (on ne déconnecte pas). */
export async function isAccessTokenValid(accessToken: string): Promise<boolean | null> {
  try {
    const response = await fetch(`${DJANGO_API_URL}/api/users/me/`, {
      headers: { Authorization: `Bearer ${accessToken}` },
      cache: "no-store",
    });
    if (response.ok) return true;
    if (response.status === 401 || response.status === 403) return false;
    return null;
  } catch {
    return null;
  }
}
