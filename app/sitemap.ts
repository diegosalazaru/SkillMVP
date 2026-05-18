import type { MetadataRoute } from "next";
import { SITE_URL } from "../src/config/siteConfig";
import { getAllSeoPages } from "../src/lib/seo/seoPages";

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  const seoPages = getAllSeoPages();

  return [
    {
      url: `${SITE_URL}/`,
      lastModified: now,
      priority: 1
    },
    {
      url: `${SITE_URL}/compare`,
      lastModified: now,
      priority: 0.8
    },
    ...seoPages.map((page) => {
      const updatedAt = (page as { updatedAt?: string | number | Date }).updatedAt;

      return {
        url: `${SITE_URL}/${page.slug}`,
        lastModified: new Date(updatedAt || Date.now()),
        priority: 0.6
      };
    })
  ];
}
