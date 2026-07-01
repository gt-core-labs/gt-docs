import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// Atomic documentation, versioned in git under src/content/docs/<locale>/<category>/<slug>.md.
// One concept per file. Built at request time (SSR) and served at `/` (en) and
// `/es/…`. The entry `id` is the path without extension, e.g. `en/platform/overview`.
const docs = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/docs' }),
  schema: z.object({
    title: z.string(),
    summary: z.string().optional(),
    /** Section this page belongs to (drives the sidebar grouping). */
    category: z.enum(['platform', 'infrastructure']),
    /** Sort order within the section. */
    order: z.number().default(100),
  }),
});

export const collections = { docs };
