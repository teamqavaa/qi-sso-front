import DashboardView from "@/components/dashboard/views/DashboardView";
import { mockStats } from "./mock-data";
import type { Lab } from "@/types/lab";

export default async function DashboardPage() {
  let labs: Lab[] = [];

  try {
    const res = await fetch("http://localhost:8000/api/labs/", { cache: "no-store" });
    if (res.ok) {
      labs = await res.json();
    }
  } catch {
    // fetch failed — labs stays empty
  }

  return (
    <DashboardView
      stats={mockStats}
      labs={labs}
    />
  );
}
