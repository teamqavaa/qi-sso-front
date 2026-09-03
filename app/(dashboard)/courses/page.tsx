import { getMyEnrollmentsAction } from "@/actions/enrollments";
import { getMyProgressAction } from "@/actions/course-progress";
import CoursesBrowser from "@/components/dashboard/courses/CoursesBrowser";
import type { CardProgress } from "@/components/dashboard/CourseCard";

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const [{ q }, { enrollments, error }, progressResult] = await Promise.all([
    searchParams,
    getMyEnrollmentsAction(),
    getMyProgressAction(),
  ]);

  // Enrolled courses come from the enrollment records; their numeric primary
  // key matches the progress rows' `course_id`, so progress bars line up.
  const courses = enrollments.map((enrollment) => enrollment.course_details);

  // Guests produce an empty map, so every card renders without a bar.
  const progressByCourseId = new Map<number, CardProgress>();
  for (const row of progressResult.progress) {
    if (row.status === "not_started") continue;
    progressByCourseId.set(row.course_id, {
      status: row.status,
      percent: row.progress_percent,
    });
  }

  return (
    <div className="px-8 py-10 max-w-5xl mx-auto w-full">
      <CoursesBrowser
        courses={courses}
        initialQuery={q ?? ""}
        progressByCourseId={progressByCourseId}
        hasError={Boolean(error)}
      />
    </div>
  );
}
