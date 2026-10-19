# Bases de desarrollo compartidas

- Estado: implementada; pendiente de validar en sesiones reales de cada agente.
- Requisito: harness para programar con IA inspirado en rsc-harness, siguiendo los 15 principios del usuario y evitando sobreingeniería.
- Decisión: [0002: principios como núcleo](../decisions/0002-principios-como-nucleo.md).

## Alcance e implementación

- `templates/shared/JOTA.md`: fuente común de los 15 principios, acciones, evidencia y flujo proporcional al cambio.
- `templates/shared/docs/`: contexto, registro de trabajo con contratos y verificaciones, y decisiones.
- `templates/skills/jota/SKILL.md`: acceso breve al flujo del proyecto.
- `src/onboard.js`: instalación por proyecto; conserva instrucciones existentes y agrega entradas en AGENTS.md/CLAUDE.md. Valida destinos antes de escribir y rechaza archivos propios existentes o enlaces simbólicos.
- `src/verify.js`: configuración validada antes de ejecutar; etapas rápidas/completas; comandos sin shell; fallos, ausencia de checks y timeouts producen salida distinta de cero.
- `src/cli.js`: expone `verify` y `onboard`.

## Evidencia

2026-10-19: `node bin/jota.js verify --full`, 7 pruebas pasadas en carpetas temporales. Cubren conservación de instrucciones, agentes duplicados, conflictos, destinos enlazados, preview, targets inválidos, orden de etapas, fallo inmediato, configuración inválida o vacía, argumentos literales, timeout e instalación desde un paquete Git en un proyecto consumidor aislado. La prueba de integración ejercita `npm exec` con un Git local como sustituto reproducible del remoto.

2026-10-19: `npm pack --dry-run` empaqueta el CLI y sus plantillas; se usó un caché temporal porque el caché npm de este equipo tenía archivos sin permisos de escritura.

Se intentó `quick_validate.py` para la skill; el Python disponible no incluye PyYAML y el validador no pudo ejecutarse. Se revisó el frontmatter y sus referencias en el código fuente; esto no constituye validación de comportamiento en un agente real.

## Continuidad

Pendiente: uso real en Claude Code, Codex y OpenCode; publicación del paquete, actualización/desinstalación y enforcement específico por agente. Las reglas de documentación están en el flujo; su calidad y actualización semántica no están bloqueadas automáticamente. Cada proyecto puede añadir ese control en su configuración de checks y en CI.
