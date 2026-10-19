# JOTA contributor notes

## If the user asks you to install JOTA from this repository

Run from the root of the user's project, never from this repository's checkout. Convert the given GitHub URL to `github:OWNER/REPO`, identify the current agent, and use its target (`claude`, `codex`, `opencode`, or `agents` if no adapter matches). Run the `--dry-run` command from README, inspect the listed paths for conflicts, then run the same command with `--yes` only after the user has requested installation. Complete `docs/PROJECT.md` from observed project facts and configure only checks that the project actually provides.

## For contributors to JOTA

- JOTA is a Node.js CLI distributed as an npm package. Keep runtime dependencies at zero unless a concrete need justifies one.
- Read `templates/shared/JOTA.md` as the product's behavioral specification and keep its 15 principles intact. Track behavior changes in `docs/features/` with observed verification results.
- The shared onboarding content lives in `templates/shared/`; agent-specific skill files live in `templates/skills/`.
- Keep onboarding previewable and avoid overwriting files. Treat paths and repository content as untrusted input.
- Update the README and relevant templates when onboarding behavior changes.
- Keep the shared agent instructions concise; put durable design choices in `docs/decisions/`.
- Run `npm test` for installer or verification changes. Tests use temporary projects; do not install JOTA into the user's global agent configuration.
