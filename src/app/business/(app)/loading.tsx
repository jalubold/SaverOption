/** Shown while a business page loads its data. */
export default function Loading() {
  return (
    <div aria-busy="true" aria-live="polite">
      <span className="sr-only">Loading…</span>
      <div className="so-skeleton mb-6 h-7 w-48 rounded-md" />
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {Array.from({ length: 4 }, (_, i) => (
          <div key={i} className="biz-card h-28 p-4">
            <div className="so-skeleton h-3 w-24 rounded" />
            <div className="so-skeleton mt-4 h-6 w-32 rounded" />
            <div className="so-skeleton mt-3 h-2.5 w-20 rounded" />
          </div>
        ))}
      </div>
      <div className="mt-5 grid gap-5 lg:grid-cols-3">
        <div className="biz-card h-72 p-5 lg:col-span-2">
          <div className="so-skeleton h-3.5 w-40 rounded" />
          <div className="so-skeleton mt-6 h-48 rounded-lg" />
        </div>
        <div className="biz-card h-72 p-5">
          <div className="so-skeleton h-3.5 w-32 rounded" />
          <div className="so-skeleton mx-auto mt-8 size-36 rounded-full" />
        </div>
      </div>
    </div>
  );
}
