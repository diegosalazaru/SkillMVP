import type { Course } from "@/types/course";

export type RowStatus = "Same" | "Different" | "Insufficient data";

export type ComparisonRow = {
  label: string;
  left: string;
  right: string;
  status: RowStatus;
  interpretation: string;
};

const normalize = (value: string) => value.trim().toLowerCase();

type VerifiedField = keyof NonNullable<Course["verifiedFields"]>;

const isFieldVerified = (course: Course, field: VerifiedField) =>
  course.verifiedFields?.[field] === true;

export const isDurationPending = (course: Course) =>
  !isFieldVerified(course, "duration") || course.durationHours == null;

export const isExactPricePending = (course: Course) =>
  !isFieldVerified(course, "price") ||
  course.priceModel === "unknown" ||
  (course.priceModel !== "free" &&
    (course.priceAmount == null ||
      !course.currency ||
      (course.priceModel === "subscription" && course.priceInterval == null)));

export const formatCertificate = (course: Course) =>
  course.certificate === true
    ? "Certificate availability shown"
    : course.certificate === false
      ? "No certificate shown"
      : "Certificate availability not verified";

export const summarizeBullets = (items: string[], fallback: string) =>
  items.length > 0 ? items.slice(0, 3).join("; ") : fallback;

export const getCourseFitBullets = (course: Course) => {
  const bullets = [
    course.level === "Unknown"
      ? "You are comfortable verifying the intended learner level."
      : `You want a ${course.level}-level course.`,
    course.certificate === true
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
    course.level === "Unknown" || !isFieldVerified(course, "level")
      ? "Level is pending verification."
      : `Level: ${course.level}.`,
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
    course.certificate == null || !isFieldVerified(course, "certificate")
      ? "Certificate status pending: verify whether a certificate is available and under what terms."
      : null
  ].filter((item): item is string => item !== null);

  return impacts.length > 0
    ? impacts
    : ["No major pending catalog fields are currently flagged, but provider details may still change."];
};

export const getDecisionSummary = (
  left: Course,
  right: Course,
  leftPrice: string,
  rightPrice: string
) => {
  const rows = buildComparisonRows(left, right, leftPrice, rightPrice);
  const similarities = rows
    .filter((row) => row.status === "Same")
    .slice(0, 3)
    .map((row) => `${row.label}: both courses show ${row.left}.`);
  const differences = rows
    .filter((row) => row.status === "Different")
    .slice(0, 3)
    .map((row) => `${row.label}: ${row.left} vs ${row.right}.`);
  const uncertainLabels = rows
    .filter((row) => row.status === "Insufficient data")
    .map((row) => row.label.toLowerCase());

  return {
    similarities:
      similarities.length > 0
        ? similarities
        : ["No criteria currently have enough verified data to establish a meaningful sameness."],
    differences:
      differences.length > 0
        ? differences
        : ["No criteria currently have enough verified data to establish a meaningful difference."],
    uncertainty:
      uncertainLabels.length > 0
        ? [
            `Comparable data is insufficient for ${uncertainLabels.join(", ")}.`,
            "Those criteria are marked below so unknown values are not treated as matches or differences."
          ]
        : ["All displayed criteria have enough catalog evidence for a factual comparison."],
    fitFraming: [
      "Choose based on your current level, time commitment, and need for certificate visibility.",
      "Use the provider page to verify volatile details before enrolling.",
      "The comparison is factual and does not rank one course above the other."
    ]
  };
};

const rowStatus = (comparable: boolean, equal: boolean): RowStatus => {
  if (!comparable) {
    return "Insufficient data";
  }

  return equal ? "Same" : "Different";
};

const equalStringArrays = (left: string[], right: string[]) =>
  left.length === right.length &&
  left.every((value, index) => normalize(value) === normalize(right[index] ?? ""));

const formatSocialProof = (course: Course) => {
  const parts = [
    course.rating == null ? null : `Rating ${course.rating.toFixed(1)}`,
    course.reviewCount == null
      ? null
      : `${new Intl.NumberFormat("en").format(course.reviewCount)} reviews`
  ].filter((part): part is string => part !== null);

  return parts.length > 0 ? parts.join(" · ") : "Not available";
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
      comparable: !isExactPricePending(left) && !isExactPricePending(right),
      equal:
        left.priceModel === right.priceModel &&
        left.priceAmount === right.priceAmount &&
        left.currency === right.currency &&
        left.priceInterval === right.priceInterval,
      sameInterpretation: "Verified price data does not differentiate these options.",
      differentInterpretation: "Verified cost structure differs and may affect fit.",
      uncertainInterpretation: "Exact comparable pricing is unavailable; verify provider terms."
    },
    {
      label: "Platform",
      left: left.platform,
      right: right.platform,
      comparable: isFieldVerified(left, "platform") && isFieldVerified(right, "platform"),
      equal: left.platform === right.platform,
      sameInterpretation: "Both courses are delivered on the same platform experience.",
      differentInterpretation: "Platform preference, account access, and certificate handling may differ.",
      uncertainInterpretation: "Platform information is not verified for both courses."
    },
    {
      label: "Duration",
      left: left.durationText,
      right: right.durationText,
      comparable: !isDurationPending(left) && !isDurationPending(right),
      equal: left.durationHours === right.durationHours,
      sameInterpretation: "Verified total duration does not differentiate these options.",
      differentInterpretation: "Verified time commitment differs and may affect fit.",
      uncertainInterpretation: "Comparable total duration is unavailable; verify workload."
    },
    {
      label: "Level",
      left: left.level,
      right: right.level,
      comparable:
        isFieldVerified(left, "level") &&
        isFieldVerified(right, "level") &&
        left.level !== "Unknown" &&
        right.level !== "Unknown",
      equal: left.level === right.level,
      sameInterpretation: "Both courses target the same learner level.",
      differentInterpretation: "Choose the verified level that matches your background.",
      uncertainInterpretation: "Learner level is not verified for both courses."
    },
    {
      label: "Language",
      left: left.language,
      right: right.language,
      comparable:
        isFieldVerified(left, "language") &&
        isFieldVerified(right, "language") &&
        Boolean(left.language) &&
        Boolean(right.language),
      equal: normalize(left.language) === normalize(right.language),
      sameInterpretation: "Language does not differentiate these options.",
      differentInterpretation: "Language may affect accessibility and completion.",
      uncertainInterpretation: "Primary taught language is not verified for both courses."
    },
    {
      label: "Certificate",
      left: formatCertificate(left),
      right: formatCertificate(right),
      comparable:
        isFieldVerified(left, "certificate") &&
        isFieldVerified(right, "certificate") &&
        left.certificate != null &&
        right.certificate != null,
      equal: left.certificate === right.certificate,
      sameInterpretation: "Verified certificate availability is the same, but terms may change.",
      differentInterpretation: "Verified certificate availability differs; check provider terms.",
      uncertainInterpretation: "Certificate availability is not verified for both courses."
    },
    {
      label: "Learning topics",
      left: summarizeBullets(left.syllabusBullets, "Learning topics not available"),
      right: summarizeBullets(right.syllabusBullets, "Learning topics not available"),
      comparable:
        isFieldVerified(left, "syllabus") &&
        isFieldVerified(right, "syllabus") &&
        left.syllabusBullets.length > 0 &&
        right.syllabusBullets.length > 0,
      equal: equalStringArrays(left.syllabusBullets, right.syllabusBullets),
      sameInterpretation: "Verified learning topics substantially overlap in the catalog.",
      differentInterpretation: "Compare which verified topics match what you want to learn.",
      uncertainInterpretation: "Learning topics are not verified for both courses."
    },
    {
      label: "Prerequisites",
      left: summarizeBullets(left.prerequisitesBullets, "Prerequisites not available"),
      right: summarizeBullets(right.prerequisitesBullets, "Prerequisites not available"),
      comparable:
        isFieldVerified(left, "prerequisites") &&
        isFieldVerified(right, "prerequisites") &&
        left.prerequisitesBullets.length > 0 &&
        right.prerequisitesBullets.length > 0,
      equal: equalStringArrays(left.prerequisitesBullets, right.prerequisitesBullets),
      sameInterpretation: "Verified prerequisites do not differentiate these options.",
      differentInterpretation: "Check which verified prerequisites fit your starting point.",
      uncertainInterpretation: "Prerequisites are not verified for both courses."
    }
  ];

  const hasSocialProof = [left.rating, left.reviewCount, right.rating, right.reviewCount].some(
    (value) => value != null
  );

  if (hasSocialProof) {
    const sameShape =
      (left.rating == null) === (right.rating == null) &&
      (left.reviewCount == null) === (right.reviewCount == null);
    const presentFieldsVerified =
      (left.rating == null ||
        (isFieldVerified(left, "rating") && isFieldVerified(right, "rating"))) &&
      (left.reviewCount == null ||
        (isFieldVerified(left, "reviewCount") && isFieldVerified(right, "reviewCount")));

    rows.splice(6, 0, {
      label: "Rating / reviews",
      left: formatSocialProof(left),
      right: formatSocialProof(right),
      comparable: sameShape && presentFieldsVerified,
      equal: left.rating === right.rating && left.reviewCount === right.reviewCount,
      sameInterpretation: "Verified rating and review signals do not differentiate these options.",
      differentInterpretation: "Verified rating or review signals differ; treat them as context only.",
      uncertainInterpretation: "Comparable rating and review signals are unavailable."
    });
  }

  return rows.map(({ comparable, equal, sameInterpretation, differentInterpretation, uncertainInterpretation, ...row }) => {
    const status = rowStatus(comparable, equal);

    return {
      ...row,
      status,
      interpretation:
        status === "Same"
          ? sameInterpretation
          : status === "Different"
            ? differentInterpretation
            : uncertainInterpretation
    };
  });
};

export const getPendingDataRisks = (items: Course[]) => {
  const risks = [
    items.some(isExactPricePending)
      ? "Price: exact cost or subscription terms are not verified for one or both courses."
      : null,
    items.some(isDurationPending)
      ? "Duration: comparable total duration is unavailable for one or both courses."
      : null,
    items.some(
      (course) =>
        course.certificate == null || !isFieldVerified(course, "certificate")
    )
      ? "Certificate: availability is not verified for one or both courses."
      : null,
    items.some(
      (course) =>
        course.prerequisitesBullets.length === 0 ||
        !isFieldVerified(course, "prerequisites") ||
        course.syllabusBullets.length === 0 ||
        !isFieldVerified(course, "syllabus")
    )
      ? "Course details: verify any incomplete prerequisites or learning topics on the provider pages."
      : null,
    "Provider details can change; confirm current terms and availability before enrolling."
  ].filter((risk): risk is string => risk !== null);

  return risks;
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
