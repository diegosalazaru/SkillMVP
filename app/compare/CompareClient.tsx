"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { AdPlaceholder } from "@/components/AdPlaceholder";
import { EXTERNAL_LINK_DISCLOSURE } from "@/lib/disclosure";
import { formatCoursePrice } from "@/lib/formatPrice";
import { courses } from "@/lib/catalog-adapter";
import { trackOutboundCourseClick } from "@/lib/outbound-tracking";

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

  const handleChangeCourses = () => {
    const lastSkill = window.localStorage.getItem(LAST_SKILL_KEY);
    router.push(lastSkill ? `/skills/${lastSkill}` : "/");
  };

  if (!hasTwoCourses) {
    return (
      <section className="flex flex-col items-center gap-4 rounded-2xl border border-dashed border-slate-300 bg-white p-10 text-center">
        <h2 className="text-2xl font-semibold text-slate-900">
          Select courses to compare
        </h2>
        <p className="text-slate-600">
          Return to the list and select courses to compare.
        </p>
        <button
          type="button"
          onClick={handleChangeCourses}
          className="rounded-lg bg-blue-600 px-5 py-2 text-sm font-semibold text-white hover:bg-blue-500"
        >
          Back to course selection
        </button>
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
        <div className="grid grid-cols-3 gap-4 border-b border-slate-200 bg-slate-50 px-6 py-4 text-sm font-semibold text-slate-700">
          <span>Detail</span>
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
              onClick={() => trackOutboundCourseClick(leftCourse, "compare")}
              className="w-fit rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
            >
              View course on {leftCourse.platform}
            </a>
            <span className="text-xs font-normal text-slate-500">
              Opens on an external page.
            </span>
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
              onClick={() => trackOutboundCourseClick(rightCourse, "compare")}
              className="w-fit rounded-lg bg-blue-600 px-4 py-2 text-sm font-semibold text-white hover:bg-blue-500"
            >
              View course on {rightCourse.platform}
            </a>
            <span className="text-xs font-normal text-slate-500">
              Opens on an external page.
            </span>
          </span>
        </div>
        <div className="divide-y divide-slate-200">
          {rawRows.map((row) => {
            const differs = row.left !== row.right;
            return (
              <div
                key={row.label}
                className={`grid grid-cols-3 gap-4 px-6 py-4 text-sm text-slate-600 ${
                  differs ? "bg-blue-50/50" : "bg-white"
                }`}
              >
                <span className="font-semibold text-slate-700">{row.label}</span>
                <span>{row.left}</span>
                <span>{row.right}</span>
              </div>
            );
          })}
        </div>
      </div>

      <AdPlaceholder />
      <p className="text-xs text-slate-500">{EXTERNAL_LINK_DISCLOSURE}</p>

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
