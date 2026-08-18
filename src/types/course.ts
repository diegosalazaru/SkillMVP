export type Course = {
  id: string;
  title: string;
  platform: "Coursera" | "Udemy" | "Microsoft Learn" | "edX";
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
      | "costModel",
      boolean
    >
  >;
};
