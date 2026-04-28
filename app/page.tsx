"use client";

import { useRouter } from "next/navigation";
import { SearchBar } from "@/components/SearchBar";
import { slugify, titleFromSlug } from "@/utils/slugify";
import { courses } from "@/lib/catalog-adapter";

export default function HomePage() {
  const router = useRouter();

  const handleSearch = (value: string) => {
    const trimmed = value.trim();
    if (!trimmed) {
      return;
    }
    router.push(`/skills/${slugify(trimmed)}`);
  };

  const suggestions = Array.from(
    new Set(courses.flatMap((c) => c.skillTags))
  );

  return (
    <section className="flex flex-col gap-8">
      <div className="space-y-3">
        <h2 className="text-3xl font-semibold text-slate-900">
          Busca una skill y compara cursos.
        </h2>
        <p className="text-slate-600">
          Encuentra cursos y compáralos lado a lado para elegir el mejor para ti.
        </p>
      </div>

      <SearchBar
        placeholder="Ej: AI"
        onSearch={handleSearch}
      />
      <p className="text-sm text-slate-500">
        Selecciona 2 cursos para compararlos lado a lado.
      </p>

      <div className="flex flex-wrap gap-2">
        {suggestions.map((skill) => (
          <button
            key={skill}
            type="button"
            onClick={() => router.push(`/skills/${slugify(skill)}`)}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:border-slate-300"
          >
            {titleFromSlug(skill)}
          </button>
        ))}
      </div>
    </section>
  );
}
