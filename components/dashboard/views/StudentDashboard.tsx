"use client";

import type { ReactNode } from "react";

import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { AchievementBadge } from "@/components/dashboard/student/AchievementBadge";
import { ContinueCard } from "@/components/dashboard/student/ContinueCard";
import { LessonRow } from "@/components/dashboard/student/LessonRow";
import { NotificationBanner } from "@/components/dashboard/student/NotificationBanner";
import { StatCard } from "@/components/dashboard/student/StatCard";
import { StreakTracker } from "@/components/dashboard/student/StreakTracker";
import { UpNextCard } from "@/components/dashboard/student/UpNextCard";
import type { StudentDashboardData } from "@/components/dashboard/student/types";
import { useUser } from "@/context/UserContext";

// Mono tracked eyebrows keep section hierarchy quiet and visually consistent.
function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
      {children}
    </h2>
  );
}

export default function StudentDashboard({
  data,
}: {
  data: StudentDashboardData;
}) {
  const { user } = useUser();
  // Greet by local time so the hero feels current throughout the day.
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const firstName = user?.full_name?.split(" ")[0] || data.greetingName;

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
      <NotificationBanner data={data.banner} />

      <Card className="mt-6 rounded-2xl bg-zinc-100">
        <CardContent className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            {greeting}, {firstName}.
          </h1>
          <p className="text-sm text-muted-foreground">{data.greetingSubtitle}</p>
        </CardContent>
      </Card>

      <section className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {data.stats.map((stat) => (
          <StatCard key={stat.label} data={stat} />
        ))}
      </section>

      <section className="mt-8">
        <Eyebrow>Continue where you left off</Eyebrow>
        <div className="mt-3 grid grid-cols-1 gap-4 lg:grid-cols-5">
          <ContinueCard data={data.continueCard} className="lg:col-span-3" />
          <div className="flex flex-col rounded-xl border border-border bg-white px-2 py-1 lg:col-span-2">
            <span className="px-2 pb-1 pt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
              Keep going
            </span>
            {data.lessons.map((lesson) => (
              <LessonRow key={lesson.title} data={lesson} />
            ))}
          </div>
        </div>
      </section>

      <Separator className="mt-8" />

      <section className="mt-8">
        <Eyebrow>Weekly streak</Eyebrow>
        <div className="mt-3">
          <StreakTracker data={data.streak} />
        </div>
      </section>

      <section className="mt-8">
        <Eyebrow>Achievements</Eyebrow>
        <div className="mt-3 grid grid-cols-2 gap-3 lg:grid-cols-4">
          {data.achievements.map((achievement) => (
            <AchievementBadge key={achievement.title} data={achievement} />
          ))}
        </div>
      </section>

      <section className="mt-8">
        <UpNextCard data={data.upNext} className="rounded-2xl" />
      </section>
    </div>
  );
}