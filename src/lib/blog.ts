export type BlogPost = {
  slug: string;
  title: string;
  description: string;
  sections: { heading: string; points: string[] }[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: "como-elegir-entre-dos-cursos",
    title: "Cómo elegir entre dos cursos",
    description: "Guía práctica para comparar dos cursos sin suposiciones y decidir más rápido.",
    sections: [
      { heading: "1) Define tu criterio de decisión", points: ["Compara por precio total real.", "Compara por tiempo semanal y duración.", "Verifica si el certificado está incluido o es de pago."] },
      { heading: "2) Revisa diferencias verificadas", points: ["Si el nivel es igual, enfócate en duración y certificado.", "Si la plataforma cambia, revisa idioma y formato.", "Evita decidir por opiniones sin datos comparables."] }
    ]
  },
  {
    slug: "que-comparar-antes-de-pagar-un-curso",
    title: "Qué comparar antes de pagar un curso",
    description: "Checklist concreta para pagar un curso con más claridad.",
    sections: [
      { heading: "Antes de pagar", points: ["Modelo de precio: pago único, suscripción o certificado aparte.", "Duración estimada para completar el curso.", "Nivel declarado y si coincide con tu punto de partida."] },
      { heading: "Evita errores comunes", points: ["No uses solo el rating para decidir.", "No asumas que certificado significa empleabilidad.", "No pagues sin comparar al menos dos opciones."] }
    ]
  },
  {
    slug: "curso-gratis-vs-de-pago-que-cambia-realmente",
    title: "Curso gratis vs de pago: qué cambia realmente",
    description: "Comparación simple para entender cuándo un curso gratis o de pago encaja mejor.",
    sections: [
      { heading: "Qué suele cambiar", points: ["Certificado: en muchos casos requiere pago.", "Soporte o acompañamiento: puede variar por plataforma.", "Compromiso: pagar puede influir en constancia, pero no en calidad por sí solo."] },
      { heading: "Cómo decidir", points: ["Si necesitas validar aprendizaje, revisa certificado y coste total.", "Si quieres explorar una skill, empieza por opción gratis.", "Compara siempre duración, nivel e idioma antes de decidir."] }
    ]
  }
];

export const getBlogPost = (slug: string) => blogPosts.find((post) => post.slug === slug);
