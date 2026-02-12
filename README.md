# ScaleMetrics - Auth + Products CRUD

ScaleMetrics is a full-stack MERN project built for workshop-style learning.
It now focuses on a clean auth flow and a product inventory CRUD module.

## What This Project Teaches

- JWT-based authentication (`register/login`)
- Password hashing with `bcryptjs`
- Protected backend routes with auth middleware
- Product CRUD module with nested specifications
- React Context for auth state management
- Private routes in React Router

## Folder Structure

```text
ScaleMetrics/
├── backend/
│   ├── config/
│   │   └── db.js
│   ├── controllers/
│   │   ├── authController.js
│   │   └── productController.js
│   ├── middleware/
│   │   └── authMiddleware.js
│   ├── models/
│   │   ├── User.js
│   │   └── Product.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   └── productRoutes.js
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

- Backend: Node.js, Express, MongoDB, Mongoose, JWT, bcryptjs
- Frontend: React, Vite, Tailwind CSS, React Router, Axios

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

### Products (CRUD, protected)

- `GET /api/products`
- `GET /api/products/:id`
- `POST /api/products`
- `PUT /api/products/:id`
- `DELETE /api/products/:id`

## Security Notes

- Passwords are hashed before save.
- JWT token is required for product routes.
- Never commit `.env` to source control.
