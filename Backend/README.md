# Backend

Node.js + Express API for Video Shoppe.

## Main Capabilities
- Authentication and role-aware login/register
- Inventory read endpoints for storefront and staff views
- Owner-protected inventory write endpoints
- Checkout and order persistence
- Owner-protected employee account lookup endpoints

## Scripts
| Command | Description |
|---|---|
| `npm run dev` | Start backend with watch mode |
| `npm run start` | Start backend once |
| `npm run db:generate` | Generate Prisma client |
| `npm run db:push` | Push Prisma schema to database |
| `npm run seed` | Seed inventory data |
| `npm run db:studio` | Open Prisma Studio |

## Route Modules
- `src/routes/auth.js`
- `src/routes/inventory.js`
- `src/routes/orders.js`

## Middleware
- `src/middleware/auth.js` for authentication and role checks.
