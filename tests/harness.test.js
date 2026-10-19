import test from "node:test";
import assert from "node:assert/strict";
import { mkdtemp, mkdir, readFile, writeFile, rm, access, symlink, cp } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { spawnSync } from "node:child_process";

const cli = fileURLToPath(new URL("../bin/jota.js", import.meta.url));
const run = (cwd, ...args) => spawnSync(process.execPath, [cli, ...args], { cwd, encoding: "utf8", timeout: 10_000 });
async function project(t) {
  const cwd = await mkdtemp(path.join(os.tmpdir(), "jota-test-"));
  t.after(() => rm(cwd, { recursive: true, force: true }));
  return cwd;
}
async function config(cwd, checks) {
  await writeFile(path.join(cwd, "jota.config.json"), JSON.stringify({ version: 1, checks }));
}
const marker = (name, stage, text = name) => ({
  name, stage,
  command: [process.execPath, "-e", `require('node:fs').appendFileSync('runs', ${JSON.stringify(text + "\n")})`],
});

test("installs all adapters once and preserves existing agent instructions", async (t) => {
  const cwd = await project(t);
  await writeFile(path.join(cwd, "AGENTS.md"), "Regla del usuario\n");
  const result = run(cwd, "onboard", "--target=claude,codex,opencode,codex", "--yes");
  assert.equal(result.status, 0, result.stderr);
  for (const file of ["JOTA.md", "docs/PROJECT.md", "docs/features/TEMPLATE.md", "jota.config.json",
    ".claude/skills/jota/SKILL.md", ".agents/skills/jota/SKILL.md", ".opencode/skills/jota/SKILL.md", "CLAUDE.md"]) {
    await access(path.join(cwd, file));
  }
  const agents = await readFile(path.join(cwd, "AGENTS.md"), "utf8");
  assert.ok(agents.startsWith("Regla del usuario\n"));
  assert.equal(agents.split("<!-- JOTA:START -->").length, 2);
  assert.notEqual(run(cwd, "onboard", "--target=codex", "--yes").status, 0);
  assert.equal(await readFile(path.join(cwd, "AGENTS.md"), "utf8"), agents);
});

test("conflicts and symlinked output directories fail before writing", async (t) => {
  const cwd = await project(t);
  await writeFile(path.join(cwd, "jota.config.json"), "preserve me");
  assert.notEqual(run(cwd, "onboard", "--target=codex", "--yes").status, 0);
  await assert.rejects(access(path.join(cwd, "JOTA.md")));
  await rm(path.join(cwd, "jota.config.json"));
  const outside = await project(t);
  await symlink(outside, path.join(cwd, "docs"), "dir");
  assert.notEqual(run(cwd, "onboard", "--target=codex", "--yes").status, 0);
  await assert.rejects(access(path.join(cwd, "JOTA.md")));
  await assert.rejects(access(path.join(outside, "PROJECT.md")));
});

test("preview and invalid targets write nothing", async (t) => {
  const cwd = await project(t);
  const preview = run(cwd, "onboard", "--target=agents", "--dry-run");
  assert.equal(preview.status, 0, preview.stderr);
  assert.match(preview.stdout, /Vista previa/);
  await assert.rejects(access(path.join(cwd, "JOTA.md")));
  assert.notEqual(run(cwd, "onboard", "--target=unknown", "--yes").status, 0);
  await assert.rejects(access(path.join(cwd, "JOTA.md")));
});

test("full verification runs fast checks first and default skips full checks", async (t) => {
  const cwd = await project(t);
  await config(cwd, [marker("build", "full"), marker("lint", "fast")]);
  assert.equal(run(cwd, "verify").status, 0);
  assert.equal(await readFile(path.join(cwd, "runs"), "utf8"), "lint\n");
  await rm(path.join(cwd, "runs"));
  assert.equal(run(cwd, "verify", "--full").status, 0);
  assert.equal(await readFile(path.join(cwd, "runs"), "utf8"), "lint\nbuild\n");
});

test("a failed check stops later commands; empty or invalid checks cannot pass", async (t) => {
  const cwd = await project(t);
  const failing = { name: "fails", stage: "fast", command: [process.execPath, "-e", "process.exit(7)"] };
  await config(cwd, [failing, marker("later", "fast")]);
  assert.notEqual(run(cwd, "verify").status, 0);
  await assert.rejects(access(path.join(cwd, "runs")));
  await config(cwd, []);
  assert.notEqual(run(cwd, "verify").status, 0);
  await config(cwd, [marker("first", "fast"), { ...failing, command: "echo nope" }]);
  assert.notEqual(run(cwd, "verify").status, 0);
  await assert.rejects(access(path.join(cwd, "runs")));
});

test("passes shell syntax literally and reports timed out commands", async (t) => {
  const cwd = await project(t);
  const literal = "$(touch should-not-exist); *";
  await config(cwd, [{ name: "literal", stage: "fast", command: [process.execPath, "-e",
    "require('node:fs').writeFileSync('runs', process.argv[1])", literal] }]);
  assert.equal(run(cwd, "verify").status, 0);
  assert.equal(await readFile(path.join(cwd, "runs"), "utf8"), literal);
  await assert.rejects(access(path.join(cwd, "should-not-exist")));
  await config(cwd, [{ name: "timeout", stage: "fast", timeoutMs: 100,
    command: [process.execPath, "-e", "setInterval(() => {}, 1000)"] }]);
  assert.notEqual(run(cwd, "verify").status, 0);
});

test("installs and runs from a Git package URL in a separate consumer project", async (t) => {
  const base = await mkdtemp(path.join(os.tmpdir(), "jota-git-source-"));
  t.after(() => rm(base, { recursive: true, force: true }));
  const source = fileURLToPath(new URL("..", import.meta.url));
  const repo = path.join(base, "harness-repo");
  const consumer = path.join(base, "consumer-project");
  await cp(source, repo, { recursive: true, filter: (entry) => !["node_modules", ".git"].includes(path.basename(entry)) });
  await mkdir(consumer);
  const git = (args) => spawnSync("git", args, { cwd: repo, encoding: "utf8" });
  for (const args of [["init", "-q"], ["add", "."], ["-c", "user.name=JOTA", "-c", "user.email=jota@example.test", "commit", "-qm", "fixture"]]) {
    const result = git(args);
    assert.equal(result.status, 0, result.stderr);
  }
  const env = { ...process.env, npm_config_cache: path.join(base, "npm-cache") };
  const packageUrl = `git+file://${repo}`;
  const npm = (...args) => spawnSync("npm", ["exec", "--yes", `--package=${packageUrl}`, "--", "jota", ...args], {
    cwd: consumer, env, encoding: "utf8", timeout: 60_000,
  });
  let result = npm("onboard", "--target=agents", "--dry-run");
  assert.equal(result.status, 0, result.stderr);
  assert.match(result.stdout, /Vista previa/);
  await assert.rejects(access(path.join(consumer, "JOTA.md")));
  result = npm("onboard", "--target=agents", "--yes");
  assert.equal(result.status, 0, result.stderr);
  assert.match(await readFile(path.join(consumer, "AGENTS.md"), "utf8"), /JOTA:START/);
  assert.match(await readFile(path.join(consumer, "JOTA.md"), "utf8"), /15 principios/);
});
