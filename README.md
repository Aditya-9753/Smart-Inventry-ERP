<div align="center">

<img src="frontend/public/favicon.svg" alt="Smart Inventory ERP" width="90" height="90" />

# Smart Inventory ERP

### Enterprise-ready inventory management platform built with FastAPI, React, Redis, and Docker.

Designed for real-time stock tracking, warehouse operations, analytics, and scalable deployment.

![FastAPI](https://img.shields.io/badge/FastAPI-0.115-009688?style=for-the-badge&logo=fastapi&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![MongoDB](https://img.shields.io/badge/MongoDB-7.0-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![Redis](https://img.shields.io/badge/Redis-7.2-DC382D?style=for-the-badge&logo=redis&logoColor=white)
![Docker](https://img.shields.io/badge/Docker-Compose-2496ED?style=for-the-badge&logo=docker&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-yellow?style=for-the-badge)

Live Demo — Coming Soon

</div>

---

# 💡 Problem Statement

Traditional inventory systems often lack real-time stock visibility, scalable backend architecture, and proper role-based access control.

Smart Inventory ERP solves this by providing:

- Real-time inventory tracking
- Warehouse-level stock management
- Secure JWT authentication
- Real-time notifications
- Analytics and reporting dashboard
- Scalable Dockerized architecture

---

# 📸 Screenshots

<div align="center">

| Dashboard | Inventory | Analytics |
|:-:|:-:|:-:|
| ![](docs/screenshots/dashboard.png) | ![](docs/screenshots/inventory.png) | ![](docs/screenshots/analytics.png) |

</div>

---

# 🏛️ System Architecture

```text
Frontend (React + Vite)
        │
        ▼
Nginx Reverse Proxy
        │
        ▼
FastAPI Backend
   │        │
   ▼        ▼
MongoDB   Redis
   │
   ▼
WebSocket + APScheduler
```

---

# ✨ Key Features

## 📦 Inventory Management

- Stock inward, outward, and warehouse transfer
- Auto-generated SKU, Barcode, and QR codes
- Real-time low-stock alerts
- Inventory transaction history
- Atomic stock validation system

---

## 🔐 Authentication & Security

- JWT authentication with refresh tokens
- Redis token blacklist
- Role-based access control (RBAC)
- Protected frontend routes and APIs
- Password reset via email token

---

## 📊 Analytics & Reporting

- Inventory trend analytics
- Fast-moving and dead-stock detection
- PDF, Excel, and CSV report exports
- User activity tracking
- Warehouse-level reporting

---

## 🌐 Real-Time System

- WebSocket-based live updates
- Real-time notifications
- Dashboard auto-refresh
- Auto-reconnect support

---

## ⚙️ Infrastructure & DevOps

- Dockerized multi-service architecture
- Nginx reverse proxy
- APScheduler background jobs
- Environment-based configuration
- Async FastAPI backend
- Redis-backed session handling

---

# 🏆 Project Highlights

- Built scalable FastAPI backend using async architecture
- Implemented Redis-based JWT blacklist authentication
- Designed real-time inventory updates using WebSockets
- Dockerized complete development environment
- Added RBAC authorization with protected frontend routes
- Generated PDF/Excel reports dynamically
- Integrated APScheduler for automation jobs
- Structured modular backend architecture

---

# 🏗️ Tech Stack

| Layer | Technology |
|------|-------------|
| Backend | FastAPI · Python 3.11 · Beanie ODM |
| Frontend | React 19 · Vite · Redux Toolkit |
| Database | MongoDB |
| Cache | Redis |
| Authentication | JWT · Redis Blacklist |
| Real-time | WebSockets |
| Styling | Tailwind CSS · Radix UI |
| Charts | Recharts |
| Reports | ReportLab · openpyxl |
| Scheduler | APScheduler |
| Containerization | Docker Compose |
| Reverse Proxy | Nginx |
| Testing | pytest · pytest-asyncio |

---

# 📁 Project Structure

```text
smart-inventory-erp/
│
├── backend/
│   ├── app/
│   │   ├── auth/
│   │   ├── users/
│   │   ├── products/
│   │   ├── inventory/
│   │   ├── warehouses/
│   │   ├── dashboard/
│   │   ├── analytics/
│   │   ├── reports/
│   │   ├── websocket/
│   │   ├── notifications/
│   │   ├── middleware/
│   │   ├── core/
│   │   └── tests/
│   │
│   ├── requirements.txt
│   └── Dockerfile
│
├── frontend/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── redux/
│   │   ├── hooks/
│   │   ├── services/
│   │   └── layouts/
│   │
│   ├── package.json
│   └── Dockerfile
│
├── nginx/
├── docker-compose.yml
└── README.md
```

---

# 🚀 Getting Started

## Prerequisites

- Docker Desktop
- Git

---

## 1️⃣ Clone Repository

```bash
git clone https://github.com/Aditya-9753/smart-inventory-erp.git
cd smart-inventory-erp
```

---

## 2️⃣ Configure Environment Variables

```bash
cp backend/.env.example backend/.env
cp frontend/.env.example frontend/.env
```

Update backend `.env`:

```env
SECRET_KEY=your-secret-key
MONGODB_URL=mongodb://mongo:27017
REDIS_URL=redis://redis:6379
EMAILS_ENABLED=false
```

---

## 3️⃣ Start Application

```bash
docker-compose up --build
```

---

## 4️⃣ Access Application

| Service | URL |
|------|------|
| Frontend | http://localhost |
| Backend API | http://localhost:8000 |
| Swagger Docs | http://localhost:8000/docs |
| ReDoc | http://localhost:8000/redoc |

---

# 🔐 Roles & Permissions

| Role | Access |
|------|---------|
| ADMIN | Full system access |
| MANAGER | Inventory + Analytics |
| STAFF | Inventory operations |
| VIEWER | Read-only access |

---

# 🌐 API Reference

## Authentication

| Method | Endpoint |
|------|------------|
| POST | `/auth/register` |
| POST | `/auth/login` |
| POST | `/auth/refresh` |
| POST | `/auth/logout` |

---

## Products

| Method | Endpoint |
|------|------------|
| GET | `/products` |
| POST | `/products` |
| PUT | `/products/{id}` |
| DELETE | `/products/{id}` |

---

## Inventory

| Method | Endpoint |
|------|------------|
| POST | `/inventory/inward` |
| POST | `/inventory/outward` |
| POST | `/inventory/transfer` |
| GET | `/inventory/history` |
| GET | `/inventory/low-stock` |

---

## Analytics

| Method | Endpoint |
|------|------------|
| GET | `/analytics/trends` |
| GET | `/analytics/fast-moving` |
| GET | `/analytics/dead-stock` |

---

# 🧪 Running Tests

```bash
docker-compose exec backend bash
pytest app/tests/ -v
```

Coverage:

```bash
pytest app/tests/ --cov=app --cov-report=html
```

---

# 🔧 Environment Variables

## Backend

| Variable | Description |
|------|-------------|
| MONGODB_URL | MongoDB connection |
| REDIS_URL | Redis connection |
| SECRET_KEY | JWT secret |
| ACCESS_TOKEN_EXPIRE_MINUTES | Access token expiry |
| REFRESH_TOKEN_EXPIRE_DAYS | Refresh token expiry |

---

## Frontend

| Variable | Description |
|------|-------------|
| VITE_API_URL | Backend API URL |
| VITE_WS_URL | WebSocket URL |

---

# 📌 Why This Project Stands Out

Unlike basic CRUD inventory systems, this project focuses on:

- Real-time communication
- Scalable async backend architecture
- Enterprise-grade authentication
- Background task automation
- Production deployment practices
- Clean modular architecture
- Redis session management
- Dockerized infrastructure

---

# 🚀 Future Improvements

- Multi-tenant warehouse support
- AI-based demand forecasting
- SMS & Email alert integration
- Kubernetes deployment
- CI/CD pipeline integration
- Cloud deployment support

---

# 🤝 Contributing

```bash
git checkout -b feature/new-feature
git commit -m "feat: add new feature"
git push origin feature/new-feature
```

Open a Pull Request 🚀

---

# 📄 License

Distributed under the MIT License.

---

<div align="center">

Made with ❤️ by **Aditya Tiwari**

GitHub: https://github.com/Aditya-9753

</div>