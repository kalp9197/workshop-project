# ScaleMetrics - Big Data Analytics Dashboard

ScaleMetrics is a full-stack MERN project built for workshop-style learning.
It demonstrates how to process very large CSV datasets (up to millions of rows) without crashing the server, then visualize analytics in a secure dashboard.

## What This Project Teaches

- JWT-based authentication (`register/login`)
- Password hashing with `bcryptjs`
- Protected backend routes with auth middleware
- Streaming CSV processing with `fs` streams + `csv-parser`
- Batch insertion (`10,000` records per chunk) for high-volume imports
- MongoDB aggregation pipelines for fast analytics
- Product CRUD module with nested specifications
- React Context for auth state management
- Private routes in React Router
- Data visualization with `Recharts`

## Folder Structure

```text
ScaleMetrics/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── dataController.js
│   │   ├── productController.js
│   │   └── statsController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   ├── Sale.js
│   │   └── Product.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── dataRoutes.js
│   │   ├── productRoutes.js
│   │   └── statsRoutes.js
│   ├── .env.example
│   ├── package.json
│   └── server.js
└── frontend/
    ├── src/
    │   ├── components/
    │   │   ├── Navbar.jsx
    │   │   └── ProtectedRoute.jsx
    │   ├── context/
    │   │   └── AuthContext.jsx
    │   ├── pages/
    │   │   ├── Dashboard.jsx
    │   │   ├── Login.jsx
    │   │   ├── ProductCreate.jsx
    │   │   ├── ProductEdit.jsx
    │   │   ├── ProductView.jsx
    │   │   ├── Products.jsx
    │   │   ├── productFormUtils.js
    │   │   └── Register.jsx
    │   ├── services/
    │   │   └── api.js
    │   ├── App.jsx
    │   ├── index.css
    │   └── main.jsx
    ├── index.html
    ├── package.json
    ├── postcss.config.js
    ├── tailwind.config.js
    └── vite.config.js
```

## Tech Stack

- Backend: Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs, csv-parser, multer
- Frontend: React, Vite, Tailwind CSS, React Router, Axios, Recharts

## Local Setup

## 1) Backend Setup

```bash
cd backend
npm install
cp .env.example .env
```

Update `.env` with your values:

```env
PORT=5001
MONGO_URI=your_mongodb_atlas_connection_string
JWT_SECRET=your_super_secret_key
JWT_EXPIRES_IN=1d
CSV_BATCH_SIZE=20000
CSV_INSERT_CONCURRENCY=3
```

Run backend:

```bash
npm run dev
```

## 2) Frontend Setup

```bash
cd frontend
npm install
```

Optional frontend env (if backend URL differs):

```env
VITE_API_URL=http://localhost:5001/api
```

Run frontend:

```bash
npm run dev
```

Frontend default: `http://localhost:5173`

## API Endpoints

### Auth

- `POST /api/auth/register`
- `POST /api/auth/login`

### Data

- `POST /api/data/upload` (protected)
  - `multipart/form-data`
  - field name must be `file`

### Analytics

- `GET /api/stats/summary` (protected)
- `GET /api/stats/revenue-by-region` (protected)
- `GET /api/stats/sales-by-item-type` (protected)
- `GET /api/stats/records?limit=200` (protected, hard-capped at 200 rows)

### Products (CRUD)

- `GET /api/products` (protected)
- `GET /api/products/:id` (protected)
- `POST /api/products` (protected)
- `PUT /api/products/:id` (protected)
- `DELETE /api/products/:id` (protected)

## CSV Format (Expected Headers)

The dashboard CSV preview currently targets customer datasets with these headers:

- `Index`
- `Customer Id`
- `First Name`
- `Last Name`
- `Company`
- `City`
- `Country`
- `Phone 1`
- `Phone 2`
- `Email`
- `Subscription Date`
- `Website`

## Workshop Demo Flow

1. Register a new user.
2. Login and open dashboard.
3. Upload a large CSV file.
4. Explain stream pipeline:
   - read stream -> csv parser -> in-memory batch -> MongoDB insert
5. Show the dashboard CSV table preview (first 200 rows) updating after import.
6. Explain analytics endpoints and aggregation pipeline (`$group`, `$sum`, `$sort`) used in backend.
7. Open `/products` to show product table list.
8. Click `Create Product` to open `/product-create` and create a product.
9. From `/products`, click `Edit` to open `/products/:id/edit` (prefilled form).
10. From `/products`, click `View` to open `/products/:id` and show details/specifications.

## Performance Notes

- Upload processing is chunked (default `20,000` rows per batch, configurable with `CSV_BATCH_SIZE`).
- Chunk inserts run with limited parallelism (default `3`, configurable with `CSV_INSERT_CONCURRENCY`).
- Inserts use MongoDB native collection bulk insert for lower overhead than model-level inserts.
- Using streams avoids loading the whole file into RAM.
- MongoDB indexes are added for frequent analytics fields (`Region`, `ItemType`, `OrderDate`, `TotalRevenue`).

## Security Notes

- Passwords are hashed before save.
- JWT token is required for upload and analytics routes.
- Never commit `.env` to source control.

## Suggested Improvements (Post-Workshop)

- Add refresh token flow
- Add role-based access control
- Add upload progress via WebSockets
- Add background jobs with BullMQ
- Add automated tests (Jest + Supertest + React Testing Library)
