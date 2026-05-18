import fs from "node:fs";
import path from "node:path";
import { SEO_GENERATION_RULES, SEO_PAGE_TYPES, SEO_SKILLS } from "../src/config/seoConfig";
import { courses } from "../src/lib/catalog-adapter";
import { generateFAQ, generateH1, generateIntro, generateMeta } from "../src/lib/seo/contentTemplates";
import { GeneratedSeoPage } from "../src/lib/seo/seoTypes";
import { slugify } from "../src/utils/slugify";

const outputDir = path.join(process.cwd(), "src", "data", "generated");
const outputPath = path.join(outputDir, "seoPages.json");

const normalizedSkillsByCourse = courses.map((course) => ({
  ...course,
  normalizedSkillSlugs: course.skillTags.map((tag) => slugify(tag))
}));

const bySkill = new Map<string, string[]>();

for (const skill of SEO_SKILLS) {
  const allowedSlugs = new Set([
    ...skill.sourceSkillSlugs.map((item) => slugify(item)),
    ...(skill.sourceSkillAliases ?? []).map((item) => slugify(item))
  ]);

  const ids = normalizedSkillsByCourse
    .filter((course) => course.normalizedSkillSlugs.some((tagSlug) => allowedSlugs.has(tagSlug)))
    .slice(0, SEO_GENERATION_RULES.maxCoursesPerPage)
    .map((course) => course.id);

  bySkill.set(skill.slug, ids);
}

const pages: GeneratedSeoPage[] = [];
let skipped = 0;

for (const skill of SEO_SKILLS) {
  const courseIds = bySkill.get(skill.slug) ?? [];

  for (const pageType of SEO_PAGE_TYPES) {
    const slug = pageType.pathPattern.replace("[skill]", skill.slug);

    if (courseIds.length < SEO_GENERATION_RULES.minCoursesPerPage) {
      skipped += 1;
      console.warn(
        `[seo] Skipped ${slug}: needs at least ${SEO_GENERATION_RULES.minCoursesPerPage} matching courses, found ${courseIds.length}.`
      );
      continue;
    }

    const meta = generateMeta({ skillLabel: skill.label, pageType, courseCount: courseIds.length });

    pages.push({
      slug,
      skillSlug: skill.slug,
      skillLabel: skill.label,
      pageType: pageType.key,
      intent: pageType.intent,
      title: meta.title,
      metaDescription: meta.metaDescription,
      h1: generateH1({ skillLabel: skill.label, pageType }),
      intro: generateIntro({ skillLabel: skill.label, pageType, courseCount: courseIds.length }),
      faq: generateFAQ({ skillLabel: skill.label }),
      courseIds
    });
  }
}

pages.sort((a, b) => a.slug.localeCompare(b.slug));
fs.mkdirSync(outputDir, { recursive: true });
fs.writeFileSync(outputPath, `${JSON.stringify(pages, null, 2)}\n`, "utf8");

console.log(`[seo] Generated ${pages.length} pages.`);
console.log(`[seo] Skipped ${skipped} pages.`);
console.log(`[seo] Wrote ${outputPath}`);
