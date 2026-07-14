import { getLabsAction } from "@/actions/labs";
import LabCard from "@/components/dashboard/LabCard";

const langColors: Record<string, string> = {
  python: "text-indigo-600 bg-indigo-50",
  javascript: "text-yellow-700 bg-yellow-50",
  typescript: "text-blue-700 bg-blue-50",
  react: "text-blue-600 bg-blue-50",
  "node.js": "text-green-700 bg-green-50",
  sql: "text-orange-600 bg-orange-50",
  css: "text-pink-600 bg-pink-50",
  html: "text-orange-600 bg-orange-50",
  git: "text-gray-700 bg-gray-100",
  java: "text-red-600 bg-red-50",
  go: "text-cyan-600 bg-cyan-50",
  rust: "text-orange-700 bg-orange-50",
};

export default async function LabsPage() {
  const { labs, error } = await getLabsAction();

  if (error || labs.length === 0) {
    return (
      <div className="px-8 py-10 max-w-5xl mx-auto w-full">
        <p className="text-sm text-muted-foreground">No labs available.</p>
      </div>
    );
  }

  return (
    <div className="px-8 py-10 max-w-5xl mx-auto w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-foreground tracking-tight">My Labs</h1>
      </div>
      <div className="grid grid-cols-2 gap-4">
        {labs.map((lab) => (
          <LabCard key={lab.id} lab={lab} langColors={langColors} />
        ))}
      </div>
    </div>
  );
}
