import { notFound } from "next/navigation";

import { CAREER_PATHS } from "../data";

export default async function CareerPathDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const path = CAREER_PATHS.find((item) => item.slug === slug);
  if (!path) {
    notFound();
  }

  return (
    <div className="mx-auto w-full max-w-5xl px-8 py-10">
      <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
        {path.title}
      </h1>
      <p className="mt-2 max-w-[60ch] text-sm text-muted-foreground">
        {path.description}
      </p>
      <div className="mt-6 rounded-xl border border-zinc-200 bg-card p-6 text-sm text-muted-foreground">
        This path&apos;s curriculum is coming soon.
      </div>
    </div>
  );
}