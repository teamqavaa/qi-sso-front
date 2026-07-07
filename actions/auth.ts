"use server";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function loginAction(formData: FormData) {
  // 1. On récupère la valeur du champ "identifier" de votre formulaire Next.js
  const identifier = formData.get("identifier") as string;
  const password = formData.get("password") as string;

  if (!identifier || !password) {
    return { error: "Fields are required." };
  }

  // 2. On aligne le payload sur ce que votre CustomTokenObtainPairSerializer attend :
  // Il lui faut une clé 'username' (qui recevra l'email ou le téléphone) et 'password'
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

      // Si Django renvoie une erreur de validation (ex: "Aucun compte trouvé"),
      // on affiche le message précis renvoyé par le serializer
      return { error: errorData.detail || "Invalid credentials." };
    }

    const data = await response.json();
    const cookieStore = await cookies();

    // 3. Stockage des jetons d'authentification cryptés
    cookieStore.set("access_token", data.access, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 15, // 15 minutes
    });

    cookieStore.set("refresh_token", data.refresh, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 jours
    });

    return { success: true };
  } catch (error) {
    return { error: "Unable to connect to the authentication server." };
  }
}


export async function registerAction(formData: FormData) {
  // 1. Récupération des champs distincts du formulaire Next.js
  const emailInput = (formData.get("email") as string)?.trim() || null;
  const phoneInput = (formData.get("phone") as string)?.trim() || null;
  const password = formData.get("password") as string;
  const name = formData.get("name") as string;

  // Sécurité : l'utilisateur doit fournir au moins l'email OU le téléphone, et le reste des champs obligatoires
  if ((!emailInput && !phoneInput) || !password || !name) {
    return { error: "Le nom, le mot de passe et au moins un identifiant (Email ou Téléphone) sont requis." };
  }

  // 2. Construction du payload propre pour le UserSerializer de Django
  const payload = {
    name: name,
    password: password,
    email: emailInput,
    phone: phoneInput,
  };

  try {
    // 3. Envoi de la requête POST vers votre UserViewSet
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

      // Traduction des erreurs de validation uniques renvoyées par Django
      if (data.email) return { error: "Cet e-mail est déjà utilisé." };
      if (data.phone) return { error: "Ce numéro de téléphone est déjà utilisé." };
      return { error: data.detail || "Une erreur est survenue lors de l'inscription." };
    }

    // 4. ⚡ CONNEXION AUTOMATIQUE APRES INSCRIPTION REUSSIE
    const cookieStore = await cookies();

    // Enregistrement des cookies HttpOnly sécurisés reçus depuis le ViewSet
    cookieStore.set("access_token", data.access, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 15, // 15 minutes
    });

    cookieStore.set("refresh_token", data.refresh, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      path: "/",
      maxAge: 60 * 60 * 24 * 7, // 7 jours
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

  // Si aucun token n'est trouvé, l'utilisateur n'est pas connecté
  if (!accessToken) {
    return { user: null, error: "Non authentifié" };
  }

  try {
    // Appel de l'action 'me' personnalisée de votre UserViewSet Django
    // On utilise 'web:8000' car la requête part du serveur Next.js vers le conteneur Django
    const response = await fetch("http://127.0.0.1:8000/api/users/me/", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      // On désactive le cache pour toujours avoir les données à jour
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

export async function clearAuthCookies() {
  const cookieStore = await cookies();
  cookieStore.delete("access_token");
  cookieStore.delete("refresh_token");
}

export async function logoutAction() {
  const cookieStore = await cookies();
  cookieStore.delete("access_token");
  cookieStore.delete("refresh_token");
  redirect("/");
}

export async function updateProfileAction(field: string, value: string) {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  if (!accessToken) {
    return { ok: false, message: "Not authenticated" };
  }

  try {
    const response = await fetch("http://127.0.0.1:8000/api/users/me/", {
      method: "PATCH",
      headers: {
        "Authorization": `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ [field]: value }),
    });

    if (!response.ok) {
      return { ok: false, message: "Failed to update profile" };
    }

    return { ok: true };
  } catch {
    return { ok: false, message: "Network error" };
  }
}


