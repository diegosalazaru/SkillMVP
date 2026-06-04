"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { CourseCard } from "@/components/CourseCard";
import { Filters } from "@/components/Filters";
import { CompareBar } from "@/components/CompareBar";
import { AdPlaceholder } from "@/components/AdPlaceholder";
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

const formatList = (values: string[]) => {
  if (values.length === 0) {
    return "unknown";
  }

  return values.join(", ");
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

  const filteredPlatforms = Array.from(
    new Set(filteredCourses.map((course) => course.platform))
  ).sort();
  const filteredLevels = Array.from(
    new Set(filteredCourses.map((course) => course.level))
  ).sort();
  const filteredPriceModels = Array.from(
    new Set(filteredCourses.map((course) => course.priceText))
  ).sort();
  const filteredCertificateCount = filteredCourses.filter(
    (course) => course.certificate
  ).length;
  const hasActiveFilters = Object.values(filters).some((value) => value !== "All");

  return (
    <section className="flex flex-col gap-8 pb-24">
      <div>
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
          Skill
        </p>
        <h2 className="text-3xl font-semibold text-slate-900">
          {skillExists ? skillTitle : "Skill not found"}
        </h2>
        <p className="mt-2 text-slate-600">
          {skillIntro ??
            "We do not have validated courses for this skill yet. Review available alternatives in the catalog."}
        </p>
        
      </div>

      {skillExists ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">About this skill</h3>
          <p className="mt-2 text-sm text-slate-600">
            {skillCourses.length} verified courses
            {availablePlatforms ? ` on ${availablePlatforms}` : ""}
            {availableLevels ? `, levels ${availableLevels}` : ""}.
          </p>
        </div>
      ) : null}

      {skillExists ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <h3 className="text-lg font-semibold text-slate-900">
            How to compare courses
          </h3>
          <p className="mt-2 text-sm text-slate-600">
            Use these criteria to decide which course fits your context best.
          </p>
          <ul className="mt-3 grid gap-2 text-sm text-slate-600 sm:grid-cols-2 lg:grid-cols-5">
            {[
              {
                label: "Price",
                help: "Compare total cost, including subscription time and certificate fees."
              },
              {
                label: "Duration",
                help: "Check whether the weekly workload fits your real availability."
              },
              {
                label: "Level",
                help: "Choose a starting point that matches your current experience."
              },
              {
                label: "Certificate",
                help: "Verify whether certification is included or requires extra payment."
              },
              {
                label: "Platform",
                help: "Consider delivery format, support, and language experience."
              }
            ].map((item) => (
              <li key={item.label} className="rounded-lg bg-slate-50 px-3 py-2">
                <span className="block font-semibold text-slate-800">{item.label}</span>
                <span>{item.help}</span>
              </li>
            ))}
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

      {skillExists ? (
        <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
            <div>
              <h3 className="text-lg font-semibold text-slate-900">
                Results to support your decision
              </h3>
              <p className="mt-1 text-sm text-slate-600">
                {filteredCourses.length} of {skillCourses.length} courses visible
                {hasActiveFilters ? " with current filters" : ""}.
              </p>
            </div>
            <span className="w-fit rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
              {filteredCertificateCount} with verified certificate
            </span>
          </div>
          <div className="mt-4 grid gap-3 text-sm text-slate-600 md:grid-cols-3">
            <div className="rounded-lg bg-slate-50 px-4 py-3">
              <span className="block text-xs font-medium text-slate-500">
                Visible platforms
              </span>
              <span className="font-semibold text-slate-800">
                {formatList(filteredPlatforms)}
              </span>
            </div>
            <div className="rounded-lg bg-slate-50 px-4 py-3">
              <span className="block text-xs font-medium text-slate-500">
                Visible levels
              </span>
              <span className="font-semibold text-slate-800">
                {formatList(filteredLevels)}
              </span>
            </div>
            <div className="rounded-lg bg-slate-50 px-4 py-3">
              <span className="block text-xs font-medium text-slate-500">
                Price visible
              </span>
              <span className="font-semibold text-slate-800">
                {formatList(filteredPriceModels)}
              </span>
            </div>
          </div>
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
        <div className="grid gap-6 lg:grid-cols-2">
          {filteredCourses.map((course, index) => (
            <div key={course.id} className="contents">
              <CourseCard course={course} />
              {index === 1 ? (
                <div className="lg:col-span-2">
                  <AdPlaceholder />
                </div>
              ) : null}
            </div>
          ))}
          {filteredCourses.length < 2 ? (
            <div className="lg:col-span-2">
              <AdPlaceholder />
            </div>
          ) : null}
        </div>
      )}

      <CompareBar />
    </section>
  );
}
