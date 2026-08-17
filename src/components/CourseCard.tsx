"use client";

import Link from "next/link";
import { Course } from "@/types/course";
import { useCompareSelection } from "@/contexts/CompareSelectionContext";
import { courses } from "@/lib/catalog-adapter";
import { trackOutboundCourseClick } from "@/lib/outbound-tracking";
import {
  EXTERNAL_PROVIDER_CONTEXT,
  PROVIDER_CTA_LABEL,
  PROVIDER_DETAILS_NOTICE
} from "@/lib/providerCta";

type CourseCardProps = {
  course: Course;
};

export const CourseCard = ({ course }: CourseCardProps) => {
  const { toggle, isSelected, selectedIds, clear } = useCompareSelection();
  const selected = isSelected(course.id);
  const atLimit = selectedIds.length >= 2;
  const selectedCourses = selectedIds
    .map((id) => courses.find((item) => item.id === id))
    .filter((item): item is Course => item != null);
  const selectedFromAnotherSkill =
    atLimit &&
    !selected &&
    selectedCourses.every((item) =>
      item.skillTags.every((tag) => !course.skillTags.includes(tag))
    );
  const durationLabel = course.durationText.toLowerCase();
  const priceLabel = course.priceText.toLowerCase();
  const hasKnownDuration =
    !durationLabel.includes("not listed") &&
    !durationLabel.includes("pending verification");
  const hasKnownPrice =
    !priceLabel.includes("not listed") &&
    !priceLabel.includes("pending verification");
  const facts = [
    { label: "Platform", value: course.platform },
    { label: "Level", value: course.level },
    hasKnownDuration ? { label: "Duration", value: course.durationText } : null,
    hasKnownPrice ? { label: "Price", value: course.priceText } : null,
    {
      label: "Certificate",
      value: course.certificate ? "Certificate available" : "Certificate not verified"
    },
    course.language ? { label: "Language", value: course.language } : null
  ].filter((fact): fact is { label: string; value: string } => fact !== null);

  return (
    <article className={`flex h-full min-w-0 flex-col gap-5 rounded-[1.35rem] border bg-white p-5 shadow-[0_14px_36px_-28px_rgba(15,23,42,0.45)] transition sm:p-6 ${
      selected
        ? "border-blue-300 ring-2 ring-blue-100"
        : "border-slate-200/80 hover:border-slate-300 hover:shadow-[0_18px_42px_-28px_rgba(15,23,42,0.5)]"
    }`}>
      <div className="flex items-start justify-between gap-4">
        <div className="min-w-0">
          <p className="mb-2 text-xs font-bold uppercase tracking-[0.14em] text-blue-700">{course.platform}</p>
          <h3 className="break-words text-xl font-semibold leading-snug tracking-tight text-slate-950">{course.title}</h3>
          <p className="mt-2 text-sm font-medium text-slate-500">
            {course.platform} / {course.level}
          </p>
        </div>
        {course.rating ? (
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
            Rating {course.rating.toFixed(1)}
          </span>
        ) : null}
      </div>
      {course.shortDescription ? (
        <p className="text-sm leading-6 text-slate-600">{course.shortDescription}</p>
      ) : null}
      <div className="space-y-2">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
          Key facts
        </p>
        <div className="grid grid-cols-2 gap-2 text-sm text-slate-600">
          {facts.map((fact) => (
            <div key={fact.label} className="rounded-xl border border-slate-100 bg-slate-50/80 px-3 py-2.5">
              <span className="block text-xs font-medium text-slate-500">
                {fact.label}
              </span>
              <span className="mt-0.5 block font-semibold leading-snug text-slate-800">{fact.value}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-auto space-y-2">
        <button
          type="button"
          aria-pressed={selected}
          onClick={() => toggle(course.id)}
          className={`min-h-12 w-full rounded-xl px-4 py-2.5 text-sm font-semibold shadow-sm transition ${
            selected
              ? "bg-emerald-600 text-white hover:bg-emerald-500"
              : atLimit
                ? "bg-slate-200 text-slate-600 hover:bg-slate-300"
                : "bg-blue-700 text-white hover:bg-blue-600"
          }`}
        >
          {selected ? "Remove from compare" : "Add to compare"}
        </button>
        <div className="grid gap-2 sm:grid-cols-2">
          <Link
            href={`/courses/${course.id}`}
            className="min-h-11 rounded-xl border border-slate-300 px-4 py-2.5 text-center text-sm font-semibold text-slate-800 transition hover:border-slate-400 hover:bg-slate-50"
          >
            View details
          </Link>
          <a
            href={course.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackOutboundCourseClick(course, EXTERNAL_PROVIDER_CONTEXT.card)}
            className="min-h-11 rounded-xl px-4 py-2.5 text-center text-sm font-semibold text-slate-500 transition hover:bg-slate-50 hover:text-slate-900"
          >
            {PROVIDER_CTA_LABEL}
          </a>
        </div>
      </div>
      <p className="border-t border-slate-100 pt-3 text-xs leading-relaxed text-slate-500">
        {PROVIDER_DETAILS_NOTICE}
      </p>
      {atLimit && !selected ? (
        <div className="rounded-xl bg-amber-50 p-3 text-sm text-amber-900">
          <p>
            {selectedFromAnotherSkill
              ? "You have two courses selected from another skill. Clear them to compare courses in this skill."
              : "You already have two courses selected. Clear them to choose a different pair."}
          </p>
          <button type="button" onClick={clear} className="mt-2 min-h-10 rounded-lg border border-amber-300 bg-white px-3 py-2 font-semibold">
            Clear selection
          </button>
        </div>
      ) : null}
    </article>
  );
};
