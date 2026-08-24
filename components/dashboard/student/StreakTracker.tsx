import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { StreakData, StreakDayState } from "./types";

const STATE_LABEL: Record<StreakDayState, string> = {
  done: "Practiced",
  today: "In progress",
  upcoming: "Not yet reached",
};

// Content stays aligned line-for-line with the day dots so the legend reads
// as a true reference for the circles above it.
const LEGEND: { state: StreakDayState; label: string; className: string }[] = [
  { state: "done", label: "Practiced", className: "bg-primary" },
  {
    state: "today",
    label: "Today in progress",
    className: "border-2 border-dashed border-zinc-400",
  },
  { state: "upcoming", label: "Upcoming", className: "bg-zinc-200" },
];

function Legend() {
  return (
    <div className="flex flex-col items-end gap-1.5">
      {LEGEND.map((entry) => (
        <div
          key={entry.state}
          className="flex items-center gap-1.5"
          aria-label={STATE_LABEL[entry.state]}
        >
          <span
            aria-hidden
            className={cn("flex size-2.5 items-center justify-center rounded-full", entry.className)}
          />
          <span className="font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
            {entry.label}
          </span>
        </div>
      ))}
    </div>
  );
}

export function StreakTracker({ data }: { data: StreakData }) {
  return (
    <Card className="rounded-xl">
      <CardContent className="flex flex-col gap-4">
      <div className="flex items-baseline justify-between gap-2">
        <h3 className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          Weekly streak
        </h3>
        <span className="text-sm font-semibold text-foreground">{data.summary}</span>
      </div>

      <div className="flex items-center justify-between gap-1 pr-9">
        {data.days.map((day) => (
          <div
            key={day.label}
            aria-label={`${day.label}: ${STATE_LABEL[day.state]}`}
            className="flex flex-col items-center gap-1.5"
          >
          {/* Filled = practiced, dashed ring = today, gray fill = not yet reached. */}
            <span
              aria-hidden
              className={cn(
                "flex size-7 items-center justify-center rounded-full",
                day.state === "done" && "bg-primary",
                day.state === "today" && "border-2 border-dashed border-zinc-400",
                day.state === "upcoming" && "bg-zinc-200"
              )}
            />
            <span className="font-mono text-[10px] uppercase text-muted-foreground">
              {day.label}
            </span>
          </div>
        ))}
        <Legend />
      </div>
      </CardContent>
    </Card>
  );
}