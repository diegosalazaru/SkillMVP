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
      | "prerequisites",
      boolean
    >
  >;
};
