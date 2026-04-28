"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { courses } from "@/lib/catalog-adapter";

const LAST_SKILL_KEY = "skills-compare-last-skill";

export default function CompareClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const idsParam = searchParams.get("ids") ?? "";

  const ids = useMemo(
    () => idsParam.split(",").filter(Boolean).slice(0, 2),
    [idsParam]
  );
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
        <h2 className="text-2xl font-semibold text-slate-900">
          Selecciona 2 cursos para comparar
        </h2>
        <p className="text-slate-600">
          Vuelve al listado y selecciona exactamente dos cursos para continuar.
        </p>
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

  const formatPrice = (course: typeof leftCourse) => {
    if (!course) {
      return "Precio no disponible";
    }
    if (course.priceModel === "free") {
      return "Gratis";
    }
    if (course.priceAmount == null || course.currency == null) {
      if (course.priceModel === "subscription") {
        return "Suscripción (precio no disponible)";
      }
      if (course.priceModel === "paid_once") {
        return "Pago único (precio no disponible)";
      }
      return "Precio no disponible";
    }
    const formattedAmount = `${course.currency === "EUR" ? "€" : course.currency}${course.priceAmount}`;
    if (course.priceModel === "subscription") {
      const intervalLabel =
        course.priceInterval === "year"
          ? "año"
          : course.priceInterval === "month"
            ? "mes"
            : "periodo";
      return `${formattedAmount}/${intervalLabel}`;
    }
    return formattedAmount;
  };

  const truncateText = (value: string, maxLength: number) => {
    if (value.length <= maxLength) {
      return value;
    }
    return `${value.slice(0, maxLength).trim()}…`;
  };

  const formatDescription = (course: typeof leftCourse) => {
    const description = course?.shortDescription ?? "Descripción no disponible.";
    return truncateText(description, 140);
  };

  const rows = [
    {
      label: "Precio",
      left: formatPrice(leftCourse),
      right: formatPrice(rightCourse)
    },
    {
      label: "Descripción",
      left: formatDescription(leftCourse),
      right: formatDescription(rightCourse),
      className: "text-sm text-slate-600"
    },
    { label: "Plataforma", left: leftCourse.platform, right: rightCourse.platform },
    { label: "Duración", left: leftCourse.durationText, right: rightCourse.durationText },
    { label: "Nivel", left: leftCourse.level, right: rightCourse.level },
    {
      label: "Rating",
      left: leftCourse.rating ? leftCourse.rating.toFixed(1) : "Sin rating",
      right: rightCourse.rating ? rightCourse.rating.toFixed(1) : "Sin rating"
    },
    { label: "Idioma", left: leftCourse.language, right: rightCourse.language },
    {
      label: "Certificado",
      left: leftCourse.certificate ? "Sí" : "No",
      right: rightCourse.certificate ? "Sí" : "No"
    },
    {
      label: "Puntos clave",
      left:
        leftCourse.syllabusBullets?.length
          ? leftCourse.syllabusBullets.slice(0, 3).join(" · ")
          : "No disponible",
      right:
        rightCourse.syllabusBullets?.length
          ? rightCourse.syllabusBullets.slice(0, 3).join(" · ")
          : "No disponible",
      className: "text-sm text-slate-600"
    }
  ];

  return (
    <section className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <h2 className="text-3xl font-semibold text-slate-900">
          Comparativa de cursos
        </h2>
        <p className="text-slate-600">
          Revisa rápidamente las diferencias clave entre ambos cursos.
        </p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="grid grid-cols-3 gap-4 border-b border-slate-200 bg-slate-50 px-6 py-4 text-sm font-semibold text-slate-700">
          <span>Detalle</span>
          <span>{leftCourse.title}</span>
          <span>{rightCourse.title}</span>
        </div>
        <div className="divide-y divide-slate-200">
          {rows.map((row) => (
            <div
              key={row.label}
              className="grid grid-cols-3 gap-4 px-6 py-4 text-sm text-slate-600"
            >
              <span className="font-semibold text-slate-700">{row.label}</span>
              <span className={row.className}>{row.left}</span>
              <span className={row.className}>{row.right}</span>
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={handleChangeCourses}
        className="w-fit rounded-lg border border-blue-200 px-5 py-2 text-sm font-semibold text-blue-700 hover:border-blue-300"
      >
        Cambiar cursos
      </button>
    </section>
  );
}
