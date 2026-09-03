"use client";

import { useMemo, useState } from "react";
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

// "My Courses" is the enrolled-courses list, so filtering and sorting apply
// only to the caller's own enrollments (kept client-side for instant UX).
export default function CoursesBrowser({
  courses,
  initialQuery,
  progressByCourseId,
  hasError,
}: {
  courses: Course[];
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

  return (
    <>
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          My Courses
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Courses you&apos;re enrolled in.
        </p>
        <div className="mt-4 flex flex-col sm:flex-row items-center justify-between gap-3">
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
              placeholder="Search your courses..."
              aria-label="Search your courses"
              className="h-8 w-full sm:w-56 rounded-full bg-zinc-100 pl-8 text-sm"
            />
          </div>

          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="hidden font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground sm:inline">
                Filter
              </span>
              <Select value={level} onValueChange={(value) => setLevel(value as LevelFilter)}>
                <SelectTrigger className="w-full sm:w-[170px]" aria-label="Filter courses by level">
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
                <SelectTrigger className="w-full sm:w-[160px]" aria-label="Sort courses">
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

      {hasError ? (
        <p className="text-sm text-red-600">
          We couldn&apos;t load your courses. Please try again.
        </p>
      ) : courses.length === 0 ? (
        <p className="text-sm text-muted-foreground">
          You aren&apos;t enrolled in any courses yet. Browse the catalog to get
          started.
        </p>
      ) : (
        <>
          {visibleCourses.length === 0 ? (
            <p className="text-sm text-muted-foreground">
              No courses match your search.
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
