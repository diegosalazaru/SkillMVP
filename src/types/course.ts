export type Course = {
  id: string;
  title: string;
  platform: "Coursera" | "Udemy" | "Microsoft Learn" | "edX" | "Pluralsight";
  skillTags: string[];
  level: "Beginner" | "Intermediate" | "Advanced" | "Mixed" | "Unknown";
  priceModel: "free" | "paid_once" | "subscription" | "unknown";
  priceAmount: number | null;
  currency: string | null;
  priceInterval: "month" | "year" | null;
  priceText: string;
  durationHours?: number | null;
  durationText: string;
  rating?: number | null;
  reviewCount?: number | null;
  language: string;
  certificate: boolean | null;
  shortDescription: string | null;
  syllabusBullets: string[];
  prerequisitesBullets: string[];
  offeringType?: "course" | "specialization" | "professional_certificate" | "other" | null;
  workload?: {
    durationQuantity: number | null;
    durationUnit: "hour" | "day" | "week" | "month" | null;
    hoursPerWeek: number | null;
    text: string;
  } | null;
  toolsTechnologies?: string[];
  practicalWorkBullets?: string[];
  credential?: {
    type:
      | "course_certificate"
      | "specialization_certificate"
      | "professional_certificate"
      | "other";
    text: string;
  } | null;
  costModel?: {
    type: "free" | "one_time" | "subscription" | "paid_certificate" | "other";
    text: string;
  } | null;
  pricingOptions?: Array<{
    id: string;
    model: "one_time" | "subscription" | "platform_subscription" | "free_audit";
    amount: number;
    currency: string;
    normalizedUsdAmount: number;
    cadence: "one_time" | "month" | "year" | "other";
    scope: string;
    normalizationBasis: "provider_published_usd" | "currency_converted";
    actionUrl: string;
    evidenceUrls: string[];
    observedAt: string;
    referenceMarket: string | null;
    accessContext:
      | "public_provider_page"
      | "public_provider_checkout"
      | "account_visible_enrollment";
    conditions: string | null;
  }>;
  externalUrl: string;
  verifiedFields?: Partial<
    Record<
      | "platform"
      | "price"
      | "rating"
      | "reviewCount"
      | "duration"
      | "certificate"
      | "language"
      | "level"
      | "syllabus"
      | "prerequisites"
      | "offeringType"
      | "workload"
      | "toolsTechnologies"
      | "practicalWork"
      | "credential"
      | "costModel"
      | "pricingOptions",
      boolean
    >
  >;
};
