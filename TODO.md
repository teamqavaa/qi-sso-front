# Dashboard features pending backend endpoints

The notification banner and achievements sections previously rendered mock data.
They are removed rather than previewed. Build them on real endpoints when those
exist.

## Wired sections

| Section | Data source |
|---|---|
| Continue where you left off + Keep going | courses-api `/api/my/progress/` (in-progress rows) with course summaries; empty state suggests random untouched courses |
| Recommendation (empty state featured card) | courses-api `/api/my/recommendation/`: untouched path (career first), else newest uncompleted course |

## Shell features

These shell features are removed until their backend endpoints exist.

| Feature | Location | Needs backend endpoint |
|---|---|---|
| Level + XP progress card | `DashboardShell.tsx` (sidebar) | user level / XP |
| Notification bell | `DashboardShell.tsx` (header) | notifications / unread count |
