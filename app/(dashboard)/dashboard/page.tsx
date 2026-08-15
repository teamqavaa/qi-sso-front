import StudentDashboard from "@/components/dashboard/views/StudentDashboard";
import { getStatsAction } from "@/actions/stats";
import { buildDashboardData } from "./data";

export default async function DashboardPage() {
  // Overlay live stats onto the typed default dataset; new sections stay mock until backend endpoints exist.
  const stats = await getStatsAction();

  return <StudentDashboard data={buildDashboardData(stats)} />;
}