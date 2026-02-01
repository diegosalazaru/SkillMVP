# Skills Compare (MVP)

MVP funcional para validar la web app **Skills Compare**. Permite buscar una skill, explorar cursos mock, ver detalles y comparar exactamente 2 cursos.

## 🚀 Cómo instalar y correr

```bash
npm install
npm run dev
```

La app corre en `http://localhost:3000`.

## 🔎 Validación de datos normalizados

Para validar el archivo `data/normalized/courses.json` contra el schema de cursos:

```bash
pnpm validate:data
```

Si el archivo aún no existe, el script mostrará un warning sin fallar.

## 📁 Estructura del proyecto

```
next-env.d.ts
next.config.js
package.json
postcss.config.js
tailwind.config.js
tsconfig.json
.gitkeep
app/
  compare/page.tsx
  courses/[courseId]/page.tsx
  skills/[skillSlug]/page.tsx
  globals.css
  layout.tsx
  page.tsx
src/
  components/
    CompareBar.tsx
    CourseCard.tsx
    Filters.tsx
    SearchBar.tsx
  data/
    courses.ts
  hooks/
    useCompareSelection.ts
  types/
    course.ts
  utils/
    slugify.ts
```

## ✅ Qué incluye el MVP

- Búsqueda de skills con sugerencias rápidas.
- Listado de cursos con filtros client-side.
- Detalle de curso con objetivos, requisitos y temario.
- Comparativa de 2 cursos usando query string.
- Datos mock locales (sin APIs externas).

## ❗ Qué falta para producción

- Integración con APIs reales (Coursera/Udemy/edX/Microsoft Learn).
- Sistema de afiliados y tracking de conversiones.
- SEO avanzado (metadatos dinámicos, Open Graph, sitemap).
- Analítica de producto (eventos, funnels, métricas).
- Autenticación y perfiles (si fuese necesario).
- Tests automatizados y CI/CD.
