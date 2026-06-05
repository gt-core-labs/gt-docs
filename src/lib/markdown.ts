import { marked } from 'marked';

marked.setOptions({ gfm: true, breaks: false });

/**
 * Render markdown (body_md) to an HTML string for SSR injection.
 *
 * Note: gt-docs renders documents authored within the platform (workspace docs
 * and shared specs). marked does not sanitize HTML embedded in the source. If
 * untrusted authorship becomes a concern, add a sanitizer (e.g. sanitize-html)
 * here — kept lean for now to match the source-of-truth being first-party.
 */
export function renderMarkdown(md: string | null | undefined): string {
  if (!md) return '';
  return marked.parse(md, { async: false }) as string;
}
