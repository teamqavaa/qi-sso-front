"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";

import CourseCard, {
  type CardProgress,
} from "@/components/dashboard/CourseCard";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
} from "@/components/ui/select";
import type { LearningPath } from "@/types/career-path";
import type { Course } from "@/types/course";

type LevelFilter = "all" | "beginner" | "intermediate" | "advanced";
type SortKey = "newest" | "title" | "duration" | "rating";

// Radix fails to bubble the chosen item's text into the trigger in this
// setup, so every trigger renders its label from these arrays directly.
const LEVEL_OPTIONS: { value: LevelFilter; label: string }[] = [
  { value: "all", label: "All levels" },
  { value: "beginner", label: "Beginner" },
  { value: "intermediate", label: "Intermediate" },
  { value: "advanced", label: "Advanced" },
];

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: "newest", label: "Newest" },
  { value: "title", label: "Title A–Z" },
  { value: "duration", label: "Shortest first" },
  { value: "rating", label: "Highest rated" },
];

function matchesQuery(haystacks: (string | null)[], query: string): boolean {
  if (!query) return true;
  const needle = query.toLowerCase();
  return haystacks.some((value) => value?.toLowerCase().includes(needle));
}

// Catalog lives fully client-side: the list is small, so filtering and
// sorting stay instant instead of round-tripping through searchParams.
export default function CoursesBrowser({
  courses,
  paths,
  initialQuery,
  progressByCourseId,
  hasError,
}: {
  courses: Course[];
  paths: LearningPath[];
  initialQuery?: string;
  progressByCourseId: Map<number, CardProgress>;
  hasError: boolean;
}) {
  const [level, setLevel] = useState<LevelFilter>("all");
  const [sortBy, setSortBy] = useState<SortKey>("newest");
  const [query, setQuery] = useState(initialQuery ?? "");

  const visibleCourses = useMemo(() => {
    const filtered = courses.filter(
      (course) =>
        (level === "all" || course.level === level) &&
        matchesQuery([course.title, course.subtitle, course.instructor], query)
    );

    const sorted = [...filtered];
    switch (sortBy) {
      case "title":
        sorted.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "duration":
        sorted.sort((a, b) => a.duration_minutes - b.duration_minutes);
        break;
      case "rating":
        sorted.sort((a, b) => (b.rating ?? -1) - (a.rating ?? -1));
        break;
      default:
        // "Newest" trusts the API's default order.
        break;
    }
    return sorted;
  }, [courses, level, sortBy, query]);

  const visiblePaths = useMemo(
    () =>
      paths.filter((path) =>
        matchesQuery([path.title, path.description], query)
      ),
    [paths, query]
  );

  const searching = query.trim().length > 0;

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">Courses</h1>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
          <div className="relative">
            <Search
              size={14}
              strokeWidth={1.5}
              className="absolute top-1/2 left-3 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Search courses and paths..."
              aria-label="Search courses and paths"
              className="h-8 w-56 rounded-full bg-zinc-100 pl-8 text-sm"
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="hidden font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground sm:inline">
                Filter
              </span>
              <Select value={level} onValueChange={(value) => setLevel(value as LevelFilter)}>
                <SelectTrigger className="w-[170px]" aria-label="Filter courses by level">
                  <span data-slot="select-value">
                    {LEVEL_OPTIONS.find((option) => option.value === level)?.label}
                  </span>
                </SelectTrigger>
                <SelectContent>
                  {LEVEL_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center gap-2">
              <span className="hidden font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground sm:inline">
                Sort by
              </span>
              <Select value={sortBy} onValueChange={(value) => setSortBy(value as SortKey)}>
                <SelectTrigger className="w-[160px]" aria-label="Sort courses">
                  <span data-slot="select-value">
                    {SORT_OPTIONS.find((option) => option.value === sortBy)?.label}
                  </span>
                </SelectTrigger>
                <SelectContent>
                  {SORT_OPTIONS.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </div>

      {hasError || courses.length === 0 ? (
        <p className="text-sm text-muted-foreground">No courses available.</p>
      ) : (
        <>
          {searching && visiblePaths.length > 0 && (
            <section className="mb-6">
              <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                Paths
              </h2>
              <div className="mt-2 flex flex-wrap gap-2">
                {visiblePaths.map((path) => (
                  <Link
                    key={path.id}
                    href={`/learning-path/${path.kind}/${path.slug}`}
                    className="flex items-center gap-3 rounded-xl border border-zinc-200 bg-card px-3 py-2 transition-colors hover:border-zinc-300"
                  >
                    <div className="flex flex-col">
                      <span className="font-mono text-[9px] uppercase tracking-[0.2em] text-muted-foreground">
                        {path.kind} path · {path.course_count} courses
                      </span>
                      <span className="text-sm font-medium text-foreground">
                        {path.title}
                      </span>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          )}

          {visibleCourses.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No courses or paths match your search.
            </p>
          ) : (
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {visibleCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  progress={progressByCourseId.get(course.id)}
                />
              ))}
            </div>
          )}
        </>
      )}
    </>
  );
}
