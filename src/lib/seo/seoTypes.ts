export type SeoSkillConfig = {
  slug: string;
  label: string;
};

export type SeoPageTypeConfig = {
  key: "best-courses" | "learn" | "certification" | "for-beginners";
  pathPattern: string;
  intent: string;
};

export type GeneratedSeoFaqItem = {
  question: string;
  answer: string;
};

export type GeneratedSeoPage = {
  slug: string;
  skillSlug: string;
  skillLabel: string;
  pageType: SeoPageTypeConfig["key"];
  intent: string;
  title: string;
  metaDescription: string;
  h1: string;
  intro: string;
  faq: GeneratedSeoFaqItem[];
  courseIds: string[];
};
