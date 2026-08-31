"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronRight } from "lucide-react";
import { type ReactNode } from "react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { ContinueCard } from "@/components/dashboard/student/ContinueCard";
import { LessonRow } from "@/components/dashboard/student/LessonRow";
import { StatCard } from "@/components/dashboard/student/StatCard";
import { StreakTracker } from "@/components/dashboard/student/StreakTracker";
import type {
  CourseSuggestionData,
  StudentDashboardData,
} from "@/components/dashboard/student/types";
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
  const router = useRouter();
  // Consts keep the union narrow inside JSX callback props.
  const activeContinue =
    data.continueSection.kind === "active" ? data.continueSection : null;
  const emptyContinue =
    data.continueSection.kind === "empty" ? data.continueSection : null;
  // Greet by local time so the hero feels current throughout the day.
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const firstName = user?.full_name?.split(" ")[0] || data.greetingName;

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
      <Card className="mt-6 rounded-2xl bg-zinc-100">
        <CardContent className="flex flex-col gap-1">
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            {greeting}, {firstName}.
          </h1>
          <p className="text-sm text-muted-foreground">{data.greetingSubtitle}</p>
        </CardContent>
      </Card>

      <section className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3 lg:grid-cols-5">
        {data.stats.map((stat) => (
          <StatCard key={stat.label} data={stat} />
        ))}
      </section>

      <section className="mt-8">
        <Eyebrow>Continue where you left off</Eyebrow>
        <div className="mt-3 grid grid-cols-1 gap-4 lg:grid-cols-5">
          {activeContinue ? (
            <>
              <ContinueCard
                data={activeContinue.card}
                className="bg-zinc-50 lg:col-span-3"
                onPrimaryClick={() => router.push(activeContinue.cardHref)}
                onSecondaryClick={() => router.push(activeContinue.cardHref)}
              />
              <div className="flex flex-col rounded-xl border border-border bg-zinc-50 px-2 py-1 lg:col-span-2">
                <span className="px-2 pb-1 pt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  Keep going
                </span>
                {activeContinue.rows.length === 0 && (
                  <p className="px-2 py-3 text-xs text-muted-foreground">
                    Your other courses appear here once you start them.
                  </p>
                )}
                {activeContinue.rows.map((row) => (
                  <LessonRow
                    key={row.title}
                    data={row}
                    onOpen={() => router.push(row.href)}
                  />
                ))}
              </div>
            </>
          ) : emptyContinue ? (
            <>
              <Card className="rounded-2xl bg-zinc-50 lg:col-span-3">
                <CardContent className="flex flex-col gap-2">
                  {emptyContinue.featured ? (
                    <>
                      <Badge
                        variant="outline"
                        className="w-fit rounded-full bg-transparent font-mono text-[10px] uppercase tracking-widest text-muted-foreground"
                      >
                        {emptyContinue.featured.eyebrow}
                      </Badge>
                      <h3 className="text-lg font-semibold tracking-tight text-foreground">
                        {emptyContinue.featured.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {emptyContinue.featured.description}
                      </p>
                      <span className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                        {emptyContinue.featured.reason}
                      </span>
                      <Link
                        href={emptyContinue.featured.href}
                        className="mt-1 inline-flex w-fit items-center rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700"
                      >
                        {emptyContinue.featured.ctaLabel}
                      </Link>
                    </>
                  ) : (
                    <>
                      <h3 className="text-lg font-semibold tracking-tight text-foreground">
                        {emptyContinue.title}
                      </h3>
                      <p className="text-sm leading-relaxed text-muted-foreground">
                        {emptyContinue.message}
                      </p>
                      <Link
                        href="/courses"
                        className="mt-1 inline-flex w-fit items-center rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700"
                      >
                        {emptyContinue.ctaLabel}
                      </Link>
                    </>
                  )}
                </CardContent>
              </Card>
              <div className="flex flex-col rounded-xl border border-border bg-zinc-50 px-2 py-1 lg:col-span-2">
                <span className="px-2 pb-1 pt-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                  Start with one of these
                </span>
                {emptyContinue.suggestions.map((suggestion) => (
                  <SuggestionRow key={suggestion.href} data={suggestion} />
                ))}
              </div>
            </>
          ) : null}
        </div>
      </section>

      <Separator className="mt-8" />

      <section className="mt-8">
        <Eyebrow>Weekly streak</Eyebrow>
        <div className="mt-3">
          <StreakTracker data={data.streak} />
        </div>
      </section>
    </div>
  );
}

// Not-started course pick for the empty state: same row language as
// LessonRow but with duration instead of a progress bar.
function SuggestionRow({
  data,
}: {
  data: CourseSuggestionData;
}) {
  return (
    <Link
      href={data.href}
      className="flex w-full items-center gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-zinc-100"
    >
      <span className="min-w-0 flex-1 truncate text-sm font-medium text-foreground">
        {data.title}
      </span>
      <Badge
        variant="outline"
        className="shrink-0 rounded-full bg-transparent font-mono text-[10px] uppercase tracking-widest"
      >
        {data.kind}
      </Badge>
      <span className="w-14 shrink-0 text-right font-mono text-[10px] tabular-nums text-muted-foreground">
        {data.duration}
      </span>
      <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
    </Link>
  );
}