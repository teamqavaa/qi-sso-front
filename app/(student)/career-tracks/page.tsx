import { getActivePathsAction } from "@/actions/learning-paths";
import { PathCard } from "@/components/dashboard/PathCard";

export default async function CareerTracksPage() {
  const { paths, error } = await getActivePathsAction("career");

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <header className="flex items-end justify-between gap-4 border-b border-border pb-6">
        <div className="max-w-[60ch]">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Career tracks
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            A structured sequence of courses that takes you from beginner to
            job-ready in one focus area.
          </p>
        </div>
        <p className="shrink-0 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          {paths.length} PATHS
        </p>
      </header>

      {error || paths.length === 0 ? (
        <p className="pt-6 text-sm text-muted-foreground">No careers available yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 pt-6 sm:grid-cols-2 lg:grid-cols-3">
          {paths.map((path) => (
            <PathCard
              key={path.slug}
              kind={path.kind}
              icon={path.icon}
              title={path.title}
              description={path.description ?? ""}
              courseCount={path.course_count}
              weekCount={path.duration_weeks}
              href={`/career-tracks/${path.slug}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
