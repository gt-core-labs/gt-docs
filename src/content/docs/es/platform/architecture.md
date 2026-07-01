---
title: Arquitectura
category: platform
order: 2
summary: El servidor MCP, orchd, sus superficies y los almacenes de datos detrás.
---

# Arquitectura

El runtime de la plataforma son dos binarios Rust, más dos frontends SSR y un
conjunto de almacenes de datos. Todo es same-origin detrás de un único proxy
inverso.

```mermaid
flowchart TB
  subgraph edge[Traefik / Ingress · mismo origen]
    direction LR
    r1[/ y /es → gt-docs/]
    r2[/app → gt-web/]
    r3[/api /auth /mcp /a2a → mcp-server/]
    r4[/docs /share → gt-docs/]
  end

  mcp[["Servidor MCP (gt-mcp-server)\nMCP · REST · Auth · A2A"]]
  orchd[["orchd (gt-orch-server)\ndispatch · merge · daemons de rol"]]

  edge --> mcp
  mcp <--> orchd

  subgraph data[Almacenes de datos]
    pg[(Postgres\nworkspaces, docs, PATs)]
    dolt[(Dolt\nbeads / tracker)]
    minio[(MinIO\nblobs)]
    log[(Event log\nPVC o PG)]
  end

  mcp --> pg
  mcp --> dolt
  mcp --> minio
  orchd --> log
  mcp --> log
```

## Componentes

- **Servidor MCP** (`gt-mcp-server`) — la puerta de entrada. Sirve la superficie
  de herramientas MCP, la API REST (`/api/v1`), auth (`/auth`) y agent-to-agent
  (`/a2a`). Es dueño de los almacenes de datos.
- **orchd** (`gt-orch-server`) — el orquestador singleton. Corre el loop de
  dispatch, el daemon de merge (refinery) y los daemons de rol. Forkea sesiones de
  agente (`claude` en tmux) dentro del pod.
- **gt-web** — consola SvelteKit SSR, servida bajo `/app`.
- **gt-docs** — docs en Astro SSR, servidas en `/` (este sitio) más el browser de
  `/docs` y el visor público `/share`.

## Almacenes de datos

| Almacén | Guarda |
| ------- | ------ |
| **Postgres** | Workspaces, usuarios, PATs, catálogo de rigs, memorias, documentos, comentarios |
| **Dolt** | Beads / tracker (versionado) |
| **MinIO** | Blobs de documentos |
| **Event log** | Eventos de dominio para replay (PVC file-backed en dev, opción PG) |

Varios dominios son **event-sourced**: el estado es un replay de un log de solo
anexado. Eso hace los reverts sutiles — ver [beads y epics](/es/platform/beads-and-epics)
y la regla de tombstone en [gotchas operativos](/es/infrastructure/operational-gotchas).

> **Áreas de mejora.** El servidor MCP depende del bookkeeping de migraciones para
> crear tablas por-workspace; un `ensure_schema` al boot (CREATE TABLE IF NOT
> EXISTS) permitiría que una tabla dropeada se auto-cure en vez de requerir un
> re-apply manual.
