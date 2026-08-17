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
    <div className="space-y-12">
      <HomeClient />

      <section className="border-l-2 border-blue-200 pl-4 text-sm leading-relaxed text-slate-600">
        <p>
          Compare factual course signals, then verify final provider details before enrolling.
        </p>
      </section>

      <section className="space-y-4 border-t border-slate-200 pt-8">
        <div className="space-y-2">
          <h2 className="text-xl font-semibold text-slate-900">More course guides</h2>
          <p className="text-sm text-slate-600">
            Secondary guides for exploring the available catalog.
          </p>
        </div>
        <SeoLinks />
      </section>
    </div>
  );
}
