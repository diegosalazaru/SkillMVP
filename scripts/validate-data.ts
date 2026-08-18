import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

import { CourseSchema } from "../src/lib/schema/course";

const coursesPath = resolve(process.cwd(), "data", "normalized", "courses.json");
const metadataPath = resolve(
  process.cwd(),
  "data",
  "normalized",
  "course-source-metadata.json"
);

const PILOT_COURSE_IDS = [
  "ai-for-everyone-deeplearningai",
  "deep-learning-specialization-deeplearningai",
  "google-cybersecurity-google",
  "ibm-cybersecurity-analyst-ibm"
] as const;

const PILOT_COMPARISONS = [
  ["ai-for-everyone-deeplearningai", "deep-learning-specialization-deeplearningai"],
  ["google-cybersecurity-google", "ibm-cybersecurity-analyst-ibm"]
] as const;

const decisionDataFields = [
  "offeringType",
  "workload",
  "toolsTechnologies",
  "practicalWorkBullets",
  "credential",
  "costModel"
] as const;

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

type SourceMetadata = {
  courseId: string;
  verifiedFields?: Record<string, boolean>;
};

const rawCourses = parsedData as Array<Record<string, unknown>>;
const migratedCourseIds = rawCourses
  .filter((course) => decisionDataFields.some((field) => Object.hasOwn(course, field)))
  .map((course) => course.id)
  .sort();
const expectedPilotIds = [...PILOT_COURSE_IDS].sort();

if (JSON.stringify(migratedCourseIds) !== JSON.stringify(expectedPilotIds)) {
  console.error(
    `[validate:data] Decision Data Contract v2 must be limited to the four pilot courses. Found: ${migratedCourseIds.join(", ")}`
  );
  process.exit(1);
}

if (!existsSync(metadataPath)) {
  console.error("[validate:data] course-source-metadata.json is required for the pilot gate.");
  process.exit(1);
}

const metadata = JSON.parse(readFileSync(metadataPath, "utf-8")) as SourceMetadata[];
const metadataByCourseId = new Map(metadata.map((item) => [item.courseId, item]));
const coursesById = new Map(result.data.map((course) => [course.id, course]));

const getReadiness = (courseId: string) => {
  const course = coursesById.get(courseId);
  const verified = metadataByCourseId.get(courseId)?.verifiedFields ?? {};

  if (!course) {
    throw new Error(`Missing pilot course: ${courseId}`);
  }

  return {
    offeringCredential:
      verified.offeringType === true &&
      verified.credential === true &&
      course.offeringType != null &&
      course.credential != null,
    workload: verified.workload === true && course.workload != null,
    startingPoint:
      verified.prerequisites === true && course.prerequisitesBullets.length > 0,
    learningTopics: verified.syllabus === true && course.syllabusBullets.length > 0,
    toolsTechnologies:
      verified.toolsTechnologies === true && course.toolsTechnologies.length > 0,
    practicalWork:
      verified.practicalWork === true && course.practicalWorkBullets.length > 0,
    costModel: verified.costModel === true && course.costModel != null
  };
};

for (const [leftId, rightId] of PILOT_COMPARISONS) {
  const leftReadiness = getReadiness(leftId);
  const rightReadiness = getReadiness(rightId);
  const sourceBackedForBoth = Object.keys(leftReadiness).filter(
    (key) =>
      leftReadiness[key as keyof typeof leftReadiness] &&
      rightReadiness[key as keyof typeof rightReadiness]
  );

  if (sourceBackedForBoth.length < 5) {
    console.error(
      `[validate:data] Pilot decision-readiness gate failed for ${leftId} vs ${rightId}: ${sourceBackedForBoth.length}/7.`
    );
    process.exit(1);
  }

  console.log(
    `[validate:data] Pilot gate passed for ${leftId} vs ${rightId}: ${sourceBackedForBoth.length}/7.`
  );
}

console.log(
  `[validate:data] ${result.data.length} courses validated successfully.`
);
