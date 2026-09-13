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
  <div className="min-w-0 rounded-lg border border-slate-200 bg-slate-50/80 px-2.5 py-2.5">
    <p className="text-[0.65rem] font-bold uppercase tracking-[0.12em] text-blue-700">
      {course.platform}
    </p>
    <p className="mt-1 break-words text-xs font-semibold leading-snug text-slate-950 sm:text-sm">
      {course.title}
    </p>
  </div>
);

export const DecisionReadyPairCard = ({ pair }: DecisionReadyPairCardProps) => (
  <article
    data-decision-ready-pair
    className="flex min-w-0 flex-col rounded-2xl border border-slate-200 bg-white p-4 shadow-[0_18px_45px_-36px_rgba(15,23,42,0.45)]"
  >
    <h3 className="sr-only">
      {pair.left.title} versus {pair.right.title}
    </h3>

    <div>
      <span className="rounded-full border border-emerald-200 bg-emerald-50 px-3 py-1 text-xs font-bold uppercase tracking-[0.12em] text-emerald-800">
        Comparison-ready
      </span>
    </div>

    <div className="mt-3 grid min-w-0 grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-stretch gap-1.5">
      <CourseIdentity course={pair.left} />
      <span className="flex items-center justify-center px-1 text-xs font-bold uppercase tracking-[0.16em] text-slate-400">
        vs
      </span>
      <CourseIdentity course={pair.right} />
    </div>

    <div className="mt-3 space-y-1 text-xs leading-relaxed text-slate-600">
      {pair.differencePreview ? (
        <p>
          <span className="font-semibold text-slate-900">Factual preview:</span>{" "}
          {pair.differencePreview} differs.
        </p>
      ) : null}
      {pair.uncertaintyLabels.length > 0 ? (
        <p>
          <span className="font-semibold text-slate-900">Known data gaps:</span>{" "}
          {pair.uncertaintyLabels.join(", ")}.
        </p>
      ) : (
        <p>
          <span className="font-semibold text-slate-900">Uncertainty:</span>{" "}
          Current provider terms can still change.
        </p>
      )}
    </div>

    <div className="mt-auto pt-3">
      <Link
        href={pair.compareHref}
        aria-label={`Open comparison: ${pair.left.title} versus ${pair.right.title}`}
        className="inline-flex min-h-11 w-full items-center justify-center rounded-xl bg-blue-700 px-4 py-2.5 text-center text-sm font-semibold text-white transition hover:bg-blue-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-700"
      >
        Open comparison
      </Link>
    </div>
  </article>
);
