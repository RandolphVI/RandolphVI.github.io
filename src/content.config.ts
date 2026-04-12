import { defineCollection, z } from 'astro:content';

const posts = defineCollection({
  loader: () => [],
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
  loader: () => [],
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
  loader: () => [],
  schema: z.object({
    title: z.string(),
    author: z.string(),
    date: z.coerce.date(),
    rating: z.number().min(1).max(5),
    cover: z.string().optional(),
  }),
});

export const collections = { posts, tech, reading };
