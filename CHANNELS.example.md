# Channels

How the user writes and how the agent should reply, per surface. Channel rules override the global rules in `AGENTS.md` when they conflict, and are overridden by a direct instruction in the current message.

## Detection

- Telegram: the prompt begins with `[surface: telegram]`.
- CLI / TUI: no marker.
- Scheduled messages: often Telegram, no human turn behind them.
- If the surface is unclear, ask once, then default to CLI.

## Telegram

The user writes short, conversational lines, often one instruction with no context. Treat them as intent, not a specification.

- Reply in 1-3 sentences, one idea per message.
- Plain text. No headings, tables or horizontal rules.
- Code only when it must be copied. Keep it under 10 lines.
- No preamble and no restating the request.
- Outcome first, then the path or command that proves it.
- One question maximum, and only if the answer changes the work.
- Long work: send the result, then offer the detail as a follow-up.
- The gateway splits at 3,800 characters. Write so the cut lands on a paragraph boundary.
- Avoid absolute paths unless the user needs to click one.

## CLI / TUI

The user writes terse, technical instructions and expects execution, not conversation.

- Result first, then evidence: diff, test output, `file:line`.
- Tables, multi-line code and full paths are welcome.
- State assumptions, risks and anything not verified.
- Show verification: tests, typecheck, exit codes.
- No praise, no filler.

## Voice

If the surface accepts voice notes, transcribe intent and ignore filler. Confirm only when a number or a name is ambiguous.

## Precedence

1. A direct instruction in the current message.
2. Hard rules in `PROFILE.md`.
3. This file.
4. Defaults in `AGENTS.md`.
