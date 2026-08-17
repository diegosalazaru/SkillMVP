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
    <section className="flex flex-col gap-8 sm:gap-10">
      <div className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.18em] text-blue-700">
          Start with a skill
        </p>
        <h2 className="max-w-3xl text-3xl font-semibold leading-tight text-slate-900 sm:text-4xl">
          Compare courses before you commit.
        </h2>
        <p className="max-w-2xl text-slate-600">
          Search a skill, review course facts, and compare two options side by side.
        </p>
      </div>

      <SearchBar
        placeholder="Try data analytics, cybersecurity, or AI"
        onSearch={handleSearch}
        feedback={searchFeedback}
      />
      {searchSuggestions.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {searchSuggestions.map((skill) => (
            <Link
              key={skill.slug}
              href={`/skills/${skill.slug}`}
              className="min-h-10 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-semibold text-slate-700 hover:border-slate-300"
            >
              {skill.title}
            </Link>
          ))}
        </div>
      ) : null}

      <div className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
          Available skills
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {suggestions.map((skill) => (
            <Link
              key={skill.slug}
              href={`/skills/${skill.slug}`}
              className="rounded-2xl border border-slate-200 bg-white p-4 text-left shadow-sm transition hover:border-slate-300 sm:p-5"
            >
              <p className="font-semibold text-slate-900">{skill.title}</p>
              <p className="mt-1 text-sm text-slate-600">{skill.courseCount} courses available</p>
              <p className="mt-1 text-xs font-semibold text-blue-700">Compare course options</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
