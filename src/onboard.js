import { mkdir, readFile, writeFile, appendFile, lstat } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../templates");
const TARGETS = new Set(["agents", "claude", "codex", "opencode"]);
const DESTINATIONS = {
  agents: ".agents/skills/jota/SKILL.md",
  claude: ".claude/skills/jota/SKILL.md",
  codex: ".agents/skills/jota/SKILL.md",
  opencode: ".opencode/skills/jota/SKILL.md",
};
const SHARED_FILES = [
  ["shared/JOTA.md", "JOTA.md"],
  ["shared/docs/PROJECT.md", "docs/PROJECT.md"],
  ["shared/jota.config.json", "jota.config.json"],
  ["shared/docs/decisions/TEMPLATE.md", "docs/decisions/TEMPLATE.md"],
  ["shared/docs/features/TEMPLATE.md", "docs/features/TEMPLATE.md"],
];

export async function onboard({ requestedTargets, prompt, accept = false, dryRun = false, cwd = process.cwd() }) {
  const targets = [...new Set(requestedTargets?.length ? requestedTargets : await chooseTargets(prompt, cwd))];
  const invalid = targets.filter((target) => !TARGETS.has(target));
  if (invalid.length) throw new Error(`Unknown target(s): ${invalid.join(", ")}. Choose agents, claude, codex, or opencode.`);
  if (!targets.length) throw new Error("Choose at least one agent: agents, claude, codex, or opencode.");

  const files = [...new Map([
    ...SHARED_FILES,
    ...targets.map((target) => ["skills/jota/SKILL.md", DESTINATIONS[target]]),
  ].map(([source, destination]) => [destination, [source, destination]])).values()];
  const entries = [...new Set(targets.map((target) => target === "claude" ? "CLAUDE.md" : "AGENTS.md"))];
  const block = "\n<!-- JOTA:START -->\n## JOTA\nAntes de programar, lee `JOTA.md` y `docs/PROJECT.md` en la raíz del proyecto.\nSigue el flujo y las bases de JOTA; registra decisiones, implementación y verificaciones en el registro de la tarea.\n<!-- JOTA:END -->\n";
  const entryContents = new Map();
  for (const destination of [...files.map(([, destination]) => destination), ...entries]) {
    await validatePath(cwd, destination);
  }
  for (const entry of entries) {
    const entryPath = path.join(cwd, entry);
    const existed = await exists(entryPath);
    const existing = existed ? await readFile(entryPath, "utf8") : "";
    if (existing.includes("<!-- JOTA:")) throw new Error(`${entry} ya contiene una entrada JOTA.`);
    entryContents.set(entry, { existed, content: existing ? block : `${existing}${block}` });
  }
  const conflicts = [];
  for (const [, destination] of files) {
    if (await exists(path.join(cwd, destination))) conflicts.push(destination);
  }
  if (conflicts.length) {
    throw new Error(`Will not overwrite existing files:\n${conflicts.map((file) => `  - ${file}`).join("\n")}\nMove or rename them, then try again.`);
  }

  console.log("JOTA instalaría estos archivos:");
  for (const [, destination] of files) console.log(`  + ${destination}`);
  for (const entry of entries) console.log(`  + Entrada breve en ${entry} (conserva contenido previo)`);
  if (dryRun) {
    console.log("Vista previa: no se escribieron archivos.");
    return 0;
  }
  if (!accept) {
    if (!prompt) throw new Error("Vista previa solamente. Ejecuta con --yes después de revisar el plan.");
    const answer = await prompt.question("Apply this plan? [y/N] ");
    if (answer.trim().toLowerCase() !== "y") {
      console.log("No files written.");
      return 0;
    }
  }

  for (const [source, destination] of files) {
    const content = await readFile(path.join(ROOT, source), "utf8");
    const output = path.join(cwd, destination);
    await mkdir(path.dirname(output), { recursive: true });
    await writeFile(output, content, { encoding: "utf8", flag: "wx" });
  }
  for (const [entry, { existed, content }] of entryContents) {
    const entryPath = path.join(cwd, entry);
    if (existed) await appendFile(entryPath, content, "utf8");
    else await writeFile(entryPath, content, { encoding: "utf8", flag: "wx" });
  }
  console.log("JOTA instalado. Completa docs/PROJECT.md con tu agente.");
  return 0;
}

async function chooseTargets(prompt, cwd) {
  if (!prompt) return [];
  const detected = [];
  if (await exists(path.join(cwd, ".claude"))) detected.push("claude");
  if (await exists(path.join(cwd, ".codex")) || await exists(path.join(cwd, "AGENTS.md"))) detected.push("codex");
  if (await exists(path.join(cwd, ".opencode")) || await exists(path.join(cwd, "opencode.json"))) detected.push("opencode");
  console.log(`Detected agents: ${detected.length ? detected.join(", ") : "none"}.`);
  const answer = await prompt.question("Which agents should JOTA support? (claude,codex,opencode) ");
  return answer.split(",").map((target) => target.trim().toLowerCase()).filter(Boolean);
}

async function exists(file) {
  try {
    await lstat(file);
    return true;
  } catch (error) {
    if (error.code === "ENOENT") return false;
    throw error;
  }
}

async function validatePath(cwd, destination) {
  let current = cwd;
  const parts = destination.split("/");
  for (const [index, part] of parts.entries()) {
    current = path.join(current, part);
    if (!await exists(current)) continue;
    const info = await lstat(current);
    if (info.isSymbolicLink() || (index < parts.length - 1 ? !info.isDirectory() : !info.isFile())) {
      throw new Error(`Ruta incompatible o enlace simbólico: ${destination}`);
    }
  }
}
