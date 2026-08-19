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

export type PathBase = {
  slug: string;
  title: string;
  description: string;
  courseCount: number;
  weekCount: number;
  href: string;
};

export type CareerPath = PathBase & { icon: CareerPathIconName };

export type SkillPath = PathBase & { icon: SkillPathIconName };