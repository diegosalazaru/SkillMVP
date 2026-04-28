"use client";

import { useRouter } from "next/navigation";
import { SearchBar } from "@/components/SearchBar";
import { courses } from "@/lib/catalog-adapter";
import { slugify, titleFromSlug } from "@/utils/slugify";

const getCatalogSkills = () =>
  Array.from(new Set(courses.flatMap((course) => course.skillTags))).sort();

export default function HomeClient() {
  const router = useRouter();
  const suggestions = getCatalogSkills();

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
          Compara cursos online antes de elegir.
        </h2>
        <p className="max-w-2xl text-slate-600">
          Busca una skill del catalogo, revisa cursos reales lado a lado y abre
          la plataforma original cuando encuentres una opcion que encaje contigo.
        </p>
      </div>

      <SearchBar placeholder="Ej: ai, data analysis, frontend" onSearch={handleSearch} />
      <p className="text-sm text-slate-500">
        Selecciona 2 cursos para comparar precio, duracion, nivel y certificado.
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
