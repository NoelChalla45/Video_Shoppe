# Video Shoppe (Website)

## Table of Contents
- Introduction
- Project Goals
- Features (MVP)
- Architecture
- Frontend
- Backend
- Database
- Roles & Permissions
- Alerts & Reminders
- Deployment (Free)
- Tools

---

## Introduction
Video Shoppe is a staff-facing website that supports day-to-day operations for a video rental store. The system focuses on employee workflows: renting DVDs, returning DVDs, managing inventory, managing customers, sending alerts, and tracking employee time logs.

---

## Project Goals
- Build a clean and modern website UI for store employees and the owner
- Ensure required workflows are fully supported (rent, return, inventory, customers, alerts, time logs)
- Keep hosting and deployment **free** (no paid services required for demo/prototype)

---

## Features (MVP)
- Employee login (Staff / Owner)
- Rent DVDs
  - Add DVDs to a cart
  - Enforce **max 3 DVDs per customer**
  - Assign due date
  - Simulated credit-card payment (demo-safe)
  - Receipt output (print/email simulation)
  - “Security tag removed” confirmation step
- Return DVDs (updates inventory and customer rentals)
- Inventory management (search + update stock/restock)
- Customer management (register + view customer record + rental history)
- Alerts center
  - Due soon and overdue reminders (supports weekly overdue reminder behavior)
  - DVD availability alerts
  - System status notifications
- Employee time logs (clock in/out; logs are non-editable)

---

## Architecture
- Website UI communicates with a backend/data layer to store and retrieve:
  - DVDs (inventory)
  - Customers
  - Rentals / Transactions
  - Alerts
  - Time logs
- Role-based access controls protect owner-only features.

---

## Frontend
- Built as a modern single-page website
- Pages include:
  - Login
  - Dashboard
  - Rent
  - Return
  - Inventory
  - Customers (list + profile + register)
  - Alerts
  - Time Clock
  - Owner Admin (employees/reports if included)

---

## Backend
- Handles business rules and data operations such as:
  - Validating rental rules (max 3)
  - Creating rental transactions and due dates
  - Marking returns and updating inventory
  - Creating and tracking alerts/reminders
  - Managing employee time logs
- Can be implemented as:
  - A lightweight API (Node/Express), OR
  - Directly through a hosted backend platform depending on deployment choice

---

## Database
- Uses a relational database to support:
  - Customers ↔ Rentals ↔ DVDs
  - Employees ↔ Time Logs
  - Alerts linked to customers and rentals
- Key data entities:
  - Employees, Customers, DVDs, Rentals, Rental Items, Alerts, Time Logs

---

## Roles & Permissions
- **Employee (Staff):**
  - Rent/Return DVDs
  - Manage customers
  - View/update inventory
  - Use alerts center
  - Clock in/out
- **Owner:**
  - All employee permissions
  - Additional admin views (ex: employee management, reports)

---

## Alerts & Reminders
- Due date tracking for rentals
- Overdue rentals generate reminders (supports repeated weekly overdue behavior)
- DVD availability alerts when requested DVDs become available
- System status notifications for maintenance/outage announcements

---

## Deployment (Free)
- Goal is to deploy with **no cost**
- Frontend can be hosted for free on a static web host
- Database can be hosted for free on a managed database platform
- Backend can be hosted for free if a dedicated API is used

---

## Tools
- Git + GitHub (version control)
- VS Code (development)
- API testing tool (Postman/Insomnia) if needed
- Managed database dashboard for inspecting data during development
