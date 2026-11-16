---
name: product-ux
description: Diseñar experiencias de producto coherentes al crear o ampliar interfaces y auditar recorridos completos en productos existentes. Usar para tareas de frontend con impacto en interacción, navegación o contenido y para auditorías UX; excluir cambios internos sin impacto de uso.
---

# UX de producto

Optimiza la capacidad de una persona de completar su objetivo, entender lo que ocurre y recuperarse sin perder trabajo. Evalúa el recorrido entre funcionalidades, además de cada pantalla. Las preferencias del usuario y las restricciones reales del proyecto delimitan la solución.

## Seleccionar el modo

- **Crear desde cero:** identifica usuarios, objetivo principal, contexto y criterio de éxito. Diseña el recorrido mínimo completo antes de los componentes. No inventes necesidades ni añadas funcionalidades solo para completar una checklist.
- **Añadir o modificar una funcionalidad:** reconstruye el recorrido afectado y sus conexiones con lo existente. Reutiliza vocabulario, estados y patrones del producto. Una edición pequeña necesita una revisión proporcional, no una auditoría global.
- **Auditar un producto existente:** lee primero [el procedimiento de auditoría](references/audit.md). Antes de evaluar, solicita el alcance y la profundidad de cambios admitida si el usuario no los indicó. Espera su elección. Auditar no autoriza implementar.

En proyectos JOTA, respeta además su requisito de auditar el frontend existente antes de actualizarlo y consultar al usuario. Una auditoría previa sigue siendo válida para el alcance revisado mientras sus condiciones relevantes no cambien; no repitas preguntas ya resueltas. Tras aprobar cambios, aplica el modo de desarrollo sin reiniciar el proceso de aprobación.

## Antes de implementar

Lee el contexto del proyecto, las decisiones UX y los recorridos documentados. Contrástalos con rutas, navegación, componentes y estados reales. Resume brevemente: quién usa esto, qué quiere conseguir, desde dónde llega, qué decisión toma, cómo reconoce el éxito y cómo retoma tras una interrupción. Pregunta solo por incógnitas que cambien materialmente la solución.

Traza el recorrido en orden de acciones: entrada → orientación → decisión → acción → respuesta → finalización → siguiente tarea o regreso. Para cada paso, identifica qué información necesita, qué debe recordar o volver a introducir y qué ocurre si falla. Localiza conexiones con funcionalidades previas y posteriores: enlaces, filtros, selección, identidad del objeto, permisos, borradores y estados compartidos. Detecta caminos duplicados, callejones sin salida y cambios inesperados de significado.

Consulta [los criterios UX](references/principles.md) según el recorrido. Para HTML, CSS y JavaScript del navegador, carga también `modern-web-guidance` y recupera las guías pertinentes antes de escribir código. Si falta, informa del bloqueo de esa parte del trabajo; no simules haberla usado. El análisis de objetivos y recorridos puede continuar.

## Implementar y comprobar

Define criterios observables del recorrido antes de editar: la persona puede encontrar la acción, completarla, reconocer el resultado y corregir o retomar errores. Comprueba los estados aplicables: inicio vacío, carga, éxito, error, permisos insuficientes, datos parciales e interrupción. No añadas estados irrelevantes.

Conserva lo que ya permite completar tareas. Justifica cambios estructurales por fricción concreta y respeta el alcance aprobado. Incluye consecuencias sobre datos, rutas guardadas, hábitos, accesibilidad y migración cuando propongas una reconstrucción.

Usa las herramientas de navegador disponibles cuando el alcance y los permisos permitan recorrer la interfaz. Comprueba el flujo afectado y sus conexiones, teclado, pantalla pequeña y recuperación. No uses cuentas reales ni provoques pagos, envíos o borrados para demostrar un hallazgo sin autorización específica. Si solo puedes leer código o capturas, declara qué comportamiento queda sin comprobar. No deduzcas tiempos reales, satisfacción ni conformidad completa de accesibilidad de una captura.

Guarda las decisiones y recorridos críticos en la documentación UX existente; si no existe y el cambio lo justifica, usa `docs/ux/journeys.md`. Registra objetivo, pasos, estados, conexiones, decisiones y evidencia de verificación. Actualiza el registro de la tarea de JOTA. No documentes cada botón ni dupliques información. Propón pruebas de regresión para recorridos críticos según el stack y las instrucciones del proyecto.

Cierra con el resultado para el usuario, decisiones relevantes, verificaciones observadas y pendientes. Distingue mejora esperada de mejora medida. La evaluación del agente no sustituye observar usuarios reales.
