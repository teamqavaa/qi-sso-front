"use client";

import React, { useState, useTransition } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import Social from "./Social";
import { loginAction } from "@/actions/auth";
import Link from "next/link";

interface LoginProps {
  onSwitchToRegister: () => void;
}

export default function Login({ onSwitchToRegister }: LoginProps) {
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  // 1. Récupération de TOUS les paramètres OAuth2 / PKCE transmis par l'App A
  const clientId = searchParams.get("client_id");
  const redirectUri = searchParams.get("redirect_uri");
  const codeChallenge = searchParams.get("code_challenge");
  const codeChallengeMethod = searchParams.get("code_challenge_method") || "S256";
  const state = searchParams.get("state");

  const handleFormSubmit = async (formData: FormData) => {
    setError(null);
    startTransition(async () => {
      const result = await loginAction(formData);

      if (result?.error) {
        setError(result.error);
      } else if (result?.redirectTo) {
        // Redirection vers le callback de l'App A avec le code OAuth2
        window.location.href = result.redirectTo;
      } else if (result?.success) {
        // Redirection classique si ce n'est pas un flux SSO App A
        window.location.href = "/dashboard";
      }
    });
  };

  return (
    <div className="flex w-full items-center justify-center p-8 lg:w-1/2 sm:p-12 lg:p-16">
      <div className="w-full max-w-md space-y-6">
        {/* En-tête / Logo */}
        <div className="text-center lg:text-left">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Identity Portal
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Select your authentication method or use your login details.
          </p>
        </div>

        {/* BOUTONS DE CONNEXION TIERS (OAuth) */}
        <Social />

        {/* Séparateur visuel */}
        <div className="relative flex items-center py-2">
          <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
          <span className="flex-shrink mx-4 text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500 font-medium">
            Or continue with
          </span>
          <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
        </div>

        {error && (
          <div className="p-3 text-sm text-red-500 bg-red-50 rounded-lg border border-red-200">
            {error}
          </div>
        )}

        {/* Formulaire Standard */}
        <form action={handleFormSubmit} className="space-y-5">
          {/* 2. Injection des champs masqués PKCE et State indispensables pour Django */}
          {clientId && <input type="hidden" name="client_id" value={clientId} />}
          {redirectUri && <input type="hidden" name="redirect_uri" value={redirectUri} />}
          {codeChallenge && <input type="hidden" name="code_challenge" value={codeChallenge} />}
          {codeChallengeMethod && <input type="hidden" name="code_challenge_method" value={codeChallengeMethod} />}
          {state && <input type="hidden" name="state" value={state} />}

          <div className="space-y-4">
            <div className="grid gap-1.5">
              <Label
                htmlFor="identifier"
                className="text-slate-700 dark:text-slate-300"
              >
                Email or Phone
              </Label>
              <Input
                id="identifier"
                name="identifier"
                type="text"
                autoComplete="email"
                required
                className="h-11"
                placeholder="email or phone"
              />
            </div>

            <div className="grid gap-1.5">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="password"
                  className="text-slate-700 dark:text-slate-300"
                >
                  Password
                </Label>
                <Link
                  href="/password"
                  className="text-xs font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400"
                >
                  Reset password
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                name="password"
                autoComplete="current-password"
                required
                className="h-11"
                placeholder="••••••••"
              />
            </div>
          </div>

          <Button
            type="submit"
            className="w-full h-11 bg-blue-400 hover:bg-blue-500 text-white font-semibold transition active:scale-[0.99] cursor-pointer"
            disabled={isPending}
          >
            {isPending ? "Checking..." : "Secure sign in"}
          </Button>
        </form>

        {/* Footer d'assistance */}
        <p className="text-center text-xs text-slate-500 dark:text-slate-500 lg:text-left">
          Don't have an account yet?
          <button
            type="button"
            onClick={onSwitchToRegister}
            className="ml-2 font-semibold underline hover:text-slate-700 dark:hover:text-slate-300 cursor-pointer transition-all"
          >
            Sign Up
          </button>
          .
        </p>
      </div>
    </div>
  );
}
