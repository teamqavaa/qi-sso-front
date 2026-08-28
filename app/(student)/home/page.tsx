import StudentHome, {
  type StudentHomeData,
} from "@/components/dashboard/views/StudentHome";
import { getStatsAction } from "@/actions/stats";
import { getActiveCoursesAction } from "@/actions/courses";
import {
  getMyProgressAction,
  type CourseProgressEntry,
} from "@/actions/course-progress";
import { getMyRecommendationAction } from "@/actions/recommendation";
import { formatDuration } from "@/lib/format";

const FEATURED_COURSE_LIMIT = 6;
const KEEP_GOING_LIMIT = 4;

function buildKeepGoing(
  rows: CourseProgressEntry[],
  titlesById: Map<number, { title: string; level: string; slug: string }>
): StudentHomeData["keepGoing"] {
  return rows
    .filter((row) => row.status === "in_progress" && titlesById.has(row.course_id))
    .slice(0, KEEP_GOING_LIMIT)
    .map((row) => {
      const course = titlesById.get(row.course_id)!;
      return {
        title: course.title,
        kind: course.level,
        progress: row.progress_percent,
        href: `/courses/${course.slug}`,
      };
    });
}

export default async function StudentHomePage() {
  const [stats, coursesResult, progressResult, recommendation] = await Promise.all([
    getStatsAction(),
    getActiveCoursesAction(),
    getMyProgressAction(),
    getMyRecommendationAction(),
  ]);

  const courses = coursesResult.courses;
  const titlesById = new Map(
    courses.map((course) => [
      course.id,
      { title: course.title, level: course.level, slug: course.slug },
    ])
  );
  const activeDays = stats.week.filter((day) => day.practiced).length;

  // XP and level are mock values until a gamification endpoint exists.
  const data: StudentHomeData = {
    stats: [
      {
        label: "Streak",
        value: `${stats.current_streak}d`,
        meta: activeDays > 0 ? `${activeDays} active this week` : "Start today",
        icon: "flame",
      },
      {
        label: "XP",
        value: "1,240",
        meta: "Mock — endpoint pending",
        icon: "xp",
      },
      {
        label: "Level",
        value: "4",
        meta: "Explorer",
        icon: "level",
      },
      {
        label: "Labs done",
        value: String(stats.labs_completed),
        meta: "",
        icon: "labs",
      },
      {
        label: "Practice",
        value: `${stats.hours_practiced}h`,
        meta: "",
        icon: "hours",
      },
    ],
    recommendation: (() => {
      if (recommendation?.path) {
        const path = recommendation.path;
        return {
          eyebrow: path.kind === "career" ? "Career track" : "Skill track",
          title: path.title,
          description: path.description,
          reason: recommendation.reason,
          href: `/learning-path/${path.kind}/${path.slug}`,
          ctaLabel: "Start this track",
        };
      }
      if (recommendation?.course) {
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
    })(),
    featuredCourses: courses.slice(0, FEATURED_COURSE_LIMIT).map((course) => ({
      title: course.title,
      kind: course.level,
      duration: formatDuration(course.duration_minutes),
      href: `/courses/${course.slug}`,
    })),
    keepGoing: buildKeepGoing(progressResult.progress, titlesById),
  };

  return <StudentHome data={data} />;
}