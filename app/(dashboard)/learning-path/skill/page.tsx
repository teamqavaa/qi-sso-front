import { getActivePathsAction } from "@/actions/learning-paths";
import { PathCard } from "@/components/dashboard/PathCard";
import { getPathIcon } from "@/components/dashboard/path-icons";

export default async function SkillPathPage() {
  const { paths, error } = await getActivePathsAction("skill");

  return (
    <div className="mx-auto w-full max-w-5xl px-8 py-10">
      <header className="flex items-end justify-between gap-4 border-b border-border pb-6">
        <div className="max-w-[60ch]">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Skill Paths
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Focused tracks for one specific skill
          </p>
        </div>
        <p className="shrink-0 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          {paths.length} PATHS
        </p>
      </header>

      {error || paths.length === 0 ? (
        <p className="pt-6 text-sm text-muted-foreground">No skill paths available yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 pt-6 sm:grid-cols-2 lg:grid-cols-3">
          {paths.map((path) => (
            <PathCard
              key={path.slug}
              icon={getPathIcon(path.kind, path.icon)}
              title={path.title}
              description={path.description ?? ""}
              courseCount={path.course_count}
              weekCount={path.duration_weeks}
              href={`/learning-path/skill/${path.slug}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
