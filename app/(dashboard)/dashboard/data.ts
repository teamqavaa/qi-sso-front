import type { StatsData, WeekDay } from "@/actions/stats";
import type { CourseStatsData } from "@/actions/course-stats";
import type { ContinueSectionData } from "@/components/dashboard/student/types";
import type {
  StreakData,
  StreakDay,
  StudentDashboardData,
} from "@/components/dashboard/student/types";

// Default dataset so the page renders while the backend endpoints for these
// sections are still missing. Overlay real stats where they exist.
export const DEFAULT_DASHBOARD_DATA: StudentDashboardData = {
  greetingName: "there",
  greetingSubtitle: "Here's where you stand today.",
  banner: {
    count: 3,
    initials: "AO",
    message:
      "Assignment 'API Fundamentals' is due in 2 days. Submit before Friday, 23:59 WAT.",
    ctaLabel: "Start now",
  },
  stats: [
    { label: "Paths completed", value: "0", meta: "0 paths started" },
    { label: "Courses completed", value: "0", meta: "0 in progress now" },
    { label: "Labs completed", value: "27", meta: "0 active days this week" },
    { label: "Hours practiced", value: "84.5h", meta: "~1.2h per lab" },
    { label: "Current streak", value: "0 days", meta: "" },
  ],
  continueSection: {
    kind: "active",
    cardHref: "/courses/building-your-first-rest-integration",
    card: {
      tags: ["Lab", "Intermediate", "API"],
      title: "Building Your First REST Integration",
      description:
        "Design an endpoint, model the payloads, and wire a client to talk to your service. This module walks through the full request lifecycle.",
      progress: 58,
      progressLabel: "Module 4 of 7",
      meta: [
        { icon: "clock", text: "45 min left" },
        { icon: "star", text: "120 XP on completion" },
        { icon: "calendar", text: "Last opened yesterday" },
      ],
      primaryCta: "Continue",
      secondaryCta: "Details",
    },
    rows: [
      { title: "Data Cleaning with Pandas", kind: "Lab", progress: 40, href: "/courses" },
      { title: "Version Control Essentials", kind: "Course", progress: 65, href: "/courses" },
      { title: "Intro to Cloud Storage", kind: "Lab", progress: 20, href: "/courses" },
      { title: "Spreadsheet Automation", kind: "Course", progress: 80, href: "/courses" },
    ],
  },
  streak: {
    summary: "4 of 7 days practiced",
    days: [
      { label: "M", state: "done" },
      { label: "T", state: "done" },
      { label: "W", state: "done" },
      { label: "T", state: "today" },
      { label: "F", state: "done" },
      { label: "S", state: "upcoming" },
      { label: "S", state: "upcoming" },
    ],
  },
  // The whole section is mock data; every badge renders faded until the
  // achievements endpoint exists. earned/locked are placeholder flags.
  achievements: [
    {
      title: "First Lab",
      detail: "Completed Mar 2",
      icon: "award",
      earned: false,
      locked: false,
    },
    {
      title: "5-Day Streak",
      detail: "Completed Apr 11",
      icon: "flame",
      earned: false,
      locked: false,
    },
    {
      title: "Terminal Native",
      detail: "Complete 10 CLI labs",
      icon: "terminal",
      earned: false,
      locked: false,
    },
    {
      title: "Security Aware",
      detail: "Finish Security Path",
      icon: "shield",
      earned: false,
      locked: false,
    },
  ],
};

const WEEKDAY_LABELS = ["M", "T", "W", "T", "F", "S", "S"];

// The weekly tracker falls back to the demo week only when the backend has no
// week data (unreachable); otherwise it mirrors the real activity days.
function buildStreakData(week: WeekDay[]): StreakData {
  if (week.length === 0) return DEFAULT_DASHBOARD_DATA.streak;

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
    ...DEFAULT_DASHBOARD_DATA,
    // The stat cards always show real numbers; zero is a valid, truthful value.
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