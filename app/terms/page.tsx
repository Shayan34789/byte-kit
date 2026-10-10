import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft, Cube } from "@phosphor-icons/react/dist/ssr";
import { siteUrl, StructuredData } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "Terms and Conditions",
  description:
    "Byte-Kit terms and conditions: the rules for using our free browser-based developer tools.",
  alternates: {
    canonical: `${siteUrl}/terms`,
  },
  openGraph: {
    title: "Terms and Conditions · Byte-Kit",
    description:
      "Byte-Kit terms and conditions: the rules for using our free browser-based developer tools.",
    url: `${siteUrl}/terms`,
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "Terms and Conditions — Byte-Kit",
      },
    ],
  },
};

const sections = [
  {
    heading: "Acceptance of terms",
    body: [
      "By accessing or using Byte-Kit, you agree to these Terms and Conditions. If you do not agree, please do not use the site. We may update these terms from time to time; continued use of the site after changes are posted constitutes acceptance of the updated terms.",
    ],
  },
  {
    heading: "Description of service",
    body: [
      "Byte-Kit provides free developer tools — including formatters, converters, encoders, and generators — that run entirely inside your web browser. No account is required, and the tools are provided free of charge.",
    ],
  },
  {
    heading: "Acceptable use",
    body: [
      "You agree to use Byte-Kit only for lawful purposes. You must not:",
    ],
    list: [
      "Attempt to disrupt, damage, or gain unauthorized access to the site or its hosting infrastructure.",
      "Use the tools to process content you do not have the right to use, or for any unlawful activity.",
      "Misrepresent the output of the tools as certified, audited, or guaranteed accurate for safety-critical or regulated purposes.",
    ],
  },
  {
    heading: "Accuracy of outputs",
    body: [
      "The tools are provided as utilities to assist everyday development work. While we strive for correctness, outputs (such as token estimates, color conversions, or generated code) are provided without guarantee of accuracy. You are responsible for verifying results before relying on them, especially in production systems.",
    ],
  },
  {
    heading: "Intellectual property",
    body: [
      "The Byte-Kit name, design, and site content are owned by the site operator. The outputs you generate with the tools — formatted text, converted values, generated code, and converted images — belong to you, and you may use them freely for any purpose, commercial or otherwise.",
    ],
  },
  {
    heading: "Disclaimer of warranties",
    body: [
      'Byte-Kit is provided "as is" and "as available," without warranties of any kind, whether express or implied, including implied warranties of merchantability, fitness for a particular purpose, and non-infringement. We do not warrant that the site will be uninterrupted, error-free, or free of harmful components.',
    ],
  },
  {
    heading: "Limitation of liability",
    body: [
      "To the maximum extent permitted by law, the operator of Byte-Kit shall not be liable for any indirect, incidental, special, consequential, or punitive damages arising from your use of, or inability to use, the site — even if advised of the possibility of such damages.",
    ],
  },
  {
    heading: "Privacy",
    body: [
      "Your use of Byte-Kit is also governed by our Privacy Policy, which explains that all tools run locally in your browser and no personal data is collected.",
    ],
  },
  {
    heading: "Changes to these terms",
    body: [
      "We may revise these Terms and Conditions at any time. The current version will always be posted on this page with an updated revision date.",
    ],
  },
  {
    heading: "Contact",
    body: [
      "If you have questions about these terms, you can reach the site operator through the project's public repository.",
    ],
  },
];

export default function TermsPage() {
  return (
    <>
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "WebPage",
          name: "Terms and Conditions — Byte-Kit",
          url: `${siteUrl}/terms`,
          description:
            "Byte-Kit terms and conditions: the rules for using our free browser-based developer tools.",
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
            Terms and Conditions
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
                </div>
              </section>
            ))}
          </div>

          <p className="mt-12 rounded-xl border border-zinc-800 bg-zinc-900/40 p-4 font-mono text-[11px] leading-relaxed text-zinc-500">
            Related: <Link href="/privacy" className="text-blue-400 transition-colors hover:text-blue-300">Privacy Policy</Link> — how Byte-Kit handles (or rather, doesn&apos;t handle) your data.
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
