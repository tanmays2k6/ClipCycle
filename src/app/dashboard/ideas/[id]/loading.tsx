"use client";


export default function IdeaLoading() {
  return (
    <div className="max-w-5xl mx-auto space-y-6 animate-shimmer">
      {/* Breadcrumb skeleton */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-xl bg-surface border border-border" />
          <div>
            <div className="w-48 h-3 bg-surface rounded mb-2" />
            <div className="w-32 h-5 bg-surface-hover rounded" />
          </div>
        </div>
        <div className="flex gap-2">
          <div className="w-24 h-9 rounded-xl bg-surface border border-border" />
          <div className="w-9 h-9 rounded-xl bg-surface border border-border" />
          <div className="w-9 h-9 rounded-xl bg-surface border border-border" />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="p-6 rounded-2xl bg-surface/40 border border-border space-y-4">
            <div className="flex justify-between border-b border-border pb-3">
              <div className="w-40 h-4 bg-surface rounded" />
              <div className="w-20 h-6 bg-surface rounded-lg" />
            </div>
            <div className="space-y-3">
              <div className="w-3/4 h-8 bg-surface-hover rounded-lg" />
              <div className="space-y-2 mt-4">
                <div className="w-full h-4 bg-surface rounded" />
                <div className="w-5/6 h-4 bg-surface rounded" />
                <div className="w-4/6 h-4 bg-surface rounded" />
              </div>
            </div>
          </div>
          
          <div className="p-6 rounded-2xl bg-surface/40 border border-border h-32" />
          <div className="p-6 rounded-2xl bg-surface/40 border border-border h-32" />
        </div>

        <div className="space-y-6">
          <div className="p-5 rounded-2xl bg-surface/40 border border-border h-[400px]" />
        </div>
      </div>
    </div>
  );
}
