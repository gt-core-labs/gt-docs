---
title: Workspaces & security
category: platform
order: 11
summary: Tenancy model and granular, security-governed RBAC.
---

# Workspaces & security

The platform is multi-tenant. A **workspace** is a tenant boundary: its
memories, documents, PATs, and rig catalog are scoped to it. There is a reserved
town-level workspace for platform-wide data; product work happens in named
workspaces.

```mermaid
flowchart TB
  town[[Town / default workspace]]
  subgraph tenants[Named workspaces]
    w1[workspace A]
    w2[workspace B]
  end
  town --- w1
  town --- w2
  w1 --> res1[(memories · docs · PATs · rigs)]
  w2 --> res2[(memories · docs · PATs · rigs)]
  sheriff{{Security layer · sheriff}} -. governs .-> w1
  sheriff -. governs .-> w2
```

## Granular RBAC

Access is enforced by role scopes, and grants are always **enumerated**, never
wildcards:

- Grant `memory.recall`, `memory.save`, `a2a.inbox`, `a2a.delegate` — **not**
  `memory.*` or `a2a.*`.
- Policy is governed centrally in the **security layer** (the sheriff role /
  `role.sheriff` domain), so there is a single point of control and true least
  privilege.

When a feature fails with `unauthorized`, the fix is to identify the exact scopes
it uses and add them enumerated to the role — not to widen to a wildcard.

## Sessions

Auth is cookie-based (`gt_web_token`), same-origin across the console (`/app`),
docs (`/`), and the backend (`/auth`, `/api`). A signed-in session on one surface
is a signed-in session on all of them.

> **Improvement areas.** Because grants are enumerated per scope, adding a new
> capability means updating role policy in lockstep; a scope catalog with
> coverage checks would catch a capability shipped without a matching grant.
