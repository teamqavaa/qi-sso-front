# Dashboard placeholder sections

These sections render mock data. Their backend endpoints do not exist yet.
They are hidden until wired. The dashboard shows the wired sections only:
greeting hero, stat cards, weekly streak, continue/keep-going.

To preview the placeholders, set `SHOW_PLACEHOLDER_SECTIONS` to `true` in
`components/dashboard/views/StudentDashboard.tsx`. The sections appear faded.
When a section is wired, remove its fade and its guard.

| Section | Component | Mock data (data.ts) | Needs backend endpoint |
|---|---|---|---|
| Notification banner | `student/NotificationBanner.tsx` | `banner` | notifications |
| Achievements | `student/AchievementBadge.tsx` | `achievements` | achievements |

## Wired sections

| Section | Data source |
|---|---|
| Continue where you left off + Keep going | courses-api `/api/my/progress/` (in-progress rows) with course summaries; empty state suggests random untouched courses |
| Recommendation (empty state featured card) | courses-api `/api/my/recommendation/`: untouched path (career first), else newest uncompleted course |

## Shell features

These shell features are removed until their backend endpoints exist.

| Feature | Location | Needs backend endpoint |
|---|---|---|
| Level + XP progress card | `DashboardShell.tsx` (sidebar) | user level / XP (see `components/dashboard/profile-data.ts`, currently unused) |
| Notification bell | `DashboardShell.tsx` (header) | notifications / unread count |
