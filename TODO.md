# Dashboard placeholder sections

These sections render mock data. Their backend endpoints do not exist yet.
They are hidden until wired. The dashboard shows the wired sections only:
greeting hero, stat cards, weekly streak.

To preview the placeholders, set `SHOW_PLACEHOLDER_SECTIONS` to `true` in
`components/dashboard/views/StudentDashboard.tsx`. The sections appear faded.
When a section is wired, remove its fade and its guard.

| Section | Component | Mock data (data.ts) | Needs backend endpoint |
|---|---|---|---|
| Notification banner | `student/NotificationBanner.tsx` | `banner` | notifications |
| Continue where you left off | `student/ContinueCard.tsx` | `continueCard` | recommended / continue |
| Keep going | `student/LessonRow.tsx` | `lessons` | enrolled content |
| Achievements | `student/AchievementBadge.tsx` | `achievements` | achievements |
| Up next | `student/UpNextCard.tsx` | `upNext` | recommendations |

## Shell features

These shell features are removed until their backend endpoints exist.

| Feature | Location | Needs backend endpoint |
|---|---|---|
| Level + XP progress card | `DashboardShell.tsx` (sidebar) | user level / XP (see `components/dashboard/profile-data.ts`, currently unused) |
| Notification bell | `DashboardShell.tsx` (header) | notifications / unread count |
