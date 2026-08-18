import Link from "next/link";
import seoPagesData from "@/data/generated/seoPages.json";
import { resolveSkillSlug } from "@/lib/skill-routing";

export function SeoLinks() {
  const pages = Array.isArray(seoPagesData) ? seoPagesData : [];
  const discoveryPages = pages
    .filter((page) => page?.intent === "course-discovery" && typeof page.slug === "string" && typeof page.skillLabel === "string")
    .map((page) => ({
      ...page,
      skillRouteSlug:
        resolveSkillSlug(page.skillSlug) ?? resolveSkillSlug(page.skillLabel)
    }))
    .filter((page) => page.skillRouteSlug !== null)
    .sort((a, b) => a.skillLabel.localeCompare(b.skillLabel));

  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {discoveryPages.map((page) => (
        <li key={page.slug}>
          <Link
            href={`/skills/${page.skillRouteSlug}`}
            className="block rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 hover:border-slate-300 hover:text-slate-900"
          >
            <span className="font-semibold">{page.skillLabel}</span>
            <span className="ml-2 text-slate-500">Compare {page.skillLabel} courses</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
