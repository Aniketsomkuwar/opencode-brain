# Skills

One directory per class of work: `skills/<class>/SKILL.md`, with `references/` for detail that is loaded only when a step needs it.

The body is read only when `SKILLS.md` routes a task here. Keep `SKILLS.md` to one line per class; put the detail in the skill and its references.

## Format

```markdown
---
name: publishing
description: One line that says when to load this class, written as a trigger.
---

# Publishing

## When to use
## Procedure
## References
## Verify
## Pitfalls
```

`name` must match the directory. `description` is the routing signal, so write it as a trigger, not a summary.

## Class-level, not command-level

A class covers a family of tasks, not one command. `publishing` covers sanitizing, git, metadata, hero images and cross-linking; each of those is a reference file, not a separate skill. This keeps the index short and the depth available on demand.

## Rules

- A procedure repeated three times becomes a skill. One correction goes to the journal.
- Every skill ends with a verification step that can fail.
- Record what broke under Pitfalls, with the fix.
- References are loaded per step, never all at once.
- No secrets, no client data, no machine-specific absolute paths unless the skill is machine-specific.
- Retire a skill when its tool or target disappears.

`tools/learn.mjs new <class>` scaffolds the directory and the index row is added by hand.
