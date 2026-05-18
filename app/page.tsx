import type { Metadata } from "next";
import HomeClient from "./HomeClient";
import { SeoLinks } from "../src/components/seo/SeoLinks";

export const metadata: Metadata = {
  title: "Compare courses online | Skills Compare",
  description:
    "Compare online courses by price, duration, level and certificate before deciding."
};

export default function HomePage() {
  return (
    <div className="space-y-10">
      <HomeClient />

      <section className="space-y-4">
        <h2 className="text-2xl font-semibold text-slate-900">Explore courses by skill</h2>
        <SeoLinks />
      </section>
    </div>
  );
}
