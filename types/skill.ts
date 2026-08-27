export type Skill = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  icon: string;
  order: number;
  is_active: boolean;
};