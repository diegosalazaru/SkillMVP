import type { Metadata } from "next";
import Link from "next/link";
import { blogPosts, getBlogPost } from "@/lib/blog";
import { AdPlaceholder } from "@/components/AdPlaceholder";
import { buildPageMetadata } from "@/lib/metadata";

type BlogPostPageProps = {
  params: { slug: string };
};

export const generateStaticParams = () => blogPosts.map((post) => ({ slug: post.slug }));

export const generateMetadata = ({ params }: BlogPostPageProps): Metadata => {
  const post = getBlogPost(params.slug);
  if (!post) {
    return buildPageMetadata({
      title: "Article not found | Blog",
      description: "Article unavailable.",
      path: `/blog/${params.slug}`,
      type: "article"
    });
  }
  return buildPageMetadata({
    title: `${post.title} | Compare courses`,
    description: post.description,
    path: `/blog/${post.slug}`,
    type: "article"
  });
};

export default function BlogPostPage({ params }: BlogPostPageProps) {
  const post = getBlogPost(params.slug);

  if (!post) {
    return (
      <section className="rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-600">
        <p>Article not found.</p>
        <Link href="/blog" className="mt-4 inline-flex rounded-lg border border-blue-200 px-4 py-2 text-sm font-semibold text-blue-700">Back to blog</Link>
      </section>
    );
  }

  return (
    <article className="mx-auto flex max-w-3xl flex-col gap-6 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Practical guide</p>
        <h2 className="break-words text-2xl font-semibold text-slate-900 sm:text-3xl">{post.title}</h2>
        <p className="text-slate-600">{post.description}</p>
      </header>
      <p className="rounded-lg bg-slate-50 px-4 py-3 text-sm leading-relaxed text-slate-700">{post.intro}</p>
      {post.sections.map((section, index) => (
        <section key={section.heading} className="space-y-3">
          <h3 className="text-xl font-semibold text-slate-800">{section.heading}</h3>
          <ul className="grid gap-2 text-slate-600">
            {section.points.map((point) => (
              <li key={point} className="rounded-lg bg-slate-50 px-3 py-2">{point}</li>
            ))}
          </ul>
          {index === 0 ? <AdPlaceholder /> : null}
        </section>
      ))}
      <section className="space-y-3">
        <h3 className="text-xl font-semibold text-slate-800">Common mistakes to avoid</h3>
        <ul className="grid gap-2 text-slate-600">
          {post.commonMistakes.map((mistake) => (
            <li key={mistake} className="rounded-lg bg-amber-50 px-3 py-2 text-amber-800">{mistake}</li>
          ))}
        </ul>
      </section>

      <section className="space-y-3">
        <h3 className="text-xl font-semibold text-slate-800">Helpful next steps in Skills Compare</h3>
        <ul className="grid gap-2 text-slate-600 sm:grid-cols-2">
          {post.internalLinks.map((item) => (
            <li key={item.href}>
              <Link href={item.href} className="block rounded-lg bg-blue-50 px-3 py-2 font-medium text-blue-700 hover:bg-blue-100">
                {item.label}
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-3">
        <h3 className="text-xl font-semibold text-slate-800">Final checklist</h3>
        <ul className="grid gap-2 text-slate-600">
          {post.checklist.map((item) => (
            <li key={item} className="rounded-lg bg-emerald-50 px-3 py-2 text-emerald-800">{item}</li>
          ))}
        </ul>
      </section>
    </article>
  );
}
