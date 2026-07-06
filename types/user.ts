export type User = {
  id: string;
  full_name: string | null;
  display_name: string | null;
  avatar: string | null;
  bio: string | null;
  birth_date: string | null;
  city: string | null;
  country: string | null;
  language: string | null;
  role: "student" | "instructor" | "admin" | "parent";
};
