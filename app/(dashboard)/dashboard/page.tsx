import { getActiveCoursesAction } from "@/actions/courses";
import { getMyCourseStatsAction } from "@/actions/course-stats";
import {
  getMyProgressAction,
  type CourseProgressEntry,
} from "@/actions/course-progress";
import { getMyRecommendationAction } from "@/actions/recommendation";
import { getStatsAction } from "@/actions/stats";
import StudentDashboard from "@/components/dashboard/views/StudentDashboard";
import type {
  ContinueMeta,
  ContinueSectionData,
  FeaturedRecommendationData,
  LessonRowData,
} from "@/components/dashboard/student/types";
import { formatDuration, formatRelativeTime } from "@/lib/format";
import type { Course } from "@/types/course";

import { buildDashboardData } from "./data";

const KEEP_GOING_ROW_LIMIT = 4;
const SUGGESTION_LIMIT = 3;

function buildActiveSection(
  rows: CourseProgressEntry[],
  coursesById: Map<number, Course>
): ContinueSectionData | null {
  const inProgress = rows
    .filter((row) => row.status === "in_progress")
    .filter((row) => coursesById.has(row.course_id));
  const featured = inProgress[0];
  if (!featured) return null;

  const course = coursesById.get(featured.course_id)!;
  const remainingMinutes = Math.max(
    0,
    Math.round((course.duration_minutes * (100 - featured.progress_percent)) / 100)
  );
  const meta: ContinueMeta[] = [
    ...(remainingMinutes > 0
      ? [{ icon: "clock" as const, text: `${formatDuration(remainingMinutes)} left` }]
      : []),
    ...(course.instructor ? [{ icon: "star" as const, text: course.instructor }] : []),
    ...(featured.updated_at
      ? [{ icon: "calendar" as const, text: `Last opened ${formatRelativeTime(featured.updated_at)}` }]
      : []),
  ];

  const keepGoingRows: LessonRowData[] = inProgress
    .slice(1, KEEP_GOING_ROW_LIMIT)
    .map((row) => {
      const rowCourse = coursesById.get(row.course_id)!;
      return {
        title: rowCourse.title,
        kind: rowCourse.level,
        progress: row.progress_percent,
        href: `/courses/${rowCourse.slug}`,
      };
    });

  return {
    kind: "active",
    cardHref: `/courses/${course.slug}`,
    card: {
      tags: [course.level, course.language.toUpperCase()],
      title: course.title,
      description: course.subtitle || course.description,
      progress: featured.progress_percent,
      progressLabel: "Progress",
      meta,
      primaryCta: "Continue",
      secondaryCta: "Details",
    },
    rows: keepGoingRows,
  };
}

function buildEmptySection(
  courses: Course[],
  touchedIds: Set<number>,
  featured: FeaturedRecommendationData | null
): ContinueSectionData {
  const untouched = courses.filter((course) => !touchedIds.has(course.id));
  const pool = untouched.length > 0 ? untouched : [...courses];
  const suggestions = [...pool]
    .sort(() => Math.random() - 0.5)
    .slice(0, SUGGESTION_LIMIT)
    .map((course) => ({
      title: course.title,
      kind: course.level,
      duration: formatDuration(course.duration_minutes),
      href: `/courses/${course.slug}`,
    }));

  return {
    kind: "empty",
    featured,
    title: "You haven't started any course yet",
    message:
      "Pick a course below or browse the catalog. Your progress shows up here the moment you begin.",
    ctaLabel: "Browse courses",
    suggestions,
  };
}

function buildFeaturedRecommendation(
  recommendation: Awaited<ReturnType<typeof getMyRecommendationAction>>
): FeaturedRecommendationData | null {
  if (!recommendation) return null;

  if (recommendation.path) {
    const path = recommendation.path;
    return {
      eyebrow: path.kind === "career" ? "Career path" : "Skill path",
      title: path.title,
      description: path.description,
      reason: recommendation.reason,
      href: `/learning-path/${path.kind}/${path.slug}`,
      ctaLabel: "Start this path",
    };
  }

  if (recommendation.course) {
    const course = recommendation.course;
    return {
      eyebrow: "Course",
      title: course.title,
      description: course.subtitle || course.description,
      reason: recommendation.reason,
      href: `/courses/${course.slug}`,
      ctaLabel: "View course",
    };
  }

  return null;
}

export default async function DashboardPage() {
  // Overlay live stats onto the typed default dataset; new sections stay mock until backend endpoints exist.
  const stats = await getStatsAction();

  const [coursesResult, progressResult, courseStats] = await Promise.all([
    getActiveCoursesAction(),
    getMyProgressAction(),
    getMyCourseStatsAction(),
  ]);

  const coursesSummaries = coursesResult.courses;
  const coursesById = new Map(coursesSummaries.map((course) => [course.id, course]));
  const touchedIds = new Set(progressResult.progress.map((row) => row.course_id));

  const activeSection = buildActiveSection(progressResult.progress, coursesById);
  let continueSection: ContinueSectionData;
  if (activeSection) {
    continueSection = activeSection;
  } else {
    // Only users without in-progress work need a recommendation.
    const recommendation = await getMyRecommendationAction();
    continueSection = buildEmptySection(
      coursesSummaries,
      touchedIds,
      buildFeaturedRecommendation(recommendation)
    );
  }

  return (
    <StudentDashboard
      data={buildDashboardData(stats, continueSection, courseStats)}
    />
  );
}
