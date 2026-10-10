import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolShell } from "@/components/tool-shell";
import { ToolWorkbench } from "@/components/tool-workbench";
import { getTool, tools } from "@/lib/tools.config";
import { toolContent } from "@/lib/tool-content";
import { siteUrl, StructuredData } from "@/lib/structured-data";

export function generateStaticParams() {
  return tools.map((tool) => ({ slug: tool.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const tool = getTool(slug);

  if (!tool) {
    return { title: "Tool not found" };
  }

  const description = `${tool.description} Processed entirely in your browser with no uploads.`;

  return {
    title: tool.title,
    description,
    keywords: [tool.title, `${tool.category} developer tool`, "browser-based utility"],
    alternates: {
      canonical: `${siteUrl}/tools/${slug}`,
    },
    openGraph: {
      title: `${tool.title} · Byte-Kit`,
      description,
      url: `${siteUrl}/tools/${slug}`,
      images: [
        {
          url: `${siteUrl}/og-image.png`,
          width: 1200,
          height: 630,
          alt: tool.title,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${tool.title} · Byte-Kit`,
      description,
      images: [`${siteUrl}/og-image.png`],
    },
  };
}

export default async function DynamicToolPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const tool = getTool(slug);
  if (!tool || tool.implemented === false) {
    notFound();
  }
  const relatedTools = tools
    .filter((candidate) => candidate.category === tool.category && candidate.slug !== tool.slug)
    .slice(0, 3);
  const content = toolContent[tool.slug];

  return (
    <>
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "WebApplication",
          name: tool.title,
          url: `${siteUrl}/tools/${tool.slug}`,
          description: tool.description,
          applicationCategory: "DeveloperApplication",
          operatingSystem: "Any",
          browserRequirements: "Requires a modern web browser",
          isAccessibleForFree: true,
          offers: { "@type": "Offer", price: "0", priceCurrency: "USD" },
          isPartOf: { "@type": "WebSite", name: "Byte-Kit", url: siteUrl },
        }}
      />
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
      <StructuredData
        data={{
          "@context": "https://schema.org",
          "@type": "BreadcrumbList",
          itemListElement: [
            { "@type": "ListItem", position: 1, name: "Home", item: siteUrl },
            { "@type": "ListItem", position: 2, name: `${tool.category} tools`, item: `${siteUrl}/?category=${encodeURIComponent(tool.category)}` },
            { "@type": "ListItem", position: 3, name: tool.title, item: `${siteUrl}/tools/${tool.slug}` },
          ],
        }}
      />
      <ToolShell title={tool.title} description={tool.description} category={tool.category} relatedTools={relatedTools} usage={tool.usage} content={content}>
        <ToolWorkbench slug={tool.slug} />
      </ToolShell>
    </>
  );
}
