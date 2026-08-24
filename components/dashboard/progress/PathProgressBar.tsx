import Link from "next/link";

import type { DerivedStep } from "@/lib/path-status";

const SEGMENT_CLASS: Record<DerivedStep["state"], string> = {
  completed: "bg-zinc-900",
  in_progress: "bg-zinc-500",
  upcoming: "bg-zinc-200",
  locked: "bg-zinc-200",
};

export default function PathProgressBar({
  title,
  kind,
  slug,
  steps,
}: {
  title: string;
  kind: "career" | "skill";
  slug: string;
  steps: DerivedStep[];
}) {
  const completed = steps.filter((step) => step.state === "completed").length;

  return (
    <Link
      href={`/learning-path/${kind}/${slug}`}
      className="block rounded-xl border border-zinc-200 bg-card p-5 transition-colors hover:border-zinc-300"
    >
      <div className="flex items-baseline justify-between gap-4">
        <p className="truncate text-sm font-semibold text-foreground">{title}</p>
        <p className="shrink-0 text-xs text-muted-foreground">
          {completed} of {steps.length} courses
        </p>
      </div>

      <div className="mt-3 flex h-2 w-full gap-0.5 overflow-hidden rounded-full">
        {steps.map((step) => (
          <span
            key={step.course.id}
            aria-hidden
            className={`h-full flex-1 ${SEGMENT_CLASS[step.state]}`}
          />
        ))}
      </div>

      <div className="mt-2 flex items-center justify-between gap-4">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          {kind} path
        </span>
        <span className="text-xs font-medium text-foreground underline-offset-4 group-hover:underline">
          View the full path &rarr;
        </span>
      </div>
    </Link>
  );
}
