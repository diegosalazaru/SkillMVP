"use client";

export const dynamic = "force-dynamic";

import { Suspense } from "react";
import CompareClient from "./CompareClient";

export default function ComparePage() {
  return (
    <Suspense
      fallback={
        <section className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
          <h2 className="text-2xl font-semibold text-slate-900">Cargando…</h2>
          <p className="text-slate-600">Preparando la comparación.</p>
        </section>
      }
    >
      <CompareClient />
    </Suspense>
  );
}
