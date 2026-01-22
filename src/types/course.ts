export type Course = {
  id: string;
  title: string;
  platform: "Coursera" | "Udemy" | "Microsoft Learn" | "edX";
  skillTags: string[];
  level: "Beginner" | "Intermediate" | "Advanced";
  priceType: "free" | "paid";
  priceText: string;
  durationText: string;
  rating?: number;
  language: string;
  certificate: boolean;
  shortDescription: string;
  syllabusBullets: string[];
  prerequisitesBullets: string[];
  externalUrl: string;
};
