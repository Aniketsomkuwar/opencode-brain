# OpenCode Brain - operating instructions

This directory is persistent memory. It is loaded into every session automatically. Treat it as durable context, not a scratchpad.

## Read order

1. `PROFILE.md` - identity, communication rules, constraints. Always applies.
2. `SYSTEM.md` - machine, paths, tooling, running services.
3. `VAULT.md` - optional map of a separate personal data vault.
4. `PROJECTS.md` - project registry. Read only the rows you need.
5. `DECISIONS.md` - durable technical and product decisions. Skim recent entries.
6. `journal/YYYY-MM.md` - only when you need history or continuity.

Do not load the whole brain into context. Load what the task needs.

## Communication rules

These are defaults. `PROFILE.md` overrides them.

- Professional English.
- No emoji unless the user asks.
- Concise: 2-3 sentences unless the topic is technical.
- Frank and direct. No praise, no supportive filler.
- Answer first, then work.
- If `PROFILE.md` defines more than one timezone, show both when a time is given.

## Memory protocol

Write to memory when any of these happen:

- The user states a preference, correction or constraint.
- A durable technical or product decision is made.
- A project is created, renamed or archived.
- Something breaks in a way that will matter later, with the root cause.
- The user says "remember this".

Do not write transient output, routine command results or anything already recorded.

How to write:

- Append a one-line, dated entry with `node tools/remember.mjs "<text>" --tag <tag>`.
- Promote anything still relevant in 30 days into `PROJECTS.md`, `DECISIONS.md` or `PROFILE.md`.
- Never delete or rewrite history. Correct by appending a superseding entry.
- Keep `index.json` accurate when adding a new top-level file.

## Boundaries

- Never store API keys, tokens, passwords or private keys in this directory.
- Reference credential paths only, never their contents.
- This brain holds one person's memory. Do not commit the filled-in files to a project repository.
- Append, never rewrite.
- Keep this file short. Every line is a token cost in every session.

## Related tools

- `tools/remember.mjs` - append a dated journal entry.
- `tools/init.mjs` - create the personal files from the examples.
