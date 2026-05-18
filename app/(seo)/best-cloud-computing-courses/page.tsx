import { Metadata } from "next";
import { notFound } from "next/navigation";
import { SeoPageTemplate } from "@/components/seo/SeoPageTemplate";
import { getSeoPageBySlug } from "@/lib/seo/seoPages";

const slug = "best-cloud-computing-courses";

export const generateMetadata = (): Metadata => {
  const page = getSeoPageBySlug(slug);
  if (!page) return { title: "Page not found" };

  return {
    title: page.title,
    description: page.metaDescription
  };
};

export default function SeoRoutePage() {
  const page = getSeoPageBySlug(slug);
  if (!page) notFound();

  return <SeoPageTemplate page={page} />;
}
