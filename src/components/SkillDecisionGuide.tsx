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
      className="rounded-[1.75rem] border border-slate-800 bg-slate-950 p-4 shadow-[0_28px_70px_-42px_rgba(15,23,42,0.65)] sm:p-7 lg:p-8"
    >
      <div className="max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.2em] text-blue-300">
          {skillTitle} decision guide
        </p>
        <h2
          id="skill-decision-guide-heading"
          className="mt-2 text-2xl font-semibold tracking-tight text-white sm:text-3xl"
        >
          Start with comparison-ready course pairs
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-slate-300 sm:text-base">
          These are source-backed comparison entry points, not rankings. Review the most decision-relevant differences here, then open Compare for the full evidence and final verification checklist.
        </p>
      </div>

      <div className="mt-6 grid gap-4">
        {pairs.map((pair) => (
          <DecisionReadyPairCard key={pair.key} pair={pair} />
        ))}
      </div>
    </section>
  );
};
