"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CourseCard } from "@/components/CourseCard";
import { Filters } from "@/components/Filters";
import { CompareBar } from "@/components/CompareBar";
import { courses } from "@/lib/catalog-adapter";
import { getSkillAlternatives, getSkillIntro } from "@/lib/skill-catalog";
import { slugify, titleFromSlug } from "@/utils/slugify";

const LAST_SKILL_KEY = "skills-compare-last-skill";

const normalizeSkillSlug = (value: string) => {
  const normalized = slugify(value);

  const withoutPrefix = normalized.startsWith("skills")
    ? normalized.replace(/^skills-?/, "")
    : normalized;

  const aliases: Record<string, string> = {
    "machine": "ai",
    "machine-learning": "ai",
    "ai-fundamentals": "ai",
    "prompt-engineering": "ai",
    "llms": "ai",
    "data-analytics": "data-analysis"
  };

  return aliases[withoutPrefix] ?? withoutPrefix;
};

type FiltersState = {
  platform: string;
  level: string;
  priceModel: string;
  language: string;
};

type SkillClientProps = {
  skillSlug: string;
};

export default function SkillClient({ skillSlug: rawSkillSlug }: SkillClientProps) {
  const skillSlug = rawSkillSlug ? normalizeSkillSlug(rawSkillSlug) : undefined;

  const [filters, setFilters] = useState<FiltersState>({
    platform: "All",
    level: "All",
    priceModel: "All",
    language: "All"
  });

  const availableSkillSlugs = useMemo(() => {
    const slugs = new Set<string>();
    courses.forEach((course) => {
      course.skillTags.forEach((tag) => slugs.add(slugify(tag)));
    });
    return slugs;
  }, []);

  const skillExists = skillSlug ? availableSkillSlugs.has(skillSlug) : false;
  const alternatives = useMemo(() => getSkillAlternatives(), []);

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
  const languageOptions = useMemo(() => {
    const languages = Array.from(new Set(courses.map((course) => course.language))).sort();
    return ["All", ...languages];
  }, []);

  useEffect(() => {
    if (typeof window !== "undefined" && skillSlug) {
      window.localStorage.setItem(LAST_SKILL_KEY, skillSlug);
    }
  }, [skillSlug]);

  const skillTitle = titleFromSlug(skillSlug ?? "");
  const skillCourses = useMemo(() => {
    if (!skillSlug || !skillExists) {
      return [];
    }
    return courses.filter((course) =>
      course.skillTags.some((tag) => slugify(tag) === skillSlug)
    );
  }, [skillExists, skillSlug]);
  const skillIntro = skillExists
    ? getSkillIntro({
        slug: skillSlug ?? "",
        title: skillTitle,
        courseCount: skillCourses.length
      })
    : null;
  const availablePlatforms = Array.from(
    new Set(skillCourses.map((course) => course.platform))
  ).join(", ");
  const availableLevels = Array.from(
    new Set(skillCourses.map((course) => course.level))
  ).join(", ");

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
      })
      .filter((course) =>
        filters.language === "All"
          ? true
          : course.language.toLowerCase() === filters.language.toLowerCase()
      );
  }, [filters.language, filters.level, filters.platform, filters.priceModel, skillSlug]);

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
          {skillIntro ??
            "No tenemos cursos validados para esta skill. Revisa alternativas disponibles en el catalogo."}
        </p>
        {skillExists ? (
          <p className="mt-2 text-sm text-slate-500">
            Catalogo actual: {skillCourses.length} cursos
            {availablePlatforms ? ` en ${availablePlatforms}` : ""}
            {availableLevels ? `, niveles ${availableLevels}` : ""}.
          </p>
        ) : null}
      </div>

      {skillExists ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">
            Como comparar cursos
          </h3>
          <p className="mt-2 text-sm text-slate-600">
            Usa estos criterios para decidir que curso encaja mejor con tu contexto.
          </p>
          <ul className="mt-3 grid gap-2 text-sm text-slate-600 sm:grid-cols-2 lg:grid-cols-5">
            {["Precio", "Duracion", "Nivel", "Certificado", "Plataforma"].map(
              (item) => (
                <li key={item} className="rounded-lg bg-slate-50 px-3 py-2">
                  {item}
                </li>
              )
            )}
          </ul>
        </div>
      ) : null}

      <Filters
        value={filters}
        onChange={setFilters}
        options={{
          platforms: platformOptions,
          levels: levelOptions,
          prices: priceOptions,
          languages: languageOptions
        }}
      />

      {!skillExists ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-600">
          <p>
            No encontramos cursos validados para esta skill. Puedes revisar alternativas reales del catalogo.
          </p>
          <Link
            href="/"
            className="mt-4 inline-flex rounded-lg border border-blue-200 px-4 py-2 text-sm font-semibold text-blue-700 hover:border-blue-300"
          >
            Ver alternativas disponibles
          </Link>
          <div className="mt-5 flex flex-wrap justify-center gap-2">
            {alternatives.map((skill) => (
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

      <CompareBar />
    </section>
  );
}
