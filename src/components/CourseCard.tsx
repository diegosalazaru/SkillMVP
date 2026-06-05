"use client";

import Link from "next/link";
import { Course } from "@/types/course";
import { useCompareSelection } from "@/contexts/CompareSelectionContext";
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
  const hasKnownDuration = !course.durationText
    .toLowerCase()
    .includes("pending verification");
  const hasKnownPrice = !course.priceText
    .toLowerCase()
    .includes("pending verification");
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
    <div className="flex h-full flex-col gap-5 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h3 className="text-lg font-semibold text-slate-900">{course.title}</h3>
          <p className="text-sm text-slate-500">
            {course.platform} · {course.level}
          </p>
        </div>
        {course.rating ? (
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-700">
            ⭐ {course.rating.toFixed(1)}
          </span>
        ) : null}
      </div>
      {course.shortDescription ? (
        <p className="text-sm leading-relaxed text-slate-600">{course.shortDescription}</p>
      ) : null}
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-400">
          Key facts
        </p>
        <div className="grid gap-2 text-sm text-slate-600 sm:grid-cols-2">
          {facts.map((fact) => (
            <div key={fact.label} className="rounded-lg bg-slate-50 px-3 py-2">
              <span className="block text-xs font-medium text-slate-500">
                {fact.label}
              </span>
              <span className="font-semibold text-slate-800">{fact.value}</span>
            </div>
          ))}
        </div>
      </div>
      <div className="mt-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <a
            href={course.externalUrl}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => trackOutboundCourseClick(course, EXTERNAL_PROVIDER_CONTEXT.card)}
            className="rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
          >
            {PROVIDER_CTA_LABEL}
          </a>
          <Link
            href={`/courses/${course.id}`}
            className="rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-700 hover:border-slate-300"
          >
            Details
          </Link>
        </div>
        <label className="flex items-center gap-2 text-sm text-slate-600">
          <input
            type="checkbox"
            checked={selected}
            onChange={() => toggle(course.id)}
            className="h-4 w-4 rounded border-slate-300 text-slate-900"
          />
          Add to compare
        </label>
      </div>
      <p className="text-xs text-slate-500">{PROVIDER_DETAILS_NOTICE}</p>
      {atLimit && !selected ? (
        <div className="flex flex-wrap items-center gap-2 text-xs text-amber-700">
          <span>Two courses are already selected. Clear the compare bar selection to add this course.</span>
          <button type="button" onClick={clear} className="font-semibold underline">
            Clear selection
          </button>
        </div>
      ) : null}
    </div>
  );
};
