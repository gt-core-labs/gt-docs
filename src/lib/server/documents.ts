import { backendFetch } from './backend';

/** A document row as returned by the backend (subset the UI renders). */
export interface DocumentRow {
  id: string;
  owner_type: string;
  owner_id: string;
  kind: string;
  filename: string;
  content_type: string | null;
  size: number | null;
  body_md: string | null;
  extracted_text: string | null;
  version: number;
  uploaded_by: string | null;
  uploaded_at: string;
}

export interface DocumentPage {
  documents: DocumentRow[];
  offset: number;
  limit: number;
  has_more: boolean;
  next_offset: number | null;
}

export interface ShareRead {
  share: {
    hash: string;
    document_id: string;
    url: string;
    state: string;
    created_by?: string | null;
    expires_at?: string | null;
  };
  document: DocumentRow;
}

/** GET /api/v1/documents — flat paged workspace browse (auth + scope guarded). */
export async function listDocuments(
  cookie: string | null | undefined,
  params: { offset?: number; limit?: number; content_type?: string } = {},
): Promise<DocumentPage | null> {
  const qs = new URLSearchParams();
  qs.set('offset', String(params.offset ?? 0));
  qs.set('limit', String(params.limit ?? 50));
  if (params.content_type) qs.set('content_type', params.content_type);
  const res = await backendFetch(`/api/v1/documents?${qs}`, cookie);
  return res.ok ? ((await res.json()) as DocumentPage) : null;
}

/** GET /api/v1/documents/search?query= — full-text over body_md/extracted_text. */
export async function searchDocuments(
  cookie: string | null | undefined,
  query: string,
): Promise<DocumentRow[] | null> {
  const qs = new URLSearchParams({ query });
  const res = await backendFetch(`/api/v1/documents/search?${qs}`, cookie);
  if (!res.ok) return null;
  const body = (await res.json()) as { documents: DocumentRow[] };
  return body.documents ?? [];
}

/** GET /api/v1/documents/{id} — a single document (auth + scope guarded). */
export async function getDocument(
  cookie: string | null | undefined,
  id: string,
): Promise<DocumentRow | null> {
  const res = await backendFetch(`/api/v1/documents/${encodeURIComponent(id)}`, cookie);
  return res.ok ? ((await res.json()) as DocumentRow) : null;
}

export type ShareResult =
  | { kind: 'ok'; data: ShareRead }
  | { kind: 'expired' }
  | { kind: 'not-found' };

/**
 * GET /share/{hash} — PUBLIC, unauthenticated read of the live doc behind an
 * active share. 200 ⇒ ok; 410 ⇒ expired; 404/anything-else ⇒ not-found.
 * Never forwards a cookie (the public viewer must not leak session data).
 */
export async function readShare(hash: string): Promise<ShareResult> {
  let res: Response;
  try {
    res = await backendFetch(`/share/${encodeURIComponent(hash)}`, null);
  } catch {
    return { kind: 'not-found' };
  }
  if (res.ok) return { kind: 'ok', data: (await res.json()) as ShareRead };
  if (res.status === 410) return { kind: 'expired' };
  return { kind: 'not-found' };
}
