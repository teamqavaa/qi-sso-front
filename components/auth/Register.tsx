"use client";

import React, { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
// Importations des composants shadcn/ui
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Social from "./Social";
import FooterTab from "./FooterTab";

// Importation de votre Server Action
import { registerAction } from "@/actions/auth";

interface RegisterProps {
  onSwitchToLogin: () => void;
}

export default function Register({ onSwitchToLogin }: RegisterProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError(null);

    const formData = new FormData(event.currentTarget);

    // Déclenchement sécurisé de la Server Action avec useTransition
    startTransition(async () => {
      const result = await registerAction(formData);

      if (result?.error) {
        setError(result.error);
      } else if (result?.success) {
        // Redirection vers le dashboard après la connexion automatique réussie
        router.push("/dashboard");
        router.refresh();
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
            Create an account
          </p>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Select your authentication method or use your login details.{" "}
          </p>
        </div>

        {/* BOUTONS DE CONNEXION TIERS (OAuth) */}
        <Social />

        {/* Séparateur visuel */}
        <div className="relative flex items-center py-2">
          <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
          <span className="flex-shrink mx-4 text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500 font-medium">
            Or continue with{" "}
          </span>
          <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
        </div>

        {/* Bloc d'affichage des erreurs renvoyées par Django */}
        {error && (
          <div className="p-3 text-sm font-medium text-red-600 bg-red-50 dark:bg-red-950/30 dark:text-red-400 rounded-lg border border-red-200 dark:border-red-900">
            {error}
          </div>
        )}

        {/* Formulaire Standard relié au handler */}
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="space-y-4">

            {/* Champ Full Name */}
            <div className="grid gap-1.5">
              <Label htmlFor="name" className="text-slate-700 dark:text-slate-300">
                Full Name
              </Label>
              <Input
                id="name"
                name="name" // Crucial pour le FormData
                type="text"
                required
                className="h-11"
                placeholder="John Doe"
              />
            </div>

            {/* Champ phone */}
            <div className="grid gap-1.5">
              <Label htmlFor="phone" className="text-slate-700 dark:text-slate-300">
                Phone
              </Label>
              <Input
                id="phone"
                name="phone" // Crucial pour le FormData
                type="text"
                className="h-11"
                placeholder="+001 2245 67 980 35"
              />
            </div>

            {/* Champ Email */}
            <div className="grid gap-1.5">
              <Label htmlFor="email" className="text-slate-700 dark:text-slate-300">
                Email
              </Label>
              <Input
                id="email"
                name="email" // Crucial pour le FormData
                type="email"
                autoComplete="email"
                className="h-11"
                placeholder="nom@entreprise.com"
              />
            </div>

            {/* Champ Mot de passe */}
            <div className="grid gap-1.5">
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-slate-700 dark:text-slate-300">
                  Password
                </Label>
              </div>
              <Input
                id="password"
                name="password" // Crucial pour le FormData
                type="password"
                autoComplete="new-password"
                required
                className="h-11"
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Options de mémorisation */}
          <div className="flex items-center space-x-2">
            <Checkbox id="remember-me" name="remember-me" />
            <label
              htmlFor="remember-me"
              className="text-sm font-medium text-slate-600 dark:text-slate-400 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 select-none"
            >
              Remember me
            </label>
          </div>

          {/* Bouton de soumission adaptatif avec état de chargement */}
          <Button
            type="submit"
            disabled={isPending}
            className="w-full h-11 bg-blue-600 hover:bg-blue-500 disabled:bg-blue-400 text-white font-semibold transition active:scale-[0.99] cursor-pointer flex items-center justify-center"
          >
            {isPending ? "Creating account..." : "Secure Sign Up"}
          </Button>
        </form>

        {/* Footer d'assistance */}
        <p className="text-center text-xs text-slate-500 dark:text-slate-500 lg:text-left">
          Do you already have an account?
          <button
            onClick={onSwitchToLogin}
            className="ml-2 font-semibold underline hover:text-slate-700 dark:hover:text-slate-300 cursor-pointer"
          >
            Sign In
          </button>
          .
        </p>
      </div>
    </div>
  );
}
