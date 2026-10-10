import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Cube } from "@phosphor-icons/react/dist/ssr";
import { siteUrl, StructuredData } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description:
    "Byte-Kit cookie policy: what little is stored in your browser, why, and how to manage it.",
  alternates: {
    canonical: `${siteUrl}/cookie-policy`,
  },
  openGraph: {
    title: "Cookie Policy · Byte-Kit",
    description:
      "Byte-Kit cookie policy: what little is stored in your browser, why, and how to manage it.",
    url: `${siteUrl}/cookie-policy`,
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Cookie Policy — Byte-Kit",
      },
    ],
  },
};

const sections = [
  {
    heading: "The short version",
    body: [
      "Byte-Kit uses no tracking cookies, no analytics cookies, and no advertising cookies. The only things stored in your browser are two functional preferences — your theme choice and your cookie-banner consent — kept in local storage on your own device. Nothing is sent to any server.",
    ],
  },
  {
    heading: "What we store and why",
    body: [
      "When you visit Byte-Kit, the following entries may be saved in your browser's local storage:",
    ],
    list: [
      "Theme preference — remembers whether you chose dark or light mode, so the site looks the way you left it.",
      "Cookie consent — remembers that you accepted the cookie notice, so we don't show it on every visit.",
    ],
    after: [
      "These entries never leave your device. They contain no personal information and cannot be used to identify or track you.",
    ],
  },
  {
    heading: "What we don't use",
    body: [
      "Byte-Kit does not use any of the following:",
    ],
    list: [
      "Analytics or performance cookies (no Google Analytics or similar).",
      "Advertising or targeting cookies.",
      "Social media tracking pixels or third-party scripts.",
      "HTTP cookies set by a server — the site is served as static files and sets none.",
    ],
  },
  {
    heading: "Managing your preferences",
    body: [
      "You can remove the stored preferences at any time by clearing your browser's site data or local storage for this site. Doing so will simply reset your theme to the default and show the cookie notice again on your next visit.",
      "Most browsers also let you block local storage entirely through their privacy settings, though the theme and consent preferences then won't be remembered between visits.",
    ],
  },
  {
    heading: "Changes to this policy",
    body: [
      "If our use of browser storage ever changes, this page will be updated with a revised date. Because the site is designed to minimize data storage, such changes are unlikely.",
    ],
  },
  {
    heading: "Contact",
    body: [
      "If you have questions about this cookie policy, you can reach the site operator through the project's public repository.",
    ],
  },
];

export default function CookiePolicyPage() {
  return (
    <>
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Cookie Policy — Byte-Kit",
          url: `${siteUrl}/cookie-policy`,
          description:
            "Byte-Kit cookie policy: what little is stored in your browser, why, and how to manage it.",
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
            Cookie Policy
          </h1>
          <p className="mt-2 font-mono text-xs text-zinc-500">
            Last updated: October 9, 2026
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
                  {section.list && (
                    <ul className="list-disc space-y-1.5 pl-5 marker:text-blue-500">
                      {section.list.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  )}
                  {section.after?.map((paragraph, i) => (
                    <p key={i}>{paragraph}</p>
                  ))}
                </div>
              </section>
            ))}
          </div>

          <p className="mt-12 rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 font-mono text-[11px] leading-relaxed text-zinc-500">
            Related: <Link href="/privacy" className="text-blue-400 transition-colors hover:text-blue-300">Privacy Policy</Link> · <Link href="/terms" className="text-blue-400 transition-colors hover:text-blue-300">Terms and Conditions</Link>
          </p>
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
