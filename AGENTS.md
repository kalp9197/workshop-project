# AGENTS.md

## Project Snapshot

- Project name: **ScaleMetrics**
- Type: Full-stack MERN app for large CSV ingestion + analytics dashboard
- Backend path: `/Users/kalp/Downloads/live-project-workshop/backend`
- Frontend path: `/Users/kalp/Downloads/live-project-workshop/frontend`

## Current Architecture

### Backend

- Entry point: `backend/server.js`
- DB config: `backend/config/db.js`
- Models:
  - `backend/models/User.js` (email/password with bcrypt hash pre-save hook)
  - `backend/models/Sale.js` (sales schema with indexes for analytics fields)
  - `backend/models/Product.js` (product entity with nested `specifications`)
- Middleware:
  - `backend/middleware/authMiddleware.js` (JWT protect middleware)
- Controllers:
  - `backend/controllers/authController.js`
  - `backend/controllers/dataController.js`
  - `backend/controllers/productController.js`
  - `backend/controllers/statsController.js`
- Routes:
  - `backend/routes/authRoutes.js`
  - `backend/routes/dataRoutes.js`
  - `backend/routes/productRoutes.js`
  - `backend/routes/statsRoutes.js`

### Frontend

- Framework: React + Vite + Tailwind
- Root app: `frontend/src/App.jsx`
- Auth context: `frontend/src/context/AuthContext.jsx`
- API client: `frontend/src/services/api.js`
- Components:
  - `frontend/src/components/Navbar.jsx`
  - `frontend/src/components/ProtectedRoute.jsx`
- Pages:
  - `frontend/src/pages/Login.jsx`
  - `frontend/src/pages/Register.jsx`
  - `frontend/src/pages/Dashboard.jsx` (CSV upload + customer records table preview; max 200 rows)
  - `frontend/src/pages/Products.jsx` (table/list page with View, Edit, Delete actions + custom delete confirmation modal)
  - `frontend/src/pages/ProductCreate.jsx` (`/product-create` page for create form)
  - `frontend/src/pages/ProductEdit.jsx` (`/products/:id/edit` page for prefilled edit form)
  - `frontend/src/pages/ProductView.jsx` (`/products/:id` page for styled product details with summary cards + specifications section)
  - `frontend/src/pages/productFormUtils.js` (shared product form helpers)

## Implemented API Endpoints

- Health:
  - `GET /api/health`
- Auth:
  - `POST /api/auth/register`
  - `POST /api/auth/login`
- Data:
  - `POST /api/data/upload` (protected, file field: `file`)
- Analytics:
  - `GET /api/stats/summary` (protected)
  - `GET /api/stats/revenue-by-region` (protected)
  - `GET /api/stats/sales-by-item-type` (protected)
  - `GET /api/stats/records?limit=200` (protected, hard-capped at 200)
- Products (protected):
  - `GET /api/products`
  - `GET /api/products/:id`
  - `POST /api/products`
  - `PUT /api/products/:id`
  - `DELETE /api/products/:id`

## Data Ingestion Behavior

- CSV upload uses `multer` for temporary disk upload.
- Parsing uses `fs.createReadStream(...).pipe(csv())`.
- Parser maps customer CSV headers (`Index`, `Customer Id`, `First Name`, `Last Name`, `Company`, `City`, `Country`, `Phone 1`, `Phone 2`, `Email`, `Subscription Date`, `Website`) into stored records.
- Batch writes default to `20,000` rows (`CSV_BATCH_SIZE` configurable).
- Batch inserts use MongoDB native collection `insertMany` with `ordered: false`.
- Up to `3` chunk inserts run in parallel by default (`CSV_INSERT_CONCURRENCY` configurable).
- Uploaded temp file is removed in `finally` cleanup.

## Run & Build Commands

### Backend

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

### Frontend

```bash
cd frontend
npm install
npm run dev
npm run build
```

## Environment Variables

Backend `.env` expected keys:

- `PORT`
- `MONGO_URI`
- `JWT_SECRET`
- `JWT_EXPIRES_IN`
- `CSV_BATCH_SIZE` (optional, default `20000`)
- `CSV_INSERT_CONCURRENCY` (optional, default `3`)

Frontend optional `.env` key:

- `VITE_API_URL`

## Notes For Future Agents

- Keep workshop readability high: prefer clear naming and concise comments over over-abstracted code.
- Preserve stream-based CSV ingestion; avoid loading whole files in memory.
- Keep protected routes for upload/stats.
- Keep product `sku` unique and specification format as `{ key, value }`.
- If schema fields change, update:
  - `backend/models/Sale.js`
  - `backend/controllers/dataController.js` mapping
  - dashboard customer table column assumptions in `frontend/src/pages/Dashboard.jsx`
  - `backend/models/Product.js`
  - `backend/controllers/productController.js`
  - product form assumptions in `frontend/src/pages/ProductCreate.jsx`
  - product form assumptions in `frontend/src/pages/ProductEdit.jsx`
  - product details assumptions in `frontend/src/pages/ProductView.jsx`
- Update `README.md` and this file whenever endpoints, structure, or workflows change.
