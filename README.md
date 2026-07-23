# Car Dealership Inventory System

Full-stack inventory management system for a car dealership assessment.

## Stack

- Backend: Node.js, Express, PostgreSQL, JWT
- Frontend: React, Vite, React Router, Tailwind CSS, Axios
- Tests: Vitest, React Testing Library, Supertest

## Features

- Register and login with JWT authentication
- Protected admin dashboard
- Navbar-only layout with no sidebar
- Admin dashboard with total, low-stock, out-of-stock, and inventory-value cards
- Recent inventory, recent activity, and quick action dashboard sections
- Vehicle CRUD with image URL preview and table thumbnails
- Vehicle search, make/model/category/price filters, sorting, and pagination
- User catalog view backed by the same vehicle inventory
- Indian rupee price display
- Purchase vehicle stock
- Restock inventory
- Purchase, delete, and restock confirmation dialogs with stock previews
- Stock status badges
- Toast notifications
- Inline form validation and submit loading states
- Responsive top navigation and admin screens
- Loading skeletons and empty states

## Run Backend

```bash
cd backend
npm install
npm run create-admin
npm run seed-vehicles
npm run dev
```

Backend runs on:

```txt
http://localhost:5000
```

Default admin created by `npm run create-admin`:

```txt
email: admin@example.com
password: Password123
```

`npm run seed-vehicles` adds sample Indian-market inventory with rupee prices so both admin inventory and the user catalog have data to display.

## Run Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend runs on:

```txt
http://localhost:5173
```

## Tests

Backend:

```bash
cd backend
npm test
```

Frontend:

```bash
cd frontend
npm test -- --run
```

Current verification:

- Backend: 5 test files, 16 tests passing
- Frontend: 10 test files, 19 tests passing
- Frontend build: passing

## Build

```bash
cd frontend
npm run build
```

## Notes

The backend API contracts are unchanged. Frontend-only vehicle images are stored in browser localStorage by vehicle id because the backend vehicle schema does not expose an image field.
