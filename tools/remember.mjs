#!/usr/bin/env node
// Append one dated line to the current month's journal and refresh index.json.

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');

function help() {
  console.log(`Usage: node tools/remember.mjs "<text>" [--tag <tag>]

Appends a dated line to journal/YYYY-MM.md and updates index.json.

Examples:
  node tools/remember.mjs "User prefers pnpm over npm" --tag preference
  node tools/remember.mjs --tag decision "Chose SQLite over Postgres for the local cache"`);
}

function parse(argv) {
  const out = { text: '', tag: 'note', help: false };
  const rest = [];
  for (let i = 0; i < argv.length; i += 1) {
    const arg = argv[i];
    if (arg === '--help' || arg === '-h') out.help = true;
    else if (arg === '--tag' || arg === '-g') out.tag = argv[(i += 1)] ?? out.tag;
    else if (arg === '--text' || arg === '-t') out.text = argv[(i += 1)] ?? '';
    else rest.push(arg);
  }
  if (!out.text) out.text = rest.join(' ').trim();
  out.tag = out.tag.toLowerCase().replace(/[^a-z0-9_-]+/g, '-').replace(/^-+|-+$/g, '') || 'note';
  return out;
}

function readText(path) {
  const raw = readFileSync(path, 'utf8');
  return raw.charCodeAt(0) === 0xfeff ? raw.slice(1) : raw;
}

const args = parse(process.argv.slice(2));
if (args.help || !args.text) {
  help();
  process.exit(args.help ? 0 : 1);
}

const now = new Date();
const pad = (value) => String(value).padStart(2, '0');
const year = String(now.getFullYear());
const month = pad(now.getMonth() + 1);
const day = pad(now.getDate());
const time = `${pad(now.getHours())}:${pad(now.getMinutes())}`;
const monthName = `${year}-${month}`;
const dayHeading = `## ${monthName}-${day}`;
const entry = `- ${time} [${args.tag}] ${args.text.replace(/\s+/g, ' ').trim()}`;

const journalDir = join(root, 'journal');
const journalPath = join(journalDir, `${monthName}.md`);
mkdirSync(journalDir, { recursive: true });

let body = existsSync(journalPath) ? readText(journalPath) : `# Journal - ${monthName}\n`;
if (!body.endsWith('\n')) body += '\n';
if (!body.includes(dayHeading)) body += `\n${dayHeading}\n\n`;
body += `${entry}\n`;
writeFileSync(journalPath, body, 'utf8');

const indexPath = join(root, 'index.json');
let index = { version: 1, files: [] };
if (existsSync(indexPath)) {
  try {
    index = JSON.parse(readText(indexPath));
  } catch {
    console.warn('index.json was not valid JSON; rewriting it.');
  }
}
index.updated = now.toISOString();
if (!Array.isArray(index.files)) index.files = [];
writeFileSync(indexPath, JSON.stringify(index, null, 2) + '\n', 'utf8');

console.log(`journal/${monthName}.md: ${entry}`);
