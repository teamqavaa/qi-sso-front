"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { CheckCircle2, Loader2 } from "lucide-react";

import { fulfillPaymentAction } from "@/actions/orders";

export default function QavaaPay() {
  const searchParams = useSearchParams();
  const tx = searchParams.get("tx") ?? "";

  const [state, setState] = useState<
    | { phase: "pending" }
    | { phase: "success" }
    | { phase: "error"; message: string }
  >({ phase: "pending" });

  useEffect(() => {
    let active = true;
    (async () => {
      if (!tx) {
        if (active) setState({ phase: "error", message: "Missing payment reference." });
        return;
      }
      const result = await fulfillPaymentAction(tx);
      if (!active) return;
      setState(
        result.ok
          ? { phase: "success" }
          : { phase: "error", message: result.error ?? "Payment could not be confirmed." }
      );
    })();
    return () => {
      active = false;
    };
  }, [tx]);

  return (
    <div className="mx-auto flex w-full max-w-md flex-col items-center gap-6 px-6 py-16 text-center">
      {state.phase === "pending" && (
        <>
          <Loader2 className="h-10 w-10 animate-spin text-neutral-400" />
          <p className="text-sm text-muted-foreground">Confirming your payment…</p>
        </>
      )}

      {state.phase === "success" && (
        <>
          <CheckCircle2 className="h-12 w-12 text-green-600" strokeWidth={2} />
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            Payment successful
          </h1>
          <p className="text-sm text-muted-foreground">
            Your course has been added to your library. You can start learning now.
          </p>
          <div className="mt-2 flex flex-col gap-3">
            <Link
              href="/courses"
              className="rounded-full bg-neutral-900 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-neutral-700"
            >
              Go to My Courses
            </Link>
            <Link
              href="/browse-courses"
              className="text-xs font-semibold text-blue-600 underline-offset-4 hover:underline"
            >
              Keep browsing
            </Link>
          </div>
        </>
      )}

      {state.phase === "error" && (
        <>
          <h1 className="text-xl font-bold tracking-tight text-foreground">
            Payment could not be confirmed
          </h1>
          <p className="text-sm text-red-600">{state.message}</p>
          <Link
            href="/browse-courses"
            className="rounded-full bg-neutral-900 px-6 py-3 text-sm font-bold text-white transition-colors hover:bg-neutral-700"
          >
            Back to courses
          </Link>
        </>
      )}
    </div>
  );
}
