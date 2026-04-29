import type { Course } from "@/types/course";

export type OutboundCourseClickSource = "card" | "detail" | "compare";

type OutboundCourseClickEvent = {
  eventName: "outbound_course_click";
  source: OutboundCourseClickSource;
  courseId: string;
  courseTitle: string;
  platform: Course["platform"];
  externalUrl: string;
  trackingMode: "local_console_only";
  occurredAt: string;
};

export const trackOutboundCourseClick = (
  course: Course,
  source: OutboundCourseClickSource
) => {
  if (typeof window === "undefined") {
    return;
  }

  const event: OutboundCourseClickEvent = {
    eventName: "outbound_course_click",
    source,
    courseId: course.id,
    courseTitle: course.title,
    platform: course.platform,
    externalUrl: course.externalUrl,
    trackingMode: "local_console_only",
    occurredAt: new Date().toISOString()
  };

  console.info("[outbound-course-click]", event);
};
