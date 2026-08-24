import Link from "next/link";

import type { ProgressEntry } from "@/actions/progress";
import type { Lab } from "@/types/lab";

const STATUS_LABEL: Record<string, string> = {
  completed: "Completed",
  in_progress: "In progress",
  not_started: "Not started",
};

export default function LabsBlock({
  entries,
  labsById,
}: {
  entries: ProgressEntry[];
  labsById: Map<string, Lab>;
}) {
  if (entries.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        No lab activity yet. Open a lab to start tracking progress here.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-zinc-100 rounded-xl border border-zinc-200 bg-card">
      {entries.map((entry) => {
        const lab = labsById.get(entry.lab_id);
        const title = lab?.title ?? "Lab";
        const href = "/labs";

        return (
          <li key={entry.lab_id} className="flex items-center gap-4 px-5 py-4">
            <div className="min-w-0 flex-1">
              <Link href={href} className="block truncate text-sm font-medium text-foreground hover:underline">
                {title}
              </Link>
              <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                {STATUS_LABEL[entry.status] ?? entry.status} · {entry.completed_steps}/{entry.total_steps} steps
                {entry.completed_at ? ` · ${formatDate(entry.completed_at)}` : ""}
              </p>
            </div>

            <div className="flex w-28 shrink-0 items-center gap-3">
              <div className="h-1 flex-1 overflow-hidden rounded-full bg-zinc-200">
                <div
                  className="h-full rounded-full bg-zinc-900"
                  style={{ width: `${entry.progress_percent}%` }}
                />
              </div>
              <span className="w-8 text-right text-xs tabular-nums text-muted-foreground">
                {entry.progress_percent}%
              </span>
            </div>
          </li>
        );
      })}
    </ul>
  );
}

function formatDate(iso: string): string {
  const date = new Date(iso);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}
