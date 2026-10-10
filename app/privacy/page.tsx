import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Cube } from "@phosphor-icons/react/dist/ssr";
import { siteUrl, StructuredData } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "Byte-Kit privacy policy: all tools run entirely in your browser. No uploads, no tracking, no personal data collected.",
  alternates: {
    canonical: `${siteUrl}/privacy`,
  },
  openGraph: {
    title: "Privacy Policy · Byte-Kit",
    description:
      "Byte-Kit privacy policy: all tools run entirely in your browser. No uploads, no tracking, no personal data collected.",
    url: `${siteUrl}/privacy`,
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Privacy Policy — Byte-Kit",
      },
    ],
  },
};

const sections = [
  {
    heading: "The short version",
    body: [
      "Byte-Kit is designed to be private by default. Every tool on this site runs entirely inside your own browser — the text, files, and images you work with never leave your device. We do not collect, store, or transmit any personal data.",
    ],
  },
  {
    heading: "Information we collect",
    body: [
      "None. Byte-Kit does not ask you to create an account, does not ask for your name or email, and does not collect analytics, usage statistics, or telemetry of any kind. There is nothing sent from your browser to our servers when you use the tools.",
    ],
  },
  {
    heading: "How the tools work",
    body: [
      "Each tool — formatting, conversion, encoding, generation, and the image converter — executes locally using your browser's built-in capabilities (JavaScript, Canvas, and the Web Crypto API). Files you open in the Image & SVG Converter are read into memory on your device only; they are never uploaded anywhere.",
    ],
  },
  {
    heading: "Cookies and local storage",
    body: [
      "Byte-Kit does not use tracking cookies. Your browser's local storage is used for exactly two functional preferences, both kept on your device only:",
    ],
    list: [
      "Theme preference (dark or light mode).",
      "Cookie-banner consent (so we don't show the notice again).",
    ],
    after: [
      "Clearing your browser's site data removes these preferences. Nothing else is stored.",
    ],
  },
  {
    heading: "Third-party services",
    body: [
      "There are none. The site loads no third-party scripts, no advertising networks, no analytics providers, and no external fonts or CDNs. What you see is served as static files and runs offline-capable in your browser.",
    ],
  },
  {
    heading: "Children's privacy",
    body: [
      "Byte-Kit collects no personal information from anyone, including children. The tools are safe to use without providing any personal data.",
    ],
  },
  {
    heading: "Changes to this policy",
    body: [
      "If this policy changes, the updated version will be posted on this page with a revised date. Because we collect no data, material changes are unlikely — but the page will always reflect current practice.",
    ],
  },
  {
    heading: "Contact",
    body: [
      "If you have questions about this privacy policy, you can reach the site operator through the project's public repository.",
    ],
  },
];

export default function PrivacyPage() {
  return (
    <>
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Privacy Policy — Byte-Kit",
          url: `${siteUrl}/privacy`,
          description:
            "Byte-Kit privacy policy: all tools run entirely in your browser. No uploads, no tracking, no personal data collected.",
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
            Privacy Policy
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
