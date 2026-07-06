export type { User } from "@/types/user";

export type Stat = {
  label: string;
  value: string | number;
  iconName: "Award" | "BarChart2" | "FlaskConical";
};

export type Lab = {
  id: number;
  title: string;
  lang: string;
  progress?: number;
};

export type NavItem = {
  id: string;
  label: string;
  iconName:
    | "LayoutDashboard"
    | "FlaskConical"
    | "BookOpen"
    | "BarChart2"
    | "Settings";
};
