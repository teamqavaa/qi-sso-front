"use client";

import { BookOpen, Check } from "lucide-react";
import Link from "next/link";

import { Badge } from "@/components/ui/badge";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import type { ProgressStatus } from "@/actions/course-progress";
import type { Course } from "@/types/course";
import { cn } from "@/lib/utils";

export type CardProgress = {
  status: ProgressStatus;
  percent: number;
};

export default function CourseCard({
  course,
  className,
  progress,
}: {
  course: Course;
  className?: string;
  progress?: CardProgress;
}) {
  return (
    <TooltipProvider delayDuration={250}>
      <Tooltip>
        <TooltipTrigger asChild>
          <Link
            href={`/courses/${course.slug}`}
            className={cn(
              "group flex flex-col overflow-hidden rounded-xl border border-zinc-200 bg-card transition-colors hover:border-zinc-300",
              className
            )}
          >
            <div className="flex aspect-video items-center justify-center border-b border-zinc-200 bg-white">
              {course.thumbnail ? (
                // eslint-disable-next-line @next/next/no-img-element -- thumbnails point to arbitrary hosts; next/image would need remotePatterns config
                <img src={course.thumbnail} alt="" className="h-full w-full object-cover" />
              ) : (
                <BookOpen size={32} strokeWidth={1.5} className="text-muted-foreground" />
              )}
            </div>

            <div className="flex flex-1 flex-col gap-2 p-5">
              <div className="flex items-center gap-2">
                <Badge variant="outline" className="text-muted-foreground capitalize">
                  {course.level}
                </Badge>
                <Badge variant="outline" className="text-muted-foreground uppercase">
                  {course.language}
                </Badge>
              </div>

              <h3 className="text-sm font-semibold leading-snug tracking-tight text-foreground">
                {course.title}
              </h3>
              <p className="line-clamp-2 text-sm leading-relaxed text-muted-foreground">
                {course.subtitle}
              </p>
              {course.instructor && (
                <p className="text-xs text-muted-foreground">By {course.instructor}</p>
              )}

              <div className="mt-auto flex flex-col gap-2 pt-3">
                {progress?.status === "in_progress" && (
                  <div>
                    <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                      <span>Progress</span>
                      <span>{progress.percent}%</span>
                    </div>
                    {/* Plain div keeps full control over the bar colors per state. */}
                    <div aria-hidden className="mt-1 h-1.5 overflow-hidden rounded-full bg-zinc-200">
                      <div
                        className="h-full rounded-full bg-zinc-900"
                        style={{ width: `${Math.min(100, Math.max(0, progress.percent))}%` }}
                      />
                    </div>
                  </div>
                )}
                {progress?.status === "completed" && (
                  <div>
                    <div className="flex items-center justify-between font-mono text-[10px] uppercase tracking-widest text-green-700">
                      <span className="inline-flex items-center gap-1">
                        <Check size={10} strokeWidth={3} /> Completed
                      </span>
                      <span>100%</span>
                    </div>
                    <div aria-hidden className="mt-1 h-1.5 overflow-hidden rounded-full bg-zinc-200">
                      <div className="h-full w-full rounded-full bg-green-600" />
                    </div>
                  </div>
                )}

                <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground group-hover:text-foreground">
                  View Course →
                </span>
              </div>
            </div>
          </Link>
        </TooltipTrigger>
        <TooltipContent>{course.description}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
