"use client";

import Link from "next/link";
import { Course } from "@/types/course";
import { useCompareSelection } from "@/contexts/CompareSelectionContext";

type CourseCardProps = {
  course: Course;
};

export const CourseCard = ({ course }: CourseCardProps) => {
  const { toggle, isSelected, selectedIds } = useCompareSelection();
  const selected = isSelected(course.id);
  const atLimit = selectedIds.length >= 2;

  return (
    <div className="flex h-full flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{course.title}</h3>
          <p className="text-sm text-slate-500">
            {course.platform} · {course.level}
          </p>
        </div>
        {course.rating ? (
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
            ⭐ {course.rating.toFixed(1)}
          </span>
        ) : null}
      </div>
      <p className="text-sm text-slate-600">
        {course.shortDescription ?? "Descripción no disponible."}
      </p>
      <div className="grid gap-2 text-sm text-slate-600">
        <div className="flex items-center justify-between">
          <span>Duración</span>
          <span className="font-medium text-slate-800">{course.durationText}</span>
        </div>
        <div className="flex items-center justify-between">
          <span>Precio</span>
          <span className="font-medium text-slate-800">{course.priceText}</span>
        </div>
      </div>
      <div className="mt-auto flex items-center justify-between gap-3">
        <Link
          href={`/courses/${course.id}`}
          className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-slate-300"
        >
          Ver
        </Link>
        <label className="flex items-center gap-2 text-sm text-slate-600">
          <input
            type="checkbox"
            checked={selected}
            onChange={() => toggle(course.id)}
            className="h-4 w-4 rounded border-slate-300 text-slate-900"
          />
          Agregar a comparación
        </label>
      </div>
      {atLimit && !selected ? (
        <p className="text-xs text-amber-600">
          Límite alcanzado: quita un curso para agregar otro.
        </p>
      ) : null}
    </div>
  );
};
