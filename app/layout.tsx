import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { Providers } from "./providers";
import { AnalyticsLoader } from "@/components/seo/AnalyticsLoader";
import { SITE_NAME } from "@/config/siteConfig";
import { siteBaseUrl } from "@/lib/metadata";
import { CompareBar } from "@/components/CompareBar";

export const metadata: Metadata = {
  metadataBase: siteBaseUrl,
  title: "Compare online courses | Skills Compare",
  description: "Course comparison tool to compare online courses by price, duration, level and certificate.",
  openGraph: {
    title: "Compare online courses | Skills Compare",
    description: "Course comparison tool to compare online courses by price, duration, level and certificate.",
    siteName: SITE_NAME,
    type: "website",
    url: "/"
  }
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen">
        <Providers>
          <div className="mx-auto flex min-h-screen w-full max-w-7xl flex-col px-4 sm:px-6 lg:px-8">
            <header className="flex items-center justify-between gap-4 border-b border-slate-200/80 py-4 sm:py-6">
              <Link href="/" className="min-w-0 rounded-lg transition hover:text-slate-700">
                <p className="truncate text-xs font-semibold uppercase tracking-[0.24em] text-slate-500 sm:text-sm">
                  Skills Compare
                </p>
                <p className="truncate text-base font-semibold tracking-tight sm:text-xl">Find the right course</p>
              </Link>
              <nav className="flex shrink-0 items-center gap-1 rounded-full border border-slate-200/80 bg-white/80 p-1 text-xs font-semibold text-slate-600 shadow-sm backdrop-blur sm:gap-2 sm:text-sm">
                <Link href="/compare" className="rounded-full px-3 py-2 transition hover:bg-slate-100 hover:text-slate-950 sm:px-4">Compare</Link>
                <Link href="/blog" className="rounded-full px-3 py-2 transition hover:bg-slate-100 hover:text-slate-950 sm:px-4">Blog</Link>
              </nav>
            </header>
            <main className="min-w-0 flex-1 pb-44 pt-8 sm:pb-36 sm:pt-12">{children}</main>
            <footer className="border-t border-slate-200/80 py-8 text-sm text-slate-500">
              Curated data and links to external platforms.
            </footer>
          </div>
          <CompareBar />
        </Providers>
        <AnalyticsLoader />
      </body>
    </html>
  );
}
