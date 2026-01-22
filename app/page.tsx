"use client";

import { useRouter } from "next/navigation";
import { SearchBar } from "@/components/SearchBar";
import { slugify } from "@/utils/slugify";

const suggestions = [
  "AI Fundamentals",
  "Prompt Engineering",
  "LLMs",
  "Machine Learning"
];

export default function HomePage() {
  const router = useRouter();

  const handleSearch = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) {
      return;
    }
    router.push(`/skills/${slugify(trimmed)}`);
  };

  return (
    <section className="flex flex-col gap-8">
      <div className="space-y-3">
        <h2 className="text-3xl font-semibold text-slate-900">
          ¿Qué skill quieres aprender?
        </h2>
        <p className="text-slate-600">
          Busca una skill para ver cursos recomendados y compararlos rápidamente.
        </p>
      </div>

      <SearchBar
        placeholder="Ej: Prompt Engineering"
        onSearch={handleSearch}
      />

      <div className="flex flex-wrap gap-2">
        {suggestions.map((skill) => (
          <button
            key={skill}
            type="button"
            onClick={() => router.push(`/skills/${slugify(skill)}`)}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:border-slate-300"
          >
            {skill}
          </button>
        ))}
      </div>
    </section>
  );
}
