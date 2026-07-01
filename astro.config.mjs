// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

// gt-docs — Astro SSR (adapter-node standalone) behind the gt-app-proxy Traefik.
// Owns `/` (the atomic documentation site, EN default + `/es`), plus the legacy
// `/docs` workspace-document browser and the public `/share/:hash` viewer.
// Same-origin with the gt-web console (now under `/app`) and the Rust backend
// (`/auth /api /mcp`). Standalone server listens on PORT 3000.

/**
 * Minimal rehype plugin: turn ```mermaid fenced code blocks into
 * `<pre class="mermaid">…</pre>` so the client-side mermaid runtime (loaded in
 * Base.astro) can render them. Written without extra deps — a manual hast walk.
 */
function rehypeMermaid() {
  /** @param {any} node */
  const visit = (node) => {
    if (!node || !Array.isArray(node.children)) return;
    for (let i = 0; i < node.children.length; i++) {
      const el = node.children[i];
      if (
        el?.type === 'element' &&
        el.tagName === 'pre' &&
        el.children?.length === 1 &&
        el.children[0]?.type === 'element' &&
        el.children[0]?.tagName === 'code'
      ) {
        const code = el.children[0];
        const classes = code.properties?.className ?? [];
        if (Array.isArray(classes) && classes.includes('language-mermaid')) {
          const text = (code.children ?? [])
            .filter((/** @type {any} */ c) => c.type === 'text')
            .map((/** @type {any} */ c) => c.value)
            .join('');
          node.children[i] = {
            type: 'element',
            tagName: 'pre',
            properties: { className: ['mermaid'] },
            children: [{ type: 'text', value: text }],
          };
          continue;
        }
      }
      visit(el);
    }
  };
  return (/** @type {any} */ tree) => visit(tree);
}

export default defineConfig({
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  server: { port: Number(process.env.PORT ?? 3000), host: true },
  i18n: {
    defaultLocale: 'en',
    locales: ['en', 'es'],
    routing: { prefixDefaultLocale: false },
  },
  markdown: {
    // Leave ```mermaid fences unhighlighted so rehypeMermaid can turn them into
    // <pre class="mermaid"> for the client runtime (Shiki would otherwise wrap
    // them in highlighted spans and break the transform).
    syntaxHighlight: { type: 'shiki', excludeLangs: ['mermaid'] },
    rehypePlugins: [rehypeMermaid],
  },
});
