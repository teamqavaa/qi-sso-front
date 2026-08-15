import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    // Mirror the dashboard's key blocks so the skeleton matches the final layout while data streams.
    <div className="mx-auto w-full max-w-5xl px-4 py-6 sm:px-6 lg:px-8 lg:py-10">
      <Skeleton className="h-14 w-full rounded-2xl" />
      <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-3">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
      <Skeleton className="mt-8 h-48 w-full rounded-2xl" />
      <div className="mt-8 flex flex-col gap-3">
        {Array.from({ length: 2 }).map((_, i) => (
          <Skeleton key={i} className="h-28 w-full rounded-xl" />
        ))}
      </div>
    </div>
  );
}