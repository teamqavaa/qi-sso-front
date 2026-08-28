import { notFound } from "next/navigation";

import { getProgressAction } from "@/actions/progress";
import { getSkillLabsAction, getSkillsAction } from "@/actions/skills";
import LabCard from "@/components/dashboard/LabCard";
import PageBreadcrumbs from "@/components/dashboard/PageBreadcrumbs";
import { PathIconBadge } from "@/components/dashboard/path-detail/PathIconBadge";
import { getPathIcon } from "@/components/dashboard/path-icons";

// Skills are lab-only: no courses, so this view renders the skill's labs.
export default async function SkillDetailView({ slug }: { slug: string }) {
  const { skills, error } = await getSkillsAction();
  if (error) {
    return <ComingSoon />;
  }
  const skill = skills.find((item) => item.slug === slug);
  if (!skill) {
    notFound();
  }

  const crumbs = [
    { label: "Tracks", href: "/learning-path" },
    { label: "Skill", href: "/learning-path/skill" },
    { label: skill.title, href: `/learning-path/skill/${skill.slug}` },
  ];

  const { labs } = await getSkillLabsAction(skill.slug);
  const progress = await getProgressAction();
  const progressByLab = new Map(progress.map((entry) => [entry.lab_id, entry]));

  return (
    <div className="mx-auto w-full max-w-6xl px-8 py-10">
      <PageBreadcrumbs className="mb-6" items={crumbs} />
      <PathIconBadge icon={getPathIcon("skill", skill.icon)} />
      <h1 className="mt-4 text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
        {skill.title}
      </h1>
      <p className="mt-2 max-w-[60ch] text-sm leading-relaxed text-muted-foreground">
        {skill.description}
      </p>
      <p className="mt-3 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
        {labs.length} LAB{labs.length === 1 ? "" : "S"}
      </p>

      <section className="mt-10">
        <h2 className="border-b border-border pb-3 font-mono text-[11px] uppercase tracking-[0.25em] text-muted-foreground">
          SKILL LABS
        </h2>

        {labs.length === 0 ? (
          <p className="pt-6 text-sm text-muted-foreground">No labs for this skill yet.</p>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
            {labs.map((lab) => {
              const entry = progressByLab.get(lab.id);
              return (
                <LabCard
                  key={lab.id}
                  lab={lab}
                  labStatus={
                    (entry?.status as "not_started" | "in_progress" | "completed") ?? "not_started"
                  }
                  progressPercent={entry?.progress_percent ?? 0}
                  completedSteps={entry?.completed_steps ?? 0}
                  totalSteps={entry?.total_steps ?? 0}
                />
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}

function ComingSoon() {
  return (
    <div className="mx-auto w-full max-w-5xl px-8 py-10">
      <div className="rounded-xl border border-zinc-200 bg-card p-6 text-sm text-muted-foreground">
        Skills are temporarily unavailable.
      </div>
    </div>
  );
}