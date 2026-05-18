"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { SearchBar } from "@/components/SearchBar";
import { getSkillOptions, resolveSkillSlug, searchSkillOptions } from "@/lib/skill-routing";

export default function HomeClient() {
  const router = useRouter();
  const suggestions = useMemo(() => getSkillOptions(), []);
  const [searchFeedback, setSearchFeedback] = useState<string | null>(null);

  const handleSearch = (value: string) => {
    const trimmed = value.trim();

    if (!trimmed) {
      setSearchFeedback("Enter a skill to search the current catalog.");
      return;
    }

    const skillSlug = resolveSkillSlug(trimmed);
    if (skillSlug) {
      setSearchFeedback(null);
      router.push(`/skills/${skillSlug}`);
      return;
    }

    const topSuggestions = searchSkillOptions(trimmed, 3);
    if (topSuggestions.length > 0) {
      setSearchFeedback(`No exact match for "${trimmed}". Try: ${topSuggestions.map((skill) => skill.title).join(", ")}.`);
      return;
    }

    setSearchFeedback("No matching skill found yet. Try one of the available skills below.");
  };

  return (
    <section className="flex flex-col gap-10">
      <div className="space-y-3">
        <h2 className="text-3xl font-semibold leading-tight text-slate-900">
          Compare online courses and choose with confidence.
        </h2>
        <p className="max-w-2xl text-slate-600">
          Find a skill and review real courses by price, duration, level, and
          certificate details before you choose.
        </p>
      </div>

      <SearchBar
        placeholder="Example: ai, data analysis, frontend"
        onSearch={handleSearch}
        feedback={searchFeedback}
      />

      <div className="space-y-3">
        <p className="text-sm font-semibold uppercase tracking-[0.16em] text-slate-500">
          Available skills
        </p>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {suggestions.map((skill) => (
            <Link
              key={skill.slug}
              href={`/skills/${skill.slug}`}
              className="rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm hover:border-slate-300"
            >
              <p className="font-semibold text-slate-900">{skill.title}</p>
              <p className="mt-1 text-sm text-slate-600">{skill.courseCount} courses available</p>
              <p className="mt-1 text-xs text-slate-500">Compare course options</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
