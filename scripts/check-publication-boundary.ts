import assert from "node:assert/strict";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import decisionGradeManifest from "../data/decision-grade-manifest.json";
import sourceMetadata from "../data/normalized/course-source-metadata.json";
import normalizedCatalog from "../data/normalized/courses.json";
import CourseDetailPage from "../app/courses/[courseId]/page";
import sitemap from "../app/sitemap";
import { SITE_URL } from "../src/config/siteConfig";
import { courses, isPublishedCourseId } from "../src/lib/catalog-adapter";
import { buildSeoPageMetadata } from "../src/lib/metadata";
import { getAllSeoPages } from "../src/lib/seo/seoPages";

type PublicationStatus = "published" | "source_blocked";
type SourceMetadata = {
  courseId: string;
  publicationStatus?: PublicationStatus;
  verificationStatus: string;
};

const knownSourceBlockedIds = [
  "data-analytics-essentials-cisco",
  "introduction-cyber-security-nyux-edx"
].sort();
const metadata = sourceMetadata as SourceMetadata[];
const getPublicationStatus = (record: SourceMetadata): PublicationStatus =>
  record.publicationStatus ?? "published";
const sourceBlockedIds = metadata
  .filter((record) => getPublicationStatus(record) === "source_blocked")
  .map((record) => record.courseId)
  .sort();
const sourceBlockedIdSet = new Set(sourceBlockedIds);
const rawCourseIds = (normalizedCatalog as Array<{ id: string }>).map(
  (course) => course.id
);
const runtimeCourseIds = courses.map((course) => course.id);
const sitemapUrls = sitemap().map((entry) => entry.url);

assert.deepEqual(
  sourceBlockedIds,
  knownSourceBlockedIds,
  "Both known unavailable legacy offerings must remain explicitly source-blocked."
);
assert.equal(
  courses.length,
  rawCourseIds.length - sourceBlockedIds.length,
  "Runtime course count must derive from the full catalog minus source-blocked records."
);

for (const courseId of sourceBlockedIds) {
  assert.ok(rawCourseIds.includes(courseId), `${courseId} must remain in raw catalog data.`);
  assert.equal(
    metadata.find((record) => record.courseId === courseId)?.verificationStatus,
    "pending",
    `${courseId} must retain its source-verification blocker.`
  );
  assert.ok(
    !runtimeCourseIds.includes(courseId),
    `${courseId} must be absent from the runtime catalog.`
  );
  assert.equal(
    isPublishedCourseId(courseId),
    false,
    `${courseId} must be rejected by persisted selection validation.`
  );
  assert.ok(
    !sitemapUrls.includes(`${SITE_URL}/courses/${courseId}`),
    `${courseId} must be absent from the sitemap.`
  );
  assert.throws(
    () => CourseDetailPage({ params: { courseId } }),
    (error: unknown) =>
      error instanceof Error &&
      (error as Error & { digest?: string }).digest === "NEXT_NOT_FOUND",
    `${courseId} must use the deliberate Next.js 404 path.`
  );
}

assert.ok(
  decisionGradeManifest.approvedCourseIds.every(
    (courseId) => !sourceBlockedIdSet.has(courseId)
  ),
  "Source-blocked records must not be approved for decision-grade pairs."
);
assert.ok(
  decisionGradeManifest.readinessPairs
    .flat()
    .every((courseId) => runtimeCourseIds.includes(courseId)),
  "Every approved readiness pair must resolve through the published runtime catalog."
);

const generatedSeoPages = getAllSeoPages();
assert.equal(
  generatedSeoPages.length,
  20,
  "The existing 20 generated SEO templates must remain available."
);
for (const page of generatedSeoPages) {
  assert.ok(
    page.courseIds.every((courseId) => !sourceBlockedIdSet.has(courseId)),
    `${page.slug} must not reference a source-blocked course.`
  );
  const robots = buildSeoPageMetadata(page).robots;
  assert.equal(
    typeof robots === "object" ? robots?.index : undefined,
    false,
    `${page.slug} must remain noindex.`
  );
  assert.equal(
    typeof robots === "object" ? robots?.follow : undefined,
    true,
    `${page.slug} must remain follow.`
  );
}

const adapterSource = readFileSync(resolve("src/lib/catalog-adapter.ts"), "utf8");
assert.doesNotMatch(
  adapterSource,
  /data-analytics-essentials-cisco|introduction-cyber-security-nyux-edx/i,
  "The publication boundary must remain provider-neutral."
);

console.log(
  `[check:publication-boundary] PASS — ${rawCourseIds.length} audited records, ${runtimeCourseIds.length} published courses, ${sourceBlockedIds.length} deliberate 404s, ${generatedSeoPages.length} noindex templates, and ${sitemapUrls.length} sitemap URLs verified.`
);
