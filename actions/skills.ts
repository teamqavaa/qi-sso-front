"use server";

import type { Lab } from "@/types/lab";
import type { Skill } from "@/types/skill";
import { COURSES_API_URL } from "@/lib/courses-api";

export async function getSkillsAction(): Promise<
  { skills: Skill[]; error: null } | { skills: []; error: string }
> {
  try {
    const res = await fetch(`${COURSES_API_URL}/api/skills/`, { cache: "no-store" });
    if (!res.ok) {
      return { skills: [], error: `Failed to fetch skills: ${res.status}` };
    }
    const skills: Skill[] = await res.json();
    return { skills, error: null };
  } catch (e) {
    return { skills: [], error: e instanceof Error ? e.message : "Unknown error fetching skills" };
  }
}

export async function getSkillLabsAction(
  slug: string
): Promise<{ labs: Lab[]; error: null } | { labs: []; error: string }> {
  try {
    const res = await fetch(`${COURSES_API_URL}/api/skills/${slug}/labs/`, { cache: "no-store" });
    if (!res.ok) {
      return { labs: [], error: `Failed to fetch skill labs: ${res.status}` };
    }
    const labs: Lab[] = await res.json();
    return { labs, error: null };
  } catch (e) {
    return { labs: [], error: e instanceof Error ? e.message : "Unknown error fetching skill labs" };
  }
}