import Link from "next/link";
import { PROVIDER_CTA_LABEL, PROVIDER_DETAILS_NOTICE } from "@/lib/providerCta";
import { Course } from "@/types/course";

type SeoCourseListProps = {
  courses: Course[];
  skillSlug: string;
  skillLabel: string;
};

export const SeoCourseList = ({ courses, skillSlug, skillLabel }: SeoCourseListProps) => {
  const skillHref = `/skills/${skillSlug}`;

  return (
    <section className="space-y-4">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-slate-900">Course options</h2>
        <p className="text-sm text-slate-600">{PROVIDER_DETAILS_NOTICE}</p>
      </div>

      {courses.length === 0 ? (
        <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-5">
          <p className="font-semibold text-amber-900">No course cards are available for this guide yet.</p>
          <p className="mt-2 text-sm text-amber-800">
            Browse the {skillLabel} skill page to see current catalog options while this guide is refreshed.
          </p>
          <Link href={skillHref} className="mt-3 inline-flex text-sm font-semibold text-amber-900 underline">
            View {skillLabel} courses
          </Link>
        </div>
      ) : (
        <div className="grid gap-4">
          {courses.map((course) => (
            <article key={course.id} className="min-w-0 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
              <h3 className="break-words text-lg font-semibold text-slate-900">{course.title}</h3>
              <p className="mt-1 text-sm text-slate-600">
                {course.platform} | {course.level} | {course.priceText}
              </p>
              {course.shortDescription ? (
                <p className="mt-3 text-sm leading-relaxed text-slate-600">{course.shortDescription}</p>
              ) : null}
              <div className="mt-4 grid gap-2 sm:flex sm:flex-wrap">
                <Link href={`/courses/${course.id}`} className="min-h-11 rounded-lg bg-blue-600 px-4 py-2 text-center text-sm font-semibold text-white hover:bg-blue-500">
                  View course details
                </Link>
                <a href={course.externalUrl} target="_blank" rel="noopener noreferrer" className="min-h-11 rounded-lg border border-slate-200 px-4 py-2 text-center text-sm font-semibold text-slate-700 hover:border-slate-300">
                  {PROVIDER_CTA_LABEL}
                </a>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
};
