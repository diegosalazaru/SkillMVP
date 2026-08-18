import type { Course } from "@/types/course";

export type RowStatus = "Same" | "Different" | "Insufficient data";

export type ComparisonRow = {
  label: string;
  left: string;
  right: string;
  status: RowStatus;
  interpretation: string;
};

export const CORE_DECISION_DIMENSIONS = [
  { key: "offeringCredential", label: "Offering / credential type" },
  { key: "workload", label: "Workload / time commitment" },
  { key: "startingPoint", label: "Prerequisites / starting point" },
  { key: "learningTopics", label: "Learning topics" },
  { key: "toolsTechnologies", label: "Tools / technologies" },
  { key: "practicalWork", label: "Practical work / projects / labs" },
  { key: "costModel", label: "Cost model context" }
] as const;

export type CoreDecisionDimension = (typeof CORE_DECISION_DIMENSIONS)[number]["key"];

export type PricingOption = NonNullable<Course["pricingOptions"]>[number];

const normalize = (value: string) => value.trim().toLowerCase();

type VerifiedField = keyof NonNullable<Course["verifiedFields"]>;

const isFieldVerified = (course: Course, field: VerifiedField) =>
  course.verifiedFields?.[field] === true;

export const isDurationPending = (course: Course) =>
  !(
    (isFieldVerified(course, "workload") && course.workload != null) ||
    (isFieldVerified(course, "duration") && course.durationHours != null)
  );

export const isCostModelPending = (course: Course) =>
  !isFieldVerified(course, "costModel") || course.costModel == null;

export const getActionablePricingOptions = (course: Course) =>
  isFieldVerified(course, "price") && isFieldVerified(course, "pricingOptions")
    ? (course.pricingOptions ?? []).filter(
        (option) =>
          option.amount > 0 &&
          option.normalizedUsdAmount > 0 &&
          option.evidenceUrls.length > 0 &&
          Boolean(option.observedAt)
      )
    : [];

export const isExactPricePending = (course: Course) =>
  getActionablePricingOptions(course).length === 0 &&
  (!isFieldVerified(course, "price") ||
    course.priceModel === "unknown" ||
    (course.priceModel !== "free" &&
      (course.priceAmount == null ||
        !course.currency ||
        (course.priceModel === "subscription" && course.priceInterval == null))));

const formatUsd = (amount: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: Number.isInteger(amount) ? 0 : 2
  }).format(amount);

export const formatPricingOption = (option: PricingOption) => {
  const approximation =
    option.normalizationBasis === "currency_converted" ? "≈ " : "";
  const cadence = {
    one_time: " total",
    month: "/month",
    year: "/year",
    other: ""
  }[option.cadence];

  return `${approximation}${formatUsd(option.normalizedUsdAmount)}${cadence} — ${option.scope}`;
};

export const formatCoursePricing = (course: Course) => {
  const pricingOptions = getActionablePricingOptions(course);

  return pricingOptions.length > 0
    ? pricingOptions.map(formatPricingOption).join("; ")
    : course.priceText;
};

const equalPricingOptions = (left: PricingOption[], right: PricingOption[]) =>
  left.length === right.length &&
  left.every((leftOption, index) => {
    const rightOption = right[index];

    return (
      rightOption != null &&
      leftOption.normalizedUsdAmount === rightOption.normalizedUsdAmount &&
      leftOption.cadence === rightOption.cadence &&
      leftOption.model === rightOption.model &&
      normalize(leftOption.scope) === normalize(rightOption.scope)
    );
  });

export const formatCertificate = (course: Course) =>
  course.certificate === true
    ? "Certificate availability shown"
    : course.certificate === false
      ? "No certificate shown"
      : "Certificate availability not verified";

export const summarizeBullets = (items: string[], fallback: string) =>
  items.length > 0 ? items.slice(0, 3).join("; ") : fallback;

const formatOfferingType = (course: Course) => {
  const labels = {
    course: "Course",
    specialization: "Specialization",
    professional_certificate: "Professional Certificate",
    other: "Other provider-described format"
  } as const;

  return course.offeringType ? labels[course.offeringType] : "Offering type not verified";
};

const formatOfferingCredential = (course: Course) =>
  course.credential
    ? `${formatOfferingType(course)} · ${course.credential.text}`
    : `${formatOfferingType(course)} · Credential context not verified`;

const formatStartingPoint = (course: Course) =>
  `${course.level} level · ${summarizeBullets(
    course.prerequisitesBullets,
    "Starting point not verified"
  )}`;

export const getDecisionReadiness = (course: Course): Record<CoreDecisionDimension, boolean> => ({
  offeringCredential:
    isFieldVerified(course, "offeringType") &&
    isFieldVerified(course, "credential") &&
    course.offeringType != null &&
    course.credential != null,
  workload: !isDurationPending(course),
  startingPoint:
    isFieldVerified(course, "level") &&
    course.level !== "Unknown" &&
    isFieldVerified(course, "prerequisites") &&
    course.prerequisitesBullets.length > 0,
  learningTopics: isFieldVerified(course, "syllabus") && course.syllabusBullets.length > 0,
  toolsTechnologies:
    isFieldVerified(course, "toolsTechnologies") &&
    (course.toolsTechnologies?.length ?? 0) > 0,
  practicalWork:
    isFieldVerified(course, "practicalWork") &&
    (course.practicalWorkBullets?.length ?? 0) > 0,
  costModel: !isCostModelPending(course)
});

export const getPairDecisionReadiness = (left: Course, right: Course) => {
  const leftReadiness = getDecisionReadiness(left);
  const rightReadiness = getDecisionReadiness(right);
  const sourceBackedForBoth = CORE_DECISION_DIMENSIONS.filter(
    ({ key }) => leftReadiness[key] && rightReadiness[key]
  );
  const pricingReady = [left, right].every(
    (course) => getActionablePricingOptions(course).length > 0
  );

  return {
    pricingReady,
    sourceBackedForBoth,
    insufficient: CORE_DECISION_DIMENSIONS.filter(
      ({ key }) => !(leftReadiness[key] && rightReadiness[key])
    ),
    passes: pricingReady && sourceBackedForBoth.length >= 5
  };
};

export const getCourseFitBullets = (course: Course) => {
  const bullets = [
    course.level === "Unknown"
      ? "You are comfortable verifying the intended learner level."
      : `You want a ${course.level}-level course.`,
    course.credential && isFieldVerified(course, "credential")
      ? `You want this credential context: ${course.credential.text}.`
      : course.certificate === true
        ? "You want certificate availability to be visible before opening the provider page."
      : "You are comfortable verifying certificate availability on the provider page.",
    isDurationPending(course)
      ? "You are comfortable verifying duration and workload before committing."
      : `You can assess the provider-described workload: ${course.durationText}.`,
    isExactPricePending(course)
      ? "You are comfortable confirming final price or subscription terms on the provider page."
      : `You can evaluate the verified commitment: ${formatCoursePricing(course)}.`,
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
    course.credential && isFieldVerified(course, "credential")
      ? `Credential: ${course.credential.text}.`
      : formatCertificate(course),
    isDurationPending(course)
      ? "Workload is pending verification."
      : `Provider-described workload: ${course.durationText}.`,
    isExactPricePending(course)
      ? "Exact actionable pricing is pending verification."
      : `Verified pricing: ${formatCoursePricing(course)}.`
  ];

  const pending = [
    course.rating == null ? "Rating/review count is not available in Skills Compare." : null,
    isExactPricePending(course)
      ? "Exact price or subscription terms must be verified on the provider page."
      : null,
    isDurationPending(course) ? "Workload must be checked before committing time." : null,
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
      ? "Workload pending: check weekly workload and total time commitment on the provider page."
      : null,
    course.certificate == null || !isFieldVerified(course, "certificate")
      ? "Certificate status pending: verify whether a certificate is available and under what terms."
      : null
  ].filter((item): item is string => item !== null);

  return impacts.length > 0
    ? impacts
    : ["No major pending catalog fields are currently flagged, but provider details may still change."];
};

export const getDecisionSummary = (left: Course, right: Course) => {
  const rows = buildComparisonRows(left, right);
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
      "Compare the verified payment amount, renewal cadence, and what each path covers.",
      "Choose based on your current level, time commitment, and need for certificate visibility.",
      "Use provider checkout to confirm the final transaction and regional terms.",
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

type RawComparisonRow = Omit<ComparisonRow, "status" | "interpretation"> & {
  comparable: boolean;
  equal: boolean;
  sameInterpretation: string;
  differentInterpretation: string;
  uncertainInterpretation: string;
};

export const buildComparisonRows = (left: Course, right: Course): ComparisonRow[] => {
  const bothHaveDecisionDataV2 = [left, right].every(
    (course) =>
      course.offeringType != null ||
      course.workload != null ||
      course.credential != null ||
      course.costModel != null ||
      (course.toolsTechnologies?.length ?? 0) > 0 ||
      (course.practicalWorkBullets?.length ?? 0) > 0
  );

  const leftPricingOptions = getActionablePricingOptions(left);
  const rightPricingOptions = getActionablePricingOptions(right);
  const pricingRow: RawComparisonRow = {
    label: "Verified pricing",
    left: formatCoursePricing(left),
    right: formatCoursePricing(right),
    comparable:
      (leftPricingOptions.length > 0 && rightPricingOptions.length > 0) ||
      (!isExactPricePending(left) && !isExactPricePending(right)),
    equal:
      leftPricingOptions.length > 0 && rightPricingOptions.length > 0
        ? equalPricingOptions(leftPricingOptions, rightPricingOptions)
        : left.priceModel === right.priceModel &&
          left.priceAmount === right.priceAmount &&
          left.currency === right.currency &&
          left.priceInterval === right.priceInterval,
    sameInterpretation:
      "Verified amount, cadence, payment model, and scope match for the displayed paths.",
    differentInterpretation:
      "The verified commitments differ in amount, cadence, payment model, scope, or available paths.",
    uncertainInterpretation:
      "Actionable source-backed pricing is unavailable for one or both options."
  };

  const rows: RawComparisonRow[] = bothHaveDecisionDataV2
    ? [
        pricingRow,
        {
          label: "Offering / credential",
          left: formatOfferingCredential(left),
          right: formatOfferingCredential(right),
          comparable:
            getDecisionReadiness(left).offeringCredential &&
            getDecisionReadiness(right).offeringCredential,
          equal:
            left.offeringType === right.offeringType &&
            left.credential?.type === right.credential?.type &&
            normalize(left.credential?.text ?? "") ===
              normalize(right.credential?.text ?? ""),
          sameInterpretation: "The verified offering and credential formats are equivalent.",
          differentInterpretation: "You are choosing different program or credential formats.",
          uncertainInterpretation: "Offering or credential context is not verified for both options."
        },
        {
          label: "Workload",
          left: left.durationText,
          right: right.durationText,
          comparable: !isDurationPending(left) && !isDurationPending(right),
          equal: normalize(left.durationText) === normalize(right.durationText),
          sameInterpretation: "Provider-described workload does not differentiate these options.",
          differentInterpretation: "Provider-described pace or time commitment differs.",
          uncertainInterpretation: "Comparable provider-described workload is unavailable."
        },
        {
          label: "Starting point",
          left: formatStartingPoint(left),
          right: formatStartingPoint(right),
          comparable:
            getDecisionReadiness(left).startingPoint &&
            getDecisionReadiness(right).startingPoint,
          equal:
            left.level === right.level &&
            equalStringArrays(left.prerequisitesBullets, right.prerequisitesBullets),
          sameInterpretation: "Verified starting-point requirements substantially match.",
          differentInterpretation: "Choose the verified starting point that matches your background.",
          uncertainInterpretation: "Prerequisites or no-experience guidance is not verified for both options."
        },
        {
          label: "Learning topics",
          left: summarizeBullets(left.syllabusBullets, "Learning topics not available"),
          right: summarizeBullets(right.syllabusBullets, "Learning topics not available"),
          comparable:
            getDecisionReadiness(left).learningTopics &&
            getDecisionReadiness(right).learningTopics,
          equal: equalStringArrays(left.syllabusBullets, right.syllabusBullets),
          sameInterpretation: "Verified learning topics substantially overlap in the catalog.",
          differentInterpretation: "Compare which verified topics match what you want to learn.",
          uncertainInterpretation: "Learning topics are not verified for both options."
        },
        {
          label: "Tools / technologies",
          left: summarizeBullets(left.toolsTechnologies ?? [], "Tools not verified"),
          right: summarizeBullets(right.toolsTechnologies ?? [], "Tools not verified"),
          comparable:
            getDecisionReadiness(left).toolsTechnologies &&
            getDecisionReadiness(right).toolsTechnologies,
          equal: equalStringArrays(
            left.toolsTechnologies ?? [],
            right.toolsTechnologies ?? []
          ),
          sameInterpretation: "Verified named tools substantially overlap.",
          differentInterpretation: "The verified tool exposure differs between these options.",
          uncertainInterpretation: "Named tools are not verified for both options."
        },
        {
          label: "Practical work",
          left: summarizeBullets(left.practicalWorkBullets ?? [], "Practical work not verified"),
          right: summarizeBullets(right.practicalWorkBullets ?? [], "Practical work not verified"),
          comparable:
            getDecisionReadiness(left).practicalWork &&
            getDecisionReadiness(right).practicalWork,
          equal: equalStringArrays(
            left.practicalWorkBullets ?? [],
            right.practicalWorkBullets ?? []
          ),
          sameInterpretation: "Verified practical work substantially overlaps.",
          differentInterpretation: "The explicitly stated projects, labs, or applied work differ.",
          uncertainInterpretation: "Practical work is not verified for both options."
        },
        {
          label: "Cost model",
          left: left.costModel?.text ?? "Cost model not verified",
          right: right.costModel?.text ?? "Cost model not verified",
          comparable: !isCostModelPending(left) && !isCostModelPending(right),
          equal: left.costModel?.type === right.costModel?.type,
          sameInterpretation: "The verified cost model is the same; exact current prices may still vary.",
          differentInterpretation: "The verified payment or access terms differ.",
          uncertainInterpretation: "Cost-model context is not verified for both options."
        }
      ]
    : [
        pricingRow,
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
        }
      ];

  rows.push(
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
    }
  );

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

    rows.push({
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
  const observedDates = Array.from(
    new Set(
      items.flatMap((course) =>
        getActionablePricingOptions(course).map((option) => option.observedAt)
      )
    )
  ).sort();
  const risks = [
    items.some(isExactPricePending)
      ? "Exact price: current amount or subscription terms are not verified for one or both courses."
      : null,
    items.some(isDurationPending)
      ? "Workload: provider-described time commitment is unavailable for one or both courses."
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
    items.every((course) => !isExactPricePending(course)) && observedDates.length > 0
      ? `Pricing was checked ${observedDates.join(" and ")}; region, taxes, eligibility, and checkout terms may vary.`
      : null,
    "Provider details can change; confirm final checkout terms and availability before enrolling."
  ].filter((risk): risk is string => risk !== null);

  return risks;
};

export const getVerifyBeforeEnrollingItems = (course: Course) => [
  isExactPricePending(course)
    ? "Confirm exact price, trial terms, and subscription renewal before enrolling."
    : `Confirm the final checkout amount; pricing was observed ${getActionablePricingOptions(course)[0]?.observedAt ?? "on the provider page"}.`,
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
