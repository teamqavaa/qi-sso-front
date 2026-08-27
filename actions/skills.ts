"use server";

import type { Lab } from "@/types/lab";
import type { Skill } from "@/types/skill";

const LABS_API_URL = "http://localhost:8000";

export async function getSkillsAction(): Promise<
  { skills: Skill[]; error: null } | { skills: []; error: string }
> {
  try {
    const res = await fetch(`${LABS_API_URL}/api/skills/`, { cache: "no-store" });
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
    const res = await fetch(`${LABS_API_URL}/api/skills/${slug}/labs/`, { cache: "no-store" });
    if (!res.ok) {
      return { labs: [], error: `Failed to fetch skill labs: ${res.status}` };
    }
    const labs: Lab[] = await res.json();
    return { labs, error: null };
  } catch (e) {
    return { labs: [], error: e instanceof Error ? e.message : "Unknown error fetching skill labs" };
  }
}