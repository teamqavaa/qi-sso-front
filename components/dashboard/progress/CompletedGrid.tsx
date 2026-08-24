import Link from "next/link";

import type { Course } from "@/types/course";

export default function CompletedGrid({ courses }: { courses: Course[] }) {
  if (courses.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Courses you finish will collect here.
      </p>
    );
  }

  return (
    <ul className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {courses.map((course) => (
        <li key={course.id}>
          <Link
            href={`/courses/${course.slug}`}
            className="block h-full rounded-xl border border-zinc-200 bg-card p-4 transition-colors hover:border-zinc-300"
          >
            <p className="line-clamp-2 text-sm font-medium text-foreground">{course.title}</p>
            <p className="mt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              {course.instructor || course.level}
            </p>
          </Link>
        </li>
      ))}
    </ul>
  );
}
