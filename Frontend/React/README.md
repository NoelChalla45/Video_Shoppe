# Frontend / React

React + Vite single-page application for Video Shoppe.

## Key Files
- `main.jsx` — App entry point. Mounts the React app into `index.html`.
- `App.jsx` — Root component. Defines all routes using React Router and wraps pages in the Navbar/Footer shell. Also contains the `PrivateRoute` guard that redirects unauthenticated users to `/login`.
- `index.html` — Base HTML file Vite uses to serve the app.
- `vite.config.js` — Vite build configuration (React plugin).
- `package.json` — Frontend dependencies and scripts (`npm run dev` to start on port 5173).
- `.env.example` — Copy to `.env.local` and set `VITE_API_URL` to point at the backend.

## Folders
- `components/` — All React page and UI components.
- `styles/` — CSS files, one per component.

---
> **Status: In Progress** — Auth, Home, Catalog, DVD Detail, and Account pages done. Cart, Checkout, Alerts, Time Clock, and Admin pages still to be built.
