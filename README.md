# OpenCode Brain

Persistent memory for your AI coding agent, stored outside your projects so it survives new sessions, reinstalls and new repositories.

Your agent forgets everything between sessions. `AGENTS.md` fixes that for one repo. This fixes it for everything: one small directory of plain Markdown, loaded into every session, that tells the agent who you are, what you are working on, what you have already decided, and what it must never do.

No database, no daemon, no dependencies. Node 18+ for the two helper scripts.

![OpenCode Brain](assets/hero.png)

## How it loads

`AGENTS.md` is registered in your OpenCode config under `instructions`, so it is injected into every session automatically:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "instructions": ["/absolute/path/to/opencode-brain/AGENTS.md"]
}
```

The file is deliberately short. It defines the rules and the read order, then points at the other files. Nothing else loads automatically, and the agent is told to read only what the task needs. This keeps the token cost of memory low.

## Quick start

```bash
git clone https://github.com/Aniketsomkuwar/opencode-brain ~/opencode-brain
cd ~/opencode-brain
node tools/init.mjs
```

Then:

1. Edit `PROFILE.md`, `CHANNELS.md`, `SYSTEM.md` and `PROJECTS.md`. Delete anything that does not apply.
2. Seed `SKILLS.md` with the workflows you repeat, or leave the example and add them later.
2. Add `AGENTS.md` to your `opencode.json` under `instructions`, as shown above.
3. Start a new OpenCode session and ask it to read your name and communication rules back to you.

The personal files are gitignored on purpose. Your memory stays on your machine.

## Install with an AI agent

Do not want to fill the templates by hand? Paste [`prompt.md`](prompt.md) into Claude Code, Codex, Cursor, Gemini CLI, Aider or any agent that can run shell commands. It detects the OS, asks you a short set of questions, fills the files, wires `opencode.json` and verifies that a new session actually loaded the brain.

**macOS and Linux: install with this prompt.** It detects the OS first, so the paths, config file and shell commands match the machine.

## What is in here

| Path | Tracked | Purpose |
|---|---|---|
| `AGENTS.md` | yes | Rules, memory protocol and read order. The only file loaded automatically |
| `PROFILE.md` | no | Who you are, how to communicate, hard rules |
| `CHANNELS.md` | no | Per-surface communication rules: Telegram, CLI, voice |
| `SYSTEM.md` | no | Machine, paths, toolchain, services |
| `VAULT.md` | no | Optional map of a separate personal data vault |
| `PROJECTS.md` | no | Project registry, read selectively |
| `DECISIONS.md` | no | Durable decisions, append-only |
| `SKILLS.md` | no | Index of class-level skills, one line per class |
| `skills/` | README + example | Class-level procedures: `SKILL.md` plus `references/` |
| `journal/YYYY-MM.md` | no | Dated history, one line per entry |
| `index.json` | no | Machine-readable manifest |
| `tools/init.mjs` | yes | Creates your personal files from the examples |
| `tools/remember.mjs` | yes | Appends one dated line and refreshes `index.json` |
| `tools/learn.mjs` | yes | Lists skills, scaffolds a class, reviews the journal |

`*.example.md` files are the templates. `tools/init.mjs` copies them to the real names only if the real file does not exist, so it is safe to run twice.

## Writing memory

```bash
node tools/remember.mjs "User prefers pnpm over npm" --tag preference
```

That appends one dated line to the current month's journal and refreshes `index.json`. Anything that will still matter in 30 days should be promoted into `PROJECTS.md`, `DECISIONS.md` or `PROFILE.md`. History is never deleted.

If you use the [OpenCode Telegram gateway](https://github.com/Aniketsomkuwar/opencode-telegram-gateway), point `rememberScript` at `tools/remember.mjs` and the same action becomes `/remember <text>` from Telegram. The gateway also prefixes Telegram prompts with `[surface: telegram]` by default, which is what `CHANNELS.md` keys on, so the agent knows to answer in chat style instead of terminal style. Set `surfaceHint: false` in the gateway config to turn the marker off.

## Memory that grows

Three layers, each loaded at a different cost:

1. `AGENTS.md` is always loaded. Keep it short.
2. `PROFILE.md`, `CHANNELS.md` and `SKILLS.md` load when the task needs identity, surface rules or a procedure.
3. `skills/<class>/SKILL.md` and its `references/` load only when a row matches.

The loop is capture, review, distill, retire. `remember.mjs` captures. `learn.mjs review` shows what is tagged for promotion. A procedure repeated three times becomes a class-level skill:

```bash
node tools/learn.mjs new publishing
node tools/learn.mjs list
```

Class-level means one `SKILL.md` per family of work, with `references/` for depth, not one skill per command. The same split keeps the index cheap and the detail available.

## Rules that make it work

- **Append, never rewrite.** Corrections are new entries that supersede old ones. You keep the audit trail.
- **Keep `AGENTS.md` short.** It is loaded into every session, so every line is a permanent token cost.
- **Load on demand.** `PROFILE.md`, `SYSTEM.md`, `PROJECTS.md` and the journal are read only when the task needs them.
- **No secrets.** Reference credential paths, never the values.
- **Personal memory is not project memory.** Keep this directory out of your application repositories.

## Privacy

The repository ships templates only. `init` creates `PROFILE.md`, `CHANNELS.md`, `SYSTEM.md`, `VAULT.md`, `PROJECTS.md`, `DECISIONS.md`, `SKILLS.md`, `index.json` and `journal/*.md` as local, gitignored files. `git status` stays clean after you fill them in.

If you want to version your own memory privately, fork the repo, remove those entries from `.gitignore`, and push to a private repository. Do not do that to a public one.

## FAQ

**Does this cost tokens in every session?**
Yes, `AGENTS.md` does. That is why it is short and why everything else is load-on-demand. A typical `AGENTS.md` costs a few hundred tokens, not thousands.

**Does it work with agents other than OpenCode?**
The pattern is portable. Any agent that reads `AGENTS.md` from the project or home directory can use it. The installer wires OpenCode specifically; for other tools, point their instruction file at this `AGENTS.md` or symlink it.

**Can I use it across machines?**
Yes. Plain text. Put the directory in Dropbox, Syncthing or a private git repo. Avoid a public repo for the filled-in files.

**What if the agent writes something wrong?**
Correct it by appending a superseding entry. Never silently rewrite history, or you lose the reason the earlier entry existed.

## License

MIT. See [`LICENSE`](LICENSE).
