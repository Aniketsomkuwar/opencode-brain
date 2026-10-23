#!/usr/bin/env node
// Skill and memory maintenance for the brain.
//
//   node tools/learn.mjs list
//   node tools/learn.mjs new <class>
//   node tools/learn.mjs review

import { existsSync, mkdirSync, readFileSync, readdirSync, statSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const skillsDir = join(root, 'skills');
const journalDir = join(root, 'journal');

const PROMOTE = {
  preference: 'PROFILE.md or CHANNELS.md',
  correction: 'PROFILE.md, CHANNELS.md or a skill Pitfalls section',
  decision: 'DECISIONS.md',
  project: 'PROJECTS.md',
  skill: 'skills/<class>/SKILL.md',
  bug: 'the skill Pitfalls section, or PROJECTS.md if it is project-specific',
  deploy: 'PROJECTS.md',
};

function readText(path) {
  const raw = readFileSync(path, 'utf8');
  return raw.charCodeAt(0) === 0xfeff ? raw.slice(1) : raw;
}

function frontmatter(text) {
  const match = text.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};
  const out = {};
  for (const line of match[1].split(/\r?\n/)) {
    const kv = line.match(/^([A-Za-z_-]+):\s*(.*)$/);
    if (kv) out[kv[1]] = kv[2].replace(/^["']|["']$/g, '');
  }
  return out;
}

function list() {
  if (!existsSync(skillsDir)) {
    console.log('no skills/ directory');
    return;
  }
  const rows = [];
  for (const entry of readdirSync(skillsDir)) {
    const file = join(skillsDir, entry, 'SKILL.md');
    if (!existsSync(file)) continue;
    const meta = frontmatter(readText(file));
    const refs = join(skillsDir, entry, 'references');
    const refCount = existsSync(refs) ? readdirSync(refs).filter((f) => f.endsWith('.md')).length : 0;
    rows.push({ name: meta.name ?? entry, description: meta.description ?? '(missing description)', refs: refCount });
  }
  if (!rows.length) {
    console.log('no skills yet. Create one: node tools/learn.mjs new <class>');
    return;
  }
  for (const row of rows) {
    console.log(`${row.name}  [${row.refs} ref]`);
    console.log(`  ${row.description}`);
  }
}

function create(name) {
  if (!name) {
    console.error('usage: node tools/learn.mjs new <class>');
    process.exit(1);
  }
  const slug = name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');
  const dir = join(skillsDir, slug);
  if (existsSync(join(dir, 'SKILL.md'))) {
    console.error(`skill already exists: skills/${slug}/SKILL.md`);
    process.exit(1);
  }
  mkdirSync(join(dir, 'references'), { recursive: true });
  const today = new Date().toISOString().slice(0, 10);
  const body = `---
name: ${slug}
description: One line that says when to load this class, written as a trigger.
---

# ${slug}

## When to use

## Procedure

1.

## References

| File | Load when |
|---|---|
| \`references/example.md\` | Replace or delete this row |

## Verify

## Pitfalls

- ${today}: created.
`;
  writeFileSync(join(dir, 'SKILL.md'), body, 'utf8');
  console.log(`created skills/${slug}/SKILL.md`);
  console.log(`created skills/${slug}/references/`);
  console.log(`next: add a row to SKILLS.md, then write the procedure and its references.`);
}

function review() {
  if (!existsSync(journalDir)) {
    console.log('no journal/ directory');
    return;
  }
  const files = readdirSync(journalDir).filter((f) => /^\d{4}-\d{2}\.md$/.test(f)).sort();
  const entries = [];
  for (const file of files) {
    let day = '';
    for (const line of readText(join(journalDir, file)).split(/\r?\n/)) {
      const heading = line.match(/^##\s+(\d{4}-\d{2}-\d{2})/);
      if (heading) day = heading[1];
      const entry = line.match(/^-\s+(\d{2}:\d{2})(?:\s+[A-Z]{2,5})?\s+\[([a-z0-9_-]+)\]\s+(.+)$/);
      if (entry) entries.push({ day, time: entry[1], tag: entry[2], text: entry[3] });
    }
  }

  const counts = {};
  for (const entry of entries) counts[entry.tag] = (counts[entry.tag] ?? 0) + 1;
  console.log(`${entries.length} journal entries across ${files.length} month file(s).`);
  const tagLine = Object.entries(counts).sort((a, b) => b[1] - a[1]).map(([tag, n]) => `${tag}:${n}`).join('  ');
  if (tagLine) console.log(tagLine);
  console.log('');

  const promotable = entries.filter((entry) => PROMOTE[entry.tag]).slice(-20);
  if (!promotable.length) {
    console.log('nothing tagged for promotion. Use --tag preference|correction|decision|project|skill|bug|deploy.');
    return;
  }
  console.log('Recent entries that may belong in a durable file:');
  for (const entry of promotable) {
    console.log(`- ${entry.day} ${entry.time} [${entry.tag}] ${entry.text}`);
    console.log(`  promote to ${PROMOTE[entry.tag]}`);
  }
  console.log('');
  console.log('Promote only what is still true. A single correction stays in the journal until it repeats.');
}

const [command, argument] = process.argv.slice(2);
if (command === 'list' || !command) list();
else if (command === 'new') create(argument);
else if (command === 'review') review();
else {
  console.error('usage: node tools/learn.mjs <list|new <class>|review>');
  process.exit(1);
}
