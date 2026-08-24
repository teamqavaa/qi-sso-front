"use client";

import { useState, type ReactNode } from "react";

export type CourseTab = {
  key: string;
  label: string;
  content: ReactNode;
};

// Controlled tab state lives here; panels arrive prebuilt from the server.
export default function CourseTabs({ tabs }: { tabs: CourseTab[] }) {
  const [activeKey, setActiveKey] = useState(tabs[0]?.key ?? "");
  const active = tabs.find((tab) => tab.key === activeKey) ?? tabs[0];

  if (!active) {
    return null;
  }

  return (
    <section>
      <div
        role="tablist"
        aria-label="Course sections"
        className="flex items-center gap-6 border-b border-zinc-200"
      >
        {tabs.map((tab) => {
          const isActive = tab.key === active.key;
          return (
            <button
              key={tab.key}
              role="tab"
              type="button"
              aria-selected={isActive}
              onClick={() => setActiveKey(tab.key)}
              className={`-mb-px border-b-2 pb-3 pt-1 font-mono text-[10px] uppercase tracking-[0.2em] transition-colors ${
                isActive
                  ? "border-zinc-900 font-bold text-foreground"
                  : "border-transparent text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab.label}
            </button>
          );
        })}
      </div>

      <div role="tabpanel" className="pt-8">
        {active.content}
      </div>
    </section>
  );
}
