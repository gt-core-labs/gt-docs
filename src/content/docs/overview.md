---
title: Platform Overview
order: 1
summary: What gt-docs is and how documentation flows through the platform.
---

# Platform Overview

**gt-docs** is the documentation surface of the gt-core platform. It is a
same-origin Astro (SSR) app that lives behind the same Traefik reverse proxy as
the `gt-web` console and the Rust MCP backend.

It renders two kinds of content:

- **Static specs** — versioned in git as markdown under `src/content/docs/`.
  These ship with the image and need no backend. This page is one of them.
- **Workspace documents** — fetched live from the backend
  (`GET /api/v1/documents`), scoped to your session. Browse, search, and read
  them under `/docs`.

## Paths it owns

| Path            | Auth      | Purpose                                  |
| --------------- | --------- | ---------------------------------------- |
| `/docs`         | optional  | Specs + workspace document browse/search |
| `/docs/:id`     | scoped    | A single workspace document              |
| `/share/:hash`  | public    | Unauthenticated viewer for shared docs   |

## Architecture note

SSR talks to the backend over an absolute internal URL
(`GT_BACKEND_URL=http://gt-mcp-server:8765`), forwarding your `gt_web_token`
cookie. The browser uses relative paths, which Traefik routes to the backend.
