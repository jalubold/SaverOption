/** Shown while a business page loads its data. */
export default function Loading() {
  return (
    <div aria-busy="true" aria-live="polite" className="animate-pulse">
      <span className="sr-only">Loading…</span>
      <div className="mb-6 h-7 w-48 rounded-md bg-subtle" />
      <div className="grid grid-cols-2 gap-3 md:grid-cols-3 xl:grid-cols-6">
        {Array.from({ length: 6 }, (_, i) => (
          <div key={i} className="biz-card h-24" />
        ))}
      </div>
      <div className="biz-card mt-5 h-64" />
    </div>
  );
}
