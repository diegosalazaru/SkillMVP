import { existsSync, readFileSync } from "node:fs";
import { resolve } from "node:path";

import { CourseSchema } from "../src/lib/schema/course";
import { isActionablePricingOption } from "../src/lib/pricing-contract";

const coursesPath = resolve(process.cwd(), "data", "normalized", "courses.json");
const metadataPath = resolve(
  process.cwd(),
  "data",
  "normalized",
  "course-source-metadata.json"
);
const manifestPath = resolve(process.cwd(), "data", "decision-grade-manifest.json");

const decisionDataFields = [
  "offeringType",
  "workload",
  "toolsTechnologies",
  "practicalWorkBullets",
  "credential",
  "costModel",
  "pricingOptions"
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

type DecisionGradeManifest = {
  approvedCourseIds: string[];
  readinessPairs: Array<[string, string]>;
};

const rawCourses = parsedData as Array<Record<string, unknown>>;
const migratedCourseIds = rawCourses
  .filter((course) => decisionDataFields.some((field) => Object.hasOwn(course, field)))
  .map((course) => course.id)
  .sort();

if (!existsSync(manifestPath)) {
  console.error("[validate:data] data/decision-grade-manifest.json is required.");
  process.exit(1);
}

const rawManifest = JSON.parse(readFileSync(manifestPath, "utf-8")) as Partial<DecisionGradeManifest>;

if (
  !Array.isArray(rawManifest.approvedCourseIds) ||
  !rawManifest.approvedCourseIds.every((courseId) => typeof courseId === "string") ||
  !Array.isArray(rawManifest.readinessPairs) ||
  !rawManifest.readinessPairs.every(
    (pair) =>
      Array.isArray(pair) &&
      pair.length === 2 &&
      pair.every((courseId) => typeof courseId === "string") &&
      pair[0] !== pair[1]
  )
) {
  console.error("[validate:data] Invalid decision-grade manifest structure.");
  process.exit(1);
}

const manifest = rawManifest as DecisionGradeManifest;
const approvedIdSet = new Set(manifest.approvedCourseIds);

if (approvedIdSet.size !== manifest.approvedCourseIds.length) {
  console.error("[validate:data] Duplicate approved course ID in decision-grade manifest.");
  process.exit(1);
}

const pairedIdSet = new Set(manifest.readinessPairs.flat());
const unapprovedPairIds = [...pairedIdSet].filter((courseId) => !approvedIdSet.has(courseId));
const unpairedApprovedIds = manifest.approvedCourseIds.filter(
  (courseId) => !pairedIdSet.has(courseId)
);

if (unapprovedPairIds.length > 0 || unpairedApprovedIds.length > 0) {
  console.error(
    `[validate:data] Decision-grade manifest pair coverage is invalid. Unapproved pair IDs: ${unapprovedPairIds.join(", ") || "none"}; approved IDs without a readiness pair: ${unpairedApprovedIds.join(", ") || "none"}.`
  );
  process.exit(1);
}

const expectedApprovedIds = [...manifest.approvedCourseIds].sort();

if (JSON.stringify(migratedCourseIds) !== JSON.stringify(expectedApprovedIds)) {
  console.error(
    `[validate:data] Decision Data Contract v2 fields must match the explicit approved course set. Approved: ${expectedApprovedIds.join(", ")}. Found: ${migratedCourseIds.join(", ")}.`
  );
  process.exit(1);
}

if (!existsSync(metadataPath)) {
  console.error("[validate:data] course-source-metadata.json is required for the decision-grade gate.");
  process.exit(1);
}

const metadata = JSON.parse(readFileSync(metadataPath, "utf-8")) as SourceMetadata[];
const metadataByCourseId = new Map(metadata.map((item) => [item.courseId, item]));
const coursesById = new Map(result.data.map((course) => [course.id, course]));

const hasActionablePricing = (courseId: string) => {
  const course = coursesById.get(courseId);
  const verified = metadataByCourseId.get(courseId)?.verifiedFields ?? {};

  if (!course) {
    throw new Error(`Missing approved decision-grade course: ${courseId}`);
  }

  if (verified.price !== true || verified.pricingOptions !== true) {
    return false;
  }

  const optionIds = new Set(course.pricingOptions.map((option) => option.id));

  if (optionIds.size !== course.pricingOptions.length) {
    throw new Error(`Duplicate pricing option id for ${courseId}.`);
  }

  for (const option of course.pricingOptions) {
    if (
      option.normalizationBasis === "provider_published_usd" &&
      (option.currency !== "USD" || option.amount !== option.normalizedUsdAmount)
    ) {
      throw new Error(
        `Provider-published USD pricing must preserve the exact amount for ${courseId}/${option.id}.`
      );
    }
  }

  return course.pricingOptions.some(
    (option) => isActionablePricingOption(option)
  );
};

const getReadiness = (courseId: string) => {
  const course = coursesById.get(courseId);
  const verified = metadataByCourseId.get(courseId)?.verifiedFields ?? {};

  if (!course) {
    throw new Error(`Missing approved decision-grade course: ${courseId}`);
  }

  return {
    offeringCredential:
      verified.offeringType === true &&
      verified.credential === true &&
      course.offeringType != null &&
      course.credential != null,
    workload: verified.workload === true && course.workload != null,
    startingPoint:
      verified.level === true &&
      course.level !== "unknown" &&
      verified.prerequisites === true &&
      course.prerequisitesBullets.length > 0,
    learningTopics: verified.syllabus === true && course.syllabusBullets.length > 0,
    toolsTechnologies:
      verified.toolsTechnologies === true && course.toolsTechnologies.length > 0,
    practicalWork:
      verified.practicalWork === true && course.practicalWorkBullets.length > 0,
    costModel: verified.costModel === true && course.costModel != null
  };
};

for (const [leftId, rightId] of manifest.readinessPairs) {
  const leftReadiness = getReadiness(leftId);
  const rightReadiness = getReadiness(rightId);
  const sourceBackedForBoth = Object.keys(leftReadiness).filter(
    (key) =>
      leftReadiness[key as keyof typeof leftReadiness] &&
      rightReadiness[key as keyof typeof rightReadiness]
  );
  const pricingReady = hasActionablePricing(leftId) && hasActionablePricing(rightId);

  if (!pricingReady) {
    console.error(
      `[validate:data] Decision-grade pricing hard gate failed for ${leftId} vs ${rightId}.`
    );
    process.exit(1);
  }

  if (sourceBackedForBoth.length < 5) {
    console.error(
      `[validate:data] Decision-grade readiness gate failed for ${leftId} vs ${rightId}: ${sourceBackedForBoth.length}/7.`
    );
    process.exit(1);
  }

  console.log(
    `[validate:data] Decision-grade gate passed for ${leftId} vs ${rightId}: pricing PASS + ${sourceBackedForBoth.length}/7.`
  );
}

console.log(
  `[validate:data] ${result.data.length} courses validated successfully.`
);
