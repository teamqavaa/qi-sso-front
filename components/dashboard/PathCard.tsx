import type { LucideIcon } from "lucide-react";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function PathCard({
  icon: Icon,
  title,
  description,
  courseCount,
  weekCount,
  href,
  className,
}: {
  icon: LucideIcon;
  title: string;
  description: string;
  courseCount: number;
  weekCount: number;
  href: string;
  className?: string;
}) {
  return (
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
        {courseCount} COURSES · {weekCount} WEEKS
      </p>

      <Button asChild variant="default" className="w-full rounded-full py-2.5">
        <Link href={href}>View Path</Link>
      </Button>
    </div>
  );
}