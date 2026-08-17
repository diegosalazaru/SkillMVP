import { courses } from "@/lib/catalog-adapter";
import { slugify, titleFromSlug } from "@/utils/slugify";

const SKILL_ALIASES: Record<string, string> = {
  ai: "ai",
  "artificial-intelligence": "ai",
  "artificial-intelligence-courses": "ai",
  "gen-ai": "ai",
  "generative-ai": "ai",
  "prompt-engineering": "ai",
  ia: "ai",
  llm: "ai",
  llms: "ai",
  data: "data-analysis",
  "data-analysis": "data-analysis",
  "data-analytics": "data-analysis",
  "data-analyst": "data-analysis",
  analytics: "data-analysis",
  "business-analytics": "data-analysis",
  ml: "machine-learning",
  "machine-learning": "machine-learning",
  project: "project-management",
  pm: "project-management",
  "project-management": "project-management",
  cyber: "cybersecurity",
  cybersecurity: "cybersecurity",
  security: "cybersecurity",
  cloud: "cloud-computing",
  "cloud-computing": "cloud-computing",
  aws: "cloud-computing",
  azure: "cloud-computing",
  "google-cloud": "cloud-computing",
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

const normalizeSearchValue = (value: string) => slugify(stripRoutePrefix(value.trim()));

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
  const normalized = normalizeSearchValue(value);

  if (!normalized) {
    return null;
  }

  const validSlugs = new Set(getSkillOptions().map((skill) => skill.slug));
  const candidate = SKILL_ALIASES[normalized] ?? normalized;

  if (validSlugs.has(candidate)) {
    return candidate;
  }

  const partialMatch = getSkillOptions().find((option) => {
    const titleSlug = slugify(option.title);
    return option.slug.includes(normalized) || titleSlug.includes(normalized);
  });

  return partialMatch?.slug ?? null;
};

export const getSkillSuggestions = (limit = 4): SkillOption[] =>
  getSkillOptions().slice(0, limit);

export const searchSkillOptions = (query: string, limit = 5): SkillOption[] => {
  const normalizedQuery = normalizeSearchValue(query);
  if (!normalizedQuery) {
    return [];
  }

  const options = getSkillOptions();
  const resolvedSlug = resolveSkillSlug(query);
  const matches = options.filter((option) => {
    const titleSlug = slugify(option.title);
    const aliasMatchesOption = Object.entries(SKILL_ALIASES).some(
      ([alias, slug]) => slug === option.slug && alias.includes(normalizedQuery)
    );

    return (
      option.slug === resolvedSlug ||
      option.slug.includes(normalizedQuery) ||
      titleSlug.includes(normalizedQuery) ||
      aliasMatchesOption
    );
  });

  return matches.slice(0, limit);
};
