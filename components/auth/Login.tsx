"use client";

import React from "react";
// Importations des composants shadcn/ui
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Social from "./Social";
import FooterTab from "./FooterTab";

interface LoginProps {
  onSwitchToRegister: () => void;
}
export default function Login({onSwitchToRegister}: LoginProps) {
  return (
    <div className="flex w-full items-center justify-center p-8 lg:w-1/2 sm:p-12 lg:p-16">
      <div className="w-full max-w-md space-y-6">
        {/* En-tête / Logo */}
        <div className="text-center lg:text-left">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
            Identity Portal
          </h1>
          <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">
            Select your authentication method or use your login details.{" "}
          </p>
        </div>

        {/* BOUTONS DE CONNEXION TIERS (OAuth) */}

        <Social/>

        {/* Séparateur visuel */}
        <div className="relative flex items-center py-2">
          <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
          <span className="flex-shrink mx-4 text-xs uppercase tracking-wider text-slate-400 dark:text-slate-500 font-medium">
            Or continue with{" "}
          </span>
          <div className="flex-grow border-t border-slate-200 dark:border-slate-800"></div>
        </div>

        {/* Formulaire Standard */}
        <form className="space-y-5" onSubmit={(e) => e.preventDefault()}>
          <div className="space-y-4">


            <div className="grid gap-1.5">
              <Label
                htmlFor="email"
                className="text-slate-700 dark:text-slate-300"
              >
                Email or Phone{" "}
              </Label>
              <Input
                id="email"
                type="email"
                autoComplete="email"
                required
                className="h-11"
                placeholder="nom@entreprise.com"
              />
            </div>

            {/* Champ Mot de passe via shadcn/ui */}
            <div className="grid gap-1.5">
              <div className="flex items-center justify-between">
                <Label
                  htmlFor="password"
                  className="text-slate-700 dark:text-slate-300"
                >
                  Password
                </Label>
                <a
                  href="#"
                  className="text-xs font-semibold text-blue-600 hover:text-blue-500 dark:text-blue-400"
                >
                 Reset password
                </a>
              </div>
              <Input
                id="password"
                type="password"
                autoComplete="current-password"
                required
                className="h-11"
                placeholder="••••••••"
              />
            </div>
          </div>

          {/* Options de mémorisation via Checkbox shadcn/ui */}
          <div className="flex items-center space-x-2">
            <Checkbox id="remember-me" />
            <label
              htmlFor="remember-me"
              className="text-sm font-medium text-slate-600 dark:text-slate-400 leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 select-none"
            >
              Remember me
            </label>
          </div>

          {/* Bouton de soumission via shadcn/ui */}
          <Button
            type="submit"
            className="w-full h-11 bg-blue-600 hover:bg-blue-500 text-white font-semibold transition active:scale-[0.99] cursor-pointer"
          >
           Secure sign in
          </Button>
        </form>

        {/* Footer d'assistance */}
        <p className="text-center text-xs text-slate-500 dark:text-slate-500 lg:text-left">
          Do you already have an account?
          <button
          onClick={onSwitchToRegister}
            className=" ml-2 font-semibold underline hover:text-slate-700 dark:hover:text-slate-300 cursor-pointer"
          >
            Sign Up
          </button>
          .
        </p>
      </div>
    </div>
  );
}
