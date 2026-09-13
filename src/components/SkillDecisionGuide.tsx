import { DecisionReadyPairCard } from "@/components/DecisionReadyPairCard";
import type { DecisionReadyPair } from "@/lib/decision-ready-comparisons";

type SkillDecisionGuideProps = {
  pairs: DecisionReadyPair[];
  skillTitle: string;
};

export const SkillDecisionGuide = ({
  pairs,
  skillTitle
}: SkillDecisionGuideProps) => {
  if (pairs.length === 0) {
    return null;
  }

  return (
    <section
      aria-labelledby="skill-decision-guide-heading"
      className="rounded-[1.75rem] border border-slate-800 bg-slate-950 p-4 shadow-[0_28px_70px_-42px_rgba(15,23,42,0.65)] sm:p-6"
    >
      <div className="max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-300">
          {skillTitle} decision guide
        </p>
        <h2
          id="skill-decision-guide-heading"
          className="mt-2 text-2xl font-semibold tracking-tight text-white"
        >
          Comparison-ready course pairs
        </h2>
        <p className="mt-1.5 text-sm leading-relaxed text-slate-300">
          Source-backed entry points, not rankings. Open Compare for full evidence and known data gaps.
        </p>
      </div>

      <div className="mt-4 grid gap-3 lg:grid-cols-2 xl:grid-cols-3">
        {pairs.map((pair) => (
          <DecisionReadyPairCard key={pair.key} pair={pair} />
        ))}
      </div>
    </section>
  );
};
