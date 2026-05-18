import { SeoPageTypeConfig, SeoSkillConfig } from "@/lib/seo/seoTypes";

export const SEO_SKILLS: SeoSkillConfig[] = [
  {
    slug: "artificial-intelligence",
    label: "Artificial Intelligence",
    sourceSkillSlugs: ["ai", "machine-learning", "llms", "prompt-engineering"],
    sourceSkillAliases: ["artificial-intelligence", "artificial intelligence"]
  },
  {
    slug: "data-analytics",
    label: "Data Analytics",
    sourceSkillSlugs: ["data-analysis", "analytics", "data-analytics"],
    sourceSkillAliases: ["data analytics", "analisis-de-datos"]
  },
  {
    slug: "cybersecurity",
    label: "Cybersecurity",
    sourceSkillSlugs: ["cybersecurity", "security"],
    sourceSkillAliases: ["cyber security"]
  },
  {
    slug: "cloud-computing",
    label: "Cloud Computing",
    sourceSkillSlugs: ["cloud-computing", "cloud"],
    sourceSkillAliases: ["cloud computing"]
  },
  {
    slug: "project-management",
    label: "Project Management",
    sourceSkillSlugs: ["project-management", "project-management-basics"],
    sourceSkillAliases: ["project management"]
  }
];

export const SEO_PAGE_TYPES: SeoPageTypeConfig[] = [
  { key: "best-courses", pathPattern: "best-[skill]-courses", intent: "course-discovery" },
  { key: "learn", pathPattern: "learn-[skill]", intent: "learning-plan" },
  { key: "certification", pathPattern: "[skill]-certification", intent: "credential-path" },
  { key: "for-beginners", pathPattern: "[skill]-for-beginners", intent: "beginner-path" }
];

export const SEO_GENERATION_RULES = {
  minCoursesPerPage: 1,
  maxCoursesPerPage: 6
} as const;
