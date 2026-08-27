import assert from "node:assert/strict";

import decisionGradeManifest from "../data/decision-grade-manifest.json";
import robots from "../app/robots";
import sitemap from "../app/sitemap";
import { generateMetadata } from "../app/skills/[skillSlug]/page";
import { SITE_URL } from "../src/config/siteConfig";
import { courses } from "../src/lib/catalog-adapter";
import {
  getDecisionReadyPairsForSkill,
  getDecisionReadySkillSlugs
} from "../src/lib/decision-ready-comparisons";
import { buildSeoPageMetadata } from "../src/lib/metadata";
import { getAllSeoPages } from "../src/lib/seo/seoPages";
import { getSkillSummaries } from "../src/lib/skill-catalog";

const targetSkillSlugs = [
  "ai",
  "cybersecurity",
  "data-analysis",
  "cloud-computing",
  "project-management"
];

const expectedPairCounts = new Map([
  ["ai", 1],
  ["cybersecurity", 1],
  ["data-analysis", 1],
  ["cloud-computing", 1],
  ["project-management", 2]
]);

assert.equal(
  SITE_URL,
  "https://skillcompare.com",
  "SEO checks must use the production canonical host https://skillcompare.com."
);

assert.deepEqual(
  robots(),
  {
    rules: {
      userAgent: "*",
      allow: "/"
    },
    sitemap: `${SITE_URL}/sitemap.xml`
  },
  "robots.txt must allow crawling and advertise the production sitemap."
);

assert.deepEqual(
  getDecisionReadySkillSlugs(),
  targetSkillSlugs,
  "Only the five approved canonical skills should expose decision-ready guides."
);

const surfacedPairs = targetSkillSlugs.flatMap((skillSlug) => {
  const pairs = getDecisionReadyPairsForSkill(skillSlug);
  assert.equal(
    pairs.length,
    expectedPairCounts.get(skillSlug),
    `${skillSlug} should expose its approved manifest pair count.`
  );

  pairs.forEach((pair) => {
    assert.equal(
      pair.compareHref,
      `/compare?ids=${pair.left.id},${pair.right.id}`,
      "Compare links must preserve exact manifest pair order and IDs."
    );
    assert.ok(pair.differences.length > 0, "Each guide needs factual differences.");
    assert.ok(
      pair.left.detailHref.startsWith("/courses/") &&
        pair.right.detailHref.startsWith("/courses/"),
      "Each pair must link naturally to both canonical course details."
    );
  });

  return pairs.map((pair) => [pair.left.id, pair.right.id]);
});

assert.deepEqual(
  surfacedPairs,
  decisionGradeManifest.readinessPairs,
  "Every manifest pair should surface exactly once and in deterministic manifest order."
);

for (const skillSlug of targetSkillSlugs) {
  const metadata = generateMetadata({ params: { skillSlug } });
  const canonical = metadata.alternates?.canonical;

  assert.equal(
    canonical,
    `${SITE_URL}/skills/${skillSlug}`,
    `${skillSlug} should retain its canonical URL.`
  );
  assert.notEqual(metadata.robots, "noindex", `${skillSlug} must remain indexable.`);
  assert.match(
    String(metadata.description),
    /source-backed pricing, decision differences, and known data gaps/i,
    `${skillSlug} metadata should express stable comparison intent.`
  );
  assert.doesNotMatch(
    `${String(metadata.title)} ${String(metadata.description)}`,
    /\$\d|USD\s*\d/i,
    "Volatile exact prices must stay out of metadata."
  );
}

assert.match(
  String(generateMetadata({ params: { skillSlug: "ai" } }).title),
  /^AI course comparison guide/,
  "AI should retain its standard acronym casing in metadata and page copy."
);

assert.equal(
  getDecisionReadyPairsForSkill("frontend").length,
  0,
  "Non-target skills must not receive unsupported decision-ready claims."
);

const sitemapEntries = sitemap();
const sitemapUrls = sitemapEntries.map((entry) => entry.url).sort();
const expectedSitemapUrls = [
  `${SITE_URL}/`,
  ...getSkillSummaries().map((skill) => `${SITE_URL}/skills/${skill.slug}`),
  ...courses.map((course) => `${SITE_URL}/courses/${course.id}`)
].sort();

assert.deepEqual(
  sitemapUrls,
  expectedSitemapUrls,
  "The sitemap should contain only the existing homepage, canonical skills, and course details."
);
assert.ok(
  sitemapEntries.every((entry) => entry.lastModified == null),
  "The sitemap must not add synthetic lastModified values."
);
assert.ok(
  !sitemapUrls.some((url) => url.includes("/compare")),
  "Compare must remain outside the sitemap."
);

const generatedSeoPages = getAllSeoPages();
assert.equal(generatedSeoPages.length, 20, "All 20 generated SEO routes should remain gated.");

for (const page of generatedSeoPages) {
  const metadata = buildSeoPageMetadata(page);
  const robots = metadata.robots;

  assert.equal(
    typeof robots === "object" ? robots?.index : undefined,
    false,
    `${page.slug} should remain noindex.`
  );
  assert.equal(
    typeof robots === "object" ? robots?.follow : undefined,
    true,
    `${page.slug} should remain follow.`
  );
  assert.ok(
    !sitemapUrls.includes(`${SITE_URL}/${page.slug}`),
    `${page.slug} should remain outside the sitemap.`
  );
}

console.log(
  `[check:selective-seo] PASS — ${targetSkillSlugs.length} canonical skills, ${surfacedPairs.length} manifest pairs, ${generatedSeoPages.length} gated generated routes, and ${sitemapUrls.length} sitemap URLs verified.`
);
