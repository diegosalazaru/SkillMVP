# Core interaction model

## Purpose

## Core objects (Course, Skill)

## Selection model (N-ready; UI may cap at 2 for now)
- `selectedIds` es un array ordenado (FIFO): el primer elemento es el más antiguo.
- El estado es la fuente de verdad; la persistencia en localStorage ocurre en efectos.
- MVP: se permite comparar hasta 2 cursos, pero el modelo está listo para N.

## Compare rules
- Solo se habilita la comparación cuando hay exactamente 2 cursos seleccionados.
- Si la URL trae más de 2 IDs, se usan solo los primeros 2.

## Empty states
- Skill inválida: mensaje claro y CTA para volver a buscar.
- Skill válida sin resultados por filtros: sugerir limpiar o ajustar filtros.
- Comparador con menos de 2 cursos: pedir selección exacta y CTA para volver a elegir.

## UX guardrails
- Intentar seleccionar un 3er curso muestra feedback visible y no cambia la selección.
- CompareBar muestra el contador `n/2` y valida antes de navegar.
- Copy consistente: “Selecciona 2 para comparar (por ahora)”.

## Future: multi-platform, multi-language
