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
    <div className="fixed inset-x-0 bottom-0 z-20 border-t border-slate-200 bg-white/95 shadow-[0_-8px_24px_rgba(15,23,42,0.08)] backdrop-blur">
      <div className="mx-auto flex max-w-6xl flex-col gap-3 px-4 py-3 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-4">
        <div className="min-w-0">
          <p className="text-sm font-semibold text-slate-900">
            {isReturningSelection
              ? "Saved selection from a previous visit"
              : `${visibleCount} of 2 courses selected`}
          </p>
          <ul className="mt-1 space-y-0.5 text-xs text-slate-600">
            {selectedCourseLabels.map((title) => (
              <li key={title} className="truncate sm:max-w-xl">
                {title}
              </li>
            ))}
          </ul>
          {visibleCount === 1 ? (
            <p className="mt-1 text-xs text-slate-500">Select 1 more course to compare.</p>
          ) : null}
          {notice ? (
            <p className="mt-2 text-xs font-semibold text-amber-600">{notice}</p>
          ) : null}
        </div>
        <div className="grid grid-cols-2 gap-2 sm:flex sm:items-center sm:gap-3">
          <button
            type="button"
            onClick={clear}
            className="min-h-11 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-slate-300"
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
            className={`min-h-11 rounded-xl px-4 py-2 text-sm font-semibold text-white transition sm:px-5 ${
              enabled ? "bg-blue-600 hover:bg-blue-500" : "bg-slate-300"
            }`}
          >
            Compare courses
          </button>
        </div>
      </div>
    </div>
  );
};
