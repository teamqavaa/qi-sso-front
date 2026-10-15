"use server";

import { cookies } from "next/headers";

import {
  AUTH_COOKIES,
  COOKIE_OPTIONS,
  DJANGO_API_URL,
  TOKEN_MAX_AGES,
  refreshTokens,
} from "@/lib/sso";

export type AuthActionResult =
  | { success: true; error?: never; redirectTo?: never }
  | { redirectTo: string; success?: never; error?: never }
  | { error: string; success?: never; redirectTo?: never };

/** Réponse de POST /api/auth/login/ et /api/auth/google/ */
type SSOLoginResponse = {
  access: string;
  refresh?: string;
  id_token?: string;
  client_id?: string;
  expires_in?: number;
};

/** Paramètres OAuth2 / PKCE transmis par l'application cliente (contents-lab, …) */
type OAuthParams = {
  clientId: string | null;
  redirectUri: string | null;
  codeChallenge: string | null;
  codeChallengeMethod: string | null;
  state: string | null;
};

function oauthParamsFromForm(formData: FormData): OAuthParams {
  return {
    clientId: formData.get("client_id") as string | null,
    redirectUri: formData.get("redirect_uri") as string | null,
    codeChallenge: formData.get("code_challenge") as string | null,
    codeChallengeMethod: formData.get("code_challenge_method") as string | null,
    state: formData.get("state") as string | null,
  };
}

/**
 * Écrit les cookies d'authentification. Les cookies ne peuvent être modifiés que dans une
 * Server Action ou un Route Handler : l'appel est ignoré pendant le rendu d'un composant serveur.
 */
async function setAuthCookies(tokens: {
  access?: string;
  refresh?: string;
  idToken?: string;
  clientId?: string;
}) {
  const cookieStore = await cookies();
  try {
    if (tokens.access) {
      cookieStore.set(AUTH_COOKIES.access, tokens.access, { ...COOKIE_OPTIONS, maxAge: TOKEN_MAX_AGES.ACCESS });
    }
    if (tokens.refresh) {
      cookieStore.set(AUTH_COOKIES.refresh, tokens.refresh, { ...COOKIE_OPTIONS, maxAge: TOKEN_MAX_AGES.REFRESH });
    }
    if (tokens.idToken) {
      cookieStore.set(AUTH_COOKIES.idToken, tokens.idToken, { ...COOKIE_OPTIONS, maxAge: TOKEN_MAX_AGES.REFRESH });
    }
    if (tokens.clientId) {
      cookieStore.set(AUTH_COOKIES.clientId, tokens.clientId, { ...COOKIE_OPTIONS, maxAge: TOKEN_MAX_AGES.REFRESH });
    }
  } catch {
    // Rendu d'un composant serveur : écriture impossible (proxy.ts gère le refresh)
  }
}

async function clearAuthCookies() {
  const cookieStore = await cookies();
  Object.values(AUTH_COOKIES).forEach((name) => cookieStore.delete(name));
}

/** Rafraîchit les tokens à partir du refresh_token en cookie. Retourne le nouvel access token. */
async function refreshSession(): Promise<string | null> {
  const cookieStore = await cookies();
  const refreshToken = cookieStore.get(AUTH_COOKIES.refresh)?.value;
  if (!refreshToken) {
    return null;
  }

  const tokens = await refreshTokens(refreshToken, cookieStore.get(AUTH_COOKIES.clientId)?.value);
  if (!tokens) {
    return null;
  }

  await setAuthCookies({
    access: tokens.access_token,
    refresh: tokens.refresh_token,
    idToken: tokens.id_token,
  });
  return tokens.access_token;
}

async function requestSSOCode(accessToken: string, params: OAuthParams, redirectUri: string) {
  return fetch(`${DJANGO_API_URL}/api/sso/generate-code/`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${accessToken}`,
    },
    body: JSON.stringify({
      client_id: params.clientId,
      redirect_uri: redirectUri,
      code_challenge: params.codeChallenge,
      code_challenge_method: params.codeChallengeMethod || "S256",
    }),
    cache: "no-store",
  });
}

/**
 * Si la connexion a été demandée par une application cliente, génère un code d'autorisation
 * et retourne l'URL de retour vers son callback. Retourne null hors flux SSO.
 */
async function handleSSORedirection(
  accessToken: string,
  params: OAuthParams
): Promise<AuthActionResult | null> {
  if (!params.clientId || !params.redirectUri) {
    return null;
  }

  try {
    let response = await requestSSOCode(accessToken, params, params.redirectUri);

    // Access token expiré : on rafraîchit la session puis on réessaie une fois
    if (response.status === 401) {
      const newAccessToken = await refreshSession();
      if (!newAccessToken) {
        await clearAuthCookies();
        return { error: "Votre session a expiré, veuillez vous reconnecter." };
      }
      response = await requestSSOCode(newAccessToken, params, params.redirectUri);
    }

    const data = await response.json().catch(() => ({}));

    if (response.ok && data.code) {
      const redirectUrl = new URL(params.redirectUri);
      redirectUrl.searchParams.set("code", data.code);
      if (params.state) {
        redirectUrl.searchParams.set("state", params.state);
      }
      return { redirectTo: redirectUrl.toString() };
    }

    console.error("Échec generate-code SSO :", response.status, data);
    return { error: data.error_description || data.error || data.detail || "Échec génération code SSO." };
  } catch {
    return { error: "Erreur réseau avec le serveur d'autorisation SSO." };
  }
}

/** Enregistre la session issue d'un login (email ou Google) puis gère la redirection SSO. */
async function completeLogin(data: SSOLoginResponse, params: OAuthParams): Promise<AuthActionResult> {
  if (!data.access) {
    return { error: "Réponse inattendue du serveur d'authentification." };
  }

  await setAuthCookies({
    access: data.access,
    refresh: data.refresh,
    idToken: data.id_token,
    clientId: data.client_id,
  });

  return (await handleSSORedirection(data.access, params)) || { success: true };
}

async function passwordLogin(identifier: string, password: string) {
  return fetch(`${DJANGO_API_URL}/api/auth/login/`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identifier, password }),
    cache: "no-store",
  });
}

function firstError(errorData: Record<string, unknown>, fallback: string): string {
  const nonField = errorData.non_field_errors;
  if (Array.isArray(nonField) && nonField.length) {
    return String(nonField[0]);
  }
  return (errorData.detail as string) || fallback;
}

export async function loginAction(formData: FormData): Promise<AuthActionResult> {
  const identifier = (formData.get("identifier") as string)?.trim();
  const password = formData.get("password") as string;

  if (!identifier || !password) {
    return { error: "Fields are required." };
  }

  try {
    const response = await passwordLogin(identifier, password);
    const data = await response.json().catch(() => ({}));

    if (response.status === 429) {
      return { error: "Trop de tentatives. Réessayez dans une minute." };
    }
    if (!response.ok) {
      return { error: firstError(data, "Invalid credentials.") };
    }

    return completeLogin(data, oauthParamsFromForm(formData));
  } catch (error) {
    console.error("Erreur réseau loginAction :", error);
    return { error: "Unable to connect to the authentication server." };
  }
}

export async function registerAction(formData: FormData): Promise<AuthActionResult> {
  const emailInput = (formData.get("email") as string)?.trim() || null;
  const phoneInput = (formData.get("phone") as string)?.trim() || null;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;

  if ((!emailInput && !phoneInput) || !password || !name) {
    return {
      error: "Le nom, le mot de passe et au moins un identifiant (Email ou Téléphone) sont requis.",
    };
  }

  try {
    // 1. Création du compte (POST /api/users/ ne renvoie pas de token)
    const response = await fetch(`${DJANGO_API_URL}/api/users/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, password, email: emailInput, phone: phoneInput }),
      cache: "no-store",
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      console.error("Erreur d'inscription Django REST :", response.status, data);
      if (data.email) return { error: "Cet e-mail est déjà utilisé ou invalide." };
      if (data.phone) return { error: "Ce numéro de téléphone est déjà utilisé." };
      if (data.password) return { error: String(data.password[0] ?? data.password) };
      return { error: data.detail || "Une erreur est survenue lors de l'inscription." };
    }

    // 2. Connexion immédiate avec les identifiants saisis
    const loginResponse = await passwordLogin(emailInput || phoneInput!, password);
    const loginData = await loginResponse.json().catch(() => ({}));
    if (!loginResponse.ok) {
      return { error: "Compte créé. Veuillez vous connecter." };
    }

    return completeLogin(loginData, oauthParamsFromForm(formData));
  } catch (error) {
    console.error("Erreur réseau registerAction :", error);
    return { error: "Impossible de joindre le serveur d'authentification." };
  }
}

export async function getMeAction() {
  // Appelée pendant le rendu (composant serveur) : pas de refresh ici, car le refresh token
  // change à chaque usage et le nouveau ne pourrait pas être enregistré. proxy.ts s'en charge.
  const cookieStore = await cookies();
  const accessToken = cookieStore.get(AUTH_COOKIES.access)?.value;

  if (!accessToken) {
    return { user: null, error: "Non authentifié" };
  }

  try {
    const response = await fetch(`${DJANGO_API_URL}/api/users/me/`, {
      method: "GET",
      headers: { Authorization: `Bearer ${accessToken}`, "Content-Type": "application/json" },
      cache: "no-store",
    });

    if (!response.ok) {
      return { user: null, error: "Impossible de récupérer le profil" };
    }

    return { user: await response.json(), error: null };
  } catch {
    return { user: null, error: "Erreur réseau" };
  }
}

export async function loginWithGoogleAction(
  code: string,
  clientId?: string | null,
  redirectUri?: string | null,
  codeChallenge?: string | null,
  codeChallengeMethod?: string | null,
  state?: string | null
): Promise<AuthActionResult> {
  if (!code) {
    return { error: "Google code is required." };
  }

  try {
    const response = await fetch(`${DJANGO_API_URL}/api/auth/google/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code }),
      cache: "no-store",
    });

    const data = await response.json().catch(() => ({}));
    if (!response.ok) {
      return { error: firstError(data, "Google authentication failed.") };
    }

    return completeLogin(data, {
      clientId: clientId ?? null,
      redirectUri: redirectUri ?? null,
      codeChallenge: codeChallenge ?? null,
      codeChallengeMethod: codeChallengeMethod ?? null,
      state: state ?? null,
    });
  } catch {
    return { error: "Unable to connect to the authentication server." };
  }
}

/** Utilisateur déjà connecté au SSO qui arrive depuis une app cliente : code généré directement. */
export async function checkSSOSessionAction(
  clientId: string | null,
  redirectUri: string | null,
  codeChallenge: string | null = null,
  codeChallengeMethod: string | null = null,
  state: string | null = null
): Promise<AuthActionResult> {
  const cookieStore = await cookies();
  const accessToken =
    cookieStore.get(AUTH_COOKIES.access)?.value || (await refreshSession()) || undefined;

  if (!accessToken || !clientId || !redirectUri) {
    return { success: true };
  }

  const ssoResult = await handleSSORedirection(accessToken, {
    clientId,
    redirectUri,
    codeChallenge,
    codeChallengeMethod,
    state,
  });

  return ssoResult || { success: true };
}
