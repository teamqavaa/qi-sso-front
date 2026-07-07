import type { Stat, Lab } from "@/components/dashboard/types";

export const mockStats: Stat[] = [
  { label: "Labs Completed", value: 14, iconName: "Award" },
  { label: "Hours Practiced", value: 38, iconName: "BarChart2" },
  { label: "Current Streak", value: "6 days", iconName: "FlaskConical" },
];

export const mockInProgressLabs: Lab[] = [
  { id: 1, title: "React State Management", lang: "React", progress: 68 },
  { id: 2, title: "Python Data Structures", lang: "Python", progress: 41 },
  { id: 3, title: "REST API Design", lang: "Node.js", progress: 85 },
  { id: 4, title: "SQL Query Optimization", lang: "SQL", progress: 22 },
];

export const mockRecommendedLabs: Lab[] = [
  { id: 5, title: "TypeScript Fundamentals", lang: "TypeScript" },
  { id: 6, title: "CSS Grid Mastery", lang: "CSS" },
  { id: 7, title: "Git & Collaboration", lang: "Git" },
  { id: 8, title: "Async JavaScript", lang: "JavaScript" },
];

export const mockLangColors: Record<string, string> = {
  React: "text-blue-600 bg-blue-50",
  Python: "text-indigo-600 bg-indigo-50",
  "Node.js": "text-green-700 bg-green-50",
  SQL: "text-orange-600 bg-orange-50",
  TypeScript: "text-blue-700 bg-blue-50",
  CSS: "text-pink-600 bg-pink-50",
  Git: "text-gray-700 bg-gray-100",
  JavaScript: "text-yellow-700 bg-yellow-50",
};
