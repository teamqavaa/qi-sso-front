import { Award, BarChart2, FlaskConical } from "lucide-react";
import styles from "./Dashboard.module.css";
import { Stat } from "./types";

const statIconMap = {
  Award,
  BarChart2,
  FlaskConical,
};

export default function StatCard({ stat, isFirst = false }: { stat: Stat; isFirst?: boolean }) {
  const Icon = statIconMap[stat.iconName];
  return (
    <div
      className={`bg-card rounded-xl border border-border px-5 py-5 relative overflow-hidden ${isFirst ? styles.statCard : ""}`}
    >
      <Icon size={16} className="text-muted-foreground mb-3" strokeWidth={1.5} />
      <p className="text-3xl font-semibold text-foreground tracking-tight">{stat.value}</p>
      <p className="text-xs text-muted-foreground mt-1">{stat.label}</p>
    </div>
  );
}
