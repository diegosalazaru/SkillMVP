"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { AdPlaceholder } from "@/components/AdPlaceholder";
import {
  buildComparisonRows,
  getCourseFitBullets,
  getDecisionSummary,
  getPendingDataRisks,
  isDurationPending,
  isExactPricePending
} from "@/lib/decision-support";
import { formatCoursePrice } from "@/lib/formatPrice";
import { courses } from "@/lib/catalog-adapter";
import { trackOutboundCourseClick } from "@/lib/outbound-tracking";
import {
  EXTERNAL_PROVIDER_CONTEXT,
  PROVIDER_CTA_LABEL,
  PROVIDER_DETAILS_NOTICE
} from "@/lib/providerCta";
import type { Course } from "@/types/course";

const LAST_SKILL_KEY = "skills-compare-last-skill";

const statusClasses = {
  Same: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  Different: "bg-blue-50 text-blue-700 ring-blue-100",
  "Missing data": "bg-amber-50 text-amber-800 ring-amber-100",
  "Needs verification": "bg-orange-50 text-orange-800 ring-orange-100"
};

const sectionGroups = [
  { title: "Key similarities", key: "similarities" },
  { title: "Key differences", key: "differences" },
  { title: "Uncertainty warnings", key: "uncertainty" },
  { title: "Practical fit framing", key: "fitFraming" }
] as const;

const decisionChecklist = [
  "I verified final provider price/subscription terms.",
  "I checked certificate terms.",
  "I confirmed duration fits my weekly schedule.",
  "I reviewed prerequisites and learning topics.",
  "I compared at least two options."
];

const CourseFitCard = ({ course }: { course: Course }) => (
  <div className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
    <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
      May fit you if
    </p>
    <h3 className="mt-2 break-words text-lg font-semibold text-slate-900">{course.title}</h3>
    <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-600">
      {getCourseFitBullets(course).map((bullet) => (
        <li key={bullet}>{bullet}</li>
      ))}
    </ul>
  </div>
);

const CourseDecisionDetails = ({ course }: { course: Course }) => (
  <article className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
    <div className="space-y-2">
      <h3 className="break-words text-lg font-semibold text-slate-900">{course.title}</h3>
      <p className="text-sm leading-relaxed text-slate-600">
        {course.shortDescription ?? "Description unavailable."}
      </p>
    </div>

    <div className="mt-5 grid gap-5 md:grid-cols-2">
      <div>
        <h4 className="text-sm font-semibold text-slate-900">What you will learn</h4>
        {course.syllabusBullets.length > 0 ? (
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-600">
            {course.syllabusBullets.slice(0, 4).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-slate-600">
            Learning topics are not available in the current catalog.
          </p>
        )}
      </div>
      <div>
        <h4 className="text-sm font-semibold text-slate-900">Prerequisites</h4>
        {course.prerequisitesBullets.length > 0 ? (
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-600">
            {course.prerequisitesBullets.slice(0, 4).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-slate-600">
            Prerequisites are not available in the current catalog.
          </p>
        )}
      </div>
    </div>

    <div className="mt-5 grid gap-3 sm:flex sm:flex-wrap">
      <a
        href={course.externalUrl}
        target="_blank"
        rel="noopener noreferrer"
        onClick={() => trackOutboundCourseClick(course, EXTERNAL_PROVIDER_CONTEXT.compare)}
        className="min-h-11 rounded-lg bg-blue-600 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-blue-500"
      >
        {PROVIDER_CTA_LABEL}
      </a>
      <Link
        href={`/courses/${course.id}`}
        className="min-h-11 rounded-lg border border-slate-200 px-4 py-2 text-center text-sm font-semibold text-slate-700 hover:border-slate-300"
      >
        View course details
      </Link>
    </div>
  </article>
);

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

  const getLastSkill = () =>
    typeof window === "undefined" ? null : window.localStorage.getItem(LAST_SKILL_KEY);

  const handleChangeCourses = () => {
    const lastSkill = getLastSkill();
    router.push(lastSkill ? `/skills/${lastSkill}` : "/");
  };

  if (!hasTwoCourses) {
    return (
      <section className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
        <h2 className="text-2xl font-semibold text-slate-900">
          Select exactly 2 courses to compare
        </h2>
        <p className="text-slate-600">
          We need two valid selected courses to show a side-by-side comparison.
        </p>
        <div className="flex flex-wrap justify-center gap-3">
          <Link href="/" className="rounded-lg border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-700 hover:border-slate-300">Browse available skills</Link>
          {getLastSkill() ? (
            <button
              type="button"
              onClick={handleChangeCourses}
              className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-500"
            >
              Return to last skill
            </button>
          ) : null}
        </div>
      </section>
    );
  }

  const leftPrice = formatCoursePrice(leftCourse);
  const rightPrice = formatCoursePrice(rightCourse);
  const decisionSummary = getDecisionSummary(leftCourse, rightCourse, leftPrice, rightPrice);
  const comparisonRows = buildComparisonRows(leftCourse, rightCourse, leftPrice, rightPrice);
  const pendingRisks = getPendingDataRisks([leftCourse, rightCourse]);

  return (
    <section className="flex min-w-0 flex-col gap-6 pb-8 sm:gap-8">
      <header className="flex flex-col gap-3">
        <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
          Course comparison
        </p>
        <h2 className="break-words text-2xl font-semibold text-slate-900 sm:text-3xl">
          {leftCourse.title} vs {rightCourse.title}
        </h2>
        <p className="max-w-3xl text-slate-600">
          Use the comparison below to understand practical differences, uncertainty, and what to verify before opening the provider page.
        </p>
      </header>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <div className="flex flex-col gap-2 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
              Decision summary
            </p>
            <h3 className="mt-2 text-xl font-semibold text-slate-900">
              What changes your decision?
            </h3>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-slate-600">
            This summary is deterministic. It highlights factual fit signals and uncertainty; it does not rank courses.
          </p>
        </div>

        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {sectionGroups.map((group) => (
            <div key={group.key} className="rounded-xl bg-slate-50 p-4">
              <h4 className="font-semibold text-slate-900">{group.title}</h4>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-600">
                {decisionSummary[group.key].map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <h3 className="text-lg font-semibold text-slate-900">Open provider pages</h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">{PROVIDER_DETAILS_NOTICE}</p>
        <div className="mt-4 grid gap-3 sm:flex sm:flex-wrap">
          <a
            href={leftCourse.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackOutboundCourseClick(leftCourse, EXTERNAL_PROVIDER_CONTEXT.compare)}
            aria-label={`Open provider page for ${leftCourse.title}`}
            className="min-h-11 rounded-lg bg-blue-600 px-5 py-2 text-center text-sm font-semibold text-white hover:bg-blue-500"
          >
            Open first provider
          </a>
          <a
            href={rightCourse.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackOutboundCourseClick(rightCourse, EXTERNAL_PROVIDER_CONTEXT.compare)}
            aria-label={`Open provider page for ${rightCourse.title}`}
            className="min-h-11 rounded-lg bg-blue-600 px-5 py-2 text-center text-sm font-semibold text-white hover:bg-blue-500"
          >
            Open second provider
          </a>
          <button
            type="button"
            onClick={handleChangeCourses}
            className="min-h-11 rounded-lg border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-700 hover:border-slate-300"
          >
            Change courses
          </button>
        </div>
      </section>

      <section className="rounded-2xl border border-amber-200 bg-amber-50 p-4 sm:p-5">
        <h3 className="text-lg font-semibold text-amber-950">Data to verify before enrolling</h3>
        <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-amber-900">
          {pendingRisks.map((risk) => (
            <li key={risk}>{risk}</li>
          ))}
        </ul>
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 bg-slate-50 px-4 py-4 sm:px-6">
          <h3 className="text-lg font-semibold text-slate-900">Criteria that matter</h3>
          <p className="mt-1 text-sm text-slate-600">
            Each row includes a status and interpretation so you do not have to infer the tradeoff from raw facts alone.
          </p>
        </div>
        <div className="divide-y divide-slate-200">
          {comparisonRows.map((row) => (
            <div key={row.label} className="grid min-w-0 gap-3 px-4 py-5 sm:px-6 lg:grid-cols-[0.8fr_1fr_1fr_1fr]">
              <div className="space-y-2">
                <p className="font-semibold text-slate-900">{row.label}</p>
                <span className={`inline-flex rounded-full px-2 py-1 text-xs font-semibold ring-1 ${statusClasses[row.status]}`}>
                  {row.status}
                </span>
              </div>
              <div className="rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-700 lg:bg-transparent lg:px-0 lg:py-0">
                <p className="break-words text-xs font-semibold text-slate-500">{leftCourse.title}</p>
                <p className="mt-1 break-words">{row.left}</p>
              </div>
              <div className="rounded-lg bg-slate-50 px-3 py-2 text-sm text-slate-700 lg:bg-transparent lg:px-0 lg:py-0">
                <p className="break-words text-xs font-semibold text-slate-500">{rightCourse.title}</p>
                <p className="mt-1 break-words">{row.right}</p>
              </div>
              <p className="text-sm leading-relaxed text-slate-600">{row.interpretation}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <CourseFitCard course={leftCourse} />
        <CourseFitCard course={rightCourse} />
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <CourseDecisionDetails course={leftCourse} />
        <CourseDecisionDetails course={rightCourse} />
      </section>

      <section className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
        <h3 className="text-lg font-semibold text-slate-900">Before you choose</h3>
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {decisionChecklist.map((item) => (
            <div key={item} className="flex gap-3 rounded-xl bg-slate-50 p-3 text-sm text-slate-700">
              <span aria-hidden="true" className="mt-0.5 flex h-5 w-5 items-center justify-center rounded-full border border-slate-300 text-xs font-semibold text-slate-500">
                Check
              </span>
              <span>{item}</span>
            </div>
          ))}
        </div>
      </section>

      <AdPlaceholder />
    </section>
  );
}
