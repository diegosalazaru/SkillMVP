import type { Metadata } from "next";
import Link from "next/link";
import { blogPosts } from "@/lib/blog";
import { AdPlaceholder } from "@/components/AdPlaceholder";
import { buildPageMetadata } from "@/lib/metadata";

export const metadata: Metadata = buildPageMetadata({
  title: "Blog | Compare online courses",
  description: "Practical guides to compare online courses and decide before you pay.",
  path: "/blog"
});

export default function BlogPage() {
  return (
    <section className="flex flex-col gap-8">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold text-slate-900 sm:text-3xl">Comparison blog</h2>
        <p className="text-slate-600">Practical content to help you decide between courses with clear data.</p>
      </div>
      <div className="grid gap-4">
        {blogPosts.map((post) => (
          <article key={post.slug} className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-5">
            <h3 className="text-xl font-semibold text-slate-900">{post.title}</h3>
            <p className="mt-2 text-slate-600">{post.description}</p>
            <Link href={`/blog/${post.slug}`} className="mt-4 inline-flex min-h-10 items-center rounded-lg border border-slate-200 px-4 py-2 text-sm font-semibold text-blue-700 hover:border-slate-300">Read article</Link>
          </article>
        ))}
      </div>
      <AdPlaceholder className="max-w-2xl" />
    </section>
  );
}
