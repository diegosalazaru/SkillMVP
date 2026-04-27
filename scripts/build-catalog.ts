import { existsSync, readFileSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

import { CourseSchema } from "../src/lib/schema/course";

const normalizedDir = resolve(process.cwd(), "data", "normalized");
const courseraPath = resolve(normalizedDir, "coursera.json");
const edxPath = resolve(normalizedDir, "courses.json");
const outputPath = resolve(normalizedDir, "courses.json");

const readCourses = (path: string) => {
  if (!existsSync(path)) {
    return [];
  }

  const contents = readFileSync(path, "utf-8");
  return JSON.parse(contents) as unknown;
};

const run = () => {
  const courseraResult = CourseSchema.array().safeParse(readCourses(courseraPath));
  if (!courseraResult.success) {
    console.error("[build:catalog] Invalid coursera normalized data.");
    console.error(courseraResult.error.format());
    process.exit(1);
  }

  const edxRaw = readCourses(edxPath);
  const edxResult = CourseSchema.array().safeParse(edxRaw);
  const edxCourses = edxResult.success ? edxResult.data : [];

  const byId = new Map<string, (typeof courseraResult.data)[number]>();
  for (const course of [...edxCourses, ...courseraResult.data]) {
    byId.set(course.id, course);
  }

  const merged = [...byId.values()];
  const mergedResult = CourseSchema.array().safeParse(merged);
  if (!mergedResult.success) {
    console.error("[build:catalog] Merged catalog validation failed.");
    console.error(mergedResult.error.format());
    process.exit(1);
  }

  writeFileSync(outputPath, JSON.stringify(mergedResult.data, null, 2));
  console.log(`[build:catalog] Wrote ${mergedResult.data.length} courses to ${outputPath}`);
};

try {
  run();
} catch (error) {
  console.error("[build:catalog] Unexpected error.");
  console.error(error);
  process.exit(1);
}
