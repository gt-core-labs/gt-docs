# gt-docs

The documentation surface of the gt-core platform — an Astro (SSR,
adapter-node) app, same-origin behind the gt-app-proxy Traefik. It owns the
site root `/` (the atomic **system documentation** site), plus the legacy
`/docs` workspace-document browser and the public `/share/:hash` viewer.

## Routes

| Path                    | Auth     | Purpose                                             |
| ----------------------- | -------- | --------------------------------------------------- |
| `/`                     | none     | Documentation landing (English)                     |
| `/es`                   | none     | Documentation landing (Spanish)                     |
| `/<category>/<slug>`    | none     | An atomic doc page (English), e.g. `/platform/dispatch` |
| `/es/<category>/<slug>` | none     | The same page in Spanish                            |
| `/docs`                 | optional | Workspace document browse + `?query=` search        |
| `/docs/:id`             | scoped   | A single workspace document                         |
| `/share/:hash`          | public   | Unauthenticated viewer for a shared document        |
| `/healthz`              | public   | Liveness probe                                      |

The gt-web console lives at `/app`; the login button links to `/app/login`.
Session cookies (`gt_web_token`) are same-origin, so a signed-in session works
across `/`, `/app`, and the backend.

## Documentation content

Atomic docs are versioned in git under
`src/content/docs/<locale>/<category>/<slug>.md` — one concept per file, in two
locales (`en` default, `es`). Frontmatter: `title`, `summary`, `category`
(`platform` | `infrastructure`), `order`.

### i18n

Astro's built-in i18n (`defaultLocale: en`, `prefixDefaultLocale: false`):
English at `/…`, Spanish at `/es/…`. Keep both trees in structural parity (same
slugs) so the header language switcher can map a page to its counterpart.

### Mermaid diagrams

Fenced ` ```mermaid ` code blocks are left unhighlighted (`syntaxHighlight`
`excludeLangs`) and turned into `<pre class="mermaid">` by a small rehype plugin
in `astro.config.mjs`; a client script in `Base.astro` renders them with the
`mermaid` runtime.

## Architecture

SSR calls the backend at an ABSOLUTE internal URL
(`GT_BACKEND_URL=http://gt-mcp-server:8765`) with the global `fetch`, forwarding
the request's `gt_web_token` cookie — never a relative `/api` path (the proxy
would mis-route or re-enter). The public `/share` viewer forwards no cookie.

## Environment

| Var              | Default                   | Purpose                          |
| ---------------- | ------------------------- | -------------------------------- |
| `GT_BACKEND_URL` | `http://127.0.0.1:8765`   | Absolute backend base for SSR    |
| `PORT`           | `3000`                    | adapter-node listen port         |
| `HOST`           | `0.0.0.0` (in image)      | adapter-node bind host           |

## Develop

```sh
npm install
GT_BACKEND_URL=http://127.0.0.1:8765 npm run dev
```

## Build / run

```sh
npm run build
node dist/server/entry.mjs
```
