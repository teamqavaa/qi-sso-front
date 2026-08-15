"use server";

import { cookies } from "next/headers";

export type ProgressEntry = {
  lab_id: string;
  status: string;
  attempts: number;
  completed_at: string | null;
};

export async function getProgressAction(): Promise<ProgressEntry[]> {
  const cookieStore = await cookies();
  const accessToken = cookieStore.get("access_token")?.value;

  if (!accessToken) return [];

  try {
    const res = await fetch("http://127.0.0.1:8000/api/progress/", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      cache: "no-store",
    });

    if (!res.ok) return [];

    return await res.json();
  } catch {
    return [];
  }
}
