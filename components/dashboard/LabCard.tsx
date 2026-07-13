import type { Lab } from "@/types/lab";

export default function LabCard({ lab, langColors }: { lab: Lab; langColors: Record<string, string> }) {
  return (
    <div className="bg-card rounded-xl border border-border p-5 flex items-center justify-between group">
      <div>
        <span className={`inline-block text-[10px] font-medium px-2 py-0.5 rounded-full mb-3 ${langColors[lab.language] ?? "text-gray-600 bg-gray-100"}`}>
          {lab.language}
        </span>
        <p className="text-sm font-medium text-foreground leading-snug mb-4">{lab.title}</p>
      </div>

      <a
        href={`http://localhost:3001/labs/${lab.id}`}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#007bff] text-white text-xs font-medium hover:bg-[#0066d6] transition-colors shadow-sm flex-shrink-0"
      >
        Start
      </a>
    </div>
  );
}
