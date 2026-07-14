import DashboardView from "@/components/dashboard/views/DashboardView";
import { mockStats } from "./mock-data";
import { getLabsAction } from "@/actions/labs";

export default async function DashboardPage() {
  const { labs } = await getLabsAction();

  return (
    <DashboardView
      stats={mockStats}
      labs={labs}
    />
  );
}
