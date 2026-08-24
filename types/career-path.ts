import type { Course } from "@/types/course";

export type PathKind = "skill" | "career";

export type CareerPathIconName =
  | "backend"
  | "frontend"
  | "data"
  | "cloud"
  | "security"
  | "mobile";

export type SkillPathIconName =
  | "git"
  | "api"
  | "sql"
  | "cli"
  | "docker"
  | "data-viz"
  | "testing"
  | "security";

export type PathBullet = {
  id: number;
  order: number;
  content: string;
};

// Mirrors the LearningPath model in courses-api.
export type LearningPath = {
  id: number;
  kind: PathKind;
  title: string;
  slug: string;
  description: string | null;
  icon: string;
  duration_weeks: number;
  pace: string;
  includes_certificate: boolean;
  order: number;
  is_active: boolean;
  course_count: number;
  created_at: string;
  updated_at: string;
};

// Payload of GET /api/learning-paths/{id}/detail/.
export type LearningPathDetail = LearningPath & {
  outcomes: PathBullet[];
  prerequisites: PathBullet[];
  courses: Course[];
};
