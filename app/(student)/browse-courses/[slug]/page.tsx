import { notFound } from "next/navigation";

import {
  getActiveCoursesAction,
  getCourseAction,
  getCourseCurriculumAction,
  getCoursePathContextAction,
} from "@/actions/courses";
import { getMyCourseProgressAction } from "@/actions/course-progress";
import { getMyEnrollmentsAction, type Enrollment } from "@/actions/enrollments";
import PageBreadcrumbs from "@/components/dashboard/PageBreadcrumbs";
import CourseHeaderCard from "@/components/dashboard/course-detail/CourseHeaderCard";
import CourseTabs, { type CourseTab } from "@/components/dashboard/course-detail/CourseTabs";
import CurriculumSummaryBar from "@/components/dashboard/course-detail/CurriculumSummaryBar";
import ModuleGroup from "@/components/dashboard/course-detail/ModuleGroup";
import PathContextCard from "@/components/dashboard/course-detail/PathContextCard";
import PurchaseCard from "@/components/dashboard/course-detail/PurchaseCard";
import { deriveLessonStates } from "@/lib/lesson-status";
import { formatDuration } from "@/lib/format";
import type { CourseBullet } from "@/types/course";

const sectionLabelClass =
  "text-[11px] font-bold text-neutral-400 tracking-wider uppercase";

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
    <div className="flex flex-col gap-8">
      <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-3">
        <div className="flex flex-col gap-4 lg:col-span-2">
          <h3 className="text-xl font-bold text-neutral-900">About this course</h3>
          <p className="text-sm leading-relaxed text-neutral-600">{description}</p>
        </div>

        <div className="flex flex-col gap-3 rounded-2xl border border-neutral-200/80 bg-neutral-50 p-6">
          <span className={sectionLabelClass}>Who this is for</span>
          <p className="text-xs leading-relaxed text-neutral-700">
            {audience || "Audience notes will appear here soon."}
          </p>
        </div>
      </div>

      <div className="flex flex-col gap-4 border-t border-neutral-100 pt-4">
        <span className={sectionLabelClass}>You&apos;ll learn to</span>
        <div className="grid grid-cols-1 gap-4 text-xs font-semibold text-neutral-800 sm:grid-cols-2">
          {[...outcomes].sort((a, b) => a.order - b.order).map((item) => (
            <div key={item.id} className="flex items-start gap-2.5">
              <span className="font-bold text-neutral-900">✓</span>
              <span className="leading-relaxed">{item.content}</span>
            </div>
          ))}
        </div>
      </div>
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

export default async function BrowseCourseDetailPage({
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

  const [detail, progress, curriculum, pathContext, enrollments] = await Promise.all([
    getCourseAction(summary.id),
    getMyCourseProgressAction(summary.id),
    getCourseCurriculumAction(summary.id),
    getCoursePathContextAction(summary.id),
    getMyEnrollmentsAction(),
  ]);

  const course = detail.course;
  const status = progress.entry?.status ?? "not_started";
  const isBought = enrollments.enrollments.some(
    (entry: Enrollment) => entry.course_details?.slug === summary.slug
  );
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
    <div className="min-h-screen bg-[#f8fafc]">
      <div className="mx-auto w-full max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <PageBreadcrumbs
          className="mb-6"
          items={[
            { label: "Browse Courses", href: "/browse-courses" },
            { label: summary.title, href: `/browse-courses/${slug}` },
          ]}
        />
        {(error || detail.error) && (
          <p className="mb-4 text-xs text-red-600">Some course details could not be loaded.</p>
        )}

        <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-12">
          <div className="flex flex-col gap-8 lg:col-span-8">
            <CourseHeaderCard
              title={summary.title}
              subtitle={summary.subtitle}
              description={course?.description || summary.description || ""}
              thumbnail={summary.thumbnail}
              category={course?.category_details?.name ?? null}
              level={summary.level}
              language={summary.language}
              promoVideoUrl={course?.promo_video_url ?? null}
            />
            <PathContextCard paths={pathContext.paths} />
            <CourseTabs tabs={tabs} />
          </div>

          <div className="lg:col-span-4">
            <PurchaseCard
              courseId={summary.id}
              price={summary.price}
              originalPrice={summary.original_price}
              cohortLabel={summary.cohort_label}
              includedItems={includedItems}
              initialStatus={status}
              isBought={isBought}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
