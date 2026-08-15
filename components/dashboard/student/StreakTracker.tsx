import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { StreakData, StreakDayState } from "./types";

const STATE_LABEL: Record<StreakDayState, string> = {
  done: "Practiced",
  today: "In progress",
  upcoming: "Not yet reached",
};

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

      <div className="flex items-center justify-between gap-1">
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
      </div>
      </CardContent>
    </Card>
  );
}