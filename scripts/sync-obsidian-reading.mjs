#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const VAULT_BASE = process.env.OBSIDIAN_VAULT;
if (!VAULT_BASE) {
  console.error('请先设置环境变量 OBSIDIAN_VAULT 指向 Obsidian vault 的 02-Areas 目录。');
  process.exit(1);
}
const VAULT_READING = path.join(VAULT_BASE, '阅读');
const DEST = 'src/content/reading';

function parseFrontmatter(raw) {
  const match = raw.match(/^---\r?\n([\s\S]*?)\r?\n---\r?\n([\s\S]*)$/);
  if (!match) return { fm: {}, body: raw };
  const fm = {};
  for (const line of match[1].split(/\r?\n/)) {
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
  if (s == null) return '';
  const str = String(s);
  if (/[:#&*!|>'"%@`\[\]{},?\-\n]/.test(str) || /^\s|\s$/.test(str)) {
    return `"${str.replace(/"/g, '\\"')}"`;
  }
  return str;
}

function extractFromAbstractCallout(body) {
  // Parse `> [!abstract] Title` block until first non-`>` line
  const lines = body.split(/\r?\n/);
  const start = lines.findIndex((l) => /^>\s*\[!abstract\]/i.test(l));
  if (start === -1) return {};
  let end = start + 1;
  while (end < lines.length && lines[end].startsWith('>')) end++;
  const blockText = lines
    .slice(start, end)
    .map((l) => l.replace(/^>\s?/, ''))
    .join('\n');

  const out = {};
  const grab = (re) => {
    const m = blockText.match(re);
    return m ? m[1].trim() : undefined;
  };
  // [ \t]* not \s* — the latter eats newlines and slurps the next line
  out.summary = grab(/简介[：:][ \t]*(\S.*)/);
  out.publisher = grab(/出版社[：:][ \t]*(\S.*)/);
  out.pubDate = grab(/出版时间[：:][ \t]*([0-9-]+)/);
  out.bookCategory = grab(/分类[：:][ \t]*(\S.*)/);
  return out;
}

function transformBody(body) {
  const lines = body.split(/\r?\n/);

  // 1. Drop the `# 元数据` callout block (we hoist its info into frontmatter)
  let i = lines.findIndex((l) => /^#\s*元数据/.test(l));
  if (i !== -1) {
    let j = i + 1;
    while (j < lines.length && !/^#\s/.test(lines[j])) j++;
    lines.splice(i, j - i);
  }

  let out = lines
    .join('\n')
    // 2. Convert weread highlight markers
    .replace(/>\s*📌\s*/g, '> ')
    .replace(/^>\s*⏱[^\n]*$/gm, '')
    .replace(/\s*\^[0-9A-Za-z-]+\s*$/gm, '')
    // 3. Strip wrapper H1 headings (高亮划线 / 读书笔记 / 本书评论)
    //    Also collapse "本书评论 → 书评 No.X" into clean paragraph
    .replace(/^#\s*高亮划线\s*$/gm, '')
    .replace(/^#\s*读书笔记\s*$/gm, '')
    .replace(/^#\s*本书评论\s*$/gm, '')
    .replace(/^##\s*书评\s*No\.\s*\d+\s*$/gm, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();

  // 4. Line-by-line: lift chapter title out of highlights
  const lines2 = out.split('\n');
  const result = [];
  const chapterRe = /^>\s*(第[一二三四五六七八九十百千零〇0-9]+章)\s*$/;
  const subRe = /^[ \t]+《([^》]+)》[：:]/;
  for (let li = 0; li < lines2.length; li++) {
    const line = lines2[li];
    const m = line.match(chapterRe);
    if (m && li + 1 < lines2.length) {
      const sm = lines2[li + 1].match(subRe);
      if (sm) {
        // Found chapter pattern. Emit heading.
        result.push(`## ${m[1]} 《${sm[1]}》`);
        result.push('');
        // Skip the subtitle line (li+1). Then collect body lines until blank-then-non-continuation.
        li += 1;
        // Now collect body: lazy-continuation lines (start with whitespace) and skip pure-blank/whitespace lines
        const body = [];
        while (li + 1 < lines2.length) {
          const next = lines2[li + 1];
          if (/^[ \t]*$/.test(next)) {
            // blank-ish line, skip but continue
            li += 1;
            continue;
          }
          if (/^[ \t]/.test(next)) {
            // lazy continuation
            const stripped = next.replace(/^[ \t　　]+/, '');
            if (stripped.length > 0) {
              if (body.length > 0) body.push('>'); // blank line within blockquote = paragraph break
              body.push('> ' + stripped);
            }
            li += 1;
            continue;
          }
          // Anything else (next blockquote starting with `>`, next heading, etc.) — stop.
          break;
        }
        if (body.length > 0) {
          result.push(...body);
          result.push('');
        }
        continue;
      }
    }
    result.push(line);
  }

  return result.join('\n').replace(/\n{3,}/g, '\n\n').trim() + '\n';
}

function buildFrontmatter(fm, extracted, filename) {
  const titleFromFile = path.basename(filename, '.md');
  const lines = ['---'];
  lines.push(`title: ${escapeYaml(titleFromFile)}`);
  lines.push(`author: ${escapeYaml(fm.author || '未知')}`);

  // date: prefer finishedDate, fall back to readingDate, fall back to today
  const date = fm.finishedDate || fm.lastReadDate || fm.readingDate || new Date().toISOString().slice(0, 10);
  lines.push(`date: ${date}`);

  if (fm.cover) lines.push(`cover: ${escapeYaml(fm.cover)}`);
  if (fm.isbn) lines.push(`isbn: "${fm.isbn}"`);
  if (fm.progress) lines.push(`progress: ${escapeYaml(fm.progress)}`);
  if (fm.readingTime) lines.push(`readingTime: ${escapeYaml(fm.readingTime)}`);
  // Skip Unix-epoch placeholder dates (used by WeChat Reading when unknown)
  if (fm.readingDate && fm.readingDate !== '1970-01-01') lines.push(`startDate: ${fm.readingDate}`);
  if (fm.finishedDate && fm.finishedDate !== '1970-01-01') lines.push(`finishedDate: ${fm.finishedDate}`);
  if (extracted.publisher) lines.push(`publisher: ${escapeYaml(extracted.publisher)}`);
  if (extracted.pubDate) lines.push(`pubDate: ${escapeYaml(extracted.pubDate)}`);
  if (extracted.bookCategory) lines.push(`bookCategory: ${escapeYaml(extracted.bookCategory)}`);
  if (extracted.summary) lines.push(`summary: ${escapeYaml(extracted.summary)}`);

  lines.push('---', '');
  return lines.join('\n');
}

function migrate() {
  if (!fs.existsSync(DEST)) fs.mkdirSync(DEST, { recursive: true });
  const files = fs.readdirSync(VAULT_READING).filter((f) => f.endsWith('.md'));

  let migrated = 0;
  let skipped = 0;
  for (const file of files) {
    const src = path.join(VAULT_READING, file);
    const raw = fs.readFileSync(src, 'utf8');
    const { fm, body } = parseFrontmatter(raw);

    // Only migrate weread-highlights-reviews docs (the rich notes)
    if (fm.doc_type && fm.doc_type !== 'weread-highlights-reviews') {
      skipped++;
      continue;
    }

    const extracted = extractFromAbstractCallout(body);
    const newFm = buildFrontmatter(fm, extracted, file);
    const newBody = transformBody(body);

    const dest = path.join(DEST, file);
    fs.writeFileSync(dest, newFm + newBody, 'utf8');
    migrated++;
  }
  console.log(`Migrated: ${migrated}, Skipped: ${skipped}`);
}

migrate();
