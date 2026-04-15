import { getCollection } from 'astro:content';

export type BacklinkEntry = {
  id: string;
  title: string;
  collection: 'posts' | 'tech' | 'reading';
  href: string;
};

export async function getBacklinks(
  currentCollection: 'posts' | 'tech' | 'reading',
  currentId: string
): Promise<BacklinkEntry[]> {
  const [posts, tech, reading] = await Promise.all([
    getCollection('posts'),
    getCollection('tech'),
    getCollection('reading'),
  ]);

  const all = [
    ...posts.map((e) => ({ entry: e, collection: 'posts' as const })),
    ...tech.map((e) => ({ entry: e, collection: 'tech' as const })),
    ...reading.map((e) => ({ entry: e, collection: 'reading' as const })),
  ];

  const currentPath = `/${currentCollection}/${currentId}/`;
  const currentPathNoTrailing = `/${currentCollection}/${currentId}`;

  const results: BacklinkEntry[] = [];

  for (const { entry, collection } of all) {
    // Skip self
    if (collection === currentCollection && entry.id === currentId) continue;

    const body = entry.body ?? '';
    if (body.includes(currentPath) || body.includes(currentPathNoTrailing + ')') || body.includes(currentPathNoTrailing + '"')) {
      results.push({
        id: entry.id,
        title: entry.data.title,
        collection,
        href: `/${collection}/${entry.id}/`,
      });
    }
  }

  return results;
}
