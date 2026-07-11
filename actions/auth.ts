"use server";

import { cookies } from "next/headers";

export async function loginAction(formData: FormData) {
  const identifier = formData.get("identifier") as string;
  const password = formData.get("password") as string;

  if (!identifier || !password) {
    return { error: "Fields are required." };
  }

  const payload = {
    username: identifier,
    password: password,
  };

  try {
    const response = await fetch("http://127.0.0.1:8000/api/auth/login/", {
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

    return { success: true };
  } catch (error) {
    return { error: "Unable to connect to the authentication server." };
  }
}

export async function registerAction(formData: FormData) {
  const emailInput = (formData.get("email") as string)?.trim() || null;
  const phoneInput = (formData.get("phone") as string)?.trim() || null;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;

  if ((!emailInput && !phoneInput) || !password || !name) {
    return { error: "Le nom, le mot de passe et au moins un identifiant (Email ou Téléphone) sont requis." };
  }

  const payload = {
    name: name,
    password: password,
    email: emailInput,
    phone: phoneInput,
  };

  try {
    const response = await fetch("http://127.0.0.1:8000/api/users/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload),
    });

    const data = await response.json();

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
    const response = await fetch("http://127.0.0.1:8000/api/users/me/", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    const data = await response.json();

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

export async function loginWithGoogleAction(code: string) {
  if (!code) {
    return { error: "Google code is required." };
  }

  try {
    const response = await fetch("http://127.0.0.1:8000/api/api/auth/google/", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ code: code }),
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));

      // 🔧 ICI : Remplacement des 'print' par 'console.log'
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

    return { success: true };
  } catch (error) {
    console.error("Erreur serveur Next.js (Google) :", error);
    return { error: "Unable to connect to the authentication server." };
  }
}
