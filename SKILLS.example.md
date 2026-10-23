# Skills

Index of class-level procedures. The body lives in `skills/<class>/SKILL.md` and is read only when a row matches. References inside a skill are read per step, never all at once.

## How to use

1. Before improvising a multi-step workflow, scan this index.
2. If a row matches, read its `SKILL.md` and follow the procedure.
3. Load a `references/` file only when the step in hand needs it.
4. After use, add what surprised you to the skill's Pitfalls.

## Brain skills

| Class | Use when | Path |
|---|---|---|
| example | Template. Replace with a class of work you repeat | `skills/example/SKILL.md` |

## Harness skills

Skills installed in the agent itself, invoked through its skill tool. List only the ones this user actually uses.

| Skill | Use when |
|---|---|
| <SKILL> | <TRIGGER> |

## Promotion rule

- A procedure repeated three times becomes a skill.
- A single correction goes to the journal first. It does not become a skill until it repeats.
- Class-level, not command-level: one `SKILL.md` per family of work, with `references/` for depth.
- Delete or rewrite a skill when its tool or target disappears. A stale skill is worse than none.

## Bounded

This file is loaded on demand, so it can be longer than `AGENTS.md`. Keep every row to one line.
