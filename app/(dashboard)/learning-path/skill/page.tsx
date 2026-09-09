import { getLabsAction } from "@/actions/labs";
import { getSkillsAction } from "@/actions/skills";
import { PathCard } from "@/components/dashboard/PathCard";

export default async function SkillPathPage() {
  const { skills, error } = await getSkillsAction();
  const { labs } = await getLabsAction();

  // Lab count per skill drives the card meta; uncategorized labs are ignored.
  const labsBySkill = new Map<string, number>();
  for (const lab of labs) {
    for (const slug of lab.skill_slugs) {
      labsBySkill.set(slug, (labsBySkill.get(slug) ?? 0) + 1);
    }
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-8 py-10">
      <header className="flex items-end justify-between gap-4 border-b border-border pb-6">
        <div className="max-w-[60ch]">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Skills
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Hands-on lab tracks for one specific skill
          </p>
        </div>
        <p className="shrink-0 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          {skills.length} SKILLS
        </p>
      </header>

      {error || skills.length === 0 ? (
        <p className="pt-6 text-sm text-muted-foreground">No skills available yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 pt-6 sm:grid-cols-2 lg:grid-cols-3">
          {skills.map((skill) => (
            <PathCard
              key={skill.slug}
              kind="skill"
              icon={skill.icon}
              title={skill.title}
              description={skill.description ?? ""}
              courseCount={0}
              labCount={labsBySkill.get(skill.slug) ?? 0}
              weekCount={0}
              href={`/learning-path/skill/${skill.slug}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
