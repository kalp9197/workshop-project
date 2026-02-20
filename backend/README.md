<p align="center">
  <img src="https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=nodedotjs&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express-000000?style=for-the-badge&logo=express&logoColor=white" alt="Express.js" />
  <img src="https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB" />
  <img src="https://img.shields.io/badge/Mongoose-880000?style=for-the-badge&logo=mongoose&logoColor=white" alt="Mongoose" />
  <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=jsonwebtokens&logoColor=white" alt="JWT" />
  <img src="https://img.shields.io/badge/Big%20Data-0052CC?style=for-the-badge" alt="Big Data" />
</p>

# 📊 ScaleMetrics — Backend API (SVGU Big Data Workshop)

A workshop-ready REST API backend for the **ScaleMetrics** platform, built for the **SVGU University Big Data Workshop**.

It demonstrates:
- JWT authentication
- Product CRUD APIs
- CSV upload and import to MongoDB
- Aggregation pipeline migration (`Ahmedabad` → `Vadodara`)

> **Workshop at [SVGU University](https://www.svgu.ac.in/) — Conducted by [Technotery](https://www.technotery.com/) & [Infopercept Consulting Pvt. Ltd.](https://www.infopercept.com/)**

---

## 📑 Table of Contents

- [Architecture Overview](#-architecture-overview)
- [Big Data Concepts in Backend](#-big-data-concepts-in-backend)
- [Prerequisites](#-prerequisites)
- [Setup and Run](#-setup-and-run)
- [Environment Variables](#-environment-variables)
- [Project Structure](#-project-structure)
- [How It Works](#-how-it-works)
- [API Reference](#-api-reference)
- [Postman Testing Flow](#-postman-testing-flow)
- [Tech Stack](#-tech-stack)
- [Workshop Participants](#-workshop-participants)

---

## 🏗 Architecture Overview

```text
┌──────────────┐       ┌──────────────────────────────────────────────────────┐
│ Frontend /   │       │                ScaleMetrics Backend                  │
│ Postman      │◄─────►│                                                      │
│ Client       │ HTTP  │  ┌──────────┐  ┌─────────────┐  ┌──────────────┐     │
└──────────────┘       │  │  Routes  │─►│ Middleware  │─►│ Controllers  │     │
                       │  │          │  │  (JWT)      │  │              │     │
                       │  └──────────┘  └─────────────┘  └───────┬──────┘     │
                       │                                         │            │
                       │                                  ┌──────▼───────┐    │
                       │                                  │   Mongoose   │    │
                       │                                  │   Models     │    │
                       │                                  └──────┬───────┘    │
                       └─────────────────────────────────────────┼────────────┘
                                                                 │
                                                          ┌──────▼───────┐
                                                          │  MongoDB     │
                                                          │  Atlas       │
                                                          └──────────────┘
```

---

## 🧠 Big Data Concepts in Backend

### 1) Ingestion at Scale Mindset
- Accept CSV through upload endpoint
- Parse row-by-row as stream (`csv-parser`)
- Batch insert to reduce DB write overhead

### 2) Transformation and Standardization
- Run aggregation pipeline on source collection
- Apply domain rule: `Ahmedabad` → `Vadodara`
- Attach migration metadata for auditability

### 3) Raw vs Curated Collections
- Source: `workshop_raw_data`
- Target: `workshop_transformed_data`

This mirrors real data engineering patterns used in Big Data systems.

---

## ✅ Prerequisites

| Requirement | Version |
|:-----------|:--------|
| Node.js | 18+ |
| npm | 9+ |
| MongoDB Atlas | Free tier works |
| Postman (optional) | Latest |

---

## ⚙️ Setup and Run

```bash
cd backend
npm install
cp .env.example .env
npm run dev
```

Health check:

```bash
curl http://localhost:5001/api/health
```

---

## 🔐 Environment Variables

`backend/.env`

```env
PORT=5001
MONGO_URI=your_mongodb_atlas_uri
JWT_SECRET=your_long_secret
JWT_EXPIRES_IN=1d
```

---

## 📂 Project Structure

```text
backend/
├── config/
│   └── db.js
├── controllers/
│   ├── authController.js
│   ├── dataController.js
│   └── productController.js
├── middleware/
│   └── authMiddleware.js
├── models/
│   ├── User.js
│   ├── Product.js
│   └── Specification.js
├── routes/
│   ├── authRoutes.js
│   ├── dataRoutes.js
│   └── productRoutes.js
├── uploads/
└── server.js
```

---

## 🔍 How It Works

### 1) Auth Layer
- Register/Login returns JWT
- Protected routes require `Authorization: Bearer <token>`

### 2) CSV Import Layer
- Endpoint receives file via `multer`
- Stream parser reads rows
- Rows are normalized and inserted in batches

### 3) Aggregation Migration Layer
- Source collection is transformed with pipeline operators
- `$merge` writes transformed docs to target collection

---

## 📡 API Reference

### Health

| Method | Endpoint | Auth | Description |
|:------|:---------|:-----|:------------|
| GET | `/api/health` | No | Server status |

### Auth

| Method | Endpoint | Auth | Description |
|:------|:---------|:-----|:------------|
| POST | `/api/auth/register` | No | Register user |
| POST | `/api/auth/login` | No | Login and get token |

### Products (Protected)

| Method | Endpoint | Auth | Description |
|:------|:---------|:-----|:------------|
| GET | `/api/products` | Yes | List products |
| POST | `/api/products` | Yes | Create product |
| GET | `/api/products/:id` | Yes | Get one product |
| PUT | `/api/products/:id` | Yes | Update product |
| DELETE | `/api/products/:id` | Yes | Delete product |

### Big Data Workshop (Protected)

| Method | Endpoint | Auth | Description |
|:------|:---------|:-----|:------------|
| POST | `/api/data/import-csv` | Yes | Import CSV to a collection |
| POST | `/api/data/migrate-city` | Yes | Aggregation migration with city transform |
| GET | `/api/data/collections` | Yes | Collection overview (count + sample) |

Migration request body:

```json
{
  "sourceCollection": "workshop_raw_data",
  "targetCollection": "workshop_transformed_data",
  "fromCity": "Ahmedabad",
  "toCity": "Vadodara"
}
```

---

## 🧪 Postman Testing Flow

1. Register: `POST /api/auth/register`
2. Login: `POST /api/auth/login`
3. Use Bearer token
4. Test data endpoints:
   - `POST /api/data/import-csv`
   - `POST /api/data/migrate-city`
   - `GET /api/data/collections`

---

## 🛠 Tech Stack

- Node.js
- Express.js
- MongoDB Atlas
- Mongoose
- JWT (`jsonwebtoken`)
- Multer
- csv-parser
- bcryptjs
- dotenv
- cors

---

## 👨‍💻 Workshop Participants

This workshop was attended by developers from **Technotery** and **Infopercept Consulting** at **SVGU University**.

<table>
  <tr><th>Name</th><th>Company</th></tr>
  <tr><td>Vishv Unjiya</td><td>Technotery</td></tr>
  <tr><td>Hitesh Nathani</td><td>Infopercept Consulting</td></tr>
  <tr><td>Kalp Patel</td><td>Technotery</td></tr>
  <tr><td>Jainil Patel</td><td>Infopercept Consulting</td></tr>
  <tr><td>Hitarth Sharma</td><td>Infopercept Consulting</td></tr>
</table>

<p align="center">
  Made with ❤️ by <a href="https://www.technotery.com/">Technotery</a> & <a href="https://www.infopercept.com/">Infopercept</a> for <strong>SVGU University</strong>
</p>
