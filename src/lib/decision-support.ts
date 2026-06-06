import type { Course } from "@/types/course";

export type RowStatus = "Same" | "Different" | "Missing data" | "Needs verification";

export type ComparisonRow = {
  label: string;
  left: string;
  right: string;
  status: RowStatus;
  interpretation: string;
};

const normalize = (value: string) => value.trim().toLowerCase();

export const isDurationPending = (course: Course) =>
  normalize(course.durationText).includes("pending verification");

export const isExactPricePending = (course: Course) =>
  course.priceModel === "unknown" ||
  (course.priceModel !== "free" && course.priceAmount == null);

export const formatCertificate = (course: Course) =>
  course.certificate ? "Certificate availability shown" : "Certificate availability not verified";

export const summarizeBullets = (items: string[], fallback: string) =>
  items.length > 0 ? items.slice(0, 3).join("; ") : fallback;

export const getCourseFitBullets = (course: Course) => {
  const bullets = [
    `You want a ${course.level}-level course.`,
    course.certificate
      ? "You want certificate availability to be visible before opening the provider page."
      : "You are comfortable verifying certificate availability on the provider page.",
    isDurationPending(course)
      ? "You are comfortable verifying duration and workload before committing."
      : "You can assess time commitment because duration is available in the catalog.",
    isExactPricePending(course)
      ? "You are comfortable confirming final price or subscription terms on the provider page."
      : `You can evaluate the listed price model: ${course.priceText}.`,
    course.prerequisitesBullets.length > 0
      ? `The listed prerequisites fit your background: ${summarizeBullets(course.prerequisitesBullets, "prerequisites available")}.`
      : "You can verify prerequisites directly on the provider page."
  ];

  if (course.syllabusBullets.length > 0) {
    bullets.push(
      `You want coverage of topics such as ${summarizeBullets(course.syllabusBullets, "listed learning topics")}.`
    );
  }

  return bullets.slice(0, 5);
};

export const getCourseDecisionSummary = (course: Course) => {
  const known = [
    `Platform: ${course.platform}.`,
    `Level: ${course.level}.`,
    `Language: ${course.language}.`,
    formatCertificate(course),
    isDurationPending(course)
      ? "Duration is pending verification."
      : `Catalog duration: ${course.durationText}.`
  ];

  const pending = [
    course.rating == null ? "Rating/review count is not available in Skills Compare." : null,
    isExactPricePending(course) ? "Exact price or subscription terms must be verified on the provider page." : null,
    isDurationPending(course) ? "Duration/workload must be checked before committing time." : null,
    course.prerequisitesBullets.length === 0 ? "Prerequisites should be verified on the provider page." : null,
    course.syllabusBullets.length === 0 ? "Current syllabus should be verified on the provider page." : null
  ].filter((item): item is string => item !== null);

  const fit = getCourseFitBullets(course);

  return { known, pending, fit };
};

export const getPendingDataImpact = (course: Course) => {
  const impacts = [
    course.rating == null
      ? "Rating/review count unavailable: Skills Compare cannot show social proof for this course yet."
      : null,
    isExactPricePending(course)
      ? "Exact price pending: confirm total cost, trial terms, and subscription renewal before enrolling."
      : null,
    isDurationPending(course)
      ? "Duration pending: check weekly workload and total time commitment on the provider page."
      : null,
    course.certificate === null
      ? "Certificate status pending: verify whether a certificate is available and under what terms."
      : null
  ].filter((item): item is string => item !== null);

  return impacts.length > 0
    ? impacts
    : ["No major pending catalog fields are currently flagged, but provider details may still change."];
};

const buildSimilarity = (condition: boolean, sameText: string, differentText: string) =>
  condition ? sameText : differentText;

export const getDecisionSummary = (
  left: Course,
  right: Course,
  leftPrice: string,
  rightPrice: string
) => ({
  similarities: [
    buildSimilarity(
      left.level === right.level,
      `Both courses are ${left.level}-level, so level is not the main deciding factor.`,
      "The courses target different levels, so fit depends on your current background."
    ),
    buildSimilarity(
      left.language === right.language,
      `Both courses are listed in ${left.language}.`,
      `Language differs: ${left.language} vs ${right.language}.`
    ),
    buildSimilarity(
      left.priceModel === right.priceModel,
      `Both courses use the ${left.priceModel} price model in the catalog.`,
      "The payment model differs, so cost structure should be checked carefully."
    )
  ],
  differences: [
    left.platform === right.platform
      ? `Both courses are on ${left.platform}.`
      : `Provider platform differs: ${left.platform} vs ${right.platform}.`,
    left.durationText === right.durationText
      ? `Both courses show the same duration signal: ${left.durationText}.`
      : `Duration differs or is incomplete: ${left.durationText} vs ${right.durationText}.`,
    leftPrice === rightPrice
      ? `Displayed price information matches: ${leftPrice}.`
      : `Displayed price information differs: ${leftPrice} vs ${rightPrice}.`,
    left.certificate === right.certificate
      ? left.certificate
        ? "Both courses show certificate availability in the catalog."
        : "Neither course has certificate availability verified in the catalog."
      : "Only one course has certificate availability shown in the catalog."
  ],
  uncertainty: [
    isExactPricePending(left) || isExactPricePending(right)
      ? "At least one exact price is pending verification, so confirm cost on the provider page."
      : "Catalog price fields are present, but provider pricing can still change.",
    isDurationPending(left) || isDurationPending(right)
      ? "At least one duration is pending verification, so workload is a decision risk."
      : "Both courses have duration information in the catalog.",
    left.rating == null || right.rating == null
      ? "At least one course lacks rating/review count data in Skills Compare."
      : "Both courses include rating data in the catalog."
  ],
  fitFraming: [
    "Choose based on your current level, time commitment, and need for certificate visibility.",
    "Use the provider page to verify volatile details before enrolling.",
    "The comparison is factual and does not rank one course above the other."
  ]
});

const rowStatus = (left: string, right: string): RowStatus => {
  const leftNormalized = normalize(left);
  const rightNormalized = normalize(right);

  if (
    leftNormalized.includes("pending") ||
    rightNormalized.includes("pending") ||
    leftNormalized.includes("not verified") ||
    rightNormalized.includes("not verified") ||
    leftNormalized.includes("unknown") ||
    rightNormalized.includes("unknown")
  ) {
    return "Needs verification";
  }

  if (!left || !right) return "Missing data";
  return left === right ? "Same" : "Different";
};

export const buildComparisonRows = (
  left: Course,
  right: Course,
  leftPrice: string,
  rightPrice: string
): ComparisonRow[] => {
  const rows = [
    {
      label: "Price",
      left: leftPrice,
      right: rightPrice,
      interpretation:
        leftPrice === rightPrice
          ? "Price is not the visible differentiator, but final provider terms still need verification."
          : "Cost structure may affect the better fit; verify final provider terms before enrolling."
    },
    {
      label: "Platform",
      left: left.platform,
      right: right.platform,
      interpretation:
        left.platform === right.platform
          ? "Both courses are delivered on the same platform experience."
          : "Platform preference, account access, and certificate handling may differ."
    },
    {
      label: "Duration",
      left: left.durationText,
      right: right.durationText,
      interpretation:
        left.durationText === right.durationText
          ? "Time commitment appears similar from the catalog data."
          : "Time commitment may be a deciding factor; verify workload on the provider page."
    },
    {
      label: "Level",
      left: left.level,
      right: right.level,
      interpretation:
        left.level === right.level
          ? "Both courses target the same learner level."
          : "Choose the level that matches your current background."
    },
    {
      label: "Language",
      left: left.language,
      right: right.language,
      interpretation:
        left.language === right.language
          ? "Language does not differentiate these options."
          : "Language may affect accessibility and completion."
    },
    {
      label: "Certificate",
      left: formatCertificate(left),
      right: formatCertificate(right),
      interpretation:
        left.certificate === right.certificate
          ? "Certificate visibility is similar, but terms may change."
          : "Certificate availability differs in the catalog; verify provider terms before choosing."
    },
    {
      label: "Rating",
      left: left.rating == null ? "Rating not available" : left.rating.toFixed(1),
      right: right.rating == null ? "Rating not available" : right.rating.toFixed(1),
      interpretation:
        left.rating == null || right.rating == null
          ? "Skills Compare does not yet have complete social-proof data for this comparison."
          : "Ratings are available, but should not be the only decision factor."
    },
    {
      label: "Learning topics",
      left: summarizeBullets(left.syllabusBullets, "Learning topics not available"),
      right: summarizeBullets(right.syllabusBullets, "Learning topics not available"),
      interpretation: "Compare whether the listed topics match what you actually want to learn."
    },
    {
      label: "Prerequisites",
      left: summarizeBullets(left.prerequisitesBullets, "Prerequisites not available"),
      right: summarizeBullets(right.prerequisitesBullets, "Prerequisites not available"),
      interpretation: "Check whether each course fits your starting point before enrolling."
    }
  ];

  return rows.map((row) => ({
    ...row,
    status: rowStatus(row.left, row.right)
  }));
};

export const getPendingDataRisks = (items: Course[]) => {
  const risks = new Set<string>();

  items.forEach((course) => {
    if (isExactPricePending(course)) {
      risks.add(`${course.title}: exact price/subscription terms should be verified on the provider page.`);
    }
    if (isDurationPending(course)) {
      risks.add(`${course.title}: duration or workload is pending verification.`);
    }
    if (course.rating == null || course.reviewCount == null) {
      risks.add(`${course.title}: rating/review count is unavailable in Skills Compare.`);
    }
    if (!course.certificate) {
      risks.add(`${course.title}: certificate availability or terms should be verified.`);
    }
    if (course.prerequisitesBullets.length === 0) {
      risks.add(`${course.title}: prerequisites should be checked on the provider page.`);
    }
    if (course.syllabusBullets.length === 0) {
      risks.add(`${course.title}: current syllabus should be verified on the provider page.`);
    }
  });

  risks.add("Provider details may change after catalog review, including price, duration, certificate terms, and availability.");

  return Array.from(risks);
};

export const getVerifyBeforeEnrollingItems = (course: Course) => [
  isExactPricePending(course)
    ? "Confirm exact price, trial terms, and subscription renewal before enrolling."
    : "Confirm the listed price model is still current on the provider page.",
  course.certificate
    ? "Check certificate terms, eligibility, and whether payment is required."
    : "Verify whether a certificate is available and under what terms.",
  isDurationPending(course)
    ? "Check duration and weekly workload before committing."
    : `Confirm the listed duration still matches the provider page: ${course.durationText}.`,
  course.prerequisitesBullets.length > 0
    ? "Review prerequisites and make sure they match your current background."
    : "Check prerequisites on the provider page before enrolling.",
  course.syllabusBullets.length > 0
    ? "Review current syllabus topics on the provider page before enrolling."
    : "Check current course content and syllabus on the provider page."
];
