import type { APIRoute } from 'astro';

// Liveness probe (Docker/compose healthcheck). Pure FE health — does not depend
// on the backend being reachable.
export const GET: APIRoute = () =>
  new Response(JSON.stringify({ ok: true, app: 'gt-docs' }), {
    headers: { 'content-type': 'application/json' },
  });
