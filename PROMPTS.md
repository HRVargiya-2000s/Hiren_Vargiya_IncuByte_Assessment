# PROMPTS

## Assessment Direction

Continue from the existing full-stack Car Dealership Inventory System.

Constraints:

- Do not recreate the project.
- Do not rewrite working backend APIs.
- Keep backend contracts unchanged.
- Improve the frontend professionally with React, Vite, Tailwind CSS, Axios, React Router, Vitest, and React Testing Library.

## TDD Workflow Used

For new frontend polish features:

1. RED: Added failing tests for loading skeletons, toast notifications, and vehicle action feedback.
2. GREEN: Implemented reusable `Loader`, `Toast`, and `Card` components and integrated toast feedback into vehicle actions.
3. REFACTOR: Reused `Card` in dashboard and vehicle pages for consistent admin-panel styling.

## Completed Frontend Improvements

- Responsive top navbar
- Navbar-only admin layout with no sidebar
- Dashboard cards for total inventory, stock, low stock, out of stock, and inventory value
- Dashboard recent inventory, recent activity, and quick actions
- Vehicle table with image thumbnails
- Add/Edit vehicle image URL preview
- User catalog view backed by the same inventory data
- Indian rupee price display
- Sample vehicle seed data script
- Search, make/model/category/price filters, sorting, and pagination
- Loading skeletons
- Empty states
- Purchase, delete, and restock confirmation dialogs
- Restock modal current/new stock preview
- Stock status badges
- Toast notifications
- Button loading states for purchase/restock/delete
- Add/Edit form inline validation and submit loading states
- Reusable UI components

## Final Verification

- Backend full suite: 5 files, 16 tests passing
- Frontend full suite: 10 files, 19 tests passing
- Frontend production build: passing

## Suggested Commit

```bash
git add .
git commit -m "Improve frontend admin UI polish and feedback"
git push origin main
```
