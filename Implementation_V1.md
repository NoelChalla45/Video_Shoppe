# Video Shoppe — Stack & Architecture Notes (Short)

## Architecture
- **Using:** 3-tier: **Frontend (UI) → Backend (API) → Database**
- **Why:** clean separation, easier teamwork, easier testing, fewer merge conflicts

## Database
- **Using:** **PostgreSQL** (run locally via **Docker**)
- **Why:** reliable, industry-standard relational DB, consistent setup for everyone, easy resets

## Backend
- **Using:** **Node.js + Express** (REST API)
- **Why:** fast to build, simple endpoints, easy to connect to Postgres, good for class projects
- **DB tool:** **Prisma ORM**
- **Why Prisma:** schema + migrations, keeps DB and code in sync, less SQL pain
- **Auth:** **JWT + bcrypt**
- **Why:** secure login + role-based access (EMPLOYEE vs OWNER)

## Frontend
- **Using:** **React + Vite**
- **Why:** quick development, reusable components, easy API calls, modern tooling
- **API calls:** `fetch` *(or Axios if we choose)*
- **Why:** consistent communication with backend endpoints

## Tools
- **Git + GitHub:** version control + collaboration
- **Docker Desktop:** runs Postgres the same way on everyone’s laptop
- **VS Code:** development + extensions
- **Postman/Insomnia:** test API endpoints quickly
- **Jest + Supertest (backend):** API testing (later phase)
- **Prisma Studio (optional):** view/edit DB records during development

## Scope Reminder
- **Employee-only system:** no customer login; employees handle customers, rentals, returns, sales, inventory
- **Payment is simulated:** no real bank integration
