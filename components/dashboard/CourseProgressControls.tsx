"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";

import {
  completeCourseAction,
  startCourseAction,
  uncompleteCourseAction,
} from "@/actions/course-progress";
import type { ProgressStatus } from "@/actions/course-progress";

export function CourseProgressControls({
  courseId,
  initialStatus,
}: {
  courseId: number;
  initialStatus: ProgressStatus;
}) {
  const router = useRouter();
  const [status, setStatus] = useState<ProgressStatus>(initialStatus);
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  function run(action: () => Promise<{ ok: boolean; error: string | null }>, next: ProgressStatus) {
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

  return (
    <div className="flex flex-wrap items-center gap-3">
      {status === "not_started" && (
        <button
          type="button"
          disabled={pending}
          onClick={() => run(() => startCourseAction(courseId), "in_progress")}
          className="rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-50"
        >
          Start course
        </button>
      )}

      {status === "in_progress" && (
        <>
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            IN PROGRESS
          </span>
          <button
            type="button"
            disabled={pending}
            onClick={() => run(() => completeCourseAction(courseId), "completed")}
            className="rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700 disabled:opacity-50"
          >
            Mark complete
          </button>
        </>
      )}

      {status === "completed" && (
        <>
          <span className="flex items-center gap-2 rounded-full bg-green-100 px-3 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-green-800">
            <CheckGlyph /> COMPLETED
          </span>
          <button
            type="button"
            disabled={pending}
            onClick={() => run(() => uncompleteCourseAction(courseId), "in_progress")}
            className="text-xs text-muted-foreground underline-offset-4 hover:underline disabled:opacity-50"
          >
            Undo completion
          </button>
        </>
      )}

      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}

function CheckGlyph() {
  return (
    <svg viewBox="0 0 24 24" className="size-3" fill="none" stroke="currentColor" strokeWidth="3">
      <path d="M20 6 9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
