"use client";

import { useEffect, useMemo, useState } from "react";
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

  useEffect(() => {
    if (typeof window !== "undefined" && skillSlug) {
      window.localStorage.setItem(LAST_SKILL_KEY, skillSlug);
    }
  }, [skillSlug]);

  const skillTitle = titleFromSlug(skillSlug ?? "");

  const filteredCourses = useMemo(() => {
    if (!skillSlug) {
      return [];
    }
    return courses
      .filter((course) =>
        course.skillTags.some((tag) => slugify(tag) === skillSlug)
      )
      .filter((course) =>
        filters.platform === "All" ? true : course.platform === filters.platform
      )
      .filter((course) =>
        filters.level === "All" ? true : course.level === filters.level
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
        <h2 className="text-3xl font-semibold text-slate-900">{skillTitle}</h2>
        <p className="mt-2 text-slate-600">
          Filtra y compara cursos para esta skill.
        </p>
      </div>

      <Filters value={filters} onChange={setFilters} />

      {filteredCourses.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-600">
          No encontramos cursos con esos filtros. Prueba otra combinación.
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
