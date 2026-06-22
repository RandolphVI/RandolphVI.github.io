#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const VAULT = process.env.OBSIDIAN_VAULT;
if (!VAULT) {
  console.error('请先设置环境变量 OBSIDIAN_VAULT 指向 Obsidian vault 的 02-Areas 目录后再运行，例如 OBSIDIAN_VAULT=/path/to/02-Areas');
  process.exit(1);
}

// (sourceDir, destDir, category, extraTags, dateFallback)
const JOBS = [
  {
    src: path.join(VAULT, '论文阅读'),
    dst: 'src/content/tech',
    category: 'AI',
    extraTags: ['论文阅读'],
    files: null, // all files
  },
  {
    src: path.join(VAULT, '评价'),
    dst: 'src/content/tech',
    category: '评价',
    extraTags: [],
    files: ['初谈量表.md', '什么是效度？.md'],
  },
];

function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { fm: {}, body: raw };
  const fm = {};
  let currentList = null;
  for (const line of match[1].split(/\r?\n/)) {
    if (currentList && /^\s+-\s+/.test(line)) {
      fm[currentList].push(line.replace(/^\s+-\s+/, '').trim());
      continue;
    }
    currentList = null;
    const listStart = line.match(/^([A-Za-z_][A-Za-z0-9_]*):\s*$/);
    if (listStart) {
      currentList = listStart[1];
      fm[currentList] = [];
      continue;
    }
    const m = line.match(/^([A-Za-z_][A-Za-z0-9_]*):\s*(.*)$/);
    if (m) {
      let v = m[2].trim();
      if (v.startsWith('"') && v.endsWith('"')) v = v.slice(1, -1);
      fm[m[1]] = v;
    }
  }
  return { fm, body: match[2] };
}

function escapeYaml(s) {
  if (s == null) return '""';
  const str = String(s);
  if (/[:#&*!|>'"%@`\[\]{},?]/.test(str) || /^\s|\s$/.test(str)) {
    return `"${str.replace(/"/g, '\\"')}"`;
  }
  return str;
}

function deriveDescription(body) {
  // Find first non-empty, non-heading paragraph
  const lines = body.split(/\r?\n/);
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;
    if (trimmed.startsWith('#')) continue;
    if (trimmed.startsWith('---')) continue;
    if (trimmed.startsWith('>')) continue;
    // Strip markdown formatting
    const clean = trimmed
      .replace(/\*\*?(.+?)\*\*?/g, '$1')
      .replace(/​/g, '')
      .replace(/[​-‏]/g, '')
      .replace(/\[(.+?)\]\(.+?\)/g, '$1')
      .replace(/`(.+?)`/g, '$1')
      .replace(/^[*\-]\s+/, '')
      .trim();
    if (clean.length < 8) continue;
    return clean.length > 100 ? clean.slice(0, 100) + '…' : clean;
  }
  return '';
}

function transformBody(body) {
  return body
    .replace(/​/g, '') // strip zero-width spaces
    .replace(/‎|‏/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim() + '\n';
}

function migrateOne(srcPath, dstDir, category, extraTags) {
  const filename = path.basename(srcPath);
  const raw = fs.readFileSync(srcPath, 'utf8');
  const { fm, body } = parseFrontmatter(raw);

  const title = path.basename(filename, '.md');
  // Date: prefer createTime, else file mtime
  let date;
  if (fm.createTime) {
    date = fm.createTime.slice(0, 10);
  } else {
    date = fs.statSync(srcPath).mtime.toISOString().slice(0, 10);
  }

  const tagsSrc = Array.isArray(fm.tags) ? fm.tags : [];
  const tags = [...new Set([...extraTags, ...tagsSrc])];

  const description = deriveDescription(body);

  const fmLines = [
    '---',
    `title: ${escapeYaml(title)}`,
    `date: ${date}`,
    `category: ${escapeYaml(category)}`,
    `tags: [${tags.map((t) => escapeYaml(t)).join(', ')}]`,
    `description: ${escapeYaml(description || title)}`,
    'draft: false',
    '---',
    '',
  ];

  const dst = path.join(dstDir, filename);
  fs.writeFileSync(dst, fmLines.join('\n') + transformBody(body), 'utf8');
}

let total = 0;
for (const job of JOBS) {
  if (!fs.existsSync(job.dst)) fs.mkdirSync(job.dst, { recursive: true });
  const files = job.files ?? fs.readdirSync(job.src).filter((f) => f.endsWith('.md'));
  for (const f of files) {
    migrateOne(path.join(job.src, f), job.dst, job.category, job.extraTags);
    total++;
  }
}
console.log(`Migrated: ${total} notes`);
