import normalizedCatalog from "../../data/normalized/courses.json";
import sourceMetadata from "../../data/normalized/course-source-metadata.json";
import { courses as fallbackCourses } from "@/data/courses";
import { CourseSchema, type Course as NormalizedCourse } from "@/lib/schema/course";
import type { Course } from "@/types/course";

const mapPlatform = (platform: string): Course["platform"] | null => {
  const normalized = platform.trim().toLowerCase();

  if (normalized === "coursera") {
    return "Coursera";
  }
  if (normalized === "udemy") {
    return "Udemy";
  }
  if (normalized === "edx") {
    return "edX";
  }
  if (
    normalized === "microsoft learn" ||
    normalized === "microsoft-learn" ||
    normalized === "microsoft_learn"
  ) {
    return "Microsoft Learn";
  }

  return null;
};

const mapLevel = (level: NormalizedCourse["level"]): Course["level"] => {
  if (level === "advanced") {
    return "Advanced";
  }
  if (level === "intermediate") {
    return "Intermediate";
  }
  if (level === "beginner") {
    return "Beginner";
  }
  if (level === "mixed") {
    return "Mixed";
  }
  return "Unknown";
};

type SourceMetadata = {
  courseId: string;
  verifiedFields: NonNullable<Course["verifiedFields"]>;
};

const sourceMetadataByCourseId = new Map(
  (sourceMetadata as SourceMetadata[]).map((metadata) => [metadata.courseId, metadata])
);

const formatDurationText = (
  durationHours: number | null,
  workload: NormalizedCourse["workload"]
): string => {
  if (workload) {
    return workload.text;
  }

  if (durationHours == null) {
    return "Duration pending verification";
  }

  return `${durationHours} hours`;
};

const formatPriceText = (course: NormalizedCourse): string => {
  const primaryPricingOption = course.pricingOptions[0];

  if (primaryPricingOption) {
    const approximation =
      primaryPricingOption.normalizationBasis === "currency_converted" ? "≈ " : "";
    const amount = new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: Number.isInteger(primaryPricingOption.normalizedUsdAmount)
        ? 0
        : 2
    }).format(primaryPricingOption.normalizedUsdAmount);
    const cadence = {
      one_time: " total",
      month: "/month",
      year: "/year",
      other: ""
    }[primaryPricingOption.cadence];

    return `${approximation}${amount}${cadence}`;
  }

  if (course.priceModel === "free") {
    return course.certificate ? "Free (paid certificate)" : "Free";
  }

  if (course.priceModel === "subscription") {
    return "Subscription — price unverified";
  }

  if (course.priceModel === "paid_once") {
    return course.certificate ? "Paid (certificate included)" : "Paid";
  }

  return "Price not verified";
};

const mapCourse = (course: NormalizedCourse): Course | null => {
  const platform = mapPlatform(course.platform);

  if (!platform) {
    return null;
  }

  return {
    id: course.id,
    title: course.title,
    platform,
    skillTags: [course.skillSlug],
    level: mapLevel(course.level),
    priceModel: course.priceModel,
    priceAmount: course.priceAmount,
    currency: course.currency,
    priceInterval: course.priceInterval,
    priceText: formatPriceText(course),
    durationHours: course.durationHours,
    durationText: formatDurationText(course.durationHours, course.workload),
    rating: course.rating,
    reviewCount: course.reviewCount,
    language: course.language,
    certificate: course.certificate,
    shortDescription: course.shortDescription,
    syllabusBullets: course.syllabusBullets,
    prerequisitesBullets: course.prerequisitesBullets,
    offeringType: course.offeringType,
    workload: course.workload,
    toolsTechnologies: course.toolsTechnologies,
    practicalWorkBullets: course.practicalWorkBullets,
    credential: course.credential,
    costModel: course.costModel,
    pricingOptions: course.pricingOptions,
    externalUrl: course.url,
    verifiedFields: sourceMetadataByCourseId.get(course.id)?.verifiedFields ?? {}
  };
};

const parsedCatalog = CourseSchema.array().safeParse(normalizedCatalog);

const normalizedCourses = parsedCatalog.success
  ? parsedCatalog.data
      .map(mapCourse)
      .filter((course): course is Course => course !== null)
  : [];

export const courses: Course[] =
  normalizedCourses.length > 0 ? normalizedCourses : fallbackCourses;
