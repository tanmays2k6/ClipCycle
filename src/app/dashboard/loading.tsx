export default function DashboardLoading() {
  return (
    <div className="max-w-[1600px] mx-auto w-full p-6 space-y-8 animate-shimmer">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-border/50">
        <div className="space-y-3">
          <div className="w-48 h-8 rounded-lg bg-surface border border-border" />
          <div className="w-72 h-4 rounded-md bg-surface-hover" />
        </div>
        <div className="flex items-center gap-3">
          <div className="w-28 h-10 rounded-xl bg-surface border border-border" />
          <div className="w-32 h-10 rounded-xl bg-surface border border-border" />
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-[100px] rounded-2xl bg-surface/40 border border-border p-4" />
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 pt-4">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-[280px] rounded-2xl bg-surface/40 border border-border p-6 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="w-full h-5 rounded-md bg-surface-hover" />
              <div className="space-y-2">
                <div className="w-full h-3 rounded-md bg-surface-hover/50" />
                <div className="w-4/5 h-3 rounded-md bg-surface-hover/50" />
              </div>
            </div>
            <div className="w-full h-10 rounded-xl bg-surface-hover/50 mt-4" />
          </div>
        ))}
      </div>
    </div>
  );
}
