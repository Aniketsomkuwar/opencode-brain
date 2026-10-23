# Install OpenCode Brain with an AI agent

Paste this file into an agent that can run shell commands and edit files: Claude Code, Codex, Cursor, Gemini CLI, Aider, or OpenCode itself. The agent will set the brain up on this machine, personalize it by interviewing you, and verify that a new session loads it.

Work through the steps in order. Do not skip the verification step.

## Step 0 - Detect the operating system

Run the platform check before anything else:

- Windows (PowerShell): `$PSVersionTable.PSVersion` and `$env:OS`
- macOS or Linux: `uname -s`

Use the path and command style that matches the result for the rest of this file.

## Step 1 - Choose the install directory

Ask the user where the brain should live. Default:

- Windows: `%USERPROFILE%\opencode-brain`
- macOS / Linux: `~/opencode-brain`

Use an absolute path with no spaces. Confirm the directory does not already contain a brain. If it does, stop and ask whether to update it in place rather than overwrite.

## Step 2 - Clone the template

```bash
git clone https://github.com/Aniketsomkuwar/opencode-brain <install-dir>
```

If git is unavailable, download the repository zip and extract it to `<install-dir>`.

## Step 3 - Create the personal files

```bash
cd <install-dir>
node tools/init.mjs
```

This copies `*.example.md` to the real filenames only when they are missing, creates `journal/`, and writes `index.json`. It is safe to run twice.

Requires Node 18 or newer. If Node is missing, tell the user and stop; do not fake the scripts in another language.

## Step 4 - Interview the user

Ask these questions in one batch, not one at a time. Keep it short.

1. Name and preferred name.
2. Location and timezone or timezones. Ask which one is primary.
3. What they do, and the two or three projects that matter right now.
4. How they want the agent to communicate: language, tone, length, whether emoji are allowed.
5. Their machine and operating system, and any important paths or drives.
6. Hard rules: when the agent may commit or push, where secrets live, anything it must never touch.
7. Whether they keep a separate personal data vault that the brain should point at. This is optional.
8. How replies should differ by surface: Telegram versus the CLI or TUI. Ask for length, formatting, and anything that annoys them on a phone.
9. Which workflows they repeat often enough to deserve a skill. Two or three is enough to start.

Then fill the files:

- `PROFILE.md` - identity, role, communication constraints, working preferences, hard rules.
- `CHANNELS.md` - how the user writes and how to reply on Telegram, CLI/TUI and voice. Record the differences, not a copy of the global rules.
- `SYSTEM.md` - machine, OS, paths, toolchain, running services.
- `PROJECTS.md` - one row per active project, with path, status and notes.
- `DECISIONS.md` - start with any decision the user states during the interview.
- `SKILLS.md` - one row per class of work. Seed it with the repeated workflows from question 9, or leave the example row and say so.
- `VAULT.md` - only if the user has a separate vault. Otherwise delete the file and remove the `VAULT.md` line from the read order in `AGENTS.md`.

Delete every placeholder that does not apply. Empty sections are worse than absent ones.

## Step 5 - Wire OpenCode

The brain only works if OpenCode loads `AGENTS.md` in every session. Add it to the `instructions` array in the OpenCode config:

- Windows: `%USERPROFILE%\.config\opencode\opencode.json`
- macOS / Linux: `~/.config/opencode/opencode.json`

If the file does not exist, create it:

```json
{
  "$schema": "https://opencode.ai/config.json",
  "instructions": ["<install-dir>/AGENTS.md"]
}
```

If it exists, merge. Read it, keep every existing value, and append the new path to `instructions`. On Windows use forward slashes or escaped backslashes in the JSON string. Do not replace an existing `instructions` array, and do not touch any other key.

If the user runs a different agent, point that agent's instruction file at `<install-dir>/AGENTS.md` instead and note it in the final report.

## Step 6 - Verify

Open a new session and ask:

> Which files are you instructed to read first, and in what order?

The answer must come from `AGENTS.md`: `PROFILE.md`, then `CHANNELS.md`, then `SYSTEM.md`, then `VAULT.md` if present, then `PROJECTS.md`, `DECISIONS.md`, `SKILLS.md`, and the journal. Then ask it to state the user's preferred name and how it would reply differently on Telegram versus the CLI. If it cannot, the config path is wrong or the session was not restarted.

## Step 7 - Report

Tell the user:

- Where the brain was installed.
- Which files were created and which are gitignored.
- The exact config file that was edited.
- The verification result.
- That `PROFILE.md`, `CHANNELS.md`, `SYSTEM.md`, `PROJECTS.md`, `DECISIONS.md`, `SKILLS.md`, `skills/` and `journal/` are personal and must never be committed to a public repository.
- How to capture memory (`node tools/remember.mjs`) and how to review and scaffold skills (`node tools/learn.mjs review`, `node tools/learn.mjs new <class>`).

## Hard rules

- Never copy the user's personal files into this repository or any other project repository.
- Never write API keys, tokens, passwords or private keys into the brain. Reference paths only.
- Never delete an existing `PROFILE.md`, `CHANNELS.md`, `SYSTEM.md`, `PROJECTS.md`, `SKILLS.md` or journal entry. Merge and append.
- Do not claim success before Step 6 returns the expected answer.
