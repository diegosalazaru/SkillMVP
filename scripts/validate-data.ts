import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

import { CourseSchema } from "../src/lib/schema/course";

const coursesPath = resolve(process.cwd(), "data", "normalized", "courses.json");

if (!existsSync(coursesPath)) {
  console.warn(
    "[validate:data] data/normalized/courses.json not found. Skipping validation."
  );
  process.exit(0);
}

const rawContents = readFileSync(coursesPath, "utf-8");

let parsedData: unknown;

try {
  parsedData = JSON.parse(rawContents);
} catch (error) {
  console.error("[validate:data] Invalid JSON in courses.json.");
  console.error(error);
  process.exit(1);
}

const result = CourseSchema.array().safeParse(parsedData);

if (!result.success) {
  console.error("[validate:data] Course schema validation failed.");
  console.error(result.error.format());
  process.exit(1);
}

console.log(
  `[validate:data] ${result.data.length} courses validated successfully.`
);
