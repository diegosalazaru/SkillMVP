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
