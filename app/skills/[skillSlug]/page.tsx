import type { Metadata } from "next";
import { getCoursesForSkill, getSkillSummary } from "@/lib/skill-catalog";
import SkillClient from "./SkillClient";

type SkillPageProps = {
  params: {
    skillSlug: string;
  };
};

export const generateMetadata = ({ params }: SkillPageProps): Metadata => {
  const skill = getSkillSummary(params.skillSlug);

  if (!skill) {
    return {
      title: "Skill not found | Skills Compare",
      description:
        "Review real alternatives in the Skills Compare catalog to compare online courses."
    };
  }

  const courseCount = getCoursesForSkill(skill.slug).length;

  return {
    title: `Compare ${skill.title} courses online | Skills Compare`,
    description: `Compare ${courseCount} ${skill.title} courses by platform, price, duration, and level before choosing.`
  };
};

export default function SkillPage({ params }: SkillPageProps) {
  return <SkillClient skillSlug={params.skillSlug} />;
}
