export default function PlaceholderView({ title }: { title: string }) {
  return (
    <div className="px-8 py-10 max-w-5xl mx-auto w-full">
      <h1 className="text-2xl font-semibold text-foreground tracking-tight mb-2">{title}</h1>
      <p className="text-sm text-muted-foreground">This section is coming soon.</p>
    </div>
  );
}
