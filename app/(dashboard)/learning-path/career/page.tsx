import {
  BarChart3,
  Cloud,
  Monitor,
  Server,
  ShieldCheck,
  Smartphone,
  type LucideIcon,
} from "lucide-react";

import { PathCard } from "@/components/dashboard/PathCard";
import { SortDropdown } from "@/components/dashboard/SortDropdown";
import type { CareerPathIconName } from "@/types/career-path";
import { CAREER_PATHS } from "./data";

const careerPathIcons: Record<CareerPathIconName, LucideIcon> = {
  backend: Server,
  frontend: Monitor,
  data: BarChart3,
  cloud: Cloud,
  security: ShieldCheck,
  mobile: Smartphone,
};

export default function CareerPathPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-8 py-10">
      <header className="flex items-end justify-between gap-4 border-b border-border pb-6">
        <div className="max-w-[60ch]">
          <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
            Explore Career Paths
          </h1>
          <p className="mt-2 text-sm text-muted-foreground">
            A structured sequence of courses that takes you from beginner to
            job-ready in one focus area.
          </p>
        </div>
        <p className="shrink-0 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          {CAREER_PATHS.length} PATHS
        </p>
      </header>

      <div className="flex justify-end py-4">
        <SortDropdown
          options={[{ value: "popular", label: "Most Popular" }]}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {CAREER_PATHS.map((path) => (
          <PathCard
            key={path.slug}
            icon={careerPathIcons[path.icon]}
            title={path.title}
            description={path.description}
            courseCount={path.courseCount}
            weekCount={path.weekCount}
            href={path.href}
          />
        ))}
      </div>
    </div>
  );
}