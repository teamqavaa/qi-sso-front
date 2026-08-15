import type { StatsData } from "@/actions/stats";
import type { StudentDashboardData } from "@/components/dashboard/student/types";

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
    { label: "Labs completed", value: "27", meta: "+3 this week" },
    { label: "Hours practiced", value: "84.5", meta: "6.2 hrs this week" },
    { label: "Current streak", value: "5 days", meta: "Best: 12 days" },
  ],
  continueCard: {
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
  lessons: [
    { title: "Data Cleaning with Pandas", kind: "Lab", progress: 40 },
    { title: "Version Control Essentials", kind: "Course", progress: 65 },
    { title: "Intro to Cloud Storage", kind: "Lab", progress: 20 },
    { title: "Spreadsheet Automation", kind: "Course", progress: 80 },
  ],
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
  achievements: [
    {
      title: "First Lab",
      detail: "Completed Mar 2",
      icon: "award",
      earned: true,
      locked: false,
    },
    {
      title: "5-Day Streak",
      detail: "Completed Apr 11",
      icon: "flame",
      earned: true,
      locked: false,
    },
    {
      title: "Terminal Native",
      detail: "Complete 10 CLI labs",
      icon: "terminal",
      earned: false,
      locked: true,
    },
    {
      title: "Security Aware",
      detail: "Finish Security Path",
      icon: "shield",
      earned: false,
      locked: true,
    },
  ],
  upNext: {
    eyebrow: "Up next",
    message:
      "You finished Data Literacy Foundations. Ready to go further? Applied Analytics with SQL builds directly on what you just learned.",
    courseTitle: "Applied Analytics with SQL",
    courseDuration: "4 hrs 20 min",
    courseTag: "Intermediate",
    ctaLabel: "Start Applied Analytics with SQL",
    dismissLabel: "Maybe later",
  },
};

// Overlay real stats when the backend reports them; fall back to demo values otherwise.
export function buildDashboardData(stats: StatsData): StudentDashboardData {
  return {
    ...DEFAULT_DASHBOARD_DATA,
    stats: [
      {
        ...DEFAULT_DASHBOARD_DATA.stats[0],
        value: stats.labs_completed > 0 ? String(stats.labs_completed) : DEFAULT_DASHBOARD_DATA.stats[0].value,
      },
      {
        ...DEFAULT_DASHBOARD_DATA.stats[1],
        value: stats.hours_practiced > 0 ? String(stats.hours_practiced) : DEFAULT_DASHBOARD_DATA.stats[1].value,
      },
      {
        ...DEFAULT_DASHBOARD_DATA.stats[2],
        value: stats.current_streak > 0 ? `${stats.current_streak} days` : DEFAULT_DASHBOARD_DATA.stats[2].value,
      },
    ],
  };
}