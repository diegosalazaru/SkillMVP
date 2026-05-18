import { SeoPageTypeConfig, SeoSkillConfig } from "@/lib/seo/seoTypes";

export const SEO_SKILLS: SeoSkillConfig[] = [
  { slug: "artificial-intelligence", label: "Artificial Intelligence" },
  { slug: "data-analytics", label: "Data Analytics" },
  { slug: "cybersecurity", label: "Cybersecurity" },
  { slug: "cloud-computing", label: "Cloud Computing" },
  { slug: "project-management", label: "Project Management" }
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
