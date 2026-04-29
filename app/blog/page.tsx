import type { Metadata } from "next";
import Link from "next/link";
import { blogPosts } from "@/lib/blog";
import { AdPlaceholder } from "@/components/AdPlaceholder";

export const metadata: Metadata = {
  title: "Blog | Comparar cursos online",
  description: "Guías prácticas para comparar cursos online y decidir antes de pagar."
};

export default function BlogPage() {
  return (
    <section className="flex flex-col gap-8">
      <div className="space-y-2">
        <h2 className="text-3xl font-semibold text-slate-900">Blog de comparación</h2>
        <p className="text-slate-600">Contenido práctico para decidir entre cursos con datos claros.</p>
      </div>
      <div className="grid gap-4">
        {blogPosts.map((post) => (
          <article key={post.slug} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <h3 className="text-xl font-semibold text-slate-900">{post.title}</h3>
            <p className="mt-2 text-slate-600">{post.description}</p>
            <Link href={`/blog/${post.slug}`} className="mt-3 inline-flex text-sm font-semibold text-blue-700 hover:text-blue-600">Leer artículo</Link>
          </article>
        ))}
      </div>
      <AdPlaceholder className="max-w-2xl" />
    </section>
  );
}
