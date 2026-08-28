import assert from "node:assert/strict";

import { formatPriceText } from "../src/lib/catalog-adapter";
import {
  buildComparisonRows,
  formatPricingOption,
  formatSourcePricingAmount,
  getActionablePricingOptions,
  getCourseDecisionSummary,
  getCourseSnapshot,
  type PricingOption
} from "../src/lib/decision-support";
import { isActionablePricingOption } from "../src/lib/pricing-contract";
import { CourseSchema, type Course as NormalizedCourse } from "../src/lib/schema/course";
import type { Course } from "../src/types/course";

type RawPricingOption = Omit<PricingOption, "qualifier"> & {
  qualifier?: PricingOption["qualifier"];
};

const exactPaidOption: RawPricingOption = {
  id: "exact-monthly",
  model: "subscription",
  amount: 39.99,
  currency: "USD",
  normalizedUsdAmount: 39.99,
  cadence: "month",
  scope: "Certificate access",
  normalizationBasis: "provider_published_usd",
  actionUrl: "https://example.com/checkout",
  evidenceUrls: ["https://example.com/pricing"],
  observedAt: "2026-08-28",
  referenceMarket: "United States",
  accessContext: "public_provider_page",
  conditions: "Final taxes and checkout terms may vary."
};

const makeNormalizedCourse = (pricingOption: RawPricingOption) => ({
  id: `fixture-${pricingOption.id}`,
  platform: "Fixture provider",
  title: "Pricing fixture",
  url: "https://example.com/course",
  skillSlug: "fixture",
  level: "beginner" as const,
  durationHours: null,
  language: "English",
  priceModel: pricingOption.model === "free" ? ("free" as const) : ("subscription" as const),
  priceAmount: pricingOption.amount,
  currency: pricingOption.currency,
  priceInterval: pricingOption.cadence === "month" ? ("month" as const) : null,
  rating: null,
  reviewCount: null,
  certificate: pricingOption.model === "free" ? false : true,
  lastUpdatedAt: null,
  shortDescription: null,
  syllabusBullets: [],
  prerequisitesBullets: [],
  offeringType: "course" as const,
  workload: null,
  toolsTechnologies: [],
  practicalWorkBullets: [],
  credential: null,
  costModel: {
    type: pricingOption.model === "free" ? ("free" as const) : ("subscription" as const),
    text: pricingOption.model === "free" ? "Free access" : "Subscription access"
  },
  pricingOptions: [pricingOption],
  source: "manual" as const
});

const parseOption = (rawOption: RawPricingOption) => {
  const parsed = CourseSchema.parse(makeNormalizedCourse(rawOption));
  return { course: parsed, option: parsed.pricingOptions[0] };
};

const makeRuntimeCourse = (
  normalized: NormalizedCourse,
  option: PricingOption,
  id: string
): Course => ({
  id,
  title: normalized.title,
  platform: "Coursera",
  skillTags: [normalized.skillSlug],
  level: "Beginner",
  priceModel: normalized.priceModel,
  priceAmount: normalized.priceAmount,
  currency: normalized.currency,
  priceInterval: normalized.priceInterval,
  priceText: formatPriceText(normalized),
  durationHours: normalized.durationHours,
  durationText: "Workload pending verification",
  rating: null,
  reviewCount: null,
  language: normalized.language,
  certificate: normalized.certificate,
  shortDescription: normalized.shortDescription,
  syllabusBullets: normalized.syllabusBullets,
  prerequisitesBullets: normalized.prerequisitesBullets,
  offeringType: normalized.offeringType,
  workload: normalized.workload,
  toolsTechnologies: normalized.toolsTechnologies,
  practicalWorkBullets: normalized.practicalWorkBullets,
  credential: normalized.credential,
  costModel: normalized.costModel,
  pricingOptions: [option],
  externalUrl: normalized.url,
  verifiedFields: {
    platform: true,
    price: true,
    pricingOptions: true,
    offeringType: true,
    costModel: true,
    language: true,
    level: true
  }
});

const exact = parseOption(exactPaidOption);
assert.equal(exact.option.qualifier, "exact", "existing options must default to exact");
assert.equal(
  formatPricingOption(exact.option),
  "$39.99/month — Certificate access"
);
assert.equal(
  formatPriceText(exact.course),
  "Program subscription: $39.99/month — Certificate access"
);

const exactCourse = makeRuntimeCourse(exact.course, exact.option, "exact-course");
assert.equal(getActionablePricingOptions(exactCourse).length, 1);
assert.match(getCourseDecisionSummary(exactCourse).known.join(" "), /\$39\.99\/month/);
assert.equal(
  buildComparisonRows(exactCourse, { ...exactCourse, id: "exact-course-2" })[0]?.status,
  "Same",
  "existing exact-price Same behavior must remain unchanged"
);

const starting = parseOption({
  ...exactPaidOption,
  id: "starting-monthly",
  scope: "Premium Career",
  qualifier: "starting_at"
});
assert.equal(
  formatPricingOption(starting.option),
  "Starting at $39.99/month — Premium Career"
);
assert.equal(
  formatPriceText(starting.course),
  "Program subscription: Starting at $39.99/month — Premium Career"
);
assert.equal(formatSourcePricingAmount(starting.option), "Starting at 39.99 USD");

const startingCourse = makeRuntimeCourse(
  starting.course,
  starting.option,
  "starting-course"
);
assert.equal(getActionablePricingOptions(startingCourse).length, 1);
assert.match(
  getCourseDecisionSummary(startingCourse).known.join(" "),
  /Starting at \$39\.99\/month/
);
assert.match(
  getCourseSnapshot(startingCourse).pricing.join(" "),
  /Starting at \$39\.99\/month/
);
assert.equal(
  buildComparisonRows(startingCourse, exactCourse)[0]?.status,
  "Insufficient data",
  "a starting-at amount must not establish exact-price sameness or difference"
);

const free = parseOption({
  ...exactPaidOption,
  id: "official-free",
  model: "free",
  amount: 0,
  normalizedUsdAmount: 0,
  cadence: "other",
  scope: "Microsoft Learn training",
  referenceMarket: null,
  conditions: "Access remains subject to provider availability."
});
assert.equal(formatPricingOption(free.option), "Free — Microsoft Learn training");
assert.equal(formatSourcePricingAmount(free.option), "Free ($0 USD)");
assert.equal(formatPriceText(free.course), "Free — Microsoft Learn training");

const freeCourse = makeRuntimeCourse(free.course, free.option, "free-course");
assert.equal(getActionablePricingOptions(freeCourse).length, 1);
assert.equal(isActionablePricingOption(free.option), true);

const invalidZeroPaid = CourseSchema.safeParse(
  makeNormalizedCourse({
    ...exactPaidOption,
    id: "invalid-zero-paid",
    amount: 0,
    normalizedUsdAmount: 0
  })
);
assert.equal(invalidZeroPaid.success, false, "zero paid pricing must fail the schema");

const invalidQualifiedFree = CourseSchema.safeParse(
  makeNormalizedCourse({
    ...exactPaidOption,
    id: "invalid-qualified-free",
    model: "free",
    amount: 0,
    normalizedUsdAmount: 0,
    cadence: "other",
    qualifier: "starting_at"
  })
);
assert.equal(
  invalidQualifiedFree.success,
  false,
  "free pricing must not carry a starting-at qualifier"
);

console.log("[check:pricing-contract] Exact, starting-at, free, invalid-zero, and Compare regressions passed.");
