export type Skill = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  icon: string;
  order: number;
  is_active: boolean;
  duration_weeks: number;
  pace: string;
  includes_certificate: boolean;
  lab_count: number;
};
