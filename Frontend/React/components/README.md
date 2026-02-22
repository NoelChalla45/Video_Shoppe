# Frontend / React / components

One file per page or UI section. Each component has a matching CSS file in `styles/`.

## Current Components
| File | Route | What it does |
|---|---|---|
| `Login.jsx` | `/login` | Sign in and create account form. Posts to backend auth API, stores JWT + user in localStorage on success. |
| `Hero.jsx` | `/home` | Home/landing page after login. Shows a hero banner with personalized greeting, genre category chips, featured movie grid, and a promo banner. |
| `Navbar.jsx` | all pages | Fixed top navigation bar. Shows user initials avatar and a Log Out button that clears localStorage and redirects to login. |
| `Footer.jsx` | all pages | Simple site footer. |
| `Catalog.jsx` | `/catalog` | DVD catalog with sidebar filters (genre, availability, price range), search bar, rent/buy toggle, paginated product grid. Each card links to the DVD detail page. |
| `DVDDetail.jsx` | `/catalog/:id` | Full detail page for a single DVD. Shows poster, description, director, cast, year, rating, stock status, and rent/buy pricing with action buttons. |
| `Account.jsx` | `/account` | User account page. Shows profile avatar, stats (active rentals, max allowed, history, overdue), current rentals, rental history, and account settings. |
| `ProductList.jsx` | (data file) | Static data array of all DVDs with name, price, category, stock, year, rating, director, cast, description, and image. Used by Catalog and DVDDetail. |

## Planned Components (not yet built)
- `Cart.jsx` — Shopping cart for rentals
- `Checkout.jsx` — Checkout flow with customer lookup, payment simulation, security tag confirmation, receipt
- `Return.jsx` — Return process page
- `Alerts.jsx` — Due date, overdue, and DVD availability alerts
- `TimeClock.jsx` — Employee clock in/out and log view
- `Admin.jsx` — Owner-only employee and report views

---
> **Status: In Progress** — Core pages built. Cart, Checkout, Alerts, Return, TimeClock, and Admin still to be implemented.
