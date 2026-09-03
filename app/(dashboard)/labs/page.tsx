import Link from "next/link";
import { getLabsAction } from "@/actions/labs";
import { getProgressAction } from "@/actions/progress";
import LabCard from "@/components/dashboard/LabCard";

export default async function LabsPage() {
  const { labs, error } = await getLabsAction();
  const progress = await getProgressAction();
  const progressByLab = new Map(progress.map((entry) => [entry.lab_id, entry]));

  // "My Labs" shows only labs the user has started (in progress or completed).
  const startedIds = new Set(
    progress
      .filter((entry) => entry.status === "in_progress" || entry.status === "completed")
      .map((entry) => entry.lab_id)
  );
  const startedLabs = labs.filter((lab) => startedIds.has(lab.id));

  if (error || startedLabs.length === 0) {
    return (
      <div className="px-8 py-10 max-w-5xl mx-auto w-full">
        <div className="mb-4">
          <h1 className="text-2xl font-semibold text-foreground tracking-tight">My Labs</h1>
        </div>
        <p className="text-sm text-muted-foreground">
          You haven&apos;t started any labs yet.
        </p>
        <Link
          href="/explore-labs"
          className="mt-4 inline-flex items-center gap-2 rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700"
        >
          Explore labs
        </Link>
      </div>
    );
  }

  return (
    <div className="px-8 py-10 max-w-5xl mx-auto w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground tracking-tight">My Labs</h1>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {startedLabs.map((lab) => {
          const entry = progressByLab.get(lab.id);
          return (
            <LabCard
              key={lab.id}
              lab={lab}
              labStatus={(entry?.status as "not_started" | "in_progress" | "completed") ?? "not_started"}
              progressPercent={entry?.progress_percent ?? 0}
              completedSteps={entry?.completed_steps ?? 0}
              totalSteps={entry?.total_steps ?? 0}
            />
          );
        })}
      </div>
    </div>
  );
}
