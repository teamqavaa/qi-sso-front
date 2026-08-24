"use server";

import { cookies } from "next/headers";

const DJANGO_API_URL = process.env.DJANGO_API_URL || "http://127.0.0.1:8000";

export type AuthActionResult =
  | { success: true; error?: never; redirectTo?: never }
  | { redirectTo: string; success?: never; error?: never }
  | { error: string; success?: never; redirectTo?: never };

/**
 * Fonction utilitaire réutilisable pour interroger Django OAuth Toolkit
 * et récupérer l'URL de redirection contenant le code d'autorisation SSO et le state.
 */
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

  try {
    const response = await fetch(`${DJANGO_API_URL}/api/sso/generate-code/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        client_id: clientId,
        redirect_uri: redirectUri,
        code_challenge: codeChallenge,
        code_challenge_method: codeChallengeMethod || "S256",
      }),
    });

    const rawText = await response.text();
    let data: any = {};
    try {
      data = JSON.parse(rawText);
    } catch {
      console.error("🔴 Le serveur Django a renvoyé du HTML au lieu de JSON (Code HTTP:", response.status, ")");
      return { error: `Erreur serveur Django (${response.status}). Vérifiez les logs backend.` };
    }

    if (response.ok && data.code) {
      const redirectUrl = new URL(redirectUri);
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

  const payload = {
    username: identifier,
    password: password,
  };

  try {
    const response = await fetch(`${DJANGO_API_URL}/api/auth/login/`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      console.log("🔴 Erreur Django REST :", response.status, errorData);
      return { error: errorData.detail || "Invalid credentials." };
    }

    const data = await response.json();
    const cookieStore = await cookies();

    cookieStore.set("access_token", data.access, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 15,
    });

    cookieStore.set("refresh_token", data.refresh, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

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

  const payload = {
    name: name,
    password: password,
    email: emailInput,
    phone: phoneInput,
  };

  try {
    const response = await fetch(`${DJANGO_API_URL}/api/users/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      console.error("🔴 Erreur d'inscription Django REST :", response.status, data);
      if (data.email) return { error: "Cet e-mail est déjà utilisé." };
      if (data.phone) return { error: "Ce numéro de téléphone est déjà utilisé." };
      return { error: data.detail || "Une erreur est survenue lors de l'inscription." };
    }

    const cookieStore = await cookies();

    cookieStore.set("access_token", data.access, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 15,
    });

    cookieStore.set("refresh_token", data.refresh, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

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
  const accessToken = cookieStore.get("access_token")?.value;

  if (!accessToken) {
    return { user: null, error: "Non authentifié" };
  }

  try {
    const response = await fetch(`${DJANGO_API_URL}/api/users/me/`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      console.error("🔴 Erreur /users/me/ Django :", data);
      return { user: null, error: "Impossible de récupérer le profil" };
    }

    return { user: data, error: null };
  } catch (error) {
    console.error("🚨 Erreur réseau getMeAction :", error);
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
    const cookieStore = await cookies();

    cookieStore.set("access_token", data.access, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 15,
    });

    cookieStore.set("refresh_token", data.refresh, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7,
    });

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
