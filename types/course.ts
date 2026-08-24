export type CourseLevel = "beginner" | "intermediate" | "advanced";

export type Course = {
  id: number;
  type: number;
  title: string;
  subtitle: string;
  description: string;
  language: string;
  level: CourseLevel;
  slug: string;
  is_active: boolean;
  thumbnail: string | null;
  instructor: string;
  duration_minutes: number;
  rating: number | null;
  review_count: number;
  price: string;
  original_price: string | null;
  cohort_label: string;
  audience: string;
  downloadable_files_count: number;
  created_at: string;
  updated_at: string;
};

export type CourseBullet = {
  id: number;
  course: number;
  order: number;
  content: string;
};

export type CourseDetail = Course & {
  highlights: CourseBullet[];
  outcomes: CourseBullet[];
  learning_points: CourseBullet[];
  requirements: CourseBullet[];
};

export type CurriculumLesson = {
  id: number;
  title: string;
  order: number;
  lesson_type: "video" | "quiz";
  duration_minutes: number;
};

export type CurriculumModule = {
  id: number;
  title: string;
  order: number;
  lessons: CurriculumLesson[];
};

export type CurriculumResponse = {
  course_id: number;
  total_lessons: number;
  total_duration_minutes: number;
  modules: CurriculumModule[];
};

export type CoursePathContext = {
  id: number;
  title: string;
  slug: string;
  kind: "career" | "skill";
  position: number;
  total_courses: number;
};
