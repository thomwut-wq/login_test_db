function Bone({ className }: { className: string }) {
  return <div className={`animate-pulse rounded-md bg-slate-200/80 ${className}`} />;
}

export default function Loading() {
  return (
    <div className="min-h-dvh">
      <div className="h-16 border-b border-slate-200 bg-white" />
      <div className="mx-auto max-w-6xl space-y-6 px-4 py-8 sm:px-6" aria-busy="true" aria-label="Loading dashboard">
        <div className="flex items-center gap-6 rounded-2xl border border-slate-200 bg-white p-6">
          <Bone className="size-14 rounded-full" />
          <div className="flex-1 space-y-2"><Bone className="h-3 w-24" /><Bone className="h-5 w-48" /><Bone className="h-3 w-64" /></div>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {[0, 1, 2].map((i) => (
            <div key={i} className="space-y-3 rounded-xl border border-slate-200 bg-white p-5"><Bone className="h-3 w-28" /><Bone className="h-8 w-16" /></div>
          ))}
        </div>
        <div className="space-y-4 rounded-2xl border border-slate-200 bg-white p-5">
          <Bone className="h-4 w-40" />
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3"><Bone className="size-9 rounded-full" /><Bone className="h-4 flex-1" /></div>
          ))}
        </div>
      </div>
    </div>
  );
}
