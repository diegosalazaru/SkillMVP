import { courses } from "@/lib/catalog-adapter";
import { slugify, titleFromSlug } from "@/utils/slugify";

const SKILL_ALIASES: Record<string, string> = {
  ai: "ai",
  "artificial-intelligence": "ai",
  "artificial-inteligence": "ai",
  "inteligencia-artificial": "ai",
  ia: "ai",
  llm: "ai",
  llms: "ai",
  ml: "ai",
  "machine-learning": "ai",
  "machine-learning-ai": "ai",
  "ai-fundamentals": "ai",
  "prompt-engineering": "ai",
  analytics: "data-analysis",
  "data-analytics": "data-analysis",
  "data-analyst": "data-analysis",
  "analisis-de-datos": "data-analysis",
  "data-science": "data-science",
  "ciencia-de-datos": "data-science",
  frontend: "frontend",
  "front-end": "frontend",
  "web-development": "frontend",
  react: "frontend"
};

export type SkillOption = {
  slug: string;
  title: string;
  courseCount: number;
};

const stripRoutePrefix = (value: string) =>
  value.replace(/^\/?skills\/?/, "").replace(/^skills-?/, "");

export const getSkillOptions = (): SkillOption[] => {
  const counts = new Map<string, number>();

  courses.forEach((course) => {
    course.skillTags.forEach((tag) => {
      const slug = slugify(tag);
      counts.set(slug, (counts.get(slug) ?? 0) + 1);
    });
  });

  return Array.from(counts.entries())
    .sort(([leftSlug, leftCount], [rightSlug, rightCount]) =>
      rightCount === leftCount
        ? leftSlug.localeCompare(rightSlug)
        : rightCount - leftCount
    )
    .map(([slug, courseCount]) => ({
      slug,
      title: titleFromSlug(slug),
      courseCount
    }));
};

export const resolveSkillSlug = (value: string): string | null => {
  const normalized = slugify(stripRoutePrefix(value));

  if (!normalized) {
    return null;
  }

  const candidate = SKILL_ALIASES[normalized] ?? normalized;
  const validSlugs = new Set(getSkillOptions().map((skill) => skill.slug));

  return validSlugs.has(candidate) ? candidate : null;
};

export const getSkillSuggestions = (limit = 4): SkillOption[] =>
  getSkillOptions().slice(0, limit);


export const searchSkillOptions = (query: string, limit = 5): SkillOption[] => {
  const normalizedQuery = slugify(stripRoutePrefix(query));
  if (!normalizedQuery) {
    return [];
  }

  const options = getSkillOptions();
  const exactSlug = options.find((option) => option.slug === normalizedQuery);
  if (exactSlug) {
    return [exactSlug];
  }

  return options
    .filter((option) =>
      option.title.toLowerCase().includes(query.toLowerCase().trim()) ||
      option.slug.includes(query.toLowerCase().trim()) ||
      option.slug.includes(normalizedQuery)
    )
    .slice(0, limit);
};
