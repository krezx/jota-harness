# Auditoría de recorridos

## Acordar antes de auditar

Recoge en una sola consulta los valores que falten:

- **Alcance:** un recorrido concreto, un área del producto o los recorridos principales del producto completo.
- **Intervención admisible:** mejoras menores conservando la estructura; reorganizar navegación y flujos; o evaluar un rediseño/reconstrucción desde cero.

Una opción de reconstrucción permite considerarla, no obliga a recomendarla ni autoriza ejecutarla. Si el usuario ya especificó ambos valores, comienza sin volver a preguntar. Si solo pide cambios pequeños, no conviertas eso en una auditoría global. Durante la espera puedes inventariar rutas y documentación, pero no iniciar la evaluación dependiente de la elección.

## Recorrer y reunir evidencia

Identifica las tareas importantes por contexto, documentación, conversaciones y datos disponibles. No confundas la cantidad de pantallas con cobertura del producto. Expón las prioridades inferidas y confirma incógnitas decisivas. Elige escenarios relevantes: persona nueva, habitual y que vuelve tras un fallo; no inventes una investigación de usuarios.

Para cada tarea, sigue entrada, pasos, traspasos entre áreas, resultado y regreso. Comprueba qué debe saber o preparar la persona antes de cada paso. Revisa estados vacíos, fallos y salida/cancelación donde correspondan. Busca información repetida, cambio de contexto innecesario, navegación circular, acciones sin siguiente paso, resultados difíciles de localizar y permisos que interrumpen sin explicación.

Prefiere evidencia del producto funcionando; complementa con código y documentación. Identifica explícitamente el origen: **observado en ejecución**, **constatado en código**, **visible en captura** o **hipótesis**. No llames observado en ejecución a un recorrido imaginado. Vincula el hallazgo a una ruta/estado, archivo o captura concreta. Lee los criterios de `principles.md` como preguntas, sin forzar todos en cada pantalla.

## Proponer

Cada hallazgo debe incluir: tarea y paso afectados, evidencia, consecuencia para la persona, prioridad razonada, confianza, propuesta y esfuerzo/riesgos aproximados. Prioriza bloqueos, pérdida de trabajo y errores costosos; después fricción frecuente y mejoras menores. No uses notas globales arbitrarias ni declares una interfaz lista solo por pasar una checklist.

Mantén el nivel de intervención elegido. Si solucionar la causa requiere excederlo, explica el límite y ofrece esa alternativa para una decisión posterior. Para propuestas estructurales, compara conservar/mejorar con reconstruir: beneficio esperado, capacidades que deben mantenerse, coste de migración, riesgos y estrategia incremental. Recomienda reconstruir solo con evidencia que justifique su coste.

Entrega cobertura (recorridos y estados inspeccionados y no inspeccionados), hallazgos priorizados y un plan revisable. Cierra la auditoría cuando el alcance acordado esté cubierto o exista un bloqueo explícito; no iteres indefinidamente sobre personas ficticias. Pregunta qué propuesta implementar si no existe autorización previa concreta. La elección del alcance de auditoría no cuenta como aprobación de las modificaciones.
