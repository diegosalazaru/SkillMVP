"use client";

import { useRouter } from "next/navigation";
import { useCompareSelection } from "@/hooks/useCompareSelection";

export const CompareBar = () => {
  const router = useRouter();
  const { selectedIds, clear } = useCompareSelection();
  const enabled = selectedIds.length === 2;

  return (
    <div className="fixed inset-x-0 bottom-0 z-20 border-t border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-4 sm:flex-row">
        <div>
          <p className="text-sm font-semibold text-slate-900">
            Comparar ({selectedIds.length}/2)
          </p>
          <p className="text-xs text-slate-500">
            Selecciona 2 cursos para habilitar la comparación.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={clear}
            className="text-xs font-semibold text-slate-500 hover:text-slate-700"
          >
            Limpiar selección
          </button>
          <button
            type="button"
            disabled={!enabled}
            onClick={() =>
              router.push(`/compare?ids=${selectedIds[0]},${selectedIds[1]}`)
            }
            className={`rounded-xl px-5 py-2 text-sm font-semibold text-white transition ${
              enabled ? "bg-slate-900 hover:bg-slate-800" : "bg-slate-300"
            }`}
          >
            Comparar ahora
          </button>
        </div>
      </div>
    </div>
  );
};
