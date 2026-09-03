import Link from "next/link";
import { Route, Sparkles } from "lucide-react";

export default function AllTracksPage() {
  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold tracking-tight text-foreground sm:text-3xl">
          Tracks
        </h1>
        <p className="mt-2 text-sm text-muted-foreground">
          Choose a focus area. Sharpen a skill with labs or follow a guided
          career path.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <Link
          href="/skill-tracks"
          className="flex items-center justify-between rounded-3xl border border-neutral-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
        >
          <div>
            <h2 className="text-base font-bold text-neutral-900">Skill tracks</h2>
            <p className="mt-1 text-sm font-medium text-neutral-500">
              Sharpen one skill with focused labs.
            </p>
          </div>
          <Route size={18} strokeWidth={1.5} className="text-blue-400" />
        </Link>

        <Link
          href="/career-tracks"
          className="flex items-center justify-between rounded-3xl border border-neutral-100 bg-white p-6 shadow-sm transition-shadow hover:shadow-md"
        >
          <div>
            <h2 className="text-base font-bold text-neutral-900">Career tracks</h2>
            <p className="mt-1 text-sm font-medium text-neutral-500">
              Follow a guided path to a role.
            </p>
          </div>
          <Sparkles size={18} strokeWidth={1.5} className="text-blue-400" />
        </Link>
      </div>
    </div>
  );
}
