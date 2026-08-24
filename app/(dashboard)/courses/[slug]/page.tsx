import { notFound } from "next/navigation";

import {
  getActiveCoursesAction,
  getCourseAction,
  getCourseCurriculumAction,
  getCoursePathContextAction,
} from "@/actions/courses";
import { getMyCourseProgressAction } from "@/actions/course-progress";
import ChecklistGrid from "@/components/dashboard/course-detail/ChecklistGrid";
import CourseTabs, { type CourseTab } from "@/components/dashboard/course-detail/CourseTabs";
import CurriculumSummaryBar from "@/components/dashboard/course-detail/CurriculumSummaryBar";
import ModuleGroup from "@/components/dashboard/course-detail/ModuleGroup";
import PathContextCard from "@/components/dashboard/course-detail/PathContextCard";
import PurchaseCard from "@/components/dashboard/course-detail/PurchaseCard";
import { deriveLessonStates } from "@/lib/lesson-status";
import { formatDuration } from "@/lib/format";
import type { CourseBullet } from "@/types/course";

function OverviewPanel({
  description,
  audience,
  outcomes,
}: {
  description: string;
  audience: string;
  outcomes: CourseBullet[];
}) {
  return (
    <div className="space-y-8">
      <section>
        <h2 className="text-base font-bold text-foreground">About this course</h2>
        <p className="mt-3 max-w-[70ch] text-sm leading-relaxed text-muted-foreground">
          {description}
        </p>
      </section>

      <section className="rounded-xl bg-zinc-100 p-5">
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          Who this is for
        </p>
        <p className="mt-2 max-w-[70ch] text-sm leading-relaxed text-foreground">
          {audience || "Audience notes will appear here soon."}
        </p>
      </section>

      <section>
        <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          You&apos;ll learn to
        </p>
        <div className="mt-4">
          <ChecklistGrid
            items={[...outcomes].sort((a, b) => a.order - b.order).map((item) => item.content)}
          />
        </div>
      </section>
    </div>
  );
}

function CurriculumPanel({
  curriculum,
  percent,
}: {
  curriculum: NonNullable<Awaited<ReturnType<typeof getCourseCurriculumAction>>["curriculum"]>;
  percent: number;
}) {
  const lessons = curriculum.modules.flatMap((module) => module.lessons);
  if (lessons.length === 0) {
    return (
      <div className="space-y-3" aria-busy>
        {[0, 1, 2].map((row) => (
          <div key={row} className="h-12 animate-pulse rounded-xl bg-zinc-100" />
        ))}
        <p className="pt-2 text-sm text-muted-foreground">
          The lesson plan is not published yet.
        </p>
      </div>
    );
  }

  const states = deriveLessonStates(lessons, percent);
  const completedCount = lessons.filter((lesson) => states.get(lesson.id) === "completed").length;

  return (
    <div className="space-y-6" id="curriculum">
      <CurriculumSummaryBar
        totalLessons={lessons.length}
        durationMinutes={curriculum.total_duration_minutes}
        completedCount={completedCount}
        percent={percent}
      />
      {curriculum.modules.map((module) => (
        <ModuleGroup key={module.id} module={module} states={states} />
      ))}
    </div>
  );
}

export default async function CourseDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;

  const { courses, error } = await getActiveCoursesAction();
  const summary = courses.find((item) => item.slug === slug);
  if (!summary) {
    notFound();
  }

  // Detail, progress, outline and path context are independent reads.
  const [detail, progress, curriculum, pathContext] = await Promise.all([
    getCourseAction(summary.id),
    getMyCourseProgressAction(summary.id),
    getCourseCurriculumAction(summary.id),
    getCoursePathContextAction(summary.id),
  ]);

  const course = detail.course;
  const status = progress.entry?.status ?? "not_started";
  const percent = progress.entry?.progress_percent ?? 0;
  const curriculumData = curriculum.curriculum;

  const includedItems: string[] = [];
  if (curriculumData && curriculumData.total_lessons > 0) {
    includedItems.push(
      `${curriculumData.total_lessons} lessons · ${formatDuration(curriculumData.total_duration_minutes)} of video`
    );
  }
  if (summary.downloadable_files_count > 0) {
    includedItems.push(`${summary.downloadable_files_count} downloadable files & templates`);
  }
  includedItems.push("Private community access", "Lifetime access & updates");

  const tabs: CourseTab[] = [
    {
      key: "overview",
      label: "Overview",
      content: (
        <OverviewPanel
          description={course?.description || summary.description || ""}
          audience={course?.audience || ""}
          outcomes={course?.outcomes ?? []}
        />
      ),
    },
    {
      key: "curriculum",
      label: "Curriculum",
      content: curriculumData ? (
        <CurriculumPanel curriculum={curriculumData} percent={percent} />
      ) : (
        <p className="text-sm text-muted-foreground">The lesson plan could not be loaded.</p>
      ),
    },
  ];

  return (
    <div className="mx-auto w-full max-w-6xl px-8 py-10">
      <header>
        <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
          <span>{summary.level}</span>
          <span aria-hidden>·</span>
          <span>{summary.language}</span>
          {summary.duration_minutes > 0 && (
            <>
              <span aria-hidden>·</span>
              <span>{formatDuration(summary.duration_minutes)}</span>
            </>
          )}
        </div>
        <h1 className="mt-3 max-w-3xl text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          {summary.title}
        </h1>
        <p className="mt-2 max-w-3xl text-sm text-muted-foreground">{summary.subtitle}</p>
        {summary.instructor && (
          <p className="mt-2 text-xs text-muted-foreground">Taught by {summary.instructor}</p>
        )}
        {(error || detail.error) && (
          <p className="mt-3 text-xs text-red-600">Some course details could not be loaded.</p>
        )}
      </header>

      <div className="mt-8 grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0 space-y-8">
          <PathContextCard paths={pathContext.paths} />
          <CourseTabs tabs={tabs} />
        </div>

        <aside className="lg:sticky lg:top-24">
          <PurchaseCard
            courseId={summary.id}
            price={summary.price}
            originalPrice={summary.original_price}
            cohortLabel={summary.cohort_label}
            includedItems={includedItems}
            initialStatus={status}
          />
        </aside>
      </div>
    </div>
  );
}
