"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState, useTransition } from "react";
import { ArrowLeft, CheckCircle2, Eye, EyeOff, KeyRound, Mail, ShieldCheck } from "lucide-react";

import {
  changePasswordAction,
  confirmPasswordResetAction,
  requestPasswordResetAction,
  verifyPasswordResetCodeAction,
} from "@/actions/auth";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

type Step = "change" | "email" | "code" | "password" | "done";

// Paramètres OAuth de l'application cliente : conservés pour la ramener à son callback
const OAUTH_KEYS = ["client_id", "redirect_uri", "code_challenge", "code_challenge_method", "state"] as const;
const RESEND_SECONDS = 60;
const MIN_LENGTH = 8;

const submitClass = "w-full h-11 bg-blue-500 hover:bg-blue-600 text-white font-semibold cursor-pointer";

function PasswordInput({ id, name, label, autoComplete }: { id: string; name: string; label: string; autoComplete: string }) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="grid gap-1.5">
      <Label htmlFor={id} className="text-slate-700">{label}</Label>
      <div className="relative">
        <Input
          id={id}
          name={name}
          type={visible ? "text" : "password"}
          autoComplete={autoComplete}
          required
          minLength={name === "current_password" ? undefined : MIN_LENGTH}
          className="h-11 pr-11"
        />
        <button
          type="button"
          onClick={() => setVisible(!visible)}
          aria-label={visible ? "Masquer le mot de passe" : "Afficher le mot de passe"}
          className="absolute right-1 top-1/2 flex h-9 w-9 -translate-y-1/2 items-center justify-center rounded-[4px] text-slate-500 hover:bg-slate-100"
        >
          {visible ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
        </button>
      </div>
    </div>
  );
}

function Alert({ tone, children }: { tone: "error" | "info"; children: React.ReactNode }) {
  const styles = tone === "error" ? "text-red-600 bg-red-50 border-red-200" : "text-blue-800 bg-blue-50 border-blue-200";
  return (
    <div role={tone === "error" ? "alert" : "status"} className={`p-3 text-sm rounded-[4px] border ${styles}`}>
      {children}
    </div>
  );
}

/**
 * Parcours « mot de passe » :
 * - connecté : changement avec le mot de passe actuel (la session prouve déjà l'identité) ;
 * - sinon : email -> code à 6 chiffres reçu par email -> nouveau mot de passe -> connexion.
 */
export default function PasswordFlow({ signedInEmail }: { signedInEmail: string | null }) {
  const searchParams = useSearchParams();
  const [step, setStep] = useState<Step>(signedInEmail ? "change" : "email");
  const [email, setEmail] = useState(signedInEmail ?? searchParams.get("email") ?? "");
  const [code, setCode] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [info, setInfo] = useState<string | null>(null);
  const [cooldown, setCooldown] = useState(0);
  const [pending, startTransition] = useTransition();

  const oauthQuery = new URLSearchParams();
  OAUTH_KEYS.forEach((key) => {
    const value = searchParams.get(key);
    if (value) oauthQuery.set(key, value);
  });
  const loginHref = `/${oauthQuery.size ? `?${oauthQuery}` : ""}`;

  useEffect(() => {
    if (cooldown <= 0) return;
    const timer = setTimeout(() => setCooldown(cooldown - 1), 1000);
    return () => clearTimeout(timer);
  }, [cooldown]);

  const go = (next: Step) => {
    setError(null);
    setStep(next);
  };

  const sendCode = (target: string) =>
    startTransition(async () => {
      setError(null);
      const result = await requestPasswordResetAction(target);
      if (!result.ok) return setError(result.error);
      setEmail(target.trim());
      // Message volontairement neutre : il ne révèle pas si le compte existe
      setInfo("If an account exists for this address, a verification code has just been sent to it.");
      setCooldown(RESEND_SECONDS);
      setStep("code");
    });

  const passwordsMatch = (formData: FormData) => {
    if (formData.get("new_password") !== formData.get("confirm_password")) {
      setError("Les deux mots de passe ne correspondent pas.");
      return false;
    }
    return true;
  };

  const onEmail = (formData: FormData) => sendCode(String(formData.get("email") || ""));

  const onCode = (formData: FormData) =>
    startTransition(async () => {
      setError(null);
      const value = String(formData.get("code") || "").replace(/\D/g, "");
      const result = await verifyPasswordResetCodeAction(email, value);
      if (!result.ok) return setError(result.error);
      setCode(value);
      setInfo(null);
      setStep("password");
    });

  const onReset = (formData: FormData) => {
    if (!passwordsMatch(formData)) return;
    startTransition(async () => {
      setError(null);
      const result = await confirmPasswordResetAction(formData);
      if ("redirectTo" in result && result.redirectTo) {
        window.location.href = result.redirectTo;
      } else if ("success" in result && result.success) {
        window.location.href = "/dashboard";
      } else if ("ok" in result && result.ok) {
        setInfo(result.message ?? null);
        setStep("done");
      } else {
        const failure = result as { error: string; field?: string };
        setError(failure.error);
        // Code expiré ou épuisé entre-temps : il faut en demander un nouveau
        if (failure.field === "code") setStep("code");
      }
    });
  };

  const onChange = (formData: FormData) => {
    if (!passwordsMatch(formData)) return;
    startTransition(async () => {
      setError(null);
      const result = await changePasswordAction(formData);
      if (!result.ok) return setError(result.error);
      setInfo(result.message ?? null);
      setStep("done");
    });
  };

  const titles: Record<Step, { icon: React.ReactNode; title: string; text: string }> = {
    change: {
      icon: <KeyRound className="h-5 w-5" />,
      title: "Change your password",
      text: `You are signed in as ${signedInEmail}. Confirm your current password to choose a new one.`,
    },
    email: {
      icon: <Mail className="h-5 w-5" />,
      title: "Forgot your password?",
      text: "Enter the email address of your account. We will send you a 6-digit verification code.",
    },
    code: {
      icon: <ShieldCheck className="h-5 w-5" />,
      title: "Check your inbox",
      text: `Enter the 6-digit code sent to ${email}. It expires in 15 minutes.`,
    },
    password: {
      icon: <KeyRound className="h-5 w-5" />,
      title: "Choose a new password",
      text: `Use at least ${MIN_LENGTH} characters. All your sessions will be signed out.`,
    },
    done: {
      icon: <CheckCircle2 className="h-5 w-5" />,
      title: "Password updated",
      text: "Your new password is now active.",
    },
  };
  const current = titles[step];

  return (
    <div className="w-full max-w-md space-y-6">
      <div>
        <span className="mb-4 flex h-11 w-11 items-center justify-center rounded-[4px] bg-blue-50 text-blue-600">
          {current.icon}
        </span>
        <h1 className="text-3xl font-extrabold tracking-tight text-slate-900">{current.title}</h1>
        <p className="mt-2 text-sm text-slate-600">{current.text}</p>
      </div>

      {info && step !== "done" && <Alert tone="info">{info}</Alert>}
      {error && <Alert tone="error">{error}</Alert>}

      {step === "change" && (
        <form action={onChange} className="space-y-4">
          <PasswordInput id="current_password" name="current_password" label="Current password" autoComplete="current-password" />
          <PasswordInput id="new_password" name="new_password" label="New password" autoComplete="new-password" />
          <PasswordInput id="confirm_password" name="confirm_password" label="Confirm new password" autoComplete="new-password" />
          <Button type="submit" disabled={pending} className={submitClass}>
            {pending ? "Saving..." : "Update password"}
          </Button>
          <button
            type="button"
            onClick={() => sendCode(email)}
            disabled={pending}
            className="text-sm font-semibold text-blue-600 hover:text-blue-500 cursor-pointer"
          >
            Forgot your current password? Get a code by email
          </button>
        </form>
      )}

      {step === "email" && (
        <form action={onEmail} className="space-y-4">
          <div className="grid gap-1.5">
            <Label htmlFor="email" className="text-slate-700">Email</Label>
            <Input id="email" name="email" type="email" autoComplete="email" required defaultValue={email} className="h-11" placeholder="you@example.com" />
          </div>
          <Button type="submit" disabled={pending} className={submitClass}>
            {pending ? "Sending..." : "Send verification code"}
          </Button>
        </form>
      )}

      {step === "code" && (
        <form action={onCode} className="space-y-4">
          <div className="grid gap-1.5">
            <Label htmlFor="code" className="text-slate-700">Verification code</Label>
            <Input
              id="code"
              name="code"
              inputMode="numeric"
              autoComplete="one-time-code"
              pattern="\d{6}"
              maxLength={6}
              required
              autoFocus
              className="h-12 text-center text-2xl font-semibold tracking-[0.5em]"
              placeholder="••••••"
            />
          </div>
          <Button type="submit" disabled={pending} className={submitClass}>
            {pending ? "Checking..." : "Verify code"}
          </Button>
          <div className="flex items-center justify-between text-sm">
            <button type="button" onClick={() => go("email")} className="text-slate-600 hover:text-slate-900 cursor-pointer">
              Use another email
            </button>
            <button
              type="button"
              disabled={pending || cooldown > 0}
              onClick={() => sendCode(email)}
              className="font-semibold text-blue-600 hover:text-blue-500 disabled:text-slate-400 cursor-pointer disabled:cursor-default"
            >
              {cooldown > 0 ? `Resend code in ${cooldown}s` : "Resend code"}
            </button>
          </div>
        </form>
      )}

      {step === "password" && (
        <form action={onReset} className="space-y-4">
          <input type="hidden" name="email" value={email} />
          <input type="hidden" name="code" value={code} />
          {OAUTH_KEYS.map((key) => {
            const value = searchParams.get(key);
            return value ? <input key={key} type="hidden" name={key} value={value} /> : null;
          })}
          <PasswordInput id="new_password" name="new_password" label="New password" autoComplete="new-password" />
          <PasswordInput id="confirm_password" name="confirm_password" label="Confirm new password" autoComplete="new-password" />
          <Button type="submit" disabled={pending} className={submitClass}>
            {pending ? "Saving..." : "Reset password and sign in"}
          </Button>
        </form>
      )}

      {step === "done" && (
        <div className="space-y-4">
          {info && <Alert tone="info">{info}</Alert>}
          <Link href={signedInEmail ? "/dashboard" : loginHref} className={`${submitClass} inline-flex items-center justify-center rounded-[4px] text-sm`}>
            {signedInEmail ? "Back to my account" : "Sign in"}
          </Link>
        </div>
      )}

      {step !== "done" && (
        <Link href={signedInEmail ? "/dashboard" : loginHref} className="inline-flex items-center gap-1.5 text-sm text-slate-600 hover:text-slate-900">
          <ArrowLeft className="h-4 w-4" /> {signedInEmail ? "Back to my account" : "Back to sign in"}
        </Link>
      )}
    </div>
  );
}
