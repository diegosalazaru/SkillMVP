"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { useMemo } from "react";
import { courses } from "@/lib/catalog-adapter";
import { useCompareSelection } from "@/contexts/CompareSelectionContext";

export default function CourseDetailPage() {
  const params = useParams();
  const courseId = Array.isArray(params.courseId)
    ? params.courseId[0]
    : params.courseId;

  const course = useMemo(
    () => courses.find((item) => item.id === courseId),
    [courseId]
  );

  const { toggle, isSelected, selectedIds, notice } = useCompareSelection();
  const objectives = course ? course.syllabusBullets.slice(0, 3) : [];

  if (!course) {
    return (
      <section className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
        <h2 className="text-2xl font-semibold text-slate-900">
          Curso no encontrado
        </h2>
        <p className="text-slate-600">
          Revisa el ID del curso o vuelve al inicio.
        </p>
        <Link
          href="/"
          className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-500"
        >
          Ir al Home
        </Link>
      </section>
    );
  }

  const selected = isSelected(course.id);
  const atLimit = selectedIds.length >= 2 && !selected;

  return (
    <section className="flex flex-col gap-8">
      <div className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
          Curso
        </p>
        <h2 className="text-3xl font-semibold text-slate-900">{course.title}</h2>
        <p className="text-slate-600">
          {course.shortDescription ?? "Descripción no disponible."}
        </p>
        <div className="flex flex-wrap gap-2 text-sm text-slate-600">
          <span className="rounded-full bg-slate-100 px-3 py-1">
            {course.platform}
          </span>
          <span className="rounded-full bg-slate-100 px-3 py-1">
            {course.level}
          </span>
          <span className="rounded-full bg-slate-100 px-3 py-1">
            {course.durationText}
          </span>
          <span className="rounded-full bg-slate-100 px-3 py-1">
            {course.priceText}
          </span>
        </div>
        <button
          type="button"
          onClick={() => toggle(course.id)}
          className={`w-fit rounded-lg px-5 py-2 text-sm font-semibold text-white transition ${
            selected ? "bg-emerald-600 hover:bg-emerald-500" : "bg-blue-600 hover:bg-blue-500"
          } ${atLimit ? "bg-slate-300" : ""}`}
        >
          {selected ? "Seleccionado para comparar" : "Agregar a comparación"}
        </button>
        {atLimit ? (
          <p className="text-xs text-amber-600">
            Ya tienes 2 cursos seleccionados. Quita uno para continuar.
          </p>
        ) : null}
        {notice ? (
          <p className="text-xs font-semibold text-amber-600">{notice}</p>
        ) : null}
      </div>

      <div className="grid gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-2">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Objetivos</h3>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-600">
            {objectives.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Requisitos</h3>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-600">
            {course.prerequisitesBullets.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Temario resumido</h3>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-600">
            {course.syllabusBullets.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-900">Detalles</h3>
          <div className="mt-3 space-y-2 text-sm text-slate-600">
            <p>
              <span className="font-semibold text-slate-800">Idioma:</span> {course.language}
            </p>
            <p>
              <span className="font-semibold text-slate-800">Certificado:</span>{" "}
              {course.certificate ? "Sí" : "No"}
            </p>
            {course.rating ? (
              <p>
                <span className="font-semibold text-slate-800">Rating:</span> {course.rating.toFixed(1)}
              </p>
            ) : null}
            <p>
              <span className="font-semibold text-slate-800">Link externo:</span>{" "}
              <a
                href={course.externalUrl}
                className="text-slate-900 underline"
                target="_blank"
                rel="noreferrer"
              >
                Ver curso
              </a>
            </p>
          </div>
        </div>
      </div>

      <Link
        href="/"
        className="text-sm font-semibold text-slate-600 hover:text-slate-900"
      >
        ← Volver al Home
      </Link>
    </section>
  );
}
