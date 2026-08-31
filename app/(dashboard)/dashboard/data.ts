import type { StatsData, WeekDay } from "@/actions/stats";
import type { CourseStatsData } from "@/actions/course-stats";
import type { ContinueSectionData } from "@/components/dashboard/student/types";
import type {
  StreakData,
  StreakDay,
  StudentDashboardData,
} from "@/components/dashboard/student/types";

// Greeting defaults only; stats, streak and continue sections always come
// from real backend data or truthful empty states in buildDashboardData.
const DEFAULT_GREETING = {
  greetingName: "there",
  greetingSubtitle: "Here's where you stand today.",
};

const WEEKDAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"];

// No week data means no practice yet: render a truthful empty week instead
// of fabricating a demo streak.
function buildStreakData(week: WeekDay[]): StreakData {
  const days: StreakDay[] = week.map((day, index) => ({
    label: WEEKDAY_LABELS[index] ?? day.date,
    state: day.practiced ? "done" : day.is_today ? "today" : "upcoming",
  }));
  const practicedCount = week.filter((day) => day.practiced).length;
  return {
    summary: `${practicedCount} of 7 days practiced`,
    days,
  };
}

// Every meta line derives from real backend fields; no decorative strings.
export function buildDashboardData(
  stats: StatsData,
  continueSection: ContinueSectionData,
  courseStats: CourseStatsData
): StudentDashboardData {
  const activeDays = stats.week.filter((day) => day.practiced).length;
  const today = stats.week.find((day) => day.is_today);
  const hoursPerLab =
    stats.labs_completed > 0 ? stats.hours_practiced / stats.labs_completed : 0;

  return {
    ...DEFAULT_GREETING,
    // Zero is a valid, truthful value when no work happened yet.
    stats: [
      {
        label: "Paths completed",
        value: String(courseStats.paths_completed),
        meta: `${courseStats.paths_started} ${courseStats.paths_started === 1 ? "path" : "paths"} started`,
      },
      {
        label: "Courses completed",
        value: String(courseStats.courses_completed),
        meta: `${courseStats.courses_in_progress} in progress now`,
      },
      {
        label: "Labs completed",
        value: String(stats.labs_completed),
        meta: `${activeDays} active ${activeDays === 1 ? "day" : "days"} this week`,
      },
      {
        label: "Hours practiced",
        value: `${stats.hours_practiced}h`,
        meta: hoursPerLab > 0 ? `~${hoursPerLab.toFixed(1)}h per lab` : "",
      },
      {
        label: "Current streak",
        value:
          stats.current_streak === 1
            ? "1 day"
            : `${stats.current_streak} days`,
        meta: today
          ? today.practiced
            ? "Practiced today"
            : "Practice today to keep it"
          : "",
      },
    ],
    streak: buildStreakData(stats.week),
    continueSection,
  };
}