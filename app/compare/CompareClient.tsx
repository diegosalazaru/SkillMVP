"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { AdPlaceholder } from "@/components/AdPlaceholder";
import { formatCoursePrice } from "@/lib/formatPrice";
import { courses } from "@/lib/catalog-adapter";
import { trackOutboundCourseClick } from "@/lib/outbound-tracking";
import {
  EXTERNAL_PROVIDER_CONTEXT,
  PROVIDER_CTA_LABEL,
  PROVIDER_DETAILS_NOTICE
} from "@/lib/providerCta";

const LAST_SKILL_KEY = "skills-compare-last-skill";

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

  const formatLevel = (level: string) => level;

  const leftPrice = formatCoursePrice(leftCourse);
  const rightPrice = formatCoursePrice(rightCourse);

  const rawRows = [
    { label: "Price", left: leftPrice, right: rightPrice },
    { label: "Platform", left: leftCourse.platform, right: rightCourse.platform },
    { label: "Duration", left: leftCourse.durationText, right: rightCourse.durationText },
    {
      label: "Level",
      left: formatLevel(leftCourse.level),
      right: formatLevel(rightCourse.level)
    },
    { label: "Language", left: leftCourse.language, right: rightCourse.language },
    {
      label: "Certificate",
      left: leftCourse.certificate ? "Included" : "Not verified",
      right: rightCourse.certificate ? "Included" : "Not verified"
    }
  ];

  const summaryInsights = [
    leftCourse.level === rightCourse.level
      ? `Both courses are at ${formatLevel(leftCourse.level).toLowerCase()}.`
      : `Levels differ: ${formatLevel(leftCourse.level)} vs ${formatLevel(rightCourse.level)}.`,
    leftCourse.durationText === rightCourse.durationText
      ? "Both courses report the same duration."
      : `Reported duration differs: ${leftCourse.durationText} vs ${rightCourse.durationText}.`,
    leftPrice === rightPrice
      ? `Displayed price matches: ${leftPrice}.`
      : `Price or payment model differs: ${leftPrice} vs ${rightPrice}.`,
    leftCourse.language === rightCourse.language
      ? `Both courses are in ${leftCourse.language}.`
      : `Languages differ: ${leftCourse.language} vs ${rightCourse.language}.`,
    leftCourse.certificate === rightCourse.certificate
      ? leftCourse.certificate
        ? "Both courses include a certificate."
        : "For both courses, certificate status is pending verification."
      : "Only one course reports an included certificate."
  ];

  return (
    <section className="flex flex-col gap-8">
      <div className="flex flex-col gap-3">
        <h2 className="text-3xl font-semibold text-slate-900">
          Course comparison
        </h2>
        <p className="text-slate-600">
          Review verified differences to make a clearer decision.
        </p>
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h3 className="text-lg font-semibold text-slate-900">
          Quick summary
        </h3>
        <ul className="mt-3 grid gap-2 text-sm text-slate-600">
          {summaryInsights.map((insight) => (
            <li key={insight} className="rounded-lg bg-slate-50 px-3 py-2">
              {insight}
            </li>
          ))}
        </ul>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="grid gap-4 border-b border-slate-200 bg-slate-50 px-4 py-4 text-sm font-semibold text-slate-700 sm:grid-cols-3 sm:px-6">
          <span className="hidden sm:block">Detail</span>
          <span className="flex flex-col gap-3">
            <Link
              href={`/courses/${leftCourse.id}`}
              className="text-slate-900 hover:underline"
            >
              {leftCourse.title}
            </Link>
            {leftCourse.shortDescription ? (
              <span className="text-xs font-normal leading-relaxed text-slate-600">
                {leftCourse.shortDescription}
              </span>
            ) : null}
            <a
              href={leftCourse.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackOutboundCourseClick(leftCourse, EXTERNAL_PROVIDER_CONTEXT.compare)}
              className="w-fit rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
            >
              {PROVIDER_CTA_LABEL}
            </a>
          </span>
          <span className="flex flex-col gap-3">
            <Link
              href={`/courses/${rightCourse.id}`}
              className="text-slate-900 hover:underline"
            >
              {rightCourse.title}
            </Link>
            {rightCourse.shortDescription ? (
              <span className="text-xs font-normal leading-relaxed text-slate-600">
                {rightCourse.shortDescription}
              </span>
            ) : null}
            <a
              href={rightCourse.externalUrl}
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => trackOutboundCourseClick(rightCourse, EXTERNAL_PROVIDER_CONTEXT.compare)}
              className="w-fit rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
            >
              {PROVIDER_CTA_LABEL}
            </a>
          </span>
        </div>
        <p className="border-b border-slate-200 px-6 py-3 text-xs text-slate-500">
          {PROVIDER_DETAILS_NOTICE}
        </p>
        <div className="divide-y divide-slate-200">
          {rawRows.map((row) => {
            const differs = row.left !== row.right;
            return (
              <div
                key={row.label}
                className={`grid gap-3 px-4 py-4 text-sm text-slate-600 sm:grid-cols-3 sm:gap-4 sm:px-6 ${
                  differs ? "bg-blue-50/50" : "bg-white"
                }`}
              >
                <span className="font-semibold text-slate-700">{row.label}</span>
                <span className="rounded-lg bg-white/70 px-3 py-2 sm:rounded-none sm:bg-transparent sm:px-0 sm:py-0">
                  <span className="block text-xs font-semibold text-slate-500 sm:hidden">
                    {leftCourse.title}
                  </span>
                  {row.left}
                </span>
                <span className="rounded-lg bg-white/70 px-3 py-2 sm:rounded-none sm:bg-transparent sm:px-0 sm:py-0">
                  <span className="block text-xs font-semibold text-slate-500 sm:hidden">
                    {rightCourse.title}
                  </span>
                  {row.right}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      <AdPlaceholder />

      <button
        type="button"
        onClick={handleChangeCourses}
        className="w-fit rounded-lg border border-blue-200 px-5 py-2 text-sm font-semibold text-blue-700 hover:border-blue-300"
      >
        Change courses
      </button>
    </section>
  );
}
