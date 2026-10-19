# 0001: Build JOTA as a portable agent harness

- Status: accepted
- Date: 2026-10-17

## Context

JOTA should be installable into software projects and usable from different AI coding agents. Its first workflow should stay understandable and small.

## Decision

Distribute JOTA as a Node.js CLI through npm. Keep shared instructions and project memory in ordinary Markdown, and install a small native skill entry for Claude Code, Codex, and OpenCode. Onboarding previews changes and avoids overwriting existing files.

## Consequences

- One project can share context across the initial supported agents.
- The first version does not depend on agent APIs, hooks, databases, or model providers.
- Publishing waits until the package name and publisher identity are chosen.
