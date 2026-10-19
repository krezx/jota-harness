import { readFile } from "node:fs/promises";
import path from "node:path";
import { spawnSync } from "node:child_process";

export async function verify({ cwd = process.cwd(), full = false } = {}) {
  const config = JSON.parse(await readFile(path.join(cwd, "jota.config.json"), "utf8"));
  if (!config || config.version !== 1 || !Array.isArray(config.checks)) {
    throw new Error("jota.config.json requiere version: 1 y un array checks.");
  }
  const names = new Set();
  // Validate the entire configuration before running any project command.
  for (const check of config.checks) {
    if (!check || typeof check.name !== "string" || !check.name.trim() || names.has(check.name)
      || !["fast", "full"].includes(check.stage)
      || !Array.isArray(check.command) || !check.command.length
      || check.command.some((arg) => typeof arg !== "string" || arg.includes("\0"))
      || !check.command[0].trim()
      || (check.timeoutMs !== undefined && (!Number.isSafeInteger(check.timeoutMs) || check.timeoutMs <= 0))) {
      throw new Error("Check inválido: usa nombre único, etapa fast/full, command como array y timeoutMs positivo.");
    }
    names.add(check.name);
  }
  const selected = [
    ...config.checks.filter((check) => check.stage === "fast"),
    ...(full ? config.checks.filter((check) => check.stage === "full") : []),
  ];
  if (!selected.length) throw new Error("No hay checks para esta etapa. Configura comandos reales en jota.config.json.");
  for (const check of selected) {
    console.log(`[JOTA] ${check.stage}: ${check.name}`);
    const start = Date.now();
    const result = spawnSync(check.command[0], check.command.slice(1), {
      cwd, stdio: "inherit", shell: false, timeout: check.timeoutMs ?? 120_000,
      killSignal: "SIGKILL",
    });
    if (result.error || result.signal || result.status !== 0) {
      console.error(`[JOTA] Falló ${check.name}: ${result.error?.message ?? result.signal ?? `salida ${result.status}`}`);
      return 1;
    }
    console.log(`[JOTA] OK ${check.name} (${Date.now() - start} ms)`);
  }
  return 0;
}
