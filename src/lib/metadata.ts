import type { Metadata } from "next";
import { SITE_NAME, SITE_URL } from "@/config/siteConfig";
import type { GeneratedSeoPage } from "@/lib/seo/seoTypes";

export const siteBaseUrl = new URL(SITE_URL);

export const getCanonicalUrl = (path: string) =>
  new URL(path.startsWith("/") ? path : `/${path}`, siteBaseUrl).toString();

type PageMetadataInput = {
  title: string;
  description: string;
  path: string;
  type?: "website" | "article";
};

export const buildPageMetadata = ({
  title,
  description,
  path,
  type = "website"
}: PageMetadataInput): Metadata => {
  const canonical = getCanonicalUrl(path);

  return {
    title,
    description,
    alternates: {
      canonical
    },
    openGraph: {
      title,
      description,
      url: canonical,
      siteName: SITE_NAME,
      type
    }
  };
};

export const buildSeoPageMetadata = (page: GeneratedSeoPage): Metadata => ({
  ...buildPageMetadata({
    title: page.title,
    description: page.metaDescription,
    path: `/${page.slug}`
  }),
  robots: {
    index: false,
    follow: true
  }
});
