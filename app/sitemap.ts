import type { MetadataRoute } from "next";
import { siteUrl } from "@/lib/structured-data";
import { tools } from "@/lib/tools.config";

export const dynamic = "force-static";

export default function sitemap(): MetadataRoute.Sitemap {
  const lastModified = new Date();

  return [
    {
      url: siteUrl,
      lastModified,
      changeFrequency: "weekly",
      priority: 1,
    },
    ...tools
      .filter((tool) => tool.implemented !== false)
      .map((tool) => ({
        url: `${siteUrl}/tools/${tool.slug}`,
        lastModified,
        changeFrequency: "monthly" as const,
        priority: 0.8,
      })),
  ];
}
