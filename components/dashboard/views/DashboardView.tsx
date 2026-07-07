"use client";

import { ChevronRight } from "lucide-react";
import styles from "../Dashboard.module.css";
import StatCard from "../StatCard";
import LabCard from "../LabCard";
import { Stat, Lab } from "../types";
import { useUser } from "@/context/UserContext";

export default function DashboardView({
  stats,
  inProgressLabs,
  recommendedLabs,
  langColors,
}: {
  stats: Stat[];
  inProgressLabs: Lab[];
  recommendedLabs: Lab[];
  langColors: Record<string, string>;
}) {
  const { user } = useUser();
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const firstName = user?.full_name?.split(" ")[0] || "there";

  return (
    <div className="px-8 py-10 max-w-5xl mx-auto w-full">
      <div className="mb-10">
        <h1 className="text-2xl font-semibold text-foreground tracking-tight">{greeting}, {firstName}.</h1>
        <p className="text-sm text-muted-foreground mt-1">Here's where you stand today.</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-12">
        {stats.map((stat, i) => (
          <StatCard key={stat.label} stat={stat} isFirst={i === 0} />
        ))}
      </div>

      <section className="mb-12">
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="text-sm font-semibold text-foreground tracking-wide uppercase">In Progress</h2>
          <button className="text-xs text-[#007bff] hover:underline flex items-center gap-0.5">
            View all <ChevronRight size={12} />
          </button>
        </div>

        <div
          className={`flex gap-4 overflow-x-auto pb-2 ${styles.scrollbarHidden}`}
        >
          {inProgressLabs.map((lab) => (
            <LabCard key={lab.id} lab={lab} langColors={langColors} />
          ))}
        </div>
      </section>

      <section>
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="text-sm font-semibold text-foreground tracking-wide uppercase">Recommended for You</h2>
        </div>
        <div className="grid grid-cols-2 gap-4">
          {recommendedLabs.map((lab) => (
            <LabCard key={lab.id} lab={lab} langColors={langColors} isRecommended />
          ))}
        </div>
      </section>
    </div>
  );
}
