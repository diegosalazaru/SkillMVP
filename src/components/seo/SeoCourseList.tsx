import Link from "next/link";
import { Course } from "@/types/course";

type SeoCourseListProps = {
  courses: Course[];
};

export const SeoCourseList = ({ courses }: SeoCourseListProps) => (
  <section className="space-y-4">
    <h2 className="text-2xl font-semibold text-slate-900">Available courses</h2>
    <div className="grid gap-4">
      {courses.map((course) => (
        <article key={course.id} className="rounded-xl border border-slate-200 bg-white p-4">
          <h3 className="text-lg font-semibold text-slate-900">{course.title}</h3>
          <p className="text-sm text-slate-600">{course.platform} · {course.level} · {course.priceText}</p>
          <div className="mt-3 flex gap-3">
            <Link href={`/courses/${course.id}`} className="text-sm font-semibold text-blue-700 underline">
              View course details
            </Link>
            <a href={course.externalUrl} target="_blank" rel="noopener noreferrer" className="text-sm text-slate-700 underline">
              Provider page
            </a>
          </div>
        </article>
      ))}
    </div>
  </section>
);
