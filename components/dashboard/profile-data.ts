export type StudentLevel = {
  level: number;
  xp: number;
  xpMax: number;
};

// The /api/profile/ endpoint does not expose level/xp yet. This default keeps
// the sidebar contract stable until the backend provides the numbers.
export const DEFAULT_STUDENT_LEVEL: StudentLevel = {
  level: 4,
  xp: 1240,
  xpMax: 1600,
};