import type { Metadata } from "next";
import { courses } from "@/lib/catalog-adapter";
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
    return {
      title: "Course not found | Skills Compare",
      description:
        "Check the Skills Compare catalog to find available online courses."
    };
  }

  return {
    title: `${course.title} | Skills Compare`,
    description:
      course.shortDescription ??
      `Compare details for ${course.title} on ${course.platform}: level, price, duration, and certificate.`
  };
}

export default function CourseDetailPage({ params }: CoursePageProps) {
  return <CourseDetailClient courseId={params.courseId} />;
}
