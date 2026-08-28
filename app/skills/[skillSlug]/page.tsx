import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCoursesForSkill, getSkillSummary } from "@/lib/skill-catalog";
import {
  getDecisionReadyPairsForSkill,
  getDecisionReadySkillIntro
} from "@/lib/decision-ready-comparisons";
import { buildPageMetadata } from "@/lib/metadata";
import SkillClient from "./SkillClient";

type SkillPageProps = {
  params: {
    skillSlug: string;
  };
};

export const generateMetadata = ({ params }: SkillPageProps): Metadata => {
  const skill = getSkillSummary(params.skillSlug);

  if (!skill) {
    notFound();
  }

  const courseCount = getCoursesForSkill(skill.slug).length;
  const pairCount = getDecisionReadyPairsForSkill(skill.slug).length;

  if (pairCount > 0) {
    return buildPageMetadata({
      title: `${skill.title} course comparison guide | Skills Compare`,
      description: getDecisionReadySkillIntro({
        courseCount,
        pairCount,
        skillTitle: skill.title
      }),
      path: `/skills/${skill.slug}`
    });
  }

  return buildPageMetadata({
    title: `Compare ${skill.title} courses online | Skills Compare`,
    description: `Compare ${courseCount} ${skill.title} courses by platform, price, duration, and level before choosing.`,
    path: `/skills/${skill.slug}`
  });
};

export default function SkillPage({ params }: SkillPageProps) {
  const skill = getSkillSummary(params.skillSlug);
  if (!skill) {
    notFound();
  }

  const decisionReadyPairs = getDecisionReadyPairsForSkill(params.skillSlug);
  const decisionIntro =
    skill && decisionReadyPairs.length > 0
      ? getDecisionReadySkillIntro({
          courseCount: getCoursesForSkill(skill.slug).length,
          pairCount: decisionReadyPairs.length,
          skillTitle: skill.title
        })
      : undefined;

  return (
    <SkillClient
      skillSlug={params.skillSlug}
      decisionReadyPairs={decisionReadyPairs}
      decisionIntro={decisionIntro}
    />
  );
}
