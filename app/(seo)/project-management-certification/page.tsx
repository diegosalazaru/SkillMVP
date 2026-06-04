import { Metadata } from "next";
import { notFound } from "next/navigation";
import { SeoPageTemplate } from "@/components/seo/SeoPageTemplate";
import { buildSeoPageMetadata } from "@/lib/metadata";
import { getSeoPageBySlug } from "@/lib/seo/seoPages";

const slug = "project-management-certification";

export const generateMetadata = (): Metadata => {
  const page = getSeoPageBySlug(slug);
  if (!page) return { title: "Page not found" };

  return buildSeoPageMetadata(page);
};

export default function SeoRoutePage() {
  const page = getSeoPageBySlug(slug);
  if (!page) notFound();

  return <SeoPageTemplate page={page} />;
}
