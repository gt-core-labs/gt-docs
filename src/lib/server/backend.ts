/**
 * Absolute base URL of the Rust backend, for SSR-side calls only.
 *
 * Server-side we MUST NOT use relative `/api` `/share` URLs: in prod the node
 * server sits behind Traefik, so a relative fetch would hit the FE router (or
 * re-enter gt-docs itself), never the backend. SSR therefore talks to the
 * backend directly via this absolute URL with the global `fetch`.
 *
 * The browser keeps using relative paths (Traefik routes them to the backend).
 */
export const BACKEND_URL = (process.env.GT_BACKEND_URL ?? 'http://127.0.0.1:8765').replace(
  /\/$/,
  '',
);

/** SSR fetch against the backend, forwarding the request's cookies verbatim. */
export function backendFetch(
  path: string,
  cookie: string | null | undefined,
  init: RequestInit = {},
): Promise<Response> {
  const headers = new Headers(init.headers);
  if (cookie) headers.set('cookie', cookie);
  return fetch(`${BACKEND_URL}${path}`, { ...init, headers });
}
