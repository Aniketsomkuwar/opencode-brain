#!/usr/bin/env node
// Create the personal memory files from the tracked examples.
// Idempotent: existing files are never overwritten.

import { copyFileSync, existsSync, mkdirSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

const pairs = [
  ['PROFILE.example.md', 'PROFILE.md'],
  ['SYSTEM.example.md', 'SYSTEM.md'],
  ['VAULT.example.md', 'VAULT.md'],
  ['PROJECTS.example.md', 'PROJECTS.md'],
  ['DECISIONS.example.md', 'DECISIONS.md'],
];

const files = [
  { path: 'AGENTS.md', role: 'always loaded' },
  { path: 'PROFILE.md', role: 'identity and rules' },
  { path: 'SYSTEM.md', role: 'machine and tooling' },
  { path: 'VAULT.md', role: 'optional external vault map' },
  { path: 'PROJECTS.md', role: 'project registry' },
  { path: 'DECISIONS.md', role: 'durable decisions' },
  { path: 'journal/', role: 'dated history' },
];

let created = 0;

mkdirSync(join(root, 'journal'), { recursive: true });

for (const [example, target] of pairs) {
  const from = join(root, example);
  const to = join(root, target);
  if (!existsSync(from)) {
    console.warn(`missing template: ${example}`);
    continue;
  }
  if (existsSync(to)) {
    console.log(`kept     ${target}`);
    continue;
  }
  copyFileSync(from, to);
  console.log(`created  ${target}`);
  created += 1;
}

const indexPath = join(root, 'index.json');
if (!existsSync(indexPath)) {
  writeFileSync(
    indexPath,
    JSON.stringify({ version: 1, updated: new Date().toISOString(), files }, null, 2) + '\n',
    'utf8',
  );
  console.log('created  index.json');
}

console.log('');
console.log(`Done. ${created} file(s) created in ${root}.`);
console.log('Next:');
console.log('  1. Edit PROFILE.md, SYSTEM.md and PROJECTS.md.');
console.log('  2. Add AGENTS.md to the instructions array in your opencode.json.');
console.log('  3. Start a new session and confirm the brain loaded.');
