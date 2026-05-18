import type { Metadata } from "next";
import Link from "next/link";
import { blogPosts, getBlogPost } from "@/lib/blog";
import { AdPlaceholder } from "@/components/AdPlaceholder";

type BlogPostPageProps = {
  params: { slug: string };
};

export const generateStaticParams = () => blogPosts.map((post) => ({ slug: post.slug }));

export const generateMetadata = ({ params }: BlogPostPageProps): Metadata => {
  const post = getBlogPost(params.slug);
  if (!post) {
    return { title: "Article not found | Blog", description: "Article unavailable." };
  }
  return { title: `${post.title} | Compare courses`, description: post.description };
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
    <article className="mx-auto flex max-w-3xl flex-col gap-6 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <header className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-slate-500">Practical guide</p>
        <h2 className="text-3xl font-semibold text-slate-900">{post.title}</h2>
        <p className="text-slate-600">{post.description}</p>
      </header>
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
    </article>
  );
}
