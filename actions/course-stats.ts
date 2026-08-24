"use server";

import { cookies } from "next/headers";

import { COURSES_API_URL } from "@/lib/courses-api";

export type CourseStatsData = {
  courses_completed: number;
  paths_completed: number;
  paths_started: number;
  courses_in_progress: number;
};

const DEFAULT_COURSE_STATS: CourseStatsData = {
  courses_completed: 0,
  paths_completed: 0,
  paths_started: 0,
  courses_in_progress: 0,
};

export async function getMyCourseStatsAction(): Promise<CourseStatsData> {
  const cookieStore = await cookies();
  const token = cookieStore.get("access_token")?.value;

  if (!token) return DEFAULT_COURSE_STATS;

  try {
    const res = await fetch(`${COURSES_API_URL}/api/my/course-stats/`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) return DEFAULT_COURSE_STATS;

    return await res.json();
  } catch {
    return DEFAULT_COURSE_STATS;
  }
}
