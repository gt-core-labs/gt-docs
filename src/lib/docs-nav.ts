import { getCollection, type CollectionEntry } from 'astro:content';
import { type Category, type Locale, DEFAULT_LOCALE } from './i18n';

export type DocEntry = CollectionEntry<'docs'>;

/** Locale of a collection entry from its id (`en/platform/overview` → `en`). */
export function entryLocale(entry: DocEntry): Locale {
  return entry.id.split('/')[0] as Locale;
}

/** Slug (locale-stripped) of an entry: `en/platform/overview` → `platform/overview`. */
export function entrySlug(entry: DocEntry): string {
  return entry.id.split('/').slice(1).join('/');
}

export interface NavSection {
  category: Category;
  items: { slug: string; title: string; summary?: string; order: number }[];
}

const SECTION_ORDER: Category[] = ['platform', 'infrastructure'];

/** All docs for a locale, grouped by category and ordered — drives the sidebar. */
export async function navFor(locale: Locale): Promise<NavSection[]> {
  const entries = await getCollection('docs', (e) => entryLocale(e) === locale);
  const byCat = new Map<Category, NavSection['items']>();
  for (const e of entries) {
    const cat = e.data.category;
    if (!byCat.has(cat)) byCat.set(cat, []);
    byCat.get(cat)!.push({
      slug: entrySlug(e),
      title: e.data.title,
      summary: e.data.summary,
      order: e.data.order,
    });
  }
  for (const items of byCat.values()) {
    items.sort((a, b) => a.order - b.order || a.title.localeCompare(b.title));
  }
  return SECTION_ORDER.filter((c) => byCat.has(c)).map((category) => ({
    category,
    items: byCat.get(category)!,
  }));
}

/** Resolve a single doc entry by locale + slug (e.g. `platform/overview`). */
export async function findDoc(locale: Locale, slug: string): Promise<DocEntry | undefined> {
  const id = `${locale}/${slug}`;
  const entries = await getCollection('docs', (e) => e.id === id);
  return entries[0];
}

export { DEFAULT_LOCALE };
