import { backendFetch } from './backend';

/** The minimal session shape gt-docs needs (optional auth on /docs). */
export interface SessionUser {
  id?: string;
  email?: string;
  workspace?: string;
  role?: string;
  scopes?: string[];
  [k: string]: unknown;
}

/**
 * Resolve the current session from the request cookies, SSR against the backend.
 *
 * /docs is OPTIONALLY authenticated: the backend's /api/v1/documents surface is
 * scope-guarded, so we forward the gt_web_token cookie and let the backend
 * decide. If there is no session (or the token is stale), this returns null and
 * the caller renders the static specs + a sign-in hint. The public /share viewer
 * never calls this.
 */
export async function resolveUser(cookie: string | null | undefined): Promise<SessionUser | null> {
  if (!cookie || !/(?:^|;\s*)gt_web_token=/.test(cookie)) return null;
  try {
    const res = await backendFetch('/auth/me', cookie);
    return res.ok ? ((await res.json()) as SessionUser) : null;
  } catch {
    return null;
  }
}
