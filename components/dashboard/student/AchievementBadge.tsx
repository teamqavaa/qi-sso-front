import { Award, Flame, Lock, ShieldCheck, Terminal, type LucideIcon } from "lucide-react";

import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { AchievementBadgeData, AchievementIconName } from "./types";

const iconMap: Record<AchievementIconName, LucideIcon> = {
  award: Award,
  flame: Flame,
  terminal: Terminal,
  shield: ShieldCheck,
};

export function AchievementBadge({ data }: { data: AchievementBadgeData }) {
  const Icon = iconMap[data.icon];
  const earned = data.earned && !data.locked;

  return (
    // Locked badges drop to grayscale so earned ones stand out at a glance.
    <Card
      className={cn(
        "relative rounded-xl",
        earned ? "bg-white" : "bg-zinc-50 opacity-70"
      )}
    >
      {data.locked && (
        <Lock
          aria-hidden
          className="absolute right-3 top-3 size-4 text-muted-foreground"
        />
      )}
      <CardContent className="flex flex-col items-center gap-2 py-5 text-center">
        <span
          className={cn(
            "flex size-10 items-center justify-center rounded-full border",
            earned ? "border-zinc-900 text-zinc-900" : "border-border text-muted-foreground"
          )}
        >
          <Icon className="size-5" strokeWidth={1.5} />
        </span>
        <p className="text-sm font-medium text-foreground">{data.title}</p>
        <p className="text-xs leading-snug text-muted-foreground">{data.detail}</p>
      </CardContent>
    </Card>
  );
}