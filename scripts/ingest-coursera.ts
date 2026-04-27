import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

import { CourseSchema } from "../src/lib/schema/course";
import { slugify } from "../src/utils/slugify";

type CourseraRawCourse = {
  title: string;
  provider: string;
  url: string;
  skill: string;
  level: "beginner" | "intermediate" | "advanced" | "mixed" | "unknown";
  duration_hours: number | null;
  language: string;
  price_model: "free" | "paid_once" | "subscription" | "unknown";
};

const rawPath = resolve(process.cwd(), "data", "sources", "coursera-raw.json");
const outputPath = resolve(process.cwd(), "data", "normalized", "coursera.json");

const parseRaw = (): CourseraRawCourse[] => {
  const rawContents = readFileSync(rawPath, "utf-8");
  return JSON.parse(rawContents) as CourseraRawCourse[];
};

const toShortDescription = (course: CourseraRawCourse) =>
  `${course.title} by ${course.provider} on Coursera (${course.level} level).`;

const run = () => {
  const rawCourses = parseRaw();

  const normalized = rawCourses.map((course) => ({
    id: slugify(`${course.title}-${course.provider}`),
    platform: "coursera",
    title: course.title,
    url: course.url,
    skillSlug: course.skill,
    level: course.level,
    durationHours: course.duration_hours,
    language: course.language,
    priceModel: course.price_model,
    priceAmount: null,
    currency: null,
    priceInterval: course.price_model === "subscription" ? "month" : null,
    rating: null,
    reviewCount: null,
    certificate: true,
    lastUpdatedAt: null,
    shortDescription: toShortDescription(course),
    source: "coursera-curated"
  }));

  const result = CourseSchema.array().safeParse(normalized);
  if (!result.success) {
    console.error("[ingest:coursera] Course schema validation failed.");
    console.error(result.error.format());
    process.exit(1);
  }

  mkdirSync(resolve(process.cwd(), "data", "normalized"), { recursive: true });
  writeFileSync(outputPath, JSON.stringify(result.data, null, 2));
  console.log(`[ingest:coursera] Wrote ${result.data.length} courses to ${outputPath}`);
};

try {
  run();
} catch (error) {
  console.error("[ingest:coursera] Unexpected error.");
  console.error(error);
  process.exit(1);
}
