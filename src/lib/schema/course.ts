import { z } from "zod";

const WorkloadSchema = z.object({
  durationQuantity: z.number().positive().nullable(),
  durationUnit: z.enum(["hour", "day", "week", "month"]).nullable(),
  hoursPerWeek: z.number().positive().nullable(),
  text: z.string().min(1)
});

const CredentialSchema = z.object({
  type: z.enum([
    "course_certificate",
    "specialization_certificate",
    "professional_certificate",
    "other"
  ]),
  text: z.string().min(1)
});

const CostModelSchema = z.object({
  type: z.enum(["free", "one_time", "subscription", "paid_certificate", "other"]),
  text: z.string().min(1)
});

const PricingOptionSchema = z.object({
  id: z.string().min(1),
  model: z.enum(["one_time", "subscription", "platform_subscription", "free_audit"]),
  amount: z.number().nonnegative(),
  currency: z.string().length(3),
  normalizedUsdAmount: z.number().nonnegative(),
  cadence: z.enum(["one_time", "month", "year", "other"]),
  scope: z.string().min(1),
  normalizationBasis: z.enum(["provider_published_usd", "currency_converted"]),
  actionUrl: z.string().url(),
  evidenceUrls: z.array(z.string().url()).min(1),
  observedAt: z.string().date(),
  referenceMarket: z.string().min(1).nullable(),
  accessContext: z.enum([
    "public_provider_page",
    "public_provider_checkout",
    "account_visible_enrollment"
  ]),
  conditions: z.string().min(1).nullable()
});

export const CourseSchema = z.object({
  id: z.string(),
  platform: z.string(),
  title: z.string(),
  url: z.string().url(),
  skillSlug: z.string(),
  level: z.enum(["beginner", "intermediate", "advanced", "mixed", "unknown"]),
  durationHours: z.number().nullable(),
  language: z.string(),
  priceModel: z.enum(["free", "paid_once", "subscription", "unknown"]),
  priceAmount: z.number().nullable(),
  currency: z.string().nullable(),
  priceInterval: z.enum(["month", "year"]).nullable(),
  rating: z.number().nullable(),
  reviewCount: z.number().nullable(),
  certificate: z.boolean().nullable(),
  lastUpdatedAt: z.string().datetime().nullable(),
  shortDescription: z.string().nullable(),
  syllabusBullets: z.array(z.string()).default([]),
  prerequisitesBullets: z.array(z.string()).default([]),
  offeringType: z
    .enum(["course", "specialization", "professional_certificate", "other"])
    .nullable()
    .default(null),
  workload: WorkloadSchema.nullable().default(null),
  toolsTechnologies: z.array(z.string()).default([]),
  practicalWorkBullets: z.array(z.string()).default([]),
  credential: CredentialSchema.nullable().default(null),
  costModel: CostModelSchema.nullable().default(null),
  pricingOptions: z.array(PricingOptionSchema).default([]),
  source: z.enum(["manual", "edx", "coursera", "coursera-curated", "other"]),
});

export type Course = z.infer<typeof CourseSchema>;
