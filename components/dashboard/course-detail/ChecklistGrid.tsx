import { Check } from "lucide-react";

export default function ChecklistGrid({ items }: { items: string[] }) {
  if (items.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">Outcomes will appear here soon.</p>
    );
  }

  return (
    <ul className="grid grid-cols-1 gap-x-8 gap-y-3 sm:grid-cols-2">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2 text-sm leading-relaxed text-foreground">
          <Check size={14} strokeWidth={2.5} className="mt-1 shrink-0" aria-hidden />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}
