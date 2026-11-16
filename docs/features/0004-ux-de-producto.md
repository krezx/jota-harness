# UX de producto y continuidad entre funcionalidades

- Estado: implementado; pendiente de evaluación en sesiones reales de agentes.
- Requisito: crear experiencias fáciles y agradables de usar, preservar recorridos al añadir features y permitir auditorías con alcance y profundidad elegidos antes de empezar.

## Implementación

- `templates/skills/product-ux/SKILL.md`: creación, evolución y auditoría; contexto, continuidad, estados y verificación de recorridos.
- Referencias `audit.md` y `principles.md`: consulta previa, evidencia y propuestas proporcionales; criterios basados en heurísticas de usabilidad y accesibilidad, con enlaces oficiales. Síntesis original, sin incorporar skills comunitarias.
- `src/onboard.js`: distribución por proyecto en los cuatro targets existentes, con la misma validación de destinos y rechazo de sobrescritura.
- README, JOTA.md y skill jota: coordinación con modern-web-guidance y alcance previo a auditorías. Conserva los 15 principios.

## Evidencia observada

- `npm test`: 72 pruebas pasadas, 0 fallidas. Se compara la copia íntegra de los tres archivos en los adaptadores y se comprueba su inclusión al instalar desde un paquete Git en un proyecto temporal.
- `quick_validate.py templates/skills/product-ux`: Skill is valid!
- Revisión de instrucciones: una auditoría espera alcance y nivel de intervención; consideraciones de reconstrucción no autorizan implementarla; cambios autorizados no reinician aprobaciones ya resueltas.

## Límites y siguiente paso

La validación estructural y del instalador no demuestra mejora de UX. Evaluar en un producto real: feature nueva que atraviesa dos áreas, auditoría acotada y evaluación de reconstrucción. Registrar evidencia de comportamiento y ajustar solo ante fallos observados. No se modificó configuración global de agentes.
