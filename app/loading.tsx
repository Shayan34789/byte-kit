export default function Loading() {
  return (
    <main className="flex min-h-[100dvh] items-center justify-center bg-[#090a0b] text-zinc-100">
      <div className="flex flex-col items-center gap-5">
        <div className="relative flex h-14 w-14 items-center justify-center rounded-2xl border border-blue-500/30 bg-blue-500/10">
          <span className="absolute inset-1 animate-spin rounded-xl border-2 border-transparent border-t-blue-400" />
          <span className="h-2.5 w-2.5 animate-pulse rounded-full bg-blue-400" />
        </div>
        <div className="text-center">
          <p className="font-mono text-sm font-semibold text-zinc-200">Loading Byte-Kit</p>
          <p className="mt-1 font-mono text-xs text-zinc-500">Preparing browser tools...</p>
        </div>
      </div>
    </main>
  );
}
