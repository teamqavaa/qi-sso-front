import Link from "next/link";

import { formatRelativeTime } from "@/lib/format";

export type ActivityEvent = {
  id: string;
  label: string;
  kind: "course" | "lab" | "path";
  detail: string;
  at: string; // ISO timestamp
  href: string;
};

const KIND_LABEL: Record<ActivityEvent["kind"], string> = {
  course: "Course",
  lab: "Lab",
  path: "Path",
};

export default function RecentActivityStrip({ events }: { events: ActivityEvent[] }) {
  if (events.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Activity shows up here once you start a course or a lab.
      </p>
    );
  }

  return (
    <ul className="divide-y divide-zinc-100 rounded-xl border border-zinc-200 bg-card">
      {events.map((event) => (
        <li key={event.id} className="flex items-center gap-4 px-5 py-3.5">
          <span className="w-12 shrink-0 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            {KIND_LABEL[event.kind]}
          </span>
          <div className="min-w-0 flex-1">
            <Link
              href={event.href}
              className="block truncate text-sm font-medium text-foreground hover:underline"
            >
              {event.label}
            </Link>
            {event.detail && (
              <p className="truncate text-xs text-muted-foreground">{event.detail}</p>
            )}
          </div>
          <span className="shrink-0 text-xs text-muted-foreground">
            {formatRelativeTime(event.at)}
          </span>
        </li>
      ))}
    </ul>
  );
}
