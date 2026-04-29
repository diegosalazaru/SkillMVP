"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { courses } from "@/lib/catalog-adapter";
import { trackOutboundCourseClick } from "@/lib/outbound-tracking";
import { EXTERNAL_LINK_DISCLOSURE } from "@/lib/disclosure";
import { AdPlaceholder } from "@/components/AdPlaceholder";

const LAST_SKILL_KEY = "skills-compare-last-skill";

export default function CompareClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const idsParam = searchParams.get("ids") ?? "";

  const ids = useMemo(() => idsParam.split(",").filter(Boolean).slice(0, 2), [idsParam]);
  const [leftId, rightId] = ids;
  const leftCourse = courses.find((course) => course.id === leftId);
  const rightCourse = courses.find((course) => course.id === rightId);

  const hasTwoCourses = ids.length === 2 && leftCourse && rightCourse;

  const handleChangeCourses = () => {
    const lastSkill = window.localStorage.getItem(LAST_SKILL_KEY);
    router.push(lastSkill ? `/skills/${lastSkill}` : "/");
  };

  if (!hasTwoCourses) {
    return (
      <section className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
        <h2 className="text-2xl font-semibold text-slate-900">Selecciona cursos para comparar</h2>
        <p className="text-slate-600">Vuelve al listado y selecciona cursos para comparar.</p>
        <button
          type="button"
          onClick={handleChangeCourses}
          className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-500"
        >
          Volver a elegir cursos
        </button>
      </section>
    );
  }

  const formatPrice = (isFree: boolean, hasCertificate: boolean, model: string) => {
    if (isFree) return hasCertificate ? "Gratis (certificado de pago)" : "Gratis";
    if (model === "subscription") return "Gratis con opción de pago";
    if (model === "paid_once") return hasCertificate ? "Pago (certificado incluido)" : "Pago";
    return "Precio no verificado";
  };

  const rawRows = [
    {
      label: "Precio",
      left: formatPrice(leftCourse.priceModel === "free", leftCourse.certificate, leftCourse.priceModel),
      right: formatPrice(rightCourse.priceModel === "free", rightCourse.certificate, rightCourse.priceModel)
    },
    { label: "Plataforma", left: leftCourse.platform, right: rightCourse.platform },
    { label: "Duración", left: leftCourse.durationText, right: rightCourse.durationText },
    { label: "Nivel", left: leftCourse.level, right: rightCourse.level },
    { label: "Idioma", left: leftCourse.language, right: rightCourse.language },
    { label: "Certificado", left: leftCourse.certificate ? "Sí" : "No", right: rightCourse.certificate ? "Sí" : "No" }
  ];

  const summaryInsights = [
    leftCourse.level === rightCourse.level
      ? `Ambos cursos son nivel ${leftCourse.level.toLowerCase()}.`
      : `Los niveles son distintos: ${leftCourse.level} vs ${rightCourse.level}.`,
    leftCourse.durationText === rightCourse.durationText
      ? "Ambos cursos reportan la misma duración."
      : `La duración reportada es distinta: ${leftCourse.durationText} vs ${rightCourse.durationText}.`,
    leftCourse.certificate === rightCourse.certificate
      ? leftCourse.certificate
        ? "Ambos cursos incluyen certificado."
        : "En ambos cursos el certificado no está verificado."
      : "Solo uno de los cursos incluye certificado.",
    leftCourse.priceModel === rightCourse.priceModel
      ? `El modelo de precio es el mismo en ambos (${leftCourse.priceModel}).`
      : `Los modelos de precio son distintos: ${leftCourse.priceModel} vs ${rightCourse.priceModel}.`
  ];

  return (
    <section className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <h2 className="text-3xl font-semibold text-slate-900">Comparativa de cursos</h2>
        <p className="text-slate-600">Revisa diferencias verificadas para tomar una decisión más clara.</p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">Resumen rápido</h3>
        <ul className="mt-3 grid gap-2 text-sm text-slate-600">
          {summaryInsights.map((insight) => (
            <li key={insight} className="rounded-lg bg-slate-50 px-3 py-2">{insight}</li>
          ))}
        </ul>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="grid grid-cols-3 gap-4 border-b border-slate-200 bg-slate-50 px-6 py-4 text-sm font-semibold text-slate-700">
          <span>Detalle</span>
          <span className="flex flex-col gap-3">
            <Link href={`/courses/${leftCourse.id}`} className="text-slate-900 hover:underline">{leftCourse.title}</Link>
            <a href={leftCourse.externalUrl} target="_blank" rel="noopener noreferrer" onClick={() => trackOutboundCourseClick(leftCourse, "compare")} className="w-fit rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500">Ver curso en {leftCourse.platform}</a>
            <span className="text-xs font-normal text-slate-500">Se abrirá en una página externa.</span>
          </span>
          <span className="flex flex-col gap-3">
            <Link href={`/courses/${rightCourse.id}`} className="text-slate-900 hover:underline">{rightCourse.title}</Link>
            <a href={rightCourse.externalUrl} target="_blank" rel="noopener noreferrer" onClick={() => trackOutboundCourseClick(rightCourse, "compare")} className="w-fit rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500">Ver curso en {rightCourse.platform}</a>
            <span className="text-xs font-normal text-slate-500">Se abrirá en una página externa.</span>
          </span>
        </div>
        <div className="divide-y divide-slate-200">
          {rawRows.map((row) => {
            const differs = row.left !== row.right;
            return (
              <div key={row.label} className={`grid grid-cols-3 gap-4 px-6 py-4 text-sm text-slate-600 ${differs ? "bg-blue-50/50" : "bg-white"}`}>
                <span className="font-semibold text-slate-700">{row.label}</span>
                <span>{row.left}</span>
                <span>{row.right}</span>
              </div>
            );
          })}
        </div>
      </div>

      <AdPlaceholder />
      <p className="text-xs text-slate-500">{EXTERNAL_LINK_DISCLOSURE}</p>

      <button type="button" onClick={handleChangeCourses} className="w-fit rounded-lg border border-blue-200 px-5 py-2 text-sm font-semibold text-blue-700 hover:border-blue-300">Cambiar cursos</button>
    </section>
  );
}
