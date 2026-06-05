---
title: Public Sharing
order: 2
summary: How share links work and what the public viewer shows.
---

# Public Sharing

Any workspace document can be minted into a **public, unauthenticated share
link**. The link is a capability URL of the form `/share/<hash>`, where `<hash>`
is a 128-bit url-safe token.

## Lifecycle

A share has a state, computed lazily at read time:

- **active** — the viewer renders the live document.
- **expired** — the capability window closed. The viewer shows a friendly
  "link expired" page (HTTP 410 from the backend).
- **revoked / unknown** — indistinguishable to the public (no oracle). The
  viewer shows a "not available" page (HTTP 404).

The public viewer never exposes session data or owner metadata beyond what the
document itself carries.
