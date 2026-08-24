import { Calendar, Clock, Star } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { cn } from "@/lib/utils";
import type { ContinueCardData } from "./types";

const metaIconMap = {
  clock: Clock,
  star: Star,
  calendar: Calendar,
};

export function ContinueCard({
  data,
  className,
  onPrimaryClick,
  onSecondaryClick,
}: {
  data: ContinueCardData;
  className?: string;
  onPrimaryClick?: () => void;
  onSecondaryClick?: () => void;
}) {
  return (
    <Card className={cn("rounded-2xl bg-white", className)}>
      <CardHeader className="grid gap-3">
        {/* Outline pills keep tags quiet; the design uses no filled color chips. */}
        <div className="flex flex-wrap gap-1.5">
          {data.tags.map((tag) => (
            <Badge
              key={tag}
              variant="outline"
              className="rounded-full bg-transparent font-mono text-[10px] uppercase tracking-widest"
            >
              {tag}
            </Badge>
          ))}
        </div>
        <CardTitle className="text-lg font-semibold tracking-tight">
          {data.title}
        </CardTitle>
        <CardDescription>{data.description}</CardDescription>
      </CardHeader>

      <CardContent className="flex flex-col gap-2">
        <div className="flex items-baseline justify-between">
          <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            {data.progressLabel}
          </span>
          <span className="font-mono text-[10px] tabular-nums text-muted-foreground">
            {data.progress}%
          </span>
        </div>
        <Progress
          value={data.progress}
          aria-label={data.progressLabel}
          className="h-1.5"
        />
        <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
          {data.meta.map((meta) => {
            const Icon = metaIconMap[meta.icon];
            return (
              <span key={meta.text} className="inline-flex items-center gap-1.5">
                <Icon className="size-3.5" />
                {meta.text}
              </span>
            );
          })}
        </div>
      </CardContent>

      <CardFooter className="justify-start gap-2 border-0 bg-transparent">
        <Button type="button" onClick={onPrimaryClick}>{data.primaryCta}</Button>
        <TooltipProvider delayDuration={250}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button type="button" variant="outline" onClick={onSecondaryClick}>
                {data.secondaryCta}
              </Button>
            </TooltipTrigger>
            <TooltipContent>{data.description}</TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardFooter>
    </Card>
  );
}