# JOTA

JOTA es un harness para programar con IA siguiendo bases de ingeniería de software. Se instala en un proyecto para que distintos agentes compartan criterios, contexto y un flujo de trabajo: **entender → implementar → verificar → documentar**.

Está inspirado en la memoria compartida y la instalación por agente de [rsc-harness](https://github.com/ericrisco/rsc-harness). Su alcance parte de los 15 principios definidos para JOTA y de mantener el proceso sencillo.

## Las bases

El núcleo está en [JOTA.md](templates/shared/JOTA.md): SOLID, KISS/YAGNI, DRY, separación de responsabilidades, cohesión y acoplamiento, contratos, seguridad, observabilidad, trazabilidad, documentación continua, instrucciones mínimas, verificación, automatización, feedback rápido y reproducibilidad.

Ejemplo: al pedir una funcionalidad, el agente recupera el contexto del proyecto, define cómo reconocer que está resuelta, realiza el cambio necesario, ejecuta las comprobaciones y registra lo que necesita saber la siguiente sesión. Una decisión de arquitectura requiere explicar su motivo; un cambio pequeño recibe un proceso pequeño.

## Uso local

Requiere Node.js 20 o superior. No hay dependencias de ejecución. El paquete todavía no está publicado.

## Instalación desde GitHub

No necesitas clonar JOTA ni publicarlo en npm. Desde la raíz del proyecto que recibirá el harness, npm puede ejecutar el CLI directamente desde el repositorio GitHub:

```sh
npm exec --yes --package=github:krezx/jota-harness -- jota onboard --target=codex --dry-run
npm exec --yes --package=github:krezx/jota-harness -- jota onboard --target=codex --yes
```

El repo es [krezx/jota-harness](https://github.com/krezx/jota-harness). Cambia `codex` por `claude` u `opencode` según el agente activo; usa `agents` para instalar las instrucciones y skill compartidas con agentes que siguen `AGENTS.md`. La primera orden imprime el plan y no escribe. La segunda instala ese plan. npm requiere Node.js 20+ y Git.

### Instrucción para pasarle el link a un agente

Cuando compartas el enlace del repo, pídele: «Instala JOTA desde este repositorio en el proyecto en que estamos trabajando. Lee su README y AGENTS.md, identifica el agente actual y la raíz del proyecto destino, ejecuta primero onboard con --dry-run, revisa los archivos que agregará y luego aplica el mismo plan con --yes. No trabajes dentro del checkout de JOTA. Al terminar, lee JOTA.md y completa docs/PROJECT.md usando solo datos comprobados del proyecto».

El archivo `AGENTS.md` de este repositorio contiene esos pasos para el agente. JOTA incluye adaptadores para Claude Code, Codex y OpenCode, además de un destino compartido para agentes que leen `AGENTS.md`. La compatibilidad genérica depende de que el agente siga ese estándar.

El instalador pone una base común, contexto, registro de trabajo y comandos de verificación en el proyecto destino. Añade bloques breves a `AGENTS.md` y/o `CLAUDE.md`, preservando el resto del contenido. Rechaza colisiones y rutas enlazadas antes de escribir. Actualización y desinstalación automáticas quedan pendientes.

Luego el agente debe configurar las verificaciones según el stack del proyecto. JOTA incluye las plantillas y `jota verify`; la instalación no inventa comandos que el proyecto no tenga.

## Comprobaciones

En el proyecto receptor, configura comandos reales en `jota.config.json`. Este es un ejemplo de estructura; reemplaza los comandos por los que existan en tu proyecto:

```json
{
  "version": 1,
  "checks": [
    { "name": "lint", "stage": "fast", "command": ["npm", "run", "lint"] },
    { "name": "tests", "stage": "fast", "command": ["npm", "test"] },
    { "name": "build", "stage": "full", "command": ["npm", "run", "build"] }
  ]
}
```

Ejecuta desde la raíz del proyecto con un CLI instalado o desde este repo:

```sh
npm exec --yes --package=github:krezx/jota-harness -- jota verify
npm exec --yes --package=github:krezx/jota-harness -- jota verify --full
```

Una ejecución completa realiza primero los checks rápidos. Un fallo detiene el proceso; una lista vacía no cuenta como éxito. Los comandos se ejecutan sin shell, con un límite predeterminado de 120 segundos por check (configurable con `timeoutMs`). La configuración puede ejecutar programas con tus permisos: revísala como revisarías scripts del proyecto. No pongas secretos en los argumentos.

Los checks automatizan lo verificable. La calidad del diseño y la pertinencia de la documentación siguen requiriendo revisión. La actualización obligatoria de documentación se exige en el flujo del agente; un bloqueo automático por cambios sin documentación necesita un check del proyecto o CI. Esta versión no instala hooks ni cambia permisos de los agentes.

## Publicación en GitHub

```sh
npm pack --dry-run
npm test
```

El repositorio es público para que el comando de instalación funcione sin credenciales. Aún no se publica el paquete en npm. Usa `github:krezx/jota-harness#v0.1.0` (o el tag de la versión elegida) en vez de la rama principal para fijar qué versión instalar. La acción de GitHub comprueba instalación limpia, tests y contenido del paquete para Node 20, 22 y 24.
