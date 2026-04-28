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
      title: "Skill no encontrada | Skills Compare",
      description:
        "Revisa alternativas reales del catalogo de Skills Compare para comparar cursos online."
    };
  }

  const courseCount = getCoursesForSkill(skill.slug).length;

  return {
    title: `Cursos de ${skill.title} | Skills Compare`,
    description: `Compara ${courseCount} cursos de ${skill.title} por plataforma, precio, duracion y nivel antes de elegir.`
  };
};

export default function SkillPage({ params }: SkillPageProps) {
  return <SkillClient skillSlug={params.skillSlug} />;
}
