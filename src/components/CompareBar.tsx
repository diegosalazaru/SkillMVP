"use client";

import { useRouter } from "next/navigation";
import { useCompareSelection } from "@/contexts/CompareSelectionContext";

export const CompareBar = () => {
  const router = useRouter();
  const { selectedIds, clear, notice, setSelectionNotice } =
    useCompareSelection();
  const enabled = selectedIds.length === 2;
  const visibleCount = Math.min(selectedIds.length, 2);

  return (
    <div className="fixed inset-x-0 bottom-0 z-20 border-t border-slate-200 bg-white/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-6 py-4 sm:flex-row">
        <div>
          <p className="text-sm font-semibold text-slate-900">
            Compare ({visibleCount}/2)
          </p>
          <p className="text-xs text-slate-500">
            Select 2 courses to compare.
          </p>
          {notice ? (
            <p className="mt-2 text-xs font-semibold text-amber-600">{notice}</p>
          ) : null}
        </div>
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={clear}
            className="text-xs font-semibold text-slate-500 hover:text-slate-700"
          >
            Clear selection
          </button>
          <button
            type="button"
            disabled={!enabled}
            onClick={() => {
              if (!enabled) {
                setSelectionNotice("Select 2 courses to compare.");
                return;
              }
              router.push(`/compare?ids=${selectedIds[0]},${selectedIds[1]}`);
            }}
            className={`rounded-xl px-5 py-2 text-sm font-semibold text-white transition ${
              enabled ? "bg-blue-600 hover:bg-blue-500" : "bg-slate-300"
            }`}
          >
            Compare ahora
          </button>
        </div>
      </div>
    </div>
  );
};
