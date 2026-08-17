"use client";

import Link from "next/link";
import { useMemo } from "react";
import { courses } from "@/lib/catalog-adapter";
import { useCompareSelection } from "@/contexts/CompareSelectionContext";
import {
  formatCertificate,
  getCourseDecisionSummary,
  getCourseFitBullets,
  isDurationPending,
  isExactPricePending
} from "@/lib/decision-support";
import { trackOutboundCourseClick } from "@/lib/outbound-tracking";
import {
  EXTERNAL_PROVIDER_CONTEXT,
  PROVIDER_CTA_LABEL,
  PROVIDER_DETAILS_NOTICE
} from "@/lib/providerCta";

type CourseDetailClientProps = {
  courseId: string;
};

export default function CourseDetailClient({ courseId }: CourseDetailClientProps) {
  const course = useMemo(
    () => courses.find((item) => item.id === courseId),
    [courseId]
  );

  const { toggle, clear, isSelected, selectedIds, notice } = useCompareSelection();

  if (!course) {
    return (
      <section className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
        <h2 className="text-2xl font-semibold text-slate-900">
          Course not found
        </h2>
        <p className="text-slate-600">
          Check the course ID or return to home.
        </p>
        <Link
          href="/"
          className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-500"
        >
          Go to home
        </Link>
      </section>
    );
  }

  const selected = isSelected(course.id);
  const atLimit = selectedIds.length >= 2 && !selected;
  const selectedCourses = selectedIds
    .map((id) => courses.find((item) => item.id === id))
    .filter((item): item is NonNullable<typeof item> => item != null);
  const selectedFromAnotherSkill =
    atLimit &&
    selectedCourses.every((item) =>
      item.skillTags.every((tag) => !course.skillTags.includes(tag))
    );
  const hasLearningBullets = course.syllabusBullets.length > 0;
  const hasPrerequisites = course.prerequisitesBullets.length > 0;
  const compareHref =
    selectedIds.length === 2 ? `/compare?ids=${selectedIds.join(",")}` : null;
  const pendingImpacts = [
    course.rating == null
      ? "Rating and review count are unavailable, so Skills Compare cannot use social proof as a decision signal."
      : "Rating is available, but review totals can change.",
    isExactPricePending(course)
      ? "Exact price is pending, so total cost must be confirmed on the provider page."
      : "Catalog price is available, but final provider terms should still be confirmed.",
    isDurationPending(course)
      ? "Duration is pending, so workload risk is higher until you verify the provider page."
      : "Duration is listed, but current workload should still be checked before committing.",
    course.certificate
      ? "Certificate availability is shown, but certificate terms can change."
      : "Certificate availability is not verified in the catalog."
  ];
  const keyFacts = [
    { label: "Platform", value: course.platform },
    { label: "Level", value: course.level },
    { label: "Duration", value: course.durationText },
    { label: "Price", value: course.priceText },
    { label: "Certificate", value: formatCertificate(course) },
    { label: "Language", value: course.language }
  ];

  return (
    <section className="flex flex-col gap-8 pb-8 sm:gap-10">
      <div className="rounded-[1.75rem] border border-slate-200/80 bg-white/90 p-5 shadow-[0_24px_70px_-50px_rgba(15,23,42,0.45)] sm:p-8 lg:p-10">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-700">
          Course
        </p>
        <div className="mt-3 grid gap-6 lg:grid-cols-[1fr_0.42fr] lg:items-start lg:gap-10">
          <div>
            <h2 className="break-words text-3xl font-semibold leading-tight tracking-[-0.03em] text-slate-950 sm:text-4xl lg:text-5xl">{course.title}</h2>
            <p className="mt-4 max-w-3xl text-base leading-relaxed text-slate-600 sm:text-lg">
              {course.shortDescription ?? "Description unavailable."}
            </p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-950 p-4 shadow-[0_18px_45px_-32px_rgba(15,23,42,0.8)] sm:p-5">
            <div className="flex flex-col gap-3">
              <a
                href={course.externalUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => trackOutboundCourseClick(course, EXTERNAL_PROVIDER_CONTEXT.detail)}
                className="min-h-12 rounded-xl bg-blue-600 px-5 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-blue-500"
              >
                {PROVIDER_CTA_LABEL}
              </a>
              <button
                type="button"
                aria-pressed={selected}
                onClick={() => toggle(course.id)}
                className={`min-h-12 rounded-xl px-5 py-2.5 text-sm font-semibold transition ${
                  selected
                    ? "bg-emerald-600 text-white hover:bg-emerald-500"
                    : atLimit
                      ? "bg-slate-800 text-slate-500"
                      : "bg-white text-slate-950 hover:bg-slate-100"
                }`}
              >
                {selected ? "Remove from compare" : "Add to compare"}
              </button>
              <Link
                href={course.skillTags[0] ? `/skills/${course.skillTags[0]}` : "/"}
                className="min-h-11 rounded-xl border border-slate-700 px-5 py-2.5 text-center text-sm font-semibold text-slate-300 transition hover:border-slate-500 hover:text-white"
              >
                Back to related courses
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-6 flex flex-wrap gap-2 border-t border-slate-200/80 pt-5 text-sm text-slate-600">
          {course.skillTags[0] ? (
            <Link
              href={`/skills/${course.skillTags[0]}`}
              className="rounded-full bg-blue-50 px-3 py-1.5 font-semibold text-blue-700 transition hover:bg-blue-100"
            >
              View skill
            </Link>
          ) : null}
          {keyFacts.slice(0, 5).map((fact) => (
            <span key={fact.label} className="rounded-full bg-slate-100 px-3 py-1.5">
              {fact.value}
            </span>
          ))}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="rounded-2xl border border-blue-200/80 bg-blue-50/60 p-5 sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            Decision summary
          </p>
          <h3 className="mt-2 text-lg font-semibold text-slate-900">
            What this course can help you evaluate
          </h3>
          <ul className="mt-4 space-y-2 text-sm leading-relaxed text-slate-600">
            {getCourseDecisionSummary(course).known.map((item) => (
              <li key={item} className="rounded-lg bg-slate-50 px-3 py-2">
                {item}
              </li>
            ))}
          </ul>
        </div>

        <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_14px_36px_-30px_rgba(15,23,42,0.4)] sm:p-6">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-slate-400">
            May fit you if
          </p>
          <ul className="mt-4 list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-600">
            {getCourseFitBullets(course).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </div>
      </div>

      <div className="rounded-2xl border border-amber-200 bg-amber-50/60 p-4 sm:p-6">
        <h3 className="text-lg font-semibold text-slate-900">
          Verify before enrolling
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-amber-900">
          {PROVIDER_DETAILS_NOTICE}
        </p>
        <ul className="mt-4 grid gap-2 text-sm leading-relaxed text-slate-700 sm:grid-cols-2">
          {pendingImpacts.map((item) => (
            <li key={item} className="rounded-xl bg-white px-3 py-2">
              {item}
            </li>
          ))}
        </ul>
      </div>

      <div className="rounded-2xl border border-blue-200/80 bg-white p-5 shadow-[0_18px_45px_-36px_rgba(37,99,235,0.35)] sm:p-6">
        <h3 className="text-lg font-semibold text-slate-900">
          Compare for better context
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          {selectedIds.length < 2
            ? "Add this course, then choose one more option for side-by-side context."
            : "Your two-course comparison is ready."}
        </p>
        <div className="mt-4 grid gap-3 sm:flex sm:flex-wrap">
          {compareHref ? (
            <Link
              href={compareHref}
              className="min-h-11 rounded-xl bg-blue-700 px-5 py-2.5 text-center text-sm font-semibold text-white hover:bg-blue-600"
            >
              Open comparison
            </Link>
          ) : null}
          <button
            type="button"
            onClick={() => toggle(course.id)}
            className="min-h-11 rounded-xl border border-slate-300 bg-white px-5 py-2.5 text-sm font-semibold text-slate-700 hover:border-slate-400"
          >
            {selected ? "Remove from compare" : "Add to compare"}
          </button>
          {selectedIds.length > 0 ? (
            <button
              type="button"
              onClick={clear}
              className="min-h-11 rounded-lg border border-slate-200 px-5 py-2 text-sm font-semibold text-slate-700 hover:border-slate-300"
            >
              Clear selection
            </button>
          ) : null}
        </div>
        {atLimit ? (
          <div className="mt-4 rounded-xl bg-amber-50 p-3 text-sm text-amber-900">
            <p>
              {selectedFromAnotherSkill
                ? "You have two courses selected from another skill. Clear them to compare courses in this skill."
                : "Two courses are already selected. Clear or remove one course to choose a different pair."}
            </p>
            {selectedFromAnotherSkill ? (
              <button
                type="button"
                onClick={clear}
                className="mt-2 min-h-10 rounded-lg border border-amber-300 bg-white px-3 py-2 font-semibold"
              >
                Clear selection
              </button>
            ) : null}
          </div>
        ) : null}
        {notice ? (
          <p className="mt-3 text-xs font-semibold text-amber-700">{notice}</p>
        ) : null}
      </div>

      {(hasLearningBullets || hasPrerequisites) ? (
        <div className="grid gap-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6 md:grid-cols-2">
          {hasLearningBullets ? (
            <div>
              <h3 className="text-lg font-semibold text-slate-900">What you will learn</h3>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-600">
                {course.syllabusBullets.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ) : null}
          {hasPrerequisites ? (
            <div>
              <h3 className="text-lg font-semibold text-slate-900">Prerequisites</h3>
              <ul className="mt-3 list-disc space-y-2 pl-5 text-sm text-slate-600">
                {course.prerequisitesBullets.map((item) => (
                  <li key={item}>{item}</li>
                ))}
              </ul>
            </div>
          ) : null}
        </div>
      ) : null}

      <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
        <h3 className="text-lg font-semibold text-slate-900">Key facts</h3>
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {keyFacts.map((fact) => (
            <div key={fact.label} className="rounded-lg bg-slate-50 px-4 py-3">
              <span className="block text-xs font-medium text-slate-500">
                {fact.label}
              </span>
              <span className="font-semibold text-slate-800">{fact.value}</span>
            </div>
          ))}
          {course.rating != null ? (
            <div className="rounded-lg bg-slate-50 px-4 py-3">
              <span className="block text-xs font-medium text-slate-500">
                Rating
              </span>
              <span className="font-semibold text-slate-800">
                {course.rating.toFixed(1)}
              </span>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
