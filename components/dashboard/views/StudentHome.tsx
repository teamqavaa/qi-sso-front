"use client";

import { type ReactNode } from "react";
import Link from "next/link";
import { ChevronRight, Route, Sparkles } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { LessonRow } from "@/components/dashboard/student/LessonRow";
import { cn } from "@/lib/utils";

export type StudentHomeCourse = {
  title: string;
  kind: string;
  duration: string;
  href: string;
};

export type StudentHomeRecommendation = {
  eyebrow: string;
  title: string;
  description: string;
  reason: string;
  href: string;
  ctaLabel: string;
};

export type StudentHomeData = {
  keepGoing: { title: string; kind: string; progress: number; href: string }[];
  recommendation: StudentHomeRecommendation | null;
  featuredCourses: StudentHomeCourse[];
};

// Mono tracked eyebrows keep section hierarchy quiet and visually consistent.
function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <h2 className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
      {children}
    </h2>
  );
}

export default function StudentHome({ data }: { data: StudentHomeData }) {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
      {/* Upskilling: tracks entry points. */}
      <section className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Link
          href="/learning-path/skill"
          className="flex items-center justify-between rounded-xl border border-border bg-white p-5 transition-colors hover:border-zinc-400"
        >
          <div>
            <h3 className="text-sm font-semibold text-foreground">Skill tracks</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Sharpen one skill with focused labs.
            </p>
          </div>
          <Route size={18} strokeWidth={1.5} className="text-muted-foreground" />
        </Link>
        <Link
          href="/learning-path/career"
          className="flex items-center justify-between rounded-xl border border-border bg-white p-5 transition-colors hover:border-zinc-400"
        >
          <div>
            <h3 className="text-sm font-semibold text-foreground">Career tracks</h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Follow a guided path to a role.
            </p>
          </div>
          <Sparkles size={18} strokeWidth={1.5} className="text-muted-foreground" />
        </Link>
      </section>

      {/* CTA banners: labs and pacing. */}
      <section className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
        <Card className="rounded-2xl bg-zinc-950 text-white">
          <CardContent className="flex flex-col gap-2">
            <h3 className="text-base font-semibold">Explore labs</h3>
            <p className="text-sm text-white/70">
              Hands-on environments. Practice by doing, not watching.
            </p>
            <Link
              href="/labs"
              className="mt-1 inline-flex w-fit items-center rounded-full bg-white px-5 py-2 text-sm font-medium text-zinc-950 transition-colors hover:bg-zinc-200"
            >
              Go to labs
            </Link>
          </CardContent>
        </Card>
        <Card className="rounded-2xl bg-zinc-100">
          <CardContent className="flex flex-col gap-2">
            <h3 className="text-base font-semibold">Set your pace</h3>
            <p className="text-sm text-muted-foreground">
              Pick a track, plan your week, and watch your streak grow.
            </p>
            <Link
              href="/learning-path"
              className="mt-1 inline-flex w-fit items-center rounded-full bg-zinc-900 px-5 py-2 text-sm font-medium text-white transition-colors hover:bg-zinc-700"
            >
              View tracks
            </Link>
          </CardContent>
        </Card>
      </section>

      {/* Discovery: backend-picked recommendation. */}
      <section className="mt-8">
        <Eyebrow>Recommended for you</Eyebrow>
        {data.recommendation ? (
          <Card className="mt-3 rounded-2xl border-border bg-white">
            <CardContent className="flex flex-col gap-2">
              <span className="w-fit rounded-full bg-zinc-100 px-3 py-1 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                {data.recommendation.eyebrow}
              </span>
              <h3 className="text-lg font-semibold tracking-tight text-foreground">
                {data.recommendation.title}
              </h3>
              <p className="text-sm leading-relaxed text-muted-foreground">
                {data.recommendation.description}
              </p>
              <span className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
                {data.recommendation.reason}
              </span>
              <Link
                href={data.recommendation.href}
                className="mt-1 inline-flex w-fit items-center rounded-full bg-zinc-900 px-5 py-2.5 text-sm font-medium text-white transition-colors hover:bg-zinc-700"
              >
                {data.recommendation.ctaLabel}
              </Link>
            </CardContent>
          </Card>
        ) : (
          <p className="mt-3 text-sm text-muted-foreground">
            Recommendations show up once you browse a few courses.
          </p>
        )}
      </section>
      {/* Discovery: featured courses. */}
      <section className="mt-8">
        <div className="flex items-center justify-between">
          <Eyebrow>Discover courses</Eyebrow>
          <Link
            href="/courses"
            className="inline-flex items-center gap-1 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Browse all
            <ChevronRight size={14} strokeWidth={1.5} />
          </Link>
        </div>
        <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {data.featuredCourses.map((course) => (
            <Link
              key={course.href}
              href={course.href}
              className="flex flex-col justify-between rounded-xl border border-border bg-white p-4 transition-colors hover:border-zinc-400"
            >
              <div>
                <Badge
                  variant="outline"
                  className="rounded-full bg-transparent font-mono text-[10px] uppercase tracking-widest"
                >
                  {course.kind}
                </Badge>
                <h3 className="mt-2 text-sm font-semibold leading-snug text-foreground">
                  {course.title}
                </h3>
              </div>
              <span className="mt-4 font-mono text-[10px] uppercase tracking-widest text-muted-foreground">
                {course.duration}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* Keep going: in-progress work. */}
      {data.keepGoing.length > 0 && (
        <section className="mt-8">
          <Eyebrow>Keep going</Eyebrow>
          <div
            className={cn(
              "mt-3 flex flex-col rounded-xl border border-border bg-white px-2 py-1"
            )}
          >
            {data.keepGoing.map((row) => (
              <LessonRow key={row.href} data={row} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}