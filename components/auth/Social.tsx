"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { GoogleOAuthProvider, useGoogleLogin } from "@react-oauth/google";
// 1. Importez votre Server Action dédiée à l'authentification Google
// (Ajustez le chemin d'accès selon l'emplacement exact de votre fichier d'actions)
import { loginWithGoogleAction } from "@/actions/auth";

function GoogleLoginButton({ onError }: { onError: (message: string | null) => void }) {
  // Paramètres OAuth2 / PKCE de l'application cliente (si la connexion vient d'elle)
  const searchParams = useSearchParams();

  const login = useGoogleLogin({
    flow: "auth-code", // Requis pour échanger le code côté serveur (Django / Allauth)
    onSuccess: async (codeResponse) => {
      onError(null);

      try {
        // 2. Server Action : connexion + génération du code SSO si une app cliente l'a demandé
        const result = await loginWithGoogleAction(
          codeResponse.code,
          searchParams.get("client_id"),
          searchParams.get("redirect_uri"),
          searchParams.get("code_challenge"),
          searchParams.get("code_challenge_method") || "S256",
          searchParams.get("state")
        );

        if (result?.redirectTo) {
          // Retour vers le callback de l'application cliente avec le code OAuth2
          window.location.href = result.redirectTo;
        } else if (result?.success) {
          window.location.href = "/dashboard";
        } else {
          onError(result?.error || "Échec de la connexion Google.");
        }
      } catch (error) {
        console.error("Erreur inattendue lors de la connexion Google :", error);
        onError("Échec de la connexion Google.");
      }
    },
    onError: (error) => {
      console.error("Échec de l'authentification Google (Popup) :", error);
      onError("Connexion Google annulée ou refusée.");
    },
  });

  return (
    <Button
      variant="outline"
      className="w-full flex items-center justify-center gap-2 h-11 cursor-pointer"
      onClick={() => login()} // Déclenche la pop-up d'autorisation Google
    >
      <svg className="h-5 w-5" viewBox="0 0 24 24">
        <path
          d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          fill="#4285F4"
        />
        <path
          d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          fill="#34A853"
        />
        <path
          d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
          fill="#FBBC05"
        />
        <path
          d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
          fill="#EA4335"
        />
      </svg>
      <span className="sm:hidden lg:inline text-xs font-medium">Google</span>
    </Button>
  );
}

// Le Client ID Google est public (il est visible dans le navigateur) ; surchargeable par variable d'env.
const GOOGLE_CLIENT_ID =
  process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID ||
  "851426549201-kagnf9bjrh66jlug4qqiuhv9jnah0nni.apps.googleusercontent.com";

export default function Social() {
  const [error, setError] = useState<string | null>(null);

  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      {error && (
        <div className="mt-6 p-3 text-sm text-red-500 bg-red-50 rounded-lg border border-red-200">
          {error}
        </div>
      )}
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 mt-6">

        {/* Bouton Google connecté */}
        <GoogleLoginButton onError={setError} />

        {/* Microsoft (Statique pour le moment) */}
        <Button
          variant="outline"
          className="w-full flex items-center justify-center gap-2 h-11"
          disabled
          onClick={() => {}}
        >
          <svg className="h-5 w-5" viewBox="0 0 23 23">
            <path fill="#f35325" d="M1 1h10v10H1z" />
            <path fill="#81bc06" d="M12 1h10v10H12z" />
            <path fill="#05a6f0" d="M1 12h10v10H1z" />
            <path fill="#ffba08" d="M12 12h10v10H12z" />
          </svg>
          <span className="sm:hidden lg:inline text-xs font-medium">
            Microsoft
          </span>
        </Button>

        {/* Facebook (Statique pour le moment) */}
        <Button
          variant="outline"
          className="w-full flex items-center justify-center gap-2 h-11"
          disabled
          onClick={() => {}}
        >
          <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 24 24">
            <path
              d="M22 12c0-5.52-4.48-10-10-10S2 6.48 2 12c0 4.84 3.44 8.87 8 9.8V15H8v-3h2V9.5C10 7.57 11.57 6 13.5 6H16v3h-2c-.55 0-1 .45-1 1v2h3v3h-3v6.95c4.56-.93 8-4.96 8-9.8z"
              fill="#1877F2"
            />
          </svg>
          <span className="sm:hidden lg:inline text-xs font-medium">
            Facebook
          </span>
        </Button>
      </div>
    </GoogleOAuthProvider>
  );
}
