import fs from "node:fs";
import path from "node:path";
import { courses } from "@/lib/catalog-adapter";
import { Course } from "@/types/course";
import { GeneratedSeoPage } from "@/lib/seo/seoTypes";

const seoPagesPath = path.join(process.cwd(), "src", "data", "generated", "seoPages.json");

export const getAllSeoPages = (): GeneratedSeoPage[] => {
  try {
    if (!fs.existsSync(seoPagesPath)) return [];
    const raw = fs.readFileSync(seoPagesPath, "utf8");
    if (!raw.trim()) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as GeneratedSeoPage[]) : [];
  } catch {
    return [];
  }
};

export const getSeoPageBySlug = (slug: string): GeneratedSeoPage | null =>
  getAllSeoPages().find((page) => page.slug === slug) ?? null;

export const getCoursesForSeoPage = (page: GeneratedSeoPage): Course[] => {
  const byId = new Map(courses.map((course) => [course.id, course]));
  return page.courseIds.map((id) => byId.get(id)).filter((course): course is Course => Boolean(course));
};
