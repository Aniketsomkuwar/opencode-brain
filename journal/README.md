# Journal

One file per month: `YYYY-MM.md`. One line per entry. Append only.

`tools/remember.mjs` writes here:

```bash
node tools/remember.mjs "User prefers pnpm over npm" --tag preference
```

Resulting entry:

```markdown
## 2026-10-23

- 14:05 [preference] User prefers pnpm over npm
```

Rules:

- Append. Never rewrite or delete an entry.
- One line per event. If it needs a paragraph, it belongs in `DECISIONS.md` or `PROJECTS.md`.
- Anything still relevant after 30 days should be promoted into `PROFILE.md`, `PROJECTS.md` or `DECISIONS.md`.
- Journal files are gitignored. They are personal.

An entry written by hand in the same format is fine. The script is a convenience, not a requirement.
