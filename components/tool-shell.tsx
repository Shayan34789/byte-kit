import Link from "next/link";
import { ArrowLeft, ArrowUpRight, ShieldCheck, Terminal, Cube } from "@phosphor-icons/react/dist/ssr";
import { ThemeToggle } from "./theme-toggle";
import type { ToolDefinition } from "@/lib/tools.config";

export function ToolShell({
  title,
  description,
  category,
  relatedTools,
  children,
}: {
  title: string;
  description: string;
  category: string;
  relatedTools?: ToolDefinition[];
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-[100dvh] bg-[#0c0d0e] text-[#f4f4f5] font-sans selection:bg-teal-500/20 selection:text-teal-300">
      {/* Subtle top ambient glow */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">
        <div className="absolute -top-32 left-1/2 -translate-x-1/2 w-[700px] h-[280px] bg-teal-500/5 blur-[120px] rounded-full" />
      </div>

      <header className="sticky top-0 z-40 border-b border-zinc-800/80 bg-[#0c0d0e]/85 shadow-[0_8px_24px_rgba(0,0,0,0.12)] backdrop-blur-md supports-[backdrop-filter]:bg-[#0c0d0e]/75">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="group flex items-center gap-3 transition-opacity hover:opacity-90"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg border border-zinc-700/60 bg-zinc-900 font-mono text-xs font-semibold text-teal-400 group-hover:border-teal-500/40 transition-colors">
              <Cube size={16} weight="duotone" />
            </div>
            <div className="flex flex-col">
              <span className="font-mono text-xs tracking-wider text-zinc-100 uppercase font-semibold">
                Byte-Kit
              </span>
              <span className="text-[10px] text-zinc-500 tracking-tight">Offline Runtime</span>
            </div>
          </Link>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              href="/"
              className="inline-flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/60 px-3.5 py-1.5 font-mono text-xs text-zinc-400 shadow-sm transition-all hover:-translate-y-0.5 hover:border-teal-500/40 hover:bg-teal-500/10 hover:text-teal-200 hover:shadow-md active:scale-[0.98]"
            >
              <ArrowLeft size={14} />
              <span>back to index</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="relative mx-auto max-w-6xl px-6 py-10">
        <div className="mb-8 border-b border-zinc-800/60 pb-8">
          <nav aria-label="Breadcrumb" className="mb-5 flex items-center gap-2 font-mono text-[11px] text-zinc-500">
            <Link href="/" className="transition-colors hover:text-teal-300">Home</Link>
            <span>/</span>
            <Link href={`/?category=${encodeURIComponent(category)}`} className="transition-colors hover:text-teal-300">{category} tools</Link>
            <span>/</span>
            <span className="text-zinc-400">Current tool</span>
          </nav>
          <div className="flex flex-wrap items-center gap-2.5 mb-3">
            <span className="inline-flex items-center gap-1.5 rounded-full border border-teal-500/20 bg-teal-500/10 px-2.5 py-0.5 font-mono text-[11px] font-medium text-teal-400">
              <Terminal size={12} />
              {category}
            </span>
            <span className="rounded-full border border-zinc-800 bg-zinc-900/70 px-2.5 py-0.5 font-mono text-[11px] text-zinc-400">
              Client Engine
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight text-zinc-100">
            {title}
          </h1>
          <p className="mt-2 text-sm sm:text-base text-zinc-400 max-w-2xl leading-relaxed">
            {description}
          </p>
        </div>

        <div className="rounded-2xl border border-zinc-800 bg-zinc-900/30 p-4 sm:p-6 shadow-2xl backdrop-blur-sm">
          {children}
        </div>

        {relatedTools && relatedTools.length > 0 && (
          <section className="mt-10" aria-labelledby="related-tools-heading">
            <div className="mb-4 flex items-end justify-between">
              <div>
                <p className="font-mono text-[10px] uppercase tracking-[0.2em] text-teal-400">Continue exploring</p>
                <h2 id="related-tools-heading" className="mt-1 text-xl font-bold text-zinc-100">Related {category} tools</h2>
              </div>
              <Link href="/" className="font-mono text-xs text-zinc-500 transition-colors hover:text-teal-300">View all tools</Link>
            </div>
            <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {relatedTools.map((relatedTool) => (
                <Link
                  key={relatedTool.slug}
                  href={`/tools/${relatedTool.slug}`}
                  className="group rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 transition-all hover:-translate-y-0.5 hover:border-teal-500/40 hover:bg-teal-500/5"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-semibold text-zinc-200 transition-colors group-hover:text-teal-300">{relatedTool.title}</span>
                    <ArrowUpRight size={15} className="text-zinc-600 transition-colors group-hover:text-teal-400" />
                  </div>
                  <p className="mt-1 line-clamp-2 text-xs leading-5 text-zinc-500">{relatedTool.description}</p>
                </Link>
              ))}
            </div>
          </section>
        )}

        <footer className="mt-8 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 text-xs text-zinc-500 font-mono">
          <div className="flex items-center gap-2">
            <ShieldCheck size={16} className="text-teal-400" weight="fill" />
            <span>Zero outbound telemetry. Executes directly inside V8 heap.</span>
          </div>
          <span className="text-zinc-600">Byte-Kit Utility Suite</span>
        </footer>
      </div>
    </main>
  );
}
