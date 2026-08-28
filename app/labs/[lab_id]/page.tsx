"use client";

import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, FlaskConical } from "lucide-react";

export default function LabPage() {
  const params = useParams();
  const router = useRouter();
  const labId = params.lab_id;

  return (
    <div className="min-h-screen bg-[#f8f9fb]">
      {/* Header for lab page */}
      <header className="flex items-center gap-4 px-6 py-4 bg-white border-b border-gray-100">
        <button
          onClick={() => router.back()}
          className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
        >
          <ArrowLeft size={20} />
        </button>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-md bg-[#007bff] flex items-center justify-center">
            <FlaskConical size={16} className="text-white" />
          </div>
          <span className="font-semibold text-gray-800">Qavaa</span>
        </div>
      </header>

      {/* Lab content */}
      <main className="px-6 py-8 max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">
          Lab #{labId}
        </h1>
        <p className="text-gray-600">
          This is the lab page for lab {labId}. No sidebar here!
        </p>
      </main>
    </div>
  );
}
