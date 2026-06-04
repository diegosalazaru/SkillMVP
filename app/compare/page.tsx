export const dynamic = "force-dynamic";

import type { Metadata } from "next";
import { Suspense } from "react";
import CompareClient from "./CompareClient";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Compare two online courses | Skills Compare",
  description:
    "Course comparison page to compare two online courses by price, duration, level, certificate and platform.",
  path: "/compare"
});

export default function ComparePage() {
  return (
    <Suspense
      fallback={
        <section className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <h2 className="text-2xl font-semibold text-slate-900">Loading...</h2>
          <p className="text-slate-600">Preparing comparison.</p>
        </section>
      }
    >
      <CompareClient />
    </Suspense>
  );
}
