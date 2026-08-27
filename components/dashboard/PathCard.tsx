"use client";

import { BookOpen, type LucideIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  careerPathIcons,
  skillPathIcons,
} from "@/components/dashboard/path-icons";
import type { PathKind } from "@/types/career-path";
import { cn } from "@/lib/utils";

export function PathCard({
  icon,
  kind,
  title,
  description,
  courseCount,
  labCount = 0,
  weekCount,
  href,
  className,
}: {
  icon: string;
  kind: PathKind;
  title: string;
  description: string;
  courseCount: number;
  labCount?: number;
  weekCount: number;
  href: string;
  className?: string;
}) {
  // Map lookup mirrors the codebase's icon-selection idiom; a function call
  // here would create a component during render.
  const Icon: LucideIcon =
    (kind === "skill" ? skillPathIcons : careerPathIcons)[icon] ?? BookOpen;

  return (
    <TooltipProvider delayDuration={250}>
      <Tooltip>
        <TooltipTrigger asChild>
          <div
            className={cn(
              "group flex flex-col gap-4 rounded-xl border border-zinc-200 bg-card p-6",
              className
            )}
          >
            <div className="flex size-16 items-center justify-center rounded-lg border border-zinc-200 bg-white">
              <Icon size={28} strokeWidth={1.5} />
            </div>

            <div className="flex flex-col gap-1">
              <h3 className="text-base font-semibold tracking-tight text-foreground">
                {title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {description}
              </p>
            </div>

            <p className="mt-auto pt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              {kind === "skill"
                ? `${labCount} LAB${labCount === 1 ? "" : "S"}`
                : `${courseCount} COURSES${weekCount > 0 ? ` · ${weekCount} WEEKS` : ""}`}
            </p>

            <Button asChild variant="default" className="w-full rounded-full py-2.5">
              <Link href={href}>
                {kind === "skill" ? "Learn Skill" : "View Path"}
              </Link>
            </Button>
          </div>
        </TooltipTrigger>
        <TooltipContent>{description}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}