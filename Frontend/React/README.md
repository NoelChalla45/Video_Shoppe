# Frontend (React)

React + Vite SPA for Video Shoppe.

## App Responsibilities
- Handle user login/register and store token/user in local storage.
- Enforce role-aware route access.
- Render customer, employee, and owner page sets.
- Call backend APIs for inventory, checkout, and owner/employee operations.

## Key Files
- `App.jsx`: route map and role guards.
- `components/`: page-level components.
- `styles/`: page/component styles.
- `utils/`: cart, rental rules, and account activity utilities.

## Run Frontend
```bash
cd Frontend/React
npm run dev
```
