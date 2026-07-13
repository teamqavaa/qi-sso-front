"use client";

import styles from "../Dashboard.module.css";
import StatCard from "../StatCard";
import LabCard from "../LabCard";
import type { Stat } from "../types";
import type { Lab } from "@/types/lab";
import { useUser } from "@/context/UserContext";

const langColors: Record<string, string> = {
  python: "text-indigo-600 bg-indigo-50",
  javascript: "text-yellow-700 bg-yellow-50",
  typescript: "text-blue-700 bg-blue-50",
  react: "text-blue-600 bg-blue-50",
  "node.js": "text-green-700 bg-green-50",
  sql: "text-orange-600 bg-orange-50",
  css: "text-pink-600 bg-pink-50",
  html: "text-orange-600 bg-orange-50",
  git: "text-gray-700 bg-gray-100",
  java: "text-red-600 bg-red-50",
  go: "text-cyan-600 bg-cyan-50",
  rust: "text-orange-700 bg-orange-50",
};

export default function DashboardView({
  stats,
  labs,
}: {
  stats: Stat[];
  labs: Lab[];
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

      <section>
        <div className="flex items-baseline justify-between mb-4">
          <h2 className="text-sm font-semibold text-foreground tracking-wide uppercase">All Labs</h2>
        </div>

        {labs.length === 0 ? (
          <p className="text-sm text-muted-foreground">No labs available.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {labs.map((lab) => (
              <LabCard key={lab.id} lab={lab} langColors={langColors} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
