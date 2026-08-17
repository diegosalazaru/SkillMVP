"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CourseCard } from "@/components/CourseCard";
import { Filters } from "@/components/Filters";
import { AdPlaceholder } from "@/components/AdPlaceholder";
import { courses } from "@/lib/catalog-adapter";
import { getSkillAlternatives, getSkillIntro } from "@/lib/skill-catalog";
import { slugify, titleFromSlug } from "@/utils/slugify";
import { useCompareSelection } from "@/contexts/CompareSelectionContext";
import type { Course } from "@/types/course";

const LAST_SKILL_KEY = "skills-compare-last-skill";

const normalizeSkillSlug = (value: string) => {
  const normalized = slugify(value);

  const withoutPrefix = normalized.startsWith("skills")
    ? normalized.replace(/^skills-?/, "")
    : normalized;

  const aliases: Record<string, string> = {
    "machine": "machine-learning",
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
  const { selectedIds, clear } = useCompareSelection();

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
    const options = [{ value: "All", label: "All" }];
    if (models.has("free")) {
      options.push({ value: "free", label: "Free" });
    }
    if (models.has("paid_once")) {
      options.push({ value: "paid_once", label: "One-time payment" });
    }
    if (models.has("subscription")) {
      options.push({ value: "subscription", label: "Subscription" });
    }
    if (models.has("unknown")) {
      options.push({ value: "unknown", label: "Unknown" });
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
  const selectedCourses = selectedIds
    .map((id) => courses.find((course) => course.id === id))
    .filter((course): course is Course => course != null);
  const hasOtherSkillSelection =
    selectedIds.length === 2 &&
    Boolean(skillSlug) &&
    selectedCourses.every((course) =>
      course.skillTags.every((tag) => slugify(tag) !== skillSlug)
    );
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

  const filteredCertificateCount = filteredCourses.filter(
    (course) => course.certificate
  ).length;
  const hasActiveFilters = Object.values(filters).some((value) => value !== "All");

  return (
    <section className="flex flex-col gap-8 sm:gap-10">
      <div className="rounded-[1.75rem] border border-slate-200/80 bg-white/90 p-5 shadow-[0_24px_70px_-50px_rgba(15,23,42,0.45)] sm:p-8 lg:p-10">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-700">
          Skill
        </p>
        <h2 className="mt-3 text-3xl font-semibold tracking-[-0.03em] text-slate-950 sm:text-4xl lg:text-5xl">
          {skillExists ? skillTitle : "Skill not found"}
        </h2>
        <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-600 sm:text-lg">
          {skillIntro ??
            "We do not have validated courses for this skill yet. Review available alternatives in the catalog."}
        </p>
        
      </div>

      {hasOtherSkillSelection ? (
        <div className="flex flex-col gap-3 rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-950 sm:flex-row sm:items-center sm:justify-between">
          <p>
            You have two courses selected from another skill. Clear them to compare courses in this skill.
          </p>
          <button
            type="button"
            onClick={clear}
            className="min-h-11 shrink-0 rounded-xl border border-amber-300 bg-white px-4 py-2 font-semibold"
          >
            Clear selection
          </button>
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

      {skillExists ? (
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-200/80 pb-4 text-sm text-slate-600">
          <p>
            <span className="font-semibold text-slate-900">{filteredCourses.length}</span> of{" "}
            {skillCourses.length} courses shown{hasActiveFilters ? " with current filters" : ""}.
          </p>
          <span className="rounded-full border border-slate-200 bg-white px-3 py-1.5 text-xs font-semibold text-slate-600">
            {filteredCertificateCount} with certificate shown
          </span>
        </div>
      ) : null}

      {!skillExists ? (
        <div className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-600">
          <p>
            We could not find validated courses for this skill. You can review real alternatives in the catalog.
          </p>
          <Link
            href="/"
            className="mt-4 inline-flex rounded-lg border border-blue-200 px-4 py-2 text-sm font-semibold text-blue-700 hover:border-blue-300"
          >
            View available alternatives
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
          No courses match these filters. Try adjusting your search or clearing filters.
        </div>
      ) : (
        <div className="grid items-stretch gap-6 lg:grid-cols-2">
          {filteredCourses.map((course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      )}

      {skillExists ? (
        <details className="group rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_14px_36px_-30px_rgba(15,23,42,0.4)] sm:p-6">
          <summary className="cursor-pointer list-none font-semibold text-slate-950">
            How to compare these courses
            <span className="ml-2 text-sm font-normal text-slate-500 group-open:hidden">
              Show guidance
            </span>
          </summary>
          <ul className="mt-4 grid gap-2 text-sm text-slate-600 sm:grid-cols-2 lg:grid-cols-5">
            {[
              ["Price", "Compare total cost and certificate fees."],
              ["Duration", "Check workload against your schedule."],
              ["Level", "Match the course to your experience."],
              ["Certificate", "Verify availability and payment terms."],
              ["Platform", "Consider format, support, and language."]
            ].map(([label, help]) => (
              <li key={label} className="rounded-lg bg-slate-50 px-3 py-2">
                <span className="block font-semibold text-slate-800">{label}</span>
                <span>{help}</span>
              </li>
            ))}
          </ul>
        </details>
      ) : null}

      {skillExists ? (
        <p className="text-sm text-slate-500">
          {skillCourses.length} courses in the catalog
          {availablePlatforms ? ` across ${availablePlatforms}` : ""}
          {availableLevels ? `, with ${availableLevels} levels shown` : ""}.
        </p>
      ) : null}

      <AdPlaceholder />
    </section>
  );
}
