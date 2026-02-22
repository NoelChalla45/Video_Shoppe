# Backend / prisma

Prisma ORM configuration and database schema.

## Files
- `schema.prisma` — Defines the database connection (Prisma Postgres) and all data models.

## Current Models
| Model | Description |
|---|---|
| `User` | Employee/owner accounts. Stores email, hashed password, and name. |

## Planned Models (not yet added)
- `DVD` — Title, genre, year, rating, stock count
- `Customer` — Contact info, rental eligibility
- `Rental` — Links a customer to DVDs, tracks due date and return status
- `RentalItem` — Individual DVD line items within a rental
- `Alert` — Due date and availability notifications
- `TimeLog` — Employee clock in/out records (non-editable)

---
> **Status: In Progress** — User model live in database. Remaining models to be added in Sprint 5.
