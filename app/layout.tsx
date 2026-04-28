import type { Metadata } from "next";
import "./globals.css";
import { Providers } from "./providers";

export const metadata: Metadata = {
  title: "Skills Compare",
  description: "Compara cursos online y elige donde aprender"
};

export default function RootLayout({
  children
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className="min-h-screen">
        <Providers>
          <div className="mx-auto flex min-h-screen max-w-6xl flex-col px-6">
            <header className="flex items-center justify-between border-b border-slate-200 py-6">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500">
                  Skills Compare
                </p>
                <h1 className="text-xl font-semibold">Encuentra el curso ideal</h1>
              </div>
              <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
                MVP
              </span>
            </header>
            <main className="flex-1 py-8">{children}</main>
            <footer className="border-t border-slate-200 py-6 text-sm text-slate-500">
              MVP para validar Skills Compare con datos curados y enlaces a plataformas externas.
            </footer>
          </div>
        </Providers>
      </body>
    </html>
  );
}
