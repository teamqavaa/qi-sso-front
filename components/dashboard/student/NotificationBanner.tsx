"use client";

import { useState } from "react";
import { X } from "lucide-react";

import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { NotificationBannerData } from "./types";

export function NotificationBanner({
  data,
  onDismiss,
  className,
}: {
  data: NotificationBannerData;
  onDismiss?: () => void;
  className?: string;
}) {
  const [dismissed, setDismissed] = useState(false);

  if (dismissed) return null;

  // Rows of avatar and actions collapse to a stack on phones so the message
  // keeps full width instead of squeezing into a sliver.
  return (
    <Card className={cn("flex-col items-stretch gap-3 rounded-xl bg-zinc-50 px-4 py-3 sm:flex-row sm:items-center", className)}>
      <Badge variant="secondary" className="h-5 rounded-md font-mono text-[11px]">
        {data.count}
      </Badge>
      <Avatar className="size-8">
        <AvatarFallback className="text-xs">{data.initials}</AvatarFallback>
      </Avatar>
      <p className="min-w-0 flex-1 text-sm text-foreground/80">{data.message}</p>
      <div className="flex shrink-0 items-center gap-2 sm:ml-auto">
        <Button size="sm">{data.ctaLabel}</Button>
        <Button
          type="button"
          size="icon-sm"
          variant="ghost"
          onClick={() => {
            setDismissed(true);
            onDismiss?.();
          }}
          aria-label="Dismiss notification"
          className="shrink-0 rounded-full text-muted-foreground hover:text-foreground"
        >
          <X className="size-4" />
        </Button>
      </div>
    </Card>
  );
}