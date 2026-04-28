import type { Metadata } from "next";
import HomeClient from "./HomeClient";

export const metadata: Metadata = {
  title: "Skills Compare | Compara cursos online",
  description:
    "Busca una skill, compara cursos online por precio, duracion, nivel y certificado, y elige donde aprender."
};

export default function HomePage() {
  return <HomeClient />;
}
