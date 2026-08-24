import { getActiveCoursesAction } from "@/actions/courses";
import { getMyProgressAction } from "@/actions/course-progress";
import { getActivePathsAction } from "@/actions/learning-paths";
import CoursesBrowser from "@/components/dashboard/courses/CoursesBrowser";
import type { CardProgress } from "@/components/dashboard/CourseCard";

export default async function CoursesPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const [{ q }, { courses, error }, pathsResult, progressResult] =
    await Promise.all([
      searchParams,
      getActiveCoursesAction(),
      getActivePathsAction(),
      getMyProgressAction(),
    ]);

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
        paths={pathsResult.paths}
        initialQuery={q ?? ""}
        progressByCourseId={progressByCourseId}
        hasError={Boolean(error)}
      />
    </div>
  );
}
