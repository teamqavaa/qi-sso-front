"use server";

import { cookies } from "next/headers";

const DJANGO_API_URL = process.env.DJANGO_API_URL || "https://qavaa-innovate-sso-zlvwvifuvq-ew.a.run.app";

// Configuration unifiée et sécurisée des cookies
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
  sameSite: "lax" as const,
  path: "/",
};

// Alignement exact avec votre configuration Django SIMPLE_JWT
const TOKEN_MAX_AGES = {
  ACCESS: 60 * 60 * 24,       // 1 jour (aligné sur timedelta(days=1))
  REFRESH: 60 * 60 * 24 * 30, // 30 jours (aligné sur timedelta(days=30))
};

export type AuthActionResult =
  | { success: true; error?: never; redirectTo?: never }
  | { redirectTo: string; success?: never; error?: never }
  | { error: string; success?: never; redirectTo?: never };

/**
 * Fonction utilitaire pour écrire les cookies d'authentification de manière uniforme.
 * Typage corrigé pour accepter explicitement `string | undefined` sur le paramètre `refresh`.
 */
async function setAuthCookies(access: string, refresh?: string | undefined) {
  const cookieStore = await cookies();
  cookieStore.set("access_token", access, {
    ...COOKIE_OPTIONS,
    maxAge: TOKEN_MAX_AGES.ACCESS,
  });

  // Si Django renvoie un nouveau refresh token (en cas de rotation), on le met à jour aussi
  if (refresh) {
    cookieStore.set("refresh_token", refresh, {
      ...COOKIE_OPTIONS,
      maxAge: TOKEN_MAX_AGES.REFRESH,
    });
  }
}

/**
 * Fonction utilitaire réutilisable pour interroger Django OAuth Toolkit
 * et récupérer l'URL de redirection contenant le code d'autorisation SSO et le state.
 */
const PROD_CALLBACK_URL = "https://qi-front-app-l2tbnetuqa-ew.a.run.app/api/auth/callback";

async function handleSSORedirection(
  accessToken: string,
  clientId: string | null,
  redirectUri: string | null,
  codeChallenge: string | null = null,
  codeChallengeMethod: string | null = null,
  state: string | null = null
): Promise<AuthActionResult | null> {
  if (!clientId || !redirectUri) {
    return null;
  }

  // ✅ Force l'URL de production si la valeur reçue contient 0.0.0.0 ou est invalide
  let cleanRedirectUri = redirectUri;
  if (cleanRedirectUri.includes("0.0.0.0") || process.env.NODE_ENV === "production") {
    cleanRedirectUri = PROD_CALLBACK_URL;
  }

  try {
    const response = await fetch(`${DJANGO_API_URL}/api/sso/generate-code/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        client_id: clientId,
        redirect_uri: cleanRedirectUri, // On envoie l'URL propre à Django
        code_challenge: codeChallenge,
        code_challenge_method: codeChallengeMethod || "S256",
      }),
    });

    const rawText = await response.text();
    let data: any = {};
    try {
      data = JSON.parse(rawText);
    } catch {
      console.error("🔴 Le serveur Django a renvoyé du HTML (Code HTTP:", response.status, ")");
      return { error: `Erreur serveur Django (${response.status}).` };
    }

    if (response.ok && data.code) {
      const redirectUrl = new URL(cleanRedirectUri); // Reconstitution sur la bonne base HTTPS
      redirectUrl.searchParams.set("code", data.code);
      if (state) {
        redirectUrl.searchParams.set("state", state);
      }
      return { redirectTo: redirectUrl.toString() };
    }

    console.error("🔴 Erreur génération code SSO :", data);
    return { error: data.error || "Impossible de générer le code d'autorisation SSO." };
  } catch (error) {
    console.error("🚨 Erreur réseau SSO :", error);
    return { error: "Erreur lors de la communication avec le serveur SSO." };
  }
}

export async function loginAction(formData: FormData): Promise<AuthActionResult> {
  const identifier = formData.get("identifier") as string;
  const password = formData.get("password") as string;
  const clientId = formData.get("client_id") as string | null;
  const redirectUri = formData.get("redirect_uri") as string | null;
  const codeChallenge = formData.get("code_challenge") as string | null;
  const codeChallengeMethod = formData.get("code_challenge_method") as string | null;
  const state = formData.get("state") as string | null;

  if (!identifier || !password) {
    return { error: "Fields are required." };
  }

  try {
    const response = await fetch(`${DJANGO_API_URL}/api/auth/login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username: identifier, password }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.log("🔴 Erreur Django REST :", response.status, errorData);
      return { error: errorData.detail || "Invalid credentials." };
    }

    const data = await response.json();
    await setAuthCookies(data.access, data.refresh);

    const ssoResult = await handleSSORedirection(
      data.access,
      clientId,
      redirectUri,
      codeChallenge,
      codeChallengeMethod,
      state
    );
    if (ssoResult) {
      return ssoResult;
    }

    return { success: true };
  } catch (error) {
    return { error: "Unable to connect to the authentication server." };
  }
}

export async function registerAction(formData: FormData): Promise<AuthActionResult> {
  const emailInput = (formData.get("email") as string)?.trim() || null;
  const phoneInput = (formData.get("phone") as string)?.trim() || null;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;
  const clientId = formData.get("client_id") as string | null;
  const redirectUri = formData.get("redirect_uri") as string | null;
  const codeChallenge = formData.get("code_challenge") as string | null;
  const codeChallengeMethod = formData.get("code_challenge_method") as string | null;
  const state = formData.get("state") as string | null;

  if ((!emailInput && !phoneInput) || !password || !name) {
    return {
      error: "Le nom, le mot de passe et au moins un identifiant (Email ou Téléphone) sont requis.",
    };
  }

  try {
    const response = await fetch(`${DJANGO_API_URL}/api/users/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        name,
        password,
        email: emailInput,
        phone: phoneInput,
      }),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      console.error("🔴 Erreur d'inscription Django REST :", response.status, data);
      if (data.email) return { error: "Cet e-mail est déjà utilisé." };
      if (data.phone) return { error: "Ce numéro de téléphone est déjà utilisé." };
      return { error: data.detail || "Une erreur est survenue lors de l'inscription." };
    }

    await setAuthCookies(data.access, data.refresh);

    const ssoResult = await handleSSORedirection(
      data.access,
      clientId,
      redirectUri,
      codeChallenge,
      codeChallengeMethod,
      state
    );
    if (ssoResult) {
      return ssoResult;
    }

    return { success: true };
  } catch (error) {
    console.error("🚨 Erreur réseau Server Action :", error);
    return { error: "Impossible de joindre le serveur d'authentification." };
  }
}

export async function getMeAction() {
  const cookieStore = await cookies();
  let accessToken = cookieStore.get("access_token")?.value;
  const refreshToken = cookieStore.get("refresh_token")?.value;

  if (!accessToken) {
    return { user: null, error: "Non authentifié" };
  }

  try {
    let response = await fetch(`${DJANGO_API_URL}/api/users/me/`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    // Si l'access token a expiré, on tente de le rafraîchir
    if (response.status === 401 && refreshToken) {
      const refreshResponse = await fetch(`${DJANGO_API_URL}/api/auth/token/refresh/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ refresh: refreshToken }),
      });

      if (refreshResponse.ok) {
        const refreshData = await refreshResponse.json();

        if (!refreshData.access) {
          return { user: null, error: "Erreur de rafraîchissement du token" };
        }

        accessToken = refreshData.access as string;
        // Si ROTATE_REFRESH_TOKENS est actif, Django renvoie un nouveau refresh token
        const newRefresh: string | undefined = refreshData.refresh;

        // Mise à jour sécurisée des cookies avec prise en compte de la rotation
        await setAuthCookies(accessToken, newRefresh);

        // On relance la requête initiale avec le nouveau token
        response = await fetch(`${DJANGO_API_URL}/api/users/me/`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
          },
          cache: "no-store",
        });
      } else {
        // En cas d'échec du refresh (token noirci ou expiré), on nettoie
        cookieStore.delete("access_token");
        cookieStore.delete("refresh_token");
      }
    }

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return { user: null, error: "Impossible de récupérer le profil" };
    }

    return { user: data, error: null };
  } catch (error) {
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
      body: JSON.stringify({ code: code }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));

      console.log("\n--- 🔴 DIAGNOSTIC ERREUR DJANGO GOOGLE ---");
      console.log("Statut HTTP :", response.status);
      console.log("Détails renvoyés par l'API :", JSON.stringify(errorData, null, 2));
      console.log("------------------------------------------\n");

      return { error: errorData.detail || "Google authentication failed." };
    }

    const data = await response.json();
    await setAuthCookies(data.access, data.refresh);

    const ssoResult = await handleSSORedirection(
      data.access,
      clientId ?? null,
      redirectUri ?? null,
      codeChallenge ?? null,
      codeChallengeMethod ?? null,
      state ?? null
    );
    if (ssoResult) {
      return ssoResult;
    }

    return { success: true };
  } catch (error) {
    console.error("Erreur serveur Next.js (Google) :", error);
    return { error: "Unable to connect to the authentication server." };
  }
}

export async function checkSSOSessionAction(
  clientId: string | null,
  redirectUri: string | null,
  codeChallenge: string | null = null,
  codeChallengeMethod: string | null = null,
  state: string | null = null
): Promise<AuthActionResult> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  if (!accessToken || !clientId || !redirectUri) {
    return { success: true };
  }

  const ssoResult = await handleSSORedirection(
    accessToken,
    clientId,
    redirectUri,
    codeChallenge,
    codeChallengeMethod,
    state
  );

  return ssoResult || { success: true };
}
