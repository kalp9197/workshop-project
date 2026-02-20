<p align="center">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/TailwindCSS-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/React%20Router-CA4245?style=for-the-badge&logo=reactrouter&logoColor=white" alt="React Router" />
  <img src="https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge" alt="Axios" />
  <img src="https://img.shields.io/badge/Big%20Data%20UI-0052CC?style=for-the-badge" alt="Big Data UI" />
</p>

# 🎨 ScaleMetrics — Frontend App (SVGU Big Data Workshop)

A workshop-ready frontend for **ScaleMetrics**, built for **SVGU University**, to demonstrate:

- Auth flow (Register/Login)
- Product management UI
- Big Data Lab UI for CSV import
- Aggregation migration workflow and collection verification

> **Workshop at [SVGU University](https://www.svgu.ac.in/) — Conducted by [Technotery](https://www.technotery.com/) & [Infopercept Consulting Pvt. Ltd.](https://www.infopercept.com/)**

---

## 📑 Table of Contents

- [UI Architecture](#-ui-architecture)
- [Big Data Concepts Shown in UI](#-big-data-concepts-shown-in-ui)
- [Prerequisites](#-prerequisites)
- [Setup and Run](#-setup-and-run)
- [Environment Configuration](#-environment-configuration)
- [Routes and Screens](#-routes-and-screens)
- [How Frontend Works](#-how-frontend-works)
- [Workshop Demo Steps](#-workshop-demo-steps)
- [Tech Stack](#-tech-stack)
- [Workshop Participants](#-workshop-participants)

---

## 🏗 UI Architecture

```text
┌────────────────────────────────────────────┐
│               React + Vite UI              │
│                                            │
│  AuthContext  ──►  ProtectedRoute          │
│      │                     │               │
│      └────────►  API Service (Axios) ──────┼────► Backend /api
│                                            │
│  Pages:                                    │
│  - Login/Register                          │
│  - Products CRUD screens                   │
│  - Big Data Lab (/data-workshop)           │
└────────────────────────────────────────────┘
```

---

## 🧠 Big Data Concepts Shown in UI

### 1) Ingestion Visibility
- Upload CSV from UI
- Select target collection
- Control truncation for rerun demos

### 2) Transformation Workflow
- Trigger city migration rule from form inputs
- Display migration output and pipeline result

### 3) Validation and Observability
- Collection overview table
- Count + sample row visibility for source/target collections

---

## ✅ Prerequisites

| Requirement | Version |
|:-----------|:--------|
| Node.js | 18+ |
| npm | 9+ |
| Backend running | `http://localhost:5001` |

---

## ⚙️ Setup and Run

```bash
cd frontend
npm install
npm run dev
```

Build for production:

```bash
npm run build
```

---

## 🔐 Environment Configuration

Create `frontend/.env` if backend URL differs:

```env
VITE_API_URL=http://localhost:5001/api
```

---

## 🧭 Routes and Screens

| Route | Access | Purpose |
|:------|:-------|:--------|
| `/login` | Public | Login screen |
| `/register` | Public | Registration screen |
| `/products` | Protected | Products listing |
| `/product-create` | Protected | Create product |
| `/products/:id` | Protected | View product |
| `/products/:id/edit` | Protected | Edit product |
| `/data-workshop` | Protected | Big Data Lab (CSV import + migration) |

---

## 🔍 How Frontend Works

### Auth and Security
- JWT token stored in `localStorage`
- Axios interceptor adds `Authorization` header
- `ProtectedRoute` blocks unauthorized routes

### Big Data Lab Screen
- Calls `POST /api/data/import-csv`
- Calls `POST /api/data/migrate-city`
- Calls `GET /api/data/collections`
- Shows success/error status and collection table

### UX for Workshop
- Inputs are prefilled for quick classroom demo
- Pipeline JSON is visible for teaching aggregation concepts
- Refresh button helps verify DB changes instantly

---

## 🎓 Workshop Demo Steps

1. Login to ScaleMetrics UI.
2. Open `/data-workshop`.
3. Upload CSV into `workshop_raw_data`.
4. Confirm collection count/sample.
5. Run migration `Ahmedabad` → `Vadodara`.
6. Confirm updates in `workshop_transformed_data`.
7. Explain raw vs curated collection strategy.

---

## 🛠 Tech Stack

- React 18
- Vite
- Tailwind CSS
- React Router DOM
- Axios

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
