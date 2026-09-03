import Link from "next/link";
import { getActivePathsAction } from "@/actions/learning-paths";
import { getMyPathProgressAction } from "@/actions/course-progress";
import { PathCard } from "@/components/dashboard/PathCard";

export default async function CareerPathPage() {
  const { paths, error } = await getActivePathsAction("career");

  // A career counts as "enrolled" when the user has started or completed at
  // least one course in it. This mirrors the backend's derived paths_started.
  const enrolledPaths = [];
  for (const path of paths) {
    const { progress } = await getMyPathProgressAction(path.slug);
    const started = progress.some(
      (entry) => entry.status === "in_progress" || entry.status === "completed"
    );
    if (started) enrolledPaths.push(path);
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-8 py-10">
      <header className="flex items-end justify-between gap-4 border-b border-border pb-6">
        <div className="max-w-[60ch]">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            My Careers
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            Career tracks you&apos;ve started. Continue where you left off, or
            explore more.
          </p>
        </div>
        <p className="shrink-0 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          {enrolledPaths.length} PATHS
        </p>
      </header>

      {error || enrolledPaths.length === 0 ? (
        <div className="pt-6">
          <p className="text-sm text-muted-foreground">
            You haven&apos;t started any career tracks yet.
          </p>
          <Link
            href="/career-tracks"
            className="mt-4 inline-flex items-center gap-2 rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700"
          >
            Explore careers
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 pt-6 sm:grid-cols-2 lg:grid-cols-3">
          {enrolledPaths.map((path) => (
            <PathCard
              key={path.slug}
              kind={path.kind}
              icon={path.icon}
              title={path.title}
              description={path.description ?? ""}
              courseCount={path.course_count}
              weekCount={path.duration_weeks}
              href={`/learning-path/career/${path.slug}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
