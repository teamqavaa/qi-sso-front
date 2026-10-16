"use client";

import SidePanel from "./auth/SidePanel";
import Register from "./auth/Register";
import Login from "./auth/Login";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { checkSSOSessionAction } from "@/actions/auth"; // 👈 Import de l'action

export default function AuthHome() {
  const [authMode, setAuthMode] = useState<"login" | "register">("login");
  const searchParams = useSearchParams();

  const clientId = searchParams.get("client_id");
  const redirectUri = searchParams.get("redirect_uri");
  const state = searchParams.get("state");
  const codeChallenge = searchParams.get("code_challenge");
  const codeChallengeMethod = searchParams.get("code_challenge_method");

  useEffect(() => {
    // Si l'utilisateur arrive avec des paramètres OAuth2
    if (clientId && redirectUri) {
      checkSSOSessionAction(
        clientId,
        redirectUri,
        codeChallenge,
        codeChallengeMethod,
        state
      ).then((result) => {
        // Si Django a généré le code avec succès, redirection vers l'App A !
        if (result?.redirectTo) {
          window.location.href = result.redirectTo;
        }
      });
    }
  }, [clientId, redirectUri, state, codeChallenge, codeChallengeMethod]);

  return (
    <div className="flex gap-5 w-full min-h-screen bg-slate-50 dark:bg-slate-50">
      <SidePanel />

      {authMode === "login" ? (
        <Login onSwitchToRegister={() => setAuthMode("register")} />
      ) : (
        <Register onSwitchToLogin={() => setAuthMode("login")} />
      )}
    </div>
  );
}
