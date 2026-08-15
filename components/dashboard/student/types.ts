export type Stat = {
  label: string;
  value: string;
  meta: string;
};

export type NotificationBannerData = {
  count: number;
  initials: string;
  message: string;
  ctaLabel: string;
};

export type ContinueMeta = {
  icon: "clock" | "star" | "calendar";
  text: string;
};

export type ContinueCardData = {
  tags: string[];
  title: string;
  description: string;
  progress: number;
  progressLabel: string;
  meta: ContinueMeta[];
  primaryCta: string;
  secondaryCta: string;
};

export type LessonRowData = {
  title: string;
  kind: string;
  progress: number;
};

export type StreakDayState = "done" | "today" | "upcoming";

export type StreakDay = {
  label: string;
  state: StreakDayState;
};

export type StreakData = {
  summary: string;
  days: StreakDay[];
};

export type AchievementIconName = "award" | "flame" | "terminal" | "shield";

export type AchievementBadgeData = {
  title: string;
  detail: string;
  icon: AchievementIconName;
  earned: boolean;
  locked: boolean;
};

export type UpNextData = {
  eyebrow: string;
  message: string;
  courseTitle: string;
  courseDuration: string;
  courseTag: string;
  ctaLabel: string;
  dismissLabel: string;
};

export type StudentDashboardData = {
  greetingName: string;
  greetingSubtitle: string;
  banner: NotificationBannerData;
  stats: Stat[];
  continueCard: ContinueCardData;
  lessons: LessonRowData[];
  streak: StreakData;
  achievements: AchievementBadgeData[];
  upNext: UpNextData;
};