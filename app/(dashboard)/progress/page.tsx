import Link from "next/link";

import { getActiveCoursesAction } from "@/actions/courses";
import { getMyCourseStatsAction } from "@/actions/course-stats";
import {
  buildProgressMap,
  deriveSteps,
} from "@/lib/path-status";
import { getMyProgressAction } from "@/actions/course-progress";
import { getProgressAction } from "@/actions/progress";
import { getStatsAction } from "@/actions/stats";
import { getLabsAction } from "@/actions/labs";
import { getActivePathsAction } from "@/actions/learning-paths";
import { getPathDetailAction } from "@/actions/path-detail";
import ProgressBrowser from "@/components/dashboard/progress/ProgressBrowser";
import ProgressHeaderBand from "@/components/dashboard/progress/ProgressHeaderBand";
import type { ActivityEvent } from "@/components/dashboard/progress/RecentActivityStrip";

export default async function ProgressPage() {
  // Courses, paths, progress and lab data are independent reads.
  const [coursesRes, pathsRes, progressRes, courseStats, labEntries, labStats, labsRes] =
    await Promise.all([
      getActiveCoursesAction(),
      getActivePathsAction(),
      getMyProgressAction(),
      getMyCourseStatsAction(),
      getProgressAction(),
      getStatsAction(),
      getLabsAction(),
    ]);

  const coursesById = new Map(coursesRes.courses.map((course) => [course.id, course]));
  const labsById = new Map(labsRes.labs.map((lab) => [lab.id, lab]));
  const progressByCourseId = buildProgressMap(progressRes.progress);

  // Path membership only exists on the detail endpoint; resolve every active
  // path in parallel (local API) and keep the ones the user has touched.
  const touchedPaths = (
    await Promise.all(
      pathsRes.paths.map(async (path) => {
        const { detail } = await getPathDetailAction(path.id);
        if (!detail || detail.courses.length === 0) return null;
        const steps = deriveSteps(detail.courses, progressByCourseId);
        const touched = steps.some((step) => step.state !== "upcoming" && step.state !== "locked");
        if (!touched) return null;
        return { path: detail, steps };
      })
    )
  ).filter((row): row is NonNullable<typeof row> => row !== null);

  // Most-advanced path first.
  touchedPaths.sort((a, b) => {
    const done = (row: typeof a) => row.steps.filter((s) => s.state === "completed").length;
    return done(b) - done(a);
  });

  const inFlight = progressRes.progress
    .filter((row) => row.status === "in_progress" && coursesById.has(row.course_id))
    .sort((a, b) => (b.updated_at ?? "").localeCompare(a.updated_at ?? ""));

  const completedCourses = progressRes.progress
    .filter((row) => row.status === "completed" && coursesById.has(row.course_id))
    .sort((a, b) => (b.completed_at ?? "").localeCompare(a.completed_at ?? ""))
    .map((row) => coursesById.get(row.course_id)!);

  const labRows = labEntries
    .filter((entry) => labsById.has(entry.lab_id))
    .sort((a, b) => {
      if ((a.status === "in_progress") !== (b.status === "in_progress")) {
        return a.status === "in_progress" ? -1 : 1;
      }
      return (b.completed_at ?? "").localeCompare(a.completed_at ?? "");
    });

  const activity: ActivityEvent[] = [
    ...progressRes.progress
      .filter((row) => coursesById.has(row.course_id))
      .map((row) => ({
        id: `course-${row.course_id}`,
        label: coursesById.get(row.course_id)!.title,
        kind: "course" as const,
        detail:
          row.status === "completed"
            ? "Completed"
            : `${Math.round(row.progress_percent)}% complete`,
        at: row.completed_at ?? row.updated_at ?? "",
        href: `/courses/${coursesById.get(row.course_id)!.slug}`,
        status:
          row.status === "completed"
            ? ("completed" as const)
            : ("in_progress" as const),
      })),
    ...labEntries
      .filter((entry) => labsById.has(entry.lab_id) && entry.completed_at)
      .map((entry) => ({
        id: `lab-${entry.lab_id}`,
        label: labsById.get(entry.lab_id)!.title,
        kind: "lab" as const,
        detail:
          entry.status === "completed"
            ? "Completed"
            : `${entry.completed_steps}/${entry.total_steps} steps`,
        at: entry.completed_at as string,
        href: "/labs",
        status: "completed" as const,
      })),
  ]
    .filter((event) => event.at)
    .sort((a, b) => b.at.localeCompare(a.at))
    .slice(0, 6);

  const browserPaths = touchedPaths.map(({ path, steps }) => ({
    title: path.title,
    kind: path.kind,
    slug: path.slug,
    state: steps.every((step) => step.state === "completed")
      ? ("completed" as const)
      : ("in_progress" as const),
    steps,
  }));

  const inFlightCourses = inFlight.map((row) => ({
    course: coursesById.get(row.course_id)!,
    percent: row.progress_percent,
  }));

  const nothingTouched =
    touchedPaths.length === 0 &&
    inFlight.length === 0 &&
    completedCourses.length === 0 &&
    labRows.length === 0;

  return (
    <div className="mx-auto w-full max-w-5xl px-8 py-10">
      <h1 className="text-2xl font-semibold tracking-tight text-foreground">Progress</h1>

      {(progressRes.error || coursesRes.error) && (
        <p className="mt-3 text-xs text-red-600">
          Some progress data could not be loaded right now.
        </p>
      )}

      <div className="mt-6 space-y-10">
        <ProgressHeaderBand
          pathsCompleted={courseStats.paths_completed}
          pathsStarted={courseStats.paths_started}
          coursesCompleted={courseStats.courses_completed}
          coursesInProgress={courseStats.courses_in_progress}
          labsCompleted={labStats.labs_completed}
          currentStreak={labStats.current_streak}
        />

        {nothingTouched ? (
          <section className="rounded-xl border border-dashed border-zinc-300 p-8 text-center">
            <p className="text-sm font-medium text-foreground">
              Nothing to measure yet.
            </p>
            <p className="mx-auto mt-2 max-w-md text-sm text-muted-foreground">
              Start a course or a lab and this page fills up with paths, streaks
              and completed work.
            </p>
            <div className="mt-5 flex items-center justify-center gap-3">
              <Link
                href="/courses"
                className="rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700"
              >
                Browse courses
              </Link>
              <Link
                href="/labs"
                className="rounded-full border border-zinc-300 px-5 py-2.5 text-sm font-medium text-foreground transition-colors hover:border-zinc-400"
              >
                Explore labs
              </Link>
            </div>
          </section>
        ) : (
          <ProgressBrowser
            paths={browserPaths}
            inFlightCourses={inFlightCourses}
            completedCourses={completedCourses}
            labEntries={labRows}
            labsById={labsById}
            activity={activity}
          />
        )}
      </div>
    </div>
  );
}
