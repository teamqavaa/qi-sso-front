import { getLabsAction } from "@/actions/labs";
import { getProgressAction } from "@/actions/progress";
import LabCard from "@/components/dashboard/LabCard";

export default async function ExploreLabsPage() {
  const { labs, error } = await getLabsAction();
  const progress = await getProgressAction();
  const progressByLab = new Map(progress.map((entry) => [entry.lab_id, entry]));

  if (error || labs.length === 0) {
    return (
      <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <p className="text-sm text-muted-foreground">No labs available.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Explore labs
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Hands-on environments. Pick a lab and start practicing.
        </p>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
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
