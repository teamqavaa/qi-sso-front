"use client";

import { useState } from "react";

import type { ProgressEntry } from "@/actions/progress";
import CourseCard from "@/components/dashboard/CourseCard";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { Course } from "@/types/course";
import type { Lab } from "@/types/lab";

import CompletedGrid from "@/components/dashboard/progress/CompletedGrid";
import LabsBlock from "@/components/dashboard/progress/LabsBlock";
import PathProgressBar from "@/components/dashboard/progress/PathProgressBar";
import RecentActivityStrip, {
  type ActivityEvent,
} from "@/components/dashboard/progress/RecentActivityStrip";

export type ProgressStatusFilter = "all" | "in_progress" | "completed";

type KindFilter = "all" | "paths" | "labs" | "courses";

// Slimmed path row; state is precomputed so the client never re-derives it.
export type BrowserPath = {
  title: string;
  kind: "career" | "skill";
  slug: string;
  state: "in_progress" | "completed";
  steps: Parameters<typeof PathProgressBar>[0]["steps"];
};

const STATUS_TABS: { value: ProgressStatusFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "in_progress", label: "In Progress" },
  { value: "completed", label: "Completed" },
];

// Radix fails to bubble the chosen item's text into the trigger in this
// setup, so the trigger renders its label from this array directly.
const KIND_OPTIONS: { value: KindFilter; label: string }[] = [
  { value: "all", label: "All" },
  { value: "paths", label: "Paths" },
  { value: "labs", label: "Labs" },
  { value: "courses", label: "Courses" },
];

const KIND_LABEL: Record<ActivityEvent["kind"], Exclude<KindFilter, "all">> = {
  course: "courses",
  lab: "labs",
  path: "paths",
};

function SectionLabel({ children }: { children: string }) {
  return (
    <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
      {children}
    </h2>
  );
}

export default function ProgressBrowser({
  paths,
  inFlightCourses,
  completedCourses,
  labEntries,
  labsById,
  activity,
}: {
  paths: BrowserPath[];
  inFlightCourses: { course: Course; percent: number }[];
  completedCourses: Course[];
  labEntries: ProgressEntry[];
  labsById: Map<string, Lab>;
  activity: ActivityEvent[];
}) {
  const [status, setStatus] = useState<ProgressStatusFilter>("all");
  const [kind, setKind] = useState<KindFilter>("all");

  const statusMatches = (value: "completed" | "in_progress") =>
    status === "all" || value === status;

  const kindIncludes = (target: Exclude<KindFilter, "all">) =>
    kind === "all" || kind === target;

  const visiblePaths = paths.filter((path) => statusMatches(path.state));
  const showPaths =
    kindIncludes("paths") && visiblePaths.length > 0;

  // In-flight rows are in-progress by definition; they vanish on "Completed".
  const showInFlight =
    kindIncludes("courses") &&
    status !== "completed" &&
    inFlightCourses.length > 0;

  const showCompletedCourses =
    kindIncludes("courses") &&
    status !== "in_progress" &&
    completedCourses.length > 0;

  // Anything not finished counts as in-progress here.
  const visibleLabEntries = labEntries.filter((entry) =>
    statusMatches(entry.status === "completed" ? "completed" : "in_progress")
  );
  const showLabs =
    kindIncludes("labs") && visibleLabEntries.length > 0;

  const visibleActivity = activity.filter(
    (event) => statusMatches(event.status) && kindIncludes(KIND_LABEL[event.kind])
  );
  const showActivity = visibleActivity.length > 0;

  const nothingVisible =
    !showPaths &&
    !showInFlight &&
    !showLabs &&
    !showActivity &&
    !showCompletedCourses;

  return (
    <div className="space-y-10">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div
          role="group"
          aria-label="Filter by status"
          className="inline-flex items-center gap-1 rounded-full border border-zinc-200 bg-white p-1"
        >
          {STATUS_TABS.map((tab) => (
            <button
              key={tab.value}
              type="button"
              aria-pressed={status === tab.value}
              onClick={() => setStatus(tab.value)}
              className={cn(
                "rounded-full px-4 py-1.5 text-sm font-medium transition-colors",
                status === tab.value
                  ? "bg-zinc-900 text-white"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        <Select value={kind} onValueChange={(value) => setKind(value as KindFilter)}>
          <SelectTrigger aria-label="Filter by type" className="w-36 rounded-full bg-white">
            <span data-slot="select-value">
              {KIND_OPTIONS.find((option) => option.value === kind)?.label}
            </span>
          </SelectTrigger>
          <SelectContent>
            {KIND_OPTIONS.map((option) => (
              <SelectItem key={option.value} value={option.value}>
                {option.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {nothingVisible ? (
        <p className="rounded-xl border border-dashed border-zinc-300 p-8 text-center text-sm text-muted-foreground">
          Nothing matches these filters yet.
        </p>
      ) : (
        <>
          {showPaths && (
            <section>
              <SectionLabel>Learning paths</SectionLabel>
              <div className="mt-3 grid grid-cols-1 gap-3 lg:grid-cols-2">
                {visiblePaths.map(({ title, kind: pathKind, slug, steps }) => (
                  <PathProgressBar
                    key={slug}
                    title={title}
                    kind={pathKind}
                    slug={slug}
                    steps={steps}
                  />
                ))}
              </div>
            </section>
          )}

          {showInFlight && (
            <section>
              <SectionLabel>In flight</SectionLabel>
              <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {inFlightCourses.map(({ course, percent }) => (
                  <CourseCard
                    key={course.id}
                    course={course}
                    progress={{ status: "in_progress", percent }}
                  />
                ))}
              </div>
            </section>
          )}

          {showLabs && (
            <section>
              <SectionLabel>Labs</SectionLabel>
              <div className="mt-3">
                <LabsBlock entries={visibleLabEntries} labsById={labsById} />
              </div>
            </section>
          )}

          {showActivity && (
            <section>
              <SectionLabel>Recent activity</SectionLabel>
              <div className="mt-3">
                <RecentActivityStrip events={visibleActivity} />
              </div>
            </section>
          )}

          {showCompletedCourses && (
            <section>
              <SectionLabel>Completed courses</SectionLabel>
              <div className="mt-3">
                <CompletedGrid courses={completedCourses} />
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
