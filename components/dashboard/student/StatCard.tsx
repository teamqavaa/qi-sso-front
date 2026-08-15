import { Card, CardContent } from "@/components/ui/card";
import type { Stat } from "./types";

export function StatCard({ data }: { data: Stat }) {
  return (
    <Card className="rounded-xl bg-zinc-50">
      <CardContent className="flex flex-col gap-1">
        {/* Mono tracked label matches the brief's eyebrow system for stat labels. */}
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          {data.label}
        </span>
        <span className="text-2xl font-semibold tracking-tight text-foreground">
          {data.value}
        </span>
        <span className="text-xs text-muted-foreground">{data.meta}</span>
      </CardContent>
    </Card>
  );
}