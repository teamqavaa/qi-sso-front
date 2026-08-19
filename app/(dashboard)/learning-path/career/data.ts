import type { CareerPath } from "@/types/career-path";

// Mock data; replace with API calls when the paths endpoint exists.
export const CAREER_PATHS: CareerPath[] = [
  {
    slug: "backend-developer",
    title: "Backend Developer",
    description: "Build and deploy production-ready APIs and services",
    courseCount: 5,
    weekCount: 12,
    icon: "backend",
    href: "/learning-path/career/backend-developer",
  },
  {
    slug: "frontend-developer",
    title: "Frontend Developer",
    description: "Ship accessible, responsive interfaces users trust",
    courseCount: 6,
    weekCount: 14,
    icon: "frontend",
    href: "/learning-path/career/frontend-developer",
  },
  {
    slug: "data-analyst",
    title: "Data Analyst",
    description: "Turn raw data into decisions leaders act on",
    courseCount: 4,
    weekCount: 10,
    icon: "data",
    href: "/learning-path/career/data-analyst",
  },
  {
    slug: "cloud-engineer",
    title: "Cloud Engineer",
    description: "Automate infrastructure that scales without drama",
    courseCount: 6,
    weekCount: 16,
    icon: "cloud",
    href: "/learning-path/career/cloud-engineer",
  },
  {
    slug: "cybersecurity-analyst",
    title: "Cybersecurity Analyst",
    description: "Detect, investigate and contain real-world threats",
    courseCount: 5,
    weekCount: 13,
    icon: "security",
    href: "/learning-path/career/cybersecurity-analyst",
  },
  {
    slug: "mobile-developer",
    title: "Mobile Developer",
    description: "Publish cross-platform apps to both app stores",
    courseCount: 4,
    weekCount: 9,
    icon: "mobile",
    href: "/learning-path/career/mobile-developer",
  },
];