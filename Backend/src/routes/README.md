# Backend / src / routes

Express route handlers. Each file covers one feature area and is mounted in `src/index.js`.

## Files
- `auth.js` — Register and login endpoints (`POST /api/auth/register`, `POST /api/auth/login`). Hashes passwords with bcrypt, returns a JWT token on success.

## Planned Route Files (not yet built)
- `dvds.js` — DVD inventory CRUD (search, add, update stock)
- `customers.js` — Register customer, view records, rental eligibility
- `rentals.js` — Rental transactions, return process, enforce 3-DVD max
- `alerts.js` — Due date alerts, overdue reminders, availability notifications
- `timelog.js` — Employee clock in/out, view non-editable logs

---
> **Status: In Progress** — Auth routes done. All other route files pending Sprint 5+.
