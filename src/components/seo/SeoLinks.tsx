import Link from "next/link";
import { SEO_SKILLS } from "../../config/seoConfig";

export function SeoLinks() {
  return (
    <ul className="grid gap-3 sm:grid-cols-2">
      {SEO_SKILLS.map((skill) => (
        <li key={skill.slug}>
          <Link
            href={`/best-${skill.slug}-courses`}
            className="block rounded-lg border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 hover:border-slate-300 hover:text-slate-900"
          >
            <span className="font-semibold">{skill.label}</span>
            <span className="ml-2 text-slate-500">Ver cursos de {skill.label}</span>
          </Link>
        </li>
      ))}
    </ul>
  );
}
