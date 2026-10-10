import type { Metadata } from "next";
import { JsonFormatter } from "@/components/json-formatter";
import { ToolShell } from "@/components/tool-shell";
import { getTool } from "@/lib/tools.config";
import { toolContent } from "@/lib/tool-content";
import { siteUrl, StructuredData } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "JSON Formatter & Validator",
  description:
    "Format, validate, beautify, and minify JSON locally in your browser with instant results.",
  keywords: ["JSON formatter", "JSON validator", "JSON beautifier", "JSON minifier"],
  alternates: {
    canonical: `${siteUrl}/tools/json-formatter`,
  },
  openGraph: {
    title: "JSON Formatter & Validator · Byte-Kit",
    description:
      "Format, validate, beautify, and minify JSON locally in your browser with instant results.",
    url: `${siteUrl}/tools/json-formatter`,
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "JSON Formatter & Validator",
      },
    ],
  },
};

export default function JsonFormatterPage() {
  const content = toolContent["json-formatter"];
  return (
    <>
      {content && content.faqs.length > 0 && (
        <StructuredData
          data={{
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: content.faqs.map((faq) => ({
              "@type": "Question",
              name: faq.question,
              acceptedAnswer: { "@type": "Answer", text: faq.answer },
            })),
          }}
        />
      )}
      <ToolShell title="JSON Formatter & Validator" description="Clean up, validate, beautify, or minify JSON without uploading it anywhere." category="Formatter" usage={getTool("json-formatter")?.usage} content={content}>
        <JsonFormatter />
      </ToolShell>
    </>
  );
}
