import { getActiveCoursesAction } from "@/actions/courses";
import { getMyProgressAction } from "@/actions/course-progress";
import BrowsePage from "@/components/browse/BrowsePage";
import { mapCourseToItem } from "@/components/browse/types";

export default async function BrowseCoursesPage() {
  const [coursesResult, progressResult] = await Promise.all([
    getActiveCoursesAction(),
    getMyProgressAction(),
  ]);

  const courses = coursesResult.courses;
  const items = courses.map(mapCourseToItem);

  const inProgressPercentById: Record<number, number> = {};
  for (const row of progressResult.progress) {
    inProgressPercentById[row.course_id] = row.progress_percent;
  }

  return (
    <BrowsePage
      courses={items}
      inProgressPercentById={inProgressPercentById}
      hrefBase="/browse-courses"
    />
  );
}
