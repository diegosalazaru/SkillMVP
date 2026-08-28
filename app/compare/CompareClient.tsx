"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo } from "react";
import { AdPlaceholder } from "@/components/AdPlaceholder";
import {
  buildComparisonRows,
  formatPricingOption,
  getActionablePricingOptions,
  getCourseSnapshot,
  getDecisionSummary,
  getPendingDataRisks,
  isDurationPending,
  isExactPricePending
} from "@/lib/decision-support";
import { courses } from "@/lib/catalog-adapter";
import { trackOutboundCourseClick } from "@/lib/outbound-tracking";
import {
  EXTERNAL_PROVIDER_CONTEXT
} from "@/lib/providerCta";
import type { Course } from "@/types/course";

const LAST_SKILL_KEY = "skills-compare-last-skill";

const statusClasses = {
  Same: "bg-emerald-50 text-emerald-700 ring-emerald-100",
  Different: "bg-blue-50 text-blue-700 ring-blue-100",
  "Insufficient data": "bg-amber-50 text-amber-800 ring-amber-100"
};

const decisionChecklist = [
  "I confirmed the final checkout amount and any subscription or renewal terms that apply.",
  "I checked certificate terms.",
  "I confirmed duration fits my weekly schedule.",
  "I reviewed prerequisites and learning topics.",
  "I compared at least two options."
];

const pricingModelLabels = {
  one_time: "One-time",
  subscription: "Program subscription",
  platform_subscription: "Platform subscription",
  free_audit: "Free / audit"
};

const PricingCommitmentCard = ({ course }: { course: Course }) => {
  const pricingOptions = getActionablePricingOptions(course);

  return (
    <article className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-6">
      <h3 className="break-words text-lg font-semibold text-slate-950">{course.title}</h3>
      {pricingOptions.length > 0 ? (
        <div className="mt-4 space-y-4">
          {pricingOptions.map((option, index) => (
            <div
              key={option.id}
              className="rounded-xl border border-blue-100 bg-blue-50/60 p-4"
            >
              <div className="flex flex-wrap gap-2 text-xs font-semibold">
                <span className="rounded-full bg-blue-100 px-2.5 py-1 text-blue-800">
                  {pricingModelLabels[option.model]}
                </span>
                <span className="rounded-full bg-white px-2.5 py-1 text-slate-600 ring-1 ring-slate-200">
                  {index === 0 ? "First displayed path" : "Verified alternative"}
                </span>
              </div>
              <p className="mt-3 text-base font-semibold leading-relaxed text-slate-950">
                {formatPricingOption(option)}
              </p>
              <dl className="mt-3 grid gap-2 text-xs leading-relaxed text-slate-600 sm:grid-cols-2">
                <div>
                  <dt className="font-semibold text-slate-800">Source amount</dt>
                  <dd>
                    {option.amount} {option.currency}
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-800">USD basis</dt>
                  <dd>
                    {option.normalizationBasis === "provider_published_usd"
                      ? "Provider-published USD"
                      : "Dated currency conversion"}
                  </dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-800">Observed</dt>
                  <dd>{option.observedAt}</dd>
                </div>
                <div>
                  <dt className="font-semibold text-slate-800">Market context</dt>
                  <dd>{option.referenceMarket ?? "No stated market restriction"}</dd>
                </div>
              </dl>
              {option.conditions ? (
                <p className="mt-3 text-xs leading-relaxed text-slate-600">
                  {option.conditions}
                </p>
              ) : null}
              <a
                href={option.actionUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() =>
                  trackOutboundCourseClick(course, EXTERNAL_PROVIDER_CONTEXT.compare)
                }
                aria-label={`Open ${option.scope} pricing option for ${course.title}`}
                className="mt-4 inline-flex min-h-11 items-center rounded-lg bg-blue-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-blue-600"
              >
                Open this pricing option
              </a>
              <p className="mt-3 text-xs text-slate-500">
                Evidence: {option.evidenceUrls.map((url, evidenceIndex) => (
                  <span key={url}>
                    {evidenceIndex > 0 ? ", " : ""}
                    <a
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-semibold text-blue-700 underline decoration-blue-300 underline-offset-2"
                    >
                      official source {evidenceIndex + 1}
                    </a>
                  </span>
                ))}
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-4 rounded-xl border border-amber-200 bg-amber-50 p-4 text-sm text-amber-900">
          Actionable source-backed pricing is not yet available for this course.
        </p>
      )}
    </article>
  );
};

const CourseSnapshotCard = ({ course }: { course: Course }) => {
  const snapshot = getCourseSnapshot(course);

  return (
    <article className="min-w-0 rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_18px_45px_-36px_rgba(15,23,42,0.45)] sm:p-6">
      <div className="flex min-w-0 flex-col gap-3 border-b border-slate-100 pb-5">
        <h3 className="break-words text-xl font-semibold tracking-tight text-slate-950">
          {course.title}
        </h3>
        <div className="flex flex-wrap gap-2 text-xs font-semibold">
          <span className="rounded-full bg-blue-50 px-3 py-1.5 text-blue-700">
            {snapshot.offeringType}
          </span>
        </div>
        <div className="rounded-xl bg-slate-950 px-4 py-3 text-white">
          <p className="text-[0.7rem] font-bold uppercase tracking-[0.16em] text-blue-300">
            Price status
          </p>
          <ul className="mt-2 space-y-1 text-sm font-semibold leading-relaxed">
            {snapshot.pricing.map((pricingPath) => (
              <li key={pricingPath}>{pricingPath}</li>
            ))}
          </ul>
        </div>
      </div>

      <dl className="mt-5 grid gap-4 text-sm sm:grid-cols-2">
        <div>
          <dt className="font-semibold text-slate-900">Workload</dt>
          <dd className="mt-1 leading-relaxed text-slate-600">{snapshot.workload}</dd>
        </div>
        <div>
          <dt className="font-semibold text-slate-900">Credential</dt>
          <dd className="mt-1 leading-relaxed text-slate-600">{snapshot.credential}</dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="font-semibold text-slate-900">Starting point</dt>
          <dd className="mt-1 leading-relaxed text-slate-600">{snapshot.startingPoint}</dd>
        </div>
        <div>
          <dt className="font-semibold text-slate-900">Learning focus</dt>
          <dd className="mt-1 leading-relaxed text-slate-600">{snapshot.learningFocus}</dd>
        </div>
        <div>
          <dt className="font-semibold text-slate-900">Practical signal</dt>
          <dd className="mt-1 leading-relaxed text-slate-600">{snapshot.practicalSignal}</dd>
        </div>
        <div className="sm:col-span-2">
          <dt className="font-semibold text-slate-900">Important prerequisites</dt>
          <dd className="mt-1 leading-relaxed text-slate-600">
            {snapshot.prerequisiteSignal}
          </dd>
        </div>
      </dl>

      <p className="mt-5 rounded-xl border border-emerald-100 bg-emerald-50 px-4 py-3 text-sm font-medium leading-relaxed text-emerald-950">
        {snapshot.fitSummary}
      </p>
    </article>
  );
};

const CourseDecisionDetails = ({ course }: { course: Course }) => (
  <article className="min-w-0 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-[0_14px_36px_-30px_rgba(15,23,42,0.4)] sm:p-6">
    <h3 className="break-words text-xl font-semibold tracking-tight text-slate-950">
      {course.title}
    </h3>

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
        <h4 className="text-sm font-semibold text-slate-900">Starting point</h4>
        {course.prerequisitesBullets.length > 0 ? (
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-600">
            {course.prerequisitesBullets.slice(0, 4).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-slate-600">
            Starting-point requirements are not verified in the current catalog.
          </p>
        )}
      </div>
      <div>
        <h4 className="text-sm font-semibold text-slate-900">Tools / technologies</h4>
        {(course.toolsTechnologies?.length ?? 0) > 0 ? (
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-600">
            {course.toolsTechnologies?.slice(0, 5).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-slate-600">
            Named tools are not verified in the current catalog.
          </p>
        )}
      </div>
      <div>
        <h4 className="text-sm font-semibold text-slate-900">Practical work</h4>
        {(course.practicalWorkBullets?.length ?? 0) > 0 ? (
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-600">
            {course.practicalWorkBullets?.slice(0, 4).map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-sm text-slate-600">
            Projects, labs, or hands-on work are not verified in the current catalog.
          </p>
        )}
      </div>
    </div>

    <div className="mt-5">
      <Link
        href={`/courses/${course.id}`}
        className="inline-flex min-h-11 items-center rounded-lg border border-slate-200 px-4 py-2 text-center text-sm font-semibold text-slate-700 hover:border-slate-300"
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
        <h1 className="text-2xl font-semibold text-slate-900">
          Select exactly 2 courses to compare
        </h1>
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

  const decisionSummary = getDecisionSummary(leftCourse, rightCourse);
  const comparisonRows = buildComparisonRows(leftCourse, rightCourse);
  const pendingRisks = getPendingDataRisks([leftCourse, rightCourse]);

  return (
    <section className="flex min-w-0 flex-col gap-8 pb-8 sm:gap-10">
      <header className="flex flex-col gap-4">
        <p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-700">
          Course comparison
        </p>
        <h1 className="max-w-5xl break-words text-3xl font-semibold leading-tight tracking-[-0.03em] text-slate-950 sm:text-4xl lg:text-5xl">
          {leftCourse.title} vs {rightCourse.title}
        </h1>
        <p className="max-w-3xl text-base leading-relaxed text-slate-600 sm:text-lg">
          Compare current payment commitments, practical differences, and uncertainty before using provider checkout for final confirmation.
        </p>
      </header>

      <section className="rounded-[1.75rem] border border-slate-800 bg-slate-950 p-5 shadow-[0_28px_70px_-42px_rgba(15,23,42,0.65)] sm:p-8">
        <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between md:gap-8">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-300">
              Decision summary
            </p>
            <h2 className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl">
              What changes your decision?
            </h2>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-slate-300">
            This summary is deterministic. It highlights factual fit signals and uncertainty; it does not rank courses.
          </p>
        </div>

        <div className="mt-6 grid gap-3 sm:mt-8 sm:gap-4 lg:grid-cols-[1.45fr_0.8fr]">
          <div className="rounded-2xl border border-blue-400/30 bg-blue-400/[0.11] p-4 sm:p-6 lg:row-span-2">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-300">
              Highest-value differences
            </p>
            <ul className="mt-4 list-disc space-y-3 pl-5 text-base leading-relaxed text-white marker:text-blue-300">
              {decisionSummary.differences.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4 sm:p-5">
            <h3 className="font-semibold text-white">What remains uncertain</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-300 marker:text-amber-300">
              {decisionSummary.uncertainty.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
          <div className="rounded-2xl border border-white/10 bg-white/[0.05] p-4 sm:p-5">
            <h3 className="font-semibold text-white">Shared context</h3>
            <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-slate-400 marker:text-slate-500">
              {decisionSummary.similarities.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section aria-labelledby="course-snapshot-heading">
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-700">
            At a glance
          </p>
          <h2
            id="course-snapshot-heading"
            className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl"
          >
            Course snapshot
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Start with the verified facts most likely to shape the choice, then inspect the evidence and detailed criteria below.
          </p>
        </div>
        <div className="mt-5 grid min-w-0 gap-4 lg:grid-cols-2">
          <CourseSnapshotCard course={leftCourse} />
          <CourseSnapshotCard course={rightCourse} />
        </div>
      </section>

      <section className="rounded-[1.75rem] border border-blue-200 bg-gradient-to-br from-blue-50 to-white p-5 sm:p-7">
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-700">
            Pricing commitments
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
            Current verified pricing
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            All comparable commitments are shown in USD. Course or program paths appear before broader platform-subscription alternatives when both are verified; trials may change the amount due at checkout today.
          </p>
        </div>
        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          <PricingCommitmentCard course={leftCourse} />
          <PricingCommitmentCard course={rightCourse} />
        </div>
      </section>

      <section className="overflow-hidden rounded-2xl border border-slate-200/80 bg-white shadow-[0_18px_45px_-36px_rgba(15,23,42,0.45)]">
        <div className="border-b border-slate-200 bg-slate-50/80 px-5 py-5 sm:px-6">
          <h2 className="text-xl font-semibold tracking-tight text-slate-950">Criteria that matter</h2>
          <p className="mt-1 text-sm text-slate-600">
            Each row includes a status and interpretation so you do not have to infer the tradeoff from raw facts alone.
          </p>
        </div>
        <div className="divide-y divide-slate-200">
          {comparisonRows.map((row) => (
            <div key={row.label} className="grid min-w-0 gap-4 px-5 py-6 sm:px-6 lg:grid-cols-[0.7fr_1fr_1fr_1.1fr]">
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

      <section aria-labelledby="course-content-heading">
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-700">
            Detailed course content
          </p>
          <h2
            id="course-content-heading"
            className="mt-2 text-2xl font-semibold tracking-tight text-slate-950"
          >
            Inspect what each course covers
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Review curriculum, starting-point detail, named tools, and practical work after the decision-level comparison.
          </p>
        </div>
        <div className="mt-5 grid gap-4 lg:grid-cols-2">
          <CourseDecisionDetails course={leftCourse} />
          <CourseDecisionDetails course={rightCourse} />
        </div>
      </section>

      <section className="rounded-[1.75rem] border border-slate-200 bg-white p-5 shadow-[0_18px_45px_-36px_rgba(15,23,42,0.45)] sm:p-7">
        <div className="max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.18em] text-blue-700">
            Final verification
          </p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950">
            Verify current terms, then act
          </h2>
          <p className="mt-2 text-sm leading-relaxed text-slate-600">
            Provider pages are the final source for checkout totals, taxes, eligibility, regional terms, and availability.
          </p>
        </div>

        <div className="mt-5 rounded-2xl border border-amber-200 bg-amber-50 p-4 sm:p-5">
          <h3 className="text-lg font-semibold text-amber-950">Data to verify before enrolling</h3>
          <ul className="mt-3 list-disc space-y-2 pl-5 text-sm leading-relaxed text-amber-900">
            {pendingRisks.map((risk) => (
              <li key={risk}>{risk}</li>
            ))}
          </ul>
        </div>

        <div className="mt-5 rounded-2xl border border-slate-200 bg-slate-50/70 p-4 sm:p-5">
          <h3 className="text-lg font-semibold text-slate-900">Before you choose</h3>
          <div className="mt-4 grid gap-3 md:grid-cols-2">
            {decisionChecklist.map((item) => (
              <div key={item} className="flex gap-3 rounded-xl border border-slate-100 bg-white p-3.5 text-sm text-slate-700">
                <span aria-hidden="true" className="mt-0.5 h-5 w-5 shrink-0 rounded-md border border-slate-300 bg-white" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-5 grid gap-3 sm:flex sm:flex-wrap">
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

      <AdPlaceholder />

    </section>
  );
}
