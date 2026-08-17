export type BlogSection = {
  heading: string;
  points: string[];
};

export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  intro: string;
  sections: BlogSection[];
  commonMistakes: string[];
  internalLinks: { href: string; label: string }[];
  checklist: string[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: "how-to-choose-between-two-courses",
    title: "How to choose between two courses",
    description:
      "A practical framework to compare two online courses with clear criteria and fewer regrets.",
    intro:
      "When two courses look similar, it helps to compare them with the same structure instead of relying on marketing copy. This guide shows a short process you can use in under 20 minutes before you enroll.",
    sections: [
      {
        heading: "1) Start with your outcome and constraints",
        points: [
          "Write one concrete outcome, such as building a portfolio project or preparing for a role transition.",
          "Set your weekly study capacity first (for example, 4 hours per week) so duration is realistic.",
          "Define your maximum budget, including certificate cost if proof of completion matters to you."
        ]
      },
      {
        heading: "2) Compare total cost, not just the headline price",
        points: [
          "A free course can still require payment for graded assignments or certificates.",
          "Subscriptions can become more expensive than one-time payments if completion takes longer than planned.",
          "Use the compare view to verify whether each option is free, subscription-based, or one-time paid."
        ]
      },
      {
        heading: "3) Check duration against your real schedule",
        points: [
          "If one option is 12 hours and another is 40 hours, they are different commitments even if topics overlap.",
          "Shorter courses can work better when you need momentum, while longer ones may be better for depth.",
          "If duration is unverified, treat that as uncertainty and validate directly on the provider page."
        ]
      },
      {
        heading: "4) Match level and certificate expectations",
        points: [
          "Beginner courses are best when you are changing domains; advanced courses are more useful when foundations are already strong.",
          "Certificate status should be verified before purchase if you need formal proof for hiring or internal promotion.",
          "Example: choose a beginner option with clear certificate details over an advanced option without them when proof is mandatory."
        ]
      }
    ],
    commonMistakes: [
      "Choosing based on platform reputation alone without checking level fit.",
      "Ignoring total time commitment and dropping the course halfway.",
      "Assuming certificates are included by default.",
      "Comparing courses without opening provider pages for the latest terms."
    ],
    internalLinks: [
      { href: "/compare", label: "Open side-by-side comparison" },
      { href: "/skills/data-analysis", label: "Browse Data Analysis courses" },
      { href: "/skills/project-management", label: "Browse Project Management courses" },
      { href: "/", label: "Return to skills discovery" }
    ],
    checklist: [
      "I can explain my learning outcome in one sentence.",
      "I verified total cost and certificate terms for both options.",
      "The course duration fits my weekly schedule.",
      "The level matches my current starting point."
    ]
  },
  {
    slug: "what-to-compare-before-paying-for-a-course",
    title: "What to compare before paying for a course",
    description:
      "A decision checklist to review before paying, so your budget and time are aligned with the course.",
    intro:
      "Paying for a course is easier than finishing one. Before checkout, compare the factors that most often lead to poor learning outcomes: unclear level match, underestimated time, and hidden certificate costs.",
    sections: [
      {
        heading: "1) Validate payment model and true total",
        points: [
          "Identify whether the course is one-time paid, subscription, or free with optional paid certificate.",
          "For subscriptions, estimate total spend based on your likely completion pace.",
          "If price is unverified, do not assume discount or final amount—confirm on the provider page."
        ]
      },
      {
        heading: "2) Evaluate time-to-completion risk",
        points: [
          "Duration matters only when paired with your weekly availability.",
          "Example: a 30-hour course can be realistic in 6 weeks at 5 hours/week, but risky at 1 hour/week.",
          "Courses with missing duration should be treated as higher planning risk."
        ]
      },
      {
        heading: "3) Confirm content fit before checkout",
        points: [
          "Read syllabus bullets and prerequisites to avoid paying for material that is too basic or too advanced.",
          "If your goal is job-ready output, prioritize practical assignments over broad theory-only outlines.",
          "Use course detail pages to check whether key facts are verified or still pending."
        ]
      },
      {
        heading: "4) Compare platform experience and support",
        points: [
          "Platform differences can affect pacing, accessibility, and learner support.",
          "Check language availability and subtitle options early if English is not your first language.",
          "If two courses are close on cost and level, platform experience is often the tie-breaker."
        ]
      }
    ],
    commonMistakes: [
      "Paying first, then realizing the prerequisites were not a fit.",
      "Comparing only discounts, not total subscription cost.",
      "Skipping language and subtitle checks.",
      "Treating missing data as a positive signal instead of uncertainty."
    ],
    internalLinks: [
      { href: "/compare", label: "Compare two selected courses" },
      { href: "/skills/ai", label: "Explore AI learning paths" },
      { href: "/skills/cloud-computing", label: "Explore Cloud Computing courses" },
      { href: "/", label: "Start from the catalog" }
    ],
    checklist: [
      "I verified payment model, certificate terms, and total expected spend.",
      "I estimated completion time using my real weekly availability.",
      "I reviewed prerequisites and key syllabus points.",
      "I compared at least two options before paying."
    ]
  },
  {
    slug: "free-vs-paid-courses-what-really-changes",
    title: "Free vs paid courses: what really changes",
    description:
      "A realistic comparison of free and paid online courses, with practical criteria for choosing each path.",
    intro:
      "Free and paid courses can both be useful, but they solve different problems. The right choice depends on your objective, timeline, and whether you need verified proof of completion.",
    sections: [
      {
        heading: "1) What free options do well",
        points: [
          "Great for exploration when you are still deciding whether a skill is relevant to your goals.",
          "Lower financial risk lets you test interest before committing.",
          "Good starting point for broad topics like AI, data analysis, or cybersecurity fundamentals."
        ]
      },
      {
        heading: "2) What paid options can add",
        points: [
          "Paid tracks may include structured assessments, graded projects, or certificate options.",
          "A financial commitment can improve consistency for some learners, but it does not guarantee better outcomes.",
          "If certificate credibility matters, verify whether it is included or requires separate payment."
        ]
      },
      {
        heading: "3) Decision criteria that matter most",
        points: [
          "Choose based on level fit, expected duration, and language support before looking at promotions.",
          "Compare total cost over expected completion time, especially for subscriptions.",
          "Use side-by-side comparison to spot meaningful differences instead of relying on course titles."
        ]
      },
      {
        heading: "4) Example decision paths",
        points: [
          "If you are exploring a new field, begin with a free course and then upgrade only if you need deeper projects or certification.",
          "If you need proof for your resume this quarter, a paid course with clear certificate details may be safer.",
          "If time is limited, prioritize the option with clear duration and realistic weekly pacing."
        ]
      }
    ],
    commonMistakes: [
      "Assuming paid always means better teaching quality.",
      "Treating free courses as low value without checking syllabus depth.",
      "Ignoring total subscription cost when completion takes longer.",
      "Choosing a certificate path without confirming verification status."
    ],
    internalLinks: [
      { href: "/skills/cybersecurity", label: "Browse Cybersecurity options" },
      { href: "/skills/ai", label: "Browse AI courses" },
      { href: "/compare", label: "Use comparison view" },
      { href: "/", label: "Review all skill categories" }
    ],
    checklist: [
      "I know whether my goal is exploration, portfolio output, or certification.",
      "I compared total cost and completion timeline, not just free vs paid labels.",
      "I confirmed certificate requirements before deciding.",
      "I picked a course whose level and language match my current needs."
    ]
  }
];

export const getBlogPost = (slug: string) =>
  blogPosts.find((post) => post.slug === slug) ?? null;
