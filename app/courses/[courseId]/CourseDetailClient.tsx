"use client";

import Link from "next/link";
import { useMemo } from "react";
import { courses } from "@/lib/catalog-adapter";
import { useCompareSelection } from "@/contexts/CompareSelectionContext";
import { trackOutboundCourseClick } from "@/lib/outbound-tracking";

type CourseDetailClientProps = {
  courseId: string;
};

export default function CourseDetailClient({ courseId }: CourseDetailClientProps) {
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
  const hasObjectives = objectives.length > 0;
  const hasPrerequisites = course.prerequisitesBullets.length > 0;
  const hasSyllabus = course.syllabusBullets.length > 0;
  const hasLearningContent = hasObjectives || hasPrerequisites || hasSyllabus;

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
        <div className="flex flex-wrap items-center gap-3">
          <a
            href={course.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackOutboundCourseClick(course, "detail")}
            className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white transition hover:bg-blue-500"
          >
            Ver curso
          </a>
          <button
            type="button"
            onClick={() => toggle(course.id)}
            className={`w-fit rounded-lg px-5 py-2 text-sm font-semibold text-white transition ${
              selected ? "bg-emerald-600 hover:bg-emerald-500" : "bg-slate-700 hover:bg-slate-600"
            } ${atLimit ? "bg-slate-300" : ""}`}
          >
            {selected ? "Seleccionado para comparar" : "Agregar a comparación"}
          </button>
        </div>
        {atLimit ? (
          <p className="text-xs text-amber-600">
            Ya tienes 2 cursos seleccionados. Quita uno para continuar.
          </p>
        ) : null}
        {notice ? (
          <p className="text-xs font-semibold text-amber-600">{notice}</p>
        ) : null}
      </div>

      {hasLearningContent ? (
        <div className="grid gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-2">
          {hasObjectives ? (
            <div>
          <h3 className="text-lg font-semibold text-slate-900">Objetivos</h3>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-600">
            {objectives.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
            </div>
          ) : null}
          {hasPrerequisites ? (
            <div>
          <h3 className="text-lg font-semibold text-slate-900">Requisitos</h3>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-600">
            {course.prerequisitesBullets.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
            </div>
          ) : null}
          {hasSyllabus ? (
            <div>
          <h3 className="text-lg font-semibold text-slate-900">Temario resumido</h3>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-600">
            {course.syllabusBullets.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
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
