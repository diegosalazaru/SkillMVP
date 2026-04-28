import type { Metadata } from "next";
import { getCoursesForSkill, getSkillSummary } from "@/lib/skill-catalog";
import SkillClient from "./SkillClient";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { CourseCard } from "@/components/CourseCard";
import { Filters } from "@/components/Filters";
import { CompareBar } from "@/components/CompareBar";
import { courses } from "@/lib/catalog-adapter";
import { slugify, titleFromSlug } from "@/utils/slugify";
import {
  getSkillOptions,
  getSkillSuggestions,
  resolveSkillSlug
} from "@/lib/skill-routing";

const LAST_SKILL_KEY = "skills-compare-last-skill";

type FiltersState = {
  platform: string;
  level: string;
  priceModel: string;
};

export default function SkillPage() {
  const params = useParams();
  const rawSkillSlug = Array.isArray(params.skillSlug)
    ? params.skillSlug[0]
    : params.skillSlug;

  const skillSlug = rawSkillSlug ? resolveSkillSlug(rawSkillSlug) : null;

  const [filters, setFilters] = useState<FiltersState>({
    platform: "All",
    level: "All",
    priceModel: "All"
  });

  const availableSkillSlugs = useMemo(() => {
    return new Set(getSkillOptions().map((skill) => skill.slug));
  }, []);

  const skillExists = skillSlug ? availableSkillSlugs.has(skillSlug) : false;
  const suggestions = useMemo(() => getSkillSuggestions(), []);

  const courseCount = getCoursesForSkill(skill.slug).length;

  const levelOptions = useMemo(() => {
    const levels = Array.from(new Set(courses.map((course) => course.level))).sort();
    return ["All", ...levels];
  }, []);

  const priceOptions = useMemo(() => {
    const models = new Set(courses.map((course) => course.priceModel));
    const options = [{ value: "All", label: "Todos" }];
    if (models.has("free")) {
      options.push({ value: "free", label: "Gratis" });
    }
    if (models.has("paid_once")) {
      options.push({ value: "paid_once", label: "Pago único" });
    }
    if (models.has("subscription")) {
      options.push({ value: "subscription", label: "Suscripción" });
    }
    if (models.has("unknown")) {
      options.push({ value: "unknown", label: "Desconocido" });
    }
    return options;
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && skillSlug) {
      window.localStorage.setItem(LAST_SKILL_KEY, skillSlug);
    }
  }, [skillSlug]);

  const skillTitle = titleFromSlug(skillSlug ?? "");

  const filteredCourses = useMemo(() => {
    if (!skillSlug || !skillExists) {
      return [];
    }
    return courses
      .filter((course) =>
        course.skillTags.some((tag) => slugify(tag) === skillSlug)
      )
      .filter((course) =>
        filters.platform === "All"
          ? true
          : course.platform.toLowerCase() === filters.platform.toLowerCase()
      )
      .filter((course) =>
        filters.level === "All"
          ? true
          : course.level.toLowerCase() === filters.level.toLowerCase()
      )
      .filter((course) => {
        if (filters.priceModel === "All") {
          return true;
        }
        return course.priceModel === filters.priceModel;
      });
  }, [filters.level, filters.platform, filters.priceModel, skillSlug]);

  return (
    <section className="flex flex-col gap-8 pb-24">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
          Skill
        </p>
        <h2 className="text-3xl font-semibold text-slate-900">
          {skillExists ? skillTitle : "Skill no encontrada"}
        </h2>
        <p className="mt-2 text-slate-600">
          Filtra cursos y selecciona 2 para compararlos lado a lado (por ahora).
        </p>
      </div>

      <Filters
        value={filters}
        onChange={setFilters}
        options={{
          platforms: platformOptions,
          levels: levelOptions,
          prices: priceOptions
        }}
      />

      {!skillExists ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-600">
          <p>
            No encontramos esta skill. Prueba una de estas opciones del catalogo.
          </p>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {suggestions.map((skill) => (
              <Link
                key={skill.slug}
                href={`/skills/${skill.slug}`}
                className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:border-slate-300"
              >
                {skill.title}
              </Link>
            ))}
          </div>
        </div>
      ) : filteredCourses.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-600">
          No encontramos cursos con esos filtros. Prueba ajustar la búsqueda o
          limpiar filtros.
        </div>
      ) : (
        <div className="grid gap-6 lg:grid-cols-2">
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}

export default function SkillPage({ params }: SkillPageProps) {
  return <SkillClient skillSlug={params.skillSlug} />;
}
