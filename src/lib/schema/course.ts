import { z } from "zod";

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
  source: z.enum(["manual", "edx", "coursera", "coursera-curated", "other"]),
});

export type Course = z.infer<typeof CourseSchema>;
