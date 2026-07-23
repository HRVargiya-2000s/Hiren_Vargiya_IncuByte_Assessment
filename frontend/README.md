# Frontend

React + Vite frontend for the Car Dealership Inventory System.

## UI

- Responsive top navigation
- Dashboard cards
- Vehicle management table
- Search
- Add/Edit vehicle forms
- Restock modal
- Delete confirmation dialog
- Toast notifications
- Loading skeletons
- Empty states
- Car image URL preview and thumbnails

## Scripts

```bash
npm run dev
npm test -- --run
npm run build
```

## TDD Notes

New UI polish was added with RED/GREEN tests:

- `src/tests/common/Loader.test.jsx`
- `src/tests/common/Toast.test.jsx`
- `src/tests/vehicle/ManageVehicles.test.jsx`

## API

The frontend uses the existing backend endpoints only:

- `POST /api/auth/register`
- `POST /api/auth/login`
- `GET /api/vehicles`
- `POST /api/vehicles`
- `PUT /api/vehicles/:id`
- `DELETE /api/vehicles/:id`
- `GET /api/vehicles/search`
- `POST /api/vehicles/:id/purchase`
- `POST /api/vehicles/:id/restock`
