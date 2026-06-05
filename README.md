# gt-docs

The documentation surface of the gt-core platform — an Astro (SSR,
adapter-node) app, same-origin behind the gt-app-proxy Traefik. It owns the
`/docs` and `/share/:hash` paths.

## Routes

| Path             | Auth      | Purpose                                           |
| ---------------- | --------- | ------------------------------------------------- |
| `/docs`          | optional  | Static specs (git) + workspace browse + `?query=` |
| `/docs/spec/:s`  | optional  | A static spec from `src/content/docs/`            |
| `/docs/:id`      | scoped    | A single workspace document                       |
| `/share/:hash`   | public    | Unauthenticated viewer for a shared document      |
| `/healthz`       | public    | Liveness probe                                    |

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
