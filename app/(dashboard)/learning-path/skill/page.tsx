import {
  Braces,
  Bug,
  ChartNoAxesCombined,
  Container,
  Database,
  GitBranch,
  KeyRound,
  Terminal,
  type LucideIcon,
} from "lucide-react";

import { PathCard } from "@/components/dashboard/PathCard";
import type { SkillPathIconName } from "@/types/career-path";
import { SKILL_PATHS } from "./data";

const skillPathIcons: Record<SkillPathIconName, LucideIcon> = {
  git: GitBranch,
  api: Braces,
  sql: Database,
  cli: Terminal,
  docker: Container,
  "data-viz": ChartNoAxesCombined,
  testing: Bug,
  security: KeyRound,
};

export default function SkillPathPage() {
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
          {SKILL_PATHS.length} PATHS
        </p>
      </header>

      <div className="grid grid-cols-1 gap-4 pt-6 sm:grid-cols-2 lg:grid-cols-3">
        {SKILL_PATHS.map((path) => (
          <PathCard
            key={path.slug}
            icon={skillPathIcons[path.icon]}
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