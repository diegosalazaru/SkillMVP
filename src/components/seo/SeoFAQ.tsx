import { GeneratedSeoFaqItem } from "@/lib/seo/seoTypes";

type SeoFAQProps = {
  faq: GeneratedSeoFaqItem[];
};

export const SeoFAQ = ({ faq }: SeoFAQProps) => (
  <section className="space-y-3">
    <h2 className="text-2xl font-semibold text-slate-900">FAQ</h2>
    <div className="space-y-3">
      {faq.map((item) => (
        <article key={item.question} className="rounded-xl border border-slate-200 bg-white p-4">
          <h3 className="font-semibold text-slate-900">{item.question}</h3>
          <p className="mt-2 text-sm text-slate-700">{item.answer}</p>
        </article>
      ))}
    </div>
  </section>
);
