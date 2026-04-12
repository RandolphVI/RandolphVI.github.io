import { getCollection, type CollectionEntry } from 'astro:content';

export async function getPublishedPosts(): Promise<CollectionEntry<'posts'>[]> {
  const posts = await getCollection('posts', ({ data }) => !data.draft);
  return posts.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export async function getFeaturedPost(): Promise<CollectionEntry<'posts'> | undefined> {
  const posts = await getPublishedPosts();
  return posts.find((p) => p.data.featured) || posts[0];
}

export async function getPublishedTech(): Promise<CollectionEntry<'tech'>[]> {
  const tech = await getCollection('tech', ({ data }) => !data.draft);
  return tech.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export async function getReadingList(): Promise<CollectionEntry<'reading'>[]> {
  const reading = await getCollection('reading');
  return reading.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}

export async function getAllArticles(): Promise<Array<{ id: string; data: { title: string; date: Date; category: string; description: string }; collection: string }>> {
  const [posts, tech] = await Promise.all([getPublishedPosts(), getPublishedTech()]);
  const all = [
    ...posts.map((p) => ({ id: p.id, data: p.data, collection: 'posts' as const })),
    ...tech.map((t) => ({ id: t.id, data: t.data, collection: 'tech' as const })),
  ];
  return all.sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
}
