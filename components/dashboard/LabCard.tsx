import type { Lab } from "@/types/lab";

const statusStyles: Record<string, string> = {
  not_started: "bg-gray-100 text-gray-600",
  in_progress: "bg-blue-100 text-blue-700",
  completed: "bg-green-100 text-green-700",
};

const buttonLabels: Record<string, string> = {
  not_started: "Start",
  in_progress: "Continue",
  completed: "Review",
};

export default function LabCard({
  lab,
  langColors,
  labStatus = "not_started",
}: {
  lab: Lab;
  langColors: Record<string, string>;
  labStatus?: "not_started" | "in_progress" | "completed";
}) {
  return (
    <div className="bg-card rounded-xl border border-border p-5 flex items-center justify-between group">
      <div>
        <span className={`inline-block text-[10px] font-medium px-2 py-0.5 rounded-full mb-3 ${langColors[lab.language] ?? "text-gray-600 bg-gray-100"}`}>
          {lab.language}
        </span>
        <p className="text-sm font-medium text-foreground leading-snug mb-4">{lab.title}</p>
        <span className={`inline-block text-[10px] font-medium px-2 py-0.5 rounded-full ${statusStyles[labStatus]}`}>
          {labStatus.replace("_", " ")}
        </span>
      </div>

      <a
        href={`http://localhost:3001/labs/${lab.id}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#007bff] text-white text-xs font-medium hover:bg-[#0066d6] transition-colors shadow-sm flex-shrink-0"
      >
        {buttonLabels[labStatus]}
      </a>
    </div>
  );
}
