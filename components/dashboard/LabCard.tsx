import { ArrowRight, Plus } from "lucide-react";
import { Lab } from "./types";
import Link from "next/link";

export default function LabCard({ lab, langColors, isRecommended = false }: { lab: Lab; langColors: Record<string, string>; isRecommended?: boolean }) {
  return (
    <div
      key={lab.id}
      className={`${isRecommended ? "grid-cols-2 bg-card rounded-xl border border-border p-5 flex items-center justify-between group" : "flex-shrink-0 w-56 bg-card rounded-xl border border-border p-5 flex flex-col justify-between"}`}
    >
      <div>
        <span className={`inline-block text-[10px] font-medium px-2 py-0.5 rounded-full mb-3 ${langColors[lab.lang] ?? "text-gray-600 bg-gray-100"}`}>
          {lab.lang}
        </span>
        <p className="text-sm font-medium text-foreground leading-snug mb-4">{lab.title}</p>
      </div>

      {!isRecommended && lab.progress !== undefined ? (
        <div>
          <div className="w-full h-1 bg-[#f0f2f5] rounded-full overflow-hidden mb-2">
            <div
              className="h-full rounded-full bg-[#007bff]"
              style={{ width: `${lab.progress}%` }}
            />
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[11px] text-muted-foreground">{lab.progress}% done</span>
            <Link href={`/labs/${lab.id}`} className="w-7 h-7 rounded-full bg-[#007bff] flex items-center justify-center text-white hover:bg-[#0066d6] transition-colors shadow-sm">
              <ArrowRight size={13} />
            </Link>
          </div>
        </div>
      ) : (
        <Link href={`/labs/${lab.id}`} className="w-7 h-7 rounded-full border border-[#007bff] text-[#007bff] flex items-center justify-center hover:bg-[#007bff] hover:text-white transition-colors ml-4 flex-shrink-0">
          <Plus size={13} />
        </Link>
      )}
    </div>
  );
}
