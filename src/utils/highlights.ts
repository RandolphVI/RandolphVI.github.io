import { getCollection } from 'astro:content';

export interface Highlight {
  bookId: string;
  bookTitle: string;
  author: string;
  cover: string;
  text: string;
  chapter: string;
}

/**
 * Extract every blockquote ("highlight") from every reading note.
 * Returns a flat list usable for random "今日一语" display.
 */
export async function getAllHighlights(): Promise<Highlight[]> {
  const books = await getCollection('reading');
  const result: Highlight[] = [];

  for (const book of books) {
    const body = book.body ?? '';
    const lines = body.split(/\r?\n/);

    let currentChapter = '';
    let buffer: string[] = [];

    const flush = () => {
      if (buffer.length === 0) return;
      // Join consecutive blockquote lines into one paragraph.
      const text = buffer
        .join(' ')
        .replace(/\s+/g, ' ')
        .trim();
      // Filter: skip very short or non-meaningful highlights
      if (text.length >= 10 && text.length <= 600) {
        result.push({
          bookId: book.id,
          bookTitle: book.data.title,
          author: book.data.author,
          cover: book.data.cover || '',
          text,
          chapter: currentChapter,
        });
      }
      buffer = [];
    };

    for (const line of lines) {
      // Track chapter heading (## 第X章 ...)
      const ch = line.match(/^##\s+(.+?)\s*$/);
      if (ch) {
        flush();
        currentChapter = ch[1];
        continue;
      }
      // Blockquote line
      const bq = line.match(/^>\s?(.*)$/);
      if (bq) {
        const txt = bq[1].trim();
        if (txt.length === 0) {
          // blank line in blockquote = paragraph separator → flush this highlight
          flush();
        } else {
          buffer.push(txt);
        }
      } else {
        flush();
      }
    }
    flush();
  }

  return result;
}
