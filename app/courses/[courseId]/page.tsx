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
      title: "Curso no encontrado | Skills Compare",
      description:
        "Revisa el catalogo de Skills Compare para encontrar cursos online disponibles."
    };
  }

  return {
    title: `${course.title} | Skills Compare`,
    description:
      course.shortDescription ??
      `Compara detalles de ${course.title} en ${course.platform}: nivel, precio, duracion y certificado.`
  };
}

export default function CourseDetailPage({ params }: CoursePageProps) {
  return <CourseDetailClient courseId={params.courseId} />;
}
