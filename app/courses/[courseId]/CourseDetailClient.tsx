"use client";

import Link from "next/link";
import { useMemo } from "react";
import { courses } from "@/lib/catalog-adapter";
import { useCompareSelection } from "@/contexts/CompareSelectionContext";
import { trackOutboundCourseClick } from "@/lib/outbound-tracking";
import { EXTERNAL_LINK_DISCLOSURE } from "@/lib/disclosure";

type CourseDetailClientProps = {
  courseId: string;
};

export default function CourseDetailClient({ courseId }: CourseDetailClientProps) {
  const course = useMemo(
    () => courses.find((item) => item.id === courseId),
    [courseId]
  );

  const { toggle, isSelected, selectedIds, notice } = useCompareSelection();
  const learningBullets = course ? course.syllabusBullets : [];

  if (!course) {
    return (
      <section className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
        <h2 className="text-2xl font-semibold text-slate-900">
          Course not found
        </h2>
        <p className="text-slate-600">
          Check the course ID or return to home.
        </p>
        <Link
          href="/"
          className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-500"
        >
          Ir al inicio
        </Link>
      </section>
    );
  }

  const selected = isSelected(course.id);
  const atLimit = selectedIds.length >= 2 && !selected;
  const hasLearningBullets = learningBullets.length > 0;
  const hasPrerequisites = course.prerequisitesBullets.length > 0;
  const hasLearningContent = hasLearningBullets || hasPrerequisites;
  const pendingSignals = [
    course.rating ? null : "Rating pending verification",
    course.priceAmount == null ? "Exact price pending verification" : null,
    course.durationText.toLowerCase().includes("pendiente")
      ? "Duration pending verification"
      : null
  ].filter((item): item is string => item !== null);
  const keyFacts = [
    { label: "Plataforma", value: course.platform },
    { label: "Nivel", value: course.level },
    { label: "Duracion", value: course.durationText },
    { label: "Precio", value: course.priceText },
    {
      label: "Certificado",
      value: course.certificate ? "Incluido" : "No verificado"
    }
  ];

  return (
    <section className="flex flex-col gap-8">
      <div className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
          Curso
        </p>
        <h2 className="text-3xl font-semibold text-slate-900">{course.title}</h2>
        <p className="text-slate-600">
          {course.shortDescription ?? "Description unavailable."}
        </p>
        <div className="flex flex-wrap gap-2 text-sm text-slate-600">
          {course.skillTags[0] ? (
            <Link
              href={`/skills/${course.skillTags[0]}`}
              className="rounded-full bg-blue-50 px-3 py-1 font-medium text-blue-700 hover:bg-blue-100"
            >
              Ver skill
            </Link>
          ) : null}
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
            View course
          </a>
          <button
            type="button"
            onClick={() => toggle(course.id)}
            className={`w-fit rounded-lg px-5 py-2 text-sm font-semibold text-white transition ${
              selected ? "bg-emerald-600 hover:bg-emerald-500" : "bg-slate-700 hover:bg-slate-600"
            } ${atLimit ? "bg-slate-300" : ""}`}
          >
            {selected ? "Selected for compare" : "Add to compare"}
          </button>
        </div>
        <p className="text-xs text-slate-500">{EXTERNAL_LINK_DISCLOSURE}</p>
        {atLimit ? (
          <p className="text-xs text-amber-600">
            You already selected 2 courses. Remove one to continue.
          </p>
        ) : null}
        {notice ? (
          <p className="text-xs font-semibold text-amber-600">{notice}</p>
        ) : null}
      </div>

      <div className="grid gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            Before deciding
          </h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <div className="rounded-lg bg-slate-50 px-4 py-3">
              <span className="block text-xs font-medium text-slate-500">
                Coste
              </span>
              <span className="font-semibold text-slate-800">
                {course.priceText}
              </span>
            </div>
            <div className="rounded-lg bg-slate-50 px-4 py-3">
              <span className="block text-xs font-medium text-slate-500">
                Tiempo estimado
              </span>
              <span className="font-semibold text-slate-800">
                {course.durationText}
              </span>
            </div>
            <div className="rounded-lg bg-slate-50 px-4 py-3">
              <span className="block text-xs font-medium text-slate-500">
                Nivel
              </span>
              <span className="font-semibold text-slate-800">{course.level}</span>
            </div>
            <div className="rounded-lg bg-slate-50 px-4 py-3">
              <span className="block text-xs font-medium text-slate-500">
                Certificado
              </span>
              <span className="font-semibold text-slate-800">
                {course.certificate ? "Incluido" : "No verificado"}
              </span>
            </div>
          </div>
        </div>
        <div>
          <h3 className="text-lg font-semibold text-slate-900">
            Datos pendientes
          </h3>
          {pendingSignals.length > 0 ? (
            <ul className="mt-4 space-y-2 text-sm text-slate-600">
              {pendingSignals.map((signal) => (
                <li key={signal} className="rounded-lg bg-amber-50 px-3 py-2 text-amber-800">
                  {signal}
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-4 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
              There are no pending key data points in the current catalog.
            </p>
          )}
        </div>
      </div>

      {hasLearningContent ? (
        <div className="grid gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-2">
          {hasLearningBullets ? (
            <div>
          <h3 className="text-lg font-semibold text-slate-900">Que aprenderas</h3>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-600">
            {learningBullets.map((item) => (
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
        </div>
      ) : (
        <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">
            Que puedes evaluar
          </h3>
          <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {keyFacts.map((fact) => (
              <div key={fact.label} className="rounded-lg bg-slate-50 px-4 py-3">
                <span className="block text-xs font-medium text-slate-500">
                  {fact.label}
                </span>
                <span className="font-semibold text-slate-800">{fact.value}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">Datos clave</h3>
          <div className="mt-3 space-y-2 text-sm text-slate-600">
            <p>
              <span className="font-semibold text-slate-800">Idioma:</span> {course.language}
            </p>
            <p>
              <span className="font-semibold text-slate-800">Certificado:</span>{" "}
              {course.certificate ? "Yes" : "No"}
            </p>
            {course.rating ? (
              <p>
                <span className="font-semibold text-slate-800">Rating:</span> {course.rating.toFixed(1)}
              </p>
            ) : null}
          </div>
        </div>

      <Link
        href={course.skillTags[0] ? `/skills/${course.skillTags[0]}` : "/"}
        className="text-sm font-semibold text-slate-600 hover:text-slate-900"
      >
        Back to related courses
      </Link>
    </section>
  );
}
