import { getCoursesForSeoPage } from "@/lib/seo/seoPages";
import { GeneratedSeoPage } from "@/lib/seo/seoTypes";
import { SeoCourseList } from "@/components/seo/SeoCourseList";
import { SeoFAQ } from "@/components/seo/SeoFAQ";
import { resolveSkillSlug } from "@/lib/skill-routing";

type SeoPageTemplateProps = {
  page: GeneratedSeoPage;
};

export const SeoPageTemplate = ({ page }: SeoPageTemplateProps) => {
  const pageCourses = getCoursesForSeoPage(page);
  const skillRouteSlug =
    resolveSkillSlug(page.skillSlug) ?? resolveSkillSlug(page.skillLabel) ?? page.skillSlug;

  return (
    <main className="mx-auto max-w-4xl space-y-8 py-4 sm:py-8">
      <header className="space-y-3">
        <h1 className="break-words text-2xl font-semibold text-slate-900 sm:text-3xl">{page.h1}</h1>
        <p className="text-slate-700">{page.intro}</p>
        <p className="text-sm text-slate-500">
          Course information may change. Verify pricing, duration, certificate terms, and enrollment details on the provider website.
        </p>
      </header>
      <SeoCourseList courses={pageCourses} skillSlug={skillRouteSlug} skillLabel={page.skillLabel} />
      <SeoFAQ faq={page.faq} />
    </main>
  );
};
