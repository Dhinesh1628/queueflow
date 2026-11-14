# ⚡ QueueFlow — Enterprise Queue Management SaaS Platform

> A production-grade, full-stack queue operations and analytics SaaS platform built for high-throughput counters, customer service desks, and organizational waiting lines.

---

## 🌟 Executive Overview & Key Features

**QueueFlow** provides queue managers with real-time tools to orchestrate customer traffic, automate unique token sequences, reorder waiting positions atomically, assign service operators, and analyze operational throughput with real database metrics.

### 🔐 1. Multi-Tenant Authentication & Manager Isolation
- **Secure Registration & Login**: Managed with `bcryptjs` (salt rounds 10) password hashing and JSON Web Tokens (JWT).
- **Tenant Isolation**: Every queue, token, and metric is scoped strictly to the authenticated `managerId`. One manager cannot access, query, or mutate another manager's queues.
- **Persistent Sessions**: Automatic token recovery, state rehydration, and session expiration handling.

### 🏢 2. Multi-Queue Management
- Create departments/counters with unique names (e.g. *Customer Support*, *Billing Counter*, *Technical Helpdesk*).
- Custom alphanumeric prefixes (e.g. `CS`, `BIL`, `TECH`, `QF`).
- Real-time KPI summaries per queue: Waiting, Serving, Completed, Cancelled counts.
- Rename queues and cascade-delete queues with safety confirmation dialogs.

### 🎫 3. Atomic Token Generation & Lifecycle
- **Sequence Integrity**: Atomic `$inc` counter updates on MongoDB ensure unique tokens (`CS-001`, `CS-002`, `CS-003`) without race conditions under concurrent requests.
- Customer details collected: Full Name, optional Phone Number, optional visit reason/notes.
- Four distinct token lifecycles:
  - `WAITING`: Active waiting customer in ordered position line.
  - `SERVING`: Currently at the service counter with live service stopwatch.
  - `COMPLETED`: Successfully resolved with recorded completion timestamp and calculated service duration.
  - `CANCELLED`: Withdrawn ticket, preserved for audit analytics while automatically re-indexing remaining line positions.

### 🔀 4. Waiting List Reordering (Queue Position Management)
- Live **Move Up** and **Move Down** actions for `WAITING` customers.
- Instant atomic reordering persisted directly into MongoDB.
- Strict boundary constraints: front tokens cannot move up; rear tokens cannot move down; `SERVING` tokens cannot be reordered.

### 🎯 5. Service Assignment ("CALL NEXT" & "COMPLETE SERVICE")
- **CALL NEXT**: Automatically pulls the first waiting customer in the line, transitions status to `SERVING`, records `serviceStartedAt`, and recalculates remaining positions.
- **Concurrency Guard**: Enforces that only one customer can be actively served at any given counter at a time.
- **COMPLETE SERVICE**: Marks the active customer `COMPLETED`, logs `serviceCompletedAt`, calculates exact wait and service durations, and readies the counter for the next caller.

### 📊 6. Database-Driven Analytics Dashboard
- Calculated using **actual database aggregation pipelines**, zero mock data.
- Interactive timeframe filtering: **Today**, **Last 7 Days**, **Last 30 Days**.
- Visualizations built with Recharts:
  1. **Queue Load Trend** (AreaChart): Incoming vs completed volumes over time.
  2. **Token Status Breakdown** (Donut / PieChart): Distribution across Waiting, Serving, Completed, Cancelled.
  3. **Counter Throughput Comparison** (BarChart): Cross-counter comparison of customer resolutions.
  4. **Daily Operational Activity** (BarChart): Daily arrival and resolution audit.
  5. **Average Waiting Time**: Actual mathematical delta between token creation and service initiation.

---

## 🛠️ Technology Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, Vite, Tailwind CSS v4, React Router DOM v7, Axios, Recharts, Lucide React, Framer Motion |
| **Backend** | Node.js (v24), Express.js (v5), MongoDB Atlas, Mongoose (v9), JSON Web Tokens, bcrypt.js, Morgan, CORS |
| **Database** | MongoDB Atlas (Cloud Replica Set) |
| **Tooling & QA** | Custom Automated Test Harness (16/16 test suites passing), ESLint/Oxlint, Git |

---

## 📂 Project Architecture & Folder Structure

```
queueflow/
├── package.json                   # Root monorepo orchestrator scripts
├── README.md                      # Comprehensive documentation
├── .gitignore                     # Git ignore rules for node_modules, build & secrets
├── .env.example                   # Environment variable template
│
├── backend/                       # REST API Architecture
│   ├── config/
│   │   └── db.js                  # Mongoose connection with SRV DNS resolution
│   ├── controllers/
│   │   ├── authController.js      # Auth & manager profile logic
│   │   ├── queueController.js     # Queue CRUD & metrics
│   │   ├── tokenController.js     # Token creation, call-next, complete, cancel, move
│   │   └── analyticsController.js # Aggregated analytics controller
│   ├── middleware/
│   │   ├── authMiddleware.js      # Bearer JWT verification & manager attachment
│   │   └── errorHandler.js        # Centralized HTTP & Mongoose error handler
│   ├── models/
│   │   ├── Manager.js             # Manager account schema & bcrypt hook
│   │   ├── Queue.js               # Queue schema with counter & prefix
│   │   └── Token.js               # Token schema with compound indices
│   ├── routes/
│   │   ├── authRoutes.js          # /api/auth
│   │   ├── queueRoutes.js         # /api/queues
│   │   ├── tokenRoutes.js         # /api/tokens
│   │   └── analyticsRoutes.js     # /api/analytics
│   ├── services/
│   │   ├── tokenService.js        # Core atomic queue logic & re-indexing
│   │   └── analyticsService.js    # Metric aggregations & time ranges
│   ├── utils/
│   │   ├── generateToken.js       # JWT signing helper
│   │   └── formatters.js          # Time and token code formatters
│   ├── validators/
│   │   ├── authValidator.js       # Registration & login field rules
│   │   ├── queueValidator.js      # Queue creation rules
│   │   └── tokenValidator.js      # Token creation & move validation
│   ├── test/
│   │   └── api-test.js            # Automated 16-point integration test harness
│   ├── seed.js                    # Rich realistic demo seeder
│   ├── server.js                  # Express application entrypoint
│   └── package.json
│
└── frontend/                      # React SPA (Vite + Tailwind CSS)
    ├── src/
    │   ├── assets/                # Static assets & brand icons
    │   ├── components/
    │   │   ├── common/            # Navbar, Sidebar, Modal, ConfirmDialog, StatCard, Spinner
    │   │   ├── queues/            # QueueCard, CreateQueueModal, EditQueueModal
    │   │   └── tokens/            # ServingBanner, TokenTable, CreateTokenModal
    │   ├── context/
    │   │   ├── AuthContext.jsx    # Persistent auth provider
    │   │   └── ToastContext.jsx   # Micro-interaction notifications
    │   ├── hooks/
    │   │   ├── useAuth.js
    │   │   └── useToast.js
    │   ├── layouts/
    │   │   └── DashboardLayout.jsx # App shell with sidebar & header
    │   ├── pages/
    │   │   ├── LoginPage.jsx       # Manager login with demo auto-fill
    │   │   ├── RegisterPage.jsx    # Manager account creation
    │   │   ├── OverviewPage.jsx    # Operations dashboard
    │   │   ├── QueuesPage.jsx      # Queue list & search
    │   │   ├── QueueDetailPage.jsx # Live queue operations console
    │   │   ├── AnalyticsPage.jsx   # Recharts metric visualizer
    │   │   ├── TokenHistoryPage.jsx# Complete audit trail & filters
    │   │   ├── SettingsPage.jsx    # Profile management & system status
    │   │   └── NotFoundPage.jsx    # 404 handler
    │   ├── services/
    │   │   ├── api.js              # Axios interceptors for JWT & auto-redirect
    │   │   ├── authService.js
    │   │   ├── queueService.js
    │   │   ├── tokenService.js
    │   │   └── analyticsService.js
    │   ├── utils/
    │   │   └── formatters.js       # Relative time & status badge styles
    │   ├── App.jsx                 # Route definitions & guards
    │   ├── main.jsx
    │   └── index.css               # Tailwind CSS v4 root stylesheet
    ├── vite.config.js              # Vite server & API proxy
    ├── vercel.json                 # Vercel SPA rewrites
    └── package.json
```

---

## ⚡ Quick Start Guide (Local Setup)

### 1. Prerequisites
- **Node.js**: v18.0 or higher (v24.x tested)
- **MongoDB**: MongoDB Atlas URI or local MongoDB instance

### 2. Clone and Install Dependencies
```bash
# Clone the repository
git clone <your-repository-url>
cd queueflow

# Install backend dependencies
cd backend
npm install

# Install frontend dependencies
cd ../frontend
npm install
```

### 3. Configure Environment Variables

**Backend (`backend/.env`):**
```env
PORT=5000
NODE_ENV=development
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.ffyo8gm.mongodb.net/queueflow?retryWrites=true&w=majority
JWT_SECRET=queueflow_super_secret_jwt_key_2026_production
JWT_EXPIRES_IN=7d
CLIENT_URL=http://localhost:5173
```

**Frontend (`frontend/.env`):**
```env
VITE_API_BASE_URL=/api
```

### 4. Seed Rich Demo Data (Recommended for Testing/Interview)
Populate your database with sample queues (*Customer Support*, *Billing Counter*, *Technical Support*), active waiting tokens, and historical service records:
```bash
cd backend
node seed.js
```
> **Default Demo Login:**
> - Email: `dineshkandukuri336@gmail.com`
> - Password: `QueueFlow2026!`
> *(An "Auto-fill" button is also provided directly on the Login page for instant demonstration).*

### 5. Run the Application
Open two terminal windows:

**Terminal 1 (Backend API):**
```bash
cd backend
npm run dev
# Server will listen on http://localhost:5000
```

**Terminal 2 (Frontend Client):**
```bash
cd frontend
npm run dev
# Vite client will launch on http://localhost:5173
```

Visit **http://localhost:5173** in your browser.

---

## 🧪 Automated Backend Verification (16/16 Test Suites)

QueueFlow includes an automated integration test script verifying all core business workflows against MongoDB Atlas.

To run the automated tests:
```bash
cd backend
npm test
```

### Verified Test Matrix:
1. `GET /api/health` — System health check & online status.
2. `POST /api/auth/register` — Manager registration & JWT issuance.
3. `POST /api/auth/register` — Duplicate email rejection (409 Conflict).
4. `POST /api/auth/login` — Manager login & credential verification.
5. `POST /api/auth/login` — Bad credentials rejection (401 Unauthorized).
6. `GET /api/auth/me` — Protected route authorization & profile retrieval.
7. `POST /api/queues` — Multiple queue creation with custom prefixes.
8. `POST /api/queues` — Duplicate queue name prevention for same manager.
9. `POST /api/tokens` — Atomic sequence numbering (`CS-001`, `CS-002`, `CS-003`).
10. `PATCH /api/tokens/:id/move` — Waiting line rearrangement (Move Up/Down).
11. `POST /api/tokens/call-next` — Promotion to `SERVING` with timestamp.
12. `POST /api/tokens/call-next` — Concurrency guard (prevents multiple serving tokens).
13. `POST /api/tokens/complete-service` — Service completion & duration calculation.
14. `PATCH /api/tokens/:id/cancel` — Cancellation with waiting position re-indexing.
15. `GET /api/analytics` — Dynamic calculations from real database aggregations.
16. Cleanup — Post-test teardown and artifact removal.

---

## 📡 REST API Reference

### Authentication Endpoints (`/api/auth`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/register` | Public | Register new manager (`name`, `email`, `password`) |
| `POST` | `/api/auth/login` | Public | Authenticate manager and retrieve JWT token |
| `GET` | `/api/auth/me` | Private | Get authenticated manager profile |
| `PUT` | `/api/auth/profile` | Private | Update display name or change password |

### Queue Endpoints (`/api/queues`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/queues` | Private | List all queues for logged-in manager with live stats |
| `POST` | `/api/queues` | Private | Create new queue (`name`, `description`, `prefix`) |
| `GET` | `/api/queues/:id` | Private | Get individual queue details & current serving token |
| `PUT` | `/api/queues/:id` | Private | Update queue configuration |
| `DELETE` | `/api/queues/:id` | Private | Delete queue and cascade-remove associated tokens |
| `GET` | `/api/queues/:id/stats` | Private | Get detailed real-time statistics for a queue |

### Token Endpoints (`/api/tokens`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/tokens` | Private | Issue a new token (`queueId`, `customerName`, `phoneNumber`, `notes`) |
| `GET` | `/api/tokens` | Private | Filter/search tokens (`queueId`, `status`, `search`, `page`, `limit`) |
| `GET` | `/api/tokens/:id` | Private | Get single token record |
| `POST` | `/api/tokens/call-next` | Private | Call next waiting person in line for service (`queueId`) |
| `POST` | `/api/tokens/complete-service` | Private | Complete active service (`queueId`, `tokenId?`) |
| `PATCH` | `/api/tokens/:id/cancel` | Private | Cancel token and re-index remaining waiting positions |
| `PATCH` | `/api/tokens/:id/move` | Private | Move waiting token position (`direction: "up" \| "down"`) |

### Analytics Endpoints (`/api/analytics`)
| Method | Endpoint | Access | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/analytics` | Private | Query aggregated KPIs and charts (`?timeframe=today\|7d\|30d`) |

---

## 🚀 Deployment Guide

### Frontend Deployment (Vercel)
1. Push repository to GitHub.
2. Import project into [Vercel](https://vercel.com).
3. Set **Root Directory** to `frontend`.
4. Add Environment Variable:
   - `VITE_API_BASE_URL`: `https://your-backend.onrender.com/api`
5. Deploy. `vercel.json` already contains client-side rewrite rules for SPA routing.

### Backend Deployment (Render or Railway)
1. In [Render](https://render.com) or [Railway](https://railway.app), create a new **Web Service**.
2. Set **Root Directory** to `backend`.
3. Build Command: `npm install`
4. Start Command: `node server.js`
5. Configure Environment Variables:
   - `NODE_ENV`: `production`
   - `PORT`: `5000` (or leave default for host)
   - `MONGODB_URI`: `<Your MongoDB Atlas connection URI>`
   - `JWT_SECRET`: `<A strong random 32+ character key>`
   - `CLIENT_URL`: `https://your-frontend.vercel.app`
6. Deploy and verify `/api/health`.

---

## 📄 License
This project is open-source and available under the [ISC License](LICENSE).
