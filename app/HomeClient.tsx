"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { SearchBar } from "@/components/SearchBar";
import { getSkillOptions, resolveSkillSlug, searchSkillOptions, type SkillOption } from "@/lib/skill-routing";

export default function HomeClient() {
  const router = useRouter();
  const suggestions = useMemo(() => getSkillOptions(), []);
  const [searchFeedback, setSearchFeedback] = useState<string | null>(null);
  const [searchSuggestions, setSearchSuggestions] = useState<SkillOption[]>([]);

  const handleSearch = (value: string) => {
    const trimmed = value.trim();

    if (!trimmed) {
      setSearchFeedback("Enter a skill to search the current catalog.");
      setSearchSuggestions(suggestions.slice(0, 4));
      return;
    }

    const skillSlug = resolveSkillSlug(trimmed);
    if (skillSlug) {
      setSearchFeedback(null);
      setSearchSuggestions([]);
      router.push(`/skills/${skillSlug}`);
      return;
    }

    const topSuggestions = searchSkillOptions(trimmed, 4);
    if (topSuggestions.length > 0) {
      setSearchFeedback(`No exact match for "${trimmed}". Try one of these available skills.`);
      setSearchSuggestions(topSuggestions);
      return;
    }

    setSearchFeedback("No matching skill found yet. Try one of the available skills below.");
    setSearchSuggestions(suggestions.slice(0, 4));
  };

  return (
    <section className="flex flex-col gap-10 sm:gap-14">
      <div className="overflow-hidden rounded-[1.75rem] border border-slate-200/80 bg-white/90 shadow-[0_24px_80px_-48px_rgba(15,23,42,0.45)]">
        <div className="px-5 py-8 sm:px-10 sm:py-12 lg:px-12 lg:py-14">
          <div className="space-y-4">
            <p className="text-xs font-bold uppercase tracking-[0.22em] text-blue-700 sm:text-sm">
              Start with a skill
            </p>
            <h2 className="max-w-4xl text-4xl font-semibold leading-[1.08] tracking-[-0.035em] text-slate-950 sm:text-5xl lg:text-6xl">
              Compare courses before you commit.
            </h2>
            <p className="max-w-2xl text-base leading-relaxed text-slate-600 sm:text-lg">
              Search a skill, review course facts, and compare two options side by side.
            </p>
          </div>

          <div className="mt-8 sm:mt-10">
            <SearchBar
              placeholder="Try data analytics, cybersecurity, or AI"
              onSearch={handleSearch}
              feedback={searchFeedback}
            />
            {searchSuggestions.length > 0 ? (
              <div className="mt-4 flex flex-wrap gap-2">
                {searchSuggestions.map((skill) => (
                  <Link
                    key={skill.slug}
                    href={`/skills/${skill.slug}`}
                    className="min-h-10 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:border-slate-300 hover:bg-slate-50"
                  >
                    {skill.title}
                  </Link>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        <ol className="grid border-t border-slate-200/80 bg-slate-50/80 sm:grid-cols-3">
          {[
            ["01", "Search", "Start with the skill you want to learn."],
            ["02", "Compare", "Review two options using the same facts."],
            ["03", "Decide", "Verify final details with the provider."]
          ].map(([step, label, description]) => (
            <li key={step} className="flex gap-4 border-b border-slate-200/80 px-5 py-5 last:border-b-0 sm:border-b-0 sm:border-r sm:px-7 sm:last:border-r-0">
              <span className="text-xs font-bold tracking-[0.16em] text-blue-700">{step}</span>
              <div>
                <p className="text-sm font-semibold text-slate-950">{label}</p>
                <p className="mt-1 text-sm leading-relaxed text-slate-600">{description}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>

      <div className="space-y-5">
        <div className="flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.2em] text-slate-500">
              Available skills
            </p>
            <h3 className="mt-2 text-2xl font-semibold tracking-tight text-slate-950 sm:text-3xl">
              Explore the current catalog
            </h3>
          </div>
          <p className="max-w-md text-sm leading-relaxed text-slate-500">
            Choose a skill to see factual course options and build a two-course comparison.
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {suggestions.map((skill) => (
            <Link
              key={skill.slug}
              href={`/skills/${skill.slug}`}
              className="group rounded-2xl border border-slate-200/80 bg-white p-5 text-left shadow-[0_12px_30px_-24px_rgba(15,23,42,0.35)] transition duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-[0_18px_36px_-24px_rgba(37,99,235,0.28)] sm:p-6"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <p className="text-lg font-semibold tracking-tight text-slate-950">{skill.title}</p>
                  <p className="mt-1 text-sm text-slate-500">
                    {skill.courseCount} {skill.courseCount === 1 ? "course" : "courses"} available
                  </p>
                </div>
                <span aria-hidden="true" className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-blue-50 text-lg text-blue-700 transition group-hover:bg-blue-700 group-hover:text-white">
                  &rarr;
                </span>
              </div>
              <p className="mt-5 text-sm font-semibold text-blue-700">Compare course options</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
