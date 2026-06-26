"use server";

import { cookies } from "next/headers";

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

export async function RegisterAction(formData : FormData){
    const name = formData.get('name') as string;
    const phone = formData.get('phone')
    const email = formData.get('email') as string
    const password = formData.get('password') as string


}
