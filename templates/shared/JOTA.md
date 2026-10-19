# JOTA: programar con IA siguiendo bases

JOTA organiza cómo trabaja el agente en este proyecto. Su ciclo es: entender → implementar → verificar → documentar. Las instrucciones del usuario y los permisos del agente delimitan el trabajo autorizado.

## Contexto antes de actuar

Lee `docs/PROJECT.md` y el registro de la tarea relevante en `docs/features/`. Consulta solo las decisiones relacionadas en `docs/decisions/`. Contrasta la documentación con el código; señala diferencias y corrige el contexto cuando tengas evidencia. No inventes comandos, requisitos ni resultados.

Si el contexto está incompleto, inspecciona el proyecto y completa los hechos comprobables. Pregunta solo por decisiones que no puedas deducir y que cambien la solución. Explica tus acciones en el idioma del usuario.

## Los 15 principios de JOTA

| Base | Cómo aplicarla al programar | Evidencia esperada |
| --- | --- | --- |
| 1. SOLID | En código orientado a objetos, asigna una responsabilidad clara a cada clase, respeta sus contratos y usa interfaces pequeñas. Introduce abstracciones cuando exista una necesidad concreta. | Responsabilidades y dependencias comprensibles; pruebas del comportamiento. |
| 2. KISS / YAGNI | Resuelve el requisito actual con la menor complejidad útil. | Cada dependencia, capa o extensión tiene una razón actual. |
| 3. DRY | Busca capacidades existentes antes de duplicar reglas de negocio o conocimiento. | Una fuente para cada regla; evita unificar similitudes accidentales. |
| 4. Separation of Concerns | Separa reglas del dominio, persistencia y presentación cuando existan esas responsabilidades. | Cambiar una responsabilidad no obliga a modificar las demás. |
| 5. High Cohesion, Low Coupling | Agrupa lo que cambia por el mismo motivo y expón contratos pequeños. | Dependencias explícitas y ausencia de acoplamientos innecesarios. |
| 6. Design by Contract | Define entradas válidas, resultados garantizados e invariantes. Valida en los límites del sistema. | Pruebas de entradas inválidas, casos límite y garantías. |
| 7. Seguridad por defecto | Valida entradas, limita permisos, protege secretos y evita valores predeterminados permisivos. | Errores controlados; secretos fuera del código y de los logs. |
| 8. Observabilidad | Produce errores accionables y logs útiles con contexto e identificadores cuando corresponda. | Un fallo se puede localizar sin registrar datos sensibles. |
| 9. Trazabilidad | Vincula requisito, decisión relevante, archivos modificados y comprobaciones. | Registro breve de trabajo con enlaces y resultados observados. |
| 10. Documentación continua | Actualiza contexto y documentación junto con cada cambio de comportamiento. | El siguiente agente puede continuar desde el repositorio. |
| 11. Instrucciones mínimas | Mantén AGENTS.md y CLAUDE.md como entradas breves. Consulta detalles cuando sean necesarios. | Las reglas compartidas viven aquí una sola vez. |
| 12. Verificación automatizada | Usa pruebas, análisis estático, lint y compilación según el stack. | Comandos repetibles y resultados observados; explica lo no aplicable. |
| 13. Automatización sobre memoria | Convierte reglas comprobables en checks del proyecto o CI cuando sea útil. | Las comprobaciones fallan ante incumplimientos; un recordatorio no equivale a un bloqueo. |
| 14. Feedback rápido | Ejecuta primero validaciones rápidas y después integración, suites completas y builds costosos. | Dos etapas de verificación: fast y full. |
| 15. Reproducibilidad | Registra versiones, comandos de instalación y entorno. Conserva los lockfiles correspondientes. | Otra persona puede repetir instalación y verificaciones. |

## Flujo de trabajo

1. **Entender.** Identifica el resultado esperado y criterios observables de aceptación. Inspecciona el código y las verificaciones existentes. Para preguntas sin cambios, responde directamente.
2. **Preparar.** Para cambios de comportamiento, crea o actualiza un registro breve usando `docs/features/TEMPLATE.md`. Para cambios pequeños basta un registro corto; no abras un documento por cada edición. Si hay decisiones duraderas con alternativas relevantes, registra el motivo en `docs/decisions/`.
3. **Implementar.** Realiza el cambio mínimo conforme a las bases anteriores. Define contratos donde haya límites o invariantes relevantes. Evita imponer patrones o clases a un problema que no los necesita.
4. **Verificar.** Configura los comandos reales del proyecto en `jota.config.json`, reutilizando los existentes. Ejecuta `jota verify` durante el trabajo y `jota verify --full` antes de darlo por terminado. Añade pruebas que cubran comportamiento nuevo o regresiones relevantes. No conviertas un check fallido en opcional para cerrar la tarea.
5. **Documentar y cerrar.** Actualiza el registro con archivos, decisiones, resultados de checks y pendientes. Actualiza `docs/PROJECT.md` si cambió el contexto. Resume al usuario qué cambió, la evidencia y cualquier limitación. Si faltan checks o hay fallos, deja el trabajo pendiente de verificación.

## Continuidad y límites

La documentación del repositorio es la memoria compartida. Guarda hechos y decisiones útiles, no transcripciones, credenciales ni razonamientos internos. Al interrumpir una tarea, registra su estado y siguiente paso.

Las bases de diseño requieren criterio y revisión. `jota verify` ejecuta comprobaciones configuradas; no demuestra por sí solo que se cumpla SOLID ni que la documentación sea correcta. Para forzar documentación actualizada o bloquear una integración, configura un check específico y ejecútalo en CI. La primera versión no instala hooks de agente ni cambia permisos.
