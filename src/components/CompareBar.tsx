"use client";

import { usePathname, useRouter } from "next/navigation";
import { useCompareSelection } from "@/contexts/CompareSelectionContext";
import { courses } from "@/lib/catalog-adapter";

export const CompareBar = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { selectedIds, clear, notice, setSelectionNotice, isReturningSelection } =
    useCompareSelection();
  const enabled = selectedIds.length === 2;
  const visibleCount = Math.min(selectedIds.length, 2);
  const selectedCourseLabels = selectedIds.map(
    (id) => courses.find((course) => course.id === id)?.title ?? id
  );

  if (selectedIds.length === 0 || pathname === "/compare") {
    return null;
  }

  return (
    <div className="fixed inset-x-0 bottom-0 z-20 border-t border-slate-700 bg-slate-950/95 shadow-[0_-18px_50px_rgba(15,23,42,0.22)] backdrop-blur">
      <div className="mx-auto flex max-w-7xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-4 lg:px-8">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-white">
            {isReturningSelection
              ? "Saved selection from a previous visit"
              : `${visibleCount} of 2 courses selected`}
          </p>
          <ul className="mt-1 space-y-0.5 text-xs text-slate-300">
            {selectedCourseLabels.map((title) => (
              <li key={title} className="truncate sm:max-w-xl">
                {title}
              </li>
            ))}
          </ul>
          {visibleCount === 1 ? (
            <p className="mt-1 text-xs text-slate-400">Select 1 more course to compare.</p>
          ) : null}
          {notice ? (
            <p className="mt-2 text-xs font-semibold text-amber-300">{notice}</p>
          ) : null}
        </div>
        <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center sm:gap-3">
          <button
            type="button"
            onClick={clear}
            className="min-h-11 rounded-xl border border-slate-700 px-4 py-2 text-sm font-semibold text-slate-200 transition hover:border-slate-500 hover:bg-slate-900"
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
            className={`min-h-11 rounded-xl px-4 py-2 text-sm font-semibold transition sm:px-5 ${
              enabled ? "bg-blue-600 text-white shadow-sm hover:bg-blue-500" : "bg-slate-800 text-slate-500"
            }`}
          >
            Compare courses
          </button>
        </div>
      </div>
    </div>
  );
};
