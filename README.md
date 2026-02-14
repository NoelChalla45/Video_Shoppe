# Video Shoppe — Implementation Guide (Employee-Only)

This document describes how to set up, run, and implement the Video Shoppe employee system (DVD rental + return + sales + inventory + time logs) with a simulated credit-card authorization flow.

---

## Table of Contents
1. [System Overview](#system-overview)
2. [Tech Stack](#tech-stack)
3. [Local Setup](#local-setup)
4. [Database](#database)
5. [Backend Implementation](#backend-implementation)
6. [Authentication and Authorization](#authentication-and-authorization)
7. [API Contract](#api-contract)
8. [Frontend Implementation](#frontend-implementation)
9. [Business Rules](#business-rules)
10. [Testing](#testing)
11. [Troubleshooting](#troubleshooting)

---

## System Overview

### Scope
- **Employee-only** system: customers do **not** log in.
- Employees and owners operate the UI to:
  - manage customers
  - search/view DVDs and availability
  - rent DVDs (with due dates)
  - return DVDs (handle overdue)
  - sell DVDs
  - manage inventory (owner)
  - clock in/out and view time logs
  - generate/view receipts
- **Credit-card payments are simulated** (no real payment provider).

### Roles
- **EMPLOYEE**: search DVDs, manage customers, rent/return/sell, clock in/out.
- **OWNER**: all EMPLOYEE actions + inventory management (and optional employee management).

---

## Tech Stack
- **Frontend:** React (Vite)
- **Backend:** Node.js + Express (REST API)
- **Database:** PostgreSQL (Docker)
- **ORM:** Prisma
- **Auth:** JWT + bcrypt
- **Testing:** Jest + Supertest (API tests)

---

## Local Setup

### Prerequisites
Install:
- Node.js (LTS)
- Docker Desktop

### Start the PostgreSQL database
From the repo root:
```bash
docker compose up -d
docker ps
```

### Backend setup (run once per machine)
```bash
cd backend
npm install
cp .env.example .env
npx prisma migrate dev
npm run dev
```

Backend should run on:
- `http://localhost:3001`

### Frontend setup
```bash
cd frontend
npm install
npm run dev
```

Frontend should run on:
- `http://localhost:5173`

---

## Database

### Docker configuration
Your `docker-compose.yml` should create a Postgres database with credentials that match `DATABASE_URL`.

**Recommended DB values (example):**
- user: `dvd_user`
- password: `dvd_password`
- database: `dvd_store`
- port: `5432`

### Environment variables (backend)
Backend `.env` should include:
```env
DATABASE_URL="postgresql://dvd_user:dvd_password@localhost:5432/dvd_store?schema=public"
JWT_SECRET="replace-with-a-long-random-string"
PORT=3001
```

### Core entities (high-level ERD summary)
Minimum tables/entities required to implement all features:

- **employees**: staff/owner accounts + roles
- **customers**: store customers created/selected by employees
- **dvds**: catalog items
- **inventory**: stock tracking per DVD
- **rental_transactions**: rental header (rented_at, due_at, return status)
- **rental_items**: DVDs included in a rental
- **sales_transactions**: sale header
- **sales_items**: DVDs included in a sale
- **time_logs**: employee clock in/out records
- *(optional)* **notifications**: due/overdue/availability messages (or computed dynamically)

### Inventory update rules
- Rent: decrement `available_copies` (cannot go below 0)
- Return: increment `available_copies` (cannot exceed `total_copies`)
- Sale: decrement `available_copies` and `total_copies` (if you treat sale as permanent removal)

### Reset database (fresh start)
⚠️ This deletes all DB data:
```bash
docker compose down -v
docker compose up -d
cd backend
npx prisma migrate dev
```

---

## Backend Implementation

### Backend goals
The backend is a REST API responsible for:
- authentication and role checks
- business rules (rental limits, inventory updates)
- database persistence via Prisma
- returning clean JSON responses for the UI

### Recommended response pattern
Return JSON in a consistent format:
```json
{ "success": true, "data": { } }
```
On error:
```json
{ "success": false, "error": "Message", "details": { } }
```

### Recommended request lifecycle
1. Route receives request
2. Auth middleware verifies JWT (if protected)
3. Role middleware checks EMPLOYEE/OWNER access (if needed)
4. Controller validates input
5. Service applies business rules and writes/reads DB using Prisma
6. Controller returns response

### Suggested modules (implementation units)
- **Auth module**: login/logout/me
- **DVD module**: search/list/detail
- **Customer module**: create/search/list
- **Rental module**: create rental, return rental, active rentals, overdue rentals
- **Sales module**: create sale, list sales
- **Inventory module (OWNER)**: adjust stock, CRUD DVD
- **Time logs module**: clock in/out, list logs
- **Payment simulator**: authorize/decline (mock)

---

## Authentication and Authorization

### Password handling
- Store **hashed passwords** only (bcrypt).
- Never store plaintext passwords.

### JWT handling
- On login, backend returns `{ token, user }`.
- Frontend stores token and includes it in requests:
  - `Authorization: Bearer <token>`

### Authorization rules
- Any endpoint that changes data should require auth.
- OWNER-only endpoints must enforce role checks.

---

## API Contract

> This is the intended API contract for a complete employee-only system. You can adjust endpoint names, but keep the concepts and permissions consistent.

### Health
- `GET /health` → server status (no auth)

### Auth
- `POST /api/auth/login`
  - body: `{ "username": "...", "password": "..." }`
  - returns: `{ token, user }`
- `POST /api/auth/logout` *(optional if using stateless JWT)*
- `GET /api/auth/me` (auth required)

### DVDs / Catalog
- `GET /api/dvds`
  - query: `search`, `genre`, `year`, `sort`
- `GET /api/dvds/:id`

### Customers
- `GET /api/customers`
  - query: `search` (name/phone/email)
- `POST /api/customers`
  - body: `{ name, phone?, email?, address? }`

### Rentals
- `POST /api/rentals` (auth required)
  - body example:
    ```json
    {
      "customerId": 1,
      "items": [{ "dvdId": 10, "qty": 1 }],
      "dueAt": "2026-03-01T00:00:00.000Z",
      "payment": { "method": "CARD", "amount": 9.99, "mockApprove": true }
    }
    ```
- `POST /api/rentals/:id/return` (auth required)
  - body: `{ "returnedAt": "..." }` (optional)
- `GET /api/rentals/active` (auth required)
- `GET /api/rentals/overdue` (auth required)

### Sales
- `POST /api/sales` (auth required)
  - body example:
    ```json
    {
      "customerId": 1,
      "items": [{ "dvdId": 10, "qty": 1 }],
      "payment": { "method": "CARD", "amount": 14.99, "mockApprove": true }
    }
    ```
- `GET /api/sales` (auth required)

### Inventory (OWNER only)
- `POST /api/admin/dvds`
- `PATCH /api/admin/dvds/:id`
- `DELETE /api/admin/dvds/:id`
- `PATCH /api/admin/inventory/:dvdId`
  - body: `{ "totalCopies": 10, "availableCopies": 7 }`

### Time Logs
- `POST /api/time/clock-in` (auth required)
- `POST /api/time/clock-out` (auth required)
- `GET /api/time/logs` (auth required; OWNER can view all)

---

## Frontend Implementation

### Frontend goals
The frontend provides an employee UI that:
- authenticates employees/owners
- calls backend APIs
- supports the main store workflows end-to-end
- keeps UI state predictable and easy to demo

### Recommended UI pages / flows
1. **Login**
   - username/password
   - store JWT on success
2. **DVD Catalog**
   - search/filter/sort
   - show availability
3. **DVD Detail**
   - full metadata + availability
   - rent/sell actions route to respective forms
4. **Customer Lookup/Create**
   - search existing customer
   - create new if not found
5. **Rent Flow**
   - select customer
   - select DVD(s) + qty
   - choose due date
   - confirm simulated card payment
   - show receipt
6. **Return Flow**
   - find active rental(s)
   - return rental
   - show updated inventory + overdue status
7. **Sell Flow**
   - select customer
   - select DVD(s) + qty
   - confirm simulated card payment
   - show receipt
8. **Owner Inventory**
   - add/edit DVDs
   - adjust stock counts
9. **Time Clock**
   - clock in/out
   - display current status + history

### Recommended state management
- Keep it simple:
  - `AuthContext` for user + token
  - local component state for forms
  - a shared API client to attach JWT automatically

### API integration pattern
Create a single API client helper that:
- sets the base URL (e.g., `http://localhost:3001`)
- attaches JWT token
- normalizes error handling

---

## Business Rules

### Rental limits
- A customer may have **max 3 active rentals** at any time.
- Define “active rental” as `return_date IS NULL` (or status ACTIVE).
- On `POST /api/rentals`, backend must check count before creating the rental.

### Inventory rules
- Do not allow renting or selling if `available_copies < qty`.
- Rent decreases `available_copies`.
- Return increases `available_copies`.
- Sale decreases inventory (decide: reduce `total_copies` too, or only `available_copies` if you treat sold DVDs as removed from availability).

### Overdue rules
- A rental is overdue if `now > due_at` and `return_date IS NULL`.
- Overdue list endpoint should return:
  - customer info
  - days overdue
  - rental items

### Payment (simulation)
- Backend should accept a `mockApprove` flag or a simulated card payload.
- If declined, do not create a transaction; return a clear error.

### Receipts
- After successful rent/return/sale, backend should return a “receipt payload”:
  - transaction id
  - timestamp
  - employee
  - customer
  - items
  - totals
  - payment result

---

## Testing

### Backend (recommended minimum)
Use Jest + Supertest to test:
- login success/failure
- create rental:
  - rejects if inventory unavailable
  - rejects if customer already has 3 active rentals
  - success updates inventory
- return rental:
  - success updates inventory
  - marks return date
- create sale:
  - rejects if inventory unavailable
  - success updates inventory
- OWNER-only routes:
  - EMPLOYEE gets 403
  - OWNER succeeds

### Frontend (recommended minimum)
Manual demo checklist:
1. Login as EMPLOYEE
2. Search DVD and verify availability
3. Create customer
4. Rent 1 DVD (approved payment) → view receipt
5. Attempt to rent beyond stock → verify blocked
6. Create 2 more rentals and verify 4th rental fails (max 3)
7. Return a rental and verify availability increases
8. Login as OWNER and adjust inventory
9. Clock in/out and verify logs

---

## Troubleshooting

### Docker DB issues
- Ensure Docker Desktop is running
- Restart containers:
```bash
docker compose down
docker compose up -d
```

### Backend cannot connect to DB
- Verify `DATABASE_URL` in `.env`
- Verify container is running: `docker ps`
- Confirm port 5432 is free on your machine

### Prisma migration errors
- Reset DB (destructive) and re-run migrations:
```bash
docker compose down -v
docker compose up -d
cd backend
npx prisma migrate dev
```

### Auth errors (401/403)
- 401: missing/invalid token
- 403: valid token but role not allowed (OWNER-only route)
