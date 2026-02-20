<p align="center">
  <img src="https://img.shields.io/badge/Big%20Data-0052CC?style=for-the-badge" alt="Big Data" />
  <img src="https://img.shields.io/badge/SVGU-Workshop-blue?style=for-the-badge" alt="SVGU Workshop" />
  <img src="https://img.shields.io/badge/ScaleMetrics-Demo-111827?style=for-the-badge" alt="ScaleMetrics Demo" />
</p>

# 📘 SVGU Big Data Concepts Guide

## ScaleMetrics Classroom Explanation Notes

This README is designed for teaching **Big Data concepts** to students during the **SVGU workshop**, with detailed project implementation steps from both backend and frontend.

> **Workshop at [SVGU University](https://www.svgu.ac.in/) — Conducted by [Technotery](https://www.technotery.com/) & [Infopercept Consulting Pvt. Ltd.](https://www.infopercept.com/)**

---

## 📑 Table of Contents

- [What Is Big Data?](#-what-is-big-data)
- [Why Big Data Matters](#-why-big-data-matters)
- [The 5Vs of Big Data](#-the-5vs-of-big-data)
- [How Big Data Systems Work (Simple Pipeline)](#-how-big-data-systems-work-simple-pipeline)
- [Big Data in This SVGU Demo](#-big-data-in-this-svgu-demo)
- [Step-by-Step: What We Built in Backend](#-step-by-step-what-we-built-in-backend)
- [Step-by-Step: What We Built in Frontend](#-step-by-step-what-we-built-in-frontend)
- [End-to-End Request Flow](#-end-to-end-request-flow)
- [Workshop Participants](#-workshop-participants)
- [Connect With Us](#-connect-with-us)

---

## ❓ What Is Big Data?

**Big Data** means datasets that are too large, too fast, or too complex for traditional methods.

Simple explanation for students:

- Data comes from multiple sources.
- Data grows continuously.
- Data has quality issues (missing/inconsistent values).
- We need scalable storage, processing, and analytics patterns.

---

## 🎯 Why Big Data Matters

Big Data helps organizations:

1. Make faster decisions.
2. Detect trends and patterns.
3. Improve customer experience.
4. Build data-driven products.

Common examples:

- E-commerce recommendations
- Banking fraud detection
- Healthcare risk analysis
- Smart traffic optimization

---

## 5️⃣ The 5Vs of Big Data

## 1) Volume
Large scale of data (GB, TB, PB).

## 2) Velocity
Speed of data generation and processing.

## 3) Variety
Multiple data formats (CSV, logs, JSON, etc.).

## 4) Veracity
Data quality and trustworthiness.

## 5) Value
Meaningful business outcomes from data.

Teaching line:

"Big Data is not only about size, but about handling scale, speed, quality, and extracting value."

---

## ⚙️ How Big Data Systems Work (Simple Pipeline)

Use this 4-stage flow in class:

1. **Ingest**
- Bring data into the system (files/APIs/streams).

2. **Store**
- Save data in scalable storage (MongoDB/data lake/warehouse).

3. **Process/Transform**
- Clean, standardize, and enrich data.

4. **Consume/Analyze**
- Use for dashboards, reports, and analytics.

---

## 🧠 Big Data in This SVGU Demo

This project demonstrates the same pipeline:

1. CSV data imported into source collection.
2. Aggregation pipeline transforms data.
3. Transformed data written into target collection.
4. Results validated through collection overview.

Core concept:

- Source (raw) and target (curated) collections are kept separate.

---

## 🛠 Step-by-Step: What We Built in Backend

### Step 1: Server setup and API registration

File: `backend/server.js`

What we did:

1. Loaded env with `dotenv`.
2. Connected MongoDB via `connectDB()`.
3. Added core middleware (`cors`, `express.json`).
4. Added health route `GET /api/health`.
5. Registered routes:
- `/api/auth` from `backend/routes/authRoutes.js`
- `/api/products` from `backend/routes/productRoutes.js`
- `/api/data` from `backend/routes/dataRoutes.js`

### Step 2: Auth protection for secured APIs

Files:
- `backend/middleware/authMiddleware.js`
- `backend/routes/authRoutes.js`
- `backend/controllers/authController.js`

What we did:

1. Implemented register/login with JWT.
2. Protected data/product routes using bearer token middleware.

### Step 3: Data routes for Big Data tasks

File: `backend/routes/dataRoutes.js`

What we did:

1. Added protected router (`router.use(protect)`).
2. Configured CSV upload with `multer`.
3. Added endpoints:
- `POST /api/data/import-csv`
- `POST /api/data/migrate-city`
- `GET /api/data/collections`

### Step 4: CSV import logic (Task 1)

File: `backend/controllers/dataController.js`

What we did:

1. Read uploaded CSV via stream (`csv-parser`).
2. Converted each row into normalized document fields.
3. Inserted docs in batches (`insertMany`) for efficiency.
4. Returned import summary (parsed, inserted, collection count).

### Step 5: Aggregation migration logic (Task 2)

File: `backend/controllers/dataController.js`

What we did:

1. Accepted source/target collections and city mapping.
2. Built aggregation pipeline with:
- `$addFields`
- `$cond`
- `$toLower`
- `$merge`
3. Replaced city `Ahmedabad` -> `Vadodara`.
4. Added `migrationMeta` for auditability.
5. Returned affected counts and pipeline info.

### Step 6: Collection overview for validation

File: `backend/controllers/dataController.js`

What we did:

1. Listed non-system collections.
2. Returned collection count + sample row.
3. Used this as observability endpoint for classroom verification.

### Step 7: Existing product module preserved

Files:
- `backend/controllers/productController.js`
- `backend/routes/productRoutes.js`
- `backend/models/Product.js`
- `backend/models/Specification.js`

What we did:

- Kept full product CRUD as part of ScaleMetrics app.

---

## 🎨 Step-by-Step: What We Built in Frontend

### Step 1: App routing and protected access

File: `frontend/src/App.jsx`

What we did:

1. Registered public routes (`/login`, `/register`).
2. Registered protected routes (`/products`, `/data-workshop`, etc.).
3. Wrapped protected pages with `ProtectedRoute`.

### Step 2: Navigation updates

File: `frontend/src/components/Navbar.jsx`

What we did:

1. Added navigation link: **Big Data Lab**.
2. Kept auth-aware navbar behavior.

### Step 3: Big Data workshop screen

File: `frontend/src/pages/DataWorkshop.jsx`

What we did:

1. Added CSV import form:
- file input
- collection name
- truncate option
2. Added migration form:
- sourceCollection
- targetCollection
- fromCity
- toCity
3. Added collection overview table.
4. Added response/pipeline display for teaching.

### Step 4: API integration with token

File: `frontend/src/services/api.js`

What we did:

1. Configured Axios base URL.
2. Added request interceptor to attach `Authorization: Bearer <token>`.

### Step 5: Auth state management

File: `frontend/src/context/AuthContext.jsx`

What we did:

1. Stored token + user in localStorage.
2. Exposed login/logout/isAuthenticated.
3. Synced auth state across tabs.

### Step 6: Existing product screens preserved

Files:
- `frontend/src/pages/Products.jsx`
- `frontend/src/pages/ProductCreate.jsx`
- `frontend/src/pages/ProductEdit.jsx`
- `frontend/src/pages/ProductView.jsx`

What we did:

- Kept product management as existing module.

---

## 🔄 End-to-End Request Flow

1. User logs in from frontend.
2. JWT token is stored in browser.
3. Axios sends token for protected API calls.
4. User uploads CSV from Big Data Lab page.
5. Backend stores file in `backend/uploads/`.
6. Backend parses CSV stream + inserts batches into source collection.
7. User runs migration from UI.
8. Backend runs aggregation pipeline and writes transformed data to target collection.
9. Frontend fetches collection overview and displays verification data.

---


## 👨‍💻 Workshop Participants

This workshop includes participants from **Technotery** and **Infopercept Consulting**.

| Name | Company | LinkedIn |
| :-- | :-- | :-- |
| **Vishv Unjiya** | [Technotery](https://www.technotery.com/) | [LinkedIn](https://www.linkedin.com/in/vishv-unjiya-a49717220/) |
| **Hitesh Nathani** | [Infopercept Consulting](https://www.infopercept.com/) | [LinkedIn](https://www.linkedin.com/in/hitesh-nathani-06a803237/) |
| **Kalp Patel** | [Technotery](https://www.technotery.com/) | [LinkedIn](https://www.linkedin.com/in/kalp-patel-93526425b/) |
| **Jainil Patel** | [Infopercept Consulting](https://www.infopercept.com/) | [LinkedIn](https://www.linkedin.com/in/jainilpatel14/) |
| **Hitarth Sharma** | [Infopercept Consulting](https://www.infopercept.com/) | [LinkedIn](https://www.linkedin.com/in/hitarthh/) |

---

## 🤝 Connect With Us

<p align="center">
  <a href="https://www.linkedin.com/company/technotery/"><img src="https://img.shields.io/badge/Technotery-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white" alt="Technotery LinkedIn" /></a>
  <a href="https://www.linkedin.com/company/infopercept-consulting-pvt-ltd"><img src="https://img.shields.io/badge/Infopercept_Consulting-0A66C2?style=for-the-badge&logo=linkedin&logoColor=white" alt="Infopercept LinkedIn" /></a>
  <a href="https://www.svgu.ac.in/"><img src="https://img.shields.io/badge/SVGU-University-blue?style=for-the-badge" alt="SVGU" /></a>
</p>

<p align="center">
  Prepared with ❤️ for <strong>SVGU Big Data Workshop</strong> by <a href="https://www.technotery.com/">Technotery</a> & <a href="https://www.infopercept.com/">Infopercept</a>
</p>
