import type { MetadataRoute } from "next";
import { profile, projects, siteUrl } from "@/lib/portfolio";

export default function sitemap(): MetadataRoute.Sitemap {
  if (!siteUrl || profile.draft) return [];
  return [
    { url: siteUrl, priority: 1 },
    ...projects
      .filter((project) => !project.placeholder)
      .map((project) => ({
        url: `${siteUrl}/projects/${project.slug}`,
        priority: 0.8,
      })),
  ];
}
