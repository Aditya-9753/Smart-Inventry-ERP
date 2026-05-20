# 🏭 Smart Inventory ERP

A production-grade, full-stack **Enterprise Resource Planning** system for inventory management, built with FastAPI, React, MongoDB, and Redis.

---

## 📐 Tech Stack

| Layer | Technology |
|-------|------------|
| **Backend** | Python 3.11, FastAPI, Beanie ODM, Motor |
| **Database** | MongoDB 7.0 |
| **Cache / Sessions** | Redis 7.2 |
| **Frontend** | React 19, Vite, Redux Toolkit, Tailwind CSS |
| **Auth** | JWT (access + refresh), bcrypt, Redis blacklist |
| **Charts** | Recharts |
| **Reports** | ReportLab (PDF), openpyxl (Excel), csv |
| **WebSockets** | Native FastAPI WebSocket + browser WebSocket |
| **Scheduler** | APScheduler |
| **Container** | Docker Compose + Nginx |
| **Tests** | pytest-asyncio, httpx AsyncClient |

---

## 🗂️ Project Structure

```
Smart Inventory ERP/
├── backend/
│   ├── app/
│   │   ├── auth/           # JWT, login, refresh, logout
│   │   ├── users/          # User CRUD, roles, permissions
│   │   ├── products/       # Product & category management
│   │   ├── inventory/      # Inward / outward / transfer engine
│   │   ├── warehouses/     # Warehouse CRUD + per-warehouse stock
│   │   ├── dashboard/      # Stats aggregation
│   │   ├── analytics/      # Trends, fast-moving, dead-stock
│   │   ├── reports/        # PDF / Excel / CSV generation
│   │   ├── notifications/  # In-app notifications
│   │   ├── websocket/      # Real-time WS channels
│   │   ├── audit/          # Audit logs
│   │   ├── settings/       # System settings KV store
│   │   ├── tasks/          # APScheduler background tasks
│   │   ├── core/           # RBAC, JWT, security helpers
│   │   ├── database/       # Beanie init, connection
│   │   ├── utils/          # SKU, barcode, pagination helpers
│   │   └── tests/          # pytest test suite
│   ├── Dockerfile
│   ├── requirements.txt
│   ├── pyproject.toml
│   └── .env.example
│
├── frontend/
│   ├── src/
│   │   ├── api/            # Axios instance, endpoints, interceptors
│   │   ├── app/            # Redux store
│   │   ├── components/     # Reusable UI components
│   │   ├── context/        # AuthContext, ThemeContext, WebSocketContext
│   │   ├── hooks/          # Custom hooks (useInventory, useNotifications…)
│   │   ├── layouts/        # Role-specific layouts
│   │   ├── pages/          # admin/, manager/, staff/, viewer/, auth/
│   │   ├── redux/          # All slice files
│   │   ├── routes/         # AppRoutes + role guards
│   │   ├── services/       # API service layer
│   │   └── utils/          # localStorage, exportHelpers
│   ├── Dockerfile
│   ├── package.json
│   └── .env.example
│
├── nginx/
│   └── nginx.conf          # Reverse proxy + WS + rate limiting
│
└── docker-compose.yml      # Full 5-service orchestration
```

---

## 🚀 Quick Start

### Prerequisites
- [Docker Desktop](https://www.docker.com/products/docker-desktop/)
- [Docker Compose](https://docs.docker.com/compose/) (bundled with Docker Desktop)

### 1. Clone & Configure

```bash
git clone https://github.com/yourorg/smart-inventory-erp.git
cd smart-inventory-erp

# Backend environment
cp backend/.env.example backend/.env

# Frontend environment
cp frontend/.env.example frontend/.env
```

Edit `backend/.env` with your real values — especially:
- `SECRET_KEY` — change to a random 32+ character string
- `SMTP_USER` / `SMTP_PASSWORD` — for email alerts (optional)

### 2. Start All Services

```bash
docker-compose up --build
```

| Service | URL |
|---------|-----|
| App (via Nginx) | http://localhost |
| Frontend direct | http://localhost:3000 |
| Backend API | http://localhost:8000 |
| API Docs (Swagger) | http://localhost:8000/docs |
| API Docs (ReDoc) | http://localhost:8000/redoc |

### 3. View Logs

```bash
# All services
docker-compose logs -f

# Backend only
docker-compose logs -f backend

# Nginx access log
docker-compose exec nginx tail -f /var/log/nginx/access.log
```

### 4. Stop Services

```bash
docker-compose down            # Stop containers
docker-compose down -v         # Stop + delete volumes (⚠️ destroys data)
```

---

## 🧪 Running Tests

```bash
# Enter the backend container
docker-compose exec backend bash

# Run all tests
pytest app/tests/ -v

# Run with coverage report
pytest app/tests/ --cov=app --cov-report=html

# Run a specific test file
pytest app/tests/test_auth.py -v

# Run a specific test class
pytest app/tests/test_products.py::TestProductCreate -v
```

Or run locally (without Docker):

```bash
cd backend
python -m venv .venv
source .venv/bin/activate   # Windows: .venv\Scripts\activate
pip install -r requirements.txt
pip install pytest-asyncio pytest-cov

pytest app/tests/ -v
```

---

## 🔐 Default Roles & Permissions

| Role | Products | Inventory | Warehouses | Analytics | Reports | Users | Settings | Audit |
|------|----------|-----------|------------|-----------|---------|-------|----------|-------|
| **ADMIN** | ✅ CRUD | ✅ All | ✅ CRUD | ✅ | ✅ | ✅ CRUD | ✅ | ✅ |
| **MANAGER** | ✅ CRUD | ✅ All | ✅ View | ✅ | ✅ | ❌ | ❌ | ❌ |
| **STAFF** | 👁 Read | ✅ In/Out | ❌ | ❌ | ❌ | ❌ | ❌ | ❌ |
| **VIEWER** | 👁 Read | 👁 Read | ❌ | ❌ | 👁 Read | ❌ | ❌ | ❌ |

---

## 🌐 API Reference

All endpoints follow the pattern: `http://localhost/api/{resource}`

### Auth
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/auth/login` | Login with email + password |
| POST | `/api/auth/register` | Register new user |
| POST | `/api/auth/refresh` | Refresh access token |
| POST | `/api/auth/logout` | Logout (blacklist token) |
| POST | `/api/auth/forgot-password` | Send reset email |
| POST | `/api/auth/reset-password` | Reset with token |

### Products
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/products` | List (search, filter, paginate) |
| POST | `/api/products` | Create with auto-SKU + barcode |
| GET | `/api/products/{id}` | Get single product |
| PUT | `/api/products/{id}` | Update product |
| DELETE | `/api/products/{id}` | Delete product |

### Inventory
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/inventory/inward` | Receive stock |
| POST | `/api/inventory/outward` | Ship/consume stock |
| POST | `/api/inventory/transfer` | Transfer between warehouses |
| GET | `/api/inventory/history` | Transaction history |
| GET | `/api/inventory/low-stock` | Products below min stock |

### Reports (streamed binary downloads)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/reports/pdf?type=sales` | PDF report |
| GET | `/api/reports/excel?type=inventory` | Excel report |
| GET | `/api/reports/csv?type=warehouse` | CSV report |

### WebSockets
| Channel | URL | Description |
|---------|-----|-------------|
| Inventory | `ws://localhost/ws/inventory` | Stock update events |
| Dashboard | `ws://localhost/ws/dashboard` | Live stats updates |
| Notifications | `ws://localhost/ws/notifications?token=<jwt>` | Personal push notifications |

---

## 📋 Frontend QA Checklist

- [x] Dark / light theme toggle — persists across sessions via `localStorage`
- [x] Token refresh happens silently on 401 — user stays logged in
- [x] Toast notifications on every create / update / delete
- [x] `usePermissions()` hides action buttons for unauthorised roles
- [x] WebSocket reconnects on disconnect
- [x] `Unauthorized.jsx` shown when wrong-role user accesses a guarded route
- [x] Pagination on all tables (products, users, transactions, notifications)
- [x] Search + debounce (300 ms) on all listing pages
- [x] Loading state on every async fetch (no blank screens)
- [ ] **TODO:** Mobile responsive sidebar (hamburger menu < 768px)
- [ ] **TODO:** Loading skeleton components on initial fetch

---

## 🔧 Environment Variables Reference

### Backend (`backend/.env`)

| Variable | Default | Description |
|----------|---------|-------------|
| `MONGODB_URL` | mongodb://... | MongoDB connection string |
| `DATABASE_NAME` | erp_db | MongoDB database name |
| `REDIS_URL` | redis://... | Redis connection string |
| `SECRET_KEY` | — | JWT signing key (min 32 chars) |
| `ALGORITHM` | HS256 | JWT algorithm |
| `ACCESS_TOKEN_EXPIRE_MINUTES` | 30 | Access token TTL |
| `REFRESH_TOKEN_EXPIRE_DAYS` | 7 | Refresh token TTL |
| `SMTP_HOST` | smtp.gmail.com | Email server host |
| `SMTP_USER` | — | Email sender address |
| `SMTP_PASSWORD` | — | Email app password |
| `EMAILS_ENABLED` | false | Enable email notifications |

### Frontend (`frontend/.env`)

| Variable | Default | Description |
|----------|---------|-------------|
| `VITE_API_URL` | http://localhost:8000 | Backend base URL |
| `VITE_WS_URL` | ws://localhost:8000 | WebSocket base URL |
| `VITE_APP_NAME` | Smart Inventory ERP | Application title |

---

## 📄 License

MIT — see `LICENSE` for details.  



Made with ❤️ by Aditya Tiwari | github.com/Aditya-9753 

