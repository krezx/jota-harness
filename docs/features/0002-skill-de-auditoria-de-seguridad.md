# Skill de auditoría de seguridad

- Estado: implementada; validación automatizada ejecutada.
- Requisito: ante una pregunta o revisión de seguridad, los agentes instalados con JOTA deben cargar la skill oficial `cloudflare/security-audit-skill`.
- Fuente: copia de `skills/security-audit/` del commit `c1c8a8c1471069fb0e188eeaff69b8e8db6564a8`; licencia MIT incluida.

## Implementación

- `templates/skills/security-audit/`: skill y archivos auxiliares completos, con metadatos de procedencia.
- `src/onboard.js`: instala esos archivos en el directorio de skills propio de cada agente y mantiene la detección de colisiones existente.
- `templates/shared/JOTA.md` y `templates/skills/jota/SKILL.md`: indican que se use ante cualquier solicitud de seguridad y que el alcance del flujo (orientación o auditoría completa) dependa de la solicitud.
- `README.md`: documenta la inclusión en onboarding.

## Verificación

- `npm test`: 72 pruebas pasaron, 0 fallaron (2026-11-05). Incluye onboarding para los cuatro adaptadores, copia de documentos auxiliares y la prueba de instalación desde un paquete Git en un proyecto temporal.

## Continuidad

Al actualizar la skill, sincronizar la carpeta upstream y el commit registrado en `UPSTREAM.txt`.
