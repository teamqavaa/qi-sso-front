import { getActivePathsAction } from "@/actions/learning-paths";
import CareerCard from "@/components/browse/CareerCard";

export default async function CareerTracksPage() {
  const { paths, error } = await getActivePathsAction("career");

  return (
    <div className="min-h-screen bg-[#f8fafc]">
      <section className="w-full bg-[#f8fafc] border-neutral-200/60 pt-10 pb-8 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col gap-3 sm:gap-4 text-left">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-[#0f172a] tracking-tight leading-tight">
            Career paths
          </h1>
          <p className="text-neutral-600 text-base font-normal leading-relaxed max-w-3xl">
            Follow a structured sequence of courses that takes you from beginner to job-ready in one focus area.
          </p>
        </div>
      </section>

      <div className="px-4 sm:px-6 lg:px-12 pb-16">
        <div className="max-w-7xl mx-auto">
          {error || paths.length === 0 ? (
            <div className="rounded-2xl border border-neutral-200 bg-white p-8 text-center text-sm text-neutral-500">
              {error ? "Failed to load career paths." : "No career paths available yet."}
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2 xl:grid-cols-3">
              {paths.map((path) => (
                <CareerCard
                  key={path.slug}
                  slug={path.slug}
                  icon={path.icon}
                  title={path.title}
                  description={path.description}
                  course_count={path.course_count}
                  duration_weeks={path.duration_weeks}
                  pace={path.pace}
                  includes_certificate={path.includes_certificate}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
