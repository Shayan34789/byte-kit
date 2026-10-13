import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Cube } from "@phosphor-icons/react/dist/ssr";
import { siteUrl, StructuredData } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "About",
  description:
    "Byte-Kit is a free collection of developer tools that run entirely in your browser. Learn what it is, why it exists, and who builds it.",
  alternates: {
    canonical: `${siteUrl}/about`,
  },
  openGraph: {
    title: "About · Byte-Kit",
    description:
      "Byte-Kit is a free collection of developer tools that run entirely in your browser. Learn what it is, why it exists, and who builds it.",
    url: `${siteUrl}/about`,
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "About — Byte-Kit",
      },
    ],
  },
};

const sections = [
  {
    heading: "What Byte-Kit is",
    body: [
      "Byte-Kit is a free collection of online developer tools — formatters, encoders, converters, generators, and testers for everyday JSON, CSS, JWT, Base64, regex, color, image, and text workflows. Every tool runs entirely in your browser, so nothing you paste or upload ever leaves your device.",
    ],
  },
  {
    heading: "Why it exists",
    body: [
      "Most online tools of this kind either require an account, send your data to a server, or bury the actual tool under advertising. Byte-Kit is built on the opposite idea: open a page, use the tool, close the tab. No sign-up, no uploads, no tracking beyond aggregate analytics — and no ads in the tools themselves.",
    ],
  },
  {
    heading: "Who builds it",
    body: [
      "Byte-Kit is an independent one-person project. It's designed, built, and maintained by a solo developer who got tired of ugly, ad-stuffed tool pages and decided to make the clean version. If you'd like to follow along or contribute, the site's source code is public on GitHub.",
    ],
  },
  {
    heading: "How it's built",
    body: [
      "The site is a statically generated web app served from GitHub Pages. Tools are plain client-side code using browser APIs (JavaScript, Canvas, the Web Crypto API) — there is no server processing requests, which is exactly why your data never leaves your device. The design goal is simple: fast, minimal, and readable on any screen.",
    ],
  },
  {
    heading: "What's next",
    body: [
      "New tools are added when they earn their place — useful enough to justify their weight, and useful offline in spirit. If a tool you need is missing, the best place to ask is the public repository, where feature requests are tracked in the open.",
    ],
  },
];

export default function AboutPage() {
  return (
    <>
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "About — Byte-Kit",
          url: `${siteUrl}/about`,
          description:
            "Byte-Kit is a free collection of developer tools that run entirely in your browser. Learn what it is, why it exists, and who builds it.",
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
            About Byte-Kit
          </h1>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-zinc-400">
            Simple tools for developers — free, private, and running entirely in
            your browser.
          </p>

          <div className="mt-10 space-y-10">
            {sections.map((section) => (
              <section key={section.heading}>
                <h2 className="text-xl font-bold text-zinc-100">
                  {section.heading}
                </h2>
                <div className="mt-3 space-y-3 text-sm leading-relaxed text-zinc-400">
                  {section.body.map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <div className="mt-12 flex flex-wrap gap-3">
            <Link
              href="/contact"
              className="rounded-lg bg-zinc-100 px-4 py-2 text-sm font-medium text-zinc-900 transition-colors hover:bg-white"
            >
              Get in touch
            </Link>
            <Link
              href="/"
              className="rounded-lg border border-zinc-800 px-4 py-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-800/60 hover:text-zinc-100"
            >
              Browse the tools
            </Link>
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
