# Video Shoppe — Stack & Architecture Notes (Website + Free Hosting)

## Architecture
- **Using:** 3-tier: **Frontend (Website UI) → Backend (API) → Database**
- **Why:** clean separation, easier teamwork, easier testing, fewer merge conflicts

## Product Scope (What the website supports)
- **Employee-only system (Staff + Owner):**
  - Employee Login
  - Rental Transaction (max **3 DVDs** per customer)
  - Return Process
  - Inventory search + stock updates
  - Register Customer + View Customer Records
  - Due/Overdue Alerts (weekly overdue loop)
  - DVD Availability Alerts
  - System Status Notifications
  - Employee Time Logs (clock in/out; non-editable)
- **Payment:** simulated credit card flow (no real bank integration; demo-safe)

## Database
- **Using (Recommended for FREE deployment):** **Supabase Postgres**
- **Why:** free hosted database + auth, easy setup, no server bills, works great with Vercel/Render
- **Notes:** still SQL/relational (fits our DVD/Customer/Rental relationships)

> Alternative (Local-only dev): Postgres via Docker (optional for team dev),
> but Supabase is the easiest way to deploy for free.

## Backend
- **Using:** **Node.js + Express** (REST API)
- **Why:** fast to build, simple endpoints, easy to connect to Postgres, great for class projects
- **DB tool:** **Prisma ORM**
- **Why Prisma:** schema + migrations, keeps DB and code in sync, less SQL pain
- **Auth (staff login):**
  - Option A: **Supabase Auth** (recommended; easiest)
  - Option B: **JWT + bcrypt** (works, but more setup)
- **Roles:** EMPLOYEE vs OWNER (role-based access to pages/actions)

## Frontend (Website UI)
- **Using:** **React + Vite**
- **Why:** quick development, reusable components, modern tooling
- **Styling:** **Tailwind CSS**
- **Routing:** React Router
- **API calls:** fetch (or Axios)

## UI Sitemap (Pages)
- **/login** — Employee Login
- **/dashboard** — Quick actions + metrics
- **/rent** — Rental Transaction (scan/search DVDs → cart → customer lookup/create → payment simulation → receipt)
- **/return** — Return Process (mark returned; updates inventory + customer record)
- **/inventory** — Search DVDs (title/actors/director/year/barcode) + update stock
- **/customers** — Search customers
- **/customers/:id** — View customer record (contact info, rental eligibility, rentals + due dates, history)
- **/customers/new** — Register customer
- **/alerts** — Due/Overdue alerts + DVD availability alerts + system status notification
- **/timeclock** — Clock in/out + view logs (non-editable)
- **/admin/*** — Owner-only views (employees, reports)

## Tools
- **Git + GitHub:** version control + collaboration
- **VS Code:** development + extensions
- **Postman/Insomnia:** test API endpoints quickly
- **Prisma Studio (optional):** view/edit DB records during development

## Free Deployment (No Money)
- **Frontend hosting:** **Vercel** (free)
- **Backend hosting:** **Render** (free) OR Supabase edge functions (optional)
- **Database:** **Supabase** (free tier)
- **Domain:** optional (can use default vercel.app domain)

## Notes on Requirements We Must Enforce
- **Max rentals:** 3 DVDs per customer
- **Due dates + overdue reminders:** support weekly overdue alerts if not returned
- **Employee time logs:** cannot be edited
- **Security tag step:** checkout flow must include a “security tag removed” confirmation step
- **Receipts:** printed or emailed (email can be simulated for demo)

