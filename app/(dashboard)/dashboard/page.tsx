import DashboardView from "@/components/dashboard/views/DashboardView";
import { mockStats, mockInProgressLabs, mockRecommendedLabs, mockLangColors } from "./mock-data";

export default function DashboardPage() {
  return (
    <DashboardView
      stats={mockStats}
      inProgressLabs={mockInProgressLabs}
      recommendedLabs={mockRecommendedLabs}
      langColors={mockLangColors}
    />
  );
}
