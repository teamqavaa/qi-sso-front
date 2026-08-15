import { ArrowRight } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { UpNextData } from "./types";

export function UpNextCard({
  data,
  className,
}: {
  data: UpNextData;
  className?: string;
}) {
  return (
    // The black panel marks the celebratory CTA; the white button inverts to pop.
    <Card className={cn("bg-zinc-950 text-zinc-50 ring-zinc-50/20", className)}>
      <CardContent className="flex flex-col gap-4">
        <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-zinc-50">
          {data.eyebrow}
        </span>
        <p className="text-sm leading-relaxed text-zinc-50/80">{data.message}</p>

        <div className="flex items-center gap-3">
          <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-zinc-50/10 text-zinc-50">
            <ArrowRight className="size-4" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-zinc-50">
              {data.courseTitle}
            </p>
            <p className="font-mono text-[10px] uppercase tracking-widest text-zinc-50/50">
              {data.courseDuration}
            </p>
          </div>
          <Badge
            variant="outline"
            className="shrink-0 rounded-full border-zinc-50/30 bg-transparent font-mono text-[10px] uppercase tracking-widest text-zinc-50"
          >
            {data.courseTag}
          </Badge>
        </div>

        <div className="flex items-center gap-3">
          <Button className="bg-zinc-50 text-zinc-950 hover:bg-zinc-200">
            {data.ctaLabel}
          </Button>
          <Button
            variant="ghost"
            className="text-zinc-50/70 hover:bg-zinc-50/10 hover:text-zinc-50"
          >
            {data.dismissLabel}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}