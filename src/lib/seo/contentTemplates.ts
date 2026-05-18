import { GeneratedSeoFaqItem, SeoPageTypeConfig } from "@/lib/seo/seoTypes";

type TemplateInput = {
  skillLabel: string;
  pageType: SeoPageTypeConfig;
  courseCount: number;
};

const PAGE_LABELS: Record<SeoPageTypeConfig["key"], string> = {
  "best-courses": "Compare",
  learn: "Learn",
  certification: "Certification",
  "for-beginners": "Beginner"
};

export const generateMeta = ({ skillLabel, pageType, courseCount }: TemplateInput) => ({
  title: `${PAGE_LABELS[pageType.key]} ${skillLabel} Courses`,
  metaDescription: `Explore ${courseCount} ${skillLabel} course option${courseCount === 1 ? "" : "s"} for ${pageType.intent.replace("-", " ")} and compare format, level, certificate availability, and pricing details.`
});

export const generateH1 = ({ skillLabel, pageType }: Omit<TemplateInput, "courseCount">) => {
  if (pageType.key === "best-courses") return `Compare ${skillLabel} Courses`;
  if (pageType.key === "learn") return `Learn ${skillLabel}`;
  if (pageType.key === "certification") return `${skillLabel} Certification Courses`;
  return `${skillLabel} Courses for Beginners`;
};

export const generateIntro = ({ skillLabel, pageType, courseCount }: TemplateInput) =>
  `This page lists ${courseCount} ${skillLabel} course option${courseCount === 1 ? "" : "s"} from the current Skills Compare catalog for ${pageType.intent.replace("-", " ")}. Use the course details to review level, duration, certificate availability, and pricing model before enrolling.`;

export const generateFAQ = ({ skillLabel }: Omit<TemplateInput, "pageType" | "courseCount">): GeneratedSeoFaqItem[] => [
  {
    question: `How should I choose a ${skillLabel} course?`,
    answer:
      "Compare course level, duration, language, pricing model, and certificate availability. Then verify the full syllabus and requirements on the provider website."
  },
  {
    question: `Do all ${skillLabel} courses include a certificate?`,
    answer:
      "No. Certificate availability depends on each provider and course plan. Check the course details and provider page before enrolling."
  },
  {
    question: `Are these ${skillLabel} course details final?`,
    answer:
      "Course information can change. Always confirm current pricing, duration, and certificate terms on the provider website."
  }
];
