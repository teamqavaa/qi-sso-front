"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Check } from "lucide-react";

import {
  completeCourseAction,
  startCourseAction,
  uncompleteCourseAction,
} from "@/actions/course-progress";
import type { ProgressStatus } from "@/actions/course-progress";

export default function PurchaseCard({
  courseId,
  price,
  originalPrice,
  cohortLabel,
  includedItems,
  initialStatus,
}: {
  courseId: number;
  price: string;
  originalPrice: string | null;
  cohortLabel: string;
  includedItems: string[];
  initialStatus: ProgressStatus;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<ProgressStatus>(initialStatus);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const current = Number(price) || 0;
  const original = originalPrice != null ? Number(originalPrice) : null;
  const discountPercent =
    original && original > current ? Math.round((1 - current / original) * 100) : null;

  function run(
    action: () => Promise<{ ok: boolean; error: string | null }>,
    next: ProgressStatus
  ) {
    setError(null);
    startTransition(async () => {
      const result = await action();
      if (result.ok) {
        setStatus(next);
        router.refresh();
      } else {
        setError(result.error ?? "Something went wrong.");
      }
    });
  }

  function scrollToCurriculum() {
    document.getElementById("curriculum")?.scrollIntoView({ behavior: "smooth" });
  }

  return (
    <div className="rounded-xl border border-zinc-200 bg-white p-6">
      <div className="flex items-baseline gap-3">
        <span className="text-3xl font-bold tracking-tight text-foreground">
          ${price.replace(/\.00$/, "")}
        </span>
        {original != null && (
          <span className="text-base text-muted-foreground line-through">
            ${originalPrice?.replace(/\.00$/, "")}
          </span>
        )}
      </div>

      {/* Reserved accent color: the only non-monochrome element on the page. */}
      {(discountPercent != null || cohortLabel) && (
        <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-[#b45309]">
          {discountPercent != null ? `${discountPercent}% off` : ""}
          {discountPercent != null && cohortLabel ? " · " : ""}
          {cohortLabel}
        </p>
      )}

      <div className="mt-5">
        {status === "not_started" && (
          <button
            type="button"
            disabled={pending}
            onClick={() => run(() => startCourseAction(courseId), "in_progress")}
            className="w-full rounded-full bg-zinc-900 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-zinc-700 disabled:opacity-50"
          >
            Enroll now
          </button>
        )}

        {status === "in_progress" && (
          <>
            <button
              type="button"
              disabled={pending}
              onClick={scrollToCurriculum}
              className="w-full rounded-full bg-zinc-900 px-5 py-3 text-sm font-bold text-white transition-colors hover:bg-zinc-700 disabled:opacity-50"
            >
              Continue learning
            </button>
            <button
              type="button"
              disabled={pending}
              onClick={() => run(() => completeCourseAction(courseId), "completed")}
              className="mt-3 w-full text-xs text-muted-foreground underline-offset-4 hover:underline disabled:opacity-50"
            >
              Mark course complete
            </button>
          </>
        )}

        {status === "completed" && (
          <>
            <span className="flex w-full items-center justify-center gap-2 rounded-full border border-zinc-200 bg-zinc-100 px-5 py-3 text-sm font-bold text-foreground">
              <Check size={16} strokeWidth={2.5} /> Completed
            </span>
            <button
              type="button"
              disabled={pending}
              onClick={() => run(() => uncompleteCourseAction(courseId), "in_progress")}
              className="mt-3 w-full text-xs text-muted-foreground underline-offset-4 hover:underline disabled:opacity-50"
            >
              Undo completion
            </button>
          </>
        )}
        {error && <p className="mt-2 text-xs text-red-600">{error}</p>}
      </div>

      <p className="mt-6 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        What&apos;s included
      </p>
      <ul className="mt-3 space-y-2.5">
        {includedItems.map((item) => (
          <li key={item} className="flex items-start gap-2 text-sm leading-relaxed text-foreground">
            <Check size={14} strokeWidth={2.5} className="mt-1 shrink-0" aria-hidden />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}
