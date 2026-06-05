import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Static documentation specs versioned in git. Markdown files under
// src/content/docs/ are picked up at build time and rendered at /docs/spec/<slug>.
const docs = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/docs' }),
  schema: z.object({
    title: z.string(),
    order: z.number().default(100),
    summary: z.string().optional(),
  }),
});

export const collections = { docs };
