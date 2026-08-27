import Link from "next/link";
import type { DecisionReadyPair } from "@/lib/decision-ready-comparisons";

type DecisionReadyPairCardProps = {
  pair: DecisionReadyPair;
};

const CourseIdentity = ({
  course
}: {
  course: DecisionReadyPair["left"];
}) => (
  <article className="min-w-0 rounded-xl border border-slate-200 bg-slate-50/80 p-4">
    <p className="text-xs font-bold uppercase tracking-[0.16em] text-blue-700">
      {course.platform}
    </p>
    <h3 className="mt-2 break-words text-base font-semibold leading-snug text-slate-950 sm:text-lg">
      <Link href={course.detailHref} className="transition hover:text-blue-700">
        {course.title}
      </Link>
    </h3>
  </article>
);

export const DecisionReadyPairCard = ({ pair }: DecisionReadyPairCardProps) => (
  <article className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_18px_45px_-36px_rgba(15,23,42,0.45)] sm:p-6">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-emerald-800">
        Comparison-ready data
      </span>
      <span className="text-xs font-medium text-slate-500">
        Source-backed pair
      </span>
    </div>

    <div className="mt-4 grid min-w-0 gap-2 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] sm:items-stretch">
      <CourseIdentity course={pair.left} />
      <span className="flex items-center justify-center px-1 text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
        vs
      </span>
      <CourseIdentity course={pair.right} />
    </div>

    <div className="mt-5 grid gap-5 lg:grid-cols-[1.35fr_0.65fr]">
      <div>
        <h4 className="text-sm font-semibold text-slate-950">
          Material differences to inspect
        </h4>
        <dl className="mt-3 space-y-3">
          {pair.differences.map((row) => (
            <div key={row.label} className="rounded-xl border border-slate-100 bg-slate-50/70 p-3">
              <dt className="text-xs font-bold uppercase tracking-[0.12em] text-slate-500">
                {row.label}
              </dt>
              <dd className="mt-2 grid min-w-0 gap-2 text-sm leading-relaxed text-slate-700 sm:grid-cols-2">
                <span className="break-words">
                  <strong className="text-slate-950">{pair.left.title}:</strong>{" "}
                  {row.left}
                </span>
                <span className="break-words">
                  <strong className="text-slate-950">{pair.right.title}:</strong>{" "}
                  {row.right}
                </span>
              </dd>
            </div>
          ))}
        </dl>
      </div>

      <div>
        <h4 className="text-sm font-semibold text-slate-950">
          What remains uncertain
        </h4>
        {pair.uncertainties.length > 0 ? (
          <ul className="mt-3 space-y-2 text-sm leading-relaxed text-amber-950">
            {pair.uncertainties.map((row) => (
              <li key={row.label} className="rounded-xl border border-amber-200 bg-amber-50 px-3 py-2.5">
                <span className="font-semibold">{row.label}:</span>{" "}
                {row.interpretation}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-sm leading-relaxed text-slate-600">
            The displayed decision criteria are source-backed for both courses. Final provider terms can still change.
          </p>
        )}
        <p className="mt-3 text-xs leading-relaxed text-slate-500">
          Verify checkout totals, taxes, eligibility, regional terms, and current availability on the provider pages before enrolling.
        </p>
      </div>
    </div>

    <div className="mt-5 grid gap-2 border-t border-slate-200 pt-4 sm:flex sm:flex-wrap">
      <Link
        href={pair.compareHref}
        className="inline-flex min-h-12 items-center justify-center rounded-xl bg-blue-700 px-5 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-blue-600"
      >
        Open detailed comparison
      </Link>
      <Link
        href={pair.left.detailHref}
        className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-300 px-4 py-2.5 text-center text-sm font-semibold text-slate-700 transition hover:border-slate-400"
      >
        View {pair.left.platform} course details
      </Link>
      <Link
        href={pair.right.detailHref}
        className="inline-flex min-h-11 items-center justify-center rounded-xl border border-slate-300 px-4 py-2.5 text-center text-sm font-semibold text-slate-700 transition hover:border-slate-400"
      >
        View {pair.right.platform} course details
      </Link>
    </div>
  </article>
);
