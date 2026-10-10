import type { Metadata } from "next";
import { ToolboxHome } from "@/components/toolbox-home";
import { siteUrl, StructuredData } from "@/lib/structured-data";
import { tools } from "@/lib/tools.config";
import { faqs } from "@/lib/faq";

export const metadata: Metadata = {
  title: "Free Private Developer Tools",
  description:
    "Free online developer tools for JSON, CSS, JWT, Base64, regex, color and image workflows. Private — everything runs in your browser.",
  alternates: {
    canonical: siteUrl,
  },
};

export default function HomePage() {
  const toolList = tools.map((tool, index) => ({
    "@type": "ListItem",
    position: index + 1,
    name: tool.title,
    url: `${siteUrl}/tools/${tool.slug}`,
  }));

  return (
    <>
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "WebSite",
          name: "Byte-Kit",
          url: siteUrl,
          description: "Free private developer tools that process data locally in your browser.",
          potentialAction: {
            "@type": "SearchAction",
            target: `${siteUrl}/?q={search_term_string}`,
            "query-input": "required name=search_term_string",
          },
        }}
      />
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "ItemList",
          name: "Byte-Kit developer tools",
          itemListElement: toolList,
        }}
      />
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqs.map((faq) => ({
            "@type": "Question",
            name: faq.question,
            acceptedAnswer: { "@type": "Answer", text: faq.answer },
          })),
        }}
      />
      <ToolboxHome />
    </>
  );
}
