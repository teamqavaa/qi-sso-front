import { getLabsAction } from "@/actions/labs";
import { getProgressAction } from "@/actions/progress";
import LabCard from "@/components/dashboard/LabCard";

export default async function LabsPage() {
  const { labs, error } = await getLabsAction();
  const progress = await getProgressAction();
  const progressByLab = new Map(progress.map((entry) => [entry.lab_id, entry]));

  if (error || labs.length === 0) {
    return (
      <div className="px-8 py-10 max-w-5xl mx-auto w-full">
        <p className="text-sm text-muted-foreground">No labs available.</p>
      </div>
    );
  }

  return (
    <div className="px-8 py-10 max-w-5xl mx-auto w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground tracking-tight">My Labs</h1>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {labs.map((lab) => {
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
