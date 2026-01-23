"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { courses } from "@/data/courses";

const LAST_SKILL_KEY = "skills-compare-last-skill";

export default function CompareClient() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const idsParam = searchParams.get("ids") ?? "";

  const ids = useMemo(() => idsParam.split(",").filter(Boolean), [idsParam]);
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
          Vuelve al listado y selecciona exactamente dos cursos.
        </p>
        <Link
          href="/"
          className="rounded-lg bg-slate-900 px-5 py-2 text-sm font-semibold text-white"
        >
          Ir al Home
        </Link>
      </section>
    );
  }

  const rows = [
    { label: "Plataforma", left: leftCourse.platform, right: rightCourse.platform },
    { label: "Precio", left: leftCourse.priceText, right: rightCourse.priceText },
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
      left: leftCourse.syllabusBullets.slice(0, 3).join(" · "),
      right: rightCourse.syllabusBullets.slice(0, 3).join(" · ")
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
              <span>{row.left}</span>
              <span>{row.right}</span>
            </div>
          ))}
        </div>
      </div>

      <button
        type="button"
        onClick={handleChangeCourses}
        className="w-fit rounded-lg border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-700 hover:border-slate-300"
      >
        Cambiar cursos
      </button>
    </section>
  );
}
