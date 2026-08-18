import type { MetadataRoute } from "next";
import { SITE_URL } from "../src/config/siteConfig";
import { courses } from "../src/lib/catalog-adapter";
import { getSkillSummaries } from "../src/lib/skill-catalog";

export default function sitemap(): MetadataRoute.Sitemap {
  const skills = getSkillSummaries();

  return [
    {
      url: `${SITE_URL}/`,
      priority: 1
    },
    ...skills.map((skill) => ({
      url: `${SITE_URL}/skills/${skill.slug}`,
      priority: 0.8
    })),
    ...courses.map((course) => ({
      url: `${SITE_URL}/courses/${course.id}`,
      priority: 0.7
    }))
  ];
}
