export default function ProgressHeaderBand({
  pathsCompleted,
  pathsStarted,
  coursesCompleted,
  coursesInProgress,
  labsCompleted,
  currentStreak,
}: {
  pathsCompleted: number;
  pathsStarted: number;
  coursesCompleted: number;
  coursesInProgress: number;
  labsCompleted: number;
  currentStreak: number;
}) {
  const cells = [
    {
      value: String(pathsCompleted),
      label: "Paths completed",
      meta: `${pathsStarted} started`,
    },
    {
      value: String(coursesCompleted),
      label: "Courses completed",
      meta: `${coursesInProgress} in progress`,
    },
    {
      value: String(labsCompleted),
      label: "Labs completed",
      meta: "From the practice lab",
    },
    {
      value: currentStreak > 0 ? `${currentStreak} ${currentStreak === 1 ? "day" : "days"}` : "0",
      label: "Current streak",
      meta: "",
    },
  ];

  return (
    <section className="grid grid-cols-2 divide-zinc-100 rounded-xl border border-zinc-200 bg-card sm:grid-cols-4 sm:divide-x">
      {cells.map((cell) => (
        <div key={cell.label} className="px-5 py-4">
          <p className="text-2xl font-bold tracking-tight text-foreground">{cell.value}</p>
          <p className="mt-1 font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            {cell.label}
          </p>
          {cell.meta && <p className="mt-0.5 text-xs text-muted-foreground">{cell.meta}</p>}
        </div>
      ))}
    </section>
  );
}
