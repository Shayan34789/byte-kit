import Link from "next/link";
import { ArrowLeft, ArrowUpRight, Cube } from "@phosphor-icons/react/dist/ssr";
import { ThemeToggle } from "./theme-toggle";
import type { ToolDefinition } from "@/lib/tools.config";

export function ToolShell({
  title,
  description,
  category,
  relatedTools,
  usage,
  children,
}: {
  title: string;
  description: string;
  category: string;
  relatedTools?: ToolDefinition[];
  usage?: string[];
  children: React.ReactNode;
}) {
  return (
    <main className="min-h-[100dvh] bg-[#090a0b] font-sans text-[#f4f4f5]">
      <header className="sticky top-0 z-40 border-b border-zinc-800/70 bg-[#090a0b]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-3.5">
          <Link href="/" className="flex items-center gap-2.5">
            <span className="flex h-7 w-7 items-center justify-center rounded-md bg-zinc-100 text-zinc-900">
              <Cube size={16} weight="bold" />
            </span>
            <span className="text-[15px] font-semibold tracking-tight text-zinc-100">
              Byte-Kit
            </span>
          </Link>

          <div className="flex items-center gap-2">
            <ThemeToggle />
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-zinc-400 transition-colors hover:bg-zinc-800/60 hover:text-zinc-100"
            >
              <ArrowLeft size={15} />
              <span>All tools</span>
            </Link>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-6 py-10 sm:py-14">
        <nav aria-label="Breadcrumb" className="mb-6 flex items-center gap-2 text-[13px] text-zinc-500">
          <Link href="/" className="transition-colors hover:text-zinc-200">Tools</Link>
          <span className="text-zinc-700">/</span>
          <span className="text-zinc-300">{category}</span>
        </nav>

        <h1 className="text-3xl font-semibold tracking-tight text-zinc-100 sm:text-4xl">
          {title}
        </h1>
        <p className="mt-3 max-w-2xl text-[15px] leading-relaxed text-zinc-400">
          {description}
        </p>

        <div className="mt-8 rounded-xl border border-zinc-800/80 bg-[#101012] p-4 sm:p-6">
          {children}
        </div>

        {usage && usage.length > 0 && (
          <section className="mt-12" aria-labelledby="how-to-use-heading">
            <h2 id="how-to-use-heading" className="text-lg font-semibold tracking-tight text-zinc-100">
              How to use
            </h2>
            <ol className="mt-4 space-y-3">
              {usage.map((step, index) => (
                <li key={index} className="flex gap-3.5 text-[15px] text-zinc-400">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full border border-zinc-700 text-xs font-medium text-zinc-400">
                    {index + 1}
                  </span>
                  <span className="leading-relaxed">{step}</span>
                </li>
              ))}
            </ol>
          </section>
        )}

        {relatedTools && relatedTools.length > 0 && (
          <section className="mt-12" aria-labelledby="related-tools-heading">
            <div className="mb-4 flex items-end justify-between">
              <h2 id="related-tools-heading" className="text-lg font-semibold tracking-tight text-zinc-100">
                Related tools
              </h2>
              <Link href="/" className="text-sm text-zinc-500 transition-colors hover:text-zinc-200">
                View all
              </Link>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {relatedTools.map((relatedTool) => (
                <Link
                  key={relatedTool.slug}
                  href={`/tools/${relatedTool.slug}`}
                  className="group rounded-xl border border-zinc-800/80 bg-[#101012] p-4 transition-colors hover:border-zinc-600"
                >
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-sm font-medium text-zinc-200">{relatedTool.title}</span>
                    <ArrowUpRight size={15} className="shrink-0 text-zinc-700 transition-all group-hover:translate-x-0.5 group-hover:text-zinc-400" />
                  </div>
                  <p className="mt-1 line-clamp-2 text-[13px] leading-relaxed text-zinc-500">
                    {relatedTool.description}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        )}

        <footer className="mt-14 flex flex-col gap-3 border-t border-zinc-800/70 pt-6 text-sm text-zinc-500 sm:flex-row sm:items-center sm:justify-between">
          <span>Runs entirely in your browser.</span>
          <div className="flex items-center gap-5">
            <Link href="/privacy" className="transition-colors hover:text-zinc-200">
              Privacy
            </Link>
            <Link href="/terms" className="transition-colors hover:text-zinc-200">
              Terms
            </Link>
            <Link href="/cookie-policy" className="transition-colors hover:text-zinc-200">
              Cookies
            </Link>
          </div>
        </footer>
      </div>
    </main>
  );
}
