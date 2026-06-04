import type { Metadata } from "next";
import { getCoursesForSkill, getSkillSummary } from "@/lib/skill-catalog";
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
    return buildPageMetadata({
      title: "Skill not found | Skills Compare",
      description:
        "Review real alternatives in the Skills Compare catalog to compare online courses.",
      path: `/skills/${params.skillSlug}`
    });
  }

  const courseCount = getCoursesForSkill(skill.slug).length;

  return buildPageMetadata({
    title: `Compare ${skill.title} courses online | Skills Compare`,
    description: `Compare ${courseCount} ${skill.title} courses by platform, price, duration, and level before choosing.`,
    path: `/skills/${skill.slug}`
  });
};

export default function SkillPage({ params }: SkillPageProps) {
  return <SkillClient skillSlug={params.skillSlug} />;
}
