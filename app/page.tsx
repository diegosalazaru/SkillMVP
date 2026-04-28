import type { Metadata } from "next";
import HomeClient from "./HomeClient";

import { useRouter } from "next/navigation";
import { SearchBar } from "@/components/SearchBar";
import { getSkillOptions, resolveSkillSlug } from "@/lib/skill-routing";

export default function HomePage() {
  const router = useRouter();

  const handleSearch = (value: string) => {
    const skillSlug = resolveSkillSlug(value);
    if (!skillSlug) {
      return;
    }
    router.push(`/skills/${skillSlug}`);
  };

  const suggestions = getSkillOptions();

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
            key={skill.slug}
            type="button"
            onClick={() => router.push(`/skills/${skill.slug}`)}
            className="rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 hover:border-slate-300"
          >
            {skill.title}
          </button>
        ))}
      </div>
    </section>
  );
}
