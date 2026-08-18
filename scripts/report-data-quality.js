const { existsSync, readFileSync } = require("node:fs");
const { resolve } = require("node:path");

const readJsonFile = (filePath) => {
  const raw = readFileSync(filePath, "utf8");
  return JSON.parse(raw);
};

const countBy = (items, getKey) => {
  const counts = new Map();

  items.forEach((item) => {
    const key = getKey(item);
    counts.set(key, (counts.get(key) ?? 0) + 1);
  });

  return Array.from(counts.entries()).sort(([left], [right]) =>
    left.localeCompare(right)
  );
};

const printCountList = (label, counts) => {
  console.log(`\n${label}`);
  counts.forEach(([key, count]) => {
    console.log(`- ${key}: ${count}`);
  });
};

const getVerifiedFieldCoverage = (metadata) => {
  const coverage = new Map();

  metadata.forEach((record) => {
    Object.entries(record.verifiedFields ?? {}).forEach(([field, verified]) => {
      const current = coverage.get(field) ?? { verified: 0, total: 0 };
      current.total += 1;
      if (verified === true) {
        current.verified += 1;
      }
      coverage.set(field, current);
    });
  });

  return Array.from(coverage.entries()).sort(([left], [right]) =>
    left.localeCompare(right)
  );
};

const pilotComparisons = [
  ["ai-for-everyone-deeplearningai", "deep-learning-specialization-deeplearningai"],
  ["google-cybersecurity-google", "ibm-cybersecurity-analyst-ibm"]
];

const decisionDimensions = [
  ["offering / credential type", (course, verified) =>
    verified.offeringType === true &&
    verified.credential === true &&
    course.offeringType != null &&
    course.credential != null],
  ["workload / time commitment", (course, verified) =>
    verified.workload === true && course.workload != null],
  ["prerequisites / starting point", (course, verified) =>
    verified.level === true &&
    course.level !== "unknown" &&
    verified.prerequisites === true &&
    course.prerequisitesBullets.length > 0],
  ["learning topics", (course, verified) =>
    verified.syllabus === true && course.syllabusBullets.length > 0],
  ["tools / technologies", (course, verified) =>
    verified.toolsTechnologies === true && course.toolsTechnologies?.length > 0],
  ["practical work / projects / labs", (course, verified) =>
    verified.practicalWork === true && course.practicalWorkBullets?.length > 0],
  ["cost model context", (course, verified) =>
    verified.costModel === true && course.costModel != null]
];

const coursesPath = resolve(process.cwd(), "data", "normalized", "courses.json");
const metadataPath = resolve(
  process.cwd(),
  "data",
  "normalized",
  "course-source-metadata.json"
);

try {
  const courses = readJsonFile(coursesPath);
  const metadata = existsSync(metadataPath) ? readJsonFile(metadataPath) : [];

  const coursesById = new Map(courses.map((course) => [course.id, course]));
  const metadataByCourseId = new Map();
  const duplicateMetadataIds = new Set();

  metadata.forEach((record) => {
    if (metadataByCourseId.has(record.courseId)) {
      duplicateMetadataIds.add(record.courseId);
    }
    metadataByCourseId.set(record.courseId, record);
  });

  const missingSourceMetadata = courses.filter(
    (course) => !metadataByCourseId.has(course.id)
  );
  const metadataWithoutCourse = metadata.filter(
    (record) => !coursesById.has(record.courseId)
  );
  const sourceUrlMismatches = metadata.filter((record) => {
    const course = coursesById.get(record.courseId);
    return course ? course.url !== record.sourceUrl : false;
  });

  console.log("Data quality report");
  console.log("===================");
  console.log(`Total courses: ${courses.length}`);

  printCountList("Courses by skillSlug", countBy(courses, (course) => course.skillSlug));
  printCountList("Courses by platform", countBy(courses, (course) => course.platform));
  printCountList(
    "Verification status counts",
    countBy(metadata, (record) => record.verificationStatus)
  );

  const fullyPendingCourses = metadata
    .filter((record) => record.verificationStatus === "pending")
    .map((record) => record.courseId)
    .sort();
  const partiallyVerifiedCourses = metadata
    .filter((record) => record.verificationStatus === "partially_verified")
    .map((record) => record.courseId)
    .sort();

  console.log("\nVerified field coverage");
  getVerifiedFieldCoverage(metadata).forEach(([field, coverage]) => {
    console.log(`- ${field}: ${coverage.verified}/${coverage.total}`);
  });

  console.log("\nCourses still fully pending");
  if (fullyPendingCourses.length > 0) {
    fullyPendingCourses.forEach((courseId) => console.log(`- ${courseId}`));
  } else {
    console.log("- none");
  }

  console.log("\nPartially verified courses");
  if (partiallyVerifiedCourses.length > 0) {
    partiallyVerifiedCourses.forEach((courseId) => console.log(`- ${courseId}`));
  } else {
    console.log("- none");
  }

  console.log("\nUnknown or pending course fields");
  console.log(`- priceAmount unknown/null: ${courses.filter((course) => course.priceAmount == null).length}`);
  console.log(`- rating null: ${courses.filter((course) => course.rating == null).length}`);
  console.log(`- reviewCount null: ${courses.filter((course) => course.reviewCount == null).length}`);
  console.log(`- durationHours null: ${courses.filter((course) => course.durationHours == null).length}`);
  console.log(`- certificate null: ${courses.filter((course) => course.certificate == null).length}`);

  console.log("\nSource metadata coverage");
  console.log(`- metadata records: ${metadata.length}`);
  console.log(`- courses missing source metadata: ${missingSourceMetadata.length}`);
  console.log(`- source metadata records without matching course: ${metadataWithoutCourse.length}`);
  console.log(`- source URL mismatches: ${sourceUrlMismatches.length}`);
  console.log(`- duplicate metadata courseIds: ${duplicateMetadataIds.size}`);

  console.log("\nDecision Data Contract v2 pilot gate");
  pilotComparisons.forEach(([leftId, rightId]) => {
    const left = coursesById.get(leftId);
    const right = coursesById.get(rightId);
    const leftVerified = metadataByCourseId.get(leftId)?.verifiedFields ?? {};
    const rightVerified = metadataByCourseId.get(rightId)?.verifiedFields ?? {};
    const sourceBackedForBoth = decisionDimensions
      .filter(([, isReady]) =>
        isReady(left, leftVerified) && isReady(right, rightVerified)
      )
      .map(([label]) => label);
    const insufficient = decisionDimensions
      .map(([label]) => label)
      .filter((label) => !sourceBackedForBoth.includes(label));

    console.log(`- ${leftId} vs ${rightId}: ${sourceBackedForBoth.length}/7 ${sourceBackedForBoth.length >= 5 ? "PASS" : "FAIL"}`);
    console.log(`  - source-backed for both: ${sourceBackedForBoth.join(", ")}`);
    console.log(`  - insufficient: ${insufficient.length > 0 ? insufficient.join(", ") : "none"}`);
  });

  const structuralIssues = [
    ...missingSourceMetadata.map((course) => `Missing metadata: ${course.id}`),
    ...metadataWithoutCourse.map(
      (record) => `Metadata without course: ${record.courseId}`
    ),
    ...sourceUrlMismatches.map(
      (record) => `Source URL mismatch: ${record.courseId}`
    ),
    ...Array.from(duplicateMetadataIds).map(
      (courseId) => `Duplicate metadata: ${courseId}`
    )
  ];

  if (structuralIssues.length > 0) {
    console.log("\nStructural issues");
    structuralIssues.forEach((issue) => console.log(`- ${issue}`));
    process.exitCode = 1;
  }
} catch (error) {
  console.error("Failed to generate data quality report.");
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
}
