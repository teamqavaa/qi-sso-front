import DashboardView from "@/components/dashboard/views/DashboardView";
import { mockStats, mockInProgressLabs, mockRecommendedLabs, mockLangColors } from "../layout";

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
