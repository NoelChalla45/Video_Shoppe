# Video Shoppe - Employee System (DVD Rental & Sales)

## Overview
Video Shoppe is an **employee-only** store management system for a DVD rental/sales shop.
Employees and owners can:
- Login (role-based)
- Search DVDs and view availability
- Rent DVDs to customers (enforce max 3 active rentals per customer)
- Return rentals and handle overdue logic
- Sell DVDs and update inventory
- Manage inventory (Owner/Admin)
- Track employee time logs (clock in/out)
- Simulate credit-card payment authorization (no real payment gateway)

## Tech Stack
- Frontend: React (Vite)
- Backend: Node.js + Express
- Database: PostgreSQL (Docker container)
- ORM: Prisma
- Auth: JWT + bcrypt
- Testing: Jest + Supertest (API)

## Repository Structure
- `/frontend` - Employee UI
- `/backend` - API server + Prisma schema
- `/docs` - SRS/diagrams/design notes

---
