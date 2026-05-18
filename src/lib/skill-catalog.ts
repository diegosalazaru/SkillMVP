import { courses } from "@/lib/catalog-adapter";
import type { Course } from "@/types/course";
import { slugify, titleFromSlug } from "@/utils/slugify";

export type SkillSummary = {
  slug: string;
  title: string;
  courseCount: number;
};

export const getSkillSummaries = (): SkillSummary[] => {
  const counts = new Map<string, number>();

  courses.forEach((course) => {
    course.skillTags.forEach((tag) => {
      const slug = slugify(tag);
      counts.set(slug, (counts.get(slug) ?? 0) + 1);
    });
  });

  return Array.from(counts.entries())
    .sort(([left], [right]) => left.localeCompare(right))
    .map(([slug, courseCount]) => ({
      slug,
      title: titleFromSlug(slug),
      courseCount
    }));
};

export const getCoursesForSkill = (skillSlug: string): Course[] =>
  courses.filter((course) =>
    course.skillTags.some((tag) => slugify(tag) === skillSlug)
  );

export const getSkillSummary = (skillSlug: string): SkillSummary | null =>
  getSkillSummaries().find((skill) => skill.slug === skillSlug) ?? null;

export const getSkillAlternatives = (limit = 4): SkillSummary[] =>
  getSkillSummaries().slice(0, limit);

export const getSkillIntro = (skill: SkillSummary) =>
  `Compare ${skill.courseCount} ${skill.title} courses available in the catalog. Review platform, price, duration, and level before opening the course on its original platform.`;
