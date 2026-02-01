"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { CourseCard } from "@/components/CourseCard";
import { Filters } from "@/components/Filters";
import { CompareBar } from "@/components/CompareBar";
import { courses } from "@/data/courses";
import { slugify, titleFromSlug } from "@/utils/slugify";

const LAST_SKILL_KEY = "skills-compare-last-skill";

type FiltersState = {
  platform: string;
  level: string;
  priceType: string;
};

export default function SkillPage() {
  const params = useParams();
  const skillSlug = Array.isArray(params.skillSlug)
    ? params.skillSlug[0]
    : params.skillSlug;
  const [filters, setFilters] = useState<FiltersState>({
    platform: "All",
    level: "All",
    priceType: "All"
  });

  const availableSkillSlugs = useMemo(() => {
    const slugs = new Set<string>();
    courses.forEach((course) => {
      course.skillTags.forEach((tag) => slugs.add(slugify(tag)));
    });
    return slugs;
  }, []);

  const skillExists = skillSlug ? availableSkillSlugs.has(skillSlug) : false;

  const platformOptions = useMemo(() => {
    const platforms = Array.from(
      new Set(courses.map((course) => course.platform))
    ).sort();
    return ["All", ...platforms];
  }, []);

  const levelOptions = useMemo(() => {
    const levels = Array.from(new Set(courses.map((course) => course.level))).sort();
    return ["All", ...levels];
  }, []);

  const priceOptions = useMemo(() => {
    const options = ["All"];
    const priceTypes = new Set(courses.map((course) => course.priceType));
    if (priceTypes.has("free")) {
      options.push("Free");
    }
    if (priceTypes.has("paid")) {
      options.push("Paid");
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
        if (filters.priceType === "All") {
          return true;
        }
        return filters.priceType === "Free"
          ? course.priceType === "free"
          : course.priceType === "paid";
      });
  }, [filters.level, filters.platform, filters.priceType, skillSlug]);

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
            No encontramos esta skill. Revisa el enlace o vuelve a buscar desde
            el inicio.
          </p>
          <Link
            href="/"
            className="mt-4 inline-flex rounded-lg bg-slate-900 px-5 py-2 text-sm font-semibold text-white"
          >
            Volver al Home
          </Link>
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

      <CompareBar />
    </section>
  );
}
