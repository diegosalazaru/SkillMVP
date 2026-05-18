import { getCoursesForSeoPage } from "@/lib/seo/seoPages";
import { GeneratedSeoPage } from "@/lib/seo/seoTypes";
import { SeoCourseList } from "@/components/seo/SeoCourseList";
import { SeoFAQ } from "@/components/seo/SeoFAQ";

type SeoPageTemplateProps = {
  page: GeneratedSeoPage;
};

export const SeoPageTemplate = ({ page }: SeoPageTemplateProps) => {
  const pageCourses = getCoursesForSeoPage(page);

  return (
    <main className="mx-auto max-w-4xl space-y-8 px-4 py-10">
      <header className="space-y-3">
        <h1 className="text-3xl font-bold text-slate-900">{page.h1}</h1>
        <p className="text-slate-700">{page.intro}</p>
        <p className="text-sm text-slate-500">
          Course information may change. Verify pricing, duration, certificate terms, and enrollment details on the provider website.
        </p>
      </header>
      <SeoCourseList courses={pageCourses} />
      <SeoFAQ faq={page.faq} />
    </main>
  );
};
