import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { ToolShell } from "@/components/tool-shell";
import { ToolWorkbench } from "@/components/tool-workbench";
import { getTool, tools } from "@/lib/tools.config";
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

  return {
    title: tool.title,
    description: `${tool.description} Processed entirely in your browser with no uploads.`,
    keywords: [tool.title, `${tool.category} developer tool`, "browser-based utility"],
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
      <ToolShell title={tool.title} description={tool.description} category={tool.category} relatedTools={relatedTools}>
        <ToolWorkbench slug={tool.slug} />
      </ToolShell>
    </>
  );
}
