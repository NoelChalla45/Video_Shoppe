# Backend

Node.js + Express REST API for Video Shoppe.

## Files
- `package.json` — project dependencies and scripts (`npm run dev` to start)
- `src/` — all server source code
- `prisma/` — database schema and Prisma config

## Scripts
| Command | What it does |
|---|---|
| `npm run dev` | Starts the server with auto-reload (port 5000) |
| `npx prisma studio` | Opens a browser UI to view/edit the database |
| `npx prisma db push` | Syncs schema changes to the live database |

---
> **Status: In Progress** — Auth routes complete. Inventory, Rental, Customer, Alert, and TimeLog routes still to be built.
