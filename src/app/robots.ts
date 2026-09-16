import type { MetadataRoute } from "next";
import { profile, siteUrl } from "@/lib/portfolio";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      ...(profile.draft ? { disallow: "/" } : { allow: "/" }),
    },
    ...(!profile.draft && siteUrl ? { sitemap: `${siteUrl}/sitemap.xml` } : {}),
  };
}
