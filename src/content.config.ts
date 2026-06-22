import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const posts = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/posts' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    category: z.string(),
    tags: z.array(z.string()).default([]),
    description: z.string(),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

const tech = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/tech' }),
  schema: z.object({
    title: z.string(),
    date: z.coerce.date(),
    category: z.string(),
    tags: z.array(z.string()).default([]),
    description: z.string(),
    draft: z.boolean().default(false),
  }),
});

const reading = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/reading' }),
  schema: z.object({
    title: z.string(),
    author: z.string(),
    date: z.coerce.date(),
    rating: z.number().min(0).max(5).optional(),
    cover: z.string().optional(),
    isbn: z.string().optional(),
    publisher: z.string().optional(),
    pubDate: z.string().optional(),
    bookCategory: z.string().optional(),
    progress: z.string().optional(),
    readingTime: z.string().optional(),
    startDate: z.coerce.date().optional(),
    finishedDate: z.coerce.date().optional(),
    summary: z.string().optional(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

const booklists = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/booklists' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    books: z.array(z.string()).default([]), // book ids in reading collection
    coverBook: z.string().optional(), // book id whose cover is the list cover
    draft: z.boolean().default(false),
  }),
});

const papers = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/papers' }),
  schema: z.object({
    title: z.string(),
    authors: z.array(z.string()).default([]),
    venue: z.string(),
    venueFull: z.string().optional(),
    year: z.number(),
    date: z.coerce.date(),
    type: z.enum(['conference', 'journal', 'preprint', 'workshop', 'thesis']).default('conference'),
    tags: z.array(z.string()).default([]),
    doi: z.string().optional(),
    arxiv: z.string().optional(),
    code: z.string().optional(),
    pdf: z.string().optional(),
    project: z.string().optional(),
    abstract: z.string().optional(),
    featured: z.boolean().default(false),
    correspondingAuthor: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

const projects = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/projects' }),
  schema: z.object({
    name: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    category: z.enum(['research', 'localization', 'tool', 'blog', 'misc']).default('research'),
    language: z.string().optional(),
    stars: z.number().optional(),
    repo: z.string().optional(),
    demo: z.string().optional(),
    paper: z.string().optional(),
    tags: z.array(z.string()).default([]),
    featured: z.boolean().default(false),
    draft: z.boolean().default(false),
  }),
});

const games = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/games' }),
  schema: z.object({
    title: z.string(),
    platform: z.string().default('Steam'),
    status: z.enum(['playing', 'finished', 'abandoned', 'wishlist']).default('finished'),
    date: z.coerce.date(),
    cover: z.string().optional(),
    hours: z.string().optional(),
    startDate: z.coerce.date().optional(),
    finishedDate: z.coerce.date().optional(),
    genre: z.string().optional(),
    summary: z.string().optional(),
    rating: z.number().min(0).max(5).optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { posts, tech, reading, booklists, papers, projects, games };
