import { Course } from "@/types/course";

export const courses: Course[] = [
  {
    id: "ai-fundamentals-01",
    title: "AI Fundamentals: Concepts and Use Cases",
    platform: "Coursera",
    skillTags: ["AI Fundamentals", "Machine Learning"],
    level: "Beginner",
    priceType: "paid",
    priceText: "Suscripción mensual",
    durationText: "4 semanas",
    rating: 4.6,
    language: "Español",
    certificate: true,
    shortDescription:
      "Introducción práctica a la IA, sus aplicaciones y el ciclo de vida de proyectos.",
    syllabusBullets: [
      "Historia y conceptos base de IA",
      "Tipos de aprendizaje y casos reales",
      "Ética y consideraciones de negocio",
      "Flujo de trabajo de proyectos"
    ],
    prerequisitesBullets: ["Curiosidad por la tecnología", "No requiere experiencia previa"],
    externalUrl: "https://example.com/ai-fundamentals"
  },
  {
    id: "prompt-engineering-01",
    title: "Prompt Engineering Essentials",
    platform: "Udemy",
    skillTags: ["Prompt Engineering", "LLMs"],
    level: "Beginner",
    priceType: "paid",
    priceText: "Pago único",
    durationText: "3 horas",
    rating: 4.4,
    language: "Español",
    certificate: true,
    shortDescription:
      "Domina técnicas de prompts para lograr mejores resultados con modelos generativos.",
    syllabusBullets: [
      "Estructura de prompts efectivos",
      "Iteración y evaluación",
      "Prompts para tareas comunes",
      "Errores habituales"
    ],
    prerequisitesBullets: ["Uso básico de herramientas de IA"],
    externalUrl: "https://example.com/prompt-essentials"
  },
  {
    id: "llm-practitioner-01",
    title: "LLM Practitioner: From API to App",
    platform: "edX",
    skillTags: ["LLMs", "AI Fundamentals"],
    level: "Intermediate",
    priceType: "paid",
    priceText: "Pago único",
    durationText: "6 semanas",
    rating: 4.5,
    language: "Inglés",
    certificate: true,
    shortDescription:
      "Aprende a integrar modelos de lenguaje en productos reales con enfoque práctico.",
    syllabusBullets: [
      "Conceptos clave de LLMs",
      "Diseño de flujos conversacionales",
      "Evaluación de resultados",
      "Buenas prácticas de producto"
    ],
    prerequisitesBullets: ["Conocimientos básicos de programación"],
    externalUrl: "https://example.com/llm-practitioner"
  },
  {
    id: "ml-bootcamp-01",
    title: "Machine Learning Bootcamp",
    platform: "Coursera",
    skillTags: ["Machine Learning", "AI Fundamentals"],
    level: "Intermediate",
    priceType: "paid",
    priceText: "Suscripción mensual",
    durationText: "8 semanas",
    rating: 4.7,
    language: "Inglés",
    certificate: true,
    shortDescription:
      "Fundamentos y práctica de modelos de ML con un enfoque aplicado.",
    syllabusBullets: [
      "Preparación de datos",
      "Modelos supervisados",
      "Evaluación y métricas",
      "Pipeline básico"
    ],
    prerequisitesBullets: ["Álgebra básica", "Conocimientos de Python"],
    externalUrl: "https://example.com/ml-bootcamp"
  },
  {
    id: "ai-product-01",
    title: "AI Product Strategy",
    platform: "Microsoft Learn",
    skillTags: ["AI Fundamentals"],
    level: "Beginner",
    priceType: "free",
    priceText: "Gratis",
    durationText: "2 horas",
    rating: 4.2,
    language: "Español",
    certificate: false,
    shortDescription:
      "Cómo identificar oportunidades de IA y convertirlas en productos viables.",
    syllabusBullets: [
      "Identificación de casos de uso",
      "Métricas de éxito",
      "Riesgos y gobernanza",
      "Roadmap inicial"
    ],
    prerequisitesBullets: ["Interés en producto digital"],
    externalUrl: "https://example.com/ai-product"
  },
  {
    id: "genai-starter-01",
    title: "Generative AI Starter",
    platform: "edX",
    skillTags: ["AI Fundamentals", "Prompt Engineering"],
    level: "Beginner",
    priceType: "free",
    priceText: "Gratis",
    durationText: "1 semana",
    rating: 4.1,
    language: "Inglés",
    certificate: false,
    shortDescription:
      "Panorama de IA generativa, usos y límites para empezar con claridad.",
    syllabusBullets: [
      "Conceptos de IA generativa",
      "Aplicaciones comunes",
      "Riesgos y ética",
      "Primeros prompts"
    ],
    prerequisitesBullets: ["No requiere experiencia previa"],
    externalUrl: "https://example.com/genai-starter"
  },
  {
    id: "prompt-advanced-01",
    title: "Advanced Prompt Engineering",
    platform: "Udemy",
    skillTags: ["Prompt Engineering", "LLMs"],
    level: "Advanced",
    priceType: "paid",
    priceText: "Pago único",
    durationText: "5 horas",
    rating: 4.8,
    language: "Inglés",
    certificate: true,
    shortDescription:
      "Estrategias avanzadas para prompts complejos y flujos de trabajo críticos.",
    syllabusBullets: [
      "Prompts multi paso",
      "Control de tono y formato",
      "Testing y métricas",
      "Optimización iterativa"
    ],
    prerequisitesBullets: ["Experiencia previa con prompts"],
    externalUrl: "https://example.com/prompt-advanced"
  },
  {
    id: "ml-ops-basics-01",
    title: "ML Ops Basics",
    platform: "Microsoft Learn",
    skillTags: ["Machine Learning", "AI Fundamentals"],
    level: "Intermediate",
    priceType: "free",
    priceText: "Gratis",
    durationText: "3 horas",
    rating: 4.0,
    language: "Español",
    certificate: false,
    shortDescription:
      "Introducción al despliegue y monitoreo de modelos de ML.",
    syllabusBullets: [
      "Ciclo de vida de ML",
      "Deploy inicial",
      "Monitoreo básico",
      "Colaboración entre equipos"
    ],
    prerequisitesBullets: ["Conocimientos básicos de ML"],
    externalUrl: "https://example.com/ml-ops"
  },
  {
    id: "llm-evaluation-01",
    title: "LLM Evaluation and Quality",
    platform: "Coursera",
    skillTags: ["LLMs"],
    level: "Advanced",
    priceType: "paid",
    priceText: "Suscripción mensual",
    durationText: "4 semanas",
    rating: 4.5,
    language: "Inglés",
    certificate: true,
    shortDescription:
      "Técnicas para evaluar calidad y seguridad en respuestas de LLMs.",
    syllabusBullets: [
      "Métricas automáticas",
      "Evaluación humana",
      "Sesgos y seguridad",
      "Checklist de calidad"
    ],
    prerequisitesBullets: ["Experiencia con LLMs", "Conocimientos de métricas"],
    externalUrl: "https://example.com/llm-evaluation"
  },
  {
    id: "ai-for-business-01",
    title: "AI for Business Leaders",
    platform: "edX",
    skillTags: ["AI Fundamentals"],
    level: "Beginner",
    priceType: "paid",
    priceText: "Pago único",
    durationText: "2 semanas",
    rating: 4.3,
    language: "Español",
    certificate: true,
    shortDescription:
      "Comprende el impacto de la IA en procesos y modelos de negocio.",
    syllabusBullets: [
      "Casos de uso en industrias",
      "ROI y viabilidad",
      "Gestión del cambio",
      "Riesgos legales"
    ],
    prerequisitesBullets: ["Experiencia en negocio o management"],
    externalUrl: "https://example.com/ai-business"
  },
  {
    id: "ml-math-01",
    title: "Math for Machine Learning",
    platform: "Coursera",
    skillTags: ["Machine Learning"],
    level: "Intermediate",
    priceType: "paid",
    priceText: "Suscripción mensual",
    durationText: "5 semanas",
    rating: 4.6,
    language: "Inglés",
    certificate: true,
    shortDescription:
      "Refuerza bases matemáticas clave para entender modelos de ML.",
    syllabusBullets: [
      "Álgebra lineal aplicada",
      "Probabilidad",
      "Optimización",
      "Derivadas útiles"
    ],
    prerequisitesBullets: ["Bases de matemática", "Interés en ML"],
    externalUrl: "https://example.com/ml-math"
  },
  {
    id: "ai-ethics-01",
    title: "Responsible AI & Ethics",
    platform: "Microsoft Learn",
    skillTags: ["AI Fundamentals"],
    level: "Beginner",
    priceType: "free",
    priceText: "Gratis",
    durationText: "2 horas",
    rating: 4.2,
    language: "Español",
    certificate: false,
    shortDescription:
      "Principios de IA responsable para productos y equipos.",
    syllabusBullets: [
      "Principios de responsabilidad",
      "Sesgos comunes",
      "Transparencia",
      "Checklist práctico"
    ],
    prerequisitesBullets: ["Interés en ética y tecnología"],
    externalUrl: "https://example.com/ai-ethics"
  },
  {
    id: "nlp-essentials-01",
    title: "NLP Essentials",
    platform: "Udemy",
    skillTags: ["LLMs", "Machine Learning"],
    level: "Intermediate",
    priceType: "paid",
    priceText: "Pago único",
    durationText: "6 horas",
    rating: 4.4,
    language: "Español",
    certificate: true,
    shortDescription:
      "Conceptos base de procesamiento de lenguaje natural y sus aplicaciones.",
    syllabusBullets: [
      "Tokenización y vectores",
      "Modelos clásicos",
      "Evaluación",
      "Aplicaciones prácticas"
    ],
    prerequisitesBullets: ["Python básico", "Estadística básica"],
    externalUrl: "https://example.com/nlp-essentials"
  },
  {
    id: "llm-product-01",
    title: "Building Products with LLMs",
    platform: "Coursera",
    skillTags: ["LLMs", "Prompt Engineering"],
    level: "Intermediate",
    priceType: "paid",
    priceText: "Suscripción mensual",
    durationText: "4 semanas",
    rating: 4.5,
    language: "Inglés",
    certificate: true,
    shortDescription:
      "Diseña experiencias y flujos de producto usando LLMs.",
    syllabusBullets: [
      "Mapeo de journeys",
      "Diseño de prompts",
      "Evaluación de UX",
      "Métricas de impacto"
    ],
    prerequisitesBullets: ["Experiencia en producto o UX"],
    externalUrl: "https://example.com/llm-product"
  },
  {
    id: "ai-data-ready-01",
    title: "Data Readiness for AI",
    platform: "edX",
    skillTags: ["AI Fundamentals", "Machine Learning"],
    level: "Intermediate",
    priceType: "paid",
    priceText: "Pago único",
    durationText: "3 semanas",
    rating: 4.1,
    language: "Inglés",
    certificate: true,
    shortDescription:
      "Aprende a preparar datos y procesos para proyectos de IA.",
    syllabusBullets: [
      "Calidad de datos",
      "Gobernanza",
      "Estrategia de datos",
      "Roles y responsabilidades"
    ],
    prerequisitesBullets: ["Conocimientos básicos de datos"],
    externalUrl: "https://example.com/data-ready"
  },
  {
    id: "ml-foundations-01",
    title: "Machine Learning Foundations",
    platform: "Microsoft Learn",
    skillTags: ["Machine Learning"],
    level: "Beginner",
    priceType: "free",
    priceText: "Gratis",
    durationText: "4 horas",
    rating: 4.3,
    language: "Español",
    certificate: false,
    shortDescription:
      "Primeros pasos con modelos de aprendizaje automático.",
    syllabusBullets: [
      "Conceptos clave",
      "Tipos de modelos",
      "Ciclo de entrenamiento",
      "Buenas prácticas"
    ],
    prerequisitesBullets: ["No requiere experiencia previa"],
    externalUrl: "https://example.com/ml-foundations"
  },
  {
    id: "ai-design-01",
    title: "Designing AI Experiences",
    platform: "Udemy",
    skillTags: ["AI Fundamentals", "Prompt Engineering"],
    level: "Intermediate",
    priceType: "paid",
    priceText: "Pago único",
    durationText: "4 horas",
    rating: 4.2,
    language: "Español",
    certificate: true,
    shortDescription:
      "Diseña interfaces y flujos que aprovechen IA de forma clara.",
    syllabusBullets: [
      "Principios de diseño",
      "Conversaciones útiles",
      "Feedback y corrección",
      "Iteración rápida"
    ],
    prerequisitesBullets: ["Conocimientos de UX"],
    externalUrl: "https://example.com/ai-design"
  },
  {
    id: "llm-safety-01",
    title: "LLM Safety Essentials",
    platform: "edX",
    skillTags: ["LLMs"],
    level: "Advanced",
    priceType: "paid",
    priceText: "Pago único",
    durationText: "3 semanas",
    rating: 4.4,
    language: "Inglés",
    certificate: true,
    shortDescription:
      "Mitigación de riesgos y seguridad en aplicaciones con LLMs.",
    syllabusBullets: [
      "Riesgos comunes",
      "Red teaming básico",
      "Políticas y controles",
      "Evaluación continua"
    ],
    prerequisitesBullets: ["Experiencia previa con LLMs"],
    externalUrl: "https://example.com/llm-safety"
  },
  {
    id: "prompt-team-01",
    title: "Prompt Collaboration for Teams",
    platform: "Coursera",
    skillTags: ["Prompt Engineering"],
    level: "Beginner",
    priceType: "paid",
    priceText: "Suscripción mensual",
    durationText: "2 semanas",
    rating: 4.0,
    language: "Español",
    certificate: true,
    shortDescription:
      "Estándares y colaboración para equipos que trabajan con prompts.",
    syllabusBullets: [
      "Estructuras compartidas",
      "Documentación",
      "Revisión en equipo",
      "Buenas prácticas"
    ],
    prerequisitesBullets: ["Trabajo en equipos digitales"],
    externalUrl: "https://example.com/prompt-team"
  },
  {
    id: "ai-roadmap-01",
    title: "AI Roadmap Planning",
    platform: "Microsoft Learn",
    skillTags: ["AI Fundamentals"],
    level: "Intermediate",
    priceType: "free",
    priceText: "Gratis",
    durationText: "3 horas",
    rating: 4.1,
    language: "Español",
    certificate: false,
    shortDescription:
      "Planificación de un roadmap de IA alineado a objetivos de negocio.",
    syllabusBullets: [
      "Priorizar iniciativas",
      "Definir métricas",
      "Plan de adopción",
      "Ejecución gradual"
    ],
    prerequisitesBullets: ["Experiencia en liderazgo o gestión"],
    externalUrl: "https://example.com/ai-roadmap"
  }
];
