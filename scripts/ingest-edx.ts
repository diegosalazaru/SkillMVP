import { mkdirSync, writeFileSync } from "node:fs";
import { resolve } from "node:path";

import { CourseSchema } from "../src/lib/schema/course";
import { slugify } from "../src/utils/slugify";

type EdxSearchResponse = {
  objects?: unknown[];
  results?: unknown[];
  items?: unknown[];
};

type EdxCourse = Record<string, unknown>;

const API_URL = "https://www.edx.org/api/v1/catalog/search";
const query = process.env.EDX_QUERY ?? "ai";
const pageSize = Number(process.env.EDX_PAGE_SIZE ?? 20);

const pickArray = (data: EdxSearchResponse) =>
  (Array.isArray(data.objects) && data.objects) ||
  (Array.isArray(data.results) && data.results) ||
  (Array.isArray(data.items) && data.items) ||
  [];

const asString = (value: unknown) =>
  typeof value === "string" && value.trim().length > 0 ? value.trim() : null;

const toArray = (value: unknown) =>
  Array.isArray(value) ? value : value ? [value] : [];

const mapLevel = (value: string | null) => {
  if (!value) return "unknown";
  const normalized = value.toLowerCase();
  if (normalized.includes("beginner")) return "beginner";
  if (normalized.includes("intermediate")) return "intermediate";
  if (normalized.includes("advanced")) return "advanced";
  if (normalized.includes("all") || normalized.includes("mixed")) return "mixed";
  return "unknown";
};

const mapPriceModel = (value: unknown, interval: string | null) => {
  if (typeof value === "number") {
    if (value === 0) return "free";
    return interval ? "subscription" : "paid_once";
  }
  if (typeof value === "string") {
    const normalized = value.toLowerCase();
    if (normalized.includes("free")) return "free";
    if (normalized.includes("subscription") || normalized.includes("monthly")) {
      return "subscription";
    }
    if (normalized.includes("paid") || normalized.includes("paid_once")) {
      return "paid_once";
    }
  }
  return "unknown";
};

const toPriceInterval = (value: unknown) => {
  const normalized = asString(value)?.toLowerCase();
  if (normalized === "month" || normalized === "monthly") return "month";
  if (normalized === "year" || normalized === "yearly") return "year";
  return null;
};

const toNumber = (value: unknown) => (typeof value === "number" ? value : null);

const toDateString = (value: unknown) => (typeof value === "string" ? value : null);

const toCurrency = (value: unknown) =>
  typeof value === "string" && value.trim().length > 0 ? value.trim() : null;

const getDurationHours = (course: EdxCourse) => {
  const minEffort = toNumber(course.min_effort) ?? toNumber(course.minEffort);
  const maxEffort = toNumber(course.max_effort) ?? toNumber(course.maxEffort);
  const weeks =
    toNumber(course.weeks_to_complete) ?? toNumber(course.weeksToComplete);

  if (weeks == null || (minEffort == null && maxEffort == null)) {
    return null;
  }

  const effort =
    minEffort != null && maxEffort != null
      ? (minEffort + maxEffort) / 2
      : minEffort ?? maxEffort ?? 0;

  return effort ? Math.round(effort * weeks * 10) / 10 : null;
};

const getSubjectSlug = (course: EdxCourse, fallbackTitle: string) => {
  const subjects = toArray(course.subjects).filter(Boolean) as unknown[];
  const subjectValue =
    asString((subjects[0] as { name?: string })?.name) ??
    asString(subjects[0]) ??
    asString((course.primary_subject as { name?: string })?.name) ??
    asString(course.primary_subject) ??
    asString((course.partner as { name?: string })?.name) ??
    asString(course.partner);

  return slugify(subjectValue ?? fallbackTitle);
};

const getUrl = (course: EdxCourse) => {
  const rawUrl =
    asString(course.marketing_url) ||
    asString(course.url) ||
    asString(course.marketing_url) ||
    null;
  if (!rawUrl) {
    return null;
  }
  if (rawUrl.startsWith("http")) {
    return rawUrl;
  }
  return `https://www.edx.org${rawUrl.startsWith("/") ? "" : "/"}${rawUrl}`;
};

const mapCourse = (course: EdxCourse) => {
  const title = asString(course.title) || asString(course.name);
  const id =
    asString(course.uuid) ||
    asString(course.course_key) ||
    asString(course.key) ||
    asString(course.id);
  const url = getUrl(course);

  if (!title || !id || !url) {
    return null;
  }

  const languageValue =
    asString(course.language) ||
    asString((toArray(course.languages)[0] as unknown) ?? null) ||
    "unknown";

  const priceAmount = toNumber(course.price) ?? toNumber(course.price_amount);
  const priceInterval =
    toPriceInterval(course.price_interval) ??
    toPriceInterval(course.billing_frequency) ??
    null;
  const priceModel = mapPriceModel(course.price ?? course.price_amount, priceInterval);
  const currency = toCurrency(course.currency) ?? toCurrency(course.price_currency);

  return {
    id,
    platform: "edX",
    title,
    url,
    skillSlug: getSubjectSlug(course, title),
    level: mapLevel(asString(course.level_type) ?? asString(course.level)),
    durationHours: getDurationHours(course),
    language: languageValue,
    priceModel,
    priceAmount,
    currency,
    priceInterval,
    rating: toNumber(course.rating),
    reviewCount: toNumber(course.review_count),
    certificate:
      typeof course.certificate === "boolean" ? course.certificate : null,
    lastUpdatedAt:
      toDateString(course.recently_updated) ??
      toDateString(course.last_updated) ??
      toDateString(course.lastUpdated),
    shortDescription:
      asString(course.short_description) ??
      asString(course.marketing_summary) ??
      asString(course.subtitle),
    source: "edx"
  };
};

const run = async () => {
  const params = new URLSearchParams({
    query,
    page: "1",
    page_size: String(pageSize)
  });

  // Add minimal headers for CI access to public APIs (some block default User-Agent).
  const response = await fetch(`${API_URL}?${params.toString()}`, {
    headers: {
      "User-Agent":
        "SkillsCompareBot/1.0 (+https://github.com/diego-salazar-uribe/SkillMVP)",
      Accept: "application/json"
    }
  });
  if (!response.ok) {
    // Allow CI to pass when edX blocks catalog access (404), but keep hard failure locally.
    if (response.status === 404 && process.env.CI === "true") {
      console.warn(
        "[ingest-edx] edX catalog blocked in CI, skipping ingestion."
      );
      process.exit(0);
    }
    throw new Error(`[ingest:edx] Failed to fetch edX catalog: ${response.status}`);
  }

  const data = (await response.json()) as EdxSearchResponse;
  const courses = pickArray(data)
    .map((item) => mapCourse(item as EdxCourse))
    .filter(Boolean);

  const result = CourseSchema.array().safeParse(courses);
  if (!result.success) {
    console.error("[ingest:edx] Course schema validation failed.");
    console.error(result.error.format());
    process.exit(1);
  }

  const outputPath = resolve(process.cwd(), "data", "normalized", "courses.json");
  mkdirSync(resolve(process.cwd(), "data", "normalized"), { recursive: true });
  writeFileSync(outputPath, JSON.stringify(result.data, null, 2));
  console.log(`[ingest:edx] Wrote ${result.data.length} courses to ${outputPath}`);
};

run().catch((error) => {
  console.error("[ingest:edx] Unexpected error.");
  console.error(error);
  process.exit(1);
});
