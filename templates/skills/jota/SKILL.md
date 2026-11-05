---
name: jota
description: Desarrollar y corregir software en proyectos con JOTA, siguiendo sus bases de diseño, verificación y documentación continua. Usar para tareas de código y planificación de cambios en un proyecto donde exista JOTA.md.
---

# JOTA

Localiza la raíz del proyecto activo y lee su `JOTA.md`. Allí viven las bases y el flujo de trabajo; los paths indicados son relativos a esa raíz.

Consulta `docs/PROJECT.md` y el registro de la tarea relevante antes de modificar código. Aplica el ciclo de JOTA con una profundidad proporcional al cambio. Actualiza los registros con evidencia observada y deja un siguiente paso si la tarea queda incompleta.

Si no existe `JOTA.md`, informa que JOTA no está configurado en ese proyecto; no inventes reglas ni instales archivos por activar esta skill.

Para cualquier pregunta, revisión o auditoría de seguridad, carga y sigue la skill `security-audit` incluida en el proyecto. En revisiones enfocadas usa solo las secciones pertinentes; ejecuta las seis fases únicamente ante una solicitud explícita de auditoría completa, pentest o informe, respetando sus límites de ejecución y alcance.
