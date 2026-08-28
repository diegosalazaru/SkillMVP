import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { courses } from "@/lib/catalog-adapter";
import { buildPageMetadata } from "@/lib/metadata";
import CourseDetailClient from "./CourseDetailClient";

type CoursePageProps = {
  params: {
    courseId: string;
  };
};

export async function generateMetadata({
  params
}: CoursePageProps): Promise<Metadata> {
  const course = courses.find((item) => item.id === params.courseId);

  if (!course) {
    notFound();
  }

  return buildPageMetadata({
    title: `${course.title} | Skills Compare`,
    description:
      course.shortDescription ??
      `Compare details for ${course.title} on ${course.platform}: level, price, duration, and certificate.`,
    path: `/courses/${course.id}`
  });
}

export default function CourseDetailPage({ params }: CoursePageProps) {
  if (!courses.some((course) => course.id === params.courseId)) {
    notFound();
  }

  return <CourseDetailClient courseId={params.courseId} />;
}
