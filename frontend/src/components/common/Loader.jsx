export default function Loader({ label = "Loading inventory...", rows = 4 }) {
  return (
    <section className="rounded-lg border border-slate-200 bg-white p-5 shadow-sm" aria-busy="true">
      <p className="mb-4 text-sm font-medium text-slate-600">{label}</p>
      <div className="space-y-3">
        {Array.from({ length: rows }).map((_, index) => (
          <div
            className="h-12 animate-pulse rounded-md bg-slate-200"
            data-testid="skeleton-row"
            key={index}
          />
        ))}
      </div>
    </section>
  );
}
