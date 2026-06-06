import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";
import { Providers } from "./providers";
import { AnalyticsLoader } from "@/components/seo/AnalyticsLoader";
import { SITE_NAME } from "@/config/siteConfig";
import { siteBaseUrl } from "@/lib/metadata";

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
          <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-6">
            <header className="flex items-center justify-between border-b border-slate-200 py-6">
              <Link href="/" className="block hover:text-slate-700">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Skills Compare
                </p>
                <h1 className="text-xl font-semibold">Find the right course</h1>
              </Link>
              <nav className="flex items-center gap-4 text-sm font-medium text-slate-600">
                <Link href="/compare" className="hover:text-slate-900">Compare courses</Link>
                <Link href="/blog" className="hover:text-slate-900">Blog</Link>
              </nav>
            </header>
            <main className="flex-1 py-8">{children}</main>
            <footer className="border-t border-slate-200 py-6 text-sm text-slate-500">
              Curated data and links to external platforms.
            </footer>
          </div>
        </Providers>
        <AnalyticsLoader />
      </body>
    </html>
  );
}
