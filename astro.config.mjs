// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';

// gt-docs — Astro SSR (adapter-node standalone) behind the gt-app-proxy Traefik.
// Owns the /docs and /share/:hash paths, same-origin with gt-web (the `/` app)
// and the Rust backend (/auth /api /mcp). Standalone server listens on PORT 3000.
export default defineConfig({
  output: 'server',
  adapter: node({ mode: 'standalone' }),
  server: { port: Number(process.env.PORT ?? 3000), host: true },
});
