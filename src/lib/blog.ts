export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  sections: { heading: string; points: string[] }[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: "how-to-choose-between-two-courses",
    title: "How to choose between two courses",
    description: "A practical guide to compare two courses without assumptions and decide faster.",
    sections: [
      { heading: "1) Define your decision criteria", points: ["Compare total real price.", "Compare weekly time and total duration.", "Verify whether the certificate is included or paid."] },
      { heading: "2) Review verified differences", points: ["If the level is the same, focus on duration and certificate.", "If the platform changes, check language and format.", "Avoid deciding based on opinions without comparable data."] }
    ]
  },
  {
    slug: "what-to-compare-before-paying-for-a-course",
    title: "What to compare before paying for a course",
    description: "A concrete checklist to pay for a course with more clarity.",
    sections: [
      { heading: "Before you pay", points: ["Price model: one-time payment, subscription, or separate certificate.", "Estimated duration to complete the course.", "Declared level and whether it matches your starting point."] },
      { heading: "Before enrolling", points: ["Review official syllabus and update date.", "Confirm access limits and cancellation terms.", "Check language and subtitles availability."] }
    ]
  },
  {
    slug: "free-vs-paid-courses-what-really-changes",
    title: "Free vs paid courses: what really changes",
    description: "A simple comparison to understand when a free or paid course fits better.",
    sections: [
      { heading: "What usually changes", points: ["Certificate: in many cases it requires payment.", "Support or mentoring: this can vary by platform.", "Commitment: paying may improve consistency, but not quality by itself."] },
      { heading: "How to decide", points: ["If you need proof of learning, check certificate and total cost.", "If you want to explore a skill, start with a free option.", "Always compare duration, level, and language before deciding."] }
    ]
  }
];

export const getBlogPost = (slug: string) =>
  blogPosts.find((post) => post.slug === slug) ?? null;
