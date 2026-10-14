import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Cube, Envelope, GithubLogo } from "@phosphor-icons/react/dist/ssr";
import { siteUrl, StructuredData } from "@/lib/structured-data";

const repoUrl = "https://github.com/Shayan34789/byte-kit";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Get in touch with the Byte-Kit developer — report a bug, request a tool, or ask a question via the public GitHub repository.",
  alternates: {
    canonical: `${siteUrl}/contact`,
  },
  openGraph: {
    title: "Contact · Byte-Kit",
    description:
      "Get in touch with the Byte-Kit developer — report a bug, request a tool, or ask a question via the public GitHub repository.",
    url: `${siteUrl}/contact`,
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Contact — Byte-Kit",
      },
    ],
  },
};

export default function ContactPage() {
  return (
    <>
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "ContactPage",
          name: "Contact — Byte-Kit",
          url: `${siteUrl}/contact`,
          description:
            "Get in touch with the Byte-Kit developer — report a bug, request a tool, or ask a question via the public GitHub repository.",
          isPartOf: { "@type": "WebSite", name: "Byte-Kit", url: siteUrl },
        }}
      />
      <main className="min-h-[100dvh] bg-[#090a0b] font-sans text-[#f4f4f5] selection:bg-blue-500/20 selection:text-blue-300">
        <header className="sticky top-0 z-40 border-b border-zinc-800/80 bg-[#090a0b]/85 backdrop-blur-md">
          <div className="mx-auto flex max-w-4xl items-center justify-between px-6 py-4">
            <Link href="/" className="flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-md bg-zinc-100 text-zinc-900">
                <Cube size={16} weight="bold" />
              </span>
              <span className="text-[15px] font-semibold tracking-tight text-zinc-100">
                Byte-Kit
              </span>
            </Link>
            <Link
              href="/"
              className="inline-flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-zinc-400 transition-colors hover:bg-zinc-800/60 hover:text-zinc-100"
            >
              <ArrowLeft size={15} />
              <span>All tools</span>
            </Link>
          </div>
        </header>

        <div className="mx-auto max-w-4xl px-6 py-12 sm:py-16">
          <h1 className="text-3xl font-extrabold tracking-tight text-zinc-100 sm:text-4xl">
            Contact
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-400">
            Found a bug, want a new tool, or have a question? The fastest way to
            reach the developer is through the public repository — everything is
            tracked in the open, and you&apos;ll see the response there too.
          </p>

          <div className="mt-10 rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100 text-zinc-900">
                <GithubLogo size={22} weight="bold" />
              </span>
              <div>
                <h2 className="text-base font-semibold text-zinc-100">
                  Open an issue on GitHub
                </h2>
                <p className="text-sm text-zinc-500">
                  Bugs, tool requests, and questions
                </p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-zinc-400">
              Use the issue tracker for anything about the site or the tools. A
              good report includes: which tool page, what you did, what you
              expected, and what happened instead. New tool ideas are welcome —
              requests with a clear use case get the most attention.
            </p>
            <a
              href={repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-900 transition-colors hover:bg-white"
            >
              <GithubLogo size={16} weight="bold" />
              <span>Go to the repository</span>
            </a>
          </div>

          <div className="mt-8 rounded-xl border border-zinc-800/80 bg-zinc-900/40 p-6 sm:p-8">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 items-center justify-center rounded-lg bg-zinc-100 text-zinc-900">
                <Envelope size={22} weight="bold" />
              </span>
              <div>
                <h2 className="text-base font-semibold text-zinc-100">
                  Email the developer
                </h2>
                <p className="text-sm text-zinc-500">
                  For anything private or off the record
                </p>
              </div>
            </div>
            <p className="mt-4 text-sm leading-relaxed text-zinc-400">
              Prefer email over a public issue? Write to the address below.
              Bugs and tool requests are still best filed on GitHub so other
              users can follow along.
            </p>
            <a
              href="mailto:bytetips0@gmail.com"
              className="mt-5 inline-flex items-center gap-2 rounded-lg bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-900 transition-colors hover:bg-white"
            >
              <Envelope size={16} weight="bold" />
              <span>bytetips0@gmail.com</span>
            </a>
          </div>

          <div className="mt-8 text-sm leading-relaxed text-zinc-500">
            <p>
              For privacy or data questions, see the{" "}
              <Link
                href="/privacy"
                className="text-zinc-300 underline-offset-4 transition-colors hover:text-blue-300 hover:underline"
              >
                Privacy Policy
              </Link>
              . There&apos;s no account system — Byte-Kit never asks for your
              personal details.
            </p>
          </div>
        </div>

        <footer className="border-t border-zinc-800/80 py-8">
          <div className="mx-auto flex max-w-4xl flex-col items-center justify-between gap-3 px-6 font-mono text-xs text-zinc-500 sm:flex-row">
            <span>© 2026 Byte-Kit</span>
            <Link href="/" className="transition-colors hover:text-blue-300">
              All tools
            </Link>
          </div>
        </footer>
      </main>
    </>
  );
}
