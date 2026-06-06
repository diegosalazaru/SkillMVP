import type { Metadata } from "next";
import HomeClient from "./HomeClient";
import { SeoLinks } from "../src/components/seo/SeoLinks";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Compare courses online | Skills Compare",
  description:
    "Compare online courses by price, duration, level and certificate before deciding.",
  path: "/"
});

export default function HomePage() {
  return (
    <div className="space-y-10">
      <HomeClient />

      <section className="space-y-4">
        <div className="space-y-2">
          <h2 className="text-2xl font-semibold text-slate-900">Guides and comparison pages</h2>
          <p className="text-sm text-slate-600">
            Browse generated guide pages for specific course comparison searches.
          </p>
        </div>
        <SeoLinks />
      </section>
    </div>
  );
}
