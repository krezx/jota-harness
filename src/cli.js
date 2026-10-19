import { createInterface } from "node:readline/promises";
import { stdin, stdout } from "node:process";
import { onboard } from "./onboard.js";
import { verify } from "./verify.js";

export async function run(args) {
  const [command, ...options] = args;
  if (!command || command === "--help" || command === "-h") {
    console.log(`JOTA — a shared working system for AI coding agents

Usage:
  jota onboard [--target=claude,codex,opencode]
  jota verify [--full]

Commands:
  onboard   Instalar las bases y el flujo de JOTA (--dry-run revisa, --yes aplica)
  verify    Ejecutar checks rápidos; --full añade las comprobaciones completas`);
    return command ? 0 : 1;
  }
  if (command === "--version" || command === "-v") {
    console.log("jota 0.1.0");
    return 0;
  }
  if (command === "verify") {
    if (options.some((option) => option !== "--full")) {
      console.error("verify solo admite --full.");
      return 2;
    }
    try {
      return await verify({ full: options.includes("--full") });
    } catch (error) {
      console.error(`jota: ${error.message}`);
      return 1;
    }
  }
  if (command !== "onboard") {
    console.error(`Unknown command: ${command}`);
    return 2;
  }

  const targetArg = options.find((option) => option.startsWith("--target="));
  const requestedTargets = targetArg?.slice("--target=".length).split(",").filter(Boolean);
  const unknownOptions = options.filter((option) => !option.startsWith("--target=") && !["--yes", "--dry-run"].includes(option));
  if (unknownOptions.length) {
    console.error(`Unknown option(s): ${unknownOptions.join(", ")}`);
    return 2;
  }
  if (options.includes("--yes") && options.includes("--dry-run")) {
    console.error("Usa --yes o --dry-run, no ambos.");
    return 2;
  }
  const prompt = stdin.isTTY && stdout.isTTY
    ? createInterface({ input: stdin, output: stdout })
    : null;
  try {
    return await onboard({ requestedTargets, prompt, accept: options.includes("--yes"), dryRun: options.includes("--dry-run") });
  } catch (error) {
    console.error(`jota: ${error.message}`);
    return 1;
  } finally {
    prompt?.close();
  }
}
