import type { Metadata } from "next";
import { PxToRem } from "@/components/px-to-rem";
import { ToolShell } from "@/components/tool-shell";
import { getRelatedTools, getTool } from "@/lib/tools.config";
import { toolContent } from "@/lib/tool-content";
import { siteUrl, StructuredData } from "@/lib/structured-data";

export const metadata: Metadata = {
  title: "PX to REM Converter",
  description:
    "Convert CSS pixel values to rem units with a customizable root font size, entirely in your browser.",
  keywords: ["PX to REM", "CSS converter", "REM converter", "CSS units"],
  alternates: {
    canonical: `${siteUrl}/tools/px-to-rem`,
  },
  openGraph: {
    title: "PX to REM Converter · Byte-Kit",
    description:
      "Convert CSS pixel values to rem units with a customizable root font size, entirely in your browser.",
    url: `${siteUrl}/tools/px-to-rem`,
    images: [
      {
        url: `${siteUrl}/og-image.png`,
        width: 1200,
        height: 630,
        alt: "PX to REM Converter",
      },
    ],
  },
};

export default function PxToRemPage() {
  const content = toolContent["px-to-rem"];
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
      <ToolShell title="PX to REM Converter" description="Convert pixel values to rem units with a customizable root font size." category="CSS" relatedTools={getRelatedTools("px-to-rem")} usage={getTool("px-to-rem")?.usage} content={content}>
        <PxToRem />
      </ToolShell>
    </>
  );
}
