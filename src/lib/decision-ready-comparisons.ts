import decisionGradeManifest from "../../data/decision-grade-manifest.json";
import { courses } from "@/lib/catalog-adapter";
import {
  buildComparisonRows,
  getPairDecisionReadiness,
  type ComparisonRow
} from "@/lib/decision-support";
import { slugify } from "@/utils/slugify";
import type { Course } from "@/types/course";

type ManifestPair = [string, string];

type DecisionGuideCourse = Pick<Course, "id" | "title" | "platform"> & {
  detailHref: string;
};

export type DecisionGuideRow = Pick<
  ComparisonRow,
  "label" | "left" | "right" | "interpretation"
>;

export type DecisionReadyPair = {
  key: string;
  compareHref: string;
  left: DecisionGuideCourse;
  right: DecisionGuideCourse;
  differences: DecisionGuideRow[];
  uncertainties: DecisionGuideRow[];
};

const manifestPairs = decisionGradeManifest.readinessPairs as ManifestPair[];
const coursesById = new Map(courses.map((course) => [course.id, course]));

const DECISION_GUIDE_PRIORITY = [
  "Verified pricing",
  "Offering / credential",
  "Starting point",
  "Workload",
  "Cost model",
  "Learning topics",
  "Tools / technologies",
  "Practical work"
] as const;

const decisionPriority = new Map<string, number>(
  DECISION_GUIDE_PRIORITY.map((label, index) => [label, index])
);

const byDecisionPriority = (left: ComparisonRow, right: ComparisonRow) =>
  (decisionPriority.get(left.label) ?? DECISION_GUIDE_PRIORITY.length) -
  (decisionPriority.get(right.label) ?? DECISION_GUIDE_PRIORITY.length);

const toGuideCourse = (course: Course): DecisionGuideCourse => ({
  id: course.id,
  title: course.title,
  platform: course.platform,
  detailHref: `/courses/${course.id}`
});

const hasSkill = (course: Course, skillSlug: string) =>
  course.skillTags.some((tag) => slugify(tag) === skillSlug);

const buildDecisionReadyPair = (
  left: Course,
  right: Course
): DecisionReadyPair | null => {
  if (!getPairDecisionReadiness(left, right).passes) {
    return null;
  }

  const rows = buildComparisonRows(left, right);

  return {
    key: `${left.id}--${right.id}`,
    compareHref: `/compare?ids=${left.id},${right.id}`,
    left: toGuideCourse(left),
    right: toGuideCourse(right),
    differences: rows
      .filter((row) => row.status === "Different")
      .sort(byDecisionPriority)
      .slice(0, 4),
    uncertainties: rows
      .filter((row) => row.status === "Insufficient data")
      .sort(byDecisionPriority)
  };
};

export const getDecisionReadyPairsForSkill = (
  skillSlug: string
): DecisionReadyPair[] =>
  manifestPairs.flatMap(([leftId, rightId]) => {
    const left = coursesById.get(leftId);
    const right = coursesById.get(rightId);

    if (
      !left ||
      !right ||
      !hasSkill(left, skillSlug) ||
      !hasSkill(right, skillSlug)
    ) {
      return [];
    }

    const pair = buildDecisionReadyPair(left, right);
    return pair ? [pair] : [];
  });

export const getDecisionReadySkillSlugs = (): string[] => {
  const slugs = new Set<string>();

  manifestPairs.forEach(([leftId, rightId]) => {
    const left = coursesById.get(leftId);
    const right = coursesById.get(rightId);

    if (!left || !right || !getPairDecisionReadiness(left, right).passes) {
      return;
    }

    left.skillTags.forEach((tag) => {
      const slug = slugify(tag);
      if (hasSkill(right, slug)) {
        slugs.add(slug);
      }
    });
  });

  return [...slugs];
};

export const getDecisionReadySkillIntro = ({
  courseCount,
  pairCount,
  skillTitle
}: {
  courseCount: number;
  pairCount: number;
  skillTitle: string;
}) =>
  `Compare ${courseCount} ${skillTitle} courses, then open ${pairCount} comparison-ready ${
    pairCount === 1 ? "pair" : "pairs"
  } to inspect source-backed pricing, workload, credentials, starting points, and known data gaps.`;
