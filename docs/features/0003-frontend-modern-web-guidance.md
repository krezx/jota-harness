# Skill obligatoria para frontend

- Estado: implementada y verificada con `npm test` (16 de noviembre de 2026).
- Requisito: usar siempre GoogleChrome `modern-web-guidance` al construir frontend desde cero; auditar primero frontend de proyectos existentes y consultar antes de actualizarlo.

## Alcance e implementación

- `templates/skills/modern-web-guidance/`: copia de la skill y sus guías oficiales, con licencia Apache-2.0 y commit de origen registrado.
- `src/onboard.js`: instala la skill en el directorio correspondiente para cada adaptador, sin sobrescribir archivos existentes.
- `templates/shared/JOTA.md`, `templates/skills/jota/SKILL.md` y el bloque del agente: requieren la skill en frontend nuevo y auditoría más consulta previa en frontend existente.
- `README.md`: documenta la skill instalada y su flujo.

## Evidencia

- `npm test`: 72 pruebas pasadas, 0 fallidas; incluye instalación en los adaptadores y desde paquete Git en proyecto consumidor temporal.
- La integración de instalación desde Git ejercita la distribución de `SKILL.md`, guías, licencia y metadatos de origen.

## Continuidad

- La skill consulta guías actuales mediante `npx modern-web-guidance`; para tareas web requiere acceso de red.
